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
    private final Path root, staging, objects;
    public FilesystemVaultAdapter(Path root) throws IOException {
        this.root=root.toAbsolutePath().normalize();
        if(!this.root.equals(root.toAbsolutePath()) || !this.root.toRealPath().equals(this.root)
                || !Files.isDirectory(this.root,LinkOption.NOFOLLOW_LINKS))throw new IOException("UNSAFE_VAULT_ROOT");
        staging=directory("staging");objects=directory("objects");
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
        throw new UnsupportedOperationException("RANGE_RESUME_NOT_IMPLEMENTED");
    }
    private Path directory(String name) throws IOException {
        Path path=root.resolve(name);
        if(!Files.exists(path,LinkOption.NOFOLLOW_LINKS))Files.createDirectory(path,
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rwx------")));
        if(!path.toRealPath().equals(path)||!Files.isDirectory(path,LinkOption.NOFOLLOW_LINKS))throw new IOException("UNSAFE_VAULT_DIRECTORY");
        return path;
    }
    private void checkRoots() throws IOException {
        for(Path path:java.util.List.of(root,staging,objects))
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
