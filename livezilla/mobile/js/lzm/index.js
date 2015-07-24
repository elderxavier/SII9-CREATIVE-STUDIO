/****************************************************************************************
 * LiveZilla index.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

var lzm_commonConfig = {};
var lzm_commonTools = {};
var lzm_commonDisplay = {};
var lzm_commonStorage = {};
var lzm_commonTranslation = {};
var loopCounter = 0;
var defaultProfile = {};
var lz_version = '';
var debuggingMode = 0;
var multiServerId = '';
var deviceId = '';

var urlGetObject = {};
var browserReference = null;

var serverUrl = '';
var serverProtocol = '';


var runningFromApp = false;
var localDbPrefix = '';

/*var console = {};
 console.log = function(myString) {
 try {
 lzm_deviceInterface.jsLog(myString, 'log');
 } catch(ex) {

 }
 };
 console.info = function(myString) {
 try {
 lzm_deviceInterface.jsLog(myString, 'warn');
 } catch(ex) {
 }
 };
 console.warn = function(myString) {
 try {
 lzm_deviceInterface.jsLog(myString, 'info');
 } catch(ex) {
 }
 };
 console.error = function(myString) {
 try {
 lzm_deviceInterface.jsLog(myString, 'error');
 } catch(ex) {
 }
 };*/

function setDeviceId(id) {
    deviceId = id;
}

function readPageloadParameter() {
    var myUrl = document.URL;
    if (runningFromApp) {
        //console.log('Page loaded from ' + myUrl);
        if (myUrl.indexOf('?') != -1) {
            var urlParts = myUrl.split('?');
            if (urlParts[1] == 'ERROR') {
                alert(t('An error occured while loading the web application.') + '\n\n' +
                t('Check your server and the connection of your mobile device.'));
            } else if (urlParts[1] == 'TIMEOUT') {
                alert(t('Loading the web application timed out.') + '\n\n' +
                    t('Check your server and the connection of your mobile device.'));
            }
        }
    } else {
        if (myUrl.indexOf('?') != -1) {
            var urlParts = myUrl.split('?');
            if (urlParts[1] == 'DEBUG') {
                debuggingMode = 1;
            }
        }
    }
}

function openBrowser(url, serverVersion) {
    try {
        lzm_deviceInterface.openChatView(url, serverVersion);
    } catch(ex) {
        console.log('Opening chat view failed');
    }
}

function submitLoginForm(loginData, acid) {
    var targetUrl = 'chat.php?acid=' + acid;

    for (var key in loginData) {
        if (loginData.hasOwnProperty(key))
            $('#data-submit-form').append('<input type="hidden" id="' + key + '" name="' + key + '" value="' + loginData[key] + '" />');
    }
    $('#data-submit-form').attr('action', targetUrl);
    $('#data-submit-form').trigger('create');
    $('#data-submit-form').submit();
}

function getUserStatusLogo(status) {
    //console.log('User status : ' + status);
    var userStatusLogo;
    status = (typeof status != 'undefined' && status != 'undefined') ? status : 0;
    for (var j= 0; j<lzm_commonConfig.lz_user_states.length; j++) {
        if (status == lzm_commonConfig.lz_user_states[j].index) {
            userStatusLogo = lzm_commonConfig.lz_user_states[j].icon;
        }
    }
    //console.log(userStatusLogo);
    return userStatusLogo;
}

function t(myString, replacementArray) {
    return lzm_commonTranslation.translate(myString, replacementArray);
}

function fillStringsFromTranslation(selectedIndex) {
    if (loopCounter > 49 || lzm_commonTranslation.translationArray.length != 0) {
        $('#username-text').html(t('Username:'));
        $('#password-text').html(t('Password:'));
        $('#username').attr('placeholder', t('Username'));
        $('#password').attr('placeholder', t('Password'));
        $('#save_login-text span.ui-btn-text').text(t('Save login data'));
        $('#login_btn span.ui-btn-text').text(' ' + t('Log in') + ' ').trigger('create');
        $('#configure_btn span.ui-btn-text').text(t('Server Profiles'));
        $('#headline1').html(t('LiveZilla Mobile'));
        lzm_commonDisplay.fillProfileSelectList(lzm_commonStorage.storageData, runningFromApp, selectedIndex);

        var selectedStatus = 0;
        if (typeof defaultProfile.user_status != 'undefined') {
            selectedStatus = defaultProfile.user_status;
            //console.log(selectedStatus);
        }
        fillUserStatusSelect(selectedStatus);
    } else {
        loopCounter++;
        setTimeout(function () {
            fillStringsFromTranslation(selectedIndex);
        }, 50);
    }
}

