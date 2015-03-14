<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

class User implements IResponse {

    private static $fieldsToCopy;
    private $user;

    public function __construct($user) {

        $this->user = $user;

        self::$fieldsToCopy = array('id', 'color', 'created', 'last_update', 'email', 'moderator', 'verified', 'pos_x', 'pos_y');
    }

    public function getUser() {
        return $this->user;
    }

    public function getFormatedUser() {

        if (!$this->user) {
            return FALSE;
        }

        $formatedUser = array();
        foreach (self::$fieldsToCopy as $field) {
            $formatedUser[$field] = $this->user->$field;
        }

        return $formatedUser;
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {

        $formatedUser = $this->getFormatedUser();

        $response = array();

        if ($formatedUser) {
            $response['user'] = $formatedUser;
        }

        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
