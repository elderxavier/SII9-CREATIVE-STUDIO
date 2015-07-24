

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">
	
	var idIntroText = '';
	var isModifiedintro = false;
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopIntroText(id){			
		$("#popIntroText").popUpShow();
		idIntroText= id;

		loadIntroText(id);
	}
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadIntroText(id){
		
		$('#popIntroText .uiPopLoader').show();
		var divStatus = $('#popIntroText #introTextStatus');
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Usuarios.php",
			data: {
				'act' : 'Load Intro Text',
				'id'  : id,
			},
			dataType: 'json',
			timeout: 3000,
			success: function(data){
				if(data.return == true){			
					divStatus.html('');		
					$("#popIntroText .text-editor #text-content").val(data.content);
				}
				else {
					divStatus.resultStatus({value: data.return});	
				}				
				$('#popIntroText .uiPopLoader').fadeOut();
			},
			error: function(){
				$('#popIntroText .uiPopLoader').fadeOut();		
				alert('<?=$cfig['query timeout']?>');
			}		
		});		
	}	
	
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------	
	function textIntroSave(){			
		
		isModifiedintro = false;
	
		divStatus = $('#popIntroText #introTextStatus');		
		$('#popIntroText .uiPopLoader').show();
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Usuarios.php",
			data: { 
				'act'	  : 'Save Intro Text',
				'id'	  : idIntroText,
				'content' : $("#popIntroText .text-editor #text-content").val()			
			},
			timeout: 3000,
			success: function(data){
				divStatus.resultStatus({value: data, timer: 2000});
				//divStatus.html(data);
				$('#popIntroText .uiPopLoader').hide();
			},
			error: function(){
				divStatus.html('');
				$('#popIntroText .uiPopLoader').hide();
				alert('<?=$cfig['query timeout']?>');				
			}
		});	
	};
		
		
		
	
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------
	
	$(function(){	
		
		$("#introTextCancelBtn").click(closePopIntroTextConfirm);
		$("#introTextSendBtn").click(textIntroSave);
	
	});
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopIntroTextConfirm(){
		if(isModifiedintro){
			if (confirm("Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?")){
				closePopIntroText();
			}
		}
		else {
			closePopIntroText();
		}
	}
	
	
	// close pop up
	
	function closePopIntroText(){
		
		idIntroText = '';
		isModifiedintro = false;		
		$("#popIntroText").popUpHide();	
			
		$("#popIntroText .text-editor #text-content").val('');
		$('#popIntroText #introTextStatus').html('');
		
	}

</script>

	<div id="popIntroText" class="uiPopUp introText half draggable" style="display:none">
		
		<h1 id="introTextTitle" class="uiBoxTitle">Editar texto de introdução</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">
				
				<div id="introTextStatus" class="uiStatus"></div>
				
				<form id="introtext-form" action="javascript:textIntroSave()">					
					<?php 
						if(@$_PARAM['intro'] == 'minieditor'){
							$pIntroText['uniqid']  = 'intro';
							$pIntroText['toolbar'] = @$_PARAM['toolbar'] ? $_PARAM['toolbar'] : 'Mini'; 	
							$pIntroText['height'] = 170; 						 
							NWD::insertAdmModule('text_editor', $pIntroText);
						}
						
						if(@$_PARAM['intro'] == 'textarea'){							
							echo '<div id="text-editorintro" class="text-editor">';	
							echo '<textarea id="text-content" onchange="isModifiedintro = true"></textarea>';							
							echo '</div>';
						}
					?>
				</form>
				
				<div class="uiPopLoader"></div>
				
			</div>			
			
		</div>
		<div class="uiBoxBottom">
			
			<button id="introTextCancelBtn" class="uiButton">Fechar</button>
			<button id="introTextSendBtn" class="uiButtonConfirm">Salvar</button>
		</div>
	</div>