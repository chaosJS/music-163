{
    let view = {
        el: '.page>main',
        template:
            `
        <p>歌曲信息</p>
        <form>
            <div class="row">
                <label>
                    歌名
                    <br/>
                    <input type="text">
                </label>

            </div>
            <div class="row">
                <label>
                    歌手
                    <br/>

                    <input type="text">
                </label>
            </div>
            <div class="row">
                <label>
                    外链
                    <br/>

                    <input type="text">
                </label>
            </div>
            <div class="row">
                <button type="submit" class="saveBtn">保存</button>
            </div>
        </form>
        `,
        render(data) {
            $(this.el).html(this.template)
        },
    }
    let model = {};

    let controller = {
        init(view, model) {
            this.view = view;
            this.model = model;
            this.view.render(this.model.data);
            window.eventHub.on('upload', (data) => {
                console.log('song form data::', data)
            })
        }
    }
    controller.init(view, model);
}