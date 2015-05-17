$(function () {

    var deleteButton = $("footer .icon.delete");

    var tutorialPreStep = function (id) {
        if (id === 6) {
            deleteButton.show();
        }
    };
    var tutorialPostStep = function (id) {
        if (id === 6) {
            deleteButton.hide();
        }
    };
    var tutorialDone = function () {
        deleteButton.hide(); //just in case
    };

    jQuery(document).foundation({
        reveal: {
            animation_speed: 140
        },
        joyride: {
            cookie_monster: true,
            cookie_name: 'tutorial',
            text: 'Dalej',
            pre_step_callback: tutorialPreStep,
            post_step_callback: tutorialPostStep,
            post_ride_callback: tutorialDone
        }
    });

    if ($('.joyride-list').size() > 0) {
        $(document).foundation('joyride', 'start');
    }
    
    $(".start-guide").click(function() {
        $.removeCookie('tutorial');
        $(document).foundation('joyride', 'start');
        return false;
    });
});