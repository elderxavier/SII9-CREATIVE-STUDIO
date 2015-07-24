<?php

	$uniqid		= @$params['uniqid'];
	$catid		= @$params['catid'];	
	$arqtypes	= @$params['arqtypes'] ? $params['arqtypes'] : 'jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|pdf|zip|mpeg|flv';	
?>

<link href="<?=$moduleUrl?>/css/fileUploader.css" rel="stylesheet" type="text/css"/>
<link href="<?=$moduleUrl?>/css/arquivos_multiupload.css" rel="stylesheet" type="text/css"/>
<!-- <script src="<?//=$moduleUrl?>/js/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>-->
<script src="<?=$moduleUrl?>/js/jquery.fileUploader.js" type="text/javascript"></script>


<script type="text/javascript">

	var catidArq<?=$uniqid?> = '';
	
	<?php if($catid): ?>
		$(function(){
			loadArq<?=$uniqid?>();
		});
	<?php endif; ?>
	
	
	//-------------------------------------------------------------------------------
	//	LISTA THUMBS ARQUIVOS
	//-------------------------------------------------------------------------------
	function loadArq<?=$uniqid?>(){
	
		$.ajax({
			type : 'post',
			data : { 'act' : 'Listar',
					 'catid' : $("#arquivos_multiuploadList #catid").val()
			},
			url : '<?=$moduleUrl?>/data/Arquivos.multi.php',
			timeout : 5000,
			success : function(data){
			
				$("#arquivos_multiupload<?=$uniqid?> .list-arq-holder").html(data);
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
			}
		});	
	}
	

	//-------------------------------------------------------------------------------
	//	EXCLUI IMAGEM
	//-------------------------------------------------------------------------------
	function excluiArqImage(idArquivo){
		
		$.ajax({
			type : 'post',
			data : { 'act' : 'Excluir',
					 'datatype' : '<?=$datatype?>',
					 'idArquivo' : idArquivo
			},
			url : '<?=$moduleUrl?>/data/Arquivos.multi.php',
			timeout : 3000,
			success : function(data){				
				if(data == true){
					$('#arquivos_multiupload<?=$uniqid?> .list-arq-holder #item-'+ idArquivo).fadeOut(function(){$(this).remove()});				
				}
				else {
					alert(data);
				}
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
			}
		});	
	}
	
	
	//------------------------------------------------------------------------------------------
	// PUBLICAR - DESPUBLICAR IMAGEM
	//------------------------------------------------------------------------------------------
	var publicarArqLocked<?=$uniqid?> = false;
	
	function publicarArq(id){	
	
		if(!publicarArqLocked<?=$uniqid?>){
		
			publicarArqLocked<?=$uniqid?> = true;
			
			var value = $('#arquivos_multiupload<?=$uniqid?> .list-arq-holder #item-'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Publicar',
					'id': id,
					'value': value
				},
				url: '<?=$moduleUrl?>/data/Arquivos.multi.php',
				timeout: 3000,
				success: function(data){
				
					$('#arquivos_multiupload<?=$uniqid?> .list-arq-holder #item-'+id).removeClass('disabled enabled').addClass(data);

					publicarArqLocked<?=$uniqid?> = false;			
				},
				error: function(){
					publicarArqLocked<?=$uniqid?> = false;	
				}
			});			
		}		
	}
	
	
	//------------------------------------------------------------------------------------------
	// SALVAR POSIÇÕES
	//------------------------------------------------------------------------------------------
	var posArqLocked<?=$uniqid?> = false;
	
	function savePositionArq<?=$uniqid?>(e){	

		if(!posArqLocked<?=$uniqid?>){
		
			posArqLocked<?=$uniqid?> = true;
			
			var i = 0;
			var itemsLista = '';
			
			$('#arquivos_multiupload<?=$uniqid?> .list-arq-holder .data-item').each(function(){
               if(i>0){itemsLista += ','}i++;
			   itemsLista += $(this).attr('data-cod');			
            }); 			
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Save Pos',
					'itemsLista': itemsLista
				},
				url: '<?=$moduleUrl?>/data/Arquivos.multi.php',
				timeout: 5000,
				success: function(data){				
					$(e.target).addClass(data);
					setTimeout(function(){
						$(e.target).removeClass(data);
						posArqLocked<?=$uniqid?> = false;
					}, 3000);
				},
				error: function(){					
					alert('<?=$cfig['query timeout']?>');
					posArqLocked<?=$uniqid?> = false;
				}
			});	
			
		}		
	}

	
	//-------------------------------------------------------------------------------
	//	BOTOES DE UPLOAD
	//-------------------------------------------------------------------------------	
	function selectArq<?=$uniqid?>(){	
		$('#px-add-arquivos<?=$uniqid?>').click();
	}	
	function startUploadArq<?=$uniqid?>(){		
		$('#arquivos_multiupload<?=$uniqid?> #px-submit').click();
	}
	function clearUploadArq<?=$uniqid?>(){		
		$('#arquivos_multiupload<?=$uniqid?> #px-clear').click();
	}
		
</script>


<div id="arquivos_multiupload<?=$uniqid?>" class="arquivos_multiupload">	

	<div class="list-arq-holder sortable"></div>
	
	<form id="formUploadArquivos" action="<?=$moduleUrl?>/data/Arquivos.multi.php" method="post" enctype="multipart/form-data">
		<input id="px-add-arquivos<?=$uniqid?>" type="file" name="arquivos" class="fileUpload" style="display:none" multiple>
		<input type="hidden" name="catid" id="catid" value="<?=$catid?>"/>
		<input type="hidden" name="arqtypes" id="arqtypes" value="<?=$arqtypes?>"/>
		<input type="hidden" name="act" id="act" value="Cadastrar"/>
		
		<button id="px-submit" type="submit" style="display:none">Enviar</button> <!-- acionado pelos botões abaixo -->
		<button id="px-clear" type="reset" style="display:none">Limpar</button>   <!-- acionado pelos botões abaixo -->
	</form>
	
	<script type="text/javascript">
		jQuery(function($){
			$('.fileUpload').fileUploader({				
				allowedExtension: '<?=$arqtypes?>',
				afterEachUpload : loadArq<?=$uniqid?>
			}); 
		});
	</script>
	
	<!--
	<div class="multi-upload-actions">	
		<button id="selectBtn" onclick="selectImages()" class="add-arquivos-btn" >Adicionar Arquivos</button>
		<button id="sendBtn" onclick="startUploadImages()" class="send-arquivos-btn" >Enviar</button>
	</div>
	-->
	
	<?php include('popEditArquivo.php'); ?>
	
</div>
