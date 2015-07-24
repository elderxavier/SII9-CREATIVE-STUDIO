var lz_chat_full_load = true;
var lz_chat_status_change = true;
var lz_chat_last_post_received = null;
var lz_chat_last_message_received = null;
var lz_chat_last_poster = null;
var lz_operator = null;
var lz_sound_available = false;
var lz_sound_player = null;
var lz_external = new lz_chat_external_user();
var lz_chat_connecting = false;
var lz_chat_application = false;
var lz_ticket = null;
var lz_chat_state_expanded = false;
var lz_timer_typing = null;
var lz_timer_connecting = null;
var lz_header_text = "";
var lz_header_bot_text = "";
var lz_sound_format = "ogg";
var lz_chat_id = "";
var lz_closed = false;
var lz_chat_waiting_posts_timer;
var lz_chat_invite_timer = null;
var lz_desired_operator = null;
var lz_last_post = "";
var lz_leave_message_required = false;
var lz_chat_talk_to_human = false;
var lz_chat_scrolled = false;
var lz_change_name = null;
var lz_change_email = null;
var lz_chat_botmode = false;
var lz_input_chat_name_required = false;
var lz_input_chat_email_required = false;
var lz_input_required = false;
var lz_leave_chat = false;

function lz_chat_set_focus(_chat)
{
    try
    {
        if(document.getElementById("lz_chat_overlay_options_box").style.display != "none")
            return;

        if(lz_chat_state_expanded)
        {
            var input = null;
            if(!_chat)
            {
                input = document.getElementById('lz_chat_overlay_ticket_name');
            }
            else
                input = document.getElementById('lz_chat_text');

            lz_chat_set_focus_ctrl(input);
        }
    }
    catch(ex){//alert(ex);
    }
}

function lz_chat_set_focus_ctrl(_ctrl)
{
    try
    {
        _ctrl.focus();
        var val = _ctrl.value;
        _ctrl.value = '';
        _ctrl.value = val;
    }
    catch(ex){//alert(ex);
    }
}

function lz_chat_scoll_down()
{
    setTimeout("document.getElementById('lz_chat_content_box').scrollTop = document.getElementById('lz_chat_content_box').scrollHeight;",100);
	lz_chat_set_focus(lz_chat_application);
}

function lz_chat_pop_out()
{
    var group = (lz_operator != null) ? lz_global_base64_url_encode(lz_operator.Group) : "";
    var operator = (lz_desired_operator != null) ? lz_global_base64_url_encode(lz_desired_operator) : "";
    var name = (lz_external.Username != "") ? lz_global_base64_url_encode(lz_external.Username) : "";
    var email = (lz_external.Email != "") ? lz_global_base64_url_encode(lz_external.Email) : "";
    var params = lz_tracking_chat_params(name,email,operator,group);

	lz_closed = true;
	if(lz_chat_id.length > 0 && !lz_chat_botmode)
		lz_tracking_poll_server(1111);
	else
	{
        params += "&mp=MQ_";
		if(document.getElementById("lz_chat_invite_id") != null)
			lz_chat_decline_request(lz_request_active=document.getElementById("lz_chat_invite_id").value,false,false,true);
	}
	lz_chat_change_state(true,true);
	void(window.open(lz_poll_server + lz_poll_file_chat + '?acid='+lz_global_base64_url_encode(lz_chat_id)+'&livezilla='+lz_global_base64_url_encode(lz_session.UserId)+ params,'LiveZilla','width='+lz_window_width+',height='+lz_window_height+',left=0,top=0,resizable=yes,menubar=no,location=no,status=yes,slidebars=no'));
}

function lz_chat_set_chat_request(_id)
{
    if(document.getElementById("lz_chat_invite_id") != null)
        lz_chat_decline_request(lz_request_active=document.getElementById("lz_chat_invite_id").value,true,false,true);
}

