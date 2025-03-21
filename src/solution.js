"use strict";

const { renderCSV } = require("./csv");
const { CSVParser, CSVRenderer } = require("./csv-OOP");

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

const transformRow = (row) => ({
  city: row.city,
  population: parseInt(row.population),
  area: parseInt(row.area),
  density: parseInt(row.density),
  country: row.country,
});

const computeDensityRatio = (density, max) => {
  const multiplier = 100;
  return Math.round((density * multiplier) / max);
};

const transformTable = (table) => {
  const max = Math.max(...table.map((row) => row.density));
  const withRatio = table.map((row) => {
    const densityRatio = computeDensityRatio(row.density, max);
    return { ...row, densityRatio };
  });
  withRatio.pop();
  const sorted = withRatio.sort(
    (row1, row2) => row2.densityRatio - row1.densityRatio
  );

  return sorted;
};

const showTable = (table) => {
  const configs = [
    { key: "city", pad: "end", width: 18 },
    { key: "population", pad: "start", width: 10 },
    { key: "area", pad: "start", width: 8 },
    { key: "density", pad: "start", width: 8 },
    { key: "country", pad: "start", width: 18 },
    { key: "densityRatio", pad: "start", width: 6 },
  ];
  for (const row of table) {
    let message = "";
    for (const config of configs) {
      const value = row[config.key];
      const pad = config.pad === "end" ? "padEnd" : "padStart";
      message += value.toString()[pad](config.width);
    }
    console.log(message);
  }
};

// Initial implementation
renderCSV({ csv, transformRow, transformTable, showTable });

// OOP implementation
const parser = new CSVParser(csv, transformRow, transformTable);
const renderer = new CSVRenderer(parser);
renderer.render({ showTable });
