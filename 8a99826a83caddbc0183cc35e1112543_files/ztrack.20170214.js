function zExtCook(val) {if ((ec = document.cookie.indexOf(";", val)) == -1) {ec = document.cookie.length;}return unescape(document.cookie.substring(val,ec));}

function ZTrack(objs) {
    this.host = objs["h"];
    this.id = objs["i"];
    this.pid = objs["p"];
    this.cid = objs["c"];
    this.t = objs["t"];
    this.uuid = null;
    this.cname = "_ZIFT_UA";
    this.legacy = "zift-user";
    this.loadTime = new Date().getTime();
    this.uuid_holder = null;
    this.durationSent = false;

    this.init = function(){
        this.uuid_holder = this.getRandomId();
        this.assignLegacyValues();
        this.bindOnload();
        this.bindLinks();
        this.bindActiveElements();
        this.bindUnload();
    };

    this.buildBasicReference = function(conv) {
        return 'id=' + this.id + '&clid=' + this.cid + '&u=' + this.uuid + '&ekey=' + this.getEmailKey() + "&p=" + this.pid + "&uuid_holder=" + this.uuid_holder + (conv? '&conv=' + conv : '');
    };


    /* view events */
    this.bindOnload = function() {
        this.triggerViewEvent();
    };

    this.triggerViewEvent = function(conv) {
        var url = this.host + 'trk/v?' + this.buildBasicReference(conv) + '&fr=true' + "&refurl=" + escape(this.getReferer());
        this.fireViewEvent(url);
    };

    this.fireViewEvent = function(url) {
        var sc=document.createElement('script');
        sc.setAttribute("type","text/javascript");
        sc.setAttribute("src", url);
        sc.onload = sc.onreadystatechange = zBind(this.processViewLoad, this, sc);
        document.getElementsByTagName("head")[0].appendChild(sc);
    };

    this.processViewLoad = function(sc) {
        try {
            this.uuid = eval(this.uuid_holder).uuid;
            document.getElementsByTagName("head")[0].removeChild(sc);


            try {
                if (this.uuid) {
                    var iuds = document.getElementsByName("zt_uuid");
                    if (iuds) {
                        for (var i = 0; i < iuds.length; i ++) {
                            iuds[i].value = this.uuid;
                        }
                    }
                }
            } catch (err) {}
        } catch (e) {};
    };


    /* link events */
    this.bindLinks = function() {
        var links;
        if (this.t == "t") {
            links = zS("a");
        }
        else {
            links = zS("a", document.getElementById("pw_" + this.id));
        }

        var i = 0;
        for (i = 0; i < links.length; i++ ) {
            var link = links[i];
            var href = link.href;
            if (link.hasAttribute("ztrack") && link.getAttribute("ztrack") != "false") {
                if (link.getAttribute("ztrack") != "true")
                    href = link.getAttribute("ztrack");
            } else {
                if (href.match("#$") == "#") continue;
                if (link.getAttribute('ztm') == "ignore") continue;
            }

            var title;
            var conv = false;

            // check title elem, default var if present
            if (link.hasAttribute('title')) {
                title = link.getAttribute('title');
            }

            // Story 4693 - use the zconversion value as the title of the event
            // if conversion present, set var and override title passed to processors
            if (link.hasAttribute('zconversion')) {
                conv = true;
                title = link.getAttribute('zconversion');
            }

            link.onclick = this.chain(link.onclick, zBind(this.triggerClickEvent, this, link, href, title, conv));
        }
    };

    this.bindActiveElements = function() {
        var elements;
        if (this.t == "t") {
            elements = zS('[ztrack]:not("a")');
        }
        else {
            elements = zS('[ztrack]:not("a")', document.getElementById("pw_" + this.id));
        }

        var elementsCount = elements.length;
        for (var i = 0; i < elementsCount; i++ ) {
            var element = elements[i];

            if (element.hasAttribute("ztrack") && element.getAttribute("ztrack") == "false")
                continue;

            var title="An active element that is not a link";
            var conv = false;

            if (element.hasAttribute("title") && element.getAttribute("title") != "")
                title = element.getAttribute("title");
            else if (element.hasAttribute("name") && element.getAttribute("name") != "")
                title = element.getAttribute("name");

            if (element.hasAttribute('zconversion')) {
                conv = true;
                title = element.getAttribute('zconversion');
            }

            var target="#";
            if (element.hasAttribute("ztrack") && element.getAttribute("ztrack") != "true")
                target = element.getAttribute("ztrack");

            element.onclick = this.chain(element.onclick, zBind(this.triggerClickEvent, this, element, target, title, conv));
        }
    };

    this.chain = function(o, n) {
        if (o && typeof o == 'function') {
            return function(e) {
                n.call(this, arguments);
                return o.call(this, arguments);
            };
        } else {
            return function(e) {
                return n.call(this, arguments);
            };
        }
    }

    this.triggerClickEvent = function(elem, href, title, conv, e) {
        var url = this.host + 'trk/c?' + this.buildBasicReference(conv) + '&url=' + escape(href) + (title ? '&title=' + escape(title) : '');
        this.fireIMGEvent(url);
        return true;
    };

    this.triggerClickEventOverrideReferer = function(elem, href, e) {
        var url = this.host + 'trk/c?' + this.buildBasicReference(false) + '&url=' + escape(href) + (elem.title? '&title=' + escape(elem.title) : '') + '&refurl=' + escape(this.getReferer());
        this.fireIMGEvent(url);
        return true;
    };

    this.fireIMGEvent = function(url) {
        var random = Math.random();
        var i = document.createElement("img");
        i.src = url + "&random=" + random;
        i.style.width = "1px";
        i.style.height = "1px";
        i.style.border = "none";
        i.onload = zBind(this.recordIMGEvent, this, i);
        document.body.appendChild(i);
    };

    this.recordIMGEvent = function(e) {
        document.body.removeChild(e);
    };


    /* unload events */
    this.bindUnload = function() {
        zAddOnUnload(zBind(this.triggerExitEvent, this));
    };


    this.triggerExitEvent = function() {
        if(!this.durationSent) {
            var duration = (new Date().getTime() - this.loadTime) / 1000;
            var url = this.host + 'trk/v?' + this.buildBasicReference() + '&fr=true' + "&duration=" + duration;
            this.fireIMGEvent(url);
            this.durationSent = true;
        }
    };


    /* helpers */
    this.getReferer = function() {
        if (document.referrer) {
            return document.referrer;
        }
        return "";
    };

    this.getEmailKey = function() {
        var ekey = "";
        try {
            var ek = this.getQueryStringValue("CakeUUID");
            if (ek != null && ek != "" && ek.indexOf("[mailing_id]") == -1)
                ekey = ek;

            if (!ekey) {
                eKey = zExtCook("emailkey")
            }

        } catch (exception) {
        }
        return ekey;
    };

    this.getQueryStringValue = function(param) {
        var q=document.location.search.substring(1);
        if (q.length > 0){
            var params=q.split('&');
            for (var i=0 ; i<params.length ; i++){
                var pos = params[i].indexOf('=');
                var name = params[i].substring(0, pos);
                var value = params[i].substring(pos + 1);
                if (name == param) {
                    return value;
                    break;
                }
            }
        }
        return null
    };

    this.preventDefault = function(e) {
        if (e) e.preventDefault? e.preventDefault() : e.returnValue = false;
    };

    this.assignLegacyValues = function() {
        var nameEQ = this.legacy + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) {
                this.uuid = c.substring(nameEQ.length,c.length);
                break;
            }
        }
    };

    this.getRandomId = function() {
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var string_length = 8;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return "zt_" + randomstring;
    };


    this.init();
}
