/* Saya tambahkan lebih banyak data API serta dengan desain dan fungsionalitas
yang lebih kompleks lagi*/

$(document).ready(function () {
    const apiKey = '12e2810e5d9b614ae49a5485cd26921c';
    const apiUrl = 'https://api.themoviedb.org/3';
    const genreUrl = 'https://api.themoviedb.org/3/genre/movie/list';
    let pages = 1;
    let genres = {};

    // Fungsi untuk menampilkan sidebar
    function openSidebar() {
        $('.sidebar').css('width', '250px');
    }

    // Fungsi untuk menutup sidebar
    function closeSidebar() {
        $('.sidebar').css('width', '0');
    }

    // Event klik hamburger dan close
    $('.navbar-hamburger').click(openSidebar);
    $('.closebtn').click(closeSidebar);

    // Request genre dari API
    $.ajax({
        url: genreUrl,
        type: 'Get',
        data: { api_key: apiKey },
        success: function (genreResponse) {
            genres = genreResponse.genres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
        }
    });

    // Fungsi untuk menampilkan popup detail film dan serial TV
    function showItemPopup(movie) {
        const popupCard = $('<div>').addClass('movie-popup');
        const popupPoster = $('<img>').addClass('popup-poster').attr('src', `https://image.tmdb.org/t/p/w200/${movie.poster_path}`).attr('alt', `${movie.title} Poster`);
        const popupDetail = $('<div>').addClass('popup-detail');
        const popupJudul = $('<div>').addClass('popup-judul').html('<b>Judul : </b>' + movie.title);
        const popupGenre = $('<div>').addClass('popup-genre').html('<b>Genre : </b>' + movie.genre);
        const popupTahun = $('<div>').addClass('popup-tahun').html('<b>Tahun Rilis : </b>' + movie.release_year);
        const popupSinopsis = $('<div>').addClass('popup-sinopsis').html('<b>Sinopsis : </b> <br>' + movie.overview);

        popupDetail.append(popupJudul, popupGenre, popupTahun, popupSinopsis);
        popupCard.append(popupPoster, popupDetail);

        const overlay = $('<div>').addClass('overlay');
        overlay.append(popupCard);

        $('body').append(overlay);
        overlay.fadeIn();

        overlay.click(function (e) {
            if (e.target === overlay[0]) {
                overlay.fadeOut(function () {
                    overlay.remove();
                });
            }
        });
    }

    // Fungsi untuk membuat dan menampilkan daftar film dan serial TV
    function createItem(item, topContent = false) {
        const itemCard = $('<div>').addClass('movie-card').hide();
        const poster = $('<img>').addClass('poster').attr('src', `https://image.tmdb.org/t/p/w200/${item.poster_path}`).attr('alt', `${item.title || item.name} Poster`);
        const itemInfo = $('<div>').addClass('movie-info');
        const title = $('<div>').addClass('judul').text(item.title || item.name || '');
        const genre = $('<div>').addClass('genre').text(item.genre_ids.map(id => genres[id]).join(', '));
        const tahun = $('<div>').addClass('tahun').text((item.release_date || item.first_air_date) ? new Date((item.release_date || item.first_air_date)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '');

        // Kondisi agar penambahan rating hanya ada pada .top-content
        if (topContent && item.vote_average) {
            const rating = $('<span>').addClass('rating').text(item.vote_average);
            itemInfo.append(title, genre, tahun, '<i class="fas fa-star"></i>', rating);
        } else {
            itemInfo.append(title, genre, tahun);
        }

        // Menampilkan pop up ketika card diklik
        itemCard.click(function () {
            let genresList = '';

            if (item.genre_ids && Array.isArray(item.genre_ids)) {
                genresList = item.genre_ids.map(id => genres[id]).join(', ');
            } else {
                genresList = 'Genre tidak diketahui';
            }

            showItemPopup({
                title: item.title || item.name || '',
                release_year: (item.release_date || item.first_air_date) ? new Date((item.release_date || item.first_air_date)).getFullYear() : '',
                genre: genresList,
                poster_path: item.poster_path,
                overview: item.overview || ''
            });
        });

        itemCard.append(poster, itemInfo);
        return itemCard;
    }

    // Fungsi untuk loading data API berdasarkan setiap apii
    function loadItems(apii, elemenn, jumlah, page, topContent = false) {
        $.ajax({
            url: `${apiUrl}${apii}`,
            type: 'GET',
            data: { api_key: apiKey, language: 'en-US', page: page },
            success: function (response) {
                const items = response.results;
                const itemList = $(elemenn);

                for (let i = 0; i < jumlah && i < items.length; i++) {
                    const item = items[i];
                    const itemCard = createItem(item, topContent);
                    itemList.append(itemCard);

                    itemCard.slideDown(1000);
                }
            },

            error: function (error) {
                alert(`Gagal memuat data dari ${apii}! :(`);
            },
        });
    }

    // Tombol untuk loading data baru
    $('#load').click(function () {
        pages++;
        loadItems('/movie/popular', '#daftar-film', 20, pages);
    });

    $('#load-tv').click(function () {
        pages++;
        loadItems('/discover/tv', '#daftar-tv', 20, pages);
    });

    // Mengambil setiap API, elemen yang akan menjadi wadah, jumlah data yang diambil, dan halamannya pada API
    loadItems('/movie/top_rated', '#daftar-top', 7, 1, true);
    loadItems('/movie/upcoming', '#daftar-upcoming', 7, 1);
    loadItems('/movie/popular', '#daftar-film', 20, 1);
    loadItems('/discover/tv', '#daftar-tv', 20, 1);

    // Tombol untuk melakukan pencarian pada API Search
    $('button[type="button"]').click(function () {
        const query = $('input[type="text"]').val().trim();
        if (query !== '') {
            $('#daftar-film').empty();
            $('.topp, .tv-content, #load, .baris, .tanya').hide();

            // Request pencarian film menggunakan API search
            $.ajax({
                url: `${apiUrl}/search/movie`,
                type: 'GET',
                data: { api_key: apiKey, language: 'en-US', query: query },
                success: function (response) {
                    const items = response.results;
                    const itemList = $('#daftar-film');

                    if (items.length === 1) {
                        alert('Pencarian tidak ditemukan.');
                    } else {
                        for (let i = 0; i < items.length; i++) {
                            const item = items[i];
                            const itemCard = createItem(item);
                            itemList.append(itemCard);

                            itemCard.slideDown(1000);
                        }
                    }
                },

                error: function (error) {
                    alert(`Gagal melakukan pencarian! :(`);
                },
            });
        }
    });
});


