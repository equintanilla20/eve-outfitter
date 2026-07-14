// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Extends the built-in session.user interface to include 
   * custom attributes parsed from our EVE Online login payload.
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}