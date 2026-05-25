# Security Specification for Karina Love

This document maps out the system data invariants, the "Dirty Dozen" theoretical payloads, and the structural test requirements to establish a zero-trust architecture for the **Karina Love** Firebase Firestore environment.

## 1. Data Invariants

- **Multi-tenant Isolation**: A user belongs to one and only one couple (`casalId`), and they are strictly forbidden from reading or writing resources belonging to any other couple.
- **Role Control**: Only the authenticated user matching `/usuarios/{usuarioId}` can instantiate or update their own profile details.
- **Value Constraints**: XP, level thresholds, and prices cannot contain negative integers or shadow fields.
- **Temporal Guardrails**: Creation and modification times rely on `request.time` (server times), rather than trusting client-provided values.

## 2. The "Dirty Dozen" Payloads (Exploit Scenarios)

The following malicious payloads must be blocked, resulting in `PERMISSION_DENIED`:

1. **Identity Spoofing - Impersonating User Profiles**
   - Attempting to write a profile under `/casais/couple1/usuarios/malicious-user-id` with `request.auth.uid = "other-user-id"`.
2. **Shadow Field Injection - Unauthorized Privileges**
   - Attempting to overwrite an account with additional secret attributes (e.g., `isAdmin: true` or `verifiedOverride: true`).
3. **Cross-Tenant Read Leak - Querying Sibling Data**
   - Authenticated user in `couple1` attempt to fetch tasks, rewards, or rituals inside `/casais/couple2/tasks`.
4. **Value Poisoning - Negative XP Value Inflation**
   - Attempting to configure a task or award with negative XP parameters (e.g., `xp: -100000` or `custoXP: -50`).
5. **Denial of Wallet Task ID Poisoning**
   - Injecting high-overhead, 2KB strings into `{taskId}` parameters in single-document transactions.
6. **Bypassing Action Schema Validation**
   - Modifying fields outside permissible update windows (e.g., altering `proponenteId` once a trade has been started).
7. **Temporal Fraud - Forged Timestamp**
   - Providing client-generated future timestamps (`2030-01-01T00:00:00Z`) to override daily streak controls.
8. **Orphaned Writes - Subcollection Placement without Couple Registry**
   - Attempting to list or write a task under `/casais/unregistered_couple/tasks/task1` when `unregistered_couple` doesn't exist.
9. **Role Self-Escalation**
   - Bypassing profile configuration schema by self-assigning multiple roles (e.g., `"papel": "admin"`) where only `"ela" | "ele"` are permitted.
10. **Terminal State Manipulation**
    - Transitioning a completed trade proposal from status `"aceita"` back to `"pendente"`.
11. **PII Isolation Infraction**
    - Public listing queries containing internal registration records without appropriate ownership constraints.
12. **Malicious Empty Fields**
    - Submitting payload with zero-size names to trigger downstream interface styling crashes.

## 3. Test Directives & Assertions

All interaction rules are evaluated to confirm absolute safety against the above exploits. Any payload violating these core invariants results in swift rejection by the Firestore virtual safety layers.
