
var CONTEXT = {
    tasks : {},
    intervalIds:{},
    auth_token: ''
}

function removeError(input){
    input.setCustomValidity("");
}
function showErrorMessage(input, message){
    input.setCustomValidity(message);
    document.getElementById("show_message").click();
}

/*Add,save in db and paint new issue*/
function addTask(){
    if (validationForm() != true){
        return;
    }
    var task = Modal.getTaskFromModal();
    task = Couch.createTask(task);
    Modal.displayTask(task);
    Modal.cleanForm();
    Modal.showHideModal();
    var deadLine = new Date(Date.parse('2014-07-26T21:11'));
}

function validationForm(){
    return checkTaskName() && checkTaskTime() && checkDeadline();
}
function checkTaskName(){
    var task_name = document.getElementById("task_name").value;
    if(task_name.length < 3){
        showErrorMessage(document.getElementById("task_name"), "More than 3 letters")
        return false;
    } else{
        return true;
    }
}
function checkCheckOption(){
    var check_option= document.getElementById("task_checkbox").value;
    if(check_option == ""){
        showErrorMessage(document.getElementById("task_checkbox"), "Empty option is not allowed")
        return false;
    } else{
        return true;
    }
}
function checkTaskTime(){
    var task_time_element = document.getElementById("task_time");
    if (document.getElementById("t_certain_t").style.display == 'block'){
        var task_time = task_time_element.value;
        var time_check = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        if (time_check.test(task_time) == false) {
            showErrorMessage(task_time_element, "You should write only numbers from 0 to 60")
        }
        return time_check.test(task_time);
    } else {
        return true;
    }
}
function checkDeadline() {
    var deadline = document.getElementById("task_deadline");
    if(document.getElementById("taskWithDeadline").style.display == 'block')
    {
        var deadline_time = deadline.value;
        var deadline_check = Modal.deadline_regex;
        if (deadline_check.test(deadline) == false) {
            showErrorMessage(deadline, "Write date in right format")
        }
        return deadline_check.test(deadline);
    } else {
        return true;
    }
}

function observeTime(task_id, countdown_time) {
    var li_time = document.getElementById(task_id);
    var element_time = li_time.childNodes[0];
    var new_time;
    if (countdown_time == undefined){
        countdown_time = element_time.innerHTML;
    }
    var time_array = countdown_time.split(":");
    var minutes = time_array[1];
    var hours = time_array[0];
    var certain_time = Math.floor((parseInt(minutes) + parseInt(hours)*60)/2);
    var half_time = [Math.floor(certain_time/60), certain_time%60];
    var intervalId = setInterval(function () {

        if(half_time[0] > parseInt(hours) || half_time[0] == parseInt(hours) && half_time[1] >= parseInt(minutes)){
            element_time.style.backgroundColor = "red";
        }

        if (minutes == 0 && hours != 0 ){
            hours = hours - 1;
            minutes = 59;
        } else {
            minutes = minutes - 1;
        }
        if(minutes < 10){
            minutes = "0" +minutes;
        }
        new_time = [hours, minutes].join(':');
        element_time.innerHTML = new_time;
        if(hours == 0 && minutes == 0){
            stopCountdown(task_id);
        }
    }, 1000);
    CONTEXT.intervalIds[task_id] = intervalId;
}

Couch.getTasks();
Modal.displayTasks();



function countdown(task){
    if(task.status == "started"){
        observeTime(task._id)
    } else{
        stopCountdown(task._id)
    }
}
function stopCountdown(task_id){
    if (CONTEXT.intervalIds[task_id] != undefined){
        clearInterval(CONTEXT.intervalIds[task_id]);
        delete CONTEXT.intervalIds[task_id];
    }
}
function countdownSpecial(task){
    var li_time = document.getElementById(task._id);
    var element_time = li_time.childNodes[0];
    if(task.status == "started"){
        var diff = Math.floor((new Date().getTime()-task.last_change)/1000);
        var time_array = task.time.split(":");
        var minutesDB = time_array[0]*60 + parseInt(time_array[1]);
        var minutesLasts = minutesDB - diff;
        if (minutesLasts <= 0){
            element_time.innerHTML = "0:00";
        } else {
            var new_time1 = [Math.floor(minutesLasts/60), minutesLasts%60].join(':');
            element_time.innerHTML = new_time1;
            observeTime(task._id, new_time1);
        }
    }
}

function observeTimeDeadline(task){
    var intervalId = setInterval(function(){
        var time_to_deadline;
        var li_element = document.getElementById(task._id);
        var elements = li_element.getElementsByClassName("deadline");
        var deadline_element;
        if (elements.length == 0){
            deadline_element = document.createElement("div");
            deadline_element.classList.add('deadline');
            li_element.appendChild(deadline_element);
        } else {
            deadline_element = elements[0];
        }
        var task_date = new Date(task.deadline);

        var diff_ms = task_date.getTime() - new Date().getTime();
        if (diff_ms < 0){
            clearInterval(intervalID);
            console.log("time is finished");
        }
        var diff = new Date(diff_ms);
        time_to_deadline = "To deadline " + (diff.getUTCDate()-1) + "d "+ diff.getUTCHours() + "h " + diff.getUTCMinutes() + "m " + diff.getUTCSeconds() + "s ";
        deadline_element.innerHTML = time_to_deadline;
    },1000)
}
