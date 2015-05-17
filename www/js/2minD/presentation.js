$.fn.twoMinDpresentation = function (twoMinD, settingsIn) {

    var blocksHolder = this;
    var presentationLoaded = false;
    var currentSlide = -1;
    var controlLocked = false;

    var settings = $.extend({}, {
        block_size: 2100,
        autoplay: true,
        moveSpeed: 800,
        autoplay_speed: 2000
    }, settingsIn);
    
    var slides = [
        {x: 0.5, y: 0.1},
        {x: 0.5, y: 0.5},
        {x: -0.5, y: 0.5}
    ];
    var blocks = {
        'block_0_0': function () {
            /*
             * block_0_0
             */

            var xlogo = $('<h1 class="logo"><sup>2</sup><span class="anim">min</span><sub>D</sub></h1>');
            xlogo.css({
                'color': 'white',
                'text-align': 'center',
                'font-size': 200
            });
            blocksHolder.find("#block_0_0").append(xlogo);

            var xme = $('<h2 class="logo">Dominik Gmiterko</h2>');
            xme.css({
                'color': '#F93',
                'text-align': 'center'
            });
            blocksHolder.find("#block_0_0").append(xme);
        },
        'block_-1_0': function () {
            /*
             * block_-1_0
             */

            var xuses = $('<div class="row">' +
                    '<div class="small-4 columns">' +
                    '<img src="' + settings.ajax_url + '/images/presentation/vyuzitie/komunikacia.svg" />' +
                    '</div>' +
                    '<div class="small-8 columns">' +
                    '<h4>Komunikácia</h4>' +
                    '<p>Na tejto stranke mozu prebiehat akekolvek rozhovory.</p>' +
                    '<ul><li>Priklady</li><li>Priklady</li><li>Priklady</li></ul>' +
                    '</div>' +
                    '</div>');
            xuses.css({
                'margin-top': 1000
            });
            xuses.find("img").css({
                'float': 'right'
            });

            blocksHolder.find("#block_-1_0").append(xuses);
        }
    };

    var loadPresentation = function () {
        $.each(blocks, function (index, blockFunction) {
            blockFunction();
        });
    };

    blocksHolder.on("blockCreated", function (event, blockId) {
        if (presentationLoaded) {
            var blockFunction = blocks[blockId];
            if (blockFunction) {
                blockFunction();
            }
        }
    });


    var goToSlide = function () {

        var x = $(window).width() / 2;
        var y = $(window).height() / 2;

        x += -1 * slides[currentSlide].x * settings.block_size;
        y += -1 * slides[currentSlide].y * settings.block_size;

        controlLocked = true;

        $(blocksHolder).animate({
            left: x,
            top: y
        }, settings.moveSpeed, function () {
            controlLocked = false;
        });

    };

    var next = function () {

        if (controlLocked) {
            return;
        }

        if (currentSlide < slides.length - 1) {
            currentSlide++;
            goToSlide();
        }
    };

    var prev = function () {

        if (controlLocked) {
            return;
        }

        if (currentSlide > 0) {
            currentSlide--;
            goToSlide();
        }
    };

    var startPresentation = function () {

        if (currentSlide >= 0) {
            return; //already started
        }

        currentSlide = 0;

        goToSlide();

        $(document).keydown(function (e) {

            switch (e.which) {
                case 37: // left
                    prev();
                    break;

                case 39: // right
                    next();
                    break;
            }
            ;

        });
    };

    $(".start-presentation").click(function () {
        if (!presentationLoaded) {
            loadPresentation();
            presentationLoaded = true;
        }
        startPresentation();
    });
};