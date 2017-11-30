var search_btn = document.getElementById('search');
var search_box = document.getElementsByClassName('search-box')[0];

document.addEventListener('click', function(event) {
	var isClickedSearchBtn = search_btn.contains(event.target);

	if(isClickedSearchBtn) {
		console.log("search clicked");
		search_box.style.display = "block";
	}
	else {
		console.log("search unclicked");
		search_box.style.display = "none";
	}

});