function lz_chat_switch_options(_cancel, _missingInputs)
{
	if(!_cancel)
	{
		var show = document.getElementById("lz_chat_overlay_options_box").style.display == "none";
		document.getElementById('lz_chat_overlay_options_sound').disabled = !lz_sound_available;
		if(show)
		{
            lz_input_required = _missingInputs;
            if(!lz_chat_application)
            {
               lz_external.Username = document.getElementById("lz_chat_overlay_ticket_name").value;
               lz_external.Email = document.getElementById("lz_chat_overlay_ticket_email").value;
            }

            document.getElementById("lz_chat_overlay_option_title").innerHTML = (_missingInputs) ? lz_lang_fill_required_fields.replace(".","") : lz_lang_options;
            document.getElementById("lz_chat_overlay_options_required_name").style.display = (lz_input_chat_name_required && _missingInputs) ? "" : "none";
            document.getElementById("lz_chat_overlay_options_required_email").style.display = (lz_input_chat_email_required && _missingInputs) ? "" : "none";
            document.getElementById("lz_chat_overlay_options_name").value = lz_external.Username;
			document.getElementById("lz_chat_overlay_options_transcript").value = lz_external.Email;
			document.getElementById('lz_chat_overlay_options_sound').checked = lz_sound_available && lz_session.OVLCSound==1;
		}
		else
		{
			lz_session.OVLCSound = (document.getElementById('lz_chat_overlay_options_sound').checked) ? 1 : 0;
			if(document.getElementById("lz_chat_overlay_options_transcript").parentNode.style.display == "none")
			{
				lz_external.Email = document.getElementById('lz_chat_overlay_ticket_email').value;
				lz_chat_init_data_change(lz_global_trim(document.getElementById("lz_chat_overlay_options_name").value),null);
			}
			else
				lz_chat_init_data_change(lz_global_trim(document.getElementById("lz_chat_overlay_options_name").value),lz_global_trim(document.getElementById("lz_chat_overlay_options_transcript").value));

            if(lz_external.Username != lz_guest_name)
                document.getElementById("lz_chat_overlay_ticket_name").value = lz_external.Username;

			document.getElementById("lz_chat_overlay_ticket_email").value = lz_external.Email;
			lz_session.Save();
			lz_tracking_poll_server(1112);

            if(lz_input_required && !((lz_input_chat_name_required && (lz_external.Username.length==0 || lz_external.Username==lz_guest_name)) || (lz_input_chat_email_required && lz_external.Email.length==0)))
                lz_chat_message(null,null);
		}
        lz_chat_fade_options(show,(show) ? 0 : 37);
	}
    else
    {
        lz_chat_fade_options(false,20);
    }


}

function lz_chat_fade_options(_in, _posIndex)
{
    try
    {
        var posar = Array(-200,-190,-180,-170,-160,-150,-140,-130,-120,-110,-100,-90,-80,-70,-60,-50,-40,-30,-20,-10,0,10,20,30,40,50,55,57,58,59,60,60,59,58,57,56,55,54,53,52,51,50);
        var opar = Array(0.00,0.02,0.04,0.06,0.08,0.10,0.12,0.14,0.16,0.18,0.20,0.22,0.24,0.26,0.28,0.30,0.32,0.34,0.36,0.38,0.40,0.42,0.44,0.46,0.48,0.50,0.52,0.54,0.56,0.58,0.60,0.62,0.64,0.66,0.68,0.70,0.72,0.74);

        document.getElementById("lz_chat_overlay_options_frame").style.display = "";
        if(_in)
            document.getElementById("lz_chat_overlay_options_box_bg").style.display = (_in) ? "" : "none";

        if((_in && _posIndex<posar.length) || (!_in && _posIndex>=0))
        {
            if(_posIndex<opar.length)
                document.getElementById("lz_chat_overlay_options_box_bg").style.opacity = opar[_posIndex];
            document.getElementById("lz_chat_overlay_options_box").style.top = (posar[_posIndex]) + "px";
            document.getElementById("lz_chat_overlay_options_box").style.display = "";
            setTimeout("lz_chat_fade_options("+((_in) ? 'true' : 'false')+","+ ((_in) ? (_posIndex+1) : (_posIndex-1)).toString()+");",7);
        }
        else if(!_in)
        {
            document.getElementById("lz_chat_overlay_options_box_bg").style.display = (_in) ? "" : "none";
            document.getElementById("lz_chat_overlay_options_box").style.display = (_in) ? "" : "none";
            document.getElementById("lz_chat_overlay_options_frame").style.display = "none";
            lz_chat_set_focus(lz_chat_application);
        }
        else
        {
            if(lz_input_chat_name_required && lz_external.Username.length==0)document.getElementById("lz_chat_overlay_options_name").focus();
            else if(lz_input_chat_email_required && lz_external.Email.length==0)document.getElementById("lz_chat_overlay_options_transcript").focus();
        }
    }
    catch(ex)
    {


    }
}

function lz_chat_init_data_change(_name,_email)
{
	if(_name==null)
		_name = lz_external.Username;
	if(_email==null)
		_email = lz_external.Email;
		
	lz_external.Email = lz_change_email = _email;
	lz_external.Username = lz_change_name = _name;
}

