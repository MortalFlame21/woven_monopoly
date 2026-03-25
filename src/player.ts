import type { Property } from "./schema.js";

// a class similar to Player type
export class Player {
  private static nextId: number = 0;

  id: number;
  name: string;
  position: number;
  money: number;
  // property pos : property
  properties: Map<number, Property>;

  constructor(name: string, money: number) {
    // start at 0, with default money, and no properties
    this.id = ++Player.nextId;
    this.name = name;
    this.position = 0;
    this.money = money;
    this.properties = new Map<number, Property>();
  }

  // move player position, wraps around the board
  // check also if move resulted in landing past go
  public rollAndMove(dice: number, boardSize: number) {
    const newPosition = (this.position + dice) % boardSize;
    // we wrapped back and passed go
    const passedGo = newPosition < this.position && newPosition > 0;
    this.position = newPosition;
    return passedGo;
  }

  public canAfford(property: Property) {
    return this.money >= property.price;
  }

  public canRent(rentAmount: number) {
    return this.money >= rentAmount;
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

  // no need for check buy rules state we MUST buy property
  public buyProperty(property: Property) {
    this.money -= property.price;
    this.properties.set(property.position, property);

    console.log(
      `${this.name} buys ${property.name} for $${property.price} (balance: $${this.money})`,
    );
  }

  // same with property, we MUST buy
  public payRent(owner: Player, rentAmount: number) {
    this.money -= rentAmount;
    owner.money += rentAmount;

    console.log(
      `${this.name} pays $${rentAmount} rent to ${owner.name} (balance: $${this.money})`,
    );
  }

  public collectGo() {
    this.money += 1;

    console.log(`${this.name} passes GO and collects $1`);
  }
}
