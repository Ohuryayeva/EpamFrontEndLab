
var Couch = {
    db : "",
    auth : "",
    createTask: function(task){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/couch/"+ this.db +"/", false);
        var task_id;
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return; //return if not complete

            if (xhr.status != 201 && xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            var dataJson = xhr.responseText;
            var data = JSON.parse(dataJson);
            task._id = data.id;
        }
        xhr.send(JSON.stringify(task));
        return task;
    },
    login : function(){
        var xhr = new XMLHttpRequest();
        var result;
        var name = window.atob(this.getURLParameter('auth')).split(":")[0];
        xhr.open('GET', '/couch/_users/org.couchdb.user:' + name , false);
        var auth = "Basic " + this.getURLParameter('auth');
        xhr.setRequestHeader("Authorization", auth);
        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return; //return if not complete
            if (xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            Couch.auth = auth;
            Couch.db = name;
            var dataJson = xhr.responseText;
            Couch.user_info = JSON.parse(dataJson);
        }
        xhr.send();
        return  this.user_info.configuration;
    },
    getTask: function(task_id){
        var xhr = new XMLHttpRequest();
        var result;
        xhr.open('GET', '/couch/' + this.db +'/'+ task_id, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return; //return if not complete
            if (xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            var dataJson = xhr.responseText;
            result = JSON.parse(dataJson);
        }
        xhr.send();
        return  result;
    },
    getTasks: function() {
        var xhr = new XMLHttpRequest();
        var plannedUl = document.getElementById("planned");
        var data_array = [];
        xhr.open('GET', '/couch/' + this.db +'/_all_docs?include_docs=true', false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return; //return if not complete

            if (xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            var dataJson = xhr.responseText;
            var data = JSON.parse(dataJson);
            for (var i = 0; i < data.rows.length; i++) {
                data_array.push(data.rows[i].doc);
            }
            console.log(data_array);
        }
        xhr.send();
        return data_array;
    },
    updateTask: function(task){
        var last_change = new Date().getTime();
        var li_time = document.getElementById(task._id);
        var elements_time = li_time.getElementsByClassName("time");
        if (elements_time.length > 0){
            var task_time = elements_time[0].innerHTML;
            task.time = task_time;
        }
        var task_id = task._id;
        task.last_change = last_change;
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/couch/' + this.db +'/'+ task_id, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.send(JSON.stringify(task));
    },
    deleteTask: function(task){
        var li_element = document.getElementById(task._id)
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/couch/' + this.db + '/' + task._id + "?rev=" + task._rev, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.send(JSON.stringify());
    },
    getURLParameter :function (name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
    }
}


