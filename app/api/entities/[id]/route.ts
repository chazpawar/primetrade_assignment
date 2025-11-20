/**
 * API Route: Single Entity Operations
 * GET /api/entities/[id] - Get entity by ID
 * PUT /api/entities/[id] - Update entity
 * DELETE /api/entities/[id] - Delete entity
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, extractToken } from "@/lib/auth";
import { updateEntitySchema } from "@/lib/validations";
import { ZodError } from "zod";

/**
 * Helper function to authenticate request
 */
async function authenticate(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = extractToken(authHeader);

  if (!token) {
    return { error: "Authentication token required", status: 401 };
  }

  const payload = await verifyToken(token);

  if (!payload) {
    return { error: "Invalid or expired token", status: 401 };
  }

  return { userId: payload.userId };
}

/**
 * GET handler - Get single entity
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Authenticate
    const auth = await authenticate(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: auth.error },
        { status: auth.status }
      );
    }

    // Fetch entity
    const entity = await prisma.entity.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    });

    if (!entity) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Entity not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: entity,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Entity fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while fetching entity",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT handler - Update entity
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Authenticate
    const auth = await authenticate(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: auth.error },
        { status: auth.status }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateEntitySchema.parse(body);

    // Check if entity exists and belongs to user
    const existingEntity = await prisma.entity.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    });

    if (!existingEntity) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Entity not found",
        },
        { status: 404 }
      );
    }

    // Update entity
    const entity = await prisma.entity.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(
      {
        success: true,
        data: entity,
        message: "Entity updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
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

    console.error("Entity update error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while updating entity",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete entity
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Authenticate
    const auth = await authenticate(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: auth.error },
        { status: auth.status }
      );
    }

    // Check if entity exists and belongs to user
    const existingEntity = await prisma.entity.findFirst({
      where: {
        id,
        userId: auth.userId,
      },
    });

    if (!existingEntity) {
      return NextResponse.json(
        {
          success: false,
          error: "NOT_FOUND",
          message: "Entity not found",
        },
        { status: 404 }
      );
    }

    // Delete entity
    await prisma.entity.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Entity deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Entity deletion error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while deleting entity",
      },
      { status: 500 }
    );
  }
}
