export type MatterIntake = {
  matterId: string;
  signedDocumentReceived: boolean;
  daysUntilDeadline: number;
};

export type FollowUp = "automatic-reminder" | "human-review";

export function chooseFollowUp(matter: MatterIntake): FollowUp {
  if (matter.signedDocumentReceived && matter.daysUntilDeadline > 2) {
    return "automatic-reminder";
  }
  return "human-review";
}
