<?php

	include('../../../cfig/conexao.php');

	foreach($_POST as $postField => $postValue){
		$$postField = addslashes($postValue);
	}	
	
	
	//----------------------------------------------------------------------------------------------------------------------------------
	// CADASTRAR POSIÇÃO
	//----------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Cadastrar'){
	
		$result = array();
		
		if(empty($localidade)){$result['resposta'] = 'Informe o LOCAL.';
		}elseif(empty($coordinates)){$result['resposta'] = 'Não foi possível definir a LOCALIZAÇÃO. Dê duplo clique novamente sobre o mapa.';
		}else {			
			
			$cord = explode(',',$coordinates);
			$posX = $cord[0];
			$posY = $cord[1];

			$sql = mysql_query("INSERT INTO maps_pointer (localidade, posX, posY) 
							    VALUES('$localidade', '$posX', '$posY')");
			
			if($sql){
				$result['resposta'] = true;
				$result['lastid'] = mysql_insert_id();			
			}
			else {
				$result['resposta'] = '<span class="error">Houve um erro ao cadastrar os dados</span>';
			}		
		}
		
		echo json_encode($result);
	}
	
	
	//----------------------------------------------------------------------------------------------------------------------------------
	// LISTAR POINTERS
	//----------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Listar Points'){
	
		$i = 0;
		$result = array();
		
		$sql = mysql_query("SELECT * FROM maps_pointer");
		while($r = mysql_fetch_assoc($sql)){				
	
			$result[$i]['id'] 	= $r['id'];
			$result[$i]['posX'] = $r['posX'];
			$result[$i]['posY'] = $r['posY'];			
			
			$i++;
		}
		
		echo json_encode($result);
	
	}
	
	//----------------------------------------------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//----------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Load to Edit'){
	
		$result = array();
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM maps_pointer WHERE id = '$id' LIMIT 1"));
			
		$result['localidade'] = $r['localidade'];
		$result['coordinates'] = $r['posX'].','.$r['posY'];
		
		echo json_encode($result);
	
	}
	
	//----------------------------------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//----------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Editar'){
	
		$result = array();
		
		if(empty($localidade)){$result['resposta'] = 'Informe o LOCAL.';
		}elseif(empty($coordinates)){$result['resposta'] = 'Não foi possível definir a LOCALIZAÇÃO. Dê duplo clique novamente sobre o mapa.';
		}else {				

			$cord = explode(',',$coordinates);
			$posX = $cord[0];
			$posY = $cord[1];

			$sql = mysql_query("UPDATE `maps_pointer` SET `localidade` = '$localidade', `posX` = '$posX', `posY` = '$posY' WHERE `id` = '$id' LIMIT 1");
			
			if($sql){
				$result['resposta'] = true;
				$result['lastid'] = $id;			
			}
			else {
				$result['resposta'] = '<span class="error">Houve um erro ao cadastrar os dados</span>';
			}		
		}
		
		echo json_encode($result);	
	
	}
	
	//----------------------------------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//----------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Delete Pointer'){
	
		$sql = mysql_query("DELETE FROM `maps_pointer` WHERE `id` = '$id' LIMIT 1");
	
		if($sql){
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir</span>';
		}		

	}
	


?>