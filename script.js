const url = "https://script.google.com/macros/s/AKfycbw5fwPttBRBZCbPatGb615monOctCKtLqA7LojTcWfBDRMkOsFDofrYRhp7Vm7TUVK9LQ/exec"
const username = localStorage.getItem('username');
const mail = localStorage.getItem('mail');
if(!mail||!username){
  location.href="./login.html";
}else{
console.log('username='+username+',mail='+mail);
var index = url+'?mail='+mail+'&name='+username;
fetch(index , {
  method: "GET",
}).then(response => response.text())
.then(text => {
  if(text=='blocked'){
    location.href='./login.html';
  }else{
  var res =JSON.parse(text);
  console.log(res);
  for(i=0;i<res.length;i++){
  let out = document.getElementById('out');
  
  let content = document.createElement('p');
  let link = document.createElement('p');
  var id = i+1;
  link.id='tit-'+id;
  link.setAttribute('onclick', 'moreButton(this.id)');
  link.innerText=res[i][0];
  content.classList.add("content");
  link.classList.add("link");

  let good = document.createElement('p');
  good.innerText='賛同数：'+res[i][1];
  good.id='good-'+id;
  good.setAttribute('onclick', 'goodButton(this.id)');
  good.classList.add("good");
  content.appendChild(link);
  content.appendChild(good);
   out.appendChild(content);
  }
  document.getElementById('loading').remove();
}
})
};
function goodButton(id){
  var a =document.getElementById(id).innerText;
  var n = a.split('：');
  var numb = Number(n[1])+1;
  document.getElementById(id).innerText='賛同数：'+numb;
  var sp = id.split('-');
  var te = sp[1];
  console.log(te);
  var form = url+"?page=good&id="+te+"&mail="+mail+"&name="+name;
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
function opendrive(){
  location.href="https://drive.google.com/drive/folders/1osnVxVzObKBF5jr0Wg26dGQqTvOQqrKg";
}