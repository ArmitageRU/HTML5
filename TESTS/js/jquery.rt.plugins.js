//----------------- #plugin-tab ----------------------
(function ($) {
    var defaults = {
        tabElS: "tab",
        tabElSClass : "tab-sl",
        tabSwitchS: "tab-s",
        tabSwitchSClass: "tabsw-sl",
        animateTime: 0
    };
    var settings;
    $.fn.tabs = function (options) {
        if (options == undefined || typeof (options) === "object") {
            settings = $.extend({}, defaults, options);
            $("[" + settings.tabSwitchS + "]").on("click", function() {
                $.fn.tabChange(this);
            });
            return this;
        }
        return null;
    };

    $.fn.tabChange = function(tabSw) {
        var selectTabSw = "[" + settings.tabSwitchS + "]." + settings.tabSwitchSClass;
        var selectTabEl = "[" + settings.tabElS + "]." + settings.tabElSClass;
        var num = $(tabSw).attr(settings.tabSwitchS);
        var newtab = $("[" + settings.tabElS + "=" + num + "]");
        
        if (num && newtab!=undefined && num!==$(selectTabSw).attr(settings.tabSwitchS)) {
            $(selectTabEl).animate({ "opacity": 0 }, settings.animateTime, function() {
                $(selectTabSw).removeClass(settings.tabSwitchSClass);
                $(tabSw).addClass(settings.tabSwitchSClass);
                $(selectTabEl).removeClass(settings.tabElSClass).removeAttr("style");
                $(newtab).css("opacity", 0).addClass(settings.tabElSClass).animate({ "opacity": 1 }, settings.animateTime);
            });
        }
        
    }
} (jQuery));