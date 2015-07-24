<?php
	
		// REQUER AS CLASSES 
		//------------------------------------------------
			
		//	NwdGD.2.class.php
		//	Strings.class.php		
		
?>

<?php	
	
	class Images {

		//------------------------------------------------------------------------
		//	UPLOAD IMAGENS
		//------------------------------------------------------------------------
		
		public static function uploadImagens($file, $pastaDestino, $values /* array */, $limitName=20, $imgName='', $watermark=''){
			
			$result = false;
			
			if($file['size'] > 0){

				if(!is_dir($pastaDestino)){
					mkdir($pastaDestino, 0755);
				}
			
				$largImg 		= $values[0]; 
				$altImg 		= $values[1]; 
				$imgProporc 	= $values[2];
				
				$corBg 			= @ $values[3] ? $values[3] : 'ffffff';
				$imgQualidade 	= @ $values[4] ? $values[4] : 100; 
				$imgMenor 		= @ $values[5] ? $values[5] : false;
				
				$largThumb 		= @ $values[6]; 
				$altThumb 		= @ $values[7]; 
				$thumbProporc 	= @ $values[8];
				
				$geraThumb		= $largThumb && $altThumb && $thumbProporc ? true : false; // se possuir todas as especificações, gera a miniatura
			
				
				
				$fileName = $file['name'];
				$extensao = strtolower(strrchr($fileName,'.'));
				
				if(strstr('*.jpg;*.jpeg;*.gif;*.png', $extensao)){	
				
					$newName = $imgName ? $imgName : str_replace($extensao,'',$fileName); 					
					$newName = Strings::stringToUrl($newName);
					$newName = strtolower(substr($newName,0,$limitName-8).$extensao);
					$newName = NwdGD::autoRename($pastaDestino, $newName);			
					
					if(!is_dir('_temp')){
						mkdir('_temp', 0755);sleep(1);
					}
					
					$tempName 	 = md5(microtime()).$extensao;
					$imageTemp	 = '_temp/'.$tempName;					
					$imageOutput = $pastaDestino.$newName;					
					
					copy($file['tmp_name'],$imageTemp);					
					
					$imageResize = NwdGD::imgResize($imageTemp, $imageOutput, $largImg, $altImg, $imgProporc, $corBg, $imgQualidade, $imgMenor, $watermark);
					
					if($geraThumb){					
						if(!is_dir($pastaDestino.'thumbs')){
							mkdir($pastaDestino.'thumbs', 0755);
						}
						
						$thumbOutput = $pastaDestino.'thumbs/'.$newName;
						$thumbResize = NwdGD::imgResize($imageTemp, $thumbOutput, $largThumb, $altThumb, $thumbProporc, $corBg, $imgQualidade, $imgMenor);
					}
					
					@unlink($imageTemp);			
					
					if($imageResize){ $result = $newName; }			
				}
			}
			
			return $result;
		}
	
		
		
		//------------------------------------------------------------------------
		//	COPIAR E REDIMENSIONAR - arquivo local, sem upload
		//------------------------------------------------------------------------
		
		public static function copyResize($file, $pastaDestino, $values /* array */, $limitName=20, $imgName='', $watermark=''){
			
			$result = false;
			
			if(is_file($file)){
			
				$largImg 		= $values[0]; 
				$altImg 		= $values[1]; 
				$imgProporc 	= $values[2];
				
				$corBg 			= @ $values[3] ? $values[3] : 'ffffff';
				$imgQualidade 	= @ $values[4] ? $values[4] : 100; 
				$imgMenor 		= @ $values[5] ? $values[5] : false;
				
				$largThumb 		= @ $values[6]; 
				$altThumb 		= @ $values[7]; 
				$thumbProporc 	= @ $values[8];
				
				$geraThumb		= $largThumb && $altThumb && $thumbProporc ? true : false; // se possuir todas as especificações, gera a miniatura			
								
				$fileName = basename($file);
				$extensao = strtolower(strrchr($fileName,'.'));
				
				if(strstr('*.jpg;*.jpeg;*.gif;*.png', $extensao)){	
				
					$newName = $imgName ? $imgName : str_replace($extensao,'',$fileName); 					
					$newName = Strings::stringToUrl($newName);
					$newName = strtolower(substr($newName,0,$limitName-8).$extensao);
					$newName = NwdGD::autoRename($pastaDestino, $newName);			
					
					if(!is_dir('_temp')){
						mkdir('_temp', 0755);sleep(1);
					}
					
					$imageOutput = $pastaDestino.$newName;
					
					$imageResize = NwdGD::imgResize($file, $imageOutput, $largImg, $altImg, $imgProporc, $corBg, $imgQualidade, $imgMenor, $watermark);
					
					if($geraThumb){					
						if(!is_dir($pastaDestino.'thumbs')){
							mkdir($pastaDestino.'thumbs', 0755);
						}
						
						$thumbOutput = $pastaDestino.'thumbs/'.$newName;
						$thumbResize = NwdGD::imgResize($file, $thumbOutput, $largThumb, $altThumb, $thumbProporc, $corBg, $imgQualidade, $imgMenor);
					}
					
					if($imageResize){ $result = $newName; }			
				}
			}
			
			return $result;
		}
		
		
		//------------------------------------------------------------------------
		//	EXCLUIR IMAGENS
		//------------------------------------------------------------------------
		
		public static function excluiImagens($files, $pastaDestino ){			
			
			$result = array();
			
			$i = 0;	$e = 0; $del = '';
			foreach($files as $file){
				if(is_file($pastaDestino.$file)){
					$del = unlink($pastaDestino.$file);
				}
				
				if($del){$i++;}else{$e++;}
			}
			
			$result['success'] = $i;
			$result['error']   = $e;
			
			return $result;
		}
	}
?>