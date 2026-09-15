import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in environment variables");
}

const databaseUrl = process.env.DATABASE_URL;

export const db = databaseUrl.includes("neon.tech")
  ? drizzleNeon(neon(databaseUrl), { schema })
  : drizzlePg(new Pool({ connectionString: databaseUrl }), { schema });
