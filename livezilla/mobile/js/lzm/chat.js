/****************************************************************************************
 * LiveZilla chat.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
var lzm_commonConfig = {};
var lzm_commonTools = {};
lzm_commonPermissions = {};
var lzm_commonStorage = {};
var lzm_chatTimeStamp = {};
var lzm_chatDisplay = {};
var lzm_displayHelper = {};
var lzm_displayLayout = {};
var lzm_chatServerEvaluation = {};
var lzm_chatPollServer = {};
var lzm_chatUserActions = {};
var lzm_t = {};
var loopCounter = 0;
var lzm_chatInputEditor;
var messageEditor;
var qrdTextEditor;
var visitorsStillNeeded = [];
var deviceId = 0;
var debugBackgroundMode = false;
var debuggingLogContent = '';
var debuggingFoo = '';
var ticketLineClicked = 0;
var mobile;

var views = [];

var debuggingDisplayHeight = 0;
if ((app == 1) && (appOs == 'ios')) {
    var console = {};
    console.log = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'log');
        } catch(ex) {

        }
    };
    console.info = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'info');
        } catch(ex) {
        }
    };
    console.warn = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'warn');
        } catch(ex) {
        }
    };
    console.error = function(myString) {
        try {
            lzm_deviceInterface.jsLog(myString, 'error');
        } catch(ex) {
        }
    };
}

// debugging functions
function forceResizeNow() {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
}

function debuggingEditorClicked() {
    console.log('Click!');
}

function debuggingStartStopPolling() {
    var tmpDate = lzm_chatTimeStamp.getLocalTimeObject();
    var tmpHumanTime = lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage);
    if (lzm_chatPollServer.poll_regularly) {
        lzm_chatPollServer.stopPolling();
        console.log(tmpHumanTime + ' - Polling stopped!');
        debugBackgroundMode = true;
    } else {
        lzm_chatPollServer.startPolling();
        console.log(tmpHumanTime + ' - Polling started!');
        debugBackgroundMode = false;
    }
}

function logit(myObject, myLevel) {
    if(debug) {
        var myError = (new Error).stack;
        var callerFile = '', callerLine = '';
        try {
            var callerInfo = myError.split('\n')[2].split('(')[1].split(')')[0].split(':');
            callerFile = callerInfo[0] + ':' + callerInfo[1];
            callerLine = callerInfo[2];
        } catch(e) {}
        console.log(myObject);
        myLevel = (typeof myLevel != 'undefined') ? myLevel.toUpperCase() : 'WARNING';
        if (debuggingLogContent == '') {
            debuggingLogContent = myObject;
        }
        var message = 'Not readable object content';
        try {
            message = JSON.stringify(myObject);
        } catch(e) {
            if (typeof myObject.outerHTML != 'undefined') {
                message = JSON.stringify(myObject.outerHTML);
            }
        }

        var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
        var postUrl = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url +
                '/mobile/logit.php?acid=' + acid;
        var myDataObject = {'time': lzm_chatTimeStamp.getServerTimeString(null, true), 'level': myLevel, 'message': message, 'file': callerFile, 'line': callerLine};
        $.ajax({
            type: "POST",
            url: postUrl,
            data: myDataObject,
            timeout: lzm_commonConfig.pollTimeout,
            success: function (data) {},
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error while sending log to the server!');
            },
            dataType: 'text'
        });
    } else {
        try {
            console.log(myObject);
        } catch(e) {}
    }
    return null;
}

// functions called by iOs app
function webAppHasLoadedCorrectly() {
    return 'LiveZilla';
}

// wrapper arround functions inside one of the classes...
function showAppDownloadLink() {
    var appLink = '';
    if (isMobile && app != '1' && mobileIsSufficient) {
        switch(mobileOS.toLowerCase()) {
            case 'android':
                appLink = 'https://play.google.com/store/apps/details?id=net.livezilla.mobile.client';
                break;
            case 'ios':
                appLink = 'https://itunes.apple.com/app/livezilla/id710516100?mt=8';
                break;
        }
    }
    //appLink = 'http://www.heise.de/';
    var appInfoDidShow = (lzm_commonStorage.loadValue('app_info_did_show'));
    if (appLink != '' && (typeof appInfoDidShow == 'undefined' || appInfoDidShow != '1')) {
        lzm_commonStorage.saveValue('app_info_did_show', '1');
        var bodyString = '<div id="app-info-body">';
        bodyString += t('There is a LiveZilla App available for your mobile device');
        bodyString += '</div>';
        var buttonString = '<div id="app-info-button">' +
            '<span id="download-app" class="chat-button-line chat-button-left chat-button-right"' +
            ' style="margin-left: 4px; padding-left: 12px; padding-right: 12px; cursor:pointer; background-image: ' +
            lzm_displayHelper.addBrowserSpecificGradient('') + ';">&nbsp;' + t('Install') + '&nbsp;</span>' +
            '<span id="cancel-app" class="chat-button-line chat-button-left chat-button-right"' +
            ' style="margin-left: 4px; padding-left: 12px; padding-right: 12px; cursor:pointer; background-image: ' +
            lzm_displayHelper.addBrowserSpecificGradient('') + ';">&nbsp;' + t('Cancel') + '&nbsp;</span>' +
            '</div>';
        var appInfoDivString = '<div id="app-info-div">' + bodyString + buttonString + '</div>';

        $('#chat_page').append(appInfoDivString).trigger('create');

        $('#app-info-div').css({
            position: 'absolute', top: '0px', left: '0px', width: ($(window).width() - 2)+'px', height: '40px',
            'background-color': '#ffffc6', border: '1px solid #eeeeb5', 'z-index': '202'
        });
        $('#app-info-body').css({
            position: 'absolute', top: '0px', left: '0px', width: ($(window).width() - 202)+'px', height: '30px',
            padding: '10px 0px 0px 10px'
        });
        $('#app-info-button').css({
            position: 'absolute', top: '0px', left: ($(window).width() - 192)+'px', width: '190px', height: '30px',
            padding: '10px 0px 0px 0px'
        });


        $('#cancel-app').click(function() {
            try {
                $('#app-info-div').remove();
            } catch(ex) {
                // Do nothing
            }
        });
        $('#download-app').click(function() {
            try{
                $('#app-info-div').remove();
                openLink(appLink);
            } catch(ex) {
                // Do nothing...
            }
        });
    }
}

function showAppIsSyncing() {
    lzm_displayHelper.blockUi({message: t('Syncing data...')});
}

function chatInputEnterPressed() {
    //console.log('Enter pressed! Contents: ' + grabEditorContents());
    sendChat(grabEditorContents());
}

function doNothing() {
    // Dummy function that does nothing!
    // Needed for editor events
}

function chatInputBodyClicked() {
    //alert('Click');
    var id, b_id, user_id, name;
    if(lzm_chatDisplay.active_chat_reco.indexOf('~') != -1) {
        id = lzm_chatDisplay.active_chat_reco.split('~')[0];
        b_id = lzm_chatDisplay.active_chat_reco.split('~')[1];
        viewUserData(id, b_id, 0, true);
    } else {
        if (lzm_chatDisplay.active_chat_reco == "everyoneintern") {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.active_chat_realname;
        } else if(typeof lzm_chatDisplay.thisUser.userid == 'undefined') {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.active_chat_reco;
            name = lzm_chatDisplay.active_chat_reco;
        } else {
            id = lzm_chatDisplay.active_chat_reco;
            user_id = lzm_chatDisplay.thisUser.userid;
            name = lzm_chatDisplay.thisUser.name;
        }
        chatInternalWith(id, user_id, name);
    }
}

function chatInputTyping(e) {
    if (typeof e != 'undefined' && (typeof e.which == 'undefined' || e.which != 13) && (typeof e.keyCode == 'undefined' || e.keyCode != 13)) {
        //console.log('Typing in chat with ' + lzm_chatDisplay.active_chat_reco);
        lzm_chatPollServer.typingPollCounter = 0;
        lzm_chatPollServer.typingChatPartner = lzm_chatDisplay.active_chat_reco;
    }
}

function slowDownPolling(doSlowDown, secondCall) {
    secondCall = (typeof secondCall != 'undefined') ? secondCall : false;
    if (doSlowDown) {
        if (lzm_chatPollServer.slowDownPolling1 > lzm_chatPollServer.slowDownPolling2) {
            lzm_chatPollServer.slowDownPolling = true;
            lzm_chatPollServer.startPolling();
        } else if (!secondCall) {
            lzm_chatPollServer.slowDownPolling1 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
            setTimeout(function() {
                slowDownPolling(true, true);
            }, 20000);
        }
    } else {
        lzm_chatPollServer.slowDownPolling = false;
        lzm_chatPollServer.slowDownPolling2 = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        lzm_chatPollServer.startPolling();
    }
}

function setAppBackground(isInBackground) {
    if (isInBackground) {
        //console.log("App is entering background");
        lzm_chatPollServer.appBackground = 1;
        lzm_chatPollServer.startPolling();
    } else {
        //console.log("App is leaving background");
        lzm_chatPollServer.appBackground = 0;
        lzm_chatPollServer.startPolling();
    }
}

function startBackgroundTask() {
    try {
        lzm_deviceInterface.startBackgroundTask();
    } catch(ex) {
        //console.log(ex);
    }
}

function setLocation(latitude, longitude) {
    lzm_chatPollServer.location = {latitude: latitude, longitude: longitude};
}

function stopPolling() {
    lzm_chatPollServer.stopPolling();
}

function startPolling() {
    lzm_chatPollServer.startPolling();
}

function resetWebApp() {
    showAppIsSyncing();
    //console.log('Reset most values');
    lzm_chatServerEvaluation.resetWebApp();
    lzm_chatUserActions.resetWebApp();
    lzm_chatPollServer.resetWebApp();
    lzm_chatDisplay.resetWebApp();

    lzm_chatPollServer.lastCorrectServerAnswer = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
}

function logout(askBeforeLogout, logoutFromDeviceKey, e) {
    if (typeof e != 'undefined') {
        e.stopPropagation()
    }
    logoutFromDeviceKey = (typeof logoutFromDeviceKey != 'undefined') ? logoutFromDeviceKey : false;
    lzm_chatDisplay.showUsersettingsHtml = false;
    $('#usersettings-menu').css({'display': 'none'});
    if (!askBeforeLogout ||
        (logoutFromDeviceKey && (
            (lzm_chatDisplay.openChats.length == 0 && confirm(t('Do you really want to log out?'))) ||
            (lzm_chatDisplay.openChats.length != 0 && confirm(t('There are still open chats, do you want to leave them?'))))
        ) ||
        (!logoutFromDeviceKey &&
            (lzm_chatDisplay.openChats.length == 0 || confirm(t('There are still open chats, do you want to leave them?')))
        )) {
            lzm_chatDisplay.stopRinging([]);
            var ticketFilterPersonal = (lzm_chatPollServer.dataObject.p_dt_fp == '1') ? true : false;
            var ticketFilterGroup = (lzm_chatPollServer.dataObject.p_dt_fg == '1') ? true : false;
            lzm_commonStorage.saveValue('qrd_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatServerEvaluation.resources));
            lzm_commonStorage.saveValue('qrd_request_time_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatServerEvaluation.resourceLastEdited));
            lzm_commonStorage.saveValue('qrd_id_list_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatServerEvaluation.resourceIdList));
            lzm_commonStorage.saveValue('ticket_max_read_time_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketMaxRead));
            lzm_commonStorage.saveValue('ticket_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketReadArray));
            lzm_commonStorage.saveValue('ticket_unread_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.ticketUnreadArray));
            lzm_commonStorage.saveValue('ticket_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketFilter));
            lzm_commonStorage.saveValue('ticket_sort_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.ticketSort));
            lzm_commonStorage.saveValue('email_read_array_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.emailReadArray));
            lzm_commonStorage.saveValue('accepted_chats_' + lzm_chatServerEvaluation.myId, lzm_chatUserActions.acceptedChatCounter);
            lzm_commonStorage.saveValue('qrd_search_categories_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.qrdSearchCategories));
            lzm_commonStorage.saveValue('qrd_recently_used_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.recentlyUsedResources));
            lzm_commonStorage.deleteKeyValuePair('qrd_recently_used' + lzm_chatServerEvaluation.myId);
            lzm_commonStorage.saveValue('qrd_selected_tab_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.selectedResourceTab));
            lzm_commonStorage.saveValue('archive_filter_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatPollServer.chatArchiveFilter));
            lzm_commonStorage.saveValue('first_visible_view_' + lzm_chatServerEvaluation.myId, JSON.stringify(lzm_chatDisplay.firstVisibleView));
            lzm_commonStorage.saveValue('ticket_filter_personal_' + lzm_chatServerEvaluation.myId, JSON.stringify(ticketFilterPersonal));
            lzm_commonStorage.saveValue('ticket_filter_group_' + lzm_chatServerEvaluation.myId, JSON.stringify(ticketFilterGroup));
            lzm_chatDisplay.askBeforeUnload = false;
            //console.log('logout');
            lzm_displayHelper.blockUi({message: t('Signing off...')});
            lzm_chatPollServer.logout();
            setTimeout(function() {
                if (!lzm_chatPollServer.serverSentLogoutResponse) {
                    lzm_chatPollServer.finishLogout();
                }
            }, 10000);
    }
}

function inviteOtherOperator(guest_id, guest_b_id, chat_id, invite_id, invite_name, invite_group, chat_no) {
    lzm_chatUserActions.inviteOtherOperator(guest_id, guest_b_id, chat_id, invite_id, invite_name, invite_group,
        chat_no);
}

function openLastActiveChat(caller) {
    var chatToOpen = '';
    if (typeof caller != 'undefined' && caller == 'notification') {
        chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
    } else if (typeof caller != 'undefined' && caller == 'panel' && lzm_chatDisplay.lastChatSendingNotification != '') {
        chatToOpen = lzm_chatDisplay.lastChatSendingNotification;
    } else {
        chatToOpen = lzm_chatDisplay.lastActiveChat;
    }
    lzm_chatDisplay.lastChatSendingNotification = '';
    var id, b_id, chat_id, userid, name;
    if (typeof chatToOpen != 'undefined' && chatToOpen != '' &&
        typeof lzm_chatServerEvaluation.chatObject[chatToOpen] != 'undefined' &&
        (lzm_chatServerEvaluation.chatObject[chatToOpen].status == 'new' ||
            lzm_chatServerEvaluation.chatObject[chatToOpen].status == 'read' ||
            $.inArray(chatToOpen, lzm_chatDisplay.closedChats) == -1)) {
        if (chatToOpen.indexOf('~') != -1) {
            id = chatToOpen.split('~')[0];
            b_id = chatToOpen.split('~')[1];
            chat_id = lzm_chatServerEvaluation.chatObject[chatToOpen].chat_id;
            viewUserData(id, b_id, chat_id, true);
        } else {
            id = chatToOpen;
            for (var i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
                if (id == lzm_chatServerEvaluation.internal_users[i].id) {
                    userid = lzm_chatServerEvaluation.internal_users[i].userid;
                    name = lzm_chatServerEvaluation.internal_users[i].name;
                    break;
                }
            }
            userid = (typeof userid != 'undefined') ? userid : id;
            name = (typeof name != 'undefined') ? name : id;
            chatInternalWith(id, userid, name);
        }
        setTimeout(function() {
            setFocusToEditor();
        },100);
    }
}

function chatInternalWith(id, userid, name) {
    lzm_chatDisplay.lastActiveChat = id;
    lzm_chatUserActions.chatInternalWith(id, userid, name);
}

function setUserStatus(statusValue, myName, myUserId, e) {
    e.stopPropagation();
    var previousStatusValue = lzm_chatPollServer.user_status;
    lzm_chatDisplay.setUserStatus(statusValue, myName, myUserId);
    if (statusValue != 2 && previousStatusValue != 2 && statusValue != previousStatusValue) {
        lzm_chatPollServer.startPolling();
        //console.log('Start polling');
    }
}

function viewUserData(id, b_id, chat_id, freeToChat) {
    lzm_chatDisplay.switchCenterPage('chat');
    lzm_chatDisplay.lastActiveChat = id + '~' + b_id;
    lzm_chatUserActions.viewUserData(id, b_id, chat_id, freeToChat);
}

function showVisitorInvitation(id) {
    if (lzm_commonPermissions.checkUserPermissions('', 'chats', 'send_invites', {})) {
        if (visitorHasNotCanceled(id) || confirm(t('This visitor has already declined an invitation.\nInvite this visitor again?'))) {
            var storedInvitationId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-invitation' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == id) {
                        storedInvitationId = key;
                    }
                }
            }
            if (storedInvitationId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedInvitationId);
            } else {
                var aVisitor = {id: '', b_id: ''};
                for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
                    if (lzm_chatServerEvaluation.external_users[i].id == id) {
                        aVisitor = lzm_chatServerEvaluation.external_users[i];
                        break;
                    }
                }
                lzm_chatDisplay.showVisitorInvitation(aVisitor);
            }
        }
    } else {
        showNoPermissionMessage();
    }
}

function visitorHasNotCanceled(id) {
    var aVisitor = {id: '', b_id: ''}, i = 0, rtValue = true;
    for (i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
        if (lzm_chatServerEvaluation.external_users[i].id == id) {
            aVisitor = lzm_chatServerEvaluation.external_users[i];
            break;
        }
    }
    if (aVisitor.r.length > 0) {
        for (i=0; i< aVisitor.r.length; i++) {
            if (aVisitor.r[i].de == 1) {
                rtValue = false;
            }
        }
    }
    return rtValue;
}

function inviteExternalUser(id, b_id, text) {
    lzm_chatUserActions.inviteExternalUser(id, b_id, text);
}

function cancelInvitation(id) {
    var inviter = '';
    for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
        if (lzm_chatServerEvaluation.external_users[i].id == id) {
            var visitor = lzm_chatServerEvaluation.external_users[i];
            try {
                inviter = visitor.r[0].s;
            } catch(e) {}
        }
    }
    if ((lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites_others', {})) ||
        (lzm_commonPermissions.checkUserPermissions('', 'chats', 'cancel_invites', {}) && (inviter == lzm_chatDisplay.myId || inviter == ''))) {
        lzm_chatUserActions.cancelInvitation(id);
    } else {
        showNoPermissionMessage();
    }
}

function selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group, forward_text, chat_no) {
    lzm_chatUserActions.selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group,
        forward_text, chat_no);
}

function catchEnterButtonPressed(e) {
    return lzm_chatDisplay.catchEnterButtonPressed(e);
}

function handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId) {
    lzm_chatUserActions.handleUploadRequest(fuprId, fuprName, id, b_id, type, chatId);
}

function selectVisitor(e, visitorId) {
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');
}

function showVisitorInfo(userId, userName,  chatId, activeTab) {
    activeTab = (typeof activeTab != 'undefined') ? activeTab : 0;
    userName = (typeof userName != 'undefined') ? userName : '';
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
        limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
        filter: lzm_chatPollServer.chatArchiveFilter};
    window['tmp-ticket-values'] = {page: lzm_chatPollServer.ticketPage, limit: lzm_chatPollServer.ticketLimit,
        query: lzm_chatPollServer.ticketQuery, filter: lzm_chatPollServer.ticketFilter,
        sort: lzm_chatPollServer.ticketSort};
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.chatArchiveLimit = 1000;
    lzm_chatPollServer.chatArchiveQuery = '';
    lzm_chatPollServer.chatArchiveFilter = '';
    lzm_chatPollServer.chatArchiveFilterExternal = userId;
    lzm_chatPollServer.chatUpdateTimestamp = 0;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.ticketLimit = 1000;
    lzm_chatPollServer.ticketQuery = userId;
    lzm_chatPollServer.ticketFilter = '0123';
    lzm_chatPollServer.ticketSort = '';
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    var storedInvitationId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'visitor-information' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['visitor-id'] == userId) {
                storedInvitationId = key;
            }
        }
    }
    if (storedInvitationId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedInvitationId);
    } else {
        var thisUser = {id: userId, unique_name: userName};
        if (typeof userId != 'undefined') {
            for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
                if (userId == lzm_chatServerEvaluation.external_users[i].id) {
                    thisUser = lzm_chatServerEvaluation.external_users[i];
                    //console.log(thisUser);
                    break;
                }
            }
        }

        if (typeof userId != 'undefined' && userId != '') {
            lzm_chatDisplay.infoUser = thisUser;
            lzm_chatDisplay.showVisitorInformation(lzm_chatServerEvaluation.internal_users, thisUser, chatId, activeTab);
            switchTicketListPresentation(ticketFetchTime, 0);
            switchArchivePresentation(chatFetchTime, 0);
        }
    }
    lzm_chatPollServer.startPolling();
}

function showVisitorInformation(showTab) {
    lzm_chatDisplay.showVisitorInformation(lzm_chatServerEvaluation.internal_users, lzm_chatDisplay.infoUser, 0);
}

function showFilterCreation(visitorId) {
    var visitor = {id: ''};
    for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
        if (lzm_chatServerEvaluation.external_users[i].id == visitorId) {
            visitor = lzm_chatServerEvaluation.external_users[i];
        }
    }
    if (visitor.id != '') {
        lzm_chatDisplay.showFilterCreation(visitor);
    }
}

function saveFilter(type) {
    type = (type == 'add') ? 0 : (type == 'edit') ? 1 : 2;
    var activeCheck = ($('#filter-active').attr('checked') == 'checked') ? 1 : 0;
    var ipCheck = ($('#filter-ip-check').attr('checked') == 'checked') ? 1 : 0;
    var idCheck = ($('#filter-id-check').attr('checked') == 'checked') ? 1 : 0;
    var lgCheck = ($('#filter-lg-check').attr('checked') == 'checked') ? 1 : 0;
    var chatCheck = ($('#filter-chat-check').attr('checked') == 'checked') ? 1 : 0;
    var expires = (!isNaN(parseInt($('#filter-expire-after').val()))) ? parseInt($('#filter-expire-after').val()) : 7;
    expires = expires * 24 * 60 * 60;// + lzm_chatTimeStamp.getServerTimeString(null, true);
    expires = ($('#filter-exp-check').attr('checked') == 'checked') ? expires : -1;
    var filter = {creator: lzm_chatDisplay.myId, editor: lzm_chatDisplay.myId, vip: $('#filter-ip').val(), vid: $('#filter-id').val(),
        expires: expires, fname: $('#filter-name').val(), freason: $('#filter-reason').val(), fid: md5(Math.random().toString()),
        state: activeCheck, type: type, exertion: $('#filter-type').val(), lang: $('#filter-lg').val(), active_vid: idCheck,
        active_vip: ipCheck, active_lang: lgCheck, active_chats: chatCheck};
    //console.log(filter);
    lzm_chatPollServer.pollServerSpecial(filter, 'visitor-filter');
}

function loadChatInput(active_chat_reco) {
    return lzm_chatUserActions.loadChatInput(active_chat_reco);
}

function saveChatInput(active_chat_reco, text) {
    lzm_chatUserActions.saveChatInput(active_chat_reco, text);
}

function doMacMagicStuff() {
    //alert(mobileOS);
    //alert(app);
    if (app == 0) {
        $(window).trigger('resize');
        //alert('iOS detected');
        setTimeout(function() {
            lzm_chatDisplay.createHtmlContent(lzm_chatServerEvaluation.internal_departments,
                lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.external_users,
                lzm_chatServerEvaluation.chats, lzm_chatServerEvaluation.chatObject, lzm_chatPollServer.thisUser,
                lzm_chatServerEvaluation.global_errors,lzm_chatPollServer.chosenProfile,
                lzm_chatDisplay.active_chat_reco);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(true);
        }, 10);
    }
}

function sendChat(chatMessage) {
    var chat_reco = (typeof lzm_chatDisplay.active_chat_reco != 'undefined' && lzm_chatDisplay.active_chat_reco != '') ? lzm_chatDisplay.active_chat_reco : lzm_chatDisplay.lastActiveChat;
    if (typeof lzm_chatServerEvaluation.chatObject[lzm_chatDisplay.active_chat] != 'undefined' ||
        typeof lzm_chatServerEvaluation.chatObject[chat_reco] != 'undefined') {
        lzm_chatUserActions.deleteChatInput(chat_reco);
        try {
            lzm_chatServerEvaluation.chatObject[chat_reco]['status'] = 'read';
        } catch(e) {}
        chatMessage = (typeof chatMessage != 'undefined' && chatMessage != '') ? chatMessage : grabEditorContents();
        if (chatMessage != '') {
            lzm_chatPollServer.typingChatPartner = '';
            var new_chat = {};
            new_chat.id = md5(String(Math.random())).substr(0, 32);
            new_chat.rp = '';
            new_chat.sen = lzm_chatServerEvaluation.myId;
            new_chat.rec = '';
            new_chat.reco = chat_reco;
            var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
            new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
            new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            lzm_chatServerEvaluation.chatMessageCounter++;
            new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
            new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
            //console.log(chatMessage);
            var chatText = chatMessage.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, "<br />");
            chatText = chatText.replace(/<script/g,'&lt;script').replace(/<\/script/g,'&lt;/script');
            chatText = lzm_chatServerEvaluation.addLinks(chatText);
            //console.log(chatText);
            new_chat.text = chatText;
            //console.log(new_chat);
            var os = '';
            if (isMobile) {
                os = mobileOS;
            }
            clearEditorContents(os, lzm_chatDisplay.browserName);
            lzm_chatUserActions.sendChatMessage(new_chat);

            lzm_chatServerEvaluation.addNewChat(new_chat);
            lzm_chatDisplay.createChatHtml(lzm_chatServerEvaluation.chats, lzm_chatServerEvaluation.chatObject,
                lzm_chatPollServer.thisUser, lzm_chatServerEvaluation.internal_users,
                lzm_chatServerEvaluation.external_users, chat_reco);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(true);
        }
    } else {
        inviteExternalUser(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.b_id);
    }
    if(isMobile || app == 1) {
        setTimeout(function() {doMacMagicStuff();}, 5);
    }
}

function createUserControlPanel() {
    var counter=1;
    var repeatThis = setInterval(function() {
        lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
            lzm_chatServerEvaluation.myUserId);
        counter++;
        if (counter >= 60 || lzm_chatServerEvaluation.myName != '' || lzm_chatServerEvaluation.myUserId != '') {
            clearInterval(repeatThis);
            //showAppDownloadLink();
            lzm_displayHelper.unblockUi();
        }
    },250);
}

function testDrag(change) {
    var thisVisitorList = $('#visitor-list');
    if (typeof change == 'undefined' || change == '' || change == 0) {
        var y = window.event.pageY;
        lzm_chatDisplay.visitorListHeight = thisVisitorList.height() + $('#chat').position().top + thisVisitorList.position().top - y + 11;
    } else {
        var newHeight = lzm_chatDisplay.visitorListHeight + change;
        if (newHeight >= 62) {
            lzm_chatDisplay.visitorListHeight = newHeight;
        }
    }
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
    if (lzm_chatDisplay.selected_view == 'external') {
        lzm_chatDisplay.createVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject,
            lzm_chatServerEvaluation.internal_users);
    }
    lzm_chatDisplay.createChatHtml(lzm_chatServerEvaluation.chats, lzm_chatServerEvaluation.chatObject, lzm_chatDisplay.thisUser,
        lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.external_users, lzm_chatDisplay.active_chat_reco);
    return false;
}

function manageUsersettings(e) {
    e.stopPropagation();
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    /*removeEditor();
    if (lzm_chatDisplay.displayWidth == 'small') {
        lzm_chatServerEvaluation.settingsDialogue = true;
        lzm_chatDisplay.settingsDialogue = true;
    }*/
    var storedSettingsId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'settings') {
                storedSettingsId = key;
            }
        }
    }
    if (storedSettingsId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedSettingsId);
    } else {
        lzm_chatUserActions.manageUsersettings();
    }
}

