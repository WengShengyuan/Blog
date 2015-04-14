
	$(document).ready(function() {
		var cat = getQueryString("cat");
		$("#"+cat).css('display','block'); 
	});
	
	function getQueryString(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]); return null;
	    }

