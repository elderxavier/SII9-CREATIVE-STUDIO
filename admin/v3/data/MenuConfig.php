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
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();		
		
		$sql = mysql_query("SELECT * FROM admin_menu WHERE nivel >= '".$_SESSION['usernivel']."' ORDER BY pos ASC LIMIT $start, $limit ");
		
		while($r = mysql_fetch_assoc($sql)){
			
			$id  = $r['id'];
			$pos = $r['pos'] < 10 ? '0'.$r['pos'] : $r['pos'];
			
			$item  = '<li id="item'.$id.'" class="item '.($r['published']==0?'disabled':'enabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter('.$id.')" onmouseleave="titleMouseLeave('.$id.')">';			
			$item .= '<span class="title">'.$pos.' - '.$r['title'].'</span>';
			$item .= '<span class="editBtn" onclick="openPopEditMenu('.$id.')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="openDeleteMenuConfirm('.$id.')"></span>';	
			$item .= '<span class="publicarBtn" onclick="publicarMenu(\''.$id.'\')"></span>';
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
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM admin_menu WHERE nivel >= '".$_SESSION['usernivel']."' AND id = '$idMenu' LIMIT 1"));
		
		$result['pos'] 	  = $r['pos'];
		$result['nivel']  = $r['nivel'];
		$result['title']  = $r['title'];
		$result['url'] 	  = $r['url'];
		$result['params'] = $r['params'];
		$result['vs'] 	  = $r['vs'];
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		if(empty($title)){die('<span class="error">Informe um <b>Título</b> para seu Menu</span>');}
		if(empty($url)){die('<span class="error">Informe o campo <b>Alias</b></span>');}
		
		$update = mysql_query("UPDATE admin_menu SET `pos` = '$pos', `title` = '$title', 
							  `url` = '$url', `params` = '$params', `nivel` = '$nivel', `vs` = '$vs' 							
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
		
		$sql = mysql_query("UPDATE admin_menu SET `published` = '$value' WHERE id = '$id' AND nivel >= '".$_SESSION['usernivel']."' LIMIT 1");
		
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
	// CRIAR NOVO MENU
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Create New'){

		if(empty($title)){die('<span class="error">Informe um <b>Título</b> para seu Menu</span>');}
		if(empty($url)){die('<span class="error">Informe o campo <b>Alias</b></span>');}		

		$insert = mysql_query("INSERT INTO `admin_menu` (`pos`, `title`, `url`, `params`, `nivel`, `vs`) 
							   VALUES('$pos', '$title', '$url', '$params', '$nivel', '$vs')");
		
		if(@$insert){
		
			UpdatePos::menu(mysql_insert_id(), $pos);
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
	}
	
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR MENU
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