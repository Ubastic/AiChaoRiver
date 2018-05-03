mui.plusReady(function(){
	new Vue({
		el : '.workSummary',
		data : {
			user_id : cache('user_id'),
			data_list : []
		},
		mounted : function(){
			this.loadData();
		},
		methods : {
			loadData : function(){
				var page = 0;
				var obj = this;
		        $('.dropload-down').remove();
		        $('.workSummary').dropload({
		        	scrollArea : window,
		        	loadDownFn : function(me){
		        		page++;
						var option = {
							'user_id' : obj.user_id,
							'page' : page
						};
						sendAjax('User/signRecord',option,function(result){
							if(result.list.length > 0){
								for(var i = 0;i < result.list.length;i++){
									obj.data_list.push(result.list[i]);
								}
							}else{
								me.lock();
								me.noData();
							}
							me.resetload();
						},false);
		        	}
		        });
			}
		}
	});
});