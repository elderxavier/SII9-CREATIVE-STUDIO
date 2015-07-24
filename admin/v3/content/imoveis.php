
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<?php	
	
	$_PARAM['datatype'] = 'imob'; 
?>

<?php

				
	function labelMore($_PARAM){
	
		$subtipos 	= @$_PARAM['subtipos'];	
		
		$labelMore  = '<div class="label-more-holder" >';
		$labelMore .= '<ul class="label-content">';
		$labelMore .= '<li><a href="javascript:;" onclick="openPopMoreImages(\'+id+\',0)">Galeria principal</a></li>';
		for($i=1; $i < $subtipos+1; $i++){			
			
			$sbNome = @$_PARAM['subtipo'.$i] ? $_PARAM['subtipo'.$i] : 'Galeria '.$i;
			
			$labelMore .= '<li><a href="javascript:;" onclick="openPopMoreImages(\'+id+\','.$i.')">'.$sbNome.'</a></li>';
		}		
		$labelMore .= '</ul>';
		$labelMore .= '</div>';	
		
		return $labelMore;
	}
	
?>


<script type="text/javascript">

	function moreLabelImagesEnter(id){		
		<?php if(@$_PARAM['subtipos']): ?>		
			$('#list-items #item'+id).find('.imagens').html('<?=labelMore($_PARAM)?>');	
		<?php else: ?>
			openPopEnviaImagens(id);
		<?php endif; ?>
	}
	function moreLabelImagesLeave(obj){
		$(obj).html('');
	}	
	function openPopMoreImages(id, tipo){
		
		var idResolve = tipo > 0 ? id+'_'+tipo : id;
		
		openPopEnviaImagens(idResolve);
		
	}	
	
var onChangeSelect;
	var initItem;
	var calls = 0;
	var listItensLocked = false;
	
	$(function(){		
		
		var dataHolder	= $("#list-items");
		
	
		initItem = function(){
			dataHolder.html('');
			calls = 0;
			listItensLocked = false;
			listItens();
		}		
		
		
		function listItens(){
		
			if(!listItensLocked){
				
				listItensLocked = true;
				
				$('.contentLoader').fadeIn();
			
				$.ajax({
					type: 'post',
					data : {'act'			: 'Listar',
							'tipo'			: $("#filter #tipo").val(),					
							'status'		: $("#filter #status").val(),					
							'searchword'	: $("#filter #searchword").val(), 
							'activestate' 	: $("#filter #activestate").attr('checked') ? 1 : 0,
							'inactivestate' : $("#filter #inactivestate").attr('checked') ? 1 : 0,
							'cidade'		: $("#filter #cidade").val(),
							'calls'			: calls
						   },
					url: _fullpath + '/data/Imoveis.php',	
					dataType: 'json',
					timeout: 8000, 
					success: function(data) {
						
						calls++;				
				
						$('.contentLoader').fadeOut();
				
						var listLength = data.length;
					
						if(listLength > 0){
							
							var i = 0;
							function addItem(){
								
								dataHolder.append(data[i].item).children().fadeIn();
							
								i++; 
								if(i < listLength){										
									setTimeout(addItem,30);										
								}
								else {
									listItensLocked = false;
								}
							}
							addItem();							
						}
						
						if(listLength < <?=$cfig['query list limit']?>){ 
							$('#itemExpandBtn').fadeOut();
							listItensLocked = true;
						}
						else {
							$('#itemExpandBtn').fadeIn();
						}
			
					},
					error: function(data,error) {						
						//alert(JSON.stringify(data));
						$('.contentLoader').fadeOut();
						listItensLocked = false;
						alert('<?=$cfig['query timeout']?>');
						
					}
				});
			}
		}
		
		initItem();	
		
		$('#itemExpandBtn').click(listItens);
		$("#filter #go-filter").click(initItem);
		
		$('#filter').hideLabel();			
		
	});
	
	function moreMouseEnter(id){
		$('#item'+id+' .more .label-more-holder').css({'display':'block'});
	}
	function moreMouseLeave(id){
		$('#item'+id+' .more .label-more-holder').css({'display':'none'});
	}
		
		

	function selectPopEditor(id){		
		openPopTextFull(id);
	}	

		
var publicarLocked = false;
	
	function publicarItem(id){	
	
		if(!publicarLocked){
		
			publicarLocked = true;
			
			var value = $('#list-items #item'+id).hasClass('disabled') ? 1 : 0;
			
			$.ajax({
				type: 'post',
				data: {
					'act': 'Publicar',
					'id': id,
					'value': value
				},
				url: _fullpath +'/data/Imoveis.php',
				timeout: 3000,
				success: function(data){
					if(data == 'enabled'){
						$('#list-items #item'+id).removeClass('disabled').addClass('enabled');
					}
					if(data == 'disabled'){
						$('#list-items #item'+id).addClass('disabled').removeClass('enabled');
					}
					publicarLocked = false;			
				},
				error: function(){
					publicarLocked = false;	
				}
			});			
		}		
	}

</script>

<?php if(@$_PARAM['arqs']!= 'true'){ echo '<style>.uiList .item .moreItensBtn.arqs {display: none;}</style>'; } ?>

<div id="<?=$urlvars[1]?>" class="page-content">	
	
	<h1 class="contentheader">Gerenciar Imóveis</h1>
	
	<div id="filter" class="filter">		
		<div class="col1">
			<div class="form-item">
				<label for="searchword">Nome do imóvel</label>
				<input type="text" id="searchword" />			
			</div>
			<div class="form-item">
				<label for="cidade">Cidades</label>
				<select id="cidade">
					<option value=""></option>
					<?php
						$sql = mysql_query("SELECT * from cidades_ativo ORDER BY pos ASC");
						while($r = mysql_fetch_object($sql)){
							echo '<option value="'.$r->id.'">'.$r->nome.'</option>';
						}
					?>
				</select>
			</div> 
		</div>
		<div class="col2">
			<div class="form-item">
				<label for="tipo">Categorias</label>
				<select id="tipo">				
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
				<label for="status">Situação da obra</label>
				<select id="status" name="status">
					<option value=""></option>
					<?php
						//$sql = mysql_query("SELECT * from imoveis_status WHERE ativo = '1' ORDER BY pos ASC");
						//while($r = mysql_fetch_object($sql)){
						//	echo '<option value="'.$r->id.'">'.$r->titulo.'</option>';
						//}
					?>
				</select>
			</div> 
			-->
		</div>
		<div class="form-item ativos">
			<input type="checkbox" id="activestate" value="1" checked><span class="checklabel">Ativos</span>
			<input type="checkbox" id="inactivestate" value="1" checked><span class="checklabel">Inativos</span>
		</div>		
		<div class="form-item">
			<button id="go-filter" class="uiButton">Buscar</button>
		</div>
	</div>	
	
	<button id="addNewItemBtn" class="uiAddButton">Adicionar Item</button>
	
	<div class="break"></div>
	
	<ul id="list-items" class="uiList"></ul>
	
	<div id="after-list">
		<a href="javascript:;" id="itemExpandBtn" class="uiLinkButton" style="display:none">Carregar mais itens</a>		
	</div>
	
	<?php include('content/imoveis/popAddItem.php'); ?>
	<?php include('content/imoveis/popDelItem.php'); ?>	
	<?php include('content/texteditor/popTextFull.php'); ?>
	
	<?php if(@$_PARAM['arqs'] == 'true'){include('modules/arquivos_multiupload/popEnviaArquivos.php');} ?>
	<?php if(@$_PARAM['imgvalues']){include('modules/imagens_multiupload/popEnviaImagens.php');} ?>
	
</div>
