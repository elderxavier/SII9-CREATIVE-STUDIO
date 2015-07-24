<?php 

	defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	

?>



<script type="text/javascript">
	
	//------------------------------------------------------------------------------------------
	// OPEN POP UP
	//------------------------------------------------------------------------------------------
	function openPopAddItem(id){		
		
		$("#popAddItem").popUpShow();		
		
		if(id){loadToEdit(id)}else{$('#popAddItem #catid option[value="<?=@$catid?>"]').attr("selected","selected");};
	}	
	
	
	//------------------------------------------------------------------------------------------
	// LOAD TO EDIT
	//------------------------------------------------------------------------------------------
	function loadToEdit(id){	
		
		$('#popAddItem .uiPopLoader').show();
		
		$('#popAddItem #titulo').html('Editar Artigo');
		$('#popAddItem #act').val('Save Edit');		
		$('#popAddItem #idItem').val(id);
	
		$.ajax({
			type: 'post',
			data : {'act'	 : 'Load to Edit',
					'id' : id
					},
			url: _fullpath +"/data/Content.php",	
			dataType: 'json',
			success: function(data) {			
				//alert(data);
				 
				$('#popAddItem #date').val(data.date);
				$('#popAddItem #hour').val(data.hour);
				$('#popAddItem #pos').val(data.pos);
				$('#popAddItem #titulo').val(data.titulo);
				$("#popAddItem #catid option[value="+ data.catid +"]").attr("selected","selected");				
				
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

		
			var options = {
				url: "<?=_fullpath?>/data/Content.php",
				type: "post",
				success: function(data) {
				//alert(data);
					if(data == true){
						
						divStatus.resultStatus({value:'<span class="success">As informações foram atualizadas com sucesso.</span>'});
						
						var idItem 	 = $('#popAddItem #idItem').val(); 
						
						if(idItem){		
							
							var orderlist = $("#popAddItem #formCadastro #data").length ? $('#popAddItem #formCadastro #data').val()+' - ' : $('#popAddItem #formCadastro #pos').val()+' - ';

							$('#list-items #item'+idItem+' .title').html( orderlist + $('#popAddItem #formCadastro #titulo').val() );							
						}
						else {
							initItem();
							closePopAddItem();
						}						
						idItem = '';						
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
		
		$('#popAddItem #addItemStatus').html('');
		$('#popAddItem #titulo').html('Cadastrar novo Artigo');		
		$('#popAddItem #act').val('Add Item');
		$('#popAddItem #idItem').val('');
		$("#popAddItem").popUpHide();		
	}
	

</script>

	<div id="popAddItem" class="uiPopUp half draggable" style="display:none">
		
		<h1 id="titulo" class="uiBoxTitle">Cadastrar novo Artigo</h1>
		
		<div class="uiPopContent">
		
			<div class="uiPopHolder">

				<div id="addItemStatus" class="uiStatus"></div>			
		
				<form id="formCadastro" class="formCadastro">					
					<?php if(@$_PARAM['date'] == 'true'): ?>
					<div class="form-item">
						<label for="date">Data</label><input type="text" id="date" name="date" class="datepicker"/>
						<input type="hidden" id="hour" name="hour" value="00:00:00"/>
					</div>
					<?php else: ?>
					<div class="form-item half">
						<label for="pos">Pos</label><input type="text" id="pos" name="pos"/>
					</div>		
					<?php endif; ?>
					
					<?php if(!empty($parent)): ?>
					<div class="form-item">
						<label for="catid">Categoria *</label>
						<select id="catid" name="catid">
							<option value=""></option>
							<?php 								
								$sql = mysql_query("SELECT * FROM categorias WHERE parent = '".$parent."' AND ativo = '1' ORDER BY pos ASC");
								while($r = mysql_fetch_object($sql)){
									echo '<option value="'.$r->id.'" >'.$r->titulo.'</option>';
								}								
							?>
						</select>			
					</div>
					<?php else : ?>
					<input type="hidden" id="catid" name="catid" value="<?=$catid?>" />
					<?php endif; ?>
					
					
					<div class="form-item titulo-holder">
						<label>Título *</label>
						<input type="text" id="titulo" name="titulo"/>
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