function saveUserSettings() {
    var showViewSelectPanel = {
        'mychats': $('#show-mychats').prop('checked') ? 1 : 0,
        'tickets': $('#show-tickets').prop('checked') ? 1 : 0,
        'external': $('#show-external').prop('checked') ? 1 : 0,
        'internal': $('#show-internal').prop('checked') ? 1 : 0,
        'qrd': $('#show-qrd').prop('checked') ? 1 : 0,
        'archive': $('#show-archive').prop('checked') ? 1 : 0/*,
        'filter': $('#show-filter').prop('checked') ? 1 : 0*/
    };
    var viewArray = [];
    var viewSelectArray = [], viewSelectObject = {}, i = 0;
    for (i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
        viewSelectObject[lzm_chatDisplay.viewSelectArray[i].id] = lzm_chatDisplay.viewSelectArray[i].name;
    }
    $('.show-view-div').each(function() {
        var viewId = $(this).data('view-id');
        viewSelectArray.push({id: viewId, name: viewSelectObject[viewId]});
    });
    lzm_chatDisplay.viewSelectArray = viewSelectArray;
    var settings = {
        volume: $('#volume-slider').val(),
        awayAfterTime: $('#away-after-time').val(),
        playNewMessageSound: $('#sound-new-message').prop('checked') ? 1 : 0,
        playNewChatSound: $('#sound-new-chat').prop('checked') ? 1 : 0,
        repeatNewChatSound: $('#sound-repeat-new-chat').prop('checked') ? 1 : 0,
        backgroundMode: $('#background-mode').prop('checked') ? 1 : 0,
        saveConnections: $('#save-connections').prop('checked') ? 1 : 0,
        playNewTicketSound: $('#sound-new-ticket').prop('checked') ? 1 : 0,
        showViewSelectPanel: showViewSelectPanel,
        viewSelectArray: viewSelectArray,
        autoAccept: $('#auto-accept').prop('checked') ? 1 : 0
    };
    //console.log(settings);
    lzm_chatUserActions.saveUserSettings(settings, multiServerId, app==1);
    lzm_chatDisplay.createViewSelectPanel(viewSelectArray[0].id);
}

function manageTranslations() {
    if (lzm_chatDisplay.displayWidth == 'small') {
        lzm_chatServerEvaluation.settingsDialogue = true;
        lzm_chatDisplay.settingsDialogue = true;
    }
    lzm_chatUserActions.manageTranslations();
}

function finishSettingsDialogue() {
    lzm_chatServerEvaluation.settingsDialogue = false;
    lzm_chatDisplay.settingsDialogue = false;
    $('#usersettings-container').css({display: 'none'});
    if (lzm_chatDisplay.selected_view == 'mychats') {
        initEditor(loadChatInput(lzm_chatDisplay.active_chat_reco), 'finishSettings');
    }
}

function editTranslations() {
    lzm_chatUserActions.editTranslations($('#existing-language').val(), $('#new-language').val());
}

function saveTranslations(numberOfStrings) {
    finishSettingsDialogue();
    var stringObjects = [];
    for (var i=0; i<numberOfStrings; i++) {
        var thisStringObject = {en: $('#orig-string-'+i).val()};
        thisStringObject[lzm_chatDisplay.editThisTranslation] = $('#trans-string-'+i).val();
        stringObjects.push(thisStringObject);
    }
    lzm_t.saveTranslations(lzm_chatDisplay.editThisTranslation, stringObjects);
    lzm_chatDisplay.editThisTranslation = '';
    $('#translation-container').css('display', 'none');
}

function cancelTranslations() {
    finishSettingsDialogue();
    lzm_chatDisplay.editThisTranslation = '';
    $('#translation-container').css('display', 'none');
}

function t(translateString, placeholderArray) {
    return this.lzm_t.translate(translateString, placeholderArray);
}

function openOrCloseFolder(resourceId, onlyOpenFolders) {
    var folderDiv = $('#folder-' + resourceId);
    if (folderDiv.html() != "") {
        var markDiv = $('#resource-' + resourceId + '-open-mark');
        var bgCss;
        if (folderDiv.css('display') == 'none') {
            folderDiv.css('display', 'block');
            bgCss = {'background-image': lzm_displayHelper.addBrowserSpecificGradient('url("img/minus.png")'),
                'background-repeat': 'no-repeat', 'background-position': 'center'};
            markDiv.css(bgCss);
            if ($.inArray(resourceId, lzm_chatDisplay.openedResourcesFolder) == -1) {
                lzm_chatDisplay.openedResourcesFolder.push(resourceId);
            }
        } else if (!onlyOpenFolders) {
            folderDiv.css('display', 'none');
            bgCss = {'background-image': lzm_displayHelper.addBrowserSpecificGradient('url("img/plus.png")'),
                'background-repeat': 'no-repeat', 'background-position': 'center'};
            markDiv.css(bgCss);
            var tmpOpenedFolder = [];
            for (var i=0; i<lzm_chatDisplay.openedResourcesFolder.length; i++) {
                if (resourceId != lzm_chatDisplay.openedResourcesFolder[i]) {
                    tmpOpenedFolder.push(lzm_chatDisplay.openedResourcesFolder[i]);
                }
            }
            lzm_chatDisplay.openedResourcesFolder = tmpOpenedFolder;
        }
    }
}

