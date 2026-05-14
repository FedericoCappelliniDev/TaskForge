export interface User {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly avatarUrl?: string;
  readonly createdAt: string;
}

/** Alias — same shape, used when fetching /auth/me */
export type UserResponse = User;

export type UserRole = 'ADMIN' | 'MEMBER' | 'VIEWER';

/** Payload returned by Spring Boot JWT login endpoint */
export interface AuthResponse {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
  readonly expiresIn: number;
  readonly user: User;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
}
