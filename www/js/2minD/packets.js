function twoMinDpackets(utils, settingsIn) {

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain
    }, settingsIn);

    var error = function (data) {
        utils.showMessage('Nastala chyba!', '(' + data.response + ') ' + data.message);
    };

    var checkData = function(data) {
        if (data.error) {
            error({
                reason: 'unspecified',
                message: 'unspecified'
            });
            return false;
        } 
        if (data.response && data.response !== 'success') {
            error(data);
            return false;
        }
        return true;
    };
    
    this.packetSimple = function(url, resultFunction) {
        
        $.ajax({
            url: settings.ajax_url + url,
            dataType: 'json'
        }).done(function (data) {
            if(checkData(data)) {
                if(resultFunction) {
                    resultFunction(data);
                }
            }
        });
    };

    this.packetBlock = function (x, y, lastUpdate, includeDeleted, resultFunction) {
        
        //TODO cancel if other BLOCK packet is waiting
        
        var url = "/wall/block?x=" + x + "&y=" + y + "&lastUpdate=" + lastUpdate + "&includeDeleted=" + includeDeleted;

        this.packetSimple(url, resultFunction);
    };
    
    this.packetEditBlock = function (x, y, title, description) {

        var url = "/wall/editblock?x=" + x + "&y=" + y
                + "&title=" + encodeURIComponent(title)
                + "&description=" + encodeURIComponent(description);

        this.packetSimple(url);
    };

    this.packetAdd = function (block_x, block_y, x, y, content, replyTo) {
        
        var url = "/wall/add?block_x=" + block_x + "&block_y=" + block_y + "&x=" + x + "&y=" + y + "&content=" + encodeURIComponent(content);

        if (replyTo) {
            url = url + '&parent=' + replyTo;
        }

        this.packetSimple(url);
    };
    
    this.packetMove = function(id, x, y) {
        
        var url = "/wall/move?id=" + id + "&x=" + x + "&y=" + y;
        
        this.packetSimple(url);
    };
    
    this.packetRemove = function(id) {
        
        var url = "/wall/remove?id=" + id;
        
        this.packetSimple(url);
    };
    
    this.packetRenew = function(id) {
        
        var url = "/wall/renew?id=" + id;
        
        this.packetSimple(url);
    };
    
    this.packetSearch = function(search, resultFunction) {
        
        var url = "/wall/search?search=" + encodeURIComponent(search);

        this.packetSimple(url, resultFunction);
    };
    
    this.packetLatest = function(latestUpdateTime, includeDeleted, limit, blocks, resultFunction) {
        
        //TODO cancel if other LATEST packet is waiting
        
        var url = "/latest/latest?lastUpdate=" + latestUpdateTime + "&includeDeleted=" + includeDeleted;

        if (limit) {
            url = url + '&limit=' + limit;
        }

        if (blocks) {
            url = url + '&blocks=1';
        }

        this.packetSimple(url, resultFunction);
    };
    
    this.packetMap = function(x1, y1, x2, y2, latestUpdateTime, resultFunction) {
        
        //TODO cancel if other MAP packet is waiting
        
        var url = "/map/map?lastUpdate=" + latestUpdateTime + '&x1=' + x1 + '&y1=' + y1 + '&x2=' + x2 + '&y2=' + y2;

        this.packetSimple(url, resultFunction);
    };
    
    this.packetChangeColor = function(color, background) {
        
        var url = "/wall/changeColor?color=" + encodeURIComponent(color) + '&background=' + encodeURIComponent(background);

        this.packetSimple(url);
    }
    
    this.packetSystem = function(x, y) {
        var url = "/wall/system?x=" + x + "&y=" + y;

        this.packetSimple(url, function(data) {
            if (data.online) {
                $(".online-counter").text(data.online);
            }
            if (data.forceReload) {
                location.reload();
            }
            if (data.sysmessage) {
                utils.showMessage('Systemova sprava:', data.sysmessage);
            }
        });
    };
    
    return this;
}