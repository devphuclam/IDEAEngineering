package com.idea.ddm.gateway.adapter;

import java.io.*;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.*;
import java.util.HexFormat;
import java.util.UUID;

/** Private byte-custody boundary; never accepts a client filesystem path or publishes custody. */
public final class FilesystemVaultAdapter {
    public record Completed(UUID transferId, UUID locationId, long byteCount, String digest) {}
    public record Progress(long verifiedBytes,Completed completed) {}
    private final Path root, staging, objects, ranges;
    public FilesystemVaultAdapter(Path root) throws IOException {
        this.root=root.toAbsolutePath().normalize();
        if(!this.root.equals(root.toAbsolutePath()) || !this.root.toRealPath().equals(this.root)
                || !Files.isDirectory(this.root,LinkOption.NOFOLLOW_LINKS))throw new IOException("UNSAFE_VAULT_ROOT");
        staging=directory("staging");objects=directory("objects");ranges=directory("ranges");
    }
    public Completed store(UUID transferId, UUID locationId, long expectedBytes, String expectedDigest,
            InputStream input) throws IOException {
        var result=new Completed(id(transferId),id(locationId),expectedBytes,digest(expectedDigest));
        if(expectedBytes<0)throw new IOException("INVALID_SIZE");
        checkRoots();
        Path destination=objects.resolve(key(result)),lock=staging.resolve(transferId+".lock");
        // Cross-instance exclusion uses CREATE_NEW, never overwrite an existing lock/result.
        java.nio.channels.SeekableByteChannel acquired;
        try {acquired=Files.newByteChannel(lock,java.util.Set.of(StandardOpenOption.CREATE_NEW,StandardOpenOption.WRITE),
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));}
        catch(FileAlreadyExistsException busy){throw new IOException("TRANSFER_BUSY",busy);}
        try(var ignored=acquired) {
            if(Files.exists(destination,LinkOption.NOFOLLOW_LINKS)){
                verify(destination,result);verifyInput(input,OutputStream.nullOutputStream(),result);return result;
            }
            Path temporary=Files.createTempFile(staging,"candidate-",".part",
                    PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
            try {
                try(var output=Files.newOutputStream(temporary,StandardOpenOption.WRITE,LinkOption.NOFOLLOW_LINKS)) {
                    verifyInput(input,output,result);
                }
                checkRoots();
                if(Files.exists(destination,LinkOption.NOFOLLOW_LINKS))throw new IOException("COMPLETION_CONFLICT");
                Files.move(temporary,destination,StandardCopyOption.ATOMIC_MOVE);
                return result;
            } finally {Files.deleteIfExists(temporary);}
        } finally {Files.deleteIfExists(lock);}
    }
    public InputStream read(Completed completed) throws IOException {
        id(completed.transferId());id(completed.locationId());digest(completed.digest());checkRoots();
        Path file=objects.resolve(key(completed));verify(file,completed);
        return Files.newInputStream(file,LinkOption.NOFOLLOW_LINKS);
    }
    public Progress storeRange(UUID transferId,UUID locationId,long totalBytes,String fullDigest,
            long start,long end,String chunkDigest,InputStream input) throws IOException {
        var completed=new Completed(id(transferId),id(locationId),totalBytes,digest(fullDigest));
        digest(chunkDigest);
        if(totalBytes<=0||start<0||end<=start||end>totalBytes||end-start>1048576)
            throw new IOException("INVALID_RANGE");
        checkRoots();
        Path lock=staging.resolve(transferId+".lock");
        java.nio.channels.SeekableByteChannel acquired;
        try{acquired=Files.newByteChannel(lock,java.util.Set.of(StandardOpenOption.CREATE_NEW,StandardOpenOption.WRITE),
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));}
        catch(FileAlreadyExistsException busy){throw new IOException("TRANSFER_BUSY",busy);}
        try(var ignored=acquired){
            Path candidate=ranges.resolve(transferId.toString());
            if(!Files.exists(candidate,LinkOption.NOFOLLOW_LINKS))Files.createDirectory(candidate,
                    PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
            if(!candidate.toRealPath().equals(candidate)||!Files.isDirectory(candidate,LinkOption.NOFOLLOW_LINKS))
                throw new IOException("UNSAFE_RANGE_DIRECTORY");
            Path binding=candidate.resolve("identity");
            String identity=locationId+"\n"+totalBytes+"\n"+fullDigest+"\n";
            if(Files.exists(binding,LinkOption.NOFOLLOW_LINKS)){
                if(!Files.isRegularFile(binding,LinkOption.NOFOLLOW_LINKS)||Files.size(binding)>256)
                    throw new IOException("RANGE_BINDING_CONFLICT");
                try(var stream=Files.newInputStream(binding,LinkOption.NOFOLLOW_LINKS)){
                    if(!identity.equals(new String(stream.readAllBytes(),java.nio.charset.StandardCharsets.UTF_8)))
                        throw new IOException("RANGE_BINDING_CONFLICT");
                }
            }else{
                Path pending=Files.createTempFile(staging,"binding-",".part",
                        PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
                try{Files.writeString(pending,identity,StandardOpenOption.WRITE,LinkOption.NOFOLLOW_LINKS);
                    Files.move(pending,binding,StandardCopyOption.ATOMIC_MOVE);
                }finally{Files.deleteIfExists(pending);}
            }
            record Chunk(long start,long end,String digest,Path file){}
            var chunks=new java.util.ArrayList<Chunk>();
            try(var entries=Files.list(candidate)){
                for(Path file:entries.toList()){
                    if(file.equals(binding))continue;
                    String name=file.getFileName().toString();
                    if(!name.matches("[0-9]+-[0-9]+-[0-9a-f]{64}\\.chunk"))throw new IOException("INVALID_RANGE_STATE");
                    String[] parts=name.substring(0,name.length()-6).split("-");
                    long from,to;try{from=Long.parseLong(parts[0]);to=Long.parseLong(parts[1]);}
                    catch(NumberFormatException invalid){throw new IOException("INVALID_RANGE_STATE",invalid);}
                    chunks.add(new Chunk(from,to,parts[2],file));
                }
            }
            chunks.sort(java.util.Comparator.comparingLong(Chunk::start));
            long coverage=0;Chunk retry=null;
            for(var chunk:chunks){
                if(chunk.start()!=coverage||chunk.end()<=coverage||chunk.end()>totalBytes||chunk.end()-coverage>1048576)
                    throw new IOException("INVALID_RANGE_STATE");
                verify(chunk.file(),new Completed(transferId,locationId,chunk.end()-chunk.start(),chunk.digest()));
                coverage=chunk.end();
                if(chunk.start()==start&&chunk.end()==end&&chunk.digest().equals(chunkDigest))retry=chunk;
            }
            var expectedChunk=new Completed(transferId,locationId,end-start,chunkDigest);
            if(retry!=null)verifyInput(input,OutputStream.nullOutputStream(),expectedChunk);
            else{
                if(start!=coverage)throw new IOException("RANGE_CONFLICT");
                Path pending=Files.createTempFile(staging,"range-",".part",
                        PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
                Path target=candidate.resolve(start+"-"+end+"-"+chunkDigest+".chunk");
                try{
                    try(var out=Files.newOutputStream(pending,StandardOpenOption.WRITE,LinkOption.NOFOLLOW_LINKS)){
                        verifyInput(input,out,expectedChunk);
                    }
                    checkRoots();Files.move(pending,target,StandardCopyOption.ATOMIC_MOVE);
                }finally{Files.deleteIfExists(pending);}
                chunks.add(new Chunk(start,end,chunkDigest,target));coverage=end;
            }
            if(coverage<totalBytes)return new Progress(coverage,null);
            Path destination=objects.resolve(key(completed));
            if(Files.exists(destination,LinkOption.NOFOLLOW_LINKS)){verify(destination,completed);return new Progress(coverage,completed);}
            Path assembled=Files.createTempFile(staging,"assembled-",".part",
                    PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
            try{
                try(var out=Files.newOutputStream(assembled,StandardOpenOption.WRITE,LinkOption.NOFOLLOW_LINKS)){
                    for(var chunk:chunks)try(var stream=Files.newInputStream(chunk.file(),LinkOption.NOFOLLOW_LINKS)){stream.transferTo(out);}
                }
                verify(assembled,completed);checkRoots();Files.move(assembled,destination,StandardCopyOption.ATOMIC_MOVE);
                return new Progress(coverage,completed);
            }finally{Files.deleteIfExists(assembled);}
        }finally{Files.deleteIfExists(lock);}
    }
    private Path directory(String name) throws IOException {
        Path path=root.resolve(name);
        if(!Files.exists(path,LinkOption.NOFOLLOW_LINKS))Files.createDirectory(path,
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
        if(!path.toRealPath().equals(path)||!Files.isDirectory(path,LinkOption.NOFOLLOW_LINKS))throw new IOException("UNSAFE_VAULT_DIRECTORY");
        return path;
    }
    private void checkRoots() throws IOException {
        for(Path path:java.util.List.of(root,staging,objects,ranges))
            if(!path.toRealPath().equals(path)||!Files.isDirectory(path,LinkOption.NOFOLLOW_LINKS))throw new IOException("UNSAFE_VAULT_DIRECTORY");
    }
    private static String key(Completed c){return c.transferId()+"-"+c.locationId()+".blob";}
    private static UUID id(UUID id) throws IOException {
        if(id==null||id.equals(new UUID(0,0)))throw new IOException("INVALID_IDENTITY");return id;
    }
    private static String digest(String digest) throws IOException {
        if(digest==null||!digest.matches("[0-9a-f]{64}"))throw new IOException("INVALID_DIGEST");return digest;
    }
    private static MessageDigest sha() {
        try{return MessageDigest.getInstance("SHA-256");}catch(NoSuchAlgorithmException impossible){throw new AssertionError(impossible);}
    }
    private static void verify(Path file,Completed expected) throws IOException {
        if(!Files.isRegularFile(file,LinkOption.NOFOLLOW_LINKS)||Files.size(file)!=expected.byteCount())throw new IOException("COMPLETION_CONFLICT");
        var hash=sha();try(var input=Files.newInputStream(file,LinkOption.NOFOLLOW_LINKS)) {
            byte[] buffer=new byte[65536];int read;while((read=input.read(buffer))!=-1)hash.update(buffer,0,read);
        }
        if(!HexFormat.of().formatHex(hash.digest()).equals(expected.digest()))throw new IOException("COMPLETION_CONFLICT");
    }
    private static void verifyInput(InputStream input,OutputStream output,Completed expected) throws IOException {
        var hash=sha();long count=0;byte[] buffer=new byte[65536];
        while(count<expected.byteCount()) {
            int read=input.read(buffer,0,(int)Math.min(buffer.length,expected.byteCount()-count));
            if(read<0)throw new IOException("SIZE_MISMATCH");
            if(read==0)continue;
            output.write(buffer,0,read);hash.update(buffer,0,read);count+=read;
        }
        if(input.read()!=-1)throw new IOException("SIZE_MISMATCH");
        if(!HexFormat.of().formatHex(hash.digest()).equals(expected.digest()))throw new IOException("DIGEST_MISMATCH");
    }
}
