<?php

namespace App\Presenters;

use Nette,
    Nette\Application\Responses\JsonResponse;

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
        
        $this->template->online = $this->usersManager->getCurrentOnlineCount();
    }

    public function simpleResponse($response) {
        if ($response instanceof \App\Model\WallError) {
            $this->sendResponse(new JsonResponse(array('response' => $response->errorType, 'message' => $response->errorMessage)));
        } else if ($response instanceof \Nette\Application\IResponse) {
            $this->sendResponse($response);
        } else {
            $this->sendResponse(new JsonResponse(array('response' => 'success')));
        }
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
