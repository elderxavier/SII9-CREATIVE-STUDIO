<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/NWD.class.php');		
	require_once('../libs/UpdatePos.class.php');

	
	foreach($_POST as $postField => $postValue){
		$$postField = addslashes($postValue);
	}
	
	
	$start = @ $calls * $cfig['query list limit'];
	$limit = $cfig['query list limit'];
	
	$pathUp = '../../../';
	$pastaDestino = 'images/albuns/';



	//---------------------------------------------------------------------------------------------------------
	// ADICIONAR ITEM
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Add Item'){		

		$url = @$url == 'http://' ? '' : @$url;		
	
		if(@$_FILES['file']['size'] > 0){	

			require_once('../libs/Strings.class.php');
			require_once('../libs/NwdGD.2.class.php');		
			require_once('../libs/Images.class.php');

			$imagem = Images::uploadImagens($_FILES['file'], $pathUp.$pastaDestino, explode('_',$imgvalues), 150);
			
			if($imagem){
				
				$insert = mysql_query(
							"INSERT INTO `imagens` (`pos`, `categ`, `imagem`, `url`, `nome`, `desc`, `preco`) 
							VALUES   ('$pos', '$categ', '$imagem', '".@$url."', '".@$nome."', '".@$desc."', '".@$preco."')"
						);
						
				if($insert){
					UpdatePos::imagens(mysql_insert_id(), $pos, $categ);
					$result = true;
				}
				else {
					$result = '<span class="error">Houve um erro ao inserir os dados.</span>';
				}
			}
			else {
				$result = '<span class="error">Houve um erro no cadastramento.</span>';
			}
		}
		else {
			$result = '<span class="required">Selecione uma imagem para ser enviada.</span>';
		}

		
		echo '<script>window.top.window.finishUploadImagem('.$result.');</script>';
		
		
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();		
		$path = NWD::getFullPath(-3);
		
		$sql = mysql_query("SELECT * FROM imagens WHERE categ = '$categ' ORDER BY pos ASC LIMIT $start, $limit ");
		
		$i = 0;
		while($r = mysql_fetch_assoc($sql)){			
	
			$id = $r['id'];
			
			$i++;
			$title = $r['nome'] ? $r['nome'] : 'Imagem '.($i < 10 ? '0'.$i : $i);
			
			$thumburl = $pastaDestino.'thumbs/'.$r['imagem'];	
			$imageurl = $pastaDestino.$r['imagem'];			
			$thumb = file_exists($pathUp.$thumburl) ? $path.'/'.$thumburl : (file_exists($pathUp.$imageurl) ? $path.'/'.$imageurl : $path.'/adm/v3/images/no-image.png');
			
			$item  = '<li id="item'.$id.'" class="item '.($r['published']==0?'disabled':'enabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter('.$id.')" onmouseleave="titleMouseLeave('.$id.')">';			
			$item .= '<img src="'.$thumb.'" class="thumb"/>';
			$item .= '<span class="title">'.$title.'</span>';
			$item .= '<span class="editBtn" onclick="openPopAddItem('.$id.')" style="display:none"></span>';
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
		$result['url'] = $r['url'];
		$result['nome'] = $r['nome'];
		$result['desc'] = $r['desc'];
		$result['preco'] = $r['preco'];
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		$img = mysql_fetch_assoc(mysql_query("SELECT * FROM imagens WHERE id = '$idItem' LIMIT 1"));
		
		$imagem = $img['imagem'];
		
		if(@$_FILES['file']['size'] > 0){	

			require_once('../libs/Strings.class.php');
			require_once('../libs/NwdGD.2.class.php');		
			require_once('../libs/Images.class.php');		

			
			$sendImg = Images::uploadImagens($_FILES['file'], $pathUp.$pastaDestino, explode('_',$imgvalues), 150);
			
			if($sendImg){
				@unlink($pathUp.$pastaDestino.$imagem);
				@unlink($pathUp.$pastaDestino.'thumbs/'.$imagem);
			}
			
			$imagem = $sendImg;
		}
		
		$update = mysql_query("UPDATE imagens SET `pos` = '$pos', `url` = '$url', `nome` = '$nome', 
							   `desc` = '$desc', `imagem` = '$imagem', `preco` = '$preco' 							
							   WHERE `id` = '$idItem' LIMIT 1");

		if($update){			
			UpdatePos::imagens($idItem, $pos, $img['categ']);
			$result = true;
		}
		else {
			$result = '<span class="error">Houve um erro ao salvar os dados.</span>';
		}
		
		echo '<script>window.top.window.finishUploadImagem('.$result.');</script>';
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

		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem`, `categ` FROM `imagens` WHERE `id` = '$id' LIMIT 1"));
		
		@unlink($pathUp.$pastaDestino.$img['imagem']);
		@unlink($pathUp.$pastaDestino.'thumbs/'.$img['imagem']);
		
		$delete = mysql_query("DELETE FROM `imagens` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){
			
			UpdatePos::imagens($id, '', $img['categ']);
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}
	
	
?>