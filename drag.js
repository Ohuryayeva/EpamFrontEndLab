/*
 function allowDrop(ev) {
 ev.preventDefault();
 }

 function drag(ev) {
 ev.dataTransfer.setData("Text", ev.target.id);
 }

 function drop(ev) {
 ev.preventDefault();
 var data = ev.dataTransfer.getData("Text");
 ev.target.appendChild(document.getElementById(data));
 ev.stopPropagation();

 }*/

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("task_id", ev.target.id);
}

function drop(ev) {
    var ul_target = ev.target; // write element where we try to push our li
    var li_element;
    if (ul_target.tagName != 'UL') { // if we didn't get exactly in ul
        li_element = ul_target;
        while (li_element.tagName != 'LI') {
            li_element = li_element.parentElement; // every time go up to find ul element
        }
        ul_target = li_element.parentElement;
    }
    ev.preventDefault();
    var task_id = ev.dataTransfer.getData("task_id");
    if (li_element == undefined) {
        ul_target.appendChild(document.getElementById(task_id));
    } else {
        ul_target.insertBefore(document.getElementById(task_id), li_element)
    }
}
