"use strict";
function Rectangle(x, y, width, height, scale) {
    this.x;
    this.y;
    this.width;
    this.height;
    this.scale;

    this.Set(x, y, width, height, scale);
};

Rectangle.prototype = {
    Set: function (x, y, width, height, scale) {
        this.x = x || 0;
        this.y = y || 0;
        this.width = width;
        this.height = height;

    }

};