/* This script replaces the modal with a normal link when a gated resource is accessed on a banner widget via iPhone*/ 
var userAgent = window.navigator.userAgent;
    var isIOS = false;

    
 function modalScrub() {
var modalScrub = document.getElementsByClassName("cta");
var i;	 
for (i = 0; i < modalScrub.length; i++) {
	 var temp = modalScrub[i].outerHTML;
    temp = temp.replace('800,600','null,null'); 
	modalScrub[i].outerHTML = temp;
}	 
 }
 if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
 modalScrub();
 }