<?php

namespace App\Model;

use App\Model\CurrentUser;

class WallSpamFilter extends \Nette\Object {
    
    const 
        MAX_QUERY = "400";
    
    private $sections;
    
    /** @var Nette\Database\Context */
    private $database;
    /** @var Nette\Http\IRequest */
    private $request;
    
    public function __construct(\Nette\Database\Context $database, \Nette\Http\IRequest $httpRequest) {
        $this->database = $database;
        $this->request = $httpRequest;
        
        $this->sections = array(
            'block' => (object)array('id'=>1, 'limit'=>400), //TODO decrease and change way updates are send
            'message' => (object)array('id'=>5, 'limit'=>60),
            'move' => (object)array('id'=>6, 'limit'=>400),
            'delete' => (object)array('id'=>7, 'limit'=>10),
            'search' => (object)array('id'=>10, 'limit'=>10),
            'color' => (object)array('id'=>11, 'limit'=>5),
            'random' => (object)array('id'=>12, 'limit'=>20)
        );
    }
    
    public function checkSpamMessage($content) {
        
        $simpleCheck = $this->checkSpam('message');
        if($simpleCheck) {
            return $simpleCheck;
        }
        
        return false;
    }
    
    public function checkSpam($section) {
        
        $sectionConfig = $this->sections[$section];
        $sectionId = 0;
        if($sectionConfig) {
            $sectionId = $sectionConfig->id;
        }
        
        $ip = $this->request->getRemoteAddress();
        
        $this->database->table('wall_bandwidth')->insert( array(
            'ip' => $ip,
            'se' => $sectionId
        ));
        
        $banCount = $this->database->table('wall_ban')->where('ip', $ip)->count();
        
        if($banCount > 0) {
            return WallError::$BAN;
        }
        
        $queries = $this->database->queryArgs('SELECT (SELECT COUNT(*) FROM `wall_bandwidth` WHERE ip=? AND at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)) AS countGlobal, (SELECT COUNT(*) FROM `wall_bandwidth` WHERE ip=? AND at > DATE_SUB(NOW(), INTERVAL 1 MINUTE) AND se=?) AS countLocal',
                array($ip, $ip, $sectionId));
        
        $queries = $queries->fetch();
        
        if($queries->countGlobal > self::MAX_QUERY || (!$sectionConfig || $queries->countLocal > $sectionConfig->limit)) {
            
            if($queries->countGlobal > self::MAX_QUERY * 1.4 || (!$sectionConfig || $queries->countLocal > $sectionConfig->limit * 1.4 )) {
                $this->database->table('wall_ban')->insert( array(
                    'ip' => $ip,
                    'reason' => 'bandwidth'
                ));
            }
            
            return WallError::$BANDWIDTH;
        }
        
        return false;
    }
    
}
