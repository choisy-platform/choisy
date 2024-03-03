"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppSettingService = void 0;
var core_1 = require("@angular/core");
var angular_1 = require("@ionic/angular");
var schema_service_1 = require("./db/schema.service");
var app_constant_1 = require("./app-constant");
var app_injector_1 = require("./app-injector");
var db_web_service_1 = require("./db/db-web.service");
var AppSettingService = /** @class */ (function () {
    function AppSettingService() {
        // https://blogs.msdn.microsoft.com/premier_developer/2018/06/17/angular-how-to-simplify-components-with-typescript-inheritance/
        var injector = app_injector_1.AppInjector.getInjector();
        // if(this.platform.is('cordova')) {
        //     this.dbService = injector.get(DbSqlService);
        // } else {
        this.dbService = injector.get(db_web_service_1.DbWebService);
        // }
        this.schemaSvc = injector.get(schema_service_1.SchemaService);
        this.platform = injector.get(angular_1.Platform);
    }
    AppSettingService_1 = AppSettingService;
    AppSettingService.prototype.putWorkingLanguage = function (lang) {
        return this.dbService
            .putLocal(this.schemaSvc.tables.setting, {
            key: app_constant_1.AppConstant.KEY_WORKING_LANGUAGE,
            value: lang
        })
            .then(function () {
            AppSettingService_1.settingCache.set(app_constant_1.AppConstant.KEY_WORKING_LANGUAGE, lang);
        });
    };
    AppSettingService.prototype.getWorkingLanguage = function () {
        return this.get(app_constant_1.AppConstant.KEY_WORKING_LANGUAGE);
    };
    AppSettingService.prototype.get = function (key) {
        if (AppSettingService_1.settingCache.has(key)) {
            return new Promise(function (resolve, reject) {
                var settingCacheMap = AppSettingService_1.settingCache.get(key);
                resolve(settingCacheMap);
            });
        }
        else {
            return this.dbService
                .get(this.schemaSvc.tables.setting, key)
                .then(function (setting) {
                if (setting && setting.value) {
                    AppSettingService_1.settingCache.set(key, setting.value);
                    return setting.value;
                }
                return null;
            });
        }
    };
    AppSettingService.prototype.put = function (key, values) {
        return this.dbService
            .putLocal(this.schemaSvc.tables.setting, {
            key: key,
            value: values
        })
            .then(function () {
            AppSettingService_1.settingCache.set(key, values);
        });
    };
    AppSettingService.prototype.remove = function (key) {
        return this.dbService
            .remove(this.schemaSvc.tables.setting, {
            key: key
        })
            .then(function () {
            AppSettingService_1.settingCache["delete"](key);
        });
    };
    AppSettingService.prototype.removeCache = function (key) {
        AppSettingService_1.settingCache["delete"](key);
    };
    var AppSettingService_1;
    AppSettingService.settingCache = new Map();
    AppSettingService = AppSettingService_1 = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AppSettingService);
    return AppSettingService;
}());
exports.AppSettingService = AppSettingService;
