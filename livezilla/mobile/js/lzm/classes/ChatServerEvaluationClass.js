/****************************************************************************************
 * LiveZilla ChatServerEvaluationClass.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatServerEvaluationClass(lzm_commonTools, chosenProfile, lzm_chatTimeStamp) {

    // load the configuration file
    this.lzm_commonConfig = new CommonConfigClass();
    this.lzm_commonTools = lzm_commonTools;
    this.lzm_chatTimeStamp = lzm_chatTimeStamp;

    // variables filled from the server response
    this.myName = '';
    this.myId = '';
    this.myGroup = '';
    this.myUserId = '';
    this.chosen_profile = {};
    this.serverUrl = chosenProfile.server_url;
    this.serverProtocol = chosenProfile.server_protocol;
    this.loginTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);

    this.permissions = [];
    this.global_configuration = {};
    this.extForwardIdList = [];
    this.external_forwards = [];
    this.chats = [];
    this.active_chat = '';
    this.active_chat_reco = '';
    this.external_users = [];
    this.newExternalUsers = [];
    this.changedExternalUsers = [];
    this.tickets = [];
    this.ticketGlobalValues = {p: 20, q: 0, t: 0, r: 0, e: 0};
    this.ticketFetchTime = 0;
    this.login_data = {};
    this.extUserIdList = [];
    this.global_typing = [];
    this.globTypingIdList = [];
    this.globalTypingChanges = [];
    this.internal_departments = [];
    this.internal_users = [];
    this.global_errors = [];
    this.wps = [];
    this.chatIdList = [];
    this.chatMessageCounter = 0;
    this.browserChatIdList = [];
    this.chatObject = {};
    this.chatPartners = {};
    this.rec_posts = [];
    //this.incoming_chats = [];
    this.chatArchive = {chats: [], q: '', p: 20, t: 0};
    this.archiveFetchTime = 0;
    this.fuprs = [];
    this.fuprIdList = [];
    this.fuprDownloadIdList = [];
    this.settingsDialogue = false;
    this.resources = [];
    this.resourceIdList = [];
    this.resourceLastEdited = 0;
    this.emails = [];
    this.emailCount = 0;

    this.filters = new LzmFilters();

    this.pollFrequency = 0;
    this.timeoutClients = 0;
    this.siteName = '';
    this.defaultLanguage = '';

    this.userLanguage = '';

    this.inputList = new LzmCustomInputs();

    this.new_ext_u = false;
    this.new_ext_f = false;
    this.new_ext_c = false;
    this.new_usr_p = false;
    this.new_int_d = false;
    this.new_int_u = false;
    this.new_glt = false;
    this.new_ev = false;
    this.new_dt = false;
    this.new_de = false;
    this.new_dc = false;
    this.new_qrd = false;
    this.new_ext_b = false;

    this.new_gl_e = false;
}

ChatServerEvaluationClass.prototype.resetWebApp = function() {
    this.global_configuration = {};
    this.extForwardIdList = [];
    this.external_forwards = [];
    //this.chats = [];
    this.active_chat = '';
    this.active_chat_reco = '';
    var tmpExternalUsers = [];
    var tmpExtUserIdList = [];
    for (var i=0; i<this.external_users.length; i++) {
        for (var j=0; j<this.external_users[i].b.length; j++)
        var tmpChatId = this.external_users[i].id + '~' + this.external_users[i].b[j].id;
        if (typeof this.chatObject[tmpChatId] != 'undefined' &&
            $.inArray(tmpChatId ,lzm_chatDisplay.closedChats) == -1) {
            this.external_users[i].is_active = false;
            tmpExternalUsers.push(this.external_users[i]);
            tmpExtUserIdList.push(this.external_users[i].id);
        }
    }
    this.external_users = tmpExternalUsers;
    this.extUserIdList = tmpExtUserIdList;
    this.newExternalUsers = [];
    this.changedExternalUsers = [];
    this.global_typing = [];
    this.globTypingIdList = [];
    this.internal_departments = [];
    this.internal_users = [];
    this.global_errors = [];
    this.wps = [];
    this.chatPartners = {};
    this.rec_posts = [];
    this.chatArchive = {chats: [], q: '', p: 20, t: 0};
    this.fuprs = [];
    this.fuprIdList = [];
    this.fuprDownloadIdList = [];
    this.settingsDialogue = false;
    this.filters.clearFilters();
    this.customInput.clearCustomInputs();
    this.new_ext_u = true;
    this.new_ext_f = true;
    this.new_ext_c = true;
    this.new_usr_p = true;
    this.new_int_d = true;
    this.new_int_u = true;
    this.new_glt = true;
    this.new_ev = true;
    this.new_dt = true;
    this.new_de = true;
    this.new_dc = true;
    this.new_qrd = true;
    this.new_gl_e = true;
    this.new_ext_b = true;
};

/**
 * Add a new chat created by a local method to the chats array
 * @param new_chat
 */
ChatServerEvaluationClass.prototype.addNewChat = function (new_chat) {
    new_chat.text = this.replaceLinks(new_chat.text);
    //console.log(new_chat.text);
    this.chats.push(new_chat);
    return true;
};

