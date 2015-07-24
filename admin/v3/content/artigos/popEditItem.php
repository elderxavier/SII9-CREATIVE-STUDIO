
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopEditItem(id){
		
		$("#popEditItem").popUpShow();
		
		var loader = $('#popEditItem .uiPopLoader');		
		loader.fadeIn();
		
		$('#popEditItem #idItem').val(idItem);
		
		
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'idItem' : id
					},
			url: _fullpath +"/data/Imagens.php",	
			dataType: 'json',
			timeout: 3000, 
			success: function(data) {			
				
				$('#popEditItem #pos').val(data.pos);
				$('#popEditItem #nivel').val(data.nivel);
				$('#popEditItem #title').val(data.title);
				$('#popEditItem #url').val(data.url);
				$('#popEditItem #params').val(data.params);

				loader.fadeOut();
			
			},
			error: function() {						
				loader.fadeOut();
				alert('Tempo de resposta esgotado! Tente novamente.');
			}
		});
	
	
	
	}	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE ALBUM
	//------------------------------------------------------------------------------------------
	function saveEditItem(){
	
		var divStatus = $('#popEditItem #editItemStatus');
		
		divStatus.html('');		
		$('#popEditItem .uiPopLoader').fadeIn();
		
		$.ajax({
			type: 'post',
			data: {
				'act': 'Save Edit',
				'id': $('#popEditItem #idItem').val(),
				'pos': $('#popEditItem #pos').val(),
				'nivel': $('#popEditItem #nivel').val(),
				'title': $('#popEditItem #title').val(),
				'url': $('#popEditItem #url').val(),
				'params': $('#popEditItem #params').val()				
			},
			url: _fullpath +"/data/Imagens.php",
			timeout: 3000,
			success: function(data){				
				if(data == true){			
					initItem();
					closePopEditItem();
				}
				else {
					divStatus.html(data);
				}
				
				$('#popEditItem .uiPopLoader').fadeOut();
				
			},
			error: function(){
				alert('Tempo de resposta esgotado! Tente novamente.');
				$('#popEditItem .uiPopLoader').fadeOut();
			}
		
		});
	
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){
		$('#popEditItem #editItemCancel').click(closePopEditItem);
		$('#popEditItem #editItemSend').click(saveEditItem);
	})

	function titleMouseEnter(id){
		$('#item'+id+' .editBtn').css({'display':'block'});
	}
	function titleMouseLeave(id){
		$('#item'+id+' .editBtn').css({'display':'none'});
	}
	
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closePopEditItem(){
		document.forms["formEditItem"].reset();
		$('#formEditItem input').val('');		
		$('#popEditItem #editItemStatus').html('');
		$("#popEditItem").popUpHide();			
	}
	

</script>

	<div id="popEditItem" class="uiPopUp" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Editar Item</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="editItemStatus" class="uiStatus"></div>
			
				<form id="formEditItem">
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
					<input type="hidden" id="idItem"/>
				</form>	
				
				<div class="uiPopLoader" style="display:none"></div>
				
			</div>
			
			<div class="uiBoxBottom">
				<button id="editItemCancel" class="uiButton">Cancelar</button>
				<button id="editItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>