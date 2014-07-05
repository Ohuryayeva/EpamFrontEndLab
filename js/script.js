
var CONTEXT = {
    intervalIds:{},
    category:{}
}

function init(){
    var login_ok = Couch.login();
    if (login_ok == false){
        window.location = "paralax.html";
    }
    var configuration = {
        "categories": ["Personal", "Work", "Shopping"],
        "store_done_tasks": 3
    };
    CONTEXT.category = configuration.categories[0];
    Modal.displayTasks(CONTEXT.category);
    displayCategories(configuration.categories);

}
var Time = {
    countdownTime: function(task, countdown_time) {
        var li_time = document.getElementById(task._id);
        var element_time = li_time.getElementsByClassName("time")[0];
        var new_time;
        var task_time = document.getElementById("task_time").value;
        if (countdown_time == undefined){  // make review time if we close application with task.status = "started"
            countdown_time = element_time.innerHTML;
        }
        var time_array = countdown_time.split(":");
        var minutes = parseInt(time_array[1]);
        var hours = parseInt(time_array[0]);
        var intervalId = setInterval(function () {

            if(task.red_time > (hours*60 + minutes)){
                element_time.style.color = "red";
            }

            if (minutes == 0 && hours != 0 ){
                hours = hours - 1;
                minutes = 59;
            } else {
                minutes = minutes - 1;
            }

            new_time = [hours, Time.addZero(minutes)].join(':');
            element_time.innerHTML = new_time;
            if(hours == 0 && minutes == 0){
                Time.stopCountdown(task._id);
            }
        }, 1000);
        CONTEXT.intervalIds[task._id] = intervalId;
    },
    observeTime: function (task){
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
                var new_time1 = [Math.floor(minutesLasts / 60), this.addZero(minutesLasts % 60)].join(':');
                element_time.innerHTML = new_time1;
                this.countdownTime(task, new_time1);
            }
        } else{
            this.stopCountdown(task._id)
        }
    },
    stopCountdown: function(task_id){
        if (CONTEXT.intervalIds[task_id] != undefined){
            clearInterval(CONTEXT.intervalIds[task_id]);
            delete CONTEXT.intervalIds[task_id];
        }
    },
    observeTimeDeadline: function (task){
        var intervalId = setInterval(function(){
            var time_to_deadline;
            var li_element = document.getElementById(task._id);
            var elements = li_element.getElementsByClassName("deadline");
            var deadline_element;
            if (elements.length == 0){//check if we didn't have deadline before
                deadline_element = document.createElement("div");
                deadline_element.classList.add('deadline');
                li_element.appendChild(deadline_element);
            } else {
                deadline_element = elements[0]; //if we had deadline before, we write in that div
            }
            var task_date = new Date(task.deadline);
            var offset = new Date().getTimezoneOffset() * 60 * 1000; // count the timezone difference between UTC and Local Time in ms
            var diff_ms = task_date.getTime() - new Date().getTime() + offset; // count difference between task.deadline and today day
            if (diff_ms < 0){
                clearInterval(intervalId);
                li_element.style.backgroundColor = "red";
            }
            var diff = new Date(diff_ms); // return date from ms to date format
            time_to_deadline = "To deadline " + (diff.getUTCDate()-1) + "d "+ diff.getUTCHours() + "h " + diff.getUTCMinutes() + "m " + diff.getUTCSeconds() + "s ";
            deadline_element.innerHTML = time_to_deadline;
        },1000)
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



function changeCategory(cat_element){
    removeTask();
    var categories = cat_element.parentNode.getElementsByTagName('li');
    for (var i =0; i < categories.length; i++){
        categories[i].classList.remove('active');
    }
    cat_element.classList.add('active');
    var category = cat_element.getElementsByTagName('h2')[0].innerHTML;
    CONTEXT.category = category;
    Modal.displayTasks(category);
}
function removeTask(){
    document.getElementById("planned").innerHTML = "";
    document.getElementById("started").innerHTML = "";
    document.getElementById("finished").innerHTML = "";

}

init();