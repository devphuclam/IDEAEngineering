package com.idea.ddm.identity;

import com.idea.ddm.access.SuperSuccessorAdoptionService;
import java.time.Clock;
import java.util.Arrays;
import java.util.UUID;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

/** Explicit operator-only transition. No controller, startup hook, bootstrap call or password argument. */
public final class SuperSuccessorAdoptionCommand {
    private SuperSuccessorAdoptionCommand() {}
    public static void main(String[] args) {
        var console=System.console();
        if(args.length!=1 || !"--adopt".equals(args[0]) || console==null){
            System.err.println("Interactive --adopt operator console required; no transition attempted.");System.exit(2);return;
        }
        char[] password=null;
        try {
            String authorization=required("IDEA_ADOPTION_OPERATOR_AUTHORIZATION");
            String source=required("IDEA_ADOPTION_SOURCE_SHA");
            if(!source.matches("[0-9a-f]{40}") || authorization.length()>200 || authorization.codePoints().anyMatch(Character::isISOControl))throw new IllegalArgumentException();
            String database=required("IDEA_DATABASE_NAME");
            if(!"idea_ddm_app".equals(required("IDEA_DATABASE_APP_USER")))throw new IllegalArgumentException();
            UUID org=UUID.fromString(console.readLine("Exact Organization UUID: "));
            UUID actor=UUID.fromString(console.readLine("Same originating Actor UUID: "));
            UUID login=UUID.fromString(console.readLine("Exact native Login Identity UUID: "));
            UUID old=UUID.fromString(console.readLine("Current Super@1 assignment UUID: "));
            long version=Long.parseLong(console.readLine("Expected account security version: "));
            String reason=console.readLine("Reason: ");
            UUID operation=UUID.fromString(console.readLine("Operation UUID: "));
            console.printf("Authorization=%s; Source=%s; Database=%s%nActor=%s; Organization=%s; old assignment=%s; new role=Super@2; security version=%s%nOld assignment and bootstrap marker remain unchanged. No account permissions are implicit.%n",
                    authorization,source,database,actor,org,old,version);
            if(!"ADOPT".equals(console.readLine("Confirm this exact transition by typing ADOPT: ")))return;
            password=console.readPassword("Existing native password (not echoed): ");
            String url="jdbc:postgresql://"+required("IDEA_DATABASE_HOST")+":"+required("IDEA_DATABASE_PORT")+"/"+database;
            String schema=System.getenv("IDEA_ADOPTION_TEST_SCHEMA");
            if(schema!=null){
                if(!"idea_ddm_iam_ui_20261007_46".equals(database) || !schema.matches("iam_ui_[0-9a-f]{32}"))throw new IllegalArgumentException();
                url+="?currentSchema="+schema;
            }
            var dataSource=new DriverManagerDataSource(url,"idea_ddm_app",required("IDEA_DATABASE_APP_PASSWORD"));
            try(var c=dataSource.getConnection();var q=c.createStatement();var row=q.executeQuery("SELECT current_user,current_database()")){
                if(!row.next() || !"idea_ddm_app".equals(row.getString(1)) || !database.equals(row.getString(2)))throw new IllegalArgumentException();
            }
            var result=new SuperSuccessorAdoptionService(dataSource,Clock.systemUTC()).adopt(
                    new SuperSuccessorAdoptionService.Request(operation,org,actor,login,old,version,reason),password);
            console.printf("ADOPTION_STATE=%s; AssignmentId=%s; ActorId=%s; OrganizationId=%s%n",result.state(),result.assignmentId(),result.actorId(),result.organizationId());
        } catch(Exception ignored){System.err.println("Local successor adoption refused or unavailable; no success reported. Resolve the exact operation before retry.");System.exit(1);}
        finally{if(password!=null)Arrays.fill(password,'\0');}
    }
    private static String required(String name){var value=System.getenv(name);if(value==null || value.isBlank())throw new IllegalArgumentException();return value;}
}
