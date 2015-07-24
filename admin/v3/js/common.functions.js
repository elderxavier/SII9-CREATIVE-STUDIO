

	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// NL2BR
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	function js_nl2br(str, is_xhtml) {

	  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; 

	  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
	}

	
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// HIDE LABEL
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	$.fn.hideLabel = function(){	
		
		$(this).find('input[type="text"], input[type="password"], textarea, select').each(function(){				
		
			var $item  = $(this);			
			var itemid = $item.attr('id') ? $item.attr('id') : $item.attr('name'); 
			var $label = $item.parent().find('label[for="'+ itemid +'"]');
			
			mTop = $item.css('padding-top');
			mLeft = $item.css('padding-left');
			$label.css({'position':'absolute', 'width':'auto', 'margin': mTop+' 0 0 '+mLeft, 'padding':'0'});			
			var posX   = $item.offset().left - $item.parent().offset().left;			
			$label.css({'left':posX+'px'});		
			
			
			$item.focus(labelHide).focusout(labelToogle).change(labelToogle);
			
			function labelToogle(){
				if($(this).val() == ''){
					$label.show();
				}
				else {
					labelHide();
				}
			}
			
			function labelHide(){
				$label.hide();				
			}
			
			
			// já é padrão no label-for
			//$label.click(function(){
			//	$item.click(); 
			//});
			
			$item.focusout();
			
		});
		
	};
	
	
	
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
	// RESULT STATUS (com timer)
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

			$obj = $(this);
			$obj.html('');
			$obj.append(settings.value).css({'display':'none'}).fadeIn();
			
			timeResultStatus = setTimeout(function(){
				//$obj.children().slideUp(function(){$(this).remove()});
				$obj.children().animate({height:'0px', paddingTop: '0px', paddingBottom: '0px', opacity: '0'}, 500, function(){$(this).remove()});
			}, settings.timer);
		
		});
		
	}


	//-----------------------------------------------------------------------------------------------------------------------------------------------
	/* AJAX FORM SUBMIT */
	//-----------------------------------------------------------------------------------------------------------------------------------------------
	// requer plugin ajax.form 

	$.fn.ajaxFormSubmit = function(options){		

		return this.each(function(){

			var settings = $.extend({
				'type'			: $(this).attr('method'),
				'url'			: $(this).attr('action'),
				'divResult'		: $(this).find('.result'),
				'success'		: 'As Informações foram atualizadas com sucesso.'
			}, options);

			$(this).submit(function(e){         

				e.preventDefault();
	           
	            $(this).ajaxSubmit({
	                type : settings.type,
	                url : settings.url,
	                success : function(data){

	                    if(data == true){
	                        settings.divResult.resultStatus({'value':  settings.success});
	                    }
	                    else {
	                        settings.divResult.resultStatus({'value': data});
	                    }
	                },
	                error : function(){
	                    settings.divResult.html('Erro de resposta!');
	                }
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
				'act'	: ($(this).attr('id') ? $(this).attr('id') : $(this).attr('name'))+ ' Load'
			}, options);	
			
			var _thisForm = $(this);
	       
	        $.ajax({
	            type: settings.type,
	            url: settings.url,
	            data: {
	                'act': settings.act
	            },
	            dataType: 'json',
	             success: function(data){
	                $.each(data, function(index, value){
	                    _thisForm.find('#'+index).val(value);
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
	
	
	