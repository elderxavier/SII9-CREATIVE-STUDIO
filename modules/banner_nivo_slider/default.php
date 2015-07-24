<?php

	$uniqid				= @$params['uniqid'];
	$categ   			= is_array($params['categ']) ? $params['categ'] : explode(',', $params['categ']);
	$directionNav		= @$params['directionNav'] ='true';
	$controlNav 		= @$params['controlNav'] ='true';
	$controlNavThumbs 	= @$params['controlNavThumbs'] ='false';
	$manualAdvance	 	= @$params['manualAdvance'] = 'false';
	$theme				= @$params['theme'] = 'default';
	$orderby  			= @$params['orderby'] ? $params['orderby'] : 'RAND()';
	$limit    			= @$params['limit'] ? 'LIMIT '.$params['limit'] : '';
	
		
	$f = 0;
	$filter = '';
	foreach($categ as $catid){			
		$f++;if($f>1){$filter .= "OR ";}
		$filter .= "categ = '".trim($catid)."' ";
	}
	$sql = mysql_query("SELECT * FROM imagens WHERE $filter AND published = '1' ORDER BY $orderby $limit");
	
?>	

<?php if(mysql_num_rows($sql) > 0): ?>

	<link rel="stylesheet" href="<?=$moduleUrl?>/css/nivo_slider_themes/<?=$theme?>/<?=$theme?>.css" type="text/css" media="screen" />
	<link rel="stylesheet" href="<?=$moduleUrl?>/css/nivo-slider.css" type="text/css" media="screen" />	
	<script type="text/javascript" src="<?=$moduleUrl?>/js/jquery.nivo.slider.js"></script>
	
   <script type="text/javascript">
    $(window).load(function() {
		$('#slider<?=$uniqid?>').nivoSlider({
			captionOpacity: 0.5,
			pauseTime: 7000,
			directionNav: <?=$directionNav?>,
			controlNav : <?=$controlNav?>,
			controlNavThumbs : <?=$controlNavThumbs?>,
			manualAdvance: <?=$manualAdvance?>
		});
	});
    </script>
	

	<div id="nivoSlider<?=($uniqid?'-'.$uniqid:'')?>" class="slider-wrapper theme-<?=$theme?>">
      
        <div id="slider<?=$uniqid?>" class="nivoSlider">
			<?php
			
				$i = 0;				
				while($r = mysql_fetch_assoc($sql)){
				
					if($r['url']){echo '<a href="'.$r['url'].'" target="_blank">';}
					
					echo '<img src="images/albuns/'.$r['imagem'].'" alt="" ';
					if($r['desc']){ echo 'title="#htmlcaption'.$uniqid.$i.'"'; }
					if($controlNavThumbs === 'true'){ echo 'data-thumb="images/albuns/thumbs/'.$r['imagem'].'"'; }
					echo '/>'."\n";
					
					if($r['url']){echo '</a>';}
					
					$htmlcaption[] = $r['desc'];
					
					$i++;
				}
			?>
        </div>
			<?php				
				for($h=0; $h < count($htmlcaption); $h++){				
					if($htmlcaption[$h]){
						echo '<div id="htmlcaption'.$uniqid.$h.'" style="display:none">'.$htmlcaption[$h].'</div>';
					}
				}			
			?>
    </div>
	
<?php endif; ?>