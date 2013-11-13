﻿var $ = $ || {};
$.createMenu = function () {
    chrome.contextMenus.create.apply( null , arguments );
    return this
};
$.sendMessageToTab = chrome.tabs.sendMessage;
$.executeScriptInTab = chrome.tabs.executeScript;
$.queryTabs = chrome.tabs.query;
$.createTab = chrome.tabs.create;
$.updateMenu = chrome.contextMenus.update;
$.documentUrlPatterns = ["http://*/*", "https://*/*", "file:///*", "about:blank"];
$.localStorage.get( "isHuaCi" , function ( items ) {
    var isHuaCi = false, r = $.documentUrlPatterns;
    if ( items.isHuaCi ) {isHuaCi = true}
    $.createMenu( {id : "youdaoTranslate" , title : "用 有道 翻译“%s”" , documentUrlPatterns : r , contexts : [
        "selection"
    ]} ).createMenu( {id : "baiduTranslate" , title : "用 百度 翻译“%s”" , documentUrlPatterns : r , contexts : [
        "selection"
    ]} ).createMenu( {id : "enableWeb" , title : "用有道翻译当前网页" , documentUrlPatterns : r , contexts : [
        "all"
    ]} ).createMenu( {type : "separator" , id : "JustASeparator" , documentUrlPatterns : r , contexts : [
        "all"
    ]} ).createMenu( {type : "checkbox" , id : "enableSeletion" , title : "划词翻译" , documentUrlPatterns : r , contexts :
        [
            "all"
        ] , checked : isHuaCi} ).createMenu( {type : "separator" , id : "JustASeparatorToo" , documentUrlPatterns : r , contexts :
        ["all"]} ).createMenu( {id : "helpMe" , documentUrlPatterns : r , contexts : ["all"] , title : "支持作者"} )
} );
chrome.contextMenus.onClicked.addListener( function ( info , tab ) {
    var selectionText = info.selectionText, c = info.checked, tabId = tab.id, callback = function ( msg ) {$.sendMessageToTab( tabId , {from : "background" , sign : "trans_result" , tran : msg.tran , isFrame : info.frameUrl , pos : msg.pos || null} )};
    switch ( info.menuItemId ) {
        case"youdaoTranslate":
            $.query( {tran : selectionText} , "yd" , callback );
            break;
        case"baiduTranslate":
            $.query( {tran : selectionText} , "bd" , callback );
            break;
        case"enableSeletion":
            $.localStorage.set( {"isHuaCi" : info.checked} );
            break;
        case"enableWeb":
            $.sendMessageToTab( tabId , {from : "background" , sign : "webTran"} );
            break;
        case"helpMe":
            $.createTab( {url : "https://me.alipay.com/lmk123"} );
            break
    }
} );
chrome.storage.onChanged.addListener( function ( changes , areaName ) {$.queryTabs( {} , function ( tabs ) {for ( var x = 0, y = tabs.length ; x < y ; x += 1 ) {$.sendMessageToTab( tabs[x].id , {isOpen : changes.isHuaCi.newValue , from : "background" , sign : "selectionCheckedChange"} )}} )} );
chrome.runtime.onMessage.addListener( function ( msg ) {
    switch ( msg.sign ) {
        case"copy":
            $.copy( msg.data );
            break
    }
} );
var _gaq = _gaq || [];
_gaq.push( ["_setAccount", "UA-43276752-1"] );
_gaq.push( ["_trackPageview"] );
(function () {
    var ga = document.createElement( "script" );
    ga.type = "text/javascript";
    ga.async = true;
    ga.src = "https://ssl.google-analytics.com/ga.js";
    var s = document.getElementsByTagName( "script" )[0];
    s.parentNode.insertBefore( ga , s )
})();