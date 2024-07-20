"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinWheelSingleTime = void 0;
var axios_1 = require("axios");
var dotenv = require("dotenv");
var fs = require("fs");
var util = require("util");
dotenv.config();
var ACCOUNTS = JSON.parse(process.env.ACCOUNTS);
var getRandomNumber = function (upperLimit) {
    return Math.round(Math.random() * upperLimit);
};
ACCOUNTS.forEach(function (account) {
    var nextRun = new Date();
    nextRun.setMinutes(nextRun.getMinutes() + getRandomNumber(10));
    account.nextRun = nextRun;
});
var WHITE_LIST = ["volodymyr", "oneplusone", "whale", "xiomi", "oksana", "gt_turbo"];
var maxFailuresBeforeLog = 30;
var ONE_MINUTE = 60000;
var SECURITY_COOKIE_BEGINNING = "wordpress_sec_e8545d4d14fb7e95140409c6df04e61f=";
function delay(time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
}
var bombardWithPostTransactions = function (accountName) { return __awaiter(void 0, void 0, void 0, function () {
    var score, bodyFormData, accountConfig, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                score = 0;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                bodyFormData = new FormData();
                bodyFormData.append("action", "spinWellOfFortuneStateless");
                bodyFormData.append("transactionId", "-");
                bodyFormData.append("pageId", "68769");
                accountConfig = ACCOUNTS.find(function (account) { return account.name === accountName; });
                if (!accountConfig) {
                    throw new Error("Account ".concat(accountName, " not found"));
                }
                return [4 /*yield*/, axios_1.default.post("https://learnnear.club/wp-admin/admin-ajax.php", bodyFormData, {
                        headers: {
                            "Content-Type": "multipart/form-data;",
                            Cookie: SECURITY_COOKIE_BEGINNING + accountConfig.securityCookie,
                        },
                    })];
            case 2:
                response = _a.sent();
                if (response.data === "Something goes wrong please try again later") {
                    return [2 /*return*/, 0];
                }
                score = response.data.split(" ")[0];
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.log("error running promise", error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, score];
        }
    });
}); };
var logToFile = function (logString) {
    fs.appendFileSync("./log", util.format(logString) + "\n");
};
var tryExecuteWithTimeMeasurement = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
    var precision, start, result, elapsed, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                precision = 3;
                start = process.hrtime();
                return [4 /*yield*/, (callback === null || callback === void 0 ? void 0 : callback())];
            case 1:
                result = _a.sent();
                elapsed = process.hrtime(start)[1] / 1000000;
                return [2 /*return*/, { result: result, time: elapsed.toFixed(precision) }];
            case 2:
                error_2 = _a.sent();
                console.log("error measuring time");
                throw error_2;
            case 3: return [2 /*return*/];
        }
    });
}); };
var spinWheelSingleTime = function (accountName, successCallback, errorCallback) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, result, time, logToFileString, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, tryExecuteWithTimeMeasurement(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, bombardWithPostTransactions(accountName)];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); })];
            case 1:
                _a = _b.sent(), result = _a.result, time = _a.time;
                logToFileString = "".concat(accountName, " score: ").concat(result, "; ").concat(time, " ").concat(new Date().toUTCString());
                if (!result || result === 0) {
                    errorCallback === null || errorCallback === void 0 ? void 0 : errorCallback(logToFileString);
                }
                else {
                    successCallback === null || successCallback === void 0 ? void 0 : successCallback(logToFileString);
                }
                logToFile(logToFileString);
                return [2 /*return*/, logToFileString];
            case 2:
                error_3 = _b.sent();
                errorCallback === null || errorCallback === void 0 ? void 0 : errorCallback("unhandled error");
                console.log("error executing main", error_3);
                return [2 /*return*/, "error executing main"];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.spinWheelSingleTime = spinWheelSingleTime;
var runSpinningWheelInALoop = function () {
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var promises, dateTimeNow, _loop_1, _i, ACCOUNTS_1, account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    dateTimeNow = new Date();
                    _loop_1 = function (account) {
                        if (account.nextRun < dateTimeNow) {
                            var successCallback = function (log) {
                                var nextRun = getNextRunSuccess(account.name);
                                account.nextRun = nextRun;
                                console.log(log, "next run:", account.nextRun.toUTCString());
                            };
                            var errorCallback = function (log) {
                                var nextRun = getNextRunFailure(account.name);
                                account.nextRun = nextRun;
                                console.log("run failed", log, "next run:", account.nextRun.toUTCString());
                            };
                            var spinWheelPromise = (0, exports.spinWheelSingleTime)(account.name, successCallback, errorCallback);
                            promises.push(spinWheelPromise);
                        }
                    };
                    for (_i = 0, ACCOUNTS_1 = ACCOUNTS; _i < ACCOUNTS_1.length; _i++) {
                        account = ACCOUNTS_1[_i];
                        _loop_1(account);
                    }
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, ONE_MINUTE);
};
var getNextRunSuccess = function (account_name) {
    var dateTimeNow = new Date();
    var utcHours = dateTimeNow.getUTCHours();
    var isWhiteListed = WHITE_LIST.includes(account_name);
    var nextRun = new Date();
    if (!isWhiteListed) {
        nextRun.setMinutes(new Date().getMinutes() + 60);
        return nextRun;
    }
    if (utcHours > 22) {
        nextRun.setHours(nextRun.getHours() + 5 + getRandomNumber(3));
        console.log("it's too late. I go to bed", account_name);
    }
    nextRun.setMinutes(new Date().getMinutes() + 60 + getRandomNumber(20));
    return nextRun;
};
var getNextRunFailure = function (account_name) {
    var dateTimeNow = new Date();
    var utcHours = dateTimeNow.getUTCHours();
    var isWhiteListed = WHITE_LIST.includes(account_name);
    var nextRun = new Date();
    if (isWhiteListed && utcHours > 22) {
        nextRun.setHours(nextRun.getHours() + 5 + getRandomNumber(3));
        console.log("it's too late. I go to bed", account_name);
    }
    nextRun.setMinutes(new Date().getMinutes() + getRandomNumber(10));
    return nextRun;
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    var nextRunDelay;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                nextRunDelay = 0;
                return [4 /*yield*/, delay(nextRunDelay)];
            case 1:
                _a.sent();
                runSpinningWheelInALoop();
                return [2 /*return*/];
        }
    });
}); };
// const main = async () => {
//   await spinWheelSingleTime("micro_strategy", () => {});
// };
main();
