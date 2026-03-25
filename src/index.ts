import { Command } from "commander";
import { parseBoard, parseRolls } from "./parsing.js";
import { g_PLAYERS, Game } from "./game.js";

const program = new Command();
let game: Game;

program
  .name("Monopoly")
  .description("CLI Woven Monopoly")
  .version("0.0.1")
  .argument("<board>", "Path to the board JSON file")
  .argument("<rolls>", "Path to the rolls JSON file")
  .action((boardPath, rollsPath) => {
    try {
      const board = parseBoard(boardPath);
      const rolls = parseRolls(rollsPath);

      game = new Game(board, rolls, g_PLAYERS);

      game.play();
      game.leaderboard();
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
      process.exit(1);
    }
  });

program.parse();
