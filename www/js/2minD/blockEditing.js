$.fn.twoMinDblockEditing = function (twoMinD, settingsIn) {

    var blocksHolder = this;

    var settings = $.extend({}, {
        block_size: 2100
    }, settingsIn);

    var coordXDisplayer = $(".coords .x");
    var coordYDisplayer = $(".coords .y");
    var titleDisplayer = $("#blockInfo .title");
    var descriptionDisplayer = $("#blockInfo .description");

    var lastPos = [0, 0];

    var update = function (force) {

        var blockPos = twoMinD.utils.getScreenCenterBlock();

        if (force || lastPos[0] !== blockPos[0] || lastPos[1] !== blockPos[1]) {

            var block = $("#block_" + blockPos[0] + "_" + blockPos[1]);
            var title = block.find(".title").text();
            var description = block.find(".description").text();


            /* //change location hash in address - dont work - totally broke functionality in chrome
             if (lastPos[0] !== blockPos[0] || lastPos[1] !== blockPos[1]) {
             window.location.hash = 'block_'+blockPos[0]+'_'+blockPos[1];
             }
             */

            //write stuff to header things
            coordXDisplayer.val(blockPos[0]);
            coordYDisplayer.val(blockPos[1]);

            if (!titleDisplayer.is(":focus")) {
                titleDisplayer.val(title);
                titleDisplayer.trigger("changeLength");
            }

            if (!descriptionDisplayer.is(":focus")) {
                descriptionDisplayer.val(description);
                descriptionDisplayer.trigger("changeLength");
            }

            if (blockPos[0] === 0 && blockPos[1] === 0) {
                titleDisplayer.attr('disabled', 'disabled');
                descriptionDisplayer.attr('disabled', 'disabled');
            } else {
                titleDisplayer.removeAttr('disabled');
                descriptionDisplayer.removeAttr('disabled');
            }

            lastPos = blockPos;
        }
    };

    blocksHolder.on("drag", function (event, ui) {
        update(false);
    });

    blocksHolder.on("holderMoved", function (event, force) {

        if (force === undefined) {
            force = true;
        }

        update(force);
    });

    update(true);

    blocksHolder.on("blockInfoUpdate", function (event, pos) {
        if (parseInt(pos.block_x) === lastPos[0] && parseInt(pos.block_y) === lastPos[1]) {
            update(true);
        }
    });

    $(".coords input").bind("paste keyup", function () {

        var x = parseInt(coordXDisplayer.val());
        var y = parseInt(coordYDisplayer.val());

        if (!isNaN(x) && !isNaN(y)) {

            if (x !== lastPos[0] || y !== lastPos[1]) {

                blocksHolder.css({
                    left: -1 * x * settings.block_size,
                    top: -1 * y * settings.block_size
                });

                blocksHolder.trigger("holderMoved");
            }
        }
    });

    $("#blockInfo .title, #blockInfo .description").bind("change paste keyup", function () {
        twoMinD.packets.packetEditBlock(lastPos[0], lastPos[1], titleDisplayer.val(), descriptionDisplayer.val());
    });

};