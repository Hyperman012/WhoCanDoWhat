## Who Can Do What?

This permissions screen was built years ago by a capable engineer who needed answers quickly and delivered exactly that. Over time, more rules were added: new roles, environment-specific policies, and a handful of edge cases introduced to satisfy real incidents. The original author has since moved on, but the screen remains — relied upon daily to answer one question: **who can do what, right now?** The behavior is correct, but not obvious, and confidence in making changes has steadily eroded. You’ve been asked to extend the system while ensuring nothing breaks for the people who already depend on it.

---

## Current system behavior

The UI displays **effective permissions** based on the following inputs:

- **Role**: `Admin`, `Support`
- **Environment**: `staging`, `prod`
- **MFA**: enabled / disabled
- **Show help**: toggles help text in the UI

The system currently supports these permissions:

- `users.read` — Read Users
- `billing.refund` — Refund
- `users.impersonate` — Impersonate

### Access rules

- **Admin**
    - Read Users: Allowed
    - Refund: Allowed
    - Impersonate: Allowed

- **Support**
    - Read Users: Allowed
    - Refund: Denied (support policy)
    - Impersonate: Denied (support policy)

- **Production policy**
    - In `prod`, `billing.refund` is blocked unless MFA is enabled.

- **Legacy rule**
    - If Impersonate is allowed, Refund is not allowed.

The UI output is the source of truth.

---

## New feature request

Add support for a new permission:

- `reports.export` — Export Reports

Rules:
- **Admin**: Allowed in all environments
- **Support**:
  - Allowed in `staging`
  - Denied in `prod` (support policy)

The new permission must appear in the UI with the same structure and behavior as existing permissions.

---

## Constraints

- Preserve existing behavior.
- Treat the code as production code.
- Assume real users depend on the current behavior.
- Take the time required.