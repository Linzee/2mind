<?php

namespace App;

use 	Nette\Application\Routers\RouteList,
	Nette\Application\Routers\Route;


/**
 * Router factory.
 */
class RouterFactory
{

	/**
	 * @return \Nette\Application\IRouter
	 */
	public function createRouter()
	{
		$router = new RouteList();
                
                //sk
                $router[] = new Route('plocha', 'Wall:default');
                $router[] = new Route('mapa', 'Map:default');
                $router[] = new Route('najnovsie', 'Latest:default');
                $router[] = new Route('najnovsie/temy', 'Latest:blocks');
                $router[] = new Route('kontakt', 'Contact:default');
                $router[] = new Route('ostranke', 'About:default');
                
                //global
                $router[] = new Route('<presenter>/<action>', 'Title:default');
		return $router;
	}

}
