import type { Property } from "./monopoly.js";
import { player } from "./monopoly.js";
import { g_STARTING_MONEY } from "./game.js";

// a class similar to Player type
export class Player {
  name: string;
  position: number;
  money: number;
  // property pos : property
  properties: Map<number, Property>;

  constructor(name: string, money: number = g_STARTING_MONEY) {
    // start at 0, with default money, and no properties
    this.name = name;
    this.position = 0;
    this.money = money;
    this.properties = new Map<number, Property>();
  }

  // move player position, wraps around the board
  public rollAndMove(dice: number, boardSize: number) {
    this.position = (this.position + dice) % boardSize;
  }

  public canAfford(property: Property) {
    return this.money >= property.price;
  }

  public canRent(property: Property) {
    return !property.rent ? true : this.money >= property.rent;
  }

  public isBankrupt() {
    return this.money < 0;
  }

  public getProperty(position: number): Property | null {
    return this.properties.get(position) || null;
  }

  public ownsProperty(property: Property) {
    // simply check if the property pos is the as any of owned property pos
    return this.properties.has(property.position);
  }

  public buyProperty(property: Property) {
    if (this.canAfford(property)) {
      this.money -= property.price;
      this.properties.set(property.position, property);
    }
  }

  public payRent(owner: Player, rent: Property) {
    if (this.canRent(rent)) {
      this.money -= rent.rent || 0;
      owner.money += rent.rent || 0;
    }
  }
}
