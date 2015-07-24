
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		
		$("#popAddImagem").popUpShow();
		
		if(id){loadToEdit(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$('#popAddImagem #titulo').html('Editar Imagem');
		$('#popAddImagem #act').val('Save Edit');		
		$('#popAddImagem #idItem').val(id);		
		
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Imagens.php",	
			dataType: 'json',
			success: function(data) {			
				
				$('#popAddImagem #pos').val(data.pos);
				$('#popAddImagem #url').val(data.url);
				$('#popAddImagem #nome').val(data.nome);
				$('#popAddImagem #desc').val(data.desc);
				$('#popAddImagem #preco').val(data.preco);				

				$("#addItemStatus").html('');			
			},
			error: function() {						
				$("#addItemStatus").html('Tempo de resposta esgotado! Tente novamente.');
			}
		});
	}
	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE NEW ITEM
	//------------------------------------------------------------------------------------------

	//	AO INICIAR O UPLOAD
	function startUploadImagem(){ 		

		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$("#popAddImagem #formArquivo").submit();
	}		
	
	//	AO FINALIZAR O UPLOAD	
	function finishUploadImagem(result){ 		
	
		if (result == true){			
			var idItem = $('#popAddImagem #idItem').val();
			if(idItem){
				$('#list-items #item'+idItem+' .title').html( $('#popAddImagem #nome').val() );	
			}
			else {
				initItem();
			}
			idItem = '';
			closePopAddItem();
		}
		else{
			$("#fotoPerfilStatus").html(result);
		}
		
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){		
		$('#popAddImagem #addItemCancel').click(closePopAddItem);
		$('#popAddImagem #addItemSend').click(startUploadImagem);
	})
	
	// botões de edição
	$(function(){
		$('#popAddImagem #editItemCancel').click(closePopAddItem);
		$('#popAddImagem #editItemSend').click(startUploadImagem);
	})

	function titleMouseEnter(id){
		$('#item'+id+' .editBtn').css({'display':'block'});
	}
	function titleMouseLeave(id){
		$('#item'+id+' .editBtn').css({'display':'none'});
	}
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closePopAddItem(){
		document.forms["formArquivo"].reset();
		$('#popAddImagem #addItemStatus').html('');
		$('#popAddImagem #titulo').html('Cadastrar nova Imagem');		
		$('#popAddImagem #act').val('Add Item');
		$('#popAddImagem #idItem').val('');
		$("#popAddImagem").popUpHide();			
	}
	

</script>

	<div id="popAddImagem" class="uiPopUp half draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar nova Imagem</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formArquivo" action="<?=_fullpath?>/data/Imagens.php" target="upload_target" method="post" enctype="multipart/form-data">
	
					<div class="form-item">
						<label>Pos:</label>
						<input name="pos" id="pos" type="text" class="pos" value="1">
					</div>
					<div class="form-item">
						<label>Arquivo:</label>
						<input type="file" id="file" name="file" >
							<span class="uiHelper tooltip" title="<?=NWD::helpImages($_PARAM['imgvalues'])?>"></span>
					</div>					
					
					<?php if(@$_PARAM['url'] == 'true'): ?>					
					<div class="form-item">
						<label>Url:</label>
						<input type="text" name="url" id="url" value="http://">
					</div>
					<?php endif; ?>
					
					<?php if(@$_PARAM['title'] == 'true'): ?>					
					<div class="form-item">
						<label>Título:</label>
						<input name="nome" id="nome" type="text">
					</div>
					<?php endif; ?>
			
					<!-- DESC -->
					<?php if(@$_PARAM['desc'] == 'text'): ?>
					<div class="form-item">
						<label>Descrição:</label>
						<input name="desc" id="desc" type="text">
					</div>
					<?php endif; ?>
					
					<?php if(@$_PARAM['desc'] == 'textarea'): ?>
					<div class="form-item">
						<label>Descrição:</label>
						<textarea name="desc" id="desc"></textarea>
                    </div>
					<?php endif; ?>
                
					<?php if(@$_PARAM['desc'] == 'minieditor'): ?>		
					<div class="form-item">
						<label>Descrição:</label>
						<textarea name="desc" id="desc"></textarea>			
						<script type="text/javascript">
							var editor = CKEDITOR.replace( 'desc', {
								toolbar 		: 'Mini',
								width			: 350,								
								height			: 170,
								resize_minWidth : 200
							});					
						</script>
                    </div>
					<?php endif; ?>
					
					
					<?php if(@$_PARAM['preco'] == 'true'): ?>
					<div class="form-item">
						<label>Preço:</label>
						<input name="preco" id="preco" type="text" >
                    </div>
					<?php endif; ?>						
					
					<input type="hidden" name="act" id="act" value="Add Item"/>
					<input type="hidden" name="imgvalues" value="<?=$_PARAM['imgvalues']?>"/>
					<input type="hidden" name="categ" value="<?=$categ?>"/>
					<input type="hidden" name="idItem" id="idItem"/>
				</form>
				<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Cancelar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>