import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Neither DIRECT_URL nor DATABASE_URL is set. Cannot seed without a database connection."
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
  log: ["error", "warn"],
});

const BCRYPT_COST = 12;

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.log("Refusing to seed: NODE_ENV=production. Aborting.");
    return;
  }

  const username = (process.env.ADMIN_SEED_USERNAME ?? "admin")
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!password || password.length < 8) {
    console.error(
      "❌ ADMIN_SEED_PASSWORD is missing or shorter than 8 characters."
    );
    console.error("   Add it to .env, e.g.:");
    console.error("   ADMIN_SEED_PASSWORD=MyStrongPassword2026");
    process.exit(1);
  }

  console.log(`Wiping existing users...`);
  await prisma.user.deleteMany();

  console.log(`Creating admin user "${username}"...`);
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  const admin = await prisma.user.create({
    data: {
      username,
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
      name: "Administrator",
    },
  });

  console.log("");
  console.log("─────────────────────────────────────────");
  console.log("Seed complete.");
  console.log("");
  console.log(`  Username: ${username}`);
  console.log(`  Password: (from ADMIN_SEED_PASSWORD)`);
  console.log("");
  console.log("Change the password after your first login.");
  console.log("─────────────────────────────────────────");
  console.log(`Admin ID: ${admin.id}`);
  console.log("");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });