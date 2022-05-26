$(document).ready(function () {


    $('h1').animate({
      opacity:'2',
        left:'500px',
       fontSize:'50px',
       
      
    }, 4000)
   /* $('h1').on('mouseenter',function(){
      $(this).css({"color":"red"})
    })
*/

function randomcolor(){
  var x='0123456789ABCDEF';
  var color='#';
  for(var i=0;i<6;i++){
    color+=x[Math.floor(Math.random()*16)];

  }
  return color;
}
function fontfamily(){
  var x=["cursive","serif","sans-serif","system-ui","monospace","fantasy","emoji","fangsong","math","ui-serif"];
  var k=Math.floor(Math.random()*10);
  
  return x[k];
}




$('h1').on('mouseenter',function(){
  $(this).css({"color":randomcolor()})
  $(this).css({"font-family":fontfamily()})
})

});