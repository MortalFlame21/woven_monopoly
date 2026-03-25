// everything related to game state and logic
import type {
  Board,
  BoardTile,
  Rolls,
  Property,
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
  (name) => new Player(name, g_STARTING_MONEY),
);

export { g_PLAYERS };

// game state class
export class Game {
  // a circular buffer
  board: Board;
  rolls: Rolls;
  players: Player[];
  // colors set, tracks if a color group is complete for double rent
  colors: Set<string>;
  // current player
  currentPlayerIdx: number = 0;

  constructor(board_: Board, rolls_: Rolls, players_: Player[]) {
    this.board = board_;
    this.rolls = rolls_;
    this.colors = new Set<string>(
      this.board
        .filter((tile) => tile.type === "property")
        .map((tile) => tile.colour),
    );
    this.players = players_;
  }

  play() {
    for (const n of this.rolls) {
      const cp = this.players[this.currentPlayerIdx];
      cp.rollAndMove(n, this.board.length);

      const tile = this.board[cp.position];
      this.tileAction(cp.position, tile);
    }
  }

  tileAction(playerId: number, tile: BoardTile) {
    if (tile.type === "go") {
      // do nothing for now
    } else if (tile.type === "property") {
      // do nothing for now
    }
  }
}
