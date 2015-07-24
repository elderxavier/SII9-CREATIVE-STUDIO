<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/NWD.class.php');
	require_once('../libs/Strings.class.php');
	require_once('../libs/NwdGD.2.class.php');

	
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
		
		$stateFilter = $state == 1 ? "f.id_publicado != '' " : "f.id_publicado = '' ";
		
		$sql = mysql_query("SELECT f.*, u.nome AS autor, u.email, u.telefone
							FROM fotos_temp AS f 
							LEFT JOIN usuarios AS u
							ON u.id = f.idautor
							WHERE $stateFilter ORDER BY f.data DESC LIMIT $start, $limit ");
		
		$i = 0;
		while($r = mysql_fetch_assoc($sql)){			
	
			$id = $r['id'];
			
			$i++;
			$title = $r['nome_animal'] ? $r['nome_animal'] : 'Imagem '.($i < 10 ? '0'.$i : $i);
			
			$thumburl = 'imagens/fotos/_temp/thumbs/'.$r['imagem'];
			$imgurl   = 'imagens/fotos/_temp/'.$r['imagem'];
			$thumb = file_exists('../../../'.$thumburl) ? $path.'/'.$thumburl : $path.'/adm/v3/images/no-image.png';
			
			$item  = '<li id="item'.$id.'" class="item '.($r['id_publicado']==0?'enabled':'disabled').'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter('.$id.')" onmouseleave="titleMouseLeave('.$id.')">';			
			$item .= '<img onclick="abrirSB(\'\', \''.$path.'/'.$imgurl.'\')" src="'.$thumb.'" class="thumb"/>';
			$item .= '<div class="title"><span class="data">'.date('d/m/y H:i', strtotime($r['data'])).'</span> - <b>'.$title.'</b></div>';
			//$item .= '<div class="info">'.substr($r['mensagem'], 0, 50).'</div>';
			$item .= '<span class="editBtn" onclick="openPopAddItem('.$id.')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="deleteItemConfirm('.$id.')"></span>';	
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
		
		$r = mysql_fetch_assoc(mysql_query("SELECT f.*, u.nome AS autor, u.email, u.telefone
											FROM fotos_temp AS f 
											LEFT JOIN usuarios AS u
											ON u.id = f.idautor
											WHERE f.id = '$id' LIMIT 1"));
		
		$result['data']			= date('d/m/Y',strtotime($r['data']));
		$result['time']			= date('H:i:s',strtotime($r['data']));
		$result['idautor']		= $r['idautor'];
		$result['autor']		= $r['autor'];
		$result['email']		= $r['email'];
		$result['telefone']		= $r['telefone'];
		$result['nome_animal']	= $r['nome_animal'];
		$result['categ']		= $r['categ'];
		$result['cidade']		= $r['cidade'];
		$result['tecnica']		= $r['tecnica'];
		$result['descricao']	= $r['descricao'];
		$result['mensagem']		= $r['mensagem'];
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		//sleep(2);
		//die('<span class="error">Caralhooooo!!!!!</span>');
		
		if(!$idanimal){die('<span class="required">Selecione o campo <b>ANIMAL</b></span>');}
		
		$img = mysql_fetch_assoc(mysql_query("SELECT imagem FROM fotos_temp WHERE id = '$idItem' LIMIT 1"));
		
		$extensao = strtolower(str_replace('.','',strrchr($img['imagem'], '.')));
		
		if(strstr('*.jpg;*.jpeg;*.gif;*.png', $extensao)){	
		
			$values		  = explode('_',$imgvalues);					
			$corBg 		  = @ $values[3] ? $values[3] : 'ffffff';
			$imgQualidade = @ $values[4] ? $values[4] : 100; 
			$imgMenor 	  = @ $values[5] ? $values[5] : false;			
			
			$limitName 	  = 100;			
			$pastaDestino = '../../../imagens/fotos/';
			$imageTemp	  = $pastaDestino.'_temp/'.$img['imagem'];
			$thumbTemp	  = $pastaDestino.'_temp/thumbs/'.$img['imagem'];
		
			$animal		  = mysql_fetch_assoc(mysql_query("SELECT * FROM `animais` WHERE `id` = '$idanimal' LIMIT 1"));			
			$newName	  = $animal['nome'].'_'.$animal['cientifico'].'_'.$animal['maisnomes'];  
			$newName	  = Strings::stringToUrl($newName);
			$newName	  = strtolower(substr($newName,0,$limitName-8).'.'.$extensao);
			$newName	  = NWD::autoRename($pastaDestino.'imgs', $newName);
			
			$altaOutput   = $pastaDestino.'alta/'.$newName;
			$imageOutput  = $pastaDestino.'imgs/'.$newName;
			$thumbOutput  = $pastaDestino.'thumbs/'.$newName;
		
			$copy		  = copy($imageTemp, $altaOutput);
			$imagem 	  = NwdGD::imgResize($altaOutput, $imageOutput, $values[0], $values[1], $values[2], $corBg, $imgQualidade, $imgMenor);
			$thumb		  = NwdGD::imgResize($altaOutput, $thumbOutput, $values[6], $values[7], $values[8], $corBg, $imgQualidade, $imgMenor);
		
			if($imagem!=false){				
				$lastPos = mysql_fetch_assoc(mysql_query("SELECT `pos` FROM `fotos` WHERE `id_animal` = '$idanimal' ORDER BY `pos` DESC LIMIT 1"));
				$pos = $lastPos['pos']+1;
				
				$data = implode('-',array_reverse(explode('/',$data))).' '.$time;
				
				$insert = mysql_query("INSERT INTO `fotos` (`pos`, `id_animal`, `id_cidade`, `id_autor`, `imagem`, `data`, `tecnica`, `descricao`, `ativo`) 
													VALUES ('$pos', '$idanimal', '$cidade', '$idautor', '$newName', '$data', '$tecnica', '$descricao', '1')");	
			}
			
			if(@$insert){	

				if(@$tempClear){				
					$clear = mysql_query("DELETE FROM fotos_temp WHERE id = '$idItem' LIMIT 1");
					
					@unlink($imageTemp);
					@unlink($thumbTemp);
				}
				else {				
					$clear = mysql_query("UPDATE `fotos_temp` SET `id_publicado` = '".mysql_insert_id()."' WHERE `id` = '$idItem' LIMIT 1");
				}
				
				
				if($clear){
					echo true;
				}
				else {
					echo '<span class="required">O arquivo foi movido mas a tabela não pôde ser apagada.</span>';
				}
			}
			else {
				echo '<span class="error">Os dados não puderam ser copiados.</span>';
			}
		
		}
		else {
			echo '<span class="error">O arquivo não existe ou seu formato é inválido.</span>';
		}
		
	}	
	
	
	
	//---------------------------------------------------------------------------------------------------------
	// EXCLUIR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Excluir'){			

		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `fotos_temp` WHERE `id` = '$id' LIMIT 1"));
		
		@unlink('../../../imagens/fotos/_temp/'.$img['imagem']);
		@unlink('../../../imagens/fotos/_temp/thumbs/'.$img['imagem']);
		
		$delete = mysql_query("DELETE FROM `fotos_temp` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){		
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir o item</span>';
		}
	}
	
	
?>