export interface IUser {
  username: string;
  password: string;
  admin: boolean;
  created: Date;
  updated: Date;
}

export interface Person {
  id: number;
  user_id: string;
  email: string;
  contact_info: {
    [key: string]: ContactInfo;
  };
  first_name: string;
  last_name: string;
  image_url_session: string;
  description: string;
  birthday: string;
  roles: Position[];
  work_history: Position[];
  joined: string;
  left: string;
  qr_code: string;
  questions: Question[];
  role: string;
}

export interface Position {
  id: number;
  title: string;
  organization: string;
  start: string;
  end: string;
  description: string;
}

export interface Question {
  id: number;
  created_at: string;
  question: string;
  type: string;
  priority: number;
}

export interface ContactInfo {
  data: string;
  order: number;
  id: string;
}
