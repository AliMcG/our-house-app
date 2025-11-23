import 'dotenv/config'
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

type Env = {
    DATABASE_URL: string
}

export default {
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
    },
    datasource: {
        url: env<Env>("DATABASE_URL")
    }
} satisfies PrismaConfig;