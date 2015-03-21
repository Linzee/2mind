<?php

namespace App\TwoMinD;

/**
 * @author Ienze
 */
class CurrentUser {

    /** @var App\TwoMinD\Pallete */
    private $pallete;

    /** @var \Nette\Database\Context */
    private $database;

    /** @var \Nette\Security\User */
    private $user;

    /** @var \Nette\Http\IRequest */
    private $request;
    private $id;
    private $data;
    private $falseData;

    public function __construct(\App\TwoMinD\Pallete $pallete, \Nette\Database\Context $database, \Nette\Http\Session $session, \Nette\Security\User $user, \Nette\Http\IRequest $request) {

        $this->pallete = $pallete;
        $this->database = $database;
        $this->user = $user;
        $this->request = $request;

        if ($user->isLoggedIn()) {
            $this->id = $user->id;
        } else {
            $this->id = $session->id;
        }

        $this->data = $this->database->table('wall_users')->get($this->id);
        if (!$this->data) {
            $this->data = (object) array(
                'background' => '',
                'color' => $this->selectRandomColor()
            );
            $this->falseData = true;
        } else {
            $this->data->update(array(
                'ip' => $this->request->getRemoteAddress()
            ));
        }
    }

    private function createUser() {
        if (!$this->data || $this->falseData) {

            $this->database->table('wall_users')->insert(array(
                'id' => $this->id,
                'created' => new \Nette\Database\SqlLiteral('NOW()'),
                'ip' => $this->request->getRemoteAddress()
            ));

            $this->data = $this->database->table('wall_users')->get($this->id);
            $this->falseData = false;

            $this->color = $this->selectRandomColor();
        }
    }

    public function getId() {
        return $this->id;
    }

    public function __get($name) {
        if ($this->data) {
            return $this->data->$name;
        }
        return null;
    }

    public function __set($name, $value) {

        $this->createUser();

        if ($this->data) {
            $this->data->update(array($name => $value));
        }
    }

    public function getPosString() {
        if(property_exists($this->data, 'pos_x')) {
            return '{pos_x: '.$this->pos_x.', pos_y: '.$this->pos_y.'}';
        } else {
            return '{pos_x: 0.5, pos_y: 0.5}';
        }
    }
    
    public function updateUser($x, $y) {

        $this->createUser();

        $this->data->update(array(
            'pos_x' => $x,
            'pos_y' => $y
        ));
    }

    public function getPallete() {
        return $this->pallete;
    }

    public function selectRandomColor() {
        return $this->pallete->randomColor();
    }

    public function isModerator() {
        return $this->user->isLoggedIn() && $this->moderator;
    }

}
