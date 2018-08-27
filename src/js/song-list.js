{
    let view = {
        el: '#song-list-container',
        template: `
        <ul class="song-list">
        <li>歌曲12323</li>
        <li>歌曲1666</li>
        <li>歌曲14</li>
        <li>歌曲13</li>
        <li>歌曲12</li>

    </ul>
        `,
        render(data) {
            $(this.el).html(this.template);
        }
    }
    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data)

        }
    }
    controller.init(view, model)
}