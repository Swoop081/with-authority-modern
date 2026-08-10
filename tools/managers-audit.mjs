
import { superstars } from "../js/data/superstars.js";
for(const s of Object.values(superstars)){
 if(s.managerId||s.managerIds||s.manager) console.log(s.id,JSON.stringify({managerId:s.managerId,managerIds:s.managerIds,manager:s.manager}));
}