function handleResourceClickEvents(resourceId, onlyOpenFolders) {
    removeQrdContextMenu();
    onlyOpenFolders = (typeof onlyOpenFolders != 'undefined') ? onlyOpenFolders : false;
    lzm_chatDisplay.selectedResource = resourceId;
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatServerEvaluation.resources[i].rid == resourceId) {
            resource = lzm_chatServerEvaluation.resources[i];
        }
    }
    $('.resource-div').removeClass('selected-resource-div');
    $('.qrd-search-line').removeClass('selected-table-line');
    $('.qrd-recently-line').removeClass('selected-table-line');
    lzm_chatDisplay.highlightSearchResults(lzm_chatServerEvaluation.resources, false);
    $('#resource-' + resourceId).addClass('selected-resource-div');
    $('#qrd-search-line-' + resourceId).addClass('selected-table-line');
    $('#qrd-recently-line-' + resourceId).addClass('selected-table-line');
    $('.qrd-change-buttons').addClass('ui-disabled');
    switch (Number(resource.ty)) {
        case 0:
            openOrCloseFolder(resourceId, onlyOpenFolders);
            if ($.inArray(resourceId, ['3', '5']) == -1) {
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                    $('#edit-qrd').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                    $('#add-qrd').removeClass('ui-disabled');
                }
                if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                    $('#delete-qrd').removeClass('ui-disabled');
                }
            }
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                $('#add-or-edit-qrd').removeClass('ui-disabled');
            }
            $('#add-qrd-attachment').addClass('ui-disabled');
            break;
        case 1:
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                $('#edit-qrd').removeClass('ui-disabled');
            }
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                $('#delete-qrd').removeClass('ui-disabled');
            }
            $('#view-qrd').removeClass('ui-disabled');
            $('#preview-qrd').removeClass('ui-disabled');
            $('#send-qrd-preview').removeClass('ui-disabled');
            $('#insert-qrd-preview').removeClass('ui-disabled');
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'add', resource)) {
                $('#add-or-edit-qrd').removeClass('ui-disabled');
            }
            $('#add-qrd-attachment').addClass('ui-disabled');
            break;
        case 2:
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
                $('#edit-qrd').removeClass('ui-disabled');
            }
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                $('#delete-qrd').removeClass('ui-disabled');
            }
            $('#view-qrd').removeClass('ui-disabled');
            $('#preview-qrd').removeClass('ui-disabled');
            $('#send-qrd-preview').removeClass('ui-disabled');
            $('#insert-qrd-preview').removeClass('ui-disabled');
            $('#add-qrd-attachment').addClass('ui-disabled');
            break;
        default:
            if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'delete', resource)) {
                $('#delete-qrd').removeClass('ui-disabled');
            }
            $('#preview-qrd').removeClass('ui-disabled');
            $('#send-qrd-preview').removeClass('ui-disabled');
            $('#insert-qrd-preview').removeClass('ui-disabled');
            $('#add-qrd-attachment').removeClass('ui-disabled');
            break;
    }
}

function addQrd() {
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'add-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        lzm_chatUserActions.addQrd();
    }
}

function deleteQrd() {
    removeQrdContextMenu();
    if (confirm(t('Do you want to delete this entry including subentries irrevocably?'))) {
        lzm_chatUserActions.deleteQrd();
    }
}

function renameQrd() {
    // Perhaps not needed
}

function editQrd() {
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatServerEvaluation.resources[i].rid == lzm_chatDisplay.selectedResource) {
            resource = lzm_chatServerEvaluation.resources[i];
            break;
        }
    }
    if (lzm_commonPermissions.checkUserPermissions('', 'resources', 'edit', resource)) {
        if ((lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) && resource.ty == 1) {
            showNotMobileMessage();
        } else {
            var storedPreviewId = '';
            for (var key in lzm_chatDisplay.StoredDialogs) {
                if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                    if (lzm_chatDisplay.StoredDialogs[key].type == 'edit-resource' &&
                        typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                        lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                        storedPreviewId = key;
                    }
                }
            }
            if (storedPreviewId != '') {
                lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
            } else {
                lzm_chatUserActions.editQrd(resource);
            }
        }
    } else {
        showNoPermissionMessage();
    }
}

function previewQrd(chatPartner, qrdId, inDialog, menuEntry) {
    //console.log('Preview qrd: ' + chatPartner + ' - ' + qrdId);
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'preview-resource' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['resource-id'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['resource-id'] == lzm_chatDisplay.selectedResource) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        chatPartner = (typeof chatPartner != 'undefined') ? chatPartner : '';
        qrdId = (typeof qrdId != 'undefined') ? qrdId : lzm_chatDisplay.selectedResource;
        $('#preview-qrd').addClass('ui-disabled');
        lzm_chatUserActions.previewQrd(chatPartner, qrdId, inDialog, menuEntry);
    }
}

function getQrdDownloadUrl(resource) {
    var downloadUrl = lzm_chatServerEvaluation.serverProtocol + lzm_chatServerEvaluation.serverUrl + '/getfile.php?' +
        'acid=' + lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5) +
        '&file=' + resource.ti + '&id=' + resource.rid;
    return downloadUrl;
}

function showQrd(chatPartner, caller) {
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    removeEditor();
    var storedPreviewId = '';
    for (var key in lzm_chatDisplay.StoredDialogs) {
        if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
            if (lzm_chatDisplay.StoredDialogs[key].type == 'qrd-tree' &&
                typeof lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] != 'undefined' &&
                lzm_chatDisplay.StoredDialogs[key].data['chat-partner'] == chatPartner) {
                storedPreviewId = key;
            }
        }
    }
    if (storedPreviewId != '') {
        lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
    } else {
        lzm_chatDisplay.createQrdTreeDialog(lzm_chatServerEvaluation.resources, chatPartner,
            lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.internal_users,
            lzm_chatServerEvaluation.internal_departments);
    }
}

function cancelQrd(closeToTicket) {
    cancelQrdPreview(0);
    lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
    if (closeToTicket != '') {
        var dialogId = lzm_chatDisplay.ticketDialogId[closeToTicket] + '_reply';
        if (typeof lzm_chatDisplay.ticketDialogId[closeToTicket] == 'undefined' || closeToTicket.indexOf('_reply') != -1) {
            dialogId = closeToTicket;
        }

        lzm_displayHelper.maximizeDialogWindow(dialogId);
    }
    openLastActiveChat();
}

function cancelQrdPreview(animationTime) {
    $('#preview-qrd').removeClass('ui-disabled');
    $('#qrd-preview-container').remove();
}

function sendQrdPreview(resourceId, chatPartner) {
    //console.log('|'+chatPartner+'|'+lzm_chatDisplay.active_chat_reco+'|');
    resourceId = (resourceId != '') ? resourceId : lzm_chatDisplay.selectedResource;
    addResourceToRecentlyUsedList(resourceId);
    var resourceHtmlText, resource;
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (resourceId == lzm_chatServerEvaluation.resources[i].rid) {
            resource = lzm_chatServerEvaluation.resources[i];
            break;
        }
    }
    switch (resource.ty) {
        case '1':
            resourceHtmlText = resource.text;
            break;
        case '2':
            var linkHtml = '<a href="' + resource.text + '" class="lz_chat_link" target="_blank">' + resource.ti + '</a>';
            resourceHtmlText = linkHtml;
            break;
        default:
            var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
            var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);
            var fileId = resource.text.split('_')[1];
            var thisServer = lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url;
            var fileHtml = '<a ' +
                'href="' + thisServer + '/getfile.php' +
                '?acid=' + acid +
                '&file=' + urlFileName +
                '&id=' + fileId + '" ' +
                'class="lz_chat_file" target="_blank">' + resource.ti + '</a>';
            resourceHtmlText = fileHtml;
            break;
    }
    //console.log(resourceHtmlText);
    if ((app == 1) || isMobile) {
        sendChat(resourceHtmlText);
    } else {
        saveChatInput(chatPartner, resourceHtmlText);
    }
    cancelQrd();
    $('#qrd-tree-body').remove();
    $('#qrd-tree-footline').remove();
}

function changeFile() {
    var maxFileSize = lzm_chatServerEvaluation.global_configuration.php_cfg_vars.upload_max_filesize;
    var file = $('#file-upload-input')[0].files[0];
    if(!file) {
        $('#file-upload-name').html('');
        $('#file-upload-size').html('');
        $('#file-upload-type').html('');
        $('#file-upload-progress').css({display: 'none'});
        $('#file-upload-numeric').html('');
        $('#file-upload-error').html('');
        $('#cancel-file-upload-div').css({display: 'none'});
        return;
    }

    var thisUnit = (file.size <= 10000) ? 'B' : (file.size <= 10240000) ? 'kB' : 'MB';
    var thisFileSize = (file.size <= 10000) ? file.size : (file.size <= 1024000) ? file.size / 1024 : file.size / 1048576;
    thisFileSize = Math.round(thisFileSize * 10) / 10;
    $('#file-upload-name').html(t('File name: <!--file_name-->', [['<!--file_name-->', file.name]]));
    $('#file-upload-size').html(t('File size: <!--file_size--> <!--unit-->', [['<!--file_size-->', thisFileSize],['<!--unit-->', thisUnit]]));
    $('#file-upload-type').html(t('File type: <!--file_type-->', [['<!--file_type-->', file.type]]));
    $('#file-upload-progress').css({display: 'none'});
    $('#file-upload-numeric').html('0%');
    $('#file-upload-error').html('');
    $('#cancel-file-upload-div').css({display: 'block'});

    if (file.size > maxFileSize) {
        $('#file-upload-input').val('');
        $('#file-upload-error').html(t('File size too large'));
    }
}

function uploadFile(fileType, parentId, rank, toAttachment) {
    $('#file-upload-progress').css({display: 'block'});
    $('#cancel-file-upload').removeClass('ui-disabled');
    var file = $('#file-upload-input')[0].files[0];

    lzm_chatPollServer.uploadFile(file, fileType, parentId, rank, toAttachment);
}

function cancelFileUpload() {
    lzm_chatPollServer.fileUploadClient.abort();
    $('#cancel-file-upload').addClass('ui-disabled');
}

function openQrdContextMenu(e, chatPartner, resourceId) {
    handleResourceClickEvents(resourceId, true);
    var resource;
    var scrolledDownY = $('#qrd-tree-body').scrollTop();
    var scrolledDownX = $('#qrd-tree-body').scrollLeft();
    var parentOffset = $('#qrd-tree-body').offset();
    var yValue = e.pageY - parentOffset.top;
    var xValue = e.pageX - parentOffset.left;
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatServerEvaluation.resources[i].rid == resourceId) {
            resource = lzm_chatServerEvaluation.resources[i];
            break;
        }
    }
    resource.chatPartner = chatPartner;

    lzm_chatDisplay.showContextMenu('qrd-tree', resource, xValue + scrolledDownX, yValue + scrolledDownY);
    e.preventDefault();
}

function removeQrdContextMenu() {
    $('#qrd-tree-context').remove();
}

function openTicketContextMenu(e, ticketId, inDialog) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    removeTicketFilterMenu();
    selectTicket(ticketId, false, inDialog);
    var scrolledDownY, scrolledDownX, parentOffset;
    var place = (!inDialog) ? 'ticket-list' : 'visitor-information';
    scrolledDownY = $('#' + place +'-body').scrollTop();
    scrolledDownX = $('#' + place +'-body').scrollLeft();
    parentOffset = $('#' + place +'-body').offset();
    var xValue = e.pageX - parentOffset.left + scrolledDownX;
    var yValue = e.pageY - parentOffset.top + scrolledDownY;

    var ticket = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    lzm_chatDisplay.showTicketContextMenu = true;
    lzm_chatDisplay.showContextMenu(place, ticket, xValue, yValue);
    e.stopPropagation();
    e.preventDefault();
}

function removeTicketContextMenu() {
    lzm_chatDisplay.showTicketContextMenu = false;
    $('#ticket-list-context').remove();
    $('#visitor-information-context').remove();
}

function openTicketFilterMenu(e, filter) {
    e.stopPropagation();
    removeTicketContextMenu();
    if (lzm_chatDisplay.showTicketFilterMenu) {
        removeTicketFilterMenu();
    } else {
        var parentOffset = $('#ticket-filter').offset();
        var xValue = parentOffset.left;
        var yValue = parentOffset.top + 24;
        lzm_chatDisplay.showTicketFilterMenu = true;
        lzm_chatDisplay.showContextMenu('ticket-filter', {filter: filter,
            filter_personal: (lzm_chatPollServer.dataObject.p_dt_fp == 1),
            filter_group: (lzm_chatPollServer.dataObject.p_dt_fg == 1)}, xValue, yValue);
        e.preventDefault();
    }
}

function removeTicketFilterMenu() {
    lzm_chatDisplay.showTicketFilterMenu = false;
    $('#ticket-filter-context').remove();
}

function openTicketMessageContextMenu(e, ticketId, messageNumber, fromButton) {
    if (messageNumber != '') {
        handleTicketMessageClick(ticketId, messageNumber);
    } else {
        messageNumber = $('#ticket-history-table').data('selected-message');
    }
    var ticket = {}, xValue, yValue;
    var parentOffset = $('#ticket-history-placeholder-content-0').offset();
    var buttonPressed = '';
    if(!fromButton) {
        xValue = e.pageX - parentOffset.left + $('#ticket-history-placeholder-content-0').scrollLeft();
        yValue = e.pageY - parentOffset.top + $('#ticket-history-placeholder-content-0').scrollTop();
    } else {
        xValue = e.pageX - parentOffset.left;
        yValue = e.pageY - parentOffset.top;
        buttonPressed = 'ticket-message-actions';
    }
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }

    lzm_chatDisplay.showTicketMessageContextMenu = true;
    lzm_chatDisplay.showContextMenu('ticket-details', {ti: ticket, msg: messageNumber}, xValue, yValue, buttonPressed);
    e.preventDefault();
}

function removeTicketMessageContextMenu() {
    lzm_chatDisplay.showTicketMessageContextMenu = false;
    $('#ticket-details-context').remove();
}

function toggleTicketFilter(status, e) {
    e.stopPropagation();
    removeTicketFilterMenu();
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    var filterList = lzm_chatPollServer.ticketFilter.split('');
    if ($.inArray(status.toString(), filterList) != -1) {
        var pattern = new RegExp(status.toString());
        lzm_chatPollServer.ticketFilter = lzm_chatPollServer.ticketFilter.replace(pattern, '');
    } else {
        filterList.push(status);
        filterList.sort();
        lzm_chatPollServer.ticketFilter = filterList.join('');
    }
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    //console.log('Resetting ticket uopdate timestamp');
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function toggleTicketFilterPersonal(type, e) {
    e.stopPropagation();
    removeTicketFilterMenu();
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    if (type == 0) {
        if (lzm_chatPollServer.dataObject.p_dt_fp == '1') {
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fp');
        } else {
            lzm_chatPollServer.addPropertyToDataObject('p_dt_fp', '1');
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fg');
        }
    } else if (type == 1) {
        if (lzm_chatPollServer.dataObject.p_dt_fg == '1') {
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fg');
        } else {
            lzm_chatPollServer.addPropertyToDataObject('p_dt_fg', '1');
            lzm_chatPollServer.removePropertyFromDataObject('p_dt_fp');
        }
    }
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function pageTicketList(page) {
    $('.ticket-list-page-button').addClass('ui-disabled');
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketPage = page;
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    //console.log('Resetting ticket uopdate timestamp');
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function switchTicketListPresentation(ticketFetchTime, counter, ticketId) {
    //console.log(ticketFetchTime, counter, ticketId);
    var loadingHtml, myWidth, myHeight;
    if (counter == 0) {
        if ($('#matching-tickets-table').length == 0) {
            loadingHtml = '<div id="ticket-list-loading"></div>';
            $('#ticket-list-body').append(loadingHtml).trigger('create');
            myWidth = $('#ticket-list-body').width() + 10;
            myHeight = $('#ticket-list-body').height() + 10;
            $('#ticket-list-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
            //console.log('Normal: ' + myWidth + ' x ' + myHeight);
        } else {
            loadingHtml = '<div id="matching-ticket-list-loading"></div>';
            $('#visitor-info-placeholder-content-5').append(loadingHtml).trigger('create');
            myWidth = $('#visitor-info-placeholder-content-4').width() + 28;
            myHeight = $('#visitor-info-placeholder-content-4').height() + 48;
            $('#matching-ticket-list-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
            //console.log('Matching: ' + myWidth + ' x ' + myHeight);
        }
        //console.log('Ticket list loading div created');
        //console.log($('#ticket-list-loading'));
    }
    //console.log('Switch Ticket list representation: ' + (counter + 1) + ' try...');
    //console.log(ticketFetchTime + ' --- ' + lzm_chatServerEvaluation.ticketFetchTime);
    if (ticketFetchTime != lzm_chatServerEvaluation.ticketFetchTime || counter >= 40) {
        if (typeof ticketId != 'undefined') {
            //console.log('Change ticket read status...');
            changeTicketReadStatus(ticketId, 'read', true, true);
        }
        if ($('#matching-tickets-table').length == 0) {
            lzm_chatDisplay.createTicketList(lzm_chatServerEvaluation.tickets,  lzm_chatServerEvaluation.ticketGlobalValues,
                lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
                lzm_chatServerEvaluation.internal_users, false);
        } else {
            $('#matching-ticket-list-loading').remove();
            selectTicket('', true, true);
        }
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchTicketListPresentation(ticketFetchTime, counter, ticketId);}, delay);
    }
}

function showTicketDetails(ticketId, fromContext, emailId, chatId, dialogId) {
    var email = {id: ''}, chat = {cid: ''}, i;
    dialogId = (typeof dialogId != 'undefined') ? dialogId : '';
    if (typeof emailId != 'undefined' && emailId != '') {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            if (lzm_chatServerEvaluation.emails[i].id == emailId) {
                email = lzm_chatServerEvaluation.emails[i];
                email['dialog-id'] = dialogId
            }
        }
    }
    if (typeof chatId != 'undefined' && chatId != '') {
        for (i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                chat = lzm_chatServerEvaluation.chatArchive.chats[i];
                chat['dialog-id'] = dialogId;
            }
        }
    }
    selectTicket(ticketId);
    changeTicketReadStatus(ticketId, 'read', false, true);
    if (!fromContext && lzm_chatDisplay.showTicketContextMenu) {
        removeTicketContextMenu();
    } else {
        removeTicketContextMenu();
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'ticket-details' &&
                    typeof lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[key].data['ticket-id'] == ticketId) {
                    storedPreviewId = key;
                }
            }
        }
        if (storedPreviewId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        } else {
            var ticket = {};
            var operatorObject = {};
            for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
                operatorObject[lzm_chatServerEvaluation.internal_users[i].id] = lzm_chatServerEvaluation.internal_users[i];
            }
            for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                    ticket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
            var isNew = (ticketId == '') ? true : false;
            lzm_chatDisplay.ticketDialogId[ticketId] = lzm_chatDisplay.showTicketDetails(ticket, operatorObject, lzm_chatServerEvaluation.internal_departments, isNew, email, chat, dialogId);
        }
    }
}

