$.fn.twoMinDsettings = function (twoMinD, settingsIn) {

    var settingsForm = this;

    var settings = $.extend({}, {
        template_color: '<a href="#" class="color"></a>'
    }, settingsIn);

    settingsForm.find('.color-selector').each(function (index, colorSelector) {
        $(colorSelector).twoMinDcolorSelector(twoMinD.utils, settings);
    });

    settingsForm.submit(function () {

        var newColor = settingsForm.find(".posts-color .color-field").val();
        var newBackground = settingsForm.find(".background-color .color-field").val();

        saveColor(newColor, newBackground);
        updateBackground(newBackground);

        $('#settingsReveal').foundation('reveal', 'close');

        return false;
    });

    var saveColor = function (color, background) {

        color = color.substring(1);

        twoMinD.packets.packetChangeColor(color, background);
        
    };

    var updateBackground = function (background) {
        
        if(!background)
            return;
        
        var bgq = '';
        if (background.match("^#")) {
            bgq = background;
        } else {
            bgq = 'url(' + background + ')';
        }

        $('#wall').css({
            background: bgq,
            'background-attachment': 'fixed',
            'background-size': 'cover'
        });
    };

    var savedBackground = settingsForm.find(".background-color .color-field").val();
    if (savedBackground) {
        updateBackground(savedBackground);
    }
};

$.fn.twoMinDcolorSelector = function () {

    var colorsSelector = this;
    
    colorsSelector.find(".colors li a").each(function (index, el) {

        var c = $(el);

        c.css("background", c.text());

        c.click(function (event) {
            colorsSelector.find(".color-field").val(c.text());

            colorsSelector.find(".colors li a.selected").removeClass('selected');
            $(this).addClass('selected');

            event.preventDefault();
        });
    });
};