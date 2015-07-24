/****************************************************************************************
 * LiveZilla ChatDisplayClass.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

/**
 * Class controlling the page layout and the creation of the html parts
 * @constructor
 */
function ChatDisplayClass(now, lzm_commonConfig, lzm_commonTools, lzm_chatInputEditor, web, app, mobile, messageTemplates,
                          userConfigData, multiServerId) {
    //console.log('ChatDisplayClass initiated');
    this.debuggingDisplayMode = 'none';
    this.debuggingDisplayWidth = 0;

    // variables controlling the behaviour of the chat page
    this.senderType = '';
    this.myLoginId = '';
    this.myId = '';
    this.myName = '';
    this.active_chat = '';
    this.active_chat_reco = '';
    this.active_chat_realname = '';
    this.user_status = 0;
    this.selected_view = 'mychats';
    this.lastActiveChat = '';
    this.lastChatSendingNotification = '';
    this.displayWidth = 'large';
    this.infoCaller = '';
    this.infoUser = {};
    this.thisUser = {id: ''};
    this.editThisTranslation = '';
    this.chatActivity = false;
    this.soundPlayed = [];
    this.isRinging = {};
    this.ringSenderList = [];
    this.VisitorListCreated = false;
    this.ShowVisitorId = '';
    this.newExternalUsers = [];
    this.changedExternalUsers = [];
    this.userLanguage = 'en';
    this.closedChats = [];
    this.openedResourcesFolder = ['1'];
    this.selectedResource = '';
    this.selectedResourceTab = 0;
    this.saveConnections = 0;
    this.serverIsDisabled = false;
    this.lastDiabledWarningTime = 0;
    this.askBeforeUnload = true;

    // Values from the user's configuration
    this.awayAfterTime = userConfigData['awayAfter'];
    this.volume = userConfigData['userVolume'];
    this.playNewMessageSound = userConfigData['playIncomingMessageSound'];
    this.playNewChatSound = userConfigData['playIncomingChatSound'];
    this.repeatNewChatSound = userConfigData['repeatIncomingChatSound'];
    this.playNewTicketSound = userConfigData['playIncomingTicketSound'];
    this.backgroundModeChecked = userConfigData['backgroundMode'];
    if (app && typeof lzm_deviceInterface != 'undefined' && typeof lzm_deviceInterface.keepActiveInBackgroundMode != 'undefined') {
        lzm_deviceInterface.keepActiveInBackgroundMode(this.backgroundModeChecked == 1);
    }
    this.autoAcceptChecked = false;
    this.showViewSelectPanel = {mychats: 1, tickets: 1, external: 1, archive: 1, internal: 1, qrd: 1/*, filter: 1*/};
    this.viewSelectArray = [];
    this.firstVisibleView = Object.keys(this.showViewSelectPanel)[0];
    this.chatsViewMarked = false;
    this.myChatsCounter = 0;

    this.searchButtonUpSet = {};

    this.StoredDialogs = {};
    this.StoredDialogIds = [];
    this.dialogData = {};

    this.visitorListIsScrolling = 0;
    this.visitorListScrollingWasBlocked = false;

    this.ticketListTickets = [];
    this.ticket = {};
    this.ticketOpenMessages = [];
    this.ticketReplyDraft = {};
    this.showTicketContextMenu = false;
    this.showTicketFilterMenu = false;
    this.showTicketMessageContextMenu = false;
    this.ticketMessageWidth = 0;
    this.ticketDialogId = {};
    this.ticketResourceText = {};
    this.ticketReadArray = [];
    this.ticketUnreadArray = [];
    this.ticketGlobalValues = {t: -1, r: -1, mr: 0, updating: false};
    this.ticketFilterChecked = ['visible', 'visible', 'visible', 'hidden'];
    this.ticketFilterPersonal = 'hidden';
    this.ticketFilterGroup = 'hidden';
    this.selectedTicketRow = '';
    this.numberOfUnreadTickets = -1;
    this.emailReadArray = [];
    this.emailDeletedArray = [];
    this.ticketsFromEmails = [];
    this.emailsToTickets = [];

    this.qrdTreeDialog = {};
    this.qrdChatPartner = '';
    this.resources = [];
    this.qrdSearchCategories = ['ti', 't'];
    this.recentlyUsedResources = [];

    this.showArchiveFilterMenu = false;
    this.archiveFilterChecked = ['visible', 'visible', 'visible']

    this.showUserstatusHtml = false;
    this.showUsersettingsHtml = false;
    this.showMinifiedDialogsHtml = false;
    this.settingsDialogue = false;
    this.showBrowserHistory = ['', ''];
    this.showOpInviteList = false;
    this.windowWidth = 0;
    this.windowHeight = 0;
    this.initialWindowHeight = 0;
    this.chatPanelHeight = 0;
    this.visitorListHeight = 140;
    this.visitorSortBy = 'time';
    this.qrdSearchResults = [];
    this.activeVisitorNumber = 0;
    this.visitorInfoVisibleTab = 'info';
    this.blankButtonWidth = 0;

        this.chatLeftByOperators = {};

    this.validationErrorCount = 0;
    this.blinkingIconsInterval = false;
    this.blinkingIconsArray = [];
    this.blinkingIconsStatus = 0;

    // variables passed to this class as parameters
    this.now = now;
    this.lzm_commonConfig = lzm_commonConfig;
    this.lzm_commonTools = lzm_commonTools;
    this.lzm_chatInputEditor = lzm_chatInputEditor;

    this.lzm_chatTimeStamp = {};
    this.isApp = app;
    this.isWeb = web;
    this.isMobile = mobile;
    this.messageTemplates = messageTemplates;
    this.multiServerId = multiServerId;

    this.OperatorListHeadlineCss = {};
    this.OperatorListHeadline2Css = {};
    this.TemplateBodyCss = {};
    this.OperatorListBodyCss = {};
    this.VisitorListHeadlineCss = {};
    this.VisitorListHeadline2Css = {};
    this.visitorListTableCss = {};
    this.VisitorInfoHeadlineCss = {};
    this.VisitorInfoHeadline2Css = {};
    this.VisitorInfoFootlineCss = {};
    this.VisitorInfoBodyCss = {};
    this.OperatorForwardListHeadlineCss = {};
    this.OperatorForwardListHeadline2Css = {};
    this.OperatorForwardListBodyCss = {};
    this.OperatorForwardListFootlineCss = {};
    this.fwdContainerCss = {};
    this.TranslationContainerHeadlineCss = {};
    this.TranslationContainerHeadline2Css = {};
    this.TranslationContainerFootlineCss = {};
    this.UsersettingsContainerHeadlineCss = {};
    this.UsersettingsContainerHeadline2Css = {};
    this.UsersettingsContainerBodyCss = {};
    this.UsersettingsContainerFootlineCss = {};
    this.QrdTreeHeadlineCss = {};
    this.QrdTreeHeadline2Css = {};
    this.QrdTreeBodyCss = {};
    this.QrdTreeFootlineCss = {};
    this.TicketHeadlineCss = {};
    this.TicketHeadline2Css = {};
    this.TicketBodyCss = {};
    this.TicketFootlineCss = {};
    this.ArchiveHeadlineCss = {};
    this.ArchiveHeadline2Css = {};
    this.ArchiveBodyCss = {};
    this.ArchiveFootlineCss = {};
    this.settingsContainerCss = {};
    this.activeChatPanelHeight = 28;
    this.activeChatPanelLineCounter = 1;
    this.dialogWindowWidth = 0;
    this.dialogWindowHeight = 0;
    this.FullscreenDialogWindowWidth = 0;
    this.FullscreenDialogWindowHeight = 0;
    this.dialogWindowLeft = 0;
    this.dialogWindowTop = 0;
    this.FullscreenDialogWindowLeft = 0;
    this.FullscreenDialogWindowTop = 0;
    this.dialogWindowContainerCss = {};
    this.dialogWindowCss = {};
    this.dialogWindowHeadlineCss = {};
    this.dialogWindowBodyCss = {};
    this.dialogWindowFootlineCss = {};
    this.FullscreenDialogWindowCss = {};
    this.FullscreenDialogWindowHeadlineCss = {};
    this.FullscreenDialogWindowBodyCss = {};
    this.FullscreenDialogWindowFootlineCss = {};
    this.openChats = [];

        this.browserName = 'other';
    if ($.browser.chrome)
        this.browserName = 'chrome';
    else if ($.browser.mozilla)
        this.browserName = 'mozilla';
    else if ($.browser.msie)
        this.browserName = 'ie';
    else if ($.browser.safari)
        this.browserName = 'safari';
    else if ($.browser.opera)
        this.browserName = 'opera';
    if ($.browser.version.indexOf('.') != -1) {
        this.browserVersion = $.browser.version.split('.')[0];
        this.browserMinorVersion = $.browser.version.split('.')[1];
    } else {
        this.browserVersion = $.browser.version;
        this.browserMinorVersion = 0;
    }
    // workarround for IE 11
    if (this.browserName == 'mozilla' && this.browserVersion == 11) {
        this.browserName = 'ie';
    }
    this.scrollbarWidth = lzm_displayHelper.getScrollBarWidth();

    var thisClass = this;
    this.blinkingIconsInterval = setInterval(function() {
        thisClass.blinkIcons();
    },1200);

    lzm_displayHelper.browserName = this.browserName;
    lzm_displayHelper.browserVersion = this.browserVersion;
    lzm_displayHelper.browserMinorVersion = this.browserMinorVersion;
    this.templateCloseButton = '<div id="%BTNID%" %BTNONCLICK%' +
        ' style=\'background-image: ' + lzm_displayHelper.addBrowserSpecificGradient('url("img/205-close.png")') + ';' +
        ' background-repeat: no-repeat; background-position: center; display: none;' +
        ' left: %BTNLEFT%px; top: %BTNTOP%px; width: 16px; %BTNDEFAULTCSS%\'></div>';
}

ChatDisplayClass.prototype.resetWebApp = function() {
    this.validationErrorCount = 0;
    this.blinkingIconsArray = [];
    this.blinkingIconsStatus = 0;

    this.stopRinging([]);
};

// ****************************** Visibility functions ****************************** //
ChatDisplayClass.prototype.setBlinkingIconsArray = function(blinkingIconsArray) {
    this.blinkingIconsArray = blinkingIconsArray;
};

ChatDisplayClass.prototype.blinkIcons = function() {
    var intUserObject = {}, intDepartmentObject = {}, chatIsNew = false;
    for (var j=0; j<lzm_chatServerEvaluation.internal_users.length; j++) {
        intUserObject[lzm_chatServerEvaluation.internal_users[j].id] = lzm_chatServerEvaluation.internal_users[j];
    }
    for (var k=0; k<lzm_chatServerEvaluation.internal_departments.length; k++) {
        intDepartmentObject[lzm_chatServerEvaluation.internal_departments[k].id] = lzm_chatServerEvaluation.internal_departments[k];
    }

    try {
        var logo = 'img/lz_offline_14.png';
        for (var i=0; i<this.blinkingIconsArray.length; i++) {
            chatIsNew = (lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]]['status'] == 'new' ||
                (typeof lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].fupr != 'undefined' &&
                (typeof lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].fuprDone == 'undefined' ||
                lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].fuprDone != lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].fupr.id)));
            if (this.blinkingIconsStatus == 1) {
                if (!chatIsNew) {
                    logo ='img/176-keyboard_14.png';
                } else {
                    logo = 'img/217-quote_14.png';
                }
                // Keep image img/176-keyboard.png (comment needed for release package creation)
            } else {
                if (this.blinkingIconsArray[i] == 'everyoneintern' || typeof intDepartmentObject[this.blinkingIconsArray[i]] != 'undefined') {
                    logo = 'img/lz_group_14.png';
                } else if (typeof intUserObject[this.blinkingIconsArray[i]] != 'undefined') {
                    logo = intUserObject[this.blinkingIconsArray[i]].status_logo;
                    // Keep img/lz_away_14.png and lz_busy_14.png (comment needed for release package creation)
                } else {
                    if (typeof (lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]] != 'undefined' )) {
                        if (lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].status == 'read' ||
                            lzm_chatServerEvaluation.chatObject[this.blinkingIconsArray[i]].status == 'new') {
                            logo = 'img/lz_online_14.png';
                        } else {
                            logo = 'img/lz_offline_14.png';
                        }
                    }
                }
            }
            var buttonId = '#chat-button-' + this.blinkingIconsArray[i].replace(/~/,'_');
            $(buttonId).children('span').css('background-image',"url('" + logo + "')");
        }
    } catch(ex) {}
    this.blinkingIconsStatus = 1 - this.blinkingIconsStatus;

    try {
        for (var key in lzm_chatServerEvaluation.chatObject) {
            if(lzm_chatServerEvaluation.chatObject.hasOwnProperty(key)) {
                if ($.inArray(key, this.blinkingIconsArray) == -1) {
                    chatIsNew = (lzm_chatServerEvaluation.chatObject[key]['status'] == 'new' ||
                        (typeof lzm_chatServerEvaluation.chatObject[key].fupr != 'undefined' &&
                            (typeof lzm_chatServerEvaluation.chatObject[key].fuprDone == 'undefined' ||
                                lzm_chatServerEvaluation.chatObject[key].fuprDone != lzm_chatServerEvaluation.chatObject[key].fupr.id)));
                    if (chatIsNew && this.blinkingIconsStatus == 1) {
                        logo = 'img/217-quote_14.png';
                    } else {
                        //console.log('Do not blink icon of ' + key);
                        if (key == 'everyoneintern' || typeof intDepartmentObject[key] != 'undefined') {
                            logo = 'img/lz_group_14.png';
                        } else if (typeof intUserObject[key] != 'undefined') {
                            logo = intUserObject[key].status_logo;
                        } else {
                            if (typeof (lzm_chatServerEvaluation.chatObject[key] != 'undefined' )) {
                                if (lzm_chatServerEvaluation.chatObject[key].status == 'read' || lzm_chatServerEvaluation.chatObject[key].status == 'new') {
                                    logo = 'img/lz_online_14.png';
                                } else {
                                    logo = 'img/lz_offline_14.png';
                                }
                            }
                        }
                    }
                    var buttonId = '#chat-button-' + key.replace(/~/,'_');
                    var existingLogo = $(buttonId).children('span').css('background-image').replace(/url\((.*?)\)/, '$1').split('/');
                    existingLogo = 'img/' + existingLogo[existingLogo.length - 1];
                    if (logo != existingLogo) {
                        $(buttonId).children('span').css('background-image',"url('" + logo + "')");
                    }
                    //console.log("url('" + logo + "')");
                }
            }
        }
    } catch(ex) {}
};

/**
 * Create the layout of the page depending on the window size
 */
ChatDisplayClass.prototype.createChatWindowLayout = function (recreate) {
    // Definitions for jquery selectors
    var thisBody = $('body');
    var thisChatPage = $('#chat_page');
    var thisActiveChatPanel = $('#active-chat-panel');
    var thisContentChat = $('#content_chat');
    var thisChat = $('#chat');
    var thisVisitorInfo = $('#visitor-info');
    var thisOperatorList = $('#operator-list');
    var thisChatContainer = $('#chat-container');
    var thisChatTable = $('#chat-table');
    var thisChatAction = $('#chat-action');
    //var thisChatTitle = $('#chat-title');
    var thisChatButtons = $('#chat-buttons');
    var thisChatProgress = $('#chat-progress');
    var thisChatInput = $('#chat-input');
    var thisChatInputBody = $('#chat-input-body');
    var thisChatInputControls = $('#chat-input-controls');
    var thisChatLogo = $('#chat-logo');
    var thisVisitorList = $('#visitor-list');
    var thisQrdTree = $('#qrd-tree');
    var thisTicket = $('#ticket-list');
    var thisArchive = $('#archive');
    var thisSendBtn = $('#send-btn');
    var thisBlankChatBtn = $('#blank-chat-btn');
    var thisUserControlPanel = $('#user-control-panel');
    //var thisSwitchCenterPage = $('#switch-center-page');
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    if (windowHeight >= this.initialWindowHeight) {
        this.initialWindowHeight = windowHeight;
    }
    var chatPageHeight = windowHeight;
    if (this.isApp && windowHeight < 390) {
        chatPageHeight = Math.min(390, this.initialWindowHeight);
    }

    // Do only do layout changes, when they are neccessary
    if (recreate || windowWidth != this.windowWidth || windowHeight != this.windowHeight ||
        this.activeChatPanelHeight < (this.chatPanelHeight - 5) ||
        this.activeChatPanelHeight > (this.chatPanelHeight + 5)) {
        this.chatPanelHeight = this.activeChatPanelHeight;

        //console.log('Window layout recreated for resolution ' + windowWidth + 'x' + windowHeight);

        var userControlPanelPosition = thisUserControlPanel.position();
        var userControlPanelHeight = thisUserControlPanel.height();
        var userControlPanelWidth = thisUserControlPanel.width();
        var viewSelectPanelHeight = 31;

        var articleWidth = thisContentChat.width();
        var chatTableHeight = 0;
        var visitorInfoTop = 0;
        var chatContainerTop = 0;
        var chatContainerHeight = 0;

        // variable declarations, if neccessary
        var visitorInfoWidth = 0;
        var visitorInfoLeft = 0;
        var thisVisitorInfoVisibility = '';
        var operatorListTop = 0;
        var operatorListDisplay = '';
        var operatorListLeft = 0;
        var chatTableTop = 0;
        var visitorListDisplay = '';
        var visitorListTop = 0;
        var visitorListWidth = 0;
        var visitorListLeft = 0;
        var visitorListHeight = 0;
        var chatWindowWidth = 0;
        var chatContainerWidth = 0;
        var chatContainerLeft = 0;
        var viewSelectPanelDisplay = '';
        var viewSelectPanel2Display = '';
        var chatWindowHeight = chatPageHeight - (userControlPanelPosition.top + userControlPanelHeight) - 20 - viewSelectPanelHeight;
        var chatWindowTop = userControlPanelPosition.top + userControlPanelHeight + 10 + viewSelectPanelHeight;
        var visitorInfoHeight = 0;
        var operatorForwardListTop = 0;
        var operatorForwardListLeft = 0;
        var operatorListWidth = 200;
        var chatButtonTop;
        this.FullscreenDialogWindowWidth = (windowWidth <= 600 || windowHeight <= 500) ? windowWidth : Math.floor(0.95 * windowWidth) - 40;
        this.FullscreenDialogWindowHeight = (windowWidth <= 600 || windowHeight <= 500) ? windowHeight : Math.floor(0.95 * windowHeight) - 40;
        if (this.FullscreenDialogWindowWidth <= 600 || this.FullscreenDialogWindowHeight <= 500) {
            this.dialogWindowWidth = this.FullscreenDialogWindowWidth;
            this.dialogWindowHeight = this.FullscreenDialogWindowHeight;
        } else {
            this.dialogWindowWidth = 600;
            this.dialogWindowHeight = 500;
        }
        this.dialogWindowLeft = (this.dialogWindowWidth < windowWidth) ? Math.floor((windowWidth - this.dialogWindowWidth) / 2) : 0;
        this.FullscreenDialogWindowLeft = (this.FullscreenDialogWindowWidth < windowWidth) ? Math.floor((windowWidth - this.FullscreenDialogWindowWidth) / 2) : 0;
        this.dialogWindowTop = (this.dialogWindowHeight < windowHeight) ? Math.floor((windowHeight - this.dialogWindowHeight) / 2) : 0;
        this.FullscreenDialogWindowTop = (this.FullscreenDialogWindowHeight < windowHeight) ? Math.floor((windowHeight - this.FullscreenDialogWindowHeight) / 2) : 0;

        this.displayWidth = 'small';
        operatorListDisplay = 'none';
        visitorListDisplay = 'none';
        viewSelectPanelDisplay = 'block';
        operatorListLeft = 0;
        chatWindowWidth = userControlPanelWidth - 8;
        chatContainerLeft = 0;
        chatContainerWidth = chatWindowWidth - 5;
        chatContainerHeight = chatWindowHeight - 17;
        visitorListHeight = chatContainerHeight;
        visitorListLeft = chatContainerLeft;
        operatorListWidth = chatContainerWidth;
        visitorListWidth = chatContainerWidth;
        chatTableHeight = chatContainerHeight - this.activeChatPanelHeight - 10 - 22;
        visitorInfoHeight = chatContainerHeight;
        visitorInfoWidth = chatContainerWidth;
        visitorInfoLeft = userControlPanelPosition.left + chatContainerLeft;
        chatTableTop = this.activeChatPanelHeight + 5 + 22 -4;
        operatorForwardListTop = chatContainerTop;
        operatorForwardListLeft = chatContainerLeft;
        thisVisitorInfoVisibility = 'none';
        chatButtonTop = (chatTableHeight - 61);
        var thisChatPageCss = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            bottom: '0px',
            width: (windowWidth)+'px',
            height: chatPageHeight+'px',
            'overflow-y': 'hidden'
        };
        if (this.isApp && windowHeight < 390) {
            thisChatPageCss = {
                position: 'absolute',
                top: 'auto',
                left: '0px',
                bottom: '0px',
                width: windowWidth+'px',
                height: chatPageHeight+'px',
                'overflow-y': 'hidden'
            };
        }
        //alert(articleWidth);
        chatContainerTop = 2;
        operatorListTop = chatContainerTop;
        visitorListTop = chatContainerTop;
        visitorInfoTop = chatWindowTop + chatContainerTop;
        operatorForwardListTop = chatContainerTop;

        var background = '#ffffff';
        var borderStyle = '1px solid #ccc';
        var roundedStyle = '4px';
        if (this.active_chat == '') {
            thisVisitorInfo.html('<div id="visitor-info-headline"><h3>' + t('Visitor Information') + '</h3></div>' +
                '<div id="visitor-info-headline2"></div>').trigger('create');
        }

        var chatTableWidth = chatContainerWidth;

        // put together the css objects
        var thisChatContainerCss = {position: 'absolute', width: chatContainerWidth + 'px', height: chatContainerHeight + 'px',
            left: chatContainerLeft + 'px', top: chatContainerTop + 'px', background: background, padding: '5px 5px 5px 5px',
            border: borderStyle, '-moz-border': borderStyle, '-webkit-border': borderStyle,
            //'box-shadow': shadowStyle, '-moz-box-shadow': shadowStyle, '-webkit-box-shadow': shadowStyle,
            'border-radius': roundedStyle, '-moz-border-radius': roundedStyle, '-webkit-border-radius': roundedStyle
        };
        var thisChatContainerHeadlineCss = {position: 'absolute', left: '0px', top: '0px',
            width: chatContainerWidth + 'px', height: '22px',
            'border-top-left-radius': '4px', 'border-top-right-radius': '4px',
            'border-bottom': '1px solid #ccc', background: '#f5f5f5',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient(''),
            'font-weight': 'bold', 'font-size': '10px', 'line-height': '0px',
            'text-align': 'left', 'padding-left': '10px'};
        var thisTranslationContainerCss = this.lzm_commonTools.clone(thisChatContainerCss);
        thisTranslationContainerCss['overflow-y'] = 'auto';
        this.TranslationContainerHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.TranslationContainerHeadline2Css = this.createSecondHeadlineCssFromFirst(this.TranslationContainerHeadlineCss);
        this.TranslationContainerFootlineCss = this.createFootlineCssFromHeadline(this.TranslationContainerHeadlineCss, chatContainerWidth, chatContainerHeight, roundedStyle);
        var thisUsersettingsContainerCss = this.lzm_commonTools.clone(thisChatContainerCss);
        thisUsersettingsContainerCss['overflow-x'] = 'hidden';
        this.UsersettingsContainerHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.UsersettingsContainerHeadline2Css = this.createSecondHeadlineCssFromFirst(this.UsersettingsContainerHeadlineCss);
        this.UsersettingsContainerBodyCss = this.lzm_commonTools.clone(thisChatContainerCss);
        this.UsersettingsContainerBodyCss.top = chatContainerTop + 17;
        this.UsersettingsContainerBodyCss.left = chatContainerLeft;
        this.UsersettingsContainerBodyCss.height = chatContainerHeight - 79;
        this.UsersettingsContainerBodyCss['overflow-y'] = 'auto';
        delete this.UsersettingsContainerBodyCss['border'];
        delete this.UsersettingsContainerBodyCss['-moz-border'];
        delete this.UsersettingsContainerBodyCss['-webkit-border'];
        delete this.UsersettingsContainerBodyCss['border-radius'];
        delete this.UsersettingsContainerBodyCss['-moz-border-radius'];
        delete this.UsersettingsContainerBodyCss['-webkit-border-radius'];
        this.UsersettingsContainerFootlineCss = this.createFootlineCssFromHeadline(this.UsersettingsContainerHeadlineCss, chatContainerWidth, chatContainerHeight, roundedStyle, 'small');
        /***********************************************************************************************************************************************************************/
        var thisQrdTreeCss = this.lzm_commonTools.clone(thisChatContainerCss);
        //thisQrdTreeCss['overflow-x'] = 'hidden';
        this.QrdTreeHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.QrdTreeHeadline2Css = this.createSecondHeadlineCssFromFirst(this.QrdTreeHeadlineCss);
        this.QrdTreeHeadline2Css['font-size'] = '11px';
        this.QrdTreeHeadline2Css['font-weight'] = 'none';
        this.QrdTreeHeadline2Css['height'] = '0px';
        this.QrdTreeBodyCss = this.lzm_commonTools.clone(this.UsersettingsContainerBodyCss);
        this.QrdTreeBodyCss['overflow-x'] = 'auto';
        this.QrdTreeBodyCss['height'] = (parseInt(this.QrdTreeBodyCss['height']) + 28) + 'px';
        this.QrdTreeBodyCss['top'] = (parseInt(this.QrdTreeBodyCss['top']) + 3) + 'px';
        this.QrdTreeBodyCss['overflow-x'] = 'auto';
        this.QrdTreeFootlineCss = this.createFootlineCssFromHeadline(this.QrdTreeHeadlineCss, chatContainerWidth, chatContainerHeight, roundedStyle, 'small');
        /***********************************************************************************************************************************************************************/
        var thisTicketCss = this.lzm_commonTools.clone(thisChatContainerCss);
        this.TicketHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.TicketHeadline2Css = this.createSecondHeadlineCssFromFirst(this.TicketHeadlineCss);
        this.TicketHeadline2Css['text-align'] = 'right';
        this.TicketHeadline2Css['font-size'] = '11px';
        this.TicketHeadline2Css['font-weight'] = 'none';
        this.TicketBodyCss = this.lzm_commonTools.clone(this.UsersettingsContainerBodyCss);
        this.TicketBodyCss['top'] = (parseInt(this.TicketBodyCss['top']) + viewSelectPanelHeight) + 'px';
        this.TicketBodyCss['overflow-x'] = 'auto';
        this.TicketFootlineCss = this.createFootlineCssFromHeadline(this.TicketHeadlineCss, chatContainerWidth, chatContainerHeight, roundedStyle, 'small');
        this.TicketFootlineCss['text-align'] = 'center';
        /***********************************************************************************************************************************************************************/
        var thisArchiveCss = this.lzm_commonTools.clone(thisChatContainerCss);
        this.ArchiveHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.ArchiveHeadline2Css = this.createSecondHeadlineCssFromFirst(this.ArchiveHeadlineCss);
        this.ArchiveHeadline2Css['text-align'] = 'right';
        this.ArchiveHeadline2Css['font-size'] = '11px';
        this.ArchiveHeadline2Css['font-weight'] = 'none';
        this.ArchiveBodyCss = this.lzm_commonTools.clone(this.TicketBodyCss);
        this.ArchiveFootlineCss = this.createFootlineCssFromHeadline(this.ArchiveHeadlineCss, chatContainerWidth, chatContainerHeight, roundedStyle, 'small');
        this.ArchiveFootlineCss['text-align'] = 'center';
        /***********************************************************************************************************************************************************************/
        var thisOperatorListCss = {width: operatorListWidth + 'px', height: chatContainerHeight + 'px', padding: '5px',
            position: 'absolute', display: operatorListDisplay, left: operatorListLeft + 'px', top: operatorListTop, background: background,
            border: borderStyle, '-moz-border': borderStyle, '-webkit-border': borderStyle,
            //'box-shadow': shadowStyle, '-moz-box-shadow': shadowStyle, '-webkit-box-shadow': shadowStyle,
            'border-radius': roundedStyle, '-moz-border-radius': roundedStyle, '-webkit-border-radius': roundedStyle};
        this.OperatorListHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.OperatorListHeadlineCss.width = operatorListWidth+'px';
        this.OperatorListHeadline2Css = this.createSecondHeadlineCssFromFirst(this.OperatorListHeadlineCss);
        this.OperatorListHeadline2Css['height'] = '0px';
        this.TemplateBodyCss = {position: 'absolute', top: '48px', width: (operatorListWidth + 5)+'px',
            height: (chatContainerHeight-38)+'px', 'overflow-y': 'auto'};
        this.OperatorListBodyCss = lzm_commonTools.clone(this.TemplateBodyCss);
        this.OperatorListBodyCss['height'] = (parseInt(this.OperatorListBodyCss['height']) + 25) + 'px';
        this.OperatorListBodyCss['top'] = (parseInt(this.OperatorListBodyCss['top']) - 25) + 'px';
        var thisChatTableCss = {width: chatTableWidth + 'px', height: chatTableHeight + 'px',
            padding: '5px 5px 5px 5px', position: 'absolute', left: '0px', display: 'block',
            top: chatTableTop + 'px'};
        var thisVisitorListCss = {width: visitorListWidth + 'px', height: visitorListHeight + 'px', padding: '5px 5px 5px 5px',
            position: 'absolute', left: visitorListLeft + 'px', display: visitorListDisplay, top: visitorListTop + 'px',
            border: borderStyle, '-moz-border': borderStyle, '-webkit-border': borderStyle,
            //'box-shadow': shadowStyle, '-moz-box-shadow': shadowStyle, '-webkit-box-shadow': shadowStyle,
            'border-radius': roundedStyle, '-moz-border-radius': roundedStyle, '-webkit-border-radius': roundedStyle,
            'overflow': 'hidden', background: background};
        this.VisitorListHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.VisitorListHeadlineCss.width = visitorListWidth+'px';
        this.VisitorListHeadline2Css = this.createSecondHeadlineCssFromFirst(this.VisitorListHeadlineCss);
        var visitorListTableWidth = (this.displayWidth != 'small') ? $('#visitor-list').width() - 20 : $('#visitor-list').width();
        this.visitorListTableCss = {position: 'absolute',
            width: visitorListTableWidth+'px', height: ($('#visitor-list').height() - 48)+'px',
            'top': '48px', 'left': '0px', overflow: 'auto', padding: '5px'};
        var thisVisitorInfoCss = {padding: '5px 5px 5px 5px', width: visitorInfoWidth + 'px', height: visitorInfoHeight + 'px',
            position: 'absolute', left: visitorInfoLeft + 'px', background: background,
            border: borderStyle, '-moz-border': borderStyle, '-webkit-border': borderStyle,
            //'box-shadow': shadowStyle, '-moz-box-shadow': shadowStyle, '-webkit-box-shadow': shadowStyle,
            'border-radius': roundedStyle, '-moz-border-radius': roundedStyle, '-webkit-border-radius': roundedStyle,
            top: visitorInfoTop + 'px', 'overflow-y': 'auto', display: thisVisitorInfoVisibility};
        this.VisitorInfoHeadlineCss = this.lzm_commonTools.clone(thisChatContainerHeadlineCss);
        this.VisitorInfoHeadlineCss.width = visitorInfoWidth+'px';
        this.VisitorInfoHeadline2Css = this.createSecondHeadlineCssFromFirst(this.VisitorInfoHeadlineCss);
        this.VisitorInfoFootlineCss = this.createFootlineCssFromHeadline(this.VisitorInfoHeadlineCss, visitorInfoWidth, visitorInfoHeight, roundedStyle, 'small');
        this.VisitorInfoBodyCss = this.lzm_commonTools.clone(this.TemplateBodyCss);
        this.VisitorInfoBodyCss.width = (visitorInfoWidth + 5)+'px';
        this.VisitorInfoBodyCss.height = (chatContainerHeight - 67)+'px';
        this.VisitorInfoBodyCss.top = '49px';
        this.VisitorInfoBodyCss['overflow-y'] = 'scroll';
        var thisChatCss = {width: chatWindowWidth + 'px', height: chatWindowHeight + 'px', padding: '5px 5px 5px 5px',
            position: 'absolute', left: (userControlPanelPosition.left) + 'px',
            top: (chatWindowTop) + 'px'};
        //var thisChatTitleCss = {width: (chatTableWidth) + 'px'};
        var thisChatButtonsCss = {width: (chatTableWidth + 10)+'px', height: '25px', background: '#f4f4f4',
            'position': 'absolute', 'top': chatButtonTop+'px', left: '0px', 'padding-bottom': '5px',
            'text-align': 'left'};
        var thisChatInputControlsCss = {position: 'absolute', width: (chatTableWidth + 10) + 'px', height: '0px',
            border: '0px', '-moz-border': '0px', '-webkit-border': '0px',
            left: '0px', top: '0px', 'text-align': 'left', 'font-size': '12px',
            margin: '14px 5px'};
        var thisChatInputCss = {position: 'absolute', width: (chatTableWidth + 6) + 'px', height: '46px',
            border: '0px', '-moz-border': '0px', '-webkit-border': '0px',
            'border-bottom-left-radius': '4px', 'border-bottom-right-radius': '4px',
            left: '0px', top: '0px', 'text-align': 'left', 'font-size': '12px',
            'overflow': 'hidden'};
        var thisChatInputBodyCss = {position: 'absolute', width: (chatTableWidth + 10) + 'px', height: '50px',
            border: '0px', '-moz-border': '0px', '-webkit-border': '0px',
            'border-bottom-left-radius': '4px', 'border-bottom-right-radius': '4px',
            left: '0px', top: '0px', /*'text-align': 'left', 'font-size': '12px',*/
            'overflow-y': 'hidden'};
        var thisChatActionCss = {width: (chatTableWidth + 10)+'px', height: '50px', 'line-height': '0px', 'overflow': 'hidden',
            'border-bottom-left-radius': '4px', 'border-bottom-right-radius': '4px',
            'top': (chatButtonTop + 30)+'px', left: '0px',
            position: 'absolute', 'background-color': '#ffffff'};
        var thisChatProgressCss = {position: 'absolute', left: '0px', top: '0px', width: (chatTableWidth + 10)+'px',
            height: (chatTableHeight - thisChatAction.height() - /*thisChatTitle.height() -*/ thisChatButtons.height() + 14) + 'px',
            'overflow-y': 'scroll', 'overflow-x': 'hidden'};
        var thisChatLogoCss = {width: chatTableWidth, height: chatTableHeight, 'overflow': 'hidden'};
        var thisLogoPageCss = {width: chatTableWidth, height: chatTableHeight, border: '0px', background: '#ffffff',
            'border-radius': roundedStyle, '-moz-border-radius': roundedStyle, '-webkit-border-radius': roundedStyle};
        var thisActiveChatPanelCss = {position: 'absolute', left: '0px', top: (5 + 18)+'px', height: this.activeChatPanelHeight+'px',
            width: (chatTableWidth + 10) + 'px', 'text-align': 'left', background: '#ededed',
            margin: '0px'};

        var dialogWindowBorder = (this.dialogWindowWidth < windowWidth && this.dialogWindowHeight < windowHeight) ? '2px solid #666' : '0px';
        var dialogWindowBorderRadius = (this.dialogWindowWidth < windowWidth && this.dialogWindowHeight < windowHeight) ? '6px' : '0px';
        var dialWinIntBorderRadius = (this.dialogWindowWidth < windowWidth && this.dialogWindowHeight < windowHeight) ? '4px' : '0px';
        this.dialogWindowContainerCss = {
            position: 'absolute', left: '0px', bottom: '0px', width: windowWidth+'px', height: windowHeight+'px',
            'background-color': 'rgba(0,0,0,0.75)', 'z-index': '1001', overflow: 'hidden'
        };
        this.dialogWindowCss = {
            position: 'absolute', left: this.dialogWindowLeft+'px', bottom: this.dialogWindowTop+'px',
            width: this.dialogWindowWidth+'px', height: this.dialogWindowHeight+'px',
            border: dialogWindowBorder, 'border-radius': dialogWindowBorderRadius, 'z-index': '1002'
        };
        this.dialogWindowHeadlineCss = {
            position: 'absolute', left: '0px', top: '0px', 'border-bottom': '1px solid #ccc',
            width: (this.dialogWindowWidth - 5)+'px', height: '20px',
            'border-top-left-radius': dialWinIntBorderRadius, 'border-top-right-radius': dialWinIntBorderRadius,
            padding: '6px 0px 0px 5px', 'font-weight': 'bold', 'text-shadow': 'none',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
            color: '#ffffff'
        };
        this.dialogWindowBodyCss = {
            position: 'absolute', left: '0px', top: '27px',
            width: (this.dialogWindowWidth - 10)+'px', height: (this.dialogWindowHeight - 73)+'px',
            padding: '4px 5px 4px 5px', 'text-shadow': 'none',
            'background-color': '#FFFFFF', 'overflow-y': 'auto', 'overflow-x': 'hidden'
        };
        this.dialogWindowFootlineCss = {
            position: 'absolute', left: '0px', top: (this.dialogWindowHeight - 38)+'px', 'border-top': '1px solid #ccc',
            width: (this.dialogWindowWidth - 6)+'px', height: '27px', 'text-align': 'right',
            padding: '10px 6px 0px 0px',
            'border-bottom-left-radius': dialWinIntBorderRadius, 'border-bottom-right-radius': dialWinIntBorderRadius,
            'background-color': '#f5f5f5'
        };

        var fscrWdBorder = (this.FullscreenDialogWindowWidth < windowWidth) ? '1px solid #666' : '0px';
        var fscrWdBdRadius = (this.FullscreenDialogWindowWidth < windowWidth) ? '6px' : '0px';
        var fscrWdIntBdRadius = (this.FullscreenDialogWindowWidth < windowWidth) ? '4px' : '0px';
        this.FullscreenDialogWindowCss = {
            position: 'absolute', left: this.FullscreenDialogWindowLeft+'px', bottom: this.FullscreenDialogWindowTop+'px',
            width: this.FullscreenDialogWindowWidth+'px', height: this.FullscreenDialogWindowHeight+'px',
            border: fscrWdBorder, 'border-radius': fscrWdBdRadius, 'z-index': '1002'
        };
        this.FullscreenDialogWindowHeadlineCss = {
            position: 'absolute', left: '0px', top: '0px', 'border-bottom': '1px solid #ccc',
            width: (this.FullscreenDialogWindowWidth - 5)+'px', height: '20px',
            'border-top-left-radius': fscrWdIntBdRadius, 'border-top-right-radius': fscrWdIntBdRadius,
            padding: '6px 0px 0px 5px', 'font-weight': 'bold', 'text-shadow': 'none',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
            color: '#ffffff'
        };
        this.FullscreenDialogWindowBodyCss = {
            position: 'absolute', left: '0px', top: '27px',
            width: (this.FullscreenDialogWindowWidth - 10)+'px', height: (this.FullscreenDialogWindowHeight - 73)+'px',
            padding: '4px 5px 4px 5px', 'text-shadow': 'none',
            'background-color': '#FFFFFF', 'overflow-y': 'auto', 'overflow-x': 'hidden'
        };
        this.FullscreenDialogWindowFootlineCss = {
            position: 'absolute', left: '0px', top: (this.FullscreenDialogWindowHeight - 38)+'px', 'border-top': '1px solid #ccc',
            width: (this.FullscreenDialogWindowWidth - 6)+'px', height: '27px', 'text-align': 'right',
            padding: '10px 6px 0px 0px',
            'border-bottom-left-radius': fscrWdIntBdRadius, 'border-bottom-right-radius': fscrWdIntBdRadius,
            'background-color': '#f5f5f5'
        };

        thisBody.css({background: '#e0e0e0'});
        thisChatPage.css(thisChatPageCss);
        thisChatContainer.css(thisChatContainerCss);
        $('#chat-container-headline').html('<h3>' + t('My Chats') + '</h3>').css(thisChatContainerHeadlineCss);
        $('#translation-container').css(thisTranslationContainerCss);
        $('#translation-container-headline').css(this.TranslationContainerHeadlineCss);
        $('#translation-container-headline2').css(this.TranslationContainerHeadline2Css);
        $('#usersettings-container').css(thisUsersettingsContainerCss);
        $('#usersettings-container-headline').css(this.UsersettingsContainerHeadlineCss);
        $('#usersettings-container-headline2').css(this.UsersettingsContainerHeadline2Css);
        $('#usersettings-container-body').css(this.UsersettingsContainerBodyCss);
        $('#usersettings-container-footline').css(this.UsersettingsContainerFootlineCss);
        thisQrdTree.css(thisQrdTreeCss);
        $('#qrd-tree-headline').css(this.QrdTreeHeadlineCss);
        $('#qrd-tree-headline2').css(this.QrdTreeHeadline2Css);
        $('#qrd-tree-body').css(this.QrdTreeBodyCss);
        $('#qrd-tree-footline').css(this.QrdTreeFootlineCss);
        thisTicket.css(thisTicketCss);
        $('#ticket-list-headline').css(this.TicketHeadlineCss);
        $('#ticket-list-headline2').css(this.TicketHeadline2Css);
        $('#ticket-list-body').css(this.TicketBodyCss);
        $('#ticket-list-footline').css(this.TicketFootlineCss);
        thisArchive.css(thisArchiveCss);
        $('#archive-headline').css(this.ArchiveHeadlineCss);
        $('#archive-headline2').css(this.ArchiveHeadline2Css);
        $('#archive-body').css(this.ArchiveBodyCss);
        $('#archive-footline').css(this.ArchiveFootlineCss);
        thisChatInputControls.css(thisChatInputControlsCss);
        thisChatInput.css(thisChatInputCss);
        thisChatInputBody.css(thisChatInputBodyCss);
        thisChatAction.css(thisChatActionCss);
        //thisChatTitle.css(thisChatTitleCss);
        thisChatButtons.css(thisChatButtonsCss);
        thisChatProgress.css(thisChatProgressCss);
        thisOperatorList.css(thisOperatorListCss);
        $('#operator-list-headline').css(this.OperatorListHeadlineCss);
        $('#operator-list-headline2').css(this.OperatorListHeadline2Css);
        $('#operator-list-body').css(this.OperatorListBodyCss);
        thisChatTable.css(thisChatTableCss);
        thisActiveChatPanel.css(thisActiveChatPanelCss);
        $('#radio-internal-text').css({width: Math.floor((chatContainerWidth + 5) / 5)+'px'});
        $('#radio-external-text').css({width: Math.floor((chatContainerWidth + 5) / 5)+'px'});
        $('#radio-qrd-text').css({width: Math.floor((chatContainerWidth + 5) / 5)+'px'});
        $('#radio-tickets-text').css({width: Math.floor((chatContainerWidth + 5) / 5)+'px'});
        $('#radio-mychats-text').css({width: chatContainerWidth + 3 - 4 * Math.floor((chatContainerWidth + 5) / 5)+'px'});
        $('#radio-left-text').css({width: '48px',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
            'border': '1px solid #666'});
        $('#radio-left-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
            'background-position': '-144px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
            'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '12px'});
        $('#radio-this-text').css({width: (chatContainerWidth + 7 - 96)+'px',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
            'border': '1px solid #666'});
        $('#radio-this-text span.ui-btn-text').css({'text-shadow': '0 1px 0 #777','color': '#ffffff'});
        $('#radio-right-text').css({width: '48px',
            'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
            'border': '1px solid #666'});
        $('#radio-right-text span.ui-icon').css({'background-image': 'url(\'js/jquery_mobile/images/icons-18-white.png\')',
            'background-position': '-108px -1px', 'background-repeat': 'no-repeat', 'background-color': 'rgba(0,0,0,.4)',
            'border-radius': '9px', 'width': '18px', 'height': '18px', 'display': 'block', 'left': '18px'});
        thisVisitorList.css(thisVisitorListCss);
        $('#visitor-list-headline').css(this.VisitorListHeadlineCss);
        $('#visitor-list-headline2').css(this.VisitorListHeadline2Css);
        $('#visitor-list-table-div').css(this.visitorListTableCss);
        thisVisitorInfo.css(thisVisitorInfoCss);
        $('#visitor-info-headline').css(this.VisitorInfoHeadlineCss);
        $('#visitor-info-headline2').css(this.VisitorInfoHeadline2Css);
        $('#visitor-info-body').css(this.VisitorInfoBodyCss);
        $('#visitor-info-footline').css(this.VisitorInfoFootlineCss);
        thisChat.css(thisChatCss);
        $('.dialog-window-container').css(this.dialogWindowContainerCss);
        $('.dialog-window').css(this.dialogWindowCss);
        $('.dialog-window-headline').css(this.dialogWindowHeadlineCss);
        $('.dialog-window-body').css(this.dialogWindowBodyCss);
        $('.dialog-window-footline').css(this.dialogWindowFootlineCss);
        $('.dialog-window-fullscreen').css(this.FullscreenDialogWindowCss);
        $('.dialog-window-headline-fullscreen').css(this.FullscreenDialogWindowHeadlineCss);
        $('.dialog-window-body-fullscreen').css(this.FullscreenDialogWindowBodyCss);
        $('.dialog-window-footline-fullscreen').css(this.FullscreenDialogWindowFootlineCss);

        if (typeof thisChatLogo != 'undefined') {
            thisChatLogo.css(thisChatLogoCss);
            $('#logo-page').css(thisLogoPageCss);
        }

        $('#debugging-messages').css({
            position: 'fixed',
            top: Math.floor(0.3 * $(window).height())+'px',
            left: Math.floor(0.3 * $(window).width())+'px',
            width: Math.floor(0.4 * $(window).width())+'px',
            height: Math.floor(0.4 * $(window).height())+'px',
            padding: '10px',
            'background-color': '#ffffc6',
            opacity: '0.9',
            display: this.debuggingDisplayMode,
            'z-index': 1000
        });

        this.windowWidth = windowWidth;
        this.windowHeight = windowHeight;
    }

    var thisShowVisitorInfo = $('#show-visitor-info');
    var thisAcceptChat = $('#accept-chat');
    var thisLeaveChat = $('#leave-chat');
    var thisDeclineChat = $('#decline-chat');
    var thisForwardChat = $('#forward-chat');
    if (typeof thisShowVisitorInfo != 'undefined' && typeof thisAcceptChat != 'undefined' &&
        typeof thisDeclineChat != 'undefined' && typeof thisLeaveChat != 'undefined' &&
        typeof thisForwardChat != 'undefined' && typeof thisSendBtn != 'undefined') {
        if (thisShowVisitorInfo.width() + thisAcceptChat.width() + thisDeclineChat.width() +
            thisLeaveChat.width() + thisForwardChat.width() + thisSendBtn.width() +
            thisBlankChatBtn.width() > chatTableWidth) {
            thisBlankChatBtn.css('width', '0px');
            //thisChatTitle.trigger('create');
        }
    }

    lzm_displayLayout.resizeAll();

    this.toggleVisibility();
};