function showMessageForward(ticketId, messageNo) {
    //console.log(ticketId, messageNo);
    removeTicketMessageContextMenu();
    var message = {}, ticketSender = '', group = '';
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
            ticketSender = lzm_chatDisplay.ticketListTickets[i].messages[0].fn;
            group = (typeof lzm_chatDisplay.ticketListTickets[i].editor != 'undefined' && lzm_chatDisplay.ticketListTickets[i].editor != false) ?
                lzm_chatDisplay.ticketListTickets[i].editor.g : lzm_chatDisplay.ticketListTickets[i].gr;
        }
    }
    //console.log(message);
    lzm_chatDisplay.showMessageForward(message, ticketId, ticketSender, group);
}

function sendForwardedMessage(message, text, emailAddresses, emailSubject, ticketId, group, messageNo) {
    removeTicketMessageContextMenu();
    if (message.id == '') {
        for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
                text = message.mt;
                emailAddresses = message.em;
                emailSubject = (typeof message.s != 'undefined') ? message.s : '';
                group = (typeof lzm_chatDisplay.ticketListTickets[i].editor != 'undefined' && lzm_chatDisplay.ticketListTickets[i].editor != false) ?
                lzm_chatDisplay.ticketListTickets[i].editor.g : lzm_chatDisplay.ticketListTickets[i].gr;
            }
        }
    }
    var ticket = {mid: message.id, gr: group, em: emailAddresses, su: emailSubject, text: text, id: ticketId};
    //console.log(ticket);
    lzm_chatPollServer.pollServerTicket(ticket, [], 'forward-to');
}

function moveMessageToNewTicket(ticketId, messageNo) {
    var message = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            message = lzm_chatDisplay.ticketListTickets[i].messages[messageNo];
        }
    }
    var ticket = {mid: message.id, id: ticketId};
    lzm_chatPollServer.pollServerTicket(ticket, [], 'move-message');
}

function selectTicket(ticketId, noUserInteraction, inDialog) {
    noUserInteraction = (typeof noUserInteraction != 'undefined') ? noUserInteraction : false;
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    var ticket, messageText, i;
    if (!inDialog) {
        if ($.inArray(ticketId, ['next', 'previous']) != -1) {
            if (lzm_chatDisplay.selectedTicketRow != '') {
                for (var j=0; j<lzm_chatDisplay.ticketListTickets.length; j++) {
                    if (lzm_chatDisplay.ticketListTickets[j].id == lzm_chatDisplay.selectedTicketRow) {
                        try {
                            ticketId = (ticketId == 'next') ?  lzm_chatDisplay.ticketListTickets[j + 1].id : lzm_chatDisplay.ticketListTickets[j - 1].id;
                        } catch(e) {
                            ticketId = lzm_chatDisplay.ticketListTickets[j].id;
                        }
                    }
                }
            } else {
                ticketId = lzm_chatDisplay.ticketListTickets[0].id
            }
        }
    } else {
        try {
            ticketId = (ticketId != '') ? ticketId : lzm_chatDisplay.ticketListTickets[0].id;
        } catch (e) {}
    }
    removeTicketContextMenu(inDialog);
    $('.ticket-list-row').removeClass('selected-table-line');
    if (ticketId != '' && !noUserInteraction && !lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile &&
        lzm_chatDisplay.selectedTicketRow == ticketId &&
        lzm_commonTools.checkTicketReadStatus(ticketId, lzm_chatDisplay.ticketReadArray) == -1 &&
        lzm_chatTimeStamp.getServerTimeString(null, false, 1) - ticketLineClicked >= 500) {
        changeTicketReadStatus(ticketId, 'read', false, true);
    }
    ticketLineClicked = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    lzm_chatDisplay.selectedTicketRow = ticketId;
    ticket = {};
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    if (!inDialog) {
        $('#ticket-list-row-' + ticketId).addClass('selected-table-line');
        if ($(window).width() > 1000) {
            try {
                messageText = lzm_commonTools.htmlEntities(ticket.messages[ticket.messages.length - 1].mt)
                    .replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
                $('#ticket-list-right').html(messageText);
            } catch(e) {}
        }
    } else/* if ($('#matching-ticket-list-row-' + ticketId).length > 0)*/ {
        $('#matching-ticket-list-row-' + ticketId).addClass('selected-table-line');
        messageText = '';
        try {
            messageText = lzm_commonTools.htmlEntities(ticket.messages[ticket.messages.length - 1].mt)
                .replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
        } catch (e) {}
        try {
            $('#ticket-content-inner').html('<legend>' + t('Text') + '</legend>' + messageText);
        } catch(e) {}
    }
}

function handleTicketMessageClick(ticketId, messageNumber) {
    removeTicketMessageContextMenu();
    var ticket = {}, i, operatorObject = {};
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
        operatorObject[lzm_chatServerEvaluation.internal_users[i].id] = lzm_chatServerEvaluation.internal_users[i];
    }
    $('.message-line').removeClass('selected-table-line');
    $('#ticket-history-table').data('selected-message', messageNumber);
    $('#message-line-' + ticketId + '_' + messageNumber).addClass('selected-table-line');

    var attachmentsHtml = lzm_displayHelper.createTicketAttachmentTable(ticket, {id:''}, messageNumber, false);
    var commentsHtml = lzm_displayHelper.createTicketCommentTable(ticket, messageNumber, operatorObject);
    var detailsHtml = lzm_displayHelper.createTicketMessageDetails(ticket.messages[messageNumber], {id: ''}, false, operatorObject);
    var messageHtml = lzm_commonTools.htmlEntities(ticket.messages[messageNumber].mt).replace(/\n/g, '<br />');
    $('#ticket-message-text').html('<legend>' + t('Message') + '</legend>' + messageHtml);
    $('#ticket-message-details').html('<legend>' + t('Details') + '</legend>' + detailsHtml);
    $('#ticket-attachment-list').html('<legend>' + t('Attachments') + '</legend>' + attachmentsHtml);
    $('#ticket-comment-list').html('<legend>' + t('Comments') + '</legend>' + commentsHtml);
}

function handleTicketCommentClick(commentNo, commentText) {
    $('.comment-text-line').remove();
    var commentTextHtml = '<tr class="comment-text-line"><td colspan="3">' + commentText + '</td></tr>';
    $('.comment-line').removeClass('selected-table-line');
    $('#comment-line-' + commentNo).addClass('selected-table-line');
    $('#comment-table').data('selected-comment', commentNo);
    $('#comment-line-' + commentNo).after(commentTextHtml);
    $('#comment-table').trigger('create');

}

function handleTicketAttachmentClick(attachmentNo) {
    $('.attachment-line').removeClass('selected-table-line');
    $('#attachment-line-' + attachmentNo).addClass('selected-table-line');
    $('#attachment-table').data('selected-attachment', attachmentNo);
    $('#message-attachment-table').data('selected-attachment', attachmentNo);
    $('#remove-attachment').removeClass('ui-disabled');
}

function saveTicketDetails(ticket, channel, status, group, editor, language, name, email, company, phone, message, attachments, comments, customFields, chat) {
    chat = (typeof chat != 'undefined') ? chat : {cid: ''};
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatUserActions.saveTicketDetails(ticket, channel, status, group, editor, language, name, email, company, phone, message, attachments, comments, customFields, chat);
    if (chat.cid == '') {
        switchTicketListPresentation(ticketFetchTime, 0, ticket.id);
    }
}

function changeTicketStatus(myStatus, fromKey, inDialog) {
    removeTicketContextMenu();
    if (lzm_chatDisplay.selectedTicketRow != '') {
        fromKey = (typeof fromKey != 'undefined') ? fromKey : false;
        inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
        if (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'change_ticket_status', {}) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_open', {}) && myStatus == 0) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_progress', {}) && myStatus == 1) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_closed', {}) && myStatus == 2) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_deleted', {}) && myStatus == 3)) {
            showNoPermissionMessage();
        } else {
            var myTicket = {};
            for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
                if (lzm_chatDisplay.ticketListTickets[i].id == lzm_chatDisplay.selectedTicketRow) {
                    myTicket = lzm_chatDisplay.ticketListTickets[i];
                }
            }
            var ticketGroup = myTicket.gr;
            var ticketEditor = -1;
            if (typeof myTicket.editor != 'undefined' && myTicket.editor != false) {
                ticketGroup = myTicket.editor.g;
                ticketEditor = myTicket.editor.ed;
            }
            var previousTicketStatus = (typeof myTicket.editor != 'undefined') ? myTicket.editor.st : 0;
            if (!fromKey) {
                saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
            } else {
                var deleteTicketMessage1 = t('Do you really want to remove this ticket irrevocably?');
                var deleteTicketMessage2 = t('You have replied to this request. Do you really want to remove this ticket?');
                var deleteTicketMessage3 = t('You have replied to this request. Do you really want to remove this ticket irrevocably?');
                if (myStatus != 3) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                } else if (myStatus == 3 && previousTicketStatus != 3 && myTicket.messages.length <= 1) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                } else if (myStatus == 3 && previousTicketStatus != 3 && myTicket.messages.length > 1 && confirm(deleteTicketMessage2)) {
                    saveTicketDetails(myTicket, myTicket.t, myStatus, ticketGroup, ticketEditor, myTicket.l, '', '', '', '', '');
                } else if (myStatus == 3 && previousTicketStatus == 3 && myTicket.messages.length <= 1 && confirm(deleteTicketMessage1)) {
                    lzm_chatUserActions.deleteTicket(myTicket.id);
                } else if (confirm(deleteTicketMessage3)) {
                    lzm_chatUserActions.deleteTicket(myTicket.id);
                }
            }

        }
    }
}

function sendTicketMessage(ticket, receiver, bcc, subject, message, comment, attachments, messageId) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatUserActions.sendTicketReply(ticket, receiver, bcc, subject, message, comment, attachments, messageId);
    switchTicketListPresentation(ticketFetchTime, 0, ticket.id);
}

function addOrEditResourceFromTicket(ticketId) {
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatDisplay.selectedResource == lzm_chatServerEvaluation.resources[i].rid) {
            resource = lzm_chatServerEvaluation.resources[i];
        }
    }
    if (resource.ty == 0) {
        lzm_chatUserActions.addQrd(ticketId, true);
    } else if (resource.ty == 1) {
        resource.text = lzm_chatDisplay.ticketResourceText[ticketId];
        lzm_chatUserActions.editQrd(resource, ticketId, true);
    }
}

function saveQrdFromTicket(resourceId, resourceText) {
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (resourceId == lzm_chatServerEvaluation.resources[i].rid) {
            resource = lzm_chatServerEvaluation.resources[i];
        }
    }
    resource.text = resourceText.replace(/\n/g, '<br />');
    lzm_chatPollServer.pollServerResource(resource);
}

function addResourceToRecentlyUsedList(resourceId) {
    var tmpArray = [];
    for (var i=0; i<lzm_chatDisplay.recentlyUsedResources.length; i++) {
        if (lzm_chatDisplay.recentlyUsedResources[i] != resourceId) {
            tmpArray.push(lzm_chatDisplay.recentlyUsedResources[i]);
        }
    }
    tmpArray.push(resourceId);
    if (tmpArray.length > 10) {
        tmpArray.shift();
    }
    lzm_chatDisplay.recentlyUsedResources = tmpArray;
}

function addQrdAttachment(closeToTicket) {
    addResourceToRecentlyUsedList(lzm_chatDisplay.selectedResource);
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatDisplay.selectedResource == lzm_chatServerEvaluation.resources[i].rid) {
            resource = lzm_chatServerEvaluation.resources[i];
        }
    }
    cancelQrd(closeToTicket);
    var resources1 = $('#reply-placeholder-content-1').data('selected-resources');
    var resources2 = $('#ticket-details-placeholder-content-1').data('selected-resources');
    var resources = (typeof resources1 != 'undefined') ? resources1 : (typeof resources2 != 'undefined') ? resources2 : [];
    resources.push(resource);
    $('#reply-placeholder-content-1').data('selected-resources', resources);
    $('#ticket-details-placeholder-content-1').data('selected-resources', resources);
    lzm_chatDisplay.updateAttachmentList();
}

function insertQrdIntoTicket(ticketId) {
    addResourceToRecentlyUsedList(lzm_chatDisplay.selectedResource);
    var resource = {};
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        if (lzm_chatDisplay.selectedResource == lzm_chatServerEvaluation.resources[i].rid) {
            resource = lzm_chatServerEvaluation.resources[i];
        }
    }
    lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
    lzm_displayHelper.maximizeDialogWindow(lzm_chatDisplay.ticketDialogId[ticketId] + '_reply');
    var replyText = '';//$('#ticket-reply-input').val();
    switch(resource.ty) {
        case '1':
            replyText += resource.text
                .replace(/^<p>/gi,'').replace(/^<div>/gi,'')
                .replace(/<p>/gi,'<br>').replace(/<div>/gi,'<br>')
                .replace(/<br>/gi,'\n').replace(/<br \/>/gi, '\n');
            if (replyText.indexOf('openLink') != -1) {
                replyText = replyText.replace(/<a.*openLink\('(.*?)'\).*>(.*?)<\/a>/gi, '$2 ($1)');
            } else {
                replyText = replyText.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, '$2 ($1)');
            }
            replyText = replyText.replace(/<.*?>/g, '').replace(/&nbsp;/gi, ' ')
                .replace(/&.*?;/g, '');
            break;
        case '2':
            replyText += resource.ti + ':\n' + resource.text;
            break;
        default:
            var urlFileName = encodeURIComponent(resource.ti.replace(/ /g, '+'));
            var fileId = resource.text.split('_')[1];
            var urlParts = lzm_commonTools.getUrlParts(lzm_chatPollServer.chosenProfile.server_protocol + lzm_chatPollServer.chosenProfile.server_url, 0);
            var thisServer = ((urlParts.protocol == 'http://' && urlParts.port == 80) || (urlParts.protocol == 'https://' && urlParts.port == 443)) ?
                urlParts.protocol + urlParts.urlBase + urlParts.urlRest : urlParts.protocol + urlParts.urlBase + ':' + urlParts.protocol + urlParts.urlRest;
            replyText += thisServer + '/getfile.php?file=' + urlFileName + '&id=' + fileId;
    }

    //$('#ticket-reply-input').val(replyText);
    insertAtCursor('ticket-reply-input', replyText);
    $('#ticket-reply-input-resource').val(resource.rid);

    if (/*resource.oid == lzm_chatDisplay.myId && */resource.ty == 1) {
        $('#ticket-reply-input-save').removeClass('ui-disabled');
    } else {
        $('#ticket-reply-input-save').addClass('ui-disabled');
    }
}

function setAllTicketsRead() {
    lzm_chatPollServer.stopPolling();
    var maxTicketUpdated = 0;
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        maxTicketUpdated = Math.max(lzm_chatDisplay.ticketListTickets[i].u, maxTicketUpdated);
    }
    if (maxTicketUpdated > lzm_chatPollServer.ticketMaxRead) {
        lzm_chatPollServer.ticketMaxRead = maxTicketUpdated;
        lzm_chatDisplay.ticketGlobalValues.mr = maxTicketUpdated;
    }
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    //console.log('Resetting ticket uopdate timestamp');
    lzm_chatDisplay.ticketReadArray = [];
    lzm_chatDisplay.ticketUnreadArray = [];
    lzm_chatDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,
        lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
        lzm_chatServerEvaluation.internal_users, true);
    lzm_chatPollServer.startPolling();
}

