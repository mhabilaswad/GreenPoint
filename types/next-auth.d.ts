// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
      points?: number;
      tier?: string | null;
      linkedin?: string | null;
      github?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    points?: number;
    tier?: string | null;
    linkedin?: string | null;
    github?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    points?: number;
    tier?: string | null;
    linkedin?: string | null;
    github?: string | null;
  }
}