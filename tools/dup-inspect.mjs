
import {cards} from "../js/data/cards.js";
import {hallCards as H} from "../js/data/hall-of-fame-cards.js";
import {evolutionCards as E} from "../js/data/evolution-cards.js";
for(const [n,a,b] of [
 ["Bodyslam",cards.bodyslam,H.bodyslam],
 ["Clothesline",cards.clothesline,H.clothesline],
 ["DDT",cards.ddt,H.ddt],
 ["Snapmare",cards.snapmare,E.snapmare],
 ["German",cards.germanSuplexCommon,E.germanSuplex],
 ["Backbreaker",cards.backbreaker,E.backbreaker]
]) console.log(n,JSON.stringify(a),JSON.stringify(b));
