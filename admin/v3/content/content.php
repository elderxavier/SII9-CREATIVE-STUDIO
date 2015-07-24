
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<?php 

	$parent 			= @$_PARAM['parent'];
	$catid				= @$_PARAM['catid'] ? $_PARAM['catid'] : @$urlvars[2];	
	$editor 			= @$_PARAM['editor'] === 'false' ? false : true;
	$orderbyInit		= @$_PARAM['orderby'] ? $_PARAM['orderby'] : (@$_PARAM['date'] == 'true' ? 'data_desc' : 'pos_asc');
	
	$_PARAM['datatype'] = 'cont'; 

	$cat 	 = mysql_fetch_assoc(mysql_query("SELECT * FROM categorias WHERE id = '".($catid?$catid:$parent)."' AND ativo = '1' LIMIT 1"));
	$catitle = $cat['titulo'];
?>
  
<script type="text/javascript">

	var initItem;
	var calls = 0;
	var buscaItemLocked = false;
	
	$(function(){		
		
		var dataHolder	= $("#list-items");
		
		// init - reload
		initItem = function(){
			dataHolder.html('');
			calls = 0;
			buscaItemLocked = false;
			buscaItem();
			
			return false;
		}		
		
		
		function buscaItem(){
		
			if(!buscaItemLocked){
				
				buscaItemLocked = true;
				
				$('.contentLoader').fadeIn();
			
				var orderby = $("#filter #orderby").val();
				orderby = orderby ? orderby : "<?=$orderbyInit?>";

				$.ajax({
					type: 'post',
					data : {'act'	 	 : 'Listar',
							'parent' 	 : '<?=$parent?>',
							'catid' 	 : $("#filter #catid").val(),
							'searchword' : $("#filter #searchword").val(),
							'status' 	 : $("#filter #status").val(),							
							'dataini'	 : $("#filter #dataIni").val(), 
							'datafin'	 : $("#filter #dataFin").val(), 
							'order'	 	 : orderby, 
							'calls'	 	 : calls
						   },
					url: _fullpath +'/data/Content.php',	
					dataType: 'json',
					success: function(data) {
						//alert(data);
						calls++;				
				
						$('.contentLoader').fadeOut();
				
						var listLength = data.length;
					
						if(listLength > 0){
							
							var i = 0;
							function addItem(){
								
								dataHolder.append(data[i].item).children().fadeIn();
							
								i++; 
								if(i < listLength){										
									setTimeout(addItem,30);										
								}
								else {
									buscaItemLocked = false;
								}
							}
							addItem();							
						}
						
						if(listLength < <?=$cfig['query list limit']?>){ 
							$('#itemExpandBtn').fadeOut();
							buscaItemLocked = true;
						}
						else {
							$('#itemExpandBtn').fadeIn();
						}
			
					},
					error: function() {						
						$('.contentLoader').fadeOut();
						buscaItemLocked = false;
						alert('<?=$cfig['query timeout']?>');
					}
				});
			}
		}
		
		initItem();	
		
		
		$('#itemExpandBtn').click(buscaItem);
		$("#filter").submit(initItem);
		
	});


	<?php if($editor == true): ?>	
	function selectPopEditor(id){		
		openPopTextFull(id);
	}
	<?php endif; ?>
	<?php if($editor == false && (@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor')): ?>
	function selectPopEditor(id){		
		openPopTextIntro(id);
	}
	<?php endif; ?>
	
	
	var publicarLocked = false;
	
	function publicarItem(id){	

		if(!publicarLocked){
		
			publicarLocked = true;
			
			var state = $('#list-items #item'+id).hasClass('disabled') ? '1' : '0';
			
			$.ajax({
				type: 'post',
				data: {
					'act'	: 'Publicar',
					'id'	: id,
					'state'	: state,
				},
				url: _fullpath +'/data/Content.php',
				dataType: 'json',
				success: function(data){					
					if(data.class){
						$('#list-items #item'+id).removeClass().addClass('item '+data.class);
					}
					publicarLocked = false;			
				},
				error: function(){
					publicarLocked = false;	
				}
			});			
		}

	}

</script>
<?php if(empty($_PARAM['imgintro'])){echo '<style type="text/css">.uiList .thumb {display: none;}</style>';} ?>
<?php if($editor == false && @$_PARAM['intro'] != 'textarea' && @$_PARAM['intro'] != 'minieditor'){echo '<style type="text/css">.uiList .actions .moreItensBtn.text {display: none;}</style>';} ?>
<?php if(empty($_PARAM['imgvalues'])){echo '<style type="text/css">.uiList .actions .moreItensBtn.imagens {display: none;}</style>';} ?>

<div id="content" class="page-content">

	<h1 class="contentheader"><?=$catitle?></h1>
	
	<?php include('content/content/modFilter.php'); ?>
	
	<?php if(@$_PARAM['new'] == 'true'): ?><button id="addNewItemBtn" class="uiAddButton" onclick="openPopAddItem()">Adicionar Item</button><?php endif; ?>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList">
	</ul>
	
	<div id="after-list">
		<a href="javascript:;" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	
	<?php include('content/content/popAddItem.php'); ?>	
	<?php include('content/content/popDelItem.php'); ?>
	<?php if(@$_PARAM['imgintro']){include('content/content/popIntroImage.php');} ?>
	<?php if($editor == true){include('content/texteditor/popTextFull.php');} ?>
	<?php if(@$_PARAM['imgvalues']){include('modules/imagens_multiupload/popEnviaImagens.php');} ?>
	<?php if($editor == false && (@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor')){include('content/texteditor/popTextIntro.php');} ?>


</div>