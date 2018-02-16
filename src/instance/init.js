exports._init = function (options) {
    // 其他初始化

    this.$options = options;
    this.$data = options.data;
    this.$el = document.querySelector(options.el);
    this.$template = this.$el.cloneNode(true);
    this._directives = [];

    // 创建观察对象
    this.observer = this.observer.create(this.$data);

    this.observer.on('set', this._updateBindingAt.bind(this));

    // 渲染挂载
    this.$mount();
};
