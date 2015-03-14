<?php

namespace App\Presenters;

use Nette\Utils\Validators,
    App\Response\System,
    Nette\Application\Responses\JsonResponse,
    App\Response\LatestPosts;

/**
 * Wall presenter = everything in this something.
 */
class WallPresenter extends BasePresenter {

    /** @inject @var \App\TwoMinD\Wall */
    public $wall;

    public function renderDefault() {
        $this->template->online = $this->usersManager->getCurrentOnlineCount();
    }

    public function renderSystem($x, $y) {

        if (Validators::isNumeric($x) && Validators::isNumeric($y)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $this->currentUser->updateUser($x, $y);

                $this->sendResponse(new System($this->currentUser->getCurrentOnlineCount()));
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderBlock($x, $y, $lastUpdate = null, $includeDeleted = false) {

        if (Validators::isNumericInt($x) && Validators::isNumericInt($y)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $block = $this->wall->loadBlock($x, $y, $lastUpdate, $includeDeleted);

                $this->sendResponse($block);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderEditBlock($x, $y, $title = null, $description = null) {

        if (Validators::isNumericInt($x) && Validators::isNumericInt($y)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $response = $this->wall->editBlock($x, $y, $title, $description);

                $this->simpleResponse($response);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderAdd($block_x, $block_y, $x, $y, $content, $parent = NULL) {

        if (Validators::isNumericInt($block_x) && Validators::isNumericInt($block_y) && Validators::isNumericInt($x) && Validators::isNumericInt($y) && $content) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $response = $this->wall->add($block_x, $block_y, $x, $y, $content, $this->currentUser, $parent);

                $this->simpleResponse($response);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderMove($id, $x, $y) {

        if (Validators::isNumericInt($id) && Validators::isNumericInt($x) && Validators::isNumericInt($y)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $response = $this->wall->move($id, $x, $y);

                $this->simpleResponse($response);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderRemove($id) {

        if (Validators::isNumericInt($id)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $response = $this->wall->remove($id);

                $this->simpleResponse($response);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderRenew($id) {

        if (Validators::isNumericInt($id)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                if (!$this->currentUser->isModerator()) {
                    $this->simpleResponse(\App\Model\WallError::NO_MODERATOR);
                    return;
                }

                $response = $this->wall->renew($id);

                $this->simpleResponse($response);
            } else {
                throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
            }
        } else {
            throw new \Nette\InvalidArgumentException("Argumets are missing");
        }
    }

    public function renderSearch($search) {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            $searchResult = $this->wall->search($search);

            if ($searchResult instanceof \App\Model\WallError) {
                $this->simpleResponse($searchResult);
            } else {
                $this->sendResponse($searchResult);
            }
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

    public function renderChangeColor($color = null, $background = null) {

        if ($this->isAjax() || $this->allowWithoutAjax) {

            if (preg_match("([0-9a-fA-F]{6}|[0-9a-fA-F]{3})", $color)) {
                $this->currentUser->color = $color;
                $resopnse = $this->wall->userChangedColor($this->currentUser);
            }

            $this->currentUser->background = $background;

            $this->simpleResponse($resopnse);
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }
    
    public function actionRandom($mode) {

        if ($mode == 'empty' || $mode == 'full') {

            $block = $this->wall->selectRandomBlock($mode);

            if ($block) {
                $this->redirect('Wall:default#block_' . $block[0] . '_' . $block[1]);
            } else {
                $this->simpleResponse(WallError::$ERROR);
            }
        } else {
            $this->simpleResponse(WallError::$HACK);
        }
    }

    public function renderLoad() {

        $this->sendResponse(new JsonResponse(array(
            '1' => $this->currentUser->getCurrentOnlineCount(1),
            '15' => $this->currentUser->getCurrentOnlineCount(15),
            '60' => $this->currentUser->getCurrentOnlineCount(60)
        )));
    }

    private function simpleResponse($response) {
        if ($response instanceof \App\Model\WallError) {
            $this->sendResponse(new JsonResponse(array('response' => $response->errorType, 'message' => $response->errorMessage)));
        } else {
            $this->sendResponse(new JsonResponse(array('response' => 'success')));
        }
    }

}
