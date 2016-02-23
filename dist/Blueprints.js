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
    //console.log(canCreateCreep)
    if(isNaN(canCreateCreep)){
      return canCreateCreep;
    }else{
      return false;
    }
}
function setOptions(memory, options){
  if(options.room == false){//Creep is controlled boy worldController instead of RoomController
    memory.world = true
    memory.room = false;
  }
  if(options.room){
    memory.world = false
    memory.room = options.room;
  }
  return memory;
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
  //Level 4 800 ~ 1050


var creeps = {
  "builder" :[//createCreep([WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], undefined, {role: "builder", room:"W13S25", level:2, world: false})
      [WORK, CARRY, CARRY, MOVE],//250
      [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],//550
      [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],//650
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
      [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]//950
    ],
  "upgrader" :[
      [WORK, WORK, CARRY, MOVE],//300
      [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],//550
      [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY,  CARRY, MOVE],//800
      [WORK, WORK, WORK, WORK, WORK, WORK,WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,  CARRY, MOVE],
      [WORK, WORK, WORK, WORK, WORK, WORK,WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,  CARRY, MOVE],//1250
    ],
  "harvester" :[
    [WORK, WORK, MOVE],//250
    [WORK, WORK, WORK, WORK, WORK, MOVE],//550
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],//750
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE],//850
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE]//850
  ],
  "collector" :[
    [CARRY, CARRY, CARRY, CARRY, MOVE],//250
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],//500
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//700
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],//900
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]//1250
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
      [CLAIM, CLAIM, MOVE,MOVE],
      [CLAIM, CLAIM, MOVE,MOVE],
      [CLAIM, CLAIM, MOVE,MOVE],
    ],
  "reserver" :[
      [CLAIM, MOVE],
      [CLAIM, MOVE],
      [CLAIM, CLAIM, MOVE,MOVE],
      [CLAIM, CLAIM, MOVE,MOVE],
      [CLAIM, CLAIM, MOVE,MOVE],
    ],
  "colonizer" :[
    [WORK, CARRY, CARRY, MOVE],//250
    [WORK, WORK, WORK, CARRY, CARRY, MOVE],//450
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],//650
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]//950
    ],
  "guard" :[
     [ATTACK, ATTACK, MOVE],//210
     [MOVE, ATTACK, ATTACK, ATTACK, ATTACK],//370
     [MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, ATTACK, MOVE],////550
     [MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE]//920
  ],
  "soldier" :[
    [RANGED_ATTACK, MOVE],
    [RANGED_ATTACK, RANGED_ATTACK, MOVE],//210
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],//370
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE],
  ],
  "medic" :[
    [HEAL, MOVE]
  ]
}


module.exports = Blueprints;
