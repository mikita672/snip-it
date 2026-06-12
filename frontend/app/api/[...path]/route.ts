import { proxy } from "@/proxy";
import { NextRequest } from "next/server";

export const GET = (request: NextRequest) => proxy(request);
export const POST = (request: NextRequest) => proxy(request);
export const PUT = (request: NextRequest) => proxy(request);
export const PATCH = (request: NextRequest) => proxy(request);
export const DELETE = (request: NextRequest) => proxy(request);