function fillUserStatusSelect(selectedStatus) {
    //console.log('Selected status : ' + selectedStatus)
    var userStatusHtml = '';
    for (var i = 0; i < lzm_commonConfig.lz_user_states.length; i++) {
        var selectOption = '';
        if (typeof selectedStatus != 'undefined' && selectedStatus != '' && selectedStatus != null &&
            selectedStatus != 'undefined' && selectedStatus != 'null' &&
            String(lzm_commonConfig.lz_user_states[i].index) == String(selectedStatus)) {
            selectOption = ' selected="selected"';
        }
        if (lzm_commonConfig.lz_user_states[i].index != 2) {
            userStatusHtml += '<option value="' + lzm_commonConfig.lz_user_states[i].index + '"' + selectOption + '>' +
                t(lzm_commonConfig.lz_user_states[i].text) + '</option>';
        }
    }
    $('#user_status').html(userStatusHtml).selectmenu('refresh');
}

function checkServerVersion(xmlDoc) {
    var checkResult = true, serverVersion = '';
    $(xmlDoc).find('livezilla_version').each(function() {
        serverVersion = lz_global_base64_url_decode($(this).text());
    });
    var codeVersion = lzm_commonConfig.lz_min_version.split('.');
    var checkVersion = serverVersion.split('.');
    if (serverVersion.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/) == null || serverVersion.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/) == ['']) {
        checkResult = false;
    }
    if (checkVersion.length != codeVersion.length) {
        checkResult = false;
    }
    for (var i=0; i<checkVersion.length; i++) {
        //console.log(checkVersion[i] + ' --- ' + codeVersion[i]);
        if (checkVersion[i] > codeVersion[i]) {
            break;
        } else if (checkVersion[i] == codeVersion[i]) {
            // Go to next round...
        } else {
            checkResult = false;
        }
    }
    if (!checkResult) {
        alert(t('You need at least LiveZilla server version <!--config_version--> to run this app.',[['<!--config_version-->',lzm_commonConfig.lz_min_version]]));
    }
    return [checkResult, serverVersion];
    //return [false, serverVersion];
}

function checkServerVersionNewerThan(comparedVersion, xmlDoc) {
    var checkResult = true, serverVersion = '';
    $(xmlDoc).find('livezilla_version').each(function() {
        serverVersion = lz_global_base64_url_decode($(this).text());
    });
    var codeVersion = comparedVersion.split('.');
    var checkVersion = serverVersion.split('.');
    //console.log(serverVersion);
    if (serverVersion.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/) == null || serverVersion.match(/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/) == ['']) {
        checkResult = false;
    }
    if (checkVersion.length != codeVersion.length) {
        checkResult = false;
    }
    for (var i=0; i<checkVersion.length; i++) {
        //console.log(checkVersion[i] + ' --- ' + codeVersion[i]);
        if (checkVersion[i] > codeVersion[i]) {
            break;
        } else if (checkVersion[i] == codeVersion[i]) {
            // Go to next round...
        } else {
            checkResult = false;
        }
    }
    //console.log(checkResult);
    return [checkResult, serverVersion];
}

