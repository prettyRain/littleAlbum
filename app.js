/**
 * Created by Administrator on 2018/9/13.
 */

var express = require('express');
var bodyParser = require('body-parser');
var route = require('./controller');
var app = express();

//模板使用
app.set('view engine','ejs');
//静态文件
app.use(express.static('./uploads'));
app.use(express.static('./public'));


//首页
app.get('/',route.showIndex);
//查看相册里的图片
app.get('/:Album',route.showPhoto);
//跳到创建相册页面
app.get('/addDir',route.addDir);
//创建相册
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/addDir',route.dopostDir);
//跳到上传图片页面
app.get('/addAlbumPage',route.addAlbumPage);
app.post('/dopost',route.dopost);

//展示
app.get('/queryAllAlbum',route.queryAllAlbum);
//删除文件夹
app.get('/deletedir',route.deletedir);
app.use(route.showError);


app.listen(3000);