/**
 * Get the server's response for the login
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getLogin = function (xmlDoc) {
    var thisClass = this;
    $(xmlDoc).find('login').each(function () {
        var login = $(this);
        login.children('login_return').each(function () {
            var myReturn = $(this);
            var myAttributes = myReturn[0].attributes;
            for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
                thisClass.login_data[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
            }
            if (typeof thisClass.login_data.perms != 'undefined' && thisClass.login_data.perms != '') {
                thisClass.permissions = thisClass.login_data.perms.split('');
                lzm_commonPermissions.getUserPermissions(true);
            }

        });
        thisClass.myName = thisClass.login_data.name;
        thisClass.myId = thisClass.login_data.sess;
        if (typeof thisClass.login_data != 'undefined' && typeof thisClass.login_data.timediff != 'undefined') {
            thisClass.lzm_chatTimeStamp.setTimeDifference(thisClass.login_data.timediff);
        }
    });
};

/**
 * Get the global configuration from the server's response and create an objet with its contents
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getGlobalConfiguration = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('gl_c').each(function () {
        //console.log(this);
        var gl_c = $(this);
        if (typeof thisClass.global_configuration.toplevel == 'undefined') {
            thisClass.global_configuration.toplevel = [];
        }
        if (typeof thisClass.global_configuration.site == 'undefined') {
            thisClass.global_configuration.site = {};
        }
        if (typeof thisClass.global_configuration.php_cfg_vars == 'undefined') {
            thisClass.global_configuration.php_cfg_vars = {};
        }
        $(gl_c).children('conf').each(function () {
            var conf = $(this);
            var new_conf = {};
            new_conf.key = lz_global_base64_url_decode(conf.attr('key'));
            new_conf.value = lz_global_base64_url_decode(conf.attr('value'));
            new_conf.subkeys = {};
            $(conf).find('sub').each(function () {
                new_conf.subkeys[lz_global_base64_url_decode($(this).attr('key'))] = lz_global_base64_url_decode($(this).text());
            });
            thisClass.global_configuration.toplevel.push(new_conf);
        });
        $(gl_c).children('site').each(function () {
            var site = $(this);
            var index = lz_global_base64_url_decode(site.attr('index'));
            if (typeof thisClass.global_configuration.site[index] == 'undefined') {
                thisClass.global_configuration.site[index] = [];
            }
            $(site).find('conf').each(function () {
                var conf = $(this);
                var new_conf = {};
                new_conf.key = lz_global_base64_url_decode(conf.attr('key'));
                new_conf.value = lz_global_base64_url_decode(conf.attr('value'));
                new_conf.subkeys = {};
                $(conf).find('sub').each(function () {
                    new_conf.subkeys[lz_global_base64_url_decode($(this).attr('key'))] = lz_global_base64_url_decode($(this).text());
                    //console.log(lz_global_base64_url_decode($(this).attr('key')) + ' --- ' + lz_global_base64_url_decode($(this).text()));
                });
                thisClass.global_configuration.site[index].push(new_conf);
            });
        });
        $(gl_c).children('php_cfg_vars').each(function () {
            thisClass.global_configuration.php_cfg_vars['post_max_size'] = lz_global_base64_url_decode($(this).attr('post_max_size'));
            thisClass.global_configuration.php_cfg_vars['upload_max_filesize'] = lz_global_base64_url_decode($(this).attr('upload_max_filesize'));
        });

        myHash = lz_global_base64_url_decode(gl_c.attr('h'));

        for (var i=0; i<thisClass.global_configuration.site[0].length; i++) {
            if (thisClass.global_configuration.site[0][i].key == 'gl_input_list') {
                //console.log(thisClass.global_configuration.site[0][i]);
                for (var key in thisClass.global_configuration.site[0][i].subkeys) {
                    if (thisClass.global_configuration.site[0][i].subkeys.hasOwnProperty(key)) {
                        var customInput = {id: key, value: thisClass.global_configuration.site[0][i].subkeys[key]};
                        thisClass.inputList.setCustomInput(customInput);
                    }
                }
            }
        }

        thisClass.setConfigValues(thisClass.global_configuration);
    });

    return myHash;
};

ChatServerEvaluationClass.prototype.setConfigValues = function(global_config) {
    for (var i=0; i<global_config.toplevel.length; i++) {
        for (var key in global_config.toplevel[i].subkeys) {
            if (global_config.toplevel[i].subkeys.hasOwnProperty(key)) {
                if (key == 'poll_frequency_clients') {
                    this.pollFrequency = global_config.toplevel[i].subkeys[key];
                    //console.log(key + ': ' + global_config.toplevel[i].subkeys[key]);
                }
                if (key == 'timeout_clients') {
                    this.timeoutClients = global_config.toplevel[i].subkeys[key];
                    //console.log(key + ': ' + global_config.toplevel[i].subkeys[key]);
                }
                if (key == 'gl_site_name') {
                    this.siteName = global_config.toplevel[i].subkeys[key];
                    $('title').html(this.siteName);
                    //console.log(key + ': ' + global_config.toplevel[i].subkeys[key]);
                }
                if (key == 'gl_default_language') {
                    this.defaultLanguage = global_config.toplevel[i].subkeys[key];
                    //console.log(key + ': ' + global_config.toplevel[i].subkeys[key]);
                }
            }
        }
    }
};

ChatServerEvaluationClass.prototype.debuggingReadKeyValuePairFromConfig = function(keyPart) {
    var i, index;
    console.log('Top level');
    for (i=0; i<this.global_configuration.toplevel.length; i++) {
        if (this.global_configuration.toplevel[i].key.indexOf(keyPart) != -1 && this.global_configuration.toplevel[i].value != '') {
            index = this.lzm_commonTools.pad(i, 4, 0);
            console.log(index + ' : ' + this.global_configuration.toplevel[i].key + ' - ' + this.global_configuration.toplevel[i].value);
        }
    }
    for (var key in this.global_configuration.site) {
        if (this.global_configuration.site.hasOwnProperty(key)) {
            console.log('');
            console.log('Site ' + key);
            for (i=0; i<this.global_configuration.site[key].length; i++) {
                index = this.lzm_commonTools.pad(i, 4, 0);
                if (this.global_configuration.site[key][i].key.indexOf(keyPart) != -1 && this.global_configuration.site[key][i].value != '') {
                    console.log(index + ' : ' + this.global_configuration.site[key][i].key + ' - ' + this.global_configuration.site[key][i].value);
                }
            }
        }
    }
};

/**
 * Get the requests for forwardings of chats from the server's xml response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getExternalForward = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('ext_f').each(function () {
        //console.log(this);
        thisClass.new_ext_f = true;
        var ext_f = $(this);
        $(ext_f).find('fw').each(function () {
            var fw = $(this);
            var new_forward = {};
            var myAttributes = fw[0].attributes;
            for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
                new_forward[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
            }
            if ($.inArray(new_forward.id, thisClass.extForwardIdList) == -1) {
                thisClass.extForwardIdList.push(new_forward.id);
                thisClass.external_forwards.push(new_forward);

                var fwdByName = new_forward.i;
                var fwdFromName = new_forward.s;
                var fwdToName = new_forward.r;
                for (var intUserIndex=0; intUserIndex< thisClass.internal_users.length; intUserIndex++) {
                    if (new_forward.i == thisClass.internal_users[intUserIndex].id) {
                        fwdByName = thisClass.internal_users[intUserIndex].name;
                    }
                    if (new_forward.s == thisClass.internal_users[intUserIndex].id) {
                        fwdFromName = thisClass.internal_users[intUserIndex].name;
                    }
                    if (new_forward.r == thisClass.internal_users[intUserIndex].id) {
                        fwdToName = thisClass.internal_users[intUserIndex].name;
                    }
                }
                var extUserId = new_forward.u.split('~')[0];
                var extUserBId = new_forward.u.split('~')[1];
                var extUserName = '';
                for (var extUserIndex=0; extUserIndex<thisClass.external_users.length; extUserIndex++) {
                    if (thisClass.external_users[extUserIndex].id == extUserId) {
                        for (var browserIndex=0; browserIndex<thisClass.external_users[extUserIndex].b.length; browserIndex++) {
                            if (thisClass.external_users[extUserIndex].b[browserIndex].id == extUserBId) {
                                extUserName = (thisClass.external_users[extUserIndex].b[browserIndex].cname != '') ?
                                    thisClass.external_users[extUserIndex].b[browserIndex].cname :
                                    thisClass.external_users[extUserIndex].unique_name;
                                break;
                            }
                        }
                        break;
                    }
                }
                extUserName = lzm_commonTools.htmlEntities(extUserName);

                var chatText = t('<!--visitor_name--> was forwarded by <!--fwd_by_name--> from <!--fwd_from_name--> to <!--my_name-->.',
                    [['<!--visitor_name-->','<b>'+extUserName+'</b>'],['<!--fwd_by_name-->','<b>'+fwdByName+'</b>'],
                        ['<!--fwd_from_name-->','<b>'+fwdFromName+'</b>'],['<!--my_name-->','<b>'+fwdToName+'</b>']]);
                if (new_forward.s == '') {
                    chatText = t('<!--visitor_name--> was forwarded by <!--fwd_by_name--> to <!--my_name-->.',
                        [['<!--visitor_name-->','<b>'+extUserName+'</b>'],['<!--fwd_by_name-->','<b>'+fwdByName+'</b>'],
                            ['<!--fwd_from_name-->','<b>'+fwdFromName+'</b>'],['<!--my_name-->','<b>'+fwdToName+'</b>']]);
                }
                if (new_forward.t != '' && new_forward.r == thisClass.myId) {
                    chatText += ' ' + t(' Additional comment: <!--fwd_comment-->', [['<!--fwd_comment-->', '<b>'+new_forward.t+'</b>']]);
                }
                var new_chat = {};
                new_chat.id = md5(String(Math.random())).substr(0, 32);
                new_chat.rp = '';
                new_chat.sen = '0000000';
                new_chat.rec = '';
                new_chat.reco = new_forward.u;
                var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                new_chat.cmc = thisClass.chatMessageCounter++;
                thisClass.chatMessageCounter++;
                new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', thisClass.userLanguage);
                new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', thisClass.userLanguage);
                new_chat.text = chatText;

                thisClass.addNewChat(new_chat);
            } else {
                for (var i = 0; i < thisClass.external_forwards.length; i++) {
                    for (var key in thisClass.external_forwards[i]) {
                        if (thisClass.external_forwards[i].hasOwnProperty(key)) {
                            if (new_forward[key] != '' && typeof new_forward[key] != 'undefined') {
                                thisClass.external_forwards[i][key] = new_forward[key];
                            }
                        }
                    }
                }
            }
            //console.log(new_forward.r, new_forward.u);
            //console.log(thisClass.chatObject[new_forward.u]);
            for (var chatIndex = 0; chatIndex < thisClass.chats.length; chatIndex++) {
                if (new_forward.r == thisClass.myId && (thisClass.chats[chatIndex].sen == new_forward.u ||
                    thisClass.chats[chatIndex].reco == new_forward.u)) {
                    //console.log(thisClass.chats[chatIndex]);
                    //if (thisClass.settingsDialogue || thisClass.chats[chatIndex].sen_id != thisClass.active_chat) {
                        if (thisClass.chats[chatIndex].sen != '0000000' &&
                            thisClass.chats[chatIndex].sen != thisClass.myId &&
                            (thisClass.chats[chatIndex].sen.indexOf('~') != -1)) {
                            if (typeof thisClass.chatObject[thisClass.chats[chatIndex].sen] == 'undefined') {
                                thisClass.chatObject[thisClass.chats[chatIndex].sen] = {
                                    status: 'new', type: 'external', data: [], id: thisClass.chats[chatIndex].sen_id, b_id: thisClass.chats[chatIndex].sen_b_id
                                };
                                //logit(thisClass.chatObject[thisClass.chats[chatIndex].sen]);
                            }
                            //console.log('New here');
                            thisClass.chatObject[thisClass.chats[chatIndex].sen]['data'].push(thisClass.chats[chatIndex]);
                        }
                    //}
                }
            }
        });
        myHash = lz_global_base64_url_decode(ext_f.attr('h'));
    });
    return myHash;
};

/**
 * Get the external users from the server's xml response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getExternalUsers = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    var tmpExtUsers = [];
    var tmpExtUserIdList = [];
    for (var i=0; i<thisClass.external_users.length; i++) {
        //console.log('Checking user ' + thisClass.external_users[i].id);
        //console.log(thisClass.external_users[i].is_active);
        if (thisClass.external_users[i].is_active || isVisitorNeededInGui(thisClass.external_users[i].id)) {
            tmpExtUsers.push(thisClass.external_users[i]);
            tmpExtUserIdList.push(thisClass.external_users[i].id);
            //console.log('Keep user ' + thisClass.external_users[i].id);
        } else {
            //console.log('Remove user ' + thisClass.external_users[i].id);
        }
    }
    thisClass.external_users = tmpExtUsers;
    thisClass.extUserIdList = tmpExtUserIdList;
    $(xmlDoc).find('ext_u').each(function () {
        //logit(this);
        var ext_u = $(this);
        thisClass.new_ext_u = true;

        // Get the user data
        $(ext_u).find('v').each(function () {
            var v = $(this);
            thisClass.addExtUserV(v);
        });
        $(ext_u).find('cd').each(function () {
            var cd = $(this);
            thisClass.addExtUserCd(cd);
        });

        myHash = lz_global_base64_url_decode(ext_u.attr('h'));
    });
    return myHash;
};

ChatServerEvaluationClass.prototype.getGlobalTyping = function(xmlDoc) {
    var thisClass = this;
    var myHash = '', oldTypingIdList = [];

    $(xmlDoc).find('gl_typ').each(function () {
        thisClass.new_glt = true;
        oldTypingIdList = thisClass.globTypingIdList;
        thisClass.global_typing = [];
        thisClass.globTypingIdList = [];
        var gl_typ = $(this);
        $(gl_typ).find('v').each(function() {
            var thisGlTyp = {
                id: lz_global_base64_url_decode($(this).attr('id')),
                tp: lz_global_base64_url_decode($(this).attr('tp'))
            };
            thisClass.global_typing.push(thisGlTyp);
            thisClass.globTypingIdList.push(thisGlTyp.id);
            if (thisGlTyp.id.indexOf('~') != -1) {
                if ($.inArray(thisGlTyp.id, oldTypingIdList) == -1) {
                    thisClass.globalTypingChanges.push(thisGlTyp.id.split('~')[0]);
                    //console.log('Add ' + thisGlTyp.id + ' to changes list, because it was not in old');
                }
            }
        });
        for (var i=0; i<oldTypingIdList.length; i++) {
            if (oldTypingIdList[i].indexOf('~') != -1) {
                if ($.inArray(oldTypingIdList[i], thisClass.globTypingIdList) == -1) {
                    thisClass.globalTypingChanges.push(oldTypingIdList[i].split('~')[0]);
                    //console.log('Add ' + oldTypingIdList[i] + ' to changes list, because it is not in new');
                }
            }
        }

        myHash = lz_global_base64_url_decode(gl_typ.attr('h'));
    });

    return myHash;
};

/**
 * Add the external user's cd value
 * @param cd
 */
