
onmessage = function(){
    console.log("i am coming!");
    getFileList();
    while(exeFlag){}
    console.log("work fileList:",fileListContent);
    postMessage(fileListContent);
}
