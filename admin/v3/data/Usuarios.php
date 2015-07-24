<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	Login::proteger();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');	
	require_once('../libs/NWD.class.php');	
	require_once('../libs/Strings.class.php');

	
	foreach($_POST as $postField => $postValue){
		$$postField = trim(strip_tags(addslashes($postValue)));
	}
	
	$path  = NWD::getFullPath(-3);
	$start = @ $calls * $cfig['query list limit'];
	$limit = $cfig['query list limit'];	
	
	$userfilter = "AND `nivel` > '".$_SESSION["usernivel"]."'";	
	
	//---------------------------------------------------------------------------------------------------------
	// LISTAR
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Listar'){
		
		$result = array();			
		
		$ativofilter = @$situacao ? " AND situacao = '$situacao' " : '';
		$nivelfilter = @$nivel ? " AND nivel = '$nivel' " : '';
		$datafilter  = (@$dataini ? "AND data >= '".implode('-',array_reverse(explode('/',$dataini)))." 00:00:00' " : '').(@$datafin ? "AND data <= '".implode('-',array_reverse(explode('/',$datafin)))." 24:59:59' " : '');
		
		$sql = mysql_query("SELECT * FROM usuarios WHERE nome LIKE '%$searchword%' $ativofilter $nivelfilter $userfilter $datafilter ORDER BY nome ASC LIMIT $start, $limit ");
		
		$i = 0;
		while($r = mysql_fetch_assoc($sql)){			
	
			$id = $r['id'];
			
			$i++;
			$title = $r['nome'] ? $r['nome'] : 'Usuário '.($i < 10 ? '0'.$i : $i);
			
			$thumburl = 'images/usuarios/thumbs/'.$r['imagem'];			
			$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : $path.'/adm/v3/images/no-image.png';
			
			$item  = '<li id="item'.$id.'" class="item '.($r['situacao']=='A'?'enabled':'disabled '.$r['situacao']).'" style="display:none">';			
			$item .= '<div class="title-holder" onmouseenter="titleMouseEnter(\''.$id.'\')" onmouseleave="titleMouseLeave(\''.$id.'\')">';			
			$item .= '<img src="'.$thumb.'" class="thumb" onclick="openPopIntroImage(\''.$id.'\')"/>';
			$item .= '<span class="title">'.$title.'</span>';
			$item .= '<span class="editBtn" onclick="openPopAddItem(\''.$id.'\')" style="display:none"></span>';
			$item .= '</div>';
			$item .= '<div class="actions">';
			$item .= '<span class="deleteBtn" onclick="deleteItemConfirm(\''.$id.'\')"></span>';
			$item .= '<span class="moreItensBtn text" onclick="openPopTextEditor(\''.$id.'\')"></span>';
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

		$idField = "";
		$idValue = "";
		$usuario = Login::stringToLogin(@$usuario);
		
		// VALIDA CAMPOS
		
		if(@$idUser){		
			$vId = mysql_query("SELECT * FROM usuarios WHERE id = '$idUser' LIMIT 1");		
			if(mysql_num_rows($vId) > 0){die('<span class="required">Este IDENTIFICADOR já está sendo utilizado. Você tem certeza que deseja informar este campo?</span>');}
			$lastId = mysql_fetch_assoc(mysql_query("SELECT id FROM usuarios ORDER BY id DESC LIMIT 1"));	
			if($lastId['id'] > $idUser){
				$idField = "id,";
				$idValue = "'$idUser',";
			}
		}
	
		if(empty($nome)){die('<span class="required">Informe o NOME do usuário.</span>');}
		
		if(empty($email)){die('<span class="required">Informe o EMAIL do usuário.</span>');}
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){die('<span class="required">Informe um EMAIL v&aacute;lido.</span>');}	
		$vEmail = mysql_query("SELECT * FROM usuarios WHERE email = '$email' LIMIT 1");	
		if(mysql_num_rows($vEmail) > 0){die('<span class="required">Este EMAIL já se encontra cadastrado.</span>');}
		
		if(empty($nivel)){die('<span class="required">Informe o NÍVEL do usuário.</span>');}
		if(empty($situacao)){die('<span class="required">Informe o STATUS do usuário.</span>');}
		
		if(@$nivel <= 100){ // maior que 100 não acessa o administrativo
			if(empty($usuario)){die('<span class="required">Informe o nome de USUÁRIO para login.</span>');}	
			if(strlen($usuario) < 4){die('<span class="required">Nome de USUÁRIO muito curto.</span>');}
			$vUser = mysql_query("SELECT * FROM usuarios WHERE user = '$usuario' LIMIT 1");	
			if(mysql_num_rows($vUser) > 0){die('<span class="required">Este USUÁRIO já está sendo utilizado.</span>');}
			
			if(empty($senha)){die('<span class="required">Informe a SENHA.</span>');}
			if(strlen($senha) < 6){die('<span class="required">A SENHA deve conter no mínimo 6 caracteres.</span>');}
		}
		
		
		$alias = Strings::stringToMeta($nome);
		$nivel = $nivel > $_SESSION['usernivel'] ? $nivel : $_SESSION['usernivel']+1;
		
		$insert = mysql_query("INSERT INTO usuarios ($idField data, nome, alias, user, senha, email, telefone, cidades_atuacao, cidades_nome, profissao, nivel, situacao)
							   VALUES ($idValue NOW(), '$nome', '$alias', '$usuario', '$senha', '$email', '$telefone', '$idcidades', '$cidades', '$profissao', '$nivel', '$situacao')");		
		
		
		if(@$insert){
			echo true;
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
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM usuarios WHERE id = '$id' $userfilter LIMIT 1"));
		
		
		$i = 0;
		$filterCidades = '';
		$cidades = '';
		
		/*
		$cidadesList = explode(',', $r['cidades_atuacao']);
		foreach($cidadesList as $idCidade){
			if($i > 0){$filterCidades .= "OR ";}$i++;
			$filterCidades .= "id = '$idCidade' ";
		}
		@ $cSql = mysql_query("SELECT * FROM cidades WHERE ativo = '1' AND ( $filterCidades ) ORDER BY cidade ASC");
		while($cid = mysql_fetch_assoc($cSql)){
			$cidades .= '<li id="'.$cid['id'].'"><span class="itemlabel">'.$cid['cidade'].'</span> <span class="remove" onclick="removeItem(this)">X</span></li>';
		}
		*/
				
				
		
		$result['id']			= $r['id'];
		$result['nome']			= $r['nome'];
		$result['email']		= $r['email'];
		$result['usuario']		= $r['user'];
		$result['senha']		= $r['senha'];
		$result['telefone']		= $r['telefone'];
		$result['profissao']	= $r['profissao'];
		$result['nivel']		= $r['nivel'];
		$result['situacao']		= $r['situacao'];
		$result['cidades']		= $cidades;
		
		
		
		echo json_encode($result);
	
	}
	
	
	//---------------------------------------------------------------------------------------------------------
	// SALVAR EDIÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Save Edit'){
	
		$usuario = Login::stringToLogin(@$usuario);
		
		// VALIDA CAMPOS
	
		if(empty($nome)){die('<span class="required">Informe o NOME do usuário.</span>');}
		
		if(empty($email)){die('<span class="required">Informe o EMAIL do usuário.</span>');}
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){die('<span class="required">Informe um EMAIL v&aacute;lido.</span>');}	
		$vEmail = mysql_query("SELECT * FROM usuarios WHERE email = '$email' AND id != '$idItem' LIMIT 1");	
		if(mysql_num_rows($vEmail) > 0){die('<span class="required">Este EMAIL já se encontra cadastrado.</span>');}
		
		if(empty($nivel)){die('<span class="required">Informe o NÍVEL do usuário.</span>');}
		if(empty($situacao)){die('<span class="required">Informe o STATUS do usuário.</span>');}
		
		if($nivel <= 100){ // maior que 100 não acessa o administrativo
			if(empty($usuario)){die('<span class="required">Informe o nome de USUÁRIO para login.</span>');}	
			if(strlen($usuario) < 4){die('<span class="required">Nome de USUÁRIO muito curto.</span>');}
			$vUser = mysql_query("SELECT * FROM usuarios WHERE user = '$usuario' AND id != '$idItem' LIMIT 1");	
			if(mysql_num_rows($vUser) > 0){die('<span class="required">Este USUÁRIO já está sendo utilizado.</span>');}
			
			if(empty($senha)){die('<span class="required">Informe a SENHA.</span>');}
			if(strlen($senha) < 6){die('<span class="required">A SENHA deve conter no mínimo 6 caracteres.</span>');}
		}			
		
		
		$alias = Strings::stringToMeta($nome);
		$nivel = $nivel > $_SESSION['usernivel'] ? $nivel : $_SESSION['usernivel']+1;
					
		$update = mysql_query("UPDATE `usuarios` SET  
							  `nome` = '$nome', 
							  `alias` = '$alias', 
							  `user` = '$usuario', 
							  `senha` = '$senha', 
							  `email` = '$email', 
							  `telefone` = '$telefone', 
							  `cidades_atuacao` = '$idcidades', 
							  `cidades_nome` = '$cidades', 
							  `profissao` = '$profissao', 
							  `nivel` = '$nivel', 
							  `situacao` = '$situacao' 
							   WHERE `id` = '$idItem' $userfilter LIMIT 1");
			
		if(@$update){
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
	
		$sql = mysql_query("UPDATE `usuarios` SET `situacao` = '$state' WHERE `id` = '$id' LIMIT 1");
		
		if($sql){
		
			if($state == 'A'){
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
		
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `usuarios` WHERE `id` = '$id' LIMIT 1"));
		
		@unlink('../../../images/usuarios/'.$img['imagem']);
		@unlink('../../../images/usuarios/thumbs/'.$img['imagem']);
		
		$delete = mysql_query("DELETE FROM `usuarios` WHERE `id` = '$id' LIMIT 1");
		
		if(@$delete){
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
	
		$r = mysql_fetch_assoc(mysql_query("SELECT ui.fulltext FROM usuarios_info AS ui 
											LEFT JOIN usuarios AS u ON u.id = ui.user_id 
											WHERE ui.user_id = '$id' AND u.nivel > '".$_SESSION['usernivel']."' LIMIT 1"));
		$rcontent = $r['fulltext'];										 
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	}
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Text'){
	
		$user = mysql_fetch_assoc(mysql_query("SELECT nivel FROM usuarios WHERE id = '$id' LIMIT 1"));
		
		if(@$user['nivel'] > $_SESSION['usernivel']){
		
			$content = trim(addslashes($_POST['content']));
			
			// intro === 0 -> limpa o campo introtext  |  $intro >= 10 -> quebra o fulltext  |  senão não faz nada			
			$introtext = is_numeric($intro) ? Strings::stringLimit(strip_tags($content), $intro, '') : 'false';			
			
			
			$cVer = mysql_query("SELECT * FROM usuarios_info WHERE user_id = '$id' LIMIT 1");
			if(mysql_num_rows($cVer) > 0){
				$save = mysql_query("UPDATE `usuarios_info` SET ".($introtext != 'false' ? "`introtext` = '$introtext', " : '')." `fulltext` = '$content' WHERE `user_id` = '$id' LIMIT 1 ");
			}
			else {
				$save = mysql_query("INSERT INTO `usuarios_info` (`user_id`, ".( $introtext != 'false' ? "`introtext`, " : '')." `fulltext`) VALUES ('$id', '$content') ");
			}
		}
		
		
		echo @$save ? '<span class="success">Conteúdo atualizado em [ '.date('d.m.y - H:i:s').' ]</span>' : '<span class="error">Houve um erro ao salvar. Tente novamente.</span>';
		
	}
	
	//---------------------------------------------------------------------------------------------------------
	// CARREGA O TEXTO  DE INTRODUÇÃO
	//---------------------------------------------------------------------------------------------------------
	if($act == 'Load Intro Text'){	
	
		$r = mysql_fetch_assoc(mysql_query("SELECT ui.introtext FROM usuarios_info AS ui 
											LEFT JOIN usuarios AS u ON u.id = ui.user_id 
											WHERE ui.user_id = '$id' AND u.nivel > '".$_SESSION['usernivel']."' LIMIT 1"));
		$rcontent = $r['introtext'];										 
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	}
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO  DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Intro Text'){
	
		$user = mysql_fetch_assoc(mysql_query("SELECT nivel FROM usuarios WHERE id = '$id' LIMIT 1"));
		
		if(@$user['nivel'] > $_SESSION['usernivel']){
		
			$content = trim(addslashes($_POST['content']));
			
			$cVer = mysql_query("SELECT * FROM usuarios_info WHERE user_id = '$id' LIMIT 1");
			if(mysql_num_rows($cVer) > 0){
				$save = mysql_query("UPDATE `usuarios_info` SET `introtext` = '$content' WHERE `user_id` = '$id' LIMIT 1 ");
			}
			else {
				$save = mysql_query("INSERT INTO `usuarios_info` (`user_id`, `introtext`) VALUES ('$id', '$content') ");
			}
		}
		
		
		echo @$save ? '<span class="success">Conteúdo atualizado em [ '.date('d.m.y - H:i:s').' ]</span>' : '<span class="error">Houve um erro ao salvar. Tente novamente.</span>';
		
	}
	
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	CARREGA A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Load Image Intro'){
	
		$usuario = mysql_fetch_assoc(mysql_query("SELECT imagem FROM usuarios WHERE id = '$id' LIMIT 1"));
		
		$thumburl = 'images/usuarios/thumbs/'.$usuario['imagem'];			
		$thumb = is_file('../../../'.$thumburl) ? $path.'/'.$thumburl : '';
		
		echo $thumb;
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Save Image Intro'){
	
		require_once('../libs/NwdGD.2.class.php');
		require_once('../libs/Images.class.php');
		
		$pastadestino = '../../../images/usuarios/';		
		
		
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `usuarios` WHERE `id` = '$idItem' $userfilter LIMIT 1"));
		$img_ant = $img['imagem'];	
		
		$nova_imagem = Images::uploadImagens($_FILES['arquivo'], $pastadestino, explode('_', $imgvalues), 100);
								//uploadImagens($file, $pastaDestino, $values, $limitName=20, $imgName='')		
		
		if($nova_imagem){
			
			$update = mysql_query("UPDATE `usuarios` SET `imagem` = '$nova_imagem' WHERE `id` = '$idItem' $userfilter LIMIT 1");
			
			@unlink($pastadestino.$img_ant);
			@unlink($pastadestino.'thumbs/'.$img_ant);				
		}
		
		if(@$update){
			$result = $path.'/images/usuarios/thumbs/'.$nova_imagem;
		}
		else {
			$result = false;
		}
		
		echo '<script>window.top.window.finishUploadIntroImage(\''.$result.'\');</script>';
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	EXCLUI A IMAGEM DE INTRODUÇÃO
	//-----------------------------------------------------------------------------------------------------------------------
	if($act == 'Remove Image Intro'){
	
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `usuarios` WHERE `id` = '$id' $userfilter LIMIT 1"));
		
		@unlink('../../../images/usuarios/'.$img['imagem']);
		@unlink('../../../images/usuarios/thumbs/'.$img['imagem']);
		
		$update = mysql_query("UPDATE `usuarios` SET `imagem` = '' WHERE `id` = '$id' $userfilter LIMIT 1");
		
		if(@$update){
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir a imagem.</span>';
		}
		
	}
	
	
	
	
	
?>