<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

/**
 * @author Ienze
 */
class Block implements IResponse {

    private static $fieldsToCopy;
    private $block_x;
    private $block_y;
    private $now;
    private $posts;
    private $block;

    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($block_x, $block_y, $posts, $block, $now) {

        $this->block_x = $block_x;
        $this->block_y = $block_y;
        $this->now = $now;

        $this->posts = $posts;
        $this->block = $block;

        self::$fieldsToCopy = array('id', 'local_x', 'local_y', 'deleted', 'content', 'color', 'parent', 'created');
    }

    public function getPosts() {
        return $this->posts;
    }

    public function getFormatedPosts() {
        $formatedPosts = array();

        foreach ($this->posts as $post) {
            $formatedPost = array();

            foreach (self::$fieldsToCopy as $field) {
                $formatedPost[$field] = $post->$field;
            }

            $formatedPosts[] = $formatedPost;
        }

        return $formatedPosts;
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {

        $formatedWallPosts = $this->getFormatedPosts();

        $response = array();

        $response['block_x'] = $this->block_x;
        $response['block_y'] = $this->block_y;
        $response['now'] = $this->now;

        if ($this->block) {
            $response['title'] = $this->block->title;
            $response['description'] = $this->block->description;
        }
        if (count($formatedWallPosts) > 0) {
            $response['posts'] = $formatedWallPosts;
        }

        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
