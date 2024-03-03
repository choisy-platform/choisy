"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.HttpParams = exports.BaseService = void 0;
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var angular_1 = require("@ionic/angular");
var app_constant_1 = require("./app-constant");
var schema_service_1 = require("./db/schema.service");
var app_setting_service_1 = require("./app-setting.service");
var app_injector_1 = require("./app-injector");
var helper_service_1 = require("./helper.service");
var localization_service_1 = require("./localization.service");
var db_web_service_1 = require("./db/db-web.service");
var pub_sub_1 = require("src/app/modules/universal/pub-sub");
var user_setting_service_1 = require("../authentication/user-setting.service");
var BaseService = /** @class */ (function () {
    function BaseService() {
        var _this = this;
        var injector = app_injector_1.AppInjector.getInjector();
        this.http = injector.get(http_1.HttpClient);
        this.platform = injector.get(angular_1.Platform);
        this.schemaSvc = injector.get(schema_service_1.SchemaService);
        this.appSettingSvc = injector.get(app_setting_service_1.AppSettingService);
        this.userSettingSvc = injector.get(user_setting_service_1.UserSettingService);
        this.helperSvc = injector.get(helper_service_1.HelperService);
        this.localizationSvc = injector.get(localization_service_1.LocalizationService);
        this.pubsubSvc = injector.get(pub_sub_1.NgxPubSubService);
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // const info = await Device.getInfo();
                // if(info.platform === "ios" || info.platform === "android") {
                //     this.dbService = injector.get(DbSqlService);
                // } else {
                this.dbService = injector.get(db_web_service_1.DbWebService);
                return [2 /*return*/];
            });
        }); }, 0);
    }
    BaseService.prototype.getData = function (args) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var headers, newUrl, prop;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prepareHeaders(args)];
                    case 1:
                        headers = _a.sent();
                        args.body = args.body || {};
                        if (!args.overrideUrl) {
                            newUrl = "" + (app_constant_1.AppConstant.BASE_API_URL + args.url);
                            for (prop in args.body) {
                                if (args.body.hasOwnProperty(prop)) {
                                    if (newUrl.includes('?')) {
                                        newUrl += '&';
                                    }
                                    else {
                                        newUrl += '?';
                                    }
                                    newUrl += prop + "=" + (typeof args.body[prop] === 'undefined' ? '' : args.body[prop]);
                                }
                            }
                            args.url = newUrl;
                        }
                        this.http
                            .get(args.url, {
                            headers: headers
                        })
                            .subscribe(function (result) {
                            resolve(result);
                        }, function (error) {
                            _this.handleError(error, args);
                            if (args.errorCallback) {
                                resolve(null);
                            }
                            else {
                                reject(error);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BaseService.prototype.postData = function (args) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var headers, newUrl, body;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.prepareHeaders(args)];
                    case 1:
                        headers = _a.sent();
                        if (!args.overrideUrl) {
                            newUrl = "" + (app_constant_1.AppConstant.BASE_API_URL + args.url);
                        }
                        else {
                            newUrl = args.url;
                        }
                        args.url = newUrl;
                        body = args.body;
                        this.http
                            .post(args.url, body, {
                            headers: headers
                        })
                            .subscribe(function (result) {
                            resolve(result);
                        }, function (error) {
                            _this.handleError(error, args);
                            if (args.errorCallback) {
                                resolve(null);
                            }
                            else {
                                reject(error);
                            }
                        });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BaseService.prototype.handleError = function (e, args) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                if (app_constant_1.AppConstant.DEBUG) {
                    console.log('BaseService: handleError', e);
                }
                switch (e.status) {
                    // case 401:
                    //     const u = await this.userSettingSvc.getCurrentUser();
                    //     if(u) {
                    //         //TODO: check for token expiration...
                    //         //kickout...
                    //         this.pubsubSvc.publishEvent(UserConstant.EVENT_USER_LOGGEDOUT, { clearCache: true, displayLoginDialog: true });
                    //     }
                    // break;
                    default:
                        if (!args.errorCallback) {
                            msg = void 0;
                            //the error might be thrown by e.g a plugin wasn't install properly. In that case text() will not be available
                            if (e.message) {
                                msg = e.message;
                            }
                            else {
                                msg = e.error.toString();
                            }
                            // setTimeout(async () => {
                            //     await this.helperSvc.alert(msg);
                            // });
                        }
                        else {
                            args.errorCallback(e, args);
                        }
                        break;
                }
                return [2 /*return*/];
            });
        });
    };
    BaseService.prototype.prepareHeaders = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var headers;
            return __generator(this, function (_a) {
                headers = new http_1.HttpHeaders();
                if (!args.ignoreContentType) {
                    headers = headers.append('Content-Type', 'application/json;charset=utf-8');
                }
                // const token = await this.userSettingSvc.getAccessToken();
                // if(token) {
                //     headers = headers.append('Authorization', `Bearer ${token}`);
                // }
                if (args.httpHeaders) {
                    args.httpHeaders.keys().forEach(function (k) {
                        headers = headers.append(k, args.httpHeaders.get(k));
                    });
                }
                return [2 /*return*/, headers];
            });
        });
    };
    BaseService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], BaseService);
    return BaseService;
}());
exports.BaseService = BaseService;
var HttpParams = /** @class */ (function () {
    function HttpParams() {
    }
    return HttpParams;
}());
exports.HttpParams = HttpParams;
