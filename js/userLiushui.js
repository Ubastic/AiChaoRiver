
mui.plusReady(function(){
	
	var page = 0;
	
	var height = $(window).height() - 100;
	$('.mui-slider-item').height(height);
	mui('.mui-scroll-wrapper').scroll({
		indicators: true
	});
	
	loadData('0');

	mui('.index_item').on('tap','a',function(){
		$('.index_item a').removeClass('active');
		$(this).addClass('active');
		var _type = $(this).attr('where');
		page = 0;
		loadData(_type);
	});
	
	function loadData(_type){
//plus.nativeUI.alert(_type,'','提示','确定');
		$('#dataList').html('');
        $('.dropload-down').remove();
		$('.userLiushui_list').dropload({
			scrollArea : window,
			loadDownFn : function(me){
				page++;
					var peisong = getLgoin();
					var peisong_id = peisong.peisong_id;
					mui.post(getLocation('Index/userLiushui.html'),{'peisong_id':peisong_id , 'page':page , "type":_type},
					function(data){
						var arr_shouzhi = data.data.shouzhi;
						var arr_tixian = data.data.tixian;
						if(data.code == '1' && (arr_shouzhi.length  > 0 || arr_tixian.length > 0)){
					
							if(_type == '0'){

								for(var i = 0 ; i < arr_shouzhi.length ; i++){
									var _html = "";
									_html += '<li class="mui-table-view-cell">';
									
									if(arr_shouzhi[i]['type'] == '0'){
										_html += '<p style="color: green;">收入</p>';
									}else{
										_html += '<p style="color: red;">支出</p>';
									}
									
									_html += '<p>￥'+arr_shouzhi[i]['price']+'</p>';
									_html += '<p>'+arr_shouzhi[i]['shijian']+'</p>';
									_html += '<div class="clear"></div>';
									_html += '</li>';
									$('#dataList').append(_html);
								}

							}else{

								for(var i = 0 ; i < arr_tixian.length ; i++){
									var _html = "";
									_html += '<li class="mui-table-view-cell">';
									
									if(arr_tixian[i]['type'] == '0'){
										_html += '<p style="color: green;">收入</p>';
									}else{
										_html += '<p style="color: red;">支出</p>';
									}
									
									_html += '<p>￥'+arr_tixian[i]['price']+'</p>';
									_html += '<p>'+arr_shouzhi[i]['shijian']+'</p>';
									_html += '<div class="clear"></div>';
									_html += '</li>';
									$('#dataList').append(_html);
								}

							}

						}else{
							me.lock();
							me.noData();
						}
						me.resetload();

						
					},"json"
				);
			}
		});
	}
	
	

	
	
});