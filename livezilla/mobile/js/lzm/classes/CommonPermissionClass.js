/****************************************************************************************
 * LiveZilla CommonPermissionClass
 *
 * Copyright 2014 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
function CommonPermissionClass() {
    this.permissions = {};
}

CommonPermissionClass.prototype.getUserPermissions = function(initial) {
    var permissions = [], i = 0;
    if (initial) {
        permissions = lzm_chatServerEvaluation.permissions
    } else {
        for (i=0; i<lzm_chatServerEvaluation.internal_users.length; i++) {
            if (lzm_chatServerEvaluation.internal_users[i].id == lzm_chatServerEvaluation.myId) {
                permissions = lzm_chatServerEvaluation.internal_users[i].perms.split('');
            }
        }
    }
    for (i=0; i<this.permissions.length; i++) {
        this.permissions[i] = parseInt(this.permissions[i]);
    }
    this.permissions = {
        chats: permissions[13],
        chats_join: permissions[7],
        chats_join_invisible: permissions[8],
        chats_join_after_invitation: permissions[17],
        chats_take_over: permissions[90],
        chats_change_priority: permissions[10],
        chats_change_target_operator: permissions[12],
        chats_change_target_group: permissions[11],
        chats_send_invites: permissions[14],
        chats_cancel_invites: permissions[39],
        chats_cancel_invites_others: permissions[40],
        chats_delete_text: permissions[15],
        chats_forward: permissions[16],
        chats_create_filter: permissions[19],
        chats_start_new: permissions[38],
        chats_can_auto_accept: permissions[42],
        chats_must_auto_accept: permissions[43],
        chats_can_reject: permissions[44],
        tickets: permissions[0],
        tickets_edit_messages: 1,
        tickets_change_signature: permissions[24],
        tickets_review_emails: permissions[22],
        tickets_delete_emails: permissions[25],
        tickets_change_status: permissions[26],
        tickets_status_open: permissions[27],
        tickets_status_progress: permissions[28],
        tickets_status_closed: permissions[29],
        tickets_status_deleted: permissions[37],
        tickets_create_new: permissions[23],
        tickets_assign_operators: permissions[30],
        tickets_assign_groups: permissions[31],
        tickets_process_open: permissions[33],
        tickets_take_over: permissions[32],
        tickets_delete_ticket: permissions[34],
        ratings: permissions[1],
        profiles: permissions[35],
        resources: permissions[3],
        events: permissions[4],
        reports: permissions[5],
        archives_external: permissions[2],
        archives_internal: permissions[36],
        monitoring: permissions[6],
        groups_dynamic: permissions[18],
        auto_replies: permissions[20],
        mobile_access: permissions[45]
    };
};

CommonPermissionClass.prototype.checkUserPermissions = function(uid, type, action, myObject) {
    uid = (typeof uid != 'undefined' && uid != '' && uid != null) ? uid : lzm_chatServerEvaluation.myId;
    var rtValue = false;
    this.getUserPermissions();
    switch(type) {
        case 'resources':
            rtValue = this.checkUserResourcePermissions(uid, action, myObject);
            break;
        case 'tickets':
            rtValue = this.checkUserTicketPermissions(uid, action, myObject);
            break;
        case 'chats':
            rtValue = this.checkUserChatPermissions(uid, action, myObject);
            break;
        case 'monitoring':
            rtValue = this.checkUserMonitoringPermissions(uid, action, myObject);
            break;
    }
    return rtValue
};

CommonPermissionClass.prototype.checkUserResourcePermissions = function(uid, action, resource) {
    var rtValue = false;
    switch(action) {
        case 'add':
            rtValue = (this.permissions.resources == 2 || (this.permissions.resources == 1 && (resource.oid == uid || resource.rid == 1)));
            break;
        case 'delete':
        case 'edit':
            rtValue = (this.permissions.resources == 2 || (this.permissions.resources == 1 && resource.oid == uid));
            break;
        case 'view':
            rtValue = (this.permissions.resources !== 0);
            break;
    }
    return rtValue;
};

CommonPermissionClass.prototype.checkUserTicketPermissions = function(uid, action, ticket) {
    var rtValue = false;
    switch(action) {
        case 'view':
            var myGroups = [];
            for (var i=0; i< lzm_chatServerEvaluation.internal_users; i++) {
                if (lzm_chatServerEvaluation.internal_users[i].id == uid) {
                    myGroups = lzm_chatServerEvaluation.internal_users[i].groups;
                }
            }
            var ticketGroup = (typeof ticket.editor != 'undefined') ? ticket.editor.g : ticket.gr;
            rtValue = (this.permissions.tickets == 2 || (this.permissions.tickets == 1 && $.inArray(ticketGroup, myGroups) != -1));
            break;
        case 'change_signature':
            rtValue = (this.permissions.tickets_change_signature == 1);
            break;
        case 'review_emails':
            rtValue = (this.permissions.tickets_review_emails == 1);
            break;
        case 'delete_emails':
            rtValue = (this.permissions.tickets_delete_emails == 1);
            break;
        case 'create_tickets':
            rtValue = (this.permissions.tickets_create_new == 1);
            break;
        case 'change_ticket_status':
            rtValue = (this.permissions.tickets_change_status == 1);
            break;
        case 'status_open':
            rtValue = (this.permissions.tickets_status_open == 1);
            break;
        case 'status_progress':
            rtValue = (this.permissions.tickets_status_progress == 1);
            break;
        case 'status_closed':
            rtValue = (this.permissions.tickets_status_closed == 1);
            break;
        case 'status_deleted':
            rtValue = (this.permissions.tickets_status_deleted == 1);
            break;
        case 'assign_operators':
            rtValue = (this.permissions.tickets_assign_operators == 1);
            break;
        case 'assign_groups':
            rtValue = (this.permissions.tickets_assign_groups == 1);
            break;
        case 'process_open':
            rtValue = (this.permissions.tickets_process_open == 1);
            break;
        case 'take_over':
            rtValue = (this.permissions.tickets_take_over == 1);
            break;
        case 'delete_tickets':
            rtValue = (this.permissions.tickets_delete_ticket == 1);
            break;
        case 'edit_messages':
            rtValue = (this.permissions.tickets_edit_messages == 1);
            break;
    }
    return rtValue;
};

CommonPermissionClass.prototype.checkUserChatPermissions = function(uid, action, browser) {
    var rtValue = false;
    switch(action) {
        case 'view':
            var myGroups = [];
            for (var i=0; i< lzm_chatServerEvaluation.internal_users; i++) {
                if (lzm_chatServerEvaluation.internal_users[i].id == uid) {
                    myGroups = lzm_chatServerEvaluation.internal_users[i].groups;
                }
            }
            rtValue = (this.permissions.chats == 2 || (this.permissions.chats == 1 && $.inAray(browser.chat.gr, myGroups) != -1) || (this.permissions.chats == 0 && browser.chat.dcp == uid));
            break;
        case 'can_auto_accept':
            rtValue = (this.permissions.chats_can_auto_accept == 1);
            break;
        case 'must_auto_accept':
            rtValue = (this.permissions.chats_must_auto_accept == 1);
            break;
        case 'join':
            rtValue = (this.permissions.chats_join == 1);
            break;
        case 'join_invisible':
            rtValue = (this.permissions.chats_join_invisible == 1);
            break;
        case 'join_after_invitation':
            rtValue = (this.permissions.chats_join_after_invitation == 1);
            break;
        case 'take_over':
            rtValue = (this.permissions.chats_take_over == 1);
            break;
        case 'change_priority':
            rtValue = (this.permissions.chats_change_priority == 1);
            break;
        case 'change_target_operator':
            rtValue = (this.permissions.chats_change_target_operator == 1);
            break;
        case 'change_target_group':
            rtValue = (this.permissions.chats_change_target_group == 1);
            break;
        case 'send_invites':
            rtValue = (this.permissions.chats_send_invites == 1);
            break;
        case 'cancel_invites':
            rtValue = (this.permissions.chats_cancel_invites == 1);
            break;
        case 'cancel_invites_others':
            rtValue = (this.permissions.chats_cancel_invites_others == 1);
            break;
        case 'forward':
            rtValue = (this.permissions.chats_forward == 1);
            break;
        case 'decline':
            rtValue = (this.permissions.chats_can_reject == 1);
            break;
        case 'delete_text':
            rtValue = (this.permissions.chats_delete_text == 1);
            break;
        case 'create_filter':
            rtValue = (this.permissions.chats_create_filter == 1);
            break;
        case 'start_new':
            rtValue = (this.permissions.chats_start_new == 1);
            break;
    }
    return rtValue;
};

CommonPermissionClass.prototype.checkUserMonitoringPermissions = function(uid, action, myObject) {
    var rtValue = false;
    switch (action) {
        case 'view':
            // TODO Fix second condition
            rtValue = (this.permissions.monitoring == 1 || (this.permissions.monitoring == 0 && true));
            break;
    }
    return rtValue;
};