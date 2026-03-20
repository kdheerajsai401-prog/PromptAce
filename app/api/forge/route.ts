import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM } from "@/lib/system-prompt";
import type { ForgeResult, ForgeRequest } from "@/types";

export const maxDuration = 60;
export const runtime = "nodejs";

const client = new Anthropic();

async function callAndParse(msg: string): Promise<ForgeResult> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: SYSTEM,
    messages: [{ role: "user", content: msg }],
  });
  const raw = response.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean) as ForgeResult;
}

export async function POST(request: Request) {
  let body: ForgeRequest;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.input || typeof body.input !== "string" || !body.input.trim()) {
    return Response.json({ error: "input required" }, { status: 400 });
  }

  // Hard cap at 2000 chars
  let msg = body.input.trim().slice(0, 2000);

  // Append Brand DNA if any field is non-empty
  const dna = body.dna;
  if (dna && (dna.niche || dna.tone || dna.platform)) {
    msg += "\n\nBrand DNA:";
    if (dna.niche) msg += `\nNiche: ${dna.niche}`;
    if (dna.tone) msg += `\nTone: ${dna.tone}`;
    if (dna.platform) msg += `\nPlatform: ${dna.platform}`;
  }

  try {
    const result = await callAndParse(msg);
    return Response.json({ result });
  } catch (e) {
    if (e instanceof SyntaxError) {
      // Retry once on JSON parse failure
      try {
        const result = await callAndParse(msg);
        return Response.json({ result });
      } catch {
        return Response.json({ error: "Parse failed after retry. Try rephrasing your idea." }, { status: 500 });
      }
    }
    const message = e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: `Forge failed: ${message}` }, { status: 500 });
  }
}
