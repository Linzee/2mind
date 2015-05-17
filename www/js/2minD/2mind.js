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
};