<?php

namespace App\TwoMinD;

use Nette,
    App\TwoMinD\Response\Block,
    App\TwoMinD\Response\Search,
    App\TwoMinD\Response\LatestPosts,
    App\TwoMinD\Response\Map;

/**
 * @author Ienze
 */
class Wall extends \Nette\Object {

    /** @var Nette\Database\Context */
    private $database;

    /** @var App\TwoMinD\WallSpamFilter */
    private $wallSpamFilter;

    public function __construct(\Nette\Database\Context $database, \App\TwoMinD\WallSpamFilter $wallSpamFilter) {
        $this->database = $database;
        $this->wallSpamFilter = $wallSpamFilter;
    }

    public function loadBlock($x, $y, $lastUpdate, $includeDeleted) {

        $posts = $this->database->table('wall_posts')
                ->where('block_x', $x)
                ->where('block_y', $y);

        if ($lastUpdate) {
            $posts = $posts->where('last_change >= ?', $lastUpdate);
        }

        if (!$includeDeleted) {
            $posts = $posts->where('deleted', false);
        }

        $block = $this->database->table('wall_blocks')
                ->where('block_x', $x)
                ->where('block_y', $y);

        if ($lastUpdate) {
            $block = $block->where('last_change >= ?', $lastUpdate);
        }

        $now = $this->database->query("SELECT NOW() AS now");
        $nowString = "" . $now->fetch()->now;

        return new Block($x, $y, $posts, $block->fetch(), $nowString);
    }

    public function loadLatestPosts($lastUpdate, $includeDeleted, $limit = 10, $areBlocks = false) {

        if ($areBlocks) {
            $posts = $this->database->table('wall_blocks');
        } else {
            $posts = $this->database->table('wall_posts');
        }

        $posts = $posts->order('created DESC')
                ->limit($limit);

        if ($lastUpdate) {
            $posts = $posts->where('created >= ?', $lastUpdate);
        }

        if (!$areBlocks && !$includeDeleted) {
            $posts = $posts->where('deleted', false);
        }

        $now = $this->database->query("SELECT NOW() AS now");
        $nowString = "" . $now->fetch()->now;

        return new LatestPosts($areBlocks, $posts, $nowString);
    }

    public function loadMap($x1, $y1, $x2, $y2, $lastUpdate) {

        $blocks = $this->database->table('wall_blocks')
                ->where('block_x >= ?', $x1)
                ->where('block_y  >= ?', $y1)
                ->where('block_x <= ?', $x2)
                ->where('block_y  <= ?', $y2);

        if ($lastUpdate) {
            $blocks = $blocks->where('last_change >= ?', $lastUpdate);
        }

        $now = $this->database->query("SELECT NOW() AS now");
        $nowString = "" . $now->fetch()->now;

        return new Map($x1, $y1, $x2, $y2, $blocks, $nowString);
    }

    public function editBlock($x, $y, $title = null, $description = null) {

        $spamCheck = $this->wallSpamFilter->checkSpam('block');
        if ($spamCheck) {
            return $spamCheck;
        }

        if ($x == 0 && $y == 0) {
            return WallError::$HACK;
        }

        $block = $this->database->table('wall_blocks')
                ->where('block_x', $x)
                ->where('block_y', $y)
                ->fetch();

        if ($block != null) {
            if (!$title && !$description) {
                $block->delete();
            }

            if ($title) {
                $block->update(array(
                    'title' => $title
                ));
            }
            if ($description) {
                $block->update(array(
                    'description' => $description
                ));
            }
        } else {
            $this->database->table('wall_blocks')->insert(array(
                'block_x' => $x,
                'block_y' => $y,
                'title' => $title,
                'description' => $description,
                'created' => new \Nette\Database\SqlLiteral('NOW()')
            ));
        }

        return true;
    }

    public function add($block_x, $block_y, $x, $y, $content, CurrentUser $currentUser, $parent = NULL) {

        $spamCheck = $this->wallSpamFilter->checkSpamMessage($block_x, $block_y, $x, $y, $content, $currentUser);
        if ($spamCheck) {
            return $spamCheck;
        }

        if (!$this->checkPosition($x, $y, $block_x, $block_y)) {
            return WallError::$WRONG_POS;
        }

        $this->database->table('wall_posts')->insert(array(
            'block_x' => $block_x,
            'block_y' => $block_y,
            'local_x' => $x,
            'local_y' => $y,
            'content' => $content,
            'parent' => $parent,
            'color' => $currentUser->color,
            'user' => $currentUser->getId(),
            'created' => new \Nette\Database\SqlLiteral('NOW()')
        ));

        return true;
    }

