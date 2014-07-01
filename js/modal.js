var Modal = {
    deadline_regex : /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.[0-9]{4}\s([0-1][0-9]|2[0-3])\:[0-5][0-9]$/,
    showHideModal: function (){
        var modal_window = document.getElementById("modal");
        modal_window.classList.toggle("md-show");
    },
    showHideCat: function (checkboxId, categoryId){
        var checkbox = document.getElementById(checkboxId);
        var category = document.getElementById(categoryId);
        if(checkbox.checked){
            category.style.display = "block";
        } else{
            category.style.display = "none";
        }
    },

    delCheckOption:function (){
        var ul_checkbox = document.getElementById("ulCheckbox");
        var input_options = ul_checkbox.getElementsByTagName("input");
        input_options = Array.prototype.slice.call(input_options);//converts array to allow forEach method
        input_options.forEach(function(input_option){
            if(input_option.checked == true){
                var parent_li = input_option.parentElement;
                parent_li.parentNode.removeChild(parent_li);
            }
        })
    },
    getTaskFromModal: function(){
        var task_name = document.getElementById("task_name").value;
        var task_desc = document.getElementById("task_desc").value;
        var task = {name: task_name,description: task_desc, status: "planned" };
        var t_deadline = document.getElementById("t_deadline");
        var t_time = document.getElementById("t_time");
        var t_checkbox = document.getElementById("t_checkbox");
        task.last_change = new Date().getTime(); // change format date to milliseconds
        if(t_deadline.checked){
            var task_deadline = document.getElementById("task_deadline").value;
            task.deadline = task_deadline;
        }
        if(t_time.checked){
            var task_time = document.getElementById("task_time").value;
            task.time = task_time;

        }
        if  (t_checkbox.checked){
            var ul_checkbox = document.getElementById("ulCheckbox");
            var label = ul_checkbox.getElementsByTagName("label");
            var check_array=[];
            for (var i = 0; i < label.length; i++) {
                var checkbox = {name: label[i].innerHTML, done: false}
                check_array.push(checkbox);
            }
            task.checkbox = check_array;
        }
        return task;
    },
    formatDate: function (date) {
        var result_date;
        if (Modal.deadline_regex.test(date)){
            var parts = date.split('.');
            parts = [parts[1], parts[0], parts[2]];
            result_date = new Date(parts.join('.') + " GTM+0000")
        } else {
            result_date = new Date(date);
        }
        var result = Modal.addZero(result_date.getUTCDate()) + "."
            + Modal.addZero(result_date.getUTCMonth()) + "."
            + result_date.getUTCFullYear() + " "
            + Modal.addZero(result_date.getUTCHours()) + ":"
            + Modal.addZero(result_date.getUTCMinutes());

        return result;
    },
    displayTask: function(task){
        var ul_target = document.getElementById(task.status);

        var sticky_li = document.createElement("li");
        sticky_li.className ="sticky";
        sticky_li.setAttribute("id", task._id);
        sticky_li.setAttribute("draggable","true");
        sticky_li.addEventListener("dragstart",drag,false);
        var task_name = document.createElement("h2");
        var task_desc = task.description;
        var task_timeV = task.time;
        var task_deadlineV = task.deadline;
        task_name.innerHTML = task.name;
        ul_target.appendChild(sticky_li);
        sticky_li.appendChild(task_name);
        if(task_desc != undefined){
            var task_description = document.createElement("p");
            task_description.innerHTML =task.description;
            sticky_li.appendChild(task_description);
        }
        if(task_timeV != undefined){
            var task_time = document.createElement("h4");
            task_time.innerHTML = task.time;
            sticky_li.appendChild(task_time);
        /*    countdownSpecial(task);*/
        }
        if(task_deadlineV != undefined){
            var task_deadline = document.createElement("h5");
            task_deadline.innerHTML = Modal.formatDate(task.deadline);
            sticky_li.appendChild(task_deadline);
            observeTimeDeadline(task);
        }
        if(task.checkbox != undefined){
            var ul_checkbox = document.createElement("ul");
            var li_checkbox = document.createElement("li");
            sticky_li.appendChild(ul_checkbox);
            for(var i=0; i< task.checkbox.length; i++){
                var check_option = task.checkbox[i].name;
                Modal.displayCheckBox(check_option, ul_checkbox, li_checkbox);
            }
        }
    },
    displayCheckBox: function (check_option, ul_checkbox, li_checkbox) {
        var input_option = document.createElement("input");
        input_option.setAttribute("type", "checkbox");
        input_option.setAttribute("id", check_option);
        input_option.setAttribute("name", check_option);
        var checkbox_label = document.createElement('label');
        ul_checkbox.appendChild(li_checkbox);
        li_checkbox.appendChild(input_option);
        li_checkbox.appendChild(checkbox_label);
        checkbox_label.innerHTML = check_option;
        checkbox_label.setAttribute("for", check_option);
    },
    addCheckOption: function (){
        var ul_checkbox = document.getElementById("ulCheckbox");
        var li_checkbox = document.createElement("li");
        var check_option= document.getElementById("task_checkbox").value;
        if (checkCheckOption() !== true){
            return;
        }
        else {
            Modal.displayCheckBox(check_option, ul_checkbox, li_checkbox);
            document.getElementById("task_checkbox").value = "";
        }
    },

    /*    var ul_target = document.getElementById(task.status);
        var li_issue = document.createElement("li");
        var div_issue = document.createElement("div");
        li_issue.setAttribute("draggable","true");
        li_issue.addEventListener("dragstart",drag,false);
        li_issue.setAttribute("id", task._id);
        ul_target.appendChild(li_issue);
        li_issue.appendChild(div_issue);
        div_issue.innerHTML =task.deadline;*/

    displayTasks: function () {
        var data_array = Couch.getTasks();
        data_array.forEach(function (task) {
            Modal.displayTask(task);
        })
    },
    cleanForm: function (){
        document.getElementById("task_name").value ="";
        document.getElementById("task_desc").value ="";
        document.getElementById("task_deadline").value = "";
        document.getElementById("task_time").value = "";
        document.getElementById("ulCheckbox").innerHTML = "";
        t_deadline.checked =false;
        t_time.checked = false;
        t_checkbox.checked = false;
        Modal.showHideCat('t_deadline','taskWithDeadline');
        Modal.showHideCat('t_time','t_certain_t');
        Modal.showHideCat('t_checkbox','taskWithCheckbox');
    },
    addZero: function(number){
        if (typeof number == "string"){
            number = parseInt(number);
        }
        var result;
        if (number < 10){
            result = "0" + number;
        } else {
            result = number;
        }
        return result;
    }
}
