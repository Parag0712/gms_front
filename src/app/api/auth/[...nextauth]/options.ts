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
            // In options.ts
            async authorize(credentials) {
                if (!credentials?.email_address || !credentials?.password) {
                    throw new Error(JSON.stringify({ statusCode: 400, message: "Email and password are required" }));
                }

                const response = await loginAdmin(credentials.email_address, credentials.password);

                // If login is successful, return the user data
                if (response.success && response.data) {
                    return response.data;
                }

                // If login failed, throw the error with the message from backend
                throw new Error(JSON.stringify({
                    statusCode: response.statusCode,
                    message: response.message
                }));
            }
        }),
    ],
    callbacks: {
        // Callback to handle JWT token creation
        async jwt({ token, user }) {
            // If a user object is available, add it to the token
            if (user) {
                token.user = user as User;
            }
            return token;
        },
        // Callback to handle session creation
        async session({ session, token }) {
            // Add the user information from the token to the session
            session.user = token.user as User;
            return session;
        },
    },
    // Custom pages configuration
    pages: {
        signIn: '/sign-in', // Custom sign-in page path
    },
    // Secret used to encrypt the NextAuth.js JWT
    secret: process.env.NEXTAUTH_SECRET,
};
