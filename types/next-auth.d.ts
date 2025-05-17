import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      points?: number;
      tier?: string | null;
      linkedin?: string | null;
      github?: string | null;
    };
  }
} 