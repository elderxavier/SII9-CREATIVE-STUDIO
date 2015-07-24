$(document).ready(function(){
	ancora_menu();
	oque_fazemos();
	contato();
	planos();

	$('img').css({'max-width':'100%'});
	$('#menu').menuMobile(); 


	var timeResize = 0;
	$(window).resize(function(){
		if(timeResize > 0 ){clearTimeout(timeResize);}
		timeResize = setTimeout(initApp, 100);
	});

});


function initApp(){  

	$("#studio .carousel").jCarouselLite({
		btnNext: "#studio .next",
		btnPrev: "#studio .prev"
	});


	$(".fancybox-effects-d").fancybox({
		padding: 0,

		openEffect : 'elastic',
		openSpeed  : 150,

		closeEffect : 'elastic',
		closeSpeed  : 150,

		closeClick : true,

		helpers : {
			title : {
				type : 'float'
			}
		}
	});
	$('.fancybox-thumbs').fancybox({
		prevEffect : 'none',
		nextEffect : 'none',

		closeBtn  : false,
		arrows    : false,
		nextClick : true,

		helpers : {
			thumbs : {
				width  : 50,
				height : 50
			}
		}
	});
	$('.fancybox-thumbs-2').fancybox({
		prevEffect : 'none',
		nextEffect : 'none',

		closeBtn  : false,
		arrows    : false,
		nextClick : true,

		helpers : {
			thumbs : {
				width  : 50,
				height : 50
			}
		}
	});
	

	$("#feature-carousel-holder .feature-carousel").featureCarousel({
		trackerIndividual: false,
		trackerSummation: false,
		autoPlay: false,
		leftButtonTag:  '#feature-carousel-holder .carousel-left',
		rightButtonTag: '#feature-carousel-holder .carousel-right'
	});

	cases();

}






//ancora menu
function ancora_menu(){
	$('#menu a, #topo a, #planos a').click(function(){
      var alvo = $(this).attr('href').split('#').pop();
      $('html, body').animate({scrollTop: $('#'+alvo).offset().top - 100 }, 1700);
      return false;
   });
}










function contato(){
	$(".link-entre-em-contato").click(function(){
		$(".link-entre-em-contato").fadeOut(100);
		$(".form-entre-em-contato").fadeIn(100);
	});

	$(".fechar-form").click(function(){
		$(".form-entre-em-contato").fadeOut(100);
		$(".link-entre-em-contato").fadeIn(100);
	});


	$(".link-solicite-orcamento").click(function(){
		$(".link-solicite-orcamento").fadeOut(100);
		$(".form-entre-em-contato-2").fadeIn(100);
	});

	$(".fechar-form-2").click(function(){
		$(".form-entre-em-contato-2").fadeOut(100);
		$(".link-solicite-orcamento").fadeIn(100);
	});
}






function oque_fazemos(){
	$(".box-1 .box-img ul li:eq(0)").click(function(){
		$(".box-1").fadeOut(300);
		$(".box-2,.ico-menu").fadeIn(300);
	});

	$(".box-1 .box-img ul li:eq(1)").click(function(){
		$(".box-1").fadeOut(300);
		$(".box-3,.ico-menu").fadeIn(300);
	});

	$(".box-1 .box-img ul li:eq(2)").click(function(){
		$(".box-1").fadeOut(300);
		$(".box-4,.ico-menu").fadeIn(300);
	});

	//------------------------------------------

	$(".ico-menu li:eq(0)").click(function(){
		$("#box-principal .box").fadeOut(300);
		$(".box-3,.ico-menu").fadeIn(300);
	});

	$(".ico-menu li:eq(1)").click(function(){
		$("#box-principal .box").fadeOut(300);
		$(".box-2,.ico-menu").fadeIn(300);
	});

	$(".ico-menu li:eq(2)").click(function(){
		$("#box-principal .box").fadeOut(300);
		$(".box-4,.ico-menu").fadeIn(300);
	});
}














function planos(){
	$(".plano-light").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-1").fadeIn(300);
	});

	$(".plano-gold").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-2").fadeIn(300);
	});

	$(".plano-premium").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-3").fadeIn(300);
	});

	$(".plano-sii9fit").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-4").fadeIn(300);
	});

	$(".plano-premiumfull").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-5").fadeIn(300);
	});

	$(".plano-platinumfull").click(function(){
		$(".plano-descricao, #planos .box").fadeOut(300);
		$(".box-planos,.plano-6").fadeIn(300);
	});
}













function cases(){

 	var $container = $('#cases-gallery');
 	$container.isotope({
 		filter: $("#cases-filter li:first").attr('data-filter')
 	});
 	$('#cases-filter li').click(function(){
		var selector = $(this).attr('data-filter');
		$container.isotope({ filter: selector });
		return false;
	}); 

}



/*
function cases(){
	$(".menu-case li").click(function(){
		var index = $(this).index();

		$(".menu-case li").removeClass("ativo");
		$(".menu-case li:eq("+index+")").addClass("ativo");
	});
	

	$(".menu-case li:eq(0)").click(function(){
		$(".cases").fadeOut(300);
		$("#recentes").fadeIn(300);
	});

	$(".menu-case li:eq(1)").click(function(){
		$(".cases").fadeOut(300);
		$("#logotipos").fadeIn(300);
	});

	$(".menu-case li:eq(2)").click(function(){
		$(".cases").fadeOut(300);
		$("#identidade-completa").fadeIn(300);
	});
}
*/