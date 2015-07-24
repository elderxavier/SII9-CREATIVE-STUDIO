

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>


<script type="text/javascript">
	
	var idTextEdit = '';

	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopTextEditor(id){			
		$("#popTextEditor").popUpShow();	
	
		$("#popTextEditor #texEditorTitle").html('Editar texto de '+ $('#list-items #item'+id+' .title').text());		
		if(id){loadTextToEdit(id)};
		idTextEdit = id;		
	}
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadTextToEdit(id){
	
		$('#popTextEditor .uiPopLoader').show();
		var divStatus = $('#popTextEditor #textEditorStatus');
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Usuarios.php",
			data: {
				'act' : 'Load Text',
				'id'  : id
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
		$('#popTextEditor .uiPopLoader').show();
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/data/Usuarios.php",
			data: { 
				'act'	  : 'Save Text',
				'id'	  : idTextEdit,
				'intro'	  : '<?=@$_PARAM['intro']?>',
				'content' : $("#popTextEditor .text-editor #text-content").val()			
			},
			timeout: 3000,
			success: function(data){
				divStatus.resultStatus({value: data});
				$('#popTextEditor .uiPopLoader').hide();
			},
			error: function(){
				divStatus.html('');
				$('#popTextEditor .uiPopLoader').hide();
				alert('<?=$cfig['query timeout']?>');				
			}
		});		
		
		
	};
		
		
		
	
	//------------------------------------------------------------------------------------------
	// INIT
	//------------------------------------------------------------------------------------------
	
	$(function(){	
		
		$("#textEditCancelBtn").click(closePopTextEditorConfirm);
		$("#textEditSendBtn").click(textEditSave);
		$("#openPopIntroTextBtn").click(function(){openPopIntroText(idTextEdit)});
	
	});
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	
	// confirm 
	
	function closePopTextEditorConfirm(id){
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
		
		idTextEdit = '';
		isModified = false;		
		$("#popTextEditor").popUpHide();
	
		$("#popTextEditor .text-editor #text-content").val('');
		$('#popTextEditor #textEditorStatus').html('');
		$("#popTextEditor #texEditorTitle").html('');
		
	}

</script>

	<div id="popTextEditor" class="uiPopUp textEditor draggable" style="display:none;" >
		
		<h1 id="texEditorTitle" class="uiBoxTitle">Editar Texto</h1>		
		
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
	
	
	<?php if(@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor'){include('content/usuarios/popIntroText.php');} ?>
	
	