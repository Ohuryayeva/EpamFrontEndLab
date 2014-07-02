
function text(){
 document.getElementById('input').style.display = "block";
}



function myFunction(){
var parent =document.getElementById("category");
var categoryName = document.getElementById('input').value;

if (categoryName=="") { categoryName="New Category";
}   

var newCategory = document.createElement('li');

newCategory.className="stick";
var id = document.getElementById("category").childElementCount+1;
newCategory.id= id;
newCategory.setAttribute("draggable","true");
newCategory.setAttribute("ondragstart","drag(event)");

var newB = document.createElement('button');
newB.className="delet";
newB.innerHTML = newB.innerHTML + '&#x2718;';
newB.setAttribute("onclick","delet("+id+")")
newCategory.appendChild(newB);

var newH = document.createElement('h2');
newH.innerHTML = categoryName;
newCategory.appendChild(newH);
parent.appendChild(newCategory);
document.getElementById('input').style.display = "none";
document.getElementById('input').value="";


}

function onEnter(){
	if (event.keyCode == 13) 
	{
	  myFunction();
	}
}

function delet(num){
var element = document.getElementById(num);
element.parentNode.removeChild(element);
 return false;
}
