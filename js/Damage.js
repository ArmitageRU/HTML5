"use strict";
function Damage() {
    if (!(this instanceof Damage)) {
        return new Damage();
    }
};

Damage.prototype = {
    GetDamage: function (ship, weapon, barrels) {
        var return_struct = {
            hint: 'normal',
            damage: 0
        },
            damage = 0;
        switch (weapon.type) {
            case 'beam':
                var roll1 = this.RollDice(2, 8) - 3,
                    roll2 = this.RollDice(2, 8) - 3,
                    //roll3 = this.RollDice(1, 8) - 3,
                    lazer_dmg = 150;

                //damage = roll1 + roll2 + roll3;

                //damage = damage -Math.min(Math.min(roll1, roll2), roll3) + this.RollDice(1, 8);
                damage = Math.min(roll1, roll2);
                if (damage < 0) {
                    return_struct.hint = 'guard';
                    damage = 0;
                }
                else if (damage == 0) {
                    return_struct.hint = 'miss';
                }
                if (Math.round(getRandomArbitrary(0,100)) < 5) {
                    //Console.Write("CRITICAL HIT");
                    return_struct.hint = 'crit';
                    damage += this.RollDice(1, 8) + 10;
                }
                /*ship.life.current*/damage = damage * lazer_dmg * 0.1;
                break;
            case 'beam':
                damage = 0;
                break;
            case 'rocket':
                damage = 0;
                break;
            case 'plasma':
                damage = 0;
                break;
            case 'pulse_beam':
                damage = 0;
                break;
            default:
                break;
        }
        return_struct.damage = damage;
        return return_struct;
    },

    RollDice: function (N, S) {
        var die_sum = 0;
        
        for (var i = 0; i < N; i++) {
            die_sum += Math.round(getRandomArbitrary(0, S + 1));
        }
        return die_sum;
    }

};