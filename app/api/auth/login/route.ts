/**
 * API Route: User Login
 * POST /api/auth/login
 * Handles user authentication and JWT token generation
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validations";
import { applyRateLimit, authLimiter } from "@/lib/rate-limit";
import { ZodError } from "zod";

/**
 * POST handler for user login
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, authLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Parse request body
    const body = await request.json();

    // Validate input data
    const validatedData = loginSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(
      validatedData.password,
      user.password
    );

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
        { status: 401 }
      );
    }

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
        message: "Login successful",
      },
      { status: 200 }
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
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred during login",
      },
      { status: 500 }
    );
  }
}
