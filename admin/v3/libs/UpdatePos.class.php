<?php

/* ------------------------------------------------
	CHAMAR ESTAS FUNЧеES SE A QUERY RETORNOU TRUE 
	PARA EVITAR ESPAЧOS EM BRANCO NO CASO DE ERRO
	parametros: 
	$novoItemId = 1; // id do novo item
	$novoItemPos = 3; // posiчуo do novo item
   ------------------------------------------------- */

class UpdatePos {
	
	//----------------------------------------------------------------------------------------------------------
	//	MENU
	//----------------------------------------------------------------------------------------------------------
	public static function menu($novoItemId, $novoItemPos){

		$sql = mysql_query("SELECT id FROM admin_menu WHERE id != '$novoItemId' ORDER BY pos ASC LIMIT 200");

		$i = 1;

		while($item = mysql_fetch_object($sql)){		

			if($i == $novoItemPos){
				$i++;				
			}
			
			mysql_query("UPDATE `admin_menu` SET `pos` = '$i' WHERE `id` = '".$item->id."' LIMIT 1");
			
			$i++;	
		}
	}	
	
	
	//----------------------------------------------------------------------------------------------------------
	//	CATEGORIAS
	//----------------------------------------------------------------------------------------------------------
	public static function categorias($cod, $novoItemPos, $categ){
	
		$sql = mysql_query("SELECT id FROM categorias WHERE parent = '$categ' AND id != '$cod' ORDER BY pos ASC LIMIT 200");

		$i = 1;

		while($item = mysql_fetch_object($sql)){	
		
			// Se a 'posiчуo do item' == 'posiчуo do novo item' acrescenta 1 posiчуo deixando esta livre para o novo cadastro.	
			if($i == $novoItemPos){
				$i++;				
			}
			
			mysql_query("UPDATE `categorias` SET `pos` = '$i' WHERE `id` = '".$item->id."' LIMIT 1");
			
			$i++;	
		}
	}
	
	//----------------------------------------------------------------------------------------------------------
	//	CONTENT
	//----------------------------------------------------------------------------------------------------------
	public static function content($novoItemId, $novoItemPos, $categ){
	
		$sql = mysql_query("SELECT id FROM content WHERE catid = '$categ' AND id != '$novoItemId' ORDER BY pos ASC LIMIT 200");

		$i = 1;

		while($item = mysql_fetch_object($sql)){	
		
			// Se a 'posiчуo do item' == 'posiчуo do novo item' acrescenta 1 posiчуo deixando esta livre para o novo cadastro.	
			if($i == $novoItemPos){
				$i++;				
			}
			
			mysql_query("UPDATE `content` SET `pos` = '$i' WHERE `id` = '".$item->id."' LIMIT 1");
			
			$i++;	
		}
	}
	
	//----------------------------------------------------------------------------------------------------------
	//	IMAGENS
	//----------------------------------------------------------------------------------------------------------
	public static function imagens($novoItemId, $novoItemPos, $categ){
	
		$sql = mysql_query("SELECT id FROM imagens WHERE categ = '$categ' AND id != '$novoItemId' ORDER BY pos ASC LIMIT 200");

		$i = 1;

		while($item = mysql_fetch_object($sql)){	
		
			// Se a 'posiчуo do item' == 'posiчуo do novo item' acrescenta 1 posiчуo deixando esta livre para o novo cadastro.	
			if($i == $novoItemPos){
				$i++;				
			}
			
			mysql_query("UPDATE `imagens` SET `pos` = '$i' WHERE `id` = '".$item->id."' LIMIT 1");
			
			$i++;	
		}
	}
	

	//----------------------------------------------------------------------------------------------------------
	//	VIDEOS
	//----------------------------------------------------------------------------------------------------------
	public static function videos($novoItemId, $novoItemPos, $categ){
	
		$sql = mysql_query("SELECT id FROM videos WHERE catid = '$categ' AND id != '$novoItemId' ORDER BY pos ASC LIMIT 200");

		$i = 1;

		while($item = mysql_fetch_object($sql)){	
		
			// Se a 'posiчуo do item' == 'posiчуo do novo item' acrescenta 1 posiчуo deixando esta livre para o novo cadastro.	
			if($i == $novoItemPos){
				$i++;				
			}
			
			mysql_query("UPDATE `videos` SET `pos` = '$i' WHERE `id` = '".$item->id."' LIMIT 1");
			
			$i++;	
		}
	}
	
	
	

}

?>