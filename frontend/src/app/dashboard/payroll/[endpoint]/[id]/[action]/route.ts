import { NextResponse } from "next/server";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:3000/payroll-configuration";

export async function PATCH(
  request: Request,
  context: { params: { endpoint: string; id: string; action: string } }
) {
  const { endpoint, id, action } = context.params;
  const body = await request.json();

  const res = await fetch(`${BASE_URL}/${endpoint}/${id}/${action}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();

  return NextResponse.json(
    { message: "OK", backendResponse: text },
    { status: res.status }
  );
}
