import axios from 'axios';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                try {
                    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                        email: credentials.email,
                        password: credentials.password
                    });

                    const user = response.data;

                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                } catch (err) {
                    throw new Error(err as string);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/sign-in',
    },
};
