

<script type="text/javascript">
	
	//-------------------------------------------------------------------------------------------
	//	ABRE POP UP E CARREGA DADOS
	//-------------------------------------------------------------------------------------------
	function openPopImgmEdit(id){		
		$("#popImgmEdit").popUpShow();		
		$("##form-image-info #idImagem").val(id);
		
		loadImgmToEdit(id);
	}
	
	function loadImgmToEdit(id){
	
		$('#popImgmEdit .uiPopLoader').fadeIn();
		
		$.ajax({
			type : 'post',
			data : { 'act' : 'Load to Edit',
					 'idImagem' : id
			},
			url      : '<?=$moduleUrl?>/data/Imagens.multi.php',
			dataType : 'json',
			timeout  : 5000,			
			success  : function(data){					
				$("#popImgmEdit #url").val(data.url);				
				$("#popImgmEdit #nome").val(data.nome);
				$("#popImgmEdit #text-contentDesc").val(data.desc);
				
				$('#popImgmEdit .uiPopLoader').fadeOut();
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
				$('#popImgmEdit .uiPopLoader').fadeOut();
			}
		});	
		
		
		//----------------------------------------------------------------
		// Ações dos botões
		//----------------------------------------------------------------		
		$("#popImgmEdit #closeEditImgBtn").click(closePopEditImagem);
		$("#popImgmEdit #saveEditImgBtn").click(saveEditImagem);
	}
	
	
	//-------------------------------------------------------------------------------------------
	//	SALVAR EDIÇÃO
	//-------------------------------------------------------------------------------------------
	function saveEditImagem(){
		
		$('#popImgmEdit .uiPopLoader').fadeIn();
		$("#popImgmEdit .uiStatus").html('');		
		
		$.ajax({
			type : 'post',
			data : { 'act' 		: 'Salvar Edicao',
					 'idImagem' : $("#form-image-info #idImagem").val(),
					 'nome' 	: $("#form-image-info #nome").val(),
					 'url' 		: $("#form-image-info #url").val(),
					 'desc' 	: $("#form-image-info #text-contentDesc").val()
			},
			url      : '<?=$moduleUrl?>/data/Imagens.multi.php',
			timeout  : 3000,			
			success  : function(data){					
				if(data == true){
					$("#popImgmEdit .uiStatus").resultStatus({value:'<span class="success">Os dados foram gravados com sucesso.</span>'});
					//closePopEditImagem();
				}
				else {
					$("#popImgmEdit .uiStatus").resultStatus({value:data});					
				}
				$('#popImgmEdit .uiPopLoader').fadeOut();
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
				$('#popImgmEdit .uiPopLoader').fadeOut();
			}
		});	
	}
	
	
	//-------------------------------------------------------------------------------------------
	//	FECHAR POP UP
	//-------------------------------------------------------------------------------------------
	function closePopEditImagem(){		
		isModifiedDesc = false;	
		$("#form-image-info")[0].reset();
		$("#form-image-info #idImagem").val('');		
		$("#form-image-info #text-contentDesc").val('');
		$("#popImgmEdit .uiStatus").html('');
		
		$("#popImgmEdit").popUpHide();
	}	
</script>

<div id="popImgmEdit" class="uiPopUp half popImgmEdit draggable" style="display:none">
	
	<h1 class="uiBoxTitle">Editar informações da Imagem</h1>	

	<div class="uiPopContent">		
		<div class="uiPopHolder">
			<div class="uiStatus"></div>
			<form id="form-image-info">					
				
					<div class="form-item">
						<label>Nome:</label>
						<input type="text" id="nome" name="nome"/>
					</div>				
					<div class="form-item">
						<label>Url:</label>
						<input type="text" id="url" name="url"/>
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
				<input type="hidden" id="idImagem" name="idImagem" />
			</form>
		</div>		
		<div class="uiBoxBottom">	
			<button id="closeEditImgBtn" class="uiButton" >Fechar</button>				
			<button id="saveEditImgBtn" class="uiButtonConfirm" >Salvar</button>
		</div>
		<div class="uiPopLoader"></div>				
	</div>
</div>
