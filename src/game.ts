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
      // do nothing for now
      return "SUCCESS";
    } else if (tile.type === "property") {
      // not a fully accurate way to get property, just for validity of ownership
      const p = { ...tile, position: player.position } as Property;
      if (player.ownsProperty(p)) return "SUCCESS";

      const owner = this.propertyTileOwner(p);
      const rent = this.getPropertyRent(p.pos);

      if (!owner && player.canAfford(p.price)) {
        player.buyProperty(p);
        // check if the color group is complete for double rent
        return "SUCCESS";
      } else if (owner && player.canAffordRent(rent)) {
        player.payRent(owner, rent);
        return "SUCCESS";
      } else {
        // owner and bankrupt or no owner and bankrupt
        return "BANKRUPT";
      }
    }
    // skip unknown tile types for now
    return "SUCCESS";
  }

  propertyTileOwner(property: Property): Player | null {
    return this.players.find((player) => player.ownsProperty(property)) || null;
  }
}
