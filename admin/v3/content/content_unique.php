
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

 <?php
		
	$datatype 	  = @$_PARAM['datatype'] ? $_PARAM['datatype'] : 'cont';
	$itemid		  = $datatype == 'user' ? $_SESSION['userid'] : $_PARAM['itemid'];
	$editor		  = @$_PARAM['editor'] == 'false' ? false : true;
	$toolbarintro = @$_PARAM['toolbarintro'] ? $_PARAM['toolbarintro'] : 'MiniSave'; 
	$imgintro	  = @$_PARAM['imgintro'];
	$imgvalues	  = @$_PARAM['imgvalues'];
	
	
?> 

<?php
	
	switch($datatype){
		case 'cont':
			$cont = mysql_fetch_assoc(mysql_query("SELECT titulo FROM content WHERE id = '$itemid' AND ativo = '1' LIMIT 1"));
			$titulo = $cont['titulo'];
			$introtext_field = 'introtext';
			$fulltext_field  = 'fulltext';
		break;
		case 'user':
			$cont = mysql_fetch_assoc(mysql_query("SELECT nome FROM usuarios WHERE id = '$itemid' AND situacao = 'A' LIMIT 1"));
			$titulo = $cont['nome'];
			$introtext_field = 'introtext';
			$fulltext_field  = 'fulltext';
		break;
	}
	
?>

<script type="text/javascript">
	$(function(){
		//<?php //if($imgcontent):?>$("#openPopEviaImagensBtn").click(openPopImages);<?php// endif; ?>
	});
</script>


<div id="content-unique" class="page-content">  

	<h1 class="contentheader"><?=@$titulo?></h1>
	
	<div class="editor-holder">			
		
		<?php if($imgintro){echo '<button id="openPopIntroImageBtn" onclick="openPopIntroImage(\''.$itemid.'\')" class="cke_combo_button uiCkeButton">Imagem do Artigo</button>';} ?>	
		<?php if($imgvalues){echo '<button id="openPopEviaImagensBtn" onclick="openPopEnviaImagens(\''.$itemid.'\')" class="cke_combo_button uiCkeButton">Galeria de fotos</button>';} ?>		
		
		<?php if(isset($_PARAM['intro']) && !is_numeric($_PARAM['intro'])): ?>	
		<script>$(function(){loadTextIntro(<?=$itemid?>)})</script>	
		<div class="content-holder">
			<h3 class="componentheadding">Texto de introdução</h3>
			<?php 
				$txt1Params['uniqid']	= "Intro";			
				$txt1Params['datatype']	= $datatype;
				$txt1Params['field']	= $introtext_field;
				$txt1Params['toolbar']	= $toolbarintro;
				$txt1Params['height']	= 170;			
				NWD::insertAdmModule('text_editor', $txt1Params); 
				
			?>	
		</div>	
		<p>&nbsp;</p>
		<?php endif; ?>
		
		<?php if($editor != false): ?>	
		<script>$(function(){loadTextFull(<?=$itemid?>)})</script>	
		<div class="content-holder">
			<h3 class="componentheadding">Conteúdo da página</h3>
			<?php 
				$txt2Params['uniqid']	= "Full";	
				$txt2Params['datatype']	= $datatype;
				$txt2Params['field']	= $fulltext_field;
				$txt2Params['toolbar']	= @$_PARAM['toolbar'];
				$txt2Params['height']	= 450;
				NWD::insertAdmModule('text_editor', $txt2Params); 
			?>	
		</div>
		<?php endif; ?>
	</div>
	
	<?php if($imgintro){include('content/content/popIntroImage.php');} ?>
	<?php if($imgvalues){include('modules/imagens_multiupload/popEnviaImagens.php');} ?>	
	
</div>