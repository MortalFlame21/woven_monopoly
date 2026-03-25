import type { Board, Rolls } from "./monopoly.js";
import { board, rolls } from "./monopoly.js";
import { readFileSync } from "node:fs";

function returnJson(path: string) {
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    throw new Error(
      `Error:Failed to read JSON from ${path}, please check path.`,
    );
  }
}

export function parseBoard(path: string): Board {
  let buffer = returnJson(path);

  // validate board
  const res = board.safeParse(buffer);
  if (!res.success)
    throw new Error(
      `ERROR: board: ${path}, failed to parse board JSON, please check format.`,
    );

  // go constraints
  if (res.data[0].type !== "go")
    throw new Error(`ERROR: ${path}, first tile must be of type "go".`);
  if (res.data.filter((tile) => tile.type === "go").length !== 1)
    throw new Error(
      `ERROR: board: ${path}, must contain exactly one "go" tile.`,
    );

  return res.data;
}

export function parseRolls(path: string): Rolls {
  let buffer = returnJson(path);

  // validate rolls
  const res = rolls.safeParse(buffer);
  if (!res.success)
    throw new Error(
      `ERROR: rolls: ${path}, failed to parse rolls JSON, please check format.`,
    );
  return res.data;
}
