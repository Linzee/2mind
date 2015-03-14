<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

class Search implements IResponse {
    
    private static $fieldsToCopy;
    
    private $blocks;

    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($blocks) {

        $this->blocks = $blocks;
        
        
        self::$fieldsToCopy = array('block_x', 'block_y', 'title', 'description');
    }

    public function getBlocks() {
        return $this->blocks;
    }

    public function getFormatedBlocks() {
        $formatedBlocks = array();
        
        foreach($this->blocks as $block) {
            $formatedBlock = array();
            foreach(self::$fieldsToCopy as $field) {
                $formatedBlock[$field] = $block->$field;
            }
            $formatedBlocks[] = $formatedBlock;
        }
        
        return $formatedBlocks;
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {

        $formatedBlocks = $this->getFormatedBlocks();
        
        $response = array();
        
        if(count($formatedBlocks) > 0) {
            $response['blocks'] = $formatedBlocks;
        }
        
        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
