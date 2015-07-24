


<link type="text/css" href="<?=_fullpath?>/modules/<?=$module_name?>/css/menu.css" rel="stylesheet"  />


<?php
	
	$uniqid = @$params['uniqid'];	

	$sql = mysql_query("SELECT * FROM admin_menu WHERE nivel >= '".$_SESSION['usernivel']."' AND published = '1' ORDER BY pos ASC");

	echo '<ul id="menu'.$uniqid.'" class="menu">';	

	$parentUrl = NWD::getFullPath(-1);
	$thisUrl   = NWD::getFullPath();
	
	while($r = mysql_fetch_assoc($sql)){
		
		$url 	 = $r['url'];
		
		$active = $r['id'] == $urlvars[0] ? 'active' : '';
		
		$link = $r['vs'] == 'v2' ? $parentUrl.'/'.$url : $thisUrl.'/'.$r['id'].'/'.$url;
		
		echo '<li class="'.$active.'">';
		echo '<a href="'.$link.'" ><span>'.$r['title'].'</span></a>';			
		echo '</li>';
	
	}

	echo '</ul>';
	

	
?>
