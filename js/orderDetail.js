mui.plusReady(function(){
	new Vue({
		el : '#main',
		data : {
			order_id : plus.webview.currentWebview().order_id,
			order_sn : '',
			status : 0,
			time : '',
			pay_type : 0,
			order_name : '',
			order_telephone : '',
			order_address : '',
			store_name : '',
			store_logo : '',
			store_phone : '',
			goods : null,
			goods_price_real : 0,
			discounts_price : 0,
			note : ''
		},
		mounted : function(){
			this.loadData();
		},
		methods : {
			loadData : function(){
				var obj = this;
				var option = {
					order_id : this.order_id
				}
				loading(0);
				sendAjax('Order/detail',option,function(result){
					obj.status = result.status;
					obj.order_name = result.name;
					obj.order_telephone = result.telephone;
					obj.order_address = result.address;
					obj.store_name = result.store_name;
					obj.order_sn = result.order_sn;
					obj.pay_type = result.pay_type;
					obj.time = result.pay_time;
					obj.store_phone = result.store_phone;
					obj.store_logo = imgurl + result.store_logo;
					obj.goods_price_real = result.goods_price_real;
					obj.goods = result.goods;
					obj.discounts_price = result.discounts_price;
					obj.note = result.note;
					loading(1);
				},false);
			}
		}
	});
});