$.fn.twoMinDmoderatorActions = function (twoMinD, settingsIn) {

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

