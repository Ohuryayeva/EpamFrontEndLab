var dragIcon = document.createElement('img');

dragIcon.src = 'logo.png';

var elements = [document.getElementById("planned"),document.getElementById("started"),document.getElementById("finished")];

for(var i = 0, length = elements.length; i < length; i++) {
        elements[i].style.minHeight = window.innerHeight - 90;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {

    ev.dataTransfer.setDragImage(dragIcon, -10, -10);
    ev.dataTransfer.setData("task_id", ev.target.id);
}

function drop(ev) {
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
    var task_id = ev.dataTransfer.getData("task_id");
    if (li_element == undefined) {
        ul_target.appendChild(document.getElementById(task_id));
    } else {
        ul_target.insertBefore(document.getElementById(task_id), li_element)
    }
    var task = Couch.getTask(task_id);
    task.status = ul_target.id;
    Couch.updateTask(task);
    Time.observeTime(task);
}
