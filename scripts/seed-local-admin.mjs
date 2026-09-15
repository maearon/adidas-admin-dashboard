import { randomUUID } from "node:crypto";
import pg from "pg";
import { hashPassword } from "better-auth/crypto";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://adidas:adidas_local@127.0.0.1:5432/adidas_auth_prod";

const email = "admin@local.test";
const passwordPlain = "Admin@123";

const pool = new pg.Pool({ connectionString });

const existing = await pool.query(`SELECT id FROM "user" WHERE email = $1`, [email]);
const userId = existing.rows[0]?.id || randomUUID();
const now = new Date();

if (existing.rows[0]) {
  await pool.query(
    `UPDATE "user" SET role = 'admin', email_verified = true, updated_at = $2 WHERE id = $1`,
    [userId, now],
  );
} else {
  await pool.query(
    `INSERT INTO "user" (id, name, email, email_verified, image, role, created_at, updated_at)
     VALUES ($1, $2, $3, true, null, 'admin', $4, $4)`,
    [userId, "Local Admin", email, now],
  );
}

const password = await hashPassword(passwordPlain);
const account = await pool.query(
  `SELECT id FROM account WHERE user_id = $1 AND provider_id = 'credential'`,
  [userId],
);

if (account.rows[0]) {
  await pool.query(`UPDATE account SET password = $2, updated_at = $3 WHERE id = $1`, [
    account.rows[0].id,
    password,
    now,
  ]);
} else {
  await pool.query(
    `INSERT INTO account (
      id, account_id, provider_id, user_id, password, created_at, updated_at
    ) VALUES ($1, $2, 'credential', $3, $4, $5, $5)`,
    [randomUUID(), userId, userId, password, now],
  );
}

await pool.end();
console.log(`Admin ready: ${email}`);
