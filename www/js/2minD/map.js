$.fn.twoMinDmap = function (twoMinD, settingsIn) {

    var blocksHolder = this;

    var settings = $.extend({}, {
        speed: 2000,
        template: '<div class="map-block">' +
                '<div class="block-info">' +
                 '<h3 class="title"><a href="#"></a></h3>' +
                '<span class="description"></span>' +
                '<div class="coords"></div>' +
                '</div>' +
                '</div>',
        block_size: 100
    }, settingsIn);
    
    var latestUpdateTime = 0;
    var latestRange = null;

    var utils = new twoMinDutils({
        block_size: settings.block_size,
        blocksHolder: blocksHolder
    });

    var sendRequest = function () {
        
        var range = utils.getScreenRangeBlocks();

        if (latestRange !== null) {
            if (latestRange[0] !== range[0] || latestRange[1] !== range[1] || latestRange[3] !== range[3] || latestRange[4] !== range[4]) {
                latestUpdateTime = 0;
                //TODO this can be done better.. but for now it is just.. if moved please update all
            }
        }

        latestRange = range;

        twoMinD.packets.packetMap(range[0], range[1], range[2], range[3], latestUpdateTime, function(data) {
            latestUpdateTime = data.now;

            if (data.blocks) {
                updateBlocks(data.blocks);
            }
        });
    };

    var updateBlocks = function (blocks) {

        $.each(blocks, function (index, block) {

            var blockId = "map_" + block.block_x + "_" + block.block_y;

            var blockEl = blocksHolder.find("#" + blockId);
            if (!blockEl.size()) {
                blockEl = createNewBlock(blockId);
            }

            blockEl.find('.title a').attr('href', settings.ajax_url + '/wall#block_' + block.block_x + "_" + block.block_y)
            blockEl.find('.title a').text(block.title);
            blockEl.find('.description').text(block.description);
            blockEl.find('.coords').text('[' + block.block_x + ", " + block.block_y + ']');

            blockEl.css({
                left: block.block_x * settings.block_size,
                top: block.block_y * settings.block_size
            });
            
            var blockInfo = blockEl.find('.block-info');
            while(blockEl.height() > settings.block_size || blockEl.width() > settings.block_size) {
                blockInfo.css("font-size", parseInt(blockInfo.css("font-size")) - 1);
            }
            
            blocksHolder.trigger("mapBlockUpdate", [blockEl]);
        });
    };

    var createNewBlock = function (id) {
        var blockEl = $(settings.template);

        blockEl.attr('id', id);
        blocksHolder.append(blockEl);
        blocksHolder.trigger("mapBlockCreaated", [blockEl]);
        
        return blockEl;
    };

    setInterval(function () {
        sendRequest();
    }, settings.speed);
    sendRequest();
};