function lz_chat_change_fullname(_name)
{
	if(lz_global_trim(_name) == "")
		_name = lz_guest_name;
	for(var i=0;i<document.getElementById("lz_chat_content_box").getElementsByTagName("TD").length;i++)
		if(document.getElementById("lz_chat_content_box").getElementsByTagName("TD")[i].className == "operator_name")
			document.getElementById("lz_chat_content_box").getElementsByTagName("TD")[i].innerHTML = lz_global_htmlentities(_name);
}

function lz_chat_play_sound()
{
	if(lz_sound_available && document.getElementById('lz_chat_overlay_options_sound').checked)
	{
		if(lz_sound_player == null)
			lz_sound_player = new Audio(lz_poll_server + "sound/message." + lz_sound_format);
		lz_sound_player.play();
	}
	window.focus();
}

function lz_chat_set_talk_to_human(_value,_poll)
{
    lz_chat_input_bot_state(false,false);
	lz_chat_talk_to_human = _value;
	if(_poll && _value)
    {
		lz_tracking_poll_server(1119);

        //if(lz_last_post.length > 0 && document.getElementById('lz_chat_text').value.length == 0)
          //  document.getElementById('lz_chat_text').value = lz_last_post;
    }
}

function lz_chat_input_bot_state(_botmode,_hide)
{
    lz_chat_botmode = _botmode;
    document.getElementById("lz_chat_text").style.display = (_hide) ? 'none' : '';
    document.getElementById("lz_bot_reply_loading").style.display = (!_hide) ? 'none' : '';
}

function lz_chat_message(_msg,_trans)
{
    if((lz_input_chat_name_required && (lz_external.Username.length==0 || lz_external.Username==lz_guest_name)) || (lz_input_chat_email_required && lz_external.Email.length==0))
    {
        lz_chat_switch_options(false,true);
        document.getElementById("lz_chat_text").value = lz_global_trim(document.getElementById("lz_chat_text").value);
        return false;
    }
    else
        lz_input_required = false;

	lz_closed = false;

    var msg = (_msg==null) ? lz_global_trim(document.getElementById("lz_chat_text").value) : _msg;

    if(msg.length>0 && lz_chat_botmode)
        lz_chat_input_bot_state(true,true);

    var transInto = (lz_session.TransInto!=""&&lz_session.TransInto!=null) ? lz_session.TransInto : "";
    if(transInto != "" && lz_session.TransFrom!=null && lz_session.TransFrom!="" && lz_session.TransFrom.toUpperCase() != transInto && _msg==null)
    {
        var newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        var sourceText = encodeURI(msg);

        window.doneTranslateCallback = function translateText(response){lz_chat_message(msg,response.data.translations[0].translatedText);window.doneTranslateCallback=null;}
        var source = "https://www.googleapis.com/language/translate/v2?key="+lz_global_base64_decode(lz_tr_api_key)+"&format=html&source="+lz_session.TransFrom+"&target="+transInto+"&callback=doneTranslateCallback&q=" + msg;
        newScript.src = source;
        document.getElementsByTagName("head")[0].appendChild(newScript);
        document.getElementById("lz_chat_text").value = '';
        return;
    }

	if(msg.length>0)
	{
		if(document.getElementById("lz_chat_invite_id") != null)
			lz_chat_decline_request(lz_request_active=document.getElementById("lz_chat_invite_id").value,true,false,true);

        var html = "";
		var msgo = new lz_chat_post();
        if(_trans != null)
        {
            msgo.MessageTranslationText =_trans;
            html = lz_global_htmlentities(msgo.MessageTranslationText) + "<div class='lz_overlay_translation'>" + lz_global_htmlentities(msg) + "</div>";
        }
        else
            html = lz_global_htmlentities(msg);

        msgo.MessageText = msg;
        msgo.MessageId = lz_global_microstamp();
        msgo.MessageTime = lz_global_timestamp();
		lz_external.MessagesSent[lz_external.MessagesSent.length] = msgo;
		document.getElementById("lz_chat_text").value = '';

		if(lz_operator==null)
			lz_chat_set_connecting(true,null,false);

		var posthtml = (lz_chat_last_poster != lz_external.Id) ? lz_global_base64_decode(lz_post_html) : lz_global_base64_decode(lz_add_html);
        posthtml = posthtml.replace("<!--message-->",html);
		posthtml = posthtml.replace("<!--name-->",(lz_external.Username.length == 0) ? lz_guest_name : lz_global_htmlentities(lz_external.Username));
		lz_chat_add_html_element(lz_global_base64_encode(posthtml),false,null,null,lz_global_base64_encode(lz_external.Id),null);
		lz_tracking_poll_server(1114);
		lz_chat_set_focus(lz_chat_application);
	}
	return false;
}