function changeTicketReadStatus(ticketId, status, doNotUpdate, forceRead) {
    removeTicketContextMenu();
    //console.log('Ticket read array: ' + JSON.stringify(lzm_chatDisplay.ticketReadArray));
    doNotUpdate = (typeof doNotUpdate != 'undefined') ? doNotUpdate : false;
    forceRead = (typeof forceRead != 'undefined') ? forceRead : false;
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    var ticket = {id: '', u: 0}, i;
    for (i=0; i<lzm_chatServerEvaluation.tickets.length; i++) {
        if (lzm_chatServerEvaluation.tickets[i].id == ticketId) {
            ticket = lzm_chatServerEvaluation.tickets[i];
        }
    }
    if (ticket.id == '') {
        for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
            if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
                ticket = lzm_chatDisplay.ticketListTickets[i];
            }
        }
    }
    //console.log('Ticket: ' + JSON.stringify({id: ticket.id, u: ticket.u}));
    if (status == 'read') {
        var timestamp = Math.max(lzm_chatTimeStamp.getServerTimeString(null, true), ticket.u);
        if (forceRead) {
            lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticketId, lzm_chatDisplay.ticketReadArray);
            lzm_chatDisplay.ticketReadArray.push({id: ticket.id, timestamp: timestamp});
        } else if (ticket.u > lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketReadArray) == -1) {
            lzm_chatDisplay.ticketReadArray.push({id: ticket.id, timestamp: timestamp});
        } else {
            lzm_chatDisplay.ticketUnreadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketUnreadArray);
            //console.log('Remove ticket ' + ticketId);
        }
    } else {
        if (ticket.u <= lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketUnreadArray) == -1) {
            lzm_chatDisplay.ticketUnreadArray.push({id: ticket.id, timestamp: lzm_chatTimeStamp.getServerTimeString(null, true)});
        } else {
            lzm_chatDisplay.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(ticket.id, lzm_chatDisplay.ticketReadArray);
        }
    }
    if (!doNotUpdate) {
        //console.log('Update the ticket list');
        lzm_chatDisplay.updateTicketList(lzm_chatDisplay.ticketListTickets, lzm_chatDisplay.ticketGlobalValues,
            lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
            lzm_chatServerEvaluation.internal_users, true);
    }
    //console.log('Ticket read array: ' + JSON.stringify(lzm_chatDisplay.ticketReadArray));

}

function sortTicketsBy(sortCriterium) {
    if (sortCriterium != lzm_chatPollServer.ticketSort) {
        $('.ticket-list-page-button').addClass('ui-disabled');
        var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.ticketSort = sortCriterium;
        lzm_chatPollServer.ticketUpdateTimestamp = 0;
        lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
        //console.log('Resetting ticket uopdate timestamp');
        lzm_chatPollServer.startPolling();
        switchTicketListPresentation(ticketFetchTime, 0);
    }
}

function searchTickets(searchString) {
    var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.ticketQuery = searchString;
    lzm_chatPollServer.ticketUpdateTimestamp = 0;
    lzm_chatPollServer.ticketPage = 1;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    //console.log('Resetting ticket uopdate timestamp');
    lzm_chatPollServer.startPolling();
    switchTicketListPresentation(ticketFetchTime, 0);
}

function cancelTicketReply(windowId, dialogId) {
    lzm_displayHelper.removeDialogWindow(windowId);
    lzm_displayHelper.maximizeDialogWindow(dialogId);
    $('#reply-ticket-details').removeClass('ui-disabled');
    //$('.ticket-buttons').removeClass('ui-disabled');
    //$('#ticket-reply').remove();
}

function showMessageReply(ticketId, messageNo, groupId) {
    var i, ticket, selectedGroup, operatorObject = {};
    for (i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
        }
    }
    for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
        operatorObject[lzm_chatServerEvaluation.internal_users[i].id] = lzm_chatServerEvaluation.internal_users[i];
    }
    for (i=0; i<lzm_chatServerEvaluation.internal_departments.length; i++) {
        if (lzm_chatServerEvaluation.internal_departments[i].id == groupId) {
            selectedGroup = lzm_chatServerEvaluation.internal_departments[i];
        }
    }

    lzm_chatDisplay.showMessageReply(ticket, messageNo, operatorObject, lzm_chatServerEvaluation.internal_departments, selectedGroup);
}

function addComment(ticketId, menuEntry) {
    var messageNo = $('#ticket-history-table').data('selected-message');
    var ticket = {}, message = {};
    for (var i=0; i<lzm_chatDisplay.ticketListTickets.length; i++) {
        if (lzm_chatDisplay.ticketListTickets[i].id == ticketId) {
            ticket = lzm_chatDisplay.ticketListTickets[i];
            message = ticket.messages[messageNo];
        }
    }
    lzm_chatDisplay.addMessageComment(ticket.id, message, menuEntry);
}

function toggleEmailList() {
    if ($('#email-list-container').length == 0) {
        var storedPreviewId = '';
        for (var key in lzm_chatDisplay.StoredDialogs) {
            if (lzm_chatDisplay.StoredDialogs.hasOwnProperty(key)) {
                if (lzm_chatDisplay.StoredDialogs[key].type == 'email-list') {
                    storedPreviewId = key;
                }
            }
        }
        if (storedPreviewId != '') {
            lzm_displayHelper.maximizeDialogWindow(storedPreviewId);
        } else {
            lzm_chatDisplay.showEmailList();
            lzm_chatPollServer.stopPolling();
            lzm_chatPollServer.emailUpdateTimestamp = 0;
            lzm_chatPollServer.addPropertyToDataObject('p_de_a', lzm_chatPollServer.emailAmount);
            lzm_chatPollServer.addPropertyToDataObject('p_de_s', 0);
            lzm_chatPollServer.startPolling();
        }
    } else {
        lzm_chatPollServer.stopPolling();
        lzm_chatPollServer.removePropertyFromDataObject('p_de_a');
        lzm_chatPollServer.removePropertyFromDataObject('p_de_s');
        lzm_chatPollServer.emailAmount = 20;
        lzm_chatPollServer.startPolling();
    }
}

function deleteEmail() {
    var emailId = $('#email-placeholder').data('selected-email-id');
    var emailNo = $('#email-placeholder').data('selected-email');
    lzm_chatDisplay.emailDeletedArray.push(emailId);
    $('#email-list-line-' + emailNo).children('td:first').css('background-image', 'url(\'img/205-close16c.png\')');
    $('#reset-emails').removeClass('ui-disabled');
    $('#delete-email').addClass('ui-disabled');
    $('#create-ticket-from-email').addClass('ui-disabled');
    if ($('#email-list-line-' + (emailNo + 1)).length > 0) {
        $('#email-list-line-' + (emailNo + 1)).click();
    }
}

function saveEmailListChanges(emailId, assign) {
    var i, emailChanges = [], ticketsCreated = [], emailListObject = {};
    if (emailId != '') {
        var editorId = (assign) ? lzm_chatDisplay.myId : '';
        if (emailId instanceof Array) {
            for (i=0; i<emailId.length; i++) {
                emailChanges.push({id: emailId[i], status: '0', editor: editorId})
            }
        } else {
            emailChanges = [{
                id: emailId, status: '0', editor: editorId
            }];
        }
    } else {
        for (i=0; i<lzm_chatServerEvaluation.emails.length; i++) {
            emailListObject[lzm_chatServerEvaluation.emails[i].id] = lzm_chatServerEvaluation.emails[i];
        }

        for (i=0; i<lzm_chatDisplay.emailDeletedArray.length; i++) {
            emailChanges.push({id: lzm_chatDisplay.emailDeletedArray[i], status: '1', editor: ''})
        }

        for (i=0; i<lzm_chatDisplay.ticketsFromEmails.length; i++) {
            var thisEmail = emailListObject[lzm_chatDisplay.ticketsFromEmails[i]['email-id']];
            emailChanges.push({id: thisEmail.id, status: '1', editor: ''});
            ticketsCreated.push({
                name: thisEmail.n,
                email: thisEmail.e,
                subject: thisEmail.s,
                //text: thisEmail.text,
                text: lzm_chatDisplay.ticketsFromEmails[i].message,
                group: lzm_chatDisplay.ticketsFromEmails[i].group,
                cid: thisEmail.id,
                channel: lzm_chatDisplay.ticketsFromEmails[i].channel,
                company: lzm_chatDisplay.ticketsFromEmails[i].company,
                phone: lzm_chatDisplay.ticketsFromEmails[i].phone,
                language: lzm_chatDisplay.ticketsFromEmails[i].language,
                status: lzm_chatDisplay.ticketsFromEmails[i].status,
                editor: (lzm_chatDisplay.ticketsFromEmails[i].editor != -1) ? lzm_chatDisplay.ticketsFromEmails[i].editor : '',
                attachment: thisEmail.attachment,
                comment: lzm_chatDisplay.ticketsFromEmails[i].comment,
                custom: lzm_chatDisplay.ticketsFromEmails[i].custom
            });
        }
    }
    lzm_chatUserActions.saveEmailChanges(emailChanges, ticketsCreated);
}

function pageArchiveList(page) {
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatPollServer.chatArchivePage = page;
    lzm_chatPollServer.chatUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function searchArchive(searchString) {
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    lzm_chatPollServer.chatArchiveQuery = searchString.replace(/^ +/, '').replace(/ +$/, '').toLowerCase();
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.chatUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function openArchiveFilterMenu(e, filter) {
    filter = (filter != '') ? filter : lzm_chatPollServer.chatArchiveFilter;
    e.stopPropagation();
    if (lzm_chatDisplay.showArchiveFilterMenu) {
        removeArchiveFilterMenu();
    } else {
        var parentOffset = $('#archive-filter').offset();
        var xValue = parentOffset.left;
        var yValue = parentOffset.top + 24;
        lzm_chatDisplay.showArchiveFilterMenu = true;
        lzm_chatDisplay.showContextMenu('archive-filter', {filter: filter}, xValue, yValue);
        e.preventDefault();
    }
}

function showArchivedChat(cpId, cpName, chatId, chatType) {
    if (chatType == 1) {
        showVisitorInfo(cpId, cpName, chatId, 4);
    } else {
        var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
        lzm_chatPollServer.stopPolling();
        window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
            limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
            filter: lzm_chatPollServer.chatArchiveFilter};
        lzm_chatPollServer.chatArchivePage = 1;
        lzm_chatPollServer.chatArchiveLimit = 1000;
        lzm_chatPollServer.chatArchiveQuery = '';
        lzm_chatPollServer.chatArchiveFilter = '';
        if (chatType == 0) {
            lzm_chatPollServer.chatArchiveFilterInternal = cpId
        } else {
            lzm_chatPollServer.chatArchiveFilterGroup = cpId
        }
        lzm_chatPollServer.chatUpdateTimestamp = 0;
        lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
        lzm_chatDisplay.showArchivedChat(lzm_chatServerEvaluation.chatArchive.chats, cpId, cpName, chatId, chatType,
            lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments);
        switchArchivePresentation(chatFetchTime, 0);
        lzm_chatPollServer.startPolling();
    }
}

function selectArchivedChat(chatId, inDialog) {
    $('.archive-list-line').removeClass('selected-table-line');
    $('#dialog-archive-list-line-' + chatId).addClass('selected-table-line');
    $('#archive-list-line-' + chatId).addClass('selected-table-line');
    if (inDialog) {
        $('#matching-chats-table').data('selected-chat-id', chatId);
        var thisChat = {};
        for (var i=0; i<lzm_chatServerEvaluation.chatArchive.chats.length; i++) {
            if (lzm_chatServerEvaluation.chatArchive.chats[i].cid == chatId) {
                thisChat = lzm_chatServerEvaluation.chatArchive.chats[i];
            }
        }
        var chatHtml;
        try {
            chatHtml = '<legend>' + t('Text') + '</legend>' +
                '<div style="margin-top: -10px; margin-left: -10px;">' + thisChat.chtml.replace(/\.\/images\//g, 'img/') + '</div>';
        } catch(e) {
            chatHtml = '<legend>' + t('Text') + '</legend>';
        }
        if (chatId != '') {
            $('#create-ticket-from-chat').removeClass('ui-disabled');
        }
        $('#chat-content-inner').html(chatHtml);
    }
}

function removeArchiveFilterMenu() {
    lzm_chatDisplay.showArchiveFilterMenu = false;
    $('#archive-filter-context').remove();
}

function toggleArchiveFilter(filter, e) {
    e.stopPropagation();
    $('.archive-list-page-button').addClass('ui-disabled');
    lzm_chatPollServer.stopPolling();
    var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
    removeArchiveFilterMenu();
    var filterList = lzm_chatPollServer.chatArchiveFilter.split('');
    if ($.inArray(filter.toString(), filterList) != -1) {
        var pattern = new RegExp(filter.toString());
        lzm_chatPollServer.chatArchiveFilter = lzm_chatPollServer.chatArchiveFilter.replace(pattern, '');
    } else {
        filterList.push(filter);
        filterList.sort();
        lzm_chatPollServer.chatArchiveFilter = filterList.join('');
    }
    if (lzm_chatPollServer.chatArchiveFilter == '') {
        lzm_chatPollServer.chatArchiveFilter = '012';
    }
    lzm_chatPollServer.chatArchivePage = 1;
    lzm_chatPollServer.chatUpdateTimestamp = 0;
    lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
    lzm_chatPollServer.startPolling();
    switchArchivePresentation(archiveFetchTime, 0);
}

function switchArchivePresentation(archiveFetchTime, counter) {
    //console.log(ticketFetchTime, counter, ticketId);
    var loadingHtml, myWidth, myHeight;
    if (counter == 0) {
        if ($('#matching-chats-table').length == 0) {
            loadingHtml = '<div id="archive-loading"></div>';
            $('#archive-body').append(loadingHtml).trigger('create');
            myWidth = $('#archive-body').width() + 10;
            myHeight = $('#archive-body').height() + 10;
            $('#archive-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        } else {
            loadingHtml = '<div id="matching-archive-loading"></div>';
            $('#visitor-info-placeholder-content-4').append(loadingHtml).trigger('create');
            myWidth = $('#visitor-info-placeholder-content-4').width() + 28;
            myHeight = $('#visitor-info-placeholder-content-4').height() + 48;
            $('#matching-archive-loading').css({position: 'absolute', left: '0px', top: '0px', width: myWidth+'px', height: myHeight+'px',
                'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
                'background-position': 'center', 'z-index': 1000, opacity: 0.85});
        }
    }
    if (archiveFetchTime != lzm_chatServerEvaluation.archiveFetchTime || counter >= 40) {
        if ($('#matching-chats-table').length == 0) {
            lzm_chatDisplay.createArchive(lzm_chatServerEvaluation.chatArchive, lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments,
                lzm_chatServerEvaluation.external_users);
            $('#archive-loading').remove();
        } else {
            $('#matching-archive-loading').remove();
            selectArchivedChat($('#matching-chats-table').data('selected-chat-id'), true);
        }
    } else {
        counter++;
        var delay = (counter <= 5) ? 200 : (counter <= 11) ? 500 : (counter <= 21) ? 1000 : 2000;
        setTimeout(function() {switchArchivePresentation(archiveFetchTime, counter);}, delay);
    }
}

function openVisitorListContextMenu(e, visitorId, isChatting, wasDeclined, invitationStatus) {
    e.stopPropagation();
    $('.visitor-list-line').removeClass('selected-table-line');
    $('#visitor-list-row-' + visitorId).addClass('selected-table-line');
    var visitor = {};
    for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
        if (lzm_chatServerEvaluation.external_users[i].id == visitorId) {
            visitor = lzm_chatServerEvaluation.external_users[i];
        }
    }
    var invitationLogo = (invitationStatus == 'requested') ? 'img/632-skills_not.png' : 'img/632-skills.png';
    if (lzm_chatDisplay.showVisitorListContextMenu) {
        removeVisitorListContextMenu();
    } else {
        var scrolledDownY = $('#visitor-list-table-div').scrollTop();
        var scrolledDownX = $('#visitor-list-table-div').scrollLeft();
        var parentOffset = $('#visitor-list-table-div').offset();
        var yValue = e.pageY - parentOffset.top + scrolledDownY;
        var xValue = e.pageX - parentOffset.left + scrolledDownX;
        lzm_chatDisplay.showVisitorListContextMenu = true;
        lzm_chatDisplay.showContextMenu('visitor-list-table-div', {visitor: visitor, chatting: isChatting, declined: wasDeclined, status: invitationStatus, logo: invitationLogo}, xValue, yValue);
    }
    e.preventDefault();
}

function removeVisitorListContextMenu() {
    lzm_chatDisplay.showVisitorListContextMenu = false;
    $('#visitor-list-table-div-context').remove();
}

function addLeftMessageToChat(chat_reco, visitorName) {
    var new_chat = {};
    new_chat.id = md5(String(Math.random())).substr(0, 32);
    new_chat.rp = '';
    new_chat.sen = '0000000';
    new_chat.rec = '';
    new_chat.reco = chat_reco;
    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
    lzm_chatServerEvaluation.chatMessageCounter++;
    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
    new_chat.text = t('<!--vis_name--> has left the chat.',[['<!--vis_name-->', visitorName]]);
    lzm_chatServerEvaluation.chats.push(new_chat);
}

function addOpLeftMessageToChat(chat_reco, members, newIdList) {
    //console.log(chatPartners);
    for (var i=0; i<members.length; i++) {
        if (members[i].id != lzm_chatServerEvaluation.myId && members[i].st != 0 &&
            (typeof lzm_chatServerEvaluation.chatObject[chat_reco].accepted == 'undefined' || !lzm_chatServerEvaluation.chatObject[chat_reco].accepted) &&
            $.inArray(members[i].id, newIdList) == -1) {
            for (var k=0; k<lzm_chatServerEvaluation.internal_users.length; k++) {
                if (lzm_chatServerEvaluation.internal_users[k].id == members[i].id) {
                    var new_chat = {};
                    new_chat.id = md5(String(Math.random())).substr(0, 32);
                    new_chat.rp = '';
                    new_chat.sen = '0000000';
                    new_chat.rec = '';
                    new_chat.reco = chat_reco;
                    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                    lzm_chatServerEvaluation.chatMessageCounter++;
                    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                    new_chat.text = t('<!--this_op_name--> has left the chat.', [['<!--this_op_name-->', lzm_chatServerEvaluation.internal_users[k].name]]);
                    lzm_chatServerEvaluation.chats.push(new_chat);
                }
            }
        }
    }
    lzm_chatServerEvaluation.setChatAccepted(chat_reco, true);
}

function addDeclinedMessageToChat(id, b_id, chatPartners) {
    //console.log(chatPartners);
    for (var i=0; i<chatPartners.past.length; i++) {
        if ($.inArray(chatPartners.past[i], chatPartners.present) == -1) {
            for (var k=0; k<lzm_chatServerEvaluation.internal_users.length; k++) {
                if (lzm_chatServerEvaluation.internal_users[k].id == chatPartners.past[i]) {
                    var new_chat = {};
                    new_chat.id = md5(String(Math.random())).substr(0, 32);
                    new_chat.rp = '';
                    new_chat.sen = '0000000';
                    new_chat.rec = '';
                    new_chat.reco = id + '~' + b_id;
                    var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
                    new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
                    new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
                    lzm_chatServerEvaluation.chatMessageCounter++;
                    new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
                    new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
                    new_chat.text = t('<!--this_op_name--> has declined the chat.', [['<!--this_op_name-->', lzm_chatServerEvaluation.internal_users[k].name]]);
                    lzm_chatServerEvaluation.chats.push(new_chat);
                }
            }
        }
    }
}

function removeFromOpenChats(chat, deleteFromChat, resetActiveChat, member, caller) {
    var i, new_chat;

    var inChatWith = '';
    for (i=0; i<member.length; i++) {
        if (member[i].st == 0) {
            inChatWith = member[i].id;
        }
    }
    if (inChatWith != '' && inChatWith != lzm_chatServerEvaluation.myId && lzm_chatServerEvaluation.chatObject[chat].status != 'left') {
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
        //console.log(inChatWith + ' --- ' + lzm_chatServerEvaluation.chatObject[chat].status);
        var opName = t('Another operator');
        for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
            if (lzm_chatServerEvaluation.internal_users[i].id == inChatWith) {
                opName = lzm_chatServerEvaluation.internal_users[i].name;
                break;
            }
        }
        new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = chat;
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_op_name--> has accepted the chat.', [['<!--this_op_name-->',opName]]);
        lzm_chatServerEvaluation.chats.push(new_chat);
        new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = chat;
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_op_name--> has left the chat.', [['<!--this_op_name-->', lzm_chatServerEvaluation.myName]]);
        lzm_chatServerEvaluation.chats.push(new_chat);
    }
    if (deleteFromChat) {
        lzm_chatServerEvaluation.chatObject[chat].status = 'left';
    }
    //console.log('Removing ' + chat + ' from open chats');
    var tmpOpenchats = [];
    for (i=0; i<lzm_chatDisplay.openChats.length; i++) {
        if (chat != lzm_chatDisplay.openChats[i]) {
            tmpOpenchats.push(lzm_chatDisplay.openChats[i]);
        }
    }
    lzm_chatDisplay.openChats = tmpOpenchats;
    lzm_chatUserActions.open_chats = tmpOpenchats;
    if (resetActiveChat) {
        if (lzm_chatDisplay.active_chat_reco == chat) {
            setTimeout(function() {
                lzm_chatUserActions.viewUserData(chat.split('~')[0], chat.split('~')[1], 0, true);
            }, 20);
        }
    }
}

function isVisitorNeededInGui(id) {
    var visitorIsNeeded = false;
    var visitorAlreadyInList = false;
    var removeVisitorFromList = false;
    for (var i=0; i<visitorsStillNeeded.length; i++) {
        if (visitorsStillNeeded[i].id == id) {
            visitorAlreadyInList = true;
            if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - visitorsStillNeeded[i].time < 120000) {
                visitorIsNeeded = true;
            } else {
                //console.log('Older then 120s');
                removeVisitorFromList = true;
            }
        }
    }
    if (!visitorAlreadyInList) {
        visitorIsNeeded = true;
        visitorsStillNeeded.push({id: id, time: lzm_chatTimeStamp.getServerTimeString(null, false, 1)});
    }
    //console.log('Check if visitor ' + id + ' has open chats...');

    for (var key in lzm_chatServerEvaluation.chatObject) {
        if (lzm_chatServerEvaluation.chatObject.hasOwnProperty(key)) {
            var openChatId = key.split('~')[0];
            //console.log(openChatId + ' == ' + id + '   ---   ' + $.inArray(key, lzm_chatDisplay.closedChats))
            if (openChatId == id && $.inArray(key, lzm_chatDisplay.closedChats) == -1) {
                visitorIsNeeded = true;
            }
        }
    }

    if (lzm_chatDisplay.ShowVisitorId == id) {
        visitorIsNeeded = true;
    }

    if (!visitorIsNeeded && removeVisitorFromList) {
        var tmpList = [];
        for (var j=0; j<visitorsStillNeeded.length; j++) {
            if (visitorsStillNeeded[j].id != id) {
                tmpList.push(visitorsStillNeeded[j]);
            }
        }
        visitorsStillNeeded = tmpList;
    }
    //console.log('Visitor is needed : ' + visitorIsNeeded);
    return visitorIsNeeded;
}

