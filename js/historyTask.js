mui.plusReady(function(){
	new Vue({
		el : '.historyTask',
		data : {
			user_id : cache('user_id'),
			list : []
		},
		mounted : function(){
			this.loadData();
		},
		methods : {
			loadData : function(){
				var obj = this;
				var page = 0;
        		$('.dropload-down').remove();
        		$('.historyTask').dropload({
		        	scrollArea : window,
		        	loadDownFn : function(me){
		        		page++;
		        		var option = {
		        			user_id : obj.user_id,
							status : 3,
							page : page
						};
						sendAjax('Order/lists',option,function(result){
							if(result.list.length > 0){
								for(var i = 0;i < result.list.length;i++){
									obj.list.push(result.list[i]);
								}
							}else{
								me.lock();
								me.noData();
							}
							me.resetload();
						},false);
		        	}
		        });
			},
			order_detail : function(order_id){
				openWindow('orderDetail.html',{
					order_id : order_id
				});
			}
		}
	});
	/*
	var page = 0;
	
	loadData('`status` = 7 or `status` = 8 or `status` = 9');
	
	mui(document).on('tap','.order_detail',function(){
		var order_id = $(this).attr('order_id');
		openWindow('orderDetail.html',{
			order_id : order_id
		});
	});
	
	function loadData(where){
		$('.historyTask ul').html('');
        $('.dropload-down').remove();
        $('.historyTask').dropload({
        	scrollArea : window,
        	loadDownFn : function(me){
        		page++;
        		var peisong_id = plus.storage.getItem('peisong_id');
				var option = {
					'peisong_id' : peisong_id,
					'where' : where,
					'page' : page
				};
				mui.post(getLocation('Order/list.html'),option,function(result){
					if(result.list.length > 0){
						var list = template('list',result);
						$('.historyTask ul').append(list);
					}else{
						me.lock();
						me.noData();
					}
					me.resetload();
				},'json');
        	}
        });
	}
	*/
});