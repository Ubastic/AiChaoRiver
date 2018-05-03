mui.plusReady(function(){
	
	var page = 0;
	
	loadData('`pay_status` = 1 and `status` = 1');
	
	mui(document).on('tap','.reload',function(){
		page = 0;
		loadData('`pay_status` = 1 and `status` = 1');
	});
	
	mui(document).on('tap','.success',function(){
		var order_id = $(this).attr('order_id');
		var peisong_id = plus.storage.getItem('peisong_id');
		plus.nativeUI.confirm('确定抢单？',function(e){
			if(e.index == 0){
				var option = {
					'peisong_id' : peisong_id,
					'order_id' : order_id,
					'status' : 6
				};
				mui.post(getLocation('Order/changeStatus.html'),option,function(result){
					if(result.status == 'success'){
						var v = plus.webview.getWebviewById('index.html');
						if(v != null) mui.fire(v,'reload');
						page = 0;
						loadData('`pay_status` = 1 and `status` = 1');
					}else{
						plus.nativeUI.alert(result.msg,'','提示','确定');
					}
				},'json');
			}
		},'提示',['是','否']);
	});
	
	function loadData(where){
		$('.historyTask ul').html('');
        $('.dropload-down').remove();
        $('.historyTask').dropload({
        	scrollArea : window,
        	loadDownFn : function(me){
        		page++;
        		var school_id = plus.storage.getItem('school_id');
				var option = {
					'school_id' : school_id,
					'where' : where,
					'page' : page
				};
				mui.post(getLocation('Order/index.html'),option,function(result){
					if(result.list.length > 0){
						var list = template('list',result);
						$('.historyTask ul').append(list);
					}else{
						me.lock();
						me.noData();
					}
					loadTime();
					me.resetload();
				},'json');
        	}
        });
	}
	
	function loadTime(){
		$('.add_time').each(function(){
			var obj = $(this);
			var add_timer = setInterval(function(){
				add_time(obj);
			},500);
		});
	}
	
	function add_time(obj){
		var timestamp = Date.parse(new Date()) - obj.attr('data_time');
		var totalSecs = timestamp / 1000;
		var days = Math.floor(totalSecs / 3600 / 24);
		var hours = Math.floor((totalSecs - days * 24 * 3600) / 3600);
		var mins = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600) / 60);
		var secs = Math.floor((totalSecs - days * 24 * 3600 - hours * 3600 - mins * 60));
		if(hours < 10) hours = '0' + hours;
		if(mins < 10) mins = '0' + mins;
		if(secs < 10) secs = '0' + secs;
		obj.text(hours + ':' + mins + ':' + secs);
	}
	
});