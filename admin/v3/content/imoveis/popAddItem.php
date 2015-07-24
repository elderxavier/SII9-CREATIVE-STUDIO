<?php 

	defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	

?>



<script type="text/javascript">
	
	var idEdit = '';
	
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
		$('#popAddItem #header-title').html('Editar Imóvel');
		$('#popAddItem #act').val('Save Edit');		
		$('#popAddItem #idItem').val(id);		
		
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Imoveis.php",	
			dataType: 'json',
			timeout: 5000, 
			success: function(data) {			
				
				$('#popAddItem #titulo').val(data.titulo);				
				$("#popAddItem #status option[value="+ data.status +"]").attr("selected","selected");
				$("#popAddItem #tipo option[value="+ data.tipo +"]").attr("selected","selected");
				$("#popAddItem #cidade option[value="+ data.id_cidade +"]").attr("selected","selected");
				$("#popAddItem #endereco").val(data.endereco);
				$("#popAddItem #bairro").val(data.bairro);
				$('#popAddItem #lat_long').val(data.lat_long);
				$("#popAddItem #quartos option[value="+ data.quartos +"]").attr("selected","selected");
				$("#popAddItem #garagem option[value="+ data.garagem +"]").attr("selected","selected");				
				$('#popAddItem #valor').val(data.valor);
				$('#popAddItem #destaque').val(data.destaque);
				
	
				$("#addItemStatus").html('');	
			},
			error: function() {						
				alert('<?=$cfig['query timeout']?>');
			}
		});
	}
	
	
	
	$(function() {
	
		//------------------------------------------------------------------------------------------
		// CREATE NEW ITEM - ENVIA FORMULÁRIO
		//------------------------------------------------------------------------------------------
		
		$("#formAddItem").submit(function() {
		
			var divStatus = $('#popAddItem #addItemStatus');
		
			divStatus.html('');		
			$('#popAddItem .uiPopLoader').fadeIn();

			var options = {
				target: divStatus,
				url: _fullpath +"/data/Imoveis.php",
				type: "post", 
				success: function(data) {
					
					if(data == true){						
						
						var idItem = $('#popAddItem #idItem').val();
						if(idItem){
							$('#item'+idItem+' .title').html( $('#popAddItem #titulo').val() );	
							divStatus.resultStatus({value:'<span class="success">Os dados foram gravados com sucesso.</span>'});
						}
						else {
							initItem();
							closePopAddItem();
							idItem = '';
						}						
					}
					else {
						divStatus.resultStatus({value:data});
					}
					
					$('#popAddItem .uiPopLoader').fadeOut();
				},
				error: function(){
					alert('<?=$cfig['query timeout']?>');
					$('#popAddItem .uiPopLoader').fadeOut();
				}
			}

			$(this).ajaxSubmit(options); 
			
			return false;
			
		});			
	
	

		//------------------------------------------------------------------------------------------
		// AÇÕES DOS BOTÕES
		//------------------------------------------------------------------------------------------		
		
		// adicionar item
		$('#popAddItem #addItemCancel').click(closePopAddItem);
		$('#popAddItem #addItemSend').click(function(){$("#formAddItem").submit()});
		$('#addNewItemBtn').click(function(){openPopAddItem('')});	

	});
	

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
		$("#popAddItem select").val('');		
		$('#popAddItem #addItemStatus').html('');
		$('#popAddItem #header-title').html('Cadastrar novo Imóvel');		
		$('#popAddItem #act').val('Add Item');
		$('#popAddItem #idItem').val('');	

		$("#popAddItem").popUpHide();
	}
	

</script>

	<div id="popAddItem" class="uiPopUp draggable" style="display:none" >
		
		<h1 id="header-title" class="uiBoxTitle">Cadastrar novo Imóvel</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formAddItem">
	
					<div class="col1">							
						<div class="form-item">
							<label>Título:</label>
							<input name="titulo" id="titulo" type="text">
						</div>						
						<div class="form-item half">
							<label>Quartos:</label>
							<select name="quartos" id="quartos">
								<option value=""></option>
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
							</select>
						</div>
						<div class="form-item half col2">
							<label>Garagem:</label>
							<select name="garagem" id="garagem">
								<option value=""></option>
								<option value="1">01</option>
								<option value="2">02</option>
								<option value="3">03</option>
								<option value="4">04</option>
								<option value="5">05</option>
								<option value="6">06</option>
								<option value="7">07</option>
								<option value="8">08</option>
								<option value="9">09</option>
								<option value="10">10</option>
							</select>
						</div>
						<div class="form-item">
							<label>Categoria:</label>
							<select name="tipo" id="tipo">
								<option value=""></option>
								<?php
									$sql = mysql_query("SELECT * from categorias WHERE parent = '".$_PARAM['parent']."' AND ativo = '1' ORDER BY pos ASC");
									while($r = mysql_fetch_object($sql)){
										echo '<option value="'.$r->id.'">'.$r->titulo.'</option>';
									}
								?>
							</select>
						</div>
						<!--
						<div class="form-item">
							<label>Situação:</label>
							<select id="status" name="status">
								<option></option>
								<?php 
									//$sql = mysql_query("SELECT * FROM imoveis_status WHERE ativo = '1' ORDER BY pos ASC");
									//while($r = mysql_fetch_object($sql)){
									//	echo '<option value="'.$r->id.'">'.$r->titulo.'</option>';
									//}								
								?>
							</select>
						</div>
						-->

						<div class="form-item">
							<label>Valor:</label>
							<input name="valor" id="valor" type="text">
						</div>	
					</div>				
					
					<div class="col2">						
						
						<div class="form-item">
							<label>Endereço:</label>
							<input name="endereco" id="endereco" type="text">
						</div>	
						<div class="form-item">
							<label>Bairro:</label>
							<input name="bairro" id="bairro" type="text">
						</div>	
						<div class="form-item">
							<label>Cidade:</label>
							<select name="cidade" id="cidade">
								<option value=""></option>
								<?php
									$sql = mysql_query("SELECT * from cidades_ativo ORDER BY pos ASC");
									while($r = mysql_fetch_object($sql)){
										echo '<option value="'.$r->id.'">'.$r->nome.'</option>';
									}
								?>
							</select>
						</div> 						
						<div class="form-item">
							<label>Coordenadas:</label>
							<input name="lat_long" id="lat_long" type="text">
							<span class="uiHelper tooltip" 
								  title="Clique com o botão direito na localização do Google Maps -> O que há aqui ?
								  Copie o código abaixo do endereço no campo de pesquisa." >
							</span>
						</div>
						<div class="form-item half">
							<label>Destaque:</label>
							<input name="destaque" id="destaque" type="text" maxlength="3">
							<span class="uiHelper tooltip" 
								  title="Campo de valor numérico. Quanto mais alto o número mais destaque este item terá." >
							</span>
						</div>	
					</div>
					
					
					<input type="hidden" name="act" id="act" value="Add Item"/>
					<input type="hidden" name="idItem" id="idItem"/>
				
				</form>
				
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Fechar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>