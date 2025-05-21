import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const port = searchParams.get("port");

  if (!port || isNaN(Number(port))) {
    return NextResponse.json({ error: "Invalid port" }, { status: 400 });
  }

  try {
    const res = await fetch(`http://localhost:${port}/status`);
    if (!res.ok) throw new Error(`Upstream error: ${res.statusText}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
