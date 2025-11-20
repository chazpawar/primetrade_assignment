/**
 * API Route: User Profile
 * GET /api/user/profile
 * Returns the currently authenticated user's profile
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, extractToken } from "@/lib/auth";

/**
 * GET handler for user profile
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and verify token
    const authHeader = request.headers.get("authorization");
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "UNAUTHORIZED",
          message: "Authentication token required",
        },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_TOKEN",
          message: "Invalid or expired token",
        },
        { status: 401 }
      );
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { entities: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "USER_NOT_FOUND",
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while fetching profile",
      },
      { status: 500 }
    );
  }
}
