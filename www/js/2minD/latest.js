$.fn.twoMinDlatest = function (twoMinD, settingsIn) {

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
};