/** Ordinary same-origin Server session only. No browser-authored Actor, Organization or grant. */
export type SessionView = { actorId: string; accountId: string };
export type IamResult<T> =
  | { kind: "confirmed"; value: T }
  | { kind: "refused"; status: number }
  | { kind: "stale" }
  | { kind: "unavailable" }
  | { kind: "unresolved" };
export type FetchBoundary = (path: string, init: RequestInit) => Promise<Response>;
export type AdministrationContext = SessionView & { organizationId: string; displayName: string; organizationName: string; actions: string[] };
export type LoginIdentityView = { loginIdentityId: string; normalizedLogin: string; credentialState: "ESTABLISHED" | "NOT_ESTABLISHED" };
export type AccountView = SessionView & { organizationId: string; displayName: string; status: "PENDING" | "ACTIVE" | "DISABLED"; securityVersion: number; loginIdentities: LoginIdentityView[] };
export type AccountPage = { items: AccountView[]; offset: number; limit: number; hasMore: boolean };
export type AccountChange = SessionView & { status: AccountView["status"]; securityVersion: number; loginIdentityId?: string };
export type ProofPurpose = "FIRST_SETUP" | "RESET";
export type PrivateProof = { proof: string; expiresAt: string };
export const projectActions = ["project.create", "project.admin.read", "project.update", "project.membership.assign", "project.membership.remove", "project.group.create", "project.group.update", "project.group.membership.assign", "project.group.membership.remove"] as const;
export type ProjectScope = { kind: "PROJECT"; organizationId: string; projectId: string };
export type ProjectView = { projectId: string; organizationId: string; name: string; version: number; actions: string[] };
export type GroupView = { groupId: string; projectId: string; organizationId: string; name: string; version: number; parentVersion: number };
export type BoundedPage<T> = { items: T[]; offset: number; limit: number; hasMore: boolean };
export type ParticipationView = { membershipId: string; projectId: string; groupId: string | null; organizationId: string; targetActorId: string; displayName: string; effectiveFrom: string; effectiveUntil: string | null; endedAt: string | null; version: number; parentVersion: number; eligible: boolean };
export type ParticipationPage = BoundedPage<ParticipationView> & { parentVersion: number; eligibleTargets: BoundedPage<{ actorId: string; displayName: string }> };
export type ProjectCommand = { operationId: string; scope: ProjectScope; reason: string };
export type ParticipationInterval = { effectiveFrom?: string | null; effectiveUntil?: string | null };
export const assignmentActions=["role.catalogue.read","access.inspect","role.assignment.manage.business","role.assignment.manage.administration","role.assignment.manage.highest"] as const;
export type AssignmentScope={kind:"ORGANIZATION";organizationId:string;projectId?:null}|ProjectScope;
export type AssignmentPrincipal={kind:"ACTOR";actorId:string;groupId?:null}|{kind:"PROJECT_GROUP";groupId:string;actorId?:null};
export type PermissionView={code:string;owner:string;scopeKinds:string[];principalKinds:string[];participantMembershipRequired:boolean;implementationState:"IMPLEMENTED"|"DESIGN"};
export type RoleView={definitionId:string;roleVersionId:string;roleCode:string;version:number;displayName:string;builtIn:boolean;classification:"HIGHEST"|"ADMINISTRATION"|"BUSINESS";scopeKinds:string[];principalKinds:string[];contentDigest:string;permissions:PermissionView[];selectable:boolean;availabilityReason:string|null;managementScope:AssignmentScope|null};
export type AssignmentView={assignmentId:string;principal:AssignmentPrincipal;scope:AssignmentScope;roleVersionId:string;roleCode:string;roleVersion:number;effectiveFrom:string;effectiveUntil:string|null;assignedBy:string;reason:string;assignedAt:string;revokedAt:string|null;endedBy:string|null;endReason:string|null;version:number;effective:boolean};
export type AssignmentPreview={allowed:boolean;role:RoleView;principal:AssignmentPrincipal;scope:AssignmentScope;interval:ParticipationInterval|null;before:AssignmentView|null;consequences:string[];refusalReason:string|null};
export type AssignmentProposal={principal:AssignmentPrincipal;scope:AssignmentScope;roleVersionId:string;interval?:ParticipationInterval;assignmentId?:string;expectedVersion?:number};
export type AssignmentGrant=AssignmentProposal&{operationId:string;reason:string};
export const customRoleActions=["role.definition.prepare","role.definition.activate"] as const;
export const customRoleCeiling=["project.read","role.catalogue.read","access.inspect","audit.read"] as const;
export type RoleSupport={scopeKinds:string[];principalKinds:string[]};
export type PermissionDifference={added:string[];removed:string[];unchanged:string[]};
export type RoleCandidate={candidateId:string;definitionId:string;roleCode:string;displayName:string;managementScope:AssignmentScope;baseVersionId:string|null;proposedRoleVersion:number;classification:"BUSINESS"|"ADMINISTRATION";support:RoleSupport;permissionCodes:string[];contentDigest:string;version:number;state:"CANDIDATE"|"ACTIVATED";activatedVersionId:string|null;difference:PermissionDifference};
export type RoleProposal={operationId:string;scope:AssignmentScope;definitionId?:string;name?:string;baseVersionId?:string|null;permissionCodes:string[];support:RoleSupport;reason:string};
export type RoleValidation={valid:true;candidate:RoleCandidate;difference:PermissionDifference;consequences:string[]};
export type RoleActivation={operationId:string;scope:AssignmentScope;expectedVersion:number;baseVersionId:string|null;reason:string};

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const requestOptions = { credentials: "same-origin", cache: "no-store", redirect: "error" } as const;

