

<script type="text/javascript">
	$(function(){
		$("#intro").height($('.left-collumn').height()-13);	
	});
</script>


<div id="intro" class="page-content" >
		<h1 class="contentheader" style="text-align:left">Bem vindo <?php echo @$_SESSION["username"]; ?> !</h1>
		Este é o seu painel de administração.<br/>
		Escolha o item que deseja administrar no menu ao lado.
</div>