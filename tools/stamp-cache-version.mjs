import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const version = pkg.version;
const stamp = `v=${version}`;

function textFile(relative) {
  return new URL(relative, root);
}
function rewrite(relative, transform) {
  const url = textFile(relative);
  const before = readFileSync(url, "utf8");
  const after = transform(before);
  if (after !== before) writeFileSync(url, after);
}
function walk(dirUrl, predicate) {
  const path = dirUrl.pathname;
  const out = [];
  for (const name of readdirSync(path)) {
    const full = join(path, name);
    if (statSync(full).isDirectory()) out.push(...walk(new URL(`${name}/`, dirUrl), predicate));
    else if (predicate(full)) out.push(full);
  }
  return out;
}
function stampSpecifier(source) {
  return source.replace(/(["'])(\.\.?\/[^"']+\.js)(?:\?v=[^"']*)?\1/g, (_m, quote, path) => `${quote}${path}?${stamp}${quote}`);
}

// Every browser module in the dependency graph gets a versioned specifier, not
// just app.js, so Safari cannot reuse a stale child module after a deployment.
for (const full of walk(new URL("../js/", import.meta.url), p => extname(p) === ".js" && !p.endsWith("/tools/card-art-studio.js"))) {
  const before = readFileSync(full, "utf8");
  const after = stampSpecifier(before);
  if (after !== before) writeFileSync(full, after);
}

rewrite("index.html", source => source
  .replace(/(href|src)="(\.\/[^"?]+\.(?:css|js|png|webmanifest))(?:\?v=[^"]*)?"/g, (_m, attr, path) => `${attr}="${path}?${stamp}"`)
);
rewrite("tools/card-art-studio.html", source => source
  .replace(/(href|src)="(\.\.\/[^"?]+\.(?:css|js))(?:\?v=[^"]*)?"/g, (_m, attr, path) => `${attr}="${path}?${stamp}"`)
);
rewrite("manifest.webmanifest", source => source
  .replace(/("src"\s*:\s*")([^"?]+\.png)(?:\?v=[^"]*)?"/g, (_m, prefix, path) => `${prefix}${path}?${stamp}"`)
);
rewrite("js/config/build.js", source => source.replace(/BUILD_VERSION = "[^"]+"/, `BUILD_VERSION = "${version}"`));
rewrite("js/tools/card-art-studio.js", source => source
  .replace(/Card Art Studio — v[^\n]+/, `Card Art Studio — v${version}`)
  .replace(/const BUILD_VERSION="[^"]+";/, `const BUILD_VERSION="${version}";`)
);
rewrite("tools/card-art-studio.html", source => source.replace(/<span class="studio-build">v[^<]+<\/span>/, `<span class="studio-build">v${version}</span>`));

console.log(`Stamped browser cache version ${version}.`);
