var Modal = {
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
    addCheckOption: function (){
        var ul_checkbox = document.getElementById("ulCheckbox");
        var li_checkbox = document.createElement("li");
        var check_option= document.getElementById("task_checkbox").value;
        if (checkCheckOption() !== true){
            return;
        }
        else {
            var input_option = document.createElement("input");
            input_option.setAttribute("type","checkbox");
            input_option.setAttribute("id",check_option);
            input_option.setAttribute("name",check_option);
            var checkbox_label = document.createElement('label');
            ul_checkbox.appendChild(li_checkbox);
            li_checkbox.appendChild(input_option);
            li_checkbox.appendChild(checkbox_label);
            checkbox_label.innerHTML = check_option;
            checkbox_label.setAttribute("for",check_option);
            document.getElementById("task_checkbox").value = "";
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
            for (var i =0; i <label.length;i++){
                var checkbox = {name:label[i].innerHTML, done:false}
                check_array.push(checkbox);
            }
            task.checkbox = check_array;
        }
        return task;
    },
    displayTask: function(task){
        var ul_target = document.getElementById(task.status);
        var li_issue = document.createElement("li");
        var div_issue = document.createElement("div");
        li_issue.setAttribute("draggable","true");
        li_issue.addEventListener("dragstart",drag,false);
        li_issue.setAttribute("id", task._id);
        ul_target.appendChild(li_issue);
        li_issue.appendChild(div_issue);
        div_issue.innerHTML =task.deadline;
        /* countdown(task);*/
        countdownSpecial(task);
    },
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
        showHideCat('t_deadline','taskWithDeadline');
        showHideCat('t_time','t_certain_t');
        showHideCat('t_checkbox','taskWithCheckbox');
    }
}
