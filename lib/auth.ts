/**
 * Authentication utilities for password hashing and JWT token management
 * Provides secure authentication functionality
 */

import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { JWTPayload } from "@/types";

/**
 * Number of bcrypt salt rounds for password hashing
 * Higher = more secure but slower (10-12 is recommended)
 */
const SALT_ROUNDS = 10;

/**
 * JWT secret key from environment variables
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-this-in-production"
);

/**
 * JWT token expiration time (7 days)
 */
const JWT_EXPIRATION = "7d";

/**
 * Hashes a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns Promise<boolean> - True if passwords match
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Creates a JWT token with user data
 * @param payload - User data to encode in token
 * @returns Promise<string> - JWT token
 */
export async function createToken(payload: JWTPayload): Promise<string> {
  const token = await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Promise<JWTPayload | null> - Decoded payload or null if invalid
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Extracts token from Authorization header
 * @param authHeader - Authorization header value (Bearer token)
 * @returns string | null - Token or null if not found
 */
export function extractToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}
