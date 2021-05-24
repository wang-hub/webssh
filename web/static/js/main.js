//文件操作按钮显示
function showFileOp(){
    document.getElementById("fileList").innerHTML = "";
    document.getElementById("fileList").style.display = "inner";
    document.getElementById("exeFileButton").style.display = "inner";
    document.getElementById("exeFileTextButton").style.display = "inner";
    document.getElementById("getFileTextButton").style.display = "inner";
    document.getElementById("exeFileEndButton").style.display = "inner";
    document.getElementById("fileText").innerHTML = "";
    document.getElementById("fileText").style.display = "inner";
}

//文件操作按钮隐藏
function hideFileOp(){
//    document.getElementById("getFileListButton").style.display="none";
    document.getElementById("fileList").style.display ="none";
    document.getElementById("exeFileButton").style.display="none";
    document.getElementById("exeFileTextButton").style.display="none";
    document.getElementById("getFileTextButton").style.display="none";
    document.getElementById("exeFileEndButton").style.display="none";
    //document.getElementById("fileText").style.display="none";
    }

//新建终端并显示
function newTerminal(options) {
    var size=getTerminalSize();
    var term =new Terminal({
        //cols:size["w"],
        //rows:size["h"],
        cols:80,
        rows:24,
        screenkeys: true,
        useStytle:true,
        scrollback:10,//终端中的回滚量
        cursorStyle: 'underline', //光标样式
        cursorBlink: true, // 光标闪烁
        convertEol: true, //启用时，光标将设置为下一行的开头
        disableStdin: false, //是否应禁用输入
        theme: {
            foreground: 'yellow', //字体
            background: '#060101', //背景色
            cursor: 'help',//设置光标
        }
    });
    term.open(document.getElementById('term'));   //在div上显示终端
    $('.terminal').detach().appendTo('#term');   //绑定
    $("#term").show();   //终端显示
    term.writeln('Connecting...');
    //终端发送数据给服务端
    term.onData(function (data) {
        if(!exeFlag){  //只有不在执行文件操作才可以使用终端
            client.sendClientData(data);
        }
        else{
            alert("请先结束文件操作！");
        }
    });

    client.connect({        
        //连接错误提示
        onError: function (error) {
            term.write('Error: ' + error + '\r\n');
        },
        //连接
        onConnect: function () {
            client.sendInitData(options);
        },
        //连接关闭，终端隐藏
        onClose: function () {
            term.write("\nconnection closed");
            alert("connecting closed!");
            hideFileOp();
            document.getElementById("getFileListButton").style.display="none";
            $("#term").innerHTML="";
            window.location.reload();
        },
        //接到数据
        onData: function (data) {
            console.log('get data:' + data,dataCallBack);
            if(getTitleFlag){
                showTitle(data);
            }
            else{
                document.getElementById("getFileListButton").style.display="inline";
                if(!exeFlag){
                    term.write(data);
                }
                //命令用于执行文件操作
                else{
                    //过滤发送命令的回显
                    //0为命令回显，2为提示回显，1为所需信息
                    if(dataCallBack != 1){
                        dataCallBack = (dataCallBack+1)%3;
                    }
                    else{
                    dataCallBack = (dataCallBack+1)%3;
                    //获取文件列表操作
                    if(fileListContentFlag){
                            fileListContent = [];
                            if(data!=null){ //后台传回来的select选项
                                //console.log("file:"+data);
                                data = data.split("\n");
                                for(var i=0;i<data.length;i++){
                                    if(data[i].length>1){
                                        fileListContent.push(data[i]);   //将数据保存
                                    }
                                }
                            }
                            showFileList(fileListContent);  //显示在下拉框
                            fileListContentFlag = !fileListContentFlag;
                        }
                    //获取文件内容操作
                    else if(fileContentFlag){
                        dataCallBack = (dataCallBack+1)%3;
                        //过滤回显信息
                        data = data.split("\n");
                        var data_string="";
                        for(var i=0;i<data.length-2;i++){
                            if(i!=0){
                                data_string +="\n";
                            }
                            data_string += data[i].toString();
                        }
                        fileContent = data_string;
                        //console.log("fileContent:",fileContent);
                        showFileContent(fileContent);
                        fileContentFlag = !fileContentFlag;
                    }
                    //执行命令操作
                    else if(cmdResultFlag)
                    {
                        dataCallBack = (dataCallBack+1)%3;
                        cmdResult = data;
                        //console.log("cmdResult:",cmdResult);
                        //showFileContent(cmdResult);
                        alert("执行完毕！");
                        cmdResultFlag = !cmdResultFlag;
                    }
                }
                }
            }
        }
    })
}

