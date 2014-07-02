function text() {
    document.getElementById('input').style.display = "block";
}

function myFunction() {
    var parent = document.getElementById("category");
    var categoryName = document.getElementById('input').value;

    if (categoryName == "") {
        categoryName = "New Category";
    }

    var newCategory = document.createElement('li');

    newCategory.className = "stick";
    var id = document.getElementById("category").childElementCount + 1;
    newCategory.id = id;
    newCategory.setAttribute("draggable", "true");
    newCategory.setAttribute("ondragstart", "drag(event)");

    var newB = document.createElement('button');
    newB.className = "delet";
    newB.innerHTML = newB.innerHTML + '&#x2718;';
    newB.setAttribute("onclick", "delet(" + id + ")")
    newCategory.appendChild(newB);

    var newH = document.createElement('h2');
    newH.innerHTML = categoryName;
    newCategory.appendChild(newH);
    parent.appendChild(newCategory);
    document.getElementById('input').style.display = "none";
    document.getElementById('input').value = "";

    var categories_in_form = document.getElementById("sel_cat");
    var new_category = document.createElement("option");
    categories_in_form.appendChild(new_category);
    new_category.innerHTML = categoryName;
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
    return false;
}
