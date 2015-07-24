
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">

	//------------------------------------------------------------------------------------------
	// DELETE CONFIRM
	//------------------------------------------------------------------------------------------	
	function deleteItemConfirm(id){
		if (confirm("Voce tem certeza que deseja excluir este item ?\nOs vínculos de dados atrelados à este usuário serão perdidos.")){
			deleteItem(id);
		}
	}	
	
	
	//------------------------------------------------------------------------------------------
	// EXCLUIR ALBUNS
	//------------------------------------------------------------------------------------------
	var excluirLocked = false;
	
	function deleteItem(id){	
		
		if(!excluirLocked){
		
			$.ajax({
				type: 'post',
				data: {
					'act': 'Excluir',
					'id': id
				},
				url: _fullpath+"/data/Usuarios.php",
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
	
</script>


