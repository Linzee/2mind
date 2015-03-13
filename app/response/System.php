<?php

namespace App\Response;

use Nette\Application\IResponse;

class System implements IResponse {
    
    private static $fieldsToCopy;
    
    private $online;
    private $forceReload;
    private $sysmessage;

    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($online = null, $forceReload = null, $sysmessage = null) {

        $this->online = $online;
        $this->forceReload = $forceReload;
        $this->sysmessage = $sysmessage;
        
        self::$fieldsToCopy = array('online', 'forceReload', 'sysmessage');
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {
        
        $response = array();
        
        foreach(self::$fieldsToCopy as $field) {
            if($this->$field) {
                $response[$field] = $this->$field;
            }
        }
        
        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