function lz_chat_inputs(_requireChatName,_requireChatEmail)
{
    lz_input_chat_name_required = _requireChatName;
    lz_input_chat_email_required = _requireChatEmail;
}

function lz_chat_set_host(_id,_chatId,_groupId,_userid,_lang)
{
	lz_chat_id = _chatId;
    if(_lang != null && lz_session.TransInto == "")
    {
        lz_session.TransInto = _lang;
        lz_session.Save();
    }

	if(_id != null)
	{
        if(!lz_chat_botmode)
            lz_chat_set_state_bar(true);
		lz_operator = new lz_chat_operator();
		lz_operator.Id = _id;
		lz_operator.Group = _groupId;
		lz_desired_operator = _userid;
		lz_chat_init_data_change(null,null);
	}
	else
	{
        lz_chat_set_state_bar(false);
		lz_desired_operator = null;
		lz_chat_init_data_change(null,null);
		lz_external.MessagesSent = new Array();
		lz_operator = null;
	}
}

function lz_chat_set_state_bar(_visible)
{
    if(_visible)
    {
        document.getElementById("lz_chat_content_box").className="unmovable lz_chat_content_box_lh";
        document.getElementById("lz_chat_state_bar").style.display="block";
    }
    else
    {
        document.getElementById("lz_chat_content_box").className="unmovable lz_chat_content_box_fh";
        document.getElementById("lz_chat_state_bar").style.display="none";
    }
}

function lz_chat_close()
{
    lz_leave_chat = true;
    lz_chat_set_state_bar(false);
    lz_tracking_poll_server(1120);
}

function lz_chat_set_typing(_typingText,_fromTimer)
{
    var bclass = false;
	if(lz_chat_connecting)
	{
		if(!_fromTimer && lz_timer_connecting != null)
			return;
			
		if(document.getElementById("lz_chat_overlay_info").innerHTML.length == 0)
        {
            bclass= true;
			document.getElementById("lz_chat_overlay_info").innerHTML = lz_connecting_info_text;
        }
		else
			document.getElementById("lz_chat_overlay_info").innerHTML = "";
		lz_timer_connecting = setTimeout("lz_chat_set_typing('',true);",700);
	}
	else
	{
		if(lz_timer_connecting != null)
			clearTimeout(lz_timer_connecting);
		lz_timer_connecting = null;
        bclass = _typingText != null;
		document.getElementById("lz_chat_overlay_info").innerHTML = (_typingText != null) ? lz_global_base64_decode(_typingText) : lz_default_info_text;
	}
    document.getElementById("lz_chat_overlay_info").className = (bclass) ? "lz_con_inf" : "";
}

function lz_chat_switch_extern_typing(_typing)
{	
	var announce = (_typing != lz_external.Typing);
	if(_typing)
	{
		if(lz_timer_typing != null)
			clearTimeout(lz_timer_typing);
		lz_timer_typing = setTimeout("lz_chat_switch_extern_typing(false);",5000);
	}
	lz_external.Typing = _typing;
	if(announce && lz_operator != null)
		lz_tracking_poll_server(1115);
}

function lz_chat_set_connecting(_connecting,_id,_hidePopOut)
{
	if(_id != null)
		lz_external.Id = _id;
	lz_chat_connecting = _connecting;
	if(_connecting)
		lz_chat_set_typing(null,false);
    document.getElementById("lz_chat_apo").style.visibility = (_hidePopOut) ? "hidden" : "visible";
}

function lz_chat_set_last_post(_post)
{
	lz_last_post = lz_global_base64_decode(_post);
}

function lz_chat_require_leave_message()
{
    if(lz_chat_handle_ticket_forward(true))
        return;

	document.getElementById("lz_chat_overlay_ticket_back_button").style.display = "";
	lz_leave_message_required = true;

    if(document.getElementById('lz_chat_text').value.length > 0 && document.getElementById('lz_chat_overlay_ticket_message').value.length == 0)
        document.getElementById('lz_chat_overlay_ticket_message').value = document.getElementById('lz_chat_text').value;
    else if(lz_last_post.length > 0 && document.getElementById('lz_chat_overlay_ticket_message').value.length == 0)
        document.getElementById('lz_chat_overlay_ticket_message').value = lz_last_post;

	lz_chat_set_application(false, lz_chat_botmode);
}

function lz_chat_message_return()
{
	document.getElementById("lz_chat_overlay_ticket_back_button").style.display = "none";
	lz_leave_message_required = false;
	lz_chat_set_application(true, lz_chat_botmode);
}