function markVisitorAsLeft(id, b_id) {
    if ($.inArray(lzm_chatServerEvaluation.chatObject[id + '~' + b_id].status, ['left','declined']) == -1) {
        //console.log('Visitor ' + id + '~' + b_id + ' has left!');
        var visitorName = '';
        for (var k=0; k<lzm_chatServerEvaluation.external_users.length; k++) {
            if (lzm_chatServerEvaluation.external_users[k].id == id) {
                for (var l=0; l<lzm_chatServerEvaluation.external_users[k].b.length; l++) {
                    if (lzm_chatServerEvaluation.external_users[k].b[l].id == b_id) {
                        visitorName = (lzm_chatServerEvaluation.external_users[k].b[l].cname != '') ?
                            lzm_chatServerEvaluation.external_users[k].b[l].cname :
                            lzm_chatServerEvaluation.external_users[k].unique_name;
                        break;
                    }
                }
                break;
            }
        }
        addLeftMessageToChat(id + '~' + b_id, lzm_commonTools.htmlEntities(visitorName));
    }
    lzm_chatServerEvaluation.chatObject[id + '~' + b_id].status = 'left';
    if (lzm_chatDisplay.active_chat_reco == id + '~' + b_id) {
        removeFromOpenChats(id + '~' + b_id, false, true, [], 'markVisitorAsLeft');
    }
}

function markVisitorAsBack(id, b_id, chat_id, member) {
    var chatIsMine = false;
    for (var j=0; j<member.length; j++) {
        if (member[j].id == lzm_chatServerEvaluation.myId) {
            chatIsMine = true;
            break;
        }
    }
    if (chatIsMine) {
        removeFromOpenChats(id + '~' + b_id, false, true, member, 'markVisitorAsBack');
        addChatInfoBlock(id, b_id);
        lzm_chatServerEvaluation.chatObject[id + '~' + b_id].status = 'new';
        //logit(lzm_chatServerEvaluation.chatObject[id + '~' + b_id]);

        var tmpClosedChats = [];
        for (var i=0; i<lzm_chatDisplay.closedChats.length; i++) {
            if (lzm_chatDisplay.closedChats[i] != id + '~' + b_id) {
                tmpClosedChats.push(lzm_chatDisplay.closedChats[i]);
            }
        }
        lzm_chatDisplay.closedChats = tmpClosedChats;

        var visitorName = '';
        for (var k=0; k<lzm_chatServerEvaluation.external_users.length; k++) {
            if (lzm_chatServerEvaluation.external_users[k].id == id) {
                for (var l=0; l<lzm_chatServerEvaluation.external_users[k].b.length; l++) {
                    if (lzm_chatServerEvaluation.external_users[k].b[l].id == b_id) {
                        visitorName = (lzm_chatServerEvaluation.external_users[k].b[l].cname != '') ?
                            lzm_chatServerEvaluation.external_users[k].b[l].cname :
                            lzm_chatServerEvaluation.external_users[k].unique_name;
                        break;
                    }
                }
                break;
            }
        }

        var new_chat = {};
        new_chat.id = md5(String(Math.random())).substr(0, 32);
        new_chat.rp = '';
        new_chat.sen = '0000000';
        new_chat.rec = '';
        new_chat.reco = id + '~' + b_id;
        var tmpdate = lzm_chatTimeStamp.getLocalTimeObject();
        new_chat.date = lzm_chatTimeStamp.getServerTimeString(tmpdate, true);
        new_chat.cmc = lzm_chatServerEvaluation.chatMessageCounter;
        lzm_chatServerEvaluation.chatMessageCounter++;
        new_chat.date_human = lzm_commonTools.getHumanDate(tmpdate, 'date', lzm_chatDisplay.userLanguage);
        new_chat.time_human = lzm_commonTools.getHumanDate(tmpdate, 'time', lzm_chatDisplay.userLanguage);
        new_chat.text = t('<!--this_vis_name--> is in chat with <!--this_op_name-->', [['<!--this_vis_name-->', lzm_commonTools.htmlEntities(visitorName)],['<!--this_op_name-->', lzm_chatServerEvaluation.myName]]);
        lzm_chatServerEvaluation.chats.push(new_chat);

        lzm_chatServerEvaluation.browserChatIdList.push(chat_id);
    } else {
        if (lzm_chatServerEvaluation.chatObject[id + '~' + b_id].status != 'left') {
            markVisitorAsLeft(id, b_id);
        }
    }
}

function handleVisitorCommentClick(selectedLine) {
    var thisUser = $('#visitor-information').data('visitor');
    var commentText = thisUser.c[selectedLine].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />');
    $('#visitor-comment-list').data('selected-row', selectedLine);
    $('.visitor-comment-line').removeClass('selected-table-line');
    $('#visitor-comment-line-' + selectedLine).addClass('selected-table-line');
    $('#visitor-comment-text').html('<legend>' + t('Comment') + '</legend>' + commentText);
}

function addChatInfoBlock(id, b_id) {
    if (b_id != '') {
        //console.log('********** Add chat info block **********');
        for (var i=0; i<lzm_chatServerEvaluation.external_users.length; i++) {
            if (lzm_chatServerEvaluation.external_users[i].id == id) {
                for (var j=0; j<lzm_chatServerEvaluation.external_users[i].b.length; j++) {
                    if (lzm_chatServerEvaluation.external_users[i].b[j].id == b_id) {
                        if (typeof lzm_chatServerEvaluation.external_users[i].b[j].chat != 'undefined') {
                            //console.log(lzm_chatServerEvaluation.external_users[i].b[j].chat);
                            var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(lzm_chatServerEvaluation.external_users[i].b[j].chat.f * 1000, true);

                            var tUoperators = '';
                            for (var intUserIndex=0; intUserIndex<lzm_chatServerEvaluation.internal_users.length; intUserIndex++) {
                                if (typeof lzm_chatServerEvaluation.external_users[i].b[j].chat != 'undefined' && typeof lzm_chatServerEvaluation.external_users[i].b[j].chat.pn != 'undefined' &&
                                    typeof lzm_chatServerEvaluation.external_users[i].b[j].chat.pn.memberIdList != 'undefined' &&
                                    $.inArray(lzm_chatServerEvaluation.internal_users[intUserIndex].id, lzm_chatServerEvaluation.external_users[i].b[j].chat.pn.memberIdList) != -1) {
                                    tUoperators +=  lzm_chatServerEvaluation.internal_users[intUserIndex].name + ', ';
                                }
                            }
                            tUoperators = tUoperators.replace(/, *$/,'');
                            var name = (lzm_chatServerEvaluation.external_users[i].b[j].cname != '') ?
                                lzm_chatServerEvaluation.external_users[i].b[j].cname :
                                lzm_chatServerEvaluation.external_users[i].unique_name;
                            var customFields = '';
                            for (var key in lzm_chatServerEvaluation.external_users[i].b[j].chat.cf) {
                                if (lzm_chatServerEvaluation.external_users[i].b[j].chat.cf.hasOwnProperty(key)) {
                                    var inputText = (lzm_chatServerEvaluation.inputList.getCustomInput(key).type != 'CheckBox') ?
                                        lzm_commonTools.htmlEntities(lzm_chatServerEvaluation.external_users[i].b[j].chat.cf[key]) :
                                        (lzm_chatServerEvaluation.external_users[i].b[j].chat.cf[key] == 1) ? t('Yes') : t('No');
                                    customFields += '<tr><td>' + lzm_chatServerEvaluation.inputList.getCustomInput(key).name + '</td>' +
                                        '<td>' + inputText + '</td></tr>';
                                }
                            }

                            var new_chat = {
                                date: lzm_chatServerEvaluation.external_users[i].b[j].chat.f,
                                cmc: lzm_chatServerEvaluation.chatMessageCounter,
                                id : md5(String(Math.random())).substr(0, 32),
                                rec: id + '~' + b_id,
                                reco: lzm_chatDisplay.myId,
                                rp: '0',
                                sen: id + '~' + b_id,
                                sen_id: id,
                                sen_b_id: b_id,
                                text: '',
                                date_human: lzm_commonTools.getHumanDate(tmpDate, 'date', lzm_chatDisplay.userLanguage),
                                time_human: lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage),
                                info_header: {
                                    group: lzm_chatServerEvaluation.external_users[i].b[j].chat.gr,
                                    operators: tUoperators,
                                    name: name,
                                    mail: lzm_chatServerEvaluation.external_users[i].b[j].cemail,
                                    company: lzm_chatServerEvaluation.external_users[i].b[j].ccompany,
                                    phone: lzm_chatServerEvaluation.external_users[i].b[j].cphone,
                                    question: lzm_chatServerEvaluation.external_users[i].b[j].chat.eq,
                                    chat_id: lzm_chatServerEvaluation.external_users[i].b[j].chat.id,
                                    cf: customFields
                                }
                            }
                            lzm_chatServerEvaluation.chatMessageCounter++;
                        }
                        break;
                    }
                }
                break;
            }
        }
        //console.log(new_chat);
        lzm_chatServerEvaluation.chats.push(new_chat);
        lzm_chatServerEvaluation.chats.sort(function(a,b) {
            var rt = 0;
            if (a.date > b.date) {
                rt = 1;
            } else if (a.date < b.date) {
                rt = -1
            } else if (typeof a.info_header != 'undefined') {
                rt = -1;
            } else if (typeof b.info_header != 'undefined') {
                rt = 1;
            }
            return rt;
        });
    }
}

function isAutoAcceptActive () {
    if (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'must_auto_accept', {}) ||
       (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'can_auto_accept', {}) && lzm_chatDisplay.autoAcceptChecked == 1)) {
        return true;
    } else {
        return false;
    }
}

