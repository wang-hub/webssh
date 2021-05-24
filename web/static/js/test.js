
function showhtml(){
    document.getElementById("fra").style.display="inline";
}

function changeID(){

}



function test(){
    /*
    获取配置文件信息,返回切分好的列表
    userList:包括所有信息的列表
    userList[i]:第i个用户信息（包括host、port、username、ispwd、password）
    userList[i][0]:获得第i个用户的host,值格式为host:****
    */
    var con = getConfigFile();
    console.log("con:",con[0][0]);  //输出第一个用户的host

    /*
    连接函数
    _host:主机名，_port:端口，_username:用户名
    _secret:密码或者密钥
    _ispwd：true：secret为密码；false：secret为密钥(默认为密码)
    _remember:是否要记住当前用户名（默认为不记住）
    */
    //login(_host="192.168.129.159",_port="22",_username="pai",_secret="123456",);


    var worker = new Worker("static/js/work.js");
    worker.onmessage = function(event){
        console.log("event:",event.data);
    }
    console.log("执行了\n");
    /*
    执行命令，结果输出在文本框中,并返回
    cmd:要执行的命令
    */
//    var cmd = "ls";
//    var res = exeCommend(cmd);
//    console.log("res:",res);

    /*
    获取文件信息
    */
//    var fileRes = getFile("a.c");
//    console.log("file:",fileRes);
}
