function zwPanel(param,formId,validationCall,cookiePrefix,submissionRefId,trackbackTag,zStandaloneBaseUrl,varId){
this.zParam=param;
this.zFormId=formId;
this.zValidationCall=validationCall;
this.zCookiePrefix=cookiePrefix;
this.zSubmissionRefId=submissionRefId;
this.zTrackbackTag=trackbackTag;
this.zPostPause=2000;
this.zGotoParamParam;
this.zGotoParamPage;
this.zGotoParamLink;
this.zGotoBasePage;
this.zTrackback;
this.zExternalFormUrl;
this.zModalWidth;
this.zModalHeight;
this.zStandaloneBaseUrl=zStandaloneBaseUrl;
this.varId=varId;
zwPanel.prototype.qStringValue=zQStringValue;
zwPanel.prototype.setPageParams=zSetPageParams;
zwPanel.prototype.setBaseParams=zSetBaseParams;
zwPanel.prototype.gotoPage=zGotoPage;
zwPanel.prototype.gotoBase=zGotoBase;
zwPanel.prototype.gotoPageReturn=zGotoPageReturn;
zwPanel.prototype.gotoNextPage=zGotoNextPage;
zwPanel.prototype.gotoPrevPage=zGotoPrevPage;
zwPanel.prototype.redirect=zRedirect;
zwPanel.prototype.isRadioSelected=isRadioSelected;
zwPanel.prototype.getFieldValue=zGetFieldValue;
zwPanel.prototype.setFieldValue=zSetFieldValue;
zwPanel.prototype.defaultForm=zDefaultForm;
zwPanel.prototype.storeForm=zStoreForm;
zwPanel.prototype.submitZForm=zSubmitZForm;
zwPanel.prototype.submitZFormRedirect=zSubmitZFormRedirect;
zwPanel.prototype.hasForm=zHasForm;
zwPanel.prototype.getForm=zGetForm;
zwPanel.prototype.getFormBackup=zGetFormBackup;
zwPanel.prototype.isPageComplete=zIsPageComplete;
zwPanel.prototype.postSubmissionVars=zPostSubmissionVars;
zwPanel.prototype.setExternalFormUrl=zSetExternalFormUrl;
zwPanel.prototype.formToCookies=zFormToCookies;
zwPanel.prototype.cookiesToForm=zCookiesToForm;
zwPanel.prototype.setEmailKey=zSetEmailKey;
zwPanel.prototype.getEmailKey=zGetEmailKey;
zwPanel.prototype.incrementPageCount=zIncrementPageCount;
zwPanel.prototype.decrementPageCount=zDecrementPageCount;
zwPanel.prototype.setPageCookieForNextPage=zSetPageCookieForNextPage;
zwPanel.prototype.getPageCookieForPrevPage=zGetPageCookieForPrevPage;
zwPanel.prototype.clearCookies=zClearCookies;
zwPanel.prototype.setC=zSetC;
zwPanel.prototype.getC=zGetC;
zwPanel.prototype.setZiftC=zSetZiftC;
zwPanel.prototype.getZiftC=zGetZiftC;
zwPanel.prototype.getSerializedData=zGetSerializedData;
zwPanel.prototype.loadSerialized=zLoadSerialized;
zwPanel.prototype.excludeFromTrackback=zExcludeFromTrackback;
zwPanel.prototype.getTrackbackLink=zGetTrackbackLink;
zwPanel.prototype.setTrackbacks=zSetTrackbacks;
}
function zGetFormId(){
return this.zFormId;
}
function zSetExternalFormUrl(url){
this.zExternalFormUrl=url;
}
function zQStringValue(param){
var query=document.location.search.substring(1);
if(query.length>0){
var params=query.split('&');
for(var i=0;i<params.length;i++){
var pos=params[i].indexOf('=');
var name=params[i].substring(0,pos);
var value=params[i].substring(pos+1);
if(name==param){
return value;
break;
}
}
}
return null
}
function isRadioSelected(fieldName){
var zForm=document.getElementById(this.zFormId);
if(zForm!=null){
var zChecked=false;
var elems=document.getElementsByName(fieldName);
for(var i=0;i<elems.length&&!zChecked;i++){
var elem=elems[i];
var id=elem.id;
if(elem.tagName.toLowerCase()=='input'&&elem.type=='radio'&&id.indexOf(fieldName)==0){
zChecked=elem.checked;
}
}
return zChecked;
}
return true;
}
function zSetPageParams(param,page,link){
this.zGotoParamParam=param;
this.zGotoParamPage=page;
this.zGotoParamLink=link;
}
function zSetBaseParams(base){
this.zGotoBasePage=base;
}
function zGotoPage(param,page,link,doSubmit,ignoreReset,modalWidth,modalHeight){
this.zModalWidth = modalWidth;
this.zModalHeight = modalHeight;
if(!ignoreReset)this.setBaseParams(null);
this.setPageParams(param,page,link);
if(doSubmit&&this.hasForm()){
var success=eval(this.zValidationCall);
if(success){
this.storeForm();
this.submitZForm();
}
}else{
this.storeForm();
this.gotoPageReturn();
}
}
function zGotoBase(base,param,page,link,doSubmit){
this.setBaseParams(base);
this.gotoPage(param,page,link,doSubmit,true);
}
function zRedirect(param,url,target){
this.setPageParams(param);
var doRedirect=false;
if(this.hasForm()){
doRedirect=eval(this.zValidationCall);
if(doRedirect){
this.storeForm();
this.submitZFormRedirect(url,target);
doRedirect=false;
}
}else{
doRedirect=true;
this.storeForm();
}
if(doRedirect){
if(target==null)
document.location.href=url;
else{
window.open(url);
}
}
}
function zIsPageComplete(param,step,page){
var isComplete=false;
try{
var stepId=step;
if(step=="next")
stepId=zGetNextPageInternal(param,page);
if(this.getC(this.zCookiePrefix+"step"+stepId)=="submitted")
isComplete=true;
}catch(err){
}
return isComplete;
}
function zGotoPageReturn(){
    var param=this.zGotoParamParam;
    var page=this.zGotoParamPage;
    var link=this.zGotoParamLink;
    var urlBase=document.location.href;
    if(urlBase.indexOf('#')!=-1){
        urlBase=urlBase.substring(0,urlBase.indexOf('#'));
    }
    var index=urlBase.indexOf('?');
    var prevPage='';
    var oldQuery='';
    if(index!=-1){
        oldQuery=urlBase.substring(index+1);
        urlBase=urlBase.substring(0,index);
    }
    var newQuery='';
    if(oldQuery.length>0){
    var found=false;
    var params=oldQuery.split('&');
    for(var i=0;i<params.length;i++){
        var pos=params[i].indexOf('=');
        var name=params[i].substring(0,pos);
        var value=params[i].substring(pos+1);
        if(name==param){
            if(newQuery.length>0)newQuery+='&';
            newQuery+=param+'='+page;
            found=true;
            prevPage=value;
        }else if(name!='zKey'&&name!='zSerial'&&name!='zContent'){
            if(newQuery.length>0)newQuery+='&';
            newQuery+=params[i];
        }
    }

    if(!found&&page&&page!='')
        newQuery+='&'+param+'='+page;
    }else{
    if(page&&page!='')
        newQuery=param+'='+page;
    }
    if(this.zGotoBasePage!=null){
        newQuery=newQuery.replace(/[&?]zPage=[^&]*/,'');
        newQuery=newQuery.replace(/[&?]zBase=[^&]*/,'');
        newQuery+="&zBase="+this.zGotoBasePage;
    }

    var nextPageLink = urlBase+'?'+newQuery;

    if (this.zModalWidth && this.zModalWidth != 'null' && this.zModalHeight && this.zModalHeight != 'null') {
    	//for modals, override url base with the standalone URL instead of the current page
    	nextPageLink = this.zStandaloneBaseUrl +'?'+newQuery;

    	Shadowbox.open({
            content:          nextPageLink,
            player:           "iframe",
            width:            this.zModalWidth,
            height:           this.zModalHeight
        });
    } else {
    	document.location.href=nextPageLink;
    }

}
function zGotoNextPage(param,link){
zGotoNextPageInternal(param,link);
}
function zGotoPrevPage(param,link){
var prevPage=this.getPageCookieForPrevPage();
this.decrementPageCount();
this.gotoPage(param,prevPage,link);
}
function zIncrementPageCount(){
var pageCount=this.getC(this.zCookiePrefix+'zPageCount');
if(pageCount==null||pageCount==''||(new Number(pageCount))<0)
pageCount=0;
this.setC(this.zCookiePrefix+'zPageCount',(new Number(pageCount)+1),10);
}
function zDecrementPageCount(){
var pageCount=this.getC(this.zCookiePrefix+'zPageCount');
if(pageCount==null||pageCount==''||(new Number(pageCount))<1)
pageCount=1;
this.setC(this.zCookiePrefix+'zPageCount',(new Number(pageCount)-1),10);
}
function zSetPageCookieForNextPage(value){
var pageCount=this.getC(this.zCookiePrefix+'zPageCount');
if(pageCount==null||pageCount=='')
pageCount=0;
this.setC(this.zCookiePrefix+'zPreviousPage_'+pageCount,value,10);
}
function zGetPageCookieForPrevPage(){
var pageCount=this.getC(this.zCookiePrefix+'zPageCount');
if(pageCount!=null&&pageCount!=''&&pageCount!=0){
pageCount=(new Number(pageCount))-1;
return this.getC(this.zCookiePrefix+'zPreviousPage_'+pageCount);
}
return'';
}
function zGetFieldValue(elem){
if(elem.tagName.toLowerCase()=='input'&&elem.getAttribute('ziftinternal')==null){
if(elem.type=='text'||elem.type=='hidden')return elem.value;
else if(elem.type=='checkbox')return elem.checked.toString();
else if(elem.type=='radio')return elem.checked.toString();
}else if(elem.tagName.toLowerCase()=='textarea'){
return elem.value;
}else if(elem.tagName.toLowerCase()=='select'){
return elem.selectedIndex.toString();
}
return null;
}
function zSetFieldValue(elem,value){
if(elem.getAttribute("cookie")&&elem.getAttribute("cookie")=='ignore')
return;
if(elem.tagName.toLowerCase()=='input'&&elem.getAttribute('ziftinternal')==null){
if(elem.type=='text')elem.value=value;
else if(elem.type=='hidden')elem.value=value;
else if(elem.type=='checkbox')elem.checked=(value==Boolean(true).toString());
else if(elem.type=='radio')elem.checked=(value==Boolean(true).toString());
}else if(elem.tagName.toLowerCase()=='textarea'){
elem.value=value;
}else if(elem.tagName.toLowerCase()=='select'){
elem.selectedIndex=value;
}
}
function zFormToCookies(zForm){
for(var i=0;i<zForm.length;i++){
var value=this.getFieldValue(zForm.elements[i]);
if(value){
this.setC(this.zCookiePrefix+zForm.elements[i].id,value,10);
}
}
}
function zCookiesToForm(zForm){
for(var i=0;i<zForm.length;i++){
if(zForm.elements[i].id=="emailKey"){
this.setFieldValue(zForm.elements[i],this.getEmailKey());
}else{
var value=this.getC(this.zCookiePrefix+zForm.elements[i].id);
if(value)
this.setFieldValue(zForm.elements[i],value);
}
}
}
function zClearCookies(){
var cookies=document.cookie.split(';');
for(var i=0;i<cookies.length;i++){
var c=cookies[i];
while(c.charAt(0)==' ')c=c.substring(1,c.length);
if(c.indexOf(this.zCookiePrefix)==0&&c.indexOf('zpreviouspage')==-1&&c.indexOf('zpagecount')==-1){
var parts=c.split('=');
this.setC(parts[0],'',1);
}
}
}
function zGetSerializedData(){
if(this.getForm()!=null)
this.formToCookies(this.getForm());
var cookies=document.cookie.split(';');
var serial='';
var zKey='k'+Math.floor(Math.random()*1001);
for(var i=0;i<cookies.length;i++){
var c=cookies[i];
while(c.charAt(0)==' ')c=c.substring(1,c.length);
if(c.indexOf(this.zCookiePrefix)==0&&!this.excludeFromTrackback(c)){
var parts=c.split('=');
if(serial!='')serial+='&';
serial+=encodeURI(zKey+parts[0].substring(this.zCookiePrefix.length))+'='+encodeURI(parts[1]);
}
}
return'zKey='+zKey+'&zSerial='+encodeURIComponent(serial);
}
function zLoadSerialized(){
var key=this.qStringValue('zKey');
var serial=this.qStringValue('zSerial');
if(key!=null&&key!=''){
this.clearCookies();
var serials=decodeURIComponent(serial).split('&');
for(var i=0;i<serials.length;i++){
var field=serials[i];
var name=decodeURI(field.split('=')[0]);
var value=decodeURI(field.split('=')[1]);
this.setC(this.zCookiePrefix+name.substring(key.length),value,1);
}
}
}
function zExcludeFromTrackback(param){
if(param.indexOf('zpreviouspage')!=-1||param.indexOf('zpagecount')!=-1||param.indexOf(this.zSubmissionRefId)!=-1){
return true;
}
var value=param.split('=')[1];
if(value=='false'||value=='')return true;
return false;
}
function zGetTrackbackLink(){
if(this.zTrackback!=null&&this.zTrackback!='')
return this.zTrackback;
this.zTrackback=document.location.href;
if(this.zTrackback.indexOf('?')==-1)this.zTrackback+='?';
else this.zTrackback+='&';
this.zTrackback+=this.getSerializedData();
return this.zTrackback;
}
function zSetTrackbacks(){
var elems=document.getElementsByName(this.zTrackbackTag);
for(var i=0;i<elems.length;i++){
if(elems[i].tagName.toLowerCase()=='a')elems[i].href=this.getTrackbackLink();
else if(elems[i].tagName.toLowerCase()=='span'||elems[i].tagName.toLowerCase()=='textarea')elems[i].innerHTML=this.getTrackbackLink();
}
}
function zSetC(name,value,days){
var expires='';
if(days){
var date=new Date();
date.setTime(date.getTime()+(days*24*60*60*1000));
var expires='; expires='+date.toGMTString();
}
document.cookie=name.toLowerCase()+'='+value+expires+';SameSite=None; Secure ;path=/';
}
function zSetZiftC(name,value,days){
this.setC(this.zCookiePrefix+name,value,days);
}
function zGetC(name){
var nameEQ=name.toLowerCase()+'=';
var ca=document.cookie.split(';');
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==' ')c=c.substring(1,c.length);
if(c.indexOf(nameEQ)==0)return c.substring(nameEQ.length,c.length);
}
return null;
}
function zGetZiftC(name){
return this.getC(this.zCookiePrefix+name);
}
function zDefaultForm(){
if(this.getForm()!=null)
this.cookiesToForm(this.getForm());
}
function zHasForm(){
return this.getForm()!=null;
}
function zStoreForm(){
if(this.hasForm()){
if(document.getElementById(this.zSubmissionRefId).value==''){
var rand=Math.floor(Math.random()*1000000000000001);
document.getElementById(this.zSubmissionRefId).value=rand;
}
try{
this.formToCookies(this.getForm());
}catch(err){}
return true;
}
return false;
}
function zPause(millis){
var date=new Date();
var curDate=null;
do{curDate=new Date();}
while(curDate-date<millis);
}
function zSubmitZForm(){
var n='f'+Math.floor(Math.random()*99999);
var d=document.createElement('DIV');
d.innerHTML='<iframe style="display:none" src="about:blank" id="'+n+'" name="'+n+'" onload="zFormComplete(\''+n+'\', ' + this.varId + ')"></iframe>';
document.body.appendChild(d);
var form=this.getForm();
var cont=true;
if(form.id!=this.zFormId){
var backup=this.getFormBackup();
if(backup){
form.setAttribute("onsubmit",backup.getAttribute("onsubmit"));
form.setAttribute("action",backup.getAttribute("action"));
form.setAttribute("method",backup.getAttribute("post"));
}else{
cont=false;
this.gotoPageReturn();
}
}
if(cont){
this.getForm().setAttribute('target',n);
this.getForm().submit();
}
}
function zFormComplete(id, _this){
try{
var i=document.getElementById(id);
if(i.contentDocument){
var d=i.contentDocument;
}else if(i.contentWindow){
var d=i.contentWindow.document;
}else{
var d=window.frames[id].document;
}
if(d.location.href=="about:blank"){
return;
}
}catch(err){}
_this.gotoPageReturn();
}
function zSubmitZFormRedirect(url,target){
var n='f'+Math.floor(Math.random()*99999);
var d=document.createElement('DIV');
var form=this.getForm();
if(form.id!=this.zFormId){
var backup=this.getFormBackup();
if(backup){
form.setAttribute("onsubmit",backup.getAttribute("onsubmit"));
form.setAttribute("action",backup.getAttribute("action"));
form.setAttribute("method",backup.getAttribute("post"));
}
}
d.innerHTML='<iframe style="display:none" src="about:blank" id="'+n+'" name="'+n+'" onload="zFormCompleteRedirect(\''+n+'\', \''+url+'\', \''+target+'\')"></iframe>';
document.body.appendChild(d);
this.getForm().setAttribute('target',n);
this.getForm().submit();
}
function zFormCompleteRedirect(id,url,target){
try{
var i=document.getElementById(id);
if(i.contentDocument){
var d=i.contentDocument;
}else if(i.contentWindow){
var d=i.contentWindow.document;
}else{
var d=window.frames[id].document;
}
if(d.location.href=="about:blank"){
return;
}
}catch(err){}
if(target!='undefined'&&target!=null){
window.open(url);
}else{
document.location.href=url;
}
}
function zPostSubmissionVars(submissionVars){
var dHidden=document.createElement('DIV');
dHidden.style.display="none";
var f=document.createElement('FORM');
f.name='f'+Math.floor(Math.random()*99999);
f.action=this.zExternalFormUrl;
var inputVars=document.createElement('INPUT');
inputVars.type="text";
inputVars.name="submissionVars";
inputVars.value=submissionVars;
f.appendChild(inputVars);
var inputRefId=document.createElement('INPUT');
inputRefId.type="text";
inputRefId.name=this.zSubmissionRefId;
inputRefId.value=this.getC(this.zCookiePrefix+this.zSubmissionRefId);
f.appendChild(inputRefId);
dHidden.appendChild(f);
document.body.appendChild(dHidden);
var n='f'+Math.floor(Math.random()*99999);
var d=document.createElement('DIV');
d.innerHTML='<iframe style="display:none" src="about:blank" id="'+n+'" name="'+n+'"></iframe>';
document.body.appendChild(d);
f.setAttribute('target',n);
f.submit();
zPause(this.zPostPause);
}
function zSetEmailKey(){
var ekey=this.qStringValue("CakeUUID");
if(ekey!=null&&ekey!=''&&ekey.indexOf('[mailing_id]')==-1)
this.setC("emailkey",ekey);
}
function zGetEmailKey(){
return this.getC("emailkey");
}
function zGetForm(){
if(z_getIEVersion()<=8){
var fb=this.getFormBackup();
if(fb&&fb.parentNode){
var forms=zS(":parent form");
if(forms&&forms.length>0)
return forms[0];
}
if(document.getElementById(this.zFormId)){
return document.getElementById(this.zFormId);
}
}else{
if(document.getElementById(this.zFormId)){
return document.getElementById(this.zFormId);
}
var fb=this.getFormBackup();
if(fb&&fb.parentNode){
var forms=zS(":parent form");
if(forms&&forms.length>0)
return forms[0];
}
}
}
function zGetFormBackup(){
if(document.getElementById(this.zFormId+"_bak")){
return document.getElementById(this.zFormId+"_bak");
}
return null;
}
function z_getIEVersion(){
var rv=999;
try{
if(navigator.appName=='Microsoft Internet Explorer'){
var ua=navigator.userAgent;
var re=new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
if(re.exec(ua)!=null)
rv=parseFloat(RegExp.$1);
}
}catch(err){}
return rv;
}
