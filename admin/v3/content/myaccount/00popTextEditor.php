

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">

	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopTextEditor(){		
		$("#popTextEditor").popUpShow();		
		loadTextToEdit();
	}
	

	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	/*function loadTextToEdit(){
	
		$('#popTextEditor .uiPopLoader').show();
		var divStatus = $('#popTextEditor #textEditorStatus');
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Myaccount.php",
			data: {
				'act' : 'Load Text'
			},
			dataType: 'json',
			timeout: 3000,
			success: function(data){
				if(data.return == true){								
					divStatus.html('');	
					$("#popTextEditor .text-editor #text-content").val(data.content);
				}
				else {
					divStatus.resultStatus({value: data.return});					
				}				
				$('#popTextEditor .uiPopLoader').fadeOut();
			},
			error: function(){
				$('#popTextEditor .uiPopLoader').fadeOut();		
				alert('<?=$cfig['query timeout']?>');
			}		
		});		
		
	}	
		
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------	
	function textEditSave(){			
		
		isModified = false;
	
		divStatus = $('#popTextEditor #textEditorStatus');		
		divStatus.html('<span class="loader">Salvando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');

		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Myaccount.php",
			data: { 
				'act'	  : 'Save Text',
				'intro'	  : '<?=@$_PARAM['intro']?>',
				'content' : $("#popTextEditor .text-editor #text-content").val()			
			},
			timeout: 3000,
			success: function(data){
				divStatus.resultStatus({value: data});
			},
			error: function(){
				divStatus.html('');
				alert('<?=$cfig['query timeout']?>');				
			}
		});		
		
		
	};
	*/
		
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------
	
	$(function(){	
	
		$("#myaccount #openPopTextEditorBtn").click(openPopTextEditor);
		
		$("#textEditCancelBtn").click(closePopTextEditorConfirm);
		$("#textEditSendBtn").click(textEditSave);		
	
	});
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopTextEditorConfirm(){
		if(isModified){
			if (confirm("Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?")){
				closePopTextEditor();
			}
		}
		else {
			closePopTextEditor();
		}
	}
	
	
	// close pop up
	
	function closePopTextEditor(){
		
		isModified = false;		
		$("#popTextEditor").popUpHide();
				
		$("#popTextEditor .text-editor #text-content").val('');
		$('#popTextEditor #textEditorStatus').html('');
		
	}

</script>

	<div id="popTextEditor" class="uiPopUp textEditor draggable" style="display:none;" >
		
		<h1 id="texEditorTitle" class="uiBoxTitle">Editar texto de apresentação</h1>		
		
		<div class="uiPopContent">					
			<div class="uiPopHolder">
		
				<?php if(@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor'){echo '<div id="openPopIntroTextBtn" class="uiButton">Texto de introdução</div>' ;} ?>
		
				<form id="text-editor-form" action="javascript:textEditSave()">					
					<?php NWD::insertAdmModule('text_editor'); ?>
				</form>
				
				<div class="uiPopLoader"></div>
				
			</div>			
			
		</div>
		<div class="uiBoxBottom">
			<div id="textEditorStatus" class="uiStatus"></div>
			<button id="textEditCancelBtn" class="uiButton">Fechar</button>
			<button id="textEditSendBtn" class="uiButtonConfirm">Salvar</button>
		</div>
	</div>
	
	
	<?php if(@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor'){include('content/myaccount/popIntroText.php');} ?>
	
	