$.fn.twoMinDmap = function (settingsIn) {

    var blocksHolder = this;

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain,
        speed: 2000,
        template: '<div class="map-block">' +
                '<div class="block-info">' +
                '<h3 class="title"><a href="#"></a></h3>' +
                '<div class="description"></div>' +
                '<div class="coords"></div>' +
                '</div>' +
                '</div>',
        zoom_default: 10
    }, settingsIn);

    var ajaxing = false;
    var latestUpdateTime = 0;
    var latestRange = null;

    var utils = new twoMinDutils({
        block_size: settings.zoom_default,
        blocksHolder: blocksHolder
    });

    var sendRequest = function () {

        if (ajaxing)
            return;

        ajaxing = true;

        var range = utils.getScreenRangeBlocks();

        if (latestRange !== null) {
            if (latestRange[0] !== range[0] || latestRange[1] !== range[1] || latestRange[3] !== range[3] || latestRange[4] !== range[4]) {
                latestUpdateTime = 0;
                //TODO this can be done better.. but for now it is just.. if moved please update all
            }
        }

        latestRange = range;

        var url = settings.ajax_url + "/map/map?lastUpdate=" + latestUpdateTime + '&x1=' + range[0] + '&y1=' + range[1] + '&x2=' + range[3] + '&y2=' + range[3];

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {

            latestUpdateTime = data.now;

            if (data.blocks) {
                updateBlocks(data.blocks);
            }

            ajaxing = false;
        });
    };

    var updateBlocks = function (blocks) {

        $.each(blocks, function (index, block) {

            var blockId = "map_" + block.block_x + "_" + block.block_y;

            var blockEl = blocksHolder.find("#" + blockId);
            if (!blockEl.size()) {
                blockEl = createNewBlock(blockId);
            }

            blockEl.find('.title a').attr('href', '../wall#block_' + block.block_x + "_" + block.block_y)
            blockEl.find('.title a').text(block.title);
            blockEl.find('.description').text(block.description);
            blockEl.find('.coords').text('[' + block.block_x + ", " + block.block_y + ']');

            blockEl.css({
                left: block.block_x * settings.zoom_default,
                top: block.block_y * settings.zoom_default
            });

            blocksHolder.trigger("postUpdate", [blockEl]);
        });
    };

    var createNewBlock = function (id) {
        var blockEl = $(settings.template);

        blockEl.attr('id', id);
        blocksHolder.append(blockEl);
        blocksHolder.trigger("blockCreated", [blockEl]);

        var blockInfo = blockEl.find('.block-info');
        var hiding = false;

        blockEl.on('click mouseenter', function () {
            if (!hiding)
                blockInfo.show();
            hiding = false;
        });
        blockEl.mouseleave(function () {
            blockInfo.hide();
        });
        blockInfo.on('click', function (event) {
            blockInfo.hide();
            hiding = true;
        });

        return blockEl;
    };

    setInterval(function () {
        sendRequest();
    }, settings.speed);
    sendRequest();
};