

	$(document).ready(function() {
		
		console.log('一個人寂寞的調試信息');
		
		$("#back-top").hide();
		$(window).scroll(function() {
			if ($(this).scrollTop() > 100) {
				$('#back-top').fadeIn();
			} else {
				$('#back-top').fadeOut();
			}
		});
		$('#back-top a').click(function() {
			$('html,body').animate({scrollTop : 0}, 800);
			return false;
		});
	});


