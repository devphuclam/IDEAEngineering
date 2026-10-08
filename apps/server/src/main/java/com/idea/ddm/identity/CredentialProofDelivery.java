package com.idea.ddm.identity;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.UUID;

/** Manual reissue only. Supersession and new proof share the required IAM outcome/Audit transaction. */
final class CredentialProofDelivery {
    enum Purpose { FIRST_SETUP, RESET }
    static void supersede(Connection c,Purpose purpose,UUID account,UUID login,UUID operation,Instant now)throws SQLException{
        String table=purpose==Purpose.FIRST_SETUP?"credential_setup_proof":"credential_reset_proof";
        try(var q=c.prepareStatement("UPDATE "+table+" SET superseded_at=?,superseded_operation_id=? "
                +"WHERE account_id=? AND login_identity_id=? AND consumed_at IS NULL AND superseded_at IS NULL")){
            q.setTimestamp(1,Timestamp.from(now));q.setObject(2,operation);q.setObject(3,account);q.setObject(4,login);q.executeUpdate();
        }
    }
    private CredentialProofDelivery(){}
}
