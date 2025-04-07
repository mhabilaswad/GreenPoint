import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      points?: number;
      nickname?: string | null;
      linkedin?: string | null;
      github?: string | null;
    };
  }
} 