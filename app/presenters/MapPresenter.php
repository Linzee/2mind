<?php

namespace App\Presenters;

use Nette\Utils\Validators;

/**
 * @author Ienze
 */
class MapPresenter extends BasePresenter {

    /** @inject @var \App\TwoMinD\Wall */
    public $wall;

    public function renderMap($x1, $y1, $x2, $y2, $lastUpdate = null) {

        if (Validators::isNumericInt($x1) && Validators::isNumericInt($y1) && Validators::isNumericInt($x2) && Validators::isNumericInt($y2)) {
            if ($this->isAjax() || $this->allowWithoutAjax) {

                $map = $this->wall->loadMap($x1, $y1, $x2, $y2, $lastUpdate);

                $this->sendResponse($map);
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

            if ($searchResult instanceof \App\TwoMinD\WallError) {
                $this->simpleResponse($searchResult);
            } else {
                $this->sendResponse($searchResult);
            }
        } else {
            throw new \Nette\Application\ForbiddenRequestException("Only avaleible trought ajax.");
        }
    }

}
