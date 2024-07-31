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
  description: string;
  birthday: Date;
  roles: Position[];
  work_history: Position[];
  joined: Date;
  left: Date;
  qr_code: string;
}

export interface Position {
  id: number;
  title: string;
  organization: string;
  start: string;
  end: string;
  description: string;
}
