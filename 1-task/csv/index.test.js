"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert");
const { parseRow, parseCSV, renderCSV } = require("./index.js");

const csv = `city,population,area,density,country
Shanghai,24256800,6340,3826,China
Delhi,16787941,1484,11313,India
Lagos,16060303,1171,13712,Nigeria
Istanbul,14160467,5461,2593,Turkey
Tokyo,13513734,2191,6168,Japan
Sao Paulo,12038175,1521,7914,Brazil
Mexico City,8874724,1486,5974,Mexico
London,8673713,1572,5431,United Kingdom
New York City,8537673,784,10892,United States
Bangkok,8280925,1569,5279,Thailand`;

describe("Parse CSV", () => {
  test("Parse row", () => {
    const header = ["city", "population", "area", "density", "country"];
    const line = "Shanghai,24256800,6340,3826,China";
    const element = parseRow({ line, header });
    const expected = {
      city: "Shanghai",
      population: "24256800",
      area: "6340",
      density: "3826",
      country: "China",
    };
    assert.deepStrictEqual(element, expected);
  });

  test("Parse CSV", () => {
    const { parsed, header } = parseCSV({ csv });
    assert.strictEqual(parsed.length, 10);
    assert.deepStrictEqual(header, [
      "city",
      "population",
      "area",
      "density",
      "country",
    ]);
    assert.deepStrictEqual(parsed[0], {
      city: "Shanghai",
      population: "24256800",
      area: "6340",
      density: "3826",
      country: "China",
    });
  });
});

describe("Render CSV", () => {
  test("Default table", (context) => {
    const consoleTableSpy = context.mock.method(console, "table", () => {});

    renderCSV({
      csv,
      headersToShow: ["city", "density"],
      transformRow: (row) => ({
        ...row,
        population: parseInt(row.population),
        area: parseInt(row.area),
        density: parseInt(row.density),
        city: row.city.trim(),
      }),
      transformTable: (table) =>
        table.toSorted((row1) => (row1.city === "Tokyo" ? -1 : 1)),
    });

    const calls = consoleTableSpy.mock.calls;
    assert.strictEqual(calls.length, 1);
    const mockArguments = calls[0].arguments;
    const [table, properties] = mockArguments;

    assert.deepStrictEqual(table[0], {
      city: "Tokyo",
      population: 13513734,
      area: 2191,
      density: 6168,
      country: "Japan",
    });
    assert.deepStrictEqual(properties, ["city", "density"]);
  });
});
