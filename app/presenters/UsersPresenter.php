<?php

namespace App\Presenters;

class UsersPresenter extends BasePresenter {

    public function renderUsers() {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            if (!$this->currentUser->isModerator()) {
                $this->simpleResponse(\App\Model\WallError::NO_MODERATOR);
                return;
            }

            $resopnse = $this->usersManager->users();

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

    public function renderUser($id) {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            if (!$this->currentUser->isModerator()) {
                $this->simpleResponse(\App\Model\WallError::NO_MODERATOR);
                return;
            }

            $resopnse = $this->usersManager->user($id);

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

}
