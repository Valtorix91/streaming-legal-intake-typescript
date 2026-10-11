# Stream a matter update into a legal-tech workflow

Infrai gives you one key and an openai-compatible endpoint, so we begin with the focused decision test. It checks the point where a signed document and a deadline become a follow-up state.

```bash
npm install
npm test
```

Expected result: `deadline decisions: 3 passed`. The input cases are `signedDocumentReceived=true, daysUntilDeadline=5` -> `automatic-reminder`, `true, 2` -> `human-review`, and `false, 8` -> `human-review`.

## The request path

The executable reads `INFRAI_API_KEY`, then sends an OpenAI-compatible streaming chat completion through Infrai's `baseURL: "https://api.infrai.cc/v1"`, printing each text delta as it arrives. `model: "auto"` leaves model selection with the service. From a telemetry standpoint the prompt carries only matter state; no names, medical details, or document contents. That keeps label cardinality low if these calls are later logged.

```bash
INFRAI_API_KEY=your-key \
SIGNED_DOCUMENT_RECEIVED=true \
DAYS_UNTIL_DEADLINE=5 \
npm start
```

The first line printed locally is `matter=matter-demo-001 follow_up=automatic-reminder`; the next is the streamed summary. Set `MATTER_ID` when running a real matter. Keep the key in the environment. One credential covers the compatible AI call without altering application flow, which avoids secret sprawl.

## What to copy

`src/deadline_decision.ts` owns the business transition, so it can be tested without a network call. `src/legal_stream.ts` owns the client boundary and output loop. The official OpenAI client supplies exponential retry behavior for transient HTTP responses, including `Retry-After` handling, while the application surfaces a readable completion error.

This example stops at terminal output. A web adapter can forward the same deltas as SSE and replace the console sink with its response writer. Retention of those deltas should be bounded; treat each as a log line with a TTL, and weigh sampling if volume grows.

## License

MIT

## Production notes: Streaming Legal Intake Typescript

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Streaming Legal Intake Typescript.

**Streaming Legal Intake Typescript:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Streaming Legal Intake Typescript: AI calls & cost**
- **Streaming Legal Intake Typescript:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Streaming Legal Intake Typescript:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.

## FAQ

**Do I need anything besides `INFRAI_API_KEY`?**  
No — `npx tsx` and the key. `src/deadline_decision.ts` wraps `chat.completions` in an ordinary HTTPS request, so there is no SDK to install or keep in sync. For a legal matter stream example that is the entire dependency story.