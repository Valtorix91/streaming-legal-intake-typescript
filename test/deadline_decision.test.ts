import assert from "node:assert/strict";
import { chooseFollowUp } from "../src/deadline_decision.ts";

assert.equal(
  chooseFollowUp({ matterId: "m-1", signedDocumentReceived: true, daysUntilDeadline: 5 }),
  "automatic-reminder",
);
assert.equal(
  chooseFollowUp({ matterId: "m-2", signedDocumentReceived: true, daysUntilDeadline: 2 }),
  "human-review",
);
assert.equal(
  chooseFollowUp({ matterId: "m-3", signedDocumentReceived: false, daysUntilDeadline: 8 }),
  "human-review",
);
console.log("deadline decisions: 3 passed");
