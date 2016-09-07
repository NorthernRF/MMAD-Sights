function initMap() {
	var options = {
		scrollwheel: false,
		zoom: 8,
		disableDefaultUI: true,
		center: {lat: -34.397, lng: 150.644},
	}

	var map = new google.maps.Map(document.getElementById('map'), options);
}

$(function() {
	$('body').on('click', '.sights-list .sights-list__item', function() {
		var current = $(this);
		console.log(current);
		var title = current.find('.sights-list__item__title').text();
		var place = current.find('.sights-list__item__content').text();

		$('.sights-list').remove();
		$('#backButton').show();
		$('#refreshButton').hide();

		console.log(title, place);

		var source = $('#sightDetailTemplate').html();
		var template = Handlebars.compile(source);
		var html = template({
			title: title,
			place: place
		});
		$('.card-content').append(html);

		var carousel = new Carousel($('body .carousel'));
	});
});