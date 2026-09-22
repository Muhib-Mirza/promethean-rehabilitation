// DEMO-DATA FALLBACK — remove along with the rest of src/mock-data/ once a
// real database is connected (see README.md).
//
// Lets the fixed super admin sign in even when the database is unreachable,
// mirroring MOCK_PATIENTS. The hash below is
// hashPassword("administrator@promethian") (src/lib/auth/password.js,
// scrypt) computed once — recompute it if that password ever changes.
export const MOCK_SUPERADMIN = {
  id: 0,
  username: "superadministrator",
  passwordHash:
    "2b6081c184975d7f697c17b92a037b6c:b10b050ffd2d9b61b35a4cc71f61e004a0ec70d1da10bec69594b5ffa4c9da33c050576e16d463ab3a4cba931b90138b6e3f666694ae066caae6cbbfd9ebe84f",
  role: "SUPERADMIN",
};
