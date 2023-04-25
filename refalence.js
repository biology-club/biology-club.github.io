const SHEET_NAME = "title";
const SHEET_ID = PropertiesService.getScriptProperties().getProperty('sheetid')
const ss = SpreadsheetApp.openById(SHEET_ID);
const title = ss.getSheetByName(SHEET_NAME);
function getTitle() {
  var lastrow = title.getLastRow()-1;
  var value = title.getRange(2,1,lastrow,5).getValues();
  return value;
}

function doGet(e) {
  Logger.log(e);
  var username = e.parameter.name;
  var usermail = e.parameter.mail;
  var password = e.parameter.password;
  var checkname = PropertiesService.getDocumentProperties().getProperty(usermail);
  Logger.log(checkname);
  var checkpass = PropertiesService.getDocumentProperties().getProperty(checkname);
  Logger.log(checkpass);
  var page = e.parameter.page;
  if(username==checkname&&password==checkpass&&checkpass&&checkname){
    Logger.log('passed mail check');
  if(!page){
    page="index";
  }
  switch(page){
    case "index"://**complate */
    var data = ContentService.createTextOutput(JSON.stringify(getTitle())).setMimeType(ContentService.MimeType.JSON);
    break;

    case "more"://**complate */
    var key = e.parameter.key;
    var data = ContentService.createTextOutput(JSON.stringify(getMore(key))).setMimeType(ContentService.MimeType.JSON);
    break;
    
    case "good"://**complate */
      var key = e.parameter.key;
      var goodf = goodFunc(key);
      var data = ContentService.createTextOutput(goodf).setMimeType(ContentService.MimeType.TEXT);
    break;

    case "new"://**complate */
      var lastrow = title.getLastRow()+1;
      var newtitle = e.parameter.newtitle;
      var detail = makearray(e.parameter.detail);
      var name = e.parameter.name;
      var key = setkey();
      var newobject = [[newtitle,0,detail,name,key]];
      var html = '<h1>新しい投稿</h1>'+'<h2>'+newtitle+'</h2>'+'<p>'+detail+'</p>'+'<a href="https://biology-club.github.io/experiment/more.html?key='+key+'">開く</a>';
      mailNotice(newtitle,detail,html);
      var data = ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    break;

    case "comment"://**complate */
      var key = e.parameter.key;
      var comment = makearray(e.parameter.comment);
      var func = commentFunc(key,comment,username);
      var data = ContentService.createTextOutput(func).setMimeType(ContentService.MimeType.TEXT);
    break;

    case "mail"://**complate */
      var mail = e.parameter.newmail;
      var name = e.parameter.newname;
      var mailsheet = ss.getSheetByName('mail');
      var textFinder = mailsheet.createTextFinder(mail);
      var cells = textFinder.findAll();
      var namefinder = mailsheet.createTextFinder(name);
      var names = namefinder.findAll();
      if(cells.length<1&&names.length<1){
      newmail(mail,name);
      var res = 'success';
      }else{
        var res = 'already';
      }
      var data = ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.TEXT);
    break;

    case "login":
    var data = ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    break;

    case "changecom":
      var key = e.parameter.key;
      var comid = Number(e.parameter.comid)+1;
      var chcom = makearray(e.parameter.changedcom);
      var range = ss.getSheetByName(key).getRange(comid,1);
      range.setValue(chcom);
      var data = ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    break;

    case "deletecom":
     var key = e.parameter.key;
     var comid = Number(e.parameter.comid)+1;
     ss.getSheetByName(key).deleteRow(comid);
     var data = ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    break;

    case "deleteTitle":
    var key = e.parameter.key;
    deleteTitle(key);
    var data =ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
    break;

    case "repass":
    var chpass = changePass(username,usermail,e.parameter.npass);
    Logger.log(e.parameter.npass);
    var data =ContentService.createTextOutput(chpass).setMimeType(ContentService.MimeType.TEXT);
    break;
  }
  }else{
    Logger.log('failed mail check');
    switch(page){
      case "login":
      var resa = login(usermail,password);
      var data = ContentService.createTextOutput(JSON.stringify(resa)).setMimeType(ContentService.MimeType.JSON);
      break;

      case "cmail":
      var name = PropertiesService.getDocumentProperties().getProperty(usermail);
      var data = ContentService.createTextOutput(name).setMimeType(ContentService.MimeType.TEXT);
      break;

      case "rmail":
      var funcs = registermail(usermail,password);
      var data = ContentService.createTextOutput(funcs).setMimeType(ContentService.MimeType.TEXT);
      break;

      case "getpass":
      var user = getUserInfo(usermail);
      if(!user){
        var data =ContentService.createTextOutput('blocked').setMimeType(ContentService.MimeType.TEXT);
      }else if(user.mail==usermail&&user.name==username){
        var html ='    <h1>パスワードの確認</h1><p>パスワードを忘れた方への確認メールです。</p><p>'+username+'さんのパスワードは</p><h2>パスワード:'+user.pass+'</h2><p>です。</p><p>これが'+username+'さんの操作によるものでない場合、パスワードを再設定することをお勧めします。</p>'
         var option ={ htmlBody: html,name:'生物部'};
         var body = '生物部パスワード再設定';
         var topic = '生物部パスワード再設定';
    MailApp.sendEmail(user.mail,topic,body,option);
      var data = ContentService.createTextOutput('success').setMimeType(ContentService.MimeType.TEXT);
      }else{
        var data =ContentService.createTextOutput('blocked').setMimeType(ContentService.MimeType.TEXT);
      }
      break;

       default:
       var data = ContentService.createTextOutput('blocked').setMimeType(ContentService.MimeType.TEXT);
    }
    }
  return data;
  }


