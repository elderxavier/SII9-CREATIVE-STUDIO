/****************************************************************************************
 * LiveZilla configure.js
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/

// variables used or lzm class objects
var lzm_commonConfig = {};
var lzm_commonTools = {};
var lzm_commonDisplay = {};
var lzm_commonStorage = {};
var lzm_commonTranslation = {};

var runningFromApp = false;
var localDbPrefix = '';
var loopCounter = 0;

/*var console = {};
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
        lzm_deviceInterface.jsLog(myString, 'log');
    } catch(ex) {
    }
};*/

function goBackToLogin() {
    window.location.href = "./index.html";
}

function t(myString, replacementArray) {
    return lzm_commonTranslation.translate(myString, replacementArray);
}

function fillStringsFromTranslation(selectedIndex) {
    if (loopCounter > 49 || lzm_commonTranslation.translationArray.length != 0) {
        lzm_commonDisplay.fillProfileSelectList(lzm_commonStorage.storageData, runningFromApp, selectedIndex);
        $('#back_btn span.ui-btn-text').text(t('Cancel'));
        $('#new_profile_btn span.ui-btn-text').text(t('New profile'));
        $('#edit_profile_btn span.ui-btn-text').text(t('Edit profile'));
        $('#del_profile_btn span.ui-btn-text').text(t('Delete profile'));
        $('#headline1').html(t('Server Profiles'));

        $('#save_new_profile span.ui-btn-text').text(t('Save profile'));
        $('#save_login-text span.ui-btn-text').text(t('Save login data'));
        $('#server_profile-text').html(t('Profile Name:'));
        $('#server_protocol-text').html(t('Server Protocol'));
        $('#server_url-text').html(t('Server Url:'));
        $('#mobile_dir-text').html(t('Mobile Directory:'));
        $('#server_port-text').html(t('Port'));
        //$('#lz_version-text').html(t('Server version'));
        $('#login_name-text').html(t('Username:'));
        $('#login_passwd-text').html(t('Password:'));

        $('#save_edit_profile span.ui-btn-text').text(t('Save profile'));
        $('#edit_save_login-text span.ui-btn-text').text(t('Save login data'));
        $('#edit_server_profile-text').html(t('Profile Name:'));
        $('#edit_server_protocol-text').html(t('Server Protocol'));
        $('#edit_server_url-text').html(t('Server Url:'));
        $('#edit_mobile_dir-text').html(t('Mobile Directory:'));
        $('#edit_server_port-text').html(t('Port'));
        //$('#edit_lz_version-text').html(t('Server version'));
        $('#edit_login_name-text').html(t('Username:'));
        $('#edit_login_passwd-text').html(t('Password:'));
    } else {
        loopCounter++;
        setTimeout(function() {fillStringsFromTranslation(selectedIndex);}, 50);
    }
}

function parseUrl(tmpUrl) {
    var returnObject = {};
    if (tmpUrl.indexOf('://') == -1) {
        tmpUrl = 'http://' + tmpUrl;
    }
    var urlParts = tmpUrl.split('://');
    //console.log(urlParts);
    returnObject.server_protocol = urlParts[0] + '://';
    if (returnObject.server_protocol == 'https://') {
        returnObject.server_port = '443';
    } else {
        returnObject.server_port = '80';
    }
    tmpUrl = urlParts[1];
    if (tmpUrl.indexOf(':') != -1) {
        urlParts = tmpUrl.split(':');
        returnObject.server_url = urlParts[0];
        tmpUrl = urlParts[1];
        if (tmpUrl.indexOf('/') != -1) {
            urlParts = tmpUrl.split('/');
            returnObject.server_port = urlParts[0];
            for (var i=1; i<urlParts.length; i++) {
                returnObject.server_url += '/' + urlParts[i];
            }
        } else {
            returnObject.server_port = tmpUrl;
        }
    } else {
        returnObject.server_url = tmpUrl;
    }
    return returnObject;
}

function combineUrl(protocol, url, port) {
    var combinedUrl = protocol;
    if (url.indexOf('/') != -1) {
        var urlParts = url.split('/');
        combinedUrl += urlParts[0];
        if ((protocol == 'http://' && port != '80') || (protocol == 'https://' && port != '443')) {
            combinedUrl += ':' + port;
        }
        for (var i=1; i<urlParts.length; i++) {
            combinedUrl += '/' + urlParts[i];
        }
    } else {
        combinedUrl += url;
        if ((protocol == 'http://' && port != '80') || (protocol == 'https://' && port != '443')) {
            combinedUrl += ':' + port;
        }
    }
    return combinedUrl;
}

