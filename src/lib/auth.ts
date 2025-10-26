import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

const adminRole = "admin";
const userRole = "user";

export const auth = betterAuth({
 database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser : (profile) => ({
        email: profile.email,
        name: profile.name,
        role: userRole,
        image: profile.picture
      })
    },
  },
  plugins:[
    admin({
        adminRoles: [adminRole],
        defaultRole:userRole ,

    }),
    nextCookies(),
  ]
});