mui.plusReady(function(){
	var index = new Vue({
		el : '#main',
		data : {
			user_id : cache('user_id'),
			name : '',
			telephone : '',
			status : 2,
			order_list : [],
			count : [0,0,0],
			index_active : 0
		},
		mounted : function(){
			this.init();
			plus.runtime.getProperty(plus.runtime.appid,function(result){
			    $('.version').text('当前版本：' + result.version);
			});
		},
		methods : {
			init : function(){
				this.getUser();
				var obj = this;
				obj.loadData(obj.index_active);
				plus.push.addEventListener('click',function(result){
					obj.loadData(obj.index_active);
				},false);
				document.addEventListener('reload',function(){
					obj.loadData(obj.index_active);
				});
				plus.push.addEventListener('receive',function(result){
					obj.loadData(obj.index_active);
				},false);
				document.addEventListener('resume',function(){
					obj.loadData(obj.index_active);
				});
			},
			menu : function(type){
				if(type == 'show'){
					$('.menu_bg').show();
					$('.menu_layout').animate({'left' : '0px'},'fast');
				}else{
					$('.menu_bg').hide();
					$('.menu_layout').animate({'left' : '-60%'},'fast');
				}
			},
			login : function(){
				openWindow('login.html');
			},
			getUser : function(){
				var obj = this;
				var option = {
					user_id : this.user_id,
					field : 'name,phone,work_status'
				}
				sendAjax('User/info',option,function(result){
					obj.name = result.name;
					obj.telephone = result.phone;
					obj.status = result.work_status;
					obj.loadData(0);
				});
			},
			loadData : function(status){
				this.order_list = [];
				$('.index_item a').removeClass('active');
				$('.index_item a').eq(status).addClass('active');
				if(this.status > 0) return false;
				var obj = this;
				var option = {
					user_id : this.user_id,
					status : status
				};
				sendAjax('Order/lists',option,function(result){
					obj.order_list = result.list;
					obj.count = result.count;
					obj.index_active = status;
					obj.$nextTick(function(){
						obj.loadTime();
					});
				});
			},
			changeStatus : function(status){
				var obj = this;
				if(status == this.status) return false;
				var option = {
					status : status,
					user_id : this.user_id
				}
				sendAjax('User/changeStatus',option,function(result){
					obj.status = status;
					if(status == 0){
						obj.loadData(obj.index_active);
					}else{
						obj.count = [0,0,0];
					}
				});
			},
			order_detail : function(order_id){
				openWindow('orderDetail.html',{
					order_id : order_id
				});
			},
			success : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定接受？',function(e){
					if(e.index == 0){
						var option = {
							status : 6,
							order_id : order_id,
							user_id : obj.user_id
						}
						sendAjax('Order/success',option,function(result){
							if(result.status == 'success') obj.loadData(obj.index_active);
						});
					}
				},['是','否']);
			},
			quhuo : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定取货？',function(e){
					if(e.index == 0){
						var option = {
							status : 6,
							order_id : order_id,
							user_id : obj.user_id
						}
						sendAjax('Order/quhuo',option,function(result){
							if(result.status == 'success') obj.loadData(obj.index_active);
						});
					}
				},['是','否']);
			},
			songda : function(order_id,index){
				var obj = this;
				plus.nativeUI.confirm('确定送达？',function(e){
					if(e.index == 0){
						var option = {
							status : 6,
							order_id : order_id,
							user_id : obj.user_id
						}
						sendAjax('Order/songda',option,function(result){
							if(result.status == 'success') obj.loadData(obj.index_active);
						});
					}
				},['是','否']);
			},
			jump : function(html){
				openWindow(html);
			},
			logout : function(){
				var obj = this;
				plus.nativeUI.confirm('确认退出？',function(e){
					if(e.index == 0){
						plus.storage.removeItem('user_id');
						plus.webview.currentWebview().close();
					}
				},'提示',['是','否']);
			},
			loadTime : function(){
				var obj = this;
				$('.add_time').each(function(){
					var _this = $(this);
					var add_timer = setInterval(function(){
						obj.timing(_this);
					},500);
				});
			},
			timing : function(obj){
				var timestamp = Date.parse(new Date()) / 1000 - obj.attr('data_time');
				if(timestamp > 60 * 30){
					obj.css('color','red');
					obj.text('已超时');
				}else{
					var days = Math.floor(timestamp / 3600 / 24);
					var hours = Math.floor((timestamp - days * 24 * 3600) / 3600);
					var mins = Math.floor((timestamp - days * 24 * 3600 - hours * 3600) / 60);
					var secs = Math.floor((timestamp - days * 24 * 3600 - hours * 3600 - mins * 60));
					if(hours < 10) hours = '0' + hours;
					if(mins < 10) mins = '0' + mins;
					if(secs < 10) secs = '0' + secs;
					obj.text(hours + ':' + mins + ':' + secs);
				}
			}
		}
	});
	document.addEventListener('login',function(){
		index.init();
	});
});