/**
 * API Route: User Registration
 * POST /api/auth/register
 * Handles new user registration with password hashing
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validations";
import { applyRateLimit, authLimiter } from "@/lib/rate-limit";
import { ZodError } from "zod";

/**
 * POST handler for user registration
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, authLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "USER_EXISTS",
          message: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    // Create JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    // Return success response (exclude password)
    const { password: _, ...safeUser } = user;

    return NextResponse.json(
      {
        success: true,
        data: {
          user: safeUser,
          token,
        },
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "VALIDATION_ERROR",
          message: error.issues[0].message,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred during registration",
      },
      { status: 500 }
    );
  }
}