function lz_chat_set_application(_chat,_bot,_human,_title)
{
	if(lz_leave_message_required)
		_chat = false;
	else if(lz_operator != null || lz_chat_connecting)
		_chat = true;

	if(_chat && document.getElementById('lz_chat_overlay_ticket_message').value.length > 0)
	{
		document.getElementById('lz_chat_text').value = document.getElementById('lz_chat_overlay_ticket_message').value;
		document.getElementById('lz_chat_overlay_ticket_message').value = "";
	}
	else if(!_chat && document.getElementById('lz_chat_text').value.length > 0 && document.getElementById('lz_chat_overlay_ticket_message').value.length == 0)
		document.getElementById('lz_chat_overlay_ticket_message').value = document.getElementById('lz_chat_text').value;

    lz_chat_change_widget_application(_chat);

	document.getElementById("lz_chat_loading").style.display = "none";

    try
    {
	    if(_title != '')
		    lz_header_bot_text = lz_global_base64_decode(_title);
    }
    catch(ex)
    {

    }

	if(_chat && _bot && lz_header_bot_text != '')
		document.getElementById("lz_chat_overlay_text").innerHTML = lz_header_bot_text;
	else
		document.getElementById("lz_chat_overlay_text").innerHTML = lz_global_base64_url_decode((_chat) ? lz_header_online : lz_header_offline);

    if(lz_eye_catcher != null)
    {
        if(lz_ec_type==2 && document.getElementById("lz_ec_image")!=null)
        {
            document.getElementById("lz_ec_image").src = lz_global_base64_url_decode(((_chat) ? lz_ec_image : lz_ec_o_image));
        }
        else if(lz_ec_type==1)
        {
            document.getElementById("lz_ec_header_text").innerHTML = lz_global_base64_url_decode((_chat) ? lz_ec_header : lz_ec_o_header);
            document.getElementById("lz_ec_sub_header_text").innerHTML = lz_global_base64_url_decode((_chat) ? lz_ec_sub_header : lz_ec_o_sub_header);
        }
    }

	if(!_chat && document.getElementById("lz_chat_queued_posts") != null)
		document.getElementById("lz_chat_content_box").removeChild(document.getElementById("lz_chat_queued_posts"));

	if(lz_chat_application != _chat)
	{
		lz_chat_set_element_width();
		lz_chat_scoll_down();
		lz_chat_set_focus(_chat);
	}
	lz_chat_application = _chat;
}

function lz_chat_set_name(_name,_email)
{
	if(lz_change_name == null || lz_global_base64_decode(_name) == lz_change_name || lz_external.Username.length == 0)
	{
		lz_chat_change_fullname(lz_global_base64_decode(_name));
		
		if(lz_chat_application)
		{
			document.getElementById('lz_chat_overlay_ticket_name').value = lz_external.Username = lz_global_base64_decode(_name);
			document.getElementById('lz_chat_overlay_ticket_email').value = lz_external.Email = lz_global_base64_decode(_email);
		}
		
		lz_change_name = null;
		lz_change_email = null;
	}
}

function lz_chat_poll_parameters() 
{
	var params = "";
	if(lz_operator != null)
		params += "&op=" + lz_operator.Id;
		
	if(lz_external.Typing)
		params += "&typ=1";

	if(lz_closed)
		params += "&clch=1";
	
	if(lz_chat_full_load)
		params += "&full=1";

    if(lz_leave_chat)
    {
        lz_leave_chat=false;
        params += "&clch=1";
    }
		
	if(lz_chat_status_change)
		params += "&sc=1";
		
	if(lz_chat_talk_to_human)
		params += "&tth=1";
		
	if(lz_change_name != null || lz_change_email != null || (lz_operator != null && lz_chat_full_load))
	{
		if(lz_change_name != null && lz_guest_name != lz_change_name && lz_external.Username.length > 0)
			params += "&en=" + lz_global_base64_url_encode(lz_external.Username);
		if(lz_change_email != null && lz_external.Email.length > 0)
			params += "&ee=" + lz_global_base64_url_encode(lz_external.Email);
	}
		
	if(lz_ticket != null)
	{
		params += "&tid=" + lz_global_base64_url_encode(lz_ticket[0]) + "&tin=" + lz_global_base64_url_encode(lz_ticket[1]) + "&tie=" + lz_global_base64_url_encode(lz_ticket[2]) + "&tim=" + lz_global_base64_url_encode(lz_ticket[3]);
		lz_ticket = null;
	}

	lz_chat_status_change = false;
	if(lz_chat_last_post_received != null)
		params += "&lpr=" + lz_global_base64_url_encode(lz_chat_last_post_received);
	if(lz_chat_last_message_received != null)
		params += "&lmr=" + lz_global_base64_url_encode(lz_chat_last_message_received);
	if(lz_chat_last_poster != null)
		params += "&lp=" +lz_global_base64_url_encode(lz_chat_last_poster);
	if(lz_desired_operator != null)
		params += "&intid="+lz_global_base64_url_encode(lz_desired_operator); 
	
	var count=0;
	for(var i=0;i<lz_external.MessagesSent.length;i++)
		if(!lz_external.MessagesSent[i].Received)
			params+="&mi" + count.toString() + "=" + lz_global_base64_url_encode(lz_external.MessagesSent[i].MessageId) + "&mp" + (count).toString() + "=" + lz_global_base64_url_encode(lz_external.MessagesSent[i].MessageText)+ "&mpt" + (count).toString() + "=" + lz_global_base64_url_encode(lz_external.MessagesSent[i].MessageTranslationText)+ "&mpti" + (count++).toString() + "=" + lz_global_base64_url_encode((lz_session.TransFrom!=null)?lz_session.TransFrom:"");

	return params;
}