function refused<T>(status: number): IamResult<T> {
  if ([400, 401, 403, 404].includes(status)) return { kind: "refused", status };
  if (status === 409) return { kind: "stale" };
  return { kind: "unavailable" };
}

function mutationRefusal<T>(status: number): IamResult<T> {
  if ([400, 401, 403, 404, 409].includes(status)) return refused(status);
  // A missing/unexpected response is not proof of rollback or permission to resubmit.
  return { kind: "unresolved" };
}

function sessionView(value: unknown): SessionView {
  if (typeof value !== "object" || value === null) throw new Error("Invalid session response");
  const data = value as Record<string, unknown>;
  if (typeof data.actorId !== "string" || !uuid.test(data.actorId) ||
      typeof data.accountId !== "string" || !uuid.test(data.accountId)) throw new Error("Invalid session response");
  // Copy only the accepted redacted fields; unknown response content cannot enter UI state.
  return { actorId: data.actorId, accountId: data.accountId };
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid response");
  return value as Record<string, unknown>;
}
function identifier(value: unknown): string { if (typeof value !== "string" || !uuid.test(value)) throw new Error("Invalid identity"); return value; }
function text(value: unknown, max = 200): string { if (typeof value !== "string" || !value.trim() || value.length > max || /[\x00-\x1f\x7f]/.test(value)) throw new Error("Invalid text"); return value; }
function version(value: unknown): number { if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) throw new Error("Invalid version"); return value; }
function status(value: unknown): AccountView["status"] { if (value !== "PENDING" && value !== "ACTIVE" && value !== "DISABLED") throw new Error("Invalid state"); return value; }
function accountChange(value: unknown): AccountChange {
  const data = object(value);
  return { ...sessionView(data), status: status(data.status), securityVersion: version(data.securityVersion),
    ...(data.loginIdentityId === undefined ? {} : { loginIdentityId: identifier(data.loginIdentityId) }) };
}
function accountView(value: unknown): AccountView {
  const data = object(value); if (!Array.isArray(data.loginIdentities)) throw new Error("Invalid logins");
  const logins = data.loginIdentities.map(value => {
    const login = object(value);
    if (login.credentialState !== "ESTABLISHED" && login.credentialState !== "NOT_ESTABLISHED") throw new Error("Invalid credential state");
    return { loginIdentityId: identifier(login.loginIdentityId), normalizedLogin: text(login.normalizedLogin, 254), credentialState: login.credentialState } as LoginIdentityView;
  });
  return { ...sessionView(data), organizationId: identifier(data.organizationId), displayName: text(data.displayName),
    status: status(data.status), securityVersion: version(data.securityVersion), loginIdentities: logins };
}
function boundedPage<T>(value: unknown, decode: (value: unknown) => T): BoundedPage<T> {
  const data = object(value);
  if (!Array.isArray(data.items) || data.items.length > 100 || typeof data.offset !== "number" || !Number.isSafeInteger(data.offset) || data.offset < 0 ||
      typeof data.limit !== "number" || !Number.isSafeInteger(data.limit) || data.limit < 1 || data.limit > 100 || data.items.length > data.limit || typeof data.hasMore !== "boolean") throw new Error("Invalid bounded page");
  return { items: data.items.map(decode), offset: data.offset, limit: data.limit, hasMore: data.hasMore };
}
function projectView(value: unknown): ProjectView {
  const data=object(value);
  if (!Array.isArray(data.actions) || data.actions.some(action => typeof action !== "string" || !(projectActions as readonly string[]).includes(action))) throw new Error("Invalid Project availability");
  return { projectId: identifier(data.projectId), organizationId: identifier(data.organizationId), name: text(data.name), version: version(data.version), actions: [...data.actions] };
}
function groupView(value: unknown): GroupView {
  const data=object(value);return { groupId: identifier(data.groupId), projectId: identifier(data.projectId), organizationId: identifier(data.organizationId), name: text(data.name), version: version(data.version), parentVersion: version(data.parentVersion) };
}
function nullableInstant(value: unknown): string | null {
  if(value===null)return null;
  if(typeof value!=="string" || !Number.isFinite(Date.parse(value)))throw new Error("Invalid period");return value;
}
function participationView(value: unknown): ParticipationView {
  const data=object(value);const from=nullableInstant(data.effectiveFrom);
  if(from===null || typeof data.eligible!=="boolean")throw new Error("Invalid participation");
  return { membershipId: identifier(data.membershipId), projectId: identifier(data.projectId), groupId: data.groupId===null?null:identifier(data.groupId), organizationId: identifier(data.organizationId), targetActorId: identifier(data.targetActorId), displayName: text(data.displayName),
    effectiveFrom: from, effectiveUntil: nullableInstant(data.effectiveUntil), endedAt: nullableInstant(data.endedAt), version: version(data.version), parentVersion: version(data.parentVersion), eligible: data.eligible };
}
function participationPage(value: unknown): ParticipationPage {
  const data=object(value);return { ...boundedPage(value,participationView), parentVersion: version(data.parentVersion), eligibleTargets: boundedPage(data.eligibleTargets,value=>{const target=object(value);return {actorId:identifier(target.actorId),displayName:text(target.displayName)};}) };
}
function choiceList(value:unknown,allowed:string[]):string[]{if(!Array.isArray(value)||!value.length||value.some(v=>typeof v!=="string"||!allowed.includes(v)))throw new Error("Invalid supported profile");return [...value];}
function assignmentScope(value:unknown):AssignmentScope{const d=object(value);if(d.kind==="ORGANIZATION"&&(d.projectId===undefined||d.projectId===null))return {kind:"ORGANIZATION",organizationId:identifier(d.organizationId)};if(d.kind==="PROJECT")return {kind:"PROJECT",organizationId:identifier(d.organizationId),projectId:identifier(d.projectId)};throw new Error("Invalid typed scope");}
function assignmentPrincipal(value:unknown):AssignmentPrincipal{const d=object(value);if(d.kind==="ACTOR"&&(d.groupId===null||d.groupId===undefined))return {kind:"ACTOR",actorId:identifier(d.actorId)};if(d.kind==="PROJECT_GROUP"&&(d.actorId===null||d.actorId===undefined))return {kind:"PROJECT_GROUP",groupId:identifier(d.groupId)};throw new Error("Invalid principal");}
function roleView(value:unknown):RoleView{
  const d=object(value);if(typeof d.builtIn!=="boolean"||typeof d.selectable!=="boolean"||!Array.isArray(d.permissions)||d.permissions.length>100||!["HIGHEST","ADMINISTRATION","BUSINESS"].includes(String(d.classification))||typeof d.contentDigest!=="string"||!/^[0-9a-f]{64}$/.test(d.contentDigest))throw new Error("Invalid exact role");
  const permissions=d.permissions.map(v=>{const p=object(v);if(typeof p.participantMembershipRequired!=="boolean"||!["IMPLEMENTED","DESIGN"].includes(String(p.implementationState)))throw new Error("Invalid Permission");return {code:text(p.code,120),owner:text(p.owner,120),scopeKinds:choiceList(p.scopeKinds,["ORGANIZATION","PROJECT"]),principalKinds:choiceList(p.principalKinds,["ACTOR","PROJECT_GROUP"]),participantMembershipRequired:p.participantMembershipRequired,implementationState:p.implementationState} as PermissionView;});
  if(d.selectable&&permissions.some(p=>p.implementationState!=="IMPLEMENTED"))throw new Error("Unqualified role cannot be selectable");
  return {definitionId:identifier(d.definitionId),roleVersionId:identifier(d.roleVersionId),roleCode:text(d.roleCode,120),version:version(d.version),displayName:text(d.displayName),builtIn:d.builtIn,classification:d.classification as RoleView["classification"],scopeKinds:choiceList(d.scopeKinds,["ORGANIZATION","PROJECT"]),principalKinds:choiceList(d.principalKinds,["ACTOR","PROJECT_GROUP"]),contentDigest:d.contentDigest,permissions,selectable:d.selectable,availabilityReason:d.availabilityReason===null?null:text(d.availabilityReason,120),managementScope:d.managementScope===null?null:assignmentScope(d.managementScope)};
}
function assignmentView(value:unknown):AssignmentView{const d=object(value),from=nullableInstant(d.effectiveFrom),at=nullableInstant(d.assignedAt);if(!from||!at||typeof d.effective!=="boolean")throw new Error("Invalid retained assignment");return {assignmentId:identifier(d.assignmentId),principal:assignmentPrincipal(d.principal),scope:assignmentScope(d.scope),roleVersionId:identifier(d.roleVersionId),roleCode:text(d.roleCode,120),roleVersion:version(d.roleVersion),effectiveFrom:from,effectiveUntil:nullableInstant(d.effectiveUntil),assignedBy:identifier(d.assignedBy),reason:text(d.reason,500),assignedAt:at,revokedAt:nullableInstant(d.revokedAt),endedBy:d.endedBy===null?null:identifier(d.endedBy),endReason:d.endReason===null?null:text(d.endReason,500),version:version(d.version),effective:d.effective};}
function assignmentPreview(value:unknown):AssignmentPreview{const d=object(value);if(typeof d.allowed!=="boolean"||!Array.isArray(d.consequences)||d.consequences.length>20)throw new Error("Invalid delegation preview");let interval:ParticipationInterval|null=null;if(d.interval!==null){const p=object(d.interval);interval={effectiveFrom:nullableInstant(p.effectiveFrom),effectiveUntil:nullableInstant(p.effectiveUntil)};}return {allowed:d.allowed,role:roleView(d.role),principal:assignmentPrincipal(d.principal),scope:assignmentScope(d.scope),interval,before:d.before===null?null:assignmentView(d.before),consequences:d.consequences.map(v=>text(v,500)),refusalReason:d.refusalReason===null?null:text(d.refusalReason,120)};}
function scopeQuery(scope:AssignmentScope):string{const s=assignmentScope(scope);return `organizationId=${s.organizationId}${s.kind==="PROJECT"?`&projectId=${s.projectId}`:""}`;}
function permissionView(value:unknown):PermissionView{const p=object(value);if(typeof p.participantMembershipRequired!=="boolean"||!["IMPLEMENTED","DESIGN"].includes(String(p.implementationState)))throw new Error("Invalid Permission");return {code:text(p.code,120),owner:text(p.owner,120),scopeKinds:choiceList(p.scopeKinds,["ORGANIZATION","PROJECT"]),principalKinds:choiceList(p.principalKinds,["ACTOR","PROJECT_GROUP"]),participantMembershipRequired:p.participantMembershipRequired,implementationState:p.implementationState as PermissionView["implementationState"]};}
function difference(value:unknown):PermissionDifference{const d=object(value);const codes=(v:unknown)=>{if(!Array.isArray(v)||v.length>25)throw new Error("Invalid difference");return v.map(c=>text(c,120));};return {added:codes(d.added),removed:codes(d.removed),unchanged:codes(d.unchanged)};}
function roleCandidate(value:unknown):RoleCandidate{
  const d=object(value);if(!["BUSINESS","ADMINISTRATION"].includes(String(d.classification))||!["CANDIDATE","ACTIVATED"].includes(String(d.state))||typeof d.contentDigest!=="string"||!/^[0-9a-f]{64}$/.test(d.contentDigest))throw new Error("Invalid candidate");
  const support=object(d.support),base=d.baseVersionId===null?null:identifier(d.baseVersionId),active=d.activatedVersionId===null?null:identifier(d.activatedVersionId);
  if((d.state==="CANDIDATE")!==(active===null))throw new Error("Invalid candidate state");
  return {candidateId:identifier(d.candidateId),definitionId:identifier(d.definitionId),roleCode:text(d.roleCode,120),displayName:text(d.displayName),managementScope:assignmentScope(d.managementScope),baseVersionId:base,proposedRoleVersion:version(d.proposedRoleVersion),classification:d.classification as RoleCandidate["classification"],support:{scopeKinds:choiceList(support.scopeKinds,["ORGANIZATION","PROJECT"]),principalKinds:choiceList(support.principalKinds,["ACTOR","PROJECT_GROUP"])},permissionCodes:choiceList(d.permissionCodes,[...customRoleCeiling]),contentDigest:d.contentDigest,version:version(d.version),state:d.state as RoleCandidate["state"],activatedVersionId:active,difference:difference(d.difference)};
}
function roleValidation(value:unknown):RoleValidation{const d=object(value);if(d.valid!==true||!Array.isArray(d.consequences)||d.consequences.length>20)throw new Error("Invalid validation");const candidate=roleCandidate(d.candidate),diff=difference(d.difference);if(JSON.stringify(candidate.difference)!==JSON.stringify(diff))throw new Error("Validation difference mismatch");return {valid:true,candidate,difference:diff,consequences:d.consequences.map(c=>text(c,500))};}

