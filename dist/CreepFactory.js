var CreepHarvester = require('CreepHarvester');
var CreepSoldier = require('CreepSoldier');
var CreepGuard = require('CreepGuard');
var CreepMedic = require('CreepMedic');
var CreepCollector = require('CreepCollector');
var CreepUpgrader = require('CreepUpgrader');
var CreepClaimer = require('CreepClaimer');
var CreepBuilder = require('CreepBuilder');
var CreepScout = require('CreepScout');
var CreepColonizer = require('CreepColonizer');
var CreepReserver = require('CreepReserver')
function CreepFactory(creep, room, world){
  switch (creep.memory.role) {
    case "harvester":
      return new CreepHarvester(creep, room, room.worldCtrl);
      break;
    case "collector":
      return new CreepCollector(creep, room, room.worldCtrl);
      break;
    case "soldier":
      return new CreepSoldier(creep, room, room.worldCtrl);
      break;
    case "guard":
      return new CreepGuard(creep, room, room.worldCtrl);
      break;
    case "medic":
      return new CreepMedic(creep, room, room.worldCtrl);
      break;
    case "builder":
      return new CreepBuilder(creep, room, room.worldCtrl);
      break;
    case "upgrader":
      return new CreepUpgrader(creep, room, room.worldCtrl);
      break;
    case "claimer":
      return new CreepClaimer(creep, room, room.worldCtrl);
      break;
    case "colonizer":
      return new CreepColonizer(creep, room, room.worldCtrl);
      break;
    case "reserver":
      return new CreepReserver(creep, room, room.worldCtrl)
      break;
    case "scout":
      return new CreepScout(creep, room, room.worldCtrl);
      break;
    default:
      return
  }

}



module.exports = CreepFactory;
