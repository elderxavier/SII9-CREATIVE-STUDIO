/****************************************************************************************
 * LiveZilla ChatDisplayHelperClass.js
 *
 * Copyright 2014 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

function ChatDisplayHelperClass() {
    this.browserName = '';
    this.browserVersion = '';
    this.browserMinorVersion = '';

    this.showBrowserNotificationTime = 0;
    this.showMinimizedDialogMenuButton = false;
}

ChatDisplayHelperClass.prototype.getMyObjectName = function() {
    for (var name in window) {
        //console.log(name);
        if (window[name] == this) {
            return name;
        }
    }
    return '';
};

/****************************************** Ticket and Email functions *****************************************/

ChatDisplayHelperClass.prototype.createTicketAttachmentTable = function(ticket, email, messageNumber, isNew) {
    var j, downloadUrl;
    var attachmentsHtml = '<table id="attachment-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%">' +
        '<thead><tr><th style=\'width: 18px !important;\'></th><th>' + t('File name') + '</th></tr></thead><tbody>';
    if (typeof ticket.messages != 'undefined') {
        for (j=0; j<ticket.messages[messageNumber].attachment.length; j++) {
            downloadUrl = getQrdDownloadUrl({
                ti: lzm_commonTools.htmlEntities(ticket.messages[messageNumber].attachment[j].n),
                rid: ticket.messages[messageNumber].attachment[j].id
            });
            if (isNew) {
                attachmentsHtml += '<tr id="attachment-line-' + j + '" class="attachment- lzm-unselectable" style="cursor:pointer;"' +
                    ' onclick="handleTicketAttachmentClick(' + j + ');">';
            } else {
                attachmentsHtml += '<tr class="lzm-unselectable">';
            }
            attachmentsHtml += '<td class="icon-column" style=\'background-image: url("img/622-paper_clip.png");' +
                ' background-repeat: no-repeat; background-position: center;\'></td><td' +
                ' style="color: #787878; text-decoration: underline; white-space: nowrap; cursor: pointer;"' +
                ' onclick="downloadFile(\'' + downloadUrl + '\');">' +
                lzm_commonTools.htmlEntities(ticket.messages[messageNumber].attachment[j].n) +
                '</td></tr>';
        }
    }
    if (email.id != '') {
        for (var l=0; l<email.attachment.length; l++) {
            downloadUrl = getQrdDownloadUrl({
                ti: lzm_commonTools.htmlEntities(email.attachment[l].n),
                rid: email.attachment[l].id
            });
            attachmentsHtml += '<tr class="lzm-unselectable">' +
                '<td class="icon-column" style=\'background-image: url("img/622-paper_clip.png");' +
                ' background-repeat: no-repeat; background-position: center;\'></td><td' +
                ' style="color: #787878; text-decoration: underline; white-space: nowrap; cursor: pointer;"' +
                ' onclick="downloadFile(\'' + downloadUrl + '\');">' +
                lzm_commonTools.htmlEntities(email.attachment[l].n) +
                '</td>' +
                '</tr>';
        }
    }
    attachmentsHtml += '</tbody></table>';
    if(isNew && email.id == '') {
        attachmentsHtml += '<div style="margin-top: 10px;">' +
            this.createButton('add-attachment', '', '', t('Add'), 'img/203-add.png', 'lr',
                {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Add Attachment')) +
            this.createButton('add-attachment-from-qrd', '', '', t('Add from resource'), 'img/607-cardfile.png', 'lr',
                {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Add Attachment from Resource')) +
            this.createButton('remove-attachment', 'ui-disabled', '', t('Remove'), 'img/201-delete2.png', 'lr',
                {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Remove Attachment')) +
            '</div>';
    }

    return attachmentsHtml;
};

ChatDisplayHelperClass.prototype.createTicketCommentTable = function(ticket, messageNumber, operatorObject, menuEntry) {
    menuEntry = (typeof menuEntry != 'undefined') ? menuEntry : '';
    var commentsHtml = '<table id="comment-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%">' +
        '<thead><tr><th style=\'width: 18px !important;\'></th><th>' + t('Date') + '</th><th>' + t('Operator') + '</th></tr></thead><tbody>';
    if (typeof ticket.messages != 'undefined' && typeof ticket.messages[messageNumber] != 'undefined') {
        for (var k=0; k<ticket.messages[messageNumber].comment.length; k++) {
            var thisComment = ticket.messages[messageNumber].comment[k];
            var commentTime = lzm_chatTimeStamp.getLocalTimeObject(thisComment.t * 1000, true);
            commentsHtml += '<tr id="comment-line-' + k + '" class="comment-line lzm-unselectable" style="cursor:pointer;"' +
                ' onclick="handleTicketCommentClick(' + k + ', \'' + thisComment.text + '\');">' +
                '<td class="icon-column" style=\'background-image: url("img/052-doc_user.png");' +
                ' background-repeat: no-repeat; background-position: center;\'></td>' +
                '<td>' + lzm_commonTools.getHumanDate(commentTime, '', lzm_chatDisplay.userLanguage) + '</td>' +
                '<td>' + operatorObject[thisComment.o].name + '</td>' +
                '</tr>';
        }
    }
    commentsHtml += '</tbody></table><div style="margin-top: 20px; margin-bottom: 10px; text-align: right;">' +
        this.createButton('add-comment', '', 'addComment(\'' + ticket.id + '\', \'' + menuEntry + '\')', t('Add'), '', 'lr',
            {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Add Comment')) + '</div>';

    return commentsHtml;
};

ChatDisplayHelperClass.prototype.createTicketMessageTable = function(ticket, email, messageNumber, isNew, operatorObject, chat) {
    chat = (typeof chat != 'undefined') ? chat : {cid: ''};
    var messageTableHtml = '<table id="ticket-history-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;" data-selected-message="' + messageNumber + '">';
    if (!isNew) {
        messageTableHtml += this.createTicketMessageList(ticket, operatorObject);
    } else if (chat.cid != '') {
        messageTableHtml += this.createTicketMessageList({id: ''}, operatorObject, chat);
    }
    messageTableHtml += '</table>';

    return messageTableHtml;
};

ChatDisplayHelperClass.prototype.createTicketDetails = function(ticketId, ticket, email, chat, disabledString, isNew,
                                                                operatorObject, selectedGroup, groups) {
    var disabledClass = '';
    var selectedString, selectedLanguage = '', availableLanguages = [];
    var detailsHtml = '<table id="ticket-details-inner" style="width: 400px;">';detailsHtml += '<tr>' +
        '<th><label for="ticket-details-id" style="font-size: 12px;">' + t('Ticket ID:') + '</label></th>' +
        '<td><div id="ticket-details-id" class="input-like">' + ticketId + '</div></td>' +
        '</tr>';
    detailsHtml += '<tr>' +
        '<th><label for="ticket-details-channel" style="font-size: 12px;">' + t('Channel:') + '</label></th>' +
        '<td><select id="ticket-details-channel" data-role="none"' + disabledString + '>';
    var channels = [t('Web'), t('Email'), t('Phone'), t('Misc'), t('Chat'), t('Rating')];
    for (var aChannel=0; aChannel<channels.length; aChannel++) {
        selectedString = (aChannel == ticket.t || (email.id != '' && aChannel == 1)) ? ' selected="selected"' :
            (chat.cid != '' && aChannel == 4) ? ' selected="selected"' : '';
        detailsHtml += '<option' + selectedString + ' value="' + aChannel + '">' + channels[aChannel] + '</option>';
    }
    detailsHtml += '</select></td>' +
        '</tr><tr>' +
        '<th><label for="ticket-details-status" style="font-size: 12px;">' + t('Status:') + '</label></th>';
    disabledClass = (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'change_ticket_status', {})) ? '' : ' class="ui-disabled"';
    detailsHtml += '<td><select id="ticket-details-status" data-role="none"' + disabledClass + '>';
    var states = [t('Open'), t('In Progress'), t('Closed'), t('Deleted')];
    for (var aState=0; aState<states.length; aState++) {
        selectedString = (typeof ticket.editor != 'undefined' && ticket.editor != false && aState == ticket.editor.st) ? ' selected="selected"' : '';
        detailsHtml += '<option' + selectedString + ' value="' + aState + '">' + states[aState] + '</option>';
    }
    detailsHtml += '</select></td>' +
        '</tr><tr>' +
        '<th><label for="ticket-details-group" style="font-size: 12px;">' + t('Group:') + '</label></th>';
    disabledClass = (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'assign_groups', {})) ? '' : ' class="ui-disabled"';
    detailsHtml += '<td><select id="ticket-details-group" data-role="none"' + disabledClass + '>';
    for (i=0; i<groups.length; i++) {
        selectedString = '';
        if (typeof ticket.editor != 'undefined' && ticket.editor != false) {
            if (groups[i].id == ticket.editor.g) {
                selectedString = ' selected="selected"';
                selectedGroup = groups[i];
                selectedLanguage = groups[i].pm[0].lang;
            }
        } else {
            if (typeof ticket.gr != 'undefined' && groups[i].id == ticket.gr) {
                selectedString = ' selected="selected"';
                selectedGroup = groups[i];
                selectedLanguage = groups[i].pm[0].lang;
            }
        }
        detailsHtml += '<option value="' + groups[i].id + '"' + selectedString + '>' + groups[i].name + '</option>';
    }
    detailsHtml += '</select></td>' +
        '</tr><tr>' +
        '<th><label for="ticket-details-editor" style="font-size: 12px;">' + t('Editor:') + '</label></th>';
    disabledClass = (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'assign_operators', {})) ? '' : ' class="ui-disabled"';
    detailsHtml += '<td><select id="ticket-details-editor" data-role="none"' + disabledClass + '>' +
        '<option value="-1">' + t('None') + '</option>';
    for (var op in operatorObject) {
        if (operatorObject.hasOwnProperty(op)) {
            if ($.inArray(selectedGroup.id, operatorObject[op].groups) != -1 && operatorObject[op].isbot != 1) {
                selectedString = (typeof ticket.editor != 'undefined' && ticket.editor != false && ticket.editor.ed == op) ? ' selected="selected"' : '';
                detailsHtml += '<option' + selectedString + ' value="' + op + '">' + operatorObject[op].name + '</option>';
            }
        }
    }
    detailsHtml += '</select></td>' +
        '</tr><tr>' +
        '<th><label for="ticket-details-language" style="font-size: 12px;">' + t('Language:') + '</label></th>' +
        '<td><select id="ticket-details-language" data-role="none">';
    for (var i=0; i<selectedGroup.pm.length; i++) {
        availableLanguages.push(selectedGroup.pm[i].lang);
        selectedString = '';
        if(typeof ticket.l != 'undefined' && selectedGroup.pm[i].lang == ticket.l)  {
            selectedString = ' selected="selected"';
            selectedLanguage = selectedGroup.pm[i].lang;
        }
        detailsHtml += '<option value="' + selectedGroup.pm[i].lang + '"' + selectedString + '>' + selectedGroup.pm[i].lang + '</option>';
    }
    if (typeof ticket.l != 'undefined' && $.inArray(ticket.l, availableLanguages) == -1) {
        detailsHtml += '<option value="' + ticket.l + '" selected="selected">' + ticket.l + '</option>';
        selectedLanguage = ticket.l;
    }
    detailsHtml += '</select></td>' +
        '</tr>' +
        '</table>';

    return {html: detailsHtml, language: selectedLanguage, group: selectedGroup}
};

ChatDisplayHelperClass.prototype.checkTicketDetailsChangePermission = function (ticket, changedValues) {
    var rtValue = true;
    if (typeof ticket.editor != 'undefined' && ticket.editor != false && ticket.editor.st != changedValues.status) {
        if ((!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_open', {}) && changedValues.status == 0) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_progress', {}) && changedValues.status == 1) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_closed', {}) && changedValues.status == 2) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_deleted', {}) && changedValues.status == 3)) {
            rtValue = false;
        }
    } else if ((typeof ticket.editor == 'undefined' || ticket.editor == false) && changedValues.status != 0) {
        if ((!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_progress', {}) && changedValues.status == 1) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_closed', {}) && changedValues.status == 2) ||
            (!lzm_commonPermissions.checkUserPermissions('', 'tickets', 'status_deleted', {}) && changedValues.status == 3)) {
            rtValue = false;
        }
    }
    return rtValue;
};

ChatDisplayHelperClass.prototype.createTicketMessageDetails = function(message, email, isNew, operatorObject, chat) {
    chat = (typeof chat != 'undefined') ? chat : {cid: ''};
    var myCustomInput, myInputText, myInputField, i, j;
    var detailsHtml = '<table id="message-details-inner" style="width: 400px;">';
    if (isNew) {
        var newTicketName = (email.id == '') ? (chat.cid == '') ? '' : chat.en : email.n;
        var newTicketEmail = (email.id == '') ? (chat.cid == '') ? '' : chat.em : email.e;
        var newTicketCompany = (chat.cid == '') ? '' : chat.co;
        var newTicketPhone = (chat.cid == '') ? '' : chat.cp;
        detailsHtml += '<tr>' +
            '<th>' + t('Name:') + '</th>' +
            '<td><input type="text" id="ticket-new-name" data-role="none" value="' + lzm_commonTools.htmlEntities(newTicketName) + '" /></td>' +
            '</tr><tr>' +
            '<th>' + t('Email:') + '</th>' +
            '<td><input type="text" id="ticket-new-email" data-role="none" value="' + lzm_commonTools.htmlEntities(newTicketEmail) + '" /></td>' +
            '</tr><tr>' +
            '<th>' + t('Company:') + '</th>' +
            '<td><input type="text" id="ticket-new-company" data-role="none" value="' + lzm_commonTools.htmlEntities(newTicketCompany) + '" /></td>' +
            '</tr><tr>' +
            '<th>' + t('Phone:') + '</th>' +
            '<td><input type="text" id="ticket-new-phone" data-role="none" value="' + lzm_commonTools.htmlEntities(newTicketPhone) + '" /></td>' +
            '</tr>';
        if (email.id != '' || chat.cid != '') {
            var newTicketSubject = (email.id == '') ? chat.q : email.s;
                detailsHtml += '<tr>' +
                '<th>' + t('Subject:') + '</th>' +
                '<td><input type="text" id="ticket-new-subject" data-role="none" value="' + lzm_commonTools.htmlEntities(newTicketSubject) + '" /></td>' +
                '</tr>';
        }
        for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
            myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
            var selectedValue = '';
            if (chat.cid != '' && chat.cc.length > 0) {
                for (j=0; j<chat.cc.length; j++) {
                    selectedValue = (chat.cc[j].cuid == myCustomInput.name) ? chat.cc[j].text : selectedValue;
                }
            }
            if (myCustomInput.type == 'ComboBox') {
                myInputField = '<select id="ticket-new-cf' + myCustomInput.id + '" data-role="none">';
                for (j=0; j<myCustomInput.value.length; j++) {
                    var selectedString = (selectedValue == myCustomInput.value[j]) ? ' selected="selected"' : '';
                    myInputField += '<option value="' + j + '"' + selectedString + '>' + myCustomInput.value[j] + '</option>';
                }
                myInputField +='</select>';
            } else if (myCustomInput.type == 'CheckBox') {
                var checkedString = (selectedValue == 1) ? ' checked="checked"' : '';
                myInputText = myCustomInput.value;
                myInputField = '<input type="checkbox" id="ticket-new-cf' + myCustomInput.id + '" data-role="none"' +
                    ' style="min-width: 0px; width: auto;" value="' + myInputText + '"' + checkedString + ' />';
            } else {
                myInputText = lzm_commonTools.htmlEntities(selectedValue);
                myInputField = '<input type="text" id="ticket-new-cf' + myCustomInput.id + '" data-role="none" value="' + myInputText + '" />';
            }
            if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
                detailsHtml += '<tr><th>' + myCustomInput.name + ':</th>' +
                    '<td>' + myInputField + '</td></tr>';
            }
        }
    } else {
        if (typeof operatorObject[message.sid] != 'undefined') {
            detailsHtml += '<tr><th>' + t('Name:') + '</th><td><div class="input-like">' + operatorObject[message.sid].name + '</div></td></tr>';
            detailsHtml += '<tr><th>' + t('Sent to:') + '</th><td><div class="input-like">' + lzm_commonTools.htmlEntities(message.em) + '</div></td></tr>';
        } else {
            detailsHtml += '<tr><th>' + t('Name:') + '</th><td><div class="input-like">' + lzm_commonTools.htmlEntities(message.fn) + '</div></td></tr>';
            detailsHtml += '<tr><th>' + t('Email:') + '</th><td><div class="input-like">' + lzm_commonTools.htmlEntities(message.em) + '</div></td></tr>';
            detailsHtml += '<tr><th>' + t('Company:') + '</th><td><div class="input-like">' + lzm_commonTools.htmlEntities(message.co) + '</div></td></tr>';
            detailsHtml += '<tr><th>' + t('Phone:') + '</th><td><div class="input-like">' + lzm_commonTools.htmlEntities(message.p) + '</div></td></tr>';
        }
        var subject = (message.t == 0 && message.s != '') ?
            '<a onclick="openLink(\'' + message.s + '\');" href="#" class="lz_chat_link_no_icon">' + message.s + '</a>' :
            lzm_commonTools.htmlEntities(message.s);
        var subjectLabel = (message.t == 0 && message.s != '') ? t('Url:') : t('Subject:');
        detailsHtml += '<tr><th>' + subjectLabel + '</th><td><div class="input-like">' + subject + '</div></td></tr>';
        for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
            myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]), myInputText = '';
            if (myCustomInput.active == 1 && message.customInput.length > 0) {
                for (j=0; j<message.customInput.length; j++) {
                    if (message.customInput[j].id == myCustomInput.name) {
                        myInputText = (myCustomInput.type != 'CheckBox') ? lzm_commonTools.htmlEntities(message.customInput[j].text) :
                            (message.customInput[j].text == 1) ? t('Yes') : t('No');
                    }
                }
                if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
                    detailsHtml += '<tr><th>' + myCustomInput.name + ':</th><td><div class="input-like">' + myInputText + '</div></td></tr>';
                }
            }
        }
    }
    detailsHtml += '</table>';

    return detailsHtml;
};

