import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  paths: string[];       // storage_path aus invoice_documents
  bucket?: string;       // default: "invoice-docs"
  expiresIn?: number;    // default: 60*10 (10 min)
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const bucket = body.bucket ?? "invoice-docs";
  const expiresIn = body.expiresIn ?? 60 * 10;

  if (!Array.isArray(body.paths) || body.paths.length === 0) {
    return NextResponse.json({ error: "paths missing" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const results = await Promise.all(
    body.paths.map(async (path) => {
      const { data, error } = await supabaseAdmin.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      return {
        path,
        url: data?.signedUrl ?? null,
        error: error?.message ?? null,
      };
    })
  );

  return NextResponse.json({ results });
}
