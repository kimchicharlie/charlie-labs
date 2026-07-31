import assert from "node:assert/strict";
import test from "node:test";
import { createHarmoniousMelody } from "./notes";

test("non-positive melody lengths return an empty sequence", () => {
  assert.deepEqual(createHarmoniousMelody(0), []);
  assert.deepEqual(createHarmoniousMelody(-1), []);
});

test("generated melodies never repeat the same note consecutively", () => {
  for (const difficulty of ["easy", "hard"] as const) {
    const melody = createHarmoniousMelody(100, difficulty, () => 0.5);
    for (let index = 1; index < melody.length; index += 1) {
      assert.notEqual(melody[index].name, melody[index - 1].name);
    }
  }
});

test("hard melodies can start on natural or sharp notes", () => {
  const values = [0, 0.5, 0];
  const naturalStart = createHarmoniousMelody(
    2,
    "hard",
    () => values.shift() ?? 0,
  );
  const sharpStart = createHarmoniousMelody(2, "hard", () => 0);

  assert.equal(naturalStart[0].name, "C4");
  assert.equal(sharpStart[0].name, "G♯3");
});
