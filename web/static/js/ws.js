function Client_ssh() {
};


Client_ssh.prototype._generateURL = function () {     //建立请求网址
    if (window.location.protocol == 'https:') {
        var protocol = 'wss://';
    } else {
        var protocol = 'ws://';
    }
    var gURL = protocol + window.location.host + '/ws';
//    console.log("url:"+gURL);
    return gURL;
};

//连接函数
Client_ssh.prototype.connect = function (options) {
    var gURL = this._generateURL();
    //新建
    if (window.WebSocket) {           
        this.conn = new WebSocket(gURL);
    }
    else if (window.MozWebSocket) {
        this.conn = MozWebSocket(gURL);
    }
    else {
        options.onError('WebSocket Not Supported');
        return;
    }

    //连接成功的回调函数
    this.conn.onopen = function () {
        options.onConnect();
    };

    //收到服务器数据后的函数（websocket是服务器发起）
    this.conn.onmessage = function (evt) {
        var data = evt.data.toString();  //数据可能是文本也可能是二进制数据
        options.onData(data);      //回显
    };

    //连接关闭的回调函数
    this.conn.onclose = function (evt) {
        options.onClose();
    };
};

//向服务器发送数据
Client_ssh.prototype.send = function (data) {
    this.conn.send(JSON.stringify(data));
};

//建立连接数据
Client_ssh.prototype.sendInitData = function (options) {
    var data = {
        hostname: options.host,
        port: options.port,
        username: options.username,
        ispwd: options.ispwd,
        secret: options.secret
    };
    this.conn.send(JSON.stringify({"tp": "init", "data": options}))
}

//发送数据
Client_ssh.prototype.sendClientData = function (data) {
    this.conn.send(JSON.stringify({"tp": "client", "data": data}))
}

//发送获取数据库题目数据
Client_ssh.prototype.sendTitleData = function(options){
    var data = {
        number: options.number,
        id: options.id
    };
    this.conn.send(JSON.stringify({"tp":"title", "data": data}));
}

var client = new Client_ssh();