ChatServerEvaluationClass.prototype.addExtUserCd = function (cd) {
    var thisClass = this;
    var cdId = lz_global_base64_url_decode(cd.attr('id'));
    var externalUserIndex = 0;
    var i = 0;
    for (i = 0; i < thisClass.external_users.length; i++) {
        if (thisClass.external_users[i].id == cdId) {
            externalUserIndex = i;
            break;
        }
    }

    var bdExists = false;
    $(cd).find('bd').each(function () {
        var bd = $(this);
        thisClass.addExtUserCdBd(bd, externalUserIndex, cdId);
        bdExists = bdExists || true;
    });

    var userIsActive = false;
    if (cdId == thisClass.external_users[externalUserIndex].id && bdExists) {
        for (i = 0; i < thisClass.external_users[externalUserIndex].b.length; i++) {
            userIsActive = userIsActive || thisClass.external_users[externalUserIndex].b[i].is_active;
            if (typeof thisClass.chatObject[thisClass.external_users[externalUserIndex].id + '~' + thisClass.external_users[externalUserIndex].b[i].id] != 'undefined') {
                if (!thisClass.external_users[externalUserIndex].b[i].is_active) {
                    markVisitorAsLeft(thisClass.external_users[externalUserIndex].id, thisClass.external_users[externalUserIndex].b[i].id);
                    try {
                        //console.log('Left in add cd');
                        //console.log('This chat\'s browser is inactive');
                    } catch(ex) {
                        // Do nothing!
                    }
                }
            }
        }
    }
    thisClass.external_users[externalUserIndex].is_active = userIsActive;
    if (!userIsActive) {
        var matchString = new RegExp('^' + cdId + '~');
        //console.log(matchString);
        for (var sender in thisClass.chatObject) {
            if (thisClass.chatObject.hasOwnProperty(sender)) {
                if (sender.match(matchString) != null) {
                    markVisitorAsLeft(sender.split('~')[0], sender.split('~')[1])
                }
            }
        }
        if (cdId == thisClass.external_users[externalUserIndex].id) {
            try {
                //console.log(cdId + ' --- ' + thisClass.external_users[externalUserIndex].id);
                //console.log('Left in add cd');
                //console.log('The user is inactive');
            } catch(ex) {
                // Do nothing!
            }
            for (i=0; i<thisClass.external_users[externalUserIndex].b.length; i++) {
                //console.log(thisClass.external_users[externalUserIndex].b[i].id + ' --- ' + thisClass.external_users[externalUserIndex].b[i].is_active);
                if (thisClass.external_users[externalUserIndex].b[i].is_active) {
                    thisClass.external_users[externalUserIndex].b[i].is_active = false;
                    var historyLength = thisClass.external_users[externalUserIndex].b[i].h2.length;
                    thisClass.external_users[externalUserIndex].b[i].h2[historyLength - 1].time2 = lzm_chatTimeStamp.getServerTimeString();
                }
                //console.log(thisClass.external_users[externalUserIndex].b[i].id + ' --- ' + thisClass.external_users[externalUserIndex].b[i].is_active);
            }
        }
    }
};

/**
 * Add the external user's bd value to its cd
 * @param bd
 */
ChatServerEvaluationClass.prototype.addExtUserCdBd = function (bd, externalUserIndex, cdId) {
    var thisClass = this;
    var bdId = lz_global_base64_url_decode(bd.attr('id'));
    for (var i = 0; i < thisClass.external_users[externalUserIndex].b.length; i++) {
        if (thisClass.external_users[externalUserIndex].b[i].id == bdId) {
            thisClass.external_users[externalUserIndex].b[i].is_active = false;
            var historyLength = thisClass.external_users[externalUserIndex].b[i].h2.length;
            thisClass.external_users[externalUserIndex].b[i].h2[historyLength - 1].time2 = lzm_chatTimeStamp.getServerTimeString();
            //console.log(thisClass.external_users[externalUserIndex].id + '~' + bdId + ' has left!');
            if (typeof thisClass.chatObject[thisClass.external_users[externalUserIndex].id + '~' + bdId] != 'undefined') {
                markVisitorAsLeft(thisClass.external_users[externalUserIndex].id, bdId);
                try {
                    //console.log('Left in add bd');
                } catch(ex) {
                    // Do nothing!
                }
            }
            break;
        }
    }
};

