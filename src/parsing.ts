import type { Board, Rolls } from "./schema.js";
import { board, rolls, colour } from "./schema.js";
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
    throw new Error(`ERROR: board: ${path}, first tile must be of type "go".`);
  if (res.data.filter((tile) => tile.type === "go").length !== 1)
    throw new Error(
      `ERROR: board: ${path}, must contain exactly one "go" tile.`,
    );

  // everything pass constraints validate color and transform colour
  res.data = res.data.map((tile) => {
    if (tile.type === "property") {
      const colorRes = colour.safeParse(tile.colour.toUpperCase());
      if (!colorRes.success) {
        console.warn(
          `WARNING: board: ${path}, tile "${tile.name}", invalid colour "${tile.colour}", defaulting to "UNKNOWN".`,
        );
        return { ...tile, colour: "UNKNOWN" };
      }
      return { ...tile, colour: colorRes.data };
    }
    return tile;
  });

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
