$.fn.twoMinDsystem = function (twoMinD, settingsIn) {

    var settings = $.extend({}, {
        speed: 9999
    }, settingsIn);

    var systemUpdate = function () {

        var pos = twoMinD.utils.getScreenFloatBlockPosition();

        twoMinD.packets.packetSystem(pos[0], pos[1]);
    };

    setInterval(function () {
        systemUpdate();
    }, settings.speed);
};