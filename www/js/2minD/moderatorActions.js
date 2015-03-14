$.fn.twoMinDmoderatorActions = function (utils, settingsIn) {

    var settings = $.extend({}, {
        ajax_url: 'http://' + document.domain,
        user_template: '<li><a href="#"></a></li>'
    }, settingsIn);

    var blocksHolder = this;

    var actions = {
        online: function (object, settings) {
            object.click(function () {

                var url = settings.ajax_url + "/users/users";

                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function (data) {

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

                var url = settings.ajax_url + "/users/user?id=" + settings.user;

                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function (data) {

                    if (data.user) {

                        try {
                            $('#userReveal').foundation('reveal', 'open');
                        } catch (e) {

                        }

                        var userEl = $('#userReveal');
                        
                        $.each(data.user, function (index, value) {

                            if(Object.prototype.toString.call(value) === '[object Date]') {
                                value = value.
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

                var url = settings.ajax_url + "/wall/post?id=".settings.post;

                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function (data) {

                    if (data.post) {

                        $('#postReveal').foundation('reveal', 'open');

                        var postEl = $('#postReveal');

                        $.each(data.post, function (index, value) {
                            postEl.find('.' + index).text(value);
                        });

                    }
                });

                return false;
            });
        }
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
};