    public function move($id, $x, $y) {

        $spamCheck = $this->wallSpamFilter->checkSpam('move');
        if ($spamCheck) {
            return $spamCheck;
        }

        $post = $this->database->table('wall_posts')->get($id);

        if ($post != null) {

            if (!$this->checkPosition($x, $y, $post->block_x, $post->block_y)) {
                return WallError::$WRONG_POS;
            }

            return $post->update(array(
                        'local_x' => $x,
                        'local_y' => $y
            ));
        }

        return true;
    }

    private function checkPosition($x, $y, $block_x, $block_y) {

        if ($x < 0 || $x > 2100 || $y < 0 || $y > 2100) {
            return fallse;
        }

        if ($block_x == 0 && $block_y == 0) {
            $cor = 2100 / 2 - 400 / 2;
            if ($x > $cor && $y > $cor && $x < $cor + 400 && $y < $cor + 400) {
                return false;
            }
        }

        return true;
    }

    public function remove($id) {

        $spamCheck = $this->wallSpamFilter->checkSpam('delete');
        if ($spamCheck) {
            return $spamCheck;
        }

        $post = $this->database->table('wall_posts')->get($id);

        if ($post != null) {
            $post->update(array(
                'deleted' => 1
            ));
        }

        //remove all childs
        $this->removeChilds($id);

        return true;
    }

    public function renew($id) {

        $spamCheck = $this->wallSpamFilter->checkSpam('delete');
        if ($spamCheck) {
            return $spamCheck;
        }

        $post = $this->database->table('wall_posts')->get($id);

        if ($post != null) {
            $post->update(array(
                'deleted' => false
            ));
        }

        //remove all childs
        $this->removeChilds($id, true);

        return true;
    }

    private function removeChilds($parentId, $renew = false) {

        $childs = $this->database->table('wall_posts')->where('parent', $parentId);

        foreach ($childs as $child) {
            $childId = $child->id;

            if ($renew) {
                $child->update(array('deleted' => false));
            } else {
                $child->update(array('deleted' => true));
            }

            $this->removeChilds($childId, $renew);
        }
    }

    public function post($id) {

        $post = $this->database->table('wall_posts')->get($id);

        return new \App\TwoMinD\Response\Post($post);
    }

    public function search($search) {

        $spamCheck = $this->wallSpamFilter->checkSpam('search');
        if ($spamCheck) {
            return $spamCheck;
        }

        $query = $this->database->queryArgs("
SELECT * FROM wall_blocks
WHERE MATCH(title, description) AGAINST (? IN BOOLEAN MODE)
ORDER BY 2.3 * MATCH(title) AGAINST (?) + MATCH(description) AGAINST (?) DESC;", array($search, $search, $search));

        return new Search($query);
    }

    public function userChangedColor(CurrentUser $currentUser) {

        $spamCheck = $this->wallSpamFilter->checkSpam('color');
        if ($spamCheck) {
            return $spamCheck;
        }

        $posts = $this->database->table('wall_posts')
                ->where('user', $currentUser->getId())
                ->where('created > ?', $currentUser->created);

        $posts->update(array('color' => $currentUser->color));

        return false;
    }

    public function selectRandomBlock($mode) {

        $spamCheck = $this->wallSpamFilter->checkSpam('random');
        if ($spamCheck) {
            return $spamCheck;
        }

        if ($mode == 'empty') {

            $distance = 1;
            $angle = 0;
            $blockNotFree = true;

            $x = 0;
            $y = 0;

            while ($blockNotFree) {
                $distance += rand(0, 10);
                $angle += rand(0, pi() / 2);

                if ($angle > pi() * 2) {
                    $angle -= pi() * 2;
                }

                $x = round(cos($angle) * $distance);
                $y = round(sin($angle) * $distance);

                $blockFreeQuery = $this->database->table('wall_blocks')
                        ->where('block_x', $x)
                        ->where('block_y', $y)
                        ->limit(1)
                        ->fetch();

                $blockNotFree = $blockFreeQuery ? true : false;
            }

            return array($x, $y);
        }


        if ($mode == 'full') {

            $blockSelection = $this->database->table('wall_blocks')
                    ->order(new \Nette\Database\SqlLiteral('RAND()'))
                    ->limit(1)
                    ->fetch();

            if ($blockSelection) {
                return array($blockSelection->block_x, $blockSelection->block_y);
            }
        }

        return false;
    }

}
