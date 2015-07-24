<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html style="width:100%;">
<head>
	<META NAME="robots" CONTENT="noindex,follow">
	<title>LiveZilla Live Chat Software</title>
	<link rel="stylesheet" type="text/css" href="<!--server-->templates/style_chat.css">
</head>
<body topmargin="0" leftmargin="0" style="margin:0px;padding:0px;width:100%;" onscroll="parent.parent.lz_chat_chat_alert_move();" onresize="parent.parent.lz_chat_chat_alert_move();">
    <!--alert-->
    <div id="lz_chat_main" style="display:none;"></div>
    <div id="lz_chat_call_me_back_info" style="display:none;width:100%;text-align:center;">
        <table class="lz_chat_call_me_now" align="center">
            <tr>
                <td width="5%" align="right"></td>
                <td align="center">
                    <div id="lz_chat_call_me_back_st">
                        <img src="./images/lz_call_me_now.gif" alt="">
                    </div>
                    <br><br>
                    <div id="lz_chat_call_me_back_wa">
                        <!--lang_client_init_call_me_now-->
                        <br><br>
                    </div>
                    <br>
                </td>
                <td width="5%"></td>
            </tr>
            <tr>
                <td colspan="3" align="center">
                    <input type="button" class="lz_form_button" value="<!--lang_client_activate_chat-->" onclick="parent.parent.lz_chat_activate();">
                    <input type="button" class="lz_form_button" value="<!--lang_client_rate_representative-->" onclick="parent.parent.lz_chat_switch_rating();">
                    <input type="button" class="lz_form_button" value="<!--lang_client_leave_message-->" onclick="parent.parent.lz_chat_goto_message(true,false);">
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
