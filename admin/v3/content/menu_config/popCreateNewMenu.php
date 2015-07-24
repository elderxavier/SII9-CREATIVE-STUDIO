
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopCreateNewMenu(){
		$("#popCreateNewMenu").popUpShow();
	}	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE ALBUM
	//------------------------------------------------------------------------------------------
	function createNewMenu(){
	
		var divStatus = $('#popCreateNewMenu #createNewMenuStatus');
		
		divStatus.html('');		
		$('#popCreateNewMenu .uiPopLoader').fadeIn();
		
		$.ajax({
			type: 'post',
			data: {
				'act': 'Create New',
				'pos': $('#popCreateNewMenu #pos').val(),
				'nivel': $('#popCreateNewMenu #nivel').val(),
				'title': $('#popCreateNewMenu #title').val(),
				'url': $('#popCreateNewMenu #url').val(),
				'params': $('#popCreateNewMenu #params').val(),
				'vs': $("#popCreateNewMenu #v2").is(":checked") ? 'v2' : 'v3'
			},
			url: "<?=_fullpath?>/data/MenuConfig.php",
			timeout: 3000,
			success: function(data){				
				if(data == true){			
					initMenu();
					closePopCreateNewMenu();
				}
				else {
					divStatus.html(data);
				}
				
				$('#popCreateNewMenu .uiPopLoader').fadeOut();
				
			},
			error: function(){
				alert('Tempo de resposta esgotado! Tente novamente.');
				$('#popCreateNewMenu .uiPopLoader').fadeOut();
			}
		
		});
	
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){
		$('#addNewItemBtn').click(openPopCreateNewMenu);
		$('#popCreateNewMenu #createNewMenuCancel').click(closePopCreateNewMenu);
		$('#popCreateNewMenu #createNewMenuSend').click(createNewMenu);
	})
	
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closePopCreateNewMenu(){
		document.forms["formCreateMenu"].reset();
		$('#popCreateNewMenu #createNewMenuStatus').html('');
		
		$("#popCreateNewMenu").popUpHide();		
	}
	

</script>

	<div id="popCreateNewMenu" class="uiPopUp half draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Criar novo menu</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="createNewMenuStatus" class="uiStatus"></div>
			
				<form id="formCreateMenu">
					<div class="form-item">
						<label>Pos:</label>
						<input type="text" id="pos" value="1"/>
						<div id="vs-group">
							<input type="radio" name="vs" id="v2" checked><label for="v2">V2</label>
							<input type="radio" name="vs" id="v3"><label for="v3">V3</label>
						</div>
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
						<textarea id="params"></textarea>
					</div>	
				</form>					
			</div>
			
			<div class="uiBoxBottom">
				<button id="createNewMenuCancel" class="uiButton">Cancelar</button>
				<button id="createNewMenuSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>