ChatDisplayClass.prototype.changeViewSelectButtonDesign = function(activeView) {
    var views = ['mychats', 'internal', 'external', 'tickets', 'qrd'];
    for (var i=0; i<views.length; i++) {
        if (views[i] != activeView) {
            if (views[i] != 'mychats' || !this.chatActivity || (!this.settingsDialogue && this.selected_view == 'mychats')) {
                $('#radio-' + views[i] + '-text').css({
                    'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'darkViewSelect'),
                    'border': '1px solid #666'
                });
                $('#radio-' + views[i] + '-text').find('span').find('.ui-btn-text').css({
                    'text-shadow': '0 1px 0 #666',
                    'color': '#ffffff'
                });
            }
        } else {
            $('#radio-' + views[i] + '-text').css({
                'background-image': lzm_displayHelper.addBrowserSpecificGradient('', 'selectedViewSelect'),
                'border': '1px solid #2373a5'
            });
            $('#radio-' + views[i] + '-text').find('span').find('.ui-btn-text').css({
                'text-shadow': '0 1px 0 #2373a5',
                'color': '#ffffff'
            });
        }
    }
};

/**
 * Toggle the visibility of the chat, operator list and visitor list and info depending on selected view
 */
ChatDisplayClass.prototype.toggleVisibility = function () {
    var thisOperatorList = $('#operator-list');
    var thisTicketList = $('#ticket-list');
    var thisArchive = $('#archive');
    var thisChat = $('#chat');
    var thisChatContainer = $('#chat-container');
    var thisErrors = $('#errors');
    var thisChatTable = $('#chat-table');
    var thisActiveChatPanel = $('#active-chat-panel');
    var thisVisitorList = $('#visitor-list');
    var thisQrdTree = $('#qrd-tree');
    var thisRadioSelectedView = $('#radio-' + this.selected_view);

    $('.view-select').each(function () {
        $(this).prop('checked', false);
        $(this).checkboxradio("refresh");
    });
    thisRadioSelectedView.prop('checked', true);
    thisRadioSelectedView.checkboxradio("refresh");

    if (this.displayWidth == 'small') {
        this.changeViewSelectButtonDesign(this.selected_view);
        switch (this.selected_view) {
            case 'mychats':
                $('#chat-container-headline').html('<h3>' + t('My Chats') + '</h3>');
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'block');
                thisChatTable.css('display', 'block');
                if (typeof this.thisUser.id == 'undefined' || this.thisUser.id == '') {
                    $('#chat-logo').css('display', 'block');
                    $('#chat-progress').css('display', 'none');
                    $('#chat-action').css('display', 'none');
                    //$('#chat-title').css('display', 'none');
                    $('#chat-buttons').css('display', 'none');
                } else {
                    $('#chat-logo').css('display', 'none');
                    $('#chat-progress').css('display', 'block');
                    $('#chat-action').css('display', 'block');
                    //$('#chat-title').css('display', 'block');
                    $('#chat-buttons').css('display', 'block');
                }
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisErrors.css('display', 'none');
                thisActiveChatPanel.css('display', 'block');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'none');
                if (this.thisUser.id == '')
                    this.switchCenterPage('home');
                break;
            case 'internal':
                thisOperatorList.css('display', 'block');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'none');
                break;
            case 'external':
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'block');
                thisQrdTree.css('display', 'none');
                break;
            case 'qrd':
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'block');
                break;
            case 'tickets':
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'block');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'none');
                break;
            case 'archive':
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'block');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'none');
                break;
            case 'filter':
                thisOperatorList.css('display', 'none');
                thisTicketList.css('display', 'none');
                thisArchive.css('display', 'none');
                thisChat.css('display', 'block');
                thisChatContainer.css('display', 'none');
                thisChatTable.css('display', 'none');
                thisErrors.css('display', 'none');
                this.VisitorListCreated = false;
                $('#visitor-list-table').remove();
                thisActiveChatPanel.css('display', 'none');
                thisVisitorList.css('display', 'none');
                thisQrdTree.css('display', 'none');
                break;
        }
    }
};

/**
 * Logout on a validation error alerting the user.
 * @param validationError
 * @param isWeb
 * @param isApp
 * @param chosenProfile
 */
ChatDisplayClass.prototype.logoutOnValidationError = function (validationError, isWeb, isApp, chosenProfile) {
    //console.log('Validation error: ' + validationError + ' - count: ' + this.validationErrorCount);
    if (this.validationErrorCount == 0 && validationError != '3') {
        tryNewLogin();
    } else if (validationError == '3') {
        alert(t("You've been logged off by another operator!"));
        this.stopRinging([]);
        this.askBeforeUnload = false;
        if (!isApp) {
            var loginPage = 'index.php';
            if (this.multiServerId != '') {
                var decodedMultiServerId = lz_global_base64_url_decode(this.multiServerId);
                loginPage += '#' + decodedMultiServerId;
            }
            window.location.href = loginPage;
        } else {
            try {
                lzm_deviceInterface.openLoginView();
            } catch(ex) {
                console.log('Opening the login view failed.');
            }
        }
    } else if (this.validationErrorCount == 1) {
        //console.log('Validation error');
        //this.validationErrorCount = 0;
        this.askBeforeUnload = false;
        var noLogout = false;
        switch (validationError) {
            case '0':
                alert(t('Wrong username or password.'));
                break;
            case '2':
                alert(t('The operator <!--op_login_name--> is already logged in.',[['<!--op_login_name-->', this.myLoginId]]));
                break;
            case '3':
                alert(t("You've been logged off by another operator!"));
                break;
            case "4":
                alert(t('Session timed out.'));
                break;
            case "5":
                alert(t('You have to change your password.'));
                break;
            case "9":
                alert(t('You are not an administrator.'));
                break;
            case "10":
                alert(t('This LiveZilla server has been deactivated by the administrator.') + '\n' +
                    t('If you are the administrator, please activate this server under LiveZilla Server Admin -> Server Configuration -> Server.'));
                break;
            case "13":
                alert(t('There are problems with the database connection.'));
                break;
            case "14":
                alert(t('This server requires secure connection (SSL). Please activate HTTPS in the server profile and try again.'));
                break;
            case "15":
                alert(t('Your account has been deactivated by an administrator.'));
                break;
            case "19":
                alert(t('No mobile access permitted.'));
                break;
            default:
                alert('Validation Error : ' + validationError);
                break;
        }
        if (!noLogout) {
            this.stopRinging([]);
            this.askBeforeUnload = false;
            if (!isApp) {
                var loginPage = 'index.php';
                if (this.multiServerId != '') {
                    var decodedMultiServerId = lz_global_base64_url_decode(this.multiServerId);
                    loginPage += '#' + decodedMultiServerId;
                }
                window.location.href = loginPage;
            } else {
                try {
                    lzm_deviceInterface.openLoginView();
                } catch(ex) {
                    console.log('Opening the login view failed.');
                }
            }
        } else {
            this.validationErrorCount = 0;
        }
    }
    this.validationErrorCount++;
};

/**
 * Create the html code for the debugging error view
 */
ChatDisplayClass.prototype.createErrorHtml = function (global_errors) {
    var errorHtmlString = '';
    for (var errorIndex = 0; errorIndex < global_errors.length; errorIndex++) {
        errorHtmlString += '<p>' + global_errors[errorIndex] + '</p>';
        try {
            console.log(global_errors[errorIndex]);
        } catch(e) {}
    }
    $('#errors').html(errorHtmlString);
};

ChatDisplayClass.prototype.setExternalUserList = function(type, list) {
    if (type == 'changed') {
        this.changedExternalUsers = list;
    } else if (type == 'new') {
        this.newExternalUsers = list;
    }
};

ChatDisplayClass.prototype.getExternalUserList = function(type) {
    var list;
    if (type == 'changed') {
        list = this.changedExternalUsers;
    } else if (type == 'new') {
        list = this.newExternalUsers;
    }
    return list;
};

/**
 * Update the visitor list
 * @param external_users
 * @param chatObject
 * @param internal_users
 */
ChatDisplayClass.prototype.updateVisitorList = function (external_users, chatObject, internal_users) {
    if (!this.VisitorListCreated) {
        this.createVisitorList(external_users, chatObject, internal_users);
    } else {
        if (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.visitorListIsScrolling > 2000) {
            if (debug) {
                console.log('Update visitor list ' + lzm_chatTimeStamp.getServerTimeString());
            }
            this.activeVisitorNumber = 0;
            var thisVisitorList = $('#visitor-list');
            var visitorListWidth = thisVisitorList.width();
            external_users.sort(this.visitorSortFunction);
            var i = 0, visitorIdList = [], visitorObject ={};
            for (i=external_users.length-1; i>=0; i--) {
                visitorObject[external_users[i].id] = external_users[i];
                if (external_users[i].b.length == 0) {
                    external_users[i].is_active = false;
                }
                var existingLine = '';
                try {
                    existingLine = $('#visitor-list-row-' + external_users[i].id).html();
                } catch(ex) {}
                var lineIsExisting = (typeof existingLine != 'undefined') ? true : false;
                var htmlString, thisLine, cssObject;
                if (external_users[i].is_active) {
                    this.activeVisitorNumber++;
                    visitorIdList.push(external_users[i].id);
                }
                if (external_users[i].is_active && lineIsExisting &&
                    (external_users[i].md5 != $('#visitor-list-row-' + external_users[i].id).data('md5') ||
                    $.inArray(external_users[i].id, lzm_chatServerEvaluation.globalTypingChanges) != -1)) {
                    //console.log(this.changedExternalUsers);
                    thisLine = lzm_displayHelper.createVisitorListLine(external_users[i], chatObject, internal_users, visitorListWidth, false);
                    htmlString = thisLine[0];
                    cssObject = thisLine[1];
                    if (existingLine != htmlString) {
                        try {
                            $('#visitor-list-row-' + external_users[i].id).html(htmlString).css(cssObject);
                            if (typeof $('#visitor-list-row-' + external_users[i].id).attr('onclick') != 'undefined')
                                $('#visitor-list-row-' + external_users[i].id).attr('onclick', thisLine[2]);
                            if (typeof $('#visitor-list-row-' + external_users[i].id).attr('ondblclick') != 'undefined')
                                $('#visitor-list-row-' + external_users[i].id).attr('ondblclick', thisLine[3]);
                            if (typeof $('#visitor-list-row-' + external_users[i].id).attr('oncontextmenu') != 'undefined')
                                $('#visitor-list-row-' + external_users[i].id).attr('oncontextmenu', thisLine[4]);
                        } catch(ex) {}
                    }
                } else if (external_users[i].is_active && !lineIsExisting) {
                    htmlString = lzm_displayHelper.createVisitorListLine(external_users[i], chatObject, internal_users, visitorListWidth, true)[0];
                    var nextLine = '#visitor-list-row-ERROR';
                    try {
                        nextLine = lzm_displayHelper.getVisitorListLinePosition(external_users[i], external_users);
                    } catch(e) {}
                    if ($('#' + nextLine).length > 0) {
                        $('#' + nextLine).after(htmlString);
                    } else {
                        $('#visitor-list-body').prepend(htmlString);
                    }
                } else if (!external_users[i].is_active && lineIsExisting) {
                    $('#visitor-list-row-' + external_users[i].id).remove();
                } else {
                    //console.log('Ignoring user --- ' + lzm_chatTimeStamp.getServerTimeString())
                    //console.log(external_users[i].md5 + ' --- ' + $('#visitor-list-row-' + external_users[i].id).data('md5'));
                }
            }
            $('.visitor-list-line').each(function() {
                var userId = $(this).data('user-id');
                if ($.inArray(userId, visitorIdList) == -1) {
                    $('#visitor-list-row-' + userId).remove();
                }
                var timeColumns = lzm_displayHelper.getVisitorOnlineTimes(visitorObject[userId]);
                $('#visitor-online-' + userId).html(timeColumns['online']);
                $('#visitor-activ-' + userId).html(timeColumns['activ']);
            });
            lzm_chatServerEvaluation.globalTypingChanges = [];
            this.newExternalUsers = [];
            this.changedExternalUsers = [];

            var headline2String = '<div style="font-size: 11px; font-weight: normal; margin-top: 12px;">' + t('Visitors online: <!--visitor_number-->',[['<!--visitor_number-->', this.activeVisitorNumber]]) + '</div>';
            $('#visitor-list-headline2').html(headline2String).css(this.VisitorListHeadline2Css);

            //thisVisitorList.trigger('create');
            //console.log('Updated visitor list: ' + $.now());
            this.visitorListScrollingWasBlocked = false;
            //console.log('Update visitor list --- ' + lzm_chatTimeStamp.getServerTimeString());
        } else {
            blockVisitorListUpdate();
            //console.log('Block visitor list --- ' + lzm_chatTimeStamp.getServerTimeString());
        }
    }
};

/**
 * Create the visitor list
 */
ChatDisplayClass.prototype.createVisitorList = function (external_users, chatObject, internal_users) {
    //console.log('Create visitor list');
    this.VisitorListCreated = true;
    var i = 0;
    var thisVisitorList = $('#visitor-list');
    var visitorListWidth = thisVisitorList.width();
    external_users.sort(this.visitorSortFunction);
    var resizeVisitorDivCss = {width: '30px', height: '18px', 'background-color': '#ddd',
        'background-image': 'url("img/408-up_down.png")', 'background-repeat': 'no-repeat', 'background-position': 'center',
        position: 'absolute', cursor: 'move',
        top: '2px', left: ($('#visitor-list-headline').width()/2 - 15)+'px',
        'border-radius': '8px', '-moz-border-radius': '8px', '-webkit-border-radius': '8px'};
    var resizeVisitorAlternativeDivCss = {position: 'absolute', top: ($('#visitor-list-headline').height() + 1)+'px',
        left: ($('#visitor-list').width() - 20 + 10)+'px', width: '20px',
        height: ($('#visitor-list').height() - $('#visitor-list-headline').height() + 10 - 1)+'px',
        'border-bottom-right-radius': '4px',
        'background-color': '#f5f5f5'};
    resizeVisitorDivCss.display = 'none';
    resizeVisitorAlternativeDivCss.display = 'none';

    var extUserHtmlString = '<div id="visitor-list-headline"><h3>' + t('Visitors') + '</h3>' +
        '<div title="' + t('Change size') + '" id="resize-visitor-list" draggable="true" ondragend="testDrag();"></div>' +
        '</div><div id="visitor-list-headline2"></div><div id="visitor-list-table-div">' +
        '<table id="visitor-list-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;"><thead><tr>';
    extUserHtmlString += '<th style="width: 18px;">&nbsp;&nbsp;&nbsp;</th>';
    extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    /*if (!this.isApp) {
        extUserHtmlString += '<th style="width: 18px;">&nbsp;&nbsp;&nbsp;</th>';
    } else {
        extUserHtmlString += '<th style="width: 24px !important;" id="debugging-info-th">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>';
    }*/
    extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    //extUserHtmlString += '<th>&nbsp;&nbsp;&nbsp;</th>';
    extUserHtmlString += '<th>' + t('Online').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Last Activity').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Name').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Country').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Language').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Region').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('City').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Page').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Search string').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Host').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('IP address').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Email').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Company').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Browser').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Resolution').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Operating system').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('Last Visit').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    extUserHtmlString += '<th>' + t('ISP').replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
    for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
        var customInputId = lzm_chatServerEvaluation.inputList.idList[i];
        if (parseInt(customInputId) < 111 && lzm_chatServerEvaluation.inputList.getCustomInput(customInputId).active == 1) {
            extUserHtmlString += '<th>' + lzm_chatServerEvaluation.inputList.getCustomInput(customInputId).name.replace(/-/g,'&#8209;').replace(/ /g,'&nbsp;') + '</th>';
        }
    }
    extUserHtmlString += '</tr></thead><tbody id="visitor-list-body">';

    this.activeVisitorNumber = 0;
    for (i = 0; i < external_users.length; i++) {
        if (external_users[i].b.length == 0) {
            external_users[i].is_active = false;
        }
        //console.log('Create line');
        if (external_users[i].is_active) {
            this.activeVisitorNumber++;
            extUserHtmlString += lzm_displayHelper.createVisitorListLine(external_users[i], chatObject, internal_users, visitorListWidth, true)[0];
        }
    }
    extUserHtmlString += '</tbody></table></div>' +
        '<div id="resize-visitor-list-alternative"><div title="' + t('Magnify') + '" id="rvla-larger"></div>' +
        '<div title="' + t('Demagnify') + '" id="rvla-smaller"></div></div>';

    thisVisitorList.html(extUserHtmlString).trigger('create');
    var headline2String = '<div style="font-size: 11px; font-weight: normal; margin-top: 12px;">' + t('Visitors online: <!--visitor_number-->',[['<!--visitor_number-->', this.activeVisitorNumber]]) + '</div>';
    $('#visitor-list-headline').css(this.VisitorListHeadlineCss);
    $('#visitor-list-headline2').html(headline2String).css(this.VisitorListHeadline2Css);
    $('#resize-visitor-list').css(resizeVisitorDivCss);
    $('#resize-visitor-list-alternative').css(resizeVisitorAlternativeDivCss);
    $('#rvla-larger').css({position: 'absolute', width: $('#resize-visitor-list-alternative').width()+'px',
        top: '0px', left: '0px', height: ($('#resize-visitor-list-alternative').height()/2)+'px',
        'background-image': 'url("img/button_rsfplus.gif")', 'background-repeat': 'no-repeat',
        'background-position': 'center bottom', cursor: 'pointer'});
    $('#rvla-smaller').css({position: 'absolute', width: $('#resize-visitor-list-alternative').width()+'px',
        top: ($('#resize-visitor-list-alternative').height()/2)+'px', left: '0px',
        height: ($('#resize-visitor-list-alternative').height()/2)+'px',
        'background-image': 'url("img/button_rsfminus.gif")', 'background-repeat': 'no-repeat',
        'background-position': 'center top', cursor: 'pointer'});
    var visitorListTableWidth = (this.displayWidth != 'small') ? $('#visitor-list').width() - 20 : $('#visitor-list').width();
    this.visitorListTableCss = {position: 'absolute',
        width: visitorListTableWidth+'px', height: ($('#visitor-list').height() - 48)+'px',
        'top': '48px', 'left': '0px', overflow: 'auto', padding: '5px'};
    $('#visitor-list-table-div').css(this.visitorListTableCss);
    $('#rvla-larger').click(function() {testDrag(30)});
    $('#rvla-smaller').click(function() {testDrag(-30)});


    var thisClass = this;
    $('#visitor-list-table-div').on("scrollstart", function() {
        //console.log('Scroll start: ' + $.now());
        thisClass.visitorListScrollingWasBlocked = true;
        thisClass.visitorListIsScrolling = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
    });
};

/**
 * Create the operator list
 */
ChatDisplayClass.prototype.createOperatorList = function (internal_departments, internal_users, chatObject, chosen_profile) {
    internal_users.sort(this.operatorSortFunction);
    // create the left hand side menu for the internal chat view
    var dptLogo = 'img/lz_group_14.png';
    if (typeof chatObject['everyoneintern'] != 'undefined' && chatObject['everyoneintern']['status'] == 'new') {
        dptLogo = 'img/217-quote.png';
    }
    var intUserHtmlString = '<div id="operator-list-headline"><h3>' + t('Operators') + '</h3></div>' +
        '<div id="operator-list-headline2"></div>' +
        '<div id="operator-list-body"><table id="operator-list-table">';
    intUserHtmlString += '<tr><th colspan="2" style="text-align: left; cursor: pointer; padding: 1px 0px;" ' +
        'onclick="chatInternalWith(\'everyoneintern\',\'everyoneintern\',\'' + t('All operators') + '\');">' +
        //'<img src="' + dptLogo + '" width="14px" height="14px" />&nbsp;&nbsp;' + t('All operators') +
        '<span class="operator-list-icon" style="background-image: url(\'' + dptLogo + '\');"></span>&nbsp;&nbsp;' + t('All operators') +
        '</th></tr>';
    for (var i = 0; i < internal_departments.length; i++) {
        if (typeof internal_departments[i].id != 'undefined') {
            dptLogo = 'img/lz_group_14.png';
            if (typeof chatObject[internal_departments[i].id] != 'undefined' && chatObject[internal_departments[i].id]['status'] == 'new') {
                dptLogo = 'img/217-quote.png';
            }
            intUserHtmlString += '<tr><th colspan="2" style="text-align: left; cursor: pointer; padding: 1px 0px;" ' +
                'onclick="chatInternalWith(\'' + internal_departments[i].id + '\',\'' + internal_departments[i].id +
                '\',\'' + internal_departments[i].name + '\');">' +
                //'<img src="' + dptLogo + '" width="14px" height="14px" />&nbsp;&nbsp;' + internal_departments[i].name +
                '<span class="operator-list-icon" style="background-image: url(\'' + dptLogo + '\');"></span>&nbsp;&nbsp;' + internal_departments[i].name +
                '</th></tr>';
            for (var j = 0; j < internal_users.length; j++) {
                var intUserStyle = 'style="text-align: left; padding: 3px 0px 1px 2px;" ';
                //if ($.inArray(internal_users[j].id, incoming_chats) != -1 && active_chat != internal_users[j].id) {
                if (typeof chatObject[internal_users[j].id] != 'undefined' && chatObject[internal_users[j].id]['status'] == 'new') {
                    internal_users[j].logo = 'img/217-quote.png';
                    intUserStyle = 'style="color: #ED9831; font-weight: bold; text-align: left; padding: 2px 0px 0px 2px;" ';
                }
                if ($.inArray(internal_departments[i].id, internal_users[j].groups) != -1) {
                    var onclickAction = '';
                    if (internal_users[j].userid != chosen_profile.login_name &&
                        (typeof internal_users[j].isbot == 'undefined' || internal_users[j].isbot != 1)) {
                        onclickAction = ' onclick="chatInternalWith(\'' + internal_users[j].id + '\',\'' + internal_users[j].userid +
                        '\',\'' + internal_users[j].name + '\');"';
                        var tmpIntUserStyle = intUserStyle.replace(/"$/, '').replace(/" *$/, '');
                        intUserStyle = tmpIntUserStyle + ' cursor: pointer;"';
                    }
                    intUserHtmlString += '<tr><td>&nbsp;&nbsp;</td>' +
                        '<td class="userlist internal-user-' + internal_users[j].id + '" ' + intUserStyle + onclickAction;
                    intUserHtmlString += '>' +
                        //'<img src="' + internal_users[j].logo + '" width="14px" height="14px" />';
                        '<span class="operator-list-icon" style="background-image: url(\'' + internal_users[j].logo + '\');"></span>';
                        if ((internal_users[j].mobileAccount && internal_users[j].status == '2') || (internal_users[j].clientMobile && internal_users[j].status != '2')) {
                            //intUserHtmlString += '&nbsp;<img src="img/661-cellphone.png" />';
                            intUserHtmlString += '&nbsp;<span class="operator-list-mobile-icon" style="background-image: url(\'img/661-cellphone.png\');"></span>';
                        }
                        intUserHtmlString += '&nbsp;' + internal_users[j].name + '</td></tr>';
                }
            }
        }
    }
    intUserHtmlString += '</table></div>';
    $('#operator-list').html(intUserHtmlString);
    $('#operator-list-headline').css(this.OperatorListHeadlineCss);
    $('#operator-list-headline2').css(this.OperatorListHeadline2Css);
    $('#operator-list-body').css(this.OperatorListBodyCss);
    $('#operator-list-table').css({'margin': '6px 2px 2px 2px'});
};

ChatDisplayClass.prototype.switchCenterPage = function(target) {
    if (target == 'home') {
        $('#chat-logo').css('display', 'block');
        $('#chat-action').css('display', 'none');
        $('#chat-buttons').css('display', 'none');
        //$('#chat-title').css('display', 'none');
        setEditorDisplay('none');
        $('#chat-progress').css('display', 'none');
        $('#switch-center-page').css('background-image', lzm_displayHelper.addBrowserSpecificGradient('url("img/612-home_gray.png")','darkViewSelect'));
    } else {
        $('#chat-logo').css('display', 'none');
        $('#chat-action').css('display', 'block');
        if (this.active_chat != '') {
            $('#chat-buttons').css('display', 'block');
            setEditorDisplay('block');
            $('#chat-progress').css('display', 'block');
        }
        $('#switch-center-page').css('background-image', lzm_displayHelper.addBrowserSpecificGradient('url("img/612-home_gray.png")'));
    }
};

/**
 * Create the panel listing all active chats of the logged in operator
 */
