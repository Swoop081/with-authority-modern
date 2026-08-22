import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(new URL("../js/tools/card-art-studio.js",import.meta.url),"utf8");

test("v0.13.97 embeds local-file-safe set logos including Cena Season 1",()=>{
  assert.match(source,/const EXPORT_SAFE_SET_LOGOS = \{/);
  for(const id of [
    "season-1-last-time-is-now",
    "new-generation-series-1",
    "attitude-era-series-1",
    "raw-series-1",
    "smackdown-series-1",
    "worlds-collide-series-1",
    "money-in-the-bank-series-1",
    "survivor-series-series-1"
  ]) assert.match(source,new RegExp(`\"${id}\":\"data:image/`));
  assert.doesNotMatch(source,/const KIND_LABELS=\{[^\n]*data:image/);
});

test("v0.13.97 export filenames come from the canonical destination path",()=>{
  assert.match(source,/function exportFilename\(card,extension=\"webp\"\)/);
  assert.match(source,/const target=destinationFor\(card\)\.split\(\"\/\"\)\.pop\(\)/);
  assert.match(source,/name:exportFilename\(card,\"webp\"\)/);
  assert.match(source,/name:exportFilename\(card,\"png\"\)/);
  assert.match(source,/assets\/images\/card-\$\{mode\}-\$\{kind\}-\$\{exportId\(card\)\}\.webp/);
});