ChatDisplayHelperClass.prototype.createTicketMessageList = function(ticket, operatorObject, chat) {
    chat = (typeof chat != 'undefined') ? chat : {cid: ''};
    //console.log(ticket.messages[ticket.messages.length - 1]);
    var messageListHtml = '<thead><tr id="ticket-history-header-line">' +
        '<th style="width: 18px !important;">&nbsp;</th>' +
        '<th style="width: 18px;">&nbsp;</th>' +
        '<th style="width: 18px;">&nbsp;</th>' +
        '<th>' + t('Date').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Sender').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Receiver').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Subject').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Company').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Phone').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        //'<th style="width: 74px !important;"></th>' +
        '</tr></thead><tbody>';
    if (chat.cid == '') {
        ticket.messages.sort(this.ticketMessageSortfunction);
        for (var i=ticket.messages.length - 1; i>=0; i--) {
            var tblCellStyle = ' style="line-height: 16px;"';
            var messageTimeObject = lzm_chatTimeStamp.getLocalTimeObject(ticket.messages[i].ct * 1000, true);
            var messageTimeHuman = lzm_commonTools.getHumanDate(messageTimeObject, '', lzm_chatDisplay.userLanguage);
            var customerName = '';
            if (ticket.messages[i].fn != '') {
                customerName += lzm_commonTools.htmlEntities(ticket.messages[i].fn);
                if (ticket.messages[i].em != '') {
                    customerName += ' &lt;' + lzm_commonTools.htmlEntities(ticket.messages[i].em) + '&gt;'
                }
            } else if (ticket.messages[i].em != '') {
                customerName += lzm_commonTools.htmlEntities(ticket.messages[i].em);
            }
            var sender = (typeof operatorObject[ticket.messages[i].sid] != 'undefined') ? operatorObject[ticket.messages[i].sid].name : customerName;
            var receiver = (typeof operatorObject[ticket.messages[i].sid] == 'undefined') ? '' : customerName;
            var messageTypeImage = 'img/023-email_incoming.png';
            if (ticket.messages[i].t == 1) {
                messageTypeImage = 'img/023-email5.png';
            } else if (ticket.messages[i].t == 2) {
                messageTypeImage = 'img/217-quote.png';
            } else if (ticket.messages[i].t == 3) {
                messageTypeImage = 'img/023-email4.png';
            } else if (ticket.messages[i].t == 4) {
                messageTypeImage = 'img/023-email6.png';
            }
            var onclickAction = ' onclick="handleTicketMessageClick(\'' + ticket.id + '\', \'' + i + '\');"';
            var oncontextMenu = '';
            if(!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) {
                oncontextMenu = ' oncontextmenu="openTicketMessageContextMenu(event, \'' + ticket.id + '\', \'' + i + '\', false);"';
            }
            var attachmentImage = (ticket.messages[i].attachment.length > 0) ? 'background-image: url(\'img/622-paper_clip.png\'); ' : '';
            var commentImage = (ticket.messages[i].comment.length > 0) ? 'background-image: url(\'img/052-doc_user.png\'); ' : '';
            messageListHtml += '<tr class="message-line lzm-unselectable" id="message-line-' + ticket.id + '_' + i + '" style="cursor: pointer;"' + onclickAction + oncontextMenu + '>' +
                '<td class="icon-column"' + tblCellStyle.replace(/"$/, 'background-image: url(\'' + messageTypeImage + '\'); background-repeat: no-repeat; background-position: center; padding: 5px 10px;"') +
                ' nowrap></td>' +
                '<td class="icon-column"' + tblCellStyle.replace(/"$/, attachmentImage + 'background-repeat: no-repeat; background-position: center; padding: 5px 10px;"') +
                ' nowrap></td>' +
                '<td class="icon-column"' + tblCellStyle.replace(/"$/, commentImage + 'background-repeat: no-repeat; background-position: center; padding: 5px 10px;"') +
                ' nowrap></td>' +
                '<td' + tblCellStyle + ' nowrap>' + messageTimeHuman + '</td>' +
                '<td' + tblCellStyle + ' nowrap>' + sender + '</td>' +
                '<td' + tblCellStyle + ' nowrap>' + receiver + '</td>' +
                '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[i].s) + '</td>' +
                '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[i].co) + '</td>' +
                '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[i].p) + '</td>' +
                '</tr>';
        }
    } else {
        var tblCellStyle = ' style="line-height: 16px;"';
        var newMessageDate = lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(null, false), '', lzm_chatDisplay.userLanguage);
        var chatMessageDate = lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(chat.ts * 1000, true), '', lzm_chatDisplay.userLanguage);
        var senderName = lzm_commonTools.htmlEntities(chat.en);
        var senderEmail = lzm_commonTools.htmlEntities(chat.em);
        var receiverName = (typeof operatorObject[chat.iid] != 'undefined') ? operatorObject[chat.iid].name : '-';
        var subject = lzm_commonTools.htmlEntities(chat.q);
        var company = lzm_commonTools.htmlEntities(chat.co);
        var phone = lzm_commonTools.htmlEntities(chat.cp);
        messageListHtml += '<tr>' +
            '<td class="icon-column"' + tblCellStyle.replace(/"$/, 'background-image: url(\'img/023-email6.png\'); background-repeat: no-repeat; background-position: center; padding: 5px 10px;"') + ' nowrap></td>' +
            '<td class="icon-column"></td>' +
            '<td class="icon-column"></td>' +
            '<td>' + newMessageDate + '</td>' +
            '<td>' + senderName + '</td>' +
            '<td>' + receiverName + '</td>' +
            '<td>' + subject + '</td>' +
            '<td>' + company + '</td>' +
            '<td>' + phone + '</td>' +
            '</tr><tr>' +
            '<td' + tblCellStyle.replace(/"$/, 'background-image: url(\'img/217-quote.png\'); background-repeat: no-repeat; background-position: center; padding: 5px 10px;"') + ' nowrap></td>' +
            '<td></td>' +
            '<td></td>' +
            '<td>' + chatMessageDate + '</td>' +
            '<td>' + senderName + '</td>' +
            '<td>' + receiverName + '</td>' +
            '<td>' + subject + '</td>' +
            '<td>' + company + '</td>' +
            '<td>' + phone + '</td>' +
            '</tr>';
    }
    messageListHtml += '</tbody>';

    return messageListHtml;
};

ChatDisplayHelperClass.prototype.createTicketDetailsGroupChangeHandler = function(selectedTicket, operatorObject, groups) {
    $('#ticket-details-group').change(function() {
        //console.log('Group change');
        var i, selectedString;
        var selectedGroupId = $('#ticket-details-group').val();
        var selectedOperator = $('#ticket-details-editor').val();
        var editorSelectString = '<option value="-1">' + t('None') + '</option>';
        for (var op in operatorObject) {
            if (operatorObject.hasOwnProperty(op)) {
                if ($.inArray(selectedGroupId, operatorObject[op].groups) != -1 && operatorObject[op].isbot != 1) {
                    selectedString = (op == selectedOperator && $.inArray(selectedGroupId, operatorObject[op].groups) != -1) ? ' selected="selected"' : '';
                    editorSelectString += '<option value="' + op + '"' + selectedString + '>' + operatorObject[op].name + '</option>';
                }
            }
        }
        var selectedLanguage = $('#ticket-details-language').val();
        var availableLanguages = [];
        for (i=0; i<groups.length; i++) {
            if (groups[i].id == selectedGroupId) {
                for (var j=0; j<groups[i].pm.length; j++) {
                    availableLanguages.push(groups[i].pm[j].lang);
                }
                break;
            }
        }
        if ( typeof selectedTicket.l != 'undefined' && $.inArray(selectedTicket.l, availableLanguages) == -1) {
            availableLanguages.push(selectedTicket.l);
        }
        if ($.inArray(selectedLanguage, availableLanguages) == -1) {
            availableLanguages.push(selectedLanguage);
        }
        var langSelectString = '';
        for (i=0; i<availableLanguages.length; i++) {
            selectedString = (availableLanguages[i] == selectedLanguage) ? ' selected="selected"' : '';
            langSelectString += '<option value="' + availableLanguages[i] + '"' + selectedString + '>' + availableLanguages[i] + '</option>';
        }

        $('#ticket-details-editor').html(editorSelectString).trigger('create');
        $('#ticket-details-language').html(langSelectString).trigger('create');
    });
};

ChatDisplayHelperClass.prototype.createTicketList = function(tickets, ticketGlobalValues, page, sort, query, filter, operators) {
    var i;
    var operatorObject = {};
    for (i=0; i<operators.length; i++) {
        operatorObject[operators[i].id] = operators[i];
    }

    var emailDisabledClass = (ticketGlobalValues['e'] > 0) ? '' : 'ui-disabled';
    var createDisabledClass = '';
    var displayClearBtn = (query == '') ? 'none' : 'inline';
    var totalTickets = ticketGlobalValues.t;
    var unreadTickets = Math.max(0, ticketGlobalValues.r - lzm_chatDisplay.ticketReadArray.length + lzm_chatDisplay.ticketUnreadArray.length);
    lzm_chatDisplay.ticketGlobalValues.u = unreadTickets;
    var filteredTickets = ticketGlobalValues.q;
    var ticketListInfo1 = t('<!--total_tickets--> total entries, <!--unread_tickets--> new entries, <!--filtered_tickets--> matching filter', [['<!--total_tickets-->', totalTickets], ['<!--unread_tickets-->', unreadTickets], ['<!--filtered_tickets-->', filteredTickets]]);
    var ticketListInfo2 = t('<!--total_tickets--> total entries, <!--unread_tickets--> new entries', [['<!--total_tickets-->', totalTickets], ['<!--unread_tickets-->', unreadTickets]]);
    var ticketListHtml = '<div id="ticket-list-headline"><h3>' + t('Tickets') + '</h3></div>' +
        '<div id="ticket-list-headline2">';
    if ($(window).width() > 800) {
        var ticketListInfo = (lzm_chatPollServer.ticketFilter.length == 4 && lzm_chatPollServer.ticketQuery == '') ? ticketListInfo2 : ticketListInfo1;
        ticketListHtml += '<span style="float: left; margin-top: 14px;">' + ticketListInfo + '</span>';
    }
    ticketListHtml += this.createButton('ticket-show-emails', emailDisabledClass, '', t('Emails <!--number_of_emails-->',[['<!--number_of_emails-->', '(' + ticketGlobalValues['e'] + ')']]),
            'img/023-email4.png', 'lr', {'margin-right': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        this.createButton('ticket-create-new', createDisabledClass, '', t('Create Ticket'), 'img/023-email6.png', 'lr',
            {'margin-right': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        this.createButton('ticket-filter', '', 'openTicketFilterMenu(event, \'' + filter + '\')', t('Filter'), 'img/023-email_filter.png', 'lr',
            {'margin-right': '8px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        '<span>' +
        '<input placeholder="' + t('Search') + '" type="text" id="search-ticket" value="' + query + '" data-role="none" />' +
        '<span id="clear-ticket-search" style="margin-left: -2px; margin-right: 6px;' +
        ' background-image: url(\'js/jquery_mobile/images/icons-18-white.png\'); background-repeat: no-repeat;' +
        ' background-position: -73px -1px; border-radius: 9px; background-color: rgba(0,0,0,0.4); cursor: pointer;' +
        ' display: ' + displayClearBtn + ';">&nbsp;</span>' +
        '</span>' +
        '</div>' +
        '<div id="ticket-list-body" onclick="removeTicketContextMenu();">';
    if ((!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) && $(window).width() > 1000) {
        ticketListHtml += '<div id="ticket-list-left" class="ticket-list">';
    }
    ticketListHtml += '<table class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;">' +
        '<thead><tr onclick="removeTicketContextMenu();">' +
        '<th style="width: 18px;">&nbsp;</th>' +
        '<th style="width: 18px;">&nbsp;</th>' +
        //'<th style="width: 18px;">&nbsp;</th>' +
        '<th nowrap id="ticket-sort-update" class="ticket-list-sort-column"' +
        ' style="cursor: pointer; background-image: url(\'img/sort_by_this.png\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'update\');">' + t('Last Update').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th nowrap id="ticket-sort-date" class="ticket-list-sort-column"' +
        ' style="white-space: nowrap; cursor: pointer; background-image: url(\'img/sort_by_this.png\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'\');">' + t('Date').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th nowrap id="ticket-sort-wait" class="ticket-list-sort-column"' +
        ' style="white-space: nowrap; cursor: pointer; background-image: url(\'img/sort_by_this.png\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'wait\');">' + t('Waiting Time').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Ticket ID').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Operator').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Name').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Email').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Company').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Group').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Phone').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Hash').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Callback').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('IP address').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '</tr></thead><tbody>';
    var lineCounter = 0;
    var numberOfTickets = (typeof ticketGlobalValues.q != 'undefined') ? ticketGlobalValues.q : ticketGlobalValues.t;
    var numberOfPages = Math.max(1, Math.ceil(numberOfTickets / ticketGlobalValues.p));
    if (ticketGlobalValues.updating) {
        ticketListHtml += '<tr><td colspan="15" style="font-weight: bold; font-size: 16px; text-align: center; padding: 20px;">' +
            t('The ticket database is updating.') +
            '</td></tr>';
    } else if (!isNaN(numberOfPages)) {
        for (i=0; i<tickets.length; i++) {
            if (tickets[i].del == 0) {
                ticketListHtml += this.createTicketListLine(tickets[i], lineCounter, operatorObject);
                lineCounter++;
            }
        }
    } else {
        ticketListHtml += '';
    }
    ticketListHtml += '</tbody></table>';
    if ((!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) && $(window).width() > 1000) {
        ticketListHtml += '</div><div id="ticket-list-right" class="ticket-list"></div>';
    }
    ticketListHtml += '</div>';

    ticketListHtml += '<div id="ticket-list-footline">' +
        '<span id="ticket-paging">';
    if (!isNaN(numberOfPages)) {
        ticketListHtml += this.createButton('ticket-page-all-backward', 'ticket-list-page-button', 'pageTicketList(1);', '', 'img/415-skip_backward.png', 'l',
            {'cursor': 'pointer', 'padding': '4px 15px'}) +
            this.createButton('ticket-page-one-backward', 'ticket-list-page-button', 'pageTicketList(' + (page - 1) + ');', '', 'img/414-rewind.png', 'r',
                {'cursor': 'pointer', 'padding': '4px 15px'}) +
            '<span style="padding: 0px 15px;">' + t('Page <!--this_page--> of <!--total_pages-->',[['<!--this_page-->', page], ['<!--total_pages-->', numberOfPages]]) + '</span>' +
            this.createButton('ticket-page-one-forward', 'ticket-list-page-button', 'pageTicketList(' + (page + 1) + ');', '', 'img/420-fast_forward.png', 'l',
                {'cursor': 'pointer', 'padding': '4px 15px'}) +
            this.createButton('ticket-page-all-forward', 'ticket-list-page-button', 'pageTicketList(' + numberOfPages + ');', '', 'img/419-skip_forward.png', 'r',
                {'cursor': 'pointer', 'padding': '4px 15px'});
    }
    ticketListHtml += '</span>' +
        '</div>';
    return [ticketListHtml, numberOfPages];
};

ChatDisplayHelperClass.prototype.createTicketListLine = function(ticket, lineCounter, operatorObject, inDialog) {
    ticket.messages.sort(this.ticketMessageSortfunction);
    var userStyle;
    if (lzm_chatDisplay.isApp) {
        userStyle = ' style="line-height: 22px !important; cursor: pointer;"';
    } else {
        userStyle = ' style="cursor: pointer;"';
    }
    var ticketDateObject = lzm_chatTimeStamp.getLocalTimeObject(ticket.messages[0].ct * 1000, true);
    var ticketDateHuman = lzm_commonTools.getHumanDate(ticketDateObject, '', lzm_chatDisplay.userLanguage);
    var ticketLastUpdatedHuman = '-';
    if (ticket.u != 0) {
        var ticketLastUpdatedObject = lzm_chatTimeStamp.getLocalTimeObject(ticket.u * 1000, true);
        ticketLastUpdatedHuman = lzm_commonTools.getHumanDate(ticketLastUpdatedObject, '', lzm_chatDisplay.userLanguage);
    }
    var waitingTime = lzm_chatTimeStamp.getServerTimeString(null, true) - ticket.w;
    var waitingTimeHuman = '-';
    if (waitingTime < 0) {
        waitingTimeHuman = '-';
    } else if (waitingTime > 0 && waitingTime <= 3600) {
        waitingTimeHuman = t('<!--time_amount--> minutes', [['<!--time_amount-->', Math.max(1, Math.floor(waitingTime / 60))]]);
    } else if (waitingTime > 3600 && waitingTime <= 86400) {
        waitingTimeHuman = t('<!--time_amount--> hours', [['<!--time_amount-->', Math.floor(waitingTime / 3600)]]);
    } else if (waitingTime > 86400){
        waitingTimeHuman = t('<!--time_amount--> days', [['<!--time_amount-->', Math.floor(waitingTime / 86400)]]);
    }
    var operator = '';
    var group = (typeof ticket.editor != 'undefined' && ticket.editor != false) ? ticket.editor.g : ticket.gr;
    if (typeof ticket.editor != 'undefined' && ticket.editor != false && typeof operatorObject[ticket.editor.ed] != 'undefined') {
        operator = operatorObject[ticket.editor.ed].name;
    }
    var callBack = (ticket.messages[0].cmb == 1) ? t('Yes') : t('No');
    var ticketReadFontWeight = ' font-weight: bold;';
    var ticketReadImage = 'img/023-email2.png';
    if ((ticket.u <= lzm_chatDisplay.ticketGlobalValues.mr && lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketUnreadArray) == -1) ||
        lzm_commonTools.checkTicketReadStatus(ticket.id, lzm_chatDisplay.ticketReadArray, lzm_chatDisplay.ticketListTickets) != -1) {
        ticketReadImage = 'img/024-email.png';
        ticketReadFontWeight = '';
    }
    var ticketStatusImage = 'img/215-info.png';
    if (typeof ticket.editor != 'undefined' && ticket.editor != false) {
        if (ticket.editor.st == 1) {
            ticketStatusImage = 'img/128-status.png';
        } else if (ticket.editor.st == 2) {
            ticketStatusImage = 'img/200-ok2.png';
        } else if (ticket.editor.st == 3) {
            ticketStatusImage = 'img/205-close16c.png';
        }
    }
    //var ticketWarningImage = 'img/216-warning.png';
    var onclickAction = '', ondblclickAction = '', oncontextmenuAction = '';
    if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) {
        onclickAction = ' onclick="openTicketContextMenu(event, \'' + ticket.id + '\', ' + inDialog + '); return false;"';
    } else {
        onclickAction = ' onclick="selectTicket(\'' + ticket.id + '\', false, ' + inDialog + ');"';
        var dialogId = (!inDialog) ? '' : $('#visitor-information').data('dialog-id');
        ondblclickAction = ' ondblclick="showTicketDetails(\'' + ticket.id + '\', false, \'\', \'\', \'' + dialogId + '\');"';
        oncontextmenuAction = ' oncontextmenu="openTicketContextMenu(event, \'' + ticket.id + '\', ' + inDialog + '); return false;"';
    }
    var tblCellStyle = ' style="line-height: 16px;' + ticketReadFontWeight + '"';
    var ticketLineId = (!inDialog) ? 'ticket-list-row-' + ticket.id : 'matching-ticket-list-row-' + ticket.id;
    var selectedClass = (ticket.id == lzm_chatDisplay.selectedTicketRow) ? ' selected-table-line' : '';
    var lineHtml = '<tr data-line-number="' + lineCounter + '" class="ticket-list-row lzm-unselectable' + selectedClass +
        '" id="' + ticketLineId + '"' + userStyle + onclickAction + ondblclickAction + oncontextmenuAction + '>' +
        '<td class="icon-column" ' + tblCellStyle.replace(/"$/,'background-image: url(\'' + ticketStatusImage + '\'); background-repeat: no-repeat;' +
        ' background-position: center; padding: 5px 10px;"') + ' nowrap></td>' +
        '<td class="icon-column"' + tblCellStyle.replace(/"$/,'background-image: url(\'' + ticketReadImage + '\'); background-repeat: no-repeat;' +
        ' background-position: center; padding: 5px 10px;"') + ' nowrap></td>' +
        //'<td' + tblCellStyle.replace(/"$/,'background-image: url(\'' + ticketWarningImage + '\'); background-repeat: no-repeat;' +
        //' background-position: center; padding: 5px 10px;"') + ' nowrap></td>' +
        '<td' + tblCellStyle + ' nowrap>' + ticketLastUpdatedHuman.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + ticketDateHuman.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + waitingTimeHuman.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + ticket.id + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + operator + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[0].fn) + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[0].em) + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[0].co) + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + group + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + lzm_commonTools.htmlEntities(ticket.messages[0].p) + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + ticket.h + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + callBack + '</td>' +
        '<td' + tblCellStyle + ' nowrap>' + ticket.messages[0].ip + '</td>' +
        '</tr>';
    var foo = new Error();
    //console.log(foo.stack);
    return lineHtml;
};

ChatDisplayHelperClass.prototype.createEmailListLine = function(email, lineNumber, group) {
    var selectedClass = (lineNumber == $('#email-placeholder').data('selected-email')) ? ' selected-table-line' : '';
    var attachmentIcon = (email.attachment.length > 0) ? 'background-image: url(\'img/622-paper_clip.png\');' : '';
    var statusIcon = '023-email2.png';
    var fontWeight = 'bold';
    if ($.inArray(email.id, lzm_chatDisplay.emailDeletedArray) != -1) {
        statusIcon = '205-close16c.png';
        fontWeight = 'normal';
    } else if (lzm_commonTools.checkEmailTicketCreation(email.id) != -1) {
        statusIcon = '203-add.png';
        fontWeight = 'normal';
    } else if (email.ei != '') {
        statusIcon = '614-lock.png';
        fontWeight = 'normal';
        if (lineNumber != $('#email-placeholder').data('selected-email')) {
            selectedClass = ' locked-email-line';
        }
    } else if (lzm_chatTimeStamp.getServerTimeString(null, true) - email.c > 1209600 || lzm_commonTools.checkEmailReadStatus(email.id) != -1) {
        statusIcon = '024-email.png';
        fontWeight = 'normal';
    }
    var emailTime = lzm_chatTimeStamp.getLocalTimeObject(email.c * 1000, true);
    var emailHtml = '<tr class="email-list-line lzm-unselectable' + selectedClass + '" id="email-list-line-' + lineNumber + '" data-line-number="' + lineNumber + '"' +
        ' data-locked-by="' + email.ei + '" style="cursor:pointer;">' +
        '<td style="font-weight: ' + fontWeight + '; background-image: url(\'img/' + statusIcon + '\'); background-repeat: no-repeat;' +
        ' background-position: center; padding: 0px 9px;"></td>' +
        '<td style="font-weight: ' + fontWeight + '; ' + attachmentIcon + ';' +
        ' background-repeat: no-repeat; background-position: center; padding: 0px 9px;"></td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + lzm_commonTools.getHumanDate(emailTime, '', lzm_chatDisplay.userLanguage) + '</td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + lzm_commonTools.htmlEntities(email.s) + '</td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + lzm_commonTools.htmlEntities(email.e) + '</td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + lzm_commonTools.htmlEntities(email.n) + '</td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + group.id + '</td>' +
        '<td style="font-weight: ' + fontWeight + '; white-space: nowrap;">' + email.r + '</td>' +
        '</tr>';
    return emailHtml;
};

ChatDisplayHelperClass.prototype.ticketMessageSortfunction = function(a,b) {
    var rtValue = (a.ct < b.ct) ? -1 : 0;
    rtValue = (rtValue == 0 && a.ct > b.ct) ? 1 : 0;
    return rtValue;
};

ChatDisplayHelperClass.prototype.createMatchingTickets = function() {
    var operators = [], tickets = [];
    var matchingTicketsHtml = '<fieldset class="lzm-fieldset" data-role="none" id="matching-tickets-inner">' +
        '<legend>' + t('Tickets') + '</legend>' +
        '<table id="matching-tickets-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;">' +
        this.createMatchingTicketsTableContent(tickets, operators) +
        '</table>' +
        '</fieldset>';

    return matchingTicketsHtml;
};

ChatDisplayHelperClass.prototype.createMatchingTicketsTableContent = function(tickets, operators) {
    var lineCounter = 0;
    var operatorObject = {}, i;
    for (i=0; i<operators; i++) {
        operatorObject[operators[i].id] = operatorObject[i];
    }
    var tableHtml = '<thead><tr onclick="removeTicketContextMenu();">' +
        '<th style="width: 18px;">&nbsp;</th>' +
        '<th style="width: 18px;">&nbsp;</th>';
        //'<th style="width: 18px;">&nbsp;</th>' +
    var sortColumnImage = (lzm_chatPollServer.ticketSort == 'update') ? 'img/sort_by_this.png' : 'img/sort_by_this_inactive.png';
    tableHtml += '<th nowrap id="ticket-sort-update" class="ticket-list-sort-column"' +
        ' style="cursor: pointer; background-image: url(\'' + sortColumnImage + '\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'update\');">' + t('Last Update').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    sortColumnImage = (lzm_chatPollServer.ticketSort == '') ? 'img/sort_by_this.png' : 'img/sort_by_this_inactive.png';
    tableHtml += '<th nowrap id="ticket-sort-date" class="ticket-list-sort-column"' +
        ' style="white-space: nowrap; cursor: pointer; background-image: url(\'' + sortColumnImage + '\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'\');">' + t('Date').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    sortColumnImage = (lzm_chatPollServer.ticketSort == 'wait') ? 'img/sort_by_this.png' : 'img/sort_by_this_inactive.png';
    tableHtml += '<th nowrap id="ticket-sort-wait" class="ticket-list-sort-column"' +
        ' style="white-space: nowrap; cursor: pointer; background-image: url(\'' + sortColumnImage + '\');' +
        ' background-position: right center; background-repeat: no-repeat; padding-right: 25px;"' +
        ' onclick="sortTicketsBy(\'wait\');">' + t('Waiting Time').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>' +
        '<th>' + t('Ticket ID').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Operator').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Name').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Email').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Company').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Group').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Phone').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Hash').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('Callback').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '<th>' + t('IP address').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') +'</th>' +
        '</tr></thead><tbody>';
    for (i=0; i<tickets.length; i++) {
        if (tickets[i].del == 0) {
            tableHtml += this.createTicketListLine(tickets[i], lineCounter, operatorObject, true);
            lineCounter++;
        }
    }
    tableHtml += '</tbody>';

    return tableHtml;
};

/*********************************************** Resource functions **********************************************/

ChatDisplayHelperClass.prototype.prepareResources = function (resources) {
    resources.sort(this.resourceSortFunction);
    var allResources = resources;

    var tmpResources = [], topLayerResource, i;
    for (i=0; i<resources.length; i++) {
        resources[i].ti = resources[i].ti
            .replace(/%%_Files_%%/, t('Files'))
            .replace(/%%_External_%%/, t('External'))
            .replace(/%%_Internal_%%/, t('Internal'));
        if (resources[i].ra == 0) {
            topLayerResource = resources[i];
            //console.log(resources[i].rid);
        } else {
            tmpResources.push(resources[i]);
        }
    }
    resources = tmpResources;

    return [resources, allResources, topLayerResource];
};

ChatDisplayHelperClass.prototype.getResourceIcon = function(type) {
    var resourceIcon;
    switch(type) {
        case '0':
            resourceIcon = 'img/001-folder.png';
            break;
        case '1':
            resourceIcon = 'img/058-doc_new.png';
            break;
        case '2':
            resourceIcon = 'img/054-doc_web16c.png';
            break;
        default:
            resourceIcon = 'img/622-paper_clip.png';
            break;
    }
    return resourceIcon;
};

ChatDisplayHelperClass.prototype.getChatPartner = function(chatPartner, external_users, internal_users, internal_departments) {
    var chatPartnerName = '', chatPartnerUserId = '', i;
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        if (chatPartner.indexOf('~') != -1) {
            for (i=0; i<external_users.length; i++) {
                if (chatPartner.split('~')[0] == external_users[i].id) {
                    for (var j=0; j<external_users[i].b.length; j++) {
                        if (chatPartner.split('~')[1] == external_users[i].b[j].id) {
                            chatPartnerName = (external_users[i].b[j].cname != '') ?
                                external_users[i].b[j].cname : external_users[i].unique_name;
                        }
                    }
                    break;
                }
            }
        } else {
            if (chatPartner == 'everyoneintern') {
                chatPartnerName = t('All operators');
                chatPartnerUserId = chatPartner;
            } else {
                for (i=0; i<internal_users.length; i++) {
                    if (chatPartner == internal_users[i].id) {
                        chatPartnerName = internal_users[i].name;
                        chatPartnerUserId = internal_users[i].userid;
                        break;
                    }
                }
                if (chatPartnerName == '') {
                    for (i=0; i<internal_departments.length; i++) {
                        if (chatPartner == internal_departments[i].id) {
                            chatPartnerName = internal_departments[i].name;
                            chatPartnerUserId = internal_departments[i].id;
                            break;
                        }
                    }
                }
            }
        }
    } else {
        chatPartner = '';
    }
    if (chatPartnerName.length > 13) {
        chatPartnerName = chatPartnerName.substr(0,10) + '...';
    }

    return {name: chatPartnerName, userid: chatPartnerUserId};
};

