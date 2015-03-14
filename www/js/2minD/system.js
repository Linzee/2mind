$.fn.twoMinDsystem = function (utils, settingsIn) {

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain,
        speed: 30000
    }, settingsIn);

    var systemUpdate = function (block) {

        var pos = utils.getScreenFloatBlockPosition();

        var url = settings.ajax_url + "/wall/system?x=" + pos[0] + "&y=" + pos[1];

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {

            if (data.online) {
                $(".online-counter").text(data.online);
            }
            if (data.forceReload) {
                location.reload();
            }
            if (data.sysmessage) {
                utils.showMessage('System message:', data.sysmessage);
            }
        });
    };

    setInterval(function () {
        systemUpdate();
    }, settings.speed);
};