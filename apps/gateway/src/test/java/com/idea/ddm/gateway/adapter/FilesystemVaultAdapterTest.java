package com.idea.ddm.gateway.adapter;

import java.io.*;
import java.nio.file.*;
import java.util.*;

/** JDK-only real Adapter tracer; no fake filesystem or Gateway/Receipt success inference. */
public class FilesystemVaultAdapterTest {
    public static void main(String[] args) throws Exception {
        if(args.length!=1)throw new IllegalArgumentException("Owned root required");
        Path root=Path.of(args[0]);
        var adapter=new FilesystemVaultAdapter(root);
        byte[] bytes=new byte[1024];
        var transfer=UUID.randomUUID();var location=UUID.randomUUID();
        var result=adapter.store(transfer,location,1024,
                "5f70bf18a086007016e948b04aed3b82103a36bea41755b6cddfaf10ace3c6ef",new ByteArrayInputStream(bytes));
        if(!result.transferId().equals(transfer)||!result.locationId().equals(location)||result.byteCount()!=1024)
            throw new AssertionError("Exact completed identity/size");
        try(var input=adapter.read(result)) {
            if(!Arrays.equals(bytes,input.readAllBytes()))throw new AssertionError("Completed bytes differ");
        }
        if(!adapter.store(transfer,location,1024,result.digest(),new ByteArrayInputStream(bytes)).equals(result))
            throw new AssertionError("Retry changed completed identity");
        byte[] changed=bytes.clone();changed[0]=1;
        try {
            adapter.store(transfer,location,1024,result.digest(),new ByteArrayInputStream(changed));
            throw new AssertionError("CHANGED_RETRY_FALSE_SUCCESS");
        }catch(IOException expected) { /* Refusal must not rewrite the original bytes. */ }
        try(var input=adapter.read(result)) {
            if(!Arrays.equals(bytes,input.readAllBytes()))throw new AssertionError("Retry rewrote immutable bytes");
        }
        // Size/digest refusal must never make a completed object readable.
        UUID shortId=UUID.randomUUID(),shortLocation=UUID.randomUUID();
        refuse(()->adapter.store(shortId,shortLocation,1024,result.digest(),new ByteArrayInputStream(new byte[1023])));
        refuse(()->adapter.read(new FilesystemVaultAdapter.Completed(shortId,shortLocation,1024,result.digest())));
        refuse(()->adapter.store(UUID.randomUUID(),UUID.randomUUID(),1024,result.digest(),new ByteArrayInputStream(new byte[1025])));
        UUID wrongId=UUID.randomUUID(),wrongLocation=UUID.randomUUID();
        refuse(()->adapter.store(wrongId,wrongLocation,1024,result.digest(),new ByteArrayInputStream(changed)));
        refuse(()->adapter.read(new FilesystemVaultAdapter.Completed(wrongId,wrongLocation,1024,result.digest())));
        UUID interrupted=UUID.randomUUID(),interruptedLocation=UUID.randomUUID();
        refuse(()->adapter.store(interrupted,interruptedLocation,1024,result.digest(),new InputStream(){
            boolean first=true;
            @Override public int read() throws IOException {throw new IOException("SYNTHETIC_INTERRUPTION");}
            @Override public int read(byte[] b,int off,int len) throws IOException {
                if(!first)throw new IOException("SYNTHETIC_INTERRUPTION");first=false;
                Arrays.fill(b,off,off+128,(byte)0);return 128;
            }
        }));
        refuse(()->adapter.read(new FilesystemVaultAdapter.Completed(interrupted,interruptedLocation,1024,result.digest())));
        try(var files=Files.list(root.resolve("staging"))) {
            if(files.findAny().isPresent())throw new AssertionError("Failure left staging/lock residue");
        }
        // Typed identity prevents traversal; reject noncanonical and symlinked configured paths.
        refuse(()->new FilesystemVaultAdapter(root.resolve("objects/../")));
        Path outside=Files.createDirectory(root.getParent().resolve("outside-test"));
        Path link=root.getParent().resolve("vault-link");Files.createSymbolicLink(link,outside);
        refuse(()->new FilesystemVaultAdapter(link));
        Path badRoot=Files.createDirectory(root.getParent().resolve("symlink-directory-test"));
        Files.createSymbolicLink(badRoot.resolve("staging"),outside);
        refuse(()->new FilesystemVaultAdapter(badRoot));
        refuse(()->adapter.store(new UUID(0,0),UUID.randomUUID(),1024,result.digest(),new ByteArrayInputStream(bytes)));
        var rangedTransfer=UUID.randomUUID();var rangedLocation=UUID.randomUUID();
        String chunkDigest="076a27c79e5ace2a3d47f9dd2e83e4ff6ea8872b3c2218f66c92b89b55f36560";
        var first=adapter.storeRange(rangedTransfer,rangedLocation,1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(new byte[512]));
        if(first.verifiedBytes()!=512||first.completed()!=null)throw new AssertionError("Partial range became completion");
        var restarted=new FilesystemVaultAdapter(root);
        if(!restarted.storeRange(rangedTransfer,rangedLocation,1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(new byte[512])).equals(first))
            throw new AssertionError("Lost-response range retry changed progress");
        byte[] changedChunk=new byte[512];changedChunk[0]=1;
        refuse(()->restarted.storeRange(rangedTransfer,rangedLocation,1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(changedChunk)));
        var last=restarted.storeRange(rangedTransfer,rangedLocation,1024,result.digest(),512,1024,chunkDigest,new ByteArrayInputStream(new byte[512]));
        if(last.verifiedBytes()!=1024||last.completed()==null)throw new AssertionError("Full coverage not verified");
        try(var input=restarted.read(last.completed())){if(!Arrays.equals(bytes,input.readAllBytes()))throw new AssertionError("Resumed bytes differ");}
        // Exact candidate binding and contiguous progress survive refused retries.
        refuse(()->restarted.storeRange(rangedTransfer,UUID.randomUUID(),1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(new byte[512])));
        refuse(()->restarted.storeRange(rangedTransfer,rangedLocation,1024,result.digest(),0,513,chunkDigest,new ByteArrayInputStream(new byte[513])));
        UUID partial=UUID.randomUUID(),partialLocation=UUID.randomUUID();
        refuse(()->adapter.storeRange(partial,partialLocation,1024,result.digest(),512,1024,chunkDigest,new ByteArrayInputStream(new byte[512])));
        adapter.storeRange(partial,partialLocation,1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(new byte[512]));
        refuse(()->adapter.storeRange(partial,partialLocation,1024,result.digest(),512,1024,chunkDigest,new InputStream(){
            @Override public int read() throws IOException {throw new IOException("SYNTHETIC_RANGE_INTERRUPTION");}
        }));
        if(adapter.storeRange(partial,partialLocation,1024,result.digest(),0,512,chunkDigest,new ByteArrayInputStream(new byte[512])).verifiedBytes()!=512)
            throw new AssertionError("Interrupted range advanced progress");
        if(adapter.storeRange(partial,partialLocation,1024,result.digest(),512,1024,chunkDigest,new ByteArrayInputStream(new byte[512])).completed()==null)
            throw new AssertionError("Interrupted candidate cannot resume");
        UUID mismatch=UUID.randomUUID(),mismatchLocation=UUID.randomUUID();String wrongFull="0".repeat(64);
        refuse(()->adapter.storeRange(mismatch,mismatchLocation,512,wrongFull,0,512,chunkDigest,new ByteArrayInputStream(new byte[512])));
        refuse(()->adapter.read(new FilesystemVaultAdapter.Completed(mismatch,mismatchLocation,512,wrongFull)));
        // Hold a real request inside streaming input; another Adapter must not overwrite its lock.
        UUID busy=UUID.randomUUID(),busyLocation=UUID.randomUUID();
        var entered=new java.util.concurrent.CountDownLatch(1);var release=new java.util.concurrent.CountDownLatch(1);
        try(var executor=java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()){
            var writer=executor.submit(()->adapter.storeRange(busy,busyLocation,512,chunkDigest,0,512,chunkDigest,new ByteArrayInputStream(new byte[512]){
                boolean held;
                @Override public synchronized int read(byte[] b,int off,int len){
                    if(!held){held=true;entered.countDown();try{if(!release.await(10,java.util.concurrent.TimeUnit.SECONDS))throw new AssertionError("Concurrency barrier timeout");}
                        catch(InterruptedException error){Thread.currentThread().interrupt();throw new AssertionError(error);}}
                    return super.read(b,off,len);
                }
            }));
            try{
                if(!entered.await(10,java.util.concurrent.TimeUnit.SECONDS))throw new AssertionError("Writer not entered");
                refuse(()->restarted.storeRange(busy,busyLocation,512,chunkDigest,0,512,chunkDigest,new ByteArrayInputStream(new byte[512])));
            }finally{release.countDown();}
            if(writer.get(10,java.util.concurrent.TimeUnit.SECONDS).completed()==null)throw new AssertionError("Concurrent writer lost completion");
        }
        System.out.println("ADAPTER_TRACER=PASS; CASES=13");
    }
    @FunctionalInterface interface Checked {void run() throws Exception;}
    private static void refuse(Checked action) throws Exception {
        try{action.run();throw new AssertionError("Expected fail-closed Adapter refusal");}
        catch(IOException expected) { }
    }
}
