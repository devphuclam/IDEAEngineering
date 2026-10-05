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
        System.out.println("ADAPTER_TRACER=PASS; CASES=1");
    }
}
