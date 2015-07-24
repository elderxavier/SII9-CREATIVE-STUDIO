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
		$$postField = trim(strip_tags(addslashes($postValue)));
	}
	
	$path  = NWD::getFullPath(-3);
	$start = @ $calls * $cfig['query list limit'];
	$limit = $cfig['query list limit'];	
	
	$userfilter = $_SESSION["usernivel"] > 1 ? "AND a.idautor = '".$_SESSION["userid"]."' " : '';	
	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();			
		
		$ativofilter = is_numeric($status) ? " AND a.ativo = '$status' " : '';	
		$datafilter  = (@$dataini ? "AND a.date >= '".implode('-',array_reverse(explode('/',$dataini)))." 00:00:00' " : '').(@$datafin ? "AND a.date <= '".implode('-',array_reverse(explode('/',$datafin)))." 24:59:59' " : '');
		
		if(@$parent && empty($catid)){
			$i = 1;
			$categfilter = "AND (";			
			$sql = mysql_query("SELECT id FROM categorias WHERE parent = '$parent' AND ativo = '1'");			
			while($r = mysql_fetch_assoc($sql)){
				if($i>1){$categfilter .= "OR ";}$i++;
				$categfilter .= "a.catid = '".$r['id']."' ";
			}
			$categfilter .= ")";
		}
		else {
			$categfilter = "AND a.catid = '$catid'";
		}
		
		
		switch($order){
			
			case 'data_desc':
				$orderby = 'a.date DESC';
			break;
			
			case 'data_asc':
				$orderby = 'a.date ASC';
			break;
			
			case 'views_desc':
				$orderby = 'a.access DESC';
			break;
			
			case 'views_asc':
				$orderby = 'a.access ASC';
			break;
			
			case 'pos_asc':
				$orderby = 'a.pos ASC';
			break;
			
			default:
				$orderby = 'a.pos ASC';
			break;
		}	
		
		
		$sql = mysql_query("SELECT a.id, a.date, a.pos, a.titulo, a.imagem, a.ativo, a.access
							FROM content AS a 
							WHERE a.titulo LIKE '%$searchword%' 
							$ativofilter $userfilter $datafilter $categfilter
							ORDER BY $orderby LIMIT $start, $limit ");


		while($r = mysql_fetch_assoc($sql)){			
			
			$id 	= $r['id'];
			$titulo = $r['titulo'];
			$imagem = $r['imagem'];
			$ativo 	= $r['ativo'];
			
			$orderlist  = '';
			if($order == 'pos_asc'){$orderlist = $r['pos'].' - ';}
			if($order == 'data_desc' || $order == 'data_asc'){$orderlist = date('d/m/y',strtotime($r['date'])).' - ';}
			if($order == 'views_desc' || $order == 'views_asc'){$orderlist = $r['access'].' - ';}


			$thumburl = 'images/content/thumbs/'.$imagem;			
			$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : $path.'/adm/v3/images/no-image.png';
			
			$item  = '<li id="item'.$id.'" class="item '.($ativo==1?'enabled':'disabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter('.$id.')" onmouseleave="titleMouseLeave('.$id.')">';			
			$item .= '<img src="'.$thumb.'" class="thumb" onclick="openPopIntroImage(\''.$id.'\')"/>';
			$item .= '<span class="title">'.$orderlist.$titulo.'</span>';
			$item .= '<span class="editBtn" onclick="openPopAddItem('.$id.')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="openDeleteItemConfirm(\''.$id.'\')"></span>';
			$item .= '<span class="moreItensBtn imagens" onclick="openPopEnviaImagens(\''.$id.'\')"></span>';
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
		
		if(empty($titulo)){die('<span class="required">Informe o TÍTULO do artigo.</span>');}			
		if(empty($catid)){die('<span class="required">Informe a CATEGORIA do artigo.</span>');}		
		
		$alias 	 = Strings::stringToMeta($titulo);
		$date 	 = @$date ? implode('-',array_reverse(explode('/',$date))) : date('Y-m-d  H:i:s');
		if(empty($pos)){
			$lastPos = mysql_fetch_assoc(mysql_query("SELECT pos FROM content WHERE catid = '$catid' ORDER BY pos DESC LIMIT 1"));
			$pos = $lastPos['pos']+1;
		}

		$insert = mysql_query("INSERT INTO content (date, pos, titulo, alias, catid, idautor) 
				  VALUES ('$date', '$pos', '$titulo', '$alias', '$catid', '".$_SESSION["userid"]."') ");		
		
		
		if(@$insert){
			echo true;
			UpdatePos::content(mysql_insert_id(), $pos, $catid);
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// CARREGAR PARA EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load to Edit'){
	
		$result = array();		
		
		$r = mysql_fetch_assoc(mysql_query("SELECT a.date, a.pos, a.titulo, a.catid FROM content AS a WHERE a.id = '$id' $userfilter LIMIT 1"));
		
		$result['date']	  = date('d/m/Y', strtotime($r['date']));
		$result['hour']   = date('H:i:s', strtotime($r['date']));
		$result['pos'] 	  = $r['pos'];
		$result['titulo'] = $r['titulo'];
		$result['catid']  = $r['catid'];		
		
		echo json_encode($result);
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){	
		
		if(empty($titulo)){die('<span class="required">Informe o TÍTULO do artigo.</span>');}			
		if(empty($catid)){die('<span class="required">Informe a CATEGORIA do artigo.</span>');}		
		
		$alias 	 = Strings::stringToMeta($titulo);
		$dateupd = @$date ? "`date` = '".implode('-',array_reverse(explode('/',$date)))." $hour'," : '';	
		$posupd	 = @$pos ? "`pos` = '$pos', " : '';			
				
		$update = mysql_query("UPDATE `content` SET $dateupd $posupd `titulo` = '$titulo', `alias` = '$alias', `catid` = '$catid' WHERE `id` = '$idItem' LIMIT 1");
		
		if(@$update){
			echo true;
			if($posupd){UpdatePos::content($idItem, $pos, $catid);}			
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		} 
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Publicar'){	
	
		$sql = mysql_query("UPDATE `content` SET `ativo` = '$state' WHERE `id` = '$id' LIMIT 1");
		
		if($sql){
		
			if($state == 1){
				$result['class'] = 'enabled';
			}
			else {
				$result['class'] = 'disabled '.$state;
			}
			
			echo json_encode($result);
		}		
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Excluir'){	
		
		$content = mysql_fetch_assoc(mysql_query("SELECT `imagem`, `catid` FROM `content` WHERE `id` = '$id' LIMIT 1"));
		
		@unlink('../../../images/content/'.$content['imagem']);
		@unlink('../../../images/content/thumbs/'.$content['imagem']);
		
		$delete = mysql_query("DELETE FROM `content` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){
			echo true;
			UpdatePos::content($id, '', $content['catid']);
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}
	
	
	
	
	
	
	//---------------------------------------------------------------------------------------------------------
	// LOAD TEXT
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load Text'){	
					
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';
		$content = mysql_fetch_assoc(mysql_query("SELECT `$field` FROM `content` WHERE `id` = '$id' LIMIT 1"));				
		$rcontent = $content[$field];	
		
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	}
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Text'){	
		
		$content = trim(addslashes(@$_POST['content']));
		
		
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';					
		// intro === 0 -> limpa o campo introtext  |  $intro > 0 -> quebra o fulltext  |  se for string não faz nada			
		$textBreaked = is_numeric(@$intro) && $field != 'introtext' ? Strings::stringLimit(strip_tags($content), $intro, '') : 'false';						
					
		$save = mysql_query("UPDATE `content` SET ".($textBreaked != 'false' ? "`introtext` = '$textBreaked', " : '')." `$field` = '$content' 
									 WHERE `id` = '$id' LIMIT 1 ");

		if(@$save){
			die(true);
		}
		else {
			die ('<span class="error">Houve um erro ao salvar os dados.</span>');
		}
					
		
	}	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	CARREGA A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Load Image Intro'){
	
		$item = mysql_fetch_assoc(mysql_query("SELECT imagem, img_in_article FROM content WHERE id = '$id' LIMIT 1"));
		
		$thumburl = 'images/content/thumbs/'.$item['imagem'];			
		$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : '';
		
		$result['thumb'] 		  = $thumb;
		$result['img_in_article'] = $item['img_in_article'];
		
		echo json_encode($result);
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Image Intro'){
	
		require_once('../libs/NwdGD.2.class.php');
		require_once('../libs/Images.class.php');
		
		$pastadestino = '../../../images/content/';		
		
		
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `content` WHERE `id` = '$idItem' LIMIT 1"));
		$img_ant = $img['imagem'];	
		
		$nova_imagem = Images::uploadImagens($_FILES['arquivo'], $pastadestino, explode('_', $imgvalues), 100);
								//uploadImagens($file, $pastaDestino, $values, $limitName=20, $imgName='')		
		
		if($nova_imagem){
			
			$update = mysql_query("UPDATE `content` SET `imagem` = '$nova_imagem', img_in_article = '$img_in_article' WHERE `id` = '$idItem' LIMIT 1");
			
			@unlink($pastadestino.$img_ant);
			@unlink($pastadestino.'thumbs/'.$img_ant);				
		}
		
		if(@$update){
			$result = $path.'/images/content/thumbs/'.$nova_imagem;
		}
		else {
			$result = false;
		}
		
		echo '<script>window.top.window.finishUploadIntroImage(\''.$result.'\');</script>';
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	MOSTRA OU ESCONDE A IMAGEM DO ARTIGO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Img in Article'){
		$update = mysql_query("UPDATE `content` SET img_in_article = '$img_in_article' WHERE `id` = '$idItem' LIMIT 1");
		
		if($update){
			echo '<span class="success">A imagem será mostrada '.($img_in_article == 1?'no artigo':'apenas na introdução').'</span>';
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados</span>';
		}
	}		
		
		
	//-----------------------------------------------------------------------------------------------------------------------
	//	EXCLUI A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Remove Image Intro'){
	
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `content` WHERE `id` = '$id' $userfilter LIMIT 1"));
		
		@unlink('../../../images/content/'.$img['imagem']);
		@unlink('../../../images/content/thumbs/'.$img['imagem']);
		
		$update = mysql_query("UPDATE `content` SET `imagem` = '' WHERE `id` = '$id' $userfilter LIMIT 1");
		
		if(@$update){
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir a imagem.</span>';
		}
		
	}
	
	
	
	
	
?>