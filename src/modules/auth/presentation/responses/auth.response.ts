export class AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    user_id: number;
    name: string;
    email: string;
    role: string;
  };
}
