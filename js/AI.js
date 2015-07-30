"use strict";
function AI(ship, targets) {
    this.ship = ship;
    this.targets = targets;
};

AI.prototype = {
    phaseActive: function () {
        for (var i = 0, max = this.targets.length; i < max; i += 1) {
            if (this.targets[i].object.id != this.ship.id) {
                StarSystem.battle.refreshSelectedShip(this.targets[i].object.id);
                StarSystem.battle.fire(101);
            }

            //var t0 = performance.now(),
            //    t1;
            //console.log(t0);
            //while (true) {
            //    t1 = performance.now();
            //    if ((t1 - t0) > 1000) break;
            //}
            
        }
        StarSystem.battle.endPhase();
    }
};
