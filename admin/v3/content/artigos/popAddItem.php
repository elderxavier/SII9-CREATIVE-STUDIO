
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(){
		$("#popAddItem").popUpShow();
	}	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE
	//------------------------------------------------------------------------------------------
	function addItem(){
	
		var divStatus = $('#popAddItem #addItemStatus');
		
		divStatus.html('');		
		$('#popAddItem .uiPopLoader').fadeIn();
		
		$.ajax({
			type: 'post',
			data: {
				'act': 'Add Item',
				'pos': $('#popAddItem #pos').val(),
				'nivel': $('#popAddItem #nivel').val(),
				'title': $('#popAddItem #title').val(),
				'url': $('#popAddItem #url').val(),
				'params': $('#popAddItem #params').val()				
			},
			url: "<?=_fullpath?>/data/Imagens.php",
			timeout: 3000,
			success: function(data){				
				if(data == true){			
					initItem();
					closePopAddItem();
				}
				else {
					divStatus.html(data);
				}
				
				$('#popAddItem .uiPopLoader').fadeOut();
				
			},
			error: function(){
				alert('Tempo de resposta esgotado! Tente novamente.');
				$('#popAddItem .uiPopLoader').fadeOut();
			}
		
		});
	
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){
		$('#addNewItemBtn').click(openPopAddItem);
		$('#popAddItem #addItemCancel').click(closePopAddItem);
		$('#popAddItem #addItemSend').click(addItem);
	})
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closePopAddItem(){
		document.forms["formCreateItem"].reset();
		$('#popAddItem #addItemStatus').html('');
		$("#popAddItem").popUpHide();			
	}
	

</script>

	<div id="popAddItem" class="uiPopUp" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Criar novo imagem</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>
			
				<form id="formCreateItem">
					<div class="form-item">
						<label>Pos:</label>
						<input type="text" id="pos" value="1"/>
						
						<label>Nivel:</label>
						<input type="text" id="nivel" value="1"/>
					</div>
					<div class="form-item">
						<label>Título:</label>
						<input type="text" id="title"/>
					</div>
					<div class="form-item">
						<label>Url:</label>
						<input type="text" id="url"/>
					</div>
					<div class="form-item">
						<label>Parâmetros:</label>
						<textarea id="params"></textarea>
					</div>	
				</form>					
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Cancelar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>