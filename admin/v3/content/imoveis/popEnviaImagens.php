
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//carrega e abre o pop up
	function openPopImages(idAlbum){
		$("#popEnviaImagens").popUpShow();
		
		idAlbumImages = idAlbum;
		$("#imagens_multiupload #idAlbum").val(idAlbum);		

		loadImages();
		
	} 
	
	
	// fecha o Pop Up
	function closePopImages(){
		idAlbumImages = '';
		$("#imagens_multiupload #idAlbum").val('');		
		$('#imagens_multiupload .list-img-holder').html('');		
		clearUploadImages();
		
		$("#popEnviaImagens").popUpHide();
	};	
	
	
	
	// INIT
	$(function(){	
		$("#popEnviaImagens #savePosBtn").click(savePositionImagem);
	});
	
	
</script>

	
	<div id="popEnviaImagens" class="uiPopUp draggable" style="display:none">		

		<h1 id="titulo" class="uiBoxTitle">Enviar fotos para este Imóvel</h1>
		
		<div class="uiPopContent">			
			<div class="uiPopHolder">
				<?php
					$imgMultParams['type'] = 'imoveis';
					$imgMultParams['imgvalues'] = $_PARAM['imgvalues'];
					NWD::insertAdmModule('imoveis_fotos_multiupload', $imgMultParams); 
				?>
			</div>
			<div class="uiBoxBottom">	
				<?php if($_SESSION['usernivel'] <= 1){ echo '<button id="savePosBtn" class="uiLinkButton" >Salvar Posições</button>';} ?>
				<button id="selectBtn" onclick="selectImages()" class="uiLinkButton" >Adicionar Arquivos</button>
				<button id="cancelBtn" onclick="closePopImages()" class="uiButton" >Fechar</button>				
				<button id="sendBtn" onclick="startUploadImages()" class="uiButtonConfirm" >Enviar</button>
			</div>
		</div>
	</div>
	
	