//const couchUrl = "epam-tasks-app.iriscouch.com";
//const couchPort = 80;
const authorization = "Basic Y291Y2g6Y291Y2g=";
const couchUrl = "localhost";
const couchPort = 5984;


var http = require('http');
var fs = require('fs');
var mime = require('mime');
var querystring = require('querystring');
var port = process.env.PORT || 8888;
console.log("Starting")
function sendError(res) {
    res.writeHead(302, {
        'Location': '/error.html'
    });
    res.end();
}
http.createServer(function (req, res) {
    //console.log(req.headers);
    if (req.url.lastIndexOf("/couch", 0) === 0) {// check if url starts with '/couch'
        var headers = req.headers;
        headers.host = couchUrl;

        var data;
        var options = {
            hostname: couchUrl,
            port: couchPort,
            path: req.url.replace("/couch", ""),
            method: req.method,
            headers: headers
        };

        var request = http.request(options, function (response) {
            response.pipe(res);

        });
        if (req.method == 'POST' || req.method == 'PUT') {
            req.on("data", function (body) {
                request.write(body);
                request.end();
            })
        } else {
            request.end();
        }

    } else if (req.url.lastIndexOf("/register", 0) === 0 && req.method == 'POST') {
        var jsonString = '';
        req.on('data', function (chunk) {
            // append the current chunk of data to the fullBody variable
            jsonString += chunk.toString();
        });
        req.on("end", function () {

            var formData = querystring.parse(jsonString);

            if (validate(formData)) {

                var createUserRequest = http.request({
                    hostname: couchUrl,
                    port: couchPort,
                    path: "/_users/org.couchdb.user:" + formData.name,
                    method: "PUT",
                    auth: "couch:couch",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": authorization
                    }
                }, function (createUserResponse) {
                    console.log("Create user " + createUserResponse.statusCode);
                    if (createUserResponse.statusCode == 201) {

                        var createDbRequest = http.request({
                            hostname: couchUrl,
                            port: couchPort,
                            path: "/" + formData.name,
                            method: "PUT",
                            headers: {
                                "Authorization": authorization
                            }
                        }, function (createDbResponse) {
                            console.log("Create db " + createDbResponse.statusCode);
                            if (createDbResponse.statusCode == 201) {
                                var securityDbRequest = http.request({
                                    hostname: couchUrl,
                                    port: couchPort,
                                    path: "/" + formData.name + "/_security",
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": authorization
                                    }
                                }, function (securityDbResponse) {
                                    console.log("Security " + securityDbResponse.statusCode);
                                    if (securityDbResponse.statusCode == 200) {
                                        res.writeHead(302, {
                                            'Location': '/login.html'
                                        });
                                        res.end();
                                    } else {
                                        sendError(res);
                                    }

                                });
                                securityDbRequest.write(JSON.stringify({
                                    "admins": {
                                        "names": [],
                                        "roles": []},
                                    "members": {
                                        "names": [formData.name],
                                        "roles": []}
                                }));
                                securityDbRequest.end();
                            } else {
                                sendError(res);
                            }

                        });

                        createDbRequest.end();
                    } else {
                        sendError(res);
                    }

                });
                createUserRequest.write(JSON.stringify({
                    "_id": "org.couchdb.user:" + formData.name,
                    "name": formData.name,
                    "roles": [],
                    "type": "user",
                    "password": formData.password,
                    "configuration": {
                        "groups": ["Personal", "Work", "Shopping"],
                        "store_done_tasks": 3
                    }
                }));
                createUserRequest.end();
            } else {
                sendError(res);
            }
        });

    } else {
        var file = req.url === '/' ? 'index.html' : req.url.substr(1);
        console.log("Get file " + file)
        fs.exists(file, function (exists) {
            if (exists) {
                var stat = fs.statSync(file);

                res.writeHead(200, {
                    'Content-Type': mime.lookup(file),
                    'Content-Length': stat.size
                });

                fs.createReadStream(file).pipe(res);
            } else {
                res.statusCode = 404;
                res.end();
            }
        });
    }
}).listen(port);
console.log("server started on port " + port);
function validate(formData) {
    return true;
}