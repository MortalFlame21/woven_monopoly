# Woven Monopoly

A Node Woven Software Monopoly CLI Program.

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
npm build
npm start -- <OPTIONS> <BOARD> <ROLLS>
```

### Options

The [`<OPTIONS>`](#options-1) command-line are used for usage and checking versioning of program.

The [`<BOARD>`](#board) is a valid path to a non-empty JSON array of objects.

The [`<ROLLS>`](#rolls) is a valid path to a non-empty JSON array of positive integer numbers.

#### `<OPTIONS>`

```shell
<OPTIONS>:
    -v, --version             Output the version number
    -h, --help                Display help for command
```

#### `<BOARD>`

`<BOARD>` must be a valid non-empty JSON object array of objects. Valid object syntax would look similar to the following.

```json
[
  {
    "name": "GO", // string
    "type": "go" // string
  },
  {
    "name": "name",
    "price": 1, // int
    "colour": "colour", // string
    "type": "type"
  }
  // ...
]
```

There should ALWAYS be only one object with field of `"type: "go"` in the array. This object MUST always be the first object of the array.

A valid `<BOARD>` file would look similar to the following.

```json
[
  {
    "name": "GO",
    "type": "go"
  },
  {
    "name": "The Burvale",
    "price": 1,
    "colour": "Brown",
    "type": "property"
  },
  {
    "name": "Fast Kebabs",
    "price": 1,
    "colour": "Brown",
    "type": "property"
  },
  {
    "name": "The Grand Tofu",
    "price": 2,
    "colour": "Red",
    "type": "property"
  },
  {
    "name": "Lanzhou Beef Noodle",
    "price": 2,
    "colour": "Red",
    "type": "property"
  }
]
```

#### `<ROLLS>`

A valid `<ROLLS>`. Must be a valid non-empty JSON array of positive integer numbers, it would look similar to the following.

```json
[1, 2, 3, 4, 5, 6]
```
