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
        System.out.println("ADAPTER_TRACER=PASS; CASES=2");
    }
}