ChatDisplayHelperClass.prototype.createQrdTreeTopLevel = function(topLayerResource, chatPartner, inDialog) {
    var onclickAction = ' onclick="handleResourceClickEvents(\'' + topLayerResource.rid + '\')"';
    var onContextMenu = '';
    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile && !inDialog) {
        onContextMenu = ' oncontextmenu="openQrdContextMenu(event, \'' + chatPartner + '\', \'' + topLayerResource.rid + '\');return false;"';
    }
    var plusMinusImage = ($.inArray("1", lzm_chatDisplay.openedResourcesFolder) != -1) ? 'img/minus.png' : 'img/plus.png';
    var resourceHtml = '<fieldset id="all-resources" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('All Resources') + '</legend>' +
        '<div id="all-resources-inner"><div id="resource-' + topLayerResource.rid + '" class="resource-div lzm-unselectable"' +
        ' style="margin: 4px 0px; padding-left: 2px; padding-top: 1px; padding-bottom: 1px; white-space: nowrap;">' +
        '<span id="resource-' + topLayerResource.rid + '-open-mark" style=\'display: inline-block; width: 7px; ' +
        'height: 7px; border: 1px solid #aaa; background-color: #f1f1f1; ' +
        this.addBrowserSpecificGradient('background-image: url("' + plusMinusImage + '")') + '; ' +
        'background-position: center; background-repeat: no-repeat; margin-right: 4px; cursor: pointer;\'' +
        onclickAction + onContextMenu + '></span>' +
        '<span style=\'background-image: url("' + this.getResourceIcon(topLayerResource.ty) + '"); ' +
        'background-position: left center; background-repeat: no-repeat; padding: 3px;\'>' +
        '<span style="padding-left: 20px; cursor: pointer;"' + onclickAction + onContextMenu + '>' +
        lzm_commonTools.htmlEntities(topLayerResource.ti) + '</span>' +
        '</span></div><div id="folder-' + topLayerResource.rid + '" style="display: none;"></div>' +
        '</div></fieldset>';

    return resourceHtml;
};

ChatDisplayHelperClass.prototype.createQrdSearch = function(chatPartner) {
    var attachmentDataString = (chatPartner.indexOf('ATTACHMENT') != -1) ? ' data-attachment="1"' : ' data-attachment="0"';
    var searchHtml = '<fieldset id="search-input" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Search for...') + '</legend>' +
        '<table id="search-input-inner">' +
        '<tr><td colspan="2"><input type="text" data-role="none" id="search-text-input" />' +
        '<span id="clear-resource-search" style="margin-left: 4px; margin-right: 6px;' +
        ' background-image: url(\'js/jquery_mobile/images/icons-18-white.png\'); background-repeat: no-repeat;' +
        ' background-position: -73px -1px; border-radius: 9px; background-color: rgba(0,0,0,0.4); cursor: pointer;' +
        ' display: none;">&nbsp;</span>' +
        '</td>';
    var checkedString = ($.inArray('ti', lzm_chatDisplay.qrdSearchCategories) != -1) ? ' checked="checked"' : '';
    searchHtml += '<tr><td style="width: 20px !important;">' +
        '<input type="checkbox" data-role="none" id="search-by-ti" class="qrd-search-by"' + checkedString + ' /></td>' +
        '<td><label for="search-by-ti">' + t('Title') + '</label></td></tr>';
    checkedString = ($.inArray('t', lzm_chatDisplay.qrdSearchCategories) != -1) ? ' checked="checked"' : '';
    searchHtml += '<tr><td><input type="checkbox" data-role="none" id="search-by-t" class="qrd-search-by"' + checkedString + ' /></td>' +
        '<td><label for="search-by-t">' + t('Tags') + '</label></td></tr>';
    checkedString = ($.inArray('text', lzm_chatDisplay.qrdSearchCategories) != -1) ? ' checked="checked"' : '';
    searchHtml += '<tr><td><input type="checkbox" data-role="none" id="search-by-text" class="qrd-search-by"' + checkedString + ' /></td>' +
        '<td><label for="search-by-text">' + t('Content') + '</label></td></tr>' +
        '</table>' +
        '</fieldset>' +
        '<fieldset id="search-results" class="lzm-fieldset" data-role="none" style="margin-top: 5px;">' +
        '<legend>' + t('Results') + '</legend>' +
        '<table id="search-result-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;"' + attachmentDataString + '><thead><tr>' +
        '<th style="width: 18px !important;"></th><th>' + t('Title') + '</th><th>' + t('Tags') + '</th><th>' + t('Content') + '</th>' +
        '</tr></thead><tbody></tbody></table>' +
        '</fieldset>';

    return searchHtml;
};

ChatDisplayHelperClass.prototype.createQrdSearchResults = function(searchString, chatPartner) {
    var searchHtml = '';
    var resources = lzm_chatServerEvaluation.resources;
    var searchCategories = lzm_chatDisplay.qrdSearchCategories;
    $('#search-result-table').data('search-string', searchString);
    var resultIds = [];
    if (searchString != '') {
        for (var i=0; i<resources.length; i++) {
            for (var j=0; j<searchCategories.length; j++) {
                //console.log(resources[i]);
                //console.log(searchCategories[j]);
                var contentToSearch = resources[i][searchCategories[j]].toLowerCase();
                if (resources[i].ty != 0 && contentToSearch.indexOf(searchString.toLowerCase()) != -1 && $.inArray(resources[i].rid, resultIds) == -1) {
                    if (resources[i].ty == 3 || resources[i].ty == 4 || $('#search-result-table').data('attachment') != '1') {
                        searchHtml += this.createQrdSearchLine(resources[i], searchString, chatPartner);
                        resultIds.push(resources[i].rid);
                    }
                    //console.log(searchString);
                }
            }
        }
    }

    return searchHtml;
};

ChatDisplayHelperClass.prototype.createQrdSearchLine = function(resource, searchString, chatPartner) {
    var regExp = new RegExp(RegExp.escape(searchString), 'i');
    var onclickAction = ' onclick="handleResourceClickEvents(\'' + resource.rid + '\');"';
    var onDblClickAction = '';
    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) {
        if (chatPartner.indexOf('TICKET LOAD') != -1) {
            onDblClickAction = ' ondblclick="insertQrdIntoTicket(\'' + chatPartner.split('~')[1] + '\');"';
        } else if (chatPartner.indexOf('ATTACHMENT') != -1) {
            onDblClickAction = ' ondblclick="addQrdAttachment(\'' + chatPartner.split('~')[1] + '\');"';
        } else if (parseInt(resource.ty) < 3) {
            onDblClickAction = ' ondblclick="editQrd();"';
        } else {
            onDblClickAction = ' ondblclick="previewQrd(\'' + chatPartner + '\', \'' + resource.rid + '\', false);"';
        }
    }
    var content = ($.inArray(parseInt(resource.ty), [3,4]) == -1) ? resource.text.replace(/<.*?>/g, ' ')
        .replace(regExp, '<span style="color: #000000; background-color: #fff9a9;">' + searchString + '</span>') : '';
    var searchLineHtml = '<tr style="cursor: pointer;" class="qrd-search-line lzm-unselectable" id="qrd-search-line-' + resource.rid + '"' +
        onclickAction + onDblClickAction + '>' +
        '<td style="background-position: center; background-repeat: no-repeat; background-image: url(\'' + this.getResourceIcon(resource.ty) + '\');"></td>' +
        '<td>' + lzm_commonTools.htmlEntities(resource.ti).replace(regExp, '<span style="color: #000000; background-color: #fff9a9;">' + searchString + '</span>') + '</td>' +
        '<td>' + resource.t.replace(regExp, '<span style="color: #000000; background-color: #fff9a9;">' + searchString + '</span>') + '</td>' +
        '<td>' + content + '</td>' +
        '</tr>';
    return searchLineHtml;
};

ChatDisplayHelperClass.prototype.createQrdRecently = function(chatPartner) {
    var attachmentDataString = (chatPartner.indexOf('ATTACHMENT') != -1) ? ' data-attachment="1"' : ' data-attachment="0"';
    var onlyFiles = (chatPartner.indexOf('ATTACHMENT') != -1) ? true : false;
    var qrdRecentlyHtml = '<fieldset id="recently-results" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Results') + '</legend>' +
        '<table id="recently-used-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;"' + attachmentDataString + '><thead><tr>' +
        '<th style="width: 18px !important;"></th><th>' + t('Title') + '</th><th>' + t('Tags') + '</th><th>' + t('Content') + '</th>' +
        '</tr></thead><tbody>' + this.createQrdRecentlyResults(onlyFiles, chatPartner) + '</tbody></table>' +
        '</fieldset>';

    return qrdRecentlyHtml;
};

ChatDisplayHelperClass.prototype.createQrdRecentlyResults = function(onlyFiles, chatPartner) {
    var resourceObject = {}, qrdRecentlyHtml = '';
    for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
        resourceObject[lzm_chatServerEvaluation.resources[i].rid] = lzm_chatServerEvaluation.resources[i];
    }
    for (var j=lzm_chatDisplay.recentlyUsedResources.length - 1; j>=0; j--) {
        try {
            var resource = resourceObject[lzm_chatDisplay.recentlyUsedResources[j]];
            if (resource.ty == 3 || resource.ty == 4 || ($('#recently-used-table').data('attachment') != '1') && !onlyFiles) {
                qrdRecentlyHtml += this.createQrdRecentlyLine(resource, chatPartner);
            }
        } catch(e) {}
    }

    return qrdRecentlyHtml
};

ChatDisplayHelperClass.prototype.createQrdRecentlyLine = function(resource, chatPartner) {
    var onclickAction = ' onclick="handleResourceClickEvents(\'' + resource.rid + '\');"';
    var onDblClickAction = '';
    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) {
        if (chatPartner.indexOf('TICKET LOAD') != -1) {
            onDblClickAction = ' ondblclick="insertQrdIntoTicket(\'' + chatPartner.split('~')[1] + '\');"';
        } else if (chatPartner.indexOf('ATTACHMENT') != -1) {
            onDblClickAction = ' ondblclick="addQrdAttachment(\'' + chatPartner.split('~')[1] + '\');"';
        } else if (parseInt(resource.ty) < 3) {
            onDblClickAction = ' ondblclick="editQrd();"';
        } else {
            onDblClickAction = ' ondblclick="previewQrd(\'' + chatPartner + '\', \'' + resource.rid + '\', false);"';
        }
    }
    var content = ($.inArray(parseInt(resource.ty), [3,4]) == -1) ? resource.text.replace(/<.*?>/g, ' ') : '';
    var qrdRecentlyLine = '<tr style="cursor: pointer;" class="qrd-recently-line lzm-unselectable" id="qrd-recently-line-' + resource.rid + '"' +
        onclickAction + onDblClickAction + '>' +
        '<td style="background-position: center; background-repeat: no-repeat; background-image: url(\'' + this.getResourceIcon(resource.ty) + '\');"></td>' +
        '<td>' + lzm_commonTools.htmlEntities(resource.ti) + '</td>' +
        '<td>' + resource.t + '</td>' +
        '<td>' + content + '</td>' +
        '</tr>';
    return qrdRecentlyLine;
};

ChatDisplayHelperClass.prototype.createResource = function(resource, chatPartner, inDialog) {
    chatPartner = (typeof chatPartner != 'undefined') ? chatPartner : '';
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    var onclickAction = ' onclick="handleResourceClickEvents(\'' + resource.rid + '\')"';
    var onDblClickAction = '';
    var onContextMenu = '';
    if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile && !inDialog) {
        onContextMenu = ' oncontextmenu="openQrdContextMenu(event, \'' + chatPartner + '\', \'' + resource.rid + '\');return false;"';
    }
    var resourceHtml = '<div id="resource-' + resource.rid + '" class="resource-div lzm-unselectable" ' +
        'style="padding-left: ' + (20 * resource.ra) + 'px; padding-top: 1px; padding-bottom: 1px; margin: 4px 0px; white-space: nowrap;">';
    if (resource.ty == 0) {
        resourceHtml += '<span id="resource-' + resource.rid + '-open-mark" style=\'display: inline-block; width: 7px; ' +
            'height: 7px; border: 1px solid #aaa; background-color: #f1f1f1; ' +
            this.addBrowserSpecificGradient('background-image: url("img/plus.png")') + '; ' +
            'background-position: center; background-repeat: no-repeat; margin-right: 4px; cursor: pointer;\'' +
            onclickAction + onContextMenu + '></span>';
    } else {
        resourceHtml += '<span style="display: inline-block; width: 9px; height: 9px; margin-right: 4px;"></span>';
        if (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) {
            if (chatPartner.indexOf('TICKET LOAD') != -1) {
                onDblClickAction = ' ondblclick="insertQrdIntoTicket(\'' + chatPartner.split('~')[1] + '\');"';
            } else if (chatPartner.indexOf('ATTACHMENT') != -1) {
                onDblClickAction = ' ondblclick="addQrdAttachment(\'' + chatPartner.split('~')[1] + '\');"';
            } else if (parseInt(resource.ty) < 3) {
                onDblClickAction = ' ondblclick="editQrd();"';
            } else {
                onDblClickAction = ' ondblclick="previewQrd(\'' + chatPartner + '\', \'' + resource.rid + '\', ' + inDialog + ');"';
            }
        }
    }
    resourceHtml += '<span style=\'background-image: url("' + this.getResourceIcon(resource.ty) + '"); ' +
        'background-position: left center; background-repeat: no-repeat; padding: 3px;\'>' +
        '<span class="qrd-title-span" style="padding-left: 20px; cursor: pointer;"' + onclickAction + onDblClickAction + onContextMenu + '>' +
        lzm_commonTools.htmlEntities(resource.ti) + '</span>' +
        '</span></div>';
    if (resource.ty == 0) {
        resourceHtml += '<div id="folder-' + resource.rid + '" style="display: none;"></div>';
    }

    return resourceHtml;
};

ChatDisplayHelperClass.prototype.resourceSortFunction = function(a, b) {
    var returnValue = 0;
    if (a.ti.toLowerCase() < b.ti.toLowerCase()) {
        returnValue = -1;
    } else {
        returnValue = 1;
    }
    return returnValue;
};

/*********************************************** Dialog functions **********************************************/

ChatDisplayHelperClass.prototype.createDialogWindow = function(headerString, bodyString, footerString, id,
                                                         defaultCss, desktopBrowserCss, mobileBrowserCss, appCss,
                                                         position, data, showMinimizeIcon, fullscreen, dialogId) {
    position = (typeof position != 'undefined' && position != '') ? position : 'absolute';
    lzm_chatDisplay.dialogData = (typeof data != 'undefined') ? data : {};
    showMinimizeIcon = (typeof showMinimizeIcon != 'undefined') ? showMinimizeIcon : true;
    fullscreen = (typeof fullscreen != 'undefinedd') ? fullscreen : false;
    var classnameExtension = (fullscreen) ? '-fullscreen' : '';
    dialogId = (typeof dialogId != 'undefined') ? dialogId : '';
    while (dialogId == '' || $.inArray(dialogId, lzm_chatDisplay.StoredDialogIds) != -1) {
        dialogId = md5('' + Math.random());
    }
    lzm_chatServerEvaluation.settingsDialogue = true;
    var key;

    var htmlContents = '<div id="' + id + '-container" class="dialog-window-container">' +
        '<div id="' + id + '" class="dialog-window' + classnameExtension + '">' +
        '<div id="' + id + '-headline" class="dialog-window-headline' + classnameExtension + '">' +
        headerString;
    if (showMinimizeIcon) {
        htmlContents += '<span id="minimize-dialog" ' +
            'onclick="minimizeDialogWindow(\'' + dialogId + '\', \'' + id + '\')"></span>';
    } else {
        htmlContents += '<span id="close-dialog" onclick="' + this.getMyObjectName() + '.removeDialogWindow();"></span>'
    }
    htmlContents += '</div>' +
        '<div id="' + id + '-body" class="dialog-window-body' + classnameExtension + '">' +
        bodyString +
        '</div>' +
        '<div id="' + id + '-footline" class="dialog-window-footline' + classnameExtension + '">' +
        footerString +
        '</div>' +
        '</div>' +
        '</div>';

    var chatPage = $('#chat_page');
    chatPage.append(htmlContents).trigger('create');

    if (lzm_chatDisplay.selected_view == 'external') {
        $('#visitor-list-table').remove();
    }

    lzm_chatDisplay.dialogWindowCss.position = position;
    $('#' + id + '-container').css(lzm_chatDisplay.dialogWindowContainerCss);
    if (fullscreen) {
        $('#' + id).css(lzm_chatDisplay.FullscreenDialogWindowCss);
        $('#' + id + '-headline').css(lzm_chatDisplay.FullscreenDialogWindowHeadlineCss);
        $('#' + id + '-body').css(lzm_chatDisplay.FullscreenDialogWindowBodyCss);
        $('#' + id + '-footline').css(lzm_chatDisplay.FullscreenDialogWindowFootlineCss);
    } else {
        $('#' + id).css(lzm_chatDisplay.dialogWindowCss);
        $('#' + id + '-headline').css(lzm_chatDisplay.dialogWindowHeadlineCss);
        $('#' + id + '-body').css(lzm_chatDisplay.dialogWindowBodyCss);
        $('#' + id + '-footline').css(lzm_chatDisplay.dialogWindowFootlineCss);
    }

    $('#minimize-dialog').css({
        'background': 'rgba(0,0,0,0.4) url("js/jquery_mobile/images/icons-18-white.png")',
        'background-position': '-180px -1px',
        'background-repeat': 'no-repeat',
        padding: '9px',
        float: 'right',
        margin: '-2px 7px',
        'border-radius': '9px',
        'cursor': 'pointer'
    });
    if (typeof defaultCss != 'undefined') {
        for (key in defaultCss) {
            if (defaultCss.hasOwnProperty(key))
                $('#' + key).css(defaultCss[key]);
        }
    }
    if (typeof desktopBrowserCss != 'undefined' && !lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
        for (key in desktopBrowserCss) {
            if (desktopBrowserCss.hasOwnProperty(key))
                $('#' + key).css(desktopBrowserCss[key]);
        }
    }
    if (typeof mobileBrowserCss != 'undefined' && lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
        for (key in mobileBrowserCss) {
            if (mobileBrowserCss.hasOwnProperty(key))
                $('#' + key).css(mobileBrowserCss[key]);
        }
    }
    if (typeof appCss != 'undefined' && lzm_chatDisplay.isApp) {
        for (key in appCss) {
            if (appCss.hasOwnProperty(key))
                $('#' + key).css(appCss[key]);
        }
    }

    return dialogId;
};

ChatDisplayHelperClass.prototype.removeDialogWindow = function(id) {
    lzm_chatServerEvaluation.settingsDialogue = false;
    if (typeof id != 'undefined' && id != '') {
        $('#' + id + '-container').remove();
    } else {
        $('.dialog-window-container').remove();
    }
    lzm_chatDisplay.createChatWindowLayout(true);
    if (lzm_chatDisplay.selected_view == 'external') {
        lzm_chatDisplay.createVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject, lzm_chatServerEvaluation.internal_users);
    }
};

ChatDisplayHelperClass.prototype.minimizeDialogWindow = function(dialogId, windowId, data, selectedView, showStoredIcon) {
    lzm_chatServerEvaluation.settingsDialogue = false;
    showStoredIcon = (typeof showStoredIcon != 'undefined') ? showStoredIcon : true;
    //console.log(dialogId);
    //console.log(windowId);
    var img = 'img/', title = '', type = '';
    switch (windowId) {
        case 'user-settings-dialog':
            img += '103-options2.png';
            title = t('Options');
            type = 'settings';
            break;
        case 'chat-invitation':
            img += '632-skills.png';
            title = t('Chat Invitation');
            type = 'visitor-invitation';
            break;
        case 'qrd-add':
            img += '059-doc_new2.png';
            title = t('Add new Resource');
            type = 'add-resource';
            break;
        case 'qrd-edit':
            img += '048-doc_edit.png';
            title = t('Edit Resource');
            type = 'edit-resource';
            break;
        case 'qrd-preview':
            img += '078-preview.png';
            title = t('Preview Resource');
            type = 'preview-resource';
            break;
        case 'operator-forward-selection':
            img += '291-switch_to_employees.png';
            title = t('Forward chat to operator.');
            type = 'operator-invitation';
            break;
        case 'ticket-details':
            img += '023-email2.png';
            title = t('Ticket Details');
            type = 'ticket-details';
            break;
        case 'qrd-tree-dialog':
            img += '607-cardfile.png';
            title = t('Resources');
            type = 'qrd-tree';
            break;
        case 'email-list':
            img += '023-email4.png';
            title = t('Emails');
            type = 'email-list';
            break;
        case 'visitor-information':
            img += '287-users.png';
            title = t('Visitor Information');
            type = 'visitor-information';
            break;
        case 'matching-chats':
            img += '217-quote.png';
            title = t('Matching Chats');
            type = 'matching-chats';
            break;
    }
    if (typeof data['exceptional-img'] != 'undefined' && data['exceptional-img'] != '') {
        img = data['exceptional-img'];
    }
    //console.log(data);
    lzm_chatDisplay.StoredDialogIds.push(dialogId);
    var domNode = $('#' + windowId + '-container').detach();
    lzm_chatDisplay.StoredDialogs[dialogId] = {'dialog-id': dialogId, 'window-id': windowId, 'content': domNode, 'data': data,
        'type': type, 'title': title, 'img': img, 'selected-view': selectedView, 'show-stored-icon': showStoredIcon};
    this.createMinimizedDialogsMenu();
    setViewSelectPanel2ImagesAndText();
    if (lzm_chatDisplay.selected_view == 'external') {
        lzm_chatDisplay.createVisitorList(lzm_chatServerEvaluation.external_users, lzm_chatServerEvaluation.chatObject, lzm_chatServerEvaluation.internal_users);
    }
    //console.log(data);
    if (typeof data.reload != 'undefined') {
        lzm_chatPollServer.stopPolling();
        if ($.inArray('chats', data.reload) != -1) {
            try {
                lzm_chatPollServer.chatArchiveFilter = window['tmp-chat-archive-values'].filter;
                lzm_chatPollServer.chatArchivePage = window['tmp-chat-archive-values'].page;
                lzm_chatPollServer.chatArchiveLimit = window['tmp-chat-archive-values'].limit;
                lzm_chatPollServer.chatArchiveQuery = window['tmp-chat-archive-values'].query;
            } catch (e) {
                lzm_chatPollServer.chatArchiveFilter = '012';
                lzm_chatPollServer.chatArchivePage = 1;
                lzm_chatPollServer.chatArchiveLimit = 20;
                lzm_chatPollServer.chatArchiveQuery = '';
            }
            lzm_chatPollServer.chatArchiveFilterExternal = '';
            lzm_chatPollServer.chatArchiveFilterGroup = '';
            lzm_chatPollServer.chatArchiveFilterInternal = '';
            lzm_chatPollServer.chatUpdateTimestamp = 0;
        }
        if ($.inArray('tickets', data.reload) != -1) {
            try {
                lzm_chatPollServer.ticketPage = window['tmp-ticket-values'].page;
                lzm_chatPollServer.ticketLimit = window['tmp-ticket-values'].limit;
                lzm_chatPollServer.ticketQuery = window['tmp-ticket-values'].query;
                lzm_chatPollServer.ticketFilter = window['tmp-ticket-values'].filter;
                lzm_chatPollServer.ticketSort = window['tmp-ticket-values'].sort;
            } catch(e) {
                lzm_chatPollServer.ticketPage = 1;
                lzm_chatPollServer.ticketLimit = 20;
                lzm_chatPollServer.ticketQuery = '';
                lzm_chatPollServer.ticketFilter = '012';
                lzm_chatPollServer.ticketSort = 'update';
            }
            lzm_chatPollServer.ticketUpdateTimestamp = 0;
        }
        lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
        lzm_chatPollServer.startPolling();
    }
};

