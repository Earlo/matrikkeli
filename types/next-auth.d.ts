import { IUser } from '@/schemas/user';
export type ISODateString = string;

declare module 'next-auth' {
  interface Session {
    user: Omit<IUser, 'password'>;
  }
  interface DefaultUser {
    id: string;
    username: string;
  }

  interface User {
    id: string;
    username: string;
  }
}
