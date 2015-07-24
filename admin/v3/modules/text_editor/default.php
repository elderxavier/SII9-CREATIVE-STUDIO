

<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>


<?php	
	
	$uniqid   = @$params['uniqid'] ? $params['uniqid'] : 'textcontent';
	$content  = @$params['content']; 														 // conteúdo a ser editado - pode ser adicionado após via jquery	
	
	$idtext	  = @$params['idtext'];															 // id do artigo - (var idText) pode ser adicionado após via jquery 
	$datatype = @$params['datatype'];														 // mgto | prod | joom | txt | arq | cont | users | user
	$field	  = @$params['field'];															 // campo da tabela a ser acessado (se houver mais de um para o mesmo type) - none(default)					
	$intro	  = @$params['intro'];															 // nº caracteres | none(default)
	
	$toolbar  = @$params['toolbar'] ? $params['toolbar'] : 'MyFull'; 						 // MyFull | MiniMedia | MiniSave | Mini | MiniSimple
	$height   = @$params['height'] ? $params['height'] : ($toolbar == 'MyFull' ? 300 : 200);
	$ajaxfunc = isset($params['ajaxfunc']) ? $params['ajaxfunc'] : true;					 // se false carrega apenas o campo de texto sem form e sem funções ajax
	
	
	if($ajaxfunc){
		NWD::requiredParams($params, array('datatype'));
		$dataurl = NWD::resolveDataType($datatype);
	}		
	
	
?>

<link type="text/css" href="<?=$moduleUrl?>/css/text_editor.css" rel="stylesheet"  />

<script type="text/javascript" src="<?=$moduleUrl?>/ckeditor/ckeditor.js"></script>
<script type="text/javascript" src="<?=$moduleUrl?>/ckeditor/adapters/jquery.js"></script>
<script type="text/javascript" src="<?=$moduleUrl?>/ckeditor/ckfinder/ckfinder.js"></script>



<?php if($ajaxfunc): ?>
<script type="text/javascript">		
	
	var idText<?=$uniqid?> 		= '<?=$idtext?>';
	var isModified<?=$uniqid?> 	= false;
	var otherParams<?=$uniqid?>	= '';
	
	//------------------------------------------------------------------------------------------
	// LOAD TEXT
	//------------------------------------------------------------------------------------------
	function loadText<?=$uniqid?>(id){
	
		idText<?=$uniqid?> = id;
		
		var popLoader = $('#textEditor<?=$uniqid?> .uiPopLoader');
		var divStatus = $('#textEditor<?=$uniqid?> .uiStatus');		
		popLoader.show();		
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/<?=$dataurl?>",
			data: {
				'act'  : 'Load Text',
				'id'   : id,
				'field': '<?=$field?>',
				'others': otherParams<?=$uniqid?>
			},
			dataType: 'json',
			success: function(data){				
				//alert(data);
				if(data.return == true){
					divStatus.html('');	
					$("#text<?=$uniqid?>Form #<?=$uniqid?>").val(data.content);					
					$(document).trigger("text<?=$uniqid?>Loaded"); // dispara um evento ao terminar de carregar
				}
				else {
					divStatus.resultStatus({value: data.return});					
				}				
				popLoader.fadeOut();				
			},
			error: function(data){
				divStatus.html('');
				popLoader.fadeOut();
				//divStatus.html(JSON.stringify(data));
			}		
		});		
	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------
	//	SALVA O TEXTO
	//-----------------------------------------------------------------------------------------------------------------------	
	function text<?=$uniqid?>Save(){		
		
		isModified<?=$uniqid?> = false;
	
		var popLoader = $('#textEditor<?=$uniqid?> .uiPopLoader');
		var divStatus = $('#textEditor<?=$uniqid?> .uiStatus');
		popLoader.show();
		
		$.ajax({
			type: 'post',
			url: _fullpath +"/<?=$dataurl?>",
			data: { 
				'act'	  : 'Save Text',
				'id'	  : idText<?=$uniqid?>,
				'intro'	  : '<?=$intro?>',
				'field'	  : '<?=$field?>',
				'others'  : otherParams<?=$uniqid?>,
				'content' : $("#text<?=$uniqid?>Form #<?=$uniqid?>").val()			
			},
			success: function(data){
				if(data == true){
					divStatus.resultStatus({value: '<span class="success">Conteúdo atualizado com sucesso.</span>'});
					//divStatus.html('<span class="success">Conteúdo atualizado com sucesso.</span>');
				}
				else {
					divStatus.resultStatus({value: data});				
				}
				popLoader.fadeOut();
			},
			error: function(data, error){
				divStatus.html('');
				popLoader.fadeOut();
				alert('<?=$cfig['query timeout']?>');	
				//divStatus.html(data);
			}
		});		
	};	

</script>
<?php endif; ?>




<div id="textEditor<?=$uniqid?>" class="text-editor">
	
	<?php if($ajaxfunc): ?><form id="text<?=$uniqid?>Form" action="javascript:text<?=$uniqid?>Save()" class="text-form"><?php endif;?>	
		
		<script type="text/javascript">	
			$(function(){				
				
				
				$( '#textEditor<?=$uniqid?> #<?=$uniqid?>' ).ckeditor(
					function(){ 			
						CKFinder.SetupCKEditor(this,'<?=$moduleUrl?>/ckeditor/ckfinder/');						
					},{ 
						toolbar	 : '<?=$toolbar?>',
						height	 : <?=$height?>
					  }	
					  
				).ckeditorGet().on('key', function(e) {
					isModified<?=$uniqid?> = true;
				});
			});
			
			
			//---------------------------------------------------------------------------------------------------------------------------
			//	FUNÇÃO AO FECHAR A PÁGINA
			//---------------------------------------------------------------------------------------------------------------------------
			$(window).on('beforeunload', function() {
				if(isModified<?=$uniqid?>){
					return 'Algumas alterações no texto não foram salvas e serão perdidas. Deseja sair ?';
				}
			});			
		</script>
		
		<textarea id="<?=$uniqid?>" name="<?=$uniqid?>" style="display:none"><?=$content?></textarea>		
	
	<?php if($ajaxfunc): ?>
	</form>	
	<div class="uiStatus"></div>
	<div class="uiPopLoader"></div>
	<?php endif; ?>
	
</div>
	
	
	
	
	