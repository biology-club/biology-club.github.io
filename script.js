const url = "https://script.google.com/macros/s/AKfycbw5fwPttBRBZCbPatGb615monOctCKtLqA7LojTcWfBDRMkOsFDofrYRhp7Vm7TUVK9LQ/exec"
fetch(url , {
  method: "GET",
}).then(response => response.text())
.then(text => {
  var res =JSON.parse(text);
  console.log(res);
  for(i=0;i<res.length;i++){
  let tbl = document.getElementById('tbl');
  
  let tr = document.createElement('tr');
  let td = document.createElement('td');
  var id = i+1;
  td.id='tit-'+id;
  td.setAttribute('onclick', 'moreButton(this.id)');
  td.innerText=res[i][0];
  td.classList.add("titletd")
  let goodtd = document.createElement('td');
  goodtd.innerText='👍'+res[i][1];
  goodtd.id='good-'+id;
  goodtd.setAttribute('onclick', 'goodButton(this.id)');
  goodtd.classList.add("goodtd");
  tr.appendChild(td);
  tr.appendChild(goodtd);
   tbl.appendChild(tr);
  }
});
function goodButton(id){
  var a =document.getElementById(id).innerText;
  var n = a.split('👍');
  var numb = Number(n[1])+1;
  document.getElementById(id).innerText='👍'+numb;
  var sp = id.split('-');
  var te = sp[1];
  console.log(te);
  var form = url+"?page=good&id="+te;
  fetch(form,{
    method:"GET",
  }).then(response => response.text())
  .then(text => {
 console.log(text);   
});
}

function moreButton(id){
  var sp = id.split('-');
  var te = sp[1];
  location.href="./more.html?id="+te;
}