"use strict";
function AI(ship, targets) {
    this.ship = ship;
    this.targets = targets;
};

AI.prototype = {
    phaseActive: function () {
        var first = true;
		for (var i = 0, max = this.targets.length; i < max; i += 1) {
            if (this.targets[i].object.id != this.ship.id) {
				StarSystem.battle.refreshSelectedShip(this.targets[i].object.id);
				if(first){
					StarSystem.battle.fire(this.ship.slots[1].weapon.id+'_'+this.ship.slots[1].weapon.energy);
					first=false;
				}
                StarSystem.battle.fire(this.ship.slots[0].weapon.id+'_'+this.ship.slots[0].weapon.energy);
            }
			//var t0 = performance.now(),
            //    t1;
            //console.log(t0);
            //while (true) {
            //    t1 = performance.now();
            //    if ((t1 - t0) > 1000) break;
            //}
            
        }
        //StarSystem.battle.endPhase();
    }
};
