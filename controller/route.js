/**
 * 控制器
 * Created by Administrator on 2018/9/13.
 */
var file = require('../models/file.js');
/**
 * 展示相册目录
 */

exports.showIndex = function(req,res,next){
    
    file.showDirs(function(err,fiels){
        if(err){
            next();
            return;
        }
        res.render('index',{fiels:fiels});
    });
}
/**
 * 展示个人相片
 * @param req
 * @param res
 * @param next
 */
exports.showPhoto = function(req,res,next){
    file.showFiles(req.params.Album,function(err,photoarr){
    
        if(err){
            next();
            return;
        }
        res.render('album',{"photoarr":photoarr,"name":req.params.Album});
    })
}
/**
 * 错误页面
 * @param req
 * @param res
 */
exports.showError = function(req,res){
    res.render('errPage');
}

/**
 * 跳到创建相册页面
 * @param req
 * @param res
 */
exports.addDir = function(req,res){
     res.render('addxiangce',{message:""});
}
/**
 * 创建相册
 * @param req
 * @param res
 * @param next
 */
exports.dopostDir = function(req,res,next){
    var name = req.body.name;
    file.dopostDir(function(err,dirarr) {
        if (err) {
            next();
            return;
        }
        if (!name) {
            res.render('addxiangce', {message: "showtip(1)"});
            return;
        }
        if (dirarr.join('-').indexOf(name) != -1) {
            res.render('addxiangce', {message: "showtip(2)"});
            return;
        }
        file.insertDir(name,function(err){
         if(err){
         next();
         return;
         }
         res.render('addxiangce',{message:'showtip(3);'});
        })
         })
}

/**
 * 跳的上传图片页面
 * @param req
 * @param res
 * @param next
 */
exports.addAlbumPage = function(req,res,next){
    file.showDirs(function(err,fiels){
        if(err){
            next();
            return;
        }
        res.render('addAlbum',{fiels:fiels});
    });
}

/**
 * 上传图片
 * @param req
 * @param res
 * @param next
 */
exports.dopost = function(req,res,next){
    console.log(next);
    file.dopost(req,res,function(err){
       if(err=="错误"){
           next();
           return;
       }else if(err=='1'){
           res.send('文件太大');
       }else if(err=='2'){
           res.send('上传成功');
       }else if(err=='3'){
           res.send('文件为空');
       }
    });
}

/**
 * 展示所有图片
 * @param req
 * @param res
 * @param next
 */
exports.queryAllAlbum = function(req,res,next){
    file.queryAllAlbum(function(err,albums){
      if(err){
          next();
          return;
      }
      res.render('albums',{
          albums:albums
      });
    });
}
/**
 * 删除文件夹
 * @param req
 * @param res
 * @param next
 */
exports.deletedir = function (req,res,next) {
   var arrdir = req.query;
   file.deletedir(arrdir.arr,function(err){
      if(err){
          next();
          return;
      }
      res.send('success');
   })
}