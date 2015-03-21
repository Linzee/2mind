<?php

namespace App\TwoMinD;

use Nette\Security\Passwords;

/**
 * @author Ienze
 */
class UsersManager implements \Nette\Security\IAuthenticator {

    /** @var Nette\Database\Context */
    private $database;

    public function __construct(\Nette\Database\Context $database) {

        $this->database = $database;
    }

    public function getCurrentOnlineCount($minutes = 3) {
        return $this->getCurrentOnlineUsers()->count($minutes);
    }

    public function getCurrentOnlineUsers($minutes = 3) {
        return $this->database->table('wall_users')->where('last_update > DATE_SUB(NOW(), INTERVAL ? MINUTE)', $minutes);
    }

    public function users() {
        return new \App\TwoMinD\Response\Users($this->getCurrentOnlineUsers());
    }

    public function user($id) {

        $user = $this->database->table('wall_users')->get($id);

        return new \App\TwoMinD\Response\User($user);
    }

    public function ban($id, $ip = NULL, $reason = NULL) {

        if ($ip == NULL) {
            $user = $this->database->table('wall_users')->get($id);
            if ($user) {
                $ip = $user->ip;
            }
        }

        $this->database->table('wall_ban')->insert(array(
            'id' => $id,
            'ip' => $ip,
            'reason' => $reason
        ));
    }

    public function unban($id) {

        $banEntry = $this->database->table('wall_ban')->where('ip = ? OR id = ?', array($id, $id));

        $banEntry->delete();
    }

    public function isBanned($id) {
        $banEntry = $this->database->table('wall_ban')->where('ip = ? OR id = ?', array($id, $id))->fetch();
        return $banEntry ? true : false;
    }
    
    public function removeAllPostsBy($id) {
        $this->database->table('wall_posts')->where('user', $id)->update(array('deleted' => 1));
        return true;
    }

    /**
     * Performs an authentication.
     * @return Nette\Security\Identity
     * @throws Nette\Security\AuthenticationException
     */
    public function authenticate(array $credentials) {
        list($username, $password) = $credentials;

        $row = $this->database->table('wall_users')->get($username);

        if (!$row) {
            throw new \Nette\Security\AuthenticationException('Meno alebo heslo je nespravne.', self::IDENTITY_NOT_FOUND);
        } elseif (!$row['password']) {
            throw new \Nette\Security\AuthenticationException('Meno alebo heslo je nespravne.', self::FAILURE);
        } elseif (!Passwords::verify($password, $row['password'])) {
            throw new \Nette\Security\AuthenticationException('Meno alebo heslo je nespravne.', self::INVALID_CREDENTIAL);
        } elseif (Passwords::needsRehash($row['password'])) {
            $row->update(array(
                'password' => Passwords::hash($password),
            ));
        }

        $arr = $row->toArray();
        unset($arr['password']);
        return new \Nette\Security\Identity($row['id'], NULL, $arr);
    }

    /**
     * Adds new user.
     * @param  string username
     * @param  string password
     * @return void
     */
    public function add($username, $password, $email = NULL) {

        $verifykey = \Nette\Utils\Random::generate(40);

        $user = $this->database->table('wall_users')->insert(array(
            'id' => $username,
            'password' => Passwords::hash($password),
            'email' => $email,
            'created' => new \Nette\Database\SqlLiteral('NOW()'),
            'verifykey' => $verifykey
        ));

        if (FALSE) { //TODO
            $mail = new \Nette\Mail\Message();
            $mail->setFrom('2minD <2minD@ienze.me>')
                    ->addTo($email)
                    ->setSubject('Overenie uctu')
                    ->setBody("Hello, Your order has been accepted.");
        }

        return true; //TODO is insert succesfull?
    }

}
