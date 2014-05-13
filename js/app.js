(function(){
	'use strict'

	var default_style = [ { "featureType": "road", "stylers": [ { "visibility": "off" } ] },{ "featureType": "administrative.locality", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "featureType": "poi", "stylers": [ { "visibility": "off" } ] },{ "featureType": "landscape", "stylers": [ { "visibility": "off" } ] },{ "featureType": "water", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "featureType": "landscape.natural", "elementType": "geometry", "stylers": [ { "visibility": "on" }, { "color": "#f9f9f9" } ] },{ "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [ { "weight": 0.4 } ] },{ "featureType": "administrative.neighborhood", "elementType": "labels", "stylers": [ { "visibility": "off" } ] },{ "featureType": "administrative.province", "elementType": "labels", "stylers": [ { "saturation": -100 } ] },{ "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#c8d6ea" } ] },{ "featureType": "administrative.province", "elementType": "geometry", "stylers": [ { "visibility": "on" }, { "weight": 0.8 }, { "color": "#cccccc" } ] },{ },{ "featureType": "administrative", "elementType": "geometry.fill", "stylers": [ { "visibility": "on" }, { "color": "#f9f9f9" } ] },{ "featureType": "transit", "stylers": [ { "visibility": "off" } ] },{ "elementType": "labels", "stylers": [ { "lightness": 60 } ] }],
		default_center = new google.maps.LatLng(37.3933, -110.45904),
		geojson_data,
		default_geojson_style = {
	    fillColor: '#fc0',
	    fillOpacity: ".7",
	    strokeWeight: 1,
	    strokeColor: '#f0c'
	  },
	  default_zoom = 4;

	var label_eraser = { "elementType": "labels", "stylers": [ { "visibility": "off" } ] };

	var marker,
			map;

	function readSingleFile(evt) {
		//Retrieve the first (and only!) File from the FileList object
		var f = evt.target.files[0]; 

		if (f) {
			var r = new FileReader();
			r.onload = function(e) { 
				geojson_data = JSON.parse(e.target.result);
			}
			r.readAsText(f);
		} else { 
			alert("Failed to load file");
		}
	}

	function createMap(center, zoom, style, geoData, geoStyle) {
		var mapOptions = {
			zoom: zoom,
			panControl: false,
			streetViewControl: false,
			center: center,
			styles: style
		};

		var vectorOptions = {
		  strokeColor: '#CCC',
		  strokeWeight: 1
		};

		// If we are hiding labels, add that style
		if (!$('#labels:checked').length) style.push(label_eraser);

		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		if (geoData) { 
			map.data.addGeoJson(geoData); 
			map.data.setStyle(geoStyle); 
		};
	}

	function clearMarkers(){
		if (marker) marker.setMap(null);
	}

	function bindDocHandlers(){
		document.getElementById('geojson-input').addEventListener('change', readSingleFile, false);

		$(document).on('keydown', function(e){
			// `h` or `esc` key hides map furniture
			if (e.keyCode == 72){
				$('.gmnoprint').toggleClass('hidden');
				$('#furniture').toggleClass('hidden');

				// Don't hide the terms of use
				$('.gm-style-cc').parents('.gmnoprint').css('opacity',1);
				$('.gm-style-cc').css('opacity',1);
			}
			if (e.keyCode == 27){
				clearMarkers();
			}
		})
	}

	function bindMapHandlers(){

		google.maps.event.addListener(map, 'click', function(e) {
			clearMarkers();
			marker = new google.maps.Marker({position: e.latLng, map: map, icon: 'https://raw.githubusercontent.com/ajam/heron/master/imgs/marker.png'});
			// map.panTo(e.latLng);
		});

		google.maps.event.addListener(map, 'center_changed', function(e) {
			updateCenter(map.getCenter());
		});

		google.maps.event.addListener(map, 'zoom_changed', function(e) {
			$('#zoom-input').val(map.getZoom());
		});

		// On map refresh
		$('#refresher').submit(function(e){
			e.preventDefault();
			e.stopPropagation();
			// Get tile stile
			var new_style = JSON.parse( $('#style-input').val() );
			// Get center point
			var new_center = $('#center-input').val().split(', ');
			new_center = new google.maps.LatLng(+new_center[0], +new_center[1]);
			// Get the zoom
			var new_zoom = +$('#zoom-input').val();
			// Get GeoJson Style
			var new_geojson_style = JSON.parse( $('#geojson-style-input').val() );
			createMap(new_center, new_zoom, new_style, geojson_data, new_geojson_style);
			bindMapHandlers();
		});

	}

	function updateCenter(centerObj){
		$('#center-input').val(centerObj.lat() + ', ' + centerObj.lng())
	}

	function initInputs(){
		$('#style-input').html(JSON.stringify(default_style, null, 2));
		$('#zoom-input').val(default_zoom);
		$('#geojson-style-input').html(JSON.stringify(default_geojson_style, null, 2))
		updateCenter(default_center);
	}

	function initHandlers(){
		bindDocHandlers();
		bindMapHandlers();
	}

	function init(){
		initInputs();
		createMap(default_center, default_zoom, default_style);
		initHandlers();
	}

	init();

}).call(this);