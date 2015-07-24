

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopTextIntro(id){			
		$("#popTextIntro").popUpShow();
		
		if(id){loadTextIntro(id)};
		idTextIntro = id;
	}
	
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------	
	$(function(){			
		$("#textIntroCancelBtn").click(closePopTextIntroConfirm);
		$("#textIntroSendBtn").click(textIntroSave);	
	});
		
		
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopTextIntroConfirm(id){
		if(isModifiedIntro){
			if (confirm("Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?")){
				closePopTextIntro();
			}
		}
		else {
			closePopTextIntro();
		}
	}
	
	
	
	// close pop up
	
	function closePopTextIntro(){			
		$("#popTextIntro").popUpHide();	
		
		idTextIntro = '';
		isModifiedIntro = false;
		$("#textIntroForm #Intro").val('');
		$('#textEditorIntro .uiStatus').html('');		
	}

</script>

	<div id="popTextIntro" class="uiPopUp textIntroEditor half draggable" style="display:none">
		
		<h1 id="textIntroTitle" class="uiBoxTitle">Editar texto de introdução</h1>
		
		<div class="uiPopContent">		
			<div class="uiPopHolder">				
				<?php 
					if(@$_PARAM['intro'] == 'minieditor'){
						$txtIntroParams['uniqid']   = 'Intro';
						$txtIntroParams['datatype'] = $_PARAM['datatype'];
						$txtIntroParams['field']    = 'introtext';	
						$txtIntroParams['toolbar']  = @$_PARAM['mintoolbar'] ? $_PARAM['mintoolbar'] : 'Mini'; 	
						$txtIntroParams['height']   = 170; 						 
						NWD::insertAdmModule('text_editor', $txtIntroParams);
					}
						
					if(@$_PARAM['intro'] == 'textarea'){							
						echo '<div id="text-editorIntro" class="text-editor">';	
						echo '<textarea id="text-content" onchange="isModifiedIntro = true"></textarea>';							
						echo '</div>';
					}
				?>				
			</div>			
			
		</div>
		<div class="uiBoxBottom">			
			<button id="textIntroCancelBtn" class="uiButton">Fechar</button>
			<button id="textIntroSendBtn" class="uiButtonConfirm">Salvar</button>
		</div>
	</div>
	
	
	
	