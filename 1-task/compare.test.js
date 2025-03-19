"use strict";

const { describe, test } = require("node:test");
const assert = require("node:assert");

describe("Compare initial and refactored implementations", () => {
  test("Produce the same output", (context) => {
    const initialOutput = [];
    context.mock.method(console, "log", (message) => {
      initialOutput.push(message);
    });

    require("./task.js");

    const refactoredOutput = [];
    context.mock.method(console, "log", (message) => {
      refactoredOutput.push(message);
    });

    require("./solution.js");

    assert.deepStrictEqual(initialOutput, refactoredOutput);
  });
});
