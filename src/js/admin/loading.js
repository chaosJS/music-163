{
    let view = {
        el: '#site-loading',
        show() {
            $(this.el).addClass('show')
        },
        hide() {
            $(this.el).removeClass('show')
        }
    };
    let controller = {
        init(view) {
            this.view = view;
            this.bindEventHub()
        },
        bindEventHub() {
            window.eventHub.on('beforeUpload', () => {
                this.view.show()
            })
            window.eventHub.on('afterUpload', () => {
                this.view.hide()
            })
        }
    }
    controller.init(view)
}