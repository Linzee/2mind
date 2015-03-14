<?php

namespace App\Presenters;

/**
 * Latest presenter = everything in this something.
 */
class LatestPresenter extends BasePresenter {

    /** @inject @var \App\TwoMinD\Wall */
    public $wall;

    public function renderDefault() {
        
    }
    
    public function renderBlocks() {
        
    }

    public function renderLatest($lastUpdate = null, $includeDeleted = false, $limit = 100, $blocks = false) {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            $latestPosts = $this->wall->loadLatestPosts($lastUpdate, $includeDeleted, $limit, $blocks);

            $this->sendResponse($latestPosts);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

}
