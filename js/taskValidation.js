var TaskValidation = {
    validationForm: function (){
        return this.checkTaskName() && this.checkTaskTime() && this.checkDeadline();
    },
    checkTaskName: function (){
        var task_name = document.getElementById("task_name").value;
        if(task_name.length < 3){
            this.showErrorMessage(document.getElementById("task_name"), "More than 3 letters")
            return false;
        } else{
            return true;
        }
    },
    checkCheckOption: function (){
        var check_option= document.getElementById("task_checkbox").value;
        if(check_option == ""){
            this.showErrorMessage(document.getElementById("task_checkbox"), "Empty option is not allowed")
            return false;
        } else{
            return true;
        }
    },
    checkTaskTime: function (){
        var task_time_element = document.getElementById("task_time");
        if (document.getElementById("t_certain_t").style.display == 'block'){
            var task_time = task_time_element.value;
            var time_check = /^([0-1][0-9]|2[0-3])\:[0-5][0-9]$/;
            if (time_check.test(task_time) == false) {
                this.showErrorMessage(task_time_element, "Write time in right format")
            }
            return time_check.test(task_time);
        } else {
            return true;
        }
    },
    checkDeadline: function () {
        var deadline = document.getElementById("task_deadline");
        if(document.getElementById("taskWithDeadline").style.display == 'block')
        {
            var deadline_time = deadline.value;
            var result = true;
            if (Modal.deadline_regex_manual.test(deadline_time) == false
                && Modal.deadline_regex_input.test(deadline_time) == false) {
                result = false;
                this.showErrorMessage(deadline, "Write date in right format");
            }
            return result;
        } else {
            return true;
        }
    },
    removeError: function (input){
        input.setCustomValidity("");
    },
    showErrorMessage: function (input, message){
        input.setCustomValidity(message);
        document.getElementById("show_message").click();
    }
}
