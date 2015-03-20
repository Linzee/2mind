<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

/**
 * @author Ienze
 */
class Map implements IResponse {

    private static $fieldsToCopy;
    private $block_x1;
    private $block_y1;
    private $block_x2;
    private $block_y2;
    private $blocks;
    //TODO private $blocksNewPosts
    private $now;

    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($block_x1, $block_y1, $block_x2, $block_y2, $blocks, $now) {

        $this->block_x1 = $block_x1;
        $this->block_y1 = $block_y1;
        $this->block_x2 = $block_x2;
        $this->block_y2 = $block_y2;
        $this->now = $now;

        $this->blocks = $blocks;

        self::$fieldsToCopy = array('block_x', 'block_y', 'title', 'description');
    }

    public function getlocks() {
        return $this->blocks;
    }

    public function getFormatedBlocks() {
        $formatedBlocks = array();

        foreach ($this->blocks as $block) {
            $formatedBlock = array();
            foreach (self::$fieldsToCopy as $field) {
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

        $formatedWallBlocks = $this->getFormatedBlocks();

        $response = array();

        $response['block_x1'] = $this->block_x1;
        $response['block_y1'] = $this->block_y1;
        $response['block_x2'] = $this->block_x2;
        $response['block_y2'] = $this->block_y2;
        $response['now'] = $this->now;

        if (count($formatedWallBlocks) > 0) {
            $response['blocks'] = $formatedWallBlocks;
        }

        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
