
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

	
	
	<script type="text/javascript">
		$(function(){
			$('#filter').hideLabel();
		});
	</script>
	
	
	<form id="filter" class="filter">
		
		<h3 class="componentheadding">Filtrar</h3>
		
		<div class="col1">			
			<div class="form-item">
				<label for="searchword">Procurar por nome</label>
				<input type="text" id="searchword"/>				
			</div>	
			<div class="form-item half">
				<label for="dataIni">De</label><input type="text" id="dataIni" class="datepicker"/>
			</div>
			<div class="form-item half">
				<label for="dataFin">Até</label><input type="text" id="dataFin" class="datepicker"/>
			</div>			
		</div>
		
		<div class="col2">
			<div class="form-item">
				<label for="nivel">Nível do usuário</label>
				<select id="nivel">
					<option value=""></option>
					<?php 
						$sql = mysql_query("SELECT * FROM usuarios_niveis WHERE nivel > '".$_SESSION['usernivel']."' ORDER BY nivel ASC");
						while($r = mysql_fetch_object($sql)){
							echo '<option value="'.$r->nivel.'">'.$r->titulo.'</option>';
						}
					?>
				</select>			
			</div>
			<div class="form-item">
				<label for="situacao">Status do usuário</label>
				<select id="situacao">
					<option value=""></option>
					<?php include('content/usuarios/components/situacao_select_options.php'); ?>
				</select>			
			</div> 						
			<div class="form-item">
				<button id="go-filter" class="uiButton">Buscar</button>
			</div>
		</div>
		
	</form>	
	