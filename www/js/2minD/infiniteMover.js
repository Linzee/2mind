$.fn.twoMinDinfiniteMover = function (settingsIn) {

    var mover = this;

    var settings = $.extend({}, {
        target: null,
        draggDelay: 100,
        draggDistance: 5,
        //zoom
        zoomEnabled: false,
        zoom_min: 0.4,
        zoom_start: 1,
        zoom_max: 3,
        //control
        arrowKeysSpeed: 40,
        mousewheelEnabled: true,
        mousewheelMoveSpeed: 12.6
    }, settingsIn);

    var fixedPosition = {
        top: 0,
        left: 0
    };
    var zoom = settings.zoom_start;

    var onDrag = function (event, ui) {
        settings.target.offset(zoomPos(addPos(fixedPosition, ui.position)));
    };

    var onStop = function (event, ui) {
        fixedPosition = addPos(fixedPosition, ui.position);
        updatePosition();
        mover.css({
            top: 0,
            left: 0
        });
    };

    var onStopTarget = function (event, ui) {
        fixedPosition = ui.position;
    };

    var addPos = function (pos1, pos2) {
        return {
            top: pos1.top + pos2.top,
            left: pos1.left + pos2.left
        };
    };

    var zoomPos = function (pos) {
        return {
            top: pos.top / zoom,
            left: pos.left / zoom
        };
    };

    var updatePosition = function () {
        settings.target.offset(zoomPos(fixedPosition));
    };

    mover.draggable({
        drag: onDrag,
        stop: onStop,
        delay: settings.draggDelay,
        distance: settings.draggDistance
    });

    settings.target.draggable({
        stop: onStopTarget,
        delay: settings.draggDelay,
        distance: settings.draggDistance
    });

    settings.target.on("forceUpdateFixedPos holderMoved", function () {
        fixedPosition = settings.target.position();
    });

    if (settings.zoomEnabled) {
        $(document).bind('mousewheel', function (e) {

            var d = e.deltaY;

            var zoomChange = Math.min(Math.abs(d / 100), 0.2);

            if (d < 0) {
                zoomChange *= -1;
            }

            zoom += zoomChange;

            if (zoom < settings.zoom_min) {
                zoom = settings.zoom_min;
            }

            if (zoom > settings.zoom_max) {
                zoom = settings.zoom_max;
            }

            settings.target.css({
                transform: 'scale(' + zoom + ')'
            });
        });
    }

    if (settings.mousewheelEnabled) {
        $(document).bind('mousewheel', function (e) {

            var dx = Math.min(Math.abs(e.deltaX / 50), 1.0);
            var dy = Math.min(Math.abs(e.deltaY / 50), 1.0);

            if (e.deltaX < 0) {
                dx *= -1;
            }
            if (e.deltaY < 0) {
                dy *= -1;
            }

            var pos = settings.target.position();

            settings.target.css({
                top: pos.top + e.deltaY * settings.mousewheelMoveSpeed,
                left: pos.left + e.deltaX * settings.mousewheelMoveSpeed
            });

            settings.target.trigger("holderMoved", [false]);
        });
    }

    $(document).keydown(function (e) {

        if ($("input:focus").size() === 0) {

            var pos = settings.target.position();

            switch (e.which) {
                case 37: // left
                    settings.target.css({
                        left: pos.left + settings.arrowKeysSpeed
                    });
                    break;

                case 38: // up
                    settings.target.css({
                        left: pos.left + settings.arrowKeysSpeed
                    });
                    break;

                case 39: // right
                    settings.target.css({
                        left: pos.left + (-1 * settings.arrowKeysSpeed)
                    });
                    break;

                case 40: // down
                    settings.target.css({
                        top: pos.top + (-1 * settings.arrowKeysSpeed)
                    });
                    break;

                default:
                    return; // exit this handler for other keys
            }

        }

        settings.target.trigger("holderMoved", [false]);
    });
};