"use strict";
exports.__esModule = true;
exports.AppInjector = void 0;
var AppInjector = /** @class */ (function () {
    function AppInjector() {
    }
    AppInjector.setInjector = function (injector) {
        AppInjector.injector = injector;
    };
    AppInjector.getInjector = function () {
        return AppInjector.injector;
    };
    return AppInjector;
}());
exports.AppInjector = AppInjector;
