TwoMinD = function() {
    
    this.blocksHolder = $('.blocks-holder');
    this.utils = new twoMinDutils({
        blocksHolder: blocksHolder
    });
    this.packets = new twoMinDpackets(this.utils, twoMinDsettings);
    
    this.setupBasic = function() {
        
        $(".settings-form").twoMinDsettings(this, twoMinDsettings);
        blocksHolder.twoMinDactions(this, twoMinDsettings);

        $('header .icon-list .search').twoMinDaction({
            action: 'search_button'
        });
        $('.right-off-canvas-menu .settings').twoMinDaction({
            action: 'settings'
        });
        $('.right-off-canvas-menu .fullscreen').twoMinDaction({
            action: 'fullscreen'
        });
    };
    
    this.setupModerator = function() {
        
        blocksHolder.twoMinDmoderatorActions(this, twoMinDsettings);

        $('.right-off-canvas-menu .online').twoMinDmoderatorAction({
            action: 'online'
        });
        $('#userReveal .ban').twoMinDmoderatorAction({
            action: 'userBan'
        });
        $('#userReveal .unban').twoMinDmoderatorAction({
            action: 'userUnban'
        });
        $('#userReveal .removeAllPosts').twoMinDmoderatorAction({
            action: 'userRemoveAllPosts'
        });
        $('#postReveal .remove').twoMinDmoderatorAction({
            action: 'postRemove'
        });
        $('#postReveal .renew').twoMinDmoderatorAction({
            action: 'postRenew'
        });
    };
    
    this.setupWall = function() {
        
        var isPresentation = false;
        if(twoMinDsettings.presentation) {
            isPresentation = twoMinDsettings.presentation;
        }
        
        blocksHolder.twoMinDwall(this, twoMinDsettings);
        blocksHolder.twoMinDsystem(this, twoMinDsettings);
        blocksHolder.twoMinDblockEditing(this, twoMinDsettings);
        blocksHolder.twoMinDpost(this, twoMinDsettings);

        $('.blocks-holder-mover').twoMinDinfiniteMover({
            target: blocksHolder,
            arrowKeysEnabled: !isPresentation
        });

        //actions
        $('header .icon-list .spawn').twoMinDaction({
            action: 'spawn',
            spawnToCenter: true,
            posSpawn: {
                pos_x: 0.5,
                pos_y: 0.5
            },
            posLoad: twoMinDsettings.posLoad
        });
        $('footer .icon.add').twoMinDaction({
            action: 'add'
        });
        $('#addReveal').twoMinDaction({
            action: 'addReveal'
        });

        $('#block_0_0 .search').twoMinDaction({
            action: 'search_button'
        });
        
        if(isPresentation) {
            blocksHolder.twoMinDpresentation(this, twoMinDsettings);
        } else {
            $(".start-presentation").parent().remove();
        }
    };
    
    this.setupLatest = function(blocks) {
        $('.latest-posts').twoMinDlatest(this, $.extend({}, twoMinDsettings, {
            blocks: blocks
        }));
    };
    
    this.setupMap = function() {
        $('.blocks-holder-mover').twoMinDinfiniteMover({
            target: blocksHolder
        });
        $('header .icon-list .spawn').twoMinDaction({
            action: 'spawn',
            spawnToCenter: true
        });
        
        blocksHolder.twoMinDmap(this, twoMinDsettings);
    };
    
    return this;
};;$.fn.twoMinDactions = function (twoMinD, settingsIn) {

    var settings = $.extend({}, {
        block_size: 2100
    }, settingsIn);

    var blocksHolder = this;

    var actions = {
        search_button: function (object) {

            var searchButton = object.find('a');
            var searchForm = object.find(".searchForm");

            if (Modernizr.touch) {

                var hover = false;
                object.hover(function () {
                    hover = true;
                }, function () {
                    hover = false;
                });

                searchButton.click(function () {
                    if (!hover) {
                        return false;
                    } else {
                        searchForm.submit();
                    }
                });
            } else {
                searchButton.click(function () {
                    searchForm.submit();
                });
            }

            actions.search_form(object);
        },
        search_form: function (object) {

            var searchForm = object.find(".searchForm");

            searchForm.submit(function () {

                var input = searchForm.find("input");

                performSearch(input.val());

                input.val("");

                return false;
            });
        },
        spawn: function (object, settings) {

            var doSpawn = function (event, load) {

                var x = 0, y = 0;

                if (settings.spawnToCenter) {
                    x = $(window).width() / 2;
                    y = $(window).height() / 2;
                }

                if(load && settings.posLoad) {
                    x += -1 * settings.posLoad.pos_x * settings.block_size;
                    y += -1 * settings.posLoad.pos_y * settings.block_size;
                } else if (settings.posSpawn) {
                    x += -1 * settings.posSpawn.pos_x * settings.block_size;
                    y += -1 * settings.posSpawn.pos_y * settings.block_size;
                }
                
                blocksHolder.css({
                    left: x,
                    top: y
                });

                blocksHolder.trigger("holderMoved");

                return false;
            };

            object.click(doSpawn);
            doSpawn(null, true);
        },
        settings: function (object) {
            object.click(function () {
                $('#settingsReveal').foundation('reveal', 'open');
                return false;
            });
        },
        fullscreen: function (object) {
            object.click(function () {
                if ($.fullscreen.isFullScreen()) {
                    $.fullscreen.exit();
                } else {
                    $("body").fullscreen();
                }
                return false;
            });
        },
        add: function (object) {
            object.click(function () {
                $('#addReveal').foundation('reveal', 'open');
            });

            var someRevealOpened = false;

            $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
                someRevealOpened = true;
            });

            $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                someRevealOpened = false;
            });

            $("body").keypress(function (event) {
                if (!someRevealOpened) {
                    if (event.which !== 0 && event.charCode !== 0) {
                        if ($("input:focus").size() === 0) {
                            $('#addReveal').foundation('reveal', 'open');
                        }
                    }
                }
            });
        },
        addReveal: function (object) {

            var addField = object.find(".text");
            var replyTo = null;

            object.find("form").submit(function () {

                var block_pos = twoMinD.utils.getScreenCenterBlock();
                var local_pos = twoMinD.utils.getScreenCenterLocalBlockPosition();

                var content = addField.val();

                if (content.length === 0) {
                    object.foundation('reveal', 'close');
                    return false;
                }

                twoMinD.packets.packetAdd(block_pos[0], block_pos[1], local_pos[0], local_pos[1], content, replyTo);

                object.foundation('reveal', 'close');

                return false;
            });

            $(document).on('opened.fndtn.reveal', '[data-reveal]', function () {
                if ($(this).attr('id') === 'addReveal') {
                    addField.focus();
                }
            });

            $(document).on('closed.fndtn.reveal', '[data-reveal]', function () {
                if ($(this).attr('id') === 'addReveal') {
                    addField.val("");
                    replyTo = null;
                }
            });

            $(".blocks-holder").on("postCreated", function (event, post) {
                post.find('.reply').mousedown(function () {
                    replyTo = post.attr("id").substring(5);
                    object.foundation('reveal', 'open');
                });
            });

            addField.keypress(function (event) {
                if (event.which === 13) {
                    event.preventDefault();

                    if (event.shiftKey || event.ctrlKey) {
                        addField.val(addField.val() + '\n');
                    } else {
                        object.find("form").submit();
                    }
                }
            });
            
            addField.maxlength({max: 210, feedbackText: '{c}/{m}'});
        }
    };

    var printSearchResult = function (data) {

        var searchResults = $(".search-results");
        searchResults.empty();

        if (data.blocks) {

            $.each(data.blocks, function (index, block) {

                var goToId = 'block_' + block.block_x + '_' + block.block_y;

                searchResults.append(
                        '<li>' +
                        '<a href="#' + goToId + '" class="block-title">' + block.title +
                        '<span class="coord"> [' + block.block_x + ', ' + block.block_y + '] </span>' +
                        '<div class="block-description">' + block.description + '</div></a>' +
                        '</li>');
            });

        } else {
            searchResults.append("<li>Neboli nájdene žiadne témy.</li>");
        }

        searchResults.find('a').click(function () {
            setTimeout(updateHashLocation, 100);
            $("#searchReveal").foundation('reveal', 'close');
        });

        $("#searchReveal").foundation('reveal', 'open');

    };

    var performSearch = function (search) {

        twoMinD.packets.packetSearch(search, function(data) {
            printSearchResult(data);
        });
        
    };

    var updateHashLocation = function () {
        var hash = window.location.hash.slice(1);
        if (hash.match("^block_")) {
            
            var x = 0;
            var y = 0;

            var block_coords = hash.substring(6).split('_');
            if (block_coords.length >= 2) {
                x += -1 * parseInt(block_coords[0]) * settings.block_size;
                y += -1 * parseInt(block_coords[1]) * settings.block_size;
            }
            if (block_coords.length >= 4) {
                x += -1 * parseInt(block_coords[2]);
                y += -1 * parseInt(block_coords[3]);
                x += $(window).width() / 2;
                y += $(window).height() / 2;
            }

            $(".blocks-holder").css({
                left: x,
                top: y
            });

            $(".blocks-holder").trigger("holderMoved");
        }
    };
    setTimeout(updateHashLocation, 100);
    $(window).on("hashchange", function() {
        updateHashLocation();
    });

    $.fn.twoMinDaction = function (settingsIn) {

        var object = this;

        var settingsAction = $.extend({}, {
            action: false,
            blocksHolder: $(".blocks-holder"),
            block_size: settings.block_size
        }, settingsIn);

        if (settingsAction.action) {
            //find correct action and run it
            $.each(actions, function (action, actionFunction) {
                if (settingsAction.action === action) {
                    actionFunction(object, settingsAction);
                }
            });
        }
    };
};

