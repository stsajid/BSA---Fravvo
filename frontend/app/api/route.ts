import { NextResponse } from "next/server"

// This is a catch-all API route to ensure we always return JSON for any API request
// that doesn't match a specific route

export async function GET() {
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 })
}

export async function POST() {
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 })
}

export async function PUT() {
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 })
}

export async function DELETE() {
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 })
}

export async function PATCH() {
  return NextResponse.json({ error: "API endpoint not found" }, { status: 404 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
