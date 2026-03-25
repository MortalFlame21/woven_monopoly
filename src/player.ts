import type { Property } from "./monopoly.js";
import { player } from "./monopoly.js";

// a class similar to Player type
export class Player {
  name: string;
  position: number;
  money: number;
  properties: Property[];

  constructor(
    name: string,
    position: number,
    money: number,
    properties: Property[],
  ) {
    const parse = player.parse({ name, position, money, properties });

    this.name = parse.name;
    this.position = parse.position;
    this.money = parse.money;
    this.properties = parse.properties;
  }

  // move player position, wraps around the board
  public roll(dice: number, boardSize: number) {
    this.position = (this.position + dice) % boardSize;
  }

  public canAfford(amount: number) {
    return this.money >= amount;
  }

  public isBankrupt() {
    return this.money < 0;
  }

  public buyProperty(property: Property) {
    if (this.canAfford(property.price)) {
      this.money -= property.price;
      this.properties.push(property);
    }
  }

  // rent later
}