function lz_overlay_chat_impose_max_length(_object, _max)
{
	if(_object.value.length > _max)
		_object.value = _object.value.substring(0,_max);
}

function lz_chat_release_post(_id)
{	
	newMessageList = new Array();
	for(var mIndex in lz_external.MessagesSent)
		if(lz_external.MessagesSent[mIndex].MessageId == _id)
			lz_external.MessagesSent[mIndex].Received=true;
}

function lz_chat_update_waiting_posts(_wposts,_fromTimer)
{
	if(_wposts > -1 && lz_session.OVLCWM != _wposts)
	{
		lz_session.OVLCWM = _wposts;
		lz_session.Save();
	}
	document.getElementById("lz_chat_waiting_messages").style.display =
    document.getElementById("lz_chat_waiting_message_count").style.display = (!lz_chat_state_expanded && lz_session.OVLCWM > 0) ? "" : "none";
    document.getElementById("lz_chat_waiting_message_count").innerHTML = "&nbsp;"+lz_session.OVLCWM+"&nbsp;";
}

function lz_global_replace_smilies(_text)
{
    var shorts = new Array(/:-\)/g,/::smile/g,/:\)/g,/:-\(/g,/::sad/g,/:\(/g,/:-]/g,/::lol/g,/;-\)/g,/::wink/g,/;\)/g,/:'-\(/g,/::cry/g,/:-O/g,/::shocked/g,/:-\\\\/g,/::sick/g,/:-p/g,/::tongue/g,/:-P/g,/:\?/g,/::question/g,/8-\)/g,/::cool/g,/zzZZ/g,/::sleep/g,/:-\|/g,/::neutral/g);
    var images = new Array("smile","smile","smile","sad","sad","sad","lol","lol","wink","wink","wink","cry","cry","shocked","shocked","sick","sick","tongue","tongue","tongue","question","question","cool","cool","sleep","sleep","neutral","neutral");
    for(var i = 0;i<shorts.length;i++)
        _text = _text.replace(shorts[i]," <img border=0 src='"+lz_poll_server+"images/smilies/"+images[i]+".gif'> ");
    return _text;
}

function lz_chat_add_html_element(_html,_full,_lpr,_lmr,_lp,_ip,_posts)
{
	if(_posts != null)
		lz_chat_update_waiting_posts((_posts == -1) ? 0 : (lz_session.OVLCWM + parseInt(_posts)),false);
	
	if(_html != null)
	{
		if(lz_chat_full_load && _full)
			lz_chat_full_load = false;
			
		if(_ip != null && lz_global_base64_url_decode(_ip) != lz_chat_last_poster && lz_chat_last_poster != null)
		{
			lz_tracking_poll_server(1117);
			return;
		}

		if(_lpr != null && lz_chat_last_post_received != lz_global_base64_decode(_lpr))
			lz_chat_last_post_received = lz_global_base64_decode(_lpr);
		
		if(_lmr != null && lz_chat_last_message_received != lz_global_base64_decode(_lmr))
			lz_chat_last_message_received = lz_global_base64_decode(_lmr);
			
		if(_lp != null && _html != null && lz_chat_last_poster != lz_global_base64_decode(_lp))
			lz_chat_last_poster = lz_global_base64_decode(_lp);

		var dx = document.createElement("div");
		document.getElementById("lz_chat_content_inlay").appendChild(dx);
        dx.innerHTML = lz_global_replace_smilies(lz_global_base64_decode(_html),true);
		lz_update_chat_area();
	}
}

