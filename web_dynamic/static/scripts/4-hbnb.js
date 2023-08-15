$(document).ready(function () {
    let listAmenities = []
    $('input').change(function() {
        const amenityName = $(this).attr("data-name");

        if (this.checked) {
            listAmenities.push(amenityName);
        }
        else {
            listAmenities = listAmenities.filter((item) => item !== amenityName);
        }
        $('div.amenities h4').text(listAmenities.join(', '));
    });

    $('button:eq(0)').click(function() {
      filterPlaces('http://127.0.0.1:5001/api/v1/places_search', listAmenities);
    });

    //gets the status of the api server
    requestAPI('http://127.0.0.1:5001/api/v1/status/');
    //retrieves all places
    places('http://127.0.0.1:5001/api/v1/places_search');
  });

function requestAPI (url) {
    $.get(url, (data) => {    
        if (data.status === 'OK') {
            $('div#api_status').addClass('available');
        } else {
            $('div#api_status').removeClass('available');
        }
    });
}

function places (url) {
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({}),
    success: function(data) {
      for (const place of data) {
        displayPlace(place);
      }
    }
  });
}

function filterPlaces (url, amenitiesList) {
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({}),
    success: function(data) {
      for (const place of data) {
        $.get('http://127.0.0.1:5001/api/v1/places/' + place.id + '/amenities', function (data) {
          const amenityNames = []
          for (jsonAmenity of data) {
            amenityNames.push(jsonAmenity.name)
          }

          if (amenities.every(amenity => amenityNames.includes(amenity))) {
            displayPlace(place);
            console.log('found one! - ', place.name);
          }
        });
      }
    }
  });
}

function filterPlaces (url, amenitiesList) {
  $.get('http://127.0.0.1:5001/api/v1/users/' + place.user_id + '/' + amenitiesList, function (userData) {
    let guestsPlural = '';
    if (place.max_guest != 1) {
      let guestsPlural ='s';
    }
    let roomsPlural = ''
    if (place.number_rooms != 1) {
      let roomsPlural ='s';
    }
    let bathroomPlural = ''
    if (place.number_bathrooms != 1) {
      let bathroomPlural ='s';
    }
    let html = `<article>
    <div class="title_box">
      <h2>${place.name}</h2>
      <div class="price_by_night">$${place.price_by_night}</div>
    </div>
    <div class="information">
      <div class="max_guest">${place.max_guest} Guest${guestsPlural}</div>
            <div class="number_rooms">${place.number_rooms } Bedroom${roomsPlural}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${bathroomPlural}</div>
    </div>
    <div class="user">
            <b>Owner:</b> ${userData.first_name} ${userData.last_name}
          </div>
          <div class="description">
      ${place.description}
          </div>
      </article>`;
  $('.places').append(html);
  });
}