"use strict";
if (!requestAnimationFrame) {
    requestAnimationFrame = (function () {
        return webkitRequestAnimationFrame ||
            mozRequestAnimationFrame ||
            oRequestAnimationFrame ||
            msRequestAnimationFrame ||
            function (callback, element) {
                setTimeout(callback, 1000 / 60);
            };
    })();
}

/*Object.prototype.setProperty = function(object, add) {
    if (add !== true) add = false;
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            if (typeof this[key] !== 'undefined' || add) {
                this[key] = object[key];
            }
        }
    }
    return this;
}*/

function shuffle(array) {
    var len = array.length,
        i = len,
        p,
        t;
    while (i-=1) {
        p = Math.floor(Math.random() * len);
        t = array[i];
        array[i] = array[p];
        array[p] = t;
    }
    return true;
}

function textWidth(ctx, font, text) {
    if (font != null) {
        ctx.font = font;
    } else {
        ctx.font = '12pt Courier New';
    }
    var metrics = ctx.measureText(text);
    var text_width = ~~(metrics.width);
    return text_width;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}