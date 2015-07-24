/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */


CKEDITOR.editorConfig = function( config ) {
	
	//----------------------------------------------------------------------------------------------------------------------------
	// TOOLBAR 
	//----------------------------------------------------------------------------------------------------------------------------	
	config.toolbar_MyFull = [
		['Save','Preview','-','Templates','-','Source'],
		['Cut','Copy','Paste','PasteText','PasteFromWord','GeSHi','-','SpellChecker', 'Scayt'],
		['Undo','Redo','-','Find','Replace'],
		['RemoveFormat'],
		['Maximize'],
		'/',
		['Bold','Italic','Underline','Strike','-','Subscript','Superscript'],
		['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
		['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
		['Link','Unlink','Anchor'],
		['Smiley','SpecialChar'],
 		'/',
		['Format','Font','FontSize','TextColor'],
		['Image','Flash','MediaEmbed'],		
		['HorizontalRule','Table','CreateDiv']
		
	];
	
	config.toolbar_MiniMedia = [
        ['FontSize','TextColor','Bold','Italic','Underline','Strike'],	
		['Link','Unlink'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'],
		['Image','Flash','MediaEmbed']
    ];
	
	config.toolbar_MiniSave = [
        ['Save','FontSize','TextColor'],
        ['Bold','Italic','Underline','Strike'],	
		['Link','Unlink'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock']
    ];
	
	config.toolbar_Mini = [
        ['FontSize','TextColor','Bold','Italic','Underline','Strike'],	
		['Link','Unlink'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock']
    ];
	
	config.toolbar_MiniSimpleJustify = [
        ['TextColor'],
		['Bold','Italic','Underline','Strike'],
        ['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock']
    ];
	config.toolbar_MiniSimpleLink = [
        ['TextColor'],
		['Bold','Italic','Underline','Strike'],
		['Link','Unlink']
    ];
	config.toolbar_MiniSimple = [
        ['TextColor'],
		['Bold','Italic','Underline','Strike']
    ];
	
	config.toolbar_None = [];
	
	//----------------------------------------------------------------------------------------------------------------------------
	// EXTRA PLUGINS 
	//----------------------------------------------------------------------------------------------------------------------------
	config.extraPlugins = 'mediaembed';	
	//config.extraPlugins = 'codesnippetgeshi';
	
	//----------------------------------------------------------------------------------------------------------------------------
	// SMILEYS 
	//----------------------------------------------------------------------------------------------------------------------------
	/*
	config.smiley_path=CKEDITOR.basePath+'plugins/smiley/images/novos/';
	config.smiley_images = [
		'regular_smile.png','sad_smile.png','wink_smile.png','teeth_smile.png','confused_smile.png','tongue_smile.png',
		'embarrassed_smile.png','omg_smile.png','whatchutalkingabout_smile.png','angry_smile.png','angel_smile.png','shades_smile.png',
		'devil_smile.png','cry_smile.png','lightbulb.png','thumbs_down.png','thumbs_up.png','heart.png',
		'broken_heart.png','kiss.png','envelope.png'
	];
	config.smiley_descriptions = [
		'smiley', 'sad', 'wink', 'laugh', 'frown', 'cheeky', 'blush', 'surprise',
		'indecision', 'angry', 'angel', 'cool', 'devil', 'crying', 'enlightened', 'no',
		'yes', 'heart', 'broken heart', 'kiss', 'mail'
	];
	config.smiley_columns = 6;
	*/
	
	
};

