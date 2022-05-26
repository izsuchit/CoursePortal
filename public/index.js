let d = new Date();
let h = d.getHours();
let m = d.getMinutes();
let s = d.getSeconds();
let day = d.getDate();
let month = d.getMonth() + 1;
let year = d.getFullYear();
let c = 'AM';
if (m <= 9) m = '0' + m;
else if (h <= 9) h = '0' + h;
if (h > 12) {
    h = h - 12;
    c = 'PM';
}
document.getElementById("time").innerHTML = h + ':' + m + ' ' + c;
document.getElementById("day").innerHTML = day + '/' + month + '/' + year;

var preload = document.getElementById('loading');
function myfunction() {
    preload.style.display = 'none';
}