ChatServerEvaluationClass.prototype.addExtUserR = function(r) {
    var new_r = {};
    var myAttributes = r[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_r[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    new_r.text = lz_global_base64_url_decode(r.text());
    return new_r;
};

ChatServerEvaluationClass.prototype.addExtUserC = function(c) {
    var new_c = {};
    var myAttributes = c[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_c[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    new_c.text = lz_global_base64_url_decode(c.text());
    return new_c;
};

/**
 * Add the values of the b object to the external user
 * @param b
 * @return {Object}
 */
ChatServerEvaluationClass.prototype.addExtUserVB = function (b, id, unique_name) {
    var thisClass = this;
    var new_b = {};
    var myAttributes = b[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_b[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    //console.log(new_b.id + ': ' + JSON.stringify(new_b));
    new_b.h = {time: '', url: '', title: '', code: '', cp: ''};
    new_b.h2 = [];
    new_b.fupr = {};
    new_b.is_active = true;
    new_b.chat = {id: ''};
    $(b).find('h').each(function () {
        var h = $(this);
        new_b.h = thisClass.addExtUserVBH(h);
        new_b.h2.push(thisClass.addExtUserVBH(h));
    });
    $(b).find('chat').each(function () {
        var chat = $(this);
        new_b.chat = thisClass.addExtUserVBChat(chat, id, new_b.id);
    });
    //console.log(new_b.id + ' --- ' + new_b.chat.id);
    $(b).find('fupr').each(function () {
        var fupr = $(this);
        var name = (new_b.cname != '') ? new_b.cname : unique_name;
        thisClass.addExtUserVBFupr(fupr, id, new_b.id, name, new_b.chat.id);
    });
    return new_b;
};

/**
 * Add the chat object to the external user's b data
 * @param chat
 * @param id
 * @param b_id
 * @return {Object}
 */
ChatServerEvaluationClass.prototype.addExtUserVBChat = function (chat, id, b_id) {
    var new_chat = {};
    var myAttributes = chat[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_chat[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    new_chat.pn = {acc: '', member: {}};
    new_chat.cf = {};

    $(chat).find('pn').each(function () {
        //console.log(this);
        new_chat.pn.acc = lz_global_base64_url_decode($(this).attr('acc'));
        new_chat.pn.member = [];
        new_chat.pn.memberIdList = [];

        $(this).find('member').each(function () {
            var myAttributes = $(this)[0].attributes;
            var new_member = {};
            for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
                new_member[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
            }
            //console.log(new_member);
            new_chat.pn.member.push(new_member);
            new_chat.pn.memberIdList.push(new_member.id);
        });
    });
    $(chat).find('cf').each(function () {
        new_chat.cf[lz_global_base64_url_decode($(this).attr('index'))] = lz_global_base64_url_decode($(this).text());
    });
    return new_chat;
};

ChatServerEvaluationClass.prototype.addExtUserVBFupr = function (fupr, id, b_id, name, chat_id) {
    var new_fupr = {};
    var myAttributes = fupr[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_fupr[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }

    var fuprIndex = $.inArray(new_fupr.id, this.fuprIdList);
    var date = lzm_chatTimeStamp.getServerTimeString(null, true);
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject(date, true);

    var new_chat;
    var fuprName = this.lzm_commonTools.htmlEntities(new_fupr.fn);
    if (fuprIndex == -1) {
        this.fuprs.push(new_fupr);
        this.fuprIdList.push(new_fupr.id);
        new_chat = {id: md5(String(Math.random())).substr(0, 32),
            date: date,
            cmc: this.chatMessageCounter,
            date_human: this.lzm_commonTools.getHumanDate(tmpdate, 'date', this.userLanguage),
            time_human: this.lzm_commonTools.getHumanDate(tmpdate, 'time', this.userLanguage),
            rec: '', rp: '', sen: '0000000',
            text: t('The visitor requested to upload the file <!--request_upload_this-->.',
                [['<!--request_upload_this-->','<b>' + this.lzm_commonTools.htmlEntities(new_fupr.fn) + '</b>']]) + '<br>' +
                t('Do you want to allow this?') + '&nbsp;&nbsp;&nbsp;'+
                '<a class="lz_chat_accept" href="#" id="allow-upload" ' +
                'onclick="handleUploadRequest(\'' + new_fupr.id + '\', \''+ fuprName +'\', \''+ id +'\', \''+ b_id +'\', \'allow\', \'' + chat_id + '\')">' +
                t('Accept') + '</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<a class="lz_chat_decline" href="#" id="deny-upload" ' +
                'onclick="handleUploadRequest(\'' + new_fupr.id + '\', \''+ fuprName +'\', \''+ id +'\', \''+ b_id +'\', \'deny\', \'' + chat_id + '\')">' +
                t('Decline') + '</a>',
            reco: id + '~' + b_id};
        this.chatMessageCounter++;
        this.chats.push(new_chat);
    } else {
        this.fuprs[fuprIndex] = new_fupr;
        if (typeof new_fupr.download != 'undefined' && new_fupr.download == '1' &&
            $.inArray(new_fupr.id, this.fuprDownloadIdList) == -1) {
            this.fuprDownloadIdList.push(new_fupr.id);
            var downloadLink = '<a class="lz_chat_file" target="_blank" href="' + this.serverProtocol + this.serverUrl + '/getfile.php?' +
                'acid=' + this.lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5) +
                '&id=' + new_fupr.fid + '">';
            new_chat = {id: md5(String(Math.random())).substr(0, 32),
                date: date,
                cmc: this.chatMessageCounter,
                date_human: this.lzm_commonTools.getHumanDate(tmpdate, 'date', this.userLanguage),
                time_human: this.lzm_commonTools.getHumanDate(tmpdate, 'time', this.userLanguage),
                rec: '', rp: '', sen: '0000000',
                text: t('You can download the file <!--download_file_name--> provided by the visitor <!--download_link_begin-->here<!--download_link_end-->.',
                        [['<!--download_file_name-->','<b>' + fuprName + '</b>'],
                            ['<!--download_link_begin-->',downloadLink],['<!--download_link_end-->','</a>']]),
                reco: id + '~' + b_id};
            this.chatMessageCounter++;
            this.chats.push(new_chat);
        }
    }
};

/**
 * Add the values of the h object to the external user
 * @param h
 * @return {Object}
 */
ChatServerEvaluationClass.prototype.addExtUserVBH = function (h) {
    var new_h = {};
    var myAttributes = h[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_h[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    return new_h;
};

ChatServerEvaluationClass.prototype.checkIfBExists = function (id, b_id) {
    var returnValue = false;
    var thisVisitor = {};
    if (this.external_users.length > 0) {
        for (var i = 0; i < this.external_users.length; i++) {
            if (id == this.external_users[i].id) {
                thisVisitor = this.external_users[i];
                break;
            }
        }
        if (thisVisitor.b.length > 0) {
            for (var j = 0; j < thisVisitor.b.length; j++) {
                if (b_id == thisVisitor.b[j].id) {
                    returnValue = true;
                    break;
                }
            }
        }
    }
    //console.log(id + '~' + b_id + ' --- ' + returnValue);
    return returnValue;
};

ChatServerEvaluationClass.prototype.updateB = function (existingBs, newB) {
    //console.log(newB);
    for (var i = 0; i < existingBs.length; i++) {
        if (newB.id == existingBs[i].id) {
            newB.hasChanged = false;
            //console.log(newB);
            for (var key in newB) {
                if (newB.hasOwnProperty(key)) {
                    if (key == 'chat' && (newB[key].id == existingBs[i][key].id)) {
                        var newChat = {};
                        for (var chatKey in newB[key]) {
                            if (newB[key].hasOwnProperty(chatKey)) {
                                if (chatKey == 'pn') {
                                    //console.log(newB[key][chatKey]);
                                    newChat[chatKey] = {};
                                    newChat[chatKey].acc = newB[key][chatKey].acc;
                                    //console.log(newB[key][chatKey].member);
                                    if (typeof existingBs[i][key][chatKey] != 'undefined') {
                                        newChat[chatKey].oldMember =  existingBs[i][key][chatKey].member;
                                        newChat[chatKey].oldMemberIdList = existingBs[i][key][chatKey].memberIdList;
                                        newChat[chatKey].member = newB[key][chatKey].member;
                                        newChat[chatKey].memberIdList = newB[key][chatKey].memberIdList;
                                    } else {
                                        newChat[chatKey] = newB[key][chatKey];
                                    }
                                } else {
                                    newChat[chatKey] = newB[key][chatKey];
                                }
                            }
                        }
                        existingBs[i][key] = newChat;
                    } else {
                        if ((typeof newB[key] == 'string' && newB[key] != '') ||
                            (typeof newB[key] == 'object' && newB[key] instanceof Array && newB[key].length != 0) ||
                            (typeof newB[key] == 'boolean') ||
                            (typeof newB[key] == 'object' && !(newB[key] instanceof Array)) && !$.isEmptyObject(newB[key])) {
                            existingBs[i][key] = newB[key];
                            existingBs[i].hasChanged = true;
                        }
                    }
                }
            }
            break;
        }
    }
    //console.log(existingBs);
    return existingBs;
};

ChatServerEvaluationClass.prototype.createUniqueName = function(idString) {
    //console.log(idString);
    var mod = 111;
    var digit;
    for (var i=0; i<idString.length; i++) {
        digit = 0;
        if (!isNaN(parseInt(idString.substr(i,1)))) {
            digit = parseInt(idString.substr(i,1));
            //console.log(i + ' --- ' + digit);
            mod = (mod + (mod* (16+digit)) % 1000);
            if (mod % 10 == 0) {
                mod += 1;
            }
        }
    }
    var result = String(mod).substr(String(mod).length-4,4);
    //console.log(result);
    return result;
};

ChatServerEvaluationClass.prototype.setExternalUserList = function(type, list) {
    if (type == 'changed') {
        this.changedExternalUsers = list;
    } else if (type == 'new') {
        this.newExternalUsers = list;
    }
};

ChatServerEvaluationClass.prototype.getExternalUserList = function(type) {
    var list;
    if (type == 'changed') {
        list = this.changedExternalUsers;
    } else if (type == 'new') {
        list = this.newExternalUsers;
    }
    return list;
};

/**
 * Add an external user to the users array
 * @param v
 */
ChatServerEvaluationClass.prototype.addExtUserV = function (v) {
    var thisClass = this;
    var new_user = {}, userLangString = '';
    var md5Test = md5((new XMLSerializer()).serializeToString(v[0]).replace(/\r/g, '').replace(/\n/g, ''));
    var md5Empty = md5('<v id="' + v.attr('id') + '"></v>');
    if (md5Test != md5Empty) {
        new_user.md5 = md5Test;
        //console.log((new XMLSerializer()).serializeToString(v[0]).replace(/\r/g, '').replace(/\n/g, ''));
    }
    var bIndex;
    var myAttributes = v[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_user[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
        //console.log(myAttributes[attrIndex].nodeName + ' --- ' + lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue));
    }
    if ((typeof new_user.ctryi2 == 'undefined' || new_user.ctryi2 == '') && (typeof new_user.lang != 'undefined' && new_user.lang != '')) {
        new_user.ctryi2 = new_user.lang;
    }
    var b_stringEntries = ['b_id', 'b_ol', 'b_olc', 'b_ss', 'b_ka', 'b_ref', 'b_cname', 'b_cemail', 'b_cphone', 'b_ccompany',
        'b_h_time', 'b_h_url', 'b_h_title', 'b_h_code', 'b_h_cp'];
    for (bIndex = 0; bIndex < b_stringEntries.length; bIndex++) {
        new_user[b_stringEntries[bIndex]] = '';
    }
    if (typeof new_user.ip != 'undefined') {
        new_user.unique_name = t('Visitor <!--visitor_number-->',[['<!--visitor_number-->',thisClass.createUniqueName(new_user.id + new_user.ip)]]);
    }

    new_user.b = [];
    var b_idList = [];
    new_user.b_chat = {id: ''};
    new_user.is_active = true;
    //console.log('');
    //console.log('Found the following browsers:');
    $(v).find('b').each(function () {
        var b = $(this);

        var tmp_b = thisClass.addExtUserVB(b, new_user.id, new_user.unique_name);
        //console.log(this);

        // Deprecated (but still used) old ext user b variant
        new_user.b_id = tmp_b.id;
        new_user.b_ol = tmp_b.ol;
        new_user.b_olc = tmp_b.olc;
        new_user.b_ss = tmp_b.ss;
        new_user.b_ka = tmp_b.ka;
        new_user.b_ref = tmp_b.ref;
        new_user.b_cname = tmp_b.cname;
        new_user.b_cemail = tmp_b.cemail;
        new_user.b_cphone = tmp_b.cphone;
        new_user.b_ccompany = tmp_b.ccompany;
        new_user.b_chat = tmp_b.chat;
        new_user.b_h_time = tmp_b.h.time;
        new_user.b_h_url = tmp_b.h.url;
        new_user.b_h_title = tmp_b.h.title;
        new_user.b_h_code = tmp_b.h.code;
        new_user.b_h_cp = tmp_b.h.cp;
        new_user.b.push(tmp_b);
        b_idList.push(tmp_b.id);
        //console.log('Tmp : ' + tmp_b.id);
        //console.log(new_user.id + '~' + tmp_b.id + ' --- ' + tmp_b.chat.id);
    });
    new_user.r = [];
    new_user.rIdList = [];
    $(v).find('r').each(function () {
        var r = $(this);
        var tmp_r = thisClass.addExtUserR(r);
        if ($.inArray(tmp_r.i, new_user.rIdList)) {
            new_user.rIdList.push(tmp_r.i);
            new_user.r.push(tmp_r);
        } else {
            for (var rNo=0; rNo<new_user.r.length; rNo++) {
                if (new_user.r[rNo].i == tmp_r.i) {
                    //console.log('Update new user r');
                    new_user.r[rNo] = tmp_r;
                }
            }
        }
    });
    new_user.c = [];
    new_user.cIdList = [];
    $(v).find('c').each(function () {
        var c = $(this);
        var tmp_c = thisClass.addExtUserC(c);
        if ($.inArray(tmp_c.id, new_user.cIdList)) {
            new_user.cIdList.push(tmp_c.id);
            new_user.c.push(tmp_c);
        } else {
            for (var cNo=0; cNo<new_user.c.length; cNo++) {
                if (new_user.c[cNo].id == tmp_c.id) {
                    //console.log('Update new user c');
                    new_user.c[cNo] = tmp_c;
                }
            }
        }
    });
    var externalUserId = new_user.id;

    // check if it's a new user. if yes add him if no update the user's data
    if ($.inArray(externalUserId, thisClass.extUserIdList) == -1) {
        thisClass.extUserIdList.push(externalUserId);
        thisClass.external_users.push(new_user);
        thisClass.newExternalUsers.push(externalUserId);
        userLangString = new_user.lang;
    } else {
        var userHasChanged = false;
        for (var i = 0; i < thisClass.external_users.length; i++) {
            if (thisClass.external_users[i].id == externalUserId) {
                userLangString = thisClass.external_users[i].lang;
                userHasChanged = userHasChanged || thisClass.updateUserValues(new_user);

                if (new_user.b_chat.id != '') {
                    thisClass.external_users[i].b_chat = new_user.b_chat;
                }
                if (typeof thisClass.external_users[i].b == 'undefined') {
                    thisClass.external_users[i].b = [];
                }

                if (new_user.b.length > 0) {
                    for (var j = 0; j < new_user.b.length; j++) {
                        if (thisClass.checkIfBExists(new_user.id, new_user.b[j].id) == false) {
                            thisClass.external_users[i].b.push(new_user.b[j]);
                            userHasChanged = true;
                        } else {
                            thisClass.external_users[i].b = thisClass.updateB(thisClass.external_users[i].b, new_user.b[j]);
                            if (thisClass.external_users[i].b.hasChanged) {
                                userHasChanged = true;
                            }
                        }
                    }
                }
                new_user.b = thisClass.external_users[i].b;
                break;
            }
        }
        if (userHasChanged) {
            thisClass.changedExternalUsers.push(externalUserId);
        }
    }
    if (new_user.b.length > 0) {
        for (bIndex=0; bIndex<new_user.b.length; bIndex++) {
            if (typeof new_user.b[bIndex].chat != 'undefined' && new_user.b[bIndex].chat.id != '' &&
                typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] == 'undefined') {
                var chatNotDeclined = true;
                for (var l=0; l<new_user.b[bIndex].chat.pn.member.length; l++) {
                    if (new_user.b[bIndex].chat.pn.member[l].id == thisClass.myId && new_user.b[bIndex].chat.pn.member[l].dec == 1) {
                        chatNotDeclined = false;
                    }
                }
                if ((new_user.b[bIndex].chat.at == 0 || (new_user.b[bIndex].chat.at * 1000) > thisClass.loginTime) &&
                    $.inArray(thisClass.myId, new_user.b[bIndex].chat.pn.memberIdList) != -1 &&
                    chatNotDeclined) {
                    thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] = {
                        status: 'new', type: 'external', data: [], id: new_user.id, b_id: new_user.b[bIndex].id
                    };
                    //logit(thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id]);
                    addChatInfoBlock(new_user.id, new_user.b[bIndex].id);
                    thisClass.browserChatIdList.push(new_user.b[bIndex].chat.id);
                    if (isAutoAcceptActive()) {
                        lzm_chatUserActions.acceptChat(new_user.id, new_user.b[bIndex].id, new_user.b[bIndex].chat.id,
                            new_user.id + '~' + new_user.b[bIndex].id, userLangString);
                    }
                }
            }
            if (typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] != 'undefined' &&
                typeof new_user.b[bIndex].chat != 'undefined' &&
                (typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].chat_id == 'undefined' ||
                thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].chat_id == '')) {
                //console.log('Set chat id of chat object ' +  new_user.id + '~' + new_user.b[bIndex].id + ' to ' + new_user.b[bIndex].chat.id);
                thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].chat_id = new_user.b[bIndex].chat.id;
            }

            if (typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] != 'undefined' && typeof new_user.b[bIndex].chat.pn != 'undefined' &&
                new_user.b[bIndex].chat.pn.acc == 1) {
                //console.log (new_user.b[bIndex].chat.pn);
                for (var n=0; n<new_user.b[bIndex].chat.pn.member.length; n++) {
                    if (new_user.b[bIndex].chat.pn.member[n].id != thisClass.myId && new_user.b[bIndex].chat.pn.member[n].st == 0) {
                        removeFromOpenChats(new_user.id + '~' + new_user.b[bIndex].id, true, true, new_user.b[bIndex].chat.pn.member, 'addExtUserV');
                        break;
                    } else if (new_user.b[bIndex].chat.pn.member[n].id == thisClass.myId && new_user.b[bIndex].chat.pn.member[n].st == 0) {
                        addOpLeftMessageToChat(new_user.id + '~' + new_user.b[bIndex].id, new_user.b[bIndex].chat.pn.oldMember, new_user.b[bIndex].chat.pn.memberIdList);
                    }
                }
            }


            if (typeof new_user.b[bIndex].chat.pn != 'undefined' && typeof new_user.b[bIndex].chat.pn.member != 'undefined' &&
                (typeof new_user.b[bIndex].chat.pn.memberIdList != 'undefined' && $.inArray(thisClass.myId, new_user.b[bIndex].chat.pn.memberIdList) != -1)) {

                if (typeof thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id] == 'undefined') {
                    thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id] = {past: [], present: []};
                }
                thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].past = thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].present;
                thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].present = [];
                var tmpPast = [];
                for (var m=0; m<new_user.b[bIndex].chat.pn.member.length; m++) {
                    if ($.inArray(new_user.b[bIndex].chat.pn.member[m].id, thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].past) != -1) {
                        tmpPast.push(new_user.b[bIndex].chat.pn.member[m].id);
                    }
                    //console.log(new_member.dec + ' - ' + new_member.id);
                    if (new_user.b[bIndex].chat.pn.member[m].dec == 0) {
                        thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].present.push(new_user.b[bIndex].chat.pn.member[m].id);
                    }
                }
                thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id].past = tmpPast;
                addDeclinedMessageToChat(new_user.id , new_user.b[bIndex].id, thisClass.chatPartners[new_user.id + '~' + new_user.b[bIndex].id]);
            }


        }
        for (bIndex=0; bIndex<new_user.b.length; bIndex++) {
            if (typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] != 'undefined') {
                if (typeof new_user.b[bIndex].chat != 'undefined' && typeof new_user.b[bIndex].chat.eq != 'undefined') {
                    thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].eq = new_user.b[bIndex].chat.eq;
                }
                if (typeof new_user.b[bIndex].cname != 'undefined') {
                    thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].name = new_user.b[bIndex].cname;
                }
                if ((new_user.b[bIndex].chat == 'undefined' || new_user.b[bIndex].chat.id == '') &&
                    typeof thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id] != 'undefined' &&
                    thisClass.chatObject[new_user.id + '~' + new_user.b[bIndex].id].status != 'left') {
                    markVisitorAsLeft(new_user.id, new_user.b[bIndex].id);
                    try {
                        //console.log('Left in add ext user v because of missing chat or empty chat id');
                        //console.log(JSON.stringify(new_user.b));
                    } catch(ex) {
                        // Do nothing!
                    }
                }
            }
        }
        //console.log(thisClass.globTypingIdList);
        for (var k=0; k<new_user.b.length; k++) {
            //console.log(new_user.b[k].chat.id);
            if (new_user.b[k].chat.id != '' && $.inArray(new_user.b[k].chat.id, thisClass.browserChatIdList) == -1 &&
                typeof thisClass.chatObject[new_user.id + '~' + new_user.b[k].id] != 'undefined') {
                var member = [];
                if (typeof new_user.b[k].chat.pn != 'undefined') {
                    member = new_user.b[k].chat.pn.member;
                }
                //console.log('********** ' + new_user.b[k].chat.f + ' **********');
                markVisitorAsBack(new_user.id, new_user.b[k].id, new_user.b[k].chat.id, member);
            }
            if ($.inArray(new_user.id + '~' + new_user.b[k].id, thisClass.globTypingIdList) == -1 &&
                typeof thisClass.chatObject[new_user.id + '~' + new_user.b[k].id] != 'undefined' &&
                thisClass.chatObject[new_user.id + '~' + new_user.b[k].id].status != 'left') {
                //console.log('Remove: ' + new_user.id + '~' + new_user.b[k].id);
                markVisitorAsLeft(new_user.id, new_user.b[k].id);
                try {
                    //console.log('Left in add ext user v because of missing gl_typ entry');
                    //console.log(new_user.id + JSON.stringify(new_user.b[k].id));
                    //console.log(JSON.stringify(thisClass.global_typing));
                } catch(ex) {
                // Do nothing!
                }
            }
        }
    }
};

