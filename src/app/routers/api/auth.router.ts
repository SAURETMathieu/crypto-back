import express from "express";
import { ExpressAuth } from "@auth/express"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "@/helpers/pg.prisma"
import GitHubProvider from "next-auth/providers/github"

const apiAuthRouter = express();

apiAuthRouter.set("trust proxy", true)
apiAuthRouter.use(
  "*",
  ExpressAuth({
    providers: [GitHubProvider],
    adapter: PrismaAdapter(prisma),
  })
)

export default apiAuthRouter;