<?php
class Videos {

	//---------------------------------------------------------------------------------------------------------------------------------------------
	// YOUTUBE STRIP COD
	//---------------------------------------------------------------------------------------------------------------------------------------------
	public static function stripCodYoutube($url){
		if(strstr($url,"v/")){
			$pc=explode("v/",$url,2);
			$url=$pc[1];
		}
		if(strstr($url,"v=")){
			$pc=explode("v=",$url,2);
			$url=$pc[1];
		}
		if(strstr($url,'"')){
			$pc2=explode('"',$url,2);
			$url=$pc2[0];
		}
		if(strstr($url,'&')){
			$pc2=explode('&',$url,2);
			$url=$pc2[0];
		}
		if(strstr($url,'%')){
			$pc2=explode('%',$url,2);
			$url=$pc2[0];
		}

		return $url;
	}


}
?>