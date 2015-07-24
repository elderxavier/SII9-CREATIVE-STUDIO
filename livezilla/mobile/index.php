<!--
/****************************************************************************************
 * LiveZilla index.php
 *
 * Copyright 2013 LiveZilla GmbH
 * All rights reserved.
 * LiveZilla is a registered trademark.
 *
 ***************************************************************************************/
-->
<!DOCTYPE HTML>
<html manifest="lzm.appcache">
<head>
    <title>
        Livezilla Mobile
    </title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta name="apple-itunes-app" content="app-id=710516100">

    <link rel="stylesheet" type="text/css" href="./js/jquery_mobile/jquery.mobile-1.3.0.min.css"/>
    <link rel="stylesheet" type="text/css" href="./css/livezilla.css"/>
    <link rel="shortcut icon" href="../images/favicon.ico" type="image/x-icon">

    <script type="text/javascript" src="./js/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="./js/jquery-migrate-1.2.1.min.js"></script>
    <script type="text/javascript" src="./js/jquery_mobile/jquery.mobile-1.3.0.min.js"></script>

    <script type="text/javascript" src="./js/jsglobal.js"></script>
    <script type="text/javascript" src="./js/md5.js"></script>

    <script type="text/javascript" src="./js/lzm/classes/CommonDeviceInterfaceClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonConfigClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonToolsClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonStorageClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonDisplayClass.js"></script>
    <script type="text/javascript" src="./js/lzm/classes/CommonTranslationClass.js"></script>
    <script type="text/javascript" src="./js/lzm/index.js"></script>
    <script type="text/javascript">
        window.addEventListener('load', function(e) {
            //logit('Load event');
            window.applicationCache.addEventListener('error', handleCacheError, false);
            window.applicationCache.addEventListener('checking', handleCacheEvent, false);
            window.applicationCache.addEventListener('cached', handleCacheEvent, false);
            window.applicationCache.addEventListener('downloading', handleCacheEvent, false);
            window.applicationCache.addEventListener('noupdate', handleCacheEvent, false);
            window.applicationCache.addEventListener('obsolete', handleCacheEvent, false);
            window.applicationCache.addEventListener('progress', handleCacheEvent, false);
            window.applicationCache.addEventListener('updateready', handleCacheEvent, false);
        }, false);

        var handleCacheError = function(e) {
            //logit('Error updating the app cache');
            //logit(e);
        };

        var logit = function(myString) {
            try {
                console.log(myString);
            } catch(e) {}
        };

        var handleCacheEvent = function(e) {
            //logit('Cache event');
            switch (e.type) {
                case 'noupdate':
                    //logit('NOUPDATE');
                    break;
                case 'downloading':
                    //logit('DOWNLOADING');
                    break;
                case 'checking':
                    //logit('CHECKING');
                    break;
                case 'progress':
                    //logit('PROGRESS');
                    break;
                case 'updateready':
                    //logit('UPDATEREADY');
                    try {
                        window.applicationCache.swapCache();
                        window.location.reload();
                    } catch(e) {}
                    break;
                default:
                    //logit('UKNOWN CACHE STATUS: ' + e.type);
                    break;
            }
        };
    </script>
</head>
<body>
<noscript>
<div id="no-js-warning" style="display: block;">
    <div style="position: fixed; top: 0px; left: 0px; width: 100%; background-color: #111; border: 1px solid #333; color: #fff">
        <h1 style="font-size: 1.5em; margin: 5px; text-align: center;">LiveZilla Mobile</h1>
    </div>
    <div style="margin-top: 69px; padding:42px; background: url('img/logo.png'); background-position: center; background-repeat: no-repeat;"></div>
    <p style="padding: 0px 20px; font-size: 1.5em;">
        Your browser seems to have Javascript disabled.<br />
        Since Javascript is needed for this application, you have to enable Javascript in your browser settings and reload this page.
    </p>
</div>
</noscript>
<div id="no-storage-warning" style="display: none;">
    <h1>No Cookies/local Storage available</h1>
</div>
<div id="login_page" data-role="page" style="display: none;">
    <header id="header_login" data-role="header" data-position="fixed">
        <h1 id="headline1" style="margin: 0.6em;"></h1>
    </header>
    <div id="content_login" data-role="content" style="overflow: visible;"> <!--article-->
        <div id="logo-container"></div>
        <div class="lzg-form" id="input-container">

            <div class="login-data" style="display: block;" id=login-container>
                <div id="username-container" data-role="none" style="margin-bottom:0.5em; padding-bottom: 0.2em;">
                    <label id="username-text" for="username"></label>
                    <input type="text" name="username" id="username" class="login-input" placeholder="Username" autocapitalize="off" autocorrect="off" />
                </div>
                <div id="password-container" data-role="none" style="margin-bottom:0.9em; padding-bottom: 0.2em;">
                    <label id="password-text" for="password"></label>
                    <input type="password" name="password" id="password" class="login-input" placeholder="Password" />
                </div>

                <fieldset data-role="controlgroup" id="save-login-question" style="display:none;">
                    <input type="checkbox" name="save_login" id="save_login" class="save_login" data-mini="true" />
                    <label id="save_login-text" for="save_login">&nbsp;</label>
                </fieldset>

                <div id="profile-container" data-role="none" style="margin-bottom:0.1em; padding-bottom: 0.2em;">
                    <select name="server_profile_selection" id="server_profile_selection" data-mini="true" style="display: none;">
                    </select>
                    <a href="#" data-role="button" id="configure_btn" data-mini="true" data-inline="true" data-icon="gear">&nbsp;</a>
                </div>
            </div>

            <div class="login-data" style="display: block; margin-top: 20px;">
                <div id="orientation_btn" class="lzm-unselectable"><span id="orientation_btn-inner">&nbsp;</span></div>
                <select name="user_status" id="user_status" data-mini="true" data-inline="true" data-iconpos="left">
                </select>
                <a href="#" data-role="button" id="login_btn" data-mini="true" data-inline="true" class="ui-disabled">&nbsp;</a>
            </div>
        </div>
        <form id="data-submit-form" method="post" data-ajax="false">
        </form>
    </div> <!--article-->
</div>

</body>
</html>
