# Authentication for the MVP: Build vs. Mature Framework/Provider Boundary

Date: 2026-08-27  
Scope: Username/password authentication, MFA, sessions, recovery, compromise response, and maintenance responsibility.  
Sources: Current official NIST Digital Identity Guidelines and OWASP Cheat Sheet Series only.

## Conclusion

IDEA Engineering should **not implement authentication primitives from scratch**. It should define a provider-neutral authentication boundary and use a mature, actively maintained authentication framework or provider behind it. This does not require a public-cloud identity service: a locally hosted username/password capability is still possible, provided password verification, authenticator lifecycle, MFA, session management, and recovery are supplied by a maintained framework rather than bespoke IDEA cryptographic or token code.

This is a design recommendation inferred from the evidence below, not a selection of a technology or vendor.

## Evidence

### Credential storage is a continuing security capability

NIST SP 800-63B-4 requires centrally verified passwords to be sent through an authenticated protected channel, checked against common/compromised-password blocklists, rate-limited against guessing, and stored as salted, costed hashes resistant to offline attack. The stored verifier should retain the algorithm and cost information so it can migrate, and the cost should increase as computing capability changes. NIST also rejects routine composition rules and periodic password changes without evidence of compromise. ([NIST SP 800-63B-4, Password Verifiers](https://pages.nist.gov/800-63-4/sp800-63b/authenticators/#password-verifiers))

OWASP likewise requires adaptive password hashing rather than plaintext, reversible encryption, or fast general-purpose hashes. It notes that widely used libraries commonly manage salts correctly and that work factors need measurement and upgrades over time. ([OWASP Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html))

Therefore, a one-time correct hash implementation is insufficient: ownership includes parameter tuning, hash migration, breached-password data, throttling, secure secret handling, and future algorithm changes.

### Passwords require an authenticator lifecycle, not just a login form

NIST states that passwords are not phishing-resistant. At AAL2 it requires two distinct factors and at least one available phishing-resistant option; the applicable assurance level must first be selected by risk assessment. NIST also requires records of bound authenticators and lifecycle events, secure binding/replacement, prompt invalidation after loss or compromise, and subscriber notifications for relevant account events. ([NIST SP 800-63B-4, Authentication Assurance Levels](https://pages.nist.gov/800-63-4/sp800-63b/aal/), [Authenticator Event Management](https://pages.nist.gov/800-63-4/sp800-63b/events/))

OWASP recommends MFA broadly and specifically for privileged users, while emphasizing that MFA reset and factor replacement are takeover paths that require reauthentication, notification, and a risk-appropriate recovery process. It also notes that an external MFA service creates dependency risk and therefore still requires due diligence. ([OWASP Multifactor Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multifactor_Authentication_Cheat_Sheet.html))

### Session management has security-critical state and failure modes

NIST requires random session secrets established after authentication, protected transport, logout invalidation, enforced lifetime limits, secure cookie attributes, CSRF protection, and periodic reauthentication. A relying application remains authoritative for whether reauthentication requirements have been met even when an external identity provider is involved. ([NIST SP 800-63B-4, Session Management](https://pages.nist.gov/800-63-4/sp800-63b/session/))

OWASP describes session fixation, prediction, theft, timeout, rotation, and invalidation hazards and explicitly recommends a framework's built-in session implementation over a home-made one. It also warns that a framework must be kept current, securely configured, and tested rather than trusted by default. ([OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html))

### Recovery is an authentication path with comparable risk

NIST treats recovery as controlled replacement of lost authenticators: supported recovery methods must be risk-analyzed, recovery codes must be protected and throttled, recovery must bind replacement authenticators, and every recovery causes notification. Compromised authenticators must be promptly suspended, invalidated, or destroyed. ([NIST SP 800-63B-4, Account Recovery](https://pages.nist.gov/800-63-4/sp800-63b/events/#account-recovery), [Loss, Theft, Damage, and Compromise](https://pages.nist.gov/800-63-4/sp800-63b/events/#loss-theft-damage-and-compromise))

OWASP requires non-enumerating and timing-consistent reset responses, rate limiting, cryptographically random single-use expiring tokens, notification after reset, and session invalidation. It identifies password recovery as a common vulnerability source. ([OWASP Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html))

## Recommended responsibility boundary

### IDEA product code may own

- A stable internal `UserId` and mapping from an authenticated subject to the Operating Organization.
- Organization membership, product roles, versioned authorization policies, least-privilege decisions, and fail-closed cross-organization isolation.
- Product-specific decisions about which operations require recent or stronger authentication, such as administration, approval, or release.
- Localized user experience, invitation/provisioning orchestration, audit requirements, security event consumption, and support workflows.
- A provider adapter contract that carries stable subject identity, authentication time and assurance/factor information where available, provisioning/deprovisioning, logout/revocation hooks, and capability discovery.
- Threat models, acceptance tests, secure configuration, dependency monitoring, incident procedures, and evidence that the selected implementation meets IDEA requirements.

### A mature maintained framework/provider should own

- Password hashing, salting, parameter versioning, verification, rehash migration, blocklist checks, and login throttling primitives.
- Authenticator registration, secret/key protection, MFA verification, recovery-code handling, factor replacement, and revocation primitives.
- Cryptographically secure reset-token generation and validation, expiry, single use, and protected recovery flows.
- Session-secret generation, rotation, cookie/token protection, timeout enforcement, logout invalidation, and protocol validation.
- Standards/protocol parsing and cryptographic implementation.

IDEA must not make domain authorization depend directly on a vendor's role names, claims layout, or user identifiers. The boundary should permit a future provider change without rewriting controlled product data or authorization policy. Conversely, using a framework/provider does not transfer accountability: IDEA still has to patch it promptly, review security advisories and configuration changes, test integration behavior, protect signing and recovery secrets, monitor abuse, and execute compromise response.

## Decision implication for Q66

The safe interpretation of “build username/password authentication” is:

- **Acceptable:** IDEA offers locally managed username/password accounts through a mature maintained framework behind a replaceable authentication boundary.
- **Not acceptable:** IDEA invents password hashing, session tokens, MFA, or recovery protocols and maintains them as bespoke product logic.

DOC-02 should compare qualifying framework/provider options after requirements are baselined; the Product Decision Authority can then select one with recorded rationale. No concrete stack or vendor is selected by this note.

## Limitations and open decisions

- NIST SP 800-63B-4 is US federal guidance. It is high-quality normative security evidence, but applying it does not by itself establish ISO/IEC conformity or certification.
- No licensed ISO text, customer security policy, regulation, procurement requirement, or production threat assessment was reviewed. Public ISO scope information alone would not resolve the implementation choice.
- IDEA's target authentication assurance level, mandatory MFA population, recovery channels, session timeouts, identity-proofing requirement, availability target, and incident-response service level remain undecided.
- This note did not evaluate implementation quality, licensing, offline behavior, deployment support, or maintenance history of any specific framework/provider.
- Synthetic-data MVP scope reduces data exposure but does not eliminate account takeover, privilege escalation, or cross-organization isolation risk.
