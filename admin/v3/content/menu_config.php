
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">

	var onChangeSelect;
	var initMenu;
	var calls = 0;
	var buscaMenuLocked = false;
	
	$(function(){		
		
		var dataHolder	= $("#list-menu");
		
	
		initMenu = function(){
			dataHolder.html('');
			calls = 0;
			buscaMenuLocked = false;
			buscaMenu();
		}		
		
		
		function buscaMenu(){
		
			if(!buscaMenuLocked){
				
				buscaMenuLocked = true;
				
				$('.contentLoader').fadeIn();
			
				$.ajax({
					type: 'post',
					data : {'act'		: 'Listar',
							'calls'		: calls
						   },
					url: _fullpath +'/data/MenuConfig.php',	
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
									buscaMenuLocked = false;
								}
							}
							addItem();							
						}
						
						if(listLength < <?=$cfig['query list limit']?>){ 
							$('#itemExpandBtn').fadeOut();
							buscaMenuLocked = true;
						}
						else {
							$('#itemExpandBtn').fadeIn();
						}
			
					},
					error: function() {						
						$('.contentLoader').fadeOut();
						buscaMenuLocked = false;
						alert('Tempo de resposta esgotado! Tente novamente.');
					}
				});
			}
		}
		
		initMenu();	
		
		$('#itemExpandBtn').click(buscaMenu);		
		
		
	});
	
	var publicarLocked = false;
	
	function publicarMenu(id){	

		if(!publicarLocked){
		
			publicarLocked = true;
			
			var value = $('#list-menu #item'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Publicar',
					'id': id,
					'value': value
				},
				url: _fullpath +'/data/MenuConfig.php',
				timeout: 3000,
				success: function(data){
					
					$('#list-menu #item'+id).removeClass().addClass('item '+data);
					
					publicarLocked = false;			
				},
				error: function(){
					publicarLocked = false;	
				}
			});
			
		}
		
	}		

</script>


<div id="menu-config" class="page-content">
	
	<h1 class="contentheader">Menus de Administração</h1>
	
	<button id="addNewItemBtn" class="uiAddButton">Criar Novo Menu</button>
	
	<div class="break"></div>
	
	<ul id="list-menu" class="uiList">
	</ul>
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais menus</a>		
	</div>
	
	<?php include('content/menu_config/popEditMenu.php'); ?>
	<?php include('content/menu_config/popCreateNewMenu.php'); ?>
	<?php include('content/menu_config/popDeleteMenu.php'); ?>
</div>
