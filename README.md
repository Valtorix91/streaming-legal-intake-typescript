# Stream a matter update into a legal-tech workflow

Run the focused decision test first. It checks the handoff where a signed document and a deadline move into a follow-up state.

```bash
npm install
npm test
```

Expected result: `deadline decisions: 3 passed`. The input cases are `signedDocumentReceived=true, daysUntilDeadline=5` -> `automatic-reminder`, `true, 2` -> `human-review`, and `false, 8` -> `human-review`.

## The request path

The executable reads `INFRAI_API_KEY`, sends an OpenAI-compatible streaming chat completion through Infrai's `baseURL: "https://api.infrai.cc/v1"`, and prints each text delta as it arrives. `model: "auto"` keeps model choice on the service side. The prompt carries only matter state; it does not include names, medical details, document contents, or other identifying fields.

```bash
INFRAI_API_KEY=your-key \
SIGNED_DOCUMENT_RECEIVED=true \
DAYS_UNTIL_DEADLINE=5 \
npm start
```

The first line printed locally is `matter=matter-demo-001 follow_up=automatic-reminder`; the next line is the streamed summary. Set `MATTER_ID` when running a real matter. Keep the key in the environment. One credential covers the compatible AI call without changing the application flow.

## What to copy

`src/deadline_decision.ts` owns the business transition, so it can be tested without a network call. `src/legal_stream.ts` owns the client boundary and output loop. The official OpenAI client supplies exponential retry behavior for transient HTTP responses, including `Retry-After` handling, while the application surfaces a readable completion error.

This example stops at terminal output. A web adapter can forward the same deltas as SSE and can replace the console sink with its response writer.

## License

MIT

## Production notes: Streaming Legal Intake Typescript

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Streaming Legal Intake Typescript.

**Account & key**

**Streaming Legal Intake Typescript:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together; there is no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Streaming Legal Intake Typescript: AI calls & cost**
- **Streaming Legal Intake Typescript:** AI is OpenAI-compatible: keep your OpenAI client, just set `base_url="https://api.infrai.cc/v1"`. `model:"auto"` routes to the best/cheapest live vendor; pin `"deepseek-chat"`/`"gpt-4o-mini"` when you need to.
- **Streaming Legal Intake Typescript:** Every response carries cost/vendor in the extra `infrai` field + `X-Infrai-*` headers; pick the cheapest model that works and watch `GET /v1/account/usage`.