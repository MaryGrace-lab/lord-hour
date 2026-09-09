import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use DIRECT_URL for migrations (session mode, port 5432)
    // Falls back to DATABASE_URL if DIRECT_URL not set
    url: env('DIRECT_URL') || env('DATABASE_URL'),
  },
})