//单个字符大小，用于计算终端w和h
var charWidth = 6.2;
var charHeight = 15.2;
//计算终端w，h
function getTerminalSize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    return {
        "w": Math.floor(width / charWidth),
        "h": Math.floor(height / charHeight)
    };
}

//检查数据合法性
function check() {
    //加功能后出现问题
    return validResult["host"] && validResult["port"] && validResult["username"];
}

//点击连接执行函数
function connect() {
    var options = {                  //输入
        host: $("#host").val(),
        port: $("#port").val(),
        username: $("#username").val(),
        ispwd: $("input[name=ispwd]:checked").val(),
        secret: $("#secret").val(),
        remember: $("#remember").is(":checked"),
        repetition: false,
    };
    console.log("ispwd:",options["ispwd"]);
    //标选rem，保存
     if (options["remember"]) {
         var index = $.inArray($("#host").val(),hostList);
         if(index>=0){
            var r = confirm("历史中已有该用户信息，是否覆盖？");
            if(r){
                options["repetition"] = true;
            }
            else{
                options["remember"] = false;
            }
         }
     }
    //合法性通过
    //if (check()) {
    if(true){
         $("#term").innerHTML="";
         document.getElementById("term").innerHTML="";
         document.getElementById("getFileListButton").style.display="none";
         hideFileOp();
         newTerminal(options);    //建立终端
    } else {
        //错误信息
        console.log("check error");
        for (var key in validResult) {
            if (!validResult[key]) {
                alert(errorMsg[key]);
                break;
            }
        }
    }
}

/*
连接函数
host:主机名，port:端口，username:用户名
secret:密码或者密钥
ispwd：true：secret为密码；false：secret为密钥
remember:是否要记住当前用户名
*/
function login(_host, _port, _username, _secret, _ispwd="true", _remember=false)
{
    var options = {
        host: _host,
        port: _port,
        username: _username,
        secret: _secret,
        ispwd: _ispwd,
        remember: _remember,
        repetition: false,
    }
    console.log("_ispwd:",options["ispwd"]);
    if (_remember) {
         var index = $.inArray(_host,hostList);
         if(index>=0){
            var r = confirm("历史中已有该用户信息，是否覆盖？");
            if(r){
                options["repetition"] = true;
            }
         }
    }
    newTerminal(options);
    //client.sendInitData(options);
}

/*
获取配置文件信息,返回切分好的列表
userList:包括所有信息的列表
userList[i]:第i个用户信息（包括host、port、username、ispwd、password）
userList[i][0]:获得第i个用户的host,值格式为host:****
*/
function getConfigFile(){
    console.log("userList:",userList);
    return userList;
}

//下拉框内容显示到输入框函数
function getHost(){
    var value=$("#mySelect").val();
    $("#host").val(userList[value][0].split(":")[1]);
    $("#port").val(userList[value][1].split(":")[1]);
    $("#username").val(userList[value][2].split(":")[1]);
    $("#secret").val(userList[value][3].split(":")[1]);
    if(userList[value][4].split(":")[1].toLowerCase() != "true"){
        $("#ispwd").val("false");
        $("#primerykey").val("true");
    }
    else{
        $("#ispwd").val("true");
        $("#primerykey").val("false");
    }
}

