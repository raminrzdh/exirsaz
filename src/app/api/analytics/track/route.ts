import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Normalize to array for batch processing
    const events = Array.isArray(body) ? body : [body];

    const mappedEvents = events.map((ev: any) => ({
      eventType: ev.eventName || ev.eventType,
      path: ev.path || ev.payload?.path || "",
      metadata: ev.payload ? JSON.stringify(ev.payload) : null,
      sessionId: ev.sessionId || "anonymous",
    }));

    await prisma.funnelEvent.createMany({
      data: mappedEvents,
    });

    return NextResponse.json({ success: true, count: events.length });
  } catch (error) {
    console.error("[Analytics Track Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
