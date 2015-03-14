<?php

namespace App\Presenters;

class UserPresenter extends BasePresenter {

    /** @var \App\TwoMinD\Forms\SignUpForm @inject */
    public $signUpFormFactory;

    //sign in form is defined in base presenter

    protected function createComponentSignUpForm() {
        $form = $this->signUpFormFactory->create();

        $presenter = $this;

        $form->onSuccess[] = function (\Nette\Application\UI\Form $form) use ($presenter) {
            if ($presenter->signUpFormFactory->signUpResponse == 'FAIL') {
                $presenter->flashMessage('Somethign went wrong! Please try other info or try again later.', 'alert');
                $presenter->redirect('User:register');
            }
            if ($presenter->signUpFormFactory->signUpResponse == 'SUCCESS') {
                $presenter->redirect('User:registred');
            }
        };

        return $form;
    }

    public function actionLogout() {
        $this->getUser()->logout();
        $this->redirect('Title:');
    }

}
