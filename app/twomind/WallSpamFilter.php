<?php

namespace App\TwoMinD;

/**
 * @author Ienze
 */
class WallSpamFilter extends \Nette\Object {

    const
            MAX_QUERY = "400";

    private $sections;

    /** @var Nette\Database\Context */
    private $database;

    /** @var Nette\Http\Request */
    private $request;

    /** @var \App\TwoMinD\UsersManager */
    private $userManager;

    /** @var \App\TwoMinD\CurrentUser */
    public $currentUser;

    public function __construct(\Nette\Database\Context $database, \Nette\Http\Request $request, \App\TwoMinD\UsersManager $userManager, \App\TwoMinD\CurrentUser $currentUser) {
        $this->database = $database;
        $this->request = $request;
        $this->userManager = $userManager;
        $this->currentUser = $currentUser;

        $this->sections = array(
            'block' => (object) array('id' => 1, 'limit' => 400), //TODO decrease and change way updates are send
            'message' => (object) array('id' => 5, 'limit' => 60),
            'move' => (object) array('id' => 6, 'limit' => 400),
            'delete' => (object) array('id' => 7, 'limit' => 10),
            'search' => (object) array('id' => 10, 'limit' => 10),
            'color' => (object) array('id' => 11, 'limit' => 5),
            'random' => (object) array('id' => 12, 'limit' => 20)
        );
    }

    public function checkSpamMessage($content) {

        $simpleCheck = $this->checkSpam('message');
        if ($simpleCheck) {
            return $simpleCheck;
        }

        return false;
    }

    public function checkSpam($section) {

        $sectionConfig = $this->sections[$section];
        $sectionId = 0;
        if ($sectionConfig) {
            $sectionId = $sectionConfig->id;
        }

        $ip = $this->request->getRemoteAddress();

        $this->database->table('wall_bandwidth')->insert(array(
            'ip' => $ip,
            'se' => $sectionId
        ));

        if ($this->userManager->isBanned($this->currentUser->getId(), $ip)) {
            return WallError::$BAN;
        }

        $queries = $this->database->queryArgs('SELECT (SELECT COUNT(*) FROM `wall_bandwidth` WHERE ip=? AND at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS countGlobal, (SELECT COUNT(*) FROM `wall_bandwidth` WHERE ip=? AND at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) AND se=?) AS countLocal', array($ip, $ip, $sectionId));

        $queries = $queries->fetch();

        if ($queries->countGlobal > self::MAX_QUERY || (!$sectionConfig || $queries->countLocal > $sectionConfig->limit)) {

            if ($queries->countGlobal > self::MAX_QUERY * 1.4 || (!$sectionConfig || $queries->countLocal > $sectionConfig->limit * 1.4 )) {
                $this->userManager->ban($this->currentUser->getId(), $ip, 'bandwidth');
            }

            return WallError::$BANDWIDTH;
        }

        return false;
    }

}
