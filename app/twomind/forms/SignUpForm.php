<?php

namespace App\TwoMinD\Forms;

use \Nette\Application\UI\Form;

class SignUpForm extends Form {

    /** @var App\TwoMinD\UsersManager */
    protected $userManager;
    public $signUpResponse;

    public function __construct(\App\TwoMinD\UsersManager $userManager) {
        parent::__construct();
        $this->userManager = $userManager;
    }

    public function create() {
        $form = new Form();

        $form->addText('username', 'Prihlasovacie meno')
                ->addRule(Form::MIN_LENGTH, 'Meno musi mat maximalne %d znaky.', 3)
                ->addRule(Form::MAX_LENGTH, 'Meno nesme byt dlhsie ako %d znakov.', 16)
                ->addRule(Form::PATTERN, 'Meno moze obsahovat iba znaky a-z A-Z a cisla 0-9.', '[a-zA-Z0-9]+')
                ->setRequired(true)
                ->setAttribute('placeholder', 'Prihlasovacie meno');

        $form->addText('email', 'E-mail', 35)
                ->addRule(Form::EMAIL, 'Neplatná emailová adresa')
                ->setRequired(true)
                ->setAttribute('placeholder', 'E-mail');

        $form->addPassword('password', 'Heslo', 64)
                ->addRule(Form::MIN_LENGTH, 'Heslo musi mat aspon %d znakov!', 8)
                ->setRequired(true)
                ->setAttribute('placeholder', 'Heslo');

        $form->addPassword('password2', 'Zopakuj heslo', 64)
                ->addRule(Form::EQUAL, 'Hesla sa nezhoduju!', $form['password'])
                ->setRequired(true)
                ->setAttribute('placeholder', 'Zopakuj heslo');

        $form->addSubmit('send', 'Registrovat')
                ->setAttribute('class', 'button expand');

        $form->onSuccess[] = $this->formSucceeded;

        return $form;
    }

    public function formSucceeded(Form $form) {

        $values = $form->getValues();

        $new_user = $this->userManager->add($values["username"], $values["password"], $values["email"]);
        if ($new_user) {
            $this->signUpResponse = 'SUCCESS';
        } else {
            $this->signUpResponse = 'FAIL';
        }
    }

}
