

<script type="text/javascript">
	
	//-------------------------------------------------------------------------------------------
	//	ABRE POP UP E CARREGA DADOS
	//-------------------------------------------------------------------------------------------
	function openPopArqEdit(id){		
		$("#popArqEdit").popUpShow();		
		$("##form-image-info #idArquivo").val(id);
		
		loadArqToEdit(id);
	}
	
	function loadArqToEdit(id){
	
		$('#popArqEdit .uiPopLoader').fadeIn();
		
		$.ajax({
			type : 'post',
			data : { 'act' : 'Load to Edit',
					 'idArquivo' : id
			},
			url      : '<?=$moduleUrl?>/data/Arquivos.multi.php',
			dataType : 'json',
			timeout  : 5000,			
			success  : function(data){							
				$("#popArqEdit #nome").val(data.nome);
				$("#popArqEdit #text-contentDesc").val(data.desc);
				
				$('#popArqEdit .uiPopLoader').fadeOut();
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
				$('#popArqEdit .uiPopLoader').fadeOut();
			}
		});	
		
		
		//----------------------------------------------------------------
		// Ações dos botões
		//----------------------------------------------------------------		
		$("#popArqEdit #closeEditImgBtn").click(closePopEditArquivo);
		$("#popArqEdit #saveEditImgBtn").click(saveEditArquivo);
	}
	
	
	//-------------------------------------------------------------------------------------------
	//	SALVAR EDIÇÃO
	//-------------------------------------------------------------------------------------------
	function saveEditArquivo(){
		
		$('#popArqEdit .uiPopLoader').fadeIn();
		$("#popArqEdit .uiStatus").html('');		
		
		$.ajax({
			type : 'post',
			data : { 'act' 		: 'Salvar Edicao',
					 'idArquivo' : $("#form-image-info #idArquivo").val(),
					 'nome' 	: $("#form-image-info #nome").val(),
					 'desc' 	: $("#form-image-info #text-contentDesc").val()
			},
			url      : '<?=$moduleUrl?>/data/Arquivos.multi.php',
			timeout  : 3000,			
			success  : function(data){					
				if(data == true){
					$("#popArqEdit .uiStatus").resultStatus({value:'<span class="success">Os dados foram gravados com sucesso.</span>'});
					//closePopEditArquivo();
				}
				else {
					$("#popArqEdit .uiStatus").resultStatus({value:data});					
				}
				$('#popArqEdit .uiPopLoader').fadeOut();
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
				$('#popArqEdit .uiPopLoader').fadeOut();
			}
		});	
	}
	
	
	//-------------------------------------------------------------------------------------------
	//	FECHAR POP UP
	//-------------------------------------------------------------------------------------------
	function closePopEditArquivo(){		
		isModifiedDesc = false;	
		$("#form-image-info")[0].reset();
		$("#form-image-info #idArquivo").val('');		
		$("#form-image-info #text-contentDesc").val('');
		$("#popArqEdit .uiStatus").html('');
		
		$("#popArqEdit").popUpHide();
	}	
</script>

<div id="popArqEdit" class="uiPopUp half popArqEdit draggable" style="display:none">
	
	<h1 class="uiBoxTitle">Editar informações da Arquivo</h1>	

	<div class="uiPopContent">		
		<div class="uiPopHolder">
			<div class="uiStatus"></div>
			<form id="form-image-info">					
				
				<div class="form-item">
					<label>Nome:</label>
					<input type="text" id="nome" name="nome"/>
				</div>		
								
				<div class="form-item">
					<label for="descricao">Descrição</label>
					<?php 						
						$descParams['uniqid'] = 'Desc';
						$descParams['toolbar'] = 'MiniSimpleJustify';
						$descParams['height'] = 170;
						$descParams['ajaxfunc'] = false;
						NWD::insertAdmModule('text_editor',$descParams); 					
					?>
					<!-- <textarea id="descricao"></textarea> -->
				</div>	
				<input type="hidden" id="idArquivo" name="idArquivo" />
			</form>
		</div>		
		<div class="uiBoxBottom">	
			<button id="closeEditImgBtn" class="uiButton" >Fechar</button>				
			<button id="saveEditImgBtn" class="uiButtonConfirm" >Salvar</button>
		</div>
		<div class="uiPopLoader"></div>				
	</div>
</div>
