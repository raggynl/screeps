var CreepHarvester = require('CreepHarvester');
var CreepSoldier = require('CreepSoldier');
var CreepGuard = require('CreepGuard');
var CreepMedic = require('CreepMedic');
var CreepCollector = require('CreepCollector');
var CreepUpgrader = require('CreepUpgrader');
var CreepClaimer = require('CreepClaimer');
var CreepBuilder = require('CreepBuilder');
var CreepScout = require('CreepScout');
function CreepFactory(creep, room){
  switch (creep.memory.role) {
    case "harvester":
      return new CreepHarvester(creep, room);
      break;
    case "collector":
      return new CreepCollector(creep, room);
      break;
    case "soldier":
      return new CreepSoldier(creep, room);
      break;
    case "guard":
      return new CreepGuard(creep, room);
      break;
    case "medic":
      return new CreepMedic(creep, room);
      break;
    case "builder":
      return new CreepBuilder(creep, room);
      break;
    case "upgrader":
      return new CreepUpgrader(creep, room);
      break;
    case "claimer":
      return new CreepClaimer(creep, room);
      break;
    case "scout":
      return new CreepScout(creep, room);
      break;
    default:
      return
  }

}



module.exports = CreepFactory;
