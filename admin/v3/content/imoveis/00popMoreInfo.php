

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopMoreInfo(id,tipo){			
		$("#popMoreInfo").popUpShow();
		otherParamsMoreInfo = tipo;
		
		if(id){loadTextMoreInfo(id)};
		
		idTextMoreInfo = id;		
	}
	
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------	
	$(function(){			
		$("#textMoreInfoCancelBtn").click(closePopMoreInfoConfirm);
		$("#textMoreInfoBtn").click(textMoreInfoSave);	
	});
		
		
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopMoreInfoConfirm(){
		if(isModifiedMoreInfo){
			if (confirm("Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?")){
				closePopMoreInfo();
			}
		}
		else {
			closePopMoreInfo();
		}
	}
	
	
	
	// close pop up
	
	function closePopMoreInfo(){			
		$("#popMoreInfo").popUpHide();	
		
		idTextMoreInfo = '';
		otherParamsMoreInfo = '';
		isModifiedMoreInfo = false;
		$("#textMoreInfoForm #text-contentMoreInfo").val('');
		$('#textEditorMoreInfo .uiStatus').html('');		
	}

</script>

	<div id="popMoreInfo" class="uiPopUp textIntroEditor draggable" style="display:none">
		
		<h1 id="textIntroTitle" class="uiBoxTitle">Editar informações do imóvel</h1>
		
		<div class="uiPopContent">		
			<div class="uiPopHolder">				
				<?php 					
					$txtIntroParams['uniqid']   = 'MoreInfo';
					$txtIntroParams['datatype'] = 'imoveis';						
					$txtIntroParams['toolbar']  = 'MiniMedia'; 	
					$txtIntroParams['height']   = 300; 						 
					NWD::insertAdmModule('text_editor', $txtIntroParams);
				?>				
			</div>			
			
		</div>
		<div class="uiBoxBottom">			
			<button id="textMoreInfoCancelBtn" class="uiButton">Fechar</button>
			<button id="textMoreInfoBtn" class="uiButtonConfirm">Salvar</button>
		</div>
	</div>
	
	
	
	