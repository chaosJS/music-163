{
    let view = {
        el: '#song-list-container',
        template: `
        <ul class="song-list"></ul>
        `,
        render(data) {
            let $el = $(this.el);
            $el.html(this.template);
            let { songs } = data;
            let liList = songs.map((song) => $('<li></li>').text(song.name));
            $el.find('ul').empty();
            liList.map((domli) => {
                $el.find('ul').append(domli)
            })
        },
        clearActive() {
            $(this.el).find('.active').removeClass('active')
        },
    }
    let model = {
        data: {
            songs: []
        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            window.eventHub.on('upload', () => {
                this.view.clearActive();
            });

            window.eventHub.on('create', (data) => {
                this.model.data.songs.push(data);
                this.view.render(this.model.data)
            })

        }
    }
    controller.init(view, model)
}