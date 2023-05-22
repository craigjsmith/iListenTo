var artists_list = [];
var tracks_list = [];

var user;

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

// Parameters for implicit granted authorization request
var clientId = '1e792d2947a6401b947116a83dc9c3a9';
var redirectUri = 'https://ilistento.net';
var scopes = ['user-top-read'];

// If there's no token, redirect to Spotify to retrieve one
function getToken() {
    if (!_token) {
        window.location = 'https://accounts.spotify.com/authorize?client_id=' + clientId + '&redirect_uri=' + redirectUri + '&scope=' + scopes.join('%20') + '&response_type=token&show_dialog=true';
    }
}

getUser();
function getUser() {
    $.ajax({
        url: "https://api.spotify.com/v1/me",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            var name = data.display_name;
            var pic = "profile.png";

            // Retrieve user's profile piture if they have one
            try {
                var pic = data.images[0].url;
            } catch (e) {}

            user = { name: name, pic: pic };
        }
    });
}

function getArtistsShort() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];

            for (var i = 0; i < data.items.length; i++) {
                var pic = "profile.png";

                // Retrieve artist's piture if they have one
                try {
                    var pic = data.items[i].images[0].url;
                } catch (e) {}

                artists_list.push({ name: data.items[i].name, pic: pic });
            }

            getTracksShort();
        }
    });
}

function getArtistsMedium() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];

            console.log(data);

            for (var i = 0; i < data.items.length; i++) {
                var pic = "profile.png";

                // Retrieve artist's piture if they have one
                try {
                    var pic = data.items[i].images[0].url;
                } catch (e) {}

                artists_list.push({ name: data.items[i].name, pic: pic });
            }

            getTracksMedium();
        }
    });
}

function getArtistsLong() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];

            for (var i = 0; i < data.items.length; i++) {
                var pic = "profile.png";

                // Retrieve artist's piture if they have one
                try {
                    var pic = data.items[i].images[0].url;
                } catch (e) {}

                artists_list.push({ name: data.items[i].name, pic: pic });
            }

            getTracksLong();
        }
    });
}

function getTracksShort() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];

            console.log(data);

            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            populate();
        }
    });
}

function getTracksMedium() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];

            console.log(data);

            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            populate();
        }
    });
}

function getTracksLong() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];
            for (var i = 0; i < data.items.length; i++) {
                tracks_list.push({ name: data.items[i].name, artist: data.items[i].album.artists[0].name });
            }

            console.log(data);

            populate();
        }
    });
}

function User(props) {
    return React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { className: 'row' },
            React.createElement(
                'div',
                { className: 'col-12 tile entry' },
                React.createElement('img', { src: props.pic, className: 'artist_img' }),
                ' ',
                React.createElement(
                    'h2',
                    { className: 'textNoFlex' },
                    React.createElement('i', { className: 'fab fa-spotify' }),
                    ' ',
                    props.name,
                    ' ',
                    React.createElement('br', null),
                    ' ',
                    React.createElement(
                        'a',
                        { 'class': 'logout', href: 'index.html' },
                        '(Logout)'
                    )
                )
            )
        )
    );
}

function Artist(props) {
    return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col tile entry' },
            React.createElement(
                'h2',
                { className: 'number text' },
                props.number
            ),
            React.createElement('img', { src: props.pic, className: 'artist_img' }),
            React.createElement(
                'h2',
                { className: 'text' },
                props.name
            )
        )
    );
}

function Track(props) {
    return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col tile entry' },
            React.createElement(
                'h2',
                { className: 'number text' },
                props.number
            ),
            React.createElement(
                'div',
                { className: 'col noPad' },
                React.createElement(
                    'h2',
                    { className: 'text' },
                    props.name
                ),
                React.createElement(
                    'h3',
                    { className: 'text' },
                    props.artist
                )
            )
        )
    );
}

function populate() {
    var top_artists = [];
    for (var i = 0; i < artists_list.length; i++) {
        top_artists.push(React.createElement(Artist, {
            name: artists_list[i].name,
            pic: artists_list[i].pic,
            number: i + 1
        }));
    }

    var top_tracks = [];
    for (var i = 0; i < tracks_list.length; i++) {
        top_tracks.push(React.createElement(Track, {
            name: tracks_list[i].name,
            artist: tracks_list[i].artist,
            number: i + 1
        }));
    }

    ReactDOM.render(React.createElement(
        'div',
        { className: 'section' },
        React.createElement(
            'h1',
            null,
            'My Top Artists'
        ),
        top_artists
    ), document.getElementById('top_artists'));

    ReactDOM.render(React.createElement(
        'div',
        { className: 'section' },
        React.createElement(
            'h1',
            null,
            'My Top Tracks'
        ),
        top_tracks
    ), document.getElementById('top_tracks'));

    ReactDOM.render(React.createElement(
        'div',
        null,
        React.createElement(
            'div',
            { className: 'row justify-content-center' },
            React.createElement(User, { name: user.name, pic: user.pic })
        ),
        React.createElement(
            'div',
            { className: 'row toggle' },
            React.createElement(
                'div',
                { className: 'col' },
                React.createElement(
                    'div',
                    { className: 'btn-group', role: 'group' },
                    React.createElement(
                        'button',
                        { type: 'buttzon', id: 'short_btn', onClick: shortbtn, className: 'btn btn-outline-success active' },
                        '30 days'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', id: 'medium_btn', onClick: mediumbtn, className: 'btn btn-outline-success' },
                        '6 months'
                    ),
                    React.createElement(
                        'button',
                        { type: 'button', id: 'long_btn', onClick: longbtn, className: 'btn btn-outline-success' },
                        'All time'
                    )
                )
            )
        )
    ), document.getElementById('login'));
}

function shortbtn() {
    document.getElementById("short_btn").classList.add("active");
    document.getElementById("medium_btn").classList.remove("active");
    document.getElementById("long_btn").classList.remove("active");
    getArtistsShort();
}

function mediumbtn() {
    document.getElementById("short_btn").classList.remove("active");
    document.getElementById("medium_btn").classList.add("active");
    document.getElementById("long_btn").classList.remove("active");
    getArtistsMedium();
}

function longbtn() {
    document.getElementById("short_btn").classList.remove("active");
    document.getElementById("medium_btn").classList.remove("active");
    document.getElementById("long_btn").classList.add("active");
    getArtistsLong();
}

ReactDOM.render(React.createElement(
    'div',
    { className: 'row', style: { textAlign: "center", margin: "0" } },
    React.createElement(
        'div',
        { className: 'col' },
        React.createElement(
            'button',
            { type: 'button', id: 'login_btn', className: 'btn btn-outline-success active' },
            React.createElement('i', { className: 'fab fa-spotify' }),
            ' Connect with Spotify'
        )
    )
), document.getElementById('login'));

getArtistsShort();