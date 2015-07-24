<?php
	
	@ header('Content-Type: text/html; charset=UTF-8');
	
	class Strings {			
		
		public static function Charset($string){
		
			$userCharset = @$_SESSION["usercharset"];
			
			if($userCharset == 'ISO-8859-1')
			{
				$string = utf8_decode($string);
			}
			else
			{
				$string = $string;
			}

			return $string;
		}
		
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function stringToUrl($string){
		
			$strIn  = "ÂÃÀÁâãàáªÊÉÈêéèÍÏÌíïìÕÔÓÒõôóòºÚÜÙúüùÇçÑñ ";
			$strOut = "AAAAaaaaaEEEeeeIIIiiiOOOOoooooUUUuuuCcNn-";
			$string = strtr(trim(utf8_decode($string)),utf8_decode($strIn),$strOut);	

			$string = preg_replace("/[^a-zA-Z0-9-_-]/","",$string);
			
			return $string;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function stringToMeta($string){
		
			$string = strtolower(Strings::stringToUrl($string));
			
			$remove = 'da,das,de,do,dos,no,nos,na,nas,ou,a,as,e,i,o,os,com,para,em';
			
			$array = explode(',',$remove);
			foreach($array as $item){
				$excessoes[] = '-'.trim($item).'-';
				$replace[]	 = '-';
			}

			$string = str_replace($excessoes,$replace,$string);
			$string = str_replace('--','-', $string);
			
			return $string;
		}		
		
		
		//----------------------------------------------------------------------------------------
		//
		//	FECHA TAGS ABERTAS
		//
		//----------------------------------------------------------------------------------------	
		public static function closeTags($html){

			//coloca todas as tags abertas em um array
			preg_match_all( "#<([a-z]+)( .*)?(?!/)>#iU", $html, $result );
			$openedtags = $result[1];

			//coloca todas as tags fechadas em um array
			preg_match_all( "#</([a-z]+)>#iU", $html, $result );
			$closedtags = $result[1];
			$len_opened = count($openedtags);
			
			//se todas as tags estiverem fechadas
			if(count( $closedtags ) == $len_opened){
				return $html;
			}
			$openedtags = array_reverse ($openedtags);
			
			//senão fecha as tags abertas
			for( $i = 0; $i < $len_opened; $i++ ) {
				if ( !in_array ( $openedtags[$i], $closedtags ) ){
					$html .= "</" . $openedtags[$i] . ">";
				}
				else {
					unset ($closedtags[array_search ($openedtags[$i], $closedtags)]);
				}
			}
			return $html;
		}
		
		
		//----------------------------------------------------------------------------------------
		//
		//	ENCURTA STRING SEM CORTAR PALAVRAS
		//
		//----------------------------------------------------------------------------------------
		public static function stringLimit($string, $limit, $end=''){

			$string = trim($string);

			if(strlen($string) > $limit){							
				$string = substr($string,0,$limit);
				$lastSpacePos = strrpos($string, ' ');
				$string = substr($string, 0, $lastSpacePos);
				$string = $string.' '.$end;
			}
		
			return Strings::closeTags($string);
		}
		
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function stringClean($string){
		
			$strIn  = "ÂÃÀÁâãàáªÊÉÈêéèÍÏÌíïìÕÔÓÒõôóòºÚÜÙúüùÇçÑñ";
			$strOut = "AAAAaaaaaEEEeeeIIIiiiOOOOoooooUUUuuuCcNn";
			$string = strtr($string,$strIn,$strOut);
			
			return $string;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function stringToHtml($htmltt){
		
			$htmltt = str_replace("<","&lt;",$htmltt);
			$htmltt = str_replace(">","&gt;",$htmltt);	
			$htmltt = str_replace("'","&acute;",$htmltt);		
			$htmltt = str_replace('"','&quot;',$htmltt);
			$htmltt = str_replace("Â","&Acirc;",$htmltt);
			$htmltt = str_replace("Ã","&Atilde;",$htmltt);
			$htmltt = str_replace("À","&Agrave;",$htmltt);
			$htmltt = str_replace("Á","&Aacute;",$htmltt);
			$htmltt = str_replace("â","&acirc;",$htmltt);
			$htmltt = str_replace("ã","&atilde;",$htmltt);
			$htmltt = str_replace("à","&agrave;",$htmltt);
			$htmltt = str_replace("á","&aacute;",$htmltt);
			$htmltt = str_replace("Ê","&Ecirc;",$htmltt);
			$htmltt = str_replace("È","&Egrave;",$htmltt);
			$htmltt = str_replace("É","&Eacute;",$htmltt);
			$htmltt = str_replace("ê","&ecirc;",$htmltt);
			$htmltt = str_replace("è","&egrave;",$htmltt);
			$htmltt = str_replace("é","&eacute;",$htmltt);
			$htmltt = str_replace("Î","&Icirc",$htmltt);
			$htmltt = str_replace("Ì","&Igrave;",$htmltt);
			$htmltt = str_replace("Í","&Iacute;",$htmltt);
			$htmltt = str_replace("î","&icirc;",$htmltt);
			$htmltt = str_replace("ì","&igrave;",$htmltt);
			$htmltt = str_replace("í","&iacute;",$htmltt);
			$htmltt = str_replace("Ô","&Ocirc;",$htmltt);
			$htmltt = str_replace("Õ","&Otilde;",$htmltt);
			$htmltt = str_replace("Ò","&Ograve;",$htmltt);
			$htmltt = str_replace("Ó","&Oacute;",$htmltt);
			$htmltt = str_replace("ô","&ocirc;",$htmltt);
			$htmltt = str_replace("õ","&otilde;",$htmltt);
			$htmltt = str_replace("ò","&ograve;",$htmltt);
			$htmltt = str_replace("ó","&oacute;",$htmltt);
			$htmltt = str_replace("Û","&Ucirc;",$htmltt);
			$htmltt = str_replace("Ù","&Ugrave;",$htmltt);
			$htmltt = str_replace("Ü","&Uuml;",$htmltt);
			$htmltt = str_replace("Ú","&Uacute;",$htmltt);
			$htmltt = str_replace("û","&ucirc;",$htmltt);
			$htmltt = str_replace("ù","&ugrave;",$htmltt);
			$htmltt = str_replace("ú","&uacute;",$htmltt);
			$htmltt = str_replace("ü","&uuml;",$htmltt);
			$htmltt = str_replace("Ç","&Ccedil;",$htmltt);
			$htmltt = str_replace("ç","&ccedil;",$htmltt);
			$htmltt = str_replace("Ñ","&Ntilde;",$htmltt);
			$htmltt = str_replace("ñ","&ntilde;",$htmltt);
			
			return $htmltt;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function htmlSpecialChars($htmltt){
		
			$htmltt = str_replace("Â","&Acirc;",$htmltt);
			$htmltt = str_replace("Ã","&Atilde;",$htmltt);
			$htmltt = str_replace("À","&Agrave;",$htmltt);
			$htmltt = str_replace("Á","&Aacute;",$htmltt);
			$htmltt = str_replace("â","&acirc;",$htmltt);
			$htmltt = str_replace("ã","&atilde;",$htmltt);
			$htmltt = str_replace("à","&agrave;",$htmltt);
			$htmltt = str_replace("á","&aacute;",$htmltt);
			$htmltt = str_replace("Ê","&Ecirc;",$htmltt);
			$htmltt = str_replace("È","&Egrave;",$htmltt);
			$htmltt = str_replace("É","&Eacute;",$htmltt);
			$htmltt = str_replace("ê","&ecirc;",$htmltt);
			$htmltt = str_replace("è","&egrave;",$htmltt);
			$htmltt = str_replace("é","&eacute;",$htmltt);
			$htmltt = str_replace("Î","&Icirc",$htmltt);
			$htmltt = str_replace("Ì","&Igrave;",$htmltt);
			$htmltt = str_replace("Í","&Iacute;",$htmltt);
			$htmltt = str_replace("î","&icirc;",$htmltt);
			$htmltt = str_replace("ì","&igrave;",$htmltt);
			$htmltt = str_replace("í","&iacute;",$htmltt);
			$htmltt = str_replace("Ô","&Ocirc;",$htmltt);
			$htmltt = str_replace("Õ","&Otilde;",$htmltt);
			$htmltt = str_replace("Ò","&Ograve;",$htmltt);
			$htmltt = str_replace("Ó","&Oacute;",$htmltt);
			$htmltt = str_replace("ô","&ocirc;",$htmltt);
			$htmltt = str_replace("õ","&otilde;",$htmltt);
			$htmltt = str_replace("ò","&ograve;",$htmltt);
			$htmltt = str_replace("ó","&oacute;",$htmltt);
			$htmltt = str_replace("Û","&Ucirc;",$htmltt);
			$htmltt = str_replace("Ù","&Ugrave;",$htmltt);
			$htmltt = str_replace("Ü","&Uuml;",$htmltt);
			$htmltt = str_replace("Ú","&Uacute;",$htmltt);
			$htmltt = str_replace("û","&ucirc;",$htmltt);
			$htmltt = str_replace("ù","&ugrave;",$htmltt);
			$htmltt = str_replace("ú","&uacute;",$htmltt);
			$htmltt = str_replace("ü","&uuml;",$htmltt);
			$htmltt = str_replace("Ç","&Ccedil;",$htmltt);
			$htmltt = str_replace("ç","&ccedil;",$htmltt);
			$htmltt = str_replace("Ñ","&Ntilde;",$htmltt);
			$htmltt = str_replace("ñ","&ntilde;",$htmltt);
			
			return $htmltt;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function htmlSpecialCharsReverse($htmltt){
		
			$htmltt = str_replace("&Acirc;","Â",$htmltt);
			$htmltt = str_replace("&Atilde;","Ã",$htmltt);
			$htmltt = str_replace("&Agrave;","À",$htmltt);
			$htmltt = str_replace("&Aacute;","Á",$htmltt);
			$htmltt = str_replace("&acirc;","â",$htmltt);
			$htmltt = str_replace("&atilde;","ã",$htmltt);
			$htmltt = str_replace("&agrave;","à",$htmltt);
			$htmltt = str_replace("&aacute;","á",$htmltt);
			$htmltt = str_replace("&Ecirc;","Ê",$htmltt);
			$htmltt = str_replace("&Egrave;","È",$htmltt);
			$htmltt = str_replace("&Eacute;","É",$htmltt);
			$htmltt = str_replace("&ecirc;","ê",$htmltt);
			$htmltt = str_replace("&egrave;","è",$htmltt);
			$htmltt = str_replace("&eacute;","é",$htmltt);
			$htmltt = str_replace("&Icirc","Î",$htmltt);
			$htmltt = str_replace("&Igrave;","Ì",$htmltt);
			$htmltt = str_replace("&Iacute;","Í",$htmltt);
			$htmltt = str_replace("&icirc;","î",$htmltt);
			$htmltt = str_replace("&igrave;","ì",$htmltt);
			$htmltt = str_replace("í","&iacute;",$htmltt);
			$htmltt = str_replace("&Ocirc;","Ô",$htmltt);
			$htmltt = str_replace("&Otilde;","Õ",$htmltt);
			$htmltt = str_replace("&Ograve;","Ò",$htmltt);
			$htmltt = str_replace("&Oacute;","Ó",$htmltt);
			$htmltt = str_replace("&ocirc;","ô",$htmltt);
			$htmltt = str_replace("&otilde;","õ",$htmltt);
			$htmltt = str_replace("&ograve;","ò",$htmltt);
			$htmltt = str_replace("&oacute;","ó",$htmltt);
			$htmltt = str_replace("&Ucirc;","Û",$htmltt);
			$htmltt = str_replace("&Ugrave;","Ù",$htmltt);
			$htmltt = str_replace("&Uuml;","Ü",$htmltt);
			$htmltt = str_replace("&Uacute;","Ú",$htmltt);
			$htmltt = str_replace("&ucirc;","û",$htmltt);
			$htmltt = str_replace("&ugrave;","ù",$htmltt);
			$htmltt = str_replace("&uacute;","ú",$htmltt);
			$htmltt = str_replace("&uuml;","ü",$htmltt);
			$htmltt = str_replace("&Ccedil;","Ç",$htmltt);
			$htmltt = str_replace("&ccedil;","ç",$htmltt);
			$htmltt = str_replace("&Ntilde;","Ñ",$htmltt);
			$htmltt = str_replace("&ntilde;","ñ",$htmltt);
			
			return $htmltt;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function mysqlScape($string){			
			
			$string = get_magic_quotes_gpc() ? stripslashes($string) : $string;
			$string = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($string) : mysql_escape_string($string); 
			
			return $string;			
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function ucNomeProprio($str){
		
			$str = strtr(strtolower($str),"[ÂÃÀÁÊÉÈÍÕÔÓÚÜÇÑ]","[âãàáêéèíõôóúüçñ]");
			$str = ucwords($str);
			
			$excessoes = array(' Da ',' De ',' Ou ',' A ',' E ',' I ');
			$excessoes2 = array(' da ',' de ',' ou ',' a ',' e ',' i ');
			
			$str = str_replace($excessoes,$excessoes2,$str);
			
			return $str;
		}		

		//---------------------------------------------------------------------------------------------------------------------------------------
		
		public static function stringToUpper($str){	
		
			$strUpper = strtr(strtoupper($str),"[âãàáêéèíõôóúüçñ]", "[ÂÃÀÁÊÉÈÍÕÔÓÚÜÇÑ]");
			
			return $strUpper;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		public static function dateFormat($data){
		
			if(strstr($data,'/')){
				$pc = explode('/',$data);
				$dia = $pc['0'];
				$mes = $pc['1'];
				$ano = $pc['2'];		
				$formatted = $ano.'-'.$mes.'-'.$dia;
			}
			if(strstr($data,'-')){
				$pc = explode('-',$data);
				$dia = $pc['2'];
				$mes = $pc['1'];
				$ano = $pc['0'];
				$formatted = $dia.'/'.$mes.'/'.$ano;
			}
			
			return @ $formatted;
		}
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		// MONEY TO INT
		//---------------------------------------------------------------------------------------------------------------------------------------
		public static function moneyToInt($money, $decimals = 2){

			$lengh = strlen($money);
			$pPos = strrpos($money, '.');
			$vPos = strrpos($money,',');
			
			$centPos = $vPos || $pPos ? ($lengh - ($vPos < $pPos ? $pPos : $vPos)-1) : 0;
			
			$pow = pow(10, $centPos);
			$dec = pow(10, $decimals);
			
			$moneyFmt = str_replace(array(',','.',' '),array('','',''),$money);	
			$moneyFmt = round(($moneyFmt/$pow)*$dec);

			return $moneyFmt;
		}	
		
		//---------------------------------------------------------------------------------------------------------------------------------------
		// INT TO MONEY
		//---------------------------------------------------------------------------------------------------------------------------------------
		public static function intToMoney($money, $decimals = 2){		
			$dec = pow(10, $decimals);
			return number_format($money/$dec, $decimals, ',','.');	 
		}		
	
	}
?>