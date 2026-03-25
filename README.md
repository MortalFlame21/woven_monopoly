# Woven Monopoly

A Node Woven Software Monopoly CLI Program. The program simply outputs the following rolls and the actions.

## Requirements

- Node 24+.

## Rules

1. There are four players: Peter, Billy, Charlotte, Sweedal.
2. Each player starts with $16.
3. Everyone starts on GO tile.
4. You get $1 when you pass GO (this excludes your starting move).
5. If you land on a property, you _must_ buy it.
6. If you land on an owned property, you must pay rent to the owner.
7. If the same owner owns all property of the same colour, the rent is doubled.
8. Once someone is bankrupt, whoever has the most money remaining is the winner.
9. There are no chance cards, jail or stations.
10. The board wraps around (i.e. you get to the last space, the next space is the first space).

## How to play

The game requires dice rolls ahead of time, a JSON array of numbers should be created to store such rolls. Additionally, a board game must be loaded from a JSON array of objects. See [Options](#options) for more.

```shell
npm i
npm run build
npm run start -- <OPTIONS> <BOARD> <ROLLS>
```

## Options

The [`<OPTIONS>`](#options-1) command-line are used for usage and checking versioning of program.

The [`<BOARD>`](#board) is a valid path to a non-empty JSON array of objects.

The [`<ROLLS>`](#rolls) is a valid path to a non-empty JSON array of positive integer numbers.

Additionally, see `eg/` for sample `<BOARD>` and `<ROLLS>` JSON files.

### `<OPTIONS>`

```shell
<OPTIONS>:
    -v, --version             Output the version number
    -h, --help                Display help for command
```

### `<BOARD>`

`<BOARD>` must be a valid non-empty JSON object array of objects. Valid object syntax would look similar to the following.

```jsonc
[
  {
    "name": "GO", // string
    "type": "go", // string
  },
  {
    "name": "name",
    "price": 1, // int
    "colour": "colour", // string
    "type": "type",
  },
  // ...
]
```

There should ALWAYS be only one object with field of `"type: "go"` in the array. This object MUST always be the first object of the array.

A valid `<BOARD>` file would look similar to the following.

```jsonc
[
  {
    "name": "GO",
    "type": "go",
  },
  {
    "name": "The Burvale",
    "price": 1,
    "colour": "Brown",
    "type": "property",
  },
  {
    "name": "Fast Kebabs",
    "price": 1,
    "colour": "Brown",
    "type": "property",
  },
  {
    "name": "The Grand Tofu",
    "price": 2,
    "colour": "Red",
    "type": "property",
  },
  {
    "name": "Lanzhou Beef Noodle",
    "price": 2,
    "colour": "Red",
    "type": "property",
  },
]
```

### `<ROLLS>`

A valid `<ROLLS>`. Must be a valid non-empty JSON array of positive integer numbers, it would look similar to the following.

```jsonc
[1, 2, 3, 4, 5, 6]
```

## Design decisions

I wanted this to be a type-safe program, I thus chose to use TypeScript. Having the requirements to enter a JSON path, I knew I needed a safe parsing library to use. Having experience with [Zod](https://zod.dev/), it was a easy choice for schema validation regarding the JSON path inputs. To easily parse arguments and possibly have the option to print verbosly or not, [Commander.js](https://github.com/tj/commander.js/) was used.

`schema.ts`, defines the structure of the types including `board`, `tiles`, `player`. `game.ts`, is a class that defines the game, how players move along the board, how/what action to take when landing on a tile. `player.ts`, is a class that defines a player, keeping track of their properties and how much money they have.

To move along the board, a simple circular buffer data structure was used along with a increment that uses modulo arithmetic to calculate the position along the board. A log message is printed to showcase which tile is landed on.

To keep track of properties, initially it was both the game and players responsibility to keep track, however, this caused high coupling within the code, I simply handed keeping track over to the player of there properties. However, to keep track of rent, I found it easier to simply let the game have a method to calculate the rent.

To win the game the first as per rule 8 (see [rules](#rules)), the player with the most money wins, the game tracks whether a `"BANKRUPT"` `GameAction` was returned from `Game.tileAction()`. A leaderboard position is printed to see which player won the game.

## Improvements

Being a short project, I wanted to have a simple design. However, to improve extensibility, OOP and polymorphism can be used to simply extend `Tile` actions and features. This approach would allow to extend different tile types. Moreover, instead of creating various branches in `Game.tileAction()`, polymorphism can be used on the derived classes of `Tile`, calling `Tile.onLand()`.

Tests, possibility using a framework such as [Vitest](https://vitest.dev/), could be used to test `Game` and `Player` class logic.
