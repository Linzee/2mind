<?php

namespace App\Presenters;

/**
 * @author Ienze
 */
class AboutPresenter extends BasePresenter {

    public function renderDefault() {

        $this->template->humanstxt = file_get_contents(__DIR__ . '/../../www/humans.txt');
    }

}
