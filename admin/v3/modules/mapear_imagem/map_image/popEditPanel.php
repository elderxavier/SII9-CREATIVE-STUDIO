



<script type="text/javascript">
	
	var pointerId = '';
	
	$(function(){			
	
		var posX = 0;
		var posY = 0;
		
		//----------------------------------------------------------------------------------------------------
		// AÇÕES DOS BOTOES
		//----------------------------------------------------------------------------------------------------
		$("#map-area").dblclick(openEditPanel);	
		$("#popEditPanel").dblclick(function(){return false}); 
		$("#popEditPanel .uiCloseWindow").click(closeEditPanel);
		$("#popEditPanel #saveBtn").click(salvarEdicao);
		$("#popEditPanel #deleteBtn").click(deletePointer);		
		
		
		//----------------------------------------------------------------------------------------------------
		// ABRE POP UP
		//----------------------------------------------------------------------------------------------------
		function openEditPanel(e){
			
			$("#popEditPanel #deleteBtn").hide()
			
			var offset = $(e.target).offset();			
			posX = (e.pageX-offset.left);
			posY = (e.pageY-offset.top);		
			
			$("#popEditPanel").fadeIn().css({'left':posX+'px','top':posY-20-$("#popEditPanel").height()+'px'});
			
			$("#popEditPanel #coordinates").val(posX+','+posY);
			
		}

		
		//----------------------------------------------------------------------------------------------------
		// SALVA EDIÇÃO
		//----------------------------------------------------------------------------------------------------
		function salvarEdicao(){
			
			var holder = $("#popEditPanel");
			var divStatus = holder.find('.uiStatus');
			
			divStatus.html('Carregando... <img src="images/loading.gif" />');			
			
			var act = holder.find("#act").val();
			var coordinates = holder.find("#coordinates").val();
			
			$.ajax({
				type: 'post',
				data: {
					'act' : act,
					'id' : pointerId,
					'localidade' : holder.find("#localidade").val(),
					'coordinates' : coordinates
				},
				url : 'data/MapImage.php',
				timeout : 3000,
				dataType : 'json',
				success : function(data){				
					if(data.resposta === true){						
						$("#popEditPanel input").val('');
						divStatus.html('<span class="success">Os dados foram salvos com sucesso.</span>');
						setTimeout(closeEditPanel,1500);
						
						if(act == 'Cadastrar'){
							var newPointer = '<div id="'+data.lastid+'" onclick="editaPointer(this)" class="map-pointer" style="left:'+(posX-9)+'px;top:'+(posY-9)+'px"></div>';			
							$("#map-area").append(newPointer);	
						}
						else {
							cord = coordinates.split(',');
							$("#map-area #"+pointerId).css({'left':cord[0]-9+'px','top':cord[1]-9+'px'});
						}
					}
					else {
						divStatus.html(data.resposta);	
					}
				
				},
				error : function(){
					divStatus.html('<span class="error">Tempo de resposta esgotado. Tente novamente</span>');
				}
			
			});
			
		}			
		
		
		//----------------------------------------------------------------------------------------------------
		// EXCLUI POINTER
		//----------------------------------------------------------------------------------------------------
		function deletePointer(){
			
			$("#popEditPanel .uiStatus").html('Carregando... <img src="images/loading.gif" />');	
			
			$.ajax({
				type: 'post',
				data: {					
					'act' : 'Delete Pointer',
					id : pointerId
				},
				url : 'data/MapImage.php',
				timeout : 3000,
				success : function(data){				
					
					if(data == true){	
						$("#map-area #"+pointerId).fadeOut(function(){$(this).remove()});
						closeEditPanel();
					}
					else {
						$("#popEditPanel .uiStatus").html(data);
					}
				},
				error : function(){
					$("#popEditPanel .uiStatus").html('Erro ao excluir. Tente novamente');
				}
			
			});
		}
		
		//----------------------------------------------------------------------------------------------------
		// FECHA POP UP
		//----------------------------------------------------------------------------------------------------
		function closeEditPanel(){
			$("#popEditPanel").fadeOut();
			$("#popEditPanel input").val('');
			$("#popEditPanel .uiStatus").html('');
			$("#popEditPanel #act").val('Cadastrar');
			$("#popEditPanel #deleteBtn").hide();
			pointerId = '';
		}		
		
	});
	
	
	//----------------------------------------------------------------------------------------------------
	// EDITA POINTER
	//----------------------------------------------------------------------------------------------------
	function editaPointer(obj){		
	
		pointerId = $(obj).attr('id');

		var holder = $("#popEditPanel");
		var divStatus = holder.find('.uiStatus');

		divStatus.html('Carregando... <img src="images/loading.gif" />');
		
		$.ajax({
			type: 'post',
			data: {
				'act' : 'Load to Edit',
				'id' : pointerId
			},
			url : 'data/MapImage.php',
			timeout : 3000,
			dataType : 'json',
			success : function(data){				

				posX = $(obj).position().left;
				posY = $(obj).position().top;		
				
				$("#popEditPanel").fadeIn().css({'left':posX+9+'px','top':posY-9-$("#popEditPanel").height()+'px'});
			
				holder.find("#act").val('Editar');		
				holder.find("#localidade").val(data.localidade);
				holder.find("#coordinates").val(data.coordinates);				
				
				divStatus.html('');		
				holder.find("#deleteBtn").show();
			},
			error : function(){
				divStatus.html('<span class="error">Erro ao carregar</span>');
			}
			
		});	
	
	}

</script>


<div id="popEditPanel" class="uiPopUp draggable" style="display:none">
	
		<span class="uiCloseWindow"></span>
		
		<!--<h1 id="titulo" class="uiBoxTitle">Editar Recado</h1>-->
		
		<div class="uiPopContent">			
			<div class="uiPopHolder">		
				<form id="form-edit">
					<div class="form-item">						
						<input type="text" id="localidade" />
					</div> 
					<input type="hidden" id="coordinates" />
					<input type="hidden" id="act" value="Cadastrar"/>
				</form>
			</div>
			<div class="uiBoxBottom">	
				<div id="editStatus" class="uiStatus"></div>
				<button id="deleteBtn" class="uiButton form-button" >Excluir</button>
				<button id="saveBtn" class="uiButtonConfirm form-button" >Salvar</button>
			</div>
		</div>
		
	</div>