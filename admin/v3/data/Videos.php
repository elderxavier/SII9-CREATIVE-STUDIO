<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/NWD.class.php');	
	require_once('../libs/Videos.class.php');
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

		if($videoUrl){	
		
			$imagem   = '';
			$videoCod = '';			
			$type     = '';

			if(strpos($videoUrl, 'youtube')){
				$videoCod = Videos::stripCodYoutube($videoUrl);
				$type = 'Yt';
			}

			if(@$_FILES['imagem']['size'] > 0){	

				require_once('../libs/Strings.class.php');
				require_once('../libs/NwdGD.2.class.php');		
				require_once('../libs/Images.class.php');

				$imagem = Images::uploadImagens($_FILES['imagem'], '../../../images/videos/', explode('_',$imgvalues), 100);				
			}	
					
			$insert = mysql_query("INSERT INTO `videos` (`catid`, `pos`, `date`, `videoUrl`, `videoCod`, `type`, `imagem`, `titulo`, `descricao`) 
								   VALUES ('$catid', '$pos', NOW(), '$videoUrl', '$videoCod', '$type', '$imagem', '$titulo', '$descricao')" );
							
			if($insert){
				UpdatePos::videos(mysql_insert_id(), $pos, $catid);
				$result = true;
			}
			else {
				$result = '<span class="error">Houve um erro ao inserir os dados.</span>';
			}

		}
		else {
			$result = '<span class="required">Informe a url do VÍDEO.</span>';
		}

		
		echo '<script>window.top.window.finishUploadItem(\''.$result.'\');</script>';		
		
	}

	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();		
		$path 	= NWD::getFullPath(-3);
		
		$sql = mysql_query("SELECT * FROM videos WHERE catid = '$catid' ORDER BY pos ASC LIMIT $start, $limit ");	

		$i = 0;
		while($r = mysql_fetch_assoc($sql)){			
			$i++;

			$id     = $r['id'];	
			$pos	= $r['pos'];			
			$title  = $r['titulo'] ? $r['titulo'] : 'Video '.$id;
			$type	= $r['type'];			
			$imgUrl = $path.'/images/no-image.png';

			if($type == 'Yt'){				
				$videoUrl = 'http://www.youtube.com/v/'.$r['videoCod'].'&amp;hl=en&amp;fs=1&amp;rel=0&amp;autoplay=1';
				$imgUrl = 'http://img.youtube.com/vi/'.$r['videoCod'].'/1.jpg';
			}


			$thumburl = 'images/videos/'.$r['imagem'];			
			$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : $imgUrl;
			
			$item  = '<li id="item'.$id.'" class="item '.($r['ativo']==0?'disabled':'enabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter(\''.$id.'\')" onmouseleave="titleMouseLeave(\''.$id.'\')">';			
			$item .= @$videoUrl ? '<a href="'.$videoUrl.'" class="fancyframe fancybox.iframe" >' : '';
			$item .= '<img src="'.$thumb.'" class="thumb"/>';
			$item .= @$videoUrl ? '</a>' : '';
			$item .= '<span class="pos">'.$pos.'</span>';
			$item .= '<span class="title"> - '.$title.'</span>';
			$item .= '<span class="editBtn" onclick="openPopAddItem(\''.$id.'\')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="openDeleteItemConfirm(\''.$id.'\')"></span>';	
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
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM videos WHERE id = '$id' LIMIT 1"));
		
		$result['pos'] 			= $r['pos'];
		$result['catid'] 		= $r['catid'];
		$result['titulo']   	= $r['titulo'];
		$result['videoUrl']		= $r['videoUrl'];
		$result['imagem']		= $r['imagem'];
		$result['descricao']	= $r['descricao'];			
		
		echo json_encode($result);
	}
	
	

	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		if($videoUrl){	
		
			$imagem   = '';
			$videoCod = '';			
			$type     = '';
			$vd = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `videos` WHERE `id` = '$idItem' LIMIT 1"));
			$imgAnterior = $vd['imagem'];


			if(strpos($videoUrl, 'youtube')){
				$videoCod = Videos::stripCodYoutube($videoUrl);
				$type = 'Yt';
			}		
			

			if(@$_FILES['imagem']['size'] > 0){				

				require_once('../libs/Strings.class.php');
				require_once('../libs/NwdGD.2.class.php');		
				require_once('../libs/Images.class.php');				

				$imagem = Images::uploadImagens($_FILES['imagem'], '../../../images/videos/', explode('_', $imgvalues), 100);				
			}	
					
			$insert = mysql_query("UPDATE `videos` SET
								`pos` = '$pos',
								`videoUrl` = '$videoUrl', 
								`videoCod` = '$videoCod',
								`type` = '$type',
								".($imagem || $remove_img ? "`imagem` = '$imagem'," : '')."
								`titulo` = '$titulo',
								`descricao` = '$descricao'
								 WHERE `id` = '$idItem' LIMIT 1");
							
			if($insert){
				UpdatePos::videos($idItem, $pos, $catid);
				$result = true;

				if(($imagem && @$imgAnterior) || $remove_img){ @ unlink('../../../images/videos/'.$imgAnterior); }
			}
			else {
				$result = '<span class="error">Houve um erro ao inserir os dados.</span>';
			}

		}
		else {
			$result = '<span class="required">Informe a url do VÍDEO.</span>';
		}

		
		echo '<script>window.top.window.finishUploadItem(\''.$result.'\');</script>';		
		
	}
	
	//---------------------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Publicar'){
		
		$sql = mysql_query("UPDATE `videos` SET `ativo` = '$value' WHERE `id` = '$id' LIMIT 1");
		
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
		
		$video = mysql_fetch_assoc(mysql_query("SELECT imagem, catid FROM videos WHERE id = '$id' LIMIT 1"));
	
		$delete = mysql_query("DELETE FROM `videos` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){
			UpdatePos::videos($id, '', $video['catid']);					
			if(@$imagemAnterior){ @ unlink('../../../images/videos/'.$video['imagem']); }

			echo true;	
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}
	
	
?>