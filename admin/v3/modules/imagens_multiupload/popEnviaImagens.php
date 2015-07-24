
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//carrega e abre o pop up
	function openPopEnviaImagens(catid, imgValues){
		$("#popEnviaImagens").popUpShow();
		
		catidImgmGallery = catid;
		$("#imagens_multiuploadGallery #catid").val(catid);		
		if(imgValues){
			$("#imagens_multiuploadGallery #imgvalues").val(imgValues);
		}
		loadImgmGallery();
		
	} 
	
	
	// fecha o Pop Up
	function closePopEnviaImagens(){
		catidImgmGallery = '';
		$("#imagens_multiuploadGallery #catid").val('');		
		$('#imagens_multiuploadGallery .list-img-holder').html('');		
		clearUploadImgmGallery();
		
		$("#popEnviaImagens").popUpHide();
	};	
	
	
	
	// INIT
	$(function(){	
		$("#popEnviaImagens #savePosBtn").click(savePositionImgmGallery);
	});
	
	
</script>

	
	<div id="popEnviaImagens" class="uiPopUp draggable popEnviaImagens" style="display:none">		

		<h1 id="titulo" class="uiBoxTitle">Enviar fotos para este Álbum</h1>
		
		<div class="uiPopContent">			
			<div class="uiPopHolder">
				<?php
					$imgMultParams['uniqid'] 	= 'Gallery';
					$imgMultParams['datatype'] 	= $_PARAM['datatype'];
					$imgMultParams['imgvalues'] = $_PARAM['imgvalues'];
					NWD::insertAdmModule('imagens_multiupload', $imgMultParams); 
				?>
			</div>
			<div class="uiBoxBottom">	
				<button id="savePosBtn" class="uiLinkButton" >Salvar Posições</button>
				<button id="selectBtn" onclick="selectImgmGallery()" class="uiLinkButton" >Adicionar Arquivos</button>
				<button id="cancelBtn" onclick="closePopEnviaImagens()" class="uiButton" >Fechar</button>				
				<button id="sendBtn" onclick="startUploadImgmGallery()" class="uiButtonConfirm" >Enviar</button>
			</div>
		</div>
	</div>
	
	