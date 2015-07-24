
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//carrega e abre o pop up
	function openPopEnviaArquivos(catid){
		$("#popEnviaArquivos").popUpShow();
		
		catidArqList = catid;
		$("#arquivos_multiuploadList #catid").val(catid);		

		loadArqList();
		
	} 
	
	
	// fecha o Pop Up
	function closePopEnviaArquivos(){
		catidArqList = '';
		$("#arquivos_multiuploadList #catid").val('');		
		$('#arquivos_multiuploadList .list-arq-holder').html('');		
		clearUploadArqList();
		
		$("#popEnviaArquivos").popUpHide();
	};	
	
	
	
	// INIT
	$(function(){	
		$("#popEnviaArquivos #savePosBtn").click(savePositionArqList);
	});
	
	
</script>

	
	<div id="popEnviaArquivos" class="uiPopUp draggable popEnviaArquivos" style="display:none">		

		<h1 id="titulo" class="uiBoxTitle">Enviar Arquivos</h1>
		
		<div class="uiPopContent">			
			<div class="uiPopHolder">
				<?php
					$arqMultParams['uniqid']   = 'List';					
					NWD::insertAdmModule('arquivos_multiupload', $arqMultParams); 
				?>
			</div>
			<div class="uiBoxBottom">	
				<button id="savePosBtn" class="uiLinkButton" >Salvar Posições</button>
				<button id="selectBtn" onclick="selectArqList()" class="uiLinkButton" >Adicionar Arquivos</button>
				<button id="cancelBtn" onclick="closePopEnviaArquivos()" class="uiButton" >Fechar</button>				
				<button id="sendBtn" onclick="startUploadArqList()" class="uiButtonConfirm" >Enviar</button>
			</div>
		</div>
	</div>
	
	