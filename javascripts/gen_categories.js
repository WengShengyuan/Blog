
	$(document).ready(function() {
		var dataStr = '{ {% for tag in site.tags %}{% if tag[0] != site.tags.first[0] %},{% endif %}"{{ tag[0] }}":[{% for post in tag[1] %}{% if post != tag[1].first %},{% endif %}{"url":"{{post.url}}", "title":"{{post.title}}", "date":"{{post.date | date:"%d/%m/%Y"}}"}{% endfor %}]{% endfor %} }',
	    data = JSON.parse(dataStr),
	    curTag = $.query.get("tag"),
	    archieves = data[curTag];
		console.log(archieves);
	});

