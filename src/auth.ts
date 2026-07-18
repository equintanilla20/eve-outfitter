import NextAuth from "next-auth";
import EVEOnline from "next-auth/providers/eveonline";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        EVEOnline({
            clientId: process.env.EVE_CLIENT_ID,
            clientSecret: process.env.EVE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.characterId = profile.CharacterID;
                token.characterName = profile.CharacterName;
            }
            return token;
        },
        async session({ session, token }) {

            if (session.user) {
                session.user.id = token.characterId as string;
                session.user.name = token.characterName as string;
            }
            return session;
        },
    },
});