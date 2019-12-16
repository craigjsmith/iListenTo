var artists_list = [];
var artists_pics = [];
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
console.log(_token);

// Parameters for implicit granted authorization request
var clientId = '1e792d2947a6401b947116a83dc9c3a9';
var redirectUri = 'http://192.168.2.25:8080';
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
            var pic = data.images[0].url;

            user = { name: name, pic: pic };

            console.log(user.name);
        }
    });
}

function getArtistsShort() {
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=short_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];
            artists_pics = [];

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
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=medium_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];
            artists_pics = [];

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
    $.ajax({
        url: "https://api.spotify.com/v1/me/top/artists?time_range=long_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            artists_list = [];
            artists_pics = [];

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
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=short_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];
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
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];
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
        url: "https://api.spotify.com/v1/me/top/tracks?time_range=long_term",
        type: "GET",
        beforeSend: function beforeSend(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + _token);
        },
        success: function success(data) {
            tracks_list = [];
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
        { className: 'row' },
        React.createElement(
            'div',
            { className: 'col tile entry' },
            React.createElement('img', { src: props.avatarUrl, className: 'artist_img' }),
            ' ',
            React.createElement(
                'h2',
                { className: 'text' },
                props.name
            )
        )
    );
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
                    { className: 'text2' },
                    props.name,
                    ' ',
                    React.createElement('br', null),
                    ' ',
                    React.createElement(
                        'a',
                        { 'class': 'logout', href: 'javascript:history.go(0)' },
                        '(Logout)'
                    )
                )
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
                'div',
                { className: 'row' },
                React.createElement(
                    'div',
                    { className: 'col' },
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
        { className: 'section' },
        React.createElement(
            'h1',
            null,
            'My Top Artists'
        ),
        top_artists
    ), document.getElementById('root'));

    ReactDOM.render(React.createElement(
        'div',
        { className: 'section' },
        React.createElement(
            'h1',
            null,
            'My Top Tracks'
        ),
        top_tracks
    ), document.getElementById('root2'));

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
                        { type: 'button', id: 'short_btn', onClick: shortbtn, className: 'btn btn-outline-success active' },
                        '4 weeks'
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
    ), document.getElementById('root4'));
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
    { className: 'row', style: { textAlign: "center" } },
    React.createElement(
        'div',
        { className: 'col' },
        React.createElement(
            'button',
            { type: 'button', id: 'login_btn', className: 'btn btn-outline-success active' },
            'Connect with Spotify'
        )
    )
), document.getElementById('root4'));

getArtistsShort();