;$.fn.twoMinDblockEditing = function (twoMinD, settingsIn) {

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

};;$.fn.twoMinDinfiniteMover = function (settingsIn) {

    var mover = this;

    var settings = $.extend({}, {
        target: null,
        draggDelay: 100,
        draggDistance: 5,
        //zoom
        zoomEnabled: false,
        mobileZoomEnabled: false,
        zoom_min: 0.4,
        zoom_start: 1,
        zoom_max: 2.0,
        //control
        arrowKeysEnabled: true,
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
    
    if(settings.mobileZoomEnabled) {
        
        var zoomLock = 1;
        
        $(".blocks-holder").swipe({
            pinchStatus: function (event, phase, direction, distance, duration, fingerCount, pinchZoom) {
                
                if(phase === 'start') {
                    zoomLock = zoom;
                }
                
                zoom = zoomLock * pinchZoom;
                
                if(zoom < settings.zoom_min) {
                    zoom = settings.zoom_min;
                }
                
                if(zoom > settings.zoom_max) {
                    zoom = settings.zoom_max;
                }
                
                settings.target.css({
                    transform: 'scale(' + zoom + ')'
                });
            },
            fingers: 2,
            pinchThreshold: 0
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

    if (settings.arrowKeysEnabled) {
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
    }
};;$.fn.twoMinDlatest = function (twoMinD, settingsIn) {

    var latestHolder = this;

    var settings = $.extend({}, {
        speed: 9000,
        limit: false,
        blocks: false,
        template_post: '<li>' +
                '<a href="#">' +
                '<div class="post-content"></div>' +
                '<span class="coord"></span>' +
                '</a>' +
                '</li>',
        template_block: '<li>' +
                '<a href="#">' +
                '<h3 class="title"></h3>' +
                '<div class="description"></div>' +
                '<span class="coord"></span>' +
                '</a>' +
                '</li>'
    }, settingsIn);
    
    var latestUpdateTime = 0;

    var sendRequest = function () {
        
        var includeDeleted = '0';
        if (latestUpdateTime !== 0) {
            includeDeleted = '1';
        }

        twoMinD.packets.packetLatest(latestUpdateTime, includeDeleted, settings.limit, settings.blocks, function(data) {
            if (data.posts) {
                updatePosts(data.posts);
            }
            latestUpdateTime = data.now;
        });
    };

    var updatePosts = function (posts) {

        $.each(posts, function (index, post) {

            if (settings.blocks) {
                var postId = "latest_post_" + post.block_x + '_' + post.block_y;
            } else {
                var postId = "latest_post_" + post.id;
            }
            var newEl = false;

            var postEl = latestHolder.find("#" + postId);
            //create new element if doesnt exist
            if (!postEl.size() && !post.deleted) {
                if (settings.blocks) {
                    postEl = $(settings.template_block);
                } else {
                    postEl = $(settings.template_post);
                }
                postEl.attr('id', postId);
                if (latestUpdateTime === 0) {
                    latestHolder.append(postEl);
                } else {
                    latestHolder.prepend(postEl);
                }
                newEl = true;
            }

            if (post.deleted) {
                if (postEl.size()) {
                    latestHolder.trigger("latestPostRemoved", [postEl]);
                    postEl.remove();
                }

            } else {

                if (settings.blocks) {
                    postEl.find('.title').text(post.title);
                    postEl.find('.description').text(post.description);
                } else {
                    postEl.find('.post-content').text(post.content);
                }
                postEl.find('.coord').text(' [' + post.block_x + ', ' + post.block_y + '] ');

                if (settings.blocks) {
                    postEl.find('a').attr('href', settings.ajax_url + '/wall#block_' + post.block_x + '_' + post.block_y);
                } else {
                    postEl.find('a').attr('href', settings.ajax_url + '/wall#block_' + post.block_x + '_' + post.block_y + '_' + post.local_x + '_' + post.local_y);
                }

                if (newEl) {
                    latestHolder.trigger("latestPostCreated", [postEl]);
                } else {
                    latestHolder.prepend(postEl.remove());
                    latestHolder.trigger("latestPostUpdate", [postEl]);
                }
            }
        });

        if (settings.limit) {
            posts = latestHolder.find("li");
            while (posts.size() > settings.limit) {
                posts.last().remove();
                posts = latestHolder.find("li");
            }

        }
    };

    setInterval(function () {
        sendRequest();
    }, settings.speed);
    sendRequest();
};;$.fn.twoMinDmap = function (twoMinD, settingsIn) {

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
};;$.fn.twoMinDmoderatorActions = function (twoMinD, settingsIn) {

    var settings = $.extend({}, {
        user_template: '<li><a href="#"></a></li>'
    }, settingsIn);

    var blocksHolder = this;

    var actions = {
        online: function (object, settings) {
            object.click(function () {
                
                twoMinD.packets.packetSimple("/users/users", function (data) {

                    if (data.users) {

                        $('#usersReveal').foundation('reveal', 'open');

                        var usersList = $('#usersReveal .users-list');
                        usersList.empty();

                        $.each(data.users, function (index, user) {

                            var userEl = $(settings.user_template);

                            userEl.css('background', user.color);
                            userEl.find('a').text(user.id);

                            userEl.click(function () {
                                $('#usersReveal').foundation('reveal', 'close');
                            });
                            userEl.twoMinDmoderatorAction({
                                action: 'user',
                                user: user.id
                            });

                            usersList.append(userEl);
                        });
                    }
                });

                return false;
            });
        },
        user: function (object, settings) {
            object.click(function () {
                $('#userReveal').foundation('reveal', 'open');
                
                twoMinD.packets.packetSimple("/users/user?id=" + settings.user, function (data) {

                    if (data.user) {

                        try {
                            $('#userReveal').foundation('reveal', 'open');
                        } catch (e) {

                        }

                        var userEl = $('#userReveal');

                        $.each(data.user, function (index, value) {

                            if (value === null) {
                                value = '-';
                            }

                            if (value.date) {
                                value = twoMinD.utils.prettyDate(value);
                            }

                            userEl.find('.' + index).text(value);
                        });

                    }
                });

                return false;
            });
        },
        post: function (object, settings) {
            object.click(function () {

                twoMinD.packets.packetSimple("/wall/post?id=" + settings.post, function (data) {

                    if (data.post) {

                        $('#postReveal').foundation('reveal', 'open');

                        var postEl = $('#postReveal');

                        $.each(data.post, function (index, value) {

                            if (value === null) {
                                value = '-';
                            }

                            if (value.date) {
                                value = twoMinD.utils.prettyDate(value);
                            }

                            postEl.find('.' + index).text(value);
                        });

                    }
                });

                return false;
            });
        },
        userBan: function (object, settings) {
            object.click(function () {

                var userId = object.closest(".reveal-modal").find(".id").text();

                twoMinD.packets.packetSimple("/users/ban?id=" + userId + "&reason=" + encodeURIComponent('moderator'));
                
                $('#userReveal').foundation('reveal', 'close');
                
            });
        },
        userUnban: function (object, settings) {
            object.click(function () {

                var userId = object.closest(".reveal-modal").find(".id").text();
                
                twoMinD.packets.packetSimple("/users/unban?id=" + userId);
                
                $('#userReveal').foundation('reveal', 'close');

            });
        },
        userRemoveAllPosts: function (object, settings) {
            object.click(function () {

                var userId = object.closest(".reveal-modal").find(".id").text();

                twoMinD.packets.packetSimple("/users/removeAllPosts?id=" + userId);
                
                $('#userReveal').foundation('reveal', 'close');
                
            });
        },
        postRemove: function (object, settings) {
            object.click(function () {

                var postId = object.closest(".reveal-modal").find(".id").text();

                twoMinD.packets.packetSimple("/wall/remove?id=" + postId);

                $('#postReveal').foundation('reveal', 'close');

            });
        },
        postRenew: function (object, settings) {
            object.click(function () {

                var postId = object.closest(".reveal-modal").find(".id").text();

                twoMinD.packets.packetSimple("/wall/renew?id=" + postId);

                $('#postReveal').foundation('reveal', 'close');

            });
        },
    };

    $.fn.twoMinDmoderatorAction = function (settingsIn) {

        var object = this;

        var settingsIne = $.extend({}, settings, settingsIn);

        var settingsAction = $.extend({}, {
            action: false,
            blocksHolder: $(".blocks-holder")
        }, settingsIne);

        if (settingsAction.action) {
            //find correct action and run it
            $.each(actions, function (action, actionFunction) {
                if (settingsAction.action === action) {
                    actionFunction(object, settingsAction);
                }
            });
        }
    };

    blocksHolder.on("postCreated", function (event, post) {
        var postEl = $(post);

        var postId = parseInt(post.attr("id").substring(5));

        postEl.twoMinDmoderatorAction({
            action: 'post',
            post: postId
        });
    });
};

;function twoMinDpackets(utils, settingsIn) {

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
};$.fn.twoMinDpost = function (twoMinD, settingsIn) {

    var settings = $.extend({}, {
        draggDelay: 100,
        draggDistance: 5,
        moderator: false
    }, settingsIn);

    var deleteButton = $("footer .icon.delete");
    var addButton = $("footer .icon.add");

    deleteButton.hide();

    var movePost = function (id, offset) {

        twoMinD.packets.packetMove(id, Math.round(offset.left), Math.round(offset.top));

    };

    var deletePost = function (id) {

        twoMinD.packets.packetRemove(id);

    };

    var intersectOffsetElement = function (offset, el) {
        return (el.offset().top < offset.top
                && el.offset().left < offset.left
                && el.offset().top + el.height() > offset.top
                && el.offset().left + el.width() > offset.left);
    };

    var startDraggingPost = function () {

        deleteButton.show();
        addButton.hide();

    };

    var stopDraggingPost = function (event) {

        var post = $(event.target);

        if (post.hasClass('post-group')) {
            var postId = parseInt(post.children().first().attr("id").substring(5));
        } else {
            var postId = parseInt(post.attr("id").substring(5));
        }

        if (intersectOffsetElement({
            left: event.pageX,
            top: event.pageY
        }, deleteButton)) {

            //delete me
            deletePost(postId);

            post.hide();
        } else {
            movePost(postId, post.position());

            //Intersecting posts
            moveIntersectingPosts(post);
        }

        deleteButton.hide();
        addButton.show();
    };

    var moveIntersectingPosts = function (post) {

        var collision = post.collision(post.parent().find("> .post"), {
            as: '<div />',
            obstacleData: 'collision-obstacle',
            directionData: 'collision-direction'
        });

        collision.each(function (index) {

            var colPost = $(this).data('collision-obstacle');

            if (colPost.attr('id') !== post.attr('id')) {

                var dir = $(this).data('collision-direction');
                var mx = 0;
                var my = 0;

                if (dir === "S") {
                    my += $(this).height();
                }
                if (dir === "N") {
                    my += -$(this).height();
                }
                if (dir === "E") {
                    mx += $(this).width();
                }
                if (dir === "W") {
                    mx += -$(this).width();
                }
                if (dir === 'Inside') {
                    mx += $(this).height(); //TODO
                }
                if (dir === 'Outside') {
                    mx += $(this).height(); //TODO
                }
                if (dir === "SE") {
                    if ($(this).height() < $(this).width())
                        my += $(this).height();
                    else
                        mx += $(this).width();
                }
                if (dir === "NE") {
                    if ($(this).height() < $(this).width())
                        my -= $(this).height();
                    else
                        mx += $(this).width();
                }
                if (dir === "NW") {
                    if ($(this).height() < $(this).width())
                        my -= $(this).height();
                    else
                        mx -= $(this).width();
                }
                if (dir === "SW") {
                    if ($(this).height() < $(this).width())
                        my = $(this).height();
                    else
                        mx -= $(this).width();
                }

                manualMovePost(colPost, {
                    left: mx,
                    top: my
                });

            }

        });
    };

    var manualMovePost = function (post, distance) {
        post.css({
            left: post.position().left + distance.left,
            top: post.position().top + distance.top
        });

        var postId = parseInt(post.attr("id").substring(5));

        movePost(postId, post.position());

        //moveIntersectingPosts(post); //Tooo dangerous!
    };

    $(".blocks-holder").on("postCreated", function (event, post, postData) {

        //console.log(postData);

        if (postData.parent) {
            //draggable post group
            if (post.parent().hasClass('post-group')) {
                post.parent().draggable({
                    start: startDraggingPost,
                    stop: stopDraggingPost,
                    containment: post.parent().parent().parent(),
                    delay: settings.draggDelay,
                    distance: settings.draggDistance
                });
            }
        } else {
            //draggable post
            if (post.hasClass('post')) {
                post.draggable({
                    start: startDraggingPost,
                    stop: stopDraggingPost,
                    containment: post.parent().parent(),
                    delay: settings.draggDelay,
                    distance: settings.draggDistance
                });
            }
        }

        post.mousedown(function () {
            $(".post").removeClass("selected");
            $(this).addClass("selected");
        });
    });

};;$.fn.twoMinDpresentation = function (twoMinD, settingsIn) {

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
};;$.fn.twoMinDsettings = function (twoMinD, settingsIn) {

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
};;$.fn.twoMinDsystem = function (twoMinD, settingsIn) {

    var settings = $.extend({}, {
        speed: 9999
    }, settingsIn);

    var systemUpdate = function () {

        var pos = twoMinD.utils.getScreenFloatBlockPosition();

        twoMinD.packets.packetSystem(pos[0], pos[1]);
    };

    setInterval(function () {
        systemUpdate();
    }, settings.speed);
};;function twoMinDutils(settingsIn) {

    var settings = $.extend({}, {
        block_size: 2100,
        blocksHolder: false
    }, settingsIn);

    this.stuped = function () {
        alert('stuped'); //za to moze nicool
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

    this.prettyDate = function (value) {
        
        var t = value.date.split(/[- :]/);
        var date = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

        var diff = (((new Date()).getTime() - date.getTime()) / 1000);

        if(diff < 86400) {
            return  diff < 60 && "Pred menej ako minutou" ||
                    diff < 120 && "Pred jednou minutou" ||
                    diff < 3600 && "Pred " + Math.floor(diff / 60) + " minutami" ||
                    diff < 7200 && "Pred jednou hodinou" ||
                    diff < 86400 && "Pred " + Math.floor(diff / 3600) + " hodinami";
        }
        
        return date.toLocaleString();
    }

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
    $('.dynamic-width-input').each(function () {
        var dynamicElement = $(this);
        var input = dynamicElement.prev();
        dynamicElement.hide();
        
        dynamicElement.text(input.attr("placeholder"));
        var minSize = dynamicElement.width();

        input.on("keypress changeLength", function (e) {
            if (e.which !== 0 && e.charCode !== 0) {
                var c = String.fromCharCode(e.keyCode | e.charCode);
                dynamicElement.text($(this).val() + c);

                var inputSize = dynamicElement.width();
                if (inputSize < minSize) {
                    inputSize = minSize;
                }
                $(this).css("width", inputSize);
            }
        });
    });
});

;$.fn.twoMinDwall = function (twoMinD, settingsIn) {

    var blocksHolder = this;

    var settings = $.extend({}, {
        speed: 400,
        template_block: '<div class="block"></div>',
        template_post: '<p class="post"><span></span><time></time><a href="#" class="reply">Reply</a></p>',
        range: 1,
        moderator: false
    }, settingsIn);
    
    var updateBlock = function (block) {

        var includeDeleted = '0';
        if (block.lastUpdate !== 0 || settings.moderator) {
            includeDeleted = '1';
        }

        twoMinD.packets.packetBlock(block.x, block.y, block.lastUpdate, includeDeleted, function(data) {
            updateBlockData(data);
        });
    };

    var updateBlockData = function (data) {

        var newEl = false;
        var id = "block_" + data.block_x + "_" + data.block_y;
        var block = blocksHolder.find("#" + id);

        if (!block.size()) {
            block = createNewBlock(id);
            newEl = true;
        }

        //block position
        if (newEl) {
            block.css({
                left: data.block_x * 2100,
                top: data.block_y * 2100
            });
        }

        //update time
        block.data('lastUpdate', data.now);

        //title
        if (data.title) {
            setBlockTitle(block, data.title, data.description);

            blocksHolder.trigger("blockInfoUpdate", [
                {block_x: data.block_x, block_y: data.block_y},
                data.title,
                data.description
            ]);
        }

        //posts
        if (data.posts) {
            updatePosts(block, data.posts);
        }
    };

    var createNewBlock = function (id) {
        var blockEl = $(settings.template_block);
        
        blockEl.attr('id', id);
        blocksHolder.append(blockEl);
        
        blocksHolder.trigger('blockCreated', [id]);
        
        return blockEl;
    };

    var setBlockTitle = function (block, title, description) {
        var titleElement = block.find("h3.title");
        if (!titleElement.size()) {
            block.append('<h3 class="title"></h3>');
            titleElement = block.find("h3.title");
        }

        var descriptionElement = block.find("p.description");
        if (!descriptionElement.size()) {
            block.append('<p class="description"></p>');
            descriptionElement = block.find("p.description");
        }

        titleElement.text(title);
        descriptionElement.text(description);
    };

    var updatePosts = function (block, posts) {

        var postsElement = block.find(".posts");
        if (!postsElement.size()) {
            block.append('<div class="posts"></div>');
            postsElement = block.find(".posts");
        }

        $.each(posts, function (index, post) {

            var postId = "post_" + post.id;
            var newEl = false;

            var postEl = postsElement.find("#" + postId);
            if (!postEl.size() && (!post.deleted || settings.moderator)) {
                postEl = $(settings.template_post);
                postEl.attr('id', postId);
                postsElement.append(postEl);
                newEl = true;
            }

            if (newEl) { //it isnt possible to change later, so dont update this stuff:
                if (post.parent) {

                    postEl.hide(); //fix for missing parent posts

                    var parentId = "#post_" + post.parent;
                    var parentEl = postsElement.find(parentId);

                    if (parentEl.size()) {
                        connectParentPost(postEl, parentEl);

                    } else {
                        //missing parent
                        blocksHolder.on("postCreated", function (event, createdPost) {
                            if (createdPost.attr('id') === parentId) {
                                connectParentPost(postEl, createdPost);
                            }
                        });
                    }
                }
            }

            if (post.deleted && !settings.moderator) {
                if (postEl.size()) {
                    blocksHolder.trigger("postRemoved", [postEl]);
                    postEl.remove();
                }
            } else {
                
                postEl.find('span').text(post.content);
                postEl.find('time').text(twoMinD.utils.prettyDate(post.created));

                if (!post.parent) {
                    if (postEl.parent().hasClass('post-group')) {
                        postEl.parent().css({
                            left: post.local_x,
                            top: post.local_y
                        });
                    } else {
                        postEl.css({
                            left: post.local_x,
                            top: post.local_y
                        });
                    }
                }

                postEl.css({
                    background: '#' + post.color
                });

                if (twoMinD.utils.isColorDark(post.color)) {
                    postEl.css({
                        color: '#FFF'
                    });
                } else {
                    postEl.css({
                        color: '#000'
                    });
                }

                if (postEl.height() <= 26) {
                    postEl.css({
                        'white-space': 'nowrap'
                    });
                }

                //moderator
                if (settings.moderator && post.deleted) {
                    postEl.addClass('deleted');
                }
            }

            if (newEl) {
                blocksHolder.trigger("postCreated", [postEl, post]);
            } else {
                blocksHolder.trigger("postUpdate", [postEl, post]);
            }
        });
    };

    var connectParentPost = function (thisPost, parentPost) {

        //create post group if it doesnt exist
        if (!parentPost.parent().hasClass('post-group')) {

            var blockPosts = parentPost.parent();
            parentPost = parentPost.remove();
            var postGroup = $('<div class="post-group"></div>');

            blockPosts.append(postGroup);
            postGroup.append(parentPost);

            postGroup.css({
                top: parentPost.position().top,
                left: parentPost.position().left
            });
            parentPost.css({
                top: 'auto',
                left: 'auto'
            });
        }
        thisPost.remove().insertAfter(parentPost);
        thisPost.show();
    };

    setInterval(function () {
        
        var screenBlock = twoMinD.utils.getScreenCenterBlock();

        var oldestUpdate = 0;
        var oldestBlock = null;

        var blocksToRemove = [];
        $(".block").each(function () {
            blocksToRemove.push($(this));
        });

        for (var x = screenBlock[0] - settings.range; x <= screenBlock[0] + settings.range; x++) {
            for (var y = screenBlock[1] - settings.range; y <= screenBlock[1] + settings.range; y++) {

                var lastUpdate = 0;
                var updateString = '0';
                var block = blocksHolder.find("#block_" + x + "_" + y);
                if (block.size()) {
                    if (block.data("lastUpdate")) {
                        updateString = block.data("lastUpdate");
                        lastUpdate = new Date(updateString.replace(' ', 'T')).getTime(); //convert to time so we can compare it easily
                    }
                }

                if (x === screenBlock[0] && y === screenBlock[1]) {
                    if (lastUpdate > 0) {
                        lastUpdate -= settings.speed * 8;
                    }
                }

                $.each(blocksToRemove, function (index, item) {
                    if (item && item.attr('id') === 'block_' + x + '_' + y) {
                        blocksToRemove.splice(index, 1);
                    }
                });

                if (lastUpdate < oldestUpdate || oldestUpdate === 0) {
                    if (block.size()) {
                        oldestUpdate = lastUpdate;
                    } else {
                        oldestUpdate = 1;
                    }
                    oldestBlock = {
                        x: x,
                        y: y,
                        lastUpdate: updateString
                    };
                }
            }
        }

        //remove blocks out of range
        $.each(blocksToRemove, function (index, item) {
            if (item && item.attr('id') !== 'block_0_0') {
                item.remove();
            }
        });

        if (oldestBlock)
            updateBlock(oldestBlock);

    }, settings.speed);

    //draggable fix.. its so annoying!
    blocksHolder.click(function () {
        document.getSelection().removeAllRanges();

        $("input:focus").blur();
    });

    updateBlock({
        x: 0,
        y: 0,
        lastUpdate: 0
    });
};