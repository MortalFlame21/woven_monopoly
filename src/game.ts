import type { Board, BoardTile, Rolls, Player } from "./monopoly.js";

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
}
