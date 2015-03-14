$.fn.twoMinDsettings = function (utils, settingsIn) {

    var settingsForm = this;

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain + '/wall/',
        template_color: '<a href="#" class="color"></a>'
    }, settingsIn);

    settingsForm.find('.color-selector').each(function (index, colorSelector) {
        $(colorSelector).twoMinDcolorSelector(utils, settings);
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

        var url = settings.ajax_url + "changeColor?color=" + encodeURIComponent(color) + '&background=' + encodeURIComponent(background);

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {
            if (data.response !== 'success') {
                utils.showMessage('Something weird happend!', '(' + data.response + ') ' + data.message);
            }
        });

    };

    var updateBackground = function (background) {
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

$.fn.twoMinDcolorSelector = function (utils, settingsIn) {

    var settings = $.extend({}, {
        template_color: '<a href="#" class="color"></a>'
    }, settingsIn);

    var colorsSelector = this;

    var randomizeColors = function () {

        var colors = colorsSelector.find(".colors");

        colors.empty();

        for (i = 0; i < 4; i++) {
            var color = '#' + randomColor();

            var itema = $(settings.template_color);

            itema.text(color);
            itema.css('background-color', color);
            itema.attr('data-color', color);

            var item = $('<li></li>');
            item.append(itema);
            colors.append(item);
        }

        colorsSelector.find(".colors li a").click(function (event) {

            colorsSelector.find(".color-field").val($(this).attr('data-color'));

            colorsSelector.find(".colors li a.selected").removeClass('selected');
            $(this).addClass('selected');

            event.preventDefault();
        });
    };

    var randomColor = function () {
        return (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    };

    colorsSelector.find(".randomize-colors").click(function () {
        randomizeColors();
        event.preventDefault();
    });

    randomizeColors();
};