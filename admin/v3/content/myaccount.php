
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); ?>

<script type="text/javascript">	
	
	$(function(){
	function myaccountLoad(){
			
			$('.contentLoader').fadeIn();

			$.ajax({
				type: 'post',
				data : {'act' : 'Load to Edit'},
				url: _fullpath +"/data/Myaccount.php",	
				dataType: 'json',
				timeout: 3000, 
				success: function(data) {			
						
					$('#formMyaccount #nome').val(data.nome);
					$('#formMyaccount #email').val(data.email);
					$('#formMyaccount #usuario').val(data.usuario);
					$('#formMyaccount #telefone').val(data.telefone);
					$('#formMyaccount #profissao').val(data.profissao);
					$("#formMyaccount #situacao option[value="+ data.situacao +"]").attr("selected","selected");					
					$('#myaccount #myImageHeadding').attr('src', data.imagem).load();
						
					$('.contentLoader').fadeOut();
					$('#formMyaccount').hideLabel();				
				},
				error: function() {					
					$('.contentLoader').fadeOut();
					alert('<?=$cfig['query timeout']?>');
				}
			});
		}
		
	
		$("#formMyaccount").submit(function() {

			var divStatus = $("#formMyaccount #myaccountStatus");
			divStatus.html('<span class="loader">Salvando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');
			
			var options = {
				url  :  _fullpath +"/data/Myaccount.php",	
				type : "post",
				success: function(data) {
					if(data == true){
						divStatus.resultStatus({value:'<span class="success">As informações foram salvas com sucesso.</span>'});
						$('#formMyaccount #nova_senha').val('');
						$('#formMyaccount #senha_confirm').val('')
						$('#formMyaccount #senha_atual').val('');
						$('#formMyaccount').hideLabel();
						$('#formMyaccount .senha_confirm_holder').slideUp();
					}
					else {
						divStatus.resultStatus({value:data,timer:5000});
						//divStatus.html(data);
					}			
				}
			}
			
			$(this).ajaxSubmit(options);	
			
			return false;			
		});
		
	
		myaccountLoad();
		$('#formMyaccount').hideLabel();
		$("#myaccount #openPopTextEditorBtn").click(function(){openPopTextFull(<?=$_SESSION['userid']?>)});
		$("#myaccount #openPopTextIntroBtn").click(function(){openPopTextIntro(<?=$_SESSION['userid']?>)});
		
	
		$('#formMyaccount #nova_senha').keyup(function(){
			if($(this).val() != ""){
				$('#formMyaccount .senha_confirm_holder').slideDown();
			}
			else {
				$('#formMyaccount .senha_confirm_holder').slideUp();
			}
		});
		
	});
</script>



<div id="myaccount" class="page-content">

	<h1 class="contentheader">Meus Dados</h1>		
		
	<div class="menu-actions">			
		<?php 
			if(@$_PARAM['imgintro']){ echo '<img id="myImageHeadding" src="'._fullpath.'/images/no-image.png" title="Editar imagem de introdução" class="tooltip"/>';	}
			if(@$_PARAM['editor']){ echo '<button id="openPopTextEditorBtn" class="uiButton">Texto de apresentação</button>'; }
			if(empty($_PARAM['editor']) && (@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor')){echo '<div id="openPopTextIntroBtn" class="uiButton">Texto de introdução</div>' ;} 
		?>		
	</div>
	
	<div class="form-holder">	
		<form id="formMyaccount" class="formMyaccount">	
			<div class="col1">
				<div class="form-item">
					<label for="nome">Nome *</label>
					<input type="text" id="nome" name="nome"/>
				</div>	
				<div class="form-item">
					<label for="email">Email *</label>
					<input type="text" id="email" name="email" />
				</div>				
				<div class="form-item">
					<label for="telefone">Telefone</label>
					<input type="text" id="telefone" name="telefone"/>
				</div>
				<div class="form-item">
					<label for="profissao">Profissão</label>
					<input type="text" id="profissao" name="profissao"/>
				</div>				
			</div>
					
			<div class="col2">
				<div class="form-item">
					<label for="usuario">Usuário *</label>
					<input type="text" id="usuario" name="usuario"/>
					<span class="uiHelper tooltip" title="Nome de usuário que será utilizado para acessar o painel"></span>
				</div>				
				<div class="form-item">
					<label for="nova_senha">Nova senha</label>
					<input type="password" id="nova_senha" name="nova_senha"/>
					<span class="uiHelper tooltip" title="Informe este campo apenas se desejar mudar sua senha atual"></span>
				</div>
				<div class="senha_confirm_holder" style="display:none">
					<div class="form-item">
						<label for="senha_confirm">Confirmar nova senha *</label>
						<input type="password" id="senha_confirm" name="senha_confirm"/>
					</div>
					<div class="form-item" >
						<label for="lembrete">Lembrete de senha</label>
						<input type="text" id="lembrete" name="lembrete"/>
					</div>
				</div>				
				<div class="form-item important">
					<label for="senha_atual">Confirmar senha atual *</label>
					<input type="password" id="senha_atual" name="senha_atual"/>
					<span class="uiHelper tooltip" title="Este campo deve obrigatoriamente ser preenchido ao salvar as informações"></span>
				</div>
			</div>			
			<div class="form-item actions">
				<div id="myaccountStatus" class="uiStatus"></div>
				<button id="myaccountSaveBtn" class="uiButtonConfirm">Salvar</button>
			</div>					
			<input type="hidden" id="act" name="act" value="Save Edit" />					
					
		</form>	
	</div>
	
	<?php if(@$_PARAM['imgintro']){include('content/myaccount/popIntroImage.php');} ?>
	<?php if(@$_PARAM['content']){include('content/texteditor/popTextFull.php');} ?>
	<?php if(empty($_PARAM['content']) && (@$_PARAM['intro'] == 'textarea' || @$_PARAM['intro'] == 'minieditor')){include('content/texteditor/popTextIntro.php');} ?>

</div>


