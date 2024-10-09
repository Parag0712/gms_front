import axios from 'axios';
import axiosInstance from '@/lib/axiosInstace';
import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email_address: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email_address || !credentials?.password) {
                    throw new Error(JSON.stringify({ statusCode: 400, message: "Email and password required" }));
                }
                try {
                    const response = await axiosInstance.post(`/api/v1/admin/login`, {
                        email_address: credentials.email_address,
                        password: credentials.password
                    });
                    return response.data;
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) {
                        const { statusCode, message } = error.response.data;
                        throw new Error(JSON.stringify({ statusCode, message }));
                    }
                    throw new Error(JSON.stringify({ statusCode: 500, message: "An unexpected error occurred" }));
                }
            }
        })
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
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    secret: process.env.NEXTAUTH_SECRET,
};