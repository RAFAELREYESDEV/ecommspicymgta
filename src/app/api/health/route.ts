export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    status: "healthy",
    app: "Spicy Cubbes Venezuela",
    timestamp: new Date().toISOString(),
  });
}