ChatDisplayClass.prototype.createActiveChatPanel = function (external_users, internal_users, internal_departments, chatObject, updateVisitorListNow) {
    if (lzm_chatPollServer.dataObject.p_gl_a != 'N') {
        this.myChatsCounter = 0;
        updateVisitorListNow = (typeof updateVisitorListNow == 'undefined') ? true : false;
        if (updateVisitorListNow && this.selected_view == 'external' && $('.dialog-window-container').length == 0) {
            this.updateVisitorList(external_users, chatObject, internal_users);
        }
        var extUserObject = {}, intUserObject = {}, intDepartmentObject = {};
        for (var i=0; i< external_users.length; i++) {
            extUserObject[external_users[i].id] = external_users[i];
        }
        for (var j=0; j<internal_users.length; j++) {
            intUserObject[internal_users[j].id] = internal_users[j];
        }
        for (var k=0; k<internal_departments.length; k++) {
            intDepartmentObject[internal_departments[k].id] = internal_departments[k];
        }

        var thisActiveChatPanel = $('#active-chat-panel');
        var onclickAction = '';
        var buttonId = '';
        var senderName = '';
        var senderId = '';
        var senderBId = '';
        var senderChatId = '';
        var senderUserId = '';
        var activeCounter = 0;
        var thisActiveChatPanelWidth = thisActiveChatPanel.width();

        var defaultCss = ' height: 22px; position: absolute; padding: 0px 5px 0px 21px; text-align: center; font-size: 11px; ' +
            'overflow: hidden; cursor: pointer; border: 1px solid #ccc; border-radius: 4px; vertical-align: middle;';
        this.templateCloseButton = '<div id="%BTNID%" %BTNONCLICK% ' +
            ' style=\'background-image: ' + lzm_displayHelper.addBrowserSpecificGradient('url("img/205-close.png")') + ';' +
            ' background-repeat: no-repeat; background-position: center; display: none;' +
            ' left: %BTNLEFT%px; top: %BTNTOP%px; width: 16px; %BTNDEFAULTCSS%\'></div>';
        var closeButton = this.templateCloseButton.replace(/%BTNID%/g,'close-active-chat').
            replace(/%BTNONCLICK%/g, 'onclick="leaveChat();" ').
            replace(/%BTNDEFAULTCSS%/g , defaultCss.replace(/padding: 0px 5px 0px 21px;/,'padding: 0px 3px 0px 3px;')).
            replace(/%BTNLEFT%/g, thisActiveChatPanelWidth - 26).
            replace(/%BTNTOP%/g, 2);
        var homeButton = '<div id="switch-center-page" onclick="switchCenterPage(\'home\');" ' +
            'style=\'background-image: ' + lzm_displayHelper.addBrowserSpecificGradient('url("img/612-home_gray.png")') + ';' +
            ' background-repeat: no-repeat; background-position: center;' +
            ' left: 2px; top: 2px; width: 16px; ' + defaultCss.replace(/padding: 0px 5px 0px 21px;/,'padding: 0px 3px 0px 3px;') + '\'></div>';
        var activityHtml = homeButton + closeButton;
        //console.log(activityHtml);

        var newIncomingChats = [];
        this.chatActivity = false;
        //console.log('Set chatActivity to false');
        var thisDivLeft = [30];
        var thisLine = 0;
        for (var sender in chatObject) {
            if (chatObject.hasOwnProperty(sender)) {
                var senderIsActive = false;
                var senderDoesExist = false;
                if (chatObject[sender].id != '' && (chatObject[sender].type == 'external' && chatObject[sender].status == 'new' && $.inArray(sender, this.openChats) == -1)) {
                    newIncomingChats.push(sender);
                    //console.log('New incoming chat from ' + sender);
                }
                // (chatObject[sender].status != 'left' || sender == this.active_chat_reco) &&
                if (chatObject[sender].id != '' && ((chatObject[sender].status != 'left' && chatObject[sender].status != 'declined') || $.inArray(sender, this.closedChats) == -1)) {
                    if (chatObject[sender].type == 'external') {
                        var senderParts = sender.split('~');
                        if (typeof extUserObject[senderParts[0]] != 'undefined') {
                            if (typeof chatObject[sender].name == 'undefined' && extUserObject[senderParts[0]].b_cname != '') {
                                senderName = extUserObject[senderParts[0]].b_cname;
                            } else if (typeof chatObject[sender].name == 'undefined' || chatObject[sender].name == '') {
                                    senderName = extUserObject[senderParts[0]].unique_name;
                            } else {
                                senderName = chatObject[sender].name;
                            }
                            senderId = senderParts[0];
                            senderBId = senderParts[1];
                            //senderChatId = extUserObject[senderParts[0]].b_chat.id;
                            senderChatId = chatObject[sender].chat_id;
                            onclickAction = ' onclick="viewUserData(\'' + senderId + '\', \'' + senderBId + '\', \'' +
                                senderChatId + '\', true)"';
                            buttonId = ' id="chat-button-' + senderId + '_' + senderBId + '"';
                            senderIsActive = extUserObject[senderParts[0]].is_active;
                            senderDoesExist = true;
                        }
                    } else {
                        senderDoesExist = true;
                        if (typeof intUserObject[sender] != 'undefined') {
                            senderId = intUserObject[sender].id;
                            senderUserId = intUserObject[sender].userid;
                            senderName = intUserObject[sender].name;
                            onclickAction = ' onclick="chatInternalWith(\'' + senderId + '\', \'' + senderUserId + '\', \'' +
                                senderName + '\')"';
                            buttonId = ' id="chat-button-' + senderId + '"';
                            senderIsActive = intUserObject[sender].is_active;
                        }
                        if (typeof intDepartmentObject[sender] != 'undefined') {
                            senderId = intDepartmentObject[sender].id;
                            senderUserId = intDepartmentObject[sender].id;
                            senderName = intDepartmentObject[sender].name;
                            onclickAction = ' onclick="chatInternalWith(\'' + senderId + '\', \'' + senderUserId + '\', \'' +
                                senderName + '\')"';
                            buttonId = ' id="chat-button-' + senderId + '"';
                            senderIsActive = intDepartmentObject[sender].is_active;
                        }
                        if (sender == 'everyoneintern') {
                            senderId = 'everyoneintern';
                            senderUserId = 'everyoneintern';
                            senderName = t('All operators');
                            onclickAction = ' onclick="chatInternalWith(\'' + senderId + '\', \'' + senderUserId + '\', \'' +
                                senderName + '\')"';
                            buttonId = ' id="chat-button-' + senderId + '"';
                            senderIsActive = true;
                        }
                    }

                    var buttonLogo = 'img/lz_offline_14.png';
                    if (sender == 'everyoneintern' || typeof intDepartmentObject[sender] != 'undefined') {
                        buttonLogo = 'img/lz_group_14.png';
                    } else if (typeof intUserObject[sender] != 'undefined') {
                        buttonLogo = intUserObject[sender].status_logo;
                    } else if (typeof extUserObject[sender.split('~')[0]] != 'undefined' &&
                        extUserObject[sender.split('~')[0]].is_active &&
                        chatObject[sender]['status'] != 'left' &&
                        chatObject[sender]['status'] != 'declined') {
                        buttonLogo = 'img/lz_online_14.png';
                        this.myChatsCounter++;
                    }
                    var bgGradientColor = '';
                    if (chatObject[sender]['status'] == 'new' ||
                        (typeof chatObject[sender].fupr != 'undefined' &&
                        (typeof chatObject[sender].fuprDone == 'undefined' ||
                        chatObject[sender].fuprDone != chatObject[sender].fupr.id))) {
                        this.chatActivity = true;
                    }
                    if (sender == this.active_chat_reco) {
                        defaultCss += ' background:#898989; color:#FFF; text-shadow: 0 0px #fff; border-color: #666;';
                        bgGradientColor = 'darkViewSelect';
                    } else {
                        defaultCss += ' background:#DDD; color:#000; border-color: #ccc;';
                        bgGradientColor = '';
                    }
                    if (senderDoesExist && (chatObject[sender].type == 'external' || (chatObject[sender].status != 'left'))) {
                        var thisDivTop = 2 + thisLine * 28;
                        var displaySenderName = this.lzm_commonTools.htmlEntities(senderName);
                        if (typeof senderName != 'undefined' && senderName.length > 18){
                            displaySenderName = this.lzm_commonTools.htmlEntities(senderName.substring(0, 15)) + '...';
                        }
                        var thisButtonHtml = '<div' + onclickAction + buttonId + ' style=\'left:' + thisDivLeft[thisLine]+'px; top: ' + thisDivTop+'px;' + defaultCss + ' display: table-cell; line-height: 22px;' +
                            ' background-image: ' + lzm_displayHelper.addBrowserSpecificGradient('', bgGradientColor) + '; background-position: left; background-repeat: no-repeat;' +
                            ' padding-left: 2px;\'>' +
                            '<span style=\'line-height: 22px; padding-left: 21px; padding-top: 4px; padding-bottom: 4px; ' +
                            'background-image: url("' + buttonLogo + '"); background-position: left; /*background-size: 14px;*/ background-repeat: no-repeat;\'>' + displaySenderName + '</span></div>';
                        var testLengthDiv = $('#test-length-div');
                        testLengthDiv.html(thisButtonHtml).trigger('create');
                        var thisButtonLength = testLengthDiv.children('div').width() + 13;
                        var thisLineRight = (thisLine == 0) ? 26 : 2;
                        //console.log((thisDivLeft[thisLine]) + ' - ' + thisButtonLength + ' - ' + (thisActiveChatPanelWidth - thisLineRight));
                        if ((thisDivLeft[thisLine] + thisButtonLength) >= (thisActiveChatPanelWidth - thisLineRight)) {
                            thisLine++;
                            thisDivTop = 2 + thisLine * 28;
                            thisDivLeft.push(2);
                            thisButtonHtml = '<div' + onclickAction + buttonId + ' style=\'left:' + thisDivLeft[thisLine] + 'px; top: ' + thisDivTop+'px;' + defaultCss + ' display: table-cell; line-height: 22px;' +
                                ' background-image: ' + lzm_displayHelper.addBrowserSpecificGradient('', bgGradientColor) + '; background-position: left; background-repeat: no-repeat;' +
                                ' padding-left: 2px;\'>' +
                                '<span style=\'line-height: 22px; padding-left: 21px; padding-top: 4px; padding-bottom: 4px; ' +
                                'background-image: url("' + buttonLogo + '"); background-position: left; /*background-size: 14px;*/ background-repeat: no-repeat;\'>' + displaySenderName + '</span></div>';
                        }
                        //console.log(thisButtonHtml);
                        activeCounter++;
                        thisDivLeft[thisLine] += thisButtonLength;
                        activityHtml += thisButtonHtml;
                        this.activeChatPanelHeight = 28 * (thisLine + 1);
                    }

                }
            }
        }
        //console.log(newIncomingChats);
        if (newIncomingChats.length > 0) {
            this.startRinging(newIncomingChats, external_users);
        } else {
            this.stopRinging(newIncomingChats);
        }
        thisActiveChatPanel.html(activityHtml).trigger('create');
        //  && chatObject[this.active_chat_reco].status == 'left'
        if (this.active_chat_reco != '' && /*(this.active_chat_reco.indexOf('~') == -1 || $.inArray(this.active_chat_reco, this.openChats) != -1 ||*/
            (typeof chatObject[this.active_chat_reco] != 'undefined' && chatObject[this.active_chat_reco].status != 'new'))/*)*/ {
            $('#close-active-chat').css({display: 'block'});
        }
        this.createChatWindowLayout(false);
        if (this.chatActivity && (this.settingsDialogue || this.selected_view != 'mychats')) {
            this.chatsViewMarked = true;
            this.createViewSelectPanel(this.firstVisibleView);
        } else {
            this.chatsViewMarked = false;
            this.createViewSelectPanel(this.firstVisibleView);

        }
        this.createChatWindowLayout(false);
    } else {
        var thisClass = this;
        setTimeout(function() {
            thisClass.createActiveChatPanel(external_users, internal_users, internal_departments, chatObject, updateVisitorListNow);
            //console.log('Global hash is empty, recreate active chat panel');
        }, 200);
    }
};

/**
 * Create the html code for the chat window
 */
ChatDisplayClass.prototype.createChatHtml = function (chats, chatObject, thisUser, internal_users, external_users, active_chat_reco) {
    var intUserObject = {};
    var extUserObject = {};
    for (var j=0; j<internal_users.length; j++) {
        intUserObject[internal_users[j].id] = internal_users[j];
    }
    for (var k=0; k<external_users.length; k++) {
        extUserObject[external_users[k].id] = external_users[k];
    }

    chats.sort(function(a,b) {
        if (typeof a.cmc == 'undefined') {
            a.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            //console.log(a);
        }
        if (typeof b.cmc == 'undefined') {
            a.cmc = lzm_chatServerEvaluation.chatMessageCounter;
            //console.log(b);
        }
        var rt = 0;
        if (a.cmc > b.cmc) {
            rt = 1;
        } else if (a.cmc < b.cmc) {
            rt = -1
        }/* else if (typeof a.info_header != 'undefined') {
            rt = -1;
        } else if (typeof b.info_header != 'undefined') {
            rt = 1;
        }*/
        return rt;
    });

    var tUquestion ='';
    var tUname ='';
    var tUgroup = '';
    var tUoperators = '';
    var tUemail = '';
    var tUcompany = '';
    var tUphone = '';
    if (active_chat_reco.indexOf('~') != -1 && typeof thisUser.b != 'undefined') {
        for (var i=0; i<thisUser.b.length; i++) {
            if (thisUser.b[i].id == active_chat_reco.split('~')[1]) {
                if (thisUser.id != '') {
                    if (thisUser.b[i].cname != '' && typeof thisUser.b[i].cname != 'undefined') {
                        this.active_chat_realname = thisUser.b[i].cname;
                    } else {
                        if (thisUser.name != '' && typeof thisUser.name != 'undefined') {
                            this.active_chat_realname = thisUser.name;
                        } else {
                            if (thisUser.unique_name != '' && typeof thisUser.unique_name != 'undefined') {
                                this.active_chat_realname = thisUser.unique_name;
                            } else {
                                this.active_chat_realname = thisUser.id;
                            }
                        }
                    }
                }
                if (typeof chatObject[active_chat_reco] == 'undefined' || typeof chatObject[active_chat_reco].eq == 'undefined' || chatObject[active_chat_reco].eq == '') {
                    tUquestion = (typeof thisUser.b[i].chat != 'undefined' && typeof thisUser.b[i].chat.eq != 'undefined') ? thisUser.b[i].chat.eq : '';
                } else {
                    tUquestion = chatObject[active_chat_reco].eq;
                }
                if (typeof chatObject[active_chat_reco] == 'undefined' || typeof chatObject[active_chat_reco].name == 'undefined') {
                    tUname = (typeof thisUser.b[i].cname != 'undefined' && thisUser.b[i].cname != '') ? thisUser.b[i].cname : thisUser.unique_name;
                } else {
                    tUname = (chatObject[active_chat_reco].name != '') ? chatObject[active_chat_reco].name : thisUser.unique_name;
                }
                tUemail = (typeof thisUser.b[i].cemail != 'undefined') ? thisUser.b[i].cemail : '';
                tUcompany = (typeof thisUser.b[i].ccompany != 'undefined') ? thisUser.b[i].ccompany : '';
                tUphone = (typeof thisUser.b[i].cphone != 'undefined') ? thisUser.b[i].cphone : '';
                if (typeof thisUser.id != 'undefined' && thisUser.id != '') {
                    if (typeof extUserObject[thisUser.id] != 'undefined') {
                        tUgroup = (typeof extUserObject[thisUser.id].b[i].chat != 'undefined' &&
                            typeof extUserObject[thisUser.id].b[i].chat.gr != 'undefined') ? extUserObject[thisUser.id].b[i].chat.gr : '';
                        for (var intUserIndex=0; intUserIndex<internal_users.length; intUserIndex++) {
                            if (typeof extUserObject[thisUser.id].b[i].chat != 'undefined' && typeof extUserObject[thisUser.id].b[i].chat.pn != 'undefined' &&
                                typeof extUserObject[thisUser.id].b[i].chat.pn.memberIdList != 'undefined' &&
                                $.inArray(internal_users[intUserIndex].id, extUserObject[thisUser.id].b[i].chat.pn.memberIdList) != -1) {
                                tUoperators +=  internal_users[intUserIndex].name + ', ';
                            }
                        }
                    }
                    tUoperators = tUoperators.replace(/, *$/,'');
                }
            }
        }
    }
    var chatHtmlString = '';
    var messageText = '';
    var previousMessageSender = '';
    var previousMessageRepost = 1;
    var tmpDate = lzm_chatTimeStamp.getLocalTimeObject();
    var currentDateObject = {
        day:this.lzm_commonTools.pad(tmpDate.getDate(), 2),
        month:this.lzm_commonTools.pad((tmpDate.getMonth() + 1), 2),
        year:this.lzm_commonTools.pad(tmpDate.getFullYear() ,4)
    };
    for (var chatIndex = 0; chatIndex < chats.length; chatIndex++) {
        var messageTime = chats[chatIndex].time_human;
        if (typeof chats[chatIndex].dateObject != 'undefined' &&
            (chats[chatIndex].dateObject.year != currentDateObject.year ||
            chats[chatIndex].dateObject.month != currentDateObject.month ||
            chats[chatIndex].dateObject.day != currentDateObject.day)) {
            messageTime = chats[chatIndex].date_human + '&nbsp;' + chats[chatIndex].time_human;
        }
        //console.log()
        var chatText = lzm_displayHelper.replaceSmileys(chats[chatIndex].text);
        if (chats[chatIndex].reco == this.myId && (chats[chatIndex].sen_id == this.active_chat_reco ||
            chats[chatIndex].sen_id + '~' + chats[chatIndex].sen_b_id == this.active_chat_reco)) {
            if (typeof chats[chatIndex].info_header != 'undefined') {
                var myMailAddress = (chats[chatIndex].info_header.mail != '') ?
                    this.lzm_commonTools.htmlEntities(chats[chatIndex].info_header.mail) : '&#8203;';
                messageText = this.messageTemplates['header'].replace(/<!--new_chat_request_label-->/g,t('Chat request to'));
                messageText = messageText.replace(/<!--group_name-->/g,chats[chatIndex].info_header.group);
                messageText = messageText.replace(/<!--receivers-->/g,chats[chatIndex].info_header.operators);
                messageText = messageText.replace(/<!--name_label-->/g,t('Name'));
                messageText = messageText.replace(/<!--user-->/g,this.lzm_commonTools.htmlEntities(chats[chatIndex].info_header.name));
                messageText = messageText.replace(/<!--email_label-->/g,t('Email'));
                messageText = messageText.replace(/<!--email-->/g,myMailAddress);
                messageText = messageText.replace(/<!--company_label-->/g,t('Company'));
                messageText = messageText.replace(/<!--company-->/g,this.lzm_commonTools.htmlEntities(chats[chatIndex].info_header.company));
                messageText = messageText.replace(/<!--phone_label-->/g,t('Phone'));
                messageText = messageText.replace(/<!--phone-->/g,this.lzm_commonTools.htmlEntities(chats[chatIndex].info_header.phone));
                messageText = messageText.replace(/<!--question_label-->/g,t('Question'));
                messageText = messageText.replace(/<!--question-->/g,this.lzm_commonTools.htmlEntities(chats[chatIndex].info_header.question));
                messageText = messageText.replace(/<!--chat_id_label-->/g,t('Chat ID'));
                messageText = messageText.replace(/<!--chat_id-->/g,chats[chatIndex].info_header.chat_id);
                messageText = messageText.replace(/<!--custom_fields-->/g,chats[chatIndex].info_header.cf);
                messageText = messageText.replace(/lz_chat_mail/, 'lz_chat_mail_no_icon');
                previousMessageSender = '';
                previousMessageRepost = 1;
            } else {
                var thisSenderName = '';
                if (chats[chatIndex].rec == chats[chatIndex].sen_id) {
                    if (typeof intUserObject[chats[chatIndex].sen] != 'undefined') {
                        thisSenderName = intUserObject[chats[chatIndex].sen].name.substring(0, 29);
                    } else {
                        thisSenderName = (typeof tUname == 'undefined' || tUname == '') ? this.active_chat_realname : tUname;
                    }
                } else {
                    thisSenderName = (typeof tUname == 'undefined' || tUname == '') ? this.active_chat_realname : tUname;
                }
                if (thisSenderName.length > 30) {
                    thisSenderName = thisSenderName.substring(0, 26) + '...';
                }
                thisSenderName = this.lzm_commonTools.htmlEntities(thisSenderName);
                if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                    if (chats[chatIndex].rp == 1) {
                        messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,thisSenderName);
                    } else {
                        messageText = this.messageTemplates['internal'].replace(/<!--name-->/g,thisSenderName);
                    }
                } else {
                    messageText = this.messageTemplates['add'].replace(/<!--name-->/g,thisSenderName);
                }
                messageText = messageText.replace(/<!--time-->/g, messageTime);
                /*if (chats[chatIndex].sen_id + '~' + chats[chatIndex].sen_b_id == this.active_chat_reco) {
                    messageText = messageText.replace(/<!--message-->/g, this.lzm_commonTools.htmlEntities(chatText));
                } else {*/
                    messageText = messageText.replace(/<!--message-->/g, chatText);
                /*}*/
                messageText = messageText.replace(/<!--dir-->/g, 'ltr');
                previousMessageSender = chats[chatIndex].sen;
                previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
            }
            chatHtmlString += messageText;
        } else if (chats[chatIndex].sen == this.myId && chats[chatIndex].reco == this.active_chat_reco &&
            (chats[chatIndex].rec == '' || chats[chatIndex].rec == this.active_chat_reco)) {
            if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                if (chats[chatIndex].rp == 1)
                    messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,this.myName.substring(0, 29));
                else
                    messageText = this.messageTemplates['external'].replace(/<!--name-->/g,this.myName.substring(0, 29));
            } else
                messageText = this.messageTemplates['add'].replace(/<!--name-->/g,this.myName.substring(0, 29));
            messageText = messageText.replace(/<!--time-->/g, messageTime);
            messageText = messageText.replace(/<!--message-->/g, chatText);
            messageText = messageText.replace(/<!--dir-->/g, 'ltr');
            chatHtmlString += messageText;
            previousMessageSender = chats[chatIndex].sen;
            previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
        } else if (chats[chatIndex].sen == this.myId && chats[chatIndex].rec == this.active_chat_reco && chats[chatIndex].reco != chats[chatIndex].rec) {
            if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                if (chats[chatIndex].rp == 1)
                    messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,this.myName.substring(0, 29));
                else
                    messageText = this.messageTemplates['external'].replace(/<!--name-->/g,this.myName.substring(0, 29));
            } else
                messageText = this.messageTemplates['add'].replace(/<!--name-->/g,this.myName.substring(0, 29));
            messageText = messageText.replace(/<!--time-->/g, messageTime);
            messageText = messageText.replace(/<!--message-->/g, chatText);
            messageText = messageText.replace(/<!--dir-->/g, 'ltr');
            chatHtmlString += messageText;
            previousMessageSender = chats[chatIndex].sen;
            previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
        } else if (chats[chatIndex].sen == '0000000' && chats[chatIndex].reco == this.active_chat_reco) {
            if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                if (chats[chatIndex].rp == 1)
                    messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,t('System').substring(0, 29));
                else
                    messageText = this.messageTemplates['external'].replace(/<!--name-->/g,t('System').substring(0, 29));
            } else
                messageText = this.messageTemplates['add'].replace(/<!--name-->/g,t('System').substring(0, 29));
            messageText = messageText.replace(/<!--time-->/g, messageTime);
            messageText = messageText.replace(/<!--message-->/g, chatText);
            messageText = messageText.replace(/<!--dir-->/g, 'ltr');
            chatHtmlString += messageText;
            previousMessageSender = chats[chatIndex].sen;
            previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
        } else if (chats[chatIndex].sen != this.myId && chats[chatIndex].reco == this.active_chat_reco && this.active_chat != this.active_chat_reco) {
            var forwardingOpName = '';
            if (typeof intUserObject[chats[chatIndex].sen] != 'undefined') {
                forwardingOpName = intUserObject[chats[chatIndex].sen].name;
            }
            if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                if (chats[chatIndex].rp == 1)
                    messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,forwardingOpName.substring(0, 29));
                else
                    messageText = this.messageTemplates['external'].replace(/<!--name-->/g,forwardingOpName.substring(0, 29));
            } else
                messageText = this.messageTemplates['add'].replace(/<!--name-->/g,forwardingOpName.substring(0, 29));
            messageText = messageText.replace(/<!--time-->/g, messageTime);
            messageText = messageText.replace(/<!--message-->/g, chatText);
            messageText = messageText.replace(/<!--dir-->/g, 'ltr');
            chatHtmlString += messageText;
            previousMessageSender = chats[chatIndex].sen;
            previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
        } else if (chats[chatIndex].reco != this.myId && chats[chatIndex].sen_id == this.active_chat && this.active_chat != this.active_chat_reco) {
            if (previousMessageSender != chats[chatIndex].sen || previousMessageRepost != chats[chatIndex].rp) {
                if (chats[chatIndex].rp == 1)
                    messageText = this.messageTemplates['repost'].replace(/<!--name-->/g,this.lzm_commonTools.htmlEntities(this.active_chat_realname).substring(0, 29));
                else
                    messageText = this.messageTemplates['external'].replace(/<!--name-->/g,this.lzm_commonTools.htmlEntities(this.active_chat_realname).substring(0, 29));
            } else
                messageText = this.messageTemplates['add'].replace(/<!--name-->/g,this.lzm_commonTools.htmlEntities(this.active_chat_realname).substring(0, 29));
            messageText = messageText.replace(/<!--time-->/g, messageTime);
            /*messageText = messageText.replace(/<!--message-->/g, this.lzm_commonTools.htmlEntities(chatText));*/
            messageText = messageText.replace(/<!--message-->/g, chatText);
            messageText = messageText.replace(/<!--dir-->/g, 'ltr');
            chatHtmlString += messageText;
            previousMessageSender = chats[chatIndex].sen;
            previousMessageRepost = (chats[chatIndex].rp == 1) ? 1 : 0;
        }
    }
    var thisChatProgress = $('#chat-progress');
    thisChatProgress.html(chatHtmlString);
    thisChatProgress.scrollTop(thisChatProgress[0].scrollHeight);

    //console.log(thisUser);
    $('#chat-action').css('visibility', 'visible');
    $('#chat-buttons').css('visibility', 'visible');
};

/**
 * (Re)create the complete html structure depending on the contents of the javascript variables
 */
ChatDisplayClass.prototype.createHtmlContent = function (internal_departments, internal_users, external_users, chats, chatObject, thisUser, global_errors, chosen_profile, active_chat_reco) {

    // make the user aware of new incoming messages
    this.createActiveChatPanel(external_users, internal_users, internal_departments, chatObject, false);

    // create the visitor and operator lists
    this.createOperatorList(internal_departments, internal_users, chatObject, chosen_profile);
    if (this.selected_view == 'external' && $('.dialog-window-container').length == 0) {
        this.updateVisitorList(external_users, chatObject, internal_users);
    }

    // fill the chat window with content
    this.createChatHtml(chats, chatObject, thisUser, internal_users, external_users, active_chat_reco);

    // fill the error view with content
    //this.createErrorHtml(global_errors);
};

/**
 * custom sort function for sorting the operators by their status
 * @param a
 * @param b
 * @return {Number}
 */
ChatDisplayClass.prototype.operatorSortFunction = function (a, b) {
    var returnValue;
    if (a.name > b.name) {
        returnValue = 1
    } else if (a.name == b.name) {
        returnValue = 0;
    } else {
        returnValue = -1;
    }
    return returnValue;
};

ChatDisplayClass.prototype.visitorSortFunction = function(a, b) {
    // lzm_chatServerEvaluation.external_users[0].b[0].h2[0].time
    var returnValue = 0;
    switch (this.visitorSortBy) {
        case 'name':

            break;
        case 'city':
            if (a.city > b.city) {
                returnValue = 1;
            } else if (a.city == b.city) {
                returnValue = 0;
            } else {
                returnValue = -1;
            }
            break;
        case 'country':
            if (a.ctryi2 > b.ctryi2) {
                return 1;
            } else if (a.ctryi2 == b.ctryi2) {
                return 0;
            } else {
                return -1;
            }
            break;
        default:
            var aTime = 4294967295, bTime = 4294967295, i=0;
            try {
                for (i=0; i<a.b.length; i++) {
                    try {
                        aTime = (a.b[i].h2.length > 0 && typeof a.b[i].h2[0].time != 'undefined') ? Math.min(aTime, a.b[i].h2[0].time) : aTime;
                    } catch (e) {}
                }
            } catch (e) {}
            try {
                for (i=0; i<b.b.length; i++) {
                    try {
                        bTime = (b.b[i].h2.length > 0 && typeof b.b[i].h2[0].time != 'undefined') ? Math.min(bTime, b.b[i].h2[0].time) : bTime;
                    } catch (e) {}
                }
            } catch (e) {}
            if (aTime == 4294967295) {
                returnValue = 1;
            } else if (bTime == 4294967295) {
                returnValue = -1;
            } else if (aTime < bTime) {
                returnValue = 1;
            } else if (aTime > bTime) {
                returnValue = -1;
            } else {
                returnValue = 0;
            }
            break;
    }

    return returnValue;
};

/**
 * Create the view for inviting other operators to a chat and/or transfering a chat to another operator
 * @param type
 * @param internal_departments
 * @param internal_users
 * @param thisUser
 * @param chosen_profile
 * @param id
 * @param b_id
 * @param chat_id
 */
ChatDisplayClass.prototype.createOperatorInviteHtml = function (type, internal_departments, internal_users, thisUser, chosen_profile, id, b_id, chat_id) {
    saveChatInput(lzm_chatDisplay.active_chat_reco);
    internal_users.sort(this.operatorSortFunction);
    var memberList = [];
    for (var bInd=0; bInd<thisUser.b.length; bInd++) {
        if (thisUser.b[bInd].id == b_id) {
            memberList = thisUser.b[bInd].chat.pn.memberIdList;
            break;
        }
    }

    var headerString = t('Forward chat to operator');
    if (type != 'forward') {
        headerString = t('Invite operator to chat');
    }
    var footerString = lzm_displayHelper.createButton('fwd-button', 'ui-disabled', '', t('Ok'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-operator-forward-selection', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<fieldset class="lzm-fieldset" id="fwd-container" data-role="none">' +
        '<legend>' + headerString + '</legend>' +
        '<div id="selection-div">' +
        '<select id="fwdGroupSelect" data-role="none">' +
        '<option value="">' + t('--- Choose a group ---') + '</option>';
    for (var intDepIndex = 0; intDepIndex < internal_departments.length; intDepIndex++) {
        if (typeof internal_departments[intDepIndex].id != 'undefined') {
            bodyString += '<option value="' + internal_departments[intDepIndex].id + '">' +
                internal_departments[intDepIndex].id + '</option>';
        }
    }
    bodyString += '</select><br />' +
        '<div id="fwdOperatorSelectDiv" style="display: inline;">' +
        '<select id="fwdOperatorSelect" data-role="none">' +
        '<option value="">' + t('--- No group chosen ---') + '</option></select></div></div>';
    bodyString += '<div id="operator-text-div" style="margin-top: 10px;">' +
        '<label for="forward-text" style="font-size: 12px;">' + t('Additional information for the receiver:') + '</label>' +
        '<textarea id="forward-text" placeholder="' + t('Send this text to the other operator.') + '" data-role="none"></textarea></div>';
    bodyString += '</fieldset>';

    var dialogData = {'visitor-id': id+'~'+b_id, 'chat-partner': id + '~' + b_id, 'chat-id': chat_id};
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'operator-forward-selection',
        {}, {}, {}, {}, '', dialogData, true);
    var fwdTextHeight = Math.max((this.dialogWindowHeight - 195), 100);
    var selWidth = this.dialogWindowWidth - 38;
    if (lzm_displayHelper.checkIfScrollbarVisible('operator-forward-selection')) {
        selWidth -= lzm_displayHelper.getScrollBarWidth();
    }
    $('#forward-text').css({width: selWidth + 'px', height: fwdTextHeight + 'px'});
    $('#fwd-container').css({'min-height':  ($('#operator-forward-selection-body').height() - 22) + 'px'});

    $('#cancel-operator-forward-selection').click(function() {
        lzm_displayHelper.removeDialogWindow('operator-forward-selection');
    });
    $('#fwd-button').click(function() {
        var operatorIsOnline = false;
        internal_users = lzm_chatServerEvaluation.internal_users;
        for (var j=0; j<internal_users.length; j++) {
            if (internal_users[j].id == lzm_chatUserActions.forwardData.forward_id) {
                operatorIsOnline = (internal_users[j].status < 2) ? true : false;
                break;
            }
        }
        if (operatorIsOnline) {
            lzm_chatUserActions.forwardData.forward_text = $('#forward-text').val();
            lzm_chatUserActions.forwardChat();
            $('#cancel-operator-forward-selection').click();
        } else {
            $('#fwdGroupSelect').change();
        }
    });

    $('#fwdGroupSelect').change(function() {
        var selectedGroupId = $('#fwdGroupSelect').val();
        //console.log('Group chanage - chosen group : ' + selectedGroupId);
        var opChooseHtml = '';
        var numberOfAvailableOp = 0;
        if (selectedGroupId != '') {
            opChooseHtml = '<select id="fwdOperatorSelect" data-role="none">' +
                '<option value="">' + t('--- Choose an operator ---') + '</option>';
            for (var intUserIndex = 0; intUserIndex < internal_users.length; intUserIndex++) {
                //console.log(internal_users[intUserIndex].userid + ' --- ' + chosen_profile.login_name);
                if (internal_users[intUserIndex].userid != chosen_profile.login_name &&
                    $.inArray(selectedGroupId, internal_users[intUserIndex].groups) != -1 &&
                    (typeof internal_users[intUserIndex].isbot == 'undefined' ||
                        internal_users[intUserIndex].isbot != 1) &&
                    (internal_users[intUserIndex].status != 2 && internal_users[intUserIndex].status != 3) &&
                    $.inArray(internal_users[intUserIndex].id, memberList) == -1) {
                    opChooseHtml += '<option value="' + internal_users[intUserIndex].userid + '">' +
                        internal_users[intUserIndex].name + '</option>';
                    numberOfAvailableOp++;
                }
            }
            opChooseHtml += '</select>';
            if (numberOfAvailableOp == 0) {
                opChooseHtml = '<select id="fwdOperatorSelect" data-role="none">' +
                    '<option value="">' + t('--- No operators in this group available ---') + '</option></select>';
            }
        } else {
            opChooseHtml = '<select id="fwdOperatorSelect" data-role="none">' +
                '<option value="">' + t('--- No group chosen ---') + '</option></select>';
        }
        $('#fwdOperatorSelectDiv').html(opChooseHtml).trigger('create');
        $('#fwdOperatorSelect').change(function() {
            var selectedOpUserId = $('#fwdOperatorSelect').val();
            var forward_id, forward_name, forward_group, forward_text, chat_no;
            for (var intUserIndex2=0; intUserIndex2<internal_users.length; intUserIndex2++) {
                if (internal_users[intUserIndex2].userid == selectedOpUserId) {
                    forward_id = internal_users[intUserIndex2].id;
                    forward_name = internal_users[intUserIndex2].name;
                    forward_group = selectedGroupId;
                    forward_text = $('#forward-text').val();
                    chat_no = 0;
                }
            }
            //console.log('Operator change - selected operator : ' + selectedOpUserId);
            if (selectedOpUserId != '') {
                selectOperatorForForwarding(id, b_id, chat_id, forward_id, forward_name, forward_group, forward_text, chat_no);
                $('#fwd-button').removeClass('ui-disabled');
            }
        });
    });
};

/**
 * Create the user control panel - aka the one on the top of the page.
 */
ChatDisplayClass.prototype.createUserControlPanel = function (user_status, myName, myUserId) {
    var userStatusCSS = {'background-repeat': 'no-repeat', 'background-position': 'center'};
    for (var i = 0; i < this.lzm_commonConfig.lz_user_states.length; i++) {
        if (Number(user_status) == this.lzm_commonConfig.lz_user_states[i].index) {
            userStatusCSS['background-image'] = lzm_displayHelper.addBrowserSpecificGradient('url("' + this.lzm_commonConfig.lz_user_states[i].icon + '")');
            break;
        }
    }

    var userSettingsHtml = '<span class="ui-btn-inner">' +
        '<span class="ui-icon ui-icon-arrow-d ui-icon-shadow"> </span><span class="ui-btn-text" style="margin-left: -7px;">';
    if (myName != '') {
        userSettingsHtml += myName + '&nbsp;';
    } else {
        userSettingsHtml += myUserId + '&nbsp;';
    }
    userSettingsHtml += '</span></span>';

    var mainArticleWidth = $('#content_chat').width();
    var thisUserstatusButton = $('#userstatus-button');
    var thisUsersettingsButton = $('#usersettings-button');
    var thisBlankButton = $('#blank-button');
    var thisWishlistButton = $('#wishlist-button');

    var userstatusButtonWidth = 50;
    var usersettingsButtonWidth = 150;
    if (mainArticleWidth > 350) {
        usersettingsButtonWidth = 250;
    } else if (mainArticleWidth > 325) {
        usersettingsButtonWidth = 225;
    } else if (mainArticleWidth > 300) {
        usersettingsButtonWidth = 200;
    } else if (mainArticleWidth > 275) {
        usersettingsButtonWidth = 175;
    }
    var wishlistButtonWidth = 40;
    var blankButtonWidth = mainArticleWidth - userstatusButtonWidth - usersettingsButtonWidth - wishlistButtonWidth - 5;

    thisUserstatusButton.css(userStatusCSS);
    thisUsersettingsButton.html(userSettingsHtml);

    thisUserstatusButton.width(userstatusButtonWidth);
    thisUsersettingsButton.width(usersettingsButtonWidth);
    thisWishlistButton.width(wishlistButtonWidth);
    thisBlankButton.width(blankButtonWidth);
    thisWishlistButton.children('.ui-btn-inner').css({'padding-left': '0px'});

    $('#user-control-panel').trigger('create');
};

/**
 * create and show the user settings menu, when the corresponding button is clicked
 */
ChatDisplayClass.prototype.showUsersettingsMenu = function () {
    $('#userstatus-menu').css('display', 'none');
    $('#minified-dialogs-menu').css('display', 'none');
    this.showUserstatusHtml = false;
    this.showMinifiedDialogsHtml = false;

    //calculate position
    var headerHeight = $('#header_chat').height();
    var userControlpanelHeight = $('#user-control-panel').height();
    var topOffset = headerHeight + userControlpanelHeight + 13;
    var leftOffset = 78;

    var thisUsersettingsMenu = $('#usersettings-menu');
    var usersettingsMenuHtml = '<table>';
    usersettingsMenuHtml += '<tr><td onclick="manageUsersettings(event);">' + t('Options') + '</td></tr>' +
        //'<tr><td onclick="stopPolling();">' + t('Stop polling') + '</td></tr>' +
        //'<tr><td onclick="manageTranslations();">' + t('Manage translations') + '</td></tr>' +
        '<tr><td onclick="logout(true, false, event);">' + t('Log out') + '</td></tr>';
    usersettingsMenuHtml += '</table>';
    thisUsersettingsMenu.html(usersettingsMenuHtml);
    thisUsersettingsMenu.css({display: 'block', position: 'absolute', top: topOffset + 'px', left: leftOffset + 'px',
        'z-index': '50', background: '#E6E6E6'});
};

/**
 * create and show the user status menu, when the corresponding button is clicked
 */
ChatDisplayClass.prototype.showUserstatusMenu = function (user_status, myName, myUserId) {
    $('#usersettings-menu').css('display', 'none');
    $('#minified-dialogs-menu').css('display', 'none');
    this.showUsersettingsHtml = false;
    this.showMinifiedDialogsHtml = false;

    //calculate position
    var headerHeight = $('#header_chat').height();
    var userControlpanelHeight = $('#user-control-panel').height();
    var topOffset = headerHeight + userControlpanelHeight + 13;
    var leftOffset = 30;

    var thisUserstatusMenu = $('#userstatus-menu');
    var userstatusMenuHtml = '<table>';
    for (var statusIndex = 0; statusIndex < this.lzm_commonConfig.lz_user_states.length; statusIndex++) {
        if (this.lzm_commonConfig.lz_user_states[statusIndex].index != 2) {
            userstatusMenuHtml += '<tr><td ' +
                'onclick="setUserStatus(' + this.lzm_commonConfig.lz_user_states[statusIndex].index + ', \'' + myName + '\', \'' + myUserId + '\', event)">' +
                '&nbsp;<img src="' + this.lzm_commonConfig.lz_user_states[statusIndex].icon + '" width="14px" ' +
                'height="14px">&nbsp;&nbsp;&nbsp;' + t(this.lzm_commonConfig.lz_user_states[statusIndex].text) + '</td></tr>'
        }
    }
    //userstatusMenuHtml += '<tr><td></td></tr>' +
    userstatusMenuHtml += '</table>';
    thisUserstatusMenu.html(userstatusMenuHtml);
    thisUserstatusMenu.css({display: 'block', position: 'absolute', top: topOffset + 'px', left: leftOffset + 'px',
        'z-index': '50', background: '#E6E6E6'});
};

/**
 * set the user status corresponding to the selected value
 * @param statusValue
 */
ChatDisplayClass.prototype.setUserStatus = function (statusValue, myName, myUserId) {
    $('#userstatus-menu').css('display', 'none');
    this.showUserstatusHtml = false;
    this.user_status = statusValue;
    this.createUserControlPanel(this.user_status, myName, myUserId);
};

// ****************************** Display methods called from user actions ****************************** //
/**
 * Hide the operator list for invitations and show the chat window again
 */
ChatDisplayClass.prototype.finishOperatorInvitation = function () {
    clearEditorContents();
    $('#chat').css('display', 'block');
};

/**
 * Hide the operator list and the controls for chatting and show the main chat window again
 */
ChatDisplayClass.prototype.finishChatForward = function () {
    this.showOpInviteList = false;
    clearEditorContents();
    $('#invite-operator').css('display', 'none');
    $('#forward-chat').css('display', 'none');
    $('#leave-chat').css('display', 'none');
    $('#chat-action').css('display', 'none');
    //$('#chat-title').css('display', 'none');
    $('#chat-table').css('display', 'block');
    $('#chat-buttons').css('display', 'none');
};

/**
 * Show/hide the neccessary controls when leaving a chat
 */
ChatDisplayClass.prototype.finishLeaveChat = function () {
    $('#chat-table').css('display', 'block');
    $('#chat-logo').css('display', 'none');
    $('#chat-progress').css('display', 'none');
    $('#chat-action').css('display', 'none');
    //$('#chat-title').css('display', 'none');
    $('#chat-buttons').css('display', 'none');
};

/**
 * Clear the visitor information and hide/show the neccessary parts for chatting with another operator
 */
ChatDisplayClass.prototype.showInternalChat = function (internal_departments, internal_users, external_users, chats, chatObject, thisUser, global_errors, chosen_profile, loadedValue) {
    var name = '';
    if (typeof thisUser.name != 'undefined') {
        name = thisUser.name;
    } else {
        name = thisUser.userid;
    }
    $('#visitor-info').html('<div id="visitor-info-headline"><h3>' + t('Visitor Information') + '</h3></div>' +
        '<div id="visitor-info-headline2"></div>').trigger('create');

    $('#chat').css('display', 'block');
    $('#chat-logo').css('display', 'none');
    $('#errors').css('display', 'none');
    setEditorDisplay('block');

    this.createChatHtml(chats, chatObject, thisUser, internal_users, external_users, thisUser.id);
    this.createActiveChatPanel(external_users, internal_users, internal_departments, chatObject, false);


    $('#chat-progress').css('display', 'block');
    $('#chat-action').css('display', 'block');
    //$('#chat-input-body').css('display', 'block');
    $('#active-chat-panel').css('display', 'block');

    //var thisChatTitle = $('#chat-title');
    var thisChatButtons = $('#chat-buttons');
    var chatButtonsHtml = '<div style="margin: 7px 0px;">';
    chatButtonsHtml += lzm_displayHelper.createInputControlPanel();
    chatButtonsHtml += '</div>';
    //thisChatTitle.html('').trigger('create').css('display', 'none');
    thisChatButtons.html(chatButtonsHtml).trigger('create').css('display', 'block');

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });
};

