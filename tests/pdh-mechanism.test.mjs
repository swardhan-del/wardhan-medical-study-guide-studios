import test from "node:test";
import assert from "node:assert/strict";
import { countPdhCarbon } from "../src/lib/pdh-mechanism.ts";

test("PDH substrate carbon is conserved across every supported completed-reaction count", () => {
  for (let n = 1; n <= 12; n++) {
    const balance = countPdhCarbon(String(n));
    assert.deepEqual(balance, { reactions: n, inputCarbon: 3 * n, acetylCarbon: 2 * n, carbonDioxideCarbon: n });
    assert.equal(balance.inputCarbon, balance.acetylCarbon + balance.carbonDioxideCarbon);
  }
});

test("No ledger is calculated from absent, fractional, nonfinite or out-of-range input", () => {
  for (const raw of ["", " ", "0", "13", "-1", "1.5", "NaN", "Infinity", "not a count", "1e999"]) assert.equal(countPdhCarbon(raw), null, raw);
});
