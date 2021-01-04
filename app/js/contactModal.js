//get modalin
var modal = document.getElementById('contactModal');
//get the button
var btn = document.getElementById("modalBtn");
//get the close span element
var span = document.getElementsByClassName("close")[0];

btn.onclick = function(){
  modal.style.display = "block";
}

span.onclick = function(){
  modal.style.display = "none";
}

window.onclick = function(event){
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
