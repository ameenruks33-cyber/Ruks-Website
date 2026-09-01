/**
 * Generate a bcrypt hash for your admin password.
 * Usage: node scripts/hash-admin-password.mjs "YourStrongPassword123!"
 *
 * Put the output in Vercel as ADMIN_PASSWORD_HASH (recommended).
 * Remove plain ADMIN_PASSWORD from Vercel after setting the hash.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error("Usage: node scripts/hash-admin-password.mjs \"YourPassword\"");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nAdd this to Vercel Environment Variables:\n");
console.log("ADMIN_PASSWORD_HASH=" + hash);
console.log("\nThen remove ADMIN_PASSWORD from Vercel (use hash only).\n");
