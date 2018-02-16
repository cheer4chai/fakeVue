/**
 * Created by DELL-PC on 2018/2/16.
 */
const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
const arrayAugmentations = [];

aryMethods.forEach((method) => {
    let original = Array.prototype[method];
    arrayAugmentations[method] = function () {
    console.log('我被改变啦!');
    return original.apply(this, arguments);
};
});

module.exports = arrayAugmentations;