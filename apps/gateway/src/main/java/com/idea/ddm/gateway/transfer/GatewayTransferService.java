package com.idea.ddm.gateway.transfer;

import com.idea.ddm.gateway.adapter.FilesystemVaultAdapter;
import com.idea.ddm.gateway.security.TransferGrantVerifier;
import com.idea.ddm.gateway.receipt.TransferReceiptSigner;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.UUID;
import java.nio.file.*;
import java.nio.file.attribute.PosixFilePermissions;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Map;
import com.idea.ddm.gateway.security.GatewayEnvelope;

/** Private candidate orchestration, never authoritative Server custody. */
public final class GatewayTransferService {
    public record Result(long verifiedBytes,byte[] receipt){
        public Result{receipt=receipt==null?null:receipt.clone();}
        @Override public byte[] receipt(){return receipt==null?null:receipt.clone();}
        @Override public String toString(){return "GatewayResult[redacted]";}
    }
    private final TransferGrantVerifier verifier;private final TransferReceiptSigner signer;
    private final FilesystemVaultAdapter adapter;private final UUID vaultId;private final Path state;
    public GatewayTransferService(TransferGrantVerifier verifier,TransferReceiptSigner signer,
            FilesystemVaultAdapter adapter,UUID vaultId,Path state) throws IOException {
        this.verifier=java.util.Objects.requireNonNull(verifier);this.signer=java.util.Objects.requireNonNull(signer);
        this.adapter=java.util.Objects.requireNonNull(adapter);this.vaultId=java.util.Objects.requireNonNull(vaultId);this.state=state.toAbsolutePath();
        checkState();Files.setPosixFilePermissions(this.state,PosixFilePermissions.fromString("rwx------"));
    }
    public Result upload(byte[] grant,long start,long end,String chunkDigest,InputStream input) throws Exception {
        var verified=verifier.verify(grant,start,end);
        return locked(verified,()->{
            UUID location=allocation(verified);long size=GatewayEnvelope.longValue(verified.get(15));
            var progress=adapter.storeRange(id(verified.get(7)),location,size,java.util.HexFormat.of().formatHex(verified.get(16)),start,end,chunkDigest,input);
            return result(verified,progress);
        });
    }
    public Result status(byte[] grant) throws Exception {
        var verified=verifier.verify(grant);
        return locked(verified,()->{
            UUID location=allocation(verified);
            return result(verified,adapter.progress(id(verified.get(7)),location,GatewayEnvelope.longValue(verified.get(15)),java.util.HexFormat.of().formatHex(verified.get(16))));
        });
    }
    private Result result(Map<Integer,byte[]> verified,FilesystemVaultAdapter.Progress progress) throws Exception {
        if(progress.completed()==null)return new Result(progress.verifiedBytes(),null);
        Path path=state.resolve(id(verified.get(7))+"."+id(verified.get(5))+".receipt");byte[] receipt;
        if(Files.exists(path,LinkOption.NOFOLLOW_LINKS)){
            if(!Files.isRegularFile(path,LinkOption.NOFOLLOW_LINKS)||Files.size(path)>4096)throw new IOException("INVALID_RECEIPT_STATE");
            try(var stream=Files.newInputStream(path,LinkOption.NOFOLLOW_LINKS)){receipt=stream.readNBytes(4097);}
        }else{
            receipt=signer.sign(verified,progress.completed(),vaultId,UUID.randomUUID());writeAtomic(path,receipt);
        }
        return new Result(progress.verifiedBytes(),receipt);
    }
    private UUID allocation(Map<Integer,byte[]> verified) throws IOException {
        Path file=state.resolve(id(verified.get(7))+".binding");
        var binding=new StringBuilder(vaultId.toString()).append('\n');
        for(int tag=1;tag<=19;tag++)if(tag!=5)binding.append(tag).append(':').append(java.util.HexFormat.of().formatHex(verified.get(tag))).append('\n');
        if(Files.exists(file,LinkOption.NOFOLLOW_LINKS)){
            if(!Files.isRegularFile(file,LinkOption.NOFOLLOW_LINKS)||Files.size(file)>8192)throw new IOException("INVALID_ALLOCATION_STATE");
            String value;try(var stream=Files.newInputStream(file,LinkOption.NOFOLLOW_LINKS)){value=new String(stream.readNBytes(8193),java.nio.charset.StandardCharsets.UTF_8);}
            int newline=value.indexOf('\n');if(newline<0||!value.substring(newline+1).equals(binding.toString()))throw new SecurityException("TRANSFER_SCOPE_CONFLICT");
            try{return UUID.fromString(value.substring(0,newline));}catch(IllegalArgumentException invalid){throw new IOException("INVALID_ALLOCATION_STATE",invalid);}
        }
        UUID location=UUID.randomUUID();writeAtomic(file,(location+"\n"+binding).getBytes(java.nio.charset.StandardCharsets.UTF_8));return location;
    }
    private void writeAtomic(Path target,byte[] bytes) throws IOException {
        Path pending=Files.createTempFile(state,"pending-",".part",PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));
        try{Files.write(pending,bytes,StandardOpenOption.WRITE,LinkOption.NOFOLLOW_LINKS);checkState();Files.move(pending,target,StandardCopyOption.ATOMIC_MOVE);}
        finally{Files.deleteIfExists(pending);}
    }
    @FunctionalInterface private interface Work{Result execute() throws Exception;}
    private Result locked(Map<Integer,byte[]> verified,Work work) throws Exception {
        checkState();Path lock=state.resolve(id(verified.get(7))+".lock");
        java.nio.channels.SeekableByteChannel acquired;
        try{acquired=Files.newByteChannel(lock,java.util.Set.of(StandardOpenOption.CREATE_NEW,StandardOpenOption.WRITE),
                PosixFilePermissions.asFileAttribute(PosixFilePermissions.fromString("rw-------")));}
        catch(FileAlreadyExistsException busy){throw new IOException("TRANSFER_BUSY",busy);}
        try(var ignored=acquired){return work.execute();}finally{Files.deleteIfExists(lock);}
    }
    private void checkState() throws IOException {
        if(!state.normalize().equals(state)||!state.toRealPath().equals(state)||!Files.isDirectory(state,LinkOption.NOFOLLOW_LINKS))
            throw new IOException("UNSAFE_GATEWAY_STATE_ROOT");
    }
    private static UUID id(byte[] bytes){var b=ByteBuffer.wrap(bytes);return new UUID(b.getLong(),b.getLong());}
}
