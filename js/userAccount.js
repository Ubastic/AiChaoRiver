mui.plusReady(function(){
	
	mui('.userAccount_menu').on('tap','a',function(){
		var href = $(this).attr('data_href');
		openWindow(href);
	});
	
});