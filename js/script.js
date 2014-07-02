
var CONTEXT = {
    intervalIds:{}
}

function countdownTime(task_id, countdown_time) {
    var li_time = document.getElementById(task_id);
    var element_time = li_time.getElementsByClassName("time")[0];
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



function observeTime(task){
    var li_time = document.getElementById(task._id);
    var element_time = li_time.getElementsByClassName("time")[0];
    if(task.status == "started"){
        var diff = Math.floor((new Date().getTime() - task.last_change) / 1000);
        var time_array = task.time.split(":");
        var minutesDB = time_array[0] * 60 + parseInt(time_array[1]);
        var minutesLasts = minutesDB - diff;
        if (minutesLasts <= 0) {
            element_time.innerHTML = "0:00";
        } else {
            var new_time1 = [Math.floor(minutesLasts / 60), minutesLasts % 60].join(':');
            element_time.innerHTML = new_time1;
            countdownTime(task._id, new_time1);
        }
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
