
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		
		$("#popAddItem").popUpShow();
		
		if(id){loadToEdit(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$('#popAddItem #titulo').html('Editar Categoria');
		$('#popAddItem #act').val('Save Edit');		
		$('#popAddItem #idItem').val(id);		
		
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Categorias.php",	
			dataType: 'json',
			success: function(data) {			
				
				$('#popAddItem #pos').val(data.pos);
				$('#popAddItem #title').val(data.title);
				$('#popAddItem #alias').val(data.alias);
				//$('#popAddItem #desc').val(data.desc);				

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
	function startUploadItem(){ 		

		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$("#popAddItem #formArquivo").submit();
	}		
	
	//	AO FINALIZAR O UPLOAD	
	function finishUploadItem(result){ 		
	
		if (result == true){
			$("#addItemStatus").html('<span class="success">Os dados foram gravados com sucesso!</span>');
			document.forms["formArquivo"].reset();
			setTimeout(closePopAddItem,1000);
			initItem();
		}
		else{
			$("#addItemStatus").html(result);
		}
		
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){		
		$('#popAddItem #addItemCancel').click(closePopAddItem);
		$('#popAddItem #addItemSend').click(startUploadItem);
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
		$('#popAddItem #addItemStatus').html('');
		$('#popAddItem #titulo').html('Cadastrar nova Categoria');		
		$('#popAddItem #act').val('Add Item');
		$('#popAddItem #idItem').val('');
		
		$("#popAddItem").popUpHide();			
	}
	

</script>

	<div id="popAddItem" class="uiPopUp half draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar nova Categoria</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formArquivo" action="<?=_fullpath?>/data/Categorias.php"  target="upload_target" method="post" enctype="multipart/form-data">
	
					<div class="form-item">
						<label>Pos:</label>
						<input name="pos" id="pos" type="text" class="pos" value="1">
					</div>
					
					<?php if(!empty($_PARAM['imgcat'.$sub])): ?>
					<div class="form-item">
						<label>Imagem:</label>
						<input type="file" id="file" name="file" >
					</div>	
					<?php endif; ?>
					

					<div class="form-item">
						<label>Título:</label>
						<input name="title" id="title" type="text">
					</div>
					<input type="hidden" name="act" id="act" value="Add Item"/>
					<input type="hidden" name="imgcat" value="<?=@$_PARAM['imgcat'.$sub]?>"/>
					<input type="hidden" name="parent" value="<?=$parent?>"/>
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