ChatDisplayHelperClass.prototype.maximizeDialogWindow = function(dialogId) {
    lzm_chatServerEvaluation.settingsDialogue = true;
    var i = 0;
    if ($.inArray(dialogId, lzm_chatDisplay.StoredDialogIds) != -1) {
        lzm_chatDisplay.selected_view = (lzm_chatDisplay.StoredDialogs[dialogId]['selected-view'] != '') ?
            lzm_chatDisplay.StoredDialogs[dialogId]['selected-view'] : lzm_chatDisplay.selected_view;
        if (lzm_chatDisplay.selected_view != 'qrd') {
            cancelQrdPreview();
            $('#qrd-tree-body').remove();
            $('#qrd-tree-footline').remove();
        }
        lzm_chatDisplay.toggleVisibility();
        lzm_chatDisplay.createViewSelectPanel(lzm_chatDisplay.firstVisibleView);
        if (lzm_chatDisplay.selected_view == 'external') {
            $('#visitor-list-table').remove();
        }
        if (lzm_chatDisplay.selected_view == 'mychats' && typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-partner'] != 'undefined' && lzm_chatDisplay.StoredDialogs[dialogId].data['chat-partner'] != '') {
            var dialogData = lzm_chatDisplay.StoredDialogs[dialogId].data;
            if (dialogData['chat-partner'].indexOf('~') != -1) {
                if (typeof lzm_chatServerEvaluation.chatObject[dialogData['chat-partner']] != 'undefined' &&
                    $.inArray(dialogData['chat-partner'], lzm_chatDisplay.closedChats) == -1) {
                    var id = dialogData['chat-partner'].split('~')[0];
                    var b_id = dialogData['chat-partner'].split('~')[1];
                    var chat_id = (typeof dialogData['chat-id'] != 'undefined') ?
                        dialogData['chat-id'] :
                        lzm_chatServerEvaluation.chatObject[dialogData['chat-partner']].chat_id;
                    viewUserData(id, b_id, chat_id, true);
                }
            } else {
                if (typeof lzm_chatServerEvaluation.chatObject[dialogData['chat-partner']] != 'undefined' && +
                    lzm_chatServerEvaluation.chatObject[dialogData['chat-partner']].status != 'left') {
                    chatInternalWith(dialogData['chat-partner'], dialogData['chat-partner-userid'], dialogData['chat-partner-name']);
                }
            }
        }
        lzm_chatDisplay.dialogData = lzm_chatDisplay.StoredDialogs[dialogId].data;
        var dialogWindowId = lzm_chatDisplay.StoredDialogs[dialogId]['window-id'];
        var dialogContainerHtml = '<div id="' + dialogWindowId + '-container" class="dialog-window-container"></div>';
        var dialogContent = lzm_chatDisplay.StoredDialogs[dialogId].content;
        //console.log(dialogContent);
        $('#chat_page').append(dialogContainerHtml).trigger('create');
        $('#' + dialogWindowId + '-container').css(lzm_chatDisplay.dialogWindowContainerCss);
        $('#' + dialogWindowId + '-container').replaceWith(dialogContent);

        try {
            if (typeof lzm_chatDisplay.StoredDialogs[dialogId].data.editors != 'undefined') {
                for (i=0; i<lzm_chatDisplay.StoredDialogs[dialogId].data.editors.length; i++) {
                    var editorName = lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].instanceName;
                    var editorId = lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].id;
                    window[editorName] = new ChatEditorClass(editorId, lzm_chatDisplay.isMobile, lzm_chatDisplay.isApp, lzm_chatDisplay.isWeb);
                    window[editorName].init(lzm_chatDisplay.StoredDialogs[dialogId].data.editors[i].text, 'maximizeDialogWindow');
                }
            }
        } catch(e) {}
        //console.log(lzm_chatDisplay.StoredDialogs[dialogId]);
        if (lzm_chatDisplay.StoredDialogs[dialogId].data.reload != 'undefined') {
            lzm_chatPollServer.stopPolling();
            if ($.inArray('chats', lzm_chatDisplay.StoredDialogs[dialogId].data.reload) != -1) {
                var eId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] : '';
                var gId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] == 2 &&
                    typeof lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] : '';
                var iId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined' &&
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] == 0 &&
                    typeof lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['cp-id'] : '';
                var chatType = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['chat-type'] : '012';
                var chatFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
                window['tmp-chat-archive-values'] = {page: lzm_chatPollServer.chatArchivePage,
                    limit: lzm_chatPollServer.chatArchiveLimit, query: lzm_chatPollServer.chatArchiveQuery,
                    filter: lzm_chatPollServer.chatArchiveFilter};
                lzm_chatPollServer.chatArchivePage = 1;
                lzm_chatPollServer.chatArchiveLimit = 1000;
                lzm_chatPollServer.chatArchiveQuery = '';
                lzm_chatPollServer.chatArchiveFilter = '';
                lzm_chatPollServer.chatArchiveFilterExternal = eId;
                lzm_chatPollServer.chatArchiveFilterGroup = gId;
                lzm_chatPollServer.chatArchiveFilterInternal = iId;
                lzm_chatPollServer.chatUpdateTimestamp = 0;

            }
            if ($.inArray('tickets', lzm_chatDisplay.StoredDialogs[dialogId].data.reload) != -1) {
                var cpId = (typeof lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] != 'undefined') ?
                    lzm_chatDisplay.StoredDialogs[dialogId].data['visitor-id'] : 'xxxxxxxxxx';
                var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
                window['tmp-ticket-values'] = {page: lzm_chatPollServer.ticketPage, limit: lzm_chatPollServer.ticketLimit,
                    query: lzm_chatPollServer.ticketQuery, filter: lzm_chatPollServer.ticketFilter,
                    sort: lzm_chatPollServer.ticketSort};
                lzm_chatPollServer.ticketPage = 1;
                lzm_chatPollServer.ticketLimit = 1000;
                lzm_chatPollServer.ticketQuery = cpId;
                lzm_chatPollServer.ticketFilter = '0123';
                lzm_chatPollServer.ticketSort = '';
                lzm_chatPollServer.ticketUpdateTimestamp = 0;
            }
            lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
            lzm_chatPollServer.startPolling();
        }
        delete lzm_chatDisplay.StoredDialogs[dialogId];
        var tmpStoredDialogIds = [];
        for (var j=0; j<lzm_chatDisplay.StoredDialogIds.length; j++) {
            if (dialogId != lzm_chatDisplay.StoredDialogIds[j]) {
                tmpStoredDialogIds.push(lzm_chatDisplay.StoredDialogIds[j])
            }
        }
        lzm_chatDisplay.StoredDialogIds = tmpStoredDialogIds;

        $('#minb-' + dialogId).remove();
        $('#usersettings-menu').css({'display': 'none'});
    }
    this.createMinimizedDialogsMenu();
};

ChatDisplayHelperClass.prototype.showMinimizedDialogsMenu = function (hideOnly, e) {
    if (typeof e != 'undefined') {
        e.stopPropagation();
    }
    hideOnly = (typeof hideOnly != 'undefined') ? hideOnly : false;
    $('#userstatus-menu').css('display', 'none');
    $('#usersettings-menu').css('display', 'none');
    lzm_chatDisplay.showUserstatusHtml = false;
    lzm_chatDisplay.showUsersettingsHtml = false;
    if (!lzm_chatDisplay.showMinifiedDialogsHtml && !hideOnly) {
        lzm_chatDisplay.showMinifiedDialogsHtml = true;
        $('#minimized-window-list').css({display: 'block'});
        //console.log($('#minimized-window-menu').width());
        var leftMargin = Math.max(80, $('#minimized-window-menu').width() - 24);
        //console.log(leftMargin);
        $('#minimized-window-button').css({'margin-left': leftMargin + 'px', 'background-color': '#e6e6e6'});
        $('#minimized-window-button-inner').css({'background-position': '-180px -1px'});
    } else {
        lzm_chatDisplay.showMinifiedDialogsHtml = false;
        $('#minimized-window-list').css({display: 'none'});
        $('#minimized-window-button').css({'background-color': '#e0e0e0'});
        $('#minimized-window-button-inner').css({'background-position': '-216px -1px'});
    }
};

ChatDisplayHelperClass.prototype.createMinimizedDialogsMenu = function () {
    lzm_chatDisplay.showMinifiedDialogsHtml = false;
    var showMinimizedDialogMenuButton = false;
    var menuListHtml = '<table>';
    for (var i=0; i<lzm_chatDisplay.StoredDialogIds.length; i++) {
        if (lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]]['show-stored-icon']) {
            showMinimizedDialogMenuButton = true;
            var menuEntry = lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].title;
            if (typeof lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].data.menu != 'undefined') {
                menuEntry = lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].data.menu;
            }
            menuListHtml += '<tr onclick="maximizeDialogWindow(\'' + lzm_chatDisplay.StoredDialogIds[i] + '\');' +
                ' ' + this.getMyObjectName() + '.showMinimizedDialogsMenu(false, event);" class="cm-click"><td style="padding: 4px;">' +
                '<span style="background-position: left center; background-repeat: no-repeat; padding: 2px 0px 2px 20px;' +
                ' background-image: url(\'' + lzm_chatDisplay.StoredDialogs[lzm_chatDisplay.StoredDialogIds[i]].img + '\');">' +
                menuEntry + '</span></td></tr>';
        }
    }
    menuListHtml += '</table>';
    $('#minimized-window-list').html(menuListHtml).trigger('create');
    var menuCss = {position: 'absolute', top: '0px', right: '60px', 'z-index': 1000};
    var menuListCss = {'background-color': '#e6e6e6', border: '1px solid #ccc', 'border-bottom-left-radius': '4px',
        padding: '2px', display: 'none'};
    var menuButtonCss = {width: '7px', height: '14px', 'background-color': '#E0E0E0', padding: '8px 17px 8px 6px', cursor: 'pointer',
        'border-bottom-left-radius': '4px', 'border-bottom-right-radius': '4px', 'margin': '-1px 0px 0px 0px',
        'border-left': '1px solid #ccc', 'border-right': '1px solid #ccc', 'border-bottom': '1px solid #ccc'}
    $('#minimized-window-menu').css(menuCss);
    $('#minimized-window-list').css(menuListCss);
    $('#minimized-window-button').css(menuButtonCss);

    if (showMinimizedDialogMenuButton) {
        $('#minimized-window-menu').css({display: 'block'});
        if (!this.showMinimizedDialogMenuButton) {
            $('#minimized-window-button').css({'background-color': '#FFC673'});
            setTimeout(function() {
                $('#minimized-window-button').css({'background-color': '#E0E0E0'});
            }, 2000);
            this.showMinimizedDialogMenuButton = true;
        }
    } else {
        $('#minimized-window-menu').css({display: 'none'});
        this.showMinimizedDialogMenuButton = false;
    }

    //console.log($('#minimized-window-menu').width());
    var leftMargin = Math.max(80, $('#minimized-window-menu').width() - 24);
    $('#minimized-window-button').css({'margin-left': leftMargin + 'px'});

    var minBtnWidth = $('#minimized-window-button-inner').width();
    var minBtnHeight = $('#minimized-window-button-inner').height();
    var minBtnPadding = Math.floor((18-minBtnHeight)/2)+'px ' + Math.floor((18-minBtnWidth)/2)+'px ' + Math.ceil((18-minBtnHeight)/2)+'px ' + Math.ceil((18-minBtnWidth)/2)+'px';
    var menuButtonInnerCss = {'background-position': '-216px -1px', 'background-repeat': 'no-repeat',
        'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')', 'background-color': 'rgba(0,0,0,.4)',
        padding: minBtnPadding, 'border-radius': '9px'};
    $('#minimized-window-button-inner').css(menuButtonInnerCss);
};

/********************************************** Visitor functions **********************************************/

ChatDisplayHelperClass.prototype.createVisitorListLine = function(aUser, chatObject, internal_users, visitorListWidth, newLine) {
    aUser.r.sort(this.chatInvitationSortFunction);
    var extUserHtmlString = '';
    var thisUserName = aUser.id;
    if (aUser.b_cname != '') {
        thisUserName = aUser.b_cname + ' --- ' + aUser.id;
    }
    var userStyle, userStyleObject;
    if (lzm_chatDisplay.isApp) {
        userStyle = ' style="cursor: pointer; line-height: 22px !important;"';
        userStyleObject = {'cursor': 'pointer', 'font-weight': 'normal', 'line-height': '22px !important'};
    } else {
        userStyle = ' style="cursor: pointer;"';
        userStyleObject = {'cursor': 'pointer', 'font-weight': 'normal'};
    }
    var tableRowTitle = '';

    var visitorName = (this.createVisitorStrings('cname', aUser).length > 32) ?
        this.createVisitorStrings('cname', aUser).substring(0, 32) + '...' : this.createVisitorStrings('cname', aUser);
    var visitorEmail = (this.createVisitorStrings('cemail', aUser).length > 32) ?
        this.createVisitorStrings('cemail', aUser).substring(0, 32) + '...' : this.createVisitorStrings('cemail', aUser);
    var visitorCity = (typeof aUser.city != 'undefined' && aUser.city.length > 32) ? aUser.city.substring(0, 32) + '...' : aUser.city;
    var visitorPage = this.createVisitorPageString(aUser);
    var visitorRegion = (typeof aUser.region != 'undefined' && aUser.region.length > 32) ? aUser.region.substring(0, 32) + '...' : aUser.region;
    var visitorISP = (typeof aUser.isp != 'undefined' && aUser.isp.length > 32) ? aUser.isp.substring(0, 32) + '...' : aUser.isp;
    var visitorCompany = (this.createVisitorStrings('ccompany', aUser).length > 32) ?
        this.createVisitorStrings('ccompany', aUser).substring(0, 32) + '...' : this.createVisitorStrings('ccompany', aUser);
    var visitorSystem = (aUser.sys.length > 32) ? aUser.sys.substring(0, 32) + '...' : aUser.sys;
    var visitorBrowser = (aUser.bro.length > 32) ? aUser.bro.substring(0, 32) + '...' : aUser.bro;
    var visitorResolution = (aUser.res.length > 32) ? aUser.res.substring(0, 32) + '...' : aUser.res;
    var visitorHost = (aUser.ho.length > 32) ? aUser.ho.substring(0,32) + '...' : aUser.ho;
    var lastVisitedDate = lzm_chatTimeStamp.getLocalTimeObject(aUser.vl * 1000, true);
    var visitorLastVisited = lzm_commonTools.getHumanDate(lastVisitedDate, 'full', lzm_chatDisplay.userLanguage);
    var visitorSearchStrings = (this.createVisitorStrings('ss', aUser).length > 32) ?
        this.createVisitorStrings('ss', aUser).substring(0, 32) + '...' : this.createVisitorStrings('ss', aUser);


    var visitorOnlineSince = this.calculateTimeDifferenece(aUser, 'lastOnline', false)[0];
    var visitorLastActivity = this.calculateTimeDifferenece(aUser, 'lastActive', false)[0];

    var visitorInvitationStatus = '';
    var visitorInvitationLogo = 'img/632-skills_gray.png';
    if (aUser.r.length > 0) {
        if (aUser.r[0].s != '' && aUser.r[0].ca == '' && aUser.r[0].a == 0 && aUser.r[0].de == 0) {
            visitorInvitationLogo = 'img/632-skills.png';
            visitorInvitationStatus = 'requested'
        } else if(aUser.r[0].s != '' && aUser.r[0].a == '1') {
            visitorInvitationLogo = 'img/632-skills_ok.png';
            visitorInvitationStatus = 'accepted';
        } else if(aUser.r[0].s != '' && aUser.r[0].ca != '') {
            visitorInvitationLogo = 'img/632-skills_not.png';
            visitorInvitationStatus = 'revoked';
        } else if(aUser.r[0].s != '' && aUser.r[0].de == '1') {
            visitorInvitationLogo = 'img/632-skills_not.png';
            visitorInvitationStatus = 'declined';
        }
    }

    var chatQuestion = '';
    if (typeof aUser.b_chat.eq != 'undefined') {
        chatQuestion = aUser.b_chat.eq.substr(0, 32);
        if (aUser.b_chat.eq.length > 32) {
            chatQuestion += '...';
        }
    }

    var visitorIsChatting = false;
    for (var glTypInd=0; glTypInd<lzm_chatServerEvaluation.global_typing.length; glTypInd++) {
        if (lzm_chatServerEvaluation.global_typing[glTypInd].id.indexOf('~') != -1 &&
            lzm_chatServerEvaluation.global_typing[glTypInd].id.split('~')[0] == aUser.id) {
            visitorIsChatting = true;
            break;
        }
    }
    var visitorWasDeclined = true;
    if (visitorIsChatting) {
        for (var bInd=0; bInd<aUser.b.length; bInd++) {
            if (typeof aUser.b[bInd].chat.pn != 'undefined') {
                if (aUser.b[bInd].chat.pn.member.length == 0) {
                    visitorWasDeclined = false;
                }
                for (var mInd=0; mInd<aUser.b[bInd].chat.pn.member.length; mInd++) {
                    if (aUser.b[bInd].chat.pn.member[mInd].dec == 0) {
                        visitorWasDeclined = false;
                    }
                }
            }
        }
    } else {
        visitorWasDeclined = false;
    }

    var onclickAction = '', oncontextmenuAction = '', ondblclickAction = '';
    if (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) {
        onclickAction = ' onclick="openVisitorListContextMenu(event, \'' + aUser.id + '\', \'' + visitorIsChatting + '\', \'' +
            visitorWasDeclined + '\', \'' + visitorInvitationStatus + '\', \'' + visitorInvitationLogo + '\');"';
    } else {
        onclickAction = ' onclick="selectVisitor(event, \'' + aUser.id + '\');"';
        oncontextmenuAction = ' oncontextmenu="openVisitorListContextMenu(event, \'' + aUser.id + '\', \'' + visitorIsChatting + '\', \'' +
            visitorWasDeclined + '\', \'' + visitorInvitationStatus + '\');"';
        ondblclickAction = ' ondblclick="showVisitorInfo(\'' + aUser.id + '\');"';
    }
    if (newLine) {
        extUserHtmlString += '<tr' + userStyle + tableRowTitle + ' id="visitor-list-row-' + aUser.id + '" data-md5="' + aUser.md5 + '"' +
            ' data-user-id="' + aUser.id + '" class="visitor-list-line lzm-unselectable"' + onclickAction + oncontextmenuAction + ondblclickAction +'>';
    }

    var numberOfActiveInstances = 0;
    var activeInstanceNumber = 0;
    for (var j = 0; j < aUser.b.length; j++) {
        if (aUser.b[j].is_active && aUser.b[j].h2.length > 0) {
            numberOfActiveInstances++;
            activeInstanceNumber = j;
        }
    }
    extUserHtmlString += '<td class="icon-column" style="background-image: url(\'./php/common/flag.php?cc=' + aUser.ctryi2 + '\'); ' +
        'background-position: center; background-repeat: no-repeat; padding-left: 20px;"></td>';
    if (visitorIsChatting && !visitorWasDeclined) {
        extUserHtmlString += '<td class="icon-column" nowrap style="padding-top: 1px; line-height: ' + lineHeight + '; background-image: url(\'./img/217-quote.png\'); background-repeat: no-repeat; background-position: center;">' +
            '</td>';
    } else {
        extUserHtmlString += '<td class="icon-column" nowrap style="padding-top: 1px; line-height: ' + lineHeight + '; background-image: url(\'./img/217-quote_gray.png\'); background-repeat: no-repeat; background-position: center;">' +
            '</td>';
    }
    var lineHeight = '18px';
    if (lzm_chatDisplay.isMobile || lzm_chatDisplay.isApp) {
        lineHeight = '18px';
    }
    extUserHtmlString += '<td class="icon-column" nowrap style="line-height: ' + lineHeight + '; background-image: url(\'' + visitorInvitationLogo + '\'); background-repeat: no-repeat; background-position: center;">&nbsp;</td>';
    extUserHtmlString += '<td nowrap id="visitor-online-' + aUser.id + '">' + visitorOnlineSince.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap id="visitor-activ-' + aUser.id + '">' + visitorLastActivity.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorName.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap class="userlist external-user-' + aUser.id + '">' + aUser.ctryi2.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + aUser.lang.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorRegion.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorCity.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap style="line-height:16px;">' + visitorPage + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorSearchStrings.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorHost.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + aUser.ip.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorEmail.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorCompany.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorBrowser.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorResolution.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorSystem.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorLastVisited.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    extUserHtmlString += '<td nowrap>' + visitorISP.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var customInputId = lzm_chatServerEvaluation.inputList.idList[i];
        if (parseInt(customInputId) < 111 && lzm_chatServerEvaluation.inputList.getCustomInput(customInputId).active == 1) {
            extUserHtmlString += '<td nowrap>' + this.createCustomInputString(aUser, customInputId).replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</td>';
        }
    }

    if (newLine) {
        extUserHtmlString += '</tr>';
    }

    //console.log(extUserHtmlString);
    return [extUserHtmlString, userStyleObject, onclickAction.replace(/^ onclick="/, '').replace(/"$/, ''),
        ondblclickAction.replace(/^ ondblclick="/, '').replace(/"$/, ''), oncontextmenuAction.replace(/^ oncontextmenu="/, '').replace(/"$/, '')];
};

