

<script type="text/javascript">
	$(function(){
			
		$.scrollUp();
					
		$('.draggable').draggable({ handle: '.uiBoxTitle, .uiBoxBottom', cursor: 'move' });
		$('.resizable').resizable();			
		$('.sortable').sortable({cursor: 'move'});			
		$('.tooltip').tooltip({show:{effect:"slideDown",delay: 250}});		  
		$('.page-title').mouseenter(function(){
			$(this).find('.titleEditBtn').css({'display':'block'});
		}).mouseleave(function(){
			$(this).find('.titleEditBtn').css({'display':'none'});
		});

		$(".fancybox").fancybox({
			openEffect : 'elastic',
			openSpeed  : 150,
			closeEffect : 'elastic',
			closeSpeed  : 150,
			loop  : false,
			helpers : {
				overlay : null,
				title: {
					type: 'inside'
				}
			},
			beforeLoad: function() {
				this.title = $(this.element).parent().find('.title-caption').html();
			}
		});
		
		$(".fancyframe").fancybox({
			maxWidth	: 800,
			maxHeight	: 600,
			fitToView	: false,
			width		: '70%',
			height		: '70%',
			autoSize	: false,
			closeClick	: false,
			openEffect	: 'none',
			closeEffect	: 'none',
			helpers : {
				title: {
					type: 'inside'
				}
			},
			beforeLoad: function() {
				this.title = $(this.element).parent().find('.title-caption').html();
			}
		});
			
	});	
	var _fullpath = '<?=_fullpath?>';	
</script>