var http = require('http')
var fs = require('fs')
var url = require('url')
var queryString = require("querystring");
var qiniu = require('qiniu');
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号\n node server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var path = request.url
    var query = ''
    if (path.indexOf('?') >= 0) { query = path.substring(path.indexOf('?')) }
    var pathNoQuery = parsedUrl.pathname
    var queryObject = parsedUrl.query
    var method = request.method
    console.log('HTTP 路径  path::' + path)
    console.log('查询字符串为::' + query)
    console.log('不含查询字符串的路径为::' + pathNoQuery);
    if (path === '/uptoken') {
        response.statusCode = 200
        response.setHeader('Content-Type', 'text/json;charset=utf-8');
        response.setHeader('Access-Control-Allow-Origin', '*');
        var config = fs.readFileSync('./qiniu-key.json', )
        config = JSON.parse(config);
        let { accessKey, secretKey } = config;
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var options = {
            scope: 'music-163',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken = putPolicy.uploadToken(mac);
        let str = `{
            "uptoken":"${uploadToken}"
        }`;
        response.write(str);
        response.end();

    } else {
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/text;charset=utf-8');
        response.write(
            '404 错误'
        );
        response.end();
    }


})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请打开 http://localhost:' + port)

