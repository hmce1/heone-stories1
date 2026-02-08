import { PrismaClient } from '@prisma/client'
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Hash password for admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.admin.upsert({
    where: { username: "admin" },
    update: {
      // Update password if it's not hashed (for migration)
      password: hashedPassword,
    },
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  console.log("Admin user created/updated:", admin.username);
  console.log("Default password: admin123 (change this in production!)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
