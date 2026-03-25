// everything related to game state and logic
import type {
  Board,
  BoardTile,
  Rolls,
  Player as Player_t,
} from "./monopoly.js";
import { Player } from "./player.js";

// globals
// constants
export const g_STARTING_MONEY = 16;
export const g_MIN_PLAYERS = 2;
export const g_MAX_PLAYERS = 6;

// players default init
let g_PLAYERS: Player[] = ["Peter", "Billy", "Charlotte", "Sweedal"].map(
  (name) => new Player(name, 0, g_STARTING_MONEY, []),
);

export { g_PLAYERS };

// game state class
export class Game {
  // a circular buffer
  board: Board;
  rolls: Rolls;
  players: Player[];
  // properties map, tracks player property ownership
  properties: Map<number, BoardTile[]>;
  // colors set, tracks if a color group is complete for double rent
  colors: Set<string>;
  // current player
  currentPlayerIdx: number = 0;

  constructor(board_: Board, rolls_: Rolls, players_: Player[]) {
    this.board = board_;
    this.rolls = rolls_;
    this.properties = new Map<number, BoardTile[]>();
    this.colors = new Set<string>(
      this.board
        .filter((tile) => tile.type === "property")
        .map((tile) => tile.colour.toUpperCase()),
    );
    this.players = players_;
  }

  play() {
    for (const n of this.rolls) {
      const currentPlayer = this.players[this.currentPlayerIdx];
      currentPlayer.roll(n, this.board.length);
    }
  }
}
