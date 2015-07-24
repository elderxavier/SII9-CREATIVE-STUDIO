<?php
	
	class Login {
	
		
		//------------------------------------------------------------------------------------------------------------------
		// PROTEGER
		//------------------------------------------------------------------------------------------------------------------
		public static function proteger(){
		
			if(!empty($_SESSION['useruser']) && !empty($_SESSION['userpass'])){		
				return true;	
			}
			else {
				
				$url  = $_SERVER['REQUEST_URI'];
				$path = explode('/',$url);	
				$urlRequest = implode('/',$path);
				
				die('<script>location.href="'._fullpath.'/0/login/?p='.$urlRequest.'"</script>'); 
			}
		}
		
		
		//------------------------------------------------------------------------------------------------------------------
		// SESSION START
		//------------------------------------------------------------------------------------------------------------------
		public static function secSessionStart() {
			
			$session_name = 'aves_admin';
			$secure = false;
			$httponly = true;
	 
			ini_set('session.use_only_cookies', 1);
			$cookieParams = session_get_cookie_params();
			session_set_cookie_params($cookieParams["lifetime"], $cookieParams["path"], $cookieParams["domain"], $secure, $httponly); 
			session_name($session_name); 
			session_start();
			//session_regenerate_id(true);
		}	
		

		
		//------------------------------------------------------------------------------------------------------------------
		// STRING TO LOGIN
		/* limpa caracteres especiais do login */
		//------------------------------------------------------------------------------------------------------------------
		public static function stringToLogin($string){
		
			$strIn  = "ÂÃÀÁâãàáªÊÉÈêéèÍÏÌíïìÕÔÓÒõôóòºÚÜÙúüùÇçÑñ";
			$strOut = "AAAAaaaaaEEEeeeIIIiiiOOOOoooooUUUuuuCcNn";
			$string = strtr(utf8_decode($string),utf8_decode($strIn),utf8_decode($strOut));		
			$string = preg_replace("/[^a-zA-Z0-9_.]/","",$string);
		
			return strtolower($string);
		}
	}
?>