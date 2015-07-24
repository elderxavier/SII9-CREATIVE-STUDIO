
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">

	//------------------------------------------------------------------------------------------
	// DELETE CONFIRM
	//------------------------------------------------------------------------------------------
	function openDeleteItemConfirm(id){
		$("#popDeleteItemConfirm").popUpShow();
		
		$("#popDeleteItemConfirm #cancelBtn").click(closeDeleteItemConfirm);
		$("#popDeleteItemConfirm #confirmBtn").click(function(){
			deleteItem(id);
			closeDeleteItemConfirm();
		});
	}
	
	
	//------------------------------------------------------------------------------------------
	// EXCLUIR ALBUNS
	//------------------------------------------------------------------------------------------
	var excluirLocked = false;
	
	function deleteItem(id){	
		
		if(!excluirLocked){
			
			excluirLocked = true;	
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Excluir',
					'id': id ,
				},
				url: _fullpath +"/data/Imoveis.php",
				timeout: 3000,
				success: function(data){
					if(data == true){
						$('#list-items #item'+id).fadeOut(function(){$(this).remove()});						
					}
					else {
						alert(data);
					}
					
					excluirLocked = false;			
				},
				error: function(){
					excluirLocked = false;	
				}
			})		
		}		
	}
	
	//------------------------------------------------------------------------------------------
	// CLOSE POP UP
	//------------------------------------------------------------------------------------------
	function closeDeleteItemConfirm(){
		$("#popDeleteItemConfirm").popUpHide();		
	}
</script>

<div id="popDeleteItemConfirm" class="uiPopUp half uiAlert draggable" style="display:none">
	<div class="uiPopContent">	
		<h1 id="titulo" class="uiBoxTitle">Deseja excluir este item?</h1>		
		<div class="uiPopHolder">	
			Os dados apagados não poderão mais ser recuperados.
		</div>
		<div class="uiBoxBottom">
			<button id="cancelBtn" class="uiButton" >Cancelar</button>
			<button id="confirmBtn" class="uiButtonConfirm" >Confirmar</button>
		</div>
	</div>
</div>