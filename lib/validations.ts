/**
 * Validation schemas using Zod
 * Provides type-safe validation for forms and API requests
 */

import { z } from "zod";

// ==================== Auth Validation ====================

/**
 * User registration validation schema
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
});

/**
 * User login validation schema
 */
export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

// ==================== Entity Validation ====================

/**
 * Entity creation validation schema
 */
export const createEntitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters"),
  priority: z
    .enum(["low", "medium", "high"])
    .default("medium")
    .optional(),
});

/**
 * Entity update validation schema
 */
export const updateEntitySchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category must be less than 50 characters")
    .optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
});

/**
 * Entity filter validation schema
 */
export const entityFilterSchema = z.object({
  category: z.string().optional(),
  status: z.enum(["active", "archived", "deleted"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  search: z.string().optional(),
});

// ==================== Type exports ====================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEntityInput = z.infer<typeof createEntitySchema>;
export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;
export type EntityFilterInput = z.infer<typeof entityFilterSchema>;
