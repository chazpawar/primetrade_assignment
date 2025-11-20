/**
 * TypeScript type definitions for the application
 * Provides type safety across the entire codebase
 */

import { User as PrismaUser, Entity as PrismaEntity } from "@prisma/client";

// ==================== User Types ====================

/**
 * User type without sensitive information (password)
 * Used for client-side rendering and API responses
 */
export type SafeUser = Omit<PrismaUser, "password">;

/**
 * User registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * User login credentials
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

// ==================== Entity Types ====================

/**
 * Entity from database (full type)
 */
export type Entity = PrismaEntity;

/**
 * Data required to create a new entity
 */
export interface CreateEntityData {
  title: string;
  description?: string;
  category: string;
  priority?: "low" | "medium" | "high";
}

/**
 * Data for updating an existing entity
 */
export interface UpdateEntityData {
  title?: string;
  description?: string;
  category?: string;
  status?: "active" | "archived" | "deleted";
  priority?: "low" | "medium" | "high";
}

/**
 * Filter options for entity queries
 */
export interface EntityFilters {
  category?: string;
  status?: string;
  priority?: string;
  search?: string;
}

// ==================== API Response Types ====================

/**
 * Standard API success response
 */
export interface APIResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface APIError {
  success: false;
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * Authentication response with token
 */
export interface AuthResponse {
  success: true;
  data: {
    user: SafeUser;
    token: string;
  };
  message: string;
}

// ==================== UI/Component Types ====================

/**
 * Toast notification type
 */
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

/**
 * Modal state
 */
export interface ModalState {
  isOpen: boolean;
  type: "create" | "edit" | "delete" | null;
  data?: Entity | null;
}

/**
 * Loading states for async operations
 */
export interface LoadingStates {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}
