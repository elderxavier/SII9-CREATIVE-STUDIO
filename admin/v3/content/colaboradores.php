
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
				
				$('.contentLoader').fadeIn();
			
				$.ajax({
					type: 'post',
					data : {'act'		: 'Listar',
							'state'		: $('#filter input[name="state"]:checked').val(),
							'calls'		: calls
						   },
					url: _fullpath +'/data/Colaboradores.php',	
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
		$('#filter input[name="state"]').change(initItem);
		
	});	
	
	
	
	function abrirSB(title, url){ 		
		Shadowbox.open({player: 'img', title: title, content: url}); 
	};

</script>


<div id="colaboradores" class="page-content">
	
	<h1 class="contentheader">Fotos de colaboradores</h1>
	
	<div class="break"></div>
	
	<div id="filter" class="filter half" >				
		<input type="radio" id="state0" name="state" value="0" checked><label for="state0" class="checklabel">Para publicar</label>
		<input type="radio" id="state1" name="state" value="1"><label for="state1" class="checklabel">Já publicados</label>		
	</div>
	
	
	<ul id="list-items" class="uiList">
	</ul>
	
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>

	<?php include('content/colaboradores/popAddItem.php'); ?>
	<?php include('content/colaboradores/popDelItem.php'); ?>
	
</div>


