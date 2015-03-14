$.fn.twoMinDwall = function (utils, settingsIn) {

    var blocksHolder = this;

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain + '/map/',
        speed: 400,
        template_block: '<div class="block"></div>',
        template_post: '<p class="post"><span></span><a href="#" class="reply">Reply</a></p>',
        template_renew: '<a href="#" class="renew">Renew</a>',
        range: 1,
        moderator: false
    }, settingsIn);

    var updating = false;

    var updateBlock = function (block) {

        updating = true;

        var includeDeleted = '0';
        if (block.lastUpdate !== 0 || settings.moderator) {
            includeDeleted = '1';
        }

        var url = settings.ajax_url + "block?x=" + block.x + "&y=" + block.y + "&lastUpdate=" + block.lastUpdate + "&includeDeleted=" + includeDeleted;

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {

            updating = false;

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
            if (!postEl.size() && !post.deleted) {
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

                if (utils.isColorDark(post.color)) {
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
                if(settings.moderator && post.deleted) {
                    postEl.addClass('deleted');
                    postEl.append(settings.template_renew);
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

        if (updating)
            return;

        var screenBlock = utils.getScreenCenterBlock();

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
    blocksHolder.click(function() {
        document.getSelection().removeAllRanges();
        
        $("input:focus").blur();
    });

    updateBlock({
        x: 0,
        y: 0,
        lastUpdate: 0
    });
};