<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/UpdatePos.class.php');	
	
	
	foreach($_POST as $postField => $postValue){
		$$postField = addslashes($postValue);
	}
	
	
	$start = @ $calls * $cfig['query list limit'];
	$limit = $cfig['query list limit'];
	
	
	//---------------------------------------------------------------------------------------------------------
	// ADICIONAR ITEM
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Add Item'){

		if(empty($title)){die('<span class="error">Informe um <b>Título</b> para seu Item</span>');}
		if(empty($url)){die('<span class="error">Informe o campo <b>Alias</b></span>');}		

		$insert = mysql_query("INSERT INTO `admin_menu` (`pos`, `title`, `url`, `params`, `nivel`) 
							   VALUES('$pos', '$title', '$url', '$params', '$nivel')");
		
		if(@$insert){
		
			UpdatePos::menu(mysql_insert_id(), $pos);
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();		
		
		$sql = mysql_query("SELECT * FROM imagens WHERE categ = '$categ' ORDER BY pos ASC LIMIT $start, $limit ");
		
		while($r = mysql_fetch_assoc($sql)){
			
			$id = $r['cod'];
			
			$item  = '<li id="item'.$id.'" class="item '.($r['published']==0?'disabled':'enabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter('.$id.')" onmouseleave="titleMouseLeave('.$id.')">';			
			$item .= '<span class="title">&nbsp;'.$r['nome'].'</span>';
			$item .= '<span class="editBtn" onclick="openPopEditItem('.$id.')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="openDeleteItemConfirm('.$id.')"></span>';	
			$item .= '<span class="publicarBtn" onclick="publicarItem(\''.$id.'\')"></span>';
			$item .= '</div>';
			$item .= '</li>';
			
			$result[]['item'] = $item;
		}
		
		echo json_encode($result);
	
	}	
	
	
	//---------------------------------------------------------------------------------------------------------
	// CARREGAR PARA EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load to Edit'){
	
		$result = array();		
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM imagens WHERE id = '$id' LIMIT 1"));
		
		$result['pos'] = $r['pos'];
		$result['nivel'] = $r['nivel'];
		$result['title'] = $r['title'];
		$result['url'] = $r['url'];
		$result['params'] = $r['params'];
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		if(empty($title)){die('Informe um título para seu Álbum');}
		
		$update = mysql_query("UPDATE admin_menu SET `pos` = '$pos', `title` = '$title', 
							  `url` = '$url', `params` = '$params', `nivel` = '$nivel' 							
							   WHERE `id` = '$id' AND nivel >= '".$_SESSION['usernivel']."' LIMIT 1");

		if($update){			
			UpdatePos::menu($id, $pos);
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Publicar'){
		
		$sql = mysql_query("UPDATE imagens SET `published` = '$value' WHERE id = '$id' LIMIT 1");
		
		if($sql){
		
			if($value == 1){
				echo 'enabled';
			}
			if($value == 0){
				echo 'disabled';
			}		
		}
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Excluir'){			

		$delete = mysql_query("DELETE FROM `admin_menu` WHERE `id` = '$id' AND nivel >= '".$_SESSION['usernivel']."' LIMIT 1");
		
		if(@$delete){
			
			UpdatePos::menu($id, '');			
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}
	
	
?>