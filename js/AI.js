"use strict";
function AI(ship, targets) {
    this.ship = ship;
    this.targets = targets;
};

AI.prototype = {
    phaseActive: function () {
        for (var i = 0, max = this.targets.length; i < max; i += 1) {
            if (this.targets[i].source.id != this.ship.id) {
                StarSystem.battle.fire(101);
            }
        }
        StarSystem.battle.endPhase();
    }
};
