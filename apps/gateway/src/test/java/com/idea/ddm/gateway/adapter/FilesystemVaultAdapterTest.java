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
        System.out.println("ADAPTER_TRACER=PASS; CASES=8");
    }
    @FunctionalInterface interface Checked {void run() throws Exception;}
    private static void refuse(Checked action) throws Exception {
        try{action.run();throw new AssertionError("Expected fail-closed Adapter refusal");}
        catch(IOException expected) { }
    }
}