function getMore(key){
  const activeSheet = ss.getSheets();
  const sheetLen = activeSheet.length;
  var sheets =[];
  for(var i=0; i<sheetLen; i++){
    sheets.push(activeSheet[i].getSheetName());
  };
  var check = sheets.includes(key);
  if(check){
   var dsheet =ss.getSheetByNaame(key);
   var last = dsheet.getLastRow()-1;

   var newobject = dsheet.getRange(1,1,1,4).getValues();
   var object =newobject[0];

   var titlei = object[0];
   var detail = object[2];
   var good = object[1];
  var contributor = object[3];

   var comments = dsheet.getRange(2,1,last,2).getValues();
  }else{
    var row = Number(search(title,key)[1]);
    var newobject = title.getRange(row,1,1,4).getValues();
    var object = newobject[0];

    var titlei = object[0];
    var detail = object[1];
    var good = object[2];
    var comments =[];
  var contributor = object[3];
  }
  var res = [titlei,detail,good,comments,contributor];
  return res;
}

function commentFunc(key,comment,user){
   const activeSheet = ss.getSheets();
  const sheetLen = activeSheet.length;
  var sheets =[];
  for(var i=0; i<sheetLen; i++){
    sheets.push(activeSheet[i].getSheetName());
  };
  var row = Number(search(title,key)[1]);
  var check = sheets.includes(key);
  var newobject = [[commnet,user]];
  if(check){
    var dsheet =ss.getSheetByName(key);
    var last =dsheet.getLastRow()+1;
    dsheet.getRange(last,1,1,2).setValues(newobject);
  }else{
    var newsheet = ss.insertSheet();
    newsheet.setName(key);
    var setv = title.getRange(row,1,1,3).getValues();
    newsheet.getRange(1,1,1,4).setValues(setv);
    var last = newsheet.getLastRow()+1;
    newsheet.getRange(last,1,1,2).setValues(newobject);
  }
  var topic = title.getRange(row,1).getValue();
  var text = '<h1>'+topic+'にコメントが追加されました</h1>'+'<p>'+comment+'</p>'+'<a href="https://biology-club.github.io/experiment/more.html?key='+key+'">開く</a>';
  mailNotice(topic,comment,text);
  return 'success';
}

function goodFunc(key){
      var row = Number(search(title,key)[1]);
      var now = Number(title.getRange(row,2).getValue())+1;
      title.getRange(row,2).setValue(now);
      const activeSheet = ss.getSheets();
      const sheetLen = activeSheet.length;
      var sheets =[];
       for(var i=0; i<sheetLen; i++){
          sheets.push(activeSheet[i].getSheetName());
       };
      var check = 　sheets.includes(key);
      if(check){
        var detn =ss.getSheetByName(key).getRange(1,2);
        detn.setValue(now);
      }else{}
    return'success';
}

function mailNotice(topic,body,html){
  var msheet = ss.getSheetByName('mail');
  var last = msheet.getLastRow();
  for(i=0;i<last;i++){
      var option ={ htmlBody: html,name:'生物部'};
    var row = i+1;
    var mail = msheet.getRange(row,1).getValue();
    MailApp.sendEmail(mail,topic,body,option);
  }
}

function newmail(mail,name){
  PropertiesService.getDocumentProperties().setProperty(mail,name);
  var text ='<h1>生物部連絡網への参加のお願い</h1>'+'<p>生物部では、Gmail,連絡ページを使用して部員間の連絡、情報共有を行っています。</p>'+'<p>このメールアドレスが、'+name+'さんのものなら、下のリンクにアクセスして認証を行ってください</p>'+'<p>ここで収集したメールアドレスは、部員間での連絡、情報共有のみに使用されます。</p>'+'<a href="https://biology-club.github.io/experiment/nmail.html?mail='+mail+'">開く</a>'+'<p>このメールなどの問い合わせ：片山航生　19210610@gse.okayama-c.ed.jp</p>'
      var option ={ htmlBody: text,name:'生物部'};
  MailApp.sendEmail(mail,'生物部連絡網の作成','メールアドレスの認証',option);
  return 'success';
}

