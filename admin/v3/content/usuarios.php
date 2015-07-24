
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<style type="text/css">
	<?php
	if(empty($_PARAM['intro'])){echo '.uiList .item .moreItensBtn.text {display: none;} '; }
	if(empty($_PARAM['imgintro'])){echo '.usuarios .uiList .thumb {display:none;}'; }	
	?>	
</style>
  
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
			
				$.ajax({
					type: 'post',
					data : {'act'	 	 : 'Listar',
							'searchword' : $("#filter #searchword").val(),
							'situacao' 	 : $("#filter #situacao").val(),
							'nivel' 	 : $("#filter #nivel").val(),
							'dataini'	 : $("#filter #dataIni").val(), 
							'datafin'	 : $("#filter #dataFin").val(), 
							'calls'	 	 : calls
						   },
					url: _fullpath +'/data/Usuarios.php',	
					dataType: 'json',
					timeout: 3000, 
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
	
	
var publicarLocked = false;
	
	function publicarItem(id){	

		if(!publicarLocked){
		
			publicarLocked = true;
			
			var state = $('#list-items #item'+id).hasClass('disabled') ? 'A' : 'I';
			
			$.ajax({
				type: 'post',
				data: {
					'act'	: 'Publicar',
					'id'	: id,
					'state'	: state,
				},
				url: _fullpath +'/data/Usuarios.php',
				timeout: 3000,
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



<div id="usuarios" class="page-content">

	<h1 class="contentheader">Gerenciar Usuários</h1>
	
	<?php include('content/usuarios/modFilter.php'); ?>
	
	
	<button id="addNewItemBtn" class="uiAddButton" onclick="openPopAddItem()">Adicionar Item</button>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList">
	</ul>
	
	<div id="after-list">
		<a href="javascript:void(0)" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	
	<?php include('content/usuarios/popAddItem.php'); ?>	
	<?php include('content/usuarios/popDelItem.php'); ?>
	<?php if(@$_PARAM['imgintro']){include('content/usuarios/popIntroImage.php');} ?>
	<?php include('content/usuarios/popTextEditor.php'); ?>

</div>