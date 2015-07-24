<?php

	include('../../../../../cfig/conexao.php');
	require_once('../../../libs/Login.class.php');
	require_once('../../../libs/NWD.class.php');
	require_once('../../../libs/Strings.class.php');
	
	Login::secSessionStart();
	Login::proteger();
	
	define('_fullpath',NWD::getFullPath(-5));	
	
	$catid = '';
	$datatype = '';
	
	foreach($_POST as $postField => $postValue){
		$$postField = strip_tags(addslashes($postValue));
	}	
	
	
	
	$getName 	  = '';
	$pathUp 	  = '../../../../../';
	$pastaDestino = '';	
	
	switch($datatype){
		
		//----------------------------------------------------------------------------------------------------------------------
		
		case 'img':
			$pastaDestino = 'images/albuns/';
		break;
		
		//----------------------------------------------------------------------------------------------------------------------
		
		case 'cont':			
			$sqlCateg = mysql_fetch_assoc(mysql_query("SELECT * FROM `content` WHERE `id` = '$catid' LIMIT 1"));					
			$getName	  = $sqlCateg['titulo']; 
			$catid		  = 'cont'.$catid;
			$pastaDestino = 'images/content/';
		break;
		
		//----------------------------------------------------------------------------------------------------------------------
		
		case 'imob':			
			$sqlCateg = mysql_fetch_assoc(mysql_query("SELECT i.titulo, i.quartos, i.garagem, i.bairro,
										  cat.titulo AS categoria, c.nome AS cidade, c.uf
										  FROM imoveis AS i 
										  LEFT JOIN categorias AS cat ON cat.id = i.catid
										  LEFT JOIN cidades AS c ON c.id = i.id_cidade
										  WHERE i.id = '$catid' LIMIT 1"));			
			
			$getName	  = $sqlCateg['titulo'].'_'.$sqlCateg['categoria'];
			$getName	 .= ($sqlCateg['quartos'] ? '_'.$sqlCateg['quartos'].'_quartos':'');
			$getName	 .= ($sqlCateg['garagem'] ? '_'.$sqlCateg['garagem'].'_vagas_garagem':'');
			$getName	 .= $sqlCateg['bairro'].'_'.$sqlCateg['cidade'].'_'.$sqlCateg['uf'];

			$catid		  = 'imob'.$catid;
			$pastaDestino = 'images/imoveis/';
		break;
		
	}
	

	
	$extensoesPermitidas = array('jpg','jpeg','png','gif');	
	
	switch($_POST['act']){		

		//----------------------------------------------------------------------------------------------------------------------
		// CADASTRAR
		//----------------------------------------------------------------------------------------------------------------------
		case 'Cadastrar':			
			
			set_time_limit(0);
			
			require_once('../../../libs/NwdGD.2.class.php');
			require_once('../../../libs/Images.class.php');
			
			$error 	  = '';				
			
			$file = $_FILES['imagens'];
			$extensao = strtolower(str_replace('.','',strrchr($file['name'], '.')));

			if(in_array($extensao, $extensoesPermitidas)){		

				$newName = Images::uploadImagens($file, $pathUp.$pastaDestino, explode('_',$imgvalues), 100, $getName);

				if($newName!=false){				

					$lastPos = mysql_fetch_assoc(mysql_query("SELECT `pos` FROM `imagens` WHERE `categ` = '$catid' ORDER BY `pos` DESC LIMIT 1"));
					$pos = $lastPos['pos']+1;								
					$insert = mysql_query("INSERT INTO `imagens` (`pos`, `categ`, `imagem`, `published`) 
						VALUES ('$pos', '$catid', '$newName', '1')");	
				}

				if(@$insert){						
					$success = 'Enviado';
				}
				else {
					$error = 'Erro!';
				}					
			}
			else {
				$error = 'Arquivo não permitido';
			}			
			
			if(empty($error)){						
				echo '<div id="status">success</div>';
				echo '<div id="message">'.$success.'</div>';
				echo '<div id="uploadedfile">'.$file['name'].'</div>';
			}
			else {
				echo '<div id="status">error</div>';
				echo '<div id="message">'.$error.'</div>';
				echo '<div id="uploadedfile">'.$file['name'].'</div>';
			}
			
		break;		
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// LISTAR
		//----------------------------------------------------------------------------------------------------------------------
		case 'Listar':	
			
			$sql = mysql_query("SELECT * FROM imagens WHERE categ = '$catid' ORDER BY pos ASC");
			
			while($row = mysql_fetch_object($sql)){				
		
				$thumb = $row->imagem;
				$thumb = is_file($pathUp.$pastaDestino.'thumbs/'.$thumb) ? _fullpath.'/'.$pastaDestino.'/thumbs/'.$thumb : _fullpath.'/images/no-image.png';
				
				$enabled = $row->published == 1 ? 'enabled' : 'disabled';
				
				echo '<div id="item-'.$row->id.'" class="data-item '.$enabled.'" data-cod="'.$row->id.'" >';
				echo '<div class="actions">';
				
				echo '<div class="statusButton" onclick="publicarImgm('.$row->id.')">&nbsp;</div>';
				echo '<div class="editButton" onclick="openPopImgmEdit('.$row->id.')" >&nbsp;</div>';
				echo '<div class="closeButton" onclick="excluiImgmImage('.$row->id.')" >&nbsp;</div>';

				echo '</div>';
				echo '<div class="info-item">';
				echo '<div class="imagem"><img src="'.$thumb.'" alt="'.$row->id.'"/></div>';
				echo '<div class="legenda">'.$row->nome.'</div>';				
				echo '</div>';				
				echo '</div>';
				
			}			
		
		break;
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// EXCLUIR
		//----------------------------------------------------------------------------------------------------------------------		
		case 'Excluir':

			$img = mysql_fetch_object(mysql_query("SELECT imagem FROM imagens WHERE id = '$idImagem' LIMIT 1"));
			$del = mysql_query("DELETE FROM imagens WHERE id = '$idImagem' LIMIT 1");

			if(@$del){			

				@unlink($pathUp.$pastaDestino.$img->imagem);
				@unlink($pathUp.$pastaDestino.'thumbs/'.$img->imagem);
				
				echo true;
			}
			else {
				echo false;
			}
		
		break;
		
		
		//---------------------------------------------------------------------------------------------------------
		// PUBLICAR - DESPUBLICAR
		//---------------------------------------------------------------------------------------------------------
		case 'Publicar':
			
			$upd = mysql_query("UPDATE `imagens` SET `published` = '$value' WHERE `id` = '$id' LIMIT 1");
			
			if($upd){
			
				if($value == 1){
					echo 'enabled';
				}
				if($value == 0){
					echo 'disabled';
				}		
			}
			
		break;
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// CARREGAR PARA EDIÇÃO
		//----------------------------------------------------------------------------------------------------------------------
		case 'Load to Edit':
			
			$img = mysql_fetch_object(mysql_query("SELECT * FROM imagens WHERE id = '$idImagem' LIMIT 1"));
			
			$result['url'] 	 = $img->url;
			$result['nome']  = $img->nome;
			$result['desc']	 = $img->desc;
			
			echo json_encode($result);
			
		break;
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// SALVAR EDIÇÃO
		//----------------------------------------------------------------------------------------------------------------------
		case 'Salvar Edicao':
		
			$desc 	= trim(addslashes($_POST['desc']));
			$url 	= $url == 'http://' ? '' : $url;
			
			echo mysql_query("UPDATE `imagens` SET `nome` = '$nome', `url` = '$url', `desc` = '$desc' WHERE `id` = '$idImagem' LIMIT 1");
	
		break;
		
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// SALVAR POSIÇÕES
		//----------------------------------------------------------------------------------------------------------------------
		case 'Save Pos':		
			
			$itemsLista = explode(',', $itemsLista);				
				
			$pos = 1;
			$error = 0;	
			$success = 0;

			foreach($itemsLista as $itemid){
				$upd = mysql_query("UPDATE `imagens` SET `pos` = '$pos' WHERE `id` = '$itemid' LIMIT 1");
				$pos++;
					
				if($upd){
					$success++;
				}
				else {
					$error++;
				}					
			}
			
			
			if($error > 0){				
				echo ' error';		
			}
			else {
				echo ' success';
			}
			
		break;
		
		
		
	}