ChatDisplayHelperClass.prototype.createCustomInputString = function(visitor, inputId) {
    var customInputString = null, i = 0;
    var existingCustomInputs = {};
    var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(inputId);
    if (myCustomInput.type == 'ComboBox') {
        for (i=0; i<visitor.b.length; i++) {
            if (customInputString == null && typeof visitor.b[i]['cf' + inputId] != 'undefined') {
                customInputString = visitor.b[i]['cf' + inputId] + ', ' + myCustomInput.value[visitor.b[i]['cf' + inputId]];
                existingCustomInputs['cf' + inputId] = [visitor.b[i]['cf' + inputId]];
            } else if (typeof visitor.b[i]['cf' + inputId] != 'undefined' && $.inArray(visitor.b[i]['cf' + inputId], existingCustomInputs['cf' + inputId]) == -1) {
                customInputString += ', ' + visitor.b[i]['cf' + inputId] + ', ' + myCustomInput.value[visitor.b[i]['cf' + inputId]];
                existingCustomInputs['cf' + inputId].push(visitor.b[i]['cf' + inputId]);
            }
        }
    } else if (myCustomInput.type == 'CheckBox') {
        for (i=0; i<visitor.b.length; i++) {
            if (customInputString == null && typeof visitor.b[i]['cf' + inputId] != 'undefined') {
                customInputString = (visitor.b[i]['cf' + inputId] == 1) ? t('Yes') : t('No');
                existingCustomInputs['cf' + inputId] = [visitor.b[i]['cf' + inputId]];
            } else if (typeof visitor.b[i]['cf' + inputId] != 'undefined' && $.inArray(visitor.b[i]['cf' + inputId], existingCustomInputs['cf' + inputId]) == -1) {
                var newString = (visitor.b[i]['cf' + inputId] == 1) ? t('Yes') : t('No');
                customInputString += ', ' + newString;
                existingCustomInputs['cf' + inputId].push(visitor.b[i]['cf' + inputId]);
            }
        }
    } else {
        for (i=0; i<visitor.b.length; i++) {
            if ((customInputString == null || customInputString == '-') && typeof visitor.b[i]['cf' + inputId] != 'undefined') {
                customInputString = (visitor.b[i]['cf' + inputId] != '') ? lzm_commonTools.htmlEntities(visitor.b[i]['cf' + inputId]) : '-';
                existingCustomInputs['cf' + inputId] = [visitor.b[i]['cf' + inputId]];
            } else if (typeof visitor.b[i]['cf' + inputId] != 'undefined' && $.inArray(visitor.b[i]['cf' + inputId], existingCustomInputs['cf' + inputId]) == -1 &&
                visitor.b[i]['cf' + inputId] != '') {
                customInputString += ', ' + lzm_commonTools.htmlEntities(visitor.b[i]['cf' + inputId]);
                existingCustomInputs['cf' + inputId].push(visitor.b[i]['cf' + inputId]);
            }
        }
    }

    customInputString = (customInputString != null) ? customInputString : '-';
    return customInputString;
};

ChatDisplayHelperClass.prototype.getVisitorOnlineTimes = function(visitor) {
    var rtObject = {};
    rtObject['online'] = this.calculateTimeDifferenece(visitor, 'lastOnline', false)[0].replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;');
    rtObject['activ'] = this.calculateTimeDifferenece(visitor, 'lastActive', false)[0].replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;');
    return rtObject;
};

ChatDisplayHelperClass.prototype.getVisitorListLinePosition = function(aUser, externalUsers) {
    var nextLine = 'visitor-list-row-NONE';
    var aUserTimestamp = this.getVisitorOnlineTimestamp(aUser);
    var tmpTimestamp = 4294967295;
    for (var i=0; i<externalUsers.length; i++) {
        var thisUserTimestamp = this.getVisitorOnlineTimestamp(externalUsers[i]);
        if (thisUserTimestamp >= aUserTimestamp && externalUsers[i].id != aUser.id && thisUserTimestamp <= tmpTimestamp) {
            nextLine = 'visitor-list-row-' + externalUsers[i].id;
            tmpTimestamp = thisUserTimestamp;
        }
    }
    return nextLine;
};

ChatDisplayHelperClass.prototype.getVisitorOnlineTimestamp = function(aUser) {
    var selectedUserOnlineBeginn = 4294967295;
    for (var i=0; i<aUser.b.length; i++) {
        if (typeof aUser.b[i].h2 != 'undefined') {
            for (var j=0; j<aUser.b[i].h2.length; j++) {
                selectedUserOnlineBeginn = (aUser.b[i].h2[j].time < selectedUserOnlineBeginn) ? aUser.b[i].h2[j].time : selectedUserOnlineBeginn;
            }
        }
    }
    return selectedUserOnlineBeginn;
};

ChatDisplayHelperClass.prototype.createVisitorInformation = function(internal_users, thisUser) {
    var visitorInfoHtml = '', visitorInfoArray;
    if (typeof thisUser.id != 'undefined' && thisUser.id != '' && typeof thisUser.b_id != 'undefined') {
        var thisChatQuestion = '';
        var thisChatId = '';
        if (typeof thisUser.b_chat != 'undefined') {
            thisChatId = thisUser.b_chat.id;
            thisChatQuestion = (typeof thisUser.b_chat.eq != 'undefined') ? thisUser.b_chat.eq : '';
        }
        var visitorName = this.createVisitorStrings('cname', thisUser);
        var visitorEmail = this.createVisitorStrings('cemail', thisUser);
        var visitorCompany = this.createVisitorStrings('ccompany', thisUser);
        var visitorPage = this.createVisitorPageString(thisUser);
        var visitorSearchString = this.createVisitorStrings('ss', thisUser);
        var lastVisitedDate = lzm_chatTimeStamp.getLocalTimeObject(thisUser.vl * 1000, true);
        var visitorLastVisit = lzm_commonTools.getHumanDate(lastVisitedDate, 'full', lzm_chatDisplay.userLanguage);
        var tmpDate = this.calculateTimeDifferenece(thisUser, 'lastOnline', true);
        var onlineTime = tmpDate[0];
        tmpDate = lzm_chatTimeStamp.getLocalTimeObject(tmpDate[1]);
        var humanDate = lzm_commonTools.getHumanDate(tmpDate, 'all', lzm_chatDisplay.userLanguage);
        var visitorAreas = this.createVisitorAreaString(thisUser);
        var visitorJavascript = (thisUser.js == '1') ? t('Yes') : t('No');
        var pagesBrowsed = 0;
        for (var l=0; l<thisUser.b.length; l++) {
            for (var m=0; m<thisUser.b[l].h2.length; m++) {
                pagesBrowsed += 1;
            }
        }
        var visitorStatus = t('<!--status_style_begin-->Online<!--status_style_end-->',[
            ['<!--status_style_begin-->','<span style="color:#00aa00; font-weight: bold;">'],['<!--status_style_end-->','</span>']
        ]);
        if (typeof thisUser.is_active != 'undefined' && thisUser.is_active == false) {
            visitorStatus = t('<!--status_style_begin-->Offline<!--status_style_end-->',[
                ['<!--status_style_begin-->','<span style="color:#aa0000; font-weight: bold;">'],['<!--status_style_end-->','</span>']
            ]);
        }

        var visitorIsChatting = false;
        for (var glTypInd=0; glTypInd<lzm_chatServerEvaluation.global_typing.length; glTypInd++) {
            if (lzm_chatServerEvaluation.global_typing[glTypInd].id.indexOf('~') != -1 &&
                lzm_chatServerEvaluation.global_typing[glTypInd].id.split('~')[0] == thisUser.id) {
                visitorIsChatting = true;
                break;
            }
        }
        var visitorWasDeclined = true;
        var chatPartners = [];
        if (visitorIsChatting) {
            for (var bInd=0; bInd<thisUser.b.length; bInd++) {
                if (typeof thisUser.b[bInd].chat.pn != 'undefined') {
                    for (var mInd=0; mInd<thisUser.b[bInd].chat.pn.member.length; mInd++) {
                        if (thisUser.b[bInd].chat.pn.member[mInd].dec == 0) {
                            visitorWasDeclined = false;
                            chatPartners.push(thisUser.b[bInd].chat.pn.member[mInd].id);
                        }
                    }
                }
            }
        } else {
            visitorWasDeclined = false;
        }

        visitorInfoArray = {
            details: {title: t('Visitor Details'), rows: [
                {title: t('Status'), content: visitorStatus},
                {title: t('Name'), content: visitorName},
                {title: t('Email'), content: visitorEmail},
                {title: t('Company'), content: visitorCompany},
                {title: t('Language'), content: thisUser.lang}
            ]},
            location: {title: t('Location'), rows: [
                {title: t('City'), content: thisUser.city},
                {title: t('Region'), content: thisUser.region},
                {title: t('Country'), content: '<span style="background: url(\'./php/common/flag.php?cc=' + thisUser.ctryi2 + '\') left no-repeat; padding-left: 23px;">' + thisUser.ctryi2 + '</span>'},
                {title: t('Time Zone'), content: t('GMT <!--tzo-->', [['<!--tzo-->', thisUser.tzo]])}
            ]},
            device: {title: t('Visitor\'s Computer / Device'), rows: [
                {title: t('Resolution'), content: thisUser.res},
                {title: t('Operating system'), content: thisUser.sys},
                {title: t('Browser'), content: thisUser.bro},
                {title: t('Javascript'), content: visitorJavascript},
                {title: t('IP address'), content: thisUser.ip},
                {title: t('Host'), content: thisUser.ho},
                {title: t('ISP'), content: thisUser.isp},
                {title: t('User-ID'), content: thisUser.id}
            ]},
            misc: {title: t('Misc'), rows: [
                {title: t('Date'), content: humanDate},
                {title: t('Online Time'), content: onlineTime},
                {title: t('Area(s)'), content: visitorAreas},
                {title: t('Search string'), content: visitorSearchString},
                {title: t('Page'), content: visitorPage},
                //FIXME {title: t('Geo Tracking'), content: ''}, missing
                {title: t('Pages browsed'), content: pagesBrowsed},
                {title: t('Visits'), content: thisUser.vts},
                {title: t('Last Visit'), content: visitorLastVisit},
                {title: t('Question'), content: lzm_commonTools.htmlEntities(thisChatQuestion)}
            ]}
        };
        if (visitorIsChatting && !visitorWasDeclined) {
            var chatPartnerNames = [];
            for (var i=0; i<chatPartners.length; i++) {
                for (var j=0; j<internal_users.length; j++) {
                    if (internal_users[j].id == chatPartners[i]) {
                        chatPartnerNames.push(internal_users[i].name);
                    }
                }
            }
            visitorInfoArray.misc.rows.push({title: t('Chating with'), content: chatPartnerNames.join(', ')});
        }
    } else {
        visitorStatus = t('<!--status_style_begin-->Offline<!--status_style_end-->',[
            ['<!--status_style_begin-->','<span style="color:#aa0000; font-weight: bold;">'],['<!--status_style_end-->','</span>']
        ]);
        visitorInfoArray = {details: {title: t('Visitor Details'), rows: [
                {title: t('Status'), content: visitorStatus},{title: t('Name'), content: thisUser.unique_name}
        ]}};
    }
    for (var myKey in visitorInfoArray) {
        if (visitorInfoArray.hasOwnProperty(myKey)) {
            visitorInfoHtml += '<table class="visitor-list-table alternating-rows-table" style="width: 100%; margin-bottom: 8px;">' +
                '<thead><tr><th colspan="2">' + visitorInfoArray[myKey].title + '</th></tr></thead><tbody>';
            for (var k=0; k<visitorInfoArray[myKey].rows.length; k++) {
                visitorInfoHtml += '<tr>' +
                    '<td style="text-align: left; width: 100px; font-weight: bold;" nowrap>' + visitorInfoArray[myKey].rows[k].title + '</td>' +
                    '<td style="text-align: left;">' + visitorInfoArray[myKey].rows[k].content + '</td>' +
                    '</tr>';
            }
            visitorInfoHtml += '</tbody></table>';
        }
    }
    return visitorInfoHtml;
};

ChatDisplayHelperClass.prototype.createVisitorInvitation = function(visitor) {
    var pmLanguages = lzm_chatUserActions.getPmLanguages('');

    var groups = [];
    var i;
    for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
        if (lzm_chatServerEvaluation.myId == lzm_chatServerEvaluation.internal_users[i].id) {
            groups = lzm_chatServerEvaluation.internal_users[i].groups;
        }
    }
    var groupObject = {};
    for (i=0; i<lzm_chatServerEvaluation.internal_departments.length; i++) {
        groupObject[lzm_chatServerEvaluation.internal_departments[i].id] = lzm_chatServerEvaluation.internal_departments[i];
    }
    var browsers = [];
    try {
        for (i=0; i<visitor.b.length; i++) {
            //if (visitor.b[i].olc == 1 && visitor.b[i].id.indexOf('_OVL') == -1 && visitor.b[i].is_active) {
            var historyLength = visitor.b[i].h2.length;
            var browserType = (historyLength > 0) ? visitor.b[i].h2[historyLength - 1].cp : 1;
            if (browserType != 1 && visitor.b[i].id.indexOf('_OVL') == -1 && visitor.b[i].is_active) {
                var thisBrowser = lzm_commonTools.clone(visitor.b[i]);
                var historyLastEntry = thisBrowser.h2.length - 1;
                thisBrowser.url = thisBrowser.h2[historyLastEntry].url;
                var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(thisBrowser.h2[historyLastEntry].time * 1000, true);
                thisBrowser.time = lzm_commonTools.getHumanDate(tmpDate, 'time', lzm_chatDisplay.userLanguage);
                browsers.push(thisBrowser);
            }
        }
    } catch(ex) {}
    var visitorLangString = visitor.lang.toUpperCase().substr(0,2);

    var languageSelectHtml = '<label for="language-selection" style="font-size: 12px;">' + t('Language:') + '</label><br />' +
        '<select id="language-selection" data-role="none">';
    visitorLangString = ($.inArray(visitorLangString, pmLanguages.group) != -1) ? visitorLangString : pmLanguages['default'][1];
    var defaultDefinedBy = pmLanguages['default'][0];
    for (i=0; i<pmLanguages.group.length; i++) {
        if (defaultDefinedBy == 'group' && visitorLangString == pmLanguages.group[i]) {
            languageSelectHtml += '<option selected="selected" value="' + pmLanguages.group[i] + '---group">' + pmLanguages.group[i] + ' (' + t('Group') + ')</option>';
        } else {
            languageSelectHtml += '<option value="' + pmLanguages.group[i] + '---group">' + pmLanguages.group[i] + ' (' + t('Group') + ')</option>';
        }
    }
    for (i=0; i<pmLanguages.user.length; i++) {
        if (defaultDefinedBy == 'user' && visitorLangString == pmLanguages.user[i]) {
            languageSelectHtml += '<option selected="selected" value="' + pmLanguages.user[i] + '---user">' + pmLanguages.user[i] + ' (' + t('Operator') + ')</option>';
        } else {
            languageSelectHtml += '<option value="' + pmLanguages.user[i] + '---user">' + pmLanguages.user[i] + ' (' + t('Operator') + ')</option>';
        }
    }
    languageSelectHtml += '</select>';
    var groupSelectHtml = '<label for="group-selection" style="font-size: 12px;">' + t('Group:') + '</label><br />' +
        '<select id="group-selection" data-role="none">';
    for (i=0; i<groups.length; i++) {
        groupSelectHtml += '<option value="' + groups[i] + '">' + groupObject[groups[i]].name + '</option>';
    }
    groupSelectHtml += '</select>';
    var browserSelectHtml = '<label for="browser-selection" style="font-size: 12px;">' + t('Browser:') + '</label><br />' +
        '<select id="browser-selection" data-role="none">';
    if (browsers.length != 0) {
        for (i=0; i<browsers.length; i++) {
            browserSelectHtml += '<option value="' + browsers[i].id + '">Browser ' + (i + 1) + ': ' + browsers[i].url + ' (' + browsers[i].time + ')</option>';
        }
    } else {
        browserSelectHtml += '<option value="-1">' + t('No active browser') + '</option>';
    }
    browserSelectHtml += '</select>';
    var textInputHtml = '<label for="invitation-text" style="font-size: 12px; background-color: #ffffff;">' + t('Invitation text:') + '</label>' +
        '<div id="invitation-text-inner">' +
        '<div id="invitation-text-controls">' +
        this.createInputControlPanel('basic').replace(/lzm_chatInputEditor/g,'messageEditor') +
        '</div><div id="invitation-text-body">' +
        '<textarea id="invitation-text"></textarea></div>' +
        '</div>';
    var invitationHtml = '<fieldset id="user-invite-form" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Chat Invitation') + '</legend>' +
        '<div id="user-invite-form-inner">' +
        '<table style="width: 100%;">' +
        '<tr><td style="width:50%;">' + languageSelectHtml + '</td><td style="width:50%;">' + groupSelectHtml + '</td></tr>' +
        '<tr><td colspan="2">' + browserSelectHtml + '</td></tr>' +
        '<tr><td colspan="2">' + textInputHtml + '</td></tr>' +
        '</table>' +
        '</div></fieldset>';

    return invitationHtml;
};

ChatDisplayHelperClass.prototype.createBrowserHistory = function (visitor) {
    var browserHistoryHtml = '<table class="browser-history visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;">' +
        '<thead><tr>' +
        '<th nowrap>' + t('Browser') + '</th>' +
        '<th nowrap>' + t('Time') + '</th>' +
        '<th nowrap>' + t('Time span') + '</th>' +
        '<th nowrap>' + t('Area') + '</th>' +
        '<th nowrap>' + t('Title') + '</th>' +
        '<th nowrap>' + t('Url') + '</th>' +
        '<th nowrap>' + t('Referrer') + '</th>' +
        '</tr></thead><tbody>';
    var lineCounter = 0;
    var browserCounter = 1;
    try {
        for (var i = 0; i < visitor.b.length; i++) {
            if (visitor.b[i].id.indexOf('OVL') == -1) {
                for (var j = 0; j < visitor.b[i].h2.length; j++) {
                    var browserIcon = 'img/300-web2_gray.png';
                    var beginTime = lzm_chatTimeStamp.getLocalTimeObject(visitor.b[i].h2[j].time * 1000, true);
                    var beginTimeHuman = lzm_commonTools.getHumanDate(beginTime, 'shorttime', lzm_chatDisplay.userLanguage);
                    var endTime = lzm_chatTimeStamp.getLocalTimeObject();
                    if (visitor.b[i].h2.length > j + 1) {
                        endTime = lzm_chatTimeStamp.getLocalTimeObject(visitor.b[i].h2[j + 1].time * 1000, true);
                    } else if (typeof visitor.b[i].h2[j].time2 != 'undefined') {
                        endTime = lzm_chatTimeStamp.getLocalTimeObject(visitor.b[i].h2[j].time2 * 1000, true);
                    }
                    var endTimeHuman = lzm_commonTools.getHumanDate(endTime, 'shorttime', lzm_chatDisplay.userLanguage);
                    var timeSpan = this.calculateTimeSpan(beginTime, endTime);
                    var referer = '';
                    if (i == 0) {
                        referer = visitor.b[i].ref;
                    }
                    if (j > 0) {
                        try {
                            referer = visitor.b[i].h2[j - 1].url
                        } catch(ex) {}
                    }
                    if (visitor.b[i].is_active && j == visitor.b[i].h2.length - 1) {
                        browserIcon = 'img/300-web2.png';
                    }
                    var externalPageUrl = '';
                    try {
                        externalPageUrl = visitor.b[i].h2[j].url;
                    } catch(ex) {}
                    var refererLink = (referer != '') ? '<a class="lz_chat_link_no_icon" href="#" onclick="openLink(\'' + referer + '\')">' + referer : '';
                    browserHistoryHtml += '<tr class="lzm-unselectable">' +
                        '<td nowrap><span style=\'background-image: url("' + browserIcon + '"); background-position: left center; background-repeat: no-repeat;' +
                        'margin-left: 3px; padding-left: 23px; font-weight: bold;\'>' +
                        (browserCounter) + '</span></td>' +
                        '<td nowrap>' + beginTimeHuman + ' - ' + endTimeHuman + '</td>' +
                        '<td nowrap>' + timeSpan + '</td>' +
                        '<td nowrap>' + visitor.b[i].h2[j].code + '</td>' +
                        '<td nowrap>' + visitor.b[i].h2[j].title + '</td>' +
                        '<td nowrap><a class="lz_chat_link_no_icon" href="#" onclick="openLink(\'' + externalPageUrl + '\')">' + externalPageUrl + '</a></td>' +
                        '<td nowrap>' + refererLink + '</a></td>' +
                        '</tr>';
                    lineCounter++;
                }
                browserCounter++;
            }
        }
    } catch(e) {}
    browserHistoryHtml += '</tbody></table>';

    return browserHistoryHtml;
};

ChatDisplayHelperClass.prototype.createVisitorStrings = function(type, aUser) {
    //console.log(aUser);
    //console.log(type);
    var returnListString = '';
    var visitorStringList = [];
    if (type.indexOf('.') != -1) {
        type = type.split('.');
    } else {
        type = [type];
    }
    if (aUser.b.length > 0) {
        for (var i=0; i<aUser.b.length; i++) {
            if (type.length == 1) {
                if (typeof aUser.b[i][type[0]] != 'undefined' && aUser.b[i][type[0]] != '' &&
                    $.inArray(aUser.b[i][type[0]], visitorStringList) == -1) {
                    visitorStringList.push(lzm_commonTools.htmlEntities(aUser.b[i][type[0]]));
                }
            } else {
                if (typeof aUser.b[i][type[0]][type[1]] != 'undefined' && aUser.b[i][type[0]][type[1]] != '' &&
                    $.inArray(aUser.b[i][type[0]][type[1]], visitorStringList) == -1) {
                    visitorStringList.push(lzm_commonTools.htmlEntities(aUser.b[i][type[0]][type[1]]));
                }
            }
        }
    }
    if (typeof visitorStringList != undefined && visitorStringList instanceof Array && visitorStringList.length > 0) {
        returnListString = visitorStringList.join(', ');
    }
    return returnListString;
};

ChatDisplayHelperClass.prototype.createVisitorPageString = function(aUser) {
    var activeBrowserCounter = 0;
    var activeBrowserUrl = '';
    try {
        for (var i=0; i< aUser.b.length; i++) {
            if (aUser.b[i].id.indexOf('OVL') == -1 && aUser.b[i].is_active) {
                activeBrowserCounter++;
                var historyLength = aUser.b[i].h2.length;
                var url = aUser.b[i].h2[historyLength - 1].url;
                var text = (url.length > 128) ? url.substring(0,124) : url;
                activeBrowserUrl = '<a href="#" class="lz_chat_link_no_icon" data-role="none" onclick="openLink(\'' + url + '\');">' + text + '</a>';
            }
        }
    } catch(ex) {}
    if (activeBrowserCounter > 1) {
        activeBrowserUrl = t('<!--number_of_browsers--> Browsers', [['<!--number_of_browsers-->', activeBrowserCounter]]);
    }
    return activeBrowserUrl;
};

ChatDisplayHelperClass.prototype.createVisitorAreaString = function(aUser) {
    var areaArray = [];
    for (var i=0; i<aUser.b.length; i++) {
        for (var j=0; j<aUser.b[i].h2.length; j++) {
            if (aUser.b[i].h2[j].code != '' && $.inArray(aUser.b[i].h2[j].code, areaArray) == -1) {
                areaArray.push(aUser.b[i].h2[j].code);
            }
        }
    }

    return areaArray.join(', ');
};

ChatDisplayHelperClass.prototype.chatInvitationSortFunction = function(a, b) {
    var rtValue = 0;
    if (a.c > b.c) {
        rtValue = -1;
    } else if (a.c < b.c) {
        rtValue = 1;
    }
    return rtValue;
};

