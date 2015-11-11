var API_ENDPOINT = '/v1/venues'
var API_METHOD   = 'POST';
var MAP_CENTER   = { lat: 48.209206, lng: 16.372778 }
var MAP_ZOOM     = 14;
var markers = [];

var initGeocoder = function(element) {
  element.geocomplete().bind('geocode:result', function(event, result){
    var lat = result.geometry.location.lat();
    var lng = result.geometry.location.lng();
    var location = { lat: lat, lng: lng };

    element.data('location', location);

    var marker = element.data('marker');
    if(!marker) {
      marker = new google.maps.Marker({
        position: location,
        map: window.map
      });
      element.data('marker', marker);
    } else {
      marker.setPosition(location);
    }

    fitMap();
  });
}

// Fits the map to the locations
var fitMap = function (){
  var bounds = new google.maps.LatLngBounds();

  var elements = [$('#location1').data('location'), $('#location2').data('location')];

  elements.forEach(function(location) {
    if(location) {
      bounds.extend(new google.maps.LatLng(location.lat, location.lng));
    }
  });

  window.map.fitBounds(bounds);
}

function initMap() {
  $(function(){

    window.map = new google.maps.Map(document.getElementById('map'), {
      zoom: MAP_ZOOM,
      maxZoom: 16,
      center: MAP_CENTER,
      styles: window.maps_style,
      mapTypeControl: false,
      streetViewControl: false
    });

    initGeocoder($('#location1'));
    initGeocoder($('#location2'));
  });
}

$(function() {
  $('#discover').on('click', function() {
    var location1 = $('#location1').data('location');
    var location2 = $('#location2').data('location');

    if(!location1) {
      $('#location1').focus();
      return false;
    }

    if(!location2) {
      $('#location2').focus();
      return false;
    }

    $.ajax({
      method: API_METHOD,
      url: API_ENDPOINT,
      data: JSON.stringify({
        locations: [
          location1,
          location2
        ]
      }),
      contentType:"application/json; charset=utf-8",
      dataType: "json",
      success: function(response) {
        var venuesHtml = [];
        var $venues = $('.results-data');
        $venues.html('');

        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }

        var i = 1;
        response.venues.forEach(function(venue){
          var $venueHtml = $('<div class="col-md-4"> \
            <div class="card">\
              <div class="card-index">' + i + '.</div>\
              <div class="card-content">\
                <div class="card-title">' + venue.name + '</div>\
                <div class="card-meta">\
                  <div class="card-meta-score positive" style="background-color: #' + venue.ratingColor + ';">' + venue.rating + '</div>\
                  <div class="card-meta-address">\
                    <div class="card-meta-address-line">' + venue.location.address + '</div>\
                    <div class="card-meta-address-price">\
                      <span class="price" title=""><span class="darken" itemprop="priceRange">€ €</span> € €</span>\
                    </div>\
                  </div>\
                </div>\
              </div>\
              <div class="clearfix"></div>\
            </div>\
          </div>');

          var marker = new google.maps.Marker({
            position: { lat: venue.location.lat, lng: venue.location.lng },
            label: i.toString(),
            map: window.map
          });

          google.maps.event.addListener(marker, 'mouseover', function() {
            $venueHtml.find('.card').addClass('highlight');
          });

          google.maps.event.addListener(marker, 'mouseout', function() {
            $venueHtml.find('.card').removeClass('highlight');
          });

          venuesHtml.push($venueHtml);
          $venues.append(venuesHtml);
          markers.push(marker);


          i++;
        });

        $('.results').removeClass('hidden');
      },
      error: function(error) {
        alert('An error occured');
        console.error(error);
      }
    });

    return false;
  });
});
