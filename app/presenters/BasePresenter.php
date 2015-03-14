<?php

namespace App\Presenters;

use Nette;

/**
 * Base presenter for all application presenters.
 */
abstract class BasePresenter extends Nette\Application\UI\Presenter {

    /** @var \App\TwoMinD\CurrentUser @inject */
    public $currentUser;
    
    /** @var \App\TwoMinD\UsersManager @inject */
    public $usersManager;
    
    /** @var \App\TwoMinD\Forms\SignInForm @inject */
    public $signInFormFactory;
    
    protected $allowWithoutAjax = false;

    protected function beforeRender() {
        parent::beforeRender();

        $this->allowWithoutAjax = $this->context->parameters['debugMode'] ? true : false;

        $this->template->setTranslator(new \App\TwoMinD\GetTextTranslator());

        $this->template->currentUser = $this->currentUser;
    }

    /*
      SIGN IN
     */

    public function createComponentSignInForm() {
        $form = $this->signInFormFactory->create();

        $presenter = $this;

        $form->onSuccess[] = function (\Nette\Application\UI\Form $form) use ($presenter) {

            if ($presenter->signInFormFactory->signInResponse == 'SUCCESS') {
                $presenter->redirect('Wall:');
            }
        };

        return $form;
    }

}
