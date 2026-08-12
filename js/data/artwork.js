import { assetUrl } from "../config/build.js";

const portraits = {
  "cody-rhodes": "assets/art/summerslam-series-1/superstars/cody-rhodes.webp",
  "cm-punk": "assets/art/summerslam-series-1/superstars/cm-punk.webp",
  "roman-reigns": "assets/art/summerslam-series-1/superstars/roman-reigns.webp",
  "seth-rollins": "assets/art/summerslam-series-1/superstars/seth-rollins.webp",
  "oba-femi": "assets/art/summerslam-series-1/superstars/oba-femi.webp",
  "brock-lesnar": "assets/art/summerslam-series-1/superstars/brock-lesnar.webp",
  "kevin-owens": "assets/art/summerslam-series-1/superstars/kevin-owens.webp",
  "gunther": "assets/art/summerslam-series-1/superstars/gunther.webp",
  "hulk-hogan": "assets/art/wwe-profile-portraits/hulk-hogan.png",
  "andre-the-giant": "assets/art/wwe-profile-portraits/andre-the-giant.png",
  "randy-savage": "assets/art/wwe-profile-portraits/randy-savage.png",
  "ultimate-warrior": "assets/art/wwe-profile-portraits/ultimate-warrior.png",
  "stone-cold-steve-austin": "assets/art/wwe-profile-portraits/stone-cold-steve-austin.png",
  "the-undertaker": "assets/art/wwe-profile-portraits/the-undertaker.png",
  "mankind": "assets/art/wwe-profile-portraits/mankind.png",
  "kane": "assets/art/wwe-profile-portraits/kane.png",
  "rhea-ripley": "assets/art/wwe-profile-portraits/rhea-ripley.png",
  "liv-morgan": "assets/art/wwe-profile-portraits/liv-morgan.png",
  "becky-lynch": "assets/art/wwe-profile-portraits/becky-lynch.png",
  "bayley": "assets/art/wwe-profile-portraits/bayley.png",
  "charlotte-flair": "assets/art/wwe-profile-portraits/charlotte-flair.png",
  "iyo-sky": "assets/art/wwe-profile-portraits/iyo-sky.png",
  "paige": "assets/art/wwe-profile-portraits/paige.png",
  "stephanie-vaquer": "assets/art/wwe-profile-portraits/stephanie-vaquer.png",
  "the-rock": "assets/art/wwe-profile-portraits/the-rock.png"
};

export const superstarArtwork = Object.fromEntries(Object.entries(portraits).map(([id,path]) => [id, assetUrl(path)]));
