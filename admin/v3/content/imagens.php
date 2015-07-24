
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<?php

   
   $categ = @$urlvars[2] ? $urlvars[2] : $_PARAM['categ'];
   
?>  
   
<script type="text/javascript">

	var onChangeSelect;
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
					data : {'act'		: 'Listar',
							'categ' : '<?=$categ?>',
							'calls'		: calls
						   },
					url: _fullpath +'/data/Imagens.php',	
					dataType: 'json',
					timeout: 3000, 
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
						alert('<?=$cfig['query timeout']?>');
					}
				});
			}
		}
		
		initItem();	
		
		$('#itemExpandBtn').click(buscaItem);		
		
	});
	
	
	var publicarLocked = false;
	
	function publicarItem(id){	

		if(!publicarLocked){
		
			publicarLocked = true;
			
			var value = $('#list-items #item'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Publicar',
					'id': id,
					'value': value
				},
				url: _fullpath +'/data/Imagens.php',
				timeout: 3000,
				success: function(data){
					if(data){
						$('#list-items #item'+id).removeClass().addClass('item '+data);
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


<div id="imagens" class="page-content">
	
	<?php 
		$cat = @ mysql_fetch_assoc(mysql_query("SELECT titulo FROM categorias WHERE id = '".$categ."' AND ativo = '1' LIMIT 1"));		
		$catitle = $cat['titulo'] ? $cat['titulo'] : ucwords(str_replace(array('-','_','.'), array(' ',' ',' '), $categ));
	?>
	<h1 class="contentheader">Imagens de <?=$catitle?></h1>
	
	<button id="addNewItemBtn" class="uiAddButton" onclick="openPopAddItem()">Adicionar Item</button>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList">
	</ul>
	
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	<?php include('content/imagens/popAddItem.php'); ?>
	<?php include('content/imagens/popDelItem.php'); ?>
</div>
