/**
 * Created by Administrator on 2018/9/13.
 */

var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var sillydatetime = require('silly-datetime');
var util = require('util');
var path = require('path');

/**
 * 查找文件夹
 * @param callback
 */
exports.showDirs = function(callback){
    
    fs.readdir('./uploads',function(err,files){
       
        if(err){
         callback("cuowu",null);
         return;
        }
        var arrFiles = [];
        (function forFiles(i){
            if(i == files.length){
                callback(null,arrFiles);
                return;
            }else {
                fs.stat('./uploads/' + files[i], function (err, stats) {
                    if (err) {
                        callback("cuowu", null);
                        return;
                    }
                    if (stats.isDirectory()) {
                        arrFiles.push(files[i]);
                        forFiles(i+1);
                    }
                })
            }
        })(0)
    })

}
/**
 * 展示图片
 * @param dirname
 * @param callback
 */
exports.showFiles = function(dirname,callback){
    fs.readdir('./uploads/'+dirname,function(err,files){
        if(err){
            callback("cuowu",null);
            return;
        }
        var photoarr = [];
        (function addphoto(i){
            if(i==files.length){
                callback(null,photoarr);
            }else{
                fs.stat('./uploads/'+dirname+'/'+files[i],function(err,stats){
                    if(err){
                        callback("cuowu",null);
                        return;
                    }
                    if(stats.isFile()){
                        photoarr.push(files[i]);
                    }
                    addphoto(i+1);
                })
            }
        })(0);
    })
}

/**
 * 判断相册名是否可用
 * @param callback
 */
exports.dopostDir = function(callback){
    
    fs.readdir(path.normalize(__dirname+"/../uploads"),function(err,files){
        if(err){
            callback("cuowu",null);
            return;
        }
        var arrdir = [];
        (function pushdir(i){
            if(i==files.length){
                callback(null,arrdir);
            }else{
            fs.stat(path.normalize(__dirname+"/../uploads/"+files[i]),function(err,stats){
                if(err){
                    callback("",null);
                    return;
                }
                if(stats.isDirectory()){
                    arrdir.push(files[i]);
                    pushdir(i+1);
                }
            })
            }
        })(0)
    })
}
/**
 * 创建相册
 * @param name
 * @param callback
 */
exports.insertDir = function(name,callback){
    fs.mkdir("./uploads/"+name,function(err){
        if(err){
            callback("cuowu");
        }else{
            callback();
        }
        
    })
}

/**
 * 添加页面
 * @param err
 */
exports.dopost = function(req,res,callback){
    var form = new formidable.IncomingForm();
    form.uploadDir = path.normalize(__dirname + "/../tempup/");
    form.parse(req, function(err, fields, files) {
        console.log(fields);
        console.log(files);
        if(err){
            callback("错误");
            return;
        }
        var photoname = sillydatetime.format(new Date(),'YYYYMMDDHHmmss') + (parseInt(Math.random()*(9999-1000)) + 1000) + path.extname(files.photo.name);
        var newpath = path.normalize(__dirname + "/../uploads/") + fields.xiangce + "/" + photoname;
        var oldpath = files.photo.path;
        if(parseInt(files.photo.size) > 102400 ){
            fs.unlink(oldpath, function(err){
                if(err){
                    callback("错误");
                }
                console.log('文件:'+oldpath+'删除成功！');
                callback('1');
                return;
            })
           
        }else if(parseInt(files.photo.size)==0){
            fs.unlink(oldpath, function(err){
                if(err){
                    callback("错误");
                }
                console.log('文件:'+oldpath+'删除成功！');
                callback('3');
                return;
            })
        }else{
            fs.rename(oldpath,newpath,function(err){
                if(err){
                    callback("错误");
                    return;
                }
                callback('2');
                return;
            });
        }
    });
    
}

exports.queryAllAlbum = function(callback){
    fs.readdir('./uploads',function(err,files){
        if(err){
            callback("错误",null);
            return;
        }
        var albums = [];
        showdir(albums,files,0,callback);
    })
}

function showdir(albums,files,i,callback){
    if(files.length==i){
        callback(null,albums);
        return;
    }
    fs.stat('./uploads/'+files[i],function(err,stats){
        if(err){
            callback("错误",null);
            return;
        }
        if(stats.isDirectory()){
            fs.readdir('./uploads/'+files[i],function(err,newfiles){
                if(err){
                    callback('错误',null);
                    return;
                }
                console.log(4);
                (function showphoto(j){
                    console.log(5);
                    if(j==newfiles.length){
                        console.log(6);
                        showdir(albums,files,i+1,callback);
                        return;
                    }
                    fs.stat('./uploads/'+files[i]+"/"+newfiles[j],function(err,stats){
                        if(err){
                            callback('错误',null);
                            return;
                        }
                        if(stats.isFile()){
                            albums.push(files[i]+"/"+newfiles[j]);
                        }
                        showphoto(j+1);
                    })
                })(0)
            })
        }else{
            showdir(albums,files,i+1,callback);
        }
    })
}

exports.deletedir = function(arrdir,callback){
    (function showdir(i){
        if(i == arrdir.length){
            callback();
            return;
        }
        fs.stat('./uploads/'+arrdir[i],function(err,stats){
            if(err){
                callback("错误")
            }
            if(stats.isDirectory()){
                fs.rmdir('./uploads/'+arrdir[i],function(err){
                    showdir(i+1);
                })
            }else if(stats.isFile()){
                fs.unlink('./uploads/'+arrdir[i],function(err){
                    showdir(i+1);
                })
            }
        })
        
    })(0)
}