function playIncomingMessageSound(sender, receivingChat, chatId, text) {
    //console.log(sender + ' --- ' + receivingChat);
    receivingChat = (typeof receivingChat != 'undefined' && receivingChat != '') ? receivingChat : sender;
    lzm_chatDisplay.lastChatSendingNotification = receivingChat;
    chatId = (typeof chatId != 'undefined') ? chatId : '';
    text = (typeof text != 'undefined') ? text : '';
    if (lzm_chatDisplay.playNewMessageSound == 1 &&
        ($.inArray(sender, lzm_chatDisplay.openChats) != -1 || sender.indexOf('~') == -1 || lzm_chatDisplay.playNewChatSound != 1 )) {
        lzm_chatDisplay.playSound('message', sender, text);
    }


        var notificationSound;
        if (lzm_chatDisplay.playNewMessageSound != 1) {
            notificationSound = 'DEFAULT'
        } else {
            notificationSound = 'NONE'
        }
        text = (typeof text != 'undefined') ? text : '';
        var visitors = lzm_chatServerEvaluation.external_users;
        var operators = lzm_chatServerEvaluation.internal_users;
        var i, senderId, senderBid, senderName = t('Visitor');
        if (sender.indexOf('~') != -1) {
            senderId = sender.split('~')[0];
            senderBid = sender.split('~')[1];
            for (i=0; i<visitors.length; i++) {
                if (visitors[i].id == senderId) {
                    for (var j=0; j<visitors[i].b.length; j++) {
                        if (visitors[i].b[j].id == senderBid) {
                            //console.log(visitors[i].b[j]);
                            senderName = (typeof visitors[i].b[j].cname != 'undefined' && visitors[i].b[j].cname != '') ? visitors[i].b[j].cname : visitors[i].unique_name;
                        }
                    }
                    break;
                }
            }
        } else {
            senderId = sender;
            for (i=0; i<operators.length; i++) {
                if (operators[i].id == senderId) {
                    senderName = operators[i].name;
                }
            }
        }
        text = text.replace(/<.*?>/g,'').replace(/<\/.*?>/g,'');
        //console.log(senderName);
        var notificationText = t('<!--sender-->: <!--text-->',[['<!--sender-->',senderName],['<!--text-->',text]]).substr(0, 250);
        //console.log(notificationText);
    if (typeof lzm_deviceInterface != 'undefined') {
        try {
            lzm_deviceInterface.showNotification(t('LiveZilla'), notificationText, notificationSound, sender, receivingChat);
        } catch(ex) {
            console.log('Error while showing notification');
        }
    }
    if (lzm_chatDisplay.selected_view != 'mychats' || $('.dialog-window-container').length > 0) {
        if (sender.indexOf('~') == -1 ||
            ((typeof lzm_chatServerEvaluation.chatObject[sender] != 'undefined' && lzm_chatServerEvaluation.chatObject[sender].accepted) ||
                isAutoAcceptActive())) {
            lzm_displayHelper.showBrowserNotification({
                text: notificationText,
                subject: t('New Chat Message'),
                action: 'openChatFromNotification(\'' + receivingChat + '\'); closeOrMinimizeDialog();',
                timeout: 5
            });
        }
    }
}

function closeOrMinimizeDialog() {
    $('#minimize-dialog').click();
    $('#close-dialog').click()
}

function openChatFromNotification(chatPartner, type) {
    type = (typeof type != 'undefined') ? type : '';
    lzm_chatDisplay.selected_view = 'mychats';
    lzm_chatDisplay.toggleVisibility();
    lzm_chatDisplay.createViewSelectPanel(lzm_chatDisplay.firstVisibleView);
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        lzm_chatDisplay.lastChatSendingNotification = chatPartner;
    }
    if (lzm_chatDisplay.lastChatSendingNotification != '') {
        openLastActiveChat('notification');
        //lzm_chatDisplay.lastChatSendingNotification = '';
    }
    if (type == 'push') {
        showAppIsSyncing();
    }
}

function leaveChat() {
    var leaveChat = false;
    removeEditor();
    if (lzm_chatDisplay.thisUser.b_id != '') {
        lzm_chatServerEvaluation.setChatAccepted(lzm_chatDisplay.active_chat_reco, false);
        var thisBId = lzm_chatDisplay.active_chat_reco.split('~')[1];
        for (var i=0; i<lzm_chatDisplay.thisUser.b.length; i++) {
            if (lzm_chatDisplay.thisUser.b[i].id == thisBId) {
                lzm_chatDisplay.thisUser.b_id = lzm_chatDisplay.thisUser.b[i].id;
                lzm_chatDisplay.thisUser.b_chat_id = lzm_chatDisplay.thisUser.b[i].chat.id;
                break;
            }
        }
        if (typeof lzm_chatServerEvaluation.chatObject[lzm_chatDisplay.active_chat_reco] != 'undefined') {
            if (lzm_chatServerEvaluation.chatObject[lzm_chatDisplay.active_chat_reco].status == 'declined') {
                //console.log('Declined chat ' + lzm_chatDisplay.active_chat_reco);
                lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
                lzm_chatUserActions.setActiveChat('', '', '', { id:'', b_id:'', b_chat:{ id:'' } });
                //lzm_chatServerEvaluation.chatObject[lzm_chatDisplay.active_chat_reco].status = 'left';
                lzm_chatDisplay.createActiveChatPanel(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.internal_users,
                    lzm_chatServerEvaluation.internal_departments, lzm_chatServerEvaluation.chatObject, false);
                lzm_chatDisplay.createHtmlContent(lzm_chatServerEvaluation.internal_departments, lzm_chatServerEvaluation.internal_users,
                    lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chats, lzm_chatServerEvaluation.chatObject,
                    lzm_chatDisplay.thisUser, lzm_chatServerEvaluation.global_errors, lzm_chatServerEvaluation.chosen_profile,
                    lzm_chatDisplay.active_chat_reco);
                leaveChat = true;
            } else if (lzm_chatServerEvaluation.chatObject[lzm_chatDisplay.active_chat_reco].status == 'left' ||
                lzm_chatDisplay.thisUser.is_active == false ||
                confirm(t('Do you really want to close this Chat?'))) {
                lzm_chatDisplay.closedChats.push(lzm_chatDisplay.active_chat_reco);
                lzm_chatUserActions.leaveExternalChat(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.b_id, lzm_chatDisplay.thisUser.b_chat.id, 0);
                leaveChat = true;
            }
        }
    } else {
        lzm_chatUserActions.leaveInternalChat(lzm_chatDisplay.thisUser.id, lzm_chatDisplay.thisUser.userid, lzm_chatDisplay.thisUser.name);
        leaveChat = true;
    }

    if (leaveChat) {
        var senders = Object.keys(lzm_chatServerEvaluation.chatObject);
        var newActiveChat = '';
        for (var j=(senders.length - 1); j>=0; j--) {
            if ($.inArray(senders[j], lzm_chatDisplay.closedChats) == -1 && $.inArray(lzm_chatServerEvaluation.chatObject[senders[j]].status, ['left', 'declined']) == -1) {
                newActiveChat = senders[j];
                break;
            }
        }
        if (newActiveChat == '') {
            for (var k=(senders.length - 1); k>=0; k--) {
                if (lzm_chatServerEvaluation.chatObject[senders[k]].type == 'external' && $.inArray(senders[k], lzm_chatDisplay.closedChats) == -1) {
                    //console.log(senders[k]);
                    newActiveChat = senders[k];
                    break;
                }
            }
        }

        //console.log(newActiveChat);
        lzm_chatDisplay.lastActiveChat = newActiveChat;
        openLastActiveChat();
    }
}

function fillStringsFromTranslation() {
    if (loopCounter > 49 || lzm_t.translationArray.length != 0) {
        for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
            if (lzm_chatDisplay.viewSelectArray[i].id == 'mychats')
                lzm_chatDisplay.viewSelectArray[i].name = t('My Chats');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'tickets')
                lzm_chatDisplay.viewSelectArray[i].name = t('Tickets');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'external')
                lzm_chatDisplay.viewSelectArray[i].name = t('Visitors');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'archive')
                lzm_chatDisplay.viewSelectArray[i].name = t('Chat Archive');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'internal')
                lzm_chatDisplay.viewSelectArray[i].name = t('Operators');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'qrd')
                lzm_chatDisplay.viewSelectArray[i].name = t('Resources');
            if (lzm_chatDisplay.viewSelectArray[i].id == 'filter')
                lzm_chatDisplay.viewSelectArray[i].name = t('Filter');
        }
        lzm_chatDisplay.createViewSelectPanel();
    } else {
        loopCounter++;
        setTimeout(function() {fillStringsFromTranslation();}, 50);
    }
}

function switchCenterPage(target) {
    lzm_chatUserActions.saveChatInput(lzm_chatUserActions.active_chat_reco);
    if (target == 'home') {
        removeEditor();
    }
    lzm_chatUserActions.setActiveChat('', '', '', { id:'', b_id:'', b_chat:{ id:'' } });
    lzm_chatDisplay.lastActiveChat = '';
    lzm_chatDisplay.createActiveChatPanel(lzm_chatServerEvaluation.external_users,
        lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments,
        lzm_chatServerEvaluation.chatObject, false);
    lzm_chatDisplay.switchCenterPage(target);
}

function openLink(url) {
    //console.log(url);
    if (app == 1) {
        try {
            lzm_deviceInterface.openExternalBrowser(url);
        } catch(ex) {
            console.log('Opening device browser failed');
        }
    } else if (web == 1) {
        window.open(url, '_blank');
    }
}

function downloadFile(address) {
    if (app == 1) {
        try {
            lzm_deviceInterface.openFile(address);
        } catch(ex) {
            console.log('Downloading file in device failed');
        }
    } else if (web == 1) {
        window.open(address, '_blank');
    }
}

function tryNewLogin(logoutOtherInstance) {
    lzm_chatPollServer.stopPolling();
    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,lzm_chatPollServer.chosenProfile.server_url, logoutOtherInstance);
    //console.log('logging in again --- ' + logoutOtherInstance);
}

function initEditor(myText, caller) {
    if ((app == 1) || isMobile) {
        setEditorContents(myText)
    } else {
        lzm_chatInputEditor.init(myText, 'initEditor_' + caller);
    }
}

function removeEditor() {
    if ((app == 1) || isMobile) {
        // do nothing here
    } else {
        lzm_chatInputEditor.removeEditor();
     }
}

function setFocusToEditor() {
    //console.log('Focus set');
    if ((app == 1) || isMobile) {
        $('#chat-input').focus();
    }
}

function grabEditorContents() {
    if ((app == 1) || isMobile) {
        return $('#chat-input').val();
    } else {
        return lzm_chatInputEditor.grabHtml();
    }
}

function setEditorContents(myText) {
    if ((app == 1) || isMobile) {
        $('#chat-input').val(myText)
    } else {
        lzm_chatInputEditor.setHtml(myText)
    }
}

function clearEditorContents(os, browser) {
    if ((app == 1) || isMobile) {
        $('#chat-input').val('');
    } else {
        lzm_chatInputEditor.clearEditor(os, browser);
    }
}

function setEditorDisplay(myDisplay) {
    if ((app == 1) || isMobile) {
        $('#chat-input').css({display: myDisplay});
    } else {
        $('#chat-input-body').css({display: myDisplay});
    }
}

function moveCaretToEnd(el) {
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
        el.focus();
        var range = el.createTextRange();
        range.collapse(false);
        range.select();
    }
}

function minimizeDialogWindow(dialogId, windowId) {
    try {
        if (typeof lzm_chatDisplay.dialogData.editors != 'undefined') {
            for (var i=0; i<lzm_chatDisplay.dialogData.editors.length; i++) {
                if (typeof window[lzm_chatDisplay.dialogData.editors[i].instanceName] != 'undefined') {
                    lzm_chatDisplay.dialogData.editors[i].text = window[lzm_chatDisplay.dialogData.editors[i].instanceName].grabHtml();
                    window[lzm_chatDisplay.dialogData.editors[i].instanceName].removeEditor();
                }
            }
        }
    } catch(e) {}
    //console.log(lzm_chatDisplay.dialogData);
    var selectedView = (lzm_chatDisplay.dialogData['no-selected-view'] == true) ? '' : lzm_chatDisplay.selected_view;

    lzm_displayHelper.minimizeDialogWindow(dialogId, windowId, lzm_chatDisplay.dialogData, selectedView);
}

function maximizeDialogWindow(dialogId) {
    lzm_displayHelper.maximizeDialogWindow(dialogId);
}

function blinkPageTitle(message) {
    var doBlinkTitle = true, blinkStatus = 0;

    var blink = function() {
        if (doBlinkTitle) {
            var newTitle = (blinkStatus == 0)
                ? t('<!--site_name--> (<!--message-->)', [['<!--site_name-->',lzm_chatServerEvaluation.siteName], ['<!--message-->', message]])
                : lzm_chatServerEvaluation.siteName;
            $('title').html(newTitle);
            blinkStatus = 1 - blinkStatus;
            setTimeout(function() {
                blink()
            }, 5000);
        } else {
            $('title').html(lzm_chatServerEvaluation.siteName);
        }
    };

    blink();
    $(window).mousemove(function() {
        doBlinkTitle = false;
        blink();
    });
}

function debuggingShowDisplayHeight() {
    if ($(window).height() != debuggingDisplayHeight) {
        debuggingDisplayHeight = $(window).height();
        if (app == 1) {
            lzm_deviceInterface.showToast($(window).height());
        } else {
            console.log($(window).height());
        }
    }
}

function getCredentials() {
    var cookieName = 'lzm-credentials';
    var cookieValue = document.cookie;
    //console.log('Cookie value: ' + cookieValue);
    var cookieStart = (cookieValue.indexOf(" " + cookieName + "=") != -1) ? cookieValue.indexOf(" " + cookieName + "=") : cookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    //console.log('Cookie start: ' + cookieStart);
    if (cookieStart == -1) {
        cookieValue = {'login_name': '', 'login_passwd': ''};
    } else {
        cookieStart = cookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (cookieValue.indexOf(";", cookieStart) != -1) ? cookieValue.indexOf(";", cookieStart) : cookieValue.length;
        //console.log('Cookie end: ' + cookieEnd);
        cookieValue = cookieValue.substring(cookieStart,cookieEnd);
        cookieValue = {
            'login_name': lz_global_base64_url_decode(cookieValue.split('%7E')[0]),
            'login_passwd': cookieValue.split('%7E')[1]
        };
        //console.log(JSON.stringify(cookieValue));
    }

    chosenProfile.login_name = cookieValue.login_name;
    chosenProfile.login_passwd = cookieValue.login_passwd;

    // Call this twice for some unknown reason...
    deleteCredentials();
    deleteCredentials();

    //console.log(chosenProfile);
}

function deleteCredentials() {
    var cookieName = 'lzm-credentials';
    var completeCookieValue = document.cookie;
    var cookieStart = (completeCookieValue.indexOf(" " + cookieName + "=") != -1) ? completeCookieValue.indexOf(" " + cookieName + "=") : completeCookieValue.indexOf(cookieName + "=");
    var cookieEnd = 0;
    if (cookieStart == -1) {
        return false;
    } else {
        cookieStart = completeCookieValue.indexOf("=", cookieStart) + 1;
        cookieEnd = (completeCookieValue.indexOf(";", cookieStart) != -1) ? completeCookieValue.indexOf(";", cookieStart) : completeCookieValue.length;
        var cookieValue = completeCookieValue.substring(cookieStart,cookieEnd);
        var pattern = new RegExp(cookieName + '=' + cookieValue,'');
        completeCookieValue = completeCookieValue.replace(pattern, cookieName + '=0');
        document.cookie = completeCookieValue;

        return true;
    }
}

function handleContextMenuClick(e) {
    //console.log('Context menu click');
    e.stopPropagation();
}

function showNotMobileMessage() {
    alert(t('This functionality is not available on mobile devices.'));
}

function showNoPermissionMessage() {
    alert(t('You have no permission for this action. Permissions can be granted in the User Management panel (LiveZilla Server Admin)'));
}

function handleWindowResize(scrollDown) {
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(true);
    var thisChatProgress = $('#chat-progress');
    if (scrollDown) {
        setTimeout(function() {
            thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);
        }, 10);
    }
}

