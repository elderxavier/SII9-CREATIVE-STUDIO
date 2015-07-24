
<script type="text/javascript">
	$(function(){
	
		$(".logoutBtn").click(function(e){
			e.preventDefault();
			
			$.ajax({
				url: _fullpath+'/data/Login.php', 
				type: 'post',
				data:{'act':'Logout'},
				success: function(data){
					if(data==true){						
						location.href= _fullpath+'/0/login';
					}
				}				
			});
		
		});
	
	});
</script>


<a href="" class="logoutBtn tooltip" title="Sair">Logout</a>