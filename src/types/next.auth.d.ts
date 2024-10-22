import { DefaultSession } from 'next-auth';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email_address: string;
      role: string;
      first_name: string;
      last_name: string;
      phone: number;
      token: string;
      statusCode: number;
      message: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: number;
    email_address: string;
    role: string;
    first_name: string;
    last_name: string;
    phone: number;
    token: string;
    statusCode: number;
    message: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: {
      id: number;
      email_address: string;
      role: string;
      first_name: string;
      last_name: string;
      phone: number;
      token: string;
      statusCode: number;
      message: string;
    }
  }
}