$(document).ready(function () {
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
    // load the storage values and fill the profile select list
    lzm_commonStorage.loadProfileData();
    var selectedIndex = (typeof lzm_commonStorage.loadValue('last_chosen_session') != 'undefined' &&
        lzm_commonStorage.loadValue('last_chosen_profile') != 'undefined' &&
        lzm_commonStorage.loadValue('last_chosen_profile') != null) ?
        lzm_commonStorage.loadValue('last_chosen_profile') : -1;
    var chosenProfile = {language: ''};
    if (selectedIndex != -1) {
        chosenProfile = lzm_commonStorage.getProfileByIndex(selectedIndex);
    }

    lzm_commonDisplay = new CommonDisplayClass(runningFromApp);
    if (!runningFromApp) {
        var urlParts = lzm_commonTools.getUrlParts();
        lzm_commonTranslation = new CommonTranslationClass(urlParts.protocol, urlParts.urlBase + ':' +
            urlParts.port + urlParts.urlRest, urlParts.mobileDir, false, chosenProfile.language);
    } else {
        if (chosenProfile != null) {
            lzm_commonTranslation = new CommonTranslationClass('', '', true, chosenProfile.language);
        } else {
            lzm_commonTranslation = new CommonTranslationClass('', '', true, 'en');
        }
    }
    fillStringsFromTranslation(selectedIndex);

    // read the url of this file and split it into the protocol and the base url of this installation
    var thisUrlParts = lzm_commonTools.getUrlParts();
    var thisUrl = thisUrlParts.urlBase + thisUrlParts.urlRest;


    var unsafed_data = false;

    var thisLoginData = $('.login_data');

    var thisChangeConfig = $('.change-config');
    var thisEditLoginName = $('#edit_login_name');
    var thisEditLoginPassword = $('#edit_login_passwd');
    var thisEditSaveLogin = $('#edit_save_login');
    var thisEditServerProfile = $('#edit_server_profile');
    var thisEditServerUrl = $('#edit_server_url');
    var thisEditMobileDir = $('#edit_mobile_dir');
    var thisEditServerPort = $('#edit_server_port');
    var thisEditLzVersion = $('#edit_lz_version');

    var thisServerProfile = $('#server_profile');
    var thisServerUrl = $('#server_url');
    var thisMobileDir = $('#mobile_dir');
    var thisSaveLogin = $('#save_login');
    var thisLoginName = $('#login_name');
    var thisLoginPassword = $('#login_passwd');
    var thisLzVersion = $('#lz_version');

    if (selectedIndex != -1) {
        thisChangeConfig.removeClass('ui-disabled');
    }

    if (runningFromApp == false) {
        $('.server-data').css({display: 'none'});
        thisSaveLogin.prop('checked', true).checkboxradio("refresh");
        $('#login_name').textinput('enable');
        $('#login_passwd').textinput('enable');
    }

    $('#back_btn').click(function () {
        goBackToLogin();
    });

    $('#clear_btn').click(function() {
        lzm_commonStorage.clearLocalStorage();
    });

    $('#server_profile_selection').change(function () {
        if ($(this).val() != -1) {
            thisChangeConfig.removeClass('ui-disabled');
        } else {
            thisChangeConfig.addClass('ui-disabled');
        }
        $('#new_profile_form').css('display', 'none');
        $('#edit_profile_form').css('display', 'none');
    });

    $('.data-input').change(function() {
        unsafed_data = true;
    });

    $('#new_profile_btn').click(function () {
        $('#no-profile').prop('selected', 'true');
        $('#server_profile_selection').selectmenu('refresh');
        $('#edit_profile_btn').addClass('ui-disabled');
        $('#del_profile_btn').addClass('ui-disabled');


        if (!runningFromApp)
            $('#server_url').val(thisUrl);

        $('#new_profile_form').css('display', 'block');
        $('#edit_profile_form').css('display', 'none');
    });

    $('#edit_profile_btn').click(function () {
        var dataSet = lzm_commonStorage.getProfileByIndex($('#server_profile_selection').val());
        $('#profile_index').val(dataSet.index);
        $('#edit_server_profile').val(dataSet.server_profile);

        var tmpEditUrl = combineUrl(dataSet.server_protocol, dataSet.server_url, dataSet.server_port);
        $('#edit_server_url').val(tmpEditUrl);
        $('#edit_mobile_dir').val(dataSet.mobile_dir);

        if (runningFromApp == false || dataSet.login_name != '' || dataSet.login_passwd != '') {
            thisEditLoginName.val(dataSet.login_name);
            thisEditLoginPassword.val(dataSet.login_passwd);
            thisEditSaveLogin.prop('checked', true).checkboxradio("refresh");
            thisLoginData.textinput('enable');
        } else {
            thisEditLoginName.val('');
            thisEditLoginPassword.val('');
            thisEditSaveLogin.prop('checked', false).checkboxradio("refresh");
            thisLoginData.textinput('disable');
        }
        $('#edit_profile_form').css('display', 'block');
        $('#new_profile_form').css('display', 'none');
    });

    $('#del_profile_btn').click(function () {
        lzm_commonStorage.deleteProfile($('#server_profile_selection').val());
        $('#new_profile_form').css('display', 'none');
        $('#edit_profile_form').css('display', 'none');
        lzm_commonDisplay.fillProfileSelectList(lzm_commonStorage.storageData, runningFromApp, -1);
        $('#edit_profile_form').css('display', 'none');
        $('#new_profile_form').css('display', 'none');

        $('#no-profile').prop('selected', 'true');
        $('#server_profile_selection').selectmenu('refresh');
        $('#edit_profile_btn').addClass('ui-disabled');
        $('#del_profile_btn').addClass('ui-disabled');
        lzm_commonStorage.saveValue('last_chosen_profile', -1);
        goBackToLogin();
    });

    $('.save_login').click(function () {
        if ($(this).prop('checked') == true) {
            thisLoginData.textinput('enable');
        } else {
            thisLoginData.textinput('disable');
        }
    });

    $('#save_new_profile').click(function () {
        unsafed_data = false;
        var dataSet = {};
        dataSet.index = -1;
        dataSet.server_profile = thisServerProfile.val();

        var myNewUrlParts = parseUrl(thisServerUrl.val());
        dataSet.server_url = myNewUrlParts.server_url;
        dataSet.mobile_dir = thisMobileDir.val().replace(/^\//, '').replace(/\/$/, '');
        dataSet.server_protocol = myNewUrlParts.server_protocol;
        dataSet.server_port = myNewUrlParts.server_port;

        dataSet.lz_version = thisLzVersion.val();
        if (thisSaveLogin.prop('checked') == true) {
            dataSet.login_name = thisLoginName.val();
            dataSet.login_passwd = thisLoginPassword.val();
        } else {
            dataSet.login_name = '';
            dataSet.login_passwd = '';
        }

        //console.log(dataSet);
        var safedIndex = lzm_commonStorage.saveProfile(dataSet);
        lzm_commonDisplay.fillProfileSelectList(lzm_commonStorage.storageData, runningFromApp, safedIndex);

        thisServerProfile.val('');
        thisServerUrl.val('');
        thisLoginName.val('');
        thisLoginPassword.val('');
        thisSaveLogin.prop('checked', false).checkboxradio("refresh");
        thisLoginData.textinput('disable');
        $('#new_profile_form').css('display', 'none');
        lzm_commonStorage.saveValue('last_chosen_profile', safedIndex);
        goBackToLogin();
    });

    $('#save_edit_profile').click(function () {
        unsafed_data = false;
        var dataSet = {};
        dataSet.index = $('#profile_index').val();
        dataSet.server_profile = thisEditServerProfile.val();

        var myEditUrlParts = parseUrl(thisEditServerUrl.val());
        dataSet.server_url = myEditUrlParts.server_url;
        dataSet.mobile_dir = thisEditMobileDir.val().replace(/^\//, '').replace(/\/$/, '');
        dataSet.server_protocol = myEditUrlParts.server_protocol;
        dataSet.server_port = myEditUrlParts.server_port;

        dataSet.lz_version = thisEditLzVersion.val();
        if (thisEditSaveLogin.prop('checked') == true) {
            dataSet.login_name = thisEditLoginName.val();
            dataSet.login_passwd = thisEditLoginPassword.val();
        } else {
            dataSet.login_name = '';
            dataSet.login_passwd = '';
        }

        //console.log(dataSet);
        var safedIndex = lzm_commonStorage.saveProfile(dataSet);
        lzm_commonDisplay.fillProfileSelectList(lzm_commonStorage.storageData, runningFromApp, safedIndex);

        thisEditServerProfile.val('');
        thisEditServerUrl.val('');
        thisEditServerPort.val('');
        thisEditLoginName.val('');
        thisEditLoginPassword.val('');
        thisEditSaveLogin.prop('checked', false).checkboxradio("refresh");
        thisLoginData.textinput('disable');
        $('#edit_profile_form').css('display', 'none');
        $('#edit_profile_btn').addClass('ui-disabled');
        $('#del_profile_btn').addClass('ui-disabled');
        lzm_commonStorage.saveValue('last_chosen_profile', safedIndex);
        goBackToLogin();
    });

    lzm_commonDisplay.createLayout();
    if (runningFromApp) {
        setTimeout(function() {
            lzm_commonDisplay.createLayout();
        }, 200);
        setTimeout(function() {
            lzm_commonDisplay.createLayout();
        }, 1000);
        setTimeout(function() {
            lzm_commonDisplay.createLayout();
        }, 5000);
    }

    $(window).resize(function () {
        lzm_commonDisplay.createLayout();
        if (runningFromApp) {
            setTimeout(function() {
                lzm_commonDisplay.createLayout();
            }, 200);
            setTimeout(function() {
                lzm_commonDisplay.createLayout();
            }, 1000);
            setTimeout(function() {
                lzm_commonDisplay.createLayout();
            }, 5000);
        }
    });

});
