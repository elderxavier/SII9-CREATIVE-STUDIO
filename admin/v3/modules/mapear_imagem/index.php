
<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<link type="text/css" href="css/mapear_imagem.css" rel="stylesheet"/>
	<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui-1.10.3.min.js"></script>
	<script type="text/javascript">
		$(function() {
			$(".draggable").draggable();
		});
	</script>
</head>	
</body>
</html>

	<script type="text/javascript">
		$(function(){
			//----------------------------------------------------------------------------------------------------
			// LISTA POINTERS
			//----------------------------------------------------------------------------------------------------
		
			
			$("#map-area").append('<div id="points-loader"></div>');
			
			$.ajax({
				type: 'post',
				data: {
					'act' : 'Listar Points',
				},
				url : 'data/MapImage.php',
				timeout : 3000,
				dataType : 'json',
				success : function(data){				
					
					$("#map-area #points-loader").fadeOut(function(){$(this).remove()});
					
					var total = data.length;
				
					for(i=0;i < total;i++){	
						$("#map-area").append('<div id="'+data[i].id+'" onclick="editaPointer(this)" class="map-pointer" style="left:'+(data[i].posX-9)+'px;top:'+(data[i].posY-9)+'px"></div>');			
					}				
				},
				error : function(){
					alert('Erro ao carregar');
				}
			
			});			
		});	
	</script>
	

	<div id="map-image" >			
		<div id="map-holder">			
			<div id="map-area">
				<?php include('map_image/popEditPanel.php'); ?>
			</div>			
		</div>		
	</div> 

</body>
</html>