//获取当前目录的文件列表
function getFileListContent(){
    fileListContentFlag = true;
    client.sendClientData("ls -l | grep ^[^d] | awk '{print $9}'\r\n"); //通过ls命令返回文件名
}

//获取当前目录下文件列表并显示在下拉框
function getFileList(){
    exeFlag = true;  //文件操作标志，让终端不可用
    dataCallBack = 0;  //乱码刷新
    getFileListContent();  //获取文件列表
}

//列表显示在下拉框
function showFileList(fileListCon){
    console.log("filelistcon",fileListCon);
    var selFile = document.getElementById("fileList");
    selFile.innerHTML="";
    if(fileListCon != null){
        for(var i=0;i<fileListCon.length;i++){
            //遍历后台传回的结果，一项项往select中添加option(text,value)
            selFile.add(new Option(fileListCon[i] , i));
        }
    }
    //组件变得可见
    selFile.style.display = "inline";
    document.getElementById("exeFileButton").style.display="inline";
    document.getElementById("exeFileTextButton").style.display="inline";
    document.getElementById("getFileTextButton").style.display="inline";
    document.getElementById("exeFileEndButton").style.display="inline";
    //document.getElementById("fileText").style.display="inline";
}
/*
获取文件信息保存并返回
fileName:要获取的文件名
*/
function getFileContent(fileName){
    fileContentFlag = true;  //等待回显信息的标志
    client.sendClientData("cat "+fileName+"\r\n");
}

//通过下拉框获取文件信息并显示
function getFileText(){
    var index=document.getElementById("fileList").selectedIndex;//获取当前选择项的索引.
    console.log("index:",index);
    if(index<0){
        alert("没有可操作文件");
        return;
    }
    var fileName = document.getElementById("fileList").options[index].text;//获取当前选择项的文本.
    getFileContent(fileName);  //获取文件内容
}

//将内容显示在文本框
function showFileContent(fileText)
{
    document.getElementById("fileText").value = fileText; //回显
}

//执行命令
function exeCmd(cmd){
    cmdResultFlag = true;
    client.sendClientData(cmd+"\r\n");
}

//执行文件
function exeFileCmd(fileName){
    cmdResultFlag = true;  //等待回显信息的标志
    client.sendClientData("source "+fileName+"\r\n");
}

//执行下拉框脚本文件
function exeFile(){
    exeFileFlag = true;
    var index=document.getElementById("fileList").selectedIndex;//获取当前选择项的索引.
    if(index<0){
        alert("没有可操作文件");
        return;
    }
    var fileName = document.getElementById("fileList").options[index].text;//获取当前选择项的文本.
    exeFileCmd(fileName);  //执行文件
}

//执行文本框内容
function exeFileText(){
    var tex = document.getElementById("fileText").value;  //获取文本框内容
    exeCmd(tex);   //执行
}

//文件操作结束
function exeFileEnd(){
    exeFlag = false;
    dataCallBack = 0;
    hideFileOp();
}

/*
执行命令，结果输出在文本框中,并返回
cmd:要执行的命令
*/
function exeCommend(cmd)
{
    exeCmd(cmd);
    return cmdResult;
}

//获取数据库所有次数和题目号
function getTitleDir(){

}

//获取数据库的题目
function getTitle(number=1, id=1)  //默认第一次第一题
{
    var options = {
        number: number,
        id: id
    };
    client.sendTitleData(options);
}

/*
获取文件信息
*/
function getFile(fileName){
    getFileContent(fileName);
    return fileContent;
}


//将题目展示在特定区域
function showTitle(title){
    document.getElementById("title").text(title);
}

var getTitleFlag = false;

var exeFlag = false;
var dataCallBack = 0;

var fileListContent = "";  //保存获取的文件列表
var fileListContentFlag = false;

var fileContent = "";  //保存获得文件内容
var fileContentFlag = false;

var cmdResult = "";  //保存执行结果
var cmdResultFlag = false;