export function createIamClient(fetchBoundary: FetchBoundary = (path, init) => fetch(path, init)) {
  async function currentCsrf(): Promise<{ headerName: "X-CSRF-TOKEN"; token: string }> {
    const response = await fetchBoundary("/api/v1/identity/csrf", {
      ...requestOptions, method: "GET", headers: { Accept: "application/json" },
    });
    if (response.status !== 200) throw new Error("CSRF unavailable");
    const value: unknown = await response.json();
    if (typeof value !== "object" || value === null) throw new Error("Invalid CSRF response");
    const proof = value as Record<string, unknown>;
    if (proof.headerName !== "X-CSRF-TOKEN" || typeof proof.token !== "string" ||
        proof.token.length < 1 || proof.token.length > 8192 || /[\r\n]/.test(proof.token)) throw new Error("Invalid CSRF response");
    return { headerName: "X-CSRF-TOKEN", token: proof.token };
  }
  async function read<T>(path: string, decode: (value: unknown) => T): Promise<IamResult<T>> {
    try {
      const response = await fetchBoundary(path, { ...requestOptions, method: "GET", headers: { Accept: "application/json" } });
      if (response.status !== 200) return refused(response.status);
      return { kind: "confirmed", value: decode(await response.json()) };
    } catch { return { kind: "unavailable" }; }
  }
  async function command<T>(path: string, input: unknown, expected: number, decode: (response: Response) => Promise<T>): Promise<IamResult<T>> {
    let submitted = false;
    let body = "";
    try {
      const csrf = await currentCsrf(); body = JSON.stringify(input); submitted = true;
      const response = await fetchBoundary(path, { ...requestOptions, method: "POST", body,
        headers: { "Content-Type": "application/json", [csrf.headerName]: csrf.token } });
      if (response.status !== expected) return mutationRefusal(response.status);
      return { kind: "confirmed", value: await decode(response) };
    } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
    finally { body = ""; input = undefined; }
  }
  return {
    loadContext(): Promise<IamResult<AdministrationContext>> {
      return read("/api/v1/administration/context", value => {
        const data = object(value);
        const allowed = ["account.read", "account.create", "account.disable", "account.re-enable", "account.credential.setup.issue", "account.credential.reset.issue", ...projectActions,...assignmentActions,...customRoleActions];
        if (!Array.isArray(data.actions) || data.actions.some(action => typeof action !== "string" || !allowed.includes(action))) throw new Error("Invalid action availability");
        return { ...sessionView(data), organizationId: identifier(data.organizationId), displayName: text(data.displayName), organizationName: text(data.organizationName), actions: [...data.actions] };
      });
    },
    loadAccounts(filter = "", offset = 0): Promise<IamResult<AccountPage>> {
      return read(`/api/v1/administration/accounts?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`, value => {
        const data = object(value);
        if (!Array.isArray(data.items) || typeof data.offset !== "number" || !Number.isSafeInteger(data.offset) || data.offset < 0 ||
          typeof data.limit !== "number" || !Number.isSafeInteger(data.limit) || data.limit < 1 || data.limit > 100 || typeof data.hasMore !== "boolean") throw new Error("Invalid page");
        return { items: data.items.map(accountView), offset: data.offset, limit: data.limit, hasMore: data.hasMore };
      });
    },
    loadAccount(accountId: string): Promise<IamResult<AccountView>> { return read(`/api/v1/administration/accounts/${identifier(accountId)}`, accountView); },
    loadRoles(scope:AssignmentScope,offset=0):Promise<IamResult<BoundedPage<RoleView>>>{return read(`/api/v1/administration/roles?${scopeQuery(scope)}&offset=${offset}&limit=50`,v=>boundedPage(v,roleView));},
    loadPermissions(scope:AssignmentScope,offset=0):Promise<IamResult<BoundedPage<PermissionView>>>{return read(`/api/v1/administration/permissions?${scopeQuery(scope)}&offset=${offset}&limit=50`,v=>boundedPage(v,permissionView));},
    prepareRole(input:RoleProposal):Promise<IamResult<RoleCandidate>>{return command("/api/v1/administration/roles/candidates",input,201,async r=>roleCandidate(await r.json()));},
    validateRole(id:string,input:{scope:AssignmentScope;expectedVersion:number}):Promise<IamResult<RoleValidation>>{return command(`/api/v1/administration/roles/candidates/${identifier(id)}/validate`,input,200,async r=>roleValidation(await r.json()));},
    activateRole(id:string,input:RoleActivation):Promise<IamResult<RoleView>>{return command(`/api/v1/administration/roles/candidates/${identifier(id)}/activate`,input,201,async r=>roleView(await r.json()));},
    loadAssignments(scope:AssignmentScope,principal?:AssignmentPrincipal,offset=0):Promise<IamResult<BoundedPage<AssignmentView>>>{const target=principal?assignmentPrincipal(principal):null;return read(`/api/v1/administration/assignments?${scopeQuery(scope)}${target?target.kind==="ACTOR"?`&actorId=${target.actorId}`:`&groupId=${target.groupId}`:""}&offset=${offset}&limit=50`,v=>boundedPage(v,assignmentView));},
    loadAssignment(id:string,scope:AssignmentScope):Promise<IamResult<AssignmentView>>{return read(`/api/v1/administration/assignments/${identifier(id)}?${scopeQuery(scope)}`,assignmentView);},
    previewAssignment(input:AssignmentProposal):Promise<IamResult<AssignmentPreview>>{return command("/api/v1/administration/assignments/preview",input,200,async r=>assignmentPreview(await r.json()));},
    grantAssignment(input:AssignmentGrant):Promise<IamResult<AssignmentView>>{return command("/api/v1/administration/assignments",input,201,async r=>assignmentView(await r.json()));},
    endAssignment(id:string,input:{operationId:string;scope:AssignmentScope;expectedVersion:number;reason:string}):Promise<IamResult<AssignmentView>>{return command(`/api/v1/administration/assignments/${identifier(id)}/end`,input,200,async r=>assignmentView(await r.json()));},
    replaceAssignment(id:string,input:{operationId:string;scope:AssignmentScope;expectedVersion:number;newRoleVersionId:string;interval?:ParticipationInterval;reason:string}):Promise<IamResult<{predecessor:AssignmentView;successor:AssignmentView}>>{return command(`/api/v1/administration/assignments/${identifier(id)}/replace`,input,200,async r=>{const d=object(await r.json());return {predecessor:assignmentView(d.predecessor),successor:assignmentView(d.successor)};});},
    loadProjects(filter = "", offset = 0): Promise<IamResult<BoundedPage<ProjectView>>> { return read(`/api/v1/administration/projects?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`,value=>boundedPage(value,projectView)); },
    loadProject(project: string): Promise<IamResult<ProjectView>> { return read(`/api/v1/administration/projects/${identifier(project)}`,projectView); },
    loadGroups(project: string,filter = "",offset = 0): Promise<IamResult<BoundedPage<GroupView>>> { return read(`/api/v1/administration/projects/${identifier(project)}/groups?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`,value=>boundedPage(value,groupView)); },
    loadGroup(group: string): Promise<IamResult<GroupView>> { return read(`/api/v1/administration/groups/${identifier(group)}`,groupView); },
    loadProjectMembers(project: string,filter = "",offset = 0): Promise<IamResult<ParticipationPage>> { return read(`/api/v1/administration/projects/${identifier(project)}/members?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`,participationPage); },
    loadGroupMembers(group: string,filter = "",offset = 0): Promise<IamResult<ParticipationPage>> { return read(`/api/v1/administration/groups/${identifier(group)}/members?filter=${encodeURIComponent(filter)}&offset=${offset}&limit=50`,participationPage); },
    createProject(input: { operationId: string; organizationId: string; name: string; reason: string }): Promise<IamResult<ProjectView>> { return command("/api/v1/administration/projects",input,201,async r=>projectView(await r.json())); },
    renameProject(project: string,input: ProjectCommand & { name: string; expectedVersion: number }): Promise<IamResult<ProjectView>> { return command(`/api/v1/administration/projects/${identifier(project)}/update`,input,200,async r=>projectView(await r.json())); },
    createGroup(project: string,input: ProjectCommand & { name: string; expectedProjectVersion: number }): Promise<IamResult<GroupView>> { return command(`/api/v1/administration/projects/${identifier(project)}/groups`,input,201,async r=>groupView(await r.json())); },
    renameGroup(group: string,input: ProjectCommand & { name: string; expectedVersion: number }): Promise<IamResult<GroupView>> { return command(`/api/v1/administration/groups/${identifier(group)}/update`,input,200,async r=>groupView(await r.json())); },
    joinProject(project: string,input: ProjectCommand & { targetActorId: string; expectedProjectVersion: number; interval?: ParticipationInterval }): Promise<IamResult<ParticipationView>> { return command(`/api/v1/administration/projects/${identifier(project)}/members`,input,201,async r=>participationView(await r.json())); },
    joinGroup(group: string,input: ProjectCommand & { targetActorId: string; expectedGroupVersion: number; interval?: ParticipationInterval }): Promise<IamResult<ParticipationView>> { return command(`/api/v1/administration/groups/${identifier(group)}/members`,input,201,async r=>participationView(await r.json())); },
    endProjectMembership(id: string,input: ProjectCommand & { expectedVersion: number }): Promise<IamResult<ParticipationView>> { return command(`/api/v1/administration/project-memberships/${identifier(id)}/end`,input,200,async r=>participationView(await r.json())); },
    endGroupMembership(id: string,input: ProjectCommand & { expectedVersion: number }): Promise<IamResult<ParticipationView>> { return command(`/api/v1/administration/group-memberships/${identifier(id)}/end`,input,200,async r=>participationView(await r.json())); },
    createAccount(input: { operationId: string; organizationId: string; displayName: string; login: string }): Promise<IamResult<AccountChange>> {
      return command("/api/v1/identity/accounts", input, 201, async response => accountChange(await response.json()));
    },
    changeAccount(accountId: string, action: "disable" | "re-enable", input: { operationId: string; organizationId: string; expectedSecurityVersion: number; reason: string }): Promise<IamResult<AccountChange>> {
      return command(`/api/v1/identity/accounts/${identifier(accountId)}/${action}`, input, 200, async response => accountChange(await response.json()));
    },
    issueProof(accountId: string, input: { operationId: string; organizationId: string; loginIdentityId: string; purpose: ProofPurpose; expectedSecurityVersion: number; reason: string }): Promise<IamResult<PrivateProof>> {
      return command(`/api/v1/identity/accounts/${identifier(accountId)}/credential-proofs`, input, 200, async response => {
        if (!response.headers.get("Cache-Control")?.split(",").some(value => value.trim().toLowerCase() === "no-store")) throw new Error("Private delivery caching refused");
        const data = object(await response.json());
        if (typeof data.proof !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(data.proof) || typeof data.expiresAt !== "string" || !Number.isFinite(Date.parse(data.expiresAt))) throw new Error("Invalid proof response");
        return { proof: data.proof, expiresAt: data.expiresAt };
      });
    },
    redeemCredential(input: { operationId: string; accountId: string; purpose: ProofPurpose; proof: string; password: string }): Promise<IamResult<void>> {
      return command("/api/v1/identity/credentials", input, 204, async () => undefined);
    },
    async signOut(): Promise<IamResult<void>> {
      let submitted = false;
      try {
        const csrf = await currentCsrf();
        submitted = true;
        const response = await fetchBoundary("/api/v1/identity/logout", {
          ...requestOptions, method: "POST", headers: { [csrf.headerName]: csrf.token },
        });
        return response.status === 204 ? { kind: "confirmed", value: undefined } : mutationRefusal(response.status);
      } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
    },
    async signIn(login: string, password: string): Promise<IamResult<{ actorId: string }>> {
      let submitted = false;
      try {
        const csrf = await currentCsrf();
        const body = new URLSearchParams({ username: login, password });
        submitted = true;
        const response = await fetchBoundary("/api/v1/identity/login", {
          ...requestOptions, method: "POST", body,
          headers: { "Content-Type": "application/x-www-form-urlencoded", [csrf.headerName]: csrf.token },
        });
        if (response.status !== 200) return mutationRefusal(response.status);
        const value: unknown = await response.json();
        if (typeof value !== "object" || value === null) return { kind: "unresolved" };
        const actorId = (value as Record<string, unknown>).actorId;
        if (typeof actorId !== "string" || !uuid.test(actorId)) return { kind: "unresolved" };
        return { kind: "confirmed", value: { actorId } };
      } catch { return { kind: submitted ? "unresolved" : "unavailable" }; }
      finally { password = ""; }
    },
    async loadSession(): Promise<IamResult<SessionView>> {
      try {
        const response = await fetchBoundary("/api/v1/identity/session", {
          ...requestOptions, method: "GET", headers: { Accept: "application/json" },
        });
        if (response.status !== 200) return refused(response.status);
        return { kind: "confirmed", value: sessionView(await response.json()) };
      } catch { return { kind: "unavailable" }; }
    },
  };
}
