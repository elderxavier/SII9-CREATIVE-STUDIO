
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<?php 

	
	$arquivo = '../../'.$_PARAM['arq'].'.ini';


	if(@$_POST['act'] == 'Salvar')
	{
		$content  = "\n";
		$content .= '; arquivo atualizado em '.date('d/m/y')."\n\n";
		
		$strIn  = array("\n", chr(13));
		$strOut = array('<br/>', '');
		
		foreach($_POST as $campo => $campoValue)
		{
			if($campo != 'act')
			{				
				$campoValue = str_replace($strIn, $strOut, trim($campoValue));
				$campo 		= str_replace(':',' ',$campo);

				if($campoValue == 'section')
				{
					$content .= "\n[".$campo."]\n";
				}
				else
				{					
					$content .= $campo.' = "'.$campoValue.'"'."\n";
				}
			}
		}
		
		$fp = fopen($arquivo, 'w+');fputs($fp, $content);fclose($fp);

	}	


	$cfig =  parse_ini_file($arquivo, true);	
	
?>
	
	<div id="ini-cfig" class="page-content">
	
		<h1 class="contentheader">Editar configura&ccedil;&otilde;es</h1>
		
		<form name="form1" action="" method="post" class="form-holder">
			
			<div class="form-item">
				<input id="saveBtn" type="submit" name="act" value="Salvar" class="uiButtonConfirm"/>
			</div>
			
			<?php			
			
				function displayItem($campo,$campoValue)
				{
					$campoName  = str_replace(' ',':',$campo);
					$campoValue = str_replace("<br/>","\n",$campoValue);					

					$html  = '<div class="form-item">';
					$html .= '<label>'.ucfirst($campo).':</label>';
					$html .= '<textarea name="'.$campoName.'" >'.$campoValue.'</textarea>';
					$html .= '</div>';
					
					return $html;
				}			
				
				
				foreach($cfig as $campo => $campoValue)
				{
					if(is_array($campoValue)) 
					{
						$campoName  = str_replace(' ',':',$campo);
						
						echo '<div class="form-item section">';
						echo '<label>'.strtoupper($campo).'</label>';
						echo '<input type="hidden" name="'.$campoName.'" value="section" />';
						echo '</div>';
						
						foreach($campoValue as $subCampo => $subValue)
						{
							echo displayItem($subCampo, $subValue);
						}
					}
					else
					{
						echo displayItem($campo, $campoValue);
					}
				}
				
			?>
		</form>	
		
	</div> 

