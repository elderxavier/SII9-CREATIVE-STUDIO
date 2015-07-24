
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


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
							'categ' : '<?=$_PARAM['categ']?>',
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
						alert('Tempo de resposta esgotado! Tente novamente.');
					}
				});
			}
		}
		
		initItem();	
		
		$('#itemExpandBtn').click(buscaItem);		
		
		
	});
	
	
	var publicarLocked = false;
	
	function publicarItem(id){	
	alert(id);
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
					if(data == 'enabled'){
						$('#list-items #item'+id).removeClass('disabled').addClass('enabled');
					}
					if(data == 'disabled'){
						$('#list-items #item'+id).addClass('disabled').removeClass('enabled');
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
	
	<h1 class="contentheader">Items </h1>
	
	<button id="addNewItemBtn" class="uiAddButton">Adicionar Item</button>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList">
	
	</ul>
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	<?php include('content/imagens/popEditItem.php'); ?>
	<?php include('content/imagens/popAddItem.php'); ?>
	<?php include('content/imagens/popDelItem.php'); ?>
</div>