function checkForValidationErrors(xmlDoc, serverProtocol, serverUrl, mobileDir, serverPort, loginName, password, status, loginId, isApp, isWeb, b64login,
    b64password, b64status, b64index, b64profile, b64port, b64protocol, b64url, b64mobileDir, b64loginid,
    b64volume, b64away, b64playNewMessageSound, b64playNewChatSound, b64repeatNewChatSound, b64playNewTicketSound, b64language, b64backgroundMode, localDbPrefix) {
    var error_value = -1;
    $(xmlDoc).find('validation_error').each(function () {
        if (error_value == -1) {
            error_value = lz_global_base64_url_decode($(this).attr('value'));
        }
    });
    switch (String(error_value)) {
        case "0":
            alert(t('Wrong username or password.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "2":
            if (confirm(t('The operator <!--op_login_name--> is already logged in.',[['<!--op_login_name-->', loginName]]) + '\n' +
                t('Do you want to log off the other instance?'))) {
                pollServerlogin(serverProtocol, serverUrl, mobileDir, serverPort, loginName, password, status, loginId, isApp, isWeb, b64login,
                    b64password, b64status, b64index, b64profile, b64port, b64protocol, b64url, b64mobileDir, b64loginid,
                    b64volume, b64away, b64playNewMessageSound, b64playNewChatSound, b64repeatNewChatSound, b64playNewTicketSound, b64language, b64backgroundMode,
                    localDbPrefix, true);
            } else {
                $('#login_btn').removeClass('ui-disabled');
            }
            break;
        case "3":
            alert(t("You've been logged off by another operator!"));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "4":
            alert(t('Session timed out.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "5":
            alert(t('You have to change your password.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "9":
            alert(t('You are not an administrator.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "10":
            alert(t('This LiveZilla server has been deactivated by the administrator.') + '\n' +
                t('If you are the administrator, please activate this server under LiveZilla Server Admin -> Server Configuration -> Server.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "13":
            alert(t('There are problems with the database connection.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "14":
            alert(t('This server requires secure connection (SSL). Please activate HTTPS in the server profile and try again.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "15":
            alert(t('Your account has been deactivated by an administrator.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "19":
            alert(t('No mobile access permitted.'));
            $('#login_btn').removeClass('ui-disabled');
            break;
        case "11":
        case "-1":
            //
            break;
        default:
            alert('Validation Error : ' + error_value);
            $('#login_btn').removeClass('ui-disabled');
            break;
    }
    return error_value;
}

function pollServerlogin(serverProtocol, serverUrl, mobileDir, serverPort, loginName, password, status, loginId, isApp, isWeb, b64login,
                         b64password, b64status, b64index, b64profile, b64port, b64protocol, b64url, b64mobileDir, b64loginid,
                         b64volume, b64away, b64playNewMessageSound, b64playNewChatSound, b64repeatNewChatSound, b64playNewTicketSound, b64language,
                         b64backgroundMode, localDbPrefix, ignoreSignedOn) {
    ignoreSignedOn = (typeof ignoreSignedOn != 'undefined') ? ignoreSignedOn : false;
    var p_acid = lzm_commonTools.pad(Math.floor(Math.random() * 99999).toString(10), 5);
    var acid = lzm_commonTools.pad(Math.floor(Math.random() * 1048575).toString(16), 5);

    var mobile = (runningFromApp) ? 1 : 0;
    var loginDataObject = {
        p_user_status: status,
        p_user: loginName,
        p_pass: password,
        p_acid: p_acid,
        p_request: 'intern',
        p_action: 'login',
        p_get_management: 1,
        p_version: lz_version,
        p_clienttime: Math.floor($.now()/1000),
        p_app: isApp,
        p_mobile: mobile,
        p_web: 1,
        p_loginid: loginId
    };
    if (ignoreSignedOn) {
        loginDataObject.p_iso = 1;
    }
    if (serverUrl.indexOf(':') == -1) {
        var urlParts = serverUrl.split('/');
        serverUrl = serverProtocol + urlParts[0] + ':' + serverPort;
        for (var i = 1; i < urlParts.length; i++) {
            serverUrl += '/' + urlParts[i];
        }
    } else if (serverUrl.indexOf(serverProtocol) == -1) {
        serverUrl = serverProtocol + serverUrl;
    }
    var postUrl = (serverUrl.indexOf('#') != -1) ? serverUrl.split('#')[0] : serverUrl;
    postUrl = postUrl + '/server.php?acid=' + acid;
    if (multiServerId != '') {
        postUrl += '&ws=' + multiServerId;
    }
    //console.log(JSON.stringify(loginDataObject));
    //console.log(postUrl);
    $.ajax({
        type: "POST",
        url: postUrl,
        //crossDomain: true,
        data: loginDataObject,
        timeout: lzm_commonConfig.pollTimeout,
        success: function (data) {
            try {
                var xmlDoc = $.parseXML(data);
                var xmlIsLiveZillaXml = false;
                $(xmlDoc).find('livezilla_xml').each(function() {
                    xmlIsLiveZillaXml = true;
                });
                if (xmlIsLiveZillaXml) {
                    var error_value = -1;
                    var serverVersionIsSufficient = checkServerVersion(xmlDoc);
                    var serverVersionNewer5100 = checkServerVersionNewerThan('5.1.0.0', xmlDoc);
                    var serverVersionNewer5120 = checkServerVersionNewerThan('5.1.2.0', xmlDoc);
                    error_value = checkForValidationErrors(xmlDoc, serverProtocol, serverUrl, mobileDir, serverPort, loginName, password, status, loginId, isApp, isWeb, b64login,
                        b64password, b64status, b64index, b64profile, b64port, b64protocol, b64url, b64mobileDir, b64loginid,
                        b64volume, b64away, b64playNewMessageSound, b64playNewChatSound, b64repeatNewChatSound, b64playNewTicketSound, b64language, b64backgroundMode, localDbPrefix);
                    if (serverVersionIsSufficient[0] && error_value == -1) {
                        var appUrl = (serverUrl.indexOf('#') != -1) ? serverUrl.split('#')[0] : serverUrl;
                        if (isApp && serverVersionNewer5120[0]) {
                            var protocolMode = (serverProtocol == 'https://') ? lz_global_base64_url_encode('1') : lz_global_base64_url_encode('0');
                            openBrowser(appUrl + '/' + mobileDir + '/chat.php?lgn=' + b64login + '&psswrd=' + b64password + '&stts=' + b64status +
                                '&ndx=' + b64index + '&prfl=' + b64profile + '&prt=' + b64port + '&p=' + protocolMode + '&rl=' + b64url +
                                '&mbl_dr=' + b64mobileDir + '&acid=' + acid + '&pp=1' + '&lgnd=' + b64loginid +
                                '&vlm=' + b64volume + '&w_ftr=' + b64away +
                                '&pl_ncmng_mssg_snd=' + b64playNewMessageSound +
                                '&pl_ncmng_cht_snd=' + b64playNewChatSound +
                                '&rpt_ncmng_cht_snd=' + b64repeatNewChatSound +
                                '&pl_ncmng_tckt_snd=' + b64playNewTicketSound +
                                '&lngg=' + b64language +
                                '&bckgrnd_md=' + b64backgroundMode +
                                '&dbg' + debuggingMode +
                                '&lcl_db_prfx=' + localDbPrefix +
                                '&mlt_srvr_d=' + multiServerId, serverVersionIsSufficient[1]);
                        } else if (isApp && serverVersionNewer5100[0]) {
                            openBrowser(appUrl + '/' + mobileDir + '/chat.php?lgn=' + b64login + '&psswrd=' + b64password + '&stts=' + b64status +
                                '&ndx=' + b64index + '&prfl=' + b64profile + '&prt=' + b64port + '&prtcl=' + b64protocol + '&rl=' + b64url +
                                '&mbl_dr=' + b64mobileDir + '&acid=' + acid + '&pp=1' + '&lgnd=' + b64loginid +
                                '&vlm=' + b64volume + '&w_ftr=' + b64away +
                                '&pl_ncmng_mssg_snd=' + b64playNewMessageSound +
                                '&pl_ncmng_cht_snd=' + b64playNewChatSound +
                                '&rpt_ncmng_cht_snd=' + b64repeatNewChatSound +
                                '&pl_ncmng_tckt_snd=' + b64playNewTicketSound +
                                '&lngg=' + b64language +
                                '&bckgrnd_md=' + b64backgroundMode +
                                '&dbg' + debuggingMode +
                                '&lcl_db_prfx=' + localDbPrefix +
                                '&mlt_srvr_d=' + multiServerId, serverVersionIsSufficient[1]);
                        } else if (isApp && !serverVersionNewer5100[0]) {
                            openBrowser(appUrl + '/' + mobileDir + '/chat.php?login=' + b64login + '&password=' + b64password + '&status=' + b64status +
                                '&index=' + b64index + '&profile=' + b64profile + '&port=' + b64port + '&protocol=' + b64protocol + '&url=' + b64url +
                                '&mobile_dir=' + b64mobileDir + '&acid=' + acid + '&app=1' + '&loginid=' + b64loginid +
                                '&volume=' + b64volume + '&away_after=' + b64away +
                                '&play_incoming_message_sound=' + b64playNewMessageSound +
                                '&play_incoming_chat_snd=' + b64playNewChatSound +
                                '&repeat_incoming_chat_sound=' + b64repeatNewChatSound +
                                '&play_incoming_ticket_sound=' + b64playNewTicketSound +
                                '&language=' + b64language +
                                '&background_mode=' + b64backgroundMode +
                                '&debug' + debuggingMode +
                                '&local_db_prefix=' + localDbPrefix +
                                '&multi_server_id=' + multiServerId, serverVersionIsSufficient[1]);
                        } else if (isWeb) {
                            submitLoginForm({
                                lgn: b64login,
                                psswrd: b64password,
                                stts: b64status,
                                ndx: b64index,
                                prfl: b64profile,
                                prt: b64port,
                                prtcl: b64protocol,
                                rl: b64url,
                                mbl_dr: b64mobileDir,
                                wb: 1,
                                lgnd: b64loginid,
                                vlm: b64volume,
                                w_ftr: b64away,
                                pl_ncmng_mssg_snd: b64playNewMessageSound,
                                pl_ncmng_cht_snd: b64playNewChatSound,
                                rpt_ncmng_cht_snd: b64repeatNewChatSound,
                                pl_ncmng_tckt_snd: b64playNewTicketSound,
                                lngg: b64language,
                                bckgrnd_md: b64backgroundMode,
                                dbg: debuggingMode,
                                lcl_db_prfx: localDbPrefix,
                                mlt_srvr_d: multiServerId
                            }, acid);
                        }
                    }
                } else {
                    $('#login_btn').removeClass('ui-disabled');
                    var errorMessage = t('The server response had an invalid structure.') + '\n\n' +
                        t('Either the server URL is wrong (presumably) or the server is not working properly.');
                    alert(errorMessage);
                }
            } catch(ex) {
                $('#login_btn').removeClass('ui-disabled');
                var errorMessage = t('The server response had an invalid structure.') + '\n\n' +
                    t('Either the server URL is wrong (presumably) or the server is not working properly.');
                alert(errorMessage);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#login_btn').removeClass('ui-disabled');
            if (jqXHR.statusText == 'timeout') {
                alert(t('The server did not respond for more then <!--number_of_seconds--> seconds.',
                    [['<!--number_of_seconds-->',lzm_commonConfig.pollTimeout / 1000]]));
            } else {
                //console.log('Status-Text : ' + textStatus);
                //console.log(jqXHR);
                //console.log('Error-Text : ' + errorThrown);
                var errorMessage = '';
                if (jqXHR.status == 404 || jqXHR.status == 0) {
                errorMessage += t('Cannot connect to the LiveZilla Server. The target URI seems to be wrong or your network is down.') + '\n\n' +
                    t('Please check / validate the URI (Server Profile)') + '\n\n' +
                    t('Further information') + '\n';
                }
                if (jqXHR.status != 0) {
                    errorMessage += t('The remote server has returned an error: (<!--http_error-->) <!--http_error_text-->',
                        [['<!--http_error-->',jqXHR.status],['<!--http_error_text-->',jqXHR.statusText]]);
                } else {
                    errorMessage += t('You need at least LiveZilla server version <!--config_version--> to run this app.',[['<!--config_version-->',lzm_commonConfig.lz_min_version]]);
                }
                alert(errorMessage);
            }
        },
        dataType: 'text'
    });
}

function openConfiguration() {
    window.location.href = 'configure.html';
}

function hasStorage() {
    var returnValue;
    try {
        localStorage.setItem('test', 'test');
        returnValue = localStorage.getItem('test');
        localStorage.removeItem('test');
    } catch(e) {
        returnValue = false;
    }
    return returnValue;
}

$(document).ready(function () {
    //alert($(window).height());
    var urlParts;

    if (runningFromApp) {
        $('#configure_btn').css({display: 'block'});
        $('#server_profile_selection').css({display: 'block'});
    }
    // Detect if the local storage is working
    if (!runningFromApp && hasStorage() != 'test') {
        lzm_commonTools = new CommonToolsClass();
        urlParts = lzm_commonTools.getUrlParts();
        lzm_commonTranslation = new CommonTranslationClass(urlParts.protocol, urlParts.urlBase + ':' +
            urlParts.port + urlParts.urlRest, false);

        var errorHtml = '<div style="position: fixed; top: 0px; left: 0px; width: 100%; background-color: #111111; border: 1px solid #333333; color: #ffffff">' +
            '<h1 style="font-size: 1.5em; margin: 5px; text-align: center;">' + t('LiveZilla Mobile') + '</h1>' +
            '</div>' +
            '<div style="margin-top: 69px; padding:42px; background: url(\'img/logo.png\'); background-position: center; background-repeat: no-repeat;"></div>' +
            '<p style="padding: 0px 20px; font-size: 1.5em;">' + t('Your browser seems to have its local storage/cookies disabled.') + '<br />' +
            t('Since local storage and cookies are needed for this application, you have to enable the local storage/cookies in your browser settings and reload this page.') + '</p>';
        $('#no-storage-warning').html(errorHtml).css({display: 'block'});
        $('body').css({'background-color': '#ffffff'});
    } else {

    // initiate the lzm classes needed
    if (runningFromApp && typeof lzm_deviceInterface == 'undefined') {
        lzm_deviceInterface = new CommonDeviceInterfaceClass();
    }
    lzm_commonConfig = new CommonConfigClass();
    lzm_commonTools = new CommonToolsClass();
    if (!runningFromApp) {
        localDbPrefix = md5(lzm_commonTools.getUrlParts()['urlRest']).substr(0,10);
        //console.log(localDbPrefix);
    }
    lzm_commonStorage = new CommonStorageClass(localDbPrefix, runningFromApp);
    lzm_commonDisplay = new CommonDisplayClass(runningFromApp);
    var orientation = (lzm_commonStorage.loadValue('display_orientation') != null) ? lzm_commonStorage.loadValue('display_orientation') : 'vertical';
    lzm_commonDisplay.orientation = orientation;
    if (typeof lzm_deviceInterface != 'undefined') {
        lzm_deviceInterface.switchOrientation(orientation);
    }
    if (!runningFromApp) {
        urlParts = lzm_commonTools.getUrlParts();
        multiServerId = lz_global_base64_url_encode(urlParts.multiServerId);
        lzm_commonTranslation = new CommonTranslationClass(urlParts.protocol, urlParts.urlBase + ':' +
            urlParts.port + urlParts.urlRest, urlParts.mobileDir, false);
    } else {
        lzm_commonTranslation = new CommonTranslationClass('', '', '', true);
    }

    // load the storage values and fill the profile select list
    lzm_commonStorage.loadProfileData();
    var selectedIndex = (typeof lzm_commonStorage.loadValue('last_chosen_profile') != 'undefined' &&
        lzm_commonStorage.loadValue('last_chosen_profile') != 'undefined' &&
        lzm_commonStorage.loadValue('last_chosen_profile') != null &&
        lzm_commonStorage.loadValue('last_chosen_profile') !== '') ?
        lzm_commonStorage.loadValue('last_chosen_profile') : -1;
    fillStringsFromTranslation(selectedIndex);
    readPageloadParameter();

    var thisServerProfileSelection = $('#server_profile_selection');
    var thisLoginData = $('.login-data');
    var thisSaveLoginQuestion = $('#save-login-question');
    var thisSaveLogin = $('#save_login');

    $('#login_btn').click(function () {
        $('#login_btn').addClass('ui-disabled');
        var selectedIndex = (thisServerProfileSelection.val() != -1) ? thisServerProfileSelection.val() : 0;
        var chosenProfile = lzm_commonStorage.getProfileByIndex(selectedIndex);
        /*if (runningFromApp) {
            lz_version = chosenProfile.lz_version;
        } else {*/
            lz_version = lzm_commonConfig.lz_version;
        //}
        lzm_commonStorage.saveValue('last_chosen_profile', selectedIndex);

        // create a fake ip address...
        var loginId;
        if (typeof chosenProfile.fake_mac_address == 'undefined' || chosenProfile.fake_mac_address == '' ||
            chosenProfile.fake_mac_address == 'undefined' || chosenProfile.fake_mac_address == 'null' || chosenProfile.fake_mac_address == null) {
            var randomHex = String(md5(String(Math.random())));
            loginId = randomHex.toUpperCase().substr(0,2);
            for (var i=1; i<6; i++) {
                loginId += '-' + randomHex.toUpperCase().substr(2*i,2);
            }
            chosenProfile.fake_mac_address = loginId;
        } else {
            loginId = chosenProfile.fake_mac_address;
        }

        chosenProfile.user_status = $('#user_status').val();

        var login = lz_global_base64_url_encode($('#username').val());
        var password = lz_global_base64_url_encode($('#password').val());
        var userStatus = lz_global_base64_url_encode($('#user_status').val());
        var index = lz_global_base64_url_encode(selectedIndex);
        var profile = lz_global_base64_url_encode(chosenProfile.server_profile);
        var port = lz_global_base64_url_encode(chosenProfile.server_port);
        var protocol = lz_global_base64_url_encode(chosenProfile.server_protocol);
        var url = (chosenProfile.server_url.indexOf('#') != -1) ? chosenProfile.server_url.split('#')[0] : chosenProfile.server_url;
        url = lz_global_base64_url_encode(url);
        var b64mobileDir = lz_global_base64_url_encode(chosenProfile.mobile_dir);
        var volume = lz_global_base64_url_encode(60);
        var awayAfter = lz_global_base64_url_encode(0);
        var b64playNewMessageSound = lz_global_base64_url_encode(1);
        var b64playNewChatSound = lz_global_base64_url_encode(1);
        var b64repeatNewChatSound = lz_global_base64_url_encode(1);
        var b64playNewTicketSound = lz_global_base64_url_encode(1);
        var b64backgroundMode = lz_global_base64_url_encode(1);
        var b64loginId = lz_global_base64_url_encode(loginId);
        var b64language = lz_global_base64_url_encode(lzm_commonTranslation.language);
        if (typeof chosenProfile.user_volume != 'undefined' && chosenProfile.user_volume != null &&
            chosenProfile.user_volume != 'null' && chosenProfile.user_volume != 'undefined') {
            volume = lz_global_base64_url_encode(chosenProfile.user_volume);
        }
        if (typeof chosenProfile.user_away_after != 'undefined' && chosenProfile.user_away_after != null &&
            chosenProfile.user_away_after != 'null' && chosenProfile.user_away_after != 'undefined') {
            awayAfter = lz_global_base64_url_encode(chosenProfile.user_away_after);
        }
        if (typeof chosenProfile.play_incoming_message_sound != 'undefined' && chosenProfile.play_incoming_message_sound != null &&
            chosenProfile.play_incoming_message_sound != 'null' && chosenProfile.play_incoming_message_sound != 'undefined') {
            b64playNewMessageSound = lz_global_base64_url_encode(chosenProfile.play_incoming_message_sound);
        }
        if (typeof chosenProfile.play_incoming_chat_sound != 'undefined' && chosenProfile.play_incoming_chat_sound != null &&
            chosenProfile.play_incoming_chat_sound != 'null' && chosenProfile.play_incoming_chat_sound != 'undefined') {
            b64playNewChatSound = lz_global_base64_url_encode(chosenProfile.play_incoming_chat_sound);
        }
        if (typeof chosenProfile.repeat_incoming_chat_sound != 'undefined' && chosenProfile.repeat_incoming_chat_sound != null &&
            chosenProfile.repeat_incoming_chat_sound != 'null' && chosenProfile.repeat_incoming_chat_sound != 'undefined') {
            b64repeatNewChatSound = lz_global_base64_url_encode(chosenProfile.repeat_incoming_chat_sound);
        }
        if (typeof chosenProfile.play_incoming_ticket_sound != 'undefined' && chosenProfile.play_incoming_ticket_sound != null &&
            chosenProfile.play_incoming_ticket_sound != 'null' && chosenProfile.play_incoming_ticket_sound != 'undefined') {
            b64playNewTicketSound = lz_global_base64_url_encode(chosenProfile.play_incoming_ticket_sound);
        }
        if (typeof chosenProfile.background_mode != 'undefined' && chosenProfile.background_mode != null &&
            chosenProfile.background_mode != 'null' && chosenProfile.background_mode != 'undefined') {
            b64backgroundMode = lz_global_base64_url_encode(chosenProfile.background_mode);
        }

        if (typeof chosenProfile.user_volume == 'undefined' || chosenProfile.user_volume == null ||
            chosenProfile.user_volume == 'null' || chosenProfile.user_volume == 'undefined')
            chosenProfile.user_volume = 60;
        if (selectedIndex == 0) {
            if (thisSaveLogin.prop('checked') == true) {
                chosenProfile.login_name = $('#username').val();
                chosenProfile.login_passwd = $('#password').val();
            } else {
                chosenProfile.login_name = '';
                chosenProfile.login_passwd = '';
            }
        }
        chosenProfile.language = lzm_commonTranslation.language;
        chosenProfile.index = selectedIndex;
        lzm_commonStorage.saveProfile(chosenProfile);

        var isApp = (runningFromApp) ? 1 : 0;
        var isWeb = 1 - isApp;
        //if (!runningFromApp) {
            pollServerlogin(chosenProfile.server_protocol, chosenProfile.server_url, chosenProfile.mobile_dir, chosenProfile.server_port,
                $('#username').val(), $('#password').val(), $('#user_status').val(), loginId, isApp, isWeb, login,
                password, userStatus, index, profile, port, protocol, url, b64mobileDir, b64loginId, volume, awayAfter,
                b64playNewMessageSound, b64playNewChatSound, b64repeatNewChatSound, b64playNewTicketSound, b64language, b64backgroundMode,
                localDbPrefix, false);
        /*} else {
            $('#login_btn').removeClass('ui-disabled');
            var errorMessage = t('You need at least LiveZilla server version <!--config_version--> to run this app.',[['<!--config_version-->',lzm_commonConfig.lz_version]]);
            alert(errorMessage);
        }*/
    });

    $('#configure_btn').click(function () {
        lzm_commonStorage.saveValue('last_chosen_profile', thisServerProfileSelection.val());
        openConfiguration();
    });

    lzm_commonTools.createDefaultProfile(runningFromApp, thisServerProfileSelection.val());

    if (!runningFromApp) {
        $('#user_status').parent().addClass('ui-disabled');
        defaultProfile = lzm_commonStorage.getProfileByIndex(0);
        if (defaultProfile.login_name != '') {
            $('#username').val(defaultProfile.login_name);
            $('#password').val(defaultProfile.login_passwd);
            //console.log('User status : ' + defaultProfile.user_status);
            thisSaveLogin.prop('checked', true).checkboxradio("refresh");
            if (defaultProfile.login_passwd != '') {
                $('#login_btn').removeClass('ui-disabled');
                $('#user_status').parent().removeClass('ui-disabled');
            }
        }
        thisLoginData.css('display', 'block');
        thisSaveLoginQuestion.css('display', 'block');
    } else {
        $('.login-input').addClass('ui-disabled');
        $('#user_status').parent().addClass('ui-disabled');
        if (selectedIndex != -1) {
            dataSet = lzm_commonStorage.getProfileByIndex(selectedIndex);
            if (dataSet.server_url.indexOf('#') != -1) {
                multiServerId = lz_global_base64_url_encode(dataSet.server_url.split('#')[1]);
                //dataSet.server_url = dataSet.server_url.split('#')[0];
            } else {
                multiServerId = '';
            }
            if (typeof dataSet != 'undefined' && dataSet != null) {
                var dataSet = lzm_commonStorage.getProfileByIndex(selectedIndex);
                if (typeof dataSet.login_name != 'undefined') {
                    $('#username').val(dataSet.login_name);
                    $('#password').val(dataSet.login_passwd);
                }
                $('.login-input').removeClass('ui-disabled');
                if (dataSet.login_name != '' && dataSet.login_passwd != '') {
                    $('#login_btn').removeClass('ui-disabled');
                    $('#user_status').parent().removeClass('ui-disabled');
                }
            }
        }
        defaultProfile = dataSet;
    }
    var userStatusLogo = '';
    if (typeof defaultProfile != 'undefined' && typeof defaultProfile.user_status != 'undefined' && defaultProfile.user_status != 'undefined' && defaultProfile.user_status != '') {
        fillUserStatusSelect(defaultProfile.user_status);
        userStatusLogo = getUserStatusLogo(defaultProfile.user_status);
    } else {
        userStatusLogo = getUserStatusLogo();
    }

    lzm_commonDisplay.createLayout(userStatusLogo);
    if (runningFromApp) {
        setTimeout(function() {
            lzm_commonDisplay.createLayout(userStatusLogo);
        }, 200);
        setTimeout(function() {
            lzm_commonDisplay.createLayout(userStatusLogo);
        }, 1000);
        setTimeout(function() {
            lzm_commonDisplay.createLayout(userStatusLogo);
        }, 5000);
    }

    thisServerProfileSelection.change(function () {
        var selectedValue;
        if (!runningFromApp) {
            selectedValue = (thisServerProfileSelection.val() != -1) ? thisServerProfileSelection.val() : 0;
        } else {
            selectedValue = thisServerProfileSelection.val();
        }
        //console.log(selectedValue);
        if (selectedValue != -1) {
            var dataSet = lzm_commonStorage.getProfileByIndex(selectedValue);
            //console.log(dataSet);
            //console.log('Saved volume : ' + dataSet.user_volume);
            //console.log('Saved away time : ' + dataSet.user_away_after);

            if (typeof dataSet.login_name != 'undefined') {
                $('#username').val(dataSet.login_name);
                $('#password').val(dataSet.login_passwd);
            }
            fillUserStatusSelect(dataSet.user_status);
            if (thisServerProfileSelection.val() != -1) {
                thisLoginData.css('display', 'block');
                thisSaveLoginQuestion.css('visibility', 'hidden');
            } else {
                if (runningFromApp) {
                    thisLoginData.css('display', 'block');
                    thisSaveLoginQuestion.css('visibility', 'hidden');
                } else {
                    thisLoginData.css('display', 'block');
                    thisSaveLoginQuestion.css('visibility', 'visible');
                }
            }
            $('.login-input').removeClass('ui-disabled');
            $('#user_status').parent().removeClass('ui-disabled');
        } else {
            $('.login-input').addClass('ui-disabled');
            $('#login_btn').addClass('ui-disabled');
            $('#user_status').parent().addClass('ui-disabled');
            $('#username').val('');
            $('#password').val('');
        }
        var selectedUserStatus = (typeof dataSet != 'undefined') ? dataSet.user_status : 0;
        //console.log(selectedUserStatus);
        $('#user_status').parent().children('span').children('.ui-icon').css({'background-image': 'url("' + getUserStatusLogo(selectedUserStatus) + '")', 'background-position': 'center'});
        $('#user_status').parent().children('span').css({'text-align': 'left'});
        $('#user_status').parent().children('span').children('.ui-btn-text').css({'padding-left': '3px'});
        if (selectedValue != -1) {
            $('#username').keyup();
        }
    });

    $('#user_status').change(function() {
        var selectedUserStatus = $('#user_status').val();
        //console.log(selectedUserStatus);
        $('#user_status').parent().children('span').children('.ui-icon').css({'background-image': 'url("' + getUserStatusLogo(selectedUserStatus) + '")', 'background-position': 'center'});
        $('#user_status').parent().children('span').css({'text-align': 'left'});
        $('#user_status').parent().children('span').children('.ui-btn-text').css({'padding-left': '3px'});
    });

    $('.login-input').keyup(function () {
        if ($('#username').val() != '' && $('#password').val() != '') {
            $('#login_btn').removeClass('ui-disabled');
            $('#user_status').parent().removeClass('ui-disabled');
        } else {
            $('#login_btn').addClass('ui-disabled');
            $('#user_status').parent().addClass('ui-disabled');
        }
    });

    $('#orientation_btn').click(function() {
        var oldOrientation = lzm_commonDisplay.orientation;
        var targetOrientation = (lzm_commonDisplay.orientation == 'vertical') ? 'horizontal' : 'vertical';
        //console.log('Switching to ' + targetOrientation + ' orientation');
        lzm_commonDisplay.orientation = targetOrientation;
        $('#orientation_btn-inner').css({'background-image': 'url(\'img/device_' + oldOrientation + '2.png\')'});
        if (typeof lzm_deviceInterface != 'undefined') {
            lzm_deviceInterface.switchOrientation(targetOrientation);
        }
        lzm_commonStorage.saveValue('display_orientation', targetOrientation);
    });

    $(window).resize(function () {
        lzm_commonDisplay.createLayout(userStatusLogo);
        setTimeout(function() {
            var selectedUserStatus = $('#user_status').val();
            //console.log(selectedUserStatus);
            $('#user_status').parent().children('span').children('.ui-icon').css({'background-image': 'url("' + getUserStatusLogo(selectedUserStatus) + '")', 'background-position': 'center'});
        }, 4);
    });
    }
});
