<?php

namespace App\Presenters;

use App\Model\WallError;

class UsersPresenter extends BasePresenter {
    
    public function renderUsers() {

        if ($this->isAjax() || $this->allowWithoutAjax) {
            
            $resopnse = $this->usersManager->users();

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }
    
    public function renderUser($id) {

        if ($this->isAjax() || $this->allowWithoutAjax) {
            
            $resopnse = $this->usersManager->user($id);

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }
    
    
}
