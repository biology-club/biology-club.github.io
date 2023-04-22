const username = localStorage.getItem('username');
const usermail = localStorage.getItem('mail');
const pass = localStorage.getItem('password');
const userinfo = "&name="+username+"&mail="+usermail+'&password='+pass;
var query = location.search;
var value = query.split('=');
var data = decodeURIComponent(value[1]);
console.log(data);
const url = "https://script.google.com/macros/s/AKfycbzw205Dy8Vc_4Jr_MlTIvlRRaBWF8VigmMKeJLC97eQpGGHuOd1NsOg-eWdX7lFpiWD/exec";
var form = url+"?page=more&id="+data+userinfo;
fetch(form,{
method:"GET",
}).then(response => response.text())
.then(text => {
  if(text=='blocked'){
      location.href='./login.html';
    }else{
    var res =JSON.parse(text);
    console.log(res);
    var title = res[0];
    var detail = res[1];
    var contributer = res[4];
    if(username==contributer){
        var idcon = document.getElementById('contributer');
        idcon.innerHTML="";
        let button = document.createElement('button');
        button.innerText='削除';
        button.setAttribute('onclick','deleteTitle()');
        button.classList.add('deleteTitle');
        idcon.appendChild(button);
    }else{
        document.getElementById('contributer').innerText=contributer;
    }
    document.getElementById('title').innerText=title;
    document.getElementById('detail').innerText=detail;


    for(i=0;i<res[3].length;i++){
    let tbl = document.getElementById('comment');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    let nametd = document.createElement('td');
    nametd.innerText=res[3][i][1]+'：'; 
    nametd.classList.add('nametd');
    var id = i+1;
     td.id=id;
     td.innerText=res[3][i][0];
     if(username==res[3][i][1]){
        td.classList.add("mycomment");
        td.setAttribute('onclick', 'editcom(this.id)');
     }else{
     td.classList.add("titletd");
     }
     tr.appendChild(nametd);
     tr.appendChild(td);
     tbl.appendChild(tr);
    }
   if(res[3].length<1){
    let tbl = document.getElementById('comment');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.innerText='コメントはありません';
       tr.appendChild(td);
       tbl.appendChild(tr);
    }else{}
    let tbl = document.getElementById('comment');
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.colSpan='2';
    td.id='newCommentTd';
    td.innerHTML='<textarea id="newc" placeholder="コメントを追加"></textarea><button type="button" id="sub" onclick="subcom()">送信</button>';
       tr.appendChild(td);
       tbl.appendChild(tr);
  }
});
function subcom(){
    var comment = makestring(document.getElementById('newc').value);
    var confirm =window.confirm("送信します");
    if(confirm){
      if(!comment){
        alert('入力してください');
      }else{
    var locationg = runOpen();
    var form = url+"?page=comment&id="+data+"&comment="+comment+userinfo;
fetch(form,{
method:"GET",
}).then(response => response.text())
.then(text => {
    if(text=='success'){
        location.reload();
    }else if(text=='blocked'){
      location.href='./login.html';
    }
});
}
}
}
function runOpen(){
document.getElementById("runArea").className = 'runBg';
return false;
}
function editcom(id){
    var edit = document.getElementById(id);
    var now = edit.innerText;
    localStorage.setItem('editing',now);
    edit.removeAttribute("onclick");
    edit.innerHTML='<textarea id="editing">'+now+'</textarea><div id="edited"><div id="change">変更</div><div id="ulo"><ul id="deletecom"><li onclick="change('+id+')">変更</li><li onclick="deletefunc('+id+')">削除</li><li onclick="cancel('+id+')">キャンセル</li></ul></div></div>';
    
document.getElementById("edited").addEventListener("mouseover", function(){
	document.getElementById("deletecom").style.display = 'block';
    document.getElementById("change").style.display='none';
}, false);

document.getElementById("edited").addEventListener("mouseout", function(){
	document.getElementById("deletecom").style.display = 'none';
    document.getElementById("change").style.display='block';
}, false);
}
function change(id){
    var num = String(id);
    var value = makestring(document.getElementById('editing').value);
    console.log(value);
    console.log('changed'+num);
    var confirm =window.confirm("コメントを変更します");
    if(confirm){
        var locationg = runOpen();
        var form = url+"?page=changecom&title="+data+"&comid="+num+'&changedcom='+value+userinfo;
    fetch(form,{
    method:"GET",
    }).then(response => response.text())
    .then(text => {
        if(text=='success'){
            location.reload();
        }else if(text=='blocked'){
          location.href='./login.html';
        }
    });
    }else{
    }
}
function deletefunc(id){
    var num = String(id);
    console.log('comid='+num+'titleid='+data);
    var confirm =window.confirm("コメントを削除します");
    if(confirm){
        var locationg = runOpen();
        var form = url+"?page=deletecom&title="+data+"&comid="+num+userinfo;
    fetch(form,{
    method:"GET",
    }).then(response => response.text())
    .then(text => {
        if(text=='success'){
            location.reload();
        }else if(text=='blocked'){
          location.href='./login.html';
        }
    });
    }else{
    }
}
function cancel(id){
    var cell =document.getElementById(id);
    var value =localStorage.getItem('editing');
    var innerh = '<p>'+value+'<p>';
    cell.innerHTML=innerh;
    console.log(cell);
    cell.classList.add("mycomment");
    cell.setAttribute('onclick', 'editcom(this.id)');
    location.reload();
}

function deleteTitle(){
    var confirm =window.confirm("スレッドを削除します");
    if(confirm){
        var locationg = runOpen();
        var form = url+"?page=deleteTitle&title="+data+userinfo;
    fetch(form,{
    method:"GET",
    }).then(response => response.text())
    .then(text => {
        if(text=='success'){
            location.href='./index.html';
        }else if(text=='blocked'){
          location.href='./login.html';
        }
    });
    }else{
    }

}

function makestring(before){
    var value = before.replace("$","＄");
    while(value !== before) {
        before = before.replace('$', '＄');
        value = value.replace('$', '＄');
    }
    var str = value.replace(/\n/g,"$").replace(/\r/g,"");
    while(str !==value){
      value = value.replace(/\n/g,"$").replace(/\r/g,"");
      str = str.replace(/\n/g,"$").replace(/\r/g,"");
    }
var res = str.replace('&', '＆');
while(res !== str) {
    str = str.replace('&', '＆');
    res = res.replace('&', '＆');
}

var result = res.replace('?', '？');
while(result !== res) {
    res = res.replace('?', '？');
    result = result.replace('?', '？');
}
return result
  }


  console.log("js-acffc65")