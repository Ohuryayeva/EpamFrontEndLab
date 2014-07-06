To enable CORS on couchDB make next changes on local.ini file

[httpd]
enable_cors = true
[cors]
origins = *
credentials = true
headers = Authorization, Content-Type
[uuids]
algorithm = utc_random