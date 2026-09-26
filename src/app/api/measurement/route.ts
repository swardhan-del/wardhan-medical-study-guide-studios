import { collectMeasurement, measurementStatus } from "@/lib/measurement-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() { return measurementStatus(process.env); }
export function POST(request: Request) { return collectMeasurement(request, process.env); }
