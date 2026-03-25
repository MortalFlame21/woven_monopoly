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

type GameAction = "SUCCESS" | "BANKRUPT" | "GAME_OVER";

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
      const result = this.tileAction(cp, tile);
    }
  }

  tileAction(player: Player, tile: BoardTile): GameAction {
    if (tile.type === "go") {
      return "SUCCESS";
    } else if (tile.type === "property") {
      const p = { ...tile, position: player.position } as Property;
      if (player.ownsProperty(p)) return "SUCCESS";

      const owner = this.propertyTileOwner(p);
      if (!owner) {
        // must buy property until bankrupt
        player.buyProperty(p);
        return player.isBankrupt() ? "BANKRUPT" : "SUCCESS";
      } else {
        // calculate the rent, we don't store
        const rentAmount = this.calculateRent(owner, p);
        player.payRent(owner, rentAmount);
        return player.isBankrupt() ? "BANKRUPT" : "SUCCESS";
      }
    }
    // skip unknown tile types for now
    return "SUCCESS";
  }

  propertyTileOwner(property: Property): Player | null {
    return this.players.find((player) => player.ownsProperty(property)) || null;
  }
}
