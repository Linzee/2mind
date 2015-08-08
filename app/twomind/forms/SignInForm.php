<?php

namespace App\TwoMinD\Forms;

use \Nette\Application\UI\Form;

/**
 * @author Ienze
 */
class SignInForm extends Form {

    /** @var Nette\Security\User */
    protected $user;
    public $signInResponse;

    public function __construct(\Nette\Security\User $user) {
        parent::__construct();
        $this->user = $user;
    }

    public function create() {
        $form = new Form();
        $form->addText('username', 'Prihlasovacie meno:')
                ->setAttribute('placeholder', 'Prihlasovacie meno');

        $form->addPassword('password', 'Heslo:')
                ->setAttribute('placeholder', 'Heslo');

        $form->addCheckbox('remember', 'Zapamatat prihlasenie');

        $form->addSubmit('send', 'Prihlásiť')
                ->setAttribute('class', 'button expand');
		
        // call method signInFormSucceeded() on success
        $form->onSuccess[] = $this->formSucceeded;
        return $form;
    }

    public function formSucceeded($form, $values) {

        if ($values->remember) {
            $this->user->setExpiration('14 days', FALSE);
        } else {
            $this->user->setExpiration('20 minutes', TRUE);
        }

        $this->signInResponse = 'SUCCESS';

        try {
            $this->user->login($values->username, $values->password);
        } catch (\Nette\Security\AuthenticationException $e) {
            $form->addError('Meno alebo heslo je nesprávne.');
            $this->signInResponse = 'FAIL';
        }
    }

}
