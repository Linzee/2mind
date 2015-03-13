<?php

namespace App\Presenters;

use Nette,
    App\Model\CurrentUser;

/**
 * Base presenter for all application presenters.
 */
abstract class BasePresenter extends Nette\Application\UI\Presenter {

    /** @var App\Model\CurrentUser */
    protected $currentUser;

    public function __construct(\Nette\Database\Context $database, \Nette\Http\Session $session) {
        $this->currentUser = new CurrentUser($database, $session);
    }

    protected function beforeRender() {
        parent::beforeRender();

        $this->template->setTranslator(new \App\Model\GetTextTranslator());
        
        $this->template->currentUser = $this->currentUser;
    }

}
