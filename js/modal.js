var Modal = {
    deadline_regex_manual : /^(0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])\.[0-9]{4}\s([0-1][0-9]|2[0-3])\:[0-5][0-9]$/,
    deadline_regex_input : /^([0-9]{4})\-(0[1-9]|1[0-2])\-(0[1-9]|[1-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3])\:[0-5][0-9]$/,
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
    displayCategoriesForm: function(categories){
        var select_categories = document.getElementById("sel_cat");
        for (var i=0; i<categories.length; i++){
            var opt_category = document.createElement("option");
            select_categories.appendChild(opt_category);
            opt_category.innerHTML = categories[i];
        }
    },
    getTaskFromModal: function(){
        var task_name = document.getElementById("task_name").value;
        var task_desc = document.getElementById("task_desc").value;
        var task_cat = document.getElementById("sel_cat").value;
        var task = {name: task_name,description: task_desc, status: "planned", category:task_cat };
        var t_deadline = document.getElementById("t_deadline");
        var t_time = document.getElementById("t_time");
        var t_checkbox = document.getElementById("t_checkbox");
        task.last_change = new Date().getTime(); // change format date to milliseconds
        if(t_deadline.checked){
            var task_deadline = document.getElementById("task_deadline").value;
            if (this.deadline_regex_manual.test(task_deadline)){
                var parts = task_deadline.split('.');
                var day = parts[0];
                var month = parts[1];
                var year = parts[2].split(" ")[0];
                var time = parts[2].split(" ")[1];
                task.deadline = year + "-"+ month + "-"+ day + "T"+ time;
            } else {
                task.deadline = task_deadline;
            }
        }
        if(t_time.checked){
            var task_time = document.getElementById("task_time").value;
            var time_array = task_time.split(":");
            var minutes = time_array[1];
            var hours = time_array[0];
            var task_red_time = Math.floor((parseInt(minutes) + parseInt(hours)*60)/5);
            task.time = task_time;
            task.red_time = task_red_time;
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
        var result_date = new Date(date);
        var result = Time.addZero(result_date.getUTCDate()) + "."
            + Time.addZero(result_date.getUTCMonth()) + "."
            + result_date.getUTCFullYear() + " "
            + Time.addZero(result_date.getUTCHours()) + ":"
            + Time.addZero(result_date.getUTCMinutes());

        return result;
    },
    displayTask: function(task){
        var ul_target = document.getElementById(task.status);
        var sticky_li = document.createElement("li");
        var remove_button = document.createElement("div");
        remove_button.id = "delete_task";
        remove_button.innerHTML = "x";
        remove_button.onclick = function(e){
            var li_element = e.target.parentNode;
            var id = li_element.getAttribute("id");
            var task = Couch.getTask(id);
            Couch.deleteTask(task);
            li_element.parentNode.removeChild(li_element);

        };
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
        sticky_li.appendChild(remove_button);
        if(task_desc != undefined){
            var task_description = document.createElement("p");
            task_description.innerHTML =task.description;
            sticky_li.appendChild(task_description);
        }
        if(task_timeV != undefined){
            var task_time = document.createElement("h4");
            task_time.classList.add("time");
            task_time.innerHTML = task.time;
            sticky_li.appendChild(task_time);
            Time.observeTime(task);
        }
        if(task_deadlineV != undefined){
            var task_deadline = document.createElement("h5");
            task_deadline.innerHTML = Modal.formatDate(task.deadline);
            sticky_li.appendChild(task_deadline);
            Time.observeTimeDeadline(task);
        }
        if(task.checkbox != undefined){
            var ul_checkbox = document.createElement("ul");
            sticky_li.appendChild(ul_checkbox);
            for(var i=0; i< task.checkbox.length; i++){
                var check_option = task.checkbox[i].name;
                this.displayCheckBox(check_option, ul_checkbox, task.checkbox[i].done);
            }
        }
    },
    displayTasks: function (category) {
        var data_array = Couch.getTasks();
        for (var i=0; i < data_array.length;i++){
            var task = data_array[i];
            if (task.category == category){
                Modal.displayTask(task);
            }
        }

    },
    displayCheckBox: function (check_option, ul_checkbox, is_checked) {
        var li_checkbox = document.createElement("li");
        var input_option = document.createElement("input");
        input_option.setAttribute("type", "checkbox");
        input_option.setAttribute("id", check_option);
        input_option.setAttribute("name", check_option);
        input_option.checked = is_checked;


        input_option.onchange = function () {
            var ul_checkbox = input_option.parentNode.parentNode;
            var li_task = ul_checkbox.parentNode;
            var task_id = li_task.getAttribute("id");
            var ul_finished = document.getElementById("finished");
            var task = Couch.getTask(task_id);
            var all_checked = true;
            for (var i = 0; i < ul_checkbox.childNodes.length; i++) {
                var input = ul_checkbox.childNodes[i].firstChild;
                task.checkbox[i].done = input.checked;
                if(task.checkbox[i].done != true){
                    var all_checked = false;
                }

            }
            if (all_checked == true){
                ul_finished.appendChild(li_task);
                task.status = "finished";
            }
            Couch.updateTask(task);
        }

        var checkbox_label = document.createElement('label');
        ul_checkbox.appendChild(li_checkbox);
        li_checkbox.appendChild(input_option);
        li_checkbox.appendChild(checkbox_label);
        checkbox_label.innerHTML = check_option;
        checkbox_label.setAttribute("for", check_option);
    },
    addCheckOption: function (){
        var ul_checkbox = document.getElementById("ulCheckbox");
        var check_option= document.getElementById("task_checkbox").value;
        if (TaskValidation.checkCheckOption() !== true){
            return;
        }
        else {
            this.displayCheckBox(check_option, ul_checkbox, false);
            document.getElementById("task_checkbox").value = "";
        }
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
        this.showHideCat('t_deadline','taskWithDeadline');
        this.showHideCat('t_time','t_certain_t');
        this.showHideCat('t_checkbox','taskWithCheckbox');
    },

    addNewTask: function (){
        if (TaskValidation.validationForm() != true){
            return;
        }
        var task = this.getTaskFromModal();
        task = Couch.createTask(task);
        if(task.category == CONTEXT.category){
            this.displayTask(task);
        }
        this.cleanForm();
        this.showHideModal();
    }
}
