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
	
	$_sitepath  = NWD::getFullPath(-3);
	$meuid 		= $_SESSION['userid'];
	
	
switch($act){
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	// CARREGAR PARA EDIÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Load to Edit':
	
		$result = array();		
		
		$r = mysql_fetch_assoc(mysql_query("SELECT * FROM usuarios WHERE id = '$meuid' LIMIT 1"));	
		
		
		$imgurl = 'images/usuarios/thumbs/'.$r['imagem'];			
		$imagem = is_file('../../../'.$imgurl) ? $_sitepath.'/'.$imgurl : $_sitepath.'/images/no-image.png';

		$result['nome']			= $r['nome'];
		$result['email']		= $r['email'];
		$result['usuario']		= $r['user'];
		$result['senha']		= $r['senha'];
		$result['telefone']		= $r['telefone'];
		$result['profissao']	= $r['profissao'];
		$result['imagem']		= $imagem;		
		
		
		echo json_encode($result);
	
	break;	
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	// SALVAR EDIÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Save Edit':
	
		$usuario 		= Login::stringToLogin(@$usuario);
		$nova_senha 	= Login::stringToLogin(@$nova_senha);
		$senha_confirm 	= Login::stringToLogin(@$senha_confirm);
		$senha_atual	= Login::stringToLogin(@$senha_atual);
		
		
		// VALIDA CAMPOS
	
		if(empty($nome)){die('<span class="required">Informe o campo NOME.</span>');}		
		
		if(empty($email)){die('<span class="required">Informe seu EMAIL.</span>');}
		if(!filter_var($email, FILTER_VALIDATE_EMAIL)){die('<span class="required">Informe um EMAIL v&aacute;lido.</span>');}	
		$vEmail = mysql_query("SELECT * FROM usuarios WHERE email = '$email' AND id != '$meuid' LIMIT 1");	
		if(mysql_num_rows($vEmail) > 0){die('<span class="required">Este EMAIL já se encontra cadastrado.</span>');}

		if(empty($usuario)){die('<span class="required">Informe o nome de USUÁRIO para login.</span>');}	
		if(strlen($usuario) < 4){die('<span class="required">Nome de USUÁRIO muito curto.</span>');}
		$vUser = mysql_query("SELECT * FROM usuarios WHERE user = '$usuario' AND id != '$meuid' LIMIT 1");	
		if(mysql_num_rows($vUser) > 0){die('<span class="required">Este USUÁRIO já está sendo utilizado.</span>');}
			
		if(!empty($nova_senha) && strlen($nova_senha) < 6){die('<span class="required">A SENHA deve conter no mínimo 6 caracteres.</span>');}
		if(!empty($nova_senha) && empty($senha_confirm)){die('<span class="required">CONFIRME sua nova senha.</span>');}	
		if(!empty($nova_senha) && $nova_senha != @$senha_confirm){die('<span class="required">A SENHA digitada não confere com a SENHA DE CONFIRMAÇÃO.</span>');}
		
		if(empty($senha_atual)){die('<span class="error">Informe sua SENHA ATUAL.</span>');}
		$sUser = mysql_fetch_assoc(mysql_query("SELECT senha FROM usuarios WHERE id = '$meuid' LIMIT 1"));
		if($senha_atual != $sUser['senha']){die('<span class="error">A senha informada no campo SENHA ATUAL não confere.</span>');}	
		
		$alias = Strings::stringToMeta($nome);
		
		
		$no_updated = mysql_fetch_assoc(mysql_query("SELECT * FROM usuarios WHERE id = '$meuid' LIMIT 1")); // seleciona os dados do usuario antes do update
		
		$update = mysql_query("UPDATE `usuarios` SET `nome` = '$nome', `alias` = '$alias', `user` = '$usuario', 
								".( !empty($nova_senha) ? "`senha` = '$nova_senha', `lembrete` = '$lembrete', " : '' )."
								`email` = '$email', `telefone` = '$telefone', `profissao` = '$profissao' 
								 WHERE `id` = '$meuid' LIMIT 1");				
			
		if(@$update){
		
			$loginUrl = $_sitepath.'/adm';
			
			
			// se a senha foi alterada
			//------------------------
			if(!empty($nova_senha)){			
				
				$assunto  = 'Alteracao de senha';				
				$msgin 	  = array('[usuario]','[senha]','[email]','[url]');
				$msgout	  = array($usuario, $nova_senha, $email, $loginUrl);
				$mensagem = str_replace($msgin, $msgout, file_get_contents('../emails/myaccount_alt_senha.html'));
				
				
				NWD::sendEmail($email, $mensagem, $assunto);
				if($email != $no_updated['email']){	// se novo email envia mensagem para o email anterior
				NWD::sendEmail($no_updated['email'], $mensagem, $assunto);
				}	
				
				session_destroy();
				die('<script>location.href="'.$loginUrl.'"</script>');
			}
			
			
			// se apenas o email foi alterado
			//-------------------------------
			if($email != $no_updated['email']){
				
				$assunto  = 'Alteracao de email';				
				$msgin 	  = array('[email]','[url]');
				$msgout	  = array($email, $loginUrl);
				$mensagem = str_replace($msgin, $msgout, file_get_contents('../emails/myaccount_alt_email.html'));
				
				NWD::sendEmail($no_updated['email'], $mensagem, $assunto);
			}			
			
			
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao salvar os dados.</span>';
		} 
		
	break;
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	// LOAD TEXT
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Load Text':	
	
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';
		$content = mysql_fetch_assoc(mysql_query("SELECT `$field` FROM `usuarios` WHERE `id` = '$meuid' LIMIT 1"));				
		$rcontent = $content[$field];	
		
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	break;
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	//	SALVA O TEXTO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Save Text':
	
		$content = trim(addslashes(@$_POST['content']));
		
		
		$field = @$field == 'introtext' ? 'introtext' : 'fulltext';					
		// intro === 0 -> limpa o campo introtext  |  $intro > 0 -> quebra o fulltext  |  se for string não faz nada			
		$textBreaked = is_numeric(@$intro) && $field != 'introtext' ? Strings::stringLimit(strip_tags($content), $intro, '') : 'false';						
					
		$save = mysql_query("UPDATE `usuarios` SET ".($textBreaked != 'false' ? "`introtext` = '$textBreaked', " : '')." 
							`$field` = '$content' WHERE `id` = '$meuid' LIMIT 1 ");

		if(@$save){
			die(true);
		}
		else {
			die ('<span class="error">Houve um erro ao salvar os dados.</span>');
		}
		
	break;	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	// CARREGA O TEXTO  DE INTRODUÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Load Intro Text':	
	
		$r = mysql_fetch_assoc(mysql_query("SELECT ui.introtext FROM usuarios_info AS ui 
											LEFT JOIN usuarios AS u ON u.id = ui.user_id 
											WHERE ui.user_id = '$meuid' LIMIT 1"));
		$rcontent = $r['introtext'];										 
		
		$result['content'] = $rcontent;
		$result['return']  = $rcontent ? true : '<span class="required">Conteúdo não encontrado ou ainda não cadastrado.</span>';
		
		echo json_encode($result);
	
	break;	
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	//	SALVA O TEXTO  DE INTRODUÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Save Intro Text':		
		
		$content = trim(addslashes($_POST['content']));
			
		$cVer = mysql_query("SELECT * FROM usuarios_info WHERE user_id = '$meuid' LIMIT 1");
		if(mysql_num_rows($cVer) > 0){
			$save = mysql_query("UPDATE `usuarios_info` SET `introtext` = '$content' WHERE `user_id` = '$meuid' LIMIT 1 ");
		}
		else {
			$save = mysql_query("INSERT INTO `usuarios_info` (`user_id`, `introtext`) VALUES ('$meuid', '$content') ");
		}	
		
		
		echo @$save ? '<span class="success">Conteúdo atualizado em [ '.date('d.m.y - H:i:s').' ]</span>' : '<span class="error">Houve um erro ao salvar. Tente novamente.</span>';
		
	break;	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	//	CARREGA A IMAGEM DE INTRODUÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Load Image Intro':
	
		$usuario = mysql_fetch_assoc(mysql_query("SELECT imagem FROM usuarios WHERE id = '$meuid' LIMIT 1"));
		
		$thumburl = 'images/usuarios/thumbs/'.$usuario['imagem'];			
		$thumb = is_file('../../../'.$thumburl) ? $_sitepath.'/'.$thumburl : '';
		
		echo $thumb;
		
	break;	
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	//	SALVA A IMAGEM DE INTRODUÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Save Image Intro':
	
		require_once('../libs/NwdGD.2.class.php');
		require_once('../libs/Images.class.php');
		
		$pastadestino = '../../../images/usuarios/';		
		
		
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `usuarios` WHERE `id` = '$meuid' LIMIT 1"));
		$img_ant = $img['imagem'];	
		
		$nova_imagem = Images::uploadImagens($_FILES['arquivo'], $pastadestino, explode('_', $imgvalues), 100);
		
		if($nova_imagem){
			
			$update = mysql_query("UPDATE `usuarios` SET `imagem` = '$nova_imagem' WHERE `id` = '$meuid' LIMIT 1");
			
			@unlink($pastadestino.$img_ant);
			@unlink($pastadestino.'thumbs/'.$img_ant);				
		}
		
		if(@$update){
			$result = $_sitepath.'/images/usuarios/thumbs/'.$nova_imagem;
		}
		else {
			$result = false;
		}
		
		echo '<script>window.top.window.finishUploadIntroImage(\''.$result.'\');</script>';
		
	break;	
	
	
	//---------------------------------------------------------------------------------------------------------------------------------------
	//
	//	EXCLUI A IMAGEM DE INTRODUÇÃO
	//
	//---------------------------------------------------------------------------------------------------------------------------------------
	case 'Remove Image Intro':
	
		$img = mysql_fetch_assoc(mysql_query("SELECT `imagem` FROM `usuarios` WHERE `id` = '$meuid' LIMIT 1"));
		
		@unlink('../../../images/usuarios/'.$img['imagem']);
		@unlink('../../../images/usuarios/thumbs/'.$img['imagem']);
		
		$update = mysql_query("UPDATE `usuarios` SET `imagem` = '' WHERE `id` = '$meuid' LIMIT 1");
		
		if(@$update){
			echo true;
		}
		else {
			echo '<span class="error">Houve um erro ao excluir a imagem.</span>';
		}
		
	break;
	
}

	
	
?>



