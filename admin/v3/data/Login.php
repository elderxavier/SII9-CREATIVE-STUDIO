<?php 

	require_once('../libs/Login.class.php');
	Login::secSessionStart();
	
	$cfig = @parse_ini_file('../cfig/config.ini');
	include('../../../cfig/conexao.php');
	require_once('../libs/NWD.class.php');
	
	foreach($_POST as $postField => $postValue){
		$$postField = trim(strip_tags(addslashes($postValue)));
	}
	
	$limit_err = @$cfig['limit erro login'] ? $cfig['limit erro login'] : 30;
	$nivelfilter = "AND nivel < '100' ";
	$blockfilter = "AND situacao != 'B' ";
	

	//-----------------------------------------------------------------------------------------------------------------------------------------------
	//	LOGIN
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Login'){	
		
		$usuario = Login::stringToLogin($user);
		$senha	 = Login::stringToLogin($pass);
		
		$limit_err = @$cfig['limit erro login'] ? $cfig['limit erro login'] : 30;
		if(@$_SESSION["err_login"] >= $limit_err){die('<span class="required">Não lembra seu login? Clique no link <b>Esqueci minha senha</b>.</span>');}
			
		if(empty($usuario) || empty($senha)){die('<span class="required">Preencha corretamente os campos USU&Aacute;RIO e SENHA.</span>');}


		$user  = mysql_fetch_object(mysql_query("SELECT * FROM `usuarios` WHERE `user` = '$usuario' $nivelfilter LIMIT 1"));			

		if(empty($user->user)){				
			$_SESSION["err_login"] = isset($_SESSION["err_login"]) ? $_SESSION["err_login"]+1 : 1;				
			die('<span class="error"><b>USU&Aacute;RIO</b> inexistente!</span>');
		}
		elseif($user->situacao != 'A'){
			die('<span class="error">Acesso temporariamente indispon&iacute;vel!</span>');
		}
		elseif($user->senha == $senha){
				
			unset($_SESSION["err_login"]);
				
			$_SESSION["userid"]    = $user->id;
			$_SESSION["usernivel"] = $user->nivel;
			$_SESSION["username"]  = $user->nome;
			$_SESSION["useruser"]  = $user->user;
			$_SESSION["userpass"]  = $user->senha;			
				
			echo true;			
		}
		else {
			$_SESSION["err_login"] = isset($_SESSION["err_login"]) ? $_SESSION["err_login"]+1 : 1;	
			die('<span class="error">A senha n&atilde;o confere com o nome de usu&aacute;rio.</span>');
		}
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	//	LOGIN
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Logout'){	
		
		$_SESSION = array();
	
		$params = session_get_cookie_params();

		setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);

		session_destroy();
		
		header('Lozalização: ./');
		
		echo true;
	
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	//	LEMBRAR SENHA
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Lembrete Senha'){	
		
		$res   = array();
		$lembrete = '';
		
		function required(){
			global $email;
			global $nivelfilter;
			
			if(empty($email)){return '<span class="required">Informe seu EMAIL.</span>';}
			if(!filter_var($email, FILTER_VALIDATE_EMAIL)){return '<span class="required">Informe um EMAIL v&aacute;lido.</span>';}	
		
			$query = mysql_query("SELECT email FROM usuarios WHERE email = '$email' $nivelfilter LIMIT 1");
			if(mysql_num_rows($query) < 1){return '<span class="required">Este EMAIL não está cadastrado.</span>';}		
			
			return false;
		}		
		$required = required();
		
		
		if($required){
			$res['result']  = false;
			$res['message'] = $required;
		}
		else {			
			
			$r = mysql_fetch_assoc($query = mysql_query("SELECT lembrete FROM usuarios WHERE email = '$email' $nivelfilter $blockfilter LIMIT 1"));
			
			$res['result']  = true;
			$res['message'] = '<span class="success">Lembrete de senha: <b>'.$r['lembrete'].'</b></span>';
				
			if(isset($_SESSION["err_login"]) && $_SESSION["err_login"] > $limit_err-5){
				$_SESSION["err_login"] = $limit_err-5;
			}			
		}
		
		
		echo json_encode($res);
		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	//	ENVIAR SENHA POR EMAIL
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	if($act == 'Nao Lembrei'){	
		
		$user = mysql_fetch_assoc(mysql_query("SELECT user, senha, email FROM usuarios WHERE email = '$email' $nivelfilter $blockfilter LIMIT 1"));		
					
		$assunto  = 'Sua Senha !';				
		$msgin 	  = array('[usuario]', '[senha]', '[email]', '[url]');
		$msgout	  = array($user['user'], $user['senha'], $user['email'], NWD::getFullPath(-2));
		$mensagem = str_replace($msgin, $msgout, file_get_contents('../emails/login_lembrar_senha.html'));
				
		$sendmail = NWD::sendEmail($user['email'], $mensagem, $assunto);
		
		if(@$sendmail){
			echo true;
		}
		else {
			echo '<span class="error">Encontramos seu cadastro<br/>mas não foi possível enviá-lo para seu email.</span>';
		}
	
	}
	
	
	
	
?>