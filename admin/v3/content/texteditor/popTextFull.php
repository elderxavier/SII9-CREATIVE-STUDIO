

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">	

	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopTextFull(id){			
		$("#popTextFull").popUpShow();	
	
		
		var poptitle = $('#list-items #item'+id+' .title').text();		
		$("#popTextFull #textFullTitle").html('Editar texto '+ (poptitle ? 'de '+ poptitle : '') );		
		if(id){loadTextFull(id)};
		idTextFull = id;
	}	
	
	
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------	
	$(function(){		
		$("#textFullCancelBtn").click(closePopTextFullConfirm);
		$("#textFullSendBtn").click(textFullSave);
		$("#openPopTextIntroBtn").click(function(){openPopTextIntro(idTextFull)});	
	});
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopTextFullConfirm(){
		if(isModifiedFull){
			if (confirm("Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?")){
				closePopTextFull();
			}
		}
		else {
			closePopTextFull();
		}
	}
	
	
	// close pop up
	
	function closePopTextFull(){	
		
		idTextFull = '';
		isModifiedFull = false;	
		$("#textFullForm #Full").val('');
		$('#textEditorFull .uiStatus').html('');
		$("#textFullTitle").html('');	
		$("#popTextFull #openPopTextIntroBtn").show();	

		$("#popTextFull").popUpHide();
	}

</script>

	<div id="popTextFull" class="uiPopUp textFullEditor draggable" style="display:none;" >
		
		<h1 id="textFullTitle" class="uiBoxTitle">Editar Texto</h1>		
		
		<div class="uiPopContent">					
			<div class="uiPopHolder">
		
				<?php if(@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor'){echo '<div id="openPopTextIntroBtn" class="uiButton">Texto de introdução</div>' ;} ?>
		
								
				<?php 
					$txtFullParams['uniqid']   = "Full";	
					$txtFullParams['datatype'] = @$_PARAM['datatype'];
					$txtFullParams['toolbar']  = @$_PARAM['toolbar'];	
					$txtFullParams['intro']    = @$_PARAM['intro'];	
					NWD::insertAdmModule('text_editor', $txtFullParams); 
				?>
				
			</div>			
			
		</div>
		<div class="uiBoxBottom">
			<button id="textFullCancelBtn" class="uiButton">Fechar</button>
			<button id="textFullSendBtn" class="uiButtonConfirm">Salvar</button>
		</div>
		
		<?php if(@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor'){include('content/texteditor/popTextIntro.php');} ?>
		
	</div>
	