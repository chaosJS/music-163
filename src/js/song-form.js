{
    let view = {
        el: '.page>main',
        init() {
            this.$el = $(this.el);
        },
        template:
            `
        <p>歌曲信息</p>
        <form>
            <div class="row">
                <label>
                    歌名
                    <br/>
                    <input type="text" name="name" value="__name__">
                </label>

            </div>
            <div class="row">
                <label>
                    歌手
                    <br/>

                    <input type="text" name="singer" value="__singer__">
                </label>
            </div>
            <div class="row">
                <label>
                    外链
                    <br/>

                    <input type="text" name="url" value="__url__">
                </label>
            </div>
            <div class="row">
                <button type="submit" class="saveBtn">保存</button>
            </div>
        </form>
        `,
        render(data = {}) {
            let placeholders = ['name', 'singer', 'url', 'id'];
            let html = this.template;
            placeholders.map((string) => {
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset() {
            this.render({})
        }
    }
    let model = {
        data: {
            name: '',
            singer: '',
            url: '',
            id: ''
        },
        create(data) {
            var Song = AV.Object.extend('Song');
            var song = new Song();
            song.set({ ...data });
            return song.save().then(
                (newSong) => {
                    // console.log(newSong)
                    let { id, attributes } = newSong;
                    Object.assign(this.data, { id, ...attributes })
                },
                (err) => {
                    console.log(err)
                }
            )

        }
    };

    let controller = {
        init(view, model) {
            this.view = view;
            this.view.init();
            this.model = model;
            this.bindEvents();
            this.view.render(this.model.data);
            window.eventHub.on('upload', (data) => {
                // console.log('song form data::', data)
                this.reset(data);
            })
        },
        reset(data) {
            this.view.render(data)
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e) => {
                e.preventDefault();
                let needs = ['name', 'singer', 'url'];

                let data = {};
                needs.map((str) => {
                    data[str] = this.view.$el.find(`[name="${str}"]`).val();
                })

                this.model.create(data).then(
                    () => {
                        this.view.reset();
                        window.eventHub.emit('create', Object.assign({}, this.model.data));
                    },
                    () => { }
                )
            })
        }
    }
    controller.init(view, model);
}