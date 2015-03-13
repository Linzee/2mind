function twoMinDutils(settingsIn) {

    var settings = $.extend({}, {
        block_size: 2100,
        blocksHolder: false
    }, settingsIn);
    
    this.stuped = function () {
        alert('stuped');
    };
    
    this.getScreenCenterBlockPosition = function () {

        var x = Math.round((-1 * settings.blocksHolder.position().left) + $(window).width() / 2);
        var y = Math.round((-1 * settings.blocksHolder.position().top) + $(window).height() / 2);

        return [x, y];
    };

    /**
     * 
     * @param {type} screen_x - normalized value from 0 to 1
     * @param {type} screen_y - normalized value from 0 to 1
     * @returns {Array}
     */
    this.getScreenBlockPositionAt = function (screen_x, screen_y) {
        
        var x = Math.round((-1 * settings.blocksHolder.position().left) + $(window).width() * screen_x);
        var y = Math.round((-1 * settings.blocksHolder.position().top) + $(window).height() * screen_y);

        return [x, y];
    };

    /**
     * 
     * @returns {Array} block in center of screen
     */
    this.getScreenCenterBlock = function () {
        var centerPos = this.getScreenCenterBlockPosition();

        var block_x = Math.floor(centerPos[0] / settings.block_size);
        var block_y = Math.floor(centerPos[1] / settings.block_size);

        return [block_x, block_y];
    };

    this.getScreenRangeBlocks = function () {
        
        var leftTopPos = this.getScreenBlockPositionAt(0, 0);
        var rightBottomPos = this.getScreenBlockPositionAt(1, 1);
        
        var block_x1 = Math.floor(leftTopPos[0] / settings.block_size);
        var block_y1 = Math.floor(leftTopPos[1] / settings.block_size);
        var block_x2 = Math.floor(rightBottomPos[0] / settings.block_size);
        var block_y2 = Math.floor(rightBottomPos[1] / settings.block_size);

        return [block_x1, block_y1, block_x2, block_y2];
    };

    this.getScreenCenterLocalBlockPosition = function () {
        var pos = this.getScreenCenterBlockPosition();
        var posBlock = this.getScreenCenterBlock();

        var x = pos[0] - posBlock[0] * settings.block_size;
        var y = pos[1] - posBlock[1] * settings.block_size;

        return [x, y];
    };

    this.getScreenFloatBlockPosition = function () {
        var pos = this.getScreenCenterLocalBlockPosition();
        var posBlock = this.getScreenCenterBlock();

        var x = posBlock[0] + (pos[0] / settings.block_size);
        var y = posBlock[1] + (pos[1] / settings.block_size);

        return [x, y];
    };

    this.showMessage = function (title, message) {
        $('#messageReveal').foundation('reveal', 'open');
        $('#messageReveal h2').text(title);
        $('#messageReveal p').text(message);
    };

    this.isColorDark = function (color) {
        return this.isColorPartDark(color.substr(0, 2)) || this.isColorPartDark(color.substr(2, 4)) || this.isColorPartDark(color.substr(4, 6));
    };

    this.isColorPartDark = function (colorPart) {
        return parseInt(colorPart, 16) < 80;
    };

    return this;
}
;

//utility bugfixes
$(function () {
    
    $('.fullpage').css('height', $(window).height());
    $(window).resize(function () {
        $('.fullpage').css('height', $(window).height());
    });
    
    $('.fullpage-min').css('min-height', $(window).height());
    $(window).resize(function () {
        $('.fullpage-min').css('min-height', $(window).height());
    });
    
    
    //dynamic width input
    $('.dynamic-width-input').each(function() {
        var dynamicElement = $(this);
        var input = dynamicElement.prev();
        dynamicElement.hide();
        
        input.on("keypress changeLength", function(e) {
            if (e.which !== 0 && e.charCode !== 0) {
                var c = String.fromCharCode(e.keyCode|e.charCode);
                dynamicElement.text($(this).val() + c);
                
                var inputSize = dynamicElement.width();
                if(inputSize < 64) {
                    inputSize = 64;
                }
                $(this).css("width", inputSize);
            }
        });
    });
});

