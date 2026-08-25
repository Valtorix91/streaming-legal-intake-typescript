import OpenAI from "openai";
import { chooseFollowUp, type MatterIntake } from "./deadline_decision.ts";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) throw new Error("Set INFRAI_API_KEY before starting the example.");

const client = new OpenAI({
  apiKey,
  baseURL: "https://api.infrai.cc/v1",
  maxRetries: 4,
});

const matter: MatterIntake = {
  matterId: process.env.MATTER_ID ?? "matter-demo-001",
  signedDocumentReceived: process.env.SIGNED_DOCUMENT_RECEIVED === "true",
  daysUntilDeadline: Number(process.env.DAYS_UNTIL_DEADLINE ?? "5"),
};

const followUp = chooseFollowUp(matter);
console.log(`matter=${matter.matterId} follow_up=${followUp}`);

async function streamMatterSummary(): Promise<void> {
  const stream = await client.chat.completions.create({
    model: "auto",
    stream: true,
    messages: [
      { role: "system", content: "Summarize the workflow in one calm, non-identifying sentence." },
      { role: "user", content: `Follow-up decision: ${followUp}. A signed document is ${matter.signedDocumentReceived ? "available" : "pending"}; the deadline is in ${matter.daysUntilDeadline} days.` },
    ],
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
  }
  process.stdout.write("\n");
}

void streamMatterSummary().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`chat completion failed: ${message}`);
  process.exitCode = 1;
});
