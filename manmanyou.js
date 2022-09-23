const $ = new Env('慢慢游-签到 2.0');
 const notify = $.isNode() ? require('./sendNotify') : '';

console.log("====================== \r\n 慢慢游论坛签到2.0，基于环境变量，支持多账号 \r\n");
if (!process.env.MMY_COOKIE) {
console.log("请先在环境变量中配置好cookie，名称为 MMY_COOKIE，一行一个，跟京东一样");
console.log("还要环境变量中配置好formhash，名称为 MMY_FORMHASH，一行一个，顺序与账号cookie顺序一致");

}


//先在环境变量中配置好cookie，名称为 MMY_COOKIE，一行一个
//还要环境变量中配置好formhash，名称为 MMY_FORMHASH，一行一个，顺序与账号cookie顺序一致

//修改以下2个参数为你自己的信息，其中todaysay可以为空，为空的话， qdmode 要改为3

var todaysay='心情很放松!';
var qdmode=1;  //如果你要todaysay是空，这里改为3；否则就保持1 不变

//--- 只需修改以上2个内容



var message='';
let CookieMMYs = []
// 判断环境变量里面是否有慢慢游ck
if (process.env.MMY_COOKIE) {
  if (process.env.MMY_COOKIE.indexOf('&') > -1) {
    CookieMMYs = process.env.MMY_COOKIE.split('&');
  } else if (process.env.MMY_COOKIE.indexOf('\n') > -1) {
    CookieMMYs = process.env.MMY_COOKIE.split('\n');
  } else {
    CookieMMYs = [process.env.MMY_COOKIE];
  }
}


let CookieMMY_formhashs = []
// 判断环境变量里面是否有慢慢游ck
if (process.env.MMY_FORMHASH) {
  if (process.env.MMY_FORMHASH.indexOf('&') > -1) {
    CookieMMY_formhashs = process.env.MMY_FORMHASH.split('&');
  } else if (process.env.MMY_FORMHASH.indexOf('\n') > -1) {
    CookieMMY_formhashs = process.env.MMY_FORMHASH.split('\n');
  } else {
    CookieMMY_formhashs = [process.env.MMY_FORMHASH];
  }
}


CookieMMYs = [...new Set(CookieMMYs.filter(item => !!item))]
console.log(`\n====================共${CookieMMYs.length}个慢慢游账号Cookie=========\n`);

var i=0;

do_xiancheng();

function do_xiancheng(){
    if (i<CookieMMYs.length){
        console.log(`\n======开始执行第 ${i+1} 个账号签到 =========\n`);
        if (!CookieMMYs[i].match(/_auth=(.+?);/) || !CookieMMYs[i].match(/seccode=(.+?);/)) console.log(`\n提示:慢慢游cookie 【${CookieMMYs[i]}】填写不规范,可能会影响部分脚本正常使用。请检查环境变量，重新填写`);
        const index = (i + 1 === 1) ? '' : (i + 1);
        cookie = CookieMMYs[i].trim();
        formhash=CookieMMY_formhashs[i].trim();
            qiandao(cookie,formhash,i+1);
            i++;
                setTimeout(function(){
                do_xiancheng()
                },2000) //每个账号签到之间间隔3秒
            
    }else{
        console.log("全部账号处理完成");
        //开始推送
        do_tuisong()
    }

}

function do_tuisong(){
!(async () => {

    if (message) {
        await notify.sendNotify($.name, message)
    } 
})()
.catch((e) => {
    })
    .finally(() => {
        $.msg($.name, '', `结束`);
        $.done();
    })
}


function qiandao(cookie,formhash,a) {
    var tmpmessage;
    return new Promise(resolve => {
        $.post(taskPostUrl('https://www.mmybt.com/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&sign_as=1&inajax=1','formhash='+formhash+'&qdxq=kx&qdmode='+qdmode+'&todaysay='+todaysay+'&fastreply=0',cookie), async (err, resp, data) => {
            try {
                if (err) {
                    console.log( `出现错误！错误内容：`)
                    console.error(`${JSON.stringify(err)}`)
                } else {
  
                     //取出签到结果
                        var reg = /<div class="c">([\s\S]*?)<\/div>/ig; 

                        tmpdata=data;

                        tmpdata.replace(reg, function() { console.log('第' + a + '个账号签到结果：'+ arguments[1] + "\r\n等待2秒后签到下一个账号");tmpmessage=arguments[1]; });
                        
                        if(tmpmessage){
                            message+='第' + a + '个账号签到结果：'+tmpmessage+"\r\n";
                        }else{
                            message+='第 '+a+' 个账号签到失败，错误内容见执行日志'+"\r\n";
                        }


                    //如果需要推送通知，删除下方的注释，使该句生效。暂时只支持每个账号推送一次，不是集合统计推送
                    //await notify.sendNotify(`${$.name}`, message);

                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}


function taskPostUrl(post_url,post_body,cookie) {
    return {
        url: post_url,
        body:post_body,
        headers: {
            'Cookie': cookie,
            // 'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            'accept-language': 'en-US,zh-CN;q=0.9',
            'accept-encoding': 'gzip, deflate, br',
            "referer": "https://www.mmybt.com/space-uid-888963.html" 
        }
    }
}
 
 
//env模块    不要动  
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
