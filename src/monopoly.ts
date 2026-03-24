// globals, constants, schemas, and types related with game state
import { z } from "zod";

// globals
// constants
export const g_STARTING_MONEY = 16;
export const g_MIN_PLAYERS = 2;
export const g_MAX_PLAYERS = 6;

// game state
// a circular buffer
let g_BOARD: Board = [];
// properties map, tracks player property ownership
let g_PROPERTIES = new Map<number, BoardTile>();
// colors set, tracks if a color group is complete for double rent
let g_COLORS = new Set<string>();
// players default init
let g_PLAYERS: Player[] = ["Peter", "Billy", "Charlotte", "Sweedal"].map(
  (name) => ({ name, position: 0, money: g_STARTING_MONEY, properties: [] }),
);

export { g_BOARD, g_PROPERTIES, g_PLAYERS, g_COLORS };

// schemas
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
export const property = propertyTile;

// board
export const board = z.array(boardTile).min(1);

// rolls
export const rolls = z.array(z.number().int().positive()).min(1);

// players
const player = z.object({
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
