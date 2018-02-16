function fakeVue(option) {
    this._init(option);
}
fakeVue.prototype = {
    constructor: fakeVue,
    ...require('./instance/init'),
    ...require('./instance/compile'),
    ...require('./api/lifecycle'),
    ...require('./api/data'),
    ...require('./instance/bindings'),
    observer: {...require('./observer/observer')}
}

module.exports = fakeVue;