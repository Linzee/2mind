<?php

namespace App\TwoMinD;

/**
 * @author Ienze
 */
class Pallete extends \Nette\Object {

    private $colors;

    public function __construct($colors) {
        $this->colors = $colors;
    }

    public function hasColor($color) {
        return in_array($color, $this->colors);
    }

    public function randomColor() {
        return $this->colors[array_rand($this->colors)];
    }

}
