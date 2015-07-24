<div id="lz_chat_overlay_main" class="lz_chat_base notranslate" style="background-image:url('<!--server-->templates/overlays/chat/images/lz_chat_<!--shadow-->bg.png');">
    <div id="lz_chat_content">
        <div id="lz_chat_waiting_messages" style="display:none;" onclick="lz_chat_change_state(true,false);">
            <div id="lz_chat_waiting_message_count" style="display:none;"></div>
        </div>
		<table cellpadding="0" cellspacing="0" class="lz_chat_content_table">
			<tr>
				<td height="25">
					<div cellpadding="0" cellspacing="0" style="position:absolute;top:7px;left:6px;height:25px;width:265px;z-index:100015;background:<!--bgc-->;color:<!--tc-->;">
                        <div class="lz_overlay_chat_gradient">
                            <div id="lz_chat_overlay_text" style="color:<!--tc-->;" onclick="lz_chat_change_state(true,false);"></div>
                            <div id="lz_chat_minimize" onclick="lz_chat_change_state(true,true);">
                                <div id="lz_chat_state_change" style="border-bottom:3px solid <!--tc-->;display:none;"></div>
                            </div>
                        </div>
					</div>
				</td>
			</tr>
			<tr>
				<td class="unmovable" style="height:252px;vertical-align:top;">
				    <div id="lz_chat_loading"><br><br><br><br><br><!--lang_client_loading--> ...</div>
                    <div id="lz_chat_state_bar"><a class="lz_decline_link" onclick="lz_chat_close();"><!--lang_client_close--></a></div>
                    <div id="lz_chat_content_box" style="display:none;" class="unmovable lz_chat_content_box_fh" onScroll="lz_chat_scroll();"><div id="lz_chat_content_inlay" class="unmovable"></div></div>
                    <div id="lz_chat_overlay_options_box_bg" style="display:none;"></div>
                    <div id="lz_chat_overlay_options_frame" style="display:none;">
                        <div id="lz_chat_overlay_options_box" style="display:none;border-spacing:0px;border:1px solid <!--bgc-->;">
                            <div id="lz_chat_overlay_option_title" class="lz_chat_overlay_options_box_base" style="background:<!--bgc-->;"><!--lang_client_options--></div>
                            <div style="top:36px;left:16px;" class="lz_chat_overlay_options_box_base"><!--lang_client_your_name-->:<span id="lz_chat_overlay_options_required_name" class="lz_overlay_chat_required"><!--lang_client_required_field--></span></div>
                            <div style="top:51px;left:16px;" class="lz_chat_overlay_options_box_base"><input id="lz_chat_overlay_options_name" type="text" class="lz_chat_overlay_text lz_chat_overlay_options_text" value="" onkeydown="if(event.keyCode==13){return lz_chat_process_input(this.id,true);}"></div>
                            <div style="top:86px;left:16px;" class="lz_chat_overlay_options_box_base"><!--lang_client_your_email-->:<span id="lz_chat_overlay_options_required_email" class="lz_overlay_chat_required"><!--lang_client_required_field--></span></div>
                            <div style="top:101px;left:16px;" class="lz_chat_overlay_options_box_base"><input type="text" id="lz_chat_overlay_options_transcript" class="lz_chat_overlay_text lz_chat_overlay_options_text" onkeydown="if(event.keyCode==13){return lz_chat_process_input(this.id,true);}"></div>
                            <div style="top:140px;left:16px;height:65px;width:200px;background:#ebebeb;border-radius:3px;display:<!--tr_vis-->;" class="lz_chat_overlay_options_box_base">
                                <div style="top:7px;left:8px;width:18px;" class="lz_chat_overlay_options_box_base"><input type="checkbox" id="lz_chat_overlay_options_trans" onClick="lz_chat_change_translation();" value=""></div>
                                <div style="top:7px;left:26px;" class="lz_chat_overlay_options_box_base"><!--lang_client_use_auto_translation_service--><select style="color:<!--bgc-->;" id="lz_chat_overlay_options_language" onClick="lz_chat_change_translation();" DISABLED><!--languages--></select></div>
                            </div>
                            <div style="left:14px;width:18px;bottom:14px;" class="lz_chat_overlay_options_box_base"><input type="checkbox" id="lz_chat_overlay_options_sound" value=""></div>
                            <div style="left:33px;bottom:14px;" class="lz_chat_overlay_options_box_base"><!--lang_client_sounds--></div>
                            <div style="right:12px;bottom:10px;" class="lz_chat_overlay_options_box_base"><div class="lz_overlay_chat_button" onclick="lz_chat_switch_options(false);"><!--lang_client_save--></div></div>
                        </div>
                    </div>
					<div id="lz_chat_overlay_ticket" style="display:none;">
						<table id="lz_chat_ticket_received" cellpadding="0" cellspacing="0" align="center" style="width:90%;display:none;margin: 0 auto;">
							<tr>
								<td>
									<br><br>
									<table cellpadding="0" cellspacing="0" id="lz_ticket_received" align="center" class="lz_overlay_chat_ticket_response">
										<tr>
											<td>
												<!--lang_client_message_received-->
											</td>
										</tr>
									</table>
									<table cellpadding="0" cellspacing="0" id="lz_ticket_flood" align="center" class="lz_overlay_chat_ticket_response">
										<tr>
											<td style="color:#cc3333;">
												<strong><!--lang_client_message_flood--></strong>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td>
									<br>
									<div class="lz_overlay_chat_button" onclick="lz_chat_ticket_display(true);"><!--lang_client_back--></div>
								</td>
							</tr>
						</table>
						<div id="lz_chat_ticket_form">
                            <div style="top:0px;left:0px;" class="lz_chat_overlay_options_box_base lz_overlay_chat_ticket_header">
                                <div id="lz_chat_ticket_header_text"><b><!--lang_client_ticket_header--></b><br><!--ticket_information--></div>
                            </div>
                            <div style="top:96px;left:15px;" class="lz_chat_overlay_options_box_base">
                                <span class="lz_overlay_chat_caption"><!--lang_client_your_name-->:</span><span id="lz_chat_overlay_ticket_required_name" class="lz_overlay_chat_required" style="display:none;"><!--lang_client_required_field--></span>
                                <input id="lz_chat_overlay_ticket_name" type="text" onkeydown="lz_leave_message_required=true;if(event.keyCode==13){return lz_chat_process_input(this.id,false);}" class="lz_chat_overlay_text">
                            </div>
                            <div style="top:142px;left:15px;" class="lz_chat_overlay_options_box_base">
                                <span class="lz_overlay_chat_caption"><!--lang_client_your_email-->:</span><span id="lz_chat_overlay_ticket_required_email" class="lz_overlay_chat_required" style="display:none;"><!--lang_client_required_field--></span>
                                <input id="lz_chat_overlay_ticket_email" type="text" onkeydown="lz_leave_message_required=true;if(event.keyCode==13){return lz_chat_process_input(this.id,false);}" class="lz_chat_overlay_text">
                            </div>
                            <div style="top:188px;left:15px;" class="lz_chat_overlay_options_box_base">
                                <span class="lz_overlay_chat_caption"><!--lang_client_your_question-->:</span><span id="lz_chat_overlay_ticket_required_message" class="lz_overlay_chat_required" style="display:none;"><!--lang_client_required_field--></span>
                                <textarea id="lz_chat_overlay_ticket_message" type="text" onchange="lz_overlay_chat_impose_max_length(this, <!--overlay_input_max_length-->);" onkeyup="lz_overlay_chat_impose_max_length(this, <!--overlay_input_max_length-->);" onkeydown="lz_leave_message_required=true;" class="lz_chat_overlay_text" style="height:60px;"></textarea>
                            </div>
                            <div style="top:278px;left:15px;display:none;" class="lz_chat_overlay_options_box_base lz_overlay_chat_button" id="lz_chat_overlay_ticket_back_button" onclick="lz_chat_message_return();"><!--lang_client_back--></div>
                            <div style="top:278px;right:14px;" class="lz_chat_overlay_options_box_base lz_overlay_chat_button" id="lz_chat_overlay_ticket_button" onclick="lz_chat_send_ticket();"><!--lang_client_send_message--></div>
                        </div>
					</div>
				</td>
			</tr>
			<tr>
				<td style="height:22px;vertical-align:middle;"><div id="lz_chat_overlay_info"></div></td>
			</tr>
			<tr>
				<td style="height:42px;text-align:center;vertical-align:top;">
                    <img src="<!--server-->images/chat_loading.gif" id="lz_bot_reply_loading" style="margin-top:5px;display:none;">
					<textarea onkeydown="if(event.keyCode==13){return lz_chat_message(null,null);}else{lz_chat_switch_extern_typing(true);return true;}" onchange="lz_overlay_chat_impose_max_length(this, <!--overlay_input_max_length-->);" onkeyup="lz_overlay_chat_impose_max_length(this, <!--overlay_input_max_length-->);" id="lz_chat_text" class="lz_chat_overlay_text" style="height:33px;resize: none;"></textarea>
				</td>
			</tr>
		</table>
	</div>
    <div style="bottom:3px;left:10px;" class="lz_chat_overlay_options_box_base lz_overlay_chat_footer">
        <table style="border-spacing:0px;" align="center">
            <tr>
                <td nowrap onclick="javascript:lz_chat_switch_options(false,false);" id="lz_overlay_chat_options_button" class="lz_overlay_chat_options_link"><!--lang_client_options--></td>
                <td style="font-weight:normal;<!--apo-->" id="lz_chat_apo" onclick="javascript:lz_chat_pop_out();" class="lz_overlay_chat_options_link">PopOut</td>
            </tr>
        </table>
    </div>
    <div style="bottom:3px;right:3px;" class="lz_chat_overlay_options_box_base lz_overlay_chat_footer">
        <table style="border-spacing:0px;" align="center">
            <tr>
                <td style="text-align:right;"><!--param--></td>
            </tr>
        </table>
    </div>
</div>