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
const g_STARTING_MONEY = 16;
const g_MIN_PLAYERS = 2;
const g_MAX_PLAYERS = 6;
const g_BASE_RENT = 1;

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

  calculateRent(owner: Player, property: Property): number {
    // filter via color of tile
    const colourGroups = this.board.filter(
      (tile) => tile.type === "property" && tile.colour === property.colour,
    );
    // check the filter, ensure every property is owned
    const ownsAll = colourGroups.every((p) => {
      const boardIdx = this.board.indexOf(p);
      return owner.getProperty(boardIdx) !== null;
    });
    return ownsAll ? g_BASE_RENT * 2 : g_BASE_RENT;
  }

  leaderboard() {
    const sorted = [...this.players].sort((a, b) => b.money - a.money);
    console.log(`\n${sorted[0].name} wins!\n`);
    console.log("Leaderboard:");
    sorted.forEach((player, idx) => {
      console.log(`\t#${idx + 1}. ${player.name} - $${player.money}`);
      console.log("\t\tProperties:");
      if (player.properties.size === 0) console.log("\t\t\t(none)");
      else
        player.properties.forEach((p) => {
          console.log(`\t\t\t${p.name}`);
        });
    });
  }
}
