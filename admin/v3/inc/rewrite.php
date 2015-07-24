<?php
	
	define('_fullpath', NWD::getFullPath());
	define('_absolutepath', NWD::getAbsolutePath());
	
	$urlvars 	= array();
	$urlvalues	= explode('/', @$_GET['params']);
	foreach($urlvalues as $value){
		$urlvars[] = trim(addslashes(strip_tags(urldecode($value))));
	}
	
	$urlvars['GET'] = NWD::defineGET();
	$pag 	 		= @$urlvars[1] ? $urlvars[1] : 'intro';

?>