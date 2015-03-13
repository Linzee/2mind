<?php

namespace App\Response;

use Nette\Application\IResponse;

class LatestPosts implements IResponse {

    private static $fieldsToCopy;
    
    private $areBlocks;
    private $posts;
    private $now;
    
    /**
     * @param  array|\stdClass  payload
     * @param  string    MIME content type
     */
    public function __construct($areBlocks, $posts, $now) {
        $this->areBlocks = $areBlocks;
        $this->posts = $posts;
        $this->now = $now;
        
        if($areBlocks) {
            self::$fieldsToCopy = array('block_x', 'block_y', 'title', 'description');
        } else {
            self::$fieldsToCopy = array('id', 'block_x', 'block_y', 'local_x', 'local_y', 'deleted', 'content');
        }
    }

    public function areBlocks() {
        return $this->areBlocks;
    }
    
    public function getPosts() {
        return $this->posts;
    }

    public function getFormatedPosts() {
        $formatedPosts = array();
        
        foreach($this->posts as $post) {
            $formatedPost = array();
            foreach(self::$fieldsToCopy as $field) {
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
        
        $response['now'] = $this->now;
        $response['areBlocks'] = $this->areBlocks;
        
        if(count($formatedWallPosts) > 0) {
            $response['posts'] = $formatedWallPosts;
        }
        
        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
