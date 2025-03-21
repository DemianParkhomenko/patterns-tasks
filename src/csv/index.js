"use strict";

const csvToLines = (csv) => csv.split("\n");

const lineToFields = (line) => line.split(",");

const parseRow = ({ line, header }) => {
  const fields = lineToFields(line);
  const row = {};
  for (const [index, value] of header.entries()) {
    row[value] = fields[index];
  }
  return row;
};

const parseRows = ({ lines, header, transformRow }) => {
  const parsed = [];
  for (const line of lines) {
    const row = parseRow({ line, header });
    const transformed = transformRow?.(row) || row;
    parsed.push(transformed);
  }
  return parsed;
};

const parseCSV = ({ csv, transformRow, transformTable }) => {
  const [firstLine, ...lines] = csvToLines(csv);
  const header = lineToFields(firstLine);
  const parsed = parseRows({ lines, header, transformRow });
  const transformed = transformTable?.(parsed) || parsed;
  return { parsed: transformed, header };
};

const renderCSV = ({
  csv,
  transformRow,
  transformTable,
  headersToShow,
  showTable,
}) => {
  const { parsed, header } = parseCSV({ csv, transformRow, transformTable });
  const show = showTable || console.table;
  show(parsed, headersToShow || header);
};

module.exports = { parseRow, parseCSV, renderCSV };
