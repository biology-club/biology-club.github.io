# ↑の手順でコピーしたURL
const url = "https://script.google.com/macros/s/AKfycbz0v2pNU1x628bUqOwKkGvPJTU1tBmu6UV6qnADGtXFK497qX_Ed3RO-QrwaRqB4_we/exec"
fetch(url , {
  method: "GET",
}).then(response => response.text())
.then(text => {
  // 取得した値をコンソールに出力
  console.log(text);
  // HTML上の必要な箇所に値を設定します。
  const targetID = "hoge";
  document.getElementById(targetID).innerText = text;
});
