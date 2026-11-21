export interface AuthUser {
  username: string;
  reLoginCode: string;
}

export interface AuthCredentials {
  user: string;
  pass: string;
}

export interface AuthType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
