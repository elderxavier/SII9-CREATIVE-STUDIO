<?php

	class NWD {	
		
		/*-------------------------------------------------------------------------------------------------------------------------
		//
		//	PATHS
		//
		//-------------------------------------------------------------------------------------------------------------------------*/

		public static function getFullPath($sub = 0){
			
			$sub--;
			
			$url  = $_SERVER["HTTP_HOST"].$_SERVER["PHP_SELF"];
			$path = explode('/',$url);
		
			for($i=0; $i > $sub; $i--){					
				array_pop($path);				
			}
			
			return 'http://'.implode('/',$path);			
		}
		
		
		public static function getAbsolutePath() {
			$path = $_SERVER['DOCUMENT_ROOT'].$_SERVER["PHP_SELF"];
			$dir_pc = array_reverse(explode('/',$path));
			$path = str_replace($dir_pc[0],'',$path);
			
			return $path;
		}
		
		
		/*-------------------------------------------------------------------------------------------------------------------------
		//
		//	GET VARS
		//
		//-------------------------------------------------------------------------------------------------------------------------*/
		public static function defineGET(){
			$vars = null;
			$request = $_SERVER['REQUEST_URI'];	
			
			if(strstr($request,'?')){
				$url = explode('?',$request);
				$get = $url[1];	
				$params = explode('&',$get);
				foreach($params as $param){
					$values = explode('=', $param);
					$vars[strip_tags(addslashes(urldecode(trim($values[0]))))] = strip_tags(addslashes(urldecode(trim(@$values[1]))));
				}		
			}
			return $vars;		
		}
		
		
		//----------------------------------------------------------------------------------------
		//
		//	ENVIA EMAIL
		//
		//----------------------------------------------------------------------------------------
		public static function sendEmail($emaildestino, $mensagem, $assunto='', $nomeremetente='', $emailremetente=''){
			
			global $cfig;		
			
			$cor_fundo 	= @$cfig['email fundo'] ? $cfig['email fundo'] : '#FBFBFB';
			$cor_destak	= @$cfig['email destaque'] ? $cfig['email destaque'] : '#FF9900';
			$cor_texto	= @$cfig['email texto'] ? $cfig['email texto'] : '#73B3C5';
			$colorin	= array('[cor_fundo]', '[cor_destak]', '[cor_texto]');
			$colorout	= array($cor_fundo, $cor_destak, $cor_texto);
			$mensagem 	= str_replace($colorin, $colorout, $mensagem);
			
			$website  		= str_replace('www.','',$_SERVER["HTTP_HOST"]);
			$website_pc		= explode('.', $website);
			$nomeremetente 	= @$nomeremetente ? $nomeremetente : ucfirst($website_pc[0]);
			$emailremetente = @$emailremetente ? $emailremetente : 'no-reply@'.$website;
			
			
			$headers  = "MIME-Version: 1.0\n";
			$headers .= "Content-type: text/html; charset=utf-8\n";
			$headers .= 'From: '.$nomeremetente.'<'.$emailremetente.'>';
			
			$message = "\n".$mensagem;			
			
			$fp = fopen('_email.html','w+');fputs($fp,$message);fclose($fp);
			return mail($emaildestino, $assunto, $message, $headers);		
			
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------	
		//
		//	AUTO RENAME - if arq exists
		//
		//---------------------------------------------------------------------------------------------------------------------------------	
		public function autoRename($dir, $fileName){

			$newName = $fileName;
			$lastpos = strrpos($newName, '.');
			
			$n=0;
			while(@$exit==0){ 
			
				if(file_exists($dir.'/'.$newName)){
					
					$n++;
					$newName = substr_replace($fileName, '_'.$n, $lastpos, 0);

					$exit = 0;	
				}
				else {
					$exit = 1;
				}
			}						
			return $newName;
		}
		
		//----------------------------------------------------------------------------------------
		//
		//	INSERT MODULES
		//
		//----------------------------------------------------------------------------------------
		public static function insertAdmModule($module_name, $params=array()){
			
			global $cfig;
			global $urlvars;
			
			$modulePath = 'modules/'.$module_name;			
			$moduleUrl  = NWD::getFullPath().'/'.$modulePath;
			
			$insert = @ include($modulePath.'/default.php'); 	
			
			if(!$insert){ echo '<p class="module-error">O m&oacute;dulo <b>'.$module_name.'</b> n&atilde;o foi encontrado.</p>'; }
		
		}
		
		// parâmetros requeridos na chamada do módulo		
		public static function requiredParams($params, $requireds){			
			foreach($requireds as $param){
				if(empty($params[$param])){
					echo '<div class="uiStatus" style="left:50%;position:fixed;top:8px;width:auto;z-index:999;margin:0"><span class="error" style="margin:0">O parâmetro '.strtoupper($param).' não foi especificado</span></div>';
					return;
				}
			}
		}
		
		// resolve a url do data type
		public static function resolveDataType($datatype){
			switch($datatype){				
				case 'users':
					return 'data/Usuarios.php';
				break;
				case 'user':
					return 'data/Myaccount.php';
				break;
				case 'categ':
					return 'data/Categorias.php';
				break;					
				case 'cont':
					return 'data/Content.php';
				break;
				case 'imob':
					return 'data/Imoveis.php';
				break;
				case 'animais':
					return 'data/Animais.php';
				break;
			}
		}
		

		//----------------------------------------------------------------------------------------
		//
		//	SHOW CONTENT
		//
		//----------------------------------------------------------------------------------------
		public static function showAdmContent($pag) {	

			global $cfig;
			global $urlvars;	
			$_PARAM = array();
			
			if($pag){			
				
				// pega os parametros do menu e coloca no array $_PARAM
				$_menu = mysql_fetch_assoc(mysql_query("SELECT params, nivel FROM admin_menu WHERE 
					id = '".$urlvars[0]."' 
					AND (url = '$pag' OR url = 'categorias') 
					AND nivel >= '".@$_SESSION['usernivel']."'
					AND published = '1' LIMIT 1"));
				
				$_listParams = explode("\n", $_menu['params']);
				foreach($_listParams as $_paramLine){
					$_pcParam = explode('=', $_paramLine);
					$_PARAM[trim($_pcParam[0])] = trim(@$_pcParam[1]);			
				}				
				 
				$arq = 'content/'.$pag.'.php';				
				if(file_exists($arq) && ($_menu['nivel'] >= @$_SESSION['usernivel'] || $pag == 'intro')) {					
					define("NWD_ACCESS", true);
					include($arq);
				}
				else {
					include('content/no-route.php');
				}
			}
		} 


		//----------------------------------------------------------------------------------------
		//	HELP IMAGENS
		//----------------------------------------------------------------------------------------
		public static function helpImages($values){		
			$ipc = explode('_', $values);
			$helpImages = 'O sistema irá tratar e ';						
			$helpImages .= $ipc[2] == 'estend' ? 'esticar' : ($ipc[2] == 'crop' ? 'recortar' : 'redimensionar proporcionalmente');
			$helpImages .= ' sua imagem para '. @$ipc[0].' X '.$ipc[1].' pixels';

			if(@$ipc[6] && @$ipc[7]){
				$tbProporc .= $ipc[8] == 'estend' ? 'esticar' : ($ipc[8] == 'crop' ? 'recortar' : 'redimensionar proporcionalmente');
			
				$helpImages .= ' e '.$tbProporc.' a miniatura para '.$ipc[6].' X '.$ipc[7].' pixels';
			}


			return $helpImages;
		}
		
		
	}

?>