ChatDisplayHelperClass.prototype.createVisitorCommentTable = function(visitor, operators) {
    var operatorObject = {};
    for (var j=0; j<operators.length; j++) {
        operatorObject[operators[j].id] = operators[j];
    }
    var userName = (visitor.b_cname != '') ? visitor.b_cname : visitor.unique_name;
    var menuEntry = t('Visitor Information: <!--name-->', [['<!--name-->', userName]]);
    var selectedRow = (typeof $('#visitor-comment-list').data('selected-row') != 'undefined') ?  $('#visitor-comment-list').data('selected-row') : 0;
    var commentTableHtml = '<table class="visitor-list-table alternating-rows-table lzm-unselectable" id="visitor-comment-table" style="width: 100%;">' +
        '<thead><tr>' +
        '<th style="width: 18px !important;"></th>' +
        '<th>' + t('Date') + '</th>' +
        '<th>' + t('Operator') + '</th>' +
        '</tr></thead><tbody>';
    try {
        for (var i=0; i<visitor.c.length; i++) {
            var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(visitor.c[i].c * 1000, true);
            var humanDate = lzm_commonTools.getHumanDate(tmpDate, 'all', lzm_chatDisplay.userLanguage);
            var selectedClass = (selectedRow == i) ? ' selected-table-line' : '';
            commentTableHtml += '<tr onclick="handleVisitorCommentClick(' + i + ');"' +
                ' style="cursor: pointer;" id="visitor-comment-line-' + i + '" class="visitor-comment-line lzm-unselectable' + selectedClass + '"' +
                ' data-comment-no="' + i + '">' +
                '<td style="background-image: url(\'img/052-doc_user.png\'); background-repeat: no-repeat; background-position: center;"></td>' +
                '<td>' + humanDate + '</td>' +
                '<td>' + operatorObject[visitor.c[i].o].name + '</td>' +
                '</tr>';
        }
    } catch(e) {}
    commentTableHtml += '</tbody></table><div style="margin-top: 20px; margin-bottom: 10px; text-align: right;">' +
        this.createButton('add-comment', '', 'lzm_chatDisplay.addVisitorComment(\'' + visitor.id + '\', \'' + menuEntry + '\')', t('Add'), '', 'lr',
            {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Add Comment')) + '</div>';

    return commentTableHtml;
};

ChatDisplayHelperClass.prototype.createVisitorInvitationTable = function(visitor, operators) {
    var operatorObject = {};
    for (var j=0; j<operators.length; j++) {
        operatorObject[operators[j].id] = operators[j];
    }
    var invitationTableHtml = '<table class="visitor-list-table alternating-rows-table lzm-unselectable" id="visitor-invitation-table" style="width: 100%";>' +
        '<thead><tr>' +
        '<th style="width: 8px !important; padding-left: 11px; padding-right: 11px;"></th>' +
        '<th>' + t('Date') + '</th>' +
        '<th>' + t('Sender') + '</th>' +
        '<th>' + t('Event') + '</th>' +
        '<th>' + t('Shown') + '</th>' +
        '<th>' + t('Accepted') + '</th>' +
        '<th>' + t('Declined') + '</th>' +
        '<th>' + t('Canceled') + '</th>' +
        '</tr></thead><tbody>';
    try {
        for (var i=0; i<visitor.r.length; i++) {
            var invImage = 'img/632-skills_not.png';
            if (visitor.r[i].s != '' && visitor.r[i].a == '0' && visitor.r[i].ca == '' && visitor.r[i].de == '0') {
                invImage = 'img/632-skills.png';
            } else if (visitor.r[i].s != '' && visitor.r[i].a == '1' && visitor.r[i].ca == "") {
                invImage = 'img/632-skills_ok.png';
            }
            var tmpDate = lzm_chatTimeStamp.getLocalTimeObject(visitor.r[i].c * 1000, true);
            var timeHuman = lzm_commonTools.getHumanDate(tmpDate, 'all', lzm_chatDisplay.userLanguage);
            var operatorName = '';
            try {
                operatorName = operatorObject[visitor.r[i].s].name;
            } catch(e) {}
            var myEvent = (visitor.r[i].e != '') ? visitor.r[i].e : '-';
            var isShown = (visitor.r[i].d == "1") ? t('Yes') : t('No');
            var isAccepted = (visitor.r[i].a == "1" && visitor.r[i].ca == "") ? t('Yes') : t('No');
            var isDeclined = (visitor.r[i].de == "1") ? t('Yes') : t('No');
            var isCanceled = (visitor.r[i].ca != "") ? t('Yes (<!--op_name-->)', t('Timeout')) : t('No');
            try {
                isCanceled = (visitor.r[i].ca != "") ? t('Yes (<!--op_name-->)', [['<!--op_name-->', operatorObject[visitor.r[i].ca].name]]) : t('No');
            } catch(e) {}
            invitationTableHtml += '<tr class="lzm-unselectable">' +
                '<td style="background-image: url(\'' + invImage + '\'); background-position: center; background-repeat: no-repeat;"></td>' +
                '<td>' + timeHuman + '</td>' +
                '<td>' + operatorName + '</td>' +
                '<td>' + myEvent + '</td>' +
                '<td>' + isShown + '</td>' +
                '<td>' + isAccepted + '</td>' +
                '<td>' + isDeclined + '</td>' +
                '<td>' + isCanceled + '</td>' +
                '</tr>';
        }
    } catch(e) {}
    invitationTableHtml += '</tbody></table>';

    return invitationTableHtml;
};

ChatDisplayHelperClass.prototype.createVisitorFilterMainHtml = function(visitor) {
    var filterHtml = '<fieldset class="lzm-fieldset" data-role="none" id="visitor-filter-main">' +
        '<legend>' + t('Filter') + '</legend>' +
        '<table>' +
        '<tr>' +
        '<td>' + t('Filter Name:') + '</td>' +
        '<td><input type="text" data-role="none" class="lzm-filter-input-main" id="filter-name" value="-" /></td>' +
        '</tr><tr>' +
        '<td></td><td><input type="checkbox" data-role="none" id="filter-active" checked="checked" /><label for="filter-active">' + t('Filter active') + '</label></td>' +
        '</tr><tr>' +
        '<td>' + t('Filter Type:') + '</td>' +
        '<td><select data-role="none" class="lzm-filter-input-main" id="filter-type">' +
        '<option value="0">' + t('Blacklist: Block all users matching this filter (default)') + '</option>' +
        '<option value="1">' + t('Whitelist: Pass only users matching this filter') + '</option>' +
        '</select></td>' +
        '</tr>' +
        '</table>' +
        '</fieldset><fieldset style="margin-top: 10px;" class="lzm-fieldset" data-role="none" id="visitor-filter-base">' +
        '<legend>' + t('Based On') + '</legend>' +
        '<table>' +
        '<tr>' +
        '<td><input type="checkbox" data-role="none" id="filter-ip-check" checked="checked" /><label for="filter-ip-check">' + t('IP Address') + '</label><br />&nbsp;</td>' +
        '<td><input type="text" data-role="none" class="lzm-filter-input-main" id="filter-ip" value="' + visitor.ip + '" /><br />' +
        t('Use * as wildcard') + '</td>' +
        '</tr><tr>' +
        '<td><input type="checkbox" data-role="none" id="filter-id-check" checked="checked" /><label for="filter-id-check">' + t('User ID') + '</label></td>' +
        '<td><input type="text" data-role="none" class="lzm-filter-input-main" id="filter-id" value="' + visitor.id + '" /></td>' +
        '</tr><tr>' +
        '<td><input type="checkbox" data-role="none" id="filter-lg-check" /><label for="filter-lg-check">' + t('Languages') + '</label><br />&nbsp;</td>' +
        '<td><input type="text" data-role="none" class="lzm-filter-input-main" id="filter-lg" /><br />' + t('Comma separated, two letter codes') +'</td>' +
        '</tr>' +
        '</table>' +
        '</fieldset>';
    return filterHtml;
};

ChatDisplayHelperClass.prototype.createVisitorFilterReasonHtml = function() {
    var filterHtml = '<fieldset class="lzm-fieldset" data-role="none" id="visitor-filter-reason">' +
        '<legend>' + t('Reason') + '</legend>' +
        '<div>' + t('Please enter a reason for banning this user. The reason text will be shown to the banned person and saved on the server.') + '</div>' +
        '<input type="text" data-role="none" style="width: 99%;" class="lzm-filter-input" id="filter-reason" />' +
        '</fieldset>';
    return filterHtml;
};

ChatDisplayHelperClass.prototype.createVisitorFilterExpirationHtml = function() {
    var filterHtml = '<fieldset class="lzm-fieldset" data-role="none" id="visitor-filter-expiration">' +
        '<legend>' + t('Expiration') + '</legend>' +
        '<div>' +
        '<input type="checkbox" data-role="none" id="filter-exp-check" checked="checked" /><label for="filter-exp-check">' + t('Expire after') + '</label>' +
        '&nbsp;&nbsp;<input type="text" data-role="none" style="width: 30px;" class="lzm-filter-input" id="filter-expire-after" value="7" />&nbsp;&nbsp;' + t('days') +
        '</div><div>' +
        '<input type="checkbox" data-role="none" id="filter-chat-check" />' +
        '<label for="filter-chat-check">' + t('User is allowed to start chats when filtered.') + '</label>' +
        '</div>'
        '</fieldset>';
    return filterHtml;
};

/********************************************** Archive functions **********************************************/

ChatDisplayHelperClass.prototype.createArchiveHtml = function(chatArchive, operators, groups, chatId, inDialog) {
    chatId = (typeof chatId != 'undefined' && chatId != '') ? chatId : (chatArchive.length > 0) ? chatArchive[0].cid : '';
    var i, operatorObject = {}, groupObject = {};
    for (i=0; i<operators.length; i++) {
        operatorObject[operators[i].id] = operators[i];
    }
    for (i=0; i<groups.length; i++) {
        groupObject[groups[i].id] = groups[i];
    }
    var tableId = (inDialog) ? 'matching-chats-table' : 'chat-archive-table';
    var archiveHtml = '<table id="' + tableId + '" class="visitor-list-table alternating-rows-table lzm-unselectable"' +
        ' data-selected-chat-id="' + chatId + '">' +
        '<thead><tr>' +
        '<th>' + t('Date') + '</th>' +
        '<th>' + t('Chat ID') + '</th>' +
        '<th>' + t('Name') + '</th>' +
        '<th>' + t('Operator') + '</th>' +
        '<th>' + t('Group') + '</th>' +
        '<th>' + t('Email') + '</th>' +
        '<th>' + t('Company') + '</th>' +
        '<th>' + t('Language') + '</th>' +
        '<th>' + t('Country') + '</th>' +
        '<th>' + t('IP') + '</th>' +
        '<th>' + t('Host') + '</th>' +
        '<th>' + t('Duration') + '</th>' +
        '<th>' + t('Area Code') + '</th>' +
        '<th>' + t('Waiting Time') + '</th>' +
        '<th>' + t('Result') + '</th>' +
        '<th>' + t('Ended By') + '</th>' +
        '<th>' + t('Callback') + '</th>' +
        '<th>' + t('Phone') + '</th>';
    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
            archiveHtml += '<th>' + myCustomInput.name + '</th>';
        }
    }
    archiveHtml += '</tr></thead><tbody>';
    for (i=0; i<chatArchive.length; i++) {
        archiveHtml += this.createArchiveListLine(chatArchive[i], operatorObject, groupObject, chatId, inDialog);
    }
    archiveHtml += '</tbody></table>';

    return archiveHtml;
};

ChatDisplayHelperClass.prototype.createArchiveListLine = function(aChat, operatorObject, groupObject, selectedChatId, inDialog) {
    var name = '', operatorName = '', groupName = '';
    var date = lzm_commonTools.getHumanDate(lzm_chatTimeStamp.getLocalTimeObject(aChat.ts * 1000, true), '', lzm_chatDisplay.userLanguage);
    var duration = lzm_commonTools.getHumanTimeSpan(parseInt(aChat.te) - parseInt(aChat.ts));
    var opId, cpId, qId;
    if (aChat.t == 0) {
        var opList = aChat.iid.split('-');
        var myPosition = $.inArray(lzm_chatDisplay.myId, opList);
        if (myPosition != -1) {
            opId = opList[myPosition];
            cpId = opList[1 - myPosition];
        } else {
            opId = opList[0];
            cpId = opList[1];
        }
        qId = aChat.iid;
    } else {
        opId = aChat.iid;
        cpId = (aChat.eid != '') ? aChat.eid : aChat.gid;
        qId = cpId;
    }
    try {
        name = (aChat.t == 0) ? operatorObject[cpId].name : (aChat.t == 1) ? lzm_commonTools.htmlEntities(aChat.en) :
            (aChat.gid == 'everyoneintern') ? t('All operators') : capitalize(aChat.gid);
    } catch (e) {}
    try {
        operatorName = (opId != '' && typeof operatorObject[opId] != 'undefined') ? operatorObject[opId].name : '-';
    } catch (e) {}
    try {
        groupName = (aChat.gid != '') ? (aChat.gid != 'everyoneintern') ? groupObject[aChat.gid].name : t('All operators') : '-';
    } catch (e) {groupName = aChat.gid;}
    var area = (aChat.ac != '') ? aChat.ac : '-';
    var waitingTime = (aChat.t == 1) ? lzm_commonTools.getHumanTimeSpan(parseInt(aChat.wt)) : '-';
    var result = (aChat.t == 1) ? (aChat.sr == 0) ? t('Missed') : (aChat.sr == 1) ? t('Accepted') : t('Declined') : '-';
    var endedBy = (aChat.t == 1) ? (aChat.er == 0) ? t('User') : t('Operator') : '-';
    var callBack = (aChat.t == 1) ? (aChat.cmb != 0) ? t('Yes') : t('No') : '-';
    var email = (aChat.em != '') ? lzm_commonTools.htmlEntities(aChat.em) : '-';
    var company = (aChat.co != '') ? lzm_commonTools.htmlEntities(aChat.co) : '-';
    var language = (aChat.il != '') ? aChat.il : '-';
    var country = (aChat.ic != '') ? aChat.ic : '-';
    var ipAddress = (aChat.ip != '') ? aChat.ip : '-';
    var host = (aChat.ho != '') ? aChat.ho : '-';
    var phone = (aChat.cp != '') ? lzm_commonTools.htmlEntities(aChat.cp) : '-';
    var action = (!inDialog) ? (lzm_chatDisplay.isApp || lzm_chatDisplay.isMobile) ?
        ' onclick="showArchivedChat(\'' + qId + '\', \'' + name + '\', \'' + aChat.cid + '\', \'' + aChat.t + '\');"' :
        ' onclick="selectArchivedChat(\'' + aChat.cid + '\', false);"' +
            ' ondblclick="showArchivedChat(\'' + qId + '\', \'' + name + '\', \'' + aChat.cid + '\', \'' + aChat.t + '\');"' :
        ' onclick="selectArchivedChat(\'' + aChat.cid + '\', true);"';
    var selectedClass = (aChat.cid == selectedChatId) ? ' selected-table-line' : '';
    var lineAttributes = (inDialog) ?
        ' data-chat-id="' + aChat.cid + '" id="dialog-archive-list-line-' + aChat.cid + '" class="archive-list-line' + selectedClass + '"' :
        ' id="archive-list-line-' + aChat.cid + '" class="archive-list-line"';
    var archiveLineHtml = '<tr' + action + lineAttributes + ' style="cursor:pointer;">' +
        '<td>' + date + '</td>' +
        '<td>' + aChat.cid + '</td>' +
        '<td>' + name + '</td>' +
        '<td>' + operatorName + '</td>' +
        '<td>' + groupName + '</td>' +
        '<td>' + email + '</td>' +
        '<td>' + company + '</td>' +
        '<td>' + language + '</td>' +
        '<td>' + country + '</td>' +
        '<td>' + ipAddress + '</td>' +
        '<td>' + host + '</td>' +
        '<td>' + duration + '</td>' +
        '<td>' + area + '</td>' +
        '<td>' + waitingTime + '</td>' +
        '<td>' + result + '</td>' +
        '<td>' + endedBy + '</td>' +
        '<td>' + callBack + '</td>' +
        '<td>' + phone + '</td>';
    for (var i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
        if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
            var inputText = '';
            for (var j=0; j<aChat.cc.length; j++) {
                if (aChat.cc[j].cuid == myCustomInput.name) {
                    inputText = (myCustomInput.type != 'CheckBox') ? lzm_commonTools.htmlEntities(aChat.cc[j].text) :
                        (aChat.cc[j].text == 1) ? t('Yes') : t('No');
                }
                inputText = (inputText != '') ? inputText : '-';
            }
            archiveLineHtml += '<td>' + inputText + '</td>';
        }
    }
    archiveLineHtml += '</tr>';

    //console.log(archiveLineHtml);
    return archiveLineHtml;
};

ChatDisplayHelperClass.prototype.createArchivePagingHtml = function(page, amount, amountPerPage) {
    var numberOfPages = Math.max(1, Math.ceil(amount / amountPerPage));
    var pagingHtml = '<span id="archive-paging">';
    var leftDisabled = (page == 1) ? ' ui-disabled' : '';
    var rightDisabled = (page == numberOfPages) ? ' ui-disabled' : '';
    if (!isNaN(numberOfPages)) {
        pagingHtml += this.createButton('archive-page-all-backward', 'archive-list-page-button' + leftDisabled, 'pageArchiveList(1);', '', 'img/415-skip_backward.png', 'l',
            {'cursor': 'pointer', 'padding': '4px 15px'}) +
    this.createButton('archive-page-one-backward', 'archive-list-page-button' + leftDisabled, 'pageArchiveList(' + (page - 1) + ');', '', 'img/414-rewind.png', 'r',
                {'cursor': 'pointer', 'padding': '4px 15px'}) +
    '<span style="padding: 0px 15px;">' + t('Page <!--this_page--> of <!--total_pages-->',[['<!--this_page-->', page], ['<!--total_pages-->', numberOfPages]]) + '</span>' +
    this.createButton('archive-page-one-forward', 'archive-list-page-button' + rightDisabled, 'pageArchiveList(' + (page + 1) + ');', '', 'img/420-fast_forward.png', 'l',
                {'cursor': 'pointer', 'padding': '4px 15px'}) +
    this.createButton('archive-page-all-forward', 'archive-list-page-button' + rightDisabled, 'pageArchiveList(' + numberOfPages + ');', '', 'img/419-skip_forward.png', 'r',
                {'cursor': 'pointer', 'padding': '4px 15px'});
    }
    pagingHtml += '</span>';

    return pagingHtml;
};

ChatDisplayHelperClass.prototype.createArchiveHeaderControls = function(page, amount, amountPerPage, totalAmount, filter, query) {
    var controlHtml = '';
    if ($(window).width() > 500) {
        controlHtml += '<span style="float: left; margin-top: 14px;">';
        if (query != '' || filter != '012') {
            controlHtml += t('<!--total_amount--> total entries, <!--amount--> matching filter', [['<!--total_amount-->', totalAmount], ['<!--amount-->', amount]]);
        } else {
            controlHtml += t('<!--total_amount--> total entries, no filter selected', [['<!--total_amount-->', totalAmount]]);
        }
        controlHtml += '</span>';
    }
    var displayClearBtn = (query == '') ? 'none' : 'inline';
    controlHtml += this.createButton('archive-filter', '', 'openArchiveFilterMenu(event, \'' + filter + '\')', t('Filter'), 'img/023-email_filter.png', 'lr',
            {'margin-right': '8px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        '<span>' +
        '<input placeholder="' + t('Search') + '" type="text" id="search-archive" value="' + query + '" data-role="none" />' +
        '<span id="clear-archive-search" style="margin-left: -2px; margin-right: 6px;' +
        ' background-image: url(\'js/jquery_mobile/images/icons-18-white.png\'); background-repeat: no-repeat;' +
        ' background-position: -73px -1px; border-radius: 9px; background-color: rgba(0,0,0,0.4); cursor: pointer;' +
        ' display: ' + displayClearBtn + ';">&nbsp;</span>' +
        '</span>';

    return controlHtml;
};

ChatDisplayHelperClass.prototype.createMatchingChats = function(operators, groups, chatId) {
    operators = (typeof operators != 'undefined') ? operators : [];
    groups = (typeof groups != 'undefined') ? groups : [];
    var matchingChatsHtml = '<fieldset class="lzm-fieldset" data-role="none" id="matching-chats-inner">' +
        '<legend>' + t('Matching Chats') + '</legend>' +
        this.createArchiveHtml([], operators, groups, chatId, true) +
        '</fieldset>';

    return matchingChatsHtml;
};

/************************************************* Other views  ************************************************/

ChatDisplayHelperClass.prototype.createSettingsHtml = function() {
    var i;
    if (lzm_chatDisplay.playNewTicketSound == '-') {
        lzm_commonStorage.loadProfileData();
        for (i=0; i<lzm_commonStorage.storageData.length; i++) {
            if (lzm_commonStorage.storageData[i].index == chosenProfile['index']) {
                try {
                    lzm_chatDisplay.playNewTicketSound = lzm_commonStorage.loadValue('play_incoming_ticket_sound_' + chosenProfile['index']);
                } catch(e) {}
            }
        }
    }

    var newMessageSoundChecked = (lzm_chatDisplay.playNewMessageSound == 1) ? ' checked="checked"' : '';
    var newChatSoundChecked = (lzm_chatDisplay.playNewChatSound == 1) ? ' checked="checked"' : '';
    var repeatChatSoundChecked = (lzm_chatDisplay.repeatNewChatSound == 1) ? ' checked="checked"' : '';
    var backgroundModeChecked = (lzm_chatDisplay.backgroundModeChecked != 0) ? ' checked="checked"' : '';
    var saveConnectionsChecked = (lzm_chatDisplay.saveConnections != 0 && lzm_chatDisplay.backgroundModeChecked != 0) ? ' checked="checked"' : '';
    var saveConnectionsDisabled = (lzm_chatDisplay.backgroundModeChecked != 1) ? ' class="ui-disabled"' : '';
    var newTicketSoundChecked = (lzm_chatDisplay.playNewTicketSound == 1) ? ' checked="checked"' : '';
    var autoAcceptDisabledClass = (lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'can_auto_accept', {}) &&
        !lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'must_auto_accept', {})) ? '' : ' class="ui-disabled"';
    var autoAcceptChat = ((lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'can_auto_accept', {}) &&
        lzm_chatDisplay.autoAcceptChecked == 1) ||
        lzm_commonPermissions.checkUserPermissions(lzm_chatDisplay.myId, 'chats', 'must_auto_accept', {})) ? ' checked="checked"' : '';

    var notificationSettings = '<fieldset id="notification-settings" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Sounds') + '</legend><div id="notification-settings-div" style="padding: 0px 6px;">';
    if (!lzm_chatDisplay.isApp || (appOs != 'ios')) {
        notificationSettings += '<div style="padding: 5px 0px;"><div style="margin-bottom: 5px;">' + t('Volume') + '</div>' +
            '<select id="volume-slider" name="volume-slider" class="lzm-select" data-role="none">';
        var volumeStep = 10;
        for (i=0; i<=100; i +=volumeStep) {
            var selectedString = (i <= lzm_chatDisplay.volume && i + volumeStep > lzm_chatDisplay.volume) ? ' selected="selected"' : '';
            notificationSettings += '<option value="' + i + '"' + selectedString + '>' + i + ' %</option>';
        }
        notificationSettings += '</select></div>';
    }
    notificationSettings += '<div style="padding: 5px 0px;">' +
        '<input type="checkbox" value="1" data-role="none" id="sound-new-message"' + newMessageSoundChecked + ' />' +
        '<label for="sound-new-message">' + t('New Message') + '</label>' +
        '</div>' +
        '<div style="padding: 5px 0px;">' +
        '<span><input type="checkbox" value="1" data-role="none" id="sound-new-chat"' + newChatSoundChecked + ' />' +
        '<label for="sound-new-chat">' + t('New external Chat') + '</label></span><br />' +
        '<span style="padding-left: 20px;"><input type="checkbox" value="1" data-role="none" id="sound-repeat-new-chat"' + repeatChatSoundChecked + ' />' +
        '<label for="sound-repeat-new-chat">' + t('Keep ringing until allocated') + '</label></span>' +
        '</div>' +
        '<div style="padding: 5px 0px;">' +
        '<input type="checkbox" value="1" data-role="none" id="sound-new-ticket"' + newTicketSoundChecked + ' />' +
        '<label for="sound-new-ticket">' + t('New Ticket') + '</label>' +
        '</div>' +
        '</div></fieldset>' +
        '<input type="hidden" value="0" id="away-after-time" />';
    var generalSettings = '<fieldset id="chat-settings"  class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Chats') + '</legend><div style="padding: 5px 0px;"' + autoAcceptDisabledClass + '>' +
        '<input type="checkbox" value="1" data-role="none" id="auto-accept"' + autoAcceptChat + ' />' +
        '<label for="auto-accept">' + t('Automatically accept chats') + '</label>' +
        '</div></fieldset>';
    if (lzm_chatDisplay.isApp && appOs == 'android') {
        generalSettings += '<fieldset id="background-settings" class="lzm-fieldset" data-role="none" style="margin-top: 5px;">' +
            '<legend>' + t('Online status') + '</legend><div style="padding: 5px 0px;">' +
            '<input type="checkbox" value="1" data-role="none" id="background-mode"' + backgroundModeChecked + ' />' +
            '<label for="background-mode">' + t('Keep active in background mode') + '</label>' +
            '</div><div id="save-connections-div"' + saveConnectionsDisabled + ' style="padding: 5px 0px;">' +
            '<input type="checkbox" value="1" data-role="none" id="save-connections"' + saveConnectionsChecked + ' />' +
            '<label for="save-connections">' + t('Save connections / battery') + '</label>' +
            '</div></fieldset>';
    }
    var viewSelectSettings = '<fieldset id="view-select-settings" class="lzm-fieldset" data-role="none">' +
        this.createViewSelectSettings(lzm_chatDisplay.viewSelectArray, lzm_chatDisplay.showViewSelectPanel) + '</fieldset>';

    var settingsTabList = [{name: t('General'), content: generalSettings}, {name: t('Notifications'), content: notificationSettings},
        {name: t('Panel'), content: viewSelectSettings}];

    return settingsTabList;
};

