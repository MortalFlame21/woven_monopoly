import { Command } from "commander";
import { parseBoard, parseRolls } from "./parsing.js";
const program = new Command();

program
  .name("Monopoly")
  .description("CLI Woven Monopoly")
  .version("0.0.1")
  .argument("<board>", "Path to the board JSON file")
  .argument("<rolls>", "Path to the rolls JSON file")
  .action((boardPath, rollsPath) => {
    const board = parseBoard(boardPath);
    const rolls = parseRolls(rollsPath);

    console.log(`${board}`);
    console.log(`${rolls}`);
  });

program.parse();
