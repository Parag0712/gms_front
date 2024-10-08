import { DefaultSession } from 'next-auth';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string;
      token: string;
      statusCode: number;
      message: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    phone: string;
    token: string;
    statusCode: number;
    message: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: string;
      email: string;
      role: string;
      firstName: string;
      lastName: string;
      phone: string;
      token: string;
      statusCode: number;
      message: string;
    }
  }
}