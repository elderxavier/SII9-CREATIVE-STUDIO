
<?php defined( 'NWD_ACCESS' ) or die( 'Acesso restrito' ); 	?>

<?php 

	$locationUrl = @$urlvars['GET']['p'] ? 'http://'.$_SERVER['SERVER_NAME'].$urlvars['GET']['p'] : _fullpath;
	
?>

<script type="text/javascript">	

	$(function(){	
	
	
		$("#form-login").submit(function() {		
				
			var divStatus = $("#loginStatus");
			divStatus.html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');
			
			var options = {
				url: _fullpath +'/data/Login.php',
				type: 'post', 
				success: function(data) {
					if(data == true){				
						location.href= '<?=$locationUrl?>';						
					}
					else {
						divStatus.resultStatus({value:data});
					}
				},
				error: function() {
					alert('<?=$cfig['query timeout']?>');
				}
			}

			$(this).ajaxSubmit(options);
		
			return false;
			
		});	
		
		

		$("#form-esqueci").submit(function() {		
			
			var divStatus = $("#esqueciStatus");
			divStatus.html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');
			
			var options = {
				url: _fullpath +'/data/Login.php',
				type: 'post', 
				dataType: 'json',
				success: function(data) {					
					//alert(data)
					if(data.result == true){
					
						divStatus.html(data.message);
						
						$("#voltarBtn").text("Lembrei !");
						$("#naoLembreiBtn").show();
						$("#lembrarBtn").hide();
						$("#content-esqueci #email").attr({'disabled':'disabled'});						
					}
					else {
						divStatus.resultStatus({value:data.message});
					}
					
					
				},
				error: function() {
					alert('<?=$cfig['query timeout']?>');
				}
			}

			$(this).ajaxSubmit(options);
		
			return false;
			
		});	
		
		
function naoLembrei(){		
			
			var divStatus = $("#esqueciStatus");
			divStatus.html('<span class="loader">Carregando... <img src="<?=_fullpath?>/images/loading.gif"/></span>');
			
			$.ajax({
				type: 'post', 
				data: {	
					'act': 'Nao Lembrei',
					'email': $("#content-esqueci #email").val()
				},
				url: _fullpath +'/data/Login.php',				
				success: function(data) {					
					if(data == true){
						divStatus.html('<span class="success">Por favor, verifique sua caixa de emails.</span>');
						$("#voltarBtn").text("<< Voltar");
						$("#naoLembreiBtn").fadeOut();
					}
					else {
						divStatus.resultStatus({value:data});
					}
				},
				error: function() {
					alert('<?=$cfig['query timeout']?>');
				}
			});
			
		};	
		
		
		
		
		function openEsqueci(){
			$('#content-login').slideUp(function(){
				$('#content-esqueci').slideDown();				
				document.forms["form-login"].reset();
				$("#loginStatus").html('');
			});						
		}
		function voltarLogin(){
			$('#content-esqueci').slideUp(function(){
				$('#content-login').slideDown();				
				document.forms["form-esqueci"].reset();	
				$("#voltarBtn").text("<< Voltar");
				$("#naoLembreiBtn").hide();
				$("#lembrarBtn").show();
				$("#esqueciStatus").html('');
				$("#content-esqueci #email").removeAttr('disabled');
			});
			
		}
		
		
		
		
		$('#login #sendBtn').click(function(){$("#form-login").submit()});		
		$('#login #lembrarBtn').click(function(){$("#form-esqueci").submit()});		
		$('#login #naoLembreiBtn').click(naoLembrei);		
		
		$('#login #esqueciBtn').click(openEsqueci);
		$('#login #voltarBtn').click(voltarLogin);
		
		
	});
	
</script>
    
	
	<div id="login" class="uiPopUp half">
		
		<div id="content-login" class="uiPopContent">
			<h1 id="titulo" class="uiBoxTitle">Entre com seu<br/>USU&Aacute;RIO e SENHA</h1>
			<div class="uiPopHolder"> 
			
				<div id="loginStatus" class="uiStatus"></div>
				
				<form id="form-login" method="post">	
					<div class="form-item">
						<label>Usu&aacute;rio:</label>
						<input id="user" name="user" type="text">
					</div>
					<div class="form-item">
						<label>Senha:</label>
						<input type="password" id="pass" name="pass">
					</div>
					<input type="hidden" name="act" id="act" value="Login" />
					<input type="submit" style="display:none"/>
				</form>				
			</div>
			<div class="uiBoxBottom">					
				<button id="esqueciBtn" class="uiLinkButton">Esqueci minha senha</button>
				<button id="sendBtn" onclick="" class="uiButtonConfirm">Entrar</button>
			</div>
		</div>
		
		
		
		
		<div id="content-esqueci" class="uiPopContent" style="display:none">
			<h1 id="titulo" class="uiBoxTitle">Lembrete de SENHA</h1>
			<div class="uiPopHolder"> 
			
				<div id="esqueciStatus" class="uiStatus"></div>
				
				<form id="form-esqueci">	
					<div class="form-item">
						<label>Email:</label>
						<input type="text" id="email" name="email">
					</div>
					<input type="hidden" name="act" id="act" value="Lembrete Senha" />
					<input type="submit" style="display:none"/>
				</form>				
			</div>
			<div class="uiBoxBottom">					
				<button id="voltarBtn" class="uiLinkButton"><< Voltar</button>
				<button id="lembrarBtn" class="uiButtonConfirm">Lembrar</button>
				<button id="naoLembreiBtn" class="uiButtonConfirm" style="display:none">Ainda não lembrei</button>
			</div>
		</div>
		
		
		
	</div>

