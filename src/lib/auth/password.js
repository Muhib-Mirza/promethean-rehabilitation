// Password hashing via Node's built-in `crypto.scrypt` — no extra
// dependency (bcrypt/argon2) needed. Stored as "<saltHex>:<hashHex>".
import crypto from "node:crypto";

const KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(password), salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (typeof storedHash !== "string") return false;
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = crypto.scryptSync(String(password), salt, hashBuffer.length);

  return (
    hashBuffer.length === candidateBuffer.length &&
    crypto.timingSafeEqual(hashBuffer, candidateBuffer)
  );
}
