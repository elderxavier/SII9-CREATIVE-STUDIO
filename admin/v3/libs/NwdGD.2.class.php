<?php

	class NwdGD {
		
		

		//---------------------------------------------------------------------------------------------------------------------------------
		//
		//  FUNÇÃO RESIZE
		//
		//---------------------------------------------------------------------------------------------------------------------------------	
		
		public static function imgResize($imgInput, $imgOutput, $largImg, $altImg, $imgProporc, $corBg = 'ffffff', 
										 $imgQualidade = 100, $imgMenor=false, $marcadagua=array()){
			
			 
			//= '', $marcaBottom = 10, $marcaRight = 10


			$extensao = strtolower(strrchr($imgInput,'.'));
		
			if(strstr('*.jpg;*.jpeg;*.gif;*.png', $extensao)){
			
				list($largImgOrigin, $altImgOrigin) = getimagesize($imgInput);
				
				if($imgMenor && ($largImgOrigin <= $largImg && $altImgOrigin <= $altImg)){
					$newLargImg = $largImgOrigin;
					$newAltImg  = $altImgOrigin;
				}
				else {			
					$newLargImg = round(($largImgOrigin*$altImg)/$altImgOrigin);
					$newAltImg  = round(($altImgOrigin*$largImg)/$largImgOrigin);
				}
			
			
				switch ($imgProporc){
				
					case 'proporc':				
					
						if($newLargImg > $largImg){$newLargImg = $largImg;}
						if($newAltImg > $altImg){$newAltImg = $altImg;}
					
						$pontoX  = 0;
						$pontoY  = 0;
						$largImg = $newLargImg;
						$altImg  = $newAltImg;
				
					break;
				
				
					case 'crop':				
				
						if($newLargImg < $largImg){$newLargImg = $largImg;}	
						if($newAltImg < $altImg){$newAltImg = $altImg;}
					
						$pontoX = ($largImg - $newLargImg)/2;
						$pontoY = ($altImg - $newAltImg)/2;
				
					break;
				

					case 'fixo':
			
						if($newLargImg > $largImg){$newLargImg = $largImg;}
						if($newAltImg > $altImg){$newAltImg = $altImg;}					
		
						$pontoX = ($largImg - $newLargImg) / 2;
						$pontoY = ($altImg - $newAltImg) / 2;
				
					break;
				
				
					case 'estend':
				
						$newLargImg  = $largImg;
						$newAltImg = $altImg;
					
						$pontoX = 0;
						$pontoY = 0;
					
					break;			
				}
		
				
				$newImg = imagecreatetruecolor($largImg, $altImg);

				switch($extensao){
				
					case '.jpg': 
					case '.jpeg':					
						
						//--------------------------------------------------------------------------------------------
						// 	cor de fundo da imagem 
						//--------------------------------------------------------------------------------------------					
						$Bg = NwdGD::HexToRGB($corBg);
						$imgBgColor = imagecolorallocate($newImg, $Bg['red'], $Bg['green'], $Bg['blue']);
						imagefill($newImg, 0, 0, $imgBgColor);
						//--------------------------------------------------------------------------------------------
						$imgSource  = imagecreatefromjpeg($imgInput);
						imagecopyresampled($newImg, $imgSource, $pontoX,$pontoY, 0,0 ,$newLargImg, $newAltImg, $largImgOrigin, $altImgOrigin);
						if($marcadagua){
							NwdGD::insertWatermark($marcadagua, $newImg, $newLargImg, $newAltImg, $marcaRight, $marcaBottom);
						}
						$Copy = imagejpeg($newImg, $imgOutput, $imgQualidade);				
				
					break;	
				

					case '.gif':
					
						//--------------------------------------------------------------------------------------------
						// 	cor de fundo da imagem 
						//--------------------------------------------------------------------------------------------					
						$Bg = NwdGD::HexToRGB($corBg);
						$imgBgColor = imagecolorallocate($newImg, $Bg['red'], $Bg['green'], $Bg['blue']);
						imagefill($newImg, 0, 0, $imgBgColor);
						//--------------------------------------------------------------------------------------------
						$imgSource  = imagecreatefromgif($imgInput);
						imagecopyresampled($newImg, $imgSource, $pontoX,$pontoY, 0,0 ,$newLargImg, $newAltImg, $largImgOrigin, $altImgOrigin);
						if($marcadagua){
							NwdGD::insertWatermark($marcadagua, $newImg, $newLargImg, $newAltImg, $marcaRight, $marcaBottom);
						}
						$Copy = imagegif($newImg, $imgOutput, $imgQualidade);
					
					break;			
				

					case '.png':
					 
						//--------------------------------------------------------------------------------------------
						// 	cor de fundo e alpha da imagem 
						//--------------------------------------------------------------------------------------------	
						$Bg = NwdGD::HexToRGB($corBg);				
						imagealphablending($newImg, false); 
						imagesavealpha($newImg, true);				
						$imgBgColorAlpha = 	imagecolorallocatealpha($newImg, $Bg['red'], $Bg['green'], $Bg['blue'], 127); // 127 = alfa 0
						imagefill($newImg, 0, 0, $imgBgColorAlpha); 
						//--------------------------------------------------------------------------------------------
						$imgSource  = imagecreatefrompng($imgInput);
						imagecopyresampled($newImg, $imgSource, $pontoX,$pontoY, 0,0 ,$newLargImg, $newAltImg, $largImgOrigin, $altImgOrigin);
						
						if(count($marcadagua) > 0){
							NwdGD::insertWatermark($marcadagua, $newImg, $newLargImg, $newAltImg, $marcaRight, $marcaBottom);
						}
						$Copy = imagepng($newImg, $imgOutput);
					
					break;			
				}

				imagedestroy($imgSource);
				imagedestroy($newImg);
			}
			
			if(@$Copy){ return true; }else{ return false; }
			
		}		
		
	
	
		//---------------------------------------------------------------------------------------------------------------------------------	
		//
		//	INSERT WATERMARK
		//
		//---------------------------------------------------------------------------------------------------------------------------------	
		private static function insertWatermark($marcadagua, $newImg, $newLargImg, $newAltImg){		

			$source 	 =  $marcadagua[0]; 
			$marcaBottom = @$marcadagua[1] ? $marcadagua[1] : 10;
			$marcaRight  = @$marcadagua[2] ? $marcadagua[2] : 10;
			$alpha 		 = @$marcadagua[3] ? $marcadagua[3] : 100;

			$extensao = strtolower(strrchr($source,'.'));
			if($extensao == '.jpg' || $extensao == '.jpeg'){$watermark = imagecreatefromjpeg($source);}
			if($extensao == '.png'){$watermark = imagecreatefrompng($source);}
			if($extensao == '.gif'){$watermark = imagecreatefromgif($source);}

			$marcaW = imagesx($watermark);
			$marcaH = imagesy($watermark);
			$marcaX = $newLargImg - $marcaW - $marcaRight;
			$marcaY = $newAltImg - $marcaH - $marcaBottom;

	        $cut = imagecreatetruecolor($marcaW, $marcaH);
	        imagecopy($cut, $newImg, 0, 0, $marcaX, $marcaY, $marcaW, $marcaH);	   
	        imagecopy($cut, $watermark, 0, 0, $src_x, $src_y, $marcaW, $marcaH);

	        imagecopymerge($newImg, $cut, $marcaX, $marcaY, 0, 0, $marcaW, $marcaH, $alpha);
			
			imagedestroy($watermark);
			imagedestroy($cut);
		}


		//---------------------------------------------------------------------------------------------------------------------------------	
		//
		//	AUTO RENAME
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
		
		
		//---------------------------------------------------------------------------------------------------------------------------------	
		//
		//	HEX TO RGB
		//
		//---------------------------------------------------------------------------------------------------------------------------------	
		private static function HexToRGB($cor){
			$cor	= str_replace("#","",$cor);				  
			$red	= hexdec(substr($cor, 0, 2)); 
			$green	= hexdec(substr($cor, 2, 2)); 
			$blue	= hexdec(substr($cor, 4, 2));
			
			return array('red' => $red, 'green' => $green, 'blue' => $blue);
		}
		
}

?>