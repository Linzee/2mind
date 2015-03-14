<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

class Users implements IResponse {

    private static $fieldsToCopy;
    private $users;

    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($users) {

        $this->users = $users;

        self::$fieldsToCopy = array('id', 'color', 'moderator');
    }

    public function getUsers() {
        return $this->users;
    }

    public function getFormatedUsers() {
        $formatedUsers = array();

        foreach ($this->users as $user) {
            $formatedUser = array();
            
            foreach (self::$fieldsToCopy as $field) {
                $formatedUser[$field] = $user->$field;
            }
            
            //if is logined user, not anonym, send also user (login users have max 16 characters while not logined have about 40)
            if(strlen($user->id <= 16)) {
                $formatedUser['login'] = TRUE;
            }
            
            $formatedUsers[] = $formatedUser;
        }

        return $formatedUsers;
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {

        $formatedUsers = $this->getFormatedUsers();

        $response = array();

        if (count($formatedUsers) > 0) {
            $response['users'] = $formatedUsers;
        }

        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
