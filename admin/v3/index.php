<?php 	
	require_once('libs/Login.class.php');
	Login::secSessionStart();
	
	include('inc/conectors.php');
	
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>	
	<?php include('inc/head.php'); ?>
	<?php include('inc/scripts.php'); ?>	
</head>
<body class="<?=@$urlvars[1]?>">
	
	<?php if($pag == 'login'): NWD::showAdmContent(@$pag); else: Login::proteger(); ?>

		<div id="header" class="uiBoxTitle">
			<ul class="h-right">
				<li><?php include('assets/logout.php'); ?></li>
			</ul>
		</div>
		
		<div class="page">		
			
			<div class="left-collumn">			
				<?php 
					$menuParams['uniqid'] = 'principal';
					NWD::insertAdmModule('menu',$menuParams); 
				?>			
			</div>			
			
			<div class="page-container">	
				<?php NWD::showAdmContent(@$pag); ?>
				<div class="contentLoader" style="display:none"></div>
			</div>				
			
		</div>
		<div id="footer">
			<div id="developer">Admin Panel 3.0</div>
		</div>

	<?php endif; ?>
	
</body>