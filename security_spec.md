# Security Specification for EcoTech Dom Joaquim

## Data Invariants
1. A ClassTeam must have a unique ID and be linked to the teacher who created it.
2. A ResidueEntry must link to a valid ClassTeam and include the type, quantity, and date.
3. Points for a ClassTeam can only be updated by the teacher who owns it OR through the completion of a valid mission.
4. Missions are global and can only be modified by admins.
5. VisualLogs are linked to the teacher who uploaded them.

## The Dirty Dozen Payloads (Target: PERMISSION_DENIED)

1. **Identity Theft (Create Class)**: Teacher A trying to create a class where `teacherId` is Teacher B's UID.
2. **Identity Theft (Update Entry)**: Teacher B trying to update an entry created by Teacher A.
3. **Privilege Escalation (Points)**: Teacher A trying to set their class points to 999999 manually via document update without mission completion.
4. **Shadow Update**: Updating a class with a `isVerified: true` hidden field.
5. **ID Poisoning**: Creating an entry with a 2KB junk string as the document ID.
6. **Immutable Breach**: Trying to change the `teacherId` or `createdAt` of an existing class.
7. **Type Poisoning**: Sending `quantity: "muito"` (string) instead of a number in a residue entry.
8. **Size Overload**: Sending a 500KB string for the mission description.
9. **Relational Orphan**: Creating a residue entry for a `classId` that does not exist.
10. **State Skipping**: Completing a mission that is not currently marked as `active`.
11. **PII Leak**: Trying to read the `users` collection without being the user themselves (or an admin).
12. **System Field Injection**: Trying to inject an `internalStatus` field into a mission.

## Test Runner Plan
I will create `firestore.rules.test.ts` to simulate these attacks using the Firebase Local Emulator (or in spirit via logical validation in the rules themselves).

## Relationship Map
- `classes` -> Owner: `teacherId`
- `entries` -> Owner: `teacherId`, Reference: `classId`
- `missions` -> Admin Only
- `logs` -> Owner: `teacherId`
