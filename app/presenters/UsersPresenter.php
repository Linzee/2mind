<?php

namespace App\Presenters;

/**
 * @author Ienze
 */
class UsersPresenter extends BasePresenter {

    public function renderUsers() {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            if (!$this->currentUser->isModerator()) {
                $this->simpleResponse(\App\TwoMinD\WallError::$NO_MODERATOR);
                return;
            }

            $resopnse = $this->usersManager->users();

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

    public function renderUser($id) {

        if ($id) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                if (!$this->currentUser->isModerator()) {
                    $this->simpleResponse(\App\TwoMinD\WallError::$NO_MODERATOR);
                    return;
                }

                $resopnse = $this->usersManager->user($id);

                $this->simpleResponse($resopnse);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderBan($id, $reason = NULL) {

        if ($id) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                if (!$this->currentUser->isModerator()) {
                    $this->simpleResponse(\App\TwoMinD\WallError::$NO_MODERATOR);
                    return;
                }

                $resopnse = $this->usersManager->ban($id, NULL, $reason);

                $this->simpleResponse($resopnse);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderUnban($id) {

        if ($id) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                if (!$this->currentUser->isModerator()) {
                    $this->simpleResponse(\App\TwoMinD\WallError::$NO_MODERATOR);
                    return;
                }

                $resopnse = $this->usersManager->unban($id);

                $this->simpleResponse($resopnse);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderRemoveAllPosts($id) {

        if ($id) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                if (!$this->currentUser->isModerator()) {
                    $this->simpleResponse(\App\TwoMinD\WallError::$NO_MODERATOR);
                    return;
                }

                $resopnse = $this->usersManager->removeAllPostsBy($id);

                $this->simpleResponse($resopnse);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }
}
