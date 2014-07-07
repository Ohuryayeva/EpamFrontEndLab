function allowDroper(ev) {
ev.preventDefault();
}

function drager(ev) {

ev.dataTransfer.setData(" + id + ", ev.target.id);
}

function droper(ev) {
var ul_target = ev.target; // write element where we try to push our li
var li_element;
if (ul_target.tagName != 'UL' || ul_target.id == "") { // if we didn't get exactly in ul
li_element = ul_target;
while (li_element.tagName != 'LI' || li_element.id == "") {
li_element = li_element.parentElement; // every time go up to find ul element
}
ul_target = li_element.parentElement;
}
ev.preventDefault();
var category_id = ev.dataTransfer.getData(" + id + ");
if (li_element == undefined) {
ul_target.appendChild(document.getElementById(category_id));
} else {
ul_target.insertBefore(document.getElementById(category_id), li_element)
}
updateCategories();
}

function text(){
 document.getElementById('input').style.display = "block";
 document.getElementById('Add').style.display = "none";
 document.getElementById('submit').style.display = "block";

}

function displayCategory(categoryName, active) {
    var parent = document.getElementById("category");

    if (categoryName == "") {
        categoryName = "New Category";
    }

    var newCategory = document.createElement('li');

    newCategory.className = "stick";
    var last_id = document.getElementById("category").lastChild.id;
    var id = last_id == undefined ? 1 : parseInt(last_id) + 1;

    newCategory.id = id;
    newCategory.setAttribute("draggable", "true");
    newCategory.setAttribute("ondragstart", "drager(event)");
    newCategory.setAttribute("tabindex", "" + id + "");
    newCategory.setAttribute('onclick', 'changeCategory(this)');

    var newB = document.createElement('div');
    newB.className = "delet";
    newB.innerHTML = newB.innerHTML + 'x';
    newB.setAttribute("onclick", "overlay(" + id + ")")
    newCategory.appendChild(newB);

    var newH = document.createElement('h2');
    newH.innerHTML = categoryName;
    newCategory.appendChild(newH);

    if (active == true){
        newCategory.classList.add('active');
    } else {
        newCategory.classList.remove('active');

    }

    parent.appendChild(newCategory);

    document.getElementById('input').style.display = "none";
    document.getElementById('input').value = "";


    if (document.getElementById('input').style.display = "none") {
        document.getElementById('Add').style.display = "block";
        document.getElementById('submit').style.display = "none";
    }

    var categories_in_form = document.getElementById("sel_cat");
    var new_category = document.createElement("option");
    categories_in_form.appendChild(new_category);
    new_category.innerHTML = categoryName;

}
function myFunction() {
    var categoryName = document.getElementById('input').value;
    displayCategory(categoryName, false);
    updateCategories();
}

function displayCategories(categories){
    var ul_categories = document.getElementById("category");

    for (var i=0; i<categories.length; i++){

        if (i == 0){
            displayCategory(categories[i], true);
        } else {
            displayCategory(categories[i], false);
        }
    }

}

function onEnter() {
    if (event.keyCode == 13) {
        myFunction();
    }
}

function delet(num) {
    var element = document.getElementById(num);
    var categories_in_form = document.getElementById("sel_cat");
    var category_tag = element.getElementsByTagName("h2")[0];
    var category_name = category_tag.innerHTML;
    for (var i=0; i<categories_in_form.length;i++){
        if(categories_in_form[i].value == category_name){
            categories_in_form.removeChild(categories_in_form[i])
        }
    }
     element.parentNode.removeChild(element);
    exitModalWindow();
    updateCategories();
}
function overlay(id){

modalWindow = document.getElementById("modalWindow");
document.getElementById('box-inner').style.visibility="visible"; 

modalWindow.children[1].setAttribute("onclick","delet("+id+")");
modalWindow.children[2].setAttribute("onclick","exitModalWindow()");

document.getElementById('modalWindow').style.visibility="visible"; 

}
function exitModalWindow(){ document.getElementById("modalWindow").style.visibility = 'hidden';
document.getElementById('box-inner').style.visibility="hidden"; 
}
function updateCategories(){
    var li_cat = document.getElementsByClassName("stick");
    var cat_array =[];
    for(var i=0; i<li_cat.length;i++){
        cat_array.push(li_cat[i].getElementsByTagName('h2')[0].innerHTML);
    }
    var user = Couch.getUser();
    user.configuration.categories = cat_array;
    Couch.updateUser(user);
}
