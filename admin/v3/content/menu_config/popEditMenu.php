
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopEditMenu(idMenu){
		
		$("#popEditMenu").popUpShow();
		
		var loader = $('#popEditMenu .uiPopLoader');		
		loader.fadeIn();
		
		$('#popEditMenu #idMenu').val(idMenu);
		
		
		$.ajax({
			type: 'post',
			data : {'act'	: 'Load to Edit',
					'idMenu'	: idMenu
					},
			url: "<?=_fullpath?>/data/MenuConfig.php",	
			dataType: 'json',
			timeout: 3000, 
			success: function(data) {			
				
				$('#popEditMenu #pos').val(data.pos);
				$('#popEditMenu #nivel').val(data.nivel);
				$('#popEditMenu #title').val(data.title);
				$('#popEditMenu #url').val(data.url);
				$('#popEditMenu #params').val(data.params);				
				if(data.vs == 'v2'){$('#popEditMenu #v2').attr("checked",true)}else{$('#popEditMenu #v3').attr("checked",true)}

				loader.fadeOut();
			
			},
			error: function() {						
				loader.fadeOut();
				alert('<?=$cfig['query timeout']?>');
			}
		});
	
	
	
	}	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE ALBUM
	//------------------------------------------------------------------------------------------
	function saveEditMenu(){
	
		var divStatus = $('#popEditMenu #editMenuStatus');
		
		divStatus.html('');		
		$('#popEditMenu .uiPopLoader').fadeIn();
		
		var idMenu = $('#popEditMenu #idMenu').val();
		var title = $('#popEditMenu #title').val();
		var pos   = $('#popEditMenu #pos').val();
		
		$.ajax({
			type: 'post',
			data: {
				'act': 'Save Edit',
				'id': idMenu,
				'pos': pos,
				'nivel': $('#popEditMenu #nivel').val(),
				'title': title,
				'url': $('#popEditMenu #url').val(),
				'params': $('#popEditMenu #params').val(),
				'vs': $("#popEditMenu #v2").is(":checked") ? 'v2' : 'v3'
			},
			url: "<?=_fullpath?>/data/MenuConfig.php",
			timeout: 3000,
			success: function(data){				
				if(data == true){					
					$('#list-menu #item'+idMenu+' .title').text((pos < 10 ? '0'+pos : pos)+ ' - '+title);					
					//closePopEditMenu();					
				}
				else {
					divStatus.html(data);
				}
				
				$('#popEditMenu .uiPopLoader').fadeOut();
				
			},
			error: function(){
				alert('<?=$cfig['query timeout']?>');
				$('#popEditMenu .uiPopLoader').fadeOut();
			}
		
		});
	
	}
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){
		$('#popEditMenu #editMenuCancel').click(closePopEditMenu);
		$('#popEditMenu #editMenuSend').click(saveEditMenu);
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
	function closePopEditMenu(){
		document.forms["formEditMenu"].reset();
		$('#formEditMenu input').val('');		
		$('#popEditMenu #editMenuStatus').html('');
		$("#popEditMenu").popUpHide();			
	}
	

</script>

	<div id="popEditMenu" class="uiPopUp half draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Editar Menu</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="editMenuStatus" class="uiStatus"></div>
			
				<form id="formEditMenu">
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
					<input type="hidden" id="idMenu"/>
				</form>	
				
				<div class="uiPopLoader" style="display:none"></div>
				
			</div>
			
			<div class="uiBoxBottom">
				<button id="editMenuCancel" class="uiButton">Fechar</button>
				<button id="editMenuSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>