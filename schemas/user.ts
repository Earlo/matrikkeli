export interface IUser {
  username: string;
  password: string;
  admin: boolean;
  created: Date;
  updated: Date;
}

export interface Person {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  image_url_session: string;
}
