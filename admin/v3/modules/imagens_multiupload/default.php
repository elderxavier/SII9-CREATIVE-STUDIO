<?php	

	$uniqid		= @$params['uniqid'];
	$catid		= @$params['catid'];									// id do item ou categoria do album
	$datatype	= @$params['datatype'] ? $params['datatype'] : 'img';	// img | cont
	$imgvalues 	= $params['imgvalues'];
	
?>

<link href="<?=$moduleUrl?>/css/fileUploader.css" rel="stylesheet" type="text/css"/>
<link href="<?=$moduleUrl?>/css/imagens_multiupload.css" rel="stylesheet" type="text/css"/>
<!-- <script src="<?//=$moduleUrl?>/js/jquery-ui-1.10.3.custom.min.js" type="text/javascript"></script>-->
<script src="<?=$moduleUrl?>/js/jquery.fileUploader.js" type="text/javascript"></script>


<script type="text/javascript">

	var catidImgm<?=$uniqid?> = '';
	
	<?php if($catid): ?>
		$(function(){
			catidImgm<?=$uniqid?> = '<?=$catid?>';
			loadImgm<?=$uniqid?>();
		});
	<?php endif; ?>

	
	
	//-------------------------------------------------------------------------------
	//	CARREGA THUMBS IMAGENS
	//-------------------------------------------------------------------------------
	function loadImgm<?=$uniqid?>(){
	
		$.ajax({
			type : 'post',
			data : { 'act' : 'Listar',
					 'datatype' : '<?=$datatype?>',
					 'catid' : catidImgm<?=$uniqid?>
			},
			url : '<?=$moduleUrl?>/data/Imagens.multi.php',
			timeout : 5000,
			success : function(data){
			
				$("#imagens_multiupload<?=$uniqid?> .list-img-holder").html(data);
			},
			error : function(){
				alert('<?=$cfig['query timeout']?>');
			}
		});	
	}
	
	//-------------------------------------------------------------------------------
	//	EXCLUI IMAGEM
	//-------------------------------------------------------------------------------
	function excluiImgmImage(idImagem){
		
		$.ajax({
			type : 'post',
			data : { 'act' : 'Excluir',
					 'datatype' : '<?=$datatype?>',
					 'idImagem' : idImagem
			},
			url : '<?=$moduleUrl?>/data/Imagens.multi.php',
			timeout : 3000,
			success : function(data){				
				if(data == true){
					$('#imagens_multiupload<?=$uniqid?> .list-img-holder #item-'+ idImagem).fadeOut(function(){$(this).remove()});				
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
	var publicarImgmLocked<?=$uniqid?> = false;
	
	function publicarImgm(id){	
	
		if(!publicarImgmLocked<?=$uniqid?>){
		
			publicarImgmLocked<?=$uniqid?> = true;
			
			var value = $('#imagens_multiupload<?=$uniqid?> .list-img-holder #item-'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Publicar',
					'id': id,
					'value': value
				},
				url: '<?=$moduleUrl?>/data/Imagens.multi.php',
				timeout: 3000,
				success: function(data){
				
					$('#imagens_multiupload<?=$uniqid?> .list-img-holder #item-'+id).removeClass('disabled enabled').addClass(data);

					publicarImgmLocked<?=$uniqid?> = false;			
				},
				error: function(){
					publicarImgmLocked<?=$uniqid?> = false;	
				}
			});			
		}		
	}
	
	
	//------------------------------------------------------------------------------------------
	// SALVAR POSIÇÕES
	//------------------------------------------------------------------------------------------
	var posImgmLocked<?=$uniqid?> = false;
	
	function savePositionImgm<?=$uniqid?>(e){	
		 
		//var _target = $(e.target);

		if(!posImgmLocked<?=$uniqid?>){
		
			posImgmLocked<?=$uniqid?> = true;
			
			var i = 0;
			var itemsLista = '';
			
			$('#imagens_multiupload<?=$uniqid?> .list-img-holder .data-item').each(function(){
               if(i>0){itemsLista += ','}i++;
			   itemsLista += $(this).attr('data-cod');			
            }); 
			
			//alert(itemsLista);			
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Save Pos',
					'itemsLista': itemsLista
				},
				url: '<?=$moduleUrl?>/data/Imagens.multi.php',
				timeout: 5000,
				success: function(data){				
					//alert(data);
					$(e.target).addClass(data);
					setTimeout(function(){
						$(e.target).removeClass(data);
						posImgmLocked<?=$uniqid?> = false;
					}, 3000);
				},
				error: function(){					
					alert('<?=$cfig['query timeout']?>');
					posImgmLocked<?=$uniqid?> = false;
				}
			});	
			
		}		
	}

	
	//-------------------------------------------------------------------------------
	//	BOTOES DE UPLOAD
	//-------------------------------------------------------------------------------	
	function selectImgm<?=$uniqid?>(){	
		$('#px-add-imagens<?=$uniqid?>').click();
	}	
	function startUploadImgm<?=$uniqid?>(){		
		$('#imagens_multiupload<?=$uniqid?> #px-submit').click();
	}
	function clearUploadImgm<?=$uniqid?>(){		
		$('#imagens_multiupload<?=$uniqid?> #px-clear').click();
	}
		
</script>


<div id="imagens_multiupload<?=$uniqid?>" class="imagens_multiupload">	

	<div class="list-img-holder sortable"></div>
	
	<form id="formUploadImages" action="<?=$moduleUrl?>/data/Imagens.multi.php" method="post" enctype="multipart/form-data">
		<input id="px-add-imagens<?=$uniqid?>" type="file" name="imagens" class="imageUpload" style="display:none" multiple>
		<input type="hidden" name="catid" id="catid" value="<?=$catid?>"/>
		<input type="hidden" name="datatype" value="<?=$datatype?>"/>
		<input type="hidden" name="imgvalues" value="<?=$imgvalues?>"/>
		<input type="hidden" name="act" id="act" value="Cadastrar"/>
		
		<button id="px-submit" type="submit" style="display:none">Enviar</button> <!-- acionado pelos botões abaixo -->
		<button id="px-clear" type="reset" style="display:none">Limpar</button>   <!-- acionado pelos botões abaixo -->
	</form>
	
	<script type="text/javascript">
		jQuery(function($){
			$('.imageUpload').fileUploader({
				'afterEachUpload' : loadImgm<?=$uniqid?>
			}); 
		});
	</script>
	
	<!--
	<div class="multi-upload-actions">	
		<button id="selectBtn" onclick="selectImages()" class="add-arquivos-btn" >Adicionar Arquivos</button>
		<button id="sendBtn" onclick="startUploadImages()" class="send-arquivos-btn" >Enviar</button>
	</div>
	-->
	
	<?php include('popEditImagem.php'); ?>
	
</div>
