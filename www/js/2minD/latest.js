$.fn.twoMinDlatest = function (settingsIn) {

    var latestHolder = this;

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain + '/latest/',
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

    var ajaxing = false;
    var latestUpdateTime = 0;

    var sendRequest = function () {

        if (ajaxing)
            return;

        ajaxing = true;

        var includeDeleted = '0';
        if (latestUpdateTime !== 0) {
            includeDeleted = '1';
        }

        var url = settings.ajax_url + "latest?lastUpdate=" + latestUpdateTime + "&includeDeleted=" + includeDeleted;

        if (settings.limit) {
            url = url + '&limit=' + settings.limit;
        }

        if (settings.blocks) {
            url = url + '&blocks=1';
        }

        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (data) {

            if (data.posts) {
                updatePosts(data.posts);
            }

            latestUpdateTime = data.now;

            ajaxing = false;
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
                    postEl.find('a').attr('href', 'wall#block_' + post.block_x + '_' + post.block_y);
                } else {
                    postEl.find('a').attr('href', 'wall#block_' + post.block_x + '_' + post.block_y + '_' + post.local_x + '_' + post.local_y);
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