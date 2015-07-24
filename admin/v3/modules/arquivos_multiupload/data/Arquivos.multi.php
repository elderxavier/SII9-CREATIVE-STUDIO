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
	
	$limitName 	  = 100;
	$pathUp 	  = '../../../../../';
	$pastaDestino = 'arquivos/';	

	
	switch($_POST['act']){		

		//----------------------------------------------------------------------------------------------------------------------
		// CADASTRAR
		//----------------------------------------------------------------------------------------------------------------------
		case 'Cadastrar':			
			
			set_time_limit(0);
			$extensoesPermitidas = explode('|', $arqtypes);	
			
			$error 	  = '';
			
			if(!is_dir($pathUp.$pastaDestino)){	
				mkdir($pathUp.$pastaDestino,0755); sleep(1);
			}		
			
			$file = $_FILES['arquivos'];
			$fileName = $file['name'];
			$extensao = strtolower(str_replace('.','',strrchr($fileName, '.')));
				
			if(in_array($extensao, $extensoesPermitidas)){		

				$newName = $imgName ? $imgName : str_replace($extensao,'',$fileName); 					
				$newName = Strings::stringToUrl($newName);
				$newName = strtolower(substr($newName,0,$limitName-8).'.'.$extensao);				
				$newName = NWD::autoRename($pathUp.$pastaDestino, $newName);

				$arqMove = move_uploaded_file($file['tmp_name'], $pathUp.$pastaDestino.$newName);
				
				if(@$arqMove){				

					$cod = md5(microtime());

					$lastPos = mysql_fetch_assoc(mysql_query("SELECT `pos` FROM `arquivos` WHERE `categ` = '$catid' ORDER BY `pos` DESC LIMIT 1"));
					$pos = $lastPos['pos']+1;								
					$insert = mysql_query("INSERT INTO `arquivos` (`pos`, `categ`, `arquivo`, `cod`, `ativo`) 
						VALUES ('$pos', '$catid', '$newName', '$cod', '1')");	
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
			
			$sql = mysql_query("SELECT * FROM arquivos WHERE categ = '$catid' ORDER BY pos ASC");
			
			while($row = mysql_fetch_object($sql)){				
		
				$extensao = strtolower(str_replace('.','',strrchr($row->arquivo, '.')));

				if($extensao == 'jpg' || $extensao == 'jpeg' || $extensao == 'png' || $extensao == 'gif' || $extensao == 'bmp'){
					$thumb = _fullpath.'/'.$pastaDestino.$row->arquivo;
				}
				else {
					$thumb = NWD::getFullPath(-1).'/images/'.$extensao.'.png';
				}

				$enabled = $row->ativo == 1 ? 'enabled' : 'disabled';
				
				echo '<div id="item-'.$row->id.'" class="data-item '.$enabled.'" data-cod="'.$row->id.'" >';
				echo '<div class="actions">';
				
				echo '<div class="statusButton" onclick="publicarArq(\''.$row->id.'\')">&nbsp;</div>';
				echo '<div class="editButton" onclick="openPopArqEdit(\''.$row->id.'\')" >&nbsp;</div>';
				echo '<div class="closeButton" onclick="excluiArqImage(\''.$row->id.'\')" >&nbsp;</div>';

				echo '</div>';
				echo '<div class="info-item">';
				echo '<div class="arquivo"><img src="'.$thumb.'" alt="'.$row->id.'"/></div>';
				echo '<div class="legenda">'.$row->titulo.'</div>';				
				echo '</div>';				
				echo '</div>';
				
			}			
		
		break;
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// EXCLUIR
		//----------------------------------------------------------------------------------------------------------------------		
		case 'Excluir':

			$arq = mysql_fetch_object(mysql_query("SELECT arquivo FROM arquivos WHERE id = '$idArquivo' LIMIT 1"));
			$del = mysql_query("DELETE FROM arquivos WHERE id = '$idArquivo' LIMIT 1");

			if(@$del){			

				@unlink($pathUp.$pastaDestino.$arq->arquivo);

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
			
			$upd = mysql_query("UPDATE `arquivos` SET `ativo` = '$value' WHERE `id` = '$id' LIMIT 1");
			
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
			
			$arq = mysql_fetch_object(mysql_query("SELECT * FROM arquivos WHERE id = '$idArquivo' LIMIT 1"));
			
			$result['nome']  = $arq->titulo;
			$result['desc']	 = $arq->desc;
			
			echo json_encode($result);
			
		break;
		
		
		//----------------------------------------------------------------------------------------------------------------------
		// SALVAR EDIÇÃO
		//----------------------------------------------------------------------------------------------------------------------
		case 'Salvar Edicao':
		
			$desc 	= trim(addslashes($_POST['desc']));
				
			echo mysql_query("UPDATE `arquivos` SET `titulo` = '$nome', `desc` = '$desc' WHERE `id` = '$idArquivo' LIMIT 1");
	
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
				$upd = mysql_query("UPDATE `arquivos` SET `pos` = '$pos' WHERE `id` = '$itemid' LIMIT 1");
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