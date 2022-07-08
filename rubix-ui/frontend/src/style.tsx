import Case from "case";

export const EnableColour = "#00b300";
export const EnableText = "enabled";
export const DisabledColour = "#b3b3cc";
export const DisabledText = "disabled";

export function Heading(name: string): string {
  return Case.title(name);
}