function setViewSelectPanel2ImagesAndText(newSelViewIndex) {
    if (views.length > 0) {
        newSelViewIndex = (typeof newSelViewIndex != 'undefined') ? newSelViewIndex : $('#radio-this-text').data('selected-view-index');
        setTimeout(function(){$('#radio-this-text span.ui-btn-text').text(views[newSelViewIndex].text);
            $('#radio-left-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
                'background-position': '-144px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
                'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '12px'});
            $('#radio-right-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
                'background-position': '-108px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
                'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '18px'});
        },5);
        $('#radio-this-text').data('selected-view-index', newSelViewIndex);
    }
}

function insertAtCursor(myField, myValue) {
    myField = document.getElementById(myField);
    //IE support
    if (document.selection) {
        myField.focus();
        var sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
    } else {
        myField.value += myValue;
    }
}

function selectView(id) {
    if (id != lzm_chatDisplay.selected_view) {
        lzm_chatUserActions.saveChatInput(lzm_chatUserActions.active_chat_reco);
        removeEditor();
        lzm_chatDisplay.selected_view = id;
        lzm_chatDisplay.createHtmlContent(lzm_chatServerEvaluation.internal_departments,
            lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.external_users,
            lzm_chatServerEvaluation.chats, lzm_chatServerEvaluation.chatObject,
            lzm_chatPollServer.thisUser, lzm_chatServerEvaluation.global_errors, lzm_chatPollServer.chosenProfile,
            lzm_chatDisplay.active_chat_reco);
        if (lzm_chatDisplay.selected_view == 'qrd') {
            lzm_chatDisplay.createQrdTree(lzm_chatServerEvaluation.resources, 'view-select-panel', lzm_chatDisplay.lastActiveChat,
            lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.internal_users,lzm_chatServerEvaluation.internal_departments);
        } else {
            cancelQrdPreview();
            $('#qrd-tree-body').remove();
            $('#qrd-tree-footline').remove();
        }
        if (lzm_chatDisplay.selected_view == 'tickets') {
            lzm_chatDisplay.createTicketList(lzm_chatServerEvaluation.tickets, lzm_chatServerEvaluation.ticketGlobalValues,
                lzm_chatPollServer.ticketPage, lzm_chatPollServer.ticketSort, lzm_chatPollServer.ticketQuery, lzm_chatPollServer.ticketFilter,
                lzm_chatServerEvaluation.internal_users, false);
        }
        if (lzm_chatDisplay.selected_view != 'mychats') {
            lzm_chatUserActions.setActiveChat('', '', '', { id:'', b_id:'', b_chat:{ id:'' } });
        }
        if (lzm_chatDisplay.selected_view == 'external' && !lzm_chatDisplay.VisitorListCreated && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.updateVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject,
                lzm_chatServerEvaluation.internal_users);
        }
        if (lzm_chatDisplay.selected_view == 'archive') {
            if ($('#chat-archive-table').length == 0) {
                lzm_chatDisplay.createArchive(lzm_chatServerEvaluation.chatArchive, lzm_chatServerEvaluation.internal_users,
                    lzm_chatServerEvaluation.internal_departments);
            } else {
                lzm_chatDisplay.updateArchive(lzm_chatServerEvaluation.chatArchive, lzm_chatServerEvaluation.internal_users,
                    lzm_chatServerEvaluation.internal_departments);
            }
        }
        finishSettingsDialogue();
        lzm_chatDisplay.toggleVisibility();
        if (lzm_chatDisplay.selected_view == 'mychats') {
            openLastActiveChat('panel');
        }
        if (lzm_chatDisplay.selected_view != 'external') {
            if (!mobile && app != 1) {
                delete messageEditor;
            }
            $('#chat-invitation-container').remove();
        }
        lzm_chatDisplay.createViewSelectPanel();
    }
}

function orderViewPanel(viewArray, selectedViewId) {
    var viewSelectArray = [], viewSelectObject = {}, i = 0;
    var showViewSelectPanel = {};
    for (i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
        viewSelectObject[lzm_chatDisplay.viewSelectArray[i].id] = lzm_chatDisplay.viewSelectArray[i].name;
        showViewSelectPanel[lzm_chatDisplay.viewSelectArray[i].id] =
            ($('#show-' + lzm_chatDisplay.viewSelectArray[i].id).prop('checked')) ? 1 : 0;
    }
    for (i=0; i<viewArray.length; i++) {
        viewSelectArray.push({id: viewArray[i], name : viewSelectObject[viewArray[i]]});
    }
    var settingsHtml = lzm_displayHelper.createViewSelectSettings(viewSelectArray, showViewSelectPanel);
    $('#view-select-settings').html(settingsHtml).trigger('create');

    var viewId = '';
    $('.show-view-div').click(function() {
        $('.show-view-div').removeClass('selected-panel-settings-line');
        $(this).addClass('selected-panel-settings-line');
        viewId = $(this).data('view-id');
        lzm_chatDisplay.togglePositionChangeButtons(viewId);
    });
    $('.position-change-buttons-up').click(function() {
        var myIndex = $.inArray(viewId, viewArray);
        if (myIndex != 0) {
            var replaceId = viewArray[myIndex - 1];
            for (var i=0; i<viewArray.length; i++) {
                viewArray[i] = (i == myIndex) ? replaceId : (i == myIndex - 1) ? viewId : viewArray[i];
            }
            orderViewPanel(viewArray, viewId);
        }
    });
    $('.position-change-buttons-down').click(function() {
        var myIndex = $.inArray(viewId, viewArray);
        if (myIndex != viewArray.length - 1) {
            var replaceId = viewArray[myIndex + 1];
            for (var i=0; i<viewArray.length; i++) {
                viewArray[i] = (i == myIndex) ? replaceId : (i == myIndex + 1) ? viewId : viewArray[i];
            }
            orderViewPanel(viewArray, viewId);
        }
    });
    $('#show-view-div-' + selectedViewId).click();
}

function moveViewSelectPanel(target) {
    if (target == 'left' || target == 'right') {
        try {
            for (var i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
                if (lzm_chatDisplay.firstVisibleView == lzm_chatDisplay.viewSelectArray[i].id) {
                    target = (target == 'left') ? lzm_chatDisplay.viewSelectArray[i - 1].id :
                        lzm_chatDisplay.viewSelectArray[i + 1].id;
                }
            }
        } catch(e) {}
    }
    lzm_chatDisplay.firstVisibleView = target;
    lzm_chatDisplay.createViewSelectPanel(target);
}

// Extend the standard regexp functionality
RegExp.escape = function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

function capitalize(myString) {
    myString = myString.replace(/^./, function (char) {
        return char.toUpperCase();
    });
    return myString;
}

function blockVisitorListUpdate() {
    setTimeout(function() {
        if (lzm_chatDisplay.visitorListScrollingWasBlocked && $('.dialog-window-container').length == 0) {
            lzm_chatDisplay.updateVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject, lzm_chatServerEvaluation.internal_users);
        }
    },2000);
}

/**
 * Some stuff done on load of the chat page
 */
$(document).ready(function () {
    lzm_displayHelper = new ChatDisplayHelperClass();
    lzm_displayLayout = new ChatDisplayLayoutClass();
    //console.log('New resolution : ' + $(window).width() + 'x' + $(window).height());
    //alert('App : ' + (app == 1));
    //alert('Mobile : ' + isMobile);
    getCredentials();
    lzm_displayHelper.blockUi({message: null});

    // initiate lzm class objects
    if ((app == 1) && typeof lzm_deviceInterface == 'undefined') {
        lzm_deviceInterface = new CommonDeviceInterfaceClass();
    }
    if (app == 1) {
        var tmpDeviceId = lzm_deviceInterface.loadDeviceId();
        if (tmpDeviceId != 0) {
            deviceId = tmpDeviceId;
        }
    }
    if (app == 1 || isMobile) {
        var chatInputTextArea = document.getElementById("chat-input");
        chatInputTextArea.onfocus = function() {
            moveCaretToEnd(chatInputTextArea);
            // Work around Chrome's little problem
            window.setTimeout(function() {
                moveCaretToEnd(chatInputTextArea);
            }, 1);
        };
    }
    lzm_commonConfig = new CommonConfigClass();
    lzm_commonTools = new CommonToolsClass();
    lzm_commonPermissions = new CommonPermissionClass();
    lzm_commonStorage = new CommonStorageClass(localDbPrefix, (app == 1));
    lzm_chatTimeStamp = new ChatTimestampClass(0);
    var userConfigData = {
        userVolume: chosenProfile.user_volume,
        awayAfter: (typeof chosenProfile.user_away_after != 'undefined') ? chosenProfile.user_away_after : 0,
        playIncomingMessageSound: (typeof chosenProfile.play_incoming_message_sound != 'undefined') ? chosenProfile.play_incoming_message_sound : 0,
        playIncomingChatSound: (typeof chosenProfile.play_incoming_chat_sound != 'undefined') ? chosenProfile.play_incoming_chat_sound : 0,
        repeatIncomingChatSound: (typeof chosenProfile.repeat_incoming_chat_sound != 'undefined') ? chosenProfile.repeat_incoming_chat_sound : 0,
        playIncomingTicketSound: (typeof chosenProfile.play_incoming_ticket_sound != 'undefined') ? chosenProfile.play_incoming_ticket_sound : 0,
        language: (typeof chosenProfile.language != 'undefined') ? chosenProfile.language : 'en',
        backgroundMode: (typeof chosenProfile.background_mode != 'undefined') ? chosenProfile.background_mode : 1
    };
    lzm_chatInputEditor = new ChatEditorClass('chat-input', isMobile, (app == 1), (web == 1));
    lzm_chatDisplay = new ChatDisplayClass(lzm_chatTimeStamp.getServerTimeString(), lzm_commonConfig, lzm_commonTools,
        lzm_chatInputEditor, (web == 1), (app == 1), isMobile, messageTemplates, userConfigData, multiServerId);
    lzm_chatServerEvaluation = new ChatServerEvaluationClass(lzm_commonTools, chosenProfile, lzm_chatTimeStamp);
    lzm_chatPollServer = new ChatPollServerClass(lzm_commonConfig, lzm_commonTools, lzm_chatDisplay,
        lzm_chatServerEvaluation, lzm_commonStorage, chosenProfile, userStatus, web, app, isMobile, multiServerId);
    lzm_t = new CommonTranslationClass(chosenProfile.server_protocol, chosenProfile.server_url, chosenProfile.mobile_dir, false, chosenProfile.language);
    lzm_chatUserActions = new ChatUserActionsClass(lzm_commonTools, lzm_chatPollServer, lzm_chatDisplay,
        lzm_chatServerEvaluation, lzm_t, lzm_commonStorage, lzm_chatInputEditor, chosenProfile);
    lzm_chatServerEvaluation.userLanguage = lzm_t.language;
    lzm_chatDisplay.userLanguage = lzm_t.language;
    lzm_chatUserActions.userLanguage = lzm_t.language;

    if (lzm_chatDisplay.viewSelectArray.length == 0) {
        lzm_chatDisplay.viewSelectArray = [{id: 'mychats', name: t('My Chats')}, {id: 'tickets', name: t('Tickets')}, {id: 'external', name: t('Visitors')},
            {id: 'archive', name: t('Chat Archive')}, {id: 'internal', name: t('Operators')}, {id: 'qrd', name: t('Resources')}/*, {id: 'filter', name: t('Filter')}*/];
    }
    lzm_chatDisplay.createViewSelectPanel();
    lzm_chatDisplay.createChatWindowLayout(false);

    lzm_chatPollServer.pollServerlogin(lzm_chatPollServer.chosenProfile.server_protocol,
        lzm_chatPollServer.chosenProfile.server_url);

    createUserControlPanel();
    fillStringsFromTranslation();

    mobile = (isMobile) ? 1 : 0;
    $('#logo-page').attr('src', 'https://start.livezilla.net/startpage/en/?&product_version='+lzm_commonConfig.lz_version+'&web=1&app=' + app + '&mobile=' + mobile);
    //console.log(lzm_chatPollServer.chosenProfile.server_protocol);

    // do things on window resize
    $(window).resize(function () {
        //console.log('New resolution : ' + $(window).width() + 'x' + $(window).height());
        //debuggingShowDisplayHeight();
        setTimeout(function() {
            lzm_chatDisplay.createUserControlPanel(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
                lzm_chatServerEvaluation.myUserId);
            lzm_chatDisplay.createViewSelectPanel();
            lzm_chatDisplay.createChatWindowLayout(false);
            if (lzm_chatDisplay.selected_view == 'external') {
                lzm_chatDisplay.createVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject,
                    lzm_chatServerEvaluation.internal_users);
            }
            if (lzm_chatDisplay.selected_view == 'mychats') {
                lzm_chatDisplay.createActiveChatPanel(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.internal_users,
                    lzm_chatServerEvaluation.internal_departments, lzm_chatServerEvaluation.chatObject, false);
            }
            var resizeTimeout = (isMobile || (app == 1)) ? 100 : 100;
            setTimeout(function() {
                //console.log('Delayed resize');
                handleWindowResize(true);
                    setTimeout(function() {
                        //console.log('Second delayed resize');
                        handleWindowResize(true);
                    }, 500);
                if (isMobile || (app == 1)) {
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 2500);
                    setTimeout(function() {
                        handleWindowResize(false);
                    }, 10000);
                }
            }, resizeTimeout);
        }, 10);
    });

    $('.logout_btn').click(function () {
        logout(true);
    });

    $('#stop_polling').click(function () {
        stopPolling();
    });

    $('#userstatus-button').click(function (e) {
        e.stopPropagation();
        var thisUserstatusMenu = $('#userstatus-menu');
        if (lzm_chatDisplay.selected_view == 'mychats' && $('#chat-logo').css('display') == 'block') {
            //lzm_chatDisplay.switchCenterPage('anywhereButHome');
            lzm_chatDisplay.createOperatorList(lzm_chatServerEvaluation.internal_departments, lzm_chatServerEvaluation.internal_users,
                lzm_chatServerEvaluation.chatObject, lzm_chatServerEvaluation.chosen_profile);
        }
        if (lzm_chatDisplay.showUserstatusHtml == false) {
            lzm_chatDisplay.showUserstatusMenu(lzm_chatPollServer.user_status, lzm_chatServerEvaluation.myName,
                lzm_chatServerEvaluation.myUserId);
            thisUserstatusMenu.css({'display':'block'});
            lzm_chatDisplay.showUserstatusHtml = true;
        } else {
            thisUserstatusMenu.css({'display':'none'});
            lzm_chatDisplay.showUserstatusHtml = false;
        }
        if (!mobile && app != 1) {
            delete messageEditor;
        }
        $('#chat-invitation-container').remove();
    });

    $('#usersettings-button').click(function (e) {
        e.stopPropagation();
        var thisUsersettingsMenu = $('#usersettings-menu');
        if (lzm_chatDisplay.selected_view == 'mychats' && $('#chat-logo').css('display') == 'block') {
            //lzm_chatDisplay.switchCenterPage('anywhereButHome');
            lzm_chatDisplay.createOperatorList(lzm_chatServerEvaluation.internal_departments, lzm_chatServerEvaluation.internal_users,
                lzm_chatServerEvaluation.chatObject, lzm_chatServerEvaluation.chosen_profile);
        }
        if (lzm_chatDisplay.showUsersettingsHtml == false) {
            lzm_chatDisplay.showUsersettingsMenu();
            thisUsersettingsMenu.css({'display':'block'});
            lzm_chatDisplay.showUsersettingsHtml = true;
        } else {
            thisUsersettingsMenu.css({'display':'none'});
            lzm_chatDisplay.showUsersettingsHtml = false;
        }
        if (!mobile && app != 1) {
            delete messageEditor;
        }
        $('#chat-invitation-container').remove();
    });

    $('#wishlist-button').click(function() {
        openLink('http://wishlistmobile.livezilla.net/');
    });

    $('#blank-button').click(function() {
        if(debug) {
            debuggingStartStopPolling();
        }
        //alert($(window).width() + ' x ' + $(window).height());
    });

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });

    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });

    $('body').mouseover(function(){lzm_chatPollServer.wakeupFromAutoSleep();});

    $('body').click(function(e) {
        //console.log('Body clicked');
        //console.log(e);
        // Hide user settings menu
        $('#usersettings-menu').css({'display':'none'});
        lzm_chatDisplay.showUsersettingsHtml = false;
        // Hide user status menu
        $('#userstatus-menu').css({'display':'none'});
        lzm_chatDisplay.showUserstatusHtml = false;
        // Hide minimized dialogs menu
        lzm_displayHelper.showMinimizedDialogsMenu(true);
        // Remove all kinds of context menus
        removeTicketContextMenu();
        removeArchiveFilterMenu();
        removeQrdContextMenu();
        removeTicketMessageContextMenu();
        removeTicketFilterMenu();
        removeVisitorListContextMenu();
    });

    $('body').keyup(function(e) {
        //console.log(e);
        if ($('#email-list').length > 0 && (e.which == 46 || e.keyCode == 46)) {
            deleteEmail();
        }
        if ($('#ticket-list-body').length > 0 && $('.dialog-window-container').length == 0) {
            var newStatus = 0;
            var keyCode = (typeof e.which != 'undefined') ? e.which : e.keyCode;
            switch(keyCode) {
                case 79:
                    changeTicketStatus(0);
                    break;
                case 80:
                    changeTicketStatus(1);
                    break;
                case 67:
                    changeTicketStatus(2);
                    break;
                case 46:
                case 68:
                    changeTicketStatus(3, true);
                    break;
                case 40:
                    selectTicket('next');
                    break;
                case 38:
                    selectTicket('previous');
                    break;
            }
        }
    });

    $(window).on('beforeunload', function(){
        if (lzm_chatDisplay.askBeforeUnload)
            return t('Are you sure you want to leave or reload the client? You may lose data because of that.');
    });

});
