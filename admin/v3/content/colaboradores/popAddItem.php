<?php 

	defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	

?>



<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		
		$("#popAddItem").popUpShow();
		
		if(id){loadToEdit(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		$("#addItemStatus").html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif" alt="carregando..."/></span>');
		$('#popAddItem #titulo').html('Publicar Imagem');
		$('#popAddItem #act').val('Save Edit');		
		$('#popAddItem #idItem').val(id);		
		
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Colaboradores.php",	
			dataType: 'json',
			timeout: 3000, 
			success: function(data) {			
			
				$('#popAddItem #data').val(data.data);
				$('#popAddItem #time').val(data.time);
				$('#popAddItem #idautor').val(data.idautor);
				$('#popAddItem #autor').val(data.autor);
				$('#popAddItem #email').val(data.email);
				$('#popAddItem #telefone').val(data.telefone);
				//$('#popAddItem #nome').val(data.nome);
				$("#popAddItem #categ option[value="+ data.categ +"]").attr("selected","selected");
				$("#popAddItem #cidade option[value="+ data.cidade +"]").attr("selected","selected");
				$('#popAddItem #descricao').val(data.descricao);
				$('#popAddItem #tecnica').val(data.tecnica);
				$('#popAddItem #mensagem').val(data.mensagem);				
				$('#popAddItem #animal').val(data.nome_animal);
				
				$('#popAddItem #titulo').html('Publicar foto para '+ data.nome_animal);												
				$("#addItemStatus").html('');
				$('#popAddItem #animal').keyup();	
				
				
			},
			error: function() {					
				$("#addItemStatus").html('<?=$cfig['query timeout']?>');
			}
		});
	}
		
	
	
	
	$(function(){	

		//------------------------------------------------------------------------------------------
		// CREATE NEW ITEM - ENVIA FORMULÁRIO
		//------------------------------------------------------------------------------------------
		
		$("#formAddItem").submit(function() {
		
			var divStatus = $('#popAddItem #addItemStatus');
		
			divStatus.html('<span class="loader">Salvando... <img src="<?=_fullpath?>/images/loading.gif" alt="salvando..."/></span>');		
			
			var options = {
				target: divStatus,
				url: _fullpath +"/data/Colaboradores.php",
				type: "post", 
				success: function(data) {
					if(data == true){					
						var idItem = $('#popAddItem #idItem').val();
						if(idItem){
							$('#item'+idItem).fadeOut(function(){$(this).remove()});	
						}
						idItem = '';
						
						closePopAddItem();						
					}
					else {
						divStatus.html(data);
					}
					
				},
				error: function(){
					divStatus.html('<?=$cfig['query timeout']?>');
				}
			}

			$(this).ajaxSubmit(options); 
			
			return false;
			
		});	
		
		
		//------------------------------------------------------------------------------------------
		// FUNÇÕES DOS BOTÕES
		//------------------------------------------------------------------------------------------
		$('#popAddItem #addItemCancel').click(closePopAddItem);
		$('#popAddItem #addItemSend').click(function(){$("#formAddItem").submit()});

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
	function closePopAddItem(){
		document.forms["formAddItem"].reset();
		$('#popAddItem #addItemStatus').html('');
		$('#popAddItem #titulo').html('Cadastrar nova Imagem');		
		$('#popAddItem #act').val('Add Item');
		$('#popAddItem #idItem').val('');
		$("#popAddItem").popUpHide();	
	}
	

</script>

	<div id="popAddItem" class="uiPopUp draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar nova Imagem</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formAddItem" >
	
					<div class="col1">
						<div class="form-item">
							<label>Data:</label>
							<input type="text" id="data" name="data" class="datepicker"/>
							<input type="hidden" name="time" id="time" value="00:00:00"/>
						</div>
						<div class="form-item sel-holder">
							<label >Tipo de animal</label>
							<select id="categ" name="categ">
								<option></option>
								<?php 
									$sql = mysql_query("SELECT * FROM animais_categ WHERE ativo = '1' ORDER BY titulo ASC");
									while($r = mysql_fetch_object($sql)){
										echo '<option value="'.$r->id.'">'.$r->titulo.'</option>';
									}							
								?>
							</select>
						</div>
						<div class="form-item">
							<label>Autor:</label>
							<input type="text" name="autor" id="autor">
							<input type="hidden" name="idautor" id="idautor">
							<!--<div class="uiHelper tooltip" title="O conteúdo deste campo será gravado na foto como marca d'água">?</div>-->
						</div>						
						<div class="form-item">
							<label>Email:</label>
							<input type="text" name="email" id="email">
						</div>
						<div class="form-item">
							<label>Telefone:</label>
							<input type="text" name="telefone" id="telefone">
						</div>
						<div class="form-item">
							<label>Mensagem:</label>
							<textarea id="mensagem" name="mensagem" disabled="disabled"></textarea>                    
						</div>
					</div>
					
					<div class="col2">
						<div class="form-item">
							<label>Animal:</label>
							<?php NWD::insertAdmModule('animais_sl'); ?>
						</div>
						<div class="form-item sel-holder">
							<label>Cidade:</label>
							<?php NWD::insertAdmModule('cidade_sl'); ?>
						</div>
						<div class="form-item">
							<label>Descrição:</label>
							<textarea id="descricao" name="descricao" ></textarea>                    
						</div>
						<div class="form-item">
							<label>Informações técnicas:</label>
							<textarea id="tecnica" name="tecnica" ></textarea>                    
						</div>
						<div class="form-item">
							<label></label>
							<input type="checkbox" id="tempClear" name="tempClear" value="1" checked />
							<label for="tempClear" class="checklabel">Apagar arquivos temporários?</label>
							<div class="uiHelper tooltip" title="Os dados movidos serão apagados definitivamente da pasta temporária">i</div>
						</div>
					</div>
					
					<input type="hidden" name="act" id="act" value="Add Item"/>
					<input type="hidden" name="imgvalues" value="<?=$_PARAM['imgvalues']?>"/>
					<input type="hidden" name="idItem" id="idItem"/>
				</form>
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Cancelar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>