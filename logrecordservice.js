/**
 * Project          : UBA-user behavior analysis
 * Version      : 2.0
 * Depends on   : jQuery.js,hc.common.js
 * Author           :front-end web developer(FED)   zhuyangyang
 * create:2013-3-26
 */
var pageFirstOper="";
var sysFirstOper="";
if(typeof(pageIdOper)=='undefined'){
    var pageIdOper="";
}
(function(w,d){
    if (typeof jQuery ==='undefined'||typeof w['HC'] ==='undefined'||HC.UBA){
        return;
    }
    var $ = jQuery;
    var hc = w['HC'];
    hc['exposure']={};
    hc['PAGE_ID']= new hc.UUID().createUUID();
    /*
    * 工具模块
    * */
    Tool={
        /*
        * 控制台调试代码
        * */
        printLog:function(){
            try {
                console.log(arguments);
            } catch (e) {
                // not support console method (ex: IE)
            }
        },
        /*
        * json转string
        * */
        jsonToString:function (obj) {
            var S = [];
            var J = "";
            if (Object.prototype.toString.apply(obj) === '[object Array]') {
                for (var i = obj; i < obj.length; i++)
                    S.push(this.jsonToString(obj[i]));
                J = '[' + S.join(',') + ']';
            }
            else if (Object.prototype.toString.apply(obj) === '[object Date]') {
                J = "new Date(" + obj.getTime() + ")";
            }
            else if (Object.prototype.toString.apply(obj) === '[object RegExp]' || Object.prototype.toString.apply(obj) === '[object Function]') {
                J = obj.toString();
            }
            else if (Object.prototype.toString.apply(obj) === '[object Object]') {
                for (var i in obj) {
                    var obj2={};
                    obj2[i] = typeof (obj[i]) == 'string' ? '"' + obj[i] + '"' : (typeof (obj[i]) === 'object' ? this.jsonToString(obj[i]) : obj[i]);
                    S.push(i + ':' + obj2[i]);
                }
                J = '{' + S.join(',') + '}';
            }
            return J;
        },
        /*
        * 去除空格
        * */
        trimSpaces:function(Str) {
            var resultStr = "";
            var temp = Str.split(/\s/);
            for(i = 0; i < temp.length; i++){
                resultStr += temp[i];
            }
            return resultStr;
        },
        /*
        * 截取字符串，一个汉字算两个字符
        * */
        substr:function (str,len) {
            if(!str||!len) {return;}
            var a = 0;
            var i = 0;
            var temp="";
            for (i=0;i<str.length;i++){
                if (str.charCodeAt(i)>255){
                    a+=2;
                }
                else{ a++; }
                if(a>len) {return temp;}
                temp += str.charAt(i);
            }
            //如果全部是单字节字符，就直接返回源字符串
            return str;
        }
    }
    /*
    * 用户行为分析模块
    * */
    HC['UBA']={
        version:"2.5.01",
        ubaConditional:{
            hostnames:["my.b2b.hc360.com","www.hc360.com","s.hc360.com","info.b2b.hc360.com","bbs.hc360.com","shehui.hc360.com","hr.hc360.com","d.hc360.com","www.fair.hc360.com","www.top10.hc360.com","top.hc360.com","credit.hc360.com","www.im.hc360.com","www.chat.hc360.com","info.hc360.com","pifa.hc360.com","org.hc360.com","baumachina2012.hc360.com","m.hc360.com","www.toys.hc360.com","www.edu.hc360.com","www.biz.hc360.com","www.secu.hc360.com","www.electric.hc360.com","www.printing.hc360.com","www.paper.hc360.com","www.a.hc360.com","www.tele.hc360.com","www.cm.hc360.com","www.med.hc360.com","www.ec.hc360.com","www.water.hc360.com","www.hvacr.hc360.com","www.it.hc360.com","www.chem.hc360.com","www.auto-a.hc360.com","www.av.hc360.com","www.xjd.hc360.com","www.ceramic.hc360.com","www.pharm.hc360.com","www.coatings.hc360.com","www.plas.hc360.com","www.oil.hc360.com","www.jieju.hc360.com","www.auto-m.hc360.com","www.broadcast.hc360.com","www.hotel.hc360.com","www.auto.hc360.com","www.homea.hc360.com","www.audio.hc360.com","www.pf.hc360.com","www.qipei.hc360.com","www.pharmacy.hc360.com","www.fire.hc360.com","www.leather.hc360.com","www.office.hc360.com","www.textile.hc360.com","www.cloth.hc360.com","www.machine.hc360.com","www.ep.hc360.com","www.jj.hc360.com","www.bm.hc360.com","www.traffic.hc360.com","www.gift.hc360.com","www.energy.hc360.com","www.motor.hc360.com","www.food.hc360.com","www.metal.hc360.com","www.sport.hc360.com","www.service.hc360.com","www.fushi.hc360.com","www.piju.hc360.com","www.lamp.hc360.com","www.wujin.hc360.com","www.steel.hc360.com","www.beauty.hc360.com","www.jewelry.hc360.com","www.shoes.hc360.com","www.screen.hc360.com","www.huicong.hc360.com","www.laser.hc360.com","www.pv.hc360.com","www.mt.hc360.com","www.ceo.hc360.com","www.finance.hc360.com","www.house.hc360.com","www.b2b.hc360.com","www.nongji.hc360.com","www.instrument.hc360.com","www.bpq.hc360.com","www.power.hc360.com","www.op.hc360.com","www.fruit.hc360.com","www.nh.hc360.com","www.weldcut.hc360.com","www.rubber.hc360.com","www.hp.hc360.com","www.jiaju.hc360.com","www.nc.hc360.com","www.flower.hc360.com","www.bjp.hc360.com","www.shipin.hc360.com","www.shipol.hc360.com","www.solar.hc360.com","www.chinabreed.hc360.com","www.syc.hc360.com","www.ganxi.hc360.com","www.carec.hc360.com","www.zl.hc360.com","www.fs.hc360.com","www.ehome.hc360.com","www.tea.hc360.com","www.engine.hc360.com","www.agri.hc360.com","www.momo.hc360.com","www.clean.hc360.com","www.hunjia.hc360.com","www.pcrm.hc360.com","www.glass.hc360.com","www.led.hc360.com","www.printer.hc360.com","www.print-c.hc360.com","www.shicai.hc360.com","www.jgj.hc360.com","www.jdpj.hc360.com","www.jcdd.hc360.com","www.zs.hc360.com","www.jjcn.hc360.com","www.ledp.hc360.com","www.unite.hc360.com","www.pt.hc360.com","www.shaxian.hc360.com","www.siwang.hc360.com","www.yx.hc360.com","www.zyz.hc360.com","www.canyin.hc360.com","www.cs.hc360.com","www.cmp.hc360.com","www.js.hc360.com","www.sp.hc360.com","www.cc.hc360.com","www.floor.hc360.com","www.huafei.hc360.com","www.ll.hc360.com","www.nk.hc360.com","www.suoju.hc360.com","www.baozhuang.hc360.com","www.shuma.hc360.com","www.nongyao.hc360.com","www.feed.hc360.com","www.daoju.hc360.com","www.zc.hc360.com","www.mc.hc360.com","www.nvz.hc360.com","www.dd.hc360.com","www.bag.hc360.com","www.artware.hc360.com","www.motors.hc360.com","www.chilun.hc360.com","www.jsj.hc360.com","www.bgjj.hc360.com","www.gcgj.hc360.com","www.tz.hc360.com","www.nanz.hc360.com","www.jxjg.hc360.com","www.liantiao.hc360.com","www.fj.hc360.com","www.lj.hc360.com","www.sf.hc360.com","www.san.hc360.com","www.jeans.hc360.com","www.neiyi.hc360.com","www.jinshu.hc360.com","www.shirt.hc360.com","www.csyp.hc360.com","www.muju.hc360.com","www.th.hc360.com","www.zcdy.hc360.com","www.bossmba.hc360.com","www.seed.hc360.com","www.zyc.hc360.com","www.fojiao.hc360.com","www.ddgj.hc360.com","www.sdgj.hc360.com","www.qdgj.hc360.com","www.fl.hc360.com","www.ttm.hc360.com","www.ml.hc360.com","www.wl.hc360.com","www.wash.hc360.com","www.schl.hc360.com","www.sjd.hc360.com","www.chugui.hc360.com"]
        },
        ubaParam:{
            loadtime:"",
            common:{},
            element:{},
            logrecorddetail:{},
            logrecordpage:{}
        },
        ubaFn:{
            getPageSpeed:function(){
                if(hc.startTime&&hc.startTime!=""){
                    st=Math.ceil(hc.UBA.ubaParam.loadtime-hc.startTime);
                    return st;
                }
                else{
                    return 0;
                }
            },
            getAgent:function(){
                var ua = navigator.userAgent.toLowerCase();
                return ua;
            },
            getpagetype:function(){
                var ifrtrue="";
                try{
                    w.top.location.href;
                }
                catch(exp){
                    var ifrtrue=2;
                }
                if(ifrtrue!=2){
                    w.location.href==w.top.location.href?ifrtrue=0:ifrtrue=1;
                    if(w.top.location.href==undefined){
                        var ifrtrue=2;
                    }
                }
                return ifrtrue;
            },
            getcurrentUrl:function(){
                var u=this.geturlhtml(w.location.href);
                this.decodeUrlstate(1)==1?u=this.geturlhtml(w.location.href):u=decodeURIComponent(u);
                /*记录页面类型为‘申请买卖通页面’*/
                if(u=="http://b2b.hc360.com/intro/sqmmt.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,apply_renewals.html"||u=="http://my.b2b.hc360.com/my/turbine/template/corcenter,company,applymmt.html"){
                    hc.UBA.ubaParam.common.opercode=1;
                    hc.UBA.ubaParam.logrecordpage.oc=1;
                }
                /*记录页面类型为‘注册页面’*/
                if(u=="http://b2b.hc360.com/mmtTrade/reg_b/reg.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,reg_buy.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,reg.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,reg_simple_step.html"||u=="http://my.b2b.hc360.com/my/turbine/template/corcenter,company,makeup_step.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,reg_free.html"||u=="http://my.b2b.hc360.com/my/turbine/template/firstview,reg_operation.html"){
                    hc.UBA.ubaParam.common.opercode=9;
                    hc.UBA.ubaParam.logrecordpage.oc=9;
                }
                /*页面为‘内嵌iframe(同域)’时*/
                if(hc.UBA.ubaFn.getpagetype()==1){
                    this.decodeUrlstate(2)==2?hc.UBA.ubaParam.common.curOrgUrl=d.referrer:hc.UBA.ubaParam.common.curOrgUrl=decodeURIComponent(d.referrer);
                    var c=w.top.location.href;
                    this.decodeUrlstate(3)==3?c=w.top.location.href:c=decodeURIComponent(w.top.location.href);
                    return this.rewriteUrl(c);
                }
                /*页面为‘正常页面’时*/
                /*页面为‘内嵌iframe(跨域)’时*/
                else{
                    this.decodeUrlstate(1)==1?hc.UBA.ubaParam.common.curOrgUrl=w.location.href:hc.UBA.ubaParam.common.curOrgUrl=decodeURIComponent(w.location.href);
                    return this.rewriteUrl(hc.UBA.ubaParam.common.curOrgUrl);
                }
            },
            getpreviewUrl:function(){
                /*页面为‘内嵌iframe(同域)’时*/
                if(hc.UBA.ubaFn.getpagetype()==1){
                    this.decodeUrlstate(1)==1?hc.UBA.ubaParam.common.preOrgUrl=w.location.href:hc.UBA.ubaParam.common.preOrgUrl=decodeURIComponent(w.location.href);
                }
                /*页面为‘正常页面’时*/
                /*页面为‘内嵌iframe(跨域)’时*/
                else{
                    this.decodeUrlstate(2)==2?hc.UBA.ubaParam.common.preOrgUrl=d.referrer:hc.UBA.ubaParam.common.preOrgUrl=decodeURIComponent(d.referrer);
                }
                return this.rewriteUrl(hc.UBA.ubaParam.common.preOrgUrl);
            },
            getdomainstr:function(url){
                if(url!=""){
                    if(url.substring(0,8)=='https://'){
                        var url1=url.substring(8,url.length-1);
                    }
                    if(url.substring(0,7)=='http://'){
                        var url1=url.substring(7,url.length-1);
                    }
                    var url2=url1.split('/');
                    var url3=url2[0];
                    return url3;
                }
            },
            geturlhtml:function(url){
                var urlstr=url.substr(0,url.indexOf('?'));
                urlstr==""?url=url:url=urlstr;
                return url;
            },

            //发送页面级用户行为日志
            sendUserlogsPage:function(){
                hc.UBA.ubaParam.common.pageId=hc.PAGE_ID;
                hc.UBA.ubaParam.logrecordpage.pi=hc.PAGE_ID;
                if(d.referrer!=""){
                    this.decodeUrlstate(2)==2?hc.UBA.ubaParam.logrecordpage.pu=d.referrer:hc.UBA.ubaParam.logrecordpage.pu=decodeURIComponent(d.referrer);
                    hc.UBA.ubaParam.logrecordpage.pu=encodeURIComponent(hc.UBA.ubaParam.logrecordpage.pu);
                }
                hc.UBA.ubaParam.logrecordpage.ot="1";
                if(location.protocol=="https:"){
                    $.getJSON("https://logrecords.hc360.com/logrecordservice/logrecordget?callback=?", hc.UBA.ubaParam.logrecordpage);
                    /*
                    $.ajax({
                        url: 'https://log.org.hc360.com/logrecordservice/logrecordget?callback=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        timeout: 5000,
                        data:hc.UBA.ubaParam.logrecordpage,
                        complete:function(){

                        }
                    });
                    */
                }
                else{
                    //$.getJSON("http://log.org.hc360.com/logrecordservice/logrecordget?callback=?", hc.UBA.ubaParam.logrecordpage);
                    $.ajax({
                        url: 'http://log.org.hc360.com/logrecordservice/logrecordget?callback=?',
                        type: 'GET',
                        dataType: 'jsonp',
                        timeout: 5000,
                        data:hc.UBA.ubaParam.logrecordpage,
                        complete:function(){
                            //console.log('complete');
                        }
                    });
                }
            },
            //发送元素级用户行为日志
            sendUserlogsElement:function(name,value){
                var hc360visitid =HC.HUB.LocalCookie.get("hc360visitid");
                if(hc360visitid && hc360visitid != ""){
                    hc.UBA.ubaParam.common.visitId=HC.HUB.LocalCookie.get('hc360visitid');
                }
                var hc360_userid =HC.HUB.LocalCookie.get("hc360_userid");
                if(hc360_userid && hc360_userid != ""){
                    hc.UBA.ubaParam.common.userId=HC.HUB.LocalCookie.get('hc360_userid');
                }
                if(name!=""&&name!=undefined){
                    /*新增参数，获取点击的元素，获取其自定义变量*/
                    var eobj=$("[data-useractiveelement]");
                    if($("[data-useractiveelement]").attr('data-detailbcid')!=undefined){
                        hc.UBA.ubaParam.element.detailbcid=$("[data-useractiveelement]").attr('data-detailbcid');
                    }
                    eobj.removeAttr('data-useractiveelement');
                    if(name.split('?')[1]&&name.split('?')[1].split("=")[1]){
                       hc.UBA.ubaParam.element.useractivelogs=name.split('?')[0];
                       hc.UBA.ubaParam.element.detailbcid=name.split('?')[1].split("=")[1];
                    }
                    else{
                        hc.UBA.ubaParam.element.useractivelogs=name;
                    }
                    /*记录监控的标签是否是页面中第一个操作的元素*/
                    if(pageFirstOper===""){
                        pageFirstOper='1';
                        hc.UBA.ubaParam.element.pageFirstOper='1';
                    }
                    else{
                        pageFirstOper='0';
                        hc.UBA.ubaParam.element.pageFirstOper='0';
                    }
                    if(hc.UBA.ubaFn.getpagetype()==1){
                        if(w.top.pageIdOper!==""&&typeof(w.top.pageIdOper!="undefined")){
                            hc.UBA.ubaParam.element.pageId=w.top.pageIdOper;
                        }
                        if(w.top.pageFirstOper===""){
                            w.top.pageFirstOper='1';
                            hc.UBA.ubaParam.element.pageFirstOper='1';
                        }
                        else{
                            w.top.pageFirstOper='0';
                            hc.UBA.ubaParam.element.pageFirstOper='0';
                        }
                    }
                    /*记录监控的标签是否是商务中心、商铺系统中第一个操作的元素
                     *1.初始化cookie中的hccordet默认为00；
                     *2.当操作的是商务中心系统页面（排除注册页）的元素时，判断hccordet第一位是否为0，为0，则改为1，为1，则不变。
                     *3.当操作的是商铺系统页面的元素时，判断hccordet第二位是否为0，为0，则改为1，为1，则不变。
                     *4.既不是商务中心也不是商铺系统的页面时，发送的sysFirstOper=0；
                     * */
                    var url=hc.UBA.ubaFn.getcurrentUrl();
                    var hn=hc.UBA.ubaFn.getdomainstr(url);
                    var hh=hc.UBA.ubaFn.geturlhtml(url);
                    var s=HC.HUB.LocalCookie.get('hccordet');
                    if(s&&s!==""){
                        var sc=s.substring(0,1);
                        var sd=s.substring(1,2);
                        if(hn=='my.b2b.hc360.com'&&hh!='http://my.b2b.hc360.com/my/turbine/template/firstview,reg_buy.html'&&hh!='http://my.b2b.hc360.com/my/turbine/template/firstview,reg.html'&&hh!='http://my.b2b.hc360.com/my/turbine/template/firstview,reg_simple_step.html'&&hh!='http://my.b2b.hc360.com/my/turbine/template/corcenter,company,makeup_step.html'&&hh!='http://my.b2b.hc360.com/my/turbine/template/firstview,reg_free.html'&&hh!='http://my.b2b.hc360.com/my/turbine/template/firstview,reg_operation.html'){
                            //现在操作的是商务中心元素
                            if(sc=='0'){
                                sysFirstOper='1';
                                hc.UBA.ubaParam.element.sysFirstOper='1';
                                var newhccordet="1"+sd;
                                HC.HUB.LocalCookie.set({key:'hccordet',value:newhccordet,domain:'hc360.com',path:'/'})
                            }
                            else{
                                sysFirstOper='0';
                                hc.UBA.ubaParam.element.sysFirstOper='0';
                            }
                        }
                        else if(hn=='detail.b2b.hc360.com'){
                            //现在操作的是商铺元素
                            if(sd=='0'){
                                sysFirstOper='1';
                                hc.UBA.ubaParam.element.sysFirstOper='1';
                                var newhccordet=sc+"1";
                                HC.HUB.LocalCookie.set({key:'hccordet',value:newhccordet,domain:'hc360.com',path:'/'})
                            }
                            else{
                                sysFirstOper='0';
                                hc.UBA.ubaParam.element.sysFirstOper='0';
                            }
                        }
                        else{
                            sysFirstOper='0';
                            hc.UBA.ubaParam.element.sysFirstOper='0';
                        }
                    }
                    else{
                        sysFirstOper='0';
                        hc.UBA.ubaParam.element.sysFirstOper='0';
                    }
                    if(value!=""&&value!=undefined){
                        value.length>2000?hc.UBA.ubaParam.elemsent.useractivelogsvalue=value.substring(0,2000):hc.UBA.ubaParam.element.useractivelogsvalue=value;
                    }
                    else{
                        if(hc.UBA.ubaParam.element.useractivelogsvalue!==""&&typeof hc.UBA.ubaParam.element.useractivelogsvalue!=="undefined"){
                            delete hc.UBA.ubaParam.element.useractivelogsvalue;
                        }
                    }
                    hc.UBA.ubaParam.common.pageId=hc.PAGE_ID;
                    hc.UBA.ubaParam.logrecorddetail.common=hc.UBA.ubaParam.common;
                    hc.UBA.ubaParam.logrecorddetail.element=hc.UBA.ubaParam.element;
                    var lcp = Tool.jsonToString(hc.UBA.ubaParam.logrecorddetail);
                    var lcp=encodeURIComponent(lcp);
                    $('#UBA_useractivelogs').val(lcp);
                    $('#UBA_form').submit();
                }
            },
            getPageData:function(){
                if (typeof UBA_successPageFlag !='undefined'&&UBA_successPageFlag!==""){
                    hc.UBA.ubaParam.common.UBA_successPageFlag=UBA_successPageFlag;
                    hc.UBA.ubaParam.logrecordpage.UBA_sf=UBA_successPageFlag;
                }
                if (typeof UBA_nodeIp !='undefined'&&UBA_nodeIp!==""){
                    hc.UBA.ubaParam.common.UBA_nodeIp=UBA_nodeIp;
                    hc.UBA.ubaParam.logrecordpage.UBA_np=UBA_nodeIp;
                }
                if (typeof UBA_userid !='undefined'&&UBA_userid!==""){
                    hc.UBA.ubaParam.common.UBA_userid=UBA_userid;
                    hc.UBA.ubaParam.logrecordpage.UBA_ui=UBA_userid;
                }
                if (typeof UBA_pb !='undefined'&&UBA_pb!==""){
                    hc.UBA.ubaParam.common.UBA_pb=UBA_pb;
                    hc.UBA.ubaParam.logrecordpage.UBA_pb =UBA_pb ;
                }
            },
            //创建传输环境dom
            creatSendDom:function(){
                if(jQuery("#UBA_form").length==0){
                    if(location.protocol=="https:"){
                        $('body').append("<form action='https://logrecords.hc360.com/logrecordservice/logrecorddetail' id='UBA_form' name='UBA_form'  enctype='application/x-www-form-urlencoded' method='post' target='UBA_iframe' style='display:none'><input id='UBA_useractivelogs'  name='UBA_useractivelogs' value='0'/></form><iframe name='UBA_iframe' id='UBA_iframe' src='https://transit.hc360.com/transit/js/blank.html' style='display:none'></iframe>");
                    }
                    else{
                        $('body').append("<form action='http://log.org.hc360.com/logrecordservice/logrecorddetail' id='UBA_form' name='UBA_form'  enctype='application/x-www-form-urlencoded' method='post' target='UBA_iframe' style='display:none'><input id='UBA_useractivelogs'  name='UBA_useractivelogs' value='0'/></form><iframe name='UBA_iframe' id='UBA_iframe' style='display:none'></iframe>");
                    }
                }
            },
            getClientData:function(){
                this.creatSendDom();
                hc.UBA.ubaParam.common.screenX=w.screen.width;
                hc.UBA.ubaParam.logrecordpage.sx=w.screen.width;
                hc.UBA.ubaParam.common.screenY=w.screen.height;
                hc.UBA.ubaParam.logrecordpage.sy=w.screen.height;
                hc.UBA.ubaParam.common.pagetype=this.getpagetype();
                hc.UBA.ubaParam.logrecordpage.pt=this.getpagetype();
                if(hc.PAGE_ID&& hc.PAGE_ID!= ""){
                }
                else{
                    var pageId = new hc.UUID().createUUID();
                    hc.PAGE_ID = pageId;
                }
                pageIdOper=hc.PAGE_ID;
                hc.UBA.ubaParam.common.currentUrl=this.getcurrentUrl();
                if(typeof(HC)!=undefined){
                    hc.UBA.ubaParam.logrecordpage.ps=this.getPageSpeed();
                }
                if(d.referrer!=""){
                    hc.UBA.ubaParam.common.preViewUrl=this.getpreviewUrl();
                }
                var hc360visitid =HC.HUB.LocalCookie.get("hc360visitid");
                var hc360_userid =HC.HUB.LocalCookie.get("hc360_userid");
                var lastloginusers =HC.HUB.LocalCookie.get("lastloginusers");
                var hc360analyid =HC.HUB.LocalCookie.get("hc360analyid");
                var hc360analycopyid =HC.HUB.LocalCookie.get("hc360analycopyid");
                var hcbrowserid =HC.HUB.LocalCookie.get("hcbrowserid");
                if(hc360_userid && hc360_userid != ""){
                    hc.UBA.ubaParam.common.userId=hc360_userid;
                    hc.UBA.ubaParam.logrecordpage.ui=hc360_userid;
                }
                if(hc360visitid && hc360visitid != ""){
                    hc.UBA.ubaParam.common.visitId=hc360visitid;
                    hc.UBA.ubaParam.logrecordpage.vi=hc360visitid;
                }
                if(lastloginusers && lastloginusers != ""){
                    var a=HC.HUB.LocalCookie.get('lastloginusers');
                    var b=a.split(',');
                    if(b.length==1){
                        var c=b[0];
                    }
                    else{
                        var c=b[b.length-1].substring(0,b[b.length-1].length-1);
                    }
                    hc.UBA.ubaParam.common.username=c;
                    hc.UBA.ubaParam.logrecordpage.un=c;
                }
                if(hc360analyid && hc360analyid != ""){
                    hc.UBA.ubaParam.common.analyId=hc360analyid;
                    hc.UBA.ubaParam.logrecordpage.ai=hc360analyid;
                }
                else{
                    var analyid =new HC.UUID().createUUID();
                    hc.UBA.ubaParam.common.analyId=analyid;
                    hc.UBA.ubaParam.logrecordpage.ai=analyid;
                    HC.HUB.LocalCookie.set({key:'hc360analyid',value:analyid,domain:'hc360.com',path:'/'});
                }
                if(hc360analycopyid && hc360analycopyid != ""){
                    hc.UBA.ubaParam.common.analycopyId=hc360analycopyid;
                    hc.UBA.ubaParam.logrecordpage.aci=hc360analycopyid;
                }
                else{
                    var analycopyid =new HC.UUID().createUUID();
                    hc.UBA.ubaParam.common.analycopyId=analycopyid;
                    hc.UBA.ubaParam.logrecordpage.aci=analycopyid;
                    HC.HUB.LocalCookie.set({key:'hc360analycopyid',value:analycopyid,domain:'hc360.com',path:'/'});
                }
                if(hcbrowserid && hcbrowserid != ""){
                    hc.UBA.ubaParam.common.browserId=hcbrowserid;
                    hc.UBA.ubaParam.logrecordpage.bi=hcbrowserid;
                }
                else{
                    var browserid =new HC.UUID().createUUID();
                    hc.UBA.ubaParam.common.browserid=browserid;
                    hc.UBA.ubaParam.logrecordpage.bi=browserid;
                    HC.HUB.LocalCookie.set({key:'hcbrowserid',value:browserid,domain:'hc360.com',path:'/',day:3650});
                }
                var hccordet = HC.HUB.LocalCookie.get("hccordet");
                if(hccordet && hccordet != ""&& hccordet !=null){
                }
                else{
                    HC.HUB.LocalCookie.set({key:'hccordet',value:'00',domain:'hc360.com',path:'/'});
                }
                if(this.getAgent()!=""){
                    hc.UBA.ubaParam.common.agent=this.getAgent();
                }
                /*获取慧聪站前地址*/
                var hcp=/hcpreurl/;
                if(hcp.exec(document.cookie)){
                }
                else{
                    HC.HUB.LocalCookie.set({key:'hcpreurl',value:document.referrer,domain:'hc360.com',path:'/'});
                }
                this.getPageData();
            },
            decodeUrlstate:function(u){
                var us="0";
                switch(u){
                    case 1:try{decodeURIComponent(w.location.href);}catch(err){us="1";};break;
                    case 2:try{decodeURIComponent(d.referrer);}catch(err){us="2";};break;
                    case 3:try{decodeURIComponent(w.top.location.href);}catch(err){us="3";};break;
                }
                return us;
            },
            rewriteUrl:function(url){
                if(url.substr(0,7)=='http://'){
                    url2=url.substring(7,url.length);
                }
                if(url.substr(0,8)=='https://'){
                    url2=url.substring(8,url.length);
                }
                var wls=w.location.search;
                var wls=url.split('?');
                var uv="";
                if(wls!=""&&wls!=undefined){
                    if(wls[0].length!=url.length){
                        var uv=url.substring(wls[0].length+1,url.length)+"&";
                    }
                }
                for(var i=0;i<hc.UBA.ubaConditional.hostnames.length;i++){
                    if(hc.UBA.ubaConditional.hostnames[i]==this.getdomainstr(url)){
                        return url;
                    }
                }
                /*首页*/
                var patrn=/^([^.]+).b2b.hc360.com\/$/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/shop,homepage.html?username="+RegExp.$1;
                }
                /*供应终极页*/
                var patrn=/^([^.]+).b2b.hc360.com\/supply\/([0-9]+).html$/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/business,supply_detail.html?"+uv+"id="+RegExp.$2+"&username="+RegExp.$1+"&infotype=supply";
                }
                /*非商铺模板供应终极页*/
                var patrn=/\/supplyself\/([0-9]+).html$/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/business,supplydetailself.html?"+uv+"id="+RegExp.$1+"&infotype=supply";
                }
                /*求购终极页*/
                var patrn=/\/buy\/([0-9]+).html$/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/business,buy_detail.html?"+uv+"id="+RegExp.$1+"&infotype=buy";
                }
                /*产品/私密产品、采购专场终极页*/
                var patrn=/^([^.]+).b2b.hc360.com\/(product|privatepro)\/([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+","+RegExp.$2+"_detail.html?"+uv+"id="+RegExp.$3+"&username="+RegExp.$1+"&infotype="+RegExp.$2;
                }
                var patrn=/\/buymarket\/([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/buymarket,buymarket_detail.html?"+uv+"id="+RegExp.$1+"&infotype=buymarket";
                }
                /*企业名片、个人名片*/
                var patrn=/^([^.]+).b2b.hc360.com\/pubinfo\/([a-z]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/pubinfo,"+RegExp.$2+".html?"+uv+"username="+RegExp.$1;
                }
                /*产品系列*/
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/s_([a-z]+)-([0-9]+)-([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+","+RegExp.$3+".html?"+uv+"username="+RegExp.$1+"&page="+RegExp.$4+"&seriesid="+RegExp.$5;
                }
                /*商铺目录*/
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/businwindow-([0-9]+)-([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+",businwindow.html?username="+RegExp.$1+"&page="+RegExp.$3+"&seriesid="+RegExp.$4;
                }
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/busin-([0-9]+)-([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+",busin.html?username="+RegExp.$1+"&page="+RegExp.$3+"&seriesid="+RegExp.$4;
                }
                /*其它模块*/
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/([a-z]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+","+RegExp.$3+".html?"+uv+"username="+RegExp.$1;
                }
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/([a-z]+)-([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+","+RegExp.$3+".html?"+uv+"username="+RegExp.$1+"&page="+RegExp.$4;
                }
                var patrn=/^([^.]+).b2b.hc360.com\/([a-z]+)\/([a-z]+)-([0-9]+)-([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/"+RegExp.$2+","+RegExp.$3+".html?"+uv+"username="+RegExp.$1+"&page="+RegExp.$4+"&supcatid="+RegExp.$5;
                }
                /*采购专场超市分类列表页*/
                var patrn=/\/buymarket\/list\/([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/buymarket,buy_list.html?id="+RegExp.$1;
                }
                /*大买家500强列表页、大买家热门采购列表页*/
                var patrn=/\/buymarket\/([^.]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/buymarket,"+RegExp.$1+"_list.html";
                }
                /*商铺浏览大图
                 *商机终极页优化
                 */
                var patrn=/\/viewPics\/(([a-z]|_)+)\/([0-9]+).html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/viewPics,"+RegExp.$1+".html?pic_id="+RegExp.$3;
                }
                var patrn=/\/viewPics\/(.*).html/;
                if (patrn.exec(url2)){
                    if(uv!=""&&uv.substring(uv.length-1,uv.length)=="&"){
                        uv=uv.substring(0,uv.length-1);
                        return "http://detail.b2b.hc360.com/detail/turbine/template/viewPics,"+RegExp.$1+".html?"+uv;
                    }
                    else{
                        return "http://detail.b2b.hc360.com/detail/turbine/template/viewPics,"+RegExp.$1+".html";
                    }
                }
                /*商铺公司相册-flash版*/
                var patrn=/\/photography\/([0-9]+)-([0-9]+)\/flash.html/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/shop,albumshow.html?providerid="+RegExp.$1+"&albumid="+RegExp.$2;
                }
                 /*商铺公司相册-js版*/
                 var patrn=/\/photography\/([0-9]+)-([0-9]+)/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/shop,staticalbumshow.html?providerid="+RegExp.$1+"&albumid="+RegExp.$2;

                }
                /*买家 首页*/
                var patrn=/^([^.]+).b2b.hc360.com\/(buy\/|buy)/;
                if (patrn.exec(url2)){
                    return "http://detail.b2b.hc360.com/detail/turbine/template/buy,index.html?username="+RegExp.$1;
                }
                /*买家 除首页一套 (添加的页面名)*/
                var patrn=/^([^.]+).b2b.hc360.com\/buy\/([a-z]+).html/;

                if (patrn.exec(url2)){
                    if(uv!=""&&uv.substring(uv.length-1,uv.length)=="&"){
                        uv=uv.substring(0,uv.length-1);
                    }
                    return "http://detail.b2b.hc360.com/detail/turbine/template/buy,$2.html?username="+RegExp.$1+"&"+uv;
                }
                else{
                    return url;
                }
            },
            rejectUrl:function(u){
                var p=[
                    /info\..*\.hc360.com\/.*hc360\.com\/PicnewsList/,
                    /info\..*\.hc360.com\/.*\/bottom\.shtml/,
                    /info\..*\.hc360.com\/.*\/baidu\.shtml/,
                    /info\..*\.hc360.com\/.*\/hc360_textad\.shtml/,
                    /info\..*\.hc360.com\/.*\/cpgzyyal_gd\.shtml/,
                    /info\..*\.hc360.com\/.*\/jdt\.shtml/,
                    /info\..*\.hc360.com\/.*\/yzphb\.shtml/,
                    /info\..*\.hc360.com\/.*\/news_block_090716_sjh\.shtml/,
                    /info\..*\.hc360.com\/.*\/mmt_tradecenter\.shtml/,
                    /info\..*\.hc360.com\/.*\/mmt7\.shtml/,
                    /info\..*\.hc360.com\/.*\/pharmacy_sygd_block\.shtml/,
                    /info\..*\.hc360.com\/.*\/a_sygd_block\.shtml/,
                    /info\..*\.hc360.com\/.*\/sd_jdt\.shtml/,
                    /info\..*\.hc360.com\/.*\/top\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/hot\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/guangbo3\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/guangbo2\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/guangbo1\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/gqtuji\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dsbmbd\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dsb3\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dsb2\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dsb1\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dance1\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dance2\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/dance3\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/byy1\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/byy2\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/byy3\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/audio_sygd_block\.shtml/,
                    /info\..*\.hc360.com\/.*\/list\/jbwy\.shtml/,
                    /info\..*\.hc360.com\/.*agent_bottom\.shtml/,
                    /info\..*\.hc360.com\/list\/gqtuji\.shtml/
                ];
                var n="";
                for(var i=0;i<p.length;i++){
                    if(p[i].exec(u)){
                        n=1;
                    }
                }
                if(n==1){
                    return n;
                }
                else{
                    return 0;
                }
            }
        },
        ubaEvent:function(){
            $("[data-useractivelogs]").bind('mousedown',function(e){
                var $this=$(this);
                //debugger;
                $this.attr('data-useractiveelement',true);
                var uclvalue=$this.attr("data-useractivelogs");
                //根据标签不同，传输不同数据
                if(e.target.tagName=='INPUT')
                {
                    var type=$this.attr('type');
                    if(type=='text'||type=='password'){
                        $(this).change(function(){
                            if($this.val()!=""){

                                hc.UBA.ubaFn.sendUserlogsElement(uclvalue,$this.val());
                            }
                        });
                    }
                    else if(type=='radio'||type=='checkbox'){
                        hc.UBA.ubaFn.sendUserlogsElement(uclvalue,$this.val());
                    }
                    else{
                        hc.UBA.ubaFn.sendUserlogsElement(uclvalue);
                    }
                }
                else if(e.target.tagName=='SELECT'){
                    $this.change(function(){
                        hc.UBA.ubaFn.sendUserlogsElement(uclvalue,$this.find("option:selected").val());
                    });
                }
                else{
                    hc.UBA.ubaFn.sendUserlogsElement(uclvalue);
                }
                //$this.removeAttr('data-useractiveelement');
            });
            jQuery('body').click(function(){
                var hc5minbeat =HC.HUB.LocalCookie.get("hc5minbeat");
                if(hc5minbeat && hc5minbeat != ""){}
                else{
                    var analyid =new HC.UUID().createUUID();
                    hc.UBA.ubaParam.logrecordpage.ai=analyid;
                    HC.HUB.LocalCookie.set({key:'hc360analyid',value:analyid,domain:'hc360.com',path:'/'});

                    var analycopyid =new HC.UUID().createUUID();
                    hc.UBA.ubaParam.logrecordpage.aci=analycopyid;
                    HC.HUB.LocalCookie.set({key:'hc360analycopyid',value:analycopyid,domain:'hc360.com',path:'/'});
                }
                HC.HUB.LocalCookie.set({key:'hc5minbeat',value:new Date().getTime(),domain:'hc360.com',path:'/',day:0.00347});
            });
        },
        ubaInitpro:function(){
            if(HC['UBA'].ubaFn.rejectUrl(window.location.href)==1){
                return;
            }
            else{
                var nt=new Date();
                hc.UBA.ubaParam.loadtime=nt.getTime();
                hc.UBA.ubaFn.getClientData();
                hc.UBA.ubaFn.sendUserlogsPage();
            }
            /*B版注册页面*/
            if(hc.UBA.ubaFn.geturlhtml(w.location.href)=="http://b2b.hc360.com/mmtTrade/reg_b/reg.html"){
                HC.HUB.addEvent(window,hc.UBA.ubaEvent(),'load');
            }
            else{
                $(d).ready(function(){
                    hc.UBA.ubaEvent();
                });
            }
            var hc5minbeat =HC.HUB.LocalCookie.get("hc5minbeat");
            if(hc5minbeat && hc5minbeat != ""){}
            else{
                var analyid =new HC.UUID().createUUID();
                var analycopyid =new HC.UUID().createUUID();
                hc.UBA.ubaParam.logrecordpage.ai=analyid;
                hc.UBA.ubaParam.logrecordpage.aci=analycopyid;
                HC.HUB.LocalCookie.set({key:'hc360analyid',value:analyid,domain:'hc360.com',path:'/'});
                HC.HUB.LocalCookie.set({key:'hc360analycopyid',value:analycopyid,domain:'hc360.com',path:'/'});

            }
            HC.HUB.LocalCookie.set({key:'hc5minbeat',value:new Date().getTime(),domain:'hc360.com',path:'/',day:0.00347});
            /*2014.9.27新增逻辑  add by zhuyangyang
            *sessionid原有逻辑是5分钟失效，在现有基础上再造一个sessioncopyid，从外网进来也换session
            */
            var dr=hc.UBA.ubaFn.getdomainstr(document.referrer);
            if(dr!==""&&typeof(dr)!='undefined'&&dr.indexOf("hc360.com")===-1){//访前不是空并且不是慧聪页面的重新建session
                var analycopyid =new HC.UUID().createUUID();
                HC.HUB.LocalCookie.set({key:'hc360analycopyid',value:analycopyid,domain:'hc360.com',path:'/'});
            }
        }
    }
    /*
    * 其他业务模块
    * */
    var other={
        recorddata:{page:{},dsp:{},exp:{}},
        page:{
            isdsp:0,
            isexp:0
        },
        dsp:{
            jztype:"",
            jzid:"",
            sword:"",
            cls:"",
            ids:"",
            spt:""
        },
        exp:{
            exposurecompany:"",
            exposureproduct:"",
            exposureadvert:""
        },
        loadInit:function(){
            var url=hc.UBA.ubaFn.getcurrentUrl();
            var hn=hc.UBA.ubaFn.getdomainstr(url);
            var a=/http:\/\/www\..*\.hc360.com\/$/;           
            var flowurl="";          
            location.protocol=="https:"?flowurl="https://styles.hc360.com/js/build/source/widgets/flowconfig/hc.flowconfig.min.js":flowurl="http://style.org.hc360.com/js/build/source/widgets/flowconfig/hc.flowconfig.min.js";
            HC.HUB.addScript(flowurl,function(){
                /*
                * 智能平台曝光量
                * */
                if(jQuery("[data-exposurelog]").length>0||hn=='detail.b2b.hc360.com'){
                    var etime=new Date();
                    var exnum=etime.getTime().toString().substring(12,13);
                    var exnump=hcflowconfig.exp/10;
                    if(exnum<exnump){
                        other.page.isexp=1;
                        other.expfn.getexposuredata();
                    }    
                }
                /*
                * dsp广告
                * */
                var vinum=HC.HUB.LocalCookie.get("hc360visitid");
                var vinumh=vinum.substring(vinum.length-2,vinum.length);
                var vinuml=parseInt(vinumh,16);
                var vinump=256*hcflowconfig.dsp/100;
                if(vinuml<vinump||hc.UBA.ubaParam.logrecordpage.un=="jinjiangjiayi"||hc.UBA.ubaParam.logrecordpage.un=="zhuyangyang04"||hc.UBA.ubaParam.logrecordpage.un=="faban01"){
                    other.page.isdsp=1;
                    if(hn=='b2b.hc360.com'||hn=='detail.b2b.hc360.com'||a.exec(w.location.href)||hn=='my.b2b.hc360.com'||hn=='s.hc360.com'||window.location.href=="http://www.hc360.com/"){
                        if(location.protocol!="https:"){
                            other.dspfn.getjzid();
                        }
                    }
                }
                else{
                    if(other.page.isexp==1){
                        other.recorddata.page=other.page;
                        other.recorddata.dsp=other.dsp;
                        other.recorddata.exp=other.exp;
                        other.senddsplog(other.recorddata);
                    }
                }
				
                /*
                * 页面打开时间统计（performance）
                * */
                if(!window.performance){
					/*页面打开时间统计（名片信息） start add 2014-01-09 不支持html5的方式*/
					if((location.href.indexOf("IMManager/webimcordinfo.jsp")>0||location.href.indexOf("IMManager/cordinfoweb.jsp")>0)){
						var ltime=(new Date()).getTime();
						hc.UBA.ubaParam.logrecordpage.ps=ltime-hc.startTime;
						hc.UBA.ubaParam.logrecordpage.psfor="cordinfo";
						hc.UBA.ubaFn.sendUserlogsPage();
					}
					/*页面打开时间统计（名片信息） end*/
                }
                else{
                    var inforeg=/info\..*\.hc360.com/;
                    var localdomin=hc.UBA.ubaFn.getdomainstr(location.href);
					/*页面打开时间统计（名片信息） start add 2014-01-07*/
					if((location.href.indexOf("IMManager/webimcordinfo.jsp")>0||location.href.indexOf("IMManager/cordinfoweb.jsp")>0)){
						var pfm=window.performance;
						var timeobj={};
						timeobj.pid=hc.PAGE_ID;
						timeobj.pft={
							navigation:pfm.navigation,
							timing:pfm.timing
						}
						location.protocol=="https:"?$.getJSON("https://logrecords.hc360.com/logrecordservice/logrecordtime?callback=?", timeobj):$.getJSON("http://log.org.hc360.com/logrecordservice/logrecordtime?callback=?", timeobj);
					}
					/*页面打开时间统计（名片信息） end*/
					else{						
						if(!inforeg.test(localdomin)&&hc.UBA.ubaFn.getpagetype()==0){
							var tt=new Date().getTime();
							var ts= parseInt(tt.toString().substring(tt.toString().length-1, tt.toString().length));
							var tp=hcflowconfig.performance/10;
							if(ts<tp||hc.UBA.ubaParam.logrecordpage.un=="zhuyangyang04"||hc.UBA.ubaParam.logrecordpage.un=="jinjiangjiayi"){
								var pfm=window.performance;
								var timeobj={};
								timeobj.pid=hc.PAGE_ID;
								timeobj.pft={
									navigation:pfm.navigation,
									timing:pfm.timing
								}
								location.protocol=="https:"?$.getJSON("https://logrecords.hc360.com/logrecordservice/logrecordtime?callback=?", timeobj):$.getJSON("http://log.org.hc360.com/logrecordservice/logrecordtime?callback=?", timeobj);
							}
						}
					}			
                }
            });
        },
        senddsplog:function(data){
            jQuery('body').append("<form action='http://log.org.hc360.com/logrecordservice/logrecordother' id='other_form' name='other_form'  enctype='application/x-www-form-urlencoded' method='post' target='other_iframe' style='display:none'><input id='hcubaotherlog'  name='hcubaotherlog' value=''/></form><iframe name='other_iframe' id='other_iframe' style='display:none'></iframe>");
            var data=Tool.jsonToString(data);
            var data=encodeURIComponent(data);
            jQuery("#hcubaotherlog").val(data);
            jQuery("#other_form").submit();
        },
        /*DSP广告项目业务逻辑*/
        dspfn:{
            dspobj:{
                ddw:jQuery("[data-dsp-searchword]"),
                ddc:jQuery("[data-dsp-class]"),
                ddi:jQuery("[data-dsp-industry]"),
                dds:jQuery("[data-dsp-supertypes]")
            },
            //告知晶赞我已成功取到值：包括suceess和超时情况都算成功，其他算失败
            sendsucessimgtojz:function(){
                //var _image1=new Image();
                //_image1.src="http://cm.gtags.net/pixel?v=1";
                var ifr="<iframe style='width:1px;height:1px;position:fixed;_position:absolute;left:0px;top:0px;margin:0px;padding:0px;z-index:2147483648;display:none;' src='http://cms.gtags.net/w?a=7&xid="+HC.HUB.LocalCookie.get("hc360visitid")+"'></iframe>";
                jQuery('body').append(ifr);
            },
            sendsucessimgtoym:function(){
                var _image2=new Image();
                _image2.src="http://cm.emarbox.com/_cm?pt=3";
            },
            sendsucessimgtopy:function(){
                var _image3=new Image();
                _image3.src="http://cm.g.doubleclick.net/pixel?google_nid=ipy&google_cm";
                var _image4=new Image();
                _image4.src="http://acookie.tanx.com/cms.gif?id=29600513";
                var _image5=new Image();
                _image5.src="http://cm.pos.baidu.com/pixel?dspid=6418041";
            },
            /*获取晶赞id*/
            getjzid:function(){
                other.dsp.jztype="1";
                other.dsp.jzid="123456";
                other.dspfn.sendsucessimgtojz();
                other.dspfn.getymid();
                /*jQuery.ajax({
                    type: "GET",
                    url: "http://dat.gtags.net/imp/dajsonp",
                    dataType: "jsonp",
                    success: function(data) {
                        if(data){
                            other.dsp.jzid=data.bcid;
                            other.dsp.jztype="1";
                        }
                        else{
                            other.dsp.jzid=data.bcid+"123456";
                            other.dsp.jztype="1";
                        }
                    },
                    error: function(jqXHR, status, error){
                        other.dsp.jzid="123456";
                    },
                    complete:function(){
                        other.dspfn.sendsucessimgtojz();
                        other.dspfn.getymid();
                    }
                });*/
            },
            /*获取亿码id*/
            getymid:function(){
                jQuery.ajax({
                    type: "GET",
                    url: "http://cm.emarbox.com/_cg?jsoncallback=?",
                    dataType: "jsonp",
                    success: function(ymid){
                        if(ymid){
                            other.dsp.jzid=other.dsp.jzid+"#&#"+ymid.emarboxuserid;
                            if(other.dsp.jztype!=""){
                                other.dsp.jztype=other.dsp.jztype+"#&#2";
                            }
                            else{
                                other.dsp.jztype=2;
                            }
                        }
                    },
                    error: function(jqXHR, status, error){
                        if(other.dsp.jzid!=""){
                            other.dsp.jzid=other.dsp.jzid+"#&#"+"123456";
                        }
                    },
                    complete:function(){
                        other.dspfn.sendsucessimgtoym();
                        other.dspfn.getpyid();
                    }
                });
            },
            /*获取品友id*/
            getpyid:function(){
                jQuery.ajax({
                    type: "GET",
                    url: "http://cm.ipinyou.com/hc360/cms.js?call=?",
                    dataType: "jsonp",
                    data:{"hcid":HC.HUB.LocalCookie.get("hc360visitid")},
                    success: function(pyid) {
                        if(pyid){
                            other.dsp.jzid=other.dsp.jzid+"#&#"+pyid;
                            if(other.dsp.jztype!=""){
                                other.dsp.jztype=other.dsp.jztype+"#&#3";
                            }
                            else{
                                other.dsp.jztype=3;
                            }
                        }
                        else{
                            other.dsp.jzid=other.dsp.jzid+"#&#"+"123456";
                        }
                    },
                    error: function(jqXHR, status, error){
                        if(other.dsp.jzid!=""){
                            other.dsp.jzid=other.dsp.jzid+"#&#"+"123456";
                        }

                    },
                    complete:function(){
                        other.dspfn.sendsucessimgtopy();
                        other.dspfn.getdspdata();
                    }
                });
            },
            /*收集dsp数据*/
            getdspdata:function(){
                //this.getjzid();
                var sword="";
                var cls="";
                var ids="";
                var spt="";
                for(var i=0;i<this.dspobj.ddw.length;i++){
                    var swordall=this.dspobj.ddw[i].value;
                    var w=jQuery(this.dspobj.ddw[i]).attr('data-dsp-searchword');
                    sword===""?sword=encodeURIComponent(Tool.substr(w,30)):sword=sword+"#&#"+encodeURIComponent(Tool.substr(w,30));
                }
                for(var i=0;i<this.dspobj.ddc.length;i++){
                    var c=jQuery(this.dspobj.ddc[i]).attr('data-dsp-class');
                    cls===""?cls=c:cls=cls+"#&#"+c;
                }
                for(var i=0;i<this.dspobj.ddi.length;i++){
                    var d=jQuery(this.dspobj.ddi[i]).attr('data-dsp-industry');
                    ids===""?ids=d:ids=ids+"#&#"+d;
                }
                for(var i=0;i<this.dspobj.dds.length;i++){
                    var s=jQuery(this.dspobj.dds[i]).attr('data-dsp-supertypes');
                    spt===""?spt=s:spt=spt+"#&#"+s;
                }
                other.dsp.sword=sword;
                other.dsp.cls=cls;
                other.dsp.sword=sword;
                other.dsp.ids=ids;
                var statedsp=other.page.isdsp;
                var stateexp=other.page.isexp;
                other.page=hc.UBA.ubaParam.logrecordpage;
                other.page.isdsp=statedsp;
                other.page.isexp=stateexp;
                other.recorddata.page=other.page;
                other.recorddata.dsp=other.dsp;
                other.recorddata.exp=other.exp;
                other.senddsplog(other.recorddata);
            }
        },
        /*智能平台项目-曝光量统计功能逻辑*/
        expfn:{
            getexposuredata:function(){
                var exposureCompany="";
                var exposureProduct="";
                var exposureadvert="";
                var expsdom=jQuery("[data-exposurelog]");
                var expslen=expsdom.length;
                for(var i=0;i<expslen;i++){
                    var expsdata=jQuery(expsdom[i]).attr('data-exposurelog');
                    if(Tool.trimSpaces(expsdata).indexOf("###gg_")!==-1&&Tool.trimSpaces(expsdata).indexOf(',')===-1){
                        console.log(expsdata);
                        var expsdata=Tool.trimSpaces(expsdata).substring(3,Tool.trimSpaces(expsdata).length);
                        console.log(expsdata);
                        other.exp.exposureadvert==""?other.exp.exposureadvert=Tool.trimSpaces(expsdata):other.exp.exposureadvert=other.exp.exposureadvert+"#&#"+Tool.trimSpaces(expsdata);
                    }
                    else if(Tool.trimSpaces(expsdata).indexOf(',')===-1){
                        other.exp.exposurecompany==""?other.exp.exposurecompany=Tool.trimSpaces(expsdata):other.exp.exposurecompany=other.exp.exposurecompany+"#&#"+Tool.trimSpaces(expsdata);
                    }
                    else{
                        other.exp.exposureproduct==""?other.exp.exposureproduct=Tool.trimSpaces(expsdata):other.exp.exposureproduct=other.exp.exposureproduct+"#&#"+Tool.trimSpaces(expsdata);
                    }
                }
            },
            /*暴露的外部接口*/
            sendexposurelog:function(data){
                other.page=hc.UBA.ubaParam.logrecordpage;
                other.page.isdsp=0;
                other.page.isexp=1;
                other.exp=data;
                other.recorddata.page=other.page;
                other.recorddata.dsp=other.dsp;
                other.recorddata.exp=other.exp;
                other.senddsplog(other.recorddata);
            }
        }
    };
    hc.UBA.ubaInitpro();
    //放出接口对象
    hc.UBA.sendUserlogsPage=hc.UBA.ubaFn.sendUserlogsPage;
    hc.UBA.sendUserlogsElement=hc.UBA.ubaFn.sendUserlogsElement;
    hc.exposure.sendexposurelog=other.expfn.sendexposurelog;
    hc.HUB.addEvent(window,other.loadInit,'load');
})(window,document);