function registermail(mail,pass){
  var name = PropertiesService.getDocumentProperties().getProperty(mail);
      var sheetm = ss.getSheetByName('mail');
      var last = sheetm.getLastRow()+1;
      sheetm.getRange(last,1).setValue(mail);
      sheetm.getRange(last,2).setValue(name);
      sheetm.getRange(last,3).setValue(pass);
      PropertiesService.getDocumentProperties().setProperty(name,pass);
  return 'success';
}

function login(usermail,userpass){
  const docpro = PropertiesService.getDocumentProperties();
      var user = getUserInfo(usermail);
      var resa = [];
      if(!user){
        resa.push('nomail');
      }else{
        var cpass = user.pass;
        if(userpass==cpass&&usermail==user.mail){
          docpro.setProperty(user.name,cpass);
          docpro.setProperty(user.mail,user.name);
          console.log(docpro.getProperty(user.name));
          resa.push('success');
          resa.push(user.name);
        }else{
          resa.push('noname');
        }
      }
      console.log(resa);
      return resa;
}

//**検索　シート,検索ワード→[あり1or無し0,ヒット列] quote:Gobousei/con-date-beta */
function search(sheet,searchW){
  if (searchW == null || searchW == '') {
    return false;
  } else {
    let ranges = sheet.createTextFinder(searchW).findAll(); // キーワードによる検索を実施
    let targetRows = []; // 検索にヒットしたレコード行の格納先
    // 検索にヒットしたRangeとレコード行を格納
    for (let i = 0; i < ranges.length; i++) {
      targetRows.push(ranges[i].getRow());
    }
    // 1行に複数個ヒットした場合の重複行番号排除
    targetRows = targetRows.filter(function(x, i, self) {
      return self.indexOf(x) === i;
    });
    var len = targetRows.length;
    if(len<1){
      var res = false;
    }else{
    var res=[1,targetRows];
    }
    Logger.log(res);
    return res;
  }
}

function deleteTitle(key){//**タイトルの削除 */
//**削除 */
  var row = Number(search(title,key));
  title.deleteRow(row);
  //**シート取得 */
   const activeSheet = ss.getSheets();
  const sheetLen = activeSheet.length;
  var sheets =[];
  for(var i=0; i<sheetLen; i++){
    sheets.push(activeSheet[i].getSheetName());
  };
  Logger.log(sheets);
  var del = sheets.includes(key);
  if(del){
  var trashsheet = ss.getSheetByName(key);
  ss.deleteSheet(trashsheet);
  }else{}
  PropertiesService.getDocumentProperties().setProperty('version',version);
}

function changePass(name,mail,pass){//**パスワードの変更 */
      var sheetm = ss.getSheetByName('mail');
      var row = search(sheetm,mail);
      var uname = sheetm.getRange(row[1],2).getValue();
      Logger.log(uname);
      if(name==uname){
        sheetm.getRange(row[1],3).setValue(pass);
        login(mail,pass);
        var res = "success";
      }else{
        var res = "blocked";
      }
      return res;
}

function makearray(value){
   var str = value.replace("$","\n");
    while(str !==value){
      value = value.replace("$","\n");
      str = str.replace("$","\n");;
    }
var res = str.replace('＆','&');
while(res !== str) {
    str = str.replace('＆','&');
    res = res.replace('＆','&');
}

var result = res.replace('？','?');
while(result !== res) {
    res = res.replace('？','?');
    result = result.replace('？','?');
}
return result
  }

  function getUserInfo(info){
      var sheetm = ss.getSheetByName('mail');
      var row = search(sheetm,info);
      if(!row){
        var res = false;
      }else{
      var name = sheetm.getRange(row[1],2).getValue();
      var mail = sheetm.getRange(row[1],1).getValue();
      var pass = sheetm.getRange(row[1],3).getValue();
      var res = {"name":name,"mail":mail,"pass":pass};
      console.log(res);
      }
      return res;
  }

  function setkey(){
            const year2 = Number(new Date().getFullYear().toString().slice(-2))*100000000000000;
            const month = Number(new Date().getMonth()+1)*1000000000000;
            const day   = Number(new Date().getDate())*10000000000;
            const hour  = Number(new Date().getHours())*100000000;
            const minu  = Number(new Date().getMinutes())*1000000;
            const seco  = Number(new Date().getSeconds())*10000;
            const msec  = Number(new Date().getMilliseconds());
            const str = msec + seco + minu + hour + day + month + year2;
            const key = str.toString(32);
            return key
        }