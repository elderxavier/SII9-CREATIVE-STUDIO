
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<?php
   
   $parent   = @$urlvars[2] ? $urlvars[2] : $_PARAM['parent'];   
   $sub 	 = @$urlvars[3] ? $urlvars[3] : '';
   $introcat = @$_PARAM['introcat'.$sub];
   $_PARAM['type'] 	   = @$_PARAM['type'] ? $_PARAM['type'] : 'categorias';

   $_PARAM['datatype'] = 'categ'; 	
  
   
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
		}		
		
		
		function buscaItem(){
		
			if(!buscaItemLocked){
				
				buscaItemLocked = true;
				
				$('.contentLoader').show();
			
				$.ajax({
					type: 'post',
					data : {'act'	 : 'Listar',
							'parent' : '<?=$parent?>',
							'type'	 : '<?=$_PARAM['type'.$sub]?>',
							'calls'	 : calls
						   },
					url: _fullpath +'/data/Categorias.php',	
					dataType: 'json',
					success: function(data) {
						
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
						alert('Tempo de resposta esgotado! Tente novamente.');
					}
				});
			}
		}
		
		initItem();	
		
		$('#itemExpandBtn').click(buscaItem);		
		
	});


	<?php if($introcat == 'editor'): ?>	
	function selectPopEditor(id){		
		openPopTextFull(id);
	}
	<?php endif; ?>
	<?php if($introcat == 'minieditor'): ?>
	function selectPopEditor(id){		
		openPopTextIntro(id);
	}
	<?php endif; ?>
	
	
	var publicarLocked = false;
	
	function publicarItem(id){	

		if(!publicarLocked){
		
			publicarLocked = true;
			
			var state = $('#list-items #item'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act'	: 'Publicar',
					'id'	: id,
					'state'	: state,
					'type'	: '<?=$_PARAM['type'.$sub]?>'
				},
				url: _fullpath +'/data/Categorias.php',
				success: function(data){				
					
					$('#list-items #item'+id).removeClass().addClass('item '+data);

					publicarLocked = false;			
				},
				error: function(){
					publicarLocked = false;	
				}
			});			
		}		
	}

	function gotoMoreItens(id){
		
		<?php 
		if($_PARAM['type'.$sub] == 'imagens_multi'){
			$_PARAM['datatype'] = 'img'; 
			echo 'openPopEnviaImagens(id);';		
		}
		else{	
			$subincremented = ($_PARAM['type'.$sub] == 'categorias' ? $sub+1 : '');			
			
			echo 'var url = "'._fullpath.'/'.$urlvars[0].'/'.$_PARAM['type'.$sub].'/"+id+"/'.$subincremented.'";';
			echo 'window.location.href = url;';
		}
		?>
	}

</script>


<?php if(empty($_PARAM['imgcat'.$sub])){ echo '<style>#list-items .thumb{display:none;}</style>'; } ?>
<?php if(empty($_PARAM['catnew'.$sub]) == 'true'){ echo '<style>#addNewItemBtn, #list-items .item .deleteBtn{display:none;}</style>'; } ?>
<?php if(empty($introcat)){echo '<style type="text/css">.uiList .actions .moreItensBtn.text {display: none;}</style>';} ?>

<div id="categorias" class="page-content">
	
	<?php 
		$cat = mysql_fetch_assoc(mysql_query("SELECT titulo FROM categorias WHERE id = '".$parent."' LIMIT 1"));		
		$catitle = $cat['titulo'] ? $cat['titulo'] : ucwords(str_replace(array('-','_','.'), array(' ',' ',' '), $parent));
	?>
	<h1 class="contentheader">Categorias de <?=$catitle?></h1>
	
	<button id="addNewItemBtn" class="uiAddButton" onclick="openPopAddItem()">Adicionar Item</button>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList">
	</ul>
	
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	
	<?php include('content/categorias/popAddItem.php'); ?>
	<?php if(@$_PARAM['catnew'.$sub] == 'true'){ include('content/categorias/popDelItem.php'); } ?>
	<?php if($_PARAM['type'.$sub] == 'imagens_multi'){ include('modules/imagens_multiupload/popEnviaImagens.php'); } ?>
	<?php if($introcat == 'editor'){include('content/texteditor/popTextFull.php');} ?>
	<?php if($introcat == 'minieditor'){ $_PARAM['intro'] = $introcat; include('content/texteditor/popTextIntro.php'); }?>
</div>