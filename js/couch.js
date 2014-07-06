const CouchBDHOST = 'http://localhost:5984/';
//const CouchBDHOST = 'http://epam-tasks-app.iriscouch.com/';

var Couch = {
    db : "",
    auth : "",
    createTask: function(task){
        var xhr = new XMLHttpRequest();
        xhr.open("POST", CouchBDHOST + this.db +"/", false, 'couch', 'couch');
        var task_id;
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); //needs to send data to server
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.withCredentials = true;
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
    checkLogin : function(){
        var xhr = new XMLHttpRequest();
        var result;
        var auth = this.getAuthCookie();
        if (auth == undefined || auth == ''){
            result = false;
        } else
        {
            var name = window.atob(auth.replace("Basic ", "")).split(":")[0];
            xhr.open('GET', CouchBDHOST + name, false);
            xhr.setRequestHeader("Authorization", auth);
            xhr.onreadystatechange = function () {

                if (xhr.readyState != 4) return; //return if not complete
                if (xhr.status == 200) { //check request status
                    result = true;
                    Couch.auth = auth;
                    Couch.db = name;
                } else {
                    result = false;
                }
            }
            xhr.send();
        }
        return  result;
    },
    getTask: function(task_id){
        var xhr = new XMLHttpRequest();
        var result;
        xhr.open('GET', CouchBDHOST + this.db +'/'+ task_id, false);
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
        xhr.open('GET', CouchBDHOST + this.db +'/_all_docs?include_docs=true', false);
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
        xhr.open('PUT', CouchBDHOST + this.db +'/'+ task_id, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.send(JSON.stringify(task));
    },
    deleteTask: function(task){
        var li_element = document.getElementById(task._id)
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', CouchBDHOST + this.db + '/' + task._id + "?rev=" + task._rev, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.send(JSON.stringify());
    },
    saveLoginToCookie: function() {
        var name = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        var hash = window.btoa(name + ":" + password);

        var exp_date = new Date();
        exp_date.setDate(exp_date.getDate() +1);
        var auth = encodeURIComponent("Basic " + hash);// make coding to avoid incorrect requests to the server
        document.cookie = "auth=" + auth + ";path=/;expires=" + exp_date.toUTCString();
        window.location = "design.html";
    },
    getAuthCookie :function (name) {
        var cookies = document.cookie.split(";");
        var auth;
        for (var i=0; i < cookies.length; i++){
            if ('auth' == cookies[i].split("=")[0]){
                auth = decodeURIComponent(cookies[i].split("=")[1]);
            }
        }
        return auth;
    },
    logout : function(){
        document.cookie = "auth=;path=/;expires=-1;";
        window.location = "paralax.html";
    },
    updateUser: function(user){
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", CouchBDHOST + "_users/org.couchdb.user:" + Couch.db, false);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");//needs if we send data to server
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return; //return if not complete

            if (xhr.status != 201 && xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            var dataJson = xhr.responseText;
            var data = JSON.parse(dataJson);
        }
        xhr.send(JSON.stringify(user));
    },
    getUser: function(){
        var xhr = new XMLHttpRequest();
        var user;
        xhr.open('GET', CouchBDHOST + "_users/org.couchdb.user:" + Couch.db, false);
        xhr.setRequestHeader("Authorization", this.auth);
        xhr.onreadystatechange = function () {

            if (xhr.readyState != 4) return; //return if not complete
            if (xhr.status != 200) { //check request status
                alert('Error ' + xhr.status + ': ' + xhr.statusText);
                return;
            }
            var dataJson = xhr.responseText;
            user = JSON.parse(dataJson);
        }
        xhr.send();
        return user;
    }
}


