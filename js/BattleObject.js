"use strict";
function BattleObject(object, align, render) {
    this.object = object;
    this.render = render;
    this.align = align || 0;//0 нейтрален, 1 — союзник, -1 — враг
};

BattleObject.prototype = {
     
};