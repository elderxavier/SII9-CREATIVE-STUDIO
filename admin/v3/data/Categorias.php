<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/NWD.class.php');	
	require_once('../libs/Strings.class.php');
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
		$path = NWD::getFullPath(-3);
		
		$sql = mysql_query("SELECT * FROM categorias WHERE parent = '$parent' ORDER BY pos ASC LIMIT $start, $limit ");
		
		$i = 0;
		while($r = mysql_fetch_assoc($sql)){			
	
			$id = $r['id'];
			$pos = $r['pos'];
			
			$i++;
			$titulo = $r['titulo'] ? $r['titulo'] : 'Categoria '.($i < 10 ? '0'.$i : $i);
			
			$imgurl   = 'images/categorias/'.$r['imagem'];	
			$thumburl = 'images/categorias/thumbs/'.$r['imagem'];	

			$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : (is_file('../../../'.$imgurl) ? $path.'/'.$imgurl : $path.'/adm/v3/images/no-image.png');
			
			$item  = '<li id="item'.$id.'" class="item '.($r['ativo']==0?'disabled':'enabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter(\''.$id.'\')" onmouseleave="titleMouseLeave(\''.$id.'\')">';			
			$item .= '<img src="'.$thumb.'" class="thumb"/>';
			$item .= '<span class="title">'.$pos.' - '.$titulo.'</span>';
			$item .= '<span class="editBtn" onclick="openPopAddItem(\''.$id.'\')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="openDeleteItemConfirm(\''.$id.'\')"></span>';
			$item .= '<span class="moreItensBtn '.$type.'" onclick="gotoMoreItens(\''.$id.'\')"></span>';
			$item .= '<span class="moreItensBtn text" onclick="selectPopEditor('.$id.')"></span>';	
			$item .= '<span class="publicarBtn" onclick="publicarItem(\''.$id.'\')"></span>';
			$item .= '</div>';
			$item .= '</li>';
			
			$result[]['item'] = $item;
		}
		
		echo json_encode($result);
	
	}	
	
	
	//---------------------------------------------------------------------------------------------------------
	// ADICIONAR ITEM
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Add Item'){				

		if(!empty($title)){		
			
			$imagem = '';
			$alias    = empty($alias) ? Strings::stringToMeta(@$title) : $alias;
			
			if(@$_FILES['file']['size'] > 0){	
			
				require_once('../libs/NwdGD.2.class.php');		
				require_once('../libs/Images.class.php');

				$imagem = Images::uploadImagens($_FILES['file'], '../../../images/categorias/', explode('_',$imgcat), 150);
			}

			
			$insert = mysql_query("INSERT INTO `categorias` (`pos`, `parent`, `titulo`, `alias`, `imagem`) VALUES ('$pos', '$parent', '".@$title."', '$alias', '$imagem') ");

			
			if($insert){
				UpdatePos::categorias(mysql_insert_id(), $pos, $parent);
				$result = true;
			}
			else {
				$result = '<span class="error">Houve um erro ao inserir os dados.</span>';
			} 
			
		}
		else {
			$result = '<span class="required">Informe o TÍTULO da categoria.</span>';
		}

		
		echo '<script>window.top.window.finishUploadItem(\''.$result.'\');</script>';
		
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// CARREGAR PARA EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load to Edit'){
	
		$result = array();		
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM categorias WHERE id = '$id' LIMIT 1"));
		
		$result['pos'] = $r['pos'];
		$result['title'] = $r['titulo'];
		$result['alias'] = $r['alias'];
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		
		if(!empty($title)){		
			
			$alias    = empty($alias) ? Strings::stringToMeta(@$title) : $alias;
			
			$cat = mysql_fetch_assoc(mysql_query("SELECT parent, imagem FROM categorias WHERE id = '$idItem' LIMIT 1"));		
			$imagem = $cat['imagem'];
			
			if(@$_FILES['file']['size'] > 0){	
			
				require_once('../libs/NwdGD.2.class.php');		
				require_once('../libs/Images.class.php');				
				
				$sendImg = Images::uploadImagens($_FILES['file'], '../../../images/categorias/', explode('_',$imgcat), 150);
				
				if($sendImg && $sendImg != $imagem){
					@unlink('../../../images/categorias/'.$imagem);
					@unlink('../../../images/categorias/thumbs/'.$imagem);
					
					$imagem = $sendImg;
				}				
				
			}

			
			$update = mysql_query("UPDATE `categorias` SET `pos` = '$pos', `titulo` = '$title', `alias` = '$alias', `descricao` = '".@$desc."', `imagem` = '$imagem' WHERE id = '$idItem' LIMIT 1");

			
			if($update){
				UpdatePos::categorias($idItem, $pos, $cat['parent']);
				$result = true;
			}
			else {
				$result = '<span class="error">Houve um erro ao inserir os dados.</span>';
			} 
			
		}
		else {
			$result = '<span class="required">Informe o TÍTULO da categoria.</span>';
		}

		
		echo '<script>window.top.window.finishUploadItem(\''.$result.'\');</script>';
		
	}	

	
	//---------------------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Publicar'){	
	
		$sql = mysql_query("UPDATE `categorias` SET `ativo` = '$state' WHERE `id` = '$id' LIMIT 1");
		
		if($sql){
		
			if($state == 1){
				echo 'enabled';
			}
			if($state == 0){
				echo 'disabled';
			}		
		}		
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Excluir'){	
		
		// verifica todos os itens desta categoria
		if($type == 'ytvideos'){
			$q = mysql_query("SELECT * FROM ytvideos WHERE categ = '$id'");
		}
		elseif($type == 'imagens'){
			$q = mysql_query("SELECT * FROM imagens WHERE categ = '$id'");
		}
		elseif($type == 'arquivos'){
			$q = mysql_query("SELECT * arquivos WHERE categ = '$id'");
		}
		elseif($type == 'content'){
			$q = mysql_query("SELECT * FROM content WHERE catid = '$id'");
		}
		elseif($type == 'imoveis'){
			$q = mysql_query("SELECT * FROM imoveis WHERE catid = '$id'");
		}
		else {
			$q = mysql_query("SELECT * FROM categorias WHERE parent = '$id'");
		}		
		if(mysql_num_rows($q) > 0){
			die("Existem arquivos cadastrados para esta categoria. \nÉ necessário a exclusão destes arquivos para prosseguir.");
		}		
		
		
		$cat = mysql_fetch_assoc(mysql_query("SELECT `parent`, `imagem` FROM `categorias` WHERE `id` = '$id' LIMIT 1"));
		
		@unlink('../../../images/categorias/'.$cat['imagem']);
		@unlink('../../../images/categorias/thumbs/'.$cat['imagem']);
		
		$delete = mysql_query("DELETE FROM `categorias` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){
			
			UpdatePos::categorias($id, '', $cat['parent']);
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}


	//---------------------------------------------------------------------------------------------------------
	// LOAD TEXT
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load Text'){	
					
		$result = array();		
		
		$categ = mysql_fetch_assoc(mysql_query("SELECT descricao FROM categorias WHERE id = '$id' LIMIT 1"));
		$rcontent = $categ['descricao'];
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);	
	}


	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Text'){	
		
		$content = trim(addslashes(@$_POST['content']));
				
		$save = mysql_query("UPDATE `categorias` SET `descricao` = '$content' WHERE `id` = '$id' LIMIT 1 ");

		if(@$save){
			die(true);
		}
		else {
			die ('<span class="error">Houve um erro ao salvar os dados.</span>');
		}			
		
	}	
	
	
?>