"use strict";

class CSVParser {
  #csv;
  #transformRow;
  #transformTable;

  constructor(csv, transformRow, transformTable) {
    this.#csv = csv;
    this.#transformRow = transformRow;
    this.#transformTable = transformTable;
  }

  #csvToLines() {
    return this.#csv.split("\n");
  }

  #lineToFields(line) {
    return line.split(",");
  }

  #parseRow(line, header) {
    const fields = this.#lineToFields(line);
    const row = {};
    for (const [index, key] of header.entries()) {
      row[key] = fields[index];
    }
    return row;
  }

  #parseRows(lines, header) {
    const parsed = [];
    for (const line of lines) {
      const row = this.#parseRow(line, header);
      const transformed = this.#transformRow?.(row) || row;
      parsed.push(transformed);
    }
    return parsed;
  }

  parse() {
    const lines = this.#csvToLines();
    const [headerLine, ...dataLines] = lines;
    const header = this.#lineToFields(headerLine);
    const parsed = this.#parseRows(dataLines, header);
    const transformed = this.#transformTable?.(parsed) || parsed;
    return { header, parsed: transformed };
  }
}

class CSVRenderer {
  #parser;

  constructor(parser) {
    this.#parser = parser;
  }

  render({ headersToShow, showTable }) {
    const { header, parsed } = this.#parser.parse();
    const show = showTable || console.table;
    show(parsed, headersToShow || header);
  }
}

module.exports = { CSVParser, CSVRenderer };