ChatDisplayClass.prototype.updateShowVisitor = function(external_users) {
    var rtValue = false;
    if (typeof this.infoUser.id != 'undefined' && this.infoUser.id != '') {
        for (var i=0; i<external_users.length; i++) {
            if (this.infoUser.id == external_users[i].id) {
                var tmpInfoUser = external_users[i];
                for (var key in this.infoUser) {
                    if (this.infoUser.hasOwnProperty(key)) {
                        if ((typeof tmpInfoUser[key] == 'boolean') || (typeof tmpInfoUser[key] == 'number') || (typeof tmpInfoUser[key] == 'string') && tmpInfoUser[key] != '') {
                            this.infoUser[key] = tmpInfoUser[key];
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

ChatDisplayClass.prototype.updateVisitorInformation = function(operators, thisUser) {
    $('#visitor-details-list').html('<legend>' + t('Details') + '</legend>' + lzm_displayHelper.createVisitorInformation(operators, thisUser)).trigger('create');
    $('#visitor-history-list').html('<legend>' + t('History') + '</legend>' + lzm_displayHelper.createBrowserHistory(thisUser)).trigger('create');
    $('#visitor-comment-list').html('<legend>' + t('Comments') + '</legend>' + lzm_displayHelper.createVisitorCommentTable(thisUser, operators)).trigger('create');
    $('#visitor-invitation-list').html('<legend>' + t('Chat Invites') + '</legend>' + lzm_displayHelper.createVisitorInvitationTable(thisUser,operators)).trigger('create');
};

/**
 * Show the information about the selected visitor
 * @param internal_users
 * @param thisUser
 */
ChatDisplayClass.prototype.showVisitorInformation = function (internal_users, thisUser, chatId, activeTab) {
    var thisClass = this;
    thisUser = (typeof this.infoUser.id != 'undefined' && this.infoUser.id != '') ? this.infoUser : thisUser;
    thisClass.ShowVisitorId = thisUser.id;

    var visitorName = (typeof thisUser.b_cname != 'undefined' && thisUser.b_cname != '') ? thisUser.b_cname : thisUser.unique_name;
    var headerString = t('Visitor (<!--visitor_name-->)',[['<!--visitor_name-->', lzm_commonTools.htmlEntities(visitorName)]]);
    var footerString = lzm_displayHelper.createButton('cancel-visitorinfo', '', '', t('Close'), '', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div style="margin-top: 5px;" id="visitor-info-placeholder"></div>';
    var userName = (typeof thisUser.b_cname != 'undefined' && thisUser.b_cname != '') ? thisUser.b_cname : thisUser.unique_name;
    var dialogData = {'visitor-id': thisUser.id, menu: t('Visitor Information: <!--name-->', [['<!--name-->', userName]]),
        'chat-type': '1', 'reload': ['chats', 'tickets']};
    var dialogid = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'visitor-information', {}, {}, {}, {}, '',
    dialogData, true, true);
    $('#visitor-information').data('dialog-id', dialogid);
    $('#visitor-information').data('visitor', thisUser);
    var detailsHtml = '<fieldset id="visitor-details-list" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Details') + '</legend>' +
        lzm_displayHelper.createVisitorInformation(internal_users, thisUser) +
        '</fieldset>';
    var historyHtml = '<fieldset id="visitor-history-list" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('History') + '</legend>' +
        lzm_displayHelper.createBrowserHistory(thisUser) +
        '</fieldset>';
    var commentText = '', commentsHtml = '';
    try {
    commentText = (thisUser.c.length > 0) ? thisUser.c[0].text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '<br />') : '';
    } catch(e) {}
    commentsHtml = '<fieldset id="visitor-comment-list" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Comments') + '</legend>' +
        lzm_displayHelper.createVisitorCommentTable(thisUser, internal_users) +
        '</fieldset>' +
        '<fieldset id="visitor-comment-text" class="lzm-fieldset" data-role="none" style="margin-top: 5px;">' +
        '<legend>' + t('Comment') + '</legend>' +
        commentText +
        '</fieldset>';
    var invitationsHtml = '<fieldset id="visitor-invitation-list" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Chat Invites') + '</legend>' +
        lzm_displayHelper.createVisitorInvitationTable(thisUser, internal_users) +
        '</fieldset>';
    var chatsHtml = '<div style="margin: 5px 0px 10px;">' + lzm_displayHelper.createButton('create-ticket-from-chat', '', '', t('Create Ticket'), 'img/023-email6.png', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) + '</div>' +
        lzm_displayHelper.createMatchingChats([], [], chatId) +
        '<fieldset class="lzm-fieldset" data-role="none" id="chat-content-inner" style="margin-top: 5px;"><legend>' + t('Text') + '</legend></fieldset>';
    var ticketsHtml = lzm_displayHelper.createMatchingTickets(internal_users) +
        '<fieldset class="lzm-fieldset" data-role="none" id="ticket-content-inner" style="margin-top: 5px;"><legend>' + t('Text') + '</legend></fieldset>';
    var tabsArray = [{name: t('Details'), content: detailsHtml},
        {name: t('History'), content: historyHtml},
        {name: t('Comments'), content: commentsHtml},
        {name: t('Chat Invites'), content: invitationsHtml},
        {name: t('Chats'), content: chatsHtml},
        {name: t('Tickets'), content: ticketsHtml}];
    lzm_displayHelper.createTabControl('visitor-info-placeholder', tabsArray, activeTab);
    lzm_displayLayout.resizeVisitorDetails();
    var selectedChatId = $('#matching-chats-table').data('selected-chat-id');
    if (typeof selectedChatId != 'undefined') {
        if (selectedChatId == '') {
            $('#create-ticket-from-chat').addClass('ui-disabled');
        }
    }
    $('.visitor-info-placeholder-tab').click(function() {
        lzm_displayLayout.resizeVisitorDetails();
    });

    $('#create-ticket-from-chat').click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'create_tickets', {})) {
            showTicketDetails('', false, '', $('#matching-chats-table').data('selected-chat-id'), dialogid);
        } else {
            showNoPermissionMessage();
        }
    });

    $('#cancel-visitorinfo').click(function() {
        lzm_chatPollServer.stopPolling();
        var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
        var ticketFetchTime = lzm_chatServerEvaluation.ticketFetchTime;
        lzm_displayHelper.removeDialogWindow('visitor-information');
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
        lzm_chatPollServer.chatArchiveFilterGroup = '';
        lzm_chatPollServer.chatArchiveFilterInternal = '';
        lzm_chatPollServer.chatArchiveFilterExternal = '';
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
        lzm_chatPollServer.chatUpdateTimestamp = 0;
        lzm_chatPollServer.ticketUpdateTimestamp = 0;
        lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
        lzm_chatPollServer.startPolling();

        switchTicketListPresentation(ticketFetchTime, 0);
        switchArchivePresentation(archiveFetchTime, 0);
        thisClass.ShowVisitorId = '';
    });
};

ChatDisplayClass.prototype.showFilterCreation = function(visitor) {
    var headerString = t('Filter');
    var bodyString = '<div style="margin-top: 5px;" id="visitor-filter-placeholder"></div>';
    var footerString = lzm_displayHelper.createButton('save-filter', '', '', t('Ok'), '', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-filter', '', '', t('Close'), '', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var dialogData = {'visitor-id': visitor.id};
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'visitor-filter', {}, {}, {}, {}, '', dialogData, true, true);
    var filterHtml = lzm_displayHelper.createVisitorFilterMainHtml(visitor);
    var reasonHtml = lzm_displayHelper.createVisitorFilterReasonHtml();
    var expirationHtml = lzm_displayHelper.createVisitorFilterExpirationHtml();
    var tabArray = [{name: headerString, content: filterHtml}, {name: t('Reason'), content: reasonHtml}, {name: t('Expiration'), content: expirationHtml}];
    lzm_displayHelper.createTabControl('visitor-filter-placeholder', tabArray);
    lzm_displayLayout.resizeFilterCreation();

    $('#cancel-filter').click(function() {
        lzm_displayHelper.removeDialogWindow('visitor-filter');
    });
    $('#save-filter').click(function() {
        saveFilter('add');
        lzm_displayHelper.removeDialogWindow('visitor-filter');
    });
};

ChatDisplayClass.prototype.addVisitorComment = function(visitorId, menuEntry) {
    var dialogId = $('#visitor-information').data('dialog-id');
    var headerString = t('Add Comment');
    var footerString = lzm_displayHelper.createButton('comment-cancel', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'float': 'right', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('comment-save', '', '', t('Ok'), '', 'lr',
            {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'float': 'right', 'cursor': 'pointer'});
    var bodyString = '<fieldset id="comment-text" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Your Comment (will be visible to other operators but not to clients/website visitors)') + '</legend>' +
        '<textarea id="comment-input" data-role="none"></textarea>' +
        '</fieldset>';

    lzm_displayHelper.minimizeDialogWindow(dialogId, 'visitor-information',
        {'visitor-id': visitorId, menu: menuEntry}, 'external', false);
    lzm_displayHelper.createDialogWindow(headerString,bodyString, footerString, 'visitor-information', {}, {}, {}, {}, '',
        {'visitor-id': visitorId, menu: menuEntry}, true, true, dialogId + '_comment');

    $('#comment-text').css({'min-height': ($('#visitor-information-body').height() - 22) + 'px'});
    var inputHeight = Math.max(140, $('#visitor-information-body').height() - 44);
    $('#comment-input').css({
        border: '1px solid #ccc',
        'border-radius': '4px',
        width: ($('#visitor-information-body').width() - 28)+'px',
        height: inputHeight + 'px'
    });

    $('#comment-cancel').click(function() {
        lzm_displayHelper.removeDialogWindow('visitor-information');
        lzm_displayHelper.maximizeDialogWindow(dialogId);
    });
    $('#comment-save').click(function() {
        var commentText = $('#comment-input').val();
        $('#comment-cancel').click();
        lzm_chatUserActions.saveVisitorComment(visitorId, commentText);
    });
};

/**
 * Show the needed controls for chatting in an already active chat
 * @param thisUser
 * @param external_forwards
 */
ChatDisplayClass.prototype.showActiveVisitorChat = function (thisUser, external_forwards, chatObject) {
    this.showOpInviteList = false;
    var thisChatAction = $('#chat-action');
    var thisChatProgress = $('#chat-progress');
    var thisChatTable = $('#chat-table');
    //var thisChatTitle = $('#chat-title');
    var thisChatButtons = $('#chat-buttons');
    var thisChatLogo = $('#chat-logo');
    //thisChatTitle.html('').trigger('create').css('display', 'none');

    thisChatTable.css('display', 'block');
    thisChatAction.css('display', 'block');
    setEditorDisplay('block');
    thisChatProgress.css('display', 'block');
    thisChatLogo.css('display', 'none');
    $('#active-chat-panel').css({display: 'block'});
    var openChatHtmlString = '';
    if (typeof chatObject[thisUser.id + '~' + thisUser.b_id] != 'undefined') {
        openChatHtmlString += '<div style="margin: 7px 0px;">';
        var disabledClass = '';
        if (chatObject[thisUser.id + '~' + thisUser.b_id].status == 'left' || chatObject[thisUser.id + '~' + thisUser.b_id].status == 'declined') {
            disabledClass = 'ui-disabled ';
        }
        openChatHtmlString += lzm_displayHelper.createInputControlPanel('', disabledClass) +
            lzm_displayHelper.createButton('show-visitor-info', '', 'showVisitorInfo(\'' + this.thisUser.id + '\');', '', 'img/215-info.png', 'lr',
                {'padding': '4px 14px 4px 14px', 'cursor': 'pointer', 'margin-left': '4px', 'margin-top': '-3px'}, t('Show information')) +
            lzm_displayHelper.createButton('forward-chat', disabledClass, '', '', 'img/291-switch_to_employees.png', 'lr',
                {'padding': '4px 14px 4px 14px', 'cursor': 'pointer', 'margin-left': '4px', 'margin-top': '-3px'}, t('Forward'));
        openChatHtmlString += '</div>';
    }
    thisChatButtons.html(openChatHtmlString).trigger("create");
    thisChatButtons.css('display', 'block');

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });
};

/**
 * Show the needed controls for an inactive chat, like accept, decline or invite
 * @param thisUser
 * @param external_forwards
 * @param internal_users
 * @param chatObject
 * @param id
 * @param b_id
 * @param chat_id
 */
ChatDisplayClass.prototype.showPassiveVisitorChat = function (thisUser, external_forwards, internal_users, chatObject,
                                                              id, b_id, chat_id, freeToChat) {
    clearEditorContents();
    this.showOpInviteList = false;
    var thisChatAction = $('#chat-action');
    var thisChatProgress = $('#chat-progress');
    //var thisChatTitle = $('#chat-title');
    var thisChatButtons = $('#chat-buttons');
    var thisChatLogo = $('#chat-logo');

    thisChatAction.css('display', 'none');
    setEditorDisplay('none');
    thisChatProgress.css('display', 'block');
    thisChatLogo.css('display', 'none');
    //thisChatTitle.css('display', 'none');
    $('#active-chat-panel').css({display: 'block'});

    // fill the external user window with content
    /*var chatForwardingHtmlString = '';
    for (var extFwdIndex = 0; extFwdIndex < external_forwards.length; extFwdIndex++) {
        if (external_forwards[extFwdIndex].u == id + '~' + b_id) {
            var fwdByName = '';
            for (var intUserIndex = 0; intUserIndex < internal_users.length; intUserIndex++) {
                if (external_forwards[extFwdIndex].s == internal_users[intUserIndex].id) {
                    fwdByName = internal_users[intUserIndex].name;
                    break;
                }
            }
            chatForwardingHtmlString += '<p>' + t('Forwarded by <!--fwd_operator-->.', [
                ['<!--fwd_operator-->', fwdByName]
            ]);
            if (external_forwards[extFwdIndex].t != '') {
                chatForwardingHtmlString += ' ' + t('with comment<br><!--fwd_comment-->', [
                    ['<!--fwd_comment-->', external_forwards[extFwdIndex].t]
                ]) + '</p>';
            }

            //thisChatTitle.html('').trigger('create');
            //thisChatTitle.css({display: 'none'});
            break;
        }
    }*/
    var noOpenChatHtmlString = '';
    //console.log(id + '~' + b_id);
    if (typeof chatObject[id + '~' + b_id] != 'undefined') {
        var disabledClass = '';
        if (chatObject[id + '~' + b_id].status == 'left' || chatObject[id + '~' + b_id].status == 'declined') {
            disabledClass = 'ui-disabled ';
        }
        noOpenChatHtmlString += '<div style="margin: 7px 0px;">';
        noOpenChatHtmlString += lzm_displayHelper.createButton('show-visitor-info', '', 'showVisitorInfo(\'' + this.thisUser.id + '\');', '', 'img/215-info.png', 'lr',
                {'padding': '4px 14px 4px 14px', 'cursor': 'pointer', 'margin-left': '4px'}, t('Show information')) +
            lzm_displayHelper.createButton('accept-chat', disabledClass, '', t('Accept'), 'img/200-ok2.png', 'lr',
                {'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer', 'margin-left': '4px'}, t('Accept')) +
            lzm_displayHelper.createButton('decline-chat', disabledClass, '', '', 'img/201-delete2.png', 'lr',
                {'padding': '4px 14px 4px 14px', 'cursor': 'pointer', 'margin-left': '4px'}, t('Decline')) +
            lzm_displayHelper.createButton('forward-chat', disabledClass, '', '', 'img/291-switch_to_employees.png', 'lr',
                {'padding': '4px 12px 4px 12px', 'cursor': 'pointer', 'margin-left': '4px'}, t('Forward'));
        noOpenChatHtmlString += '</div>';
        //console.log(noOpenChatHtmlString);
        thisChatButtons.html(noOpenChatHtmlString).trigger("create");
        thisChatAction.css('display', 'none');
        thisChatProgress.css('display', 'block');
        thisChatButtons.css('display', 'block');
    } else {
        thisChatButtons.html(noOpenChatHtmlString).trigger("create");
    }

    $('.lzm-button').mouseenter(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#f6f6f6,#e0e0e0)'));
    });
    $('.lzm-button').mouseleave(function() {
        $(this).css('background-image', $(this).css('background-image').replace(/linear-gradient\(.*\)/,'linear-gradient(#ffffff,#f1f1f1)'));
    });
};

ChatDisplayClass.prototype.showExternalChat = function () {
    var thisInviteOperator = $('#invite-operator');
    var thisForwardChat = $('#forward-chat');
    var thisLeaveChat = $('#leave-chat');
    $('#decline-chat').css('display', 'none');
    $('#accept-chat').css('display', 'none');
    thisLeaveChat.css('display', 'block');
    thisInviteOperator.css('display', 'block');
    thisForwardChat.css('display', 'block');
};

/**
 * Show/Hide the neccessary controls when refused a chat
 */
ChatDisplayClass.prototype.showRefusedChat = function (internal_departments, internal_users, external_users, chats, chatObject, thisUser, global_errors, chosen_profile) {
    this.createActiveChatPanel(external_users, internal_users, internal_departments, chatObject, false);
    this.createHtmlContent(internal_departments, internal_users, external_users, chats, chatObject, thisUser,
        global_errors, chosen_profile, thisUser.id + '~' + thisUser.b_id);
    $('#visitor-info').html('');
    $('#chat-action').css('display', 'block');
    $('#chat-progress').css('display', 'block');
};

/**
 * Show/Hide the neccessary controls when left a chat
 */
ChatDisplayClass.prototype.showLeaveChat = function (internal_departments, internal_users, external_users, chats, chatObject, thisUser, global_errors, chosen_profile) {
    this.createActiveChatPanel(external_users, internal_users, internal_departments, chatObject, false);
    this.createHtmlContent(internal_departments, internal_users, external_users, chats, chatObject, thisUser,
        global_errors, chosen_profile, thisUser.id + '~' + thisUser.b_id);
    $('#visitor-info').html('');

    $('#chat-action').css('display', 'none');
    //$('#chat-title').css('display', 'none');
};

// ****************************** More common tools ****************************** //
/**
 * Catch enter and control+enter buttons pressed in the textareas and act accordingly
 * @param e
 * @return {Boolean}
 */
ChatDisplayClass.prototype.catchEnterButtonPressed = function (e) {
    var thisChatInput = $('#chat-input');
    if (e.which == 13 || e.keyCode == 13) {
        sendChat();
        return false;
    }
    if (e.which == 10 || e.keyCode == 10) {
        var tmp = thisChatInput.val();
        thisChatInput.val(tmp + '\n');
    }
    return true;
};

/***********************************************************************************************************************************************************************/
/**
 * Create the canned resources view
 * @param resources
 * @param caller
 * @param chatPartner
 * @param external_users
 * @param internal_users
 * @param internal_departments
 */
