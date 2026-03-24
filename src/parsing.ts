import { readFileSync } from "node:fs";

export function parseBoard(path: string) {}

export function parseRolls(path: string) {
  let buffer;
  try {
    buffer = JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    throw new Error(`Failed to <ROLLS>, ${path}, please check path.`);
  }

  // must be a non-empty array
  if (!Array.isArray(buffer) || buffer.length === 0)
    throw new Error(`<ROLLS>, ${path}, must be a non-empty JSON array.`);

  // array must be positive integers
  if (
    !buffer.every((n) => typeof n === "number" && Number.isInteger(n) && n > 0)
  )
    throw new Error("Rolls must be an array of positive integers.");

  return buffer;
}
