{
    let view = {
        el: '#song-list-container',
        template: `
        <ul class="song-list"></ul>
        `,
        render(data) {
            let $el = $(this.el);
            $el.html(this.template);
            let { songs, selectedSongId } = data;
            let liList = songs.map((song) => {
                let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id);
                if (song.id === selectedSongId) {
                    $li.addClass('active')
                }
                return $li;
            });
            $el.find('ul').empty();
            liList.map((domli) => {
                $el.find('ul').append(domli)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        },

        // activeItem(li) {
        //     let $li = $(li);
        //     $li.addClass('active').siblings('.active').removeClass('active');
        // }
    }
    let model = {
        data: {
            songs: [],
            selectedSongId: ''
        },
        find() {
            var query = new AV.Query('Song');
            return query.find().then((data) => {
                this.data.songs = data.map((song) => {
                    return { id: song.id, ...song.attributes }
                });
                return data;
            })
        },
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.bindEvents();
            this.bindEventHub();
            this.view.render(this.model.data);
            this.getSongList();

        },

        getSongList() {
            return this.model.find().then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            $(this.view.el).on('click', 'li', (e) => {
                // this.view.activeItem(e.currentTarget);
                let songId = e.currentTarget.getAttribute('data-song-id');
                this.model.data.selectedSongId = songId;
                this.view.render(this.model.data);
                let songList = this.model.data.songs;
                let selectedSong = songList.find((song) => {
                    return song.id === songId;
                })
                window.eventHub.emit('selected', { ...selectedSong })
            })
        },
        bindEventHub() {
            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data);
                this.view.render(this.model.data)
            });

            window.eventHub.on('new', () => {
                this.view.clearActive();
            });
            window.eventHub.on('update', (song) => {
                let songs = this.model.data.songs;
                songs.forEach(element => {
                    if (element.id === song.id) {
                        Object.assign(element, song)
                    }
                });
                this.view.render(this.model.data)
            })
        }
    }
    controller.init(view, model)
}