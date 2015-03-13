<?php

namespace App\Model;

class WallError {
    
    public static $HACK;
    public static $WRONG_POS;
    public static $BAN;
    public static $BANDWIDTH;
    public static $ERROR;
    
    public $errorType;
    public $errorMessage;
    
    public function __construct($errorType, $errorMessage) {
        $this->errorType = $errorType;
        $this->errorMessage = $errorMessage;
    }
    
}
WallError::$HACK = new WallError('what', 'O co sa snazis? Chces pocut klopat heisenberga na tvoje dvere?');
WallError::$WRONG_POS = new WallError('wrong-pos', 'Nieje mozne umiestnit spravu na toto miesto.');
WallError::$BAN = new WallError('ban', 'Prepac, ale mas zakazany pristup.');
WallError::$BANDWIDTH = new WallError('bandwidth', 'Prepac, ale si prilis agresivny clen pre nasu stranku, prosim spomal trochu.');
WallError::$ERROR = new WallError('error', 'Nastala chyba.');