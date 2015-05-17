$.fn.twoMinDpost = function (twoMinD, settingsIn) {

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

};