// ==UserScript==
// @name        Asylamba Better Communications
// @namespace   Akaito
// @include     http://game.asylamba.com/s8/map
// @include     http://game.asylamba.com/s8/map*
// @updateURL   https://github.com/Akulen/Asylamba-User-Script/raw/master/better_communications.user.js
// @version     1.01
// @grant       GM_xmlhttpRequest
// ==/UserScript==

var $ = unsafeWindow.jQuery;

var processing = false;
var ready = false;
var sectorInfoUrl = "https://docs.google.com/spreadsheets/d/1gMNGdc247dNcmmBQRig3zaeuB7aezVnSNSTwWXkEwZE/pub?output=csv";
var sectorInfo = [];
var sectorBool = false;

var tactical_pic = "http://game.asylamba.com/s8/public/media/faction/data/tactical.png";
var diplomacy_pic = "http://game.asylamba.com/s8/public/media/faction/data/diplomacy.png";

function addCss(newCss)
{
	if(!$('#custom-css').length)
	{
		$("head").append('<style id="custom-css" type="text/css"></style>');
	}
	$('#custom-css').append(newCss);
}

function createIcon()
{
  addCss("#moreInfo{ bottom: 20px; left: 80px; z-index: 1000; position: absolute; display: inline-block; height: 2pc; padding: 3px 0px; background: transparent url('http://game.asylamba.com/s8/public/css/src/desktop/map/bOption.png') repeat-x scroll 0% 0%; }");
  addCss("#moreInfo a img { position: absolute; top: 5px; left: 5px; width: 22px;}");
  addCss("#moreInfo::before { content: ''; position: absolute; display: block; left: -10px; top: 0px; height: 38px; width: 10px; background: transparent url('http://game.asylamba.com/s8/public/css/src/desktop/map/bLeftOption.png') repeat scroll 0% 0%; }");
  addCss("#moreInfo::after { content: ''; position: absolute; display: block; right: -10px; top: 0px; height: 38px; width: 10px; background: transparent url('http://game.asylamba.com/s8/public/css/src/desktop/map/bRightOption.png') repeat scroll 0% 0%; }");
  addCss("#moreInfo a { position: relative; display: inline-block; height: 30px; width: 30px; margin: 1px 0px 1px 1px; background: #0A0A0A none repeat scroll 0% 0%; }");
  addCss("#moreInfo a.active { background: #B17A00 none repeat scroll 0% 0%; }");
  var sectorInfoDiv = document.createElement('div');
  sectorInfoDiv.innerHTML = '<div id="moreInfo"><a id="sectorInfo" class="sh hb lb" href="#" title="Infos"><img src="'+tactical_pic+'" alt="minimap"></a><a id="zoom" class="sh hb lb" href="#" title="Zoom"><img src="'+diplomacy_pic+'" alt="minimap"></a></div>';
  document.getElementById("container").appendChild(sectorInfoDiv);
  document.getElementById('sectorInfo').addEventListener('click', toggleSectorInfo, false);
  document.getElementById('zoom').addEventListener('click', toggleZoom, false);
}

function toggleSectorInfo()
{
	sectorBool = !sectorBool;
	toggleData();
}

function toggleZoom()
{
  var nZoom = prompt("Nouveau Zoom (compris entre 0 et 1)");
  $("#map").css('-moz-transform','scale('+nZoom+')');
  $(".viewport").css('-moz-transform','scale('+String(1/nZoom)+')');
  $("#map").css('-webkit-transform','scale('+nZoom+')');
  $(".viewport").css('-webkit-transform','scale('+String(1/nZoom)+')');
}

function getData() {
  if(!ready  && !processing) {
    processing = true;
    GM_xmlhttpRequest({
  			method: "GET",
  			url: sectorInfoUrl,
  			onload: function(response) {
      	var lines = response.responseText.split("\n");
      	for each (var res in lines) {
      	    var cur = res.split(",");
      	    if(parseInt(cur[0]) > 0) {
      	      sectorInfo[parseInt(cur[0])] = [cur[1]];
      	    }
      	  }
  				ready = true;
          processing = false;
  			}
  		});
  }
}

function toggleData() {
  getData();
  if(!ready)
    setTimeout(function() { toggleData(); }, 1000);
  else {
	  if(sectorBool)
	  	$("#sectorInfo").addClass("active");
	  else
	  	$("#sectorInfo").removeClass("active");
    sectorInfo.forEach(function (sector,i) {
      var color = "";
      var info = sector[0].substring(0, sector[0].length-1);
      var info2 = sector[0];
      if(sectorBool) {
        if(info == "Prioritaire" || info2 == "Prioritaire")
          color = "#307600";
        else if(info == "Gelé" || info2 == "Gelé")
          color = "#404040";
        else {
          color = "#1028A9";
          var infoBox = document.getElementById("sector-info-"+i);
          infoBox.getElementsByTagName("a")[0].href = sector[0];
        }
      }
      var bigSector = document.getElementById("sectors").firstChild.childNodes[i-1];
      bigSector.style.fill = color;
      var miniSector = document.getElementsByClassName("mini-map")[0].firstChild.childNodes[i-1];
      miniSector.style.fill = color;
    });
  }
}

function init() {
  createIcon();
}

init();