ChatDisplayHelperClass.prototype.createViewSelectSettings = function(viewSelectArray, showViewSelectPanel) {
    var viewSelectSettings = '<legend>' + t('Panel') + '</legend><div style="padding: 0px 6px;">' +
        '<div>' + t('Select, which views are visible in the view select panel:') + '</div>';
    for (i=0; i<viewSelectArray.length; i++) {
        var thisViewId = viewSelectArray[i].id;
        var thisViewName = viewSelectArray[i].name;
        var showThisViewChecked = (showViewSelectPanel[thisViewId] != 0) ? ' checked="checked"' : '';
        var displayMode = (i == 0) ? 'block' : 'none';
        var cssClasses = 'show-view-div';
        if (lzm_chatDisplay.isApp && appOs == 'android')
            cssClasses += ' android';
        if (i == 0)
        cssClasses += ' selected-panel-settings-line';
        viewSelectSettings += '<div style="padding: 5px 0px;" data-view-id="' + thisViewId + '"' +
            ' class="' + cssClasses + '" id="show-view-div-' + thisViewId + '">' +
            '<span class="view-select-settings-checkbox"><input type="checkbox" value="1" data-role="none"' +
            ' class="check-view" id="show-' + thisViewId + '"' + showThisViewChecked + ' /></span>' +
            '<span>' + thisViewName + '</span>' +
            '<span class="position-change-buttons" id="position-change-buttons-' + thisViewId + '" style="display: ' + displayMode + '">' +
            '<span class="position-change-buttons-up">&nbsp;</span>' +
            '<span class="position-change-buttons-down">&nbsp;</span>' +
            '</span></div>';
    }
    viewSelectSettings += '</div>';
    return viewSelectSettings;
};

