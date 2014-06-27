var Html = {
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
    }
}
