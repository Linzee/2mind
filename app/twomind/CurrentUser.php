<?php

namespace App\TwoMinD;

class CurrentUser {

    /** @var \Nette\Database\Context */
    private $database;
    /** @var \Nette\Security\User */
    private $user;
    private $id;
    private $data;
    private $falseData;

    public function __construct(\Nette\Database\Context $database, \Nette\Http\Session $session, \Nette\Security\User $user) {

        $this->database = $database;
        $this->user = $user;

        if($user->isLoggedIn()) {
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
        }
    }
    
    private function createUser() {
        if (!$this->data || $this->falseData) {
            $this->database->table('wall_users')->insert(array(
                'id' => $this->id,
                'created' => new \Nette\Database\SqlLiteral('NOW()')
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

    public function updateUser($x, $y) {

        $this->createUser();

        $this->data->update(array(
            'pos_x' => $x,
            'pos_y' => $y
        ));
    }
    
    public function selectRandomColor() {
        return 'FFFFFF';
    }
    
    public function isModerator() {
        return $this->user->isLoggedIn() && $this->moderator;
    }
}
