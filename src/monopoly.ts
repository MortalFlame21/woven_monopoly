// constants, schemas, and types
import { z } from "zod";

// constants
export const g_STARTING_MONEY = 16;
export const g_MIN_PLAYERS = 2;
export const g_MAX_PLAYERS = 6;

// schemas
// players
const player = z.object({
  name: z.string().min(1).max(64),
  position: z.number().min(0),
  money: z.number().min(0),
  properties: z.array(z.string().min(1).max(64)),
});

export const players = z.array(player).min(g_MIN_PLAYERS).max(g_MAX_PLAYERS);

// tiles
export const tile = z.object({
  name: z.string().min(1).max(64),
  type: z.string(),
});

export const goTile = tile.extend({
  name: z.literal("Go"),
  type: z.literal("go"),
});

export const propertyTile = tile.extend({
  type: z.literal("property"),
  price: z.number().int().min(0),
  colour: z.string().min(1).max(64),
  owner_id: z
    .string()
    .min(g_MAX_PLAYERS - 1)
    .max(g_MAX_PLAYERS - 1)
    .nullable(),
});

export const boardTile = z.union([goTile, propertyTile]);

// board
export const board = z.array(boardTile).min(1);

// rolls
export const rolls = z.array(z.number().int().positive()).min(1);

// types
export type BoardTile = z.infer<typeof boardTile>;
export type Board = z.infer<typeof board>;
export type Rolls = z.infer<typeof rolls>;
