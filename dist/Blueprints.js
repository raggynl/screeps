function Blueprints(spawn, creepType, level, options){
    var creepTiers = creeps[creepType];
    var lev = level-1
    var buildLevel = lev
    if(creepTiers.length <= lev){
      buildLevel =creepTiers.length-1
    }
    //console.log("build level",buildLevel)
    var memory = {}
    memory.role = creepType;
    memory.level = buildLevel+1;
    if(options)
      memory = setOptions(memory, options)
    var body = creeps[creepType][buildLevel];
    var canCreateCreep = spawn.createCreep(body, undefined, memory);
    if(canCreateCreep == 0){
      return true;
    }else{
      return false;
    }
}
function setOptions(memory, options){
  if(options.world){//Creep is controlled boy worldController instead of RoomController
    memory.world = true
  }
}
// TOUGH          10
	// MOVE           50
	// CARRY          50
	// ATTACK         80
	// WORK           100
	// RANGED_ATTACK  150
	// HEAL           200

  //Level 1 0 ~ 300
  //level 2 300 ~ 550
  //Level 3 550 ~ 800
  //Level 5 800 ~ 1050
var creeps = {
  "builder" :[
      [WORK, CARRY, CARRY, MOVE],//250
      [WORK, WORK, WORK, CARRY, CARRY, MOVE],//450
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]//650
    ],
  "upgrader" :[
      [WORK, WORK, CARRY, MOVE],//300
      [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],//550
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE,  MOVE, MOVE],//800
    ],
  "harvester" :[
    [WORK, WORK, MOVE],//250
    [WORK, WORK, WORK, WORK, WORK, MOVE],//550
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],//750
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE]//1050
  ],
  "collector" :[
    [CARRY, CARRY, CARRY, CARRY, MOVE],//250
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],//500
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//700
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//900
  ],
  "scout" :[
    [MOVE, MOVE],
    [MOVE, MOVE],
    [MOVE, MOVE],
    [MOVE, MOVE],
    [MOVE, MOVE]
  ],
  "claimer" :[
      [CLAIM, MOVE],
      [CLAIM, MOVE],
      [CLAIM, MOVE]
    ],
  "guard" :[
     [ATTACK, ATTACK, MOVE]
  ],
  "soldier" :[
   [RANGED_ATTACK, MOVE]
  ],
  "medic" :[
    [HEAL, MOVE]
  ]
}


module.exports = Blueprints;