ChatDisplayClass.prototype.createQrdTree = function(resources, caller, chatPartner, external_users, internal_users, internal_departments) {
    var thisClass = this;
    thisClass.qrdChatPartner = chatPartner;
    var i;
    var chatPartnerName = lzm_displayHelper.getChatPartner(chatPartner, external_users, internal_users, internal_departments)['name'];
    $('#qrd-tree-body').data('chat-partner', chatPartner);
    $('#qrd-tree-body').data('in-dialog', false);

    var preparedResources = lzm_displayHelper.prepareResources(resources);
    resources = preparedResources[0];
    thisClass.resources = resources;
    var allResources = preparedResources[1];
    var topLayerResource = preparedResources[2];
    var thisQrdTree = $('#qrd-tree');

    var treeString = lzm_displayHelper.createQrdTreeTopLevel(topLayerResource, chatPartner, false);
    var searchString = lzm_displayHelper.createQrdSearch(chatPartner);
    var recentlyString = lzm_displayHelper.createQrdRecently(chatPartner);

    var qrdTreeHtml = '<div id="qrd-tree-headline"><h3>' + t('Resources') + '</h3></div>' +
        '<div id="qrd-tree-headline2">' +
        //'<label for="search-qrd" data-role="none">' + t('Search:') + '</label>' +
        //'<input type="text" id="search-qrd" data-role="none" style="margin: 2px 10px; border-radius: 4px;" />' +
        '</div>' +
        '<div id="qrd-tree-body" style="text-align: left;" onclick="removeQrdContextMenu();">' +
        '<div id="qrd-tree-placeholder" style="margin-top: 5px;"></div>' +
        '</div>' +
        '<div id="qrd-tree-footline">';
    if (caller == 'view-select-panel') {
        if (typeof chatPartner != 'undefined' && chatPartner != '' && $.inArray(lzm_chatServerEvaluation.chatObject[chatPartner].status,['left', 'declined']) == -1) {
            qrdTreeHtml += lzm_displayHelper.createButton('send-qrd-preview', 'ui-disabled qrd-change-buttons', 'sendQrdPreview(\'\', \'' + chatPartner + '\');',
                t('To <!--chat-partner-->',[['<!--chat-partner-->',chatPartnerName]]), '', 'lr',
                {'margin-left': '2px', 'margin-top': '-5px', 'float': 'left', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        }
        qrdTreeHtml += lzm_displayHelper.createButton('add-qrd', 'ui-disabled qrd-change-buttons', 'addQrd();', '', 'img/059-doc_new2.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
        qrdTreeHtml += lzm_displayHelper.createButton('edit-qrd', 'ui-disabled qrd-change-buttons', 'editQrd();', '', 'img/048-doc_edit.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
        qrdTreeHtml += lzm_displayHelper.createButton('preview-qrd', 'ui-disabled qrd-change-buttons', 'previewQrd(\'' + chatPartner + '\');', '', 'img/078-preview.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
        qrdTreeHtml += lzm_displayHelper.createButton('delete-qrd', 'ui-disabled qrd-change-buttons', 'deleteQrd();', '', 'img/201-delete2.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
    } else {
        if (typeof chatPartner != 'undefined' && chatPartner != '') {
            qrdTreeHtml += lzm_displayHelper.createButton('send-qrd-preview', 'ui-disabled qrd-change-buttons', 'sendQrdPreview(\'\', \'' + chatPartner + '\');',
                t('To <!--chat-partner-->',[['<!--chat-partner-->',chatPartnerName]]), '', 'lr',
                {'margin-left': '2px', 'margin-top': '-5px', 'float': 'left', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        }
        qrdTreeHtml += lzm_displayHelper.createButton('preview-qrd', 'ui-disabled qrd-change-buttons', 'previewQrd(\'' + chatPartner + '\');', '', 'img/078-preview.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
        qrdTreeHtml += lzm_displayHelper.createButton('cancel-qrd', '', 'cancelQrd();', t('Cancel'), '', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
    }
    qrdTreeHtml += '</div>';
    thisQrdTree.html(qrdTreeHtml).trigger('create');
    lzm_displayHelper.createTabControl('qrd-tree-placeholder', [{name: t('All Resources'), content: treeString},
        {name: t('Quick Search'), content: searchString}, {name: t('Recently used'), content: recentlyString}],
        thisClass.selectedResourceTab);

    thisClass.fillQrdTree(resources, chatPartner, false);

    for (i=0; i<allResources.length; i++) {
        if ($('#folder-' + allResources[i].rid).html() == "") {
            $('#resource-' + allResources[i].rid + '-open-mark').css({background: 'none', border: 'none', width: '9px', height: '9px'})
        }
    }

    $('#qrd-tree-headline').css(thisClass.QrdTreeHeadlineCss);
    $('#qrd-tree-headline2').css(thisClass.QrdTreeHeadline2Css);
    $('#qrd-tree-body').css(thisClass.QrdTreeBodyCss);
    $('#qrd-tree-footline').css(thisClass.QrdTreeFootlineCss);
    $('.qrd-tree-placeholder-content').css({height: ($('#qrd-tree-body').height() - 40) + 'px'});
    var resultListHeight = $('#qrd-tree-body').height() - $('#search-input').height() - 89;
    $('#search-results').css({'min-height': resultListHeight + 'px'});
    $('#recently-results').css({'min-height': ($('#qrd-tree-body').height() - 62) + 'px'});
    $('#all-resources').css({'min-height': ($('#qrd-tree-body').height() - 62) + 'px'});

    for (i=0; i<thisClass.openedResourcesFolder.length; i++) {
        handleResourceClickEvents(thisClass.openedResourcesFolder[i], true);
    }

    $('.qrd-tree-placeholder-tab').click(function() {
        lzm_displayLayout.resizeResources();
    });
    $('#search-qrd').keyup(function(e) {
        thisClass.searchButtonUp('qrd', allResources, e);
    });
    $('#search-text-input').keyup(function(e) {
        thisClass.searchButtonUp('qrd-list', allResources, e);
    });
    $('.qrd-search-by').change(function() {
        thisClass.fillQrdSearchList(thisClass.qrdChatPartner);
    });
    $('#clear-resource-search').click(function() {
        $('#search-text-input').val('');
        $('#search-text-input').keyup();
    });
    $('.qrd-tree-placeholder-tab').click(function() {
        thisClass.selectedResourceTab = $(this).data('tab-no');
    });
};

ChatDisplayClass.prototype.createQrdTreeDialog = function(resources, chatPartner, external_users, internal_users, internal_departments, menuEntry) {
    var thisClass = this;
    thisClass.qrdChatPartner = chatPartner;
    var i;
    menuEntry = (typeof menuEntry != 'undefined') ? menuEntry : '';
    $('#qrd-tree-body').data('chat-partner', chatPartner);
    $('#qrd-tree-body').data('in-dialog', true);
    var closeToTicket = '';
    var storedDialogImage = '';
    if (chatPartner.indexOf('TICKET LOAD') == -1 && chatPartner.indexOf('TICKET SAVE') == -1 && chatPartner.indexOf('ATTACHMENT') == -1) {
        var thisChatPartner = lzm_displayHelper.getChatPartner(chatPartner, external_users, internal_users, internal_departments);
        var chatPartnerName = thisChatPartner['name'];
        var chatPartnerUserid = thisChatPartner['userid'];
    } else {
        closeToTicket = chatPartner.split('~')[1];
        storedDialogImage = 'img/023-email2.png';
    }

    var preparedResources = lzm_displayHelper.prepareResources(resources);
    resources = preparedResources[0];
    this.resources = resources;
    var allResources = preparedResources[1];
    var topLayerResource = preparedResources[2];

    var headerString = t('Resources');
    var footerString = '';

    if (typeof chatPartner == 'undefined' || chatPartner.indexOf('TICKET SAVE') == -1) {
        footerString +=  lzm_displayHelper.createButton('preview-qrd', 'ui-disabled qrd-change-buttons', 'previewQrd(\'' + chatPartner + '\', \'\', true, \'' + menuEntry + '\');',
            '', 'img/078-preview.png', 'lr',
            {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
    }
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        if (chatPartner.indexOf('TICKET LOAD') == -1 && chatPartner.indexOf('TICKET SAVE') == -1 && chatPartner.indexOf('ATTACHMENT') == -1) {
            footerString += lzm_displayHelper.createButton('send-qrd-preview', 'ui-disabled qrd-change-buttons', 'sendQrdPreview(\'\', \'' + chatPartner + '\');',
                t('To <!--chat-partner-->',[['<!--chat-partner-->',chatPartnerName]]), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        } else if (chatPartner.indexOf('TICKET SAVE') == -1 && chatPartner.indexOf('ATTACHMENT') == -1) {
            footerString +=  lzm_displayHelper.createButton('insert-qrd-preview', 'ui-disabled qrd-change-buttons', 'insertQrdIntoTicket(\'' + closeToTicket + '\');',
                t('Insert Resource'), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        } else if (chatPartner.indexOf('ATTACHMENT') == -1) {
            footerString +=  lzm_displayHelper.createButton('add-or-edit-qrd', 'ui-disabled qrd-change-buttons', 'addOrEditResourceFromTicket(\'' + closeToTicket + '\');',
                t('Save Resource'), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        } else {
            footerString +=  lzm_displayHelper.createButton('add-qrd-attachment', 'ui-disabled qrd-change-buttons', 'addQrdAttachment(\'' + closeToTicket + '\');',
                t('Attach Resource'), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        }
    }
    footerString +=  lzm_displayHelper.createButton('cancel-qrd', '', 'cancelQrd(\'' + closeToTicket + '\');',
        t('Cancel'), '', 'lr',
        {'margin-left': '5px', 'padding-left': '15px', 'padding-right': '15px', 'cursor': 'pointer'});
    var bodyString = '<div id="qrd-tree-placeholder" style="margin-top: 5px;"></div>';

    var treeString = lzm_displayHelper.createQrdTreeTopLevel(topLayerResource, chatPartner, true);
    var searchString = lzm_displayHelper.createQrdSearch(chatPartner);
    var recentlyString = lzm_displayHelper.createQrdRecently(chatPartner);

    var dialogData = {'exceptional-img': storedDialogImage};
    if (chatPartner.indexOf('TICKET LOAD') == -1 && chatPartner.indexOf('TICKET SAVE') == -1 && chatPartner.indexOf('ATTACHMENT') == -1) {
        dialogData = {'chat-partner': chatPartner, 'chat-partner-name': chatPartnerName, 'chat-partner-userid': chatPartnerUserid};
    }

    if (chatPartner.indexOf('ATTACHMENT') != -1 || chatPartner.indexOf('TICKET LOAD') != -1 ||
        chatPartner.indexOf('TICKET SAVE') != -1) {
        dialogData.menu = menuEntry
    }

    var dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-tree-dialog', {}, {}, {}, {}, '', dialogData, true, true);
    lzm_displayHelper.createTabControl('qrd-tree-placeholder', [{name: t('All Resources'), content: treeString},
        {name: t('Quick Search'), content: searchString}, {name: t('Recently used'), content: recentlyString}],
        thisClass.selectedResourceTab);

    $('.qrd-tree-placeholder-content').css({height: ($('#qrd-tree-dialog-body').height() - 40) + 'px'});
    var resultListHeight = $('#qrd-tree-dialog-body').height() - $('#search-input').height() - 89;
    $('#search-results').css({'min-height': resultListHeight + 'px'});
    $('#recently-results').css({'min-height': ($('#qrd-tree-dialog-body').height() - 62) + 'px'});
    $('#all-resources').css({'min-height': ($('#qrd-tree-dialog-body').height() - 62) + 'px'});

    this.fillQrdTree(resources, chatPartner, true);

    for (i=0; i<allResources.length; i++) {
        if ($('#folder-' + allResources[i].rid).html() == "") {
            $('#resource-' + allResources[i].rid + '-open-mark').css({background: 'none', border: 'none', width: '9px', height: '9px'})
        }
    }

    for (i=0; i<this.openedResourcesFolder.length; i++) {
        handleResourceClickEvents(this.openedResourcesFolder[i], true);
    }

    $('.qrd-tree-placeholder-tab').click(function() {
        lzm_displayLayout.resizeResources();
    });
    $('#search-text-input').keyup(function(e) {
        thisClass.searchButtonUp('qrd-list', allResources, e);
    });
    $('.qrd-search-by').change(function() {
        thisClass.fillQrdSearchList(thisClass.qrdChatPartner);
    });
    $('#clear-resource-search').click(function() {
        $('#search-text-input').val('');
        $('#search-text-input').keyup();
    });
    $('.qrd-tree-placeholder-tab').click(function() {
        thisClass.selectedResourceTab = $(this).data('tab-no');
    });

    return dialogId;
};

ChatDisplayClass.prototype.fillQrdTree = function(resources, chatPartner, inDialog) {
    var tmpResources, alreadyUsedIds, counter = 0, rank = 1, i;
    while (resources.length > 0 && counter < 1000) {
        tmpResources = [];
        alreadyUsedIds = [];
        for (i=0; i<resources.length; i++) {
            if (rank == resources[i].ra) {
                var resourceHtml = lzm_displayHelper.createResource(resources[i], chatPartner, inDialog);
                $('#folder-' + resources[i].pid).append(resourceHtml);
                alreadyUsedIds.push(resources[i].rid);
            }
        }
        for (i=0; i<resources.length; i++) {
            if ($.inArray(resources[i].rid, alreadyUsedIds) == -1) {
                tmpResources.push(resources[i]);
            }
        }
        rank++;
        if (resources.length == tmpResources.length) {
            counter = 1000;
        }
        resources = tmpResources;
        //console.log(resources);
        counter++;
    }
};

ChatDisplayClass.prototype.fillQrdSearchList = function(chatPartner) {
    var searchCategories =  ['ti', 't', 'text'];
    this.qrdSearchCategories = [];

    for (var i=0; i<searchCategories.length; i++) {
        if ($('#search-by-' + searchCategories[i]).attr('checked') == 'checked') {
            this.qrdSearchCategories.push(searchCategories[i]);
        }
    }
    var searchString = $('#search-text-input').val().replace(/^ */, '').replace(/ *$/, '');
    $('#search-result-table').children('tbody').html(lzm_displayHelper.createQrdSearchResults(searchString, chatPartner));
};

ChatDisplayClass.prototype.searchButtonUp = function(type, myObjects, e) {
    e.stopPropagation();
    var thisClass = this;
    var searchString = '';
    //searchString = $('#search-ticket').val().replace(/^ +/, '').replace(/ +$/, '').toLowerCase();
    if (e.which == 13 || e.keycode == 13 || e.charCode == 13) {
        thisClass.searchButtonUpSet[type] = 0;
        switch (type) {
            case 'qrd':
                thisClass.highlightSearchResults(myObjects,true);
                break;
            case 'ticket':
                searchString = $('#search-ticket').val();
                if (searchString != '') {
                    $('#clear-ticket-search').css({display: 'inline'});
                    thisClass.styleTicketClearBtn();
                } else {
                    $('#clear-ticket-search').css({display: 'none'});
                }
                searchTickets(searchString);
                break;
            case 'archive':
                searchString = $('#search-archive').val();
                if (searchString != '') {
                    $('#clear-archive-search').css({display: 'inline'});
                    thisClass.styleArchiveClearBtn();
                } else {
                    $('#clear-archive-search').css({display: 'none'});
                }
                searchArchive(searchString);
                break;
            case 'qrd-list':
                searchString = $('#search-text-input').val();
                if (searchString != '') {
                    $('#clear-resource-search').css({display: 'inline'});
                    thisClass.styleResourceClearBtn();
                } else {
                    $('#clear-resource-search').css({display: 'none'});
                }
                thisClass.fillQrdSearchList(thisClass.qrdChatPartner);
                break;
        }
    } else {
        thisClass.searchButtonUpSet[type] = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        setTimeout(function() {
            if (thisClass.searchButtonUpSet[type] != 0 && lzm_chatTimeStamp.getServerTimeString(null, false, 1) - thisClass.searchButtonUpSet[type] >= 990) {
                switch (type) {
                    case 'qrd':
                        thisClass.highlightSearchResults(myObjects,true);
                        break;
                    case 'ticket':
                        searchString = $('#search-ticket').val();
                        if (searchString != '') {
                            $('#clear-ticket-search').css({display: 'inline'});
                            thisClass.styleTicketClearBtn();
                        } else {
                            $('#clear-ticket-search').css({display: 'none'});
                        }
                        searchTickets(searchString);
                        break;
                    case 'archive':
                        searchString = $('#search-archive').val();
                        if (searchString != '') {
                            $('#clear-archive-search').css({display: 'inline'});
                            thisClass.styleArchiveClearBtn();
                        } else {
                            $('#clear-archive-search').css({display: 'none'});
                        }
                        searchArchive(searchString);
                        break;
                    case 'qrd-list':
                        searchString = $('#search-text-input').val();
                        if (searchString != '') {
                            $('#clear-resource-search').css({display: 'inline'});
                            thisClass.styleResourceClearBtn();
                        } else {
                            $('#clear-resource-search').css({display: 'none'});
                        }
                        thisClass.fillQrdSearchList(thisClass.qrdChatPartner);
                        break;
                }
            }
        }, 1000);
    }

};

ChatDisplayClass.prototype.showContextMenu = function(place, myObject, mouseX, mouseY, button) {
    button = (typeof button != 'undefined') ? button : '';
    var thisClass = this;
    var myHeight = 200, contextX = mouseX + 'px', contextY = mouseY + 'px', contextMenuName = place;
    var filterList, i;
    $('#' + place + '-context').remove();

    var contextMenuHtml = '<div class="lzm-unselectable" id="' + contextMenuName + '-context" style="position: absolute; background-color: #f1f1f1;' +
        ' padding: 5px; border: 1px solid #ccc; border-radius: 4px;"' +
        ' onclick="handleContextMenuClick(event);">';
    var disabledClass = '';
    switch(place) {
        case 'qrd-tree':
            disabledClass = (myObject.ty == 0) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="add-qrd" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/078-preview.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="previewQrd(\'\',\'' + myObject.chatPartner + '\');">' +
                t('Preview') + '</span></div><hr />';
            disabledClass = (myObject.ty != 0/* || (myObject.rid != 1 && myObject.oid != this.myId)*/) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 8px 0px; text-align: left;"><span id="add-qrd" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/059-doc_new2.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="addQrd();">' +
                t('Add') + '</span></div>';
            disabledClass = /*(myObject.oid != this.myId) ? ' class="ui-disabled"' :*/ (myObject.rid == 1) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 8px 0px; text-align: left;"><span id="edit-qrd" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/048-doc_edit.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="editQrd();">' +
                t('Edit') + '</span></div>';
            disabledClass = (myObject.rid == 1/* || myObject.oid != this.myId*/) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 8px 0px 0px 0px; text-align: left;"><span id="delete-qrd" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/201-delete2.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="deleteQrd();">' +
                t('Delete') + '</span></div>';
            break;
        case 'ticket-list':
        case 'visitor-information':
            var inDialog = (place == 'ticket-list') ? false : true;
            var dialogId = (place == 'ticket-list') ? '' : $('#visitor-information').data('dialog-id');
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="show-ticket-details" class="cm-line cm-click"' +
                ' onclick="showTicketDetails(\'' + myObject.id + '\', true, \'\', \'\', \'' + dialogId + '\');">' +
                t('Open Ticket') + '</span></div><hr />';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span class="cm-line" style="padding-left: 0px;">' + t('Status:') + '</span>';
            contextMenuHtml += '<div style="margin: 4px 0px 8px 0px; text-align: left;">' +
                '<span id="set-ticket-open" class="cm-line cm-click"' +
                ' style=\'background-image: url("img/215-info.png");\' onclick="changeTicketStatus(0, false, ' + inDialog + ')">' +
                t('Open (O)') + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="set-ticket-progress" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/128-status.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="changeTicketStatus(1, false, ' + inDialog + ')">' +
                t('In Progress (P)') + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="set-ticket-closed" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/200-ok2.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="changeTicketStatus(2, false, ' + inDialog + ')">' +
                t('Closed (C)') + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 0px 0px; text-align: left;">' +
                '<span id="set-ticket-deleted" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/205-close16c.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="changeTicketStatus(3, false, ' + inDialog + ')">' +
                t('Deleted (D)') + '</span></div>';
            contextMenuHtml += '</div><hr />';
            disabledClass = ((myObject.u <= thisClass.ticketGlobalValues.mr &&
                thisClass.lzm_commonTools.checkTicketReadStatus(myObject.id, thisClass.ticketUnreadArray) == -1) ||
                (myObject.u > thisClass.ticketGlobalValues.mr &&
                    lzm_commonTools.checkTicketReadStatus(myObject.id, thisClass.ticketReadArray, thisClass.ticketListTickets) != -1)) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div ' + disabledClass + 'style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="set-ticket-read" class="cm-line cm-click" onclick="changeTicketReadStatus(\'' + myObject.id + '\', \'read\');">' +
                t('Mark as read') + '</span></div>';
            if (place == 'ticket-list') {
                contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                    '<span id="set-all-tickets-read" class="cm-line cm-click" onclick="setAllTicketsRead();">' +
                    t('Mark all as read') + '</span></div>';
            }
            break;
        case 'ticket-filter':
            filterList = myObject.filter.split('');
            for (i=0; i<4; i++) {
                if ($.inArray(i.toString(), filterList) != -1) {
                    thisClass.ticketFilterChecked[i] = 'visible';
                } else {
                    thisClass.ticketFilterChecked[i] = 'hidden';
                }
            }
            thisClass.ticketFilterPersonal = (myObject.filter_personal) ? 'visible' : 'hidden';
            thisClass.ticketFilterGroup = (myObject.filter_group) ? 'visible' : 'hidden';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-open" class="cm-line cm-click" onclick="toggleTicketFilter(0, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Open', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterChecked[0] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-progress" class="cm-line cm-click" onclick="toggleTicketFilter(1, event)" style="padding-left: 0px;">' +
                t('<!--checked--> In Progress', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterChecked[1] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-closed" class="cm-line cm-click" onclick="toggleTicketFilter(2, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Closed', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterChecked[2] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-deleted" class="cm-line cm-click" onclick="toggleTicketFilter(3, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Deleted', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterChecked[3] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<hr />';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-personal" class="cm-line cm-click" onclick="toggleTicketFilterPersonal(0, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Only my tickets', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterPersonal + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-filter-group" class="cm-line cm-click" onclick="toggleTicketFilterPersonal(1, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Only my group\'s tickets', [['<!--checked-->', '<span style="visibility: ' + thisClass.ticketFilterGroup + ';">&#10003;</span>']]) + '</span></div>';
            place = 'body';
            break;
        case 'ticket-details':
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="reply-this-message" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/060-reply.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="removeTicketMessageContextMenu(); $(\'#reply-ticket-details\').click();">' +
                t('Reply') + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="forward-this-message" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/061-forward.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="showMessageForward(\'' + myObject.ti.id + '\', \'' + myObject.msg + '\');">' +
                t('Forward') + '</span></div>';
            disabledClass = (myObject.ti.messages[myObject.msg].t != 1) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="resend-this-message" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/023-email5.png");' +
                ' background-position: left center; background-repeat: no-repeat;\'' +
                ' onclick="sendForwardedMessage({id : \'\'}, \'\', \'\', \'\', \'' + myObject.ti.id + '\', \'\', \'' + myObject.msg + '\')">' +
                t('Resend message') + '</span></div><hr />';
            disabledClass = (myObject.msg == 0) ? ' class="ui-disabled"' : '';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="copy-msg-to-new" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer;\'' +
                ' onclick="moveMessageToNewTicket(\'' + myObject.ti.id + '\', \'' + myObject.msg + '\')">' +
                t('Copy message into new Ticket') + '</span></div>';
            break;
        case 'archive-filter':
            filterList = myObject.filter.split('');
            for (i=0; i<4; i++) {
                if ($.inArray(i.toString(), filterList) != -1) {
                    thisClass.archiveFilterChecked[i] = 'visible';
                } else {
                    thisClass.archiveFilterChecked[i] = 'hidden';
                }
            }
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-archive-open" class="cm-line cm-click" onclick="toggleArchiveFilter(0, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Operators', [['<!--checked-->', '<span style="visibility: ' + thisClass.archiveFilterChecked[0] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-archive-progress" class="cm-line cm-click" onclick="toggleArchiveFilter(1, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Visitors', [['<!--checked-->', '<span style="visibility: ' + thisClass.archiveFilterChecked[1] + ';">&#10003;</span>']]) + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="toggle-archive-closed" class="cm-line cm-click" onclick="toggleArchiveFilter(2, event)" style="padding-left: 0px;">' +
                t('<!--checked--> Groups', [['<!--checked-->', '<span style="visibility: ' + thisClass.archiveFilterChecked[2] + ';">&#10003;</span>']]) + '</span></div>';
            place = 'body';
            break;
        case 'visitor-list-table-div':
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="show-this-visitor-details" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/215-info.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="showVisitorInfo(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();">' +
                t('Details') + '</span></div>';
            disabledClass = (myObject.chatting == 'true' && myObject.declined == 'false') ? ' class="ui-disabled"' : '';
            var invText = (myObject.status != 'requested') ? t('Chat Invitation') : t('Cancel invitation(s)');
            var invLogo = (myObject.status != 'requested') ? 'img/632-skills.png' : 'img/632-skills_not.png';
            var onclickAction = (myObject.status != 'requested') ? 'showVisitorInvitation(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();' :
                'cancelInvitation(\'' + myObject.visitor.id + '\');removeVisitorListContextMenu();';
            contextMenuHtml += '<div' + disabledClass + ' style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="invite-this-visitor" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("' + invLogo + '");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="' + onclickAction + '">' +
                invText + '</span></div>';
            contextMenuHtml += '<div style="margin: 0px 0px 8px 0px; text-align: left;">' +
                '<span id="ban-this-visitor" class="cm-line cm-click" style=\'margin-left: 5px;' +
                ' padding: 1px 15px 1px 20px; cursor:pointer; background-image: url("img/284-user_delete.png");' +
                ' background-position: left center; background-repeat: no-repeat;\' onclick="showFilterCreation(\'' + myObject.visitor.id + '\'); removeVisitorListContextMenu();">' +
                t('Ban (add filter)') + '</span></div>';
            break;
    }
    contextMenuHtml += '</div>';

    var myParent = 'body';
    if (place != 'body' && place != 'ticket-details' && place != 'visitor-list-table-div') {
        myParent = '#' + place + '-body';
    } else if (place != 'body') {
        myParent = '#' + place;
    }
    var checkSizeDivHtml = '<div id="context-menu-check-size-div" style="position:absolute; left: -1000px; top: -1000px;' +
        ' width: 800px; height: 800px;"></div>';
    $('body').append(checkSizeDivHtml);
    $('#context-menu-check-size-div').html(contextMenuHtml);
    var contextWidth = $('#' + contextMenuName + '-context').width();
    var contextHeight = $('#' + contextMenuName + '-context').height();
    var parentWidth = $(myParent).width();
    var parentHeight = $(myParent).height();

    if (parentHeight != null && parentWidth != null) {
        var remainingHeight = parentHeight - mouseY;
        var remainigWidth = parentWidth - mouseX;
        var widthDiff = remainigWidth - contextWidth - 12;
        var heightDiff = remainingHeight - contextHeight - 12;
        if (widthDiff < 0) {
            contextX = Math.max((mouseX - contextWidth - 12), 5) + 'px';
        }
        if (heightDiff < 0) {
            contextY = Math.max((mouseY - contextHeight - 12), 5) + 'px';
        }
    }

    $('#context-menu-check-size-div').remove();
    $(myParent).append(contextMenuHtml);
    var myStyleObject = {left: contextX, width: contextWidth+'px', height: contextHeight+'px'}
    if (button == 'ticket-message-actions') {
        myStyleObject.bottom = '30px';
    } else {
        myStyleObject.top = contextY;
    }
    $('#' + contextMenuName + '-context').css(myStyleObject);
};

ChatDisplayClass.prototype.highlightSearchResults = function(resources, isNewSearch) {
    if (isNewSearch) {
        var searchString = $('#search-qrd').val().replace(/^ */, '').replace(/ *$/, '').toLowerCase();
        if (searchString != '') {
            var i, j;
            this.qrdSearchResults = [];
            for (i=0; i<resources.length; i++) {
                if (resources[i].text.toLowerCase().indexOf(searchString) != -1 ||
                    resources[i].ti.toLowerCase().indexOf(searchString) != -1) {
                    this.qrdSearchResults.push(resources[i]);
                }
            }
        } else {
            this.qrdSearchResults = [];
        }
    }
    //console.log(this.qrdSearchResults);

    if (isNewSearch) {
        var openedResourceFolders = this.openedResourcesFolder;
        $('.resource-div').css({'background-color': '#FFFFFF', color: '#000000'});
        for (i=0; i<openedResourceFolders.length; i++) {
            openOrCloseFolder(openedResourceFolders[i], false);
        }
    }
    for (i=0; i<this.qrdSearchResults.length; i++) {
        $('#resource-' + this.qrdSearchResults[i].rid).css({'background-color': '#FFFFC6', color: '#000000', 'border-radius': '4px'});
        var parentId = this.qrdSearchResults[i].pid, counter = 0;
        if (isNewSearch) {
            while (parentId != 0 && counter < 1000) {
                for (j=0; j<resources.length; j++) {
                    if(resources[j].ty == 0 && resources[j].rid == parentId) {
                        openOrCloseFolder(resources[j].rid, true);
                        parentId = resources[j].pid;
                    }
                }
                counter++;
            }
        }
    }
};

ChatDisplayClass.prototype.previewQrd = function(resource, chatPartner, chatPartnerName, chatPartnerUserid, inDialog, menuEntry) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    menuEntry = (typeof menuEntry != 'undefined' && menuEntry != '') ? menuEntry :
        t('Preview Resource <!--resource_title-->',[['<!--resource_title-->', resource.ti]]);
    //console.log(chatPartner);
    var thisClass = this;
    var resourceTitle, resourceText;
    switch(Number(resource.ty)) {
        case 1:
            resourceTitle = t('Text: <!--resource_title-->',[['<!--resource_title-->',resource.ti]]);
            resourceText = resource.text;
            break;
        case 2:
            resourceTitle = t('Url: <!--resource_title-->',[['<!--resource_title-->',resource.ti]]);
            var resourceLink = '<a href="#" class="lz_chat_link" onclick="openLink(\'' + resource.text + '\')" ' +
                'style="line-height: 16px;" data-role="none">' + resource.text + '</a>';
            resourceText = '<p>' + t('Title: <!--resource_title-->',[['<!--resource_title-->',resource.ti]]) + '</p>' +
                '<p>' + t('Url: <!--resource_text-->',[['<!--resource_text-->',resourceLink]]) + '</p>';
            break;
        default:
            var fileSize, downloadUrl;
            if (resource.si <= 1024) {
                fileSize = resource.si + ' B';
            } else if (resource.si >= 1024 && resource.si < 1048576) {
                fileSize = (Math.round((resource.si / 1024) * 100) / 100) + ' kB';
            } else {
                fileSize = (Math.round((resource.si / 1048576) * 100) / 100) + ' kB';
            }
            downloadUrl = getQrdDownloadUrl(resource);
            resourceTitle = t('File: <!--resource_title-->',[['<!--resource_title-->',resource.ti]]);
            resourceText = '<p>' + t('File name: <!--resource_title-->',
                [['<!--resource_title-->', '<a style="line-height: 16px;" class="lz_chat_file" href="#" onclick="downloadFile(\'' + downloadUrl + '\');">' + resource.ti + '</a>']]) + '</p>' +
                '<p>' + t('File size: <!--resource_size-->',[['<!--resource_size-->',fileSize]]) + '</p>';
            break;
    }

    var headerString = t('Preview Resource');
    var footerString = '';
    if (typeof chatPartner != 'undefined' && chatPartner != '') {
        if (chatPartner.indexOf('TICKET LOAD') == -1 && chatPartner.indexOf('TICKET SAVE') == -1) {
            footerString += lzm_displayHelper.createButton('send-preview-qrd', '', 'sendQrdPreview(\'' + resource.rid + '\', \'' + chatPartner + '\');',
                t('To <!--chat-partner-->',[['<!--chat-partner-->',chatPartnerName]]), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'float': 'left', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        } else if (chatPartner.indexOf('TICKET SAVE') == -1) {
            footerString += lzm_displayHelper.createButton('insert-qrd-preview', '', 'insertQrdIntoTicket(' + chatPartner.split('~')[1] + ');', t('Insert Resource'), '', 'lr',
                {'margin-left': '8px', 'margin-top': '-5px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
        }
    }
    footerString += lzm_displayHelper.createButton('cancel-preview-qrd', '', '', t('Close'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div id="preview-resource-placeholder" style="margin-top: 5px;"></div>';
    var qrdPreviewContentString = '<fieldset id="preview-resource" class="lzm-fieldset" data-role="none">' +
        '<legend>' + resourceTitle + '</legend><div id="preview-resource-inner">' +
        resourceText +
        '</div></fieldset>';

    var dialogData = {'resource-id': resource.rid, 'chat-partner': chatPartner, 'chat-partner-name': chatPartnerName, 'chat-partner-userid': chatPartnerUserid,
        menu: menuEntry};
    if (chatPartner.indexOf('TICKET LOAD') != -1 || chatPartner.indexOf('TICKET SAVE') != -1) {
        dialogData['exceptional-img'] = 'img/023-email2.png';
    }
    if (inDialog) {
        this.qrdTreeDialog[chatPartner] = $('#qrd-tree-dialog-container').detach();
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-tree-dialog', {}, {}, {}, {}, '', dialogData, true, true);

        $('#cancel-preview-qrd').click(function() {
            lzm_displayHelper.removeDialogWindow('qrd-tree-dialog');
            var dialogContainerHtml = '<div id="qrd-tree-dialog-container" class="dialog-window-container"></div>';
            $('#chat_page').append(dialogContainerHtml).trigger('create');
            $('#qrd-tree-dialog-container').css(thisClass.dialogWindowContainerCss);
            $('#qrd-tree-dialog-container').replaceWith(thisClass.qrdTreeDialog[chatPartner]);
            $('#preview-qrd').removeClass('ui-disabled');
            delete thisClass.qrdTreeDialog[chatPartner];
        });
    } else {
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-preview', {}, {}, {}, {}, '', dialogData, false, /*false*/true);

        $('#cancel-preview-qrd').click(function() {
            $('#preview-qrd').removeClass('ui-disabled');
            lzm_displayHelper.removeDialogWindow('qrd-preview');
        });
    }
    lzm_displayHelper.createTabControl('preview-resource-placeholder', [{name: t('Preview Resource'), content: qrdPreviewContentString}]);
    var myHeight = Math.max($('#qrd-preview-body').height(), $('#qrd-tree-dialog-body').height(), $('#ticket-details-body').height());
    var textWidth = this.FullscreenDialogWindowWidth - 32;
    if (lzm_displayHelper.checkIfScrollbarVisible('qrd-preview-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('qrd-tree-dialog-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('ticket-details-body')) {
        textWidth -= lzm_displayHelper.getScrollBarWidth();
    }
    $('#preview-resource').css({'min-height': (myHeight - 61) + 'px'});
    //$('#preview-resource-inner').css({width: textWidth + 'px'});
};

ChatDisplayClass.prototype.editQrd = function(resource, ticketId, inDialog) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    ticketId = (typeof ticketId != 'undefined') ? ticketId : '';
    var headerString = t('Edit Resource');
    var footerString = lzm_displayHelper.createButton('save-edited-qrd', '', '', t('Ok'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-edited-qrd', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div id="edit-resource-placeholder" style="margin-top: 5px;"></div>';
    var qrdEditFormString = '<fieldset id="edit-resource" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Edit Resource') + '</legend><div id="edit-resource-inner">' +
        '<div id="qrd-edit-title-div" class="qrd-edit-resource qrd-edit-html-resource qrd-edit-folder-resource qrd-edit-link-resource"' +
        ' style="margin-top: 0px;">' +
        '<label for="qrd-edit-title" style="font-size: 12px;">' + t('Title') + '</label><br />' +
        '<input type="text" id="qrd-edit-title" class="lzm-text-input resource-ui-control long-ui" data-role="none" value="' + resource.ti + '" />' +
        '</div>' +
        // Tags input
        '<div class="qrd-edit-resource qrd-edit-html-resource qrd-edit-link-resource" id="qrd-edit-tags-div">' +
        '<label for="qrd-edit-tags" style="font-size: 12px;">' + t('Tags') + '</label><br />' +
        '<input type="text" id="qrd-edit-tags" class="lzm-text-input resource-ui-control long-ui" data-role="none" value="' + resource.t + '" />' +
        '</div>' +
        // HTML Resource textarea
        '<div class="qrd-edit-resource qrd-edit-html-resource" id="qrd-edit-text-div">' +
        '<label for="qrd-edit-text" style="font-size: 12px;">' + t('Text') + '</label><br />' +
        '<div id="qrd-edit-text-inner">';
    qrdEditFormString += '<div id="qrd-edit-text-controls">' +
        lzm_displayHelper.createInputControlPanel('basic').replace(/lzm_chatInputEditor/g,'qrdTextEditor') +
        '</div>';
    qrdEditFormString += '<div id="qrd-edit-text-body">' +
        '<textarea id="qrd-edit-text" data-role="none"></textarea>' +
        '</div></div></div>' +
        // URL input
        '<div class="qrd-edit-resource qrd-edit-link-resource" id="qrd-edit-url-div">' +
        '<label for="qrd-edit-url" style="font-size: 12px;">' + t('Url') + '</label><br />' +
        '<input type="text" id="qrd-edit-url" class="lzm-text-input resource-ui-control long-ui" data-role="none" value="' + resource.text + '" />' +
        '</div>' +
        '</div></fieldset>';
    var defaultCss = {};

    var dialogData = {editors: [{id: 'qrd-edit-text', instanceName: 'qrdTextEditor'}], 'resource-id': resource.rid,
        menu: t('Edit Resource <!--resource_title-->',[['<!--resource_title-->', resource.ti]])};
    if (ticketId != '') {
        dialogData['exceptional-img'] = 'img/023-email2.png';
    }

    if (inDialog) {
        this.qrdTreeDialog[ticketId] = $('#qrd-tree-dialog-container').detach();
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-tree-dialog', defaultCss, {}, {}, {}, '', dialogData, true, true);
    } else {
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-edit', defaultCss, {}, {}, {}, '', dialogData, true, /*false*/true);
    }
    lzm_displayHelper.createTabControl('edit-resource-placeholder', [{name: t('Edit Resource'), content: qrdEditFormString}]);
    var qrdTextHeight = Math.max((this.FullscreenDialogWindowHeight - 251), 100);
    var textWidth = this.FullscreenDialogWindowWidth - 50;
    if (lzm_displayHelper.checkIfScrollbarVisible('qrd-edit-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('qrd-tree-dialog-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('ticket-details-body')) {
        textWidth -= lzm_displayHelper.getScrollBarWidth();
    }
    var thisQrdTextInnerCss = {
        width: (textWidth - 2)+'px', height:  (qrdTextHeight - 20)+'px', border: '1px solid #ccc',
        'background-color': '#f5f5f5', 'border-radius': '4px'
    };
    var thisQrdTextInputCss = {
        width: (textWidth - 2)+'px', height: (qrdTextHeight - 20)+'px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px', border: '1px solid #ccc'
    };
    var thisQrdTextInputControlsCss;
    thisQrdTextInputControlsCss = {
        width: (textWidth - 2)+'px', height: '15px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '7px 0px', 'text-align': 'left'
    };
    var thisTextInputBodyCss = {
        width: (textWidth - 2)+'px', height: (qrdTextHeight - 51)+'px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px',
        'background-color': '#ffffff', 'overflow-y': 'hidden', 'border-top': '1px solid #ccc'
    };
    var myHeight = Math.max($('#qrd-edit-body').height(), $('#qrd-tree-dialog-body').height(), $('#ticket-details-body').height());
    $('#edit-resource').css({'min-height': (myHeight - 61) +'px'});
    $('#qrd-edit-text-inner').css(thisQrdTextInnerCss);
    $('#qrd-edit-text-controls').css(thisQrdTextInputControlsCss);
    $('#qrd-edit-text').css(thisQrdTextInputCss);
    $('#qrd-edit-text-body').css(thisTextInputBodyCss);
    var uiWidth = Math.min(textWidth - 10, 300);
    var selectWidth = uiWidth + 10;
    $('.short-ui').css({width: uiWidth + 'px'});
    $('select.short-ui').css({width: selectWidth + 'px'});
    $('.long-ui').css({width: (textWidth - 10) + 'px'});
    $('select.long-ui').css({width: textWidth + 'px'});
};

ChatDisplayClass.prototype.addQrd = function(resource, ticketId, inDialog, toAttachment, menuEntry) {
    inDialog = (typeof inDialog != 'undefined') ? inDialog : false;
    toAttachment = (typeof toAttachment != 'undefined') ? toAttachment : false;
    menuEntry = (typeof menuEntry != 'undefined') ? menuEntry : '';
    ticketId = (typeof ticketId != 'undefined') ? ticketId : '';
    var headerString = t('Add new Resource');
    var footerString =  lzm_displayHelper.createButton('save-new-qrd', '', '', t('Ok'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-new-qrd', '', '', t('Cancel'), '', 'lr',
            {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div id="add-resource-placeholder" style="margin-top: 5px;"></div>';
    var qrdAddFormString = '<fieldset id="add-resource" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Add new Resource') + '</legend><div id="add-resource-inner">';
    if (ticketId == '' && !toAttachment) {
        // Type select
        var textSelectString = (!this.isApp && !this.isMobile) ? t('Text') : t('Text (not available on mobile devices)');
        var fileSelectString = (!this.isApp && !this.isMobile) ? t('File') : t('File (not available on mobile devices)');
            qrdAddFormString += '<div id="qrd-add-type-div">' +
            '<label for="qrd-add-type" style="font-size: 12px;">' + t('Type') + '</label><br />' +
            '<select id="qrd-add-type" class="lzm-select resource-ui-control long-ui" data-role="none">' +
            '<option value="-1">' + t('-- Choose a type ---') + '</option>' +
            '<option value="0">' + t('Folder') + '</option>';
        qrdAddFormString += '<option value="1">' + textSelectString + '</option>';
        qrdAddFormString += '<option value="2">' + t('Link') + '</option>';
        qrdAddFormString += '<option value="3">' + fileSelectString + '</option>';
        qrdAddFormString += '</select>' +
            '</div>';
    } else if (!toAttachment){
        qrdAddFormString += '<div id="qrd-add-type-div">' +
            '<input type="hidden" value="1" id="qrd-add-type" />' +
            '<label for="qrd-add-type-dummy" style="font-size: 12px;">' + t('Type') + '</label><br />' +
            '<input class="lzm-text-input resource-ui-control long-ui lzm-disabled" data-role="none" type="text" id="qrd-add-type-dummy" value="' + t('Text') + '" />' +
            '</div>';
    } else {
        qrdAddFormString += '<div id="qrd-add-type-div">' +
            '<input type="hidden" value="3" id="qrd-add-type" />' +
            '<label for="qrd-add-type-dummy" style="font-size: 12px;">' + t('Type') + '</label><br />' +
            '<input class="lzm-text-input resource-ui-control long-ui lzm-disabled" data-role="none" type="text" id="qrd-add-type-dummy" value="' + t('File Resource') + '" />' +
            '</div>';
    }
        // Title input
    qrdAddFormString += '<div id="qrd-add-title-div" class="qrd-add-resource qrd-add-html-resource qrd-add-folder-resource qrd-add-link-resource">' +
        '<label for="qrd-add-title" style="font-size: 12px;">' + t('Title') + '</label><br />' +
        '<input type="text" id="qrd-add-title" class="lzm-text-input resource-ui-control long-ui" data-role="none" />' +
        '</div>' +
        // Tags input
        '<div id="qrd-add-tags-div" class="qrd-add-resource qrd-add-html-resource qrd-add-link-resource">' +
        '<label for="qrd-add-tags" style="font-size: 12px;">' + t('Tags') + '</label><br />' +
        '<input type="text" id="qrd-add-tags" class="lzm-text-input resource-ui-control long-ui" data-role="none" />' +
        '</div>' +
        // HTML Resource textarea
        '<div id="qrd-add-text-div" class="qrd-add-resource qrd-add-html-resource">' +
        '<label for="qrd-add-text" style="font-size: 12px;">' + t('Text') + '</label><br />' +
        '<div id="qrd-add-text-inner">';
    qrdAddFormString += '<div id="qrd-add-text-controls">' +
        lzm_displayHelper.createInputControlPanel('basic').replace(/lzm_chatInputEditor/g,'qrdTextEditor') +
        '</div>';
    qrdAddFormString += '<div id="qrd-add-text-body">' +
        '<textarea id="qrd-add-text" data-role="none"></textarea>' +
        '</div></div></div>' +
        // URL input
        '<div id="qrd-add-url-div" class="qrd-add-link-resource qrd-add-resource">' +
        '<label for="qrd-add-url" style="font-size: 12px;">' + t('Url') + '</label><br />' +
        '<input type="url" id="qrd-add-url" class="lzm-text-input resource-ui-control long-ui" data-role="none" />' +
        '</div>' +
        // File input
        '<div id="qrd-add-file-div" class="qrd-add-file-resource qrd-add-resource">' +
        '<label for="qrd-add-file" style="font-size: 12px;">' + t('File') + '</label><br />' +
        '<input type="file" id="file-upload-input" class="lzm-file-upload resource-ui-control long-ui" data-role="none" onchange="changeFile();"/>' +
        '<div id="file-upload-progress" style="display: none; background-image: url(\'../images/chat_loading.gif\');' +
        ' background-position: left center; background-repeat: no-repeat; padding: 5px 230px; margin: 5px 0px 2px 0px;"><span id="file-upload-numeric">0%</span></div>' +
        '<div id="file-upload-name" style="margin: 5px 0px 2px 0px; padding: 2px 4px;"></div>' +
        '<div id="file-upload-size" style="margin: 2px 0px; padding: 2px 4px;"></div>' +
        '<div id="file-upload-type" style="margin: 2px 0px; padding: 2px 4px;"></div>' +
        //'<progress id="file-upload-progress" style="margin-top:10px; width: 100%;"></progress> <span id="file-upload-numeric"></span>' +
        '<div id="file-upload-error" style="color: #ff0000; font-weight: bold; padding: 10px 0px;"></div>' +
        '<div id="cancel-file-upload-div" style="display: none;">' + lzm_displayHelper.createButton('cancel-file-upload',
        'ui-disabled', 'cancelFileUpload()', t('Cancel file upload'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) + '</div>' +
        '</div>' +
        '</div></fieldset>';

    var dialogData = {editors: [{id: 'qrd-add-text', instanceName: 'qrdTextEditor'}], 'resource-id': resource.rid};
    if (ticketId != '') {
        dialogData['exceptional-img'] = 'img/023-email2.png';
    }

    if (inDialog) {
        if (toAttachment) {
            dialogData.menu = menuEntry;
            lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'ticket-details', {}, {}, {}, {}, '', dialogData, true, true, toAttachment + '_attachment');
        } else {
            this.qrdTreeDialog[ticketId] = $('#qrd-tree-dialog-container').detach();
            lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-tree-dialog', {}, {}, {}, {}, '', dialogData, true, true);
        }
    } else {
        lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'qrd-add', {}, {}, {}, {}, '', dialogData, true, /*false*/true);
    }
    lzm_displayHelper.createTabControl('add-resource-placeholder', [{name: t('Add new Resource'), content: qrdAddFormString}]);
    var qrdTextHeight = Math.max((this.FullscreenDialogWindowHeight - 307), 100);
    var textWidth = this.FullscreenDialogWindowWidth - 50;
    if (lzm_displayHelper.checkIfScrollbarVisible('qrd-add-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('qrd-tree-dialog-body') ||
        lzm_displayHelper.checkIfScrollbarVisible('ticket-details-body')) {
        textWidth -= lzm_displayHelper.getScrollBarWidth();
    }
    var thisQrdTextInnerCss = {
        width: (textWidth - 2)+'px', height:  (qrdTextHeight - 20)+'px', border: '1px solid #ccc',
        'background-color': '#f5f5f5', 'border-radius': '4px'
    };
    var thisQrdTextInputCss = {
        width: (textWidth - 2)+'px', height: (qrdTextHeight - 20)+'px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px', border: '1px solid #ccc'
    };
    var thisQrdTextInputControlsCss;
    thisQrdTextInputControlsCss = {
        width: (textWidth - 2)+'px', height: '15px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '7px 0px', 'text-align': 'left'
    };
    var thisTextInputBodyCss = {
        width: (textWidth - 2)+'px', height: (qrdTextHeight - 51)+'px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px',
        'background-color': '#ffffff', 'overflow-y': 'hidden', 'border-top': '1px solid #ccc'
    };
    var myHeight = Math.max($('#qrd-add-body').height(), $('#qrd-tree-dialog-body').height(), $('#ticket-details-body').height());
    $('#add-resource').css({'min-height': (myHeight - 61) +'px'});
    $('#qrd-add-text-inner').css(thisQrdTextInnerCss);
    $('#qrd-add-text-controls').css(thisQrdTextInputControlsCss);
    $('#qrd-add-text').css(thisQrdTextInputCss);
    $('#qrd-add-text-body').css(thisTextInputBodyCss);
    var uiWidth = Math.min(textWidth - 10, 300);
    var selectWidth = uiWidth + 10;
    $('.short-ui').css({width: uiWidth + 'px'});
    $('select.short-ui').css({width: selectWidth + 'px'});
    $('.long-ui').css({width: (textWidth - 10) + 'px'});
    $('select.long-ui').css({width: textWidth + 'px'});

    if (ticketId != '') {
        delete this.ticketResourceText[ticketId];
    }
};

ChatDisplayClass.prototype.updateResources = function(resources) {
    if ($('#resource-1').length > 0) {
        var chatPartner = $('#qrd-tree-body').data('chat-partner');
        var inDialog = $('#qrd-tree-body').data('in-dialog');
        var preparedResources = lzm_displayHelper.prepareResources(resources);
        var i;
        resources = preparedResources[0];
        var allResources = preparedResources[1];
        var counter = 0;
        while (resources.length > 0 && counter < 1000) {
            var tmpResources = [];
            for (i=0; i<resources.length; i++) {
                if ($('#resource-' + resources[i].rid).length == 0) {
                    if ($('#folder-' + resources[i].pid).length > 0) {
                        var resourceHtml = lzm_displayHelper.createResource(resources[i], chatPartner, inDialog);
                        $('#folder-' + resources[i].pid).append(resourceHtml);
                        //console.log(resourceHtml);
                    } else {
                        tmpResources.push(resources[i]);
                    }
                }
            }
            if (resources.length == tmpResources.length) {
                counter = 1000;
            }
            resources = tmpResources;
            counter++;
        }
        for (i=0; i<allResources.length; i++) {
            if (typeof allResources[i].md5 != 'undefined') {
                for (var j=0; j<this.resources.length; j++) {
                    if (allResources[i].rid == this.resources[j].rid && allResources[i].md5 != this.resources[j].md5) {
                        //console.log ('Updated resource ' + allResources[i].rid);
                        $('#resource-' + allResources[i].rid).find('span.qrd-title-span').html(lzm_commonTools.htmlEntities(allResources[i].ti));
                        $('#qrd-search-line-' + allResources[i].rid).html(lzm_displayHelper.createQrdSearchLine(allResources[i], $('#search-result-table').data('search-string')));
                        $('#qrd-recently-line-' + allResources[i].rid).html(lzm_displayHelper.createQrdRecentlyLine(allResources[i]));
                    }
                }
            }
        }
        this.resources = preparedResources[0];

        $('.resource-div').each(function() {
            var deleteThisResource = true;
            var thisResourceId = $(this).attr('id').split('resource-')[1];
            for (var i=0; i<allResources.length; i++) {
                if (allResources[i].rid == thisResourceId) {
                    deleteThisResource = false;
                }
            }
            if (deleteThisResource) {
                //console.log('Remove resource ' + thisResourceId);
                $('#resource-' + thisResourceId).remove();
                $('#qrd-search-line-' + thisResourceId).remove();
                $('#qrd-recently-line-' + thisResourceId).remove();
            }
        });
    }
};

/***********************************************************************************************************************************************************************/

ChatDisplayClass.prototype.createTicketList = function(tickets, ticketGlobalValues, page, sort, query, filter, operators) {
    var thisClass = this;
    this.ticketListTickets = tickets;

    var ticketList = lzm_displayHelper.createTicketList(tickets, ticketGlobalValues, page, sort, query, filter, operators);
    var ticketListHtml = ticketList[0];
    var numberOfPages = ticketList[1];

    //console.log(ticketListHtml);
    $('#ticket-list').html(ticketListHtml).trigger('create');
    if (!thisClass.isApp && !thisClass.isMobile && $(window).width() > 1000) {
        $('#ticket-list-left').css({
            width: ($(window).width()-33-350)+'px', float: 'left', 'overflow-x': 'auto', 'overflow-y': 'auto',
            border: '1px solid #ccc', 'border-radius': '4px', padding: '5px'
        });
        $('#ticket-list-right').css({
            width: '305px', height: Math.max($('#ticket-list-left').height(), 287)+'px', float: 'right', 'overflow-x': 'hidden', 'overflow-y':'auto',
            border: '1px solid #ccc', 'border-radius': '4px', padding: '5px', 'text-align': 'left'
        });
    }
    if (this.selectedTicketRow != '') {
        selectTicket(this.selectedTicketRow, true);
    }

    if (page == 1) {
        $('#ticket-page-all-backward').addClass('ui-disabled');
        $('#ticket-page-one-backward').addClass('ui-disabled');
    }
    if (page == numberOfPages) {
        $('#ticket-page-one-forward').addClass('ui-disabled');
        $('#ticket-page-all-forward').addClass('ui-disabled');
    }

    if (sort == 'update') {
        $('#ticket-sort-wait').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
        $('#ticket-sort-date').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
    } else if (sort == 'wait') {
        $('#ticket-sort-update').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
        $('#ticket-sort-date').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
    } else {
        $('#ticket-sort-wait').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
        $('#ticket-sort-update').css({'background-image': 'url(\'img/sort_by_this_inactive.png\')'});
    }

    $('#ticket-list-headline').css(thisClass.TicketHeadlineCss);
    $('#ticket-list-headline2').css(thisClass.TicketHeadline2Css);
    if (!thisClass.isApp && !thisClass.isMobile && $(window).width() > 1000) {
        thisClass.TicketBodyCss['overflow-y'] = 'hidden';
    }
    $('#ticket-list-body').css(thisClass.TicketBodyCss);
    $('#ticket-list-footline').css(thisClass.TicketFootlineCss);
    $('.ticket-list').css({height: ($('#ticket-list-body').height() - 12) + 'px'});
    thisClass.styleTicketClearBtn();

    $('#search-ticket').keyup(function(e) {
        thisClass.searchButtonUp('ticket', tickets, e);
    });
    $('#ticket-create-new').click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'create_tickets', {})) {
            showTicketDetails('', false);
        } else {
            showNoPermissionMessage();
        }
    });
    $('#ticket-show-emails').click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'review_emails', {})) {
            toggleEmailList();
        } else {
            showNoPermissionMessage();
        }
    });

    $('#clear-ticket-search').click(function() {
        $('#search-ticket').val('');
        $('#search-ticket').keyup();
    });

    if (isNaN(numberOfPages)) {
        switchTicketListPresentation(lzm_chatServerEvaluation.ticketFetchTime, 0);
    }
};

ChatDisplayClass.prototype.styleTicketClearBtn = function() {
    var ctsBtnWidth = $('#clear-ticket-search').width();
    var ctsBtnHeight =  $('#clear-ticket-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-ticket-search').css({padding: ctsBtnPadding});
};

ChatDisplayClass.prototype.styleResourceClearBtn = function() {
    var ctsBtnWidth = $('#clear-resource-search').width();
    var ctsBtnHeight =  $('#clear-resource-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-resource-search').css({padding: ctsBtnPadding});
};

ChatDisplayClass.prototype.updateTicketList = function(tickets, ticketGlobalValues, page, sort, query, filter, operators, forceRecreate) {
    //console.log('Updating ' + tickets.length + ' tickets');
    var thisClass = this;
    forceRecreate = (typeof forceRecreate != 'undefined') ? forceRecreate : false;
    forceRecreate = (forceRecreate || this.ticketGlobalValues.updating != ticketGlobalValues.updating) ? true : false;
    var ticketDutHasChanged = (this.ticketGlobalValues['dut'] != ticketGlobalValues['dut']);
    if (!isNaN(parseInt(ticketGlobalValues.lmc)) && (!isNaN(parseInt(this.ticketGlobalValues.lmc)) &&
        parseInt(ticketGlobalValues.lmc) > parseInt(this.ticketGlobalValues.lmc))) {
        if (this.playNewTicketSound == 1)
            this.playSound('ticket', 'tickets');
    }
    this.ticketGlobalValues = this.lzm_commonTools.clone(ticketGlobalValues);
    var selectedTicket = {id: ''};
    //console.log(tickets);
    for (var j=0; j<tickets.length; j++) {
        if (lzm_commonTools.checkTicketReadStatus(tickets[j].id, this.ticketReadArray, tickets) == -1) {
            this.ticketReadArray = lzm_commonTools.removeTicketFromReadStatusArray(tickets[j].id, this.ticketReadArray, true);
        }
        if (tickets[j].id == lzm_chatDisplay.selectedTicketRow) {
            for (var k=0; k<this.ticketListTickets.length; k++) {
                if (tickets[j].id == this.ticketListTickets[k].id && tickets[j].md5 != this.ticketListTickets[k].md5) {
                    selectedTicket = tickets[j];
                }
            }
        }
    }
    this.ticketListTickets  = tickets;

    var numberOfUnreadTickets = this.ticketGlobalValues.r - this.ticketReadArray.length + this.ticketUnreadArray.length;
    numberOfUnreadTickets = (typeof numberOfUnreadTickets == 'number' && numberOfUnreadTickets >= 0) ? numberOfUnreadTickets : 0;
    if (this.ticketGlobalValues.u != numberOfUnreadTickets) {
        this.ticketGlobalValues.u = numberOfUnreadTickets;
        this.createViewSelectPanel(this.firstVisibleView);
    }
    $('#ticket-show-emails').children('span').html(t('Emails <!--number_of_emails-->',
        [['<!--number_of_emails-->', '(' + this.ticketGlobalValues['e'] + ')']]));

    if ($('#visitor-information-body').length == 0) {
        if (this.selected_view == 'tickets') {
            if (ticketDutHasChanged || forceRecreate) {
                this.createTicketList(this.ticketListTickets, ticketGlobalValues, page, sort, query, filter, operators);
            }
        }

        if (numberOfUnreadTickets == 0 && this.numberOfUnreadTickets != 0 && this.ticketReadArray.length > 0) {
            setAllTicketsRead();
        }

        this.numberOfUnreadTickets = numberOfUnreadTickets;

        if(($('#ticket-details-placeholder').length == 1) && ($('#ticket-history-div').length == 1) && selectedTicket.id != '') {
            this.updateTicketDetails(selectedTicket, operators, lzm_chatServerEvaluation.internal_departments);
        }
    } else {
        $('#matching-tickets-table').html(lzm_displayHelper.createMatchingTicketsTableContent(tickets, operators));
        //selectTicket(thisClass.selectedTicketRow, true, true);
    }
};

ChatDisplayClass.prototype.updateTicketDetails = function(selectedTicket, operators, groups) {
    //console.log ('Update ticket details: ' + selectedTicket.id);
    var selectedMessage = $('#ticket-history-table').data('selected-message');
    var operatorObject = {}, selectedGroup = {}, i;
    for (i=0; i<operators.length; i++) {
        operatorObject[operators[i].id] = operators[i];
    }
    for (i=0; i<groups; i++) {
        if (groups[i].id == $('#ticket-details-group').val()) {
            selectedGroup = groups[i];
        }
    }
    var ticketDetails = lzm_displayHelper.createTicketDetails(selectedTicket.id, selectedTicket, {id: 0}, {cid: 0}, ' class="ui-disabled"', false,
        operatorObject, selectedGroup, groups);

    var messageListHtml = lzm_displayHelper.createTicketMessageTable(selectedTicket, {id: ''}, selectedMessage, false, operatorObject);
    $('#ticket-message-list').html('<legend>' + t('Ticket History') + '</legend>' + messageListHtml).trigger('create');
    $('#ticket-ticket-details').html('<legend>' + t('Ticket Details') + '</legend>' + ticketDetails.html).trigger('create');
    $('#message-line-' + selectedTicket.id + '_' + (selectedMessage)).addClass('selected-table-line');

    var commentsHtml = '<legend>' + t('Comments') + '</legend>' + lzm_displayHelper.createTicketCommentTable(selectedTicket, selectedMessage, operatorObject);
    $('#ticket-comment-list').html(commentsHtml);

    lzm_displayHelper.createTicketDetailsGroupChangeHandler(selectedTicket, operatorObject, groups);
};

ChatDisplayClass.prototype.showTicketDetails = function(ticket, operatorObject, groups, isNew, email, chat, existingDialogId) {
    var thisClass = this;
    isNew = (typeof isNew != 'undefined') ? isNew : false;
    existingDialogId = (typeof existingDialogId != 'undefined') ? existingDialogId : '';
    var disabledString = (isNew && email.id == '' && chat.cid == '') ? '' : ' class="ui-disabled"';
    var myCustomInput, myCustomFieldValue, i;
    thisClass.ticket = ticket;
    var selectedLanguage = '';
    var selectedGroup = groups[0];
    //console.log('Show details of ticket: ' + ticket.id);
    var headerString = '';
    if (isNew) {
        headerString = t('Ticket');
    } else {
        if (ticket.messages[0].fn != '') {
            headerString = t('Ticket (<!--ticket_id-->, <!--name-->)',[['<!--ticket_id-->', ticket.id],['<!--name-->', ticket.messages[0].fn]]);
        } else {
            headerString = t('Ticket (<!--ticket_id-->)',[['<!--ticket_id-->', ticket.id]]);
        }
    }
    var disabledButtonClass = (isNew) ? ' ui-disabled' : '';
    var footerString = '<span style="float: left;">' +
        lzm_displayHelper.createButton('reply-ticket-details', 'ticket-buttons' + disabledButtonClass, '', t('Reply'), 'img/060-reply.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('ticket-actions', 'ticket-buttons' + disabledButtonClass, '', t('Actions'), 'img/637-tools.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        '</span>' +
        lzm_displayHelper.createButton('save-ticket-details', 'ticket-buttons','', t('Ok'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-ticket-details', 'ticket-buttons','', t('Cancel'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});

    var ticketHistoryHeadline = (isNew) ? t('Message') : t('Ticket History');

    var lastMessage = (typeof ticket.messages != 'undefined') ? ticket.messages.length - 1 : -1;
    //var bodyString = '<div id="ticket-history-div" style="height: 300px; border: 1px solid #ccc; border-radius: 4px; padding: 4px; overflow: auto;">' +
    var bodyString = '<div id="ticket-history-div" onclick="removeTicketMessageContextMenu();" style="margin-top: 5px;"><div id="ticket-history-placeholder"></div></div>';

    var historyTableHtml = '<fieldset class="lzm-fieldset" id="ticket-message-list" data-role="none">' +
        '<legend>' + t('Ticket History') + '</legend>' +
        lzm_displayHelper.createTicketMessageTable(ticket, email, lastMessage, isNew, operatorObject, chat) +
        '</fieldset>';

    bodyString += '<div id="ticket-details-div" onclick="removeTicketMessageContextMenu();" style="margin-top: 15px;"><div id="ticket-details-placeholder"></div></div>';

    var ticketId = (typeof ticket.id != 'undefined') ? ticket.id + '[' + ticket.h + ']' : '';
    var myDetails = lzm_displayHelper.createTicketDetails(ticketId, ticket, email, chat, disabledString, isNew, operatorObject, selectedGroup, groups);
    var myMessage = (isNew) ? {} : ticket.messages[lastMessage];
    var detailsHtml = '<fieldset class="lzm-fieldset" id="ticket-message-details" data-role="none">' +
        '<legend>' + t('Details') + '</legend>' +
        lzm_displayHelper.createTicketMessageDetails(myMessage, email, isNew, operatorObject, chat) +
        '</fieldset>';
    var ticketDetailsHtml = '<fieldset class="lzm-fieldset" id="ticket-ticket-details" data-role="none">' +
        '<legend>' + t('Ticket Details') + '</legend>' +
        myDetails.html +
        '</fieldset>';
    selectedLanguage = myDetails.language;
    selectedGroup = myDetails.group;

    var menuEntry = (!isNew) ? t('Ticket (<!--ticket_id-->, <!--name-->)',[['<!--ticket_id-->', ticket.id],['<!--name-->', ticket.messages[0].fn]]) :
        (email.id == '') ? t('New Ticket') : t('New Ticket (<!--name-->)', [['<!--name-->', email.n]]);
    var attachmentsHtml = '<fieldset class="lzm-fieldset" id="ticket-attachment-list" data-role="none">' +
        '<legend>' + t('Attachments') + '</legend>' +
        lzm_displayHelper.createTicketAttachmentTable(ticket, email, lastMessage, isNew) +
        '</fieldset>';
    var commentsHtml = '<fieldset class="lzm-fieldset" id="ticket-comment-list" data-role="none">' +
        '<legend>' + t('Comments') + '</legend>' +
        lzm_displayHelper.createTicketCommentTable(ticket, lastMessage, operatorObject, menuEntry) +
        '</fieldset>';

    var messageHtml = '<fieldset class="lzm-fieldset" id="ticket-message-text" data-role="none">' +
        '<legend>' + t('Message') + '</legend>';
    if (typeof ticket.messages != 'undefined') {
        messageHtml += lzm_commonTools.htmlEntities(ticket.messages[lastMessage].mt).replace(/\n/g, '<br />');
    }
    if (isNew) {
        var newTicketText = (email.id == '') ? (chat.cid == '') ? '' : chat.q : email.text;
        newTicketText = newTicketText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n +/g, '\n').replace(/\n+/g, '\r\n');
        messageHtml += '<textarea id="ticket-new-input" class="ticket-reply-text">' + newTicketText + '</textarea>';
    }
    messageHtml += '</fieldset>';

    var dialogData = {'ticket-id': ticket.id, 'email-id': email.id, menu: menuEntry};
    var defaultCss = {};
    var dialogId = '';
    if (existingDialogId == '' && email.id == '' && chat.cid == '') {
        dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'ticket-details', defaultCss, {}, {}, {}, '', dialogData, true, true);
        $('#ticket-details-body').data('dialog-id', dialogId);
    } else if (existingDialogId != '' && email.id == '' && chat.cid == '') {
        lzm_displayHelper.minimizeDialogWindow(existingDialogId, 'visitor-information', {}, lzm_chatDisplay.selected_view, false);
        dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'ticket-details', defaultCss, {}, {}, {}, '', dialogData, true, true);
        $('#ticket-details-body').data('dialog-id', dialogId);
    } else if (email.id == '' && chat.cid != '') {
        lzm_displayHelper.minimizeDialogWindow(chat['dialog-id'], 'visitor-information', {}, lzm_chatDisplay.selected_view, false);
        dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'visitor-information', defaultCss, {}, {}, {}, '', dialogData, true, true, chat['dialog-id'] + '_ticket');
        $('#visitor-information-body').data('dialog-id', dialogId);
    } else {
        lzm_displayHelper.minimizeDialogWindow(email['dialog-id'], 'email-list', {}, 'tickets', false);
        dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'email-list', defaultCss, {}, {}, {}, '', dialogData, true, true, email['dialog-id'] + '_ticket');
        $('#email-list-body').data('dialog-id', dialogId);
    }

    var ticketTabArray = [];
    if (!isNew || chat.cid != '') {
        ticketTabArray.push({name: ticketHistoryHeadline, content: historyTableHtml});
    }
    var ticketDetailsActiveTab = (chat.cid != '') ? 1 : 0;
    ticketTabArray.push({name: t('Ticket Details'), content: ticketDetailsHtml});
    lzm_displayHelper.createTabControl('ticket-history-placeholder', ticketTabArray, ticketDetailsActiveTab);
    lzm_displayHelper.createTabControl('ticket-details-placeholder', [{name: t('Message'), content: messageHtml},
        {name: t('Details'), content: detailsHtml}, {name: t('Attachments'), content: attachmentsHtml},
        {name: t('Comments'), content: commentsHtml}]);
    $('#message-line-' + ticket.id + '_' + (lastMessage)).addClass('selected-table-line');

    var myHeight = Math.max($('#ticket-details-body').height(), $('#email-list-body').height());
    myHeight = Math.max(myHeight, $('#visitor-information-body').height());
    var historyHeight, detailsHeight;
    if (myHeight > 600) {
        historyHeight = 245;
        detailsHeight = myHeight - historyHeight - 90;
    } else {
        detailsHeight = (myHeight > 535) ? 265 : (myHeight > 340) ? 200 : 120;
        historyHeight = myHeight - detailsHeight - 90;
    }
    var newInputHeight = Math.max(detailsHeight - 48, 150);
    $('.ticket-history-placeholder-content').css({height: historyHeight + 'px'});
    $('.ticket-details-placeholder-content').css({height: detailsHeight + 'px'});
    $('#ticket-comment-list').css({'min-height': (detailsHeight - 22) + 'px'});
    $('#ticket-message-text').css({'min-height': (detailsHeight - 22) + 'px'});
    $('#ticket-message-details').css({'min-height': (detailsHeight - 22) + 'px'});
    $('#ticket-attachment-list').css({'min-height': (detailsHeight - 22) + 'px'});
    $('#ticket-message-list').css({'min-height': (historyHeight - 22) + 'px'});
    $('#ticket-ticket-details').css({'min-height': (historyHeight - 22) + 'px'});
    $('#ticket-new-input').css({height: newInputHeight + 'px'});

    this.ticketMessageWidth = $('#ticket-history-div').width() - 39 - lzm_displayHelper.getScrollBarWidth();
    $('#ticket-details-inner').css({width: Math.min(400, this.ticketMessageWidth)});
    $('#message-details-inner').css({width: Math.min(400, this.ticketMessageWidth)});

    $('.ui-collapsible-content').css({'overflow-x': 'auto'});

    lzm_displayHelper.createTicketDetailsGroupChangeHandler(ticket, operatorObject, groups);

    $('#add-attachment').click(function() {
        if (!thisClass.isApp && !thisClass.isMobile) {
            lzm_displayHelper.minimizeDialogWindow(dialogId, 'ticket-details',
                {'ticket-id': -1, menu: menuEntry}, 'tickets', false);
            lzm_chatUserActions.addQrd('', true, dialogId, menuEntry);
        } else {
            showNotMobileMessage();
        }
    });
    $('#add-attachment-from-qrd').click(function() {
        lzm_displayHelper.minimizeDialogWindow(dialogId, 'ticket-details',
            {'ticket-id': -1, menu: menuEntry}, 'tickets', false);
        var fileResources = [];
        for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
            if ($.inArray(lzm_chatServerEvaluation.resources[i].ty, ['0','3','4']) != -1) {
                fileResources.push(lzm_chatServerEvaluation.resources[i]);
            }
        }
        lzm_chatDisplay.createQrdTreeDialog(fileResources, 'ATTACHMENT~' + dialogId, lzm_chatServerEvaluation.external_users,
            lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments, menuEntry);
    });
    $('#remove-attachment').click(function() {
        var resources = $('#ticket-details-placeholder-content-1').data('selected-resources');
        resources = (typeof resources != 'undefined') ? resources : [];
        //console.log(resources);
        var tmpResources = [];
        for (var i=0; i<resources.length; i++) {
            if (i != $('#attachment-table').data('selected-attachment')) {
                tmpResources.push(resources[i]);
            }
        }
        $('#ticket-details-placeholder-content-1').data('selected-resources', tmpResources);
        thisClass.updateAttachmentList();
        $('#attachment-table').data('selected-attachment', -1);
        $('#remove-attachment').addClass('ui-disabled');
    });

    $('#ticket-actions').click(function(e) {
        e.stopPropagation();
        if (thisClass.showTicketMessageContextMenu) {
            removeTicketMessageContextMenu();
        } else {
            openTicketMessageContextMenu(e, ticket.id, '', true);
        }
    });
    $('#reply-ticket-details').click(function() {
        var opName = t('another operator'), confirmText = '';
        if (typeof ticket.editor != 'undefined' && ticket.editor != false) {
            try {
                opName = operatorObject[ticket.editor.ed].name;
            } catch (e) {}
            confirmText = t('This ticket is already processed by <!--op_name-->. Do you really want to take it over?', [['<!--op_name-->', opName]]);
        }
        if (typeof ticket.editor == 'undefined' || !ticket.editor || ticket.editor.ed == '' || ticket.editor.ed == thisClass.myId ||
            (confirm(confirmText) && thisClass.checkTicketTakeOverReply())) {
            $('#reply-ticket-details').addClass('ui-disabled');
            if (typeof ticket.editor == 'undefined' || !ticket.editor || ticket.editor.ed == '' || ticket.editor.ed != thisClass.myId || ticket.editor.st != 1) {
                var myGroup = (typeof ticket.editor != 'undefined' && ticket.editor != false) ? ticket.editor.g : ticket.gr;
                saveTicketDetails(ticket, ticket.t, 1, myGroup, thisClass.myId, ticket.l);
                if (typeof ticket.editor == 'undefined' || ticket.editor == false) {
                    var now = lzm_chatTimeStamp.getServerTimeString(null, true);
                    ticket.editor = {id: ticket.id, u: now, w: now, st: 0, ti: now, g: myGroup};
                }
                ticket.editor.ed = thisClass.myId;
            }
            thisClass.showMessageReply(ticket, $('#ticket-history-table').data('selected-message'), operatorObject, groups, selectedGroup, menuEntry);
        }
    });
    $('#save-ticket-details').click(function() {
        var myStatus = $('#ticket-details-status').val();
        if (!lzm_displayHelper.checkTicketDetailsChangePermission(ticket, {status: myStatus})) {
            showNoPermissionMessage();
        } else {
            var attachments, comments, customFields = {};
            if (existingDialogId == '' && email.id == '' && chat.cid == '') {
                attachments = $('#ticket-details-placeholder-content-1').data('selected-resources');
                attachments = (typeof attachments != 'undefined') ? attachments : [];
                comments = $('#ticket-details-placeholder-content-2').data('comments');
                comments = (typeof comments != 'undefined') ? comments : [];
                for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
                    myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
                    if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
                        myCustomFieldValue = (myCustomInput.type != 'CheckBox') ? $('#ticket-new-cf' + myCustomInput.id).val() :
                            (typeof $('#ticket-new-cf' + myCustomInput.id).attr('checked') != 'undefined') ? '1' : '0';
                        customFields[myCustomInput.id] = myCustomFieldValue;
                    }
                }
                saveTicketDetails(ticket, $('#ticket-details-channel').val(), $('#ticket-details-status').val(),
                    $('#ticket-details-group').val(), $('#ticket-details-editor').val(), $('#ticket-details-language').val(),
                    $('#ticket-new-name').val(), $('#ticket-new-email').val(), $('#ticket-new-company').val(), $('#ticket-new-phone').val(),
                    $('#ticket-new-input').val(), attachments, comments, customFields);
                lzm_displayHelper.removeDialogWindow('ticket-details');
            } else if (existingDialogId != '' && email.id == '' && chat.cid == '') {
                attachments = $('#ticket-details-placeholder-content-1').data('selected-resources');
                attachments = (typeof attachments != 'undefined') ? attachments : [];
                comments = $('#ticket-details-placeholder-content-2').data('comments');
                comments = (typeof comments != 'undefined') ? comments : [];
                saveTicketDetails(ticket, $('#ticket-details-channel').val(), $('#ticket-details-status').val(),
                    $('#ticket-details-group').val(), $('#ticket-details-editor').val(), $('#ticket-details-language').val(),
                    $('#ticket-new-name').val(), $('#ticket-new-email').val(), $('#ticket-new-company').val(), $('#ticket-new-phone').val(),
                    $('#ticket-new-input').val(), attachments, comments, customFields);
                lzm_displayHelper.removeDialogWindow('ticket-details');
                maximizeDialogWindow(existingDialogId);
            } else if (email.id == '' && chat.cid != '') {
                comments = $('#ticket-details-placeholder-content-2').data('comments');
                comments = (typeof comments != 'undefined') ? comments : [];
                attachments = $('#ticket-details-placeholder-content-1').data('selected-resources');
                attachments = (typeof attachments != 'undefined') ? attachments : [];
                for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
                    myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
                    if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
                        myCustomFieldValue = (myCustomInput.type != 'CheckBox') ? $('#ticket-new-cf' + myCustomInput.id).val() :
                            (typeof $('#ticket-new-cf' + myCustomInput.id).attr('checked') != 'undefined') ? '1' : '0';
                        customFields[myCustomInput.id] = myCustomFieldValue;
                    }
                }
                saveTicketDetails(ticket, $('#ticket-details-channel').val(), $('#ticket-details-status').val(),
                    $('#ticket-details-group').val(), $('#ticket-details-editor').val(), $('#ticket-details-language').val(),
                    $('#ticket-new-name').val(), $('#ticket-new-email').val(), $('#ticket-new-company').val(), $('#ticket-new-phone').val(),
                    $('#ticket-new-input').val(), attachments, comments, customFields, chat);
                lzm_displayHelper.removeDialogWindow('visitor-information');
                maximizeDialogWindow(chat['dialog-id']);
            } else {
                comments = $('#ticket-details-placeholder-content-2').data('comments');
                comments = (typeof comments != 'undefined') ? comments : [];
                for (i=0; i<lzm_chatServerEvaluation.inputList.idList.length; i++) {
                    myCustomInput = lzm_chatServerEvaluation.inputList.getCustomInput(lzm_chatServerEvaluation.inputList.idList[i]);
                    if (myCustomInput.active == 1 && parseInt(myCustomInput.id) < 111) {
                        myCustomFieldValue = (myCustomInput.type != 'CheckBox') ? $('#ticket-new-cf' + myCustomInput.id).val() :
                            (typeof $('#ticket-new-cf' + myCustomInput.id).attr('checked') != 'undefined') ? '1' : '0';
                        customFields[myCustomInput.id] = myCustomFieldValue;
                    }
                }
                thisClass.ticketsFromEmails.push({'email-id': email.id, ticket: ticket, channel: $('#ticket-details-channel').val(), status: $('#ticket-details-status').val(),
                    group: $('#ticket-details-group').val(), editor: $('#ticket-details-editor').val(), language: $('#ticket-details-language').val(),
                    name: $('#ticket-new-name').val(), email: $('#ticket-new-email').val(), company: $('#ticket-new-company').val(), phone: $('#ticket-new-phone').val(),
                    message: $('#ticket-new-input').val(), subject: $('#ticket-new-subject').val(), attachment: email.attachment, comment: comments, custom: customFields});
                lzm_displayHelper.removeDialogWindow('email-list');
                maximizeDialogWindow(email['dialog-id']);
            }
            thisClass.ticketOpenMessages = [];
        }
    });
    $('#cancel-ticket-details').click(function() {
        if (email.id != '') {
            lzm_displayHelper.removeDialogWindow('email-list');
            maximizeDialogWindow(email['dialog-id']);
        } else if (chat.cid != '') {
            lzm_displayHelper.removeDialogWindow('visitor-information');
            maximizeDialogWindow(chat['dialog-id']);
        } else if (existingDialogId != '') {
            lzm_displayHelper.removeDialogWindow('ticket-details');
            maximizeDialogWindow(existingDialogId);
        } else {
            lzm_displayHelper.removeDialogWindow('ticket-details');
        }
        thisClass.ticketOpenMessages = [];
    });

    return dialogId;
};

ChatDisplayClass.prototype.checkTicketTakeOverReply = function() {
    var rtValue = lzm_commonPermissions.checkUserPermissions('', 'tickets', 'assign_operators', {});
    if (!rtValue) {
        showNoPermissionMessage();
    }
    return rtValue;
};

ChatDisplayClass.prototype.showMessageReply = function(ticket, messageNo, operatorObject, groups, selectedGroup, menuEntry) {
    menuEntry = (typeof menuEntry != 'undefined') ? menuEntry : '';
    var thisClass = this;
    var i = 0, j = 0, signatureText = '', answerInline = false, mySig = {};
    messageNo = (messageNo == -1) ? ticket.messages.length -1 : messageNo;
    var myself = operatorObject[thisClass.myId];
    var signatures = [];
    for (i=0; i<myself.sig.length; i++) {
        mySig = myself.sig[i];
        mySig.priority = 4;
        if (myself.sig[i].d == 1) {
            mySig.priority = 5;
        }
        signatures.push(mySig);
    }
    for (i=0; i<groups.length; i++) {
        if ($.inArray(groups[i].id, operatorObject[thisClass.myId].groups) != -1) {
            for (j=0; j<groups[i].sig.length; j++) {
                mySig =  groups[i].sig[j];
                mySig.priority = 0;
                if (groups[i].sig[j].d == 1 && groups[i].sig[j].g != selectedGroup.id) {
                    mySig.priority = 1;
                } else if (groups[i].sig[j].d != 1 && groups[i].sig[j].g == selectedGroup.id) {
                    mySig.priority = 2;
                } else if (groups[i].sig[j].d == 1 && groups[i].sig[j].g == selectedGroup.id) {
                    mySig.priority = 3;
                }
                signatures.push(mySig);
            }
        }
    }
    signatures.sort(function(a, b) {
        return (a.d < b.d);
    });

    var salutationFields = lzm_commonTools.getTicketSalutationFields(ticket);
    var checkedString, disabledString;
    var replyString = '<table style="width: 100%;" id="ticket-reply">' +
        '<tr><td><fieldset class="lzm-fieldset" data-role="none"><legend>' + t('Salutation') + '</legend>';
    checkedString = (salutationFields['salutation'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['salutation'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<span id="tr-greet-placeholder"' + disabledString + '></span>' +
        '<input type="checkbox" id="use-tr-greet" data-role="none"' + checkedString + ' style="margin-right: 7px;" /> ';
    checkedString = (salutationFields['title'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['title'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<span id="tr-title-placeholder"' + disabledString + '></span>' +
        '<input type="checkbox" id="use-tr-title" data-role="none"' + checkedString + ' style="margin-right: 7px;" /> ';
    checkedString = (salutationFields['first name'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['first name'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<input type="text" id="tr-firstname"' + disabledString + ' data-role="none" style="margin: 2px; min-width: 202px;"' +
        ' placeholder="' + t('First Name') + '" value="' + capitalize(salutationFields['first name'][1]) + '" />' +
        '<input type="checkbox" id="use-tr-firstname" data-role="none"' + checkedString + ' style="margin-right: 7px;" /> ';
    checkedString = (salutationFields['last name'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['last name'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<input type="text" id="tr-lastname"' + disabledString + ' data-role="none" style="margin: 2px; min-width: 202px;"' +
        ' placeholder="' + t('Last Name') + '" value="' + capitalize(salutationFields['last name'][1]) + '" />' +
        '<input type="checkbox" id="use-tr-lastname" data-role="none"' + checkedString + ' style="margin-right: 7px;" />' +
        '<input type="text" id="tr-punctuationmark" data-role="none" style="min-width: 0px; width: 10px; margin: 2px;"' +
        ' value="' + salutationFields['punctuation mark'][1][0][0] + '" />' +
        '</fieldset></td></tr>' +
        '<tr><td><fieldset class="lzm-fieldset" data-role="none"><legend>' + t('Introduction Phrase') + '</legend>';
    checkedString = (salutationFields['introduction phrase'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['introduction phrase'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<span id="tr-intro-placeholder"' + disabledString + '></span>' +
        '<input type="checkbox" id="use-tr-intro" data-role="none"' + checkedString + ' />' +
        '</fieldset></td></tr>' +
        '<tr><td><fieldset class="lzm-fieldset" data-role="none"><legend>' + t('Mail Text') + '</legend>' +
        '<div id="message-reply-container" style="margin: 0px; width: ' + this.ticketMessageWidth + 'px;">' +
        '<div id="ticket-reply-input-buttons" style="padding:5px 0px;">' +
        lzm_displayHelper.createButton('ticket-reply-input-load', '', '', t('Load'), 'img/014-folder_open.png', 'lr',
            {'margin-left': '0px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('ticket-reply-input-save', 'ui-disabled', '', t('Save'), 'img/039-save.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('ticket-reply-input-saveas', '', '', t('Save As ...'), 'img/039-saveas.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('ticket-reply-input-clear', '', '', t('Clear'), 'img/201-delete2.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        '</div><div style="text-align: right;">' +
        '<a href="#" id="ticket-reply-reply-inline">' + t('Reply Inline') + '</a>&nbsp;&nbsp;' +
        '<a href="#" id="ticket-reply-show-question">' + t('Show Question') + '</a>' +
        '</div>' +
        '<textarea id="ticket-reply-input" class="ticket-reply-text"></textarea>' +
        '<div id="ticket-reply-last-question" style="display: none; border: 0px; border-radius: 4px; padding: 3px;' +
        'width: ' + (thisClass.FullscreenDialogWindowWidth - 72) + 'px; background-color: #ffffe1;"></div><br />' +
        '<input type="hidden" id="ticket-reply-input-resource" value="" />' +
        '</fieldset></td></tr>' +
        '<tr><td><fieldset class="lzm-fieldset" data-role="none"><legend>' + t('Closing Phrase') + '</legend>';
    checkedString = (salutationFields['closing phrase'][0]) ? ' checked="checked"' : '';
    disabledString = (salutationFields['closing phrase'][0]) ? '' : ' class="ui-disabled"';
    replyString += '<span id="tr-close-placeholder"' + disabledString + '></span>' +
        '<input type="checkbox" id="use-tr-close" data-role="none"' + checkedString + ' />' +
        '</fieldset></td></tr>';
    replyString += '<tr><td><fieldset class="lzm-fieldset" data-role="none"><legend>' + t('Signature') + '</legend>' +
        '<div id="message-signature-container" style="margin: 0px; width: ' + this.ticketMessageWidth + 'px;">' +
        '<select id="ticket-reply-signature" data-role="none">';
    var chosenPriority = -1;
    for (i=0; i<signatures.length; i++) {
        var defaultString = (signatures[i].d == 1) ? t('(Default)') : '';
        var nameString = signatures[i].n + ' ' + defaultString;
        var selectedString = '';
        //if (signatures[i].d == 1 && signatures[i].g == selectedGroup.id) {
        if (signatures[i].priority > chosenPriority) {
            selectedString = ' selected="selected"';
            signatureText = signatures[i].text;
            chosenPriority = signatures[i].priority;
        }
        replyString += '<option value="' + signatures[i].text + '"' + selectedString + '>' + nameString + '</option>';
    }
    replyString += '</select>';
    disabledString = (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'change_signature', {})) ? '' : ' ui-disabled"';
    replyString += '<textarea id="ticket-reply-signature-text" class="ticket-reply-text' + disabledString + '" style="height: 70px;">' + signatureText + '</textarea>';

    replyString += '</div>' +
        '</fieldset></td></tr>' +
        '</table>';

    var attachmentsHtml = '<fieldset data-role="none" class="lzm-fieldset" id="message-attachment-list">' +
        '<legend>' + t('Attachments') + '</legend>' +
        lzm_displayHelper.createTicketAttachmentTable({},{id: ''}, -1, true) +
        '</fieldset>';
    var commentsHtml = '<fieldset data-role="none" class="lzm-fieldset" id="message-comment-text">' +
        '<legend>' + t('Add Comment') + '</legend>' +
        '<textarea data-role="none" id="new-message-comment"></textarea>' +
        '</fieldset>';
    var bodyString = '<div id="reply-placeholder" style="margin-top: 5px;"></div>';
    var headerString = t('Compose Response');

    var footerString = lzm_displayHelper.createButton('ticket-reply-preview', '', '', t('Preview'), '', 'lr',
            {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('ticket-reply-cancel', '', 'cancelTicketReply(\'ticket-details\', \'' + thisClass.ticketDialogId[ticket.id] + '\');', t('Cancel'), '', 'lr',
            {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    lzm_displayHelper.minimizeDialogWindow(thisClass.ticketDialogId[ticket.id], 'ticket-details',
        {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
    var myDialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'ticket-details', {}, {}, {}, {}, '',
        {'ticket-id': ticket.id, menu: menuEntry}, true, true, thisClass.ticketDialogId[ticket.id] + '_reply');

    lzm_displayHelper.createTabControl('reply-placeholder', [{name: t('Composer'), content: replyString},
        {name: t('Attachments'), content: attachmentsHtml}, {name: t('Comment'), content: commentsHtml}], 0);

    $('.reply-placeholder-content').css({height: ($('#ticket-details-body').height() - 40) + 'px'});
    $('#message-comment-text').css({'min-height': ($('#ticket-details-body').height() - 62) + 'px'});
    $('#message-attachment-list').css({'min-height': ($('#ticket-details-body').height() - 62) + 'px'});

    lzm_displayHelper.createInputMenu('tr-greet-placeholder', 'tr-greet', '', 0, t('Salutation'), salutationFields['salutation'][1][0][0], salutationFields['salutation'][1], 'reply-placeholder-content-0', -2);
    lzm_displayHelper.createInputMenu('tr-title-placeholder', 'tr-title', '', 0, t('Title'), salutationFields['title'][1][0][0], salutationFields['title'][1], 'reply-placeholder-content-0', -2);
    lzm_displayHelper.createInputMenu('tr-intro-placeholder', 'tr-intro', '', thisClass.FullscreenDialogWindowWidth - 122, t('Introduction Phrase'),
        salutationFields['introduction phrase'][1][0][0], salutationFields['introduction phrase'][1], 'reply-placeholder-content-0', 0);
    lzm_displayHelper.createInputMenu('tr-close-placeholder', 'tr-close', '', thisClass.FullscreenDialogWindowWidth - 122, t('Closing Phrase'),
        salutationFields['closing phrase'][1][0][0], salutationFields['closing phrase'][1], 'reply-placeholder-content-0', 0);

    var trFields = ['greet', 'title', 'firstname', 'lastname', 'punctuationmark', 'intro', 'close'];
    for (i=0; i<trFields.length; i++) {
        $('#use-tr-' + trFields[i]).change(function() {
            var inputId = $(this).attr('id').replace(/use-/,'');
            if ($('#use-' + inputId).attr('checked') == 'checked') {
                $('#' + inputId + '-placeholder').removeClass('ui-disabled');
                $('#' + inputId).removeClass('ui-disabled');
            } else {
                $('#' + inputId + '-placeholder').addClass('ui-disabled');
                $('#' + inputId).addClass('ui-disabled');
            }
        });
    }

    $('#reply-placeholder-tab-2').click(function() {
        lzm_displayLayout.resizeTicketReply();
    });

    $('#add-attachment').click(function() {
        if (!thisClass.isApp && !thisClass.isMobile) {
            lzm_displayHelper.minimizeDialogWindow(myDialogId, 'ticket-details',
                {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
            lzm_chatUserActions.addQrd('', true, myDialogId, menuEntry);
        } else {
            showNotMobileMessage();
        }
    });
    $('#add-attachment-from-qrd').click(function() {
        lzm_displayHelper.minimizeDialogWindow(myDialogId, 'ticket-details',
            {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
        var fileResources = [];
        for (var i=0; i<lzm_chatServerEvaluation.resources.length; i++) {
            if ($.inArray(lzm_chatServerEvaluation.resources[i].ty, ['0','3','4']) != -1) {
                fileResources.push(lzm_chatServerEvaluation.resources[i]);
            }
        }
        lzm_chatDisplay.createQrdTreeDialog(fileResources, 'ATTACHMENT~' + myDialogId, lzm_chatServerEvaluation.external_users,
            lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments, menuEntry);
    });
    $('#remove-attachment').click(function() {
        var resources = $('#reply-placeholder-content-1').data('selected-resources');
        resources = (typeof resources != 'undefined') ? resources : [];
        //console.log(resources);
        var tmpResources = [];
        for (var i=0; i<resources.length; i++) {
            if (i != $('#attachment-table').data('selected-attachment')) {
                tmpResources.push(resources[i]);
            }
        }
        $('#reply-placeholder-content-1').data('selected-resources', tmpResources);
        thisClass.updateAttachmentList();
        $('#attachment-table').data('selected-attachment', -1);
        $('#remove-attachment').addClass('ui-disabled');
    });

    $('#ticket-reply-input-load').click(function() {
        lzm_displayHelper.minimizeDialogWindow(thisClass.ticketDialogId[ticket.id] + '_reply', 'ticket-details',
            {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
        thisClass.createQrdTreeDialog(lzm_chatServerEvaluation.resources, 'TICKET LOAD' + '~' + ticket.id, [], [], [], menuEntry);
    });
    $('#ticket-reply-input-save').click(function() {
        if ($('#ticket-reply-input-resource').val() != '') {
            var resourceText = $('#ticket-reply-input').val();
            var resourceId = $('#ticket-reply-input-resource').val();
            saveQrdFromTicket(resourceId, resourceText);
        }
    });
    $('#ticket-reply-input-saveas').click(function() {
        if (thisClass.isApp || thisClass.isMobile) {
            showNotMobileMessage();
        } else {
            thisClass.ticketResourceText[ticket.id] = $('#ticket-reply-input').val().replace(/\n/g, '<br />');
            lzm_displayHelper.minimizeDialogWindow(thisClass.ticketDialogId[ticket.id] + '_reply', 'ticket-details',
                {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
            var textResources = [];
            for (var k=0; k<lzm_chatServerEvaluation.resources.length; k++) {
                if ($.inArray(parseInt(lzm_chatServerEvaluation.resources[k].ty), [0,1]) != -1) {
                    textResources.push(lzm_chatServerEvaluation.resources[k]);
                }
            }
            thisClass.createQrdTreeDialog(textResources, 'TICKET SAVE' + '~' + ticket.id, [], [], [], menuEntry);
        }
    });
    $('#ticket-reply-input-clear').click(function() {
        $('#ticket-reply-input').val('');
        //$('#ticket-reply-input-save').addClass('ui-disabled');
        $('#ticket-reply-reply-inline').removeClass('ui-disabled');
        answerInline = false;
    });
    $('#ticket-reply-show-question').click(function() {
        if ($('#ticket-reply-last-question').css('display') == 'none') {
            var lastMessageText = lzm_commonTools.htmlEntities(ticket.messages[messageNo].mt).replace(/\r\n/g,'\n').
                replace(/\r/g,'\n').replace(/\n +/g, '\n').replace(/\n+/g,'\n').replace(/\n/g, '<br>');
            $('#ticket-reply-last-question').html(lastMessageText).css({display: 'block'});
            $('#ticket-reply-show-question').html(t('Hide Question'));
        } else {
            $('#ticket-reply-last-question').html('').css({display: 'none'});
            $('#ticket-reply-show-question').html(t('Show Question'));
        }
    });
    $('#ticket-reply-reply-inline').click(function() {
        var lastMessageText = ticket.messages[messageNo].mt.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
            .replace(/\n +/g,'\n').replace(/\n+/g,'\n');
        lastMessageText = '> ' + lastMessageText.replace(/\n/g, '\n> ').replace(/\n/g, '\r\n');
        $('#ticket-reply-reply-inline').addClass('ui-disabled');
        //var existingText = $('#ticket-reply-input').val();
        //var newText = (existingText != '') ? existingText + '\r\n' + lastMessageText : lastMessageText
        //$('#ticket-reply-input').val(newText);
        insertAtCursor('ticket-reply-input', lastMessageText);
        answerInline = true;
    });

    $('#ticket-reply-signature').change(function() {
        $('#ticket-reply-signature-text').val($('#ticket-reply-signature').val());
    });
    $('#ticket-reply-preview').click(function() {
        var salutationValues = {
            'salutation': [$('#use-tr-greet').attr('checked') == 'checked', $('#tr-greet').val()],
            'title': [$('#use-tr-title').attr('checked') == 'checked', $('#tr-title').val()],
            'introduction phrase': [$('#use-tr-intro').attr('checked') == 'checked', $('#tr-intro').val()],
            'closing phrase': [$('#use-tr-close').attr('checked') == 'checked', $('#tr-close').val()],
            'first name': [$('#use-tr-firstname').attr('checked') == 'checked', $('#tr-firstname').val()],
            'last name': [$('#use-tr-lastname').attr('checked') == 'checked', $('#tr-lastname').val()],
            'punctuation mark': [true, $('#tr-punctuationmark').val()]
        };
        var replyText = $('#ticket-reply-input').val();
        var commentText = $('#new-message-comment').val();
        var signatureText =  $('#ticket-reply-signature-text').val();
        //console.log(salutationValues);
        var thisMessageNo = (!answerInline) ? messageNo : -1;
        var resources = $('#reply-placeholder-content-1').data('selected-resources');
        resources = (typeof resources != 'undefined') ? resources : [];
        thisClass.showMessageReplyPreview(ticket, thisMessageNo, replyText, signatureText, commentText, resources, salutationValues, selectedGroup, operatorObject, menuEntry, answerInline);
    });
};

ChatDisplayClass.prototype.updateAttachmentList = function() {
    var tableString = '';
    var resources1 = $('#reply-placeholder-content-1').data('selected-resources');
    var resources2 = $('#ticket-details-placeholder-content-1').data('selected-resources');
    var resources = (typeof resources1 != 'undefined') ? resources1 : (typeof resources2 != 'undefined') ? resources2 : [];

    for (var i=0; i<resources.length; i++) {
        tableString += '<tr id="attachment-line-' + i + '" class="attachment-line" style="cursor:pointer;"' +
            ' onclick="handleTicketAttachmentClick(' + i + ');">' +
            '<td style=\'background-image: url("img/622-paper_clip.png");' +
            ' background-repeat: no-repeat; background-position: center;\'></td><td' +
            ' style="color: #787878; text-decoration: underline; white-space: nowrap; cursor: pointer;">' +
            lzm_commonTools.htmlEntities(resources[i].ti) + '</td></tr>';
    }
    $('#attachment-table').children('tbody').html(tableString);

};

ChatDisplayClass.prototype.updateCommentList = function() {
    var tableString = '';
    var comments = $('#ticket-details-placeholder-content-2').data('comments');
    comments = (typeof comments != 'undefined') ? comments : [];
    for (var j=0; j<comments.length; j++) {
        var commentTime = lzm_chatTimeStamp.getLocalTimeObject(comments[j].timestamp);
        tableString += '<tr id="comment-line-' + j + '" class="comment-line" style="cursor:pointer;"' +
            ' onclick="handleTicketCommentClick(' + j + ', \'' + comments[j].text + '\');">' +
            '<td style=\'background-image: url("img/052-doc_user.png");' +
            ' background-repeat: no-repeat; background-position: center;\'></td>' +
            '<td>' + this.lzm_commonTools.getHumanDate(commentTime, '', this.userLanguage) + '</td>' +
            '<td>' + this.myName + '</td>' +
            '</tr>';
    }
    $('#comment-table').children('tbody').html(tableString);
};

ChatDisplayClass.prototype.showMessageReplyPreview = function(ticket, messageNo, message, signature, comment, attachments, salutation, group, operatorObject, menuEntry, answerInline) {
    menuEntry = (typeof menuEntry != 'undefined') ? menuEntry : '';
    var thisClass = this;
    var messageId = md5(Math.random().toString());
    var email = '', bcc = '', subject = '', i = 0;
    var subjObject = {}, defLanguage = 'EN';
    for (i=0; i<group.pm.length; i++) {
        subjObject[group.pm[i].lang] = group.pm[i].st;
        if (group.pm[i].def == 1) {
            defLanguage = group.pm[i].lang;
        }
    }
    subject = (typeof subjObject[ticket.l] != 'undefined') ? subjObject[ticket.l] : subjObject[defLanguage];
    subject = (subject.match(/%ticket_hash%/) != null) ? subject : subject + ' %ticket_hash%';
    subject = 'Re: ' + subject.replace(/%ticket_hash%/,'[' + ticket.h + ']').replace(/%website_name%/,lzm_chatServerEvaluation.siteName);
    var oldMessageText = (messageNo >= 0) ? ticket.messages[messageNo].mt.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n') : '';
    var oldMessageArray = oldMessageText.split('\r\n');
    var tmpMessageArray = [];
    for (i=0; i<oldMessageArray.length; i++) {
        if (oldMessageArray[i].match(/^>/) == null) {
            tmpMessageArray.push(oldMessageArray[i]);
        }
    }
    oldMessageText = tmpMessageArray.join('\r\n');
    oldMessageText = lzm_commonTools.htmlEntities(oldMessageText).replace(/\r\n/g,'\n').replace(/\r/g,'\n').
        replace(/\n +/g,'\n').replace(/\n+/g, '\n').replace(/\n/g, '\r\n');
    oldMessageText = '> ' + oldMessageText.replace(/\r\n/g, '\r\n> ');
    var trFields = ['salutation', 'title', 'first name', 'last name', 'punctuation mark', 'introduction phrase'];
    var replyText = '';
    for (i=0; i<trFields.length; i++) {
        if (salutation[trFields[i]][0]) {
            var lineBreak = ' ';
            if (trFields[i] == 'punctuation mark' || trFields[i] == 'introduction phrase' ||
                (trFields[i] == 'last name' && !salutation['punctuation mark'][0])) {
                lineBreak = '\n\n';
            } else if ((trFields[i] == 'first name' && !salutation['last name'][0]) || trFields[i] == 'first name' && salutation['last name'][1] == '' || trFields[i] == 'last name') {
                lineBreak = '';
            }
            replyText += salutation[trFields[i]][1] + lineBreak;
        }
    }
    replyText = replyText.replace(/ ,\r\n/, ',\r\n');
    replyText += message + '\r\n\r\n';
    if (salutation['closing phrase'][0]) {
        replyText += salutation['closing phrase'][1];
    }
    var myself = operatorObject[lzm_chatServerEvaluation.myId];
    var groupName = (typeof group.humanReadableDescription[ticket.l.toLowerCase()] != 'undefined') ?
        group.humanReadableDescription[ticket.l.toLowerCase()] :
        (typeof group.humanReadableDescription[lzm_chatServerEvaluation.defaultLanguage] != 'undefined') ?
        group.humanReadableDescription[lzm_chatServerEvaluation.defaultLanguage] : group.id;
    signature = signature.replace(/%operator_name%/g, myself.name).replace(/%operator_id%/g, myself.id).
        replace(/%operator_email%/g, myself.email).replace(/%group_id%/g, groupName);
    signature = signature.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/ +\n/, '\n').replace(/^\n+/, '');
    var completeMessage = replyText.replace(/^(\r\n)*/, '').replace(/(\r\n)*$/, '');
    completeMessage += (signature.indexOf('--') == 0) ? '\r\n\r\n\r\n' + signature : '\r\n\r\n\r\n--\r\n\r\n' + signature;
    if (!answerInline) {
        completeMessage += '\r\n\r\n\r\n' + oldMessageText;
    }
    var hashRegExp = new RegExp(RegExp.escape(ticket.h));
    if (completeMessage.match(hashRegExp) == null) {
        completeMessage += '\r\n\r\n[' + ticket.h + ']';
    }
    for (i=0; i<ticket.messages.length; i++) {
        if (ticket.messages[i].em != '') {
            var emArray = ticket.messages[i].em.split(',');
            email = emArray.splice(0,1);
            bcc = emArray.join(',').replace(/^ +/, '').replace(/ +$/, '');
        }
    }
    var myInputWidth = this.ticketMessageWidth - 10;
    var previewHtml = '<table style="width: 100%;"><tr>' +
        '<td id="ticket-reply-cell" colspan="9" style="border: 1px solid #ccc; border-radius: 4px; padding: 10px; background-color: #fff;">' +
        '<div style="margin: 0px; /*width: ' + this.ticketMessageWidth + 'px;*/">' +
        '<label for="ticket-reply-receiver" style="font-size: 12px;">' + t('Receiver:') + '</label><br />' +
        '<input type="text" id="ticket-reply-receiver" style="font-size: 12px; width: ' + myInputWidth + 'px; margin-bottom: 12px;"' +
        ' value="' + email + '" data-role="none" /><br />' +
        '<label for="ticket-reply-bcc" style="font-size: 12px;">' + t('BCC:') + '</label><br />' +
        '<input type="text" id="ticket-reply-bcc" style="font-size: 12px; width: ' + myInputWidth + 'px; margin-bottom: 12px;"' +
        ' value="' + bcc + '" data-role="none" /><br />' +
        '<label for="ticket-reply-subject" style="font-size: 12px;">' + t('Subject:') + '</label><br />' +
        '<input type="text" id="ticket-reply-subject" style="font-size: 12px; width: ' + myInputWidth + 'px; margin-bottom: 12px;"' +
        ' value="' + subject + '" data-role="none" /><br />' +
        '<label for="ticket-reply-text" style="font-size: 12px;">' + t('Email Body:') + '</label>' +
        '<div id="ticket-reply-text" class="ticket-reply-text" style="height: auto; margin-top: 5px; padding: 5px;' +
        ' border: 1px solid #ccc; overflow-x: hidden">' +
        thisClass.lzm_commonTools.htmlEntities(completeMessage).replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>') +
        '</div>';
    if (attachments.length > 0) {
        previewHtml += '<br /><label for="ticket-reply-files" style="font-size: 12px;">' + t('Files:') + '</label>' +
            '<div id="ticket-reply-files" class="ticket-reply-text" style="height: auto; margin-top: 5px; padding: 5px; border: 1px solid #ccc;">';
            for (var m=0; m<attachments.length; m++) {
                downloadUrl = getQrdDownloadUrl(attachments[m]);
                //console.log(downloadUrl);
                previewHtml += '<span style="margin-right: 10px;">' +
                    '<a href="#" onclick="downloadFile(\'' + downloadUrl + '\');" class="lz_chat_file">' + attachments[m].ti + '</a>' +
                    '</span>&#8203;'
            }
            previewHtml += '</div>';
    }
    previewHtml += '</div></td></tr></table>';
    var commentsHtml = '<fieldset id="preview-comment-text" data-role="none" class="lzm-fieldset">' +
        '<legend>' + t('Your Comment (will be visible to other operators but not to clients/website visitors)') + '</legend>' +
        '<textarea data-role="none" id="new-message-comment">' + comment + '</textarea>' +
        '</fieldset>';

    var footerString = lzm_displayHelper.createButton('ticket-reply-send', '', '', t('Save and send Email(s)'), '', 'lr',
        {'margin': '-5px 7px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer', float: 'left'}) +
        lzm_displayHelper.createButton('ticket-reply-cancel', '', '', t('Cancel'), '', 'lr',
            {'margin': '0px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div id="preview-placeholder" style="margin-top: 5px;"></div>';
    lzm_displayHelper.minimizeDialogWindow(thisClass.ticketDialogId[ticket.id] + '_reply', 'ticket-details',
        {'ticket-id': ticket.id, menu: menuEntry}, 'tickets', false);
    lzm_displayHelper.createDialogWindow(t('Preview'), bodyString, footerString, 'ticket-details', {}, {}, {}, {}, '',
        {'ticket-id': ticket.id, menu: menuEntry}, true, true, thisClass.ticketDialogId[ticket.id] + '_preview');
    lzm_displayHelper.createTabControl('preview-placeholder', [{name: t('Preview'), content: previewHtml},
        {name: t('Comment'), content: commentsHtml}], 0);
    $('.preview-placeholder-content').css({height: ($('#ticket-details-body').height() - 40) + 'px'});

    $('#preview-placeholder-tab-1').click(function() {
        lzm_displayLayout.resizeTicketReply();
    });

    $('#ticket-reply-cancel').click(function() {
        lzm_displayHelper.removeDialogWindow('ticket-details');
        lzm_displayHelper.maximizeDialogWindow(thisClass.ticketDialogId[ticket.id] + '_reply');
    });
    $('#ticket-reply-send').click(function() {
        var replyReceiver = $('#ticket-reply-receiver').val().replace(/^ */, '').replace(/ *$/, '');
        if (replyReceiver != '') {
        thisClass.lzm_commonTools.saveTicketSalutations(salutation, ticket.l.toLowerCase());
        var messageSubject = $('#ticket-reply-subject').val();
        completeMessage += '\n\n<!--lz_ref_link-->';
        sendTicketMessage(ticket, replyReceiver, $('#ticket-reply-bcc').val(), messageSubject, completeMessage,
            $('#new-message-comment').val(), attachments, messageId);
        lzm_displayHelper.removeDialogWindow('ticket-details');
        delete thisClass.StoredDialogs[thisClass.ticketDialogId[ticket.id] + '_reply'];
        delete thisClass.StoredDialogs[thisClass.ticketDialogId[ticket.id]];
        var tmpStoredDialogIds = [];
        for (var j=0; j<thisClass.StoredDialogIds.length; j++) {
            if (thisClass.ticketDialogId[ticket.id] != thisClass.StoredDialogIds[j] &&
                thisClass.ticketDialogId[ticket.id] + '_reply' != thisClass.StoredDialogIds[j]) {
                tmpStoredDialogIds.push(thisClass.StoredDialogIds[j])
            }
        }
        thisClass.StoredDialogIds = tmpStoredDialogIds;
        } else {
            alert(t('Please enter a valid email address.'));
        }
    });
};

ChatDisplayClass.prototype.showMessageForward = function(message, ticketId, ticketSender, group) {
    var thisClass = this;
    var menuEntry = t('Ticket (<!--ticket_id-->, <!--name-->)',[['<!--ticket_id-->', ticketId],['<!--name-->', ticketSender]]);
    var headerString = t('Send to');
    var footerString = lzm_displayHelper.createButton('send-forward-message', '','', t('Ok'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-forward-message', '','', t('Cancel'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});
    var bodyString = '<div style="margin-top: 5px;" id="message-forward-placeholder"></div>';
    var emailHtml = '<fieldset id="message-forward" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Email') + '</legend>' +
        '<div style="margin-bottom: 15px;"><label for="forward-email-addresses">' + t('Email addresses: (separate by comma)') + '</label><br />' +
        '<input type="text" data-role="none" id="forward-email-addresses" value="' + lzm_commonTools.htmlEntities(message.em) + '" /></div>' +
        '<div style="margin-bottom: 15px;"><label for="forward-subject">' + t('Subject:') + '</label><br />' +
        '<input type="text" data-role="none" id="forward-subject" value="' + lzm_commonTools.htmlEntities(message.s) + '"/></div>' +
        '<div><label for="forward-text">' + t('Email Body:') + '</label><br />' +
        '<textarea id="forward-text" data-role="none">' + lzm_commonTools.htmlEntities(message.mt) + '</textarea></div>'
    if (message.attachment.length > 0) {
        emailHtml += '<br /><label for="ticket-reply-files" style="font-size: 12px;">' + t('Files:') + '</label>' +
            '<div id="forward-files" class="ticket-reply-text" style="height: auto; margin-top: 5px; padding: 5px; border: 1px solid #ccc;">';
        for (var m=0; m<message.attachment.length; m++) {
            var attachment = {ti: message.attachment[m].n, rid: message.attachment[m].id}
            //console.log(attachment);
            var downloadUrl = getQrdDownloadUrl(attachment);
            emailHtml += '<span style="margin-right: 10px;">' +
                '<a href="#" onclick="downloadFile(\'' + downloadUrl + '\');" class="lz_chat_file">' + attachment.ti + '</a>' +
                '</span>&#8203;'
        }
        emailHtml += '</div>';
    }
    emailHtml += '</fieldset>';

    var dialogData = {'ticket-id': ticketId, menu: menuEntry};
    var ticketDialogId = thisClass.ticketDialogId[ticketId];
    lzm_displayHelper.minimizeDialogWindow(ticketDialogId, 'ticket-details', dialogData, 'tickets', false);
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'ticket-details', {}, {}, {}, {}, '',
        dialogData, true, true, ticketDialogId + '_forward');
    lzm_displayHelper.createTabControl('message-forward-placeholder', [{name: t('Email'), content: emailHtml}]);
    lzm_displayLayout.resizeMessageForwardDialog();

    $('#cancel-forward-message').click(function() {
        lzm_displayHelper.removeDialogWindow('ticket-details');
        lzm_displayHelper.maximizeDialogWindow(ticketDialogId);
    });
    $('#send-forward-message').click(function() {
        sendForwardedMessage(message, $('#forward-text').val(), $('#forward-email-addresses').val(), $('#forward-subject').val(), ticketId, group);
        $('#cancel-forward-message').click();
    });
};

ChatDisplayClass.prototype.addMessageComment = function(ticketId, message, menuEntry) {
    var thisClass = this;
    var dialogId = '', windowId = '';
    if (typeof ticketId != 'undefined') {
        dialogId = thisClass.ticketDialogId[ticketId];
        windowId = 'ticket-details';
    } else if (typeof $('#ticket-details-body').data('dialog-id') != 'undefined') {
        dialogId = $('#ticket-details-body').data('dialog-id');
        windowId = 'ticket-details';
    } else {
        dialogId = $('#email-list-body').data('dialog-id');
        windowId = 'email-list';
    }
    //console.log(typeof ticketId, dialogId);
    var headerString = t('Add Comment');
    var footerString = lzm_displayHelper.createButton('comment-cancel', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'float': 'right', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('comment-save', '', '', t('Ok'), '', 'lr',
        {'margin-left': '6px', 'margin-top': '-2px', 'padding-left': '12px', 'padding-right': '12px', 'float': 'right', 'cursor': 'pointer'});
    var bodyString = '<fieldset id="comment-text" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Your Comment (will be visible to other operators but not to clients/website visitors)') + '</legend>' +
        '<textarea id="comment-input" data-role="none"></textarea>' +
        '</fieldset>';

    lzm_displayHelper.minimizeDialogWindow(dialogId, windowId,
        {'ticket-id': ticketId, menu: menuEntry}, 'tickets', false);
    lzm_displayHelper.createDialogWindow(headerString,bodyString, footerString, windowId, {}, {}, {}, {}, '',
        {'ticket-id': ticketId, menu: menuEntry}, true, true, dialogId + '_comment');
    $('#comment-text').css({'min-height': ($('#' + windowId + '-body').height() - 22) + 'px'});

    var inputHeight = Math.max(140, $('#' + windowId + '-body').height() - 44);
    $('#comment-input').css({
        border: '1px solid #ccc',
        'border-radius': '4px',
        width: ($('#' + windowId + '-body').width() - 28)+'px',
        height: inputHeight + 'px'
    });

    $('#comment-cancel').click(function() {
        lzm_displayHelper.removeDialogWindow(windowId);
        lzm_displayHelper.maximizeDialogWindow(dialogId);
    });
    $('#comment-save').click(function() {
        var commentText = $('#comment-input').val();
        $('#comment-cancel').click();
        if (typeof ticketId != 'undefined' && typeof message.id != 'undefined') {
            lzm_chatUserActions.saveTicketComment(ticketId, message.id, commentText);
        } else {
            var comments = $('#ticket-details-placeholder-content-2').data('comments');
            comments = (typeof comments != 'undefined') ? comments : [];
            comments.push({text: commentText, timestamp: lzm_chatTimeStamp.getServerTimeString(null, false, 1)});
            $('#ticket-details-placeholder-content-2').data('comments', comments);
            thisClass.updateCommentList();
        }
    });
};

ChatDisplayClass.prototype.showEmailList = function() {
    var thisClass = this;
    thisClass.emailDeletedArray = [];
    thisClass.ticketsFromEmails = [];
    thisClass.lzm_commonTools.clearEmailReadStatusArray();

    var headerString = t('Emails');
    var footerString = lzm_displayHelper.createButton('save-email-list', '','', t('Ok'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-email-list', '','', t('Cancel'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('delete-email', '','', t('Delete (Del)'), 'img/201-delete2.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer', float:'left', 'margin-top': '-4px'}) +
        lzm_displayHelper.createButton('create-ticket-from-email', '','', t('Create Ticket'), 'img/023-email6.png', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer', float:'left', 'margin-top': '-4px'}) +
        lzm_displayHelper.createButton('reset-emails', 'ui-disabled','', t('Reset'), '', 'lr',
            {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer', float:'left', 'margin-top': '-4px'});
    //var bodyString = '<div id="open-emails" style="height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 4px; border-radius: 4px;">' +
    var bodyString = '<div id="open-emails" style="margin-top: 5px;">' +
        '<div id="email-list-placeholder"></div></div>' +
        //'<div id="email-details" style="border: 1px solid #ccc; border-radius: 4px; padding: 10px; margin-top: 5px;' +
        '<div id="email-details" style="margin-top: 10px;">' +
        '<div id="email-placeholder" data-selected-email="0"></div>' +
        '</div>';
    var emailLoadingDiv = '<div id="email-list-loading"></div>';
    var dialogData = {};
    var dialogId = lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'email-list', {}, {}, {}, {}, '', dialogData, true, true);

    var emailContentHtml = '<fieldset id="email-content" class="lzm-fieldset"><legend>' + t('Content') + '</legend></fieldset>';
    var emailAttachmentHtml = '<fieldset id="email-attachment-list" class="lzm-fieldset"><legend>' + t('Attachments') + '</legend></fieldset>';

    lzm_displayHelper.createTabControl('email-placeholder', [{name: t('Content'), content: emailContentHtml}, {name: t('Attachments'), content: emailAttachmentHtml}]);
    lzm_displayHelper.createTabControl('email-list-placeholder', [{name: t('Incoming Emails'), content: emailLoadingDiv}]);

    var myHeight = $('#email-list-body').height() + 10;
    var listHeight = Math.floor(Math.max(myHeight / 2, 175) - 45);
    var contentHeight = (myHeight - listHeight) - 93;
    $('.email-list-placeholder-content').css({height: listHeight + 'px'});
    $('.email-placeholder-content').css({height: contentHeight + 'px'});
    $('#email-list-loading').css({height: listHeight + 'px', 'z-index': 1000000,
        'background-color': '#ffffff', 'background-image': 'url("../images/chat_loading.gif")', 'background-repeat': 'no-repeat',
        'background-position': 'center'});
    var emailDetailsHeight = $('.email-placeholder-content').height();
    $('#email-content').css({'min-height': (emailDetailsHeight - 22) + 'px'});
    $('#email-attachment-list').css({'min-height': (emailDetailsHeight - 22) + 'px'});


    $('#cancel-email-list').click(function() {
        thisClass.emailDeletedArray = [];
        thisClass.ticketsFromEmails = [];
        toggleEmailList();
        lzm_displayHelper.removeDialogWindow('email-list');
    });
    $('#save-email-list').click(function() {
        saveEmailListChanges('', false);
        $('#cancel-email-list').click();
    });
    $('#delete-email').click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'delete_emails', {})) {
            deleteEmail();
        } else {
            showNoPermissionMessage();
        }
    });
    $('#create-ticket-from-email').click(function() {
        if (lzm_commonPermissions.checkUserPermissions('', 'tickets', 'create_tickets', {})) {
            var emailId = $('#email-placeholder').data('selected-email-id');
            var emailNo = $('#email-placeholder').data('selected-email');
            $('#reset-emails').removeClass('ui-disabled');
            $('#delete-email').addClass('ui-disabled');
            $('#create-ticket-from-email').addClass('ui-disabled');
            $('#email-list-line-' + emailNo).children('td:first').css('background-image', 'url(\'img/203-add.png\')');
            thisClass.emailsToTickets.push(emailId);
            saveEmailListChanges(emailId, true);
            showTicketDetails('', false, $('#email-placeholder').data('selected-email-id'), '', dialogId);
        } else {
            showNoPermissionMessage();
        }
    });
    $('#reset-emails').click(function() {
        var emailNo = $('#email-placeholder').data('selected-email');
        var emailId = $('#email-placeholder').data('selected-email-id');
        thisClass.lzm_commonTools.removeEmailFromDeleted(emailId);
        thisClass.lzm_commonTools.removeEmailFromTicketCreation(emailId);
        $('#email-list-line-' + emailNo).children('td:first').css('background-image', 'url(\'img/024-email.png\')');
        $('#reset-emails').addClass('ui-disabled');
        $('#delete-email').removeClass('ui-disabled');
        $('#create-ticket-from-email').removeClass('ui-disabled');
        if (thisClass.lzm_commonTools.checkEmailIsLockedBy(emailId, thisClass.myId)) {
            saveEmailListChanges(emailId, false);
        }
    });
};

ChatDisplayClass.prototype.updateEmailList = function(emails, groups) {
    //console.log('Updating Email list');
    var thisClass = this;
    var i, groupObject = {};
    var selectedLine = $('#email-placeholder').data('selected-email');
    $('#email-placeholder').data('selected-email-id', emails[selectedLine].id);
    if (thisClass.lzm_commonTools.checkEmailReadStatus($('#email-placeholder').data('selected-email-id')) == -1 &&
        lzm_chatTimeStamp.getServerTimeString(null, true) - emails[selectedLine].c <= 1209600) {
        thisClass.emailReadArray.push({id: emails[selectedLine].id, c: emails[selectedLine].c});
    }
    for (i=0; i<groups.length; i++) {
        groupObject[groups[i].id] = groups[i];
    }
    var emailListHtml = '<fieldset id="incoming-email-list" class="lzm-fieldset" data-role="none">' +
        '<legend>' + t('Incoming Emails') + '</legend>' +
        '<table id="incoming-email-table" class="visitor-list-table alternating-rows-table lzm-unselectable" style="width: 100%;"><thead><tr>' +
        '<th style="width: 18px !important;"></th>' +
        '<th style="width: 18px !important;"></th>' +
        '<th>' + t('Date') + '</th>' +
        '<th>' + t('Subject') + '</th>' +
        '<th>' + t('Email') + '</th>' +
        '<th>' + t('Name') + '</th>' +
        '<th>' + t('Group') + '</th>' +
        '<th>' + t('Sent to') + '</th>' +
        '</tr></thead><tbody>';
    for (i=0; i<emails.length; i++) {
        emailListHtml += lzm_displayHelper.createEmailListLine(emails[i], i, groupObject[emails[i].g]);
    }
    emailListHtml += '</tbody>';
    if (lzm_chatServerEvaluation.emailCount > lzm_chatPollServer.emailAmount) {
        emailListHtml += '<tfoot><tr>' +
            '<td colspan="8" id="emails-load-more">' + t('Load more emails') + '</td>' +
            '</tr></tfoot>';
    }
    emailListHtml += '</table>' +
        '</fieldset>';
    var emailText = this.lzm_commonTools.htmlEntities(emails[selectedLine].text).
        replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>');
    var contentHtml = '<legend>' + t('Content') + '</legend>' +
        '<div id="email-subject">' + this.lzm_commonTools.htmlEntities(emails[selectedLine].s) + '</div>' +
        '<div id="email-text" style="margin-top: 10px;">' + emailText + '</div>';
    var attachmentHtml = '<legend>' + t('Attachments') + '</legend>' +
        lzm_displayHelper.createTicketAttachmentTable({}, emails[selectedLine], -1, false);
    $('#email-content').html(contentHtml);
    $('#email-attachment-list').html(attachmentHtml);

    $('#email-list-loading').remove();
    $('#email-list-placeholder-content-0').html(emailListHtml);

    var emailListHeight = $('.email-list-placeholder-content').height();
    $('#incoming-email-list').css({'min-height': (emailListHeight - 22) + 'px'});
    $('#email-text').css({'min-height': ($('.email-placeholder-content').height() - 95) + 'px'});

    if (emails[selectedLine].ei != '' && emails[selectedLine].ei != thisClass.myId) {
        $('#reset-emails').addClass('ui-disabled');
        $('#delete-email').addClass('ui-disabled');
        $('#create-ticket-from-email').addClass('ui-disabled');
    } else if (emails[selectedLine].ei != '' && emails[selectedLine].ei == thisClass.myId) {
        $('#reset-emails').removeClass('ui-disabled');
    }

    $('.email-list-line').click(function() {
        var oldSelectedLine = selectedLine;
        var emailId = emails[selectedLine].id;
        $('.email-list-line').removeClass('selected-table-line');
        //$('.email-list-line').removeClass('locked-email-line');
        if (emails[oldSelectedLine].ei != '') {
            if (thisClass.lzm_commonTools.checkEmailTicketCreation(emailId) == -1 && $.inArray(emailId, thisClass.emailDeletedArray) == -1) {
                $('#email-list-line-' + oldSelectedLine).children('td:first').css('background-image', 'url(\'img/614-lock.png\')');
            }
            $('#email-list-line-' + oldSelectedLine).addClass('locked-email-line');
        }
        selectedLine = $(this).data('line-number');
        emailId = emails[selectedLine].id;
        $('#email-list-line-' + selectedLine).removeClass('locked-email-line');
        $('#email-list-line-' + selectedLine).addClass('selected-table-line');
        $('#email-placeholder').data('selected-email', selectedLine);
        $('#email-placeholder').data('selected-email-id', emailId);
        var emailText = thisClass.lzm_commonTools.htmlEntities(emails[selectedLine].text).
            replace(/\r\n/g, '<br>').replace(/\r/g, '<br>').replace(/\n/g, '<br>');
        var contentHtml = '<legend>' + t('Content') + '</legend>' +
            '<div id="email-subject">' + thisClass.lzm_commonTools.htmlEntities(emails[selectedLine].s) + '</div>' +
            '<div id="email-text" style="margin-top: 10px;">' + emailText + '</div>';
        var attachmentHtml = '<legend>' + t('Attachments') + '</legend>' +
            lzm_displayHelper.createTicketAttachmentTable({}, emails[selectedLine], -1, false);
        $('#email-content').html(contentHtml);
        $('#email-attachment-list').html(attachmentHtml);
        $('#email-text').css({'min-height': ($('.email-placeholder-content').height() - 83) + 'px'});
        if (thisClass.lzm_commonTools.checkEmailReadStatus(emails[selectedLine].id) == -1 &&
            lzm_chatTimeStamp.getServerTimeString(null, true) - emails[selectedLine].c <= 1209600) {
            thisClass.emailReadArray.push({id: emails[selectedLine].id, c: emails[selectedLine].c});
            if (emails[selectedLine].ei != '') {
                if (thisClass.lzm_commonTools.checkEmailTicketCreation(emailId) == -1 && $.inArray(emailId, thisClass.emailDeletedArray) == -1) {
                    $('#email-list-line-' + selectedLine).children('td:first').css('background-image', 'url(\'img/614-lock.png\')');
                }
            } else {
                $('#email-list-line-' + selectedLine).children('td:first').css('background-image', 'url(\'img/024-email.png\')');
            }
            $('#email-list-line-' + selectedLine).children('td').css('font-weight', 'normal');
        }

        if (emails[selectedLine].ei != '' && emails[selectedLine].ei != thisClass.myId) {
            $('#reset-emails').addClass('ui-disabled');
            $('#delete-email').addClass('ui-disabled');
            $('#create-ticket-from-email').addClass('ui-disabled');
        } else {
            if (thisClass.lzm_commonTools.checkEmailTicketCreation(emailId) != -1 || $.inArray(emailId, thisClass.emailDeletedArray) != -1) {
                $('#reset-emails').removeClass('ui-disabled');
                $('#delete-email').addClass('ui-disabled');
                $('#create-ticket-from-email').addClass('ui-disabled');
            } else if (emails[selectedLine].ei != '' && emails[selectedLine].ei == thisClass.myId) {
                $('#reset-emails').removeClass('ui-disabled');
                $('#delete-email').removeClass('ui-disabled');
                $('#create-ticket-from-email').removeClass('ui-disabled');
            } else {
                $('#reset-emails').addClass('ui-disabled');
                $('#delete-email').removeClass('ui-disabled');
                $('#create-ticket-from-email').removeClass('ui-disabled');
            }
        }
    });
    $('#emails-load-more').click(function() {
        lzm_chatPollServer.emailAmount += 20;
        lzm_chatPollServer.emailUpdateTimestamp = 0;
        $('#incoming-email-table').children('tfoot').remove();
    });
};

/***********************************************************************************************************************************************************************/

ChatDisplayClass.prototype.createArchive = function(chatArchive, operators, groups) {
    var thisClass = this;
    $('#archive-headline').html('<h3>' + t('Chat Archive') + '</h3>');
    $('#archive-headline2').html(lzm_displayHelper.createArchiveHeaderControls(lzm_chatPollServer.chatArchivePage, chatArchive.q, chatArchive.p, chatArchive.t,
        lzm_chatPollServer.chatArchiveFilter, lzm_chatPollServer.chatArchiveQuery)).trigger('create');
    $('#archive-body').html(lzm_displayHelper.createArchiveHtml(chatArchive.chats, operators, groups));
    $('#archive-footline').html(lzm_displayHelper.createArchivePagingHtml(lzm_chatPollServer.chatArchivePage, chatArchive.q, chatArchive.p));
    if (lzm_chatPollServer.chatArchiveQuery != '') {
        thisClass.styleArchiveClearBtn();
    }

    $('#search-archive').keyup(function(e) {
        thisClass.searchButtonUp('archive', chatArchive.chats, e);
    });
    $('#clear-archive-search').click(function() {
        $('#search-archive').val('');
        $('#search-archive').keyup();
    });
};

ChatDisplayClass.prototype.updateArchive = function(chatArchive, operators, groups) {
    if ($('#matching-chats-inner').length == 0) {
        $('#archive-body').html(lzm_displayHelper.createArchiveHtml(chatArchive.chats, operators, groups));
        $('#archive-footline').html(lzm_displayHelper.createArchivePagingHtml(lzm_chatPollServer.chatArchivePage, chatArchive.q, chatArchive.p));
    } else {
        var selectedChatId = $('#matching-chats-table').data('selected-chat-id');
        selectedChatId = (selectedChatId != '') ? selectedChatId : (chatArchive.chats.length > 0) ? chatArchive.chats[0].cid : '';
        $('#matching-chats-inner').html('<legend>' + t('Chats') + '</legend>' +
            lzm_displayHelper.createArchiveHtml(chatArchive.chats, operators, groups, selectedChatId, true));
        selectArchivedChat(selectedChatId);
    }
};

ChatDisplayClass.prototype.styleArchiveClearBtn = function() {
    var ctsBtnWidth = $('#clear-archive-search').width();
    var ctsBtnHeight =  $('#clear-archive-search').height();
    var ctsBtnPadding = Math.floor((18-ctsBtnHeight)/2)+'px ' +  Math.floor((18-ctsBtnWidth)/2)+'px ' + Math.ceil((18-ctsBtnHeight)/2)+'px ' +  Math.ceil((18-ctsBtnWidth)/2)+'px';
    $('#clear-archive-search').css({padding: ctsBtnPadding});
};

ChatDisplayClass.prototype.showArchivedChat = function(chats, cpId, cpName, chatId, chatType, operators, groups) {
    var thisClass = this;
    var menuEntry = t('Matching Chats: <!--cp_name-->', [['<!--cp_name-->', cpName]]);
    var headerString = t('Matching Chats');
    var footerString = lzm_displayHelper.createButton('cancel-matching-chats', '', '', t('Close'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});;
    var bodyString = '<div style="margin-top: 5px;" id="matching-chats-placeholder"></div>';
    var tableString = lzm_displayHelper.createMatchingChats(operators, groups, chatId) +
    '<fieldset style="margin-top: 5px;" class="lzm-fieldset" data-role="none" id="chat-content-inner"><legend>' + t('Text') + '</legend></fieldset>';
    var dialogData = {'cp-id': cpId, 'cp-name': cpName, 'chat-type': chatType, menu: menuEntry, reload: ['chats']};
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'matching-chats', {}, {}, {}, {}, '',
        dialogData, true, true);
    lzm_displayHelper.createTabControl('matching-chats-placeholder', [{name: headerString, content: tableString}]);
    lzm_displayLayout.resizeArchivedChat();

    $('#cancel-matching-chats').click(function() {
        lzm_chatPollServer.stopPolling();
        var archiveFetchTime = lzm_chatServerEvaluation.archiveFetchTime;
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
        lzm_chatPollServer.chatArchiveFilterGroup = '';
        lzm_chatPollServer.chatArchiveFilterInternal = '';
        lzm_chatPollServer.chatArchiveFilterExternal = '';
        lzm_chatPollServer.chatUpdateTimestamp = 0;
        lzm_chatPollServer.addPropertyToDataObject('p_gl_a', 'N');
        lzm_chatPollServer.startPolling();
        lzm_displayHelper.removeDialogWindow('matching-chats');
    })
};


/***********************************************************************************************************************************************************************/

ChatDisplayClass.prototype.showVisitorInvitation = function(aVisitor) {
    //console.log(aVisitor);
    var thisClass = this;
    if(!this.isApp && !this.isMobile) {
        messageEditor = new ChatEditorClass('invitation-text', this.isMobile,this.isApp, this.isWeb);
    }

    var text = '';
    var footerString = lzm_displayHelper.createButton('send-invitation', 'ui-disabled', '', t('Ok'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'}) +
        lzm_displayHelper.createButton('cancel-invitation', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});

    var dialogData = {
        editors: [{id: 'invitation-text', instanceName: 'messageEditor'}], 'visitor-id': aVisitor.id};
    lzm_displayHelper.createDialogWindow(t('Chat Invitation'), lzm_displayHelper.createVisitorInvitation(aVisitor), footerString, 'chat-invitation',
        {}, {}, {}, {}, '', dialogData);
    var invTextHeight = Math.max((this.dialogWindowHeight - 235), 100);
    var textWidth = this.dialogWindowWidth - 39;
    if (lzm_displayHelper.checkIfScrollbarVisible('chat-invitation-body')) {
        textWidth -= lzm_displayHelper.getScrollBarWidth();
    }

    var thisInvitationTextCss = {width: textWidth+'px', height:  invTextHeight+'px'};
    var thisInvitationTextInnerCss = {width: textWidth+'px', height:  (invTextHeight - 20)+'px', border: '1px solid #ccc',
        'background-color': '#f5f5f5'};
    var thisTextInputCss = {width: textWidth+'px', height: (invTextHeight - 20)+'px',
        'box-shadow': 'none', 'border-radius': '0px', padding: '0px', margin: '0px', border: '1px solid #ccc'};
    var thisTextInputControlsCss;
    if (!thisClass.isMobile && !thisClass.isApp) {
        thisTextInputControlsCss = {width: textWidth+'px', height: '15px','box-shadow': 'none', 'border-radius': '0px',
            padding: '0px', margin: '7px 0px', 'text-align': 'left'};
    } else {
        thisTextInputControlsCss = {display: 'none'};
    }
    var thisTextInputBodyCss = {width: textWidth+'px', height: (invTextHeight - 50)+'px','box-shadow': 'none',
        'border-radius': '0px', padding: '0px', margin: '0px', 'background-color': '#ffffff', 'overflow-y': 'hidden',
        'border-top': '1px solid #ccc'};

    $('#user-invite-form').css({'min-height': ($('#chat-invitation-body').height() - 22) + 'px'});
    $('#invitation-text-div').css(thisInvitationTextCss);
    $('#invitation-text-inner').css(thisInvitationTextInnerCss);
    $('#invitation-text').css(thisTextInputCss);
    $('#invitation-text-controls').css(thisTextInputControlsCss);
    if (!thisClass.isMobile && !thisClass.isApp) {
        $('#invitation-text-body').css(thisTextInputBodyCss);
    }
    var langSelWidth = $('#language-selection').parent().width();
    var groupSelWidth = $('#group-selection').parent().width();
    var browserSelWidth = $('#browser-selection').parent().width();
    $('#language-selection').css({width: langSelWidth + 'px'});
    $('#group-selection').css({width: groupSelWidth + 'px'});
    $('#browser-selection').css({width: browserSelWidth + 'px'});

    text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', $('#language-selection').val().split('---')[0])['invm'];
    if (!this.isMobile && !this.isApp) {
        messageEditor.init(text, 'showVisitorInvitation');
    } else {
        $('#invitation-text').html(text);
    }

    $('#language-selection').change(function() {
        var selLanguage = $('#language-selection').val().split('---')[0];
        var selGroup = '';
        if ($('#language-selection').val().split('---')[1] == 'group') {
            selGroup = $('#group-selection').val();
        }
        text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', selLanguage, selGroup)['invm'];
        if (!thisClass.isMobile && !thisClass.isApp) {
            messageEditor.setHtml(text);
        } else {
            $('#invitation-text').html(text);
        }
    });

    $('#group-selection').change(function() {
        var selLanguage = $('#language-selection').val().split('---')[0];
        var selGroup = '';
        if ($('#language-selection').val().split('---')[1] == 'group') {
            selGroup = $('#group-selection').val();
        }
        text = lzm_chatUserActions.getChatPM(aVisitor.id, $('#browser-selection').val(), 'invm', selLanguage, selGroup)['invm'];
        if (!thisClass.isMobile && !thisClass.isApp) {
            messageEditor.setHtml(text);
        } else {
            $('#invitation-text').html(text);
        }
    });

    if ($('#browser-selection').val() != -1) {
        $('#send-invitation').removeClass('ui-disabled');
    }
    $('#browser-selection').change(function() {
        if ($('#browser-selection').val() != -1) {
            $('#send-invitation').removeClass('ui-disabled');
        }
    });

    $('#withdraw-invitation').click(function() {
        if (!thisClass.isMobile && !thisClass.isApp) {
            delete messageEditor;
        }
        cancelInvitation(aVisitor.id);
        lzm_displayHelper.removeDialogWindow('chat-invitation');

    });
    $('#cancel-invitation').click(function() {
        if (!thisClass.isMobile && !thisClass.isApp) {
            delete messageEditor;
        }
        lzm_displayHelper.removeDialogWindow('chat-invitation');
        //$('#chat-invitation-container').remove();
    });
    $('#send-invitation').click(function() {
        if (!thisClass.isMobile && !thisClass.isApp) {
            text = messageEditor.grabHtml();
            delete messageEditor;
        } else {
            text = $('#invitation-text').val()
        }
        //console.log(text);
        inviteExternalUser(aVisitor.id, $('#browser-selection').val(), text);
        lzm_displayHelper.removeDialogWindow('chat-invitation');
        //$('#chat-invitation-container').remove();
    });
};

ChatDisplayClass.prototype.createViewSelectPanel = function(target) {
    var viewSelectPanel = lzm_displayHelper.createViewSelectPanel(target);
    $('#new-view-select-panel').html(viewSelectPanel.html);
};

/**
 * Create the user settings view
 */
ChatDisplayClass.prototype.createUsersettingsManagement = function() {
    var thisClass = this;
    this.showUsersettingsHtml = false;
    this.showMinifiedDialogsHtml = false;
    $('#usersettings-menu').css({'display': 'none'});
    $('#minified-dialogs-menu').css('display', 'none');

    var chatPage = $('#chat_page');
    var chatPageWidth = chatPage.width();
    var thisWidth = Math.min(Math.floor(0.95 * (chatPageWidth - 30)), 600);

    var headerString = t('Client configuration');
    var bodyString = '<div id="settings-container" style="margin-top: 5px;">' +
        '<div id="settings-placeholder"></div></div>';

    var settingsTabList = lzm_displayHelper.createSettingsHtml();
    var footerString = lzm_displayHelper.createButton('save-usersettings', '', '', t('Ok'), '', 'lr',
        {'margin-left': '4px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'})  +
        lzm_displayHelper.createButton('cancel-usersettings', '', '', t('Cancel'), '', 'lr',
        {'margin-left': '6px', 'padding-left': '12px', 'padding-right': '12px', 'cursor': 'pointer'});

    var dialogData = {};
    if (this.selected_view == 'mychats' && this.active_chat_reco != '') {
        var thisChatPartner = lzm_displayHelper.getChatPartner(this.active_chat_reco, lzm_chatServerEvaluation.external_users,
            lzm_chatServerEvaluation.internal_users, lzm_chatServerEvaluation.internal_departments);
        dialogData = {'chat-partner': this.active_chat_reco, 'chat-partner-name': thisChatPartner['name'],
            'chat-partner-userid': thisChatPartner['userid']};
    }
    dialogData['no-selected-view'] = true;
    lzm_displayHelper.createDialogWindow(headerString, bodyString, footerString, 'user-settings-dialog', {}, {}, {}, {}, '', dialogData, true, false);
    lzm_displayHelper.createTabControl('settings-placeholder', settingsTabList);
    lzm_displayLayout.resizeOptions();

    $('#background-mode').change(function() {
        if ($('#background-mode').attr('checked') == 'checked') {
            $('#save-connections-div').removeClass('ui-disabled');
        } else {
            $('#save-connections-div').addClass('ui-disabled');
            if ($('#save-connections').attr('checked') == 'checked') {
                $('#save-connections').click();
            }
        }
    });

    $('#save-usersettings').click(function () {
        saveUserSettings();
        //thisUsersettingsContainer.css({display: 'none'});
        lzm_displayHelper.removeDialogWindow('user-settings-dialog');
    });
    $('#cancel-usersettings').click(function() {
        //$('#user-settings-dialog-container').remove();
        lzm_displayHelper.removeDialogWindow('user-settings-dialog');
    })
};

ChatDisplayClass.prototype.togglePositionChangeButtons = function(viewId) {
    $('.position-change-buttons').css({'display': 'none'});
    $('#position-change-buttons-' + viewId).css({'display': 'block'});
    var posBtnWidth = 0, posBtnHeight = 0;
    $('.position-change-buttons-up').each(function() {
        posBtnWidth = Math.max(posBtnWidth, $(this).width());
        posBtnHeight = Math.max(posBtnHeight, $(this).height());
    });
    var positionButtonPadding = Math.floor((18 - posBtnHeight) / 2) + 'px ' +
        Math.ceil((18 - posBtnWidth) / 2) + 'px ' +
        Math.ceil((18 - posBtnHeight) / 2) + 'px ' +
        Math.floor((18 - posBtnWidth) / 2) + 'px';
    $('.position-change-buttons-up').css('padding', positionButtonPadding);
    $('.position-change-buttons-down').css('padding', positionButtonPadding);
};

ChatDisplayClass.prototype.createTranslationManagement = function (availableLanguages, browserLanguage) {
    this.showUsersettingsHtml = false;
    $('#usersettings-menu').css({'display': 'none'});
    $('#usersettings-container').css({'display': 'none'});

    if (this.editThisTranslation == '') {
        var thisTranslationContainer = $('#translation-container');

        var translationManagementHtml = '<div id="translation-container-headline"><h3>' + t('Translation management') + '</h3></div>' +
            '<div id="translation-container-headline2"></div>' +
            '<a href="#" data-role="button" data-icon="delete" data-iconpos="notext" onclick="finishSettingsDialogue()" ' +
            'id="close-translation-management">' + t('Leave') + '</a>' +
            '<p style="height: 48px;margin: 0px; padding: 0px;">&nbsp;</p>' +
            '<p>' + t('You can add missing translations or change already existing translations here.') + '</p>' +
            '<p>' + t('Please select one of the existing languages from the list below or enter a new one, if your language does not already exist.') +
            '<br>' + t('The translation names must comply with the 2 letter language codes, as defined in <!--iso_639_1-->',
                [
                    ['<!--iso_639_1-->', '<a href="http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes" target="_blank">ISO 639-1</a>']
                ]) + '</p>' +
            '<p>' + t('According to your browser, your language is set to <!--browser_language_setting-->',
                [['<!--browser_language_setting-->', '"' + browserLanguage+ '"']]) + '</p>';
        if (availableLanguages.length > 0) {
            translationManagementHtml += '<select id="existing-language">' +
                '<option value="">-- ' + t('Select a language') + ' --</option>';
            for (var langIndex = 0; langIndex < availableLanguages.length; langIndex++) {
                translationManagementHtml += '<option value="' + availableLanguages[langIndex] + '">' +
                    availableLanguages[langIndex] +
                    '</option>';
            }
            translationManagementHtml += '</select>'
        }
        translationManagementHtml += '<input type="text" id="new-language" placeholder="' +
            t('Enter new language name') + '" />' +
            '<a href="#" data-role="button" id="edit-translations" onclick="editTranslations();">' + t('Edit translations') + '</a>';


        thisTranslationContainer.html(translationManagementHtml).trigger('create');
        var thisCloseButton = $('#close-translation-management');
        thisCloseButton.css({position: 'absolute', left: (thisTranslationContainer.width() - thisCloseButton.width() - 5) + 'px', top: '5px'});
        thisTranslationContainer.css({display: 'block'});
        $('#translation-container-headline').css(this.TranslationContainerHeadlineCss);
        $('#translation-container-headline2').css(this.TranslationContainerHeadline2Css);

        $('#existing-language').change(function() {
            if ($('#existing-language').val() != '') {
                $('#new-language').css({display: 'none'});
                $('#new-language').val('');
            } else {
                $('#new-language').css({display: 'block'});
            }
        });

        thisCloseButton.click(function () {
            thisTranslationContainer.css({display: 'none'});
        });
    } else {
        this.editTranslations();
    }
};

ChatDisplayClass.prototype.editTranslations = function (languageToEdit, translationsArray, browserLanguage) {
    var numberOfStrings = 0;
    var thisTranslationContainer = $('#translation-container');
    if (this.editThisTranslation != '') {
        thisTranslationContainer.css({display: 'block'});
    } else {
        this.editThisTranslation = languageToEdit;
        var htmlComment = t('<!--beginn_comment-->comment<!--end_comment-->',
            [['<!--beginn_comment-->','&lt;!--'],['<!--end_comment-->','--&gt;']]);
        var translationManagementHtml = '<div id="translation-container-headline"><h3>' + t('Translation management') + '</h3></div>' +
            '<div id="translation-container-headline2"></div>' +
            '<a href="#" data-role="button" data-icon="delete" data-iconpos="notext" onclick="finishSettingsDialogue()" ' +
            'id="close-translation-management">' + t('Leave') + '</a>' +
            '<p style="height: 48px;margin: 0px; padding: 0px;">&nbsp;</p>' +
            '<p>' + t('Below you will find a list of the original English strings and the translations in the chosen language <!--chosen_language-->.',
                [['<!--chosen_language-->', '"' + browserLanguage + '"']]) +
            '<br>' + t('The latter can be edited by you.') +
            '<br>' + t('Please do not change the html comments ( <!--html_comment--> )',
            [['<!--html_comment-->',htmlComment]]) + '</p>' +
            '<div id="translations-div" style="overflow-y: auto; text-align: left"><hr>';
        numberOfStrings = translationsArray.length;

        for (var i = 0; i < numberOfStrings; i++) {
            var origString = translationsArray[i]['orig'].replace(/</g,'&lt;');
            origString = origString.replace(/>/g,'&gt;');
            var transString = translationsArray[i][languageToEdit].replace(/</g,'&lt;');
            transString = transString.replace(/>/g,'&gt;');
            transString = transString.replace(/"/g, '&quot;');
            if (origString == transString)
                transString = '';
            translationManagementHtml += origString + '<br>' +
                '<input type="hidden" id="orig-string-' + i + '" value="' + origString + '" />' +
                '<input type="text" id="trans-string-' + i + '" value="' + transString + '" /><br><hr>';
        }
        //translationManagementHtml += '<div data-role="controlgroup" data-type="horizontal">' +
        translationManagementHtml += '<a href="#" data-role="button" data-mini="true" data-inline="true" ' +
            'id="save-translations" onclick="saveTranslations(' + numberOfStrings + ');">' +
            t('Save translations') + '</a>' +
            '<a href="#" data-role="button" data-mini="true" data-inline="true"' +
            ' id="cancel-translations" onclick="cancelTranslations();">' +
            t('Cancel') + '</a>' +
            //'</div></div>';
            '</div>';
        thisTranslationContainer.html(translationManagementHtml).trigger('create');
        var thisCloseButton = $('#close-translation-management');
        thisCloseButton.css({position: 'absolute', left: (thisTranslationContainer.width() - thisCloseButton.width() - 5) + 'px', top: '5px'});
        $('#translations-div').css({width: thisTranslationContainer.width()+'px',
            height: (thisTranslationContainer.height() - $('#translations-div').position().top)+'px'});
        thisTranslationContainer.css({display: 'block'});
        $('#translation-container-headline').css(this.TranslationContainerHeadlineCss);
        $('#translation-container-headline2').css(this.TranslationContainerHeadline2Css);

        thisCloseButton.click(function () {
            thisTranslationContainer.css({display: 'none'});
        });
    }
};

ChatDisplayClass.prototype.playSound = function(name, sender) {
    blinkPageTitle(t('New chat activity'));
    var thisClass = this;
    //console.log('Play sound ' + name + ', sender: ' + sender + ', text: ' + text);
    $('#sound-'+name)[0].volume = thisClass.volume / 100;
    if ($.inArray(sender, thisClass.soundPlayed) == -1) {
        //console.log('Sound played: ' + name + ' --- ' + sender);
        if (typeof lzm_deviceInterface == 'undefined') {
            $('#sound-'+name)[0].play();
        } else {
            try {
                lzm_deviceInterface.playSound(name, thisClass.volume/100);
            } catch(ex) {
                console.log('Playing message sound failed.');
            }
        }
    }
    thisClass.addSoundPlayed(sender);
    setTimeout(function() {thisClass.removeSoundPlayed(sender);}, 2000);
};

ChatDisplayClass.prototype.addSoundPlayed = function(sender) {
    if ($.inArray(sender,this.soundPlayed) == -1) {
        this.soundPlayed.push(sender);
    }
};

ChatDisplayClass.prototype.removeSoundPlayed = function(sender) {
    if ($.inArray(sender,this.soundPlayed) != -1) {
        var tmpSoundPlayed = [];
        for (var i=0; i<this.soundPlayed.length; i++) {
            if (this.soundPlayed[i] != sender) {
                tmpSoundPlayed.push(this.soundPlayed[i]);
            }
        }
        this.soundPlayed = tmpSoundPlayed;
    }
};

ChatDisplayClass.prototype.startRinging = function(senderList, visitors) {
    blinkPageTitle(t('New chat activity'));
    var thisClass = this;
    var notificationSound;
    if (thisClass.playNewChatSound == 1) {
        notificationSound = 'NONE';
    } else {
        notificationSound = 'DEFAULT';
    }
        var newSender = [];
        var startRinging = false;
        for (var i = 0; i<senderList.length; i++) {
            if ($.inArray(senderList[i], thisClass.ringSenderList) == -1) {
                thisClass.ringSenderList.push(senderList[i]);
                newSender.push(senderList[i]);
            }
            if (typeof thisClass.isRinging[senderList[i]] == 'undefined' || !thisClass.isRinging[senderList[i]]) {
                startRinging = true;
                this.isRinging[senderList[i]] = true;
            }
        }
        var tmpRingSenderList = [];
        for (var j=0; j<thisClass.ringSenderList.length; j++) {
            if ($.inArray(thisClass.ringSenderList[j], senderList) != -1) {
                tmpRingSenderList.push(thisClass.ringSenderList[j]);
            }
        }
        thisClass.ringSenderList = tmpRingSenderList;
        if (startRinging) {
            //console.log('Start ringing');
            //console.log(newSender);

                for (var k=0; k<newSender.length; k++) {
                    var senderId = newSender[k].split('~')[0];
                    var senderBid = newSender[k].split('~')[1];
                    var senderQuestion, senderName;
                    for (var l=0; l<visitors.length; l++) {
                        //lzm_deviceInterface.jsLog(visitors[l].id + ' = ' + senderId);
                        if (visitors[l].id == senderId) {
                            for (var m=0; m<visitors[l].b.length; m++) {
                                if (visitors[l].b[m].id == senderBid) {
                                    senderName = (typeof visitors[l].b[m].cname != 'undefined' && visitors[l].b[m].cname != '') ? visitors[l].b[m].cname : visitors[l].unique_name;
                                    senderQuestion = (typeof visitors[l].b[m].chat.eq != 'undefined' && visitors[l].b[m].chat.eq != '') ?
                                        visitors[l].b[m].chat.eq : t('New Chat Request');
                                }
                            }
                            break;
                        }
                    }
                    var notificationText = t('<!--sender--> likes to chat with you.', [['<!--sender-->', lzm_commonTools.htmlEntities(senderName)]]);
                    //console.log(notificationText);
                    if (typeof lzm_deviceInterface != 'undefined') {
                        try {
                            thisClass.lastChatSendingNotification = newSender[k];
                            lzm_deviceInterface.showNotification(t('LiveZilla'), notificationText, notificationSound, newSender[k], newSender[k]);
                        } catch(ex) {
                            console.log('Error while showing notification');
                        }
                    }
                    if (thisClass.selected_view != 'mychats' || $('.dialog-window-container').length > 0) {
                        lzm_displayHelper.showBrowserNotification({
                            text: notificationText,
                            subject: t('New Chat Request'),
                            action: 'openChatFromNotification(\'' + newSender[k] + '\'); closeOrMinimizeDialog();',
                            timeout: 5
                        });
                    }
                }
            thisClass.ring(senderList);
        }
};

ChatDisplayClass.prototype.ring = function (senderList) {
    var thisClass = this;
    var audio = $('#sound-ringtone')[0];
    var playRingSound = false;
    for (var i=0; i<senderList.length; i++) {
        if (typeof this.isRinging[senderList[i]] != 'undefined' && this.isRinging[senderList[i]]) {
            playRingSound = true;
        }
    }
    if (thisClass.playNewChatSound == 1 &&  playRingSound) {
        //console.log('Ring ' + Math.floor(100 * Math.random()));
        audio.volume = this.volume / 100;
        if (typeof lzm_deviceInterface == 'undefined') {
            audio.play();
        } else {
            try {
                lzm_deviceInterface.playSound('ringtone', thisClass.volume/100);
            } catch(ex) {
                console.log('Playing ringtone failed.');
            }
        }
        if (thisClass.repeatNewChatSound == 1) {
            setTimeout(function() {
                thisClass.ring(senderList);
            }, 5000);
        }
    }
};

ChatDisplayClass.prototype.stopRinging = function(senderList) {
    for (var key in this.isRinging) {
        if (this.isRinging.hasOwnProperty(key)) {
            if ($.inArray(key, senderList) == -1) {
                delete this.isRinging[key];
            }
        }
    }
};

ChatDisplayClass.prototype.showDisabledWarning = function() {
    if (this.serverIsDisabled && (lzm_chatTimeStamp.getServerTimeString(null, false, 1) - this.lastDiabledWarningTime >= 90000)) {
        if (confirm(t('This LiveZilla server has been deactivated by the administrator.') +
            t('Do you want to logout now?'))) {
            logout(false);
        } else {
            this.lastDiabledWarningTime = lzm_chatTimeStamp.getServerTimeString(null, false, 1);
        }
    }
};

ChatDisplayClass.prototype.createSecondHeadlineCssFromFirst = function(cssObject) {
    var returnObject =  this.lzm_commonTools.clone(cssObject);
    returnObject.background = '#ededed';
    returnObject.top = '22px';
    returnObject.height = '28px';
    delete returnObject['background-image'];
    delete returnObject['border-top-left-radius'];
    delete returnObject['border-top-right-radius'];
    returnObject['border-top'] = returnObject['border-bottom'];
    delete returnObject['border-bottom'];

    return returnObject;
};

ChatDisplayClass.prototype.createFootlineCssFromHeadline = function(cssObject, parentWidth, parentHeight, roundedStyle, buttonSize) {
    var returnObject =  this.lzm_commonTools.clone(cssObject);
    returnObject.background = '#ededed';
    returnObject['text-align'] = 'right';
    returnObject['border-bottom-left-radius'] = roundedStyle;
    returnObject['border-bottom-right-radius'] = roundedStyle;
    if (typeof buttonSize == 'undefined' || buttonSize != 'small') {
        returnObject['padding-top'] = '5px';
        returnObject['padding-right'] = '10px';
        returnObject.top = (parentHeight - 42 + 5)+'px';
        returnObject.height = '42px';
        returnObject.width = (parentWidth - 10)+'px';
    } else {
        returnObject['padding-top'] = '7px';
        returnObject['padding-right'] = '2px';
        returnObject['padding-bottom'] = '0px';
        returnObject['padding-left'] = '2px';
        returnObject.top = (parentHeight - 20 + 2)+'px';
        returnObject.height = '21px';
        returnObject.width = (parentWidth + 6)+'px';
        returnObject['font-weight'] = 'none';
        returnObject['font-size'] = '11px';
    }
    delete returnObject['line-height'];
    delete returnObject['background-image'];
    delete returnObject['border-top-left-radius'];
    delete returnObject['border-top-right-radius'];
    delete returnObject['border-bottom'];

    return returnObject;
};
