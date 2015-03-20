<?php

namespace App\TwoMinD\Response;

use Nette\Application\IResponse;

/**
 * @author Ienze
 */
class Post implements IResponse {

    private static $fieldsToCopy;
    private $post;

    public function __construct($post) {

        $this->post = $post;

        self::$fieldsToCopy = array('id', 'user', 'color', 'created', 'last_change', 'parent', 'content', 'deleted', 'block_x', 'block_y', 'local_x', 'local_y');
    }

    public function getPost() {
        return $this->post;
    }

    public function getFormatedPost() {

        if (!$this->post) {
            return FALSE;
        }

        $formatedPost = array();
        foreach (self::$fieldsToCopy as $field) {
            $formatedPost[$field] = $this->post->$field;
        }

        return $formatedPost;
    }

    /**
     * Sends response to output.
     * @return void
     */
    public function send(\Nette\Http\IRequest $httpRequest, \Nette\Http\IResponse $httpResponse) {

        $formatedPost = $this->getFormatedPost();

        $response = array();

        if ($formatedPost) {
            $response['post'] = $formatedPost;
        }

        $httpResponse->setContentType('application/json');
        $httpResponse->setExpiration(FALSE);
        echo \Nette\Utils\Json::encode($response);
    }

}
