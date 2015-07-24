
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
			
			
			<?php if(@$parent && empty($catid)): ?>
			<div class="form-item">
				<label for="catid">Todas as categorias</label>
				<select id="catid" name="catid">
					<option value=""></option>
					<?php 								
						$sql = mysql_query("SELECT * FROM categorias WHERE parent = '".$parent."' AND ativo = '1' ORDER BY pos ASC");
						while($r = mysql_fetch_object($sql)){
							echo '<option value="'.$r->id.'">'.$r->titulo.'</option>';
						}								
					?>
				</select>			
			</div>
			<?php else : ?>
			<input type="hidden" id="catid" name="catid" value="<?=$catid?>" />
			<?php endif; ?>
			
		</div>
		
		<div class="col2">
			<div class="form-item">
				<label for="status">Status do artigo</label>
				<select id="status">
					<option value=""></option>
					<option value="1">Ativos</option>
					<option value="0">Inativos</option>
				</select>			
			</div> 
			<div class="form-item">
				<label for="orderby">Ordenar por</label>
				<select id="orderby">
					<option value=""></option>
					<option value="data_desc">Mais recentes</option>
					<option value="data_asc">Mais antigos</option>
					<option value="views_desc">Mais lidos</option>
					<option value="views_asc">Menos lidos</option>
					<option value="pos_asc">Classificação do autor</option>
				</select>			
			</div>
			<div class="form-item">				
				<button id="go-filter" class="uiButton">Buscar</button>
			</div>
		</div>
		
	</form>	
	