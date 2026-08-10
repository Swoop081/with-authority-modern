
import { createProfile, unlockSuperstar } from "../js/data/profile.js";
import { superstars } from "../js/data/superstars.js";
for (const starter of ["cm-punk","roman-reigns"]) {
  const rows=[];
  for (const s of Object.values(superstars)) {
    if (s.id===starter) continue;
    const p=createProfile(starter); unlockSuperstar(p,s.id);
    rows.push([s.id,p.savedDecks[s.id].length,p.deckNeedsCards?.[s.id]??0]);
  }
  console.log(starter, rows);
}