ChatServerEvaluationClass.prototype.updateUserValues = function (new_user) {
    var rtValue = false;
    if (typeof new_user.id != 'undefined' && new_user.id != '') {
        for (var i=0; i<this.external_users.length; i++) {
            if (this.external_users[i].id == new_user.id) {
                for (var key in new_user) {
                    if (new_user.hasOwnProperty(key)) {
                        if (key != 'b_chat' && key != 'b' && typeof new_user[key] != 'undefined' && new_user[key] != '') {
                            //console.log(key + ' --- ' + new_user[key]);
                            this.external_users[i][key] = new_user[key];
                            rtValue = true;
                        }
                    }
                }
                break;
            }
        }
    }
    return rtValue;
};

/**
 * Get validation errors from the server response. If there are any, log out.
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getValidationError = function (xmlDoc) {
    var error_value = -1;
    $(xmlDoc).find('validation_error').each(function () {
        if (error_value == -1) {
            error_value = lz_global_base64_url_decode($(this).attr('value'));
        }
    });
    return error_value;
};

/**
 * Get the ext_c values from the server's xml report
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getChats = function (xmlDoc) {
    var thisClass = this;
    var chatReturn = {dut: ''};
    $(xmlDoc).find('ext_c').each(function () {
        //console.log('Get chat archive');
        var ext_c = $(this);
        $(ext_c).children('dc').each(function () {
            thisClass.chatArchive = {chats: [], q: '', p: 20, t: 0};
            var myAttributes = $(this)[0].attributes;
            for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
                //console.log(myAttributes[attrIndex].nodeName + ' --- ' + lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue));
                if (myAttributes[attrIndex].nodeName == 'dut') {
                    chatReturn['dut'] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
                }
                thisClass.chatArchive[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
            }
            //thisClass.chatArchive.chats = [];
            $(this).children('c').each(function () {
                var c = $(this);
                thisClass.chatArchive.chats.push(thisClass.addArchivedChat(c));
            });
            thisClass.new_dc = true;
        });
    });
    thisClass.archiveFetchTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    return chatReturn;
};

ChatServerEvaluationClass.prototype.addArchivedChat = function(c) {
    var thisClass= this;
    var new_c = {cc: []};
    var myAttributes = c[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        //console.log(myAttributes[attrIndex].nodeName + ' --- ' + lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue));
        new_c[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    c.children('chtml').each(function() {
        new_c.chtml = thisClass.replaceLinks(lz_global_base64_url_decode($(this).text()));
        //console.log(new_c.chtml);
    });
    c.children('cplain').each(function() {
        new_c.cplain = lz_global_base64_url_decode($(this).text());
        //console.log(new_c.cplain);
    });
    c.children('cc').each(function() {
        var new_cc = {cuid: lz_global_base64_url_decode($(this).attr('cuid')), text: lz_global_base64_url_decode($(this).text())};
        new_c.cc.push(new_cc);
    });
    return new_c;
};

ChatServerEvaluationClass.prototype.getResources = function (xmlDoc) {
    var thisClass = this;
    if ($.inArray('1', thisClass.resourceIdList) == -1) {
        var publicFolder = {
            di: "0",
            ed: "0",
            eid: "0000000",
            oid: "0000000",
            pid: "0",
            ra: "0",
            rid: "1",
            si: "6",
            t: "",
            text: t('Public'),
            ti: t('Public'),
            ty: "0"
        };
        thisClass.resources.push(publicFolder);
        thisClass.resourceIdList.push('1');
    }
    $(xmlDoc).find('ext_res').each(function() {
        //console.log(this);
        var ext_res = $(this);
        $(ext_res).find('r').each(function () {
            //console.log('');
            //console.log('');
            //console.log('Get resource ' + $(this).attr('rid'));
            //console.log('');
            thisClass.new_qrd = true;
            var new_r = {};
            var myAttributes = $(this)[0].attributes;
            for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
                //console.log(myAttributes[attrIndex].nodeName + ' --- ' + lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue));
                new_r[myAttributes[attrIndex].nodeName] = lz_global_base64_decode(myAttributes[attrIndex].nodeValue);
            }
            //console.log($(this).text());
            new_r.text = lz_global_base64_decode($(this).text());
            var foo = (new XMLSerializer()).serializeToString(this);
            new_r.md5 = md5(foo);

            if ($.inArray(new_r.rid, thisClass.resourceIdList) == -1) {
                if (new_r.di == 0) {
                    thisClass.resources.push(new_r);
                    thisClass.resourceIdList.push(new_r.rid);
                    //console.log('New resource --- ' + new_r.rid);
                }
            } else {
                var deleteResource;
                var tmpResources = [], tmpResourceIdList = [];
                for (var i = 0; i<thisClass.resources.length; i++) {
                    deleteResource = false;
                    if (new_r.rid == thisClass.resources[i].rid) {
                        if (new_r.di == 0) {
                            thisClass.resources[i] = new_r;
                            //console.log('Changed resource --- ' + new_r.rid);
                            //console.log(new_r);
                        } else if(new_r.disc == 0) {
                            //console.log('Do nothing');
                            //console.log(new_r);
                        } else {
                            //console.log('Deleted resource --- ' + new_r.rid);
                            //console.log(new_r);
                            deleteResource = true;
                        }
                    }
                    if (!deleteResource) {
                        tmpResources.push(thisClass.resources[i]);
                        tmpResourceIdList.push(thisClass.resources[i].rid);
                    }
                    if (thisClass.resources[i].di == 1) {
                        //console.log(thisClass.resources[i]);
                    }
                }
                thisClass.resources = tmpResources;
                thisClass.resourceIdList = tmpResourceIdList;
            }

            var editedTime = (typeof new_r.ed != 'undefined') ? new_r.ed : 0;
            thisClass.resourceLastEdited = Math.max(thisClass.resourceLastEdited, editedTime);
        });
    });

    return thisClass.resourceLastEdited;
};

ChatServerEvaluationClass.prototype.debuggingGetResourceByTitle = function(title, tag) {
    tag = (typeof tag != 'undefined') ? tag : 'ti';
    var bar = [];
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatServerEvaluation.resources[i][tag] == title) {
            bar.push(lzm_chatServerEvaluation.resources[i]);
        }
    }
    return bar;
};

ChatServerEvaluationClass.prototype.debuggingSearchForId = function(type, id) {
    var returnArray = [];
    for (var i=0; i<this.resources.length; i++) {
        if (this.resources[i][type] == id) {
            returnArray.push(this.resources[i]);
        }
    }
    return returnArray;
};

/**
 * Get the usr_p values (aka chats) from the server response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getUsrP = function (xmlDoc) {
    var thisClass = this;
    $(xmlDoc).find('usr_p').each(function () {
        //console.log(this);
        thisClass.new_usr_p = true;
        var usr_p = $(this);
        $(usr_p).find('val').each(function () {
            var val = $(this);
            thisClass.addUsrP(val);
        });
    });
};

/**
 * Get the departments from the server response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getDepartments = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('int_d').each(function () {
        thisClass.new_int_d = true;
        var int_d = $(this);
        thisClass.internal_departments = [];
        $(int_d).find('v').each(function () {
            try {
                var v = $(this);
                thisClass.internal_departments.push(thisClass.addDepartment(v));
            } catch(e) {}
        });

        myHash = lz_global_base64_url_decode(int_d.attr('h'));
    });
    return myHash;
};

/**
 * Get the internal users from the server response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getInternalUsers = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('int_r').each(function () {
        thisClass.new_int_u = true;
        var int_r = $(this);
        thisClass.internal_users = [];
        $(int_r).find('v').each(function () {
            //console.log(this);
            var v = $(this);
            thisClass.internal_users.push(thisClass.addInternalUser(v));
        });

        myHash = lz_global_base64_url_decode(int_r.attr('h'));
    });
    return myHash;
};

/**
 * Get the global errors from the server response
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getGlobalErrors = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('gl_e').each(function () {
        thisClass.new_gl_e = true;
        var gl_e = $(this);
        thisClass.global_errors = [];
        $(gl_e).find('val').each(function () {
            var val = $(this);
            thisClass.global_errors.push(lz_global_base64_url_decode(val.attr('err')));
        });

        myHash = lz_global_base64_url_decode(gl_e.attr('h'));
    });
    return myHash;
};

/**
 * Get the internal wp from the server response
 *
 * What is WP?
 *
 * @param xmlDoc
 */
