
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		$("#popAddVideo").popUpShow();

		$("#popAddVideo #pos").val('1');

		if(id){loadToEdit(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$('#popAddVideo #box-title').html('Editar Video');
		$('#popAddVideo #act').val('Save Edit');		
		$('#popAddVideo #idItem').val(id);				
		
		$.ajax({
			type: 'post',
			data : {'act' : 'Load to Edit',
					'id'  : id
					},
			url: _fullpath +"/data/Videos.php",	
			dataType: 'json',
			//timeout: 3000, 
			success: function(data) {	
				//alert(data);					
				$('#popAddVideo #pos').val(data.pos);
				$('#popAddVideo #titulo').val(data.titulo);
				$('#popAddVideo #videoUrl').val(data.videoUrl);
				$('#popAddVideo #descricao').val(data.descricao);

				if(data.imagem){$("#remove-img-holder").show()}

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
		$("#popAddVideo #formVideos").submit();
	}		
	
	//	AO FINALIZAR O UPLOAD	
	function finishUploadItem(result){ 		
	
		if (result == true){
			$("#addItemStatus").html('<span class="success">Os dados foram gravados com sucesso!</span>');
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
		$('#popAddVideo #addItemCancel').click(closePopAddItem);
		$('#popAddVideo #addItemSend').click(startUploadItem);
	});
	        

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
		document.forms["formVideos"].reset();
		$('#popIntroImage #remove_img').prop('checked',false);
		$("#popAddVideo #descricao").val('');					
		$('#popAddVideo #act').val('Add Item');
		$('#popAddVideo #idItem').val('');			
		$("#remove-img-holder").hide();

		$('#popAddVideo #box-title').html('Cadastrar novo Video');	
		$('#popAddVideo #addItemStatus').html('');
		isModifieddescricao = false;

		$("#popAddVideo").popUpHide();			
	}


	

</script>

	<div id="popAddVideo" class="uiPopUp <?=!$showdesc?'half':''?>" style="display:none">
		
		<h1 id="box-title" class="uiBoxTitle">Cadastrar novo Video</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formVideos" action="<?=_fullpath?>/data/Videos.php" target="upload_target" method="post" enctype="multipart/form-data">

					<div class="col1">	
						<div class="form-item">
							<label>Pos:</label>
							<input name="pos" id="pos" type="text" class="pos">
						</div>				
						<div class="form-item">
							<label>Titulo</label>
							<input type="text" name="titulo" id="titulo">
						</div>

						<?php if($imgvalues): ?>
						<script type="text/javascript">
							$(function(){		
								$("#formVideos #imagem").change(function(){
									if($(this).val() != ''){
										$("#remove-img-holder").slideUp();
									}
									else {
										$("#remove-img-holder").slideDown();
									}
								});
							});	
						</script>
						<div class="form-item">
							<label>Imagem</label>
							<input type="file" name="imagem" id="imagem" >
						</div>
						<div id="remove-img-holder" class="form-item" style="display:none">
							<label></label>
							<input type="checkbox" name="remove_img" id="remove_img" value="1" />
							<label for="remove_img" class="checklabel">Remover imagem atual</label>
						</div>
						<?php endif; ?>						

						<div class="form-item">
							<label>Video</label>
							<input type="text" name="videoUrl" id="videoUrl">
						</div>	
					</div>

					<div class="col2">							
						
						<?php if($showdesc == 'textarea'): ?>
						<div class="form-item">
							<label>Descrição</label>
							<textarea name="descricao" id="descricao"></textarea>
						</div>
						<?php endif; ?>

						<?php if($showdesc == 'minieditor'): ?>		
						<div class="form-item">							
							<?php 						
							$descParams['uniqid'] = 'descricao';
							$descParams['toolbar'] = 'MiniSimpleJustify';
							$descParams['height'] = 175;
							$descParams['ajaxfunc'] = false;
							NWD::insertAdmModule('text_editor',$descParams); 					
							?>
						</div>
						<?php endif; ?>										

					</div>
					
					<input type="hidden" name="act" id="act" value="Add Item"/>	
					<input type="hidden" name="imgvalues" id="imgvalues" value="<?=$imgvalues?>"/>
					<input type="hidden" name="catid" id="catid" value="<?=$catid?>"/>				
					<input type="hidden" name="idItem" id="idItem"/>
				</form>
				<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:none;"></iframe>
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Fechar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>