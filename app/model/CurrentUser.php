<?php

namespace App\Model;

class CurrentUser {

    /** @var Nette\Database\Context */
    private $database;
    private $sessionId;
    private $data;
    private $falseData;

    public function __construct(\Nette\Database\Context $database, \Nette\Http\Session $session) {

        $this->database = $database;

        $this->sessionId = $session->id;

        $this->data = $this->database->table('wall_users')->get($this->sessionId);
        if (!$this->data) {
            $this->data = (object) array(
                'background' => '',
                'color' => $this->selectRandomColor()
            );
            $this->falseData = true;
        }
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

    public function getSessionId() {
        return $this->sessionId;
    }

    public function getCurrentOnlineCount($minutes = 3) {
        return $this->database->table('wall_users')->where('last_update > DATE_SUB(NOW(), INTERVAL ? MINUTE)', $minutes)->count();
    }

    public function selectRandomColor() {
        return 'FFFFFF';
    }

    private function createUser() {
        if (!$this->data || $this->falseData) {
            $this->database->table('wall_users')->insert(array(
                'session_id' => $this->sessionId,
                'created' => new \Nette\Database\SqlLiteral('NOW()')
            ));

            $this->data = $this->database->table('wall_users')->get($this->sessionId);
            $this->falseData = false;

            $this->color = $this->selectRandomColor();
        }
    }

}
