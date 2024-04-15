export interface UserLogin {
  usernameOrEmail: string;
  password: string;
}

export interface AuthDetails {
  jwt: string;
  name: string;
}
export interface Message {
  nickname: string;
  content: string;
}

export interface ConnectedUsers {
  count: number;
  usernames: string[];
}

export interface UserSignUp {
  name: string;
  username: string;
  email: string;
  password: string;
  token: string;
}
