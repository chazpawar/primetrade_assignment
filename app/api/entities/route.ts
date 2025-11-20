/**
 * API Route: Entities CRUD
 * GET /api/entities - List all entities with filters
 * POST /api/entities - Create new entity
 * Handles entity management for authenticated users
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, extractToken } from "@/lib/auth";
import { createEntitySchema, entityFilterSchema } from "@/lib/validations";
import { applyRateLimit, apiLimiter } from "@/lib/rate-limit";
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
 * GET handler - List entities with search and filters
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, apiLimiter);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    // Authenticate
    const auth = await authenticate(request);
    if ("error" in auth) {
      return NextResponse.json(
        { success: false, error: "UNAUTHORIZED", message: auth.error },
        { status: auth.status }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const filters = {
      category: searchParams.get("category") || undefined,
      status: searchParams.get("status") || undefined,
      priority: searchParams.get("priority") || undefined,
      search: searchParams.get("search") || undefined,
    };

    // Validate filters
    const validatedFilters = entityFilterSchema.parse(filters);

    // Build Prisma query
    const where: any = {
      userId: auth.userId,
    };

    if (validatedFilters.category) {
      where.category = validatedFilters.category;
    }

    if (validatedFilters.status) {
      where.status = validatedFilters.status;
    }

    if (validatedFilters.priority) {
      where.priority = validatedFilters.priority;
    }

    if (validatedFilters.search) {
      where.OR = [
        { title: { contains: validatedFilters.search, mode: "insensitive" } },
        { description: { contains: validatedFilters.search, mode: "insensitive" } },
      ];
    }

    // Fetch entities
    const entities = await prisma.entity.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        data: entities,
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

    console.error("Entity fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while fetching entities",
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create new entity
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await applyRateLimit(request, apiLimiter);
  if (rateLimitResponse) return rateLimitResponse;

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
    const validatedData = createEntitySchema.parse(body);

    // Create entity
    const entity = await prisma.entity.create({
      data: {
        ...validatedData,
        userId: auth.userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: entity,
        message: "Entity created successfully",
      },
      { status: 201 }
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

    console.error("Entity creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SERVER_ERROR",
        message: "An error occurred while creating entity",
      },
      { status: 500 }
    );
  }
}