function lz_update_chat_area()
{
	lz_chat_set_element_width();
	lz_chat_set_typing(null,false);
	
	var spacer = document.getElementById("xspacer");
	if(spacer != null)
		document.getElementById("lz_chat_content_box").removeChild(spacer);
	else
		spacer = document.createElement("div");
		
	spacer.style.height =
	spacer.style.lineHeight = "8px";
	spacer.id = "xspacer";
	document.getElementById("lz_chat_content_box").appendChild(spacer);
	
	lz_chat_scoll_down();	
}

function lz_chat_post()
{
	this.MessageText = '';
    this.MessageTranslationText = '';
	this.MessageId = '';
	this.MessageTime = 0;
	this.Received = false;
}

function lz_chat_operator()
{
	this.Id = '';
	this.Fullname = '';
	this.Available = false;
	this.Group = '';
	this.Language = "en";
}

function lz_chat_external_user()
{
	this.Id = '';
	this.Username = '';
	this.Email = '';
	this.Company = '';
	this.Question = '';
	this.Typing = false;
	this.MessagesSent = new Array();
	this.MessagesReceived = new Array();
}

function lz_chat_detect_sound()
{
	var sa = document.createElement('audio');
	var avail_ogg = !!(sa.canPlayType && sa.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''));
	var avail_mp3 = !!(sa.canPlayType && sa.canPlayType('audio/mpeg;').replace(/no/, ''));
	lz_sound_available = (avail_ogg || avail_mp3);
	lz_sound_format = (avail_ogg) ? "ogg" : "mp3";
}

function lz_chat_decline_request(_id,_operator,_stateChange,_result)
{
	if(_result == null)
		_result = false;
	var node = document.getElementById(_id);
	if(node != null && node.style.display != 'none')
	{
		if(!_operator)
		{
			lz_request_active=_id;
			lz_tracking_action_result('chat_request',_result,false,lz_chat_poll_parameters());
		}
		node.parentNode.removeChild(node);
		if(_stateChange && lz_chat_state_expanded && lz_chat_id.length == 0 && lz_external.MessagesSent.length == 0)
			lz_chat_change_state(true,true);
		lz_chat_set_element_width();
	}
}

function lz_chat_ticket_display(_inputs)
{
	document.getElementById("lz_chat_ticket_received").style.display = (!_inputs) ? "" : "none";
	document.getElementById('lz_chat_ticket_form').style.display = (_inputs) ? "" : "none";
}

function lz_chat_mail_callback(_received)
{
	lz_chat_ticket_display(false);
	document.getElementById('lz_ticket_received').style.display = (_received) ? "" : "none";
	document.getElementById('lz_ticket_flood').style.display = (!_received) ? "" : "none";
	if(_received)
	{
		document.getElementById('lz_chat_overlay_ticket_message').value = "";
		lz_ticket = null;
	}
	lz_chat_ticket_progress(false);
}

function lz_chat_ticket_progress(_progress)
{
	document.getElementById('lz_chat_overlay_ticket_button').style.cursor = (_progress) ? "wait" : "pointer";
	document.getElementById('lz_chat_ticket_form').style.cursor = (_progress) ? "wait" : "default";
	document.getElementById('lz_chat_overlay_ticket_name').disabled = 
	document.getElementById('lz_chat_overlay_ticket_email').disabled = 
	document.getElementById('lz_chat_overlay_ticket_message').disabled = _progress;
}

function lz_chat_send_ticket()
{
	document.getElementById('lz_chat_overlay_ticket_required_name').style.display = (document.getElementById('lz_chat_overlay_ticket_name').value.length > 0) ? "none" : "";
	document.getElementById('lz_chat_overlay_ticket_required_email').style.display = (document.getElementById('lz_chat_overlay_ticket_email').value.length > 0) ? "none" : "";
	document.getElementById('lz_chat_overlay_ticket_required_message').style.display = (document.getElementById('lz_chat_overlay_ticket_message').value.length > 0) ? "none" : "";

	if(document.getElementById('lz_chat_overlay_ticket_name').value.length > 0 && document.getElementById('lz_chat_overlay_ticket_email').value.length > 0 && document.getElementById('lz_chat_overlay_ticket_message').value.length > 0) 
	{
		lz_chat_ticket_progress(true);
		lz_change_name = lz_external.Username = document.getElementById('lz_chat_overlay_ticket_name').value;
		lz_change_email = lz_external.Email = document.getElementById('lz_chat_overlay_ticket_email').value;
		lz_ticket = new Array(lz_global_timestamp(),document.getElementById('lz_chat_overlay_ticket_name').value, document.getElementById('lz_chat_overlay_ticket_email').value, document.getElementById('lz_chat_overlay_ticket_message').value);
		lz_tracking_poll_server(1116);
	}
	else
		lz_chat_ticket_progress(false);
}

