var lz_default_info_text = "<!--lang_client_press_enter_to_send-->";
var lz_connecting_info_text = "<!--lang_client_trying_to_connect_you-->";

var lz_header_online = "<!--header_online-->";
var lz_header_offline = "<!--header_offline-->";
var lz_ec_header = "<!--ec_header_text-->";
var lz_ec_sub_header = "<!--ec_header_sub_text-->";
var lz_ec_o_header = "<!--ec_o_header_text-->";
var lz_ec_o_sub_header = "<!--ec_o_header_sub_text-->";
var lz_ec_type = <!--ec_t-->;
var lz_ec_image = "<!--ec_image-->";
var lz_ec_o_image = "<!--ec_o_image-->";

var lz_tickets_external = <!--tickets_external-->;
var lz_chats_external = <!--chats_external-->;

var lz_guest_name = "<!--lang_client_guest-->";
var lz_lang_fill_required_fields = "<!--lang_client_fill_mandatory_fields-->";
var lz_lang_options = "<!--lang_client_options-->";
var lz_post_html = "<!--post_html-->";
var lz_add_html = "<!--add_html-->";
var lz_tr_api_key = "<!--gtv2_api_key-->";
var lz_trans_into = "<!--def_trans_into-->";

try
{
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.lz_chat_mail { color: <!--color--> !important; }';
    style.innerHTML += '.lz_chat_link { color: <!--color--> !important; }';
    style.innerHTML += '.lz_chat_file { color: <!--color--> !important; }';
    style.innerHTML += '.lz_chat_human { color: <!--color--> !important; }';
    style.innerHTML += '.lz_con_inf {color: <!--color--> !important; font-weight:bold;}';
    document.getElementsByTagName('head')[0].appendChild(style);
}
catch(ex)
{

}

function lz_chat_get_parameters(_ws)
{
    return lz_getp_track + ((_ws && lz_poll_website != "") ? "&ws="+lz_poll_website : "");
}

function lz_chat_change_state(_click,_required)
{
	if(!lz_chat_state_expanded && !lz_chat_application)
	{
        if(lz_chat_handle_ticket_forward(_click))
            return;
	}
    else if(!lz_chat_state_expanded && lz_chat_application && lz_chats_external)
    {
        void(window.open(lz_poll_server + 'chat.php?acid=MQ_&' + lz_chat_get_parameters(true),'','width='+lz_window_width+',height='+lz_window_height+',left=100,top=100,resizable=yes,menubar=no,location=no,status=yes,scrollbars=yes'))
        return;
    }
	else if(lz_chat_invite_timer != null)
	{
		clearTimeout(lz_chat_invite_timer);
	}

	if(document.getElementById("lz_chat_invite_id") != null && lz_chat_state_expanded && _click && _required)
		lz_chat_decline_request(document.getElementById("lz_chat_invite_id").value,false,false);
	
	if(!_required && lz_chat_state_expanded)
		return false;

    if(lz_chat_state_expanded)
    {
        document.getElementById('lz_chat_text').blur();
        document.getElementById('lz_chat_overlay_ticket_message').blur();
        document.getElementById('lz_chat_overlay_ticket_email').blur();
        document.getElementById('lz_chat_overlay_ticket_name').blur();
        document.getElementById('lz_chat_overlay_options_name').blur();
        document.getElementById('lz_chat_overlay_options_transcript').blur();
    }

    if(lz_eye_catcher != null && lz_session.ECH != "1" && document.getElementById("lz_overlay_chat") != null)
    {
        document.getElementById("lz_eye_catcher").style.left = document.getElementById("lz_overlay_chat").style.left;
        document.getElementById('lz_overlay_eyecatcher').style.display = (!lz_chat_state_expanded) ? 'none' : '';
    }

	lz_chat_state_expanded = !lz_chat_state_expanded;
	lz_session.OVLCState = lz_chat_state_expanded ? "1" : "0";

	document.getElementById("lz_chat_overlay_text").style.cursor = (lz_chat_state_expanded) ? "move" : "pointer";
	document.getElementById("lz_chat_overlay_main").style.cursor = (lz_chat_state_expanded) ? "" : "default";

	lz_overlay_chat.lz_livebox_div.style.height = (lz_chat_state_expanded) ? "378px" : "31px";
	lz_overlay_chat.lz_livebox_div.style.zIndex = (lz_chat_state_expanded) ? 99999 : 960;

	if(_click)
		lz_chat_update_waiting_posts(0);

    lz_session.OVLCTop = "";

    if(!lz_is_tablet)
        if(!lz_chat_state_expanded)
        {
            lz_overlay_chat.lz_livebox_div.style.top="";
            lz_overlay_chat.lz_livebox_div.style.bottom="0px";
        }
        else
        {
            lz_overlay_chat.lz_livebox_div.style.top=(lz_global_get_window_height()-378) + "px";
            lz_overlay_chat.lz_livebox_div.style.bottom= "";
        }

	lz_session.Save();

	document.getElementById("lz_chat_state_change").style.display = (lz_chat_state_expanded) ? "" : "none";

	lz_chat_update_waiting_posts(0,false);
	document.getElementById("lz_chat_waiting_messages").style.display = "none";
    lz_chat_set_focus(lz_chat_application);
}

function lz_chat_change_widget_application(_chat)
{
    if(!_chat && (lz_tickets_external || <!--offline_message_mode--> == 1) && lz_chat_state_expanded)
    {
        lz_chat_change_state(false,true);
    }
    else if(_chat && lz_chats_external && lz_chat_state_expanded)
    {
        lz_chat_change_state(false,true);
    }
    else
    {
        document.getElementById("lz_chat_overlay_ticket").style.display = (!_chat) ? "" : "none";
        document.getElementById("lz_chat_content_box").style.display = (_chat) ? "" : "none";
    }
}

function lz_chat_handle_ticket_forward(_click)
{
    if(_click && <!--offline_message_pop--> && <!--offline_message_mode--> == 1)
    {
        void(window.open('<!--offline_message_http-->','','width='+lz_window_width+',height='+lz_window_height+',left=100,top=100,resizable=yes,menubar=no,location=no,status=yes,scrollbars=yes'))
        return true;
    }
    else if(_click && <!--offline_message_mode--> == 1)
    {
        window.location.href = '<!--offline_message_http-->';
        return true;
    }
    if(_click && lz_tickets_external)
    {
        void(window.open(lz_poll_server + 'chat.php?acid=MQ_&' + lz_chat_get_parameters(true),'','width='+lz_window_width+',height='+lz_window_height+',left=100,top=100,resizable=yes,menubar=no,location=no,status=yes,scrollbars=yes'))
        return true;
    }
    return false;
}

function lz_chat_set_init()
{
	lz_external.Id = "<!--system_id-->";
	lz_chat_detect_sound();
	document.getElementById('lz_chat_overlay_options_sound').checked = lz_sound_available && lz_session.OVLCSound==1;
	lz_external.Username = lz_change_name = lz_global_base64_url_decode("<!--user_name-->");
	document.getElementById('lz_chat_overlay_ticket_name').value=lz_external.Username;
	lz_external.Email = lz_change_email = lz_global_base64_url_decode("<!--user_email-->");
	document.getElementById('lz_chat_overlay_ticket_email').value=lz_external.Email;

    if(lz_session.TransFrom != "")
        lz_chat_set_translation(null,lz_global_base64_encode(lz_session.TransFrom),null);
}
