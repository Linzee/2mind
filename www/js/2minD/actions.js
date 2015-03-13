$.fn.twoMinDactions = function (utils, settingsIn) {

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain + '/wall/',
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
            object.click(function () {
                if (settings.spawnToCenter) {
                    blocksHolder.css({
                        left: $(window).width() / 2,
                        top: $(window).height() / 2
                    });
                } else {
                    blocksHolder.css({
                        left: 0,
                        top: 0
                    });
                }

                blocksHolder.trigger("holderMoved");

                return false;
            });
            if (settings.spawnToCenter) {
                blocksHolder.css({
                    left: $(window).width() / 2,
                    top: $(window).height() / 2
                });
                blocksHolder.trigger("forceUpdateFixedPos");
            }
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

                var block_pos = utils.getScreenCenterBlock();
                var local_pos = utils.getScreenCenterLocalBlockPosition();

                var content = encodeURIComponent(addField.val());

                if (content.length === 0) {
                    object.foundation('reveal', 'close');
                    return false;
                }

                var url = settings.ajax_url + "add?block_x=" + block_pos[0] + "&block_y=" + block_pos[1] + "&x=" + local_pos[0] + "&y=" + local_pos[1] + "&content=" + content;

                if (replyTo) {
                    url = url + '&parent=' + replyTo;
                }

                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function (data) {
                    if (data.response !== 'success') {
                        utils.showMessage('Nastal problem!', '(' + data.response + ') ' + data.message);
                    }
                });

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
                        '<a href="wall/#' + goToId + '" class="block-title">' + block.title +
                        '<span class="coord"> [' + block.block_x + ', ' + block.block_y + '] </span>' +
                        '<div class="block-description">' + block.description + '</div></a>' +
                        '</li>');
            });

        } else {
            searchResults.append("<li>Neboli nájdene žiadne témy.</li>");
        }
        
        $("#searchReveal").foundation('reveal', 'open');

    };

    var performSearch = function (search) {

        var url = settings.ajax_url + "search?search=" + encodeURIComponent(search);

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {
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
    updateHashLocation();

    $.fn.twoMinDaction = function (settingsIn) {

        var object = this;

        var settings = $.extend({}, {
            action: false,
            blocksHolder: $(".blocks-holder")
        }, settingsIn);
        
        if (settings.action) {
            //find correct action and run it
            $.each(actions, function (action, actionFunction) {
                if (settings.action === action) {
                    actionFunction(object, settings);
                }
            });
        }
    };
};
