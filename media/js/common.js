function initMap() {
	var options = {
		scrollwheel: false,
		zoom: 8,
		disableDefaultUI: true,
		center: {lat: 58.6011769, lng: 49.6525304},
	}

	var map = new google.maps.Map(document.getElementById('map'), options);
}

// google.maps.event.addDomListener(window, "load", initialize);

$(function() {
	var loading = '<div class="loading-layout"></div>'
	var startSplashHhtml = $('#cardContent').html();
	var sights_list = [];

	$('.overlay').foggy();

	$('body').on('click', '.sights-list .sights-list__item', function() {
		var current = $(this);
		var array_id = parseInt($(this).data('arrayId'));
		console.log(current);
		var title = current.find('.sights-list__item__title').text();
		var place = current.find('.sights-list__item__content').text();

		$('.sights-list').remove();
		$('#backButton').show();
		$('#refreshButton').hide();

		console.log(title, place);

		var source = $('#sightDetailTemplate').html();
		var template = Handlebars.compile(source);
		var html = template(sights_list[array_id]);
		$('.card-content').append(html);

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
            		$('.search_field').show();

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