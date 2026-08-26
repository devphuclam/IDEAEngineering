# Development Workspace Template: Platform Findings

Date: 2026-08-10
Scope: Azure DevOps organization boundaries, reusable GitHub Codespaces/dev-container practices, Azure authentication, and implications for a two-person team that may scale.
Sources: Microsoft Learn and GitHub Docs only.

## 1. Azure DevOps Organization is not an Azure tenant or subscription

An **Azure DevOps Organization** is the top-level service boundary a team connects to at `https://dev.azure.com/{organization}`. It holds one or more **projects** and organization-wide users, access levels, permissions, policies, extensions, billing settings, and agent pools. A **project** is the collaboration and data container beneath the organization; it contains work tracking and can contain Git repositories, builds, releases, and pipelines. Repositories are therefore project resources, while Azure Pipelines is the Azure DevOps CI/CD service that builds, tests, and deploys version-controlled code. ([Organization management](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/organization-management?view=azure-devops), [Projects and scaling](https://learn.microsoft.com/en-us/azure/devops/organizations/projects/about-projects?view=azure-devops), [Create an Azure Repos repository](https://learn.microsoft.com/en-us/azure/devops/repos/git/create-new-repo?view=azure-devops), [What is Azure Pipelines?](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops))

User **accounts** are identities granted access to the organization; they are not Azure subscriptions. Each Azure DevOps user receives an access level, while security-group membership and permissions control allowed actions at organization, project, or object scope. An organization connected to **Microsoft Entra ID** authenticates explicitly added tenant members or guests with their work identities and can use centralized identity controls. ([Permissions and security groups](https://learn.microsoft.com/en-us/azure/devops/organizations/security/about-permissions?view=azure-devops), [Access through Microsoft Entra ID](https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/access-with-azure-ad?view=azure-devops))

A **Microsoft Entra tenant** is the identity and access-management directory. A directory can have many Azure subscriptions, but an Azure subscription trusts one tenant at a time. An **Azure subscription** is an Azure resource-management and billing boundary; it can also be linked separately to an Azure DevOps Organization to pay for Azure DevOps services. Linking a subscription for billing does not turn the Azure DevOps Organization into that subscription or grant pipelines access to resources in it. Resource access still requires identities, role assignments, and service connections. ([Define Microsoft Entra tenants](https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/landing-zone/design-area/azure-ad-define), [Azure DevOps billing FAQ](https://learn.microsoft.com/en-us/azure/devops/organizations/billing/billing-faq?view=azure-devops), [Workload identity service connections](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/configure-workload-identity?view=azure-devops))

The resulting relationships are:

```text
Microsoft Entra tenant ── authenticates users ──► Azure DevOps Organization
        ▲                                             │
        │ trusted by                                  └── Project(s)
Azure subscription(s)                                     ├── Azure Repos
        │                                                  ├── Azure Pipelines
        └── may be linked for DevOps billing ─────────────►├── Boards/work items
                                                           └── teams/permissions
```

The tenant connection and subscription billing link are relationships, not containment of Azure DevOps inside an Azure subscription.

## 2. Reusable GitHub Codespaces/dev-container template practices

GitHub supports a repository marked as a **template repository** and specifically documents adding a default `.devcontainer/devcontainer.json` to make that template immediately usable with Codespaces. The dev-container configuration defines the shared tools, runtimes, extensions, ports, and startup behavior. GitHub distinguishes shared **customization** from personal preferences: include only what every contributor needs; keep themes and other personalization in user dotfiles or Settings Sync. ([Codespaces template repositories](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/setting-up-your-repository/setting-up-a-template-repository-for-github-codespaces), [Introduction to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers), [Creating a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository))

For a general-purpose workspace template, the stable reusable layer is therefore the dev-container baseline, documented bootstrap/verification commands, editor tooling needed by everyone, and placeholders for environment-specific configuration. A single default configuration is important because creation through **Use this template** uses `.devcontainer/devcontainer.json` (or root `.devcontainer.json`) without offering a configuration choice. Additional per-stack configurations can exist under `.devcontainer/<name>/devcontainer.json`, but GitHub states that configurations do not inherit from one another. ([Introduction to dev containers](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers))

For large or slow environments, Codespaces **prebuilds** can pre-run image construction and setup through `onCreateCommand` and `updateContentCommand`; GitHub suggests they are likely useful when creation takes more than two minutes. Prebuilds consume Actions and storage resources, so they should be enabled from measured startup cost rather than assumed for every clone. ([About Codespaces prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/about-github-codespaces-prebuilds), [Configuring prebuilds](https://docs.github.com/en/codespaces/prebuilding-your-codespaces/configuring-prebuilds))

GitHub Codespaces is created from a **GitHub repository**. Azure Repos and GitHub Codespaces are separate products. Consequently, a generated project that must use Codespaces needs a GitHub-hosted repository (possibly with Azure Pipelines connected to GitHub); if company policy requires Azure Repos as the only source host, the team must choose a different hosted-development mechanism. Azure Pipelines officially supports GitHub integration, but this hybrid ownership decision must be explicit. ([Creating a codespace for a repository](https://docs.github.com/en/codespaces/developing-in-a-codespace/creating-a-codespace-for-a-repository), [What is Azure Pipelines?](https://learn.microsoft.com/en-us/azure/devops/pipelines/get-started/what-is-azure-pipelines?view=azure-devops))

## 3. Secure Azure authentication

### Developer environments

For interactive development, developers should sign in with their own Microsoft Entra identities through supported developer tooling such as Azure CLI, Azure Developer CLI, Azure PowerShell, or VS Code. Azure Identity libraries can then use that signed-in identity through `DefaultAzureCredential`; permissions remain controlled with Azure RBAC. This avoids sharing one application password between developers and preserves individual auditability. ([Authenticate with developer accounts](https://learn.microsoft.com/en-us/dotnet/azure/sdk/authentication/local-development-dev-accounts), [Managed identity developer guidance](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview-for-developers))

Codespaces secrets are encrypted environment variables stored at personal, repository, or organization scope. Organization secrets can be restricted to selected repositories, and `devcontainer.json` can declare **recommended secret names** so users are prompted to supply values. GitHub explicitly says sensitive information such as access tokens should be supplied as development-environment secrets. ([Codespaces secrets](https://docs.github.com/en/codespaces/managing-codespaces-for-your-organization/managing-development-environment-secrets-for-your-repository-or-organization), [Recommended secrets](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/specifying-recommended-secrets-for-a-repository), [Codespaces security](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces))

### CI/CD and deployed Azure workloads

For GitHub Actions, use **OIDC workload identity federation** so a workflow exchanges a GitHub-issued short-lived token for an Azure token. This removes the need to store a long-lived Azure client secret in GitHub. Trust should be constrained to the expected repository, branch/tag, or protected environment, and the workflow needs only the required `id-token: write` permission plus minimal content permissions. ([GitHub OIDC overview](https://docs.github.com/en/actions/concepts/security/openid-connect), [Configure OIDC in Azure](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-azure), [Azure Login with OIDC](https://learn.microsoft.com/en-us/azure/developer/github/connect-from-azure-openid-connect))

For Azure Pipelines, use an Azure Resource Manager **service connection with workload identity federation** and authorize individual pipelines rather than granting the connection to all pipelines. The federated identity receives Azure RBAC only at the required scope. ([Workload identity service connections](https://learn.microsoft.com/en-us/azure/devops/pipelines/release/configure-workload-identity?view=azure-devops))

For applications running on supported Azure resources, use **managed identities**. Azure manages the identity lifecycle and token acquisition, so the application does not store credentials. Store unavoidable API keys, passwords, certificates, and connection strings in a secret store such as **Azure Key Vault**, separate vaults by application/environment where appropriate, and grant least-privilege access using Azure RBAC and managed identities. ([Managed identities](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview-for-developers), [Secure Azure Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/general/secure-key-vault), [Key Vault and embedded API keys](https://learn.microsoft.com/en-us/azure/key-vault/general/apps-api-keys-secrets))

### Never bake into the template

The repository, dev-container image, setup scripts, committed `.env` files, sample configuration, prebuild layers, or documentation examples must never contain real passwords, personal access tokens, OAuth/access/refresh tokens, service-principal client secrets, private keys or certificates, API keys, database connection strings, storage keys, or Key Vault secret values. The template may declare required secret **names** and documentation, but values belong in Codespaces secrets, CI/CD secret stores, or Key Vault. OIDC/workload identity and managed identities should replace bootstrap secrets wherever supported. ([Codespaces security](https://docs.github.com/en/codespaces/reference/security-in-github-codespaces), [Recommended secrets](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/configuring-dev-containers/specifying-recommended-secrets-for-a-repository), [GitHub OIDC overview](https://docs.github.com/en/actions/concepts/security/openid-connect), [Key Vault basic concepts](https://learn.microsoft.com/en-us/azure/key-vault/general/basic-concepts))

Tenant ID, subscription ID, client ID, organization name, project name, repository name, and resource names are environment-specific identifiers rather than reusable defaults. Even where an identifier is not itself a credential, the template should parameterize it so clones cannot accidentally target the wrong company tenant, subscription, or project.

## 4. Practical implications for a two-person team that may scale

The following are design inferences from the cited platform behavior:

1. **Obtain company boundaries before provisioning.** Record the company-provided Azure DevOps Organization URL, backing Microsoft Entra tenant, allowed source host (GitHub, Azure Repos, or both), Azure subscription(s), and who can create projects, service connections, federated credentials, groups, and Codespaces secrets. An Azure DevOps account alone does not imply Azure subscription access.
2. **Start with one Azure DevOps project unless isolation requires more.** Microsoft states that the automatically created project team is sufficient for small organizations and that one project can scale by adding teams, repositories, branches, agents, and permissions. Add projects for genuine business-unit, policy, or isolation boundaries, not merely one project per person. ([Projects and scaling](https://learn.microsoft.com/en-us/azure/devops/organizations/projects/about-projects?view=azure-devops))
3. **Use named identities and groups from day one.** Give each developer an individual Entra-backed account; grant normal work through project groups and least privilege. As membership grows, Microsoft recommends Entra security groups to streamline management. Keep organization-owner/Project Collection Administrator rights exceptional. ([Add users to a project or team](https://learn.microsoft.com/en-us/azure/devops/organizations/security/add-users-team-project?view=azure-devops), [Permissions and security groups](https://learn.microsoft.com/en-us/azure/devops/organizations/security/about-permissions?view=azure-devops))
4. **Make each generated repository independently reproducible.** Keep a versioned default dev-container configuration and verification command in every generated repository. A repository created from a template is a new repository populated from the template, so maintain a deliberate update path for carrying later baseline changes into existing generated repositories. ([Creating a repository from a template](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template))
5. **Separate human, pipeline, and runtime identities.** Developers authenticate interactively; GitHub Actions or Azure Pipelines use federated workload identities; deployed Azure services use managed identities. Do not reuse a developer account or one shared secret across these boundaries.
6. **Design CI authorization for growth.** Give each deployment environment its own federated trust and least-privilege Azure role scope; protect production environments and require explicit pipeline authorization. This keeps adding contributors from silently widening deployment access.
7. **Measure before enabling prebuilds.** Two developers may not justify the storage/Actions overhead initially. Enable prebuilds when startup measurements or repository complexity show a benefit, then scope secrets and repository access required by the prebuild narrowly.

## Decisions still required from the company

- Is source code required to live in Azure Repos, GitHub, or is a GitHub-plus-Azure-Pipelines hybrid approved?
- Which Microsoft Entra tenant backs the Azure DevOps Organization, and are both developers members or guests?
- Which Azure subscriptions and environments may developers and pipelines access?
- Are Codespaces permitted, who owns/pays for them, and which base images/features are allowed?
- Can the team create workload identity federation/service connections, or must company administrators provision them?
- What conditional-access, network, data-residency, logging, and secret-management policies must the template enforce?

These answers are prerequisites for a secure platform baseline; they do not require choosing an application language, framework, database, or application architecture.