ChatDisplayHelperClass.prototype.createViewSelectPanel = function(firstVisibleView, counter) {
    firstVisibleView = (typeof firstVisibleView != 'undefined') ? firstVisibleView : lzm_chatDisplay.firstVisibleView;
    var firstVisibleViewIndex, mychatsViewIndex, i, buttonBackground, selectButtonClass;
    for (i=0; i<lzm_chatDisplay.viewSelectArray.length; i++) {
        if (lzm_chatDisplay.viewSelectArray[i].id == firstVisibleView) {
            firstVisibleViewIndex = i;
        }
        if (lzm_chatDisplay.viewSelectArray[i].id == 'mychats') {
            mychatsViewIndex = i;
        }
    }
    counter = (typeof counter != 'undefined') ? counter : 0;
    lzm_chatDisplay.firstVisibleView = firstVisibleView;
    $('body').append('<div id="test-tab-width-container" style="position: absolute; left: -1000px; top: -1000px;' +
        ' width: 800px; height: 100px;"></div>').trigger('create');
    var testWidthContainer = $('#test-tab-width-container');//text-shadow: #2373a5 0px 1px 0px;

    var viewSelectpanelButtons = [], additionalSelectButtons = [], buttonMinWidth = 0, calculatedWidth1 = 0, calculatedWidth2 = 0;
    var testHtml, paddingLeft, paddingRight, paddingTop, paddingBottom, buttonCounter = 0;
    var numbersHtml = '';
    var totalWidth = $('#user-control-panel').width();
    var viewSelectArray = lzm_chatDisplay.viewSelectArray;
    var firstViewIndex = viewSelectArray.length;
    for (i=0; i<viewSelectArray.length; i++) {
        firstViewIndex = (viewSelectArray[i].id == firstVisibleView) ? i : firstViewIndex;
        if (lzm_chatDisplay.showViewSelectPanel[viewSelectArray[i].id] != 0 && i >= firstViewIndex) {
            buttonBackground = (lzm_chatDisplay.chatsViewMarked && viewSelectArray[i].id == 'mychats') ? 'darkorange' :
                (lzm_chatDisplay.selected_view == viewSelectArray[i].id) ? 'selectedViewSelect' : 'darkViewSelect';
            selectButtonClass = (lzm_chatDisplay.chatsViewMarked && viewSelectArray[i].id == 'mychats') ? 'view-select-button-marked' :
                (lzm_chatDisplay.selected_view == viewSelectArray[i].id) ? 'view-select-button-selected' : 'view-select-button';
            var thisButtonHtml = '<span style="white-space: nowrap; padding-left: 31px; padding-right: 31px;' +
                ' background-image: ' + this.addBrowserSpecificGradient('', buttonBackground) + '"' +
                ' id="view-select-' + viewSelectArray[i].id + '" class="lzm-unselectable ' + selectButtonClass + '%BORDERCLASS%"' +
                ' onclick="selectView(\'' + viewSelectArray[i].id + '\');"><span style="white-space: nowrap; padding-left: 1px; padding-right: 1px;" class="view-select-button-inner">' +
                viewSelectArray[i].name + '<!--numbers--></span></span>';
            if (viewSelectArray[i].id == 'tickets') {
                var numberOfUnreadTickets = (typeof lzm_chatDisplay.ticketGlobalValues.u != 'undefined') ? lzm_chatDisplay.ticketGlobalValues.u : 0;
                var numberOfEmails = (typeof lzm_chatDisplay.ticketGlobalValues.e != 'undefined') ? lzm_chatDisplay.ticketGlobalValues.e : 0;
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span style="font-weight: normal; font-size: 11px;">(' + numberOfUnreadTickets + '/' + numberOfEmails + ')</span>' :
                    '(' + numberOfUnreadTickets + '/' + numberOfEmails + ')';
                thisButtonHtml = thisButtonHtml.replace(/<!--numbers-->/, '&nbsp;' + numbersHtml);
            } else if (viewSelectArray[i].id == 'mychats') {
                numbersHtml = (!lzm_chatDisplay.isApp && !lzm_chatDisplay.isMobile) ?
                    '<span style="font-weight: normal; font-size: 11px;">(' + lzm_chatDisplay.myChatsCounter + ')</span>' :
                    '(' + lzm_chatDisplay.myChatsCounter + ')';
                thisButtonHtml = thisButtonHtml.replace(/<!--numbers-->/, '&nbsp;' + numbersHtml);
            }
            testHtml = thisButtonHtml.replace(/id="view-select-/, 'id="test-view-select-').replace(/%BORDERCLASS%/, '');
            testWidthContainer.html(testHtml);
            var thisButtonWidth = $('#test-view-select-' + viewSelectArray[i].id).width() + 42;
            buttonMinWidth = Math.max(buttonMinWidth, thisButtonWidth);
            if ((buttonCounter + 1) * buttonMinWidth < totalWidth) {
                viewSelectpanelButtons.push({id: viewSelectArray[i].id, html: thisButtonHtml, width: thisButtonWidth});
                buttonCounter++;
            } else {
                additionalSelectButtons.push({id: viewSelectArray[i].id, html: thisButtonHtml, width: thisButtonWidth});
            }
        }
    }
    buttonBackground = (mychatsViewIndex < firstVisibleViewIndex && lzm_chatDisplay.chatsViewMarked) ? 'darkorange' : 'darkViewSelect';
    selectButtonClass = (mychatsViewIndex < firstVisibleViewIndex && lzm_chatDisplay.chatsViewMarked) ? 'view-select-button-marked' : 'view-select-button';
    var leftButton = {id: 'left', html:'<span style="padding-left: 1px; padding-right: 1px;' +
        ' background-image: ' + this.addBrowserSpecificGradient('', buttonBackground) + '"' +
        ' id="view-select-left" class="lzm-unselectable ' + selectButtonClass + '%BORDERCLASS%"' +
        ' onclick="moveViewSelectPanel(\'left\');"><span style="padding-left: 10px; padding-right: 10px;" class="view-select-button-inner" id="view-select-inner-left">' +
        '<span class="view-select-arrow view-select-arrow-left"%PADDING%>&nbsp;</span></span></span>', width: 42};
    var lastVisibleViewIndex = firstVisibleViewIndex + viewSelectpanelButtons.length - 1;
    buttonBackground = (mychatsViewIndex > lastVisibleViewIndex && lzm_chatDisplay.chatsViewMarked) ? 'darkorange' : 'darkViewSelect';
    selectButtonClass = (mychatsViewIndex > lastVisibleViewIndex && lzm_chatDisplay.chatsViewMarked) ? 'view-select-button-marked' : 'view-select-button';
    var rightButton = {id: 'left', html:'<span style="padding-left: 1px; padding-right: 1px;' +
        ' background-image: ' + this.addBrowserSpecificGradient('', buttonBackground) + '"' +
        ' id="view-select-right" class="lzm-unselectable ' + selectButtonClass + '%BORDERCLASS%"' +
        ' onclick="moveViewSelectPanel(\'right\');"><span style="padding-left: 10px; padding-right: 10px;" class="view-select-button-inner" id="view-select-inner-right">' +
        '<span class="view-select-arrow view-select-arrow-right"%PADDING%>&nbsp;</span></span><span>', width: 42};
    testHtml = leftButton.html.replace(/id="view-select-left"/, 'id="test-view-select-left"').replace(/id="view-select-inner-left"/, 'id="test-view-select-inner-left"').
        replace(/%PADDING%/, '').replace(/%BORDERCLASS%/, ' view-select-left');
    testWidthContainer.html(testHtml);
    paddingLeft = Math.floor((18 - $('#test-view-select-inner-left').children('span').width()) / 2);
    paddingRight = Math.ceil((18 - $('#test-view-select-inner-left').children('span').width()) / 2);
    paddingTop = Math.floor((18 - $('#test-view-select-inner-left').children('span').height()) / 2);
    paddingBottom = Math.ceil((18 - $('#test-view-select-inner-left').children('span').height()) / 2);
    leftButton.html = leftButton.html.replace(/%PADDING%/, ' style="padding: ' + paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px;"');
    testHtml = rightButton.html.replace(/id="view-select-right"/, 'id="test-view-select-right"').replace(/id="view-select-inner-right"/, 'id="test-view-select-inner-right"').
        replace(/%PADDING%/, '').replace(/%BORDERCLASS%/, ' view-select-right');
    testWidthContainer.html(testHtml);
    paddingLeft = Math.floor((18 - $('#test-view-select-inner-right').children('span').width()) / 2);
    paddingRight = Math.ceil((18 - $('#test-view-select-inner-right').children('span').width()) / 2);
    paddingTop = Math.floor((18 - $('#test-view-select-inner-right').children('span').height()) / 2);
    paddingBottom = Math.ceil((18 - $('#test-view-select-inner-right').children('span').height()) / 2);
    rightButton.html = rightButton.html.replace(/%PADDING%/, ' style="padding: ' + paddingTop + 'px ' + paddingRight + 'px ' + paddingBottom + 'px ' + paddingLeft + 'px;"');

    calculatedWidth1 = Math.ceil(totalWidth / viewSelectpanelButtons.length);
    calculatedWidth2 = totalWidth - ((viewSelectpanelButtons.length - 1) * calculatedWidth1);
    if (additionalSelectButtons.length > 0 || firstViewIndex != 0) {
        var widthReduction1 = Math.round(42 / viewSelectpanelButtons.length);
        var widthReduction2 = 42 - ((viewSelectpanelButtons.length - 1) *  widthReduction1);
        if (additionalSelectButtons.length > 0 && firstViewIndex != 0) {
            widthReduction1 = Math.round(84 / viewSelectpanelButtons.length);
            widthReduction2 = 84 - ((viewSelectpanelButtons.length - 1) *  widthReduction1);
        }
        //console.log(widthReduction1, widthReduction2);
        calculatedWidth1 -= widthReduction1;
        calculatedWidth2 -= widthReduction2;
    }
    for (i=0; i<viewSelectpanelButtons.length - 1; i++) {
        paddingLeft = Math.floor((calculatedWidth1 - viewSelectpanelButtons[i]['width']) / 2) + 20;
        paddingRight = Math.ceil((calculatedWidth1 - viewSelectpanelButtons[i]['width']) / 2) + 20;
        viewSelectpanelButtons[i]['html'] = viewSelectpanelButtons[i]['html'].
            replace(/padding-left: 1px;/, 'padding-left: ' + (paddingLeft) + 'px;').
            replace(/padding-right: 1px;/, 'padding-right: ' + (paddingRight) + 'px;').
            replace(/padding-left: 31px;/, 'padding-left: 1px;').
            replace(/padding-right: 31px;/, 'padding-right: 1px;');
    }
    try {
    paddingLeft = Math.floor((calculatedWidth2 - viewSelectpanelButtons[viewSelectpanelButtons.length - 1]['width']) / 2) + 20;
    paddingRight = Math.ceil((calculatedWidth2 - viewSelectpanelButtons[viewSelectpanelButtons.length - 1]['width']) / 2) + 20;
    viewSelectpanelButtons[viewSelectpanelButtons.length - 1]['html'] = viewSelectpanelButtons[viewSelectpanelButtons.length - 1]['html'].
        replace(/padding-left: 1px;/, 'padding-left: ' + (paddingLeft) + 'px;').
        replace(/padding-right: 1px;/, 'padding-right: ' + (paddingRight) + 'px;').
        replace(/padding-left: 31px;/, 'padding-left: 1px;').
        replace(/padding-right: 31px;/, 'padding-right: 1px;');
    } catch(e) {}
    for (i=0; i<additionalSelectButtons.length; i++) {
        paddingLeft = Math.floor((calculatedWidth1 - additionalSelectButtons[i]['width']) / 2) + 20;
        paddingRight = Math.ceil((calculatedWidth1 - additionalSelectButtons[i]['width']) / 2) + 20;
        additionalSelectButtons[i]['html'] = additionalSelectButtons[i]['html'].
            replace(/padding-left: 1px;/, 'padding-left: ' + (paddingLeft) + 'px;').
            replace(/padding-right: 1px;/, 'padding-right: ' + (paddingRight) + 'px;').
            replace(/padding-left: 31px;/, 'padding-left: 1px;').
            replace(/padding-right: 31px;/, 'padding-right: 1px;');
    }

    var viewSelectPanelHtml = '';
    if (firstViewIndex != 0) {
        viewSelectpanelButtons.unshift(leftButton);
    }
    if (additionalSelectButtons.length > 0) {
        viewSelectpanelButtons.push(rightButton);
    }
    for (i=0; i<viewSelectpanelButtons.length; i++) {
        if (i == 0) {
            viewSelectpanelButtons[i]['html'] = viewSelectpanelButtons[i]['html'].replace(/%BORDERCLASS%/, ' view-select-left');
        } else if (i == viewSelectpanelButtons.length - 1) {
            viewSelectpanelButtons[i]['html'] = viewSelectpanelButtons[i]['html'].replace(/%BORDERCLASS%/, ' view-select-right');
        } else {
            viewSelectpanelButtons[i]['html'] = viewSelectpanelButtons[i]['html'].replace(/%BORDERCLASS%/, '');
        }
        viewSelectPanelHtml += viewSelectpanelButtons[i]['html']
    }
    //console.log(viewSelectPanelHtml);

    $('#test-tab-width-container').remove();

    //console.log((new Error).stack);
    //console.log(firstVisibleView, lzm_chatDisplay.viewSelectArray[0].id, counter);
    if (firstVisibleView != lzm_chatDisplay.viewSelectArray[0].id && (viewSelectpanelButtons.length + 1) * buttonMinWidth < totalWidth && counter < 10) {
        counter++;
        var newFirstViewSelectIndex = Math.max(0, firstVisibleViewIndex - 1);
        return this.createViewSelectPanel(lzm_chatDisplay.viewSelectArray[newFirstViewSelectIndex].id, counter);
    }
    return {html: viewSelectPanelHtml, visible: viewSelectpanelButtons, invisible: additionalSelectButtons};
};

/**************************************** Some general helper functions ****************************************/

ChatDisplayHelperClass.prototype.createInputControlPanel = function(mode, disabledClass) {
    disabledClass = (typeof disabledClass != 'undefined') ? disabledClass : '';
    var panelHtml = '';
    if (!lzm_chatDisplay.isMobile && !lzm_chatDisplay.isApp) {
        panelHtml += this.createButton('editor-bold-btn', disabledClass, 'lzm_chatInputEditor.bold();', '<span style="font-weight: bold;">B</span>', '', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
            this.createButton('editor-italic-btn', disabledClass, 'lzm_chatInputEditor.italic();', '<span style="font-style: italic;">I</span>', '', 'lr',
                {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
            this.createButton('editor-underline-btn', disabledClass, 'lzm_chatInputEditor.underline();', '<span style="text-decoration: underline;">U</span>', '', 'lr',
                {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    }
    if (mode != 'basic') {
        panelHtml +=  this.createButton('send-qrd', disabledClass, 'lzm_chatInputEditor.underline();', '', 'img/607-cardfile.png', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}, t('Resources'));
    }

    return panelHtml;
};

ChatDisplayHelperClass.prototype.createButton = function(myId, myClass, myAction, myText, myIcon, myType, myCss, myTitle) {
    var showNoText = ($(window).width() < 500);
    myId = (typeof myId != 'undefined' && myId != '') ? ' id="' + myId + '"' : '';
    myClass = (typeof myClass != 'undefined') ? myClass : '';
    myAction = (typeof myAction != 'undefined' && myAction != '') ? ' onclick="' + myAction + '"' : '';
    myText = (typeof myText != 'undefined') ? myText : '';
    myIcon = (typeof myIcon != 'undefined') ? myIcon : '';
    myType = (typeof myType != 'undefined') ? myType : '';
    myCss = (typeof myCss != 'undefined') ? myCss : {};
    myTitle = (typeof myTitle != 'undefined') ? ' title="' + myTitle + '"' : '';
    var buttonCss = ' style=\'%IMAGE%';
    for (var cssTag in myCss) {
        if (myCss.hasOwnProperty(cssTag)) {
            buttonCss += ' ' + cssTag + ': ' + myCss[cssTag] + ';';
        }
    }
    buttonCss += '\'';

    switch (myType) {
        case 'l':
            myClass = myClass + ' chat-button-line chat-button-left';
            break;
        case 'r':
            myClass = myClass + ' chat-button-line chat-button-right';
            break;
        case 'm':
            myClass = myClass + ' chat-button-line';
            break;
        default:
            myClass = myClass + ' chat-button-line chat-button-left chat-button-right';
            break;
    }
    myClass += ' lzm-unselectable';
    myClass = (myClass.replace(/^ */, '') != '') ? ' class="' + myClass.replace(/^ */, '') +'"' : '';
    var buttonHtml = '';
    if (myIcon != '' && (myText == '' || showNoText)) {
        buttonHtml += '<span' + myId + myClass + myTitle +
            buttonCss.replace(/%IMAGE%/, 'background-image: ' + this.addBrowserSpecificGradient('url("' + myIcon + '")') + '; background-position: center; background-repeat: no-repeat;') +
            myAction + '>&nbsp;&nbsp;</span>';
    } else if (myIcon != '' && (myText != '' && !showNoText)) {
        buttonHtml += '<span' + myId + myClass + myTitle +
            buttonCss.replace(/%IMAGE%/, 'background-image: ' + this.addBrowserSpecificGradient('') + ';') +
            myAction + '><span style=\'background-image: ' + 'url("' + myIcon + '")' + '; background-repeat: no-repeat; ' +
            'background-position: left center; padding: 2px 0px 2px 20px;\'>' + myText + '</span></span>';
    } else {
        buttonHtml += '<span' + myId + myClass + myTitle +
            buttonCss.replace(/%IMAGE%/, 'background-image: ' + this.addBrowserSpecificGradient('') + ';') + myAction + '>' +
            myText + '</span>';
    }

    return buttonHtml
};

ChatDisplayHelperClass.prototype.createInputMenu = function(replaceElement, inputId, inputClass, width, placeHolder, value, selectList, scrollParent, selectmenuTopCorrection) {
    scrollParent = (typeof scrollParent != 'undefined') ? scrollParent : 'NOPARENTGIVEN';
    selectmenuTopCorrection = (typeof selectmenuTopCorrection != 'undefined') ? selectmenuTopCorrection : 0;
    var widthString = (width != 0) ? ' width: ' + width + 'px;' : '';
    var inputMenu = '<span id="' + inputId + '-box" class="lzm-combobox ' + inputClass + '">' +
        '<input type="text" data-role="none" id="' +  inputId + '"' +
        ' style="padding: 0px; border: 0px;' + widthString + '" placeholder="' + placeHolder + '" value="' + value + '" />' +
        '<span id="' + inputId + '-menu"' +
        ' style=\'padding: 1px 9px 1px; background-image: url("img/sort_by_this.png");' +
        'background-repeat: no-repeat: background-position: center; cursor: pointer;\'></span>' +
        '</span>' +
        '<ul id="' + inputId + '-select" class="lzm-menu-select" style="display: none; border: 1px solid #ccc; border-radius: 4px;' +
        ' position: absolute; list-style: none; padding: 3px; margin: 0px; z-index: 2; background-color: #f9f9f9; line-height: 1.5;">';
    for (var i=0; i<selectList.length; i++) {
        var listValue = (selectList[i].constructor == Array) ? selectList[i][0] : selectList[i];
        inputMenu += '<li class="' + inputId + '-selectoption input-select-combo" style="cursor: default;">' + listValue + '</li>'
    }
    inputMenu += '</ul>';
    $('#' + replaceElement).html(inputMenu).trigger('create');
    var eltPos = $('#' + inputId + '-box').position();
    var eltWidth = $('#' + inputId + '-box').width();
    var eltHeight = $('#' + inputId + '-box').height();
    $('#' + inputId + '-select').css({
        left: Math.floor(eltPos.left + 2) + 'px',
        top: Math.floor(eltPos.top + eltHeight + 12 + selectmenuTopCorrection) + 'px',
        width: Math.floor(eltWidth) + 'px'
    });

    $('#' + replaceElement).css({'line-height': 2.5, 'white-space': 'nowrap'});

    $('#' + inputId + '-menu').click(function(e) {
        //console.log(e);
        if ($('#' + inputId + '-select').css('display') == 'block') {
            $('.lzm-menu-select').css('display', 'none');
            $('.lzm-menu-select').data('visible', false);
        } else {
            setTimeout(function() {
                $('.lzm-menu-select').css('display', 'none');
                $('.lzm-menu-select').data('visible', false);
                $('#' + inputId + '-select').css('display', 'block');
                $('#' + inputId + '-select').data('visible', true);
            }, 10);
            var scrollX = ($('#' + scrollParent).length > 0) ? $('#' + scrollParent)[0].scrollLeft : 0;
            var scrollY = ($('#' + scrollParent).length > 0) ? $('#' + scrollParent)[0].scrollTop : 0;
            $('#' + inputId + '-select').css({
                left: Math.floor(eltPos.left + 2 - scrollX) + 'px',
                top: Math.floor(eltPos.top + eltHeight + 12 + selectmenuTopCorrection - scrollY) + 'px'
            });
        }
    });

    if ($('#' + scrollParent).length > 0) {
        $('#' + scrollParent).on('scrollstop', function() {
            if ($('#' + inputId + '-select').data('visible')) {
                var scrollX = ($('#' + scrollParent).length > 0) ? $('#' + scrollParent)[0].scrollLeft : 0;
                var scrollY = ($('#' + scrollParent).length > 0) ? $('#' + scrollParent)[0].scrollTop : 0;
                $('#' + inputId + '-select').css({
                    left: Math.floor(eltPos.left + 2 - scrollX) + 'px',
                    top: Math.floor(eltPos.top + eltHeight + 12 + selectmenuTopCorrection - scrollY) + 'px',
                    display: 'block'
                });
            }
        });
        $('#' + scrollParent).on('scrollstart', function() {
            $('#' + inputId + '-select').css({display: 'none'});
        });
    }

    $('.' + inputId + '-selectoption').click(function(e) {
        //console.log(e);
        $('#' + inputId).val($(this).html());
        $('#' + inputId + '-select').css('display', 'none');
    });
    $('body').click(function() {
        if ($('#' + inputId + '-select').css('display') == 'block') {
            $('#' + inputId + '-select').css('display', 'none');
        }
    });

};

ChatDisplayHelperClass.prototype.createTabControl = function(replaceElement, tabList, selectedTab) {
    selectedTab = (typeof selectedTab != 'undefined' && selectedTab > 0 && selectedTab < tabList.length) ? selectedTab : 0;
    var placeHolderWidth = $('#' + replaceElement).parent().width();
    var allTabsWidth = 0, visibleTabsWidth = 0;
    var closedTabColor = '#E0E0E0';

    $('body').append('<div id="test-tab-width-container" style="position: absolute; left: -1000px; top: -1000px;' +
        ' width: 800px; height: 100px;"></div>').trigger('create');

    var tabRowHtml = '';
    var contentRowHtml = '';
    var tabsAreTooWide = false;
    var thisTabHtml = '', thisTabWidth = [], firstVisibleTab = 0, lastVisibleTab = 0;

    var leftTabHtml = '<span class="lzm-tabs" id="' + replaceElement + '-tab-more-left" draggable="true"' +
        ' style="background-color: ' + closedTabColor + '; display: none; text-shadow: none;"> ... </span>';
    var rightTabHtml = '<span class="lzm-tabs" id="' + replaceElement + '-tab-more-right" draggable="true"' +
        ' style="background-color: ' + closedTabColor + '; display: inline; text-shadow: none;"> ... </span>';
    $('#test-tab-width-container').html(rightTabHtml).trigger('create');
    var rightTabWidth = $('#' + replaceElement + '-tab-more-right').width() + 22;
    $('#test-tab-width-container').html(leftTabHtml).trigger('create');
    var leftTabWidth = $('#' + replaceElement + '-tab-more-left').width() + 22;

    for (var i=0; i<tabList.length; i++) {
        var tabName = (tabList[i].name.length <= 20) ? tabList[i].name : tabList[i].name.substr(0, 17) + '...';
        var tabBackgroundColor = (i != selectedTab) ? closedTabColor : '#f5f5f5';
        var tabBorderBottomColor = (i != selectedTab) ? '#ccc' : '#f5f5f5';
        var tabOpacity = (i != selectedTab) ? ' color: #666;' : '';
        thisTabHtml = '<span class="lzm-tabs ' + replaceElement + '-tab" id="' + replaceElement + '-tab-' + i + '" draggable="true"' +
            ' style="background-color: ' + tabBackgroundColor + '; display: %DISPLAY%; text-shadow: none; border-bottom: 1px solid ' + tabBorderBottomColor +
            tabOpacity + '" data-tab-no="' + i + '">' + tabName + '</span>';
        $('#test-tab-width-container').html(thisTabHtml).trigger('create');
        thisTabWidth[i] = $('#' + replaceElement + '-tab-' + i).width() + 22;
        if (allTabsWidth + thisTabWidth[i] > placeHolderWidth) {
            tabsAreTooWide = true;
        }
        if (tabsAreTooWide) {
            thisTabHtml = thisTabHtml.replace(/%DISPLAY%/, 'none');
        } else {
            thisTabHtml = thisTabHtml.replace(/%DISPLAY%/, 'inline');
            allTabsWidth += thisTabWidth[i];
            lastVisibleTab = i;
        }

        tabRowHtml += thisTabHtml;

        var displayString = (i == selectedTab) ? 'block' : 'none';
        contentRowHtml += '<div class="' + replaceElement + '-content" id="' + replaceElement + '-content-' + i + '" style="border: 1px solid #ccc;' +
            ' border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-right-radius: 4px;' +
            ' padding: 8px; margin-top: 2px; display: ' + displayString + '; overflow: auto; background-color: #f5f5f5;">' +
            tabList[i].content +
            '</div>';
    }



    if(tabsAreTooWide) {
        tabRowHtml = leftTabHtml + tabRowHtml + rightTabHtml;
    }
    var tabString = '<div id="' + replaceElement + '-tabs-row">' + tabRowHtml + '</div>' + contentRowHtml;

    $('#test-tab-width-container').remove();
    $('#' + replaceElement).html(tabString).trigger('create');

    for (i=0; i<tabList.length; i++) {
        $('#' + replaceElement + '-tab-' + i).click(function() {
            var tabNo = $(this).data('tab-no');
            $('.' + replaceElement + '-tab').css({'background-color': closedTabColor});
            $('.' + replaceElement + '-tab').css({'color': '#666'});
            $('.' + replaceElement + '-tab').css({'border-bottom': '1px solid #ccc'});
            $('#' + replaceElement + '-tab-' + tabNo).css({'background-color': '#f5f5f5'});
            $('#' + replaceElement + '-tab-' + tabNo).css({'color': '#333'});
            $('#' + replaceElement + '-tab-' + tabNo).css({'border-bottom': '1px solid #f5f5f5'});
            $('.' + replaceElement + '-content').css({display: 'none'});
            $('#' + replaceElement + '-content-' + tabNo).css({display: 'block'});
        });
        try {
            $('#' + replaceElement + '-tab-' + i)[0].addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
        } catch(e) {}
    }
    $('#' + replaceElement + '-tab-more-right').click(function() {
        var counter = 0;
        var extraTabWidth = rightTabWidth;
        if (lastVisibleTab < tabList.length - 1) {
            $('#' + replaceElement + '-tab-' + firstVisibleTab).css('display', 'none');
            firstVisibleTab++;
            $('#' + replaceElement + '-tab-' + (lastVisibleTab + 1)).css('display', 'inline');
            lastVisibleTab++;
            visibleTabsWidth = 0;
            for (var j=firstVisibleTab; j<lastVisibleTab + 1; j++) {
                visibleTabsWidth += thisTabWidth[j];
            }
            $('#' + replaceElement + '-tab-more-left').css('display', 'inline');
            while (visibleTabsWidth + rightTabWidth + leftTabWidth > placeHolderWidth && counter < 10) {
                counter++;
                $('#' + replaceElement + '-tab-' + firstVisibleTab).css('display', 'none');
                visibleTabsWidth -= thisTabWidth[firstVisibleTab];
                firstVisibleTab++;
            }
            if (lastVisibleTab == tabList.length - 1) {
                $('#' + replaceElement + '-tab-more-right').css('display', 'none');
                extraTabWidth = 0;
            }
            counter = 0;
            while (visibleTabsWidth + thisTabWidth[firstVisibleTab - 1] + leftTabWidth + extraTabWidth < placeHolderWidth && counter < 10) {
                counter++;
                firstVisibleTab--;
                $('#' + replaceElement + '-tab-' + (firstVisibleTab)).css('display', 'inline');
                visibleTabsWidth += thisTabWidth[firstVisibleTab];
            }
        }
        //$('#' + replaceElement + '-tab-' + lastVisibleTab).click();
    });
    try {
        $('#' + replaceElement + '-tab-more-right')[0].addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    } catch(e) {}
    $('#' + replaceElement + '-tab-more-left').click(function() {
        var counter = 0;
        var extraTabWidth = leftTabWidth;
        if (firstVisibleTab > 0) {
            $('#' + replaceElement + '-tab-' + (firstVisibleTab - 1)).css('display', 'inline');
            firstVisibleTab--;
            $('#' + replaceElement + '-tab-' + lastVisibleTab).css('display', 'none');
            lastVisibleTab--;
            visibleTabsWidth = 0;
            for (var j=firstVisibleTab; j<lastVisibleTab + 1; j++) {
                visibleTabsWidth += thisTabWidth[j];
            }
            $('#' + replaceElement + '-tab-more-right').css('display', 'inline');
            while (visibleTabsWidth + rightTabWidth + leftTabWidth > placeHolderWidth && counter < 10) {
                counter++;
                $('#' + replaceElement + '-tab-' + lastVisibleTab).css('display', 'none');
                visibleTabsWidth -= thisTabWidth[lastVisibleTab];
                lastVisibleTab--;
            }
            if (firstVisibleTab == 0) {
                $('#' + replaceElement + '-tab-more-left').css('display', 'none');
                extraTabWidth = 0;
            }
            counter = 0;
            while (visibleTabsWidth + thisTabWidth[lastVisibleTab + 1] + rightTabWidth  + extraTabWidth < placeHolderWidth && counter < 10) {
                counter++;
                lastVisibleTab++;
                $('#' + replaceElement + '-tab-' + (lastVisibleTab)).css('display', 'inline');
                visibleTabsWidth += thisTabWidth[lastVisibleTab];
            }
        }
        //$('#' + replaceElement + '-tab-' + firstVisibleTab).click();
    });
    try {
        $('#' + replaceElement + '-tab-more-left')[0].addEventListener('dragstart', function(e) {
            e.preventDefault();
        });
    } catch(e) {}
};

ChatDisplayHelperClass.prototype.addBrowserSpecificGradient = function(imageString, color) {
    var a, b;
    switch (color) {
        case 'darkorange':
            a = '#FDB867';
            b = '#EDA148';
            break;
        case 'orange':
            a = '#FFCC73';
            b = '#FDB867';
            break;
        case 'darkgray':
            a = '#F6F6F6';
            b = '#E0E0E0';
            break;
        case 'blue':
            a = '#5393c5';
            b = '#6facd5';
            break;
        case 'background':
            a = '#e9e9e9';
            b = '#dddddd';
            break;
        case 'darkViewSelect':
            a = '#999999';
            b = '#797979';
            break;
        case 'selectedViewSelect':
            a = '#6facd5';
            b = '#5393c5';
            break;
        case 'tabs':
            a = '#d9d9d9';
            b = '#898989';
            break;
        default:
            a = '#FFFFFF';
            b = '#F1F1F1';
            break;
    }
    var gradientString = imageString;
    var cssTag = '';
    switch (this.browserName) {
        case 'ie':
            cssTag = '-ms-linear-gradient';
            break;
        case 'safari':
            cssTag = '-webkit-linear-gradient';
            break;
        case 'chrome':
            if (this.browserVersion >= 25)
                cssTag = 'linear-gradient';
            else
                cssTag = '-webkit-linear-gradient';
            break;
        case 'opera':
            cssTag = '-o-linear-gradient';
            break;
        case 'mozilla':
            cssTag = '-moz-linear-gradient';
            break;
        default:
            cssTag = 'linear-gradient';
            break;
    }
    if ((this.browserName == 'ie' && this.browserVersion >= 10) ||
        (this.browserName == 'chrome' && this.browserVersion >= 18) ||
        (this.browserName == 'safari' && this.browserVersion >= 5) ||
        (this.browserName == 'opera' && this.browserVersion >= 12) ||
        (this.browserName == 'mozilla' && this.browserVersion >= 10)){
        switch (imageString) {
            case '':
                gradientString = cssTag + '(' + a + ',' + b + ')';
                break;
            case 'text':
                gradientString = 'background-image: ' + cssTag + '(' + a + ',' + b + ')';
                break;
            default:
                gradientString += ', ' + cssTag + '(' + a + ',' + b + ')';
                break;
        }
    }
    //console.log(gradientString);
    return gradientString
};

ChatDisplayHelperClass.prototype.getScrollBarWidth = function() {
    var htmlString = '<div id="get-scrollbar-width-div" style="position: absolute; left: 0px; top: -9999px;' +
        'width: 100px; height:100px; overflow-y:scroll;"></div>';
    $('body').append(htmlString).trigger('create');
    var getScrollbarWidthDiv = $('#get-scrollbar-width-div');
    var scrollbarWidth = getScrollbarWidthDiv[0].offsetWidth - getScrollbarWidthDiv[0].clientWidth;
    getScrollbarWidthDiv.remove();

    return scrollbarWidth;
}

ChatDisplayHelperClass.prototype.getScrollBarHeight = function() {
    var htmlString = '<div id="get-scrollbar-height-div" style="position: absolute; left: 0px; top: -9999px;' +
        'width: 100px; height:100px; overflow-x:scroll;"></div>';
    $('body').append(htmlString).trigger('create');
    var getScrollbarHeightDiv = $('#get-scrollbar-height-div');
    var scrollbarHeight = getScrollbarHeightDiv[0].offsetHeight - getScrollbarHeightDiv[0].clientHeight;
    getScrollbarHeightDiv.remove();

    return scrollbarHeight;
};

ChatDisplayHelperClass.prototype.checkIfScrollbarVisible = function(id, position) {
    position = (typeof position != 'undefined') ? position : 'vertical';
    var myElement = $('#' + id);
    var padding;
    if (position == 'vertical') {
        padding = parseInt($(myElement).css('padding-top')) + parseInt($(myElement).css('padding-bottom'));
    } else {
        padding = parseInt($(myElement).css('padding-right')) + parseInt($(myElement).css('padding-left'));
    }
    try {
        if (position == 'vertical') {
            return (myElement[0].scrollHeight > (myElement.height() + padding));
        } else {
            return (myElement[0].scrollWidth > (myElement.width() + padding));
        }
    } catch(e) {
        return false;
    }
};

ChatDisplayHelperClass.prototype.calculateTimeSpan = function(beginTime, endTime) {
    var secondsSpent = endTime.getSeconds() - beginTime.getSeconds();
    var minutesSpent = endTime.getMinutes() - beginTime.getMinutes();
    var hoursSpent = endTime.getHours() - beginTime.getHours();
    var daysSpent = endTime.getDate() - beginTime.getDate();
    if (daysSpent < 0) {
        var currentMonth = endTime.getMonth();
        var monthLength = 31;
        if ($.inArray(currentMonth, [3,5,8,10]) != -1) {
            monthLength = 30;
        }
        if (currentMonth == 1) {
            monthLength = 28;
        }
        daysSpent = (monthLength - beginTime.getDate()) + endTime.getDate();
    }
    if (secondsSpent < 0) {
        secondsSpent += 60;
        minutesSpent -= 1;
    }
    if (minutesSpent < 0) {
        minutesSpent += 60;
        hoursSpent -= 1;
    }
    if (hoursSpent < 0) {
        hoursSpent += 24;
        daysSpent -= 1;
    }
    var timeSpan = lzm_commonTools.pad(hoursSpent, 2) + ':' + lzm_commonTools.pad(minutesSpent, 2) + ':' +
        lzm_commonTools.pad(secondsSpent, 2);
    if (daysSpent > 0) {
        timeSpan = daysSpent + '.' + timeSpan;
    }
    return timeSpan;
};

ChatDisplayHelperClass.prototype.calculateTimeDifferenece = function(aUser, type, includeSeconds) {
    var tmpBegin, tmpTimeDifference, tmpDiffSeconds, tmpDiffMinutes, tmpDiffHours, tmpDiffDays, tmpRest, returnString = '';
    var i, foo;
    if (type=='lastOnline') {
        tmpBegin = lzm_chatTimeStamp.getServerTimeString(null, true, 1);
        for (i=0; i<aUser.b.length; i++) {
            if (aUser.b[i].h2.length > 0) {
                tmpBegin = Math.min(aUser.b[i].h2[0].time * 1000, tmpBegin);
                foo = lzm_chatTimeStamp.getLocalTimeObject(tmpBegin, true);
            }
        }
    } else if (type=='lastActive') {
        tmpBegin = 0;
        for (i=0; i<aUser.b.length; i++) {
            if (aUser.b[i].h2.length > 0) {
                var newestH = aUser.b[i].h2.length - 1;
                tmpBegin = Math.max(aUser.b[i].h2[newestH].time * 1000, tmpBegin);
                foo = lzm_chatTimeStamp.getLocalTimeObject(tmpBegin, true);
            }
        }
    }
    if (tmpBegin == 0) {
        tmpBegin = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        //console.log('Begin time : 0');
    }
    tmpTimeDifference = Math.floor(lzm_chatTimeStamp.getServerTimeString(null, false, 1) - tmpBegin) / 1000;
    tmpDiffSeconds = Math.max(0, tmpTimeDifference % 60);
    tmpRest = Math.floor(tmpTimeDifference / 60);
    tmpDiffMinutes = Math.max(0, tmpRest % 60);
    tmpRest = Math.floor(tmpRest / 60);
    tmpDiffHours = Math.max(0, tmpRest % 24);
    tmpDiffDays = Math.max(0, Math.floor(tmpRest / 24));

    if (tmpDiffDays > 0) {
        returnString += tmpDiffDays + ' ';
    }
    returnString += '<!-- ' + tmpBegin + ' -->' + lzm_commonTools.pad(tmpDiffHours, 2) + ':' + lzm_commonTools.pad(tmpDiffMinutes, 2);
    if (typeof includeSeconds != 'undefined' && includeSeconds) {
        returnString += ':' + lzm_commonTools.pad(Math.round(tmpDiffSeconds), 2);
    }
    return [returnString, tmpBegin];
};

ChatDisplayHelperClass.prototype.replaceSmileys = function(text) {
    var previousSigns = [{pt: ' ', rp: ' '}, {pt: '>', rp: '>'}, {pt: '&nbsp;', rp: '&nbsp;'}, {pt: '^', rp: ''}];
    var shorts = [':-)','::smile',':)',':-(','::sad',':(',':-]','::lol',';-)','::wink',';)',
        ':\'-(','::cry',':-O','::shocked',':-\\\\','::sick',':-p','::tongue',':-P',':?','::question','8-)',
        '::cool','zzZZ','::sleep',':-|','::neutral'];
    var images = ["smile","smile","smile","sad","sad","sad","lol","lol","wink","wink","wink","cry","cry",
        "shocked","shocked","sick","sick","tongue","tongue","tongue","question","question","cool","cool","sleep",
        "sleep","neutral","neutral"];
    for (var i=0; i<previousSigns.length; i++) {
        for (var j=0; j<shorts.length; j++) {
            var myRegExp = new RegExp(previousSigns[i].pt + RegExp.escape(shorts[j]), 'g');
            var rplString = previousSigns[i].rp + '<span style="padding:3px 10px 2px 10px;' +
                ' background: url(\'../images/smilies/' + images[j] + '.gif\'); background-position: center;' +
                ' background-repeat: no-repeat;">&nbsp;</span>';
            text = text.replace(myRegExp, rplString);
        }
    }
    return text;
};

ChatDisplayHelperClass.prototype.showBrowserNotification = function(params) {
    var thisClass = this;
    params = (typeof  params != 'undefined') ? params : {};
    if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.showBrowserNotificationTime > 10000) {
        this.showBrowserNotificationTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        var text = (typeof params.text != 'undefined') ? params.text : '';
        text = (text.length > 71) ? text.substr(0, 68) + '...' : text;
        var subject = (typeof params.subject != 'undefined') ? params.subject : '';
        var onclickAction = (typeof params.action != 'undefined' && params.action != '') ?
            ' onclick="' + params.action + '; ' + this.getMyObjectName() + '.removeBrowserNotification();"' : '';
        var notificationHtml = '<div id="browser-notification" class="lzm-notification"' + onclickAction + '>' +
            '<div id="browser-notification-body" class="lzm-notification-body">' +
            '<p style="font-weight: bold;">' + subject + '</p>' +
            '<p>' + text + '</p>' +
            '</div>' +
            '<div id="close-notification" class="lzm-notification-close" onclick="' + this.getMyObjectName() + '.removeBrowserNotification(event);"></div>' +
            '</div>';
        $('body').append(notificationHtml);

        if (typeof params.timeout == 'number' && params.timeout > 0) {
            setTimeout(function() {thisClass.removeBrowserNotification();}, params.timeout * 1000);
        }
    }
};

ChatDisplayHelperClass.prototype.removeBrowserNotification = function(e) {
    if (typeof e != 'undefined') {
        e.stopPropagation();
    }
    $('#browser-notification').remove();
};

ChatDisplayHelperClass.prototype.blockUi = function(params) {
    this.unblockUi();
    var rd = Math.floor(Math.random() * 9999);
    params.message = (typeof params.message != 'undefined') ? params.message : '';
    var myHeight = $(window).height();
    var myWidth = $(window).width();
    var messageWidth = Math.min(500, Math.floor(0.9 * myWidth)) - 80;

    var blockHtml = '<div class="lzm-block" id="lzm-block-' + rd + '"' +
        ' style="position: absolute; top: 0px; left: 0px; width: ' + myWidth + 'px; height: ' + myHeight + 'px;' +
        ' z-index: 2147483647; background-color: rgba(0,0,0,0.7); overflow-y: auto;">';
    if (params.message != null) {
        blockHtml += '<div class="lzm-block-message" id="lzm-block-message-' + rd + '"' +
            ' style="background-color: #f1f1f1; position: absolute; padding: 20px; border: 5px solid #aaa;' +
            ' border-radius: 4px; width: ' + messageWidth + 'px; overflow: hidden;">' + params.message +
            '</div>';
    }
    blockHtml += '</div>';

    $('body').append(blockHtml);

    if (params.message != null) {
        var messageHeight = $('#lzm-block-message-' + rd).height();
        var messageLeft = Math.max(20, Math.floor((myWidth - messageWidth - 50) / 2));
        var messageTop = Math.max(20, Math.floor((myHeight - messageHeight - 50) / 2));
        $('#lzm-block-message-' + rd).css({left: messageLeft+'px', top: messageTop+'px'});
        //console.log('Left: ' + messageLeft + ', Top: ' + messageTop + ', Width: ' + messageWidth + ', Height: ' + messageHeight);
    } else {
        //console.log('Left: 0, Top: 0, Width: ' + messageWidth + ', Height: ' + messageHeight);
    }

};

ChatDisplayHelperClass.prototype.unblockUi = function() {
    $('.lzm-block').remove();
};
