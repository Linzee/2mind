<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\TwoMinD;

/**
 * Description of GetTextTranslator
 *
 * @author Ienze
 */
class GetTextTranslator implements \Nette\Localization\ITranslator {

    public function __construct() {

        //TODO: create translator
    }

    public function translate($message, $count = NULL) {
        return $message;
    }

}