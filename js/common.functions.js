

	
	//----------------------------------------------------------------------------------------------
	// MENU MOBILE
	//-----------------------------------------------------------------------------------------------
	
	$.fn.menuMobile = function(options){
		
		var settings = $.extend({
			'minWidth' : 767
		}, options);

		return this.each(function(){
			
			var target  = $(this);
			var navIcon = $('<div>', {class: 'mobile-nav-icon', style: 'display:none'});
			var sleepResize = 0;

			target.parent().prepend(navIcon);
			
			
			// click do nav icon - abre o menu
			//------------------------------------
			navIcon.click(function(){
				if(target.is(':visible')){				
					target.slideUp();
					$(this).removeClass('opened');
				}
				else {
					target.slideDown();
					$(this).addClass('opened');
				}
			});		

			// função de resize
			//--------------------------
			function onWindowResize(){			
				
				var W = $(window).width();

				if(W < settings.minWidth){
					if(!navIcon.is(':visible')){
						navIcon.show();
						target.removeClass('navigation-menu').addClass('mobile-nav');
						if(navIcon.hasClass('opened')){
							target.show();
						}
						else {
							target.hide();
						}										
						// click do dropdown - abre o submenu
						target.find('.dropdown a').click(function(e){
							e.preventDefault();
							$(this).parent().find('ul:first').slideToggle();
						});
					}
				}
				else {
					navIcon.hide();
					target.removeClass('mobile-nav').addClass('navigation-menu').show();
					target.find('ul').css({'display':''});
					target.find('.dropdown a').off('click');
				}
			}

			onWindowResize();
			var timeResize = 0;
			$(window).resize(function(){
				if(timeResize > 0 ){clearTimeout(timeResize);}
				timeResize = setTimeout(onWindowResize, 100);
			});
		});
	}


	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// LISTA COM SUBLIST - SHOW HIDE
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	

	$.fn.showHideList = function(options){

		var settings = $.extend({
			'hideParent' : true,
			'icoList' : true
		}, options);
		
		return this.each(function(){
			
			var target = $(this);	
			
			target.find('li').each(function(){
				var item = $(this);		

				// se o item possuir sub-lista
				if(item.find('ul').length > 0){ 
					item.addClass('dropdown'); // adiciona a classe dropdown
					if(settings.icoList){
						item.append('<i class="ico ico-list-arrow"></i>'); // adiciona o ico-list ao item
					} 

					// adiciona a função ao evento click
					item.find('a:first').click(function(e){ 
						e.preventDefault();						
						
						// se o item estiver aberto	
						if(item.find('ul').is(':visible')){ 
							item.removeClass('active').find('ul').slideUp(); // apenas fecha as sublistas deste item e remove a classe active
						}
						else {
							if(settings.hideParent){
								target.find('.active').removeClass('active').find('ul').slideUp(); // fecha as sublistas abertas
							}						
							item.find('ul:first').slideDown(); // mostra a sublista do próximo nivel deste item
							item.addClass('active'); // adiciona a classe active ao item
						}
					});
				}
			});
		});
	}	

	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// POP UPS
	//-----------------------------------------------------------------------------------------------------------------------------------------------	

	// pop up show

	$.fn.popUpShow = function(){
	
		return this.each(function(){
		
			var lastIndex = parseInt($('body div:last').css('z-index'));
			lastIndex = lastIndex > 0 ? lastIndex : 1;
			$(this).css({'margin-top': -($(this).height()/2+10)+'px', 'z-index': (lastIndex+2)}).fadeIn('fast');		
			$(this).parent().append('<div class="uiPopUpOverlay" style="z-index:'+(lastIndex+1)+'"></div>');
		
		});
	
	};	
	
	// pop up hide
	
	$.fn.popUpHide = function(){
		return this.each(function(){
			$(this).fadeOut('fast');
			$(this).parent().find(".uiPopUpOverlay:last").remove();
		});
	}
	
	
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// ALERTS RESULT (com timer)
	//-----------------------------------------------------------------------------------------------------------------------------------------------	
	var timeResultStatus = 0;
	$.fn.resultStatus = function(options){
		
		// atualizar: fazer uma função close caso não seja setada a variavel timer 

		var settings = $.extend({
			'value' : '',
			'timer' : 3000
		}, options);
		
		
		return this.each(function(){
		
			clearTimeout(timeResultStatus);		

			var Obj = $(this);
			Obj.html('');
			Obj.append(settings.value).css({'display':'none'}).fadeIn();
			
			timeResultStatus = setTimeout(function(){
				Obj.children().animate({height:'0px', paddingTop: '0px', paddingBottom: '0px', opacity: '0'}, 500, function(){$(this).remove()});
			}, settings.timer);
		
		});
		
	}

	//-----------------------------------------------------------------------------------------------------------------------------------------------
	/* ALERTS BOOTSTRAP */
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	/* Warning messages */

	$.fn.showBootstrapAlert = function(options){
		
		var settings = $.extend({
			'message' : '&nbsp;',
			'type' : 'alert-info' 	 // alert-success | alert-info | alert-warning | alert-danger
		}, options);

		return this.each(function(){

			var alertItem = '';

			alertItem  = '<div class="alert '+ settings.type +' alert-dismissable" >';
	        alertItem += '<button class="close" aria-hidden="true" data-dismiss="alert" type="button">×</button>';
	        alertItem +=  settings.message;
	        alertItem += '</div>';

			$(this).html(alertItem); 

		});

	};


	//-----------------------------------------------------------------------------------------------------------------------------------------------
	/* AJAX FORM SUBMIT */
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// requer plugin ajax.form 

	$.fn.ajaxFormSubmit = function(options){		

		return this.each(function(){

			var settings = $.extend({
				type		: $(this).attr('method'),
				url			: $(this).attr('action'),
				divResult	: $(this).find('.result'),
				successMsg	: 'As Informações foram atualizadas com sucesso.',
				success 	: function(data){
					if(data == true){	                       
	                    settings.divResult.resultStatus({'value': '<p>'+ settings.successMsg +'</p>'});
	                    $(document).trigger('AjaxFormTrue');
	                }
	                else {
	                    settings.divResult.resultStatus({'value': '<p>'+ data +'</p>'});
	                    $(document).trigger('AjaxFormFalse');	
	                }
				},
				error : function(data){
					settings.divResult.html('Erro de resposta!');
					$(document).trigger('AjaxFormError');	
				}

			}, options);

			$(this).submit(function(e){         

				e.preventDefault();			
	           
	            $(this).ajaxSubmit({
	                type : settings.type,
	                url : settings.url,
	                success : settings.success,
	                error : settings.error
	            });

	        });

	    });

	}


	//------------------------------------------------------------------------------------------------------------------------------------------
	// AJAX FORM LOAD
	//------------------------------------------------------------------------------------------------------------------------------------------
	$.fn.ajaxFormLoad = function(options){

		return this.each(function(){

			var settings = $.extend({
				'type'	: $(this).attr('method'),
				'url'	: $(this).attr('action'),
				'act'	: ($(this).attr('id') ? $(this).attr('id') : $(this).attr('name'))+ ' Load',
	            'vars'  : ''
			}, options);	
			
			var thisForm = $(this);
	       
	        $.ajax({
	            type: settings.type,
	            url: settings.url,
	            data: {
	                'act': settings.act,
	                'vars': settings.vars
	            },
	            dataType: 'json',
	             success: function(data){
	                $.each(data, function(index, value){	                   
	                   var item = thisForm.find('#'+index).length ? _thisForm.find('#'+index) : _thisForm.find('name["'+ index +'"]');
	                   item.val(value);
	                });
	            }
	        });		

	    });

	}
	
	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// HACK IMG FLOAT - tira o espaço oposto da imagem de conteúdo
	//-----------------------------------------------------------------------------------------------------------------------------------------------	
	$.fn.hackImgFloat = function(){
			
		$(this).find('img').each(function(){
		
			$j(this).css('max-width', '100%');

			var thisFloat = $(this).css("float");			
			if(thisFloat == 'right'){
				$(this).css('margin-right','0');
			}
			if(thisFloat == 'left'){
				$(this).css('margin-left','0');
			}				
		});
	};


	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// HIDE FORM LABEL
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	$.fn.hideFormLabel = function(){	
		
		$(this).find('input[type="text"], input[type="password"], textarea, select').each(function(){				
		
			var item  	= $(this);			
			var itemid 	= item.attr('id') ? item.attr('id') : item.attr('name'); 
			var label 	= item.parent().find('label[for="'+ itemid +'"]');
				label 	= label.attr('for') ? label : item.parent().find('label'); // se não encontrou o label for, tenta encontrar um label sem identificador
				
			
			var mTop  = item.css('padding-top');
			var mLeft = item.css('padding-left');
	
			label.css({
				'position'	: 'absolute', 
				'width'		: 'auto',
				'padding'	: 0,
				'margin'	: 0,
				'top'		: mTop, 
				'left'		: mLeft,							 
				'z-index'	: 2
			});			
			
			item.focus(labelHide).focusout(labelToogle).change(labelToogle);
			
			function labelToogle(){
				if((this).val() == ''){
					label.show();
				}
				else {
					labelHide();
				}
			}
			
			function labelHide(){
				label.hide();				
			}
			
			// já é padrão no label-for
			label.click(function(){
				item.focus(); 
			});
			
			item.focusout();
			
		});
		
	};


	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// NL2BR
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	function js_nl2br(str, is_xhtml) {

	  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; 

	  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}


	//------------------------------------------------------------------------------------------------
	// PAGE SCROLLING
	// Rola o conteúdo da página ao clicar
	//------------------------------------------------------------------------------------------------
	$.fn.pageScrolling = function(options){
		
		var settings = $.extend({
			'easing' : '',
			'animationTime' : 1500
		}, options);

		return this.each(function(){	

			$(this).find('a').bind('click', function(event) {
		        var $anchor = $(this);
		      
		        $('html, body').stop().animate({
		            scrollTop: $($anchor.attr('href')).offset().top
		        }, settings.animationTime, settings.easing);

		        $(this).parent().parent().find('.active').removeClass('active');
		        $(this).parent().addClass('active');

		        $('#menuprincipal.mobile-nav').fadeOut('fast');

		        event.preventDefault();
		    });
		    
		});
	}



	
	
	