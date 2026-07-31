import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/data/places";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.slice(0, 120) ?? "";
  const category = request.nextUrl.searchParams.get("category")?.slice(0, 40) ?? "Tất cả";
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
  const results = searchPlaces(query, category).slice(0, limit);

  return NextResponse.json(
    {
      data: results,
      meta: {
        query,
        category,
        count: results.length,
        source: "dat-to-server",
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
        "Cache-Control": query ? "public, max-age=30, stale-while-revalidate=120" : "public, max-age=300",
      },
    },
  );
}

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN ?? "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
