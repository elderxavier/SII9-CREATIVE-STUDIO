<?php 

	defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	

?>



<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopIntroImage(id){		
		
		$("#popIntroImage").popUpShow();		
		
		if(id){loadIntroImage(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadIntroImage(id){	
	
		$('#popIntroImage .uiPopLoader').show();
		var divStatus = $('#popIntroImage #introImageStatus');
		
		$('#popIntroImage #idItem').val(id);		
		
		$.ajax({
			type: 'post',
			data : {'act' : 'Load Image Intro',
					'id'  : id
					},
			url: _fullpath +"/data/Usuarios.php",	
			timeout: 3000, 
			success: function(data) {			
				//alert(data);
				if(data){
					$('#popIntroImage #thumbPerfil').attr('src', data).load();
				}
				
				$('#popIntroImage .uiPopLoader').hide();				
			},
			error: function() {						
				divStatus.html('');
				$('#popIntroImage .uiPopLoader').hide();
				alert('<?=$cfig['query timeout']?>');
			}
		});
	}
	

	
	//------------------------------------------------------------------------------------------
	// UPLOAD
	//------------------------------------------------------------------------------------------

	//	AO INICIAR O UPLOAD
	function startUploadIntroImage(){ 	
	
		var divStatus = $('#popIntroImage #introImageStatus');
		
		if($("#formIntroImage #arquivo").val() == ""){	
			divStatus.resultStatus({value:'<span class="required">Selecione uma imagem para ser enviada.</span>'});
		}
		else {		
			divStatus.html('<span class="loader">Salvando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');		
			$("#popIntroImage #formIntroImage").submit();
		}
	}		
	
	//	AO FINALIZAR O UPLOAD	
	function finishUploadIntroImage(data){ 		
		
		var divStatus = $('#popIntroImage #introImageStatus');
		
		if (data){		
			var id = $('#popIntroImage #idItem').val();
			$('#popIntroImage #thumbPerfil, #list-items #item'+id+' .thumb').attr('src', data).load();
			
			
			$('#popIntroImage #filelabel').val('');
			$('#popIntroImage #arquivo').val('');
			divStatus.resultStatus({value: '<span class="success">Imagem atualizada com sucesso.</span>'});
			
			
		}
		else{
			divStatus.resultStatus({value: '<span class="error">Houve um erro ao salvar a imagem.</span>'});
		}
		
	}
	
	
	
	
	//------------------------------------------------------------------------------------------
	// DELETE  IMAGEM CONFIRM
	//------------------------------------------------------------------------------------------	
	function removeIntroImageConfirm(){
		if (confirm("Voce tem certeza que deseja excluir esta imagem?")){
			removeIntroImage();
		}
	}	
	
	
	//------------------------------------------------------------------------------------------
	// EXCLUIR IMAGEM
	//------------------------------------------------------------------------------------------
	var removeIntroImageLocked = false;
	
	function removeIntroImage(){	
		
		if(!removeIntroImageLocked){
		
			var id = $('#popIntroImage #idItem').val();
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Remove Image Intro',
					'id': id
				},
				url: _fullpath +"/data/Usuarios.php",
				timeout: 3000,
				success: function(data){
					if(data == true){
						$('#popIntroImage #thumbPerfil, #list-items #item'+id+' .thumb').attr('src', '<?=_fullpath?>/images/no-image.png').load();
					}
					else {
						$('#popIntroImage #introImageStatus').resultStatus({value: data});
					}
					
					removeIntroImageLocked = false;			
				},
				error: function(){
					removeIntroImageLocked = false;
					divStatus.html('');
					alert('<?=$cfig['query timeout']?>');
				}
			})		
		}		
	}
	
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){		
		$('#popIntroImage #introImageCancel').click(closePopIntroImage);
		$('#popIntroImage #introImageSend').click(startUploadIntroImage);
		$('#popIntroImage #removeIntroImageBtn').click(removeIntroImageConfirm);
		
		// exibe o botão delete
		$('#popIntroImage .thumbheadding').mouseenter(function(){
			$(this).find('.uiDelMiniButton').css({'display':'block'});
		}).mouseleave(function(){
			$(this).find('.uiDelMiniButton').css({'display':'none'});
		});
		
	})	
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closePopIntroImage(){
		$('#popIntroImage #thumbPerfil').attr('src', '<?=_fullpath?>/images/no-image.png').load();
		$('#popIntroImage #introImageStatus').html('');		
		$('#popIntroImage #filelabel').val('');
		$('#popIntroImage #arquivo').val('');
		$('#popIntroImage #idItem').val('');
		
		$("#popIntroImage").popUpHide();	
	}
	

</script>

	<div id="popIntroImage" class="uiPopUp half addIntroImage draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar nova foto de Perfil</h1>
		
		<div class="uiPopContent">		
			<div class="uiPopHolder">

				<div id="introImageStatus" class="uiStatus"></div>					
				
				<div class="thumbheadding">
					<div id="removeIntroImageBtn" class="uiDelMiniButton" style="display:none"></div>
					<img src="<?=_fullpath?>/images/no-image.png" id="thumbPerfil" />				
				</div>				
				
				<form id="formIntroImage" action="<?=_fullpath?>/data/Usuarios.php" target="upload_target" method="post" enctype="multipart/form-data">
					<div class="fakefile" class="form-item" >						
						<input type="file" name="arquivo" id="arquivo" onchange="this.form.filelabel.value = this.value;"/>
						<div id="filebutton" class="uiAddButton" >Selecionar foto</div>						
						<input type="text" id="filelabel" disabled="disabled"/>																
					</div>
					
					<input type="hidden" name="idItem" id="idItem" />
					<input type="hidden" name="imgvalues" id="imgvalues" value="<?=$_PARAM['imgintro']?>" />
					<input type="hidden" name="act" value="Save Image Intro"/>
				</form>
				<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>
			
				<div class="uiPopLoader"></div>
				
			</div>
			
			<div class="uiBoxBottom">
				<button id="introImageCancel" class="uiButton">Fechar</button>
				<button id="introImageSend" class="uiButtonConfirm">Enviar</button>
			</div>
			
		</div>
	</div>