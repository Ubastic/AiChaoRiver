var ip = 'http://river.api.smdouyou.com/';
var imgurl = 'http://static.upload.smdouyou.com/'

/**
*	@description 数据请求函数
* 	@param {String} url 数据地址
* 	@param {String} data 参数
* 	@param {Function} callback 回调函数
*   @param {Boolean} is_loading 是否显示Loading
*/
function sendAjax(url,data,callback,is_loading){
	var url = ip + '/index.php/Api/' + url;
	var store_id = plus.storage.getItem('store_id');
	if(store_id != null) data.store_id = store_id;
	mui.ajax({
		url : url,
		type : 'POST',
		crossDomain : true,
		data : data,
		dataType : 'json',
		beforeSend : function(){
			if(is_loading !== false) plus.nativeUI.showWaiting('');
		},
		success : function(result){
			if(is_loading !== false) plus.nativeUI.closeWaiting();
			callback(result);
		},
		error : function(xhr,type,errorThrown){
			plus.nativeUI.closeWaiting();
		}
	});
}

function isLogin(){
	var user_id = plus.storage.getItem('user_id');
	if(user_id == null || user_id == ''){
		return false;
	}else{
		return true;
	}
}

/**
*	@description 检查更新
*/
function updateVersion(){
	plus.runtime.getProperty(plus.runtime.appid,function(result){
	    $('.version').text('当前版本：' + result.version);
	    var option = {
			version : result.version
		};
		mui.post(getLocation('Index/updateVersion.html'),option,function(result){
			if(result.status == 'success'){
				plus.nativeUI.confirm('检查到新的版本，是否更新？',function(e){
					if(e.index == 0) downWgt(ip + result.file);
				},'提示',['是','否']);
			}
		},'json');
	
	});
}

/**
*	@description 下载更新资源
*/
function downWgt(url){
	plus.nativeUI.showWaiting('更新中...');
	plus.downloader.createDownload(url,{filename:'_doc/update/'},function(d,status){
        if(status == 200){
        	plus.runtime.install(d.filename,{},function(){
		        plus.nativeUI.closeWaiting();
		        plus.nativeUI.alert('更新完成！',function(){
		            plus.runtime.restart();
		        },'提示','确定');
		    });
        }
    }).start();
}

/**
*	@description 调试输出函数
* 	@param {Object} string 输出对象
*/
function log(string){
	var string = JSON.stringify(string);
	console.log(string);
}

/**
*	@description 图片压缩函数
* 	@param {String} path 图片路径
* 	@param {String} width 压缩后宽
* 	@param {String} height 压缩后高
* 	@param {Function} callback 回调函数
*/
function resizeImg(path,width,height,callback){	
	var options = {
		src : path,
		dst : path,
		overwrite : true,
		height : height,
		width : width
	}
	plus.zip.compressImage(options,function(event){
		callback(event);
	},function(error){
		plus.nativeUI.alert('图片压缩失败！','','提示','确定');
	});
}

/**
*	@description 上传图片函数
* 	@param {String} url 上传服务端URL
* 	@param {String} width 压缩后宽
* 	@param {String} height 压缩后高
* 	@param {Function} callback 回调函数
*/
function UploadImg(url,width,height,callback){
	plus.gallery.pick(function(e){
    	plus.nativeUI.showWaiting('');
    	resizeImg(e,width,height,function(event){
	    	var upload = plus.uploader.createUpload(ip + '?' + url,{
	    		method : 'POST',
	    		retry : 4,
	    		retryInterval : 10,
	    	},function(result,status){
	    		callback(result,event.target);
	    		plus.nativeUI.closeWaiting();
	    	});
	    	upload.addFile(event.target,{key : 'pic'});
	    	upload.addData('width',width);
	    	upload.addData('height',height);
	    	upload.addData('name','pic');
	    	upload.start();
    	});
    },'',{
    	filter : 'image',
    	system : true,
    });
}

/**
*	@description 打开窗口
* 	@param {String} url 地址
* 	@param {JSObject} options 传递参数
*/
function openWindow(url,options){
	var data = {
		url : url,
		id : url,
		show : {
			aniShow : 'slide-in-right',
		}
	}
	if(options != undefined) data.extras = options;
	mui.openWindow(data);
}

/**
*	@description 获取当前高德坐标
* 	@param {Function} callback 回调函数
*/
function getPosition(callback){
	plus.geolocation.getCurrentPosition(function(e){
		callback(e,e.coords.longitude,e.coords.latitude);
	},function(){
		plus.nativeUI.alert('定位失败，请开启定位/GPRS服务后，重新开启爱超大食代！',function(){
			// plus.runtime.quit();
		},'提示','提示');
	},{
		enableHighAccuracy : true,
	});
}

document.addEventListener('touchstart',function(){
    return false;
},true);

document.oncontextmenu = function(){
	return false;
};
/*
 	Maye 获得Ajax提交地址
 * */
function getLocation(url){
	var url = ip + 'index.php/River_Api/' + url;
	console.log('getLocation：' + url);
	return url;

}
/*
	Maye 查看用户/配送员是否登录 
*/
function isLogin(){

	var user_id = plus.storage.getItem('user_id');
	var peisong_id = plus.storage.getItem('peisong_id');
	if(user_id != null && peisong_id != null){
		return true;		//已登录
	}else{
		return false;		//未登录
	}

}
/*
	Maye 获取用户/配送员登录信息
*/
function getLgoin(){
	
	var user_id = plus.storage.getItem('user_id');
	var peisong_id = plus.storage.getItem('peisong_id');
	return {"user_id" : user_id , "peisong_id" : peisong_id}
}
/*
	Maye 清除登录缓存
*/
function delLogin(){
	
	plus.storage.removeItem('user_id');	
	plus.storage.removeItem('peisong_id');
		
}

function cache(name){
	return plus.storage.getItem(name);
}

/**
*	@description 页面加载中
* 	@param {Int} type '0'：添加Loading '1'：删除Loading
*/
function loading(type){
	var html = '<div class="loading"><div class="loading_main"><img src="images/loading.gif"><p>加载中</p></div></div>';
	var len = $('.loading').length;
	if(type == 0){
		if(len > 0) $('.loading').remove();
		$('body').append(html);
	}else{
		$('.loading').remove();
	}
}