ChatServerEvaluationClass.prototype.getIntWp = function (xmlDoc) {
    var thisClass = this;
    var myHash = '';
    $(xmlDoc).find('int_wp').each(function () {
        var int_wp = $(this);
        thisClass.wps = [];
        $(int_wp).find('v').each(function () {
            var v = $(this);
            thisClass.wps.push(thisClass.addWP(v));
        });

        myHash = lz_global_base64_url_decode(int_wp.attr('h'));
    });
    return myHash;
};

/**
 * Add a wp to the array
 *
 * What is WP?
 *
 * @param v
 */
ChatServerEvaluationClass.prototype.addWP = function (v) {
    var new_wp = {};
    var myAttributes = v[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_wp[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue)
    }
    return new_wp;
};

/**
 * add a usrP (aka chat) to the arrays
 * @param val
 */
ChatServerEvaluationClass.prototype.addUsrP = function (val) {
    var thisClass = this;
    var new_chat = {};
    var myAttributes = val[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_chat[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    new_chat.cmc = thisClass.chatMessageCounter;
    thisClass.chatMessageCounter++;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject(new_chat.date * 1000, true);
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', thisClass.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', thisClass.userLanguage);
    new_chat.dateObject = {
        day: lzm_commonTools.pad(tmpdate.getDate(), 2),
        month: lzm_commonTools.pad((tmpdate.getMonth() + 1), 2),
        year: lzm_commonTools.pad(tmpdate.getFullYear() ,4)
    };
    if (new_chat.sen.indexOf('~') != -1) {
        new_chat.sen_id = new_chat.sen.split('~')[0];
        new_chat.sen_b_id = new_chat.sen.split('~')[1];
    } else {
        new_chat.sen_id = new_chat.sen;
        new_chat.sen_b_id = '';
    }
    if (new_chat.rec != '' && new_chat.rec != new_chat.sen && new_chat.rec != new_chat.reco) {
        new_chat.sen_id = new_chat.rec;
        new_chat.sen_b_id = '';
    }
    var thisText = lz_global_base64_url_decode(val.text());
    if (new_chat.sen_b_id != '') {
        thisText = thisClass.addLinks(thisClass.escapeHtml(thisText));
    } else {
        //console.log(thisText);
        thisText = thisClass.replaceLinks(thisText);
    }
    new_chat.text = thisText;
    //console.log(new_chat.cmc + ' --- ' + new_chat.text);
    if ($.inArray(new_chat.id, thisClass.chatIdList) == -1) {

        //console.log(new_chat.id + ' --- ' + new_chat.text);
        thisClass.chatIdList.push(new_chat.id);
        thisClass.chats.push(new_chat);
        var thisSen;
        //console.log(thisClass.myId);
        //console.log(extUserBChatPnMemberIdList);
        if (new_chat.reco == thisClass.myId) {
            if (new_chat.sen != '0000000' && new_chat.sen != thisClass.myId) {
                thisSen = new_chat.sen;
                if (new_chat.rec != '' && new_chat.rec != new_chat.sen) {
                    thisSen = new_chat.rec;
                }
                if (typeof thisClass.chatObject[thisSen] == 'undefined') {
                    if (new_chat.sen.indexOf('~') == -1) {
                        thisClass.chatObject[thisSen] = {
                            status: 'new', data: [], id: new_chat.sen_id, b_id: new_chat.sen_b_id
                        };
                        //logit(thisClass.chatObject[thisSen]);
                        //console.log('Chat object ' + thisSen + ' due to new usr_p');
                        //console.log (thisClass.chatObject[thisSen]);
                        thisClass.chatObject[thisSen]['type'] = 'internal';
                    }
                } else {
                    thisClass.chatObject[thisSen]['data'].push(new_chat);
                }
                if (typeof thisClass.chatObject[thisSen] != 'undefined') {
                    if ((thisClass.settingsDialogue || new_chat.sen != thisClass.active_chat_reco || lzm_chatDisplay.selected_view != 'mychats') && new_chat.rp != 1) {
                        //console.log('Set chat status to new');
                        //console.log('Dialog: ' + thisClass.settingsDialogue + '  Active Chat: ' + new_chat.sen + ' - ' + thisClass.active_chat_reco + '  View: ' + lzm_chatDisplay.selected_view);
                        thisClass.chatObject[thisSen]['status'] = 'new';
                        if ($.inArray(new_chat.sen, lzm_chatUserActions.open_chats) == -1 &&
                            isAutoAcceptActive()) {
                            var chatId = '', chatLang = '';
                            for (var i=0; i<thisClass.external_users.length; i++) {
                                if (thisClass.external_users[i].id == new_chat.sen_id) {
                                    for (var j=0; j<thisClass.external_users[i].b.length; j++) {
                                        if (thisClass.external_users[i].b[j].id == new_chat.sen_b_id) {
                                            chatId = thisClass.external_users[i].b[j].chat.id;
                                        }
                                    }
                                    chatLang = thisClass.external_users[i].lang;
                                    break;
                                }
                            }
                            lzm_chatUserActions.acceptChat(new_chat.sen_id, new_chat.sen_b_id, chatId, new_chat.sen, chatLang);
                        }
                    }
                }

            }
        }
        if (new_chat.reco == thisClass.myId && new_chat.rp != 1 && (typeof thisClass.chatObject[thisSen] != 'undefined' || isAutoAcceptActive())) {
            //console.log(new_chat);
            playIncomingMessageSound(new_chat.sen, new_chat.rec, new_chat.id, new_chat.text);
        }
        thisClass.rec_posts.push(new_chat.id);
    }
};

ChatServerEvaluationClass.prototype.setChatAccepted = function(objId, accepted) {
    var rtValue = '';
    if (!accepted) {
        try {
            delete this.chatObject[objId].accepted;
            rtValue = objId + ' not accepted';
        } catch(e) {}
    } else {
        this.chatObject[objId].accepted = true;
            rtValue =  objId + ' accepted';
    }
    return rtValue;
};

/**
 * add hyperlinks to urls and mailadresses found in chat posts
 * @param myText
 * @returns {*}
 */
ChatServerEvaluationClass.prototype.addLinks = function(myText) {
    var i, j, replacement;
    var webSites = myText.match(/(www\.|(http|https):\/\/)[.a-z0-9-]+\.[a-z0-9\/_:@=.+?,##%&~-]*[^.|'|# |!|\(|?|,| |>|<|;|\)]/gi);
    //var existingLinks = myText.match(/(<[aA] href.*?onclick.*?openLink.*?<\/[aA]>|<[aA] href.*?getfile.php.*?<\/[aA]>|<[aA] href.*?lz_chat_link.*?<\/[aA]>|<[aA].*?lz_chat_link.*?href.*?<\/[aA]>)/);
    var existingLinks = myText.match(/<a.*?href.*?>.*?<\/a>/gi);
    //console.log(existingLinks);
    if (typeof webSites != 'undefined' && webSites != null) {
        for (i=0; i<webSites.length; i++) {
            var replaceLink = true;
            if (typeof existingLinks != 'undefined' && existingLinks != null) {
                for (j=0;j<existingLinks.length; j++) {
                    if (existingLinks[j].indexOf(webSites[i])) {
                        replaceLink = false;
                    }
                }
            }
            if (replaceLink) {
                if (webSites[i].toLowerCase().indexOf('http') != 0) {
                    replacement = '<a class="lz_chat_link" href="#" onclick="openLink(\'http://' + webSites[i] + '\')">' + webSites[i] + '</a>';
                } else {
                    replacement = '<a class="lz_chat_link" href="#" onclick="openLink(\'' + webSites[i] + '\')">' + webSites[i] + '</a>';
                }
                myText = myText.replace(webSites[i], replacement);
            }
        }
    }

    var mailAddresses = myText.match(/[\w\.-]{1,}@[\w\.-]{2,}\.\w{2,3}/gi);
    if (typeof mailAddresses != 'undefined' && mailAddresses != null) {
        for (i=0; i<mailAddresses.length; i++) {
            //replacement = '<a class="lz_chat_mail" href="mailto:' + mailAddresses[i] + '">' + mailAddresses[i] + '</a>';
            replacement = '<a class="lz_chat_mail" href="#" onclick="openLink(\'mailto:' + mailAddresses[i] + '\')">' + mailAddresses[i] + '</a>';
            myText = myText.replace(mailAddresses[i], replacement);
        }
    }
    return myText;
};

ChatServerEvaluationClass.prototype.replaceLinks = function(myText) {
    var i, replacement;
    var links = myText.match(/<[aA].*?href.*?<\/[aA]>/);
    if (typeof links != 'undefined' && links != null) {
        for (i=0; i<links.length; i++) {
            //console.log(links[i]);
            var address, shownText;
            if (links[i].indexOf('mailto:') == -1) {
                address = links[i].match(/href=".*?"/);
                if (typeof address == 'undefined' || address == null) {
                    address = links[i].match(/href='.*?'/)[0].replace(/^href='/,'').replace(/'$/, '');
                } else {
                    address = address[0].replace(/^href="/,'').replace(/"$/, '');
                }
                address = address.replace(/ *$/,'').replace(/"*$/,'');
                shownText = links[i].match(/>.*?<\/[aA]>/);
                if (typeof shownText == 'undefined' || shownText == null) {
                    shownText = links[i].match(/href='.*?'/);
                }
                shownText = shownText[0].replace(/^>/,'').replace(/<\/[aA]>$/,'');
                if (links[i].indexOf('lz_chat_file') == -1) {
                    replacement = '<a data-role="none" class="lz_chat_link" href="#" onclick="openLink(\'' + address + '\')">' + shownText + '</a>';
                } else {
                    replacement = '<a data-role="none" class="lz_chat_file" href="#" onclick="downloadFile(\'' + address + '\')">' + shownText + '</a>';
                }
                if (address != '#') {
                    myText = myText.replace(links[i], replacement);
                }
            } else {
                //console.log(myText);
                //console.log(links[i]);
                var address2 = links[i].match(/href=".*?"/);
                var address1 = links[i].match(/href='.*?'/);
                var address0 = links[i].match(/href=.*? /);
                if ((typeof address2 == 'undefined' || address2 == null) && (typeof address1 == 'undefined' || address1 == null)) {
                    //console.log('No " or \' - ' + address0);
                    address = address0[0].replace(/^href=/,'').replace(/ $/, '');
                } else if (typeof address2 == 'undefined' || address2 == null) {
                    //console.log('\' - ' + address1);
                    address = address1[0].replace(/^href='/,'').replace(/'$/, '');
                } else {
                    //console.log('" - ' + address2);
                    address = address2[0].replace(/^href="/,'').replace(/"$/, '');
                }
                address = address.replace(/ *$/,'').replace(/"*$/,'');
                shownText = links[i].match(/>.*?<\/[aA]>/);
                if (typeof shownText == 'undefined' || shownText == null) {
                    shownText = links[i].match(/href='.*?'/);
                }
                shownText = shownText[0].replace(/^>/,'').replace(/<\/[aA]>$/,'');
                replacement = '<a data-role="none" class="lz_chat_mail" href="#" onclick="openLink(\'' + address + '\')">' + shownText + '</a>';
                if (address != '#') {
                    myText = myText.replace(links[i], replacement);
                }
            }
        }
    }
    return myText;
};

/**
 * Escape html included in chat posts as a security meassure
 * @param myText
 * @returns {XML}
 */
ChatServerEvaluationClass.prototype.escapeHtml = function(myText) {
    // Replace surrounding font tags as the Windows client sends those
    myText = myText.replace(/^<font.*?>/g,'').replace(/<\/font>$/,'');

    // replace < and > by their html entities
    myText = myText.replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // replace line endings by their html equivalents
    myText = myText.replace(/\n/g, '').replace(/\r/, '');

    myText = myText.replace(/&lt;br \/&gt;/g, '<br />');

    return myText;
};

/**
 * add a department to the array
 * @param v
 */
ChatServerEvaluationClass.prototype.addDepartment = function (v) {
    var thisClass = this;
    var new_department = {};
    var myAttributes = v[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_department[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue)
    }
    new_department.logo = 'img/lz_group.png';
    new_department.status_logo = new_department.logo;
    new_department.is_active = true;
    new_department.pm = [];
    new_department.sig = [];
    if (typeof new_department.id != 'undefined') {
        new_department.humanReadableDescription = thisClass.getHumanReadableDepartmentDescriptions(new_department.desc);
        new_department.name = (typeof new_department.humanReadableDescription[thisClass.userLanguage] != 'undefined') ?
            new_department.humanReadableDescription[thisClass.userLanguage] :
            new_department.humanReadableDescription[thisClass.defaultLanguage];
    } else {
        new_department.humanReadableDescription = {};
        new_department.humanReadableDescription[thisClass.userLanguage] = new_department.n;
        new_department.humanReadableDescription[thisClass.defaultLanguage] = new_department.n;
        new_department.name = new_department.n;
        new_department.id = new_department.i;
    }

    $(v).find('pm').each(function () {
        var pm = $(this);
        new_department.pm.push(thisClass.addPM(pm));
    });

    $(v).find('sig').each(function () {
        var sig = $(this);
        new_department.sig.push(thisClass.addSignature(sig));
    });

    return new_department;
};

ChatServerEvaluationClass.prototype.getHumanReadableDepartmentDescriptions = function(desc) {
    var tmpArray = desc.split('{')[1].split('}')[0].replace(/;$/, '').split(';');
    var descriptionObject = {};
    for (var i=0; i<(tmpArray.length / 2); i++) {
        var descLanguage = tmpArray[2*i].split('"')[1].toLowerCase();
        var description = lz_global_base64_decode(tmpArray[2*i+1].split('"')[1]);
        descriptionObject[descLanguage] = description;
    }

    return descriptionObject;
};

/**
 * Add an internal user to the array
 * @param v
 */
ChatServerEvaluationClass.prototype.addInternalUser = function (v) {
    var thisClass = this;
    var new_user = {};
    var myAttributes = v[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        new_user[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue)
    }
    var userStatusIndex = 0;
    for (var i=0; i<thisClass.lzm_commonConfig.lz_user_states.length; i++) {
        if (thisClass.lzm_commonConfig.lz_user_states[i].index == new_user.status) {
            userStatusIndex = i;
            break;
        }
    }
    new_user.logo = thisClass.lzm_commonConfig.lz_user_states[userStatusIndex].icon14;
    if (typeof new_user.isbot != 'undefined' && new_user.isbot == 1) {
        new_user.logo = 'img/643-ic.png';
    }
    new_user.status_logo = new_user.logo;
    new_user.groups = [];
    new_user.is_active = true;
    new_user.sig = [];
    new_user.clientWeb = false;
    new_user.clientMobile = false;
    new_user.mobileAccount = false;
    new_user.mobileAlternatives = [];

        $(v).find('gr').each(function () {
        var gr = $(this);
        new_user.groups.push(lz_global_base64_url_decode(gr.text()));
    });

    $(v).find('pm').each(function () {
        var pm = $(this);
        if (typeof new_user.pm == 'undefined') {
            new_user.pm = [];
        }
        new_user.pm.push(thisClass.addPM(pm));
    });

    $(v).find('pp').each(function () {
        var pp = $(this);
        new_user.pp = pp.text();
    });

    $(v).find('sig').each(function () {
        var sig = $(this);
        new_user.sig.push(thisClass.addSignature(sig));
    });

    $(v).find('cw').each(function () {
        new_user.clientWeb = true;
    });
    $(v).find('cm').each(function () {
        new_user.clientMobile = true;
    });
    $(v).find('me').each(function() {
        var me = $(this);
        new_user.mobileAlternatives.push(lz_global_base64_url_decode(me.text()));
        new_user.mobileAccount = true;
    });

    // set the values for the logged in user
    if (new_user.userid == thisClass.chosen_profile.login_name) {
        thisClass.myGroup = new_user.groups[0];
    }

    return new_user;
};

/**
 * Add the predefined messages to the internal departments or internal users
 *
 * @param pm
 */
ChatServerEvaluationClass.prototype.addPM = function (pm) {
    var newPm = {};
    var myAttributes = pm[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newPm[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue)
    }

    return newPm;
};

ChatServerEvaluationClass.prototype.addSignature = function (sig) {
    var newSig = {};
    var myAttributes = sig[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newSig[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue)
    }
    newSig.text = lz_global_base64_url_decode($(sig).text());

    return newSig;
};

/**
 * Delete a property from the chat object
 * @param propertyName
 */
ChatServerEvaluationClass.prototype.deletePropertyFromChatObject = function (propertyName) {
    delete this.chatObject[propertyName];
};

ChatServerEvaluationClass.prototype.getFilters = function(xmlDoc) {
    var thisClass = this;
    var filterHash = '';
    $(xmlDoc).find('ext_b').each(function() {
        //console.log(this);
        var ext_b = $(this);
        filterHash = lz_global_base64_url_decode(ext_b.attr('h'));
        thisClass.filters.clearFilters();
        ext_b.find('val').each(function() {
            var foo = thisClass.addFilter($(this));
            thisClass.filters.setFilter(foo);
        });
    });
    return filterHash;
};

ChatServerEvaluationClass.prototype.addFilter = function(val) {
    var newFilter = {};
    var myAttributes = val[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newFilter[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    return newFilter;
};

ChatServerEvaluationClass.prototype.getEvents = function(xmlDoc) {
    var thisClass = this;
    var myEventDut = '';
    $(xmlDoc).find('listen').each(function() {
        var listen = $(this);
        listen.children('ev').each(function() {
            thisClass.new_ev = true;
            var ev = $(this);
            myEventDut = lz_global_base64_url_decode(ev.attr('dut'));
        });
    });
    return {'event-dut': myEventDut};
};

ChatServerEvaluationClass.prototype.getTickets = function(xmlDoc, maxRead) {
    var thisClass = this;
    var myHash = '', myTicketDut = '', myEmailDut = '';
    var lmc = (typeof thisClass.ticketGlobalValues['lmc'] != 'undefined' && thisClass.ticketGlobalValues['lmc'] != '') ?
        thisClass.ticketGlobalValues['lmc'] : 0;
    thisClass.ticketGlobalValues['updating'] = false;
    thisClass.ticketGlobalValues['no_update'] = false;
    thisClass.ticketGlobalValues['mr'] = maxRead;
    $(xmlDoc).find('dt').each(function () {
        thisClass.new_dt = true;
        var dt = $(this);
        $(dt).find('no_update').each(function() {
            thisClass.ticketGlobalValues['no_update'] = true;
        });
        var globValues = {
            q: lz_global_base64_url_decode(dt.attr('q')),
            r: lz_global_base64_url_decode(dt.attr('r')),
            t: lz_global_base64_url_decode(dt.attr('t')),
            p: lz_global_base64_url_decode(dt.attr('p'))
        };
        lmc = (parseInt(lz_global_base64_url_decode(dt.attr('lmc'))) > lmc) ? parseInt(lz_global_base64_url_decode(dt.attr('lmc'))) : lmc;
        if (!thisClass.ticketGlobalValues['no_update']) {
            thisClass.tickets = [];
            $(dt).find('updating').each(function() {
                thisClass.ticketGlobalValues['updating'] = true;
            });
            thisClass.ticketGlobalValues['t'] = (globValues['t'] != '' || typeof thisClass.ticketGlobalValues['t'] == 'undefined') ?
                globValues['t'] : thisClass.ticketGlobalValues['t'];
            thisClass.ticketGlobalValues['r'] = (globValues['r'] != '' || typeof thisClass.ticketGlobalValues['r'] == 'undefined') ?
                globValues['r'] : thisClass.ticketGlobalValues['r'];
            thisClass.ticketGlobalValues['q'] = (globValues['q'] != '' || typeof thisClass.ticketGlobalValues['q'] == 'undefined') ?
                globValues['q'] : thisClass.ticketGlobalValues['q'];
            thisClass.ticketGlobalValues['p'] = (globValues['p'] != '' || typeof thisClass.ticketGlobalValues['p'] == 'undefined') ?
                globValues['p'] : thisClass.ticketGlobalValues['p'];
            $(dt).find('val').each(function () {
                var thisTicketHash = md5((new XMLSerializer()).serializeToString(this));
                var val = $(this);
                var thisTicket = thisClass.addTicket(val);
                thisTicket.md5 = thisTicketHash;

                thisClass.tickets.push(thisTicket);
            });
            //console.log(thisClass.tickets);
        }
        myHash = lz_global_base64_url_decode(dt.attr('h'));
        myTicketDut = lz_global_base64_url_decode(dt.attr('dut'));
        //console.log(myTicketDut);
        thisClass.ticketGlobalValues['h'] = myHash;
        thisClass.ticketGlobalValues['dut'] = myTicketDut;
        //console.log(this);
    });
    $(xmlDoc).find('de').each(function () {
        thisClass.new_de = true;
        var de = $(this);
        thisClass.emails = [];
        //console.log(thisClass.emailCount);
        $(de).find('e').each(function () {
            var e = $(this);
            thisClass.emails.push(thisClass.addEmail(e));
        });
        lmc = (parseInt(lz_global_base64_url_decode(de.attr('lmc'))) > lmc) ? parseInt(lz_global_base64_url_decode(de.attr('lmc'))) : lmc;
        myEmailDut = lz_global_base64_url_decode(de.attr('dut'));
        thisClass.emailCount = lz_global_base64_url_decode(de.attr('c'));
        thisClass.ticketGlobalValues['e'] = (thisClass.emailCount !== '') ? thisClass.emailCount : thisClass.ticketGlobalValues['e'];
        thisClass.emails.sort(lzm_commonTools.sortEmails);
    });
    //console.log('Got tickets: ' + myHash + ' --- ' + maxRead);
    //console.log(myTicketDut);
    thisClass.ticketGlobalValues['lmc'] = lmc;
    thisClass.ticketFetchTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    return {hash: myHash, 'ticket-dut': myTicketDut, 'email-dut': myEmailDut};
};

ChatServerEvaluationClass.prototype.addTicket = function(val) {
    var thisClass = this;
    var newTicket = {};
    var myAttributes = val[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newTicket[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    newTicket.messages = [];
    $(val).find('m').each(function(){
        var m = $(this);
        newTicket.messages.push(thisClass.addTicketMessage(m));
    });
    newTicket.editor = false;
    $(val).find('cl').each(function() {
        var cl = $(this);
        newTicket.editor = thisClass.addTicketEditor(cl);
    });
    return newTicket;
};

ChatServerEvaluationClass.prototype.addEmail = function(e) {
    var thisClass = this;
    var newEmail = {text: '', attachment: []};
    var myAttributes = e[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newEmail[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    $(e).find('c').each(function() {
        newEmail.text = lz_global_base64_url_decode($(this).text());
    });
    $(e).find('a').each(function() {
        var a = $(this);
        newEmail.attachment.push(thisClass.addEmailAttachment(a));
    });
    //console.log(newEmail);

    return newEmail;
};

ChatServerEvaluationClass.prototype.addEmailAttachment = function (a) {
    var newAttachment = {};
    var myAttributes = a[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newAttachment[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    newAttachment.id = lz_global_base64_url_decode(a.text());
    return newAttachment;
};

ChatServerEvaluationClass.prototype.addTicketMessage = function(m) {
    var thisClass = this;
    //console.log(m);
    var newMessage = {attachment: [], comment: [], customInput: []};
    var myAttributes = m[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newMessage[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }

    $(m).find('c').each(function() {
        var c = $(this);
        newMessage.customInput.push(thisClass.addTicketMessageCustomInput(c));
    });
    $(m).find('a').each(function() {
        var a = $(this);
        newMessage.attachment.push(thisClass.addTicketMessageAttachment(a));
    });
    $(m).find('co').each(function() {
        var co = $(this);
        newMessage.comment.push(thisClass.addTicketMessageComment(co));
    });
    //console.log(newMessage);
    return newMessage;
};

ChatServerEvaluationClass.prototype.addTicketMessageAttachment = function (a) {
    var newAttachment = {};
    var myAttributes = a[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newAttachment[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    newAttachment.n = lz_global_base64_url_decode(a.text());
    return newAttachment;
};

ChatServerEvaluationClass.prototype.addTicketMessageComment = function (co) {
    var newComment = {};
    var myAttributes = co[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newComment[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    newComment.text = lz_global_base64_url_decode(co.text());
    return newComment;
};

ChatServerEvaluationClass.prototype.addTicketMessageCustomInput = function (c) {
    var newCustomInput = {};
    var myAttributes = c[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newCustomInput[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    newCustomInput.text = lz_global_base64_url_decode(c.text());
    return newCustomInput;
};

ChatServerEvaluationClass.prototype.addTicketEditor = function (cl) {
    var newEditor = {};
    var myAttributes = cl[0].attributes;
    for (var attrIndex = 0; attrIndex < myAttributes.length; attrIndex++) {
        newEditor[myAttributes[attrIndex].nodeName] = lz_global_base64_url_decode(myAttributes[attrIndex].nodeValue);
    }
    return newEditor;
};

/**
 * Timestamp class, adding or substracting the time difference between client and server
 * @param timeDifference
 * @constructor
 */
function ChatTimestampClass(timeDifference) {
    //console.log(timeDifference);
    this.timeDifference = timeDifference * 1000;
    //console.log('Timestamp object created - time diff is ' + this.timeDifference);
}

ChatTimestampClass.prototype.logTimeDifference = function() {
    try {
        console.log('Timestamp object present - time diff is ' + this.timeDifference);
    } catch(e) {}
};

ChatTimestampClass.prototype.setTimeDifference = function(timeDifference) {
    this.timeDifference = timeDifference * 1000;
};

ChatTimestampClass.prototype.getLocalTimeObject = function(timeStamp, doCalcTimeDiff) {
    timeStamp = (typeof timeStamp != 'undefined' && timeStamp != null) ? timeStamp : $.now();
    doCalcTimeDiff = (typeof doCalcTimeDiff != 'undefined') ? doCalcTimeDiff : false;
    var calculatedTimeStamp = (doCalcTimeDiff) ? parseInt(timeStamp) - parseInt(this.timeDifference) : parseInt(timeStamp);
    var tmpDateObject = new Date(calculatedTimeStamp);
    return tmpDateObject;
};

ChatTimestampClass.prototype.getServerTimeString = function(dateObject, doCalcTimeDiff, divideBy) {
    dateObject = (typeof dateObject != 'undefined' && dateObject != null) ? dateObject : new Date();
    doCalcTimeDiff = (typeof doCalcTimeDiff != 'undefined') ? doCalcTimeDiff : false;
    divideBy = (typeof divideBy != 'undefined') ? divideBy : 1000;
    var calculatedTimeString = (doCalcTimeDiff) ? dateObject.getTime() + parseInt(this.timeDifference) : dateObject.getTime();
    return Math.floor(calculatedTimeString / divideBy);
};

function LzmFilters() {
    this.idList = [];
    this.objects = {};
}

LzmFilters.prototype.setFilter = function(filter) {
    if ($.inArray(filter.filterid, this.idList) == -1) {
        this.idList.push(filter.filterid);
    }
    this.objects[filter.filterid] = filter;
};

LzmFilters.prototype.getFilter = function(filterId) {
    return this.objects[filterId];
};

LzmFilters.prototype.removeFilter = function(filterId) {
    var tmpArray = [];
    for (var i=0; i<this.idList; i++) {
        if (this.idList[i] != filterId) {
            tmpArray.push(this.idList[i]);
        }
    }
    this.idList = tmpArray;
    delete this.objects[filterId];
};

LzmFilters.prototype.clearFilters = function() {
    this.idList = [];
    this.objects = {};
};

function LzmCustomInputs() {
    this.idList = [];
    this.objects = {};
    this.nameList = {};
}

LzmCustomInputs.prototype.setCustomInput = function(customInput) {
    if ($.inArray(customInput.id, this.idList) == -1) {
        this.idList.push(customInput.id);
    }
    if (typeof customInput.value == 'string') {
        customInput.value = this.parseInputValue(customInput.value);
    }
    this.objects[customInput.id] = customInput.value;
    if (customInput.value.name != '')
        this.nameList[customInput.value.name] = customInput.id;
};

LzmCustomInputs.prototype.getCustomInput = function(id, searchBy) {
    searchBy = (typeof searchBy != 'undefined') ? searchBy : 'id';
    if (searchBy == 'id') {
        return this.objects[id];
    } else if (searchBy == 'name') {
        return this.objects[this.nameList[id]];
    } else {
        return null;
    }
};

LzmCustomInputs.prototype.clearCustomInputs = function() {
    this.idList = [];
    this.objects = {};
    this.nameList = {};
};

LzmCustomInputs.prototype.parseInputValue = function(value) {
    value = lz_global_base64_url_decode(value);
    value = lzm_commonTools.phpUnserialize(value);

    var customValue = value[7];
    if (value[3] == 'ComboBox') {
        customValue = (value[7].indexOf(';') != -1) ? value[7].split(';') : [value[7]];
    }
    var valueObject = {id: value[0], /*title: value[1],*/ name: value[2],type: value[3], active: value[4], /*cookie: value[5], position: value[6],*/
        value: customValue};

    //console.log(value);
    //console.log(valueObject);
    return valueObject;
};