function lz_chat_process_input(_id,_chat)
{
    try
    {
        if(_chat && _id == "lz_chat_overlay_options_name" && document.getElementById("lz_chat_overlay_options_name").value.length > 0)
        {
            if(lz_input_chat_email_required && document.getElementById("lz_chat_overlay_options_transcript").style.display != "none" && document.getElementById("lz_chat_overlay_options_transcript").value.length <= 0)
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_options_transcript"));
            else
                lz_chat_switch_options(false);
        }
        else if(_chat && _id == "lz_chat_overlay_options_transcript" && document.getElementById("lz_chat_overlay_options_transcript").value.length > 0)
        {
            if(lz_input_chat_name_required && document.getElementById("lz_chat_overlay_options_name").style.display != "none" && document.getElementById("lz_chat_overlay_options_name").value.length <= 0)
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_options_name"));
            else
                lz_chat_switch_options(false);
        }
        else if(!_chat && _id == "lz_chat_overlay_ticket_name" && document.getElementById("lz_chat_overlay_ticket_name").value.length > 0)
        {
            if(document.getElementById("lz_chat_overlay_ticket_email").style.display != "none" && document.getElementById("lz_chat_overlay_ticket_email").value.length <= 0)
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_ticket_email"));
            else if(document.getElementById("lz_chat_overlay_ticket_message").style.display != "none" && document.getElementById("lz_chat_overlay_ticket_message").value.length <= 0)
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_ticket_message"));
            else
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_ticket_message"));
        }
        else if(!_chat && _id == "lz_chat_overlay_ticket_email" && document.getElementById("lz_chat_overlay_ticket_email").value.length > 0)
        {
            if(document.getElementById("lz_chat_overlay_ticket_name").style.display != "none" && document.getElementById("lz_chat_overlay_ticket_name").value.length <= 0)
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_ticket_name"));
            else
                lz_chat_set_focus_ctrl(document.getElementById("lz_chat_overlay_ticket_message"));
        }
    }
    catch(ex){//alert(ex);
    }
    return false;
}

function lz_chat_scroll()
{
	if(!lz_chat_scrolled)
	{
		lz_chat_scrolled = true;
		lz_chat_set_element_width();
		lz_chat_scoll_down();
	}
}

function lz_chat_set_element_width()
{
	for(var i = 0;i<document.getElementById("lz_chat_content_box").childNodes.length;i++)
		if(document.getElementById("lz_chat_content_box").childNodes[i].tagName.toLowerCase() == "div")
			document.getElementById("lz_chat_content_box").childNodes[i].style.width = (lz_chat_scrolled || document.getElementById("lz_chat_content_box").scrollHeight > document.getElementById("lz_chat_content_box").clientHeight) ? "238px" : "255px";
}

function lz_chat_set_translation(_activeId,_from,_into)
{
    if(_into != null)
    {
        _into = lz_global_base64_decode(_into).toLowerCase();
        _into = (_into.length==0) ? null : _into;
    }
    if(_from != null)
    {
        _from = lz_global_base64_decode(_from).toLowerCase();
        _from = (_from.length==0) ? null : _from;
    }

    if(_activeId != null && lz_session.TransSID != _activeId)
    {
        if(_activeId != null)
            lz_session.TransSID = _activeId;

        if(_into != null)
            lz_session.TransInto = _into;
        else
            lz_session.TransInto = "";

        if(_from != null)
            lz_session.TransFrom = _from;
        else
            lz_session.TransFrom = "";

        document.getElementById('lz_chat_overlay_options_trans').checked = (_into != null);
    }

    document.getElementById('lz_chat_overlay_options_trans').checked = lz_session.TransFrom!="";
    for(var i=0;i<document.getElementById('lz_chat_overlay_options_language').options.length;i++)
        if(document.getElementById('lz_chat_overlay_options_language').options[i].value==lz_session.TransFrom)
            document.getElementById('lz_chat_overlay_options_language').selectedIndex = i;

    lz_chat_change_translation();

}

function lz_chat_change_translation()
{
    document.getElementById('lz_chat_overlay_options_language').disabled = !document.getElementById('lz_chat_overlay_options_trans').checked;
    var from = (document.getElementById('lz_chat_overlay_options_trans').checked) ? document.getElementById('lz_chat_overlay_options_language').options[document.getElementById('lz_chat_overlay_options_language').selectedIndex].value : "";
    lz_session.TransFrom = (document.getElementById('lz_chat_overlay_options_trans').checked) ? from : "";
    lz_session.Save();
}