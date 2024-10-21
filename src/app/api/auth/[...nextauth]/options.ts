import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginAdmin } from '@/services/auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email_address: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Validate email and password
                if (!credentials?.email_address || !credentials?.password) {
                    throw new Error(JSON.stringify({ statusCode: 400, message: "Email and password are required" }));
                }
                try {
                    // Use the new API service to log in
                    const response = await loginAdmin(credentials.email_address, credentials.password);
                    // Ensure a user object is returned, else return null
                    if (response.data) {
                        return response.data;  // Return the user data if successful
                    }
                    return null; // Return null if login fails
                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : 'An unexpected error occurred');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as User;
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXTAUTH_SECRET,
};
