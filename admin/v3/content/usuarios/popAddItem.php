<?php 

	defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	

?>



<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		
		$("#popAddItem").popUpShow();	
		
		$('#popAddItem #idUser').attr("title", "Informe este campo apenas se tiver certeza para qual ID deseja inserir o item.");
		
		if(id){loadToEdit(id)};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		
		$('#popAddItem .uiPopLoader').show();
		
		$('#popAddItem #titulo').html('Editar dados do Usuário');
		$('#popAddItem #act').val('Save Edit');		
		$('#popAddItem #idItem').val(id);
		$('#popAddItem #idUser').attr("disabled", "disabled").removeAttr("title");
	
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Usuarios.php",	
			dataType: 'json',
			//timeout: 3000, 
			success: function(data) {			
				//alert(data);
				
				$('#popAddItem #idUser').val(data.id);
				$('#popAddItem #nome').val(data.nome);
				$('#popAddItem #email').val(data.email);
				$('#popAddItem #usuario').val(data.usuario);
				$('#popAddItem #senha').val(data.senha);
				$('#popAddItem #telefone').val(data.telefone);
				$('#popAddItem #profissao').val(data.profissao);
				$("#popAddItem #nivel option[value="+ data.nivel +"]").attr("selected","selected");
				$("#popAddItem #situacao option[value="+ data.situacao +"]").attr("selected","selected");				
				//$('#popAddItem #cidades-multi-select .cidades-selected').html(data.cidades);
				
				$('#popAddItem .uiPopLoader').hide();			
			},
			error: function() {					
				$('#popAddItem .uiPopLoader').hide();
				alert('<?=$cfig['query timeout']?>');
			}
		});
	}
	
	
	
	//------------------------------------------------------------------------------------------
	// CREATE NEW ITEM
	//------------------------------------------------------------------------------------------
	$(function(){
	
	
		$("#formCadastro").submit(function() {

			var divStatus = $('#popAddItem #addItemStatus');
			divStatus.html('<span class="loader">Salvando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');

			var i = 0;
			var cidades = '';
			var idcidades = '';
			
			/*$("#cidades-multi-select .cidades-selected li").each(function(){				
				if(i > 0){cidades += ', '; idcidades += ','}; i++;				
				
				cidades   += $(this).find('.itemlabel').text();
				idcidades += $(this).attr('id');	
			});*/
			
			//alert(cidades);
			
		
			var options = {
				url: "<?=_fullpath?>/data/Usuarios.php",
				type: "post",
				data : {
					'cidades' : cidades,
					'idcidades' : idcidades
				},
				success: function(data) {
				//alert(data);
					if(data == true){
						
						divStatus.resultStatus({value:'<span class="success">As informações foram atualizadas com sucesso.</span>'});
						
						var idItem 	 = $('#popAddItem #idItem').val(); 
						var situacao = $("#popAddItem #situacao").val();
						
						if(idItem){
							situacao = situacao == 'A' ? 'enabled' : 'disabled '+situacao;
							$('#list-items #item'+idItem+' .title').html( $('#popAddItem #nome').val() );
							$('#list-items #item'+idItem).removeClass("I F B enabled disabled").addClass(situacao);
						}
						else {
							initItem();
						}
						
						idItem = '';
						situacao = '';

						//closePopAddItem();						
					}
					else {
						divStatus.resultStatus({value:data});
					}					
				}
			}

			$(this).ajaxSubmit(options);
			
			
			return false;
			
		});	

		//initHideLabel();
		
	});
	
	
	//------------------------------------------------------------------------------------------
	// AÇÕES DOS BOTÕES
	//------------------------------------------------------------------------------------------
	$(function(){		
		$('#popAddItem #addItemCancel').click(closePopAddItem);
		$('#popAddItem #addItemSend').click(function(){$("#formCadastro").submit()});
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
		document.forms["formCadastro"].reset();
		$('#popAddItem select option').removeAttr("selected");
		//$('#popAddItem #cidades-multi-select .cidades-selected').html('');
		$('#popAddItem #idUser').removeAttr("disabled");
		$('#popAddItem #addItemStatus').html('');
		$('#popAddItem #titulo').html('Cadastrar novo Usuário');		
		$('#popAddItem #act').val('Add Item');
		$('#popAddItem #idItem').val('');
		$("#popAddItem").popUpHide();		
	}
	

</script>

	<div id="popAddItem" class="uiPopUp draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar novo Usuário</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formCadastro" class="formCadastro">
		
					<div class="col1">
						<div class="form-item">
							<label>Identificador</label>
							<input type="text" id="idUser" name="idUser" class="pos tooltip" /> 
						</div>
						<div class="form-item">
							<label>Nome *</label>
							<input type="text" id="nome" name="nome"/>
						</div>	
						<div class="form-item">
							<label>Email *</label>
							<input type="text" id="email" name="email" />
						</div>											
						<div class="form-item">
							<label>Usuário *</label>
							<input type="text" id="usuario" name="usuario"/>
						</div>
						<div class="form-item">
							<label>Senha *</label>
							<input type="text" id="senha" name="senha"/>
						</div>						
					</div>
					
					<div class="col2">
						<div class="form-item">
							<label>Telefone</label>
							<input type="text" id="telefone" name="telefone"/>
						</div>	
						<div class="form-item">
							<label>Profissão</label>
							<input type="text" id="profissao" name="profissao"/>
						</div>
						<div class="form-item">
							<label>Nível *</label>
							<select id="nivel" name="nivel">
								<option value=""></option>
								<?php 
									$sql = mysql_query("SELECT * FROM usuarios_niveis WHERE nivel > '".$_SESSION['usernivel']."' ORDER BY nivel ASC");
									while($r = mysql_fetch_object($sql)){
										echo '<option value="'.$r->nivel.'" title="'.$r->info.'">'.$r->titulo.'</option>';
									}
								?>
							</select>			
						</div>
						<div class="form-item">
							<label >Status *</label>
							<select id="situacao" name="situacao">
								<option value=""></option>
								<?php include('content/usuarios/components/situacao_select_options.php'); ?>
							</select>
						</div>
						<!--
						<div class="form-item" id="cidade-holder">
							<span class="label">Selecione as cidades de atuação</span>
							<?php //NWD::insertAdmModule('cidades_multi_select'); ?>
						</div>	
						-->		
					</div>
					
					<input type="hidden" id="idItem" name="idItem" value="" />
					<input type="hidden" id="act" name="act" value="Add Item" />
				</form>
				
				
				<div class="uiPopLoader"></div>
				
			</div>
			
			<div class="uiBoxBottom">
				<button id="addItemCancel" class="uiButton">Fechar</button>
				<button id="addItemSend" class="uiButtonConfirm">Salvar</button>
			</div>
			
		</div>
	</div>