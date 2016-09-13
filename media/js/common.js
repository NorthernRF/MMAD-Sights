var map = null;
var markers = [];

function initMap() {
	var options = {
		scrollwheel: false,
		zoom: 8,
		disableDefaultUI: true,
		zoomControl: true,
		center: {lat: 58.6011769, lng: 49.6525304},
	}

	map = new google.maps.Map(document.getElementById('map'), options);
}

$(function() {
	var loading = '<div class="loading-layout"></div>'
	var startSplashHhtml = $('#cardContent').html();
	var sights_list = [];

	$('.overlay').foggy();

	$('body').on('click', '.sights-list .sights-list__item', function() {
		var current = $(this);
		var array_id = parseInt($(this).data('arrayId'));
		var title = current.find('.sights-list__item__title').text();
		var place = current.find('.sights-list__item__content').text();

		$('.card-content').html('');

		var source = $('#sightDetailTemplate').html();
		var template = Handlebars.compile(source);
		var html = template(sights_list[array_id]);
		$('.card-content').html(html);

		var coords = sights_list[array_id].coords;
		var gCoords = {
			lat: coords[0], 
			lng: coords[1]
		}

		map.setCenter(gCoords);
		setTimeout(function() {
			var marker = new google.maps.Marker({
		        map: map,
		        position: gCoords,
		        animation: google.maps.Animation.DROP,
		        title: sights_list[array_id].title
	        });
	        markers.append(marker);
		}, 1000);		

		var carousel = new Carousel($('body .carousel'));
	});

	$('#searchField').keyup(function() {
		var query = $('#searchField').val();
		console.log('change');
		if (query.length >= 2) {
			console.log('ok')
			$.get("/api/m/", {
				m: "search",
				q: query,
			}, function (response) {  
				console.log(response);
            	if (response != "ok") {
            		if (response.length > 0) {
            			$('.search_field').show();            			
            		}

            		var source = $('#searchFieldTemplate').html();
					var template = Handlebars.compile(source);
					var html = template(response);
					$('.search_field').html(html);
            	}
            });
		} else {
			$('.search_field').hide();
		}
	});

	function uploadCountryList(id) {
		$('#cardContent').html(loading);
		$.get("/api/m/", {
			m: "cities",
			id: id,
		}, function (response) {  
			console.log(response);
        	if (response != "ok") {
        		var source = $('#citiesListTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response);
				$('#cardContent').html(html);

				sights_list = response;
        	}
        });

        for (var i = 0; i < markers.length; i++) {
		    markers[i].setMap(null);
		}
	}

	$('body').on('click', '[data-country-id]', function() {
		var country_id = $(this).data('countryId');
		console.log(country_id);
		$('#searchField').val('');
		$('.search_field').hide();

		$('#searchResultsTab').show();
		$('#searchResultsTab').find('span').html($(this).text());
		uploadCountryList(country_id);
	});

	$('body').on('click', '[data-city-url]', function() {
		$('#cardContent').html(loading);
		var country_id = $(this).data('cityCountryId');
		var city_url = false
		var city_name = false
		if ($(this).data('cityUrl')) {
			city_url = $(this).data('cityUrl');
			city_name = $(this).text();
		}

		$.get("/api/m/", {
			m: "get",
			id: country_id,
			url: city_url,
			city: city_name,
		}, function (response) {  
			console.log(response);
        	if (response != "ok") {
        		var source = $('#sightsListTemplate').html();
				var template = Handlebars.compile(source);
				var html = template(response);
				$('#cardContent').html(html);

				sights_list = response;
        	}
        });
	});
});