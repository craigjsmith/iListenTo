var artists_list = [];
var artists_pics = [];
var tracks_list = [];

// Extract hash from callback URL
var hash = window.location.hash.substring(1).split('&').reduce(function (initial, item) {
    if (item) {
        var parts = item.split('=');
        initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
}, {});
window.location.hash = '';

// Returned token from callbackURl
var _token = hash.access_token;
console.log(_token);

// Parameters for implicit granted authorization request
var clientId = '1e792d2947a6401b947116a83dc9c3a9';
var redirectUri = 'http://192.168.2.25:8080';
var scopes = ['user-top-read'];

// If there's no token, redirect to Spotify to retrieve one
if (!_token) {
    window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scopes.join('%20') + '&response_type=token&show_dialog=true';
}

function getArtistsShort() {
    reset();
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            for (var i = 0; i < data.items.length; i++) {
                artists_list.push(data.items[i].name);
            }

            for (var i = 0; i < data.items.length; i++) {
                artists_pics.push(data.items[i].images[0].url);
            }

            getTracksShort();
        }
    });
}

function getArtistsMedium() {
    reset();
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            for (var i = 0; i < data.items.length; i++) {
                artists_list.push(data.items[i].name);
            }

            for (var i = 0; i < data.items.length; i++) {
                artists_pics.push(data.items[i].images[0].url);
            }

            getTracksMedium();
        }
    });
}

function getArtistsLong() {
    reset();
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            for (var i = 0; i < data.items.length; i++) {
                artists_list.push(data.items[i].name);
            }

            for (var i = 0; i < data.items.length; i++) {
                artists_pics.push(data.items[i].images[0].url);
            }

            getTracksLong();
        }
    });
}

function getTracksShort() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {

            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            console.log(tracks_list);
            populate();
        }
    });
}

function getTracksMedium() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {

            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            console.log(tracks_list);
            populate();
        }
    });
}

function getTracksLong() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {

            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            console.log(tracks_list);
            populate();
        }
    });
}

function Artist(props) {
    return React.createElement(
        'div',
        { className: 'row tile' },
        React.createElement('img', { src: props.avatarUrl, className: 'artist_img' }),
        React.createElement(
            'h2',
            { className: 'text' },
            props.name
        )
    );
}

function Track(props) {
    return React.createElement(
        'div',
        { className: 'row tile' },
        React.createElement(
            'h2',
            { className: 'text' },
            props.name
        ),
        React.createElement('br', null),
        React.createElement('br', null),
        React.createElement(
            'h3',
            { className: 'trackArtist' },
            props.artist
        )
    );
}

function populate() {
    var top_artists = [];
    for (var i = 0; i < artists_list.length; i++) {
        top_artists.push(React.createElement(Artist, {
            name: artists_list[i],
            avatarUrl: artists_pics[i]
        }));
    }

    var top_tracks = [];
    for (var i = 0; i < tracks_list.length; i++) {
        top_tracks.push(React.createElement(Track, {
            name: tracks_list[i].name,
            artist: tracks_list[i].artist
        }));
    }

    ReactDOM.render(React.createElement(
        'div',
        null,
        top_artists
    ), document.getElementById('root'));

    ReactDOM.render(React.createElement(
        'div',
        null,
        top_tracks
    ), document.getElementById('root2'));
}

function reset() {
    artists_list = [];
    artists_pics = [];
    tracks_list = [];
}

getArtistsShort();