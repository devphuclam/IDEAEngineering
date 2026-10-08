package com.idea.ddm.project;

import com.idea.ddm.access.AuthorizationDecisionService;
import com.idea.ddm.iam.IamWebConfiguration;
import com.idea.ddm.identity.*;
import java.time.Clock;
import java.util.UUID;
import javax.sql.DataSource;
import org.springframework.context.annotation.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/** Sole HTTP adapter for the approved UI-P operation catalogue. Ordinary F03 session/CSRF. */
@RestController
@IamWebConfiguration.Boundary
public final class ProjectGovernanceController {
    private final ProjectGovernanceAdministration owner;
    private final SessionService sessions;
    private final ProjectParticipationAdministration participation;
    ProjectGovernanceController(ProjectGovernanceAdministration owner,ProjectParticipationAdministration participation,SessionService sessions){this.owner=owner;this.participation=participation;this.sessions=sessions;}
    record Create(UUID operationId,UUID organizationId,String name,String reason){}
    record Update(UUID operationId,AuthorizationDecisionService.Scope scope,String name,long expectedVersion,String reason){}
    record NewGroup(UUID operationId,AuthorizationDecisionService.Scope scope,String name,long expectedProjectVersion,String reason){}
    record NewProjectMember(UUID operationId,AuthorizationDecisionService.Scope scope,UUID targetActorId,long expectedProjectVersion,ProjectParticipationAdministration.Interval interval,String reason){}
    record NewGroupMember(UUID operationId,AuthorizationDecisionService.Scope scope,UUID targetActorId,long expectedGroupVersion,ProjectParticipationAdministration.Interval interval,String reason){}
    record End(UUID operationId,AuthorizationDecisionService.Scope scope,long expectedVersion,String reason){}
    @PostMapping("/api/v1/administration/projects")
    ResponseEntity<?> create(Authentication auth,@RequestBody Create request){return safe(201,owner.create(context(auth),request.operationId(),request.organizationId(),request.name(),request.reason()));}
    @GetMapping("/api/v1/administration/projects/{id}")
    ResponseEntity<?> project(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId){return safe(200,owner.project(context(auth),organizationId,id,false));}
    @GetMapping("/api/v1/projects/{id}")
    ResponseEntity<?> participant(Authentication auth,@PathVariable UUID id){var project=owner.project(context(auth),null,id,true);return safe(200,java.util.Map.of("projectId",project.projectId(),"name",project.name()));}
    @GetMapping("/api/v1/administration/projects")
    ResponseEntity<?> projects(Authentication auth,@RequestParam(required=false)UUID organizationId,@RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,owner.projects(context(auth),organizationId,filter,offset,limit));}
    @PostMapping("/api/v1/administration/projects/{id}/update")
    ResponseEntity<?> update(Authentication auth,@PathVariable UUID id,@RequestBody Update r){return safe(200,owner.rename(context(auth),r.operationId(),r.scope(),id,false,r.name(),r.expectedVersion(),r.reason()));}
    @GetMapping("/api/v1/administration/projects/{id}/members")
    ResponseEntity<?> members(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId,@RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,owner.members(context(auth),organizationId,id,false,filter,offset,limit));}
    @PostMapping("/api/v1/administration/projects/{id}/members")
    ResponseEntity<?> join(Authentication auth,@PathVariable UUID id,@RequestBody NewProjectMember r){return safe(201,participation.join(context(auth),r.operationId(),r.scope(),id,r.targetActorId(),false,r.expectedProjectVersion(),r.interval(),r.reason()));}
    @PostMapping("/api/v1/administration/project-memberships/{id}/end")
    ResponseEntity<?> end(Authentication auth,@PathVariable UUID id,@RequestBody End r){return safe(200,participation.end(context(auth),r.operationId(),r.scope(),id,false,r.expectedVersion(),r.reason()));}
    @GetMapping("/api/v1/administration/projects/{id}/groups")
    ResponseEntity<?> groups(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId,@RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,owner.groups(context(auth),organizationId,id,filter,offset,limit));}
    @GetMapping("/api/v1/administration/groups/{id}")
    ResponseEntity<?> group(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId){return safe(200,owner.group(context(auth),organizationId,id));}
    @PostMapping("/api/v1/administration/projects/{id}/groups")
    ResponseEntity<?> createGroup(Authentication auth,@PathVariable UUID id,@RequestBody NewGroup r){return safe(201,owner.createGroup(context(auth),r.operationId(),r.scope(),id,r.name(),r.expectedProjectVersion(),r.reason()));}
    @PostMapping("/api/v1/administration/groups/{id}/update")
    ResponseEntity<?> updateGroup(Authentication auth,@PathVariable UUID id,@RequestBody Update r){return safe(200,owner.rename(context(auth),r.operationId(),r.scope(),id,true,r.name(),r.expectedVersion(),r.reason()));}
    @GetMapping("/api/v1/administration/groups/{id}/members")
    ResponseEntity<?> groupMembers(Authentication auth,@PathVariable UUID id,@RequestParam(required=false)UUID organizationId,@RequestParam(defaultValue="")String filter,@RequestParam(defaultValue="0")int offset,@RequestParam(defaultValue="50")int limit){return safe(200,owner.members(context(auth),organizationId,id,true,filter,offset,limit));}
    @PostMapping("/api/v1/administration/groups/{id}/members")
    ResponseEntity<?> joinGroup(Authentication auth,@PathVariable UUID id,@RequestBody NewGroupMember r){return safe(201,participation.join(context(auth),r.operationId(),r.scope(),id,r.targetActorId(),true,r.expectedGroupVersion(),r.interval(),r.reason()));}
    @PostMapping("/api/v1/administration/group-memberships/{id}/end")
    ResponseEntity<?> endGroup(Authentication auth,@PathVariable UUID id,@RequestBody End r){return safe(200,participation.end(context(auth),r.operationId(),r.scope(),id,true,r.expectedVersion(),r.reason()));}
    private ActorContext context(Authentication auth){
        try{return sessions.currentContext(auth);}
        catch(org.springframework.security.core.AuthenticationException refused){throw new IamWebConfiguration.Refusal(IamWebConfiguration.RefusalReason.INELIGIBLE_SESSION);}
    }
    static ResponseEntity<?> safe(int status,Object value){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(value);}
    @Configuration(proxyBeanMethods=false)
    static class Wiring{
        @Bean ProjectGovernanceAdministration projects(DataSource source,IdentityTransactions transactions,OwnerSessionEligibility eligibility,
                AuthorizationDecisionService authorization,ProjectGovernanceQueries queries,Clock clock){return new ProjectGovernanceAdministration(source,transactions,eligibility,authorization,queries,clock);}
        @Bean ProjectParticipationAdministration participation(ProjectGovernanceAdministration owner){return new ProjectParticipationAdministration(owner);}
    }
}
