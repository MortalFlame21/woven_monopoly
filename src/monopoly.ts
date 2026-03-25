// schemas, and types related with game state
import { z } from "zod";
import { g_MIN_PLAYERS, g_MAX_PLAYERS } from "./game.js";

// schemas
export const colour = z.enum([
  "RED",
  "BLUE",
  "GREEN",
  "YELLOW",
  "PURPLE",
  "ORANGE",
  "BROWN",
  "UNKNOWN",
]);

// tiles
export const tile = z.object({
  name: z.string().min(1).max(64),
  type: z.string(),
});
export const goTile = tile.extend({
  type: z.literal("go"),
});
export const propertyTile = tile.extend({
  type: z.literal("property"),
  price: z.number().int().min(0),
  colour: z.string().min(1).max(64),
});
export const boardTile = z.union([goTile, propertyTile]);

// property
export const property = propertyTile.extend({
  position: z.number().int().min(0),
  rent: z.number().int().min(0).nullable(),
  owner: z.number().int().min(0).nullable(),
});

// board
export const board = z.array(boardTile).min(1);

// rolls
export const rolls = z.array(z.number().int().positive()).min(1);

// players
export const player = z.object({
  name: z.string().min(1).max(64),
  position: z.number().int().min(0),
  money: z.number().int(),
  properties: z.array(property),
});

export const players = z.array(player).min(g_MIN_PLAYERS).max(g_MAX_PLAYERS);

// types
export type BoardTile = z.infer<typeof boardTile>;
export type Board = z.infer<typeof board>;
export type Rolls = z.infer<typeof rolls>;
export type Player = z.infer<typeof player>;
export type Property = z.infer<typeof property>;
