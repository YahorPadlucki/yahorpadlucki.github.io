/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var objectsMap = {};
exports.get = function (constructor) {
    if (!objectsMap[constructor.toString()]) {
        objectsMap[constructor.toString()] = new constructor();
    }
    return objectsMap[constructor.toString()];
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Event_1 = __webpack_require__(19);
var List_1 = __webpack_require__(8);
var EventDispatcher = /** @class */ (function () {
    function EventDispatcher() {
        this.eventMaps = new List_1.List();
    }
    EventDispatcher.prototype.addListener = function (event, listener, scope) {
        //TODO: if no scope passed?
        var eventMap = new Event_1.EventMap(event, listener, scope);
        if (!this.eventMaps.has(eventMap)) {
            this.eventMaps.add(eventMap);
        }
    };
    EventDispatcher.prototype.removeListener = function (event, listener, scope) {
        this.eventMaps.removeByFilter({ event: event, listener: listener, scope: scope });
    };
    EventDispatcher.prototype.dispatch = function (event, data) {
        this.eventMaps.getByFilter({ event: event }).forEach(function (eventMap) {
            eventMap.eventListener.call(eventMap.scope, data);
        });
    };
    return EventDispatcher;
}());
exports.EventDispatcher = EventDispatcher;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotEvent = {
    ENTER_FRAME: "ENTER_FRAME",
    SPIN_CLICK: "SPIN_CLICK",
    STOP_CLICK: "STOP_CLICK",
    REELS_SPIN_STARTED: "REELS_SPIN_STARTED",
    REELS_STOPPED: "REELS_STOPPED",
    SINGLE_REEL_STOPPED: "SINGLE_REEL_STOPPED",
    SERVER_SPIN_RESPONSE_RECEIVED: "SERVER_SPIN_RESPONSE_RECEIVED",
    SERVER_INIT_RESPONSE_RECEIVED: "SERVER_INIT_RESPONSE_RECEIVED",
    SLOT_STATE_CHANGED: "SLOT_STATE_CHANGED",
    NEW_REELS_TAPES_RECEIVED: "NEW_REELS_TAPES_RECEIVED",
    HIDE_REELS: "HIDE_REELS",
    SHOW_REELS: "SHOW_REELS",
    UPDATE_REEL_SYMBOLS: "UPDATE_REEL_SYMBOLS"
};
exports.KeyBoardEvent = {
    SPACE_DOWN: "KeyBoardEvent.SPACE_DOWN",
    SPACE_UP: "KeyBoardEvent.SPACE_UP",
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var SlotEvent_1 = __webpack_require__(2);
var RewardsModel_1 = __webpack_require__(7);
var locator_1 = __webpack_require__(0);
var SlotModel = /** @class */ (function () {
    function SlotModel() {
        this.rewardsModel = locator_1.get(RewardsModel_1.RewardsModel);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
    }
    SlotModel.prototype.parseServerSpinResponse = function (response) {
        this.parseReels(response.reels);
        this.rewardsModel.parse(response);
    };
    SlotModel.prototype.parseServerInitResponse = function (response) {
        this.parseReels(response.reels);
        this.parseLines(response.lines);
    };
    SlotModel.prototype.parseReels = function (reels) {
        if (reels) {
            if (reels.stopPositions) {
                this._stopReelsPosition = reels.stopPositions;
            }
            if (reels.tapes) {
                this._tapes = reels.tapes.concat();
                this.dispatcher.dispatch(SlotEvent_1.SlotEvent.NEW_REELS_TAPES_RECEIVED);
            }
        }
    };
    SlotModel.prototype.parseLines = function (lines) {
        if (lines) {
            this._lines = lines.concat();
        }
    };
    SlotModel.prototype.getStopReelsPosition = function () {
        return this._stopReelsPosition;
    };
    Object.defineProperty(SlotModel.prototype, "state", {
        get: function () {
            return this._currentSlotState;
        },
        set: function (state) {
            if (this._currentSlotState !== state) {
                this._currentSlotState = state;
                this.dispatcher.dispatch(SlotEvent_1.SlotEvent.SLOT_STATE_CHANGED);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlotModel.prototype, "tapes", {
        get: function () {
            return this._tapes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SlotModel.prototype, "lines", {
        get: function () {
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    return SlotModel;
}());
exports.SlotModel = SlotModel;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.LoaderEvent = {
    FILE_LOADING_STARTED: "FILE_LOADING_STARTED",
    FILE_LOADED: "FILE_LOADED",
    ALL_FILES_LOADED: "ALL_FILES_LOADED",
};
exports.LoadingManagerEvent = {
    PRELOAD_ASSETS_LOADED: "PRELOAD_ASSETS_LOADED",
    MAIN_ASSETS_LOAD_PROGRESS: "MAIN_ASSETS_LOAD_PROGRESS",
    MAIN_ASSETS_LOADED: "MAIN_ASSETS_LOADED"
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SlotConfig = /** @class */ (function () {
    function SlotConfig() {
    }
    return SlotConfig;
}());
exports.SlotConfig = SlotConfig;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LoaderCache = /** @class */ (function () {
    function LoaderCache() {
        this.imageCache = {};
    }
    LoaderCache.prototype.addTexture = function (id, texture) {
        if (!this.imageCache[id]) {
            this.imageCache[id] = texture;
        }
    };
    LoaderCache.prototype.getTexture = function (id) {
        return this.imageCache[id];
    };
    return LoaderCache;
}());
exports.LoaderCache = LoaderCache;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RewardVO_1 = __webpack_require__(25);
var RewardsModel = /** @class */ (function () {
    function RewardsModel() {
    }
    RewardsModel.prototype.parse = function (response) {
        var _this = this;
        if (response.rewards) {
            this._rewards = [];
            response.rewards.forEach(function (reward) {
                var rewardVO = new RewardVO_1.RewardVO();
                rewardVO.symbolsCount = reward.symbolsCount;
                rewardVO.lineId = reward.lineId;
                rewardVO.linePayout = reward.linePayout;
                _this._rewards.push(rewardVO);
            });
        }
        if (response.totalWin) {
            this._totalWin = response.totalWin;
        }
    };
    Object.defineProperty(RewardsModel.prototype, "totalWin", {
        get: function () {
            return this._totalWin;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RewardsModel.prototype, "rewards", {
        get: function () {
            return this._rewards;
        },
        enumerable: true,
        configurable: true
    });
    return RewardsModel;
}());
exports.RewardsModel = RewardsModel;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var List = /** @class */ (function () {
    function List(list) {
        if (list === void 0) { list = []; }
        this.list = list;
    }
    List.prototype.add = function (item) {
        this.list.push(item);
    };
    List.prototype.has = function (item) {
        return this.list.indexOf(item) !== -1;
    };
    List.prototype.remove = function (item) {
        if (this.has(item)) {
            this.list.splice(this.list.indexOf(item), 1);
        }
    };
    List.prototype.getByFilter = function (filter) {
        return this.filter(filter, false);
    };
    List.prototype.removeByFilter = function (filter) {
        this.list = this.filter(filter, true);
    };
    List.prototype.filter = function (filter, isInverted) {
        var _this = this;
        if (isInverted === void 0) { isInverted = false; }
        var result = [];
        this.list.forEach(function (item) {
            if (_this.isInList(item, filter) !== isInverted) {
                result.push(item);
            }
        });
        return result;
    };
    List.prototype.isInList = function (item, filter) {
        for (var property in filter) {
            if (filter.hasOwnProperty(property) && item.hasOwnProperty(property)) {
                if ((filter[property]) && filter[property] !== item[property]) {
                    return false;
                }
            }
        }
        return true;
    };
    return List;
}());
exports.List = List;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var SymbolModel_1 = __webpack_require__(24);
var locator_1 = __webpack_require__(0);
var EventDispatcher_1 = __webpack_require__(1);
var SymbolEvents_1 = __webpack_require__(10);
var SymbolView = /** @class */ (function (_super) {
    __extends(SymbolView, _super);
    function SymbolView(colorIndex) {
        var _this = _super.call(this) || this;
        _this.symbolWidth = 100;
        _this.symbolHeight = 100;
        _this.symbolModel = locator_1.get(SymbolModel_1.SymbolModel);
        _this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        _this.setSymbolImage(colorIndex);
        _this.dispatcher.addListener(SymbolEvents_1.SymbolEvents.BLINK, _this.blink, _this);
        _this.dispatcher.addListener(SymbolEvents_1.SymbolEvents.STOP_BLINK, _this.stopBlink, _this);
        return _this;
    }
    SymbolView.prototype.setSymbolImage = function (colorIndex) {
        this.removeChildren();
        var graphics = new PIXI.Graphics();
        graphics.beginFill(this.symbolModel.colorMap[colorIndex]);
        graphics.drawRect(0, 0, this.symbolWidth, this.symbolHeight);
        graphics.endFill();
        this.addChild(graphics);
        var text = new PIXI.Text(colorIndex.toString());
        this.addChild(text);
    };
    SymbolView.prototype.blink = function (winSymbolData) {
        var _this = this;
        if (winSymbolData.rowIndex !== this._stopRowIndex || winSymbolData.columnIndex !== this._stopCollumnIndex) {
            return;
        }
        TweenLite.killTweensOf(this);
        TweenLite.to(this, 1, {
            alpha: 0.5
        });
        setTimeout(function () {
            TweenLite.to(_this, 1, {
                alpha: 1,
                onComplete: function () {
                    _this.dispatcher.dispatch(SymbolEvents_1.SymbolEvents.BLINK_COMPLETE);
                }
            });
        }, 1000);
    };
    SymbolView.prototype.stopBlink = function (winSymbolData) {
        if (winSymbolData.rowIndex !== this._stopRowIndex || winSymbolData.columnIndex !== this._stopCollumnIndex) {
            return;
        }
        TweenLite.killTweensOf(this);
        this.alpha = 1;
    };
    SymbolView.prototype.setSymbolStopPositionIndexes = function (rowIndex, column) {
        this._stopRowIndex = rowIndex;
        this._stopCollumnIndex = column;
    };
    SymbolView.prototype.onDestroy = function () {
        this.dispatcher.removeListener(SymbolEvents_1.SymbolEvents.BLINK, this.blink, this);
        this.dispatcher.removeListener(SymbolEvents_1.SymbolEvents.STOP_BLINK, this.stopBlink, this);
    };
    return SymbolView;
}(Container));
exports.SymbolView = SymbolView;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.SymbolEvents = {
    BLINK: "SymbolEvents.BLINK",
    STOP_BLINK: "SymbolEvents.STOP_BLINK",
    BLINK_COMPLETE: "SymbolEvents.BLINK_COMPLETE"
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Button.prototype.enable = function () {
        this.interactive = true;
        this.buttonMode = true;
    };
    Button.prototype.disable = function () {
        this.interactive = false;
        this.buttonMode = false;
    };
    Button.prototype.isEnabled = function () {
        return this.interactive && this.buttonMode;
    };
    return Button;
}(Container));
exports.Button = Button;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var BaseScene = /** @class */ (function (_super) {
    __extends(BaseScene, _super);
    function BaseScene(minWidth, minHeight) {
        var _this = _super.call(this) || this;
        _this.minWidth = minWidth;
        _this.minHeight = minHeight;
        return _this;
    }
    BaseScene.prototype.onResize = function () {
    };
    return BaseScene;
}(Container));
exports.BaseScene = BaseScene;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ServerEmulator = /** @class */ (function () {
    function ServerEmulator() {
        this.spinsCount = 0;
        console.log("Constructing ");
    }
    ServerEmulator.prototype.init = function (initResponse, spinResponses) {
        this.initResponse = initResponse;
        this.spinResponses = spinResponses;
    };
    ServerEmulator.prototype.initRequest = function () {
        var _this = this;
        return new Promise(function (resolve) {
            clearTimeout(_this.initTimeout);
            _this.initTimeout = setTimeout(function () {
                resolve(_this.initResponse);
            }, 500);
        });
    };
    ServerEmulator.prototype.spinRequest = function () {
        var _this = this;
        return new Promise(function (resolve) {
            clearTimeout(_this.spinRequestTimeout);
            _this.spinRequestTimeout = setTimeout(function () {
                return resolve(_this.spinResponses[_this.spinsCount % _this.spinResponses.length]);
            }, 500);
            _this.spinsCount++;
        });
    };
    return ServerEmulator;
}());
exports.ServerEmulator = ServerEmulator;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Loader_1 = __webpack_require__(41);
var LoaderEvent_1 = __webpack_require__(4);
var EventDispatcher_1 = __webpack_require__(1);
var locator_1 = __webpack_require__(0);
var LoadingManager = /** @class */ (function () {
    function LoadingManager() {
        this.preloadAssetsLoader = new Loader_1.Loader();
        this.mainAssetsLoader = new Loader_1.Loader();
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
    }
    LoadingManager.prototype.loadResources = function (assetsJsonUrl) {
        var _this = this;
        this.loadJson(assetsJsonUrl).then(function (data) { return _this.onAssetsJsonLoaded(data); });
    };
    LoadingManager.prototype.loadJson = function (url) {
        return new Promise(function (resolve, reject) {
            fetch(url).then(function (result) {
                result.json().then(function (data) { return resolve(data); });
            });
        });
    };
    LoadingManager.prototype.onAssetsJsonLoaded = function (data) {
        var _this = this;
        for (var assetId in data) {
            if (data.hasOwnProperty(assetId)) {
                this.getAssetsByPriority(data[assetId], exports.AssetPriority.PRELOAD).forEach(function (asset) { return _this.preloadAssetsLoader.addAsset(asset); });
                this.getAssetsByPriority(data[assetId], exports.AssetPriority.MAIN).forEach(function (asset) { return _this.mainAssetsLoader.addAsset(asset); });
            }
        }
        this.preloadAssetsLoader.addListener(LoaderEvent_1.LoaderEvent.ALL_FILES_LOADED, function () {
            _this.dispatcher.dispatch(LoaderEvent_1.LoadingManagerEvent.PRELOAD_ASSETS_LOADED);
            _this.mainAssetsLoader.startLoading();
        });
        this.preloadAssetsLoader.startLoading();
        this.mainAssetsLoader.addListener(LoaderEvent_1.LoaderEvent.ALL_FILES_LOADED, function () { return _this.dispatcher.dispatch(LoaderEvent_1.LoadingManagerEvent.MAIN_ASSETS_LOADED); });
        this.mainAssetsLoader.addListener(LoaderEvent_1.LoaderEvent.FILE_LOADED, function () {
            console.log("=== Main File loaded");
            var totalFiles = _this.mainAssetsLoader.totalFilesCount();
            var loadedFiles = totalFiles - _this.mainAssetsLoader.filesLeftCount();
            var loadedPercent = (loadedFiles / totalFiles) * 100;
            _this.dispatcher.dispatch(LoaderEvent_1.LoadingManagerEvent.MAIN_ASSETS_LOAD_PROGRESS, loadedPercent);
        });
    };
    LoadingManager.prototype.getAssetsByPriority = function (assets, priority) {
        return assets.filter(function (assets) { return assets.priority === priority; });
    };
    LoadingManager.prototype.getLazyAssets = function (assets) {
        return assets.filter(function (assets) { return assets.priority === ""; });
    };
    return LoadingManager;
}());
exports.LoadingManager = LoadingManager;
exports.AssetPriority = {
    PRELOAD: "PRELOAD",
    MAIN: "MAIN"
};
//TODO: as interface?
exports.FileType = {
    Sound: "Sound",
    Image: "Image",
    Atlas: "Atlas"
};


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var LoaderEvent_1 = __webpack_require__(4);
var FileLoader = /** @class */ (function (_super) {
    __extends(FileLoader, _super);
    function FileLoader(url) {
        var _this = _super.call(this) || this;
        _this._isLoaded = false;
        _this._url = url;
        return _this;
        // this._name = this._url.match(/([^\\/]+)\.\w+$/)[1];
    }
    Object.defineProperty(FileLoader.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileLoader.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileLoader.prototype, "loadProgress", {
        get: function () {
            return this._loadProgress;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FileLoader.prototype, "isLoaded", {
        get: function () {
            return this._isLoaded;
        },
        enumerable: true,
        configurable: true
    });
    FileLoader.prototype.load = function () {
    };
    Object.defineProperty(FileLoader.prototype, "inProgress", {
        get: function () {
            return this._loadProgress !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    FileLoader.prototype.loadProgressHandler = function (event) {
    };
    FileLoader.prototype.loadCompleteHandler = function (data) {
        this.dispatch(LoaderEvent_1.LoaderEvent.FILE_LOADED);
    };
    FileLoader.prototype.loadErrorHandler = function (event) {
    };
    return FileLoader;
}(EventDispatcher_1.EventDispatcher));
exports.FileLoader = FileLoader;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var DeviceUtils = /** @class */ (function () {
    function DeviceUtils() {
        this.data = {
            density: {
                ldpi: 0.5,
                mdpi: 0.6,
                hdpi: 0.75,
                xhdpi: 1
            },
            safeArea: {
                width: 1180,
                height: 680
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 90,
                left: 0
            },
            densityKey: "xhdpi"
        };
    }
    DeviceUtils.prototype.init = function () {
        var devicePixelRatio = window.devicePixelRatio;
        var _a = window.screen, availWidth = _a.availWidth, availHeight = _a.availHeight;
        var deviceLongSide = Math.max(availHeight, availWidth) * devicePixelRatio;
        var deviceShortSide = Math.min(availHeight, availWidth) * devicePixelRatio;
        // this.aspectRatio = this.deviceLongSide / this.deviceShortSide;
        DeviceUtils.density = this.setDensity(deviceShortSide, deviceLongSide);
        console.log("====Density ", DeviceUtils.density);
    };
    DeviceUtils.prototype.setDensity = function (deviceShortSide, deviceLongSide) {
        var _a = this.data.padding, top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
        var _b = this.data.safeArea, width = _b.width, height = _b.height;
        var density = this.data.density;
        var minScale = Math.min((deviceLongSide - left - right) / width, (deviceShortSide - top - bottom) / height);
        var densityKeys = Object.keys(density);
        var resultDensity = "";
        for (var i = 0; i < densityKeys.length; i++) {
            var densityValue = density[densityKeys[i]];
            if (densityValue >= minScale) {
                var densityIndex = Math.max(0, i - 1);
                resultDensity = densityKeys[densityIndex];
                break;
            }
            resultDensity = densityKeys[i];
        }
        return resultDensity;
    };
    DeviceUtils.density = "";
    return DeviceUtils;
}());
exports.DeviceUtils = DeviceUtils;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var SlotEvent_1 = __webpack_require__(2);
var SlotView_1 = __webpack_require__(20);
var SlotController_1 = __webpack_require__(39);
var LoadingManager_1 = __webpack_require__(14);
var locator_1 = __webpack_require__(0);
var LoaderEvent_1 = __webpack_require__(4);
var ServerEmulator_1 = __webpack_require__(13);
var SlotConfig_1 = __webpack_require__(5);
var DeviceUtils_1 = __webpack_require__(16);
var KeyboardManager_1 = __webpack_require__(46);
var SlotModel_1 = __webpack_require__(3);
var Ticker = PIXI.ticker;
var Point = PIXI.Point;
var Container = PIXI.Container;
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.prevTime = 0;
        this.fps = 60;
        this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        this.server = locator_1.get(ServerEmulator_1.ServerEmulator);
        this.loadingManager = locator_1.get(LoadingManager_1.LoadingManager);
        this.slotConfig = locator_1.get(SlotConfig_1.SlotConfig);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        this.deviceUtils = locator_1.get(DeviceUtils_1.DeviceUtils);
        var width = this.getWidth();
        var height = this.getHeight();
        this.renderer = PIXI.autoDetectRenderer(width, height);
        document.body.appendChild(this.renderer.view);
        this.drawInterval = 1000 / this.fps;
        this.stage = new Container();
        this.dispatcher.addListener(LoaderEvent_1.LoadingManagerEvent.PRELOAD_ASSETS_LOADED, this.onPreloadAssetsLoaded, this);
        this.deviceUtils.init();
        this.keyBoardManager = locator_1.get(KeyboardManager_1.KeyboardManager);
        this.loadingManager.loadJson('./dist/config.json').then(function (config) {
            _this.saveSlotConfig(config);
            _this.prepareServerAndMakeInitRequest();
        });
    }
    Main.prototype.saveSlotConfig = function (config) {
        this.slotConfig.minSlotWidth = config.minSlotWidth;
        this.slotConfig.minSlotHeight = config.minSlotHeight;
        this.slotConfig.reels = config.reels;
    };
    Main.prototype.prepareServerAndMakeInitRequest = function () {
        var _this = this;
        this.loadingManager.loadJson('./dist/emulation.json').then(function (emulationData) {
            _this.server.init(emulationData.init, emulationData.spins);
            _this.server.initRequest().then(function (initResponse) { return _this.onInitResponse(initResponse); });
        });
    };
    Main.prototype.onInitResponse = function (initResponse) {
        this.slotModel.parseServerInitResponse(initResponse);
        this.createSlotViewAndController();
        this.loadingManager.loadResources("./dist/assets.json");
    };
    Main.prototype.createSlotViewAndController = function () {
        this.slotView = new SlotView_1.SlotView(this.slotConfig.minSlotWidth, this.slotConfig.minSlotHeight);
        this.slotController = new SlotController_1.SlotController(this.slotView);
        this.slotView.pivot = new Point(0.5, 0.5);
        this.stage.addChild(this.slotView);
    };
    Main.prototype.onPreloadAssetsLoaded = function () {
        var _this = this;
        console.log("=== preload assets loaded");
        this.slotController.showLoadinScene();
        this.onResize();
        window.addEventListener("resize", function () { return _this.onResize(); }, true);
        Ticker.shared.add(this.onTickUpdate, this);
    };
    Main.prototype.onTickUpdate = function () {
        this.renderer.render(this.stage);
        var now = Date.now();
        if (this.prevTime === 0) {
            this.prevTime = now;
        }
        var deltaTime = now - this.prevTime;
        if (deltaTime > this.drawInterval) {
            this.dispatcher.dispatch(SlotEvent_1.SlotEvent.ENTER_FRAME, deltaTime);
            this.prevTime = now;
            // this.prevTime = now - deltaTime % this.drawInterval;
        }
    };
    Main.prototype.onResize = function () {
        var width = this.getWidth();
        var height = this.getHeight();
        var canvas = this.renderer.view;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        this.renderer.resize(width, height);
        this.slotView.resize(width, height);
        this.slotView.x = width / 2;
        this.slotView.y = height / 2;
    };
    Main.prototype.getWidth = function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth);
    };
    Main.prototype.getHeight = function () {
        return document.documentElement.clientHeight;
    };
    return Main;
}());
exports.Main = Main;
new Main();


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventMap = /** @class */ (function () {
    function EventMap(event, eventListener, scope) {
        this.event = event;
        this.eventListener = eventListener;
        this.scope = scope;
    }
    return EventMap;
}());
exports.EventMap = EventMap;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReelsScene_1 = __webpack_require__(21);
var Point = PIXI.Point;
var Container = PIXI.Container;
var LoadingScene_1 = __webpack_require__(37);
var SlotView = /** @class */ (function (_super) {
    __extends(SlotView, _super);
    function SlotView(minWidth, minHeight) {
        var _this = _super.call(this) || this;
        _this.minWidth = minWidth;
        _this.minHeight = minHeight;
        return _this;
    }
    SlotView.prototype.showScene = function (sceneId) {
        if (this.currentScene) {
            this.removeChild(this.currentScene);
        }
        switch (sceneId) {
            case 1 /* LOADING_SCENE */:
                this.currentScene = this.createLoadingScene();
                break;
            case 0 /* REELS_SCENE */:
                this.currentScene = this.createReelsScene();
                break;
        }
        this.currentScene.pivot = new Point(0.5, 0.5);
        this.addChild(this.currentScene);
        this.currentScene.onResize();
    };
    SlotView.prototype.createReelsScene = function () {
        return new ReelsScene_1.ReelsScene(this.minWidth, this.minHeight);
    };
    SlotView.prototype.createLoadingScene = function () {
        return new LoadingScene_1.LoadingScene(this.minWidth, this.minHeight);
    };
    SlotView.prototype.resize = function (width, height) {
        var scale = Math.min(Math.min(width, this.minWidth) / this.minWidth, Math.min(height, this.minHeight) / this.minHeight);
        this.scale.set(scale);
        this.currentScene.onResize();
    };
    return SlotView;
}(Container));
exports.SlotView = SlotView;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ReelsController_1 = __webpack_require__(22);
var UiPannel_1 = __webpack_require__(28);
var BaseScene_1 = __webpack_require__(12);
var LoaderCache_1 = __webpack_require__(6);
var locator_1 = __webpack_require__(0);
var TotemLineContainer_1 = __webpack_require__(35);
var ReelsScene = /** @class */ (function (_super) {
    __extends(ReelsScene, _super);
    function ReelsScene(minWidth, minHeight) {
        var _this = _super.call(this, minWidth, minHeight) || this;
        _this.loaderCache = locator_1.get(LoaderCache_1.LoaderCache);
        _this.sceneBack = _this.getSceneBackGraphics();
        _this.reelsContainer = new ReelsController_1.ReelsController();
        _this.reelsContainer.x = -_this.reelsContainer.width / 2;
        _this.addChild(_this.sceneBack);
        _this.addChild(_this.reelsContainer);
        _this.uiPannel = new UiPannel_1.UiPanel();
        _this.addChild(_this.uiPannel);
        _this.reelsContainer.y = -_this.reelsContainer.visibleHeight / 2 - _this.uiPannel.height / 2;
        _this.totemLineContainer = new TotemLineContainer_1.TotemLineContainer();
        _this.totemLineContainer.x = _this.reelsContainer.x;
        _this.totemLineContainer.y = _this.reelsContainer.y;
        _this.addChild(_this.totemLineContainer);
        return _this;
    }
    ReelsScene.prototype.getSceneBackGraphics = function () {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xd8d8d8);
        graphics.drawRect(-this.minWidth / 2, -this.minHeight / 2, this.minWidth, this.minHeight);
        graphics.endFill();
        return graphics;
    };
    ReelsScene.prototype.onResize = function () {
        this.uiPannel.x = -this.minWidth / 2;
        this.uiPannel.y = this.minHeight / 2 - this.uiPannel.height;
        this.uiPannel.onResize();
    };
    return ReelsScene;
}(BaseScene_1.BaseScene));
exports.ReelsScene = ReelsScene;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var Graphics = PIXI.Graphics;
var ReelView_1 = __webpack_require__(23);
var EventDispatcher_1 = __webpack_require__(1);
var ReelModel_1 = __webpack_require__(26);
var ReelController_1 = __webpack_require__(27);
var SlotEvent_1 = __webpack_require__(2);
var SlotModel_1 = __webpack_require__(3);
var locator_1 = __webpack_require__(0);
var SlotConfig_1 = __webpack_require__(5);
var ReelsController = /** @class */ (function (_super) {
    __extends(ReelsController, _super);
    function ReelsController() {
        var _this = _super.call(this) || this;
        _this.reels = [];
        _this.reelsControllers = [];
        _this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        _this.slotConfig = locator_1.get(SlotConfig_1.SlotConfig);
        _this.reelsStopped = true;
        _this.visibleHeight = 315;
        _this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        _this.reelsCount = _this.slotConfig.reels.reelsCount;
        _this.reelsGap = _this.slotConfig.reels.gapBetweenReels;
        for (var i = 0; i < _this.reelsCount; i++) {
            var reelModel = new ReelModel_1.ReelModel();
            reelModel.updateTape(_this.slotModel.tapes[i]);
            reelModel.reelIndex = i;
            var reel = new ReelView_1.ReelView(reelModel);
            reel.x = reel.width * i + _this.reelsGap * i;
            _this.reels.push(reel);
            _this.reelsControllers.push(new ReelController_1.ReelController(reel, reelModel));
            _this.addChild(reel);
        }
        _this.reelsMask = new Graphics();
        _this.reelsMask.beginFill(0x000000, 0.5);
        _this.reelsMask.drawRect(0, 0, 560, _this.visibleHeight);
        _this.reelsMask.endFill();
        _this.addChild(_this.reelsMask);
        _this.mask = _this.reelsMask;
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.ENTER_FRAME, _this.onEnterFrame, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED, _this.onServerResponse, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.STOP_CLICK, _this.onStopClicked, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.SPIN_CLICK, _this.onSpinClicked, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.HIDE_REELS, _this.onHideReels, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.SHOW_REELS, _this.onShowReels, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.UPDATE_REEL_SYMBOLS, _this.updateReelSymbols, _this);
        return _this;
    }
    ReelsController.prototype.updateReelSymbols = function (newReelSymbols) {
        this.reels.forEach(function (reel, reelIndex) {
            var reelSymbols = [];
            newReelSymbols.forEach(function (line) {
                reelSymbols.push(line[reelIndex]);
            });
            reel.changeSymbols(reelSymbols);
        });
    };
    ReelsController.prototype.onHideReels = function () {
        this.visible = false;
    };
    ReelsController.prototype.onShowReels = function () {
        this.visible = true;
    };
    ReelsController.prototype.onSpinClicked = function () {
        this.reelsStopped = false;
        this.reelsControllers.forEach(function (reelsController) { return reelsController.onSpinClicked(); });
    };
    ReelsController.prototype.onStopClicked = function () {
        this.reelsControllers.forEach(function (reelController) { return reelController.onStopClicked(); });
    };
    ReelsController.prototype.onServerResponse = function () {
        this.reelsControllers.forEach(function (reelController) { return reelController.stopOnServerResponse(); });
    };
    ReelsController.prototype.onEnterFrame = function (deltaTime) {
        var _this = this;
        var allReelsIdle = true;
        //TODO:refactor
        this.reelsControllers.forEach(function (reelController) {
            if (reelController.model.currentState !== 0 /* Idle */) {
                _this.reelsStopped = false;
                allReelsIdle = false;
            }
        });
        if (allReelsIdle && !this.reelsStopped) {
            this.reelsStopped = true;
            this.dispatcher.dispatch(SlotEvent_1.SlotEvent.REELS_STOPPED);
        }
        this.reels.forEach(function (reel) { return reel.draw(deltaTime); });
    };
    return ReelsController;
}(Container));
exports.ReelsController = ReelsController;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var SymbolView_1 = __webpack_require__(9);
var locator_1 = __webpack_require__(0);
var SlotModel_1 = __webpack_require__(3);
var SlotConfig_1 = __webpack_require__(5);
var ReelView = /** @class */ (function (_super) {
    __extends(ReelView, _super);
    function ReelView(reelModel) {
        var _this = _super.call(this) || this;
        _this.symbolsInTape = [];
        _this.spinSpeed = 0;
        _this.previousState = 0 /* Idle */;
        _this._currentTapeIndex = 0;
        _this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        _this.slotConfig = locator_1.get(SlotConfig_1.SlotConfig);
        _this.ADDITIONAL_SYMBOL_COUNT = 1;
        _this.reelModel = reelModel;
        _this.maxSpinSpeed = _this.slotConfig.reels.maxSpinSpeed;
        _this.rows = _this.slotConfig.reels.rowsCount;
        _this.verticalGap = _this.slotConfig.reels.gapBetweenRows;
        _this.init();
        return _this;
    }
    ReelView.prototype.init = function () {
        this.prepareTape();
        this.tapeHeight = this.symbolsInTape[0].y + (this.verticalGap * this.symbolsInTape.length - 1) + (this.symbolsInTape[0].height * this.symbolsInTape.length);
        this.inited = true;
    };
    ReelView.prototype.prepareTape = function () {
        this.currentTapeIndex = this.getNormalizedPosition(3 + this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex]);
        for (var i = this.rows - 1; i >= 0; i--) {
            var symbolIndex = this.reelModel.symbolsTape[this.currentTapeIndex];
            var symbol = new SymbolView_1.SymbolView(symbolIndex);
            symbol.y = symbol.symbolHeight * i + this.verticalGap * i;
            this.symbolsInTape[i] = symbol;
            this.addChild(symbol);
            this.currentTapeIndex--;
        }
    };
    ReelView.prototype.changeSymbols = function (symbols) {
        for (var i = 0; i < this.rows; i++) {
            var symbolIndex = symbols[i];
            this.symbolsInTape[i + this.ADDITIONAL_SYMBOL_COUNT].setSymbolImage(symbolIndex);
        }
    };
    ReelView.prototype.draw = function (deltaTime) {
        if (!this.inited) {
            return;
        }
        var currentState = this.reelModel.currentState;
        if (this.previousState !== currentState) {
            switch (this.reelModel.currentState) {
                case 0 /* Idle */:
                    break;
                case 1 /* StartSpin */:
                    this.startSpin();
                    break;
                case 3 /* StartStop */:
                    break;
                case 4 /* ManualStop */:
                    break;
            }
            this.previousState = currentState;
        }
        this.checkIfReadyToStop();
        this.spin(deltaTime);
    };
    ReelView.prototype.startSpin = function () {
        var _this = this;
        this.stopPositionsPrepared = false;
        this.readyToStop = false;
        this.symbolsInTape.forEach(function (symbol) { return symbol.setSymbolStopPositionIndexes(-1, -1); });
        TweenLite.killTweensOf(this);
        TweenLite.to(this, 0.5, {
            spinSpeed: this.maxSpinSpeed,
            onComplete: function () {
                if (_this.reelModel.currentState === 1 /* StartSpin */) {
                    _this.reelModel.currentState = 2 /* Spin */;
                }
            }
        });
    };
    ReelView.prototype.spin = function (deltaTime) {
        var _this = this;
        this.symbolsInTape.forEach(function (symbol) { return symbol.y += _this.spinSpeed; });
        if (this.reelModel.currentState !== 5 /* Stopping */) {
            this.updateSymbols();
        }
    };
    ReelView.prototype.updateSymbols = function () {
        var topSymbol = this.symbolsInTape[0];
        var bottomSymbol = this.symbolsInTape[this.symbolsInTape.length - 1];
        if (topSymbol.y >= -topSymbol.symbolHeight + this.verticalGap) {
            if (this.reelModel.currentState === 3 /* StartStop */) {
                var stopPosition = this.getNormalizedPosition(this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex] - 1);
                var finalBottomRowPosition = this.getNormalizedPosition(stopPosition + this.rows);
                if (!this.stopPositionsPrepared) {
                    if (this.currentTapeIndex !== finalBottomRowPosition) {
                        this.currentTapeIndex = finalBottomRowPosition;
                    }
                    this.stopPositionsPrepared = true;
                }
                else {
                    if (!this.readyToStop) {
                        if (this.currentTapeIndex === stopPosition) {
                            this.readyToStop = true;
                        }
                    }
                }
            }
            else {
                if (this.reelModel.currentState === 4 /* ManualStop */) {
                    this.readyToStop = true;
                }
            }
            this.addSymbolToTop();
        }
        if (bottomSymbol.y >= this.tapeHeight) {
            bottomSymbol.onDestroy();
            this.removeChild(bottomSymbol);
            this.symbolsInTape.pop();
        }
    };
    ReelView.prototype.changeSymbolsToStopSymbols = function () {
        var finalPosition = this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex];
        for (var i = this.rows - 1; i >= 0; i--) {
            var symbolTapePosition = finalPosition + i;
            var tapeLength = this.reelModel.symbolsTape.length;
            if (symbolTapePosition >= tapeLength) {
                symbolTapePosition -= tapeLength;
            }
            var symbolFromTape = this.reelModel.symbolsTape[symbolTapePosition];
            this.symbolsInTape[i + 1].setSymbolImage(symbolFromTape);
        }
    };
    ReelView.prototype.getNormalizedPosition = function (position) {
        var tapeLength = this.reelModel.symbolsTape.length;
        if (position >= tapeLength) {
            position -= tapeLength;
        }
        if (position < 0) {
            position += tapeLength;
        }
        return position;
    };
    ReelView.prototype.checkIfReadyToStop = function () {
        if (!this.readyToStop) {
            return;
        }
        var topVisibleSymbol = this.symbolsInTape[1];
        if (topVisibleSymbol.y >= -topVisibleSymbol.height / 2 && topVisibleSymbol.y <= 0) {
            if (this.reelModel.currentState === 4 /* ManualStop */) {
                this.changeSymbolsToStopSymbols();
            }
            this.stopSpin();
        }
    };
    ReelView.prototype.stopSpin = function () {
        var _this = this;
        TweenLite.killTweensOf(this);
        this.spinSpeed = 0;
        this.readyToStop = false;
        this.reelModel.currentState = 5 /* Stopping */;
        var topVisibleSymbol = this.symbolsInTape[1];
        var finalYShift = topVisibleSymbol.y * -1;
        this.symbolsInTape.forEach(function (symbol, index) {
            var easOutY = symbol.y + finalYShift + 20;
            var easeInY = symbol.y + finalYShift;
            symbol.setSymbolStopPositionIndexes(index - 1, _this.reelModel.reelIndex);
            TweenLite.killTweensOf(symbol);
            TweenLite.to(symbol, 0.1, {
                ease: Sine.easeOut,
                y: easOutY,
                onComplete: function () {
                    TweenLite.to(symbol, 0.2, {
                        ease: Sine.easeIn,
                        y: easeInY,
                        onComplete: function () {
                            _this.reelModel.currentState = 0 /* Idle */;
                        }
                    });
                }
            });
        });
    };
    ReelView.prototype.addSymbolToTop = function () {
        var symbolFromTape = this.reelModel.symbolsTape[this.currentTapeIndex];
        var topNonVisibleSymbol = new SymbolView_1.SymbolView(symbolFromTape);
        var topVisibleSymbolPosition = this.symbolsInTape[0].y;
        topNonVisibleSymbol.y = topVisibleSymbolPosition - this.verticalGap - topNonVisibleSymbol.symbolHeight;
        this.addChild(topNonVisibleSymbol);
        this.symbolsInTape.unshift(topNonVisibleSymbol);
        this.currentTapeIndex--;
    };
    Object.defineProperty(ReelView.prototype, "currentTapeIndex", {
        get: function () {
            if (this._currentTapeIndex < 0) {
                this._currentTapeIndex += this.reelModel.symbolsTape.length;
            }
            return this._currentTapeIndex;
        },
        set: function (value) {
            this._currentTapeIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    return ReelView;
}(Container));
exports.ReelView = ReelView;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SymbolModel = /** @class */ (function () {
    function SymbolModel() {
        this.colorMap = { 1: 0x6a7c87, 2: 0xae9d85, 3: 0x638560, 4: 0xff0000 };
    }
    return SymbolModel;
}());
exports.SymbolModel = SymbolModel;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RewardVO = /** @class */ (function () {
    function RewardVO() {
    }
    return RewardVO;
}());
exports.RewardVO = RewardVO;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReelModel = /** @class */ (function () {
    function ReelModel() {
        this.fakeSymbolsTape = [3, 1, 2, 3];
    }
    Object.defineProperty(ReelModel.prototype, "reelIndex", {
        get: function () {
            return this._reelIndex;
        },
        set: function (value) {
            this._reelIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReelModel.prototype, "currentState", {
        get: function () {
            return this._currentState;
        },
        set: function (value) {
            this._currentState = value;
        },
        enumerable: true,
        configurable: true
    });
    ReelModel.prototype.updateTape = function (tape) {
        this.symbolsTape = tape.concat();
    };
    return ReelModel;
}());
exports.ReelModel = ReelModel;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var SlotEvent_1 = __webpack_require__(2);
var SlotModel_1 = __webpack_require__(3);
var locator_1 = __webpack_require__(0);
var ReelController = /** @class */ (function () {
    function ReelController(reelView, model) {
        var _this = this;
        this.autoStopTime = 500;
        this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        this.reelView = reelView;
        this.model = model;
        this.model.currentState = 0 /* Idle */;
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.NEW_REELS_TAPES_RECEIVED, function () { return _this.model.updateTape(_this.slotModel.tapes[_this.model.reelIndex]); }, this);
    }
    ReelController.prototype.onSpinClicked = function () {
        clearTimeout(this.autoStopTimer);
        switch (this.model.currentState) {
            case 0 /* Idle */:
                this.model.currentState = 1 /* StartSpin */;
                this.dispatcher.dispatch(SlotEvent_1.SlotEvent.REELS_SPIN_STARTED);
                break;
        }
    };
    ReelController.prototype.stopOnServerResponse = function () {
        var _this = this;
        if (!this.isReelSpinning) {
            return;
        }
        clearTimeout(this.autoStopTimer);
        var stopTime = this.autoStopTime + (this.model.reelIndex * 500);
        this.autoStopTimer = setTimeout(function () { return _this.onStopClicked(true); }, stopTime);
    };
    ReelController.prototype.onStopClicked = function (auto) {
        if (auto === void 0) { auto = false; }
        if (!this.isReelSpinning) {
            return;
        }
        clearTimeout(this.autoStopTimer);
        this.stopReel(auto);
    };
    ReelController.prototype.stopReel = function (isAutoStop) {
        if (isAutoStop === void 0) { isAutoStop = false; }
        if (isAutoStop) {
            this.model.currentState = 3 /* StartStop */;
        }
        else {
            this.model.currentState = 4 /* ManualStop */;
        }
    };
    Object.defineProperty(ReelController.prototype, "isReelSpinning", {
        get: function () {
            return this.model.currentState !== 0 /* Idle */ && this.model.currentState !== 5 /* Stopping */;
        },
        enumerable: true,
        configurable: true
    });
    return ReelController;
}());
exports.ReelController = ReelController;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var Graphics = PIXI.Graphics;
var StopButton_1 = __webpack_require__(29);
var SpinButton_1 = __webpack_require__(30);
var SpinButtonMediator_1 = __webpack_require__(31);
var WinFieldView_1 = __webpack_require__(32);
var WinFieldMediator_1 = __webpack_require__(33);
var UiPanel = /** @class */ (function (_super) {
    __extends(UiPanel, _super);
    function UiPanel() {
        var _this = _super.call(this) || this;
        _this.panelHeight = 100;
        _this.panelWidth = 800;
        _this.spinButton = new SpinButton_1.SpinButton();
        _this.stopButton = new StopButton_1.StopButton();
        _this.spinButtonMediator = new SpinButtonMediator_1.SpinButtonMediator(_this.spinButton, _this.stopButton);
        _this.stopButton.y = _this.spinButton.y = _this.panelHeight / 2;
        _this.stopButton.x = _this.spinButton.x = _this.panelWidth - _this.spinButton.width;
        _this.winFieldView = new WinFieldView_1.WinFieldView();
        _this.winFieldMediator = new WinFieldMediator_1.WinFieldMediator(_this.winFieldView);
        _this.winFieldView.x = _this.panelWidth / 2;
        _this.winFieldView.y = _this.panelHeight / 2;
        var back = new Graphics();
        back.beginFill(0x706F6D, 0.5);
        back.drawRect(0, 0, _this.panelWidth, _this.panelHeight);
        back.endFill();
        _this.addChild(back);
        _this.addChild(_this.spinButton);
        _this.addChild(_this.stopButton);
        _this.addChild(_this.winFieldView);
        return _this;
    }
    UiPanel.prototype.onResize = function () {
        // this.spinButton.x = this.minWidth / 2 - this.spinButton.width / 2;
        // this.spinButton.y = this.minHeight / 2 - this.spinButton.height / 2;
    };
    return UiPanel;
}(Container));
exports.UiPanel = UiPanel;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = __webpack_require__(11);
var LoaderCache_1 = __webpack_require__(6);
var locator_1 = __webpack_require__(0);
var Sprite = PIXI.Sprite;
var Point = PIXI.Point;
var StopButton = /** @class */ (function (_super) {
    __extends(StopButton, _super);
    function StopButton() {
        var _this = _super.call(this) || this;
        _this.loaderCache = locator_1.get(LoaderCache_1.LoaderCache);
        var buttonTexture = _this.loaderCache.getTexture("spinButtonBack");
        _this.stopButtonBackImage = new Sprite(buttonTexture);
        var playIconTexture = _this.loaderCache.getTexture("stopBtnIcon");
        var stopIcon = new Sprite(playIconTexture);
        _this.stopButtonBackImage.tint = 0xec1313;
        _this.stopButtonBackImage.pivot = new Point(_this.stopButtonBackImage.width / 2, _this.stopButtonBackImage.height / 2);
        _this.addChild(_this.stopButtonBackImage);
        stopIcon.pivot = new Point(stopIcon.width / 2, stopIcon.height / 2);
        _this.addChild(stopIcon);
        return _this;
    }
    return StopButton;
}(Button_1.Button));
exports.StopButton = StopButton;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Button_1 = __webpack_require__(11);
var LoaderCache_1 = __webpack_require__(6);
var locator_1 = __webpack_require__(0);
var EventDispatcher_1 = __webpack_require__(1);
var Sprite = PIXI.Sprite;
var Point = PIXI.Point;
var SpinButton = /** @class */ (function (_super) {
    __extends(SpinButton, _super);
    function SpinButton() {
        var _this = _super.call(this) || this;
        _this.loaderCache = locator_1.get(LoaderCache_1.LoaderCache);
        _this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        var spinButtonTexture = _this.loaderCache.getTexture("spinButtonBack");
        _this.spinButtonBackImage = new Sprite(spinButtonTexture);
        var playIconTexture = _this.loaderCache.getTexture("playBtnIcon");
        var playIcon = new Sprite(playIconTexture);
        _this.spinButtonBackImage.pivot = new Point(_this.spinButtonBackImage.width / 2, _this.spinButtonBackImage.height / 2);
        _this.addChild(_this.spinButtonBackImage);
        playIcon.pivot = new Point(playIcon.width / 2.3, playIcon.height / 2);
        _this.addChild(playIcon);
        return _this;
    }
    SpinButton.prototype.disable = function () {
        _super.prototype.disable.call(this);
        this.spinButtonBackImage.tint = 0xC0C0C0;
    };
    SpinButton.prototype.enable = function () {
        _super.prototype.enable.call(this);
        this.spinButtonBackImage.tint = 0x228B22;
    };
    return SpinButton;
}(Button_1.Button));
exports.SpinButton = SpinButton;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var SlotEvent_1 = __webpack_require__(2);
var SlotModel_1 = __webpack_require__(3);
var locator_1 = __webpack_require__(0);
var SpinButtonMediator = /** @class */ (function () {
    function SpinButtonMediator(spinButton, stopButton) {
        this.spinButton = spinButton;
        this.stopButton = stopButton;
        this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        this.spinButton.on('pointerdown', this.onSpinClick, this);
        this.stopButton.on('pointerdown', this.onStopClick, this);
        this.dispatcher.addListener(SlotEvent_1.KeyBoardEvent.SPACE_DOWN, this.onSpacePressed, this);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.SLOT_STATE_CHANGED, this.onSlotStateChanged, this);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.SLOT_STATE_CHANGED, this.onSlotStateChanged, this);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED, this.onServerResponse, this);
        this.disableStop();
        this.enableSpin();
    }
    SpinButtonMediator.prototype.enableSpin = function () {
        this.spinButton.enable();
    };
    SpinButtonMediator.prototype.disableSpin = function () {
        this.spinButton.disable();
    };
    SpinButtonMediator.prototype.enableStop = function () {
        this.stopButton.enable();
        this.stopButton.visible = true;
    };
    SpinButtonMediator.prototype.disableStop = function () {
        this.stopButton.disable();
        this.stopButton.visible = false;
    };
    SpinButtonMediator.prototype.onSpinClick = function () {
        this.disableSpin();
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.SPIN_CLICK);
    };
    SpinButtonMediator.prototype.onServerResponse = function () {
        this.enableStop();
    };
    SpinButtonMediator.prototype.onSlotStateChanged = function () {
        if (this.slotModel.state === 0 /* Idle */ || this.slotModel.state === 2 /* ShowWin */) {
            this.disableStop();
            this.enableSpin();
        }
        /*  if (this.slotModel.state === SlotState.ShowWin) {
              this.disableStop();
          }*/
    };
    SpinButtonMediator.prototype.onSpacePressed = function () {
        if (this.spinButton.isEnabled()) {
            this.onSpinClick();
        }
        if (this.stopButton.isEnabled()) {
            this.onStopClick();
        }
    };
    SpinButtonMediator.prototype.onStopClick = function () {
        this.disableStop();
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.STOP_CLICK);
    };
    return SpinButtonMediator;
}());
exports.SpinButtonMediator = SpinButtonMediator;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var Text = PIXI.Text;
var WinFieldView = /** @class */ (function (_super) {
    __extends(WinFieldView, _super);
    function WinFieldView() {
        var _this = _super.call(this) || this;
        _this.idleText = "Good Luck!";
        var style = new PIXI.TextStyle({
            align: 'center',
            fill: '#ffda28',
            fontFamily: 'Arial',
            fontSize: 50,
            fontWeight: 'bold'
        });
        _this.text = new Text("00.00");
        _this.text.style = style;
        _this.text.x = -_this.text.width / 2;
        _this.text.y -= _this.text.height / 2;
        _this.addChild(_this.text);
        return _this;
    }
    WinFieldView.prototype.showTotalWin = function (totalWin) {
        this.text.text = totalWin.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        this.align();
    };
    WinFieldView.prototype.showIdleLabel = function () {
        this.text.text = this.idleText;
        this.align();
    };
    WinFieldView.prototype.align = function () {
        this.text.x = -this.text.width / 2;
    };
    return WinFieldView;
}(Container));
exports.WinFieldView = WinFieldView;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var locator_1 = __webpack_require__(0);
var RewardsEvents_1 = __webpack_require__(34);
var SlotEvent_1 = __webpack_require__(2);
var WinFieldMediator = /** @class */ (function () {
    function WinFieldMediator(view) {
        this.view = view;
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        this.visibleValue = 0;
        this.totalWinToShow = 0;
        this.view.showIdleLabel();
        this.dispatcher.addListener(RewardsEvents_1.RewardsEvents.SHOW_TOTAL_WIN, this.showTotalWin, this);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.REELS_SPIN_STARTED, this.onReelsSpinStarted, this);
    }
    WinFieldMediator.prototype.onReelsSpinStarted = function () {
        var _this = this;
        TweenLite.killTweensOf(this);
        if (this.totalWinToShow > 0) {
            this.view.showTotalWin(this.totalWinToShow);
        }
        setTimeout(function () { return _this.view.showIdleLabel(); }, 500);
        this.totalWinToShow = 0;
    };
    WinFieldMediator.prototype.showTotalWin = function (totalWin) {
        var _this = this;
        this.totalWinToShow = totalWin;
        this.visibleValue = 0;
        TweenLite.killTweensOf(this);
        TweenLite.to(this, 1, {
            visibleValue: totalWin,
            onUpdate: function () {
                _this.view.showTotalWin(_this.visibleValue);
            },
            onComplete: function () {
            }
        });
    };
    return WinFieldMediator;
}());
exports.WinFieldMediator = WinFieldMediator;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardsEvents = {
    SHOW_TOTAL_WIN: "RewardsEvents.SHOW_TOTAL_WIN"
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SlotEvent_1 = __webpack_require__(2);
var locator_1 = __webpack_require__(0);
var EventDispatcher_1 = __webpack_require__(1);
var SlotModel_1 = __webpack_require__(3);
var SlotConfig_1 = __webpack_require__(5);
var TotemLineView_1 = __webpack_require__(36);
var SymbolView_1 = __webpack_require__(9);
var Container = PIXI.Container;
var TotemLineContainer = /** @class */ (function (_super) {
    __extends(TotemLineContainer, _super);
    function TotemLineContainer() {
        var _this = _super.call(this) || this;
        _this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        _this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        _this.slotConfig = locator_1.get(SlotConfig_1.SlotConfig);
        _this.totemLines = [];
        _this.totemSymbolID = 4;
        _this.finalSymbolsView = [];
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.REELS_STOPPED, _this.onReelsStopped, _this);
        _this.dispatcher.addListener(SlotEvent_1.SlotEvent.REELS_SPIN_STARTED, _this.onReelsStarted, _this);
        return _this;
    }
    TotemLineContainer.prototype.onReelsStarted = function () {
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.SHOW_REELS);
        while (this.children.length) {
            this.removeChildAt(0);
        }
    };
    TotemLineContainer.prototype.onReelsStopped = function () {
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.HIDE_REELS);
        this.prepareLines();
        // first element is start reel index
        // then line indexes ordered from left to right ( last one it the most right - to which we will move)
        var linesToMove = this.getLineIndexToMove();
        this.moveLines(linesToMove);
    };
    TotemLineContainer.prototype.moveLines = function (lineIndexesToMove) {
        var _this = this;
        var startReelIndex = lineIndexesToMove.splice(0, 1)[0];
        // [1,0,2]
        for (var i = 0; i < lineIndexesToMove.length; i++) {
            var lineIndex = lineIndexesToMove[i];
            var tilesToMove = startReelIndex + ((lineIndexesToMove.length - 1) - i);
            var tileWidth = this.slotConfig.reels.symbolWidth + this.slotConfig.reels.gapBetweenReels;
            for (var j = 0; j < tilesToMove; j++) {
                TweenLite.to(this.totemLines[lineIndex], 1.5, {
                    ease: Elastic.easeInOut,
                    x: (j + 1) * tileWidth,
                    delay: (i + j) * 1.5,
                    onComplete: function () {
                    }
                });
            }
            for (var i_1 = 0; i_1 < tilesToMove; i_1++) {
                this.finalSymbolsView[lineIndex].splice(startReelIndex + i_1, 0, null);
                this.finalSymbolsView[lineIndex].pop();
            }
        }
        this.finalSymbolsView.forEach(function (line, index) {
            return _this.finalSymbolsView[index] = _this.finalSymbolsView[index].splice(-_this.slotConfig.reels.reelsCount);
        });
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.UPDATE_REEL_SYMBOLS, this.finalSymbolsView);
    };
    TotemLineContainer.prototype.prepareLines = function () {
        var graphics = new PIXI.Graphics();
        var reelsCount = this.slotConfig.reels.reelsCount;
        var gap = this.slotConfig.reels.gapBetweenReels;
        var maskWidth = reelsCount * this.slotConfig.reels.symbolWidth + (reelsCount - 1) * gap;
        graphics.beginFill(0xFF3300);
        graphics.moveTo(0, -50);
        graphics.lineTo(maskWidth, 0);
        graphics.lineTo(maskWidth, 500);
        graphics.lineTo(0, 500);
        graphics.lineTo(0, 0);
        graphics.endFill();
        this.addChild(graphics);
        this.mask = graphics;
        this.totemLines = [];
        for (var i = 0; i < this.slotConfig.reels.rowsCount; i++) {
            var totemLineView = new TotemLineView_1.TotemLineView();
            this.finalSymbolsView[i] = [];
            for (var j = -3; j < this.slotConfig.reels.reelsCount; j++) {
                var additionalSymbols = [1, 2, 3];
                var randomSymbolIndex = Math.floor(Math.random() * additionalSymbols.length);
                var stopPosition = this.slotModel.getStopReelsPosition()[j];
                var symbolId = void 0;
                if (j < 0) {
                    symbolId = additionalSymbols[randomSymbolIndex];
                }
                else {
                    symbolId = this.slotModel.tapes[j][stopPosition + i];
                }
                var symbolView = new SymbolView_1.SymbolView(symbolId);
                this.finalSymbolsView[i].push(symbolId);
                symbolView.x = symbolView.width * j + this.slotConfig.reels.gapBetweenReels * j;
                totemLineView.addChild(symbolView);
            }
            totemLineView.y = totemLineView.height * i + this.slotConfig.reels.gapBetweenRows * i;
            this.addChild(totemLineView);
            this.totemLines.push(totemLineView);
        }
        console.log(this.finalSymbolsView);
    };
    TotemLineContainer.prototype.getLineIndexToMove = function () {
        var longestSequence = [];
        var startReel;
        for (var i = 0; i < this.slotConfig.reels.reelsCount - 1; i++) {
            var totemIndexes = [];
            var totemIndexOnCurrentReels = this.getTotemLineIndexOnReel(i);
            if (totemIndexOnCurrentReels !== -1) {
                totemIndexes.push(totemIndexOnCurrentReels);
                totemIndexes = this.getTotemIndexesSequence(i, totemIndexes.concat());
                if (totemIndexes.length >= longestSequence.length) {
                    longestSequence = totemIndexes.concat();
                    startReel = i;
                }
            }
        }
        longestSequence.unshift(startReel);
        return longestSequence;
    };
    TotemLineContainer.prototype.getTotemIndexesSequence = function (reelIndex, totemIndexes) {
        var _this = this;
        var nextReelIndex = reelIndex + 1;
        totemIndexes.forEach(function (lineIndex) {
            if (nextReelIndex < _this.slotConfig.reels.reelsCount - 1) {
                var totemIndexOnNexReel = _this.getTotemLineIndexOnReel(nextReelIndex);
                if (totemIndexOnNexReel !== -1 && Math.abs(lineIndex - totemIndexOnNexReel) === 1) {
                    totemIndexes.push(totemIndexOnNexReel);
                }
                _this.getTotemIndexesSequence(nextReelIndex, totemIndexes);
            }
        });
        return totemIndexes;
    };
    TotemLineContainer.prototype.getTotemLineIndexOnReel = function (reelIndex) {
        var stopPosition = this.slotModel.getStopReelsPosition()[reelIndex];
        var reelSymbols = this.slotModel.tapes[reelIndex];
        var stoppedSymbols = reelSymbols.slice(stopPosition, stopPosition + this.slotConfig.reels.rowsCount + 1);
        var totemSymbolLineIndex = stoppedSymbols.indexOf(this.totemSymbolID);
        return totemSymbolLineIndex;
    };
    return TotemLineContainer;
}(Container));
exports.TotemLineContainer = TotemLineContainer;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var TotemLineView = /** @class */ (function (_super) {
    __extends(TotemLineView, _super);
    function TotemLineView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TotemLineView.prototype.addSymbolToLine = function (symbol) {
    };
    return TotemLineView;
}(Container));
exports.TotemLineView = TotemLineView;


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var BaseScene_1 = __webpack_require__(12);
var LoadingBar_1 = __webpack_require__(38);
var Point = PIXI.Point;
var EventDispatcher_1 = __webpack_require__(1);
var locator_1 = __webpack_require__(0);
var LoaderEvent_1 = __webpack_require__(4);
var LoadingScene = /** @class */ (function (_super) {
    __extends(LoadingScene, _super);
    function LoadingScene(minWidth, minHeight) {
        var _this = _super.call(this, minWidth, minHeight) || this;
        _this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        var sceneBack = _this.getSceneBackGraphics();
        _this.addChild(sceneBack);
        _this.progressBar = new LoadingBar_1.LoadingBar();
        _this.progressBar.pivot = new Point(0.5, 0.5);
        _this.addChild(_this.progressBar);
        _this.dispatcher.addListener(LoaderEvent_1.LoadingManagerEvent.MAIN_ASSETS_LOAD_PROGRESS, function (percent) {
            _this.progressBar.showProgress(percent);
        });
        return _this;
    }
    LoadingScene.prototype.getSceneBackGraphics = function () {
        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xccFFcc);
        graphics.drawRect(-this.minWidth / 2, -this.minHeight / 2, this.minWidth, this.minHeight);
        graphics.endFill();
        return graphics;
    };
    return LoadingScene;
}(BaseScene_1.BaseScene));
exports.LoadingScene = LoadingScene;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Container = PIXI.Container;
var LoadingBar = /** @class */ (function (_super) {
    __extends(LoadingBar, _super);
    function LoadingBar() {
        var _this = _super.call(this) || this;
        _this.barWidth = 100;
        _this.barHeight = 20;
        _this.bar = new PIXI.Graphics();
        _this.bar.beginFill(0xFF65cc);
        _this.bar.drawRect(-_this.barWidth / 2, -_this.barHeight / 2, _this.barWidth, _this.barHeight);
        _this.bar.endFill();
        _this.bar.width = 0;
        _this.addChild(_this.bar);
        return _this;
    }
    LoadingBar.prototype.showProgress = function (loadedPercent) {
        var toWidth = this.barWidth / (100 / loadedPercent);
        TweenLite.to(this.bar, 0.1, {
            width: toWidth
        });
    };
    return LoadingBar;
}(Container));
exports.LoadingBar = LoadingBar;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var SlotEvent_1 = __webpack_require__(2);
var ServerEmulator_1 = __webpack_require__(13);
var SlotModel_1 = __webpack_require__(3);
var locator_1 = __webpack_require__(0);
var RewardsModel_1 = __webpack_require__(7);
var RewardsManager_1 = __webpack_require__(40);
var LoaderEvent_1 = __webpack_require__(4);
var SlotController = /** @class */ (function () {
    function SlotController(view) {
        var _this = this;
        this.view = view;
        this.server = locator_1.get(ServerEmulator_1.ServerEmulator);
        this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        this.rewardsModel = locator_1.get(RewardsModel_1.RewardsModel);
        this.rewardsManager = locator_1.get(RewardsManager_1.RewardsManager);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        this.dispatcher.addListener(LoaderEvent_1.LoadingManagerEvent.MAIN_ASSETS_LOADED, function () { return _this.onMainAssetsLoaded(); });
    }
    SlotController.prototype.onSpinClicked = function () {
        var _this = this;
        this.rewardsManager.cancelShowWinnings();
        this.slotModel.state = 1 /* Spin */;
        this.server.spinRequest().then(function (serverResponse) { return _this.handleServerSpinResponse(serverResponse); });
    };
    SlotController.prototype.onReelsStopped = function () {
        if (this.rewardsModel.totalWin > 0) {
            this.slotModel.state = 2 /* ShowWin */;
            this.rewardsManager.showWinnings();
        }
        this.slotModel.state = 0 /* Idle */;
    };
    SlotController.prototype.handleServerSpinResponse = function (serverResponse) {
        this.slotModel.parseServerSpinResponse(serverResponse);
        this.dispatcher.dispatch(SlotEvent_1.SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED);
    };
    SlotController.prototype.showLoadinScene = function () {
        this.view.showScene(1 /* LOADING_SCENE */);
    };
    SlotController.prototype.onMainAssetsLoaded = function () {
        this.view.showScene(0 /* REELS_SCENE */);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.SPIN_CLICK, this.onSpinClicked, this);
        this.dispatcher.addListener(SlotEvent_1.SlotEvent.REELS_STOPPED, this.onReelsStopped, this);
    };
    return SlotController;
}());
exports.SlotController = SlotController;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RewardsModel_1 = __webpack_require__(7);
var locator_1 = __webpack_require__(0);
var EventDispatcher_1 = __webpack_require__(1);
var SymbolEvents_1 = __webpack_require__(10);
var SlotModel_1 = __webpack_require__(3);
var RewardsManager = /** @class */ (function () {
    function RewardsManager() {
        this.rewardsModel = locator_1.get(RewardsModel_1.RewardsModel);
        this.slotModel = locator_1.get(SlotModel_1.SlotModel);
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
    }
    RewardsManager.prototype.showWinnings = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.mainResolve = resolve;
            // this.dispatcher.dispatch(RewardsEvents.SHOW_TOTAL_WIN, this.rewardsModel.totalWin);
            // this.dispatcher.addListener(SymbolEvents.BLINK_COMPLETE, this.onBlinkComplete, this);
            // this.dispatchWinningsDisplayEvent(SymbolEvents.BLINK);
            resolve();
        });
    };
    RewardsManager.prototype.cancelShowWinnings = function () {
        this.dispatchWinningsDisplayEvent(SymbolEvents_1.SymbolEvents.STOP_BLINK);
    };
    RewardsManager.prototype.dispatchWinningsDisplayEvent = function (event) {
        var _this = this;
        if (!this.rewardsModel.rewards) {
            return;
        }
        this.rewardsModel.rewards.forEach(function (rewardVO) {
            var winLine = _this.slotModel.lines[rewardVO.lineId];
            winLine.forEach(function (rowIndex, columnIndex) {
                _this.dispatcher.dispatch(event, {
                    columnIndex: columnIndex,
                    rowIndex: rowIndex
                });
            });
        });
    };
    RewardsManager.prototype.onBlinkComplete = function () {
        this.dispatcher.removeListener(SymbolEvents_1.SymbolEvents.BLINK_COMPLETE, this.onBlinkComplete, this);
        this.mainResolve();
    };
    return RewardsManager;
}());
exports.RewardsManager = RewardsManager;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SoundLoader_1 = __webpack_require__(42);
var EventDispatcher_1 = __webpack_require__(1);
var LoaderEvent_1 = __webpack_require__(4);
var ImageLoader_1 = __webpack_require__(45);
var LoadingManager_1 = __webpack_require__(14);
var DeviceUtils_1 = __webpack_require__(16);
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loadingQueue = [];
        return _this;
    }
    Loader.prototype.startLoading = function () {
        if (this.isLoading) {
            return;
        }
        this.totalFilesToLoadCount = this.loadingQueue.length;
        this.hasLoaded = false;
        this.isLoading = true;
        // this.updateProgress();
        if (this.loadingQueue.length) {
            this.loadNexFileInQueue();
        }
        else {
            this.completeLoading();
        }
    };
    Loader.prototype.addAsset = function (asset) {
        switch (asset.type) {
            case LoadingManager_1.FileType.Sound:
                this.addSound(asset.id, asset.url);
                break;
            case LoadingManager_1.FileType.Image:
            case LoadingManager_1.FileType.Atlas:
                this.addImage(asset.id, asset.url);
                break;
        }
    };
    Loader.prototype.addSound = function (id, url) {
        var soundLoader = this.getSoundLoaderByUrl(url);
        if (!soundLoader) {
            this.loadingQueue.push(new SoundLoader_1.SoundLoader(id, url));
        }
        else {
            soundLoader.addId(id);
        }
    };
    Loader.prototype.addImage = function (id, url) {
        url = url.replace("{dpi}", DeviceUtils_1.DeviceUtils.density);
        this.loadingQueue.push(new ImageLoader_1.ImageLoader(id, url));
    };
    Loader.prototype.getSoundLoaderByUrl = function (url) {
        return this.loadingQueue.filter(function (fileLoader) { return fileLoader.url === url; })[0];
    };
    //TODO: load one by one, try load all together
    Loader.prototype.loadNexFileInQueue = function () {
        if (this.loadingQueue.length) {
            this.currentFileInProgress = this.loadingQueue.shift();
            this.currentFileInProgress.addListener(LoaderEvent_1.LoaderEvent.FILE_LOADED, this.onFileLoaded, this);
            this.currentFileInProgress.load();
        }
    };
    Loader.prototype.onFileLoaded = function (url) {
        this.currentFileInProgress.removeListener(LoaderEvent_1.LoaderEvent.FILE_LOADED, this.onFileLoaded, this);
        this.dispatch(LoaderEvent_1.LoaderEvent.FILE_LOADED);
        if (!this.loadingQueue.length) {
            this.completeLoading();
        }
        else {
            this.loadNexFileInQueue();
        }
    };
    Loader.prototype.completeLoading = function () {
        this.isLoading = false;
        this.hasLoaded = true;
        this.dispatch(LoaderEvent_1.LoaderEvent.ALL_FILES_LOADED);
    };
    Loader.prototype.totalFilesCount = function () {
        return this.totalFilesToLoadCount;
    };
    Loader.prototype.filesLeftCount = function () {
        return this.loadingQueue.length;
    };
    return Loader;
}(EventDispatcher_1.EventDispatcher));
exports.Loader = Loader;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FileLoader_1 = __webpack_require__(15);
var SoundManager_1 = __webpack_require__(43);
var locator_1 = __webpack_require__(0);
var Sound_1 = __webpack_require__(44);
var SoundLoader = /** @class */ (function (_super) {
    __extends(SoundLoader, _super);
    function SoundLoader(id, url) {
        var _this = _super.call(this, url) || this;
        _this.soundManager = locator_1.get(SoundManager_1.SoundManager);
        _this.LOAD_EVENT_NAME = "load";
        _this.LOAD_EVENT_ID = 1;
        _this.LOAD_ERROR_EVENT_NAME = "loaderror";
        _this.LOAD_ERROR_EVENT_ID = 2;
        _this.idList = [id];
        return _this;
    }
    SoundLoader.prototype.addId = function (id) {
        this.idList.push(id);
    };
    SoundLoader.prototype.load = function () {
        var _this = this;
        this.sound = new Howl({ src: [this.getSoundUrl(this._url, "ogg"), this.getSoundUrl(this._url, "mp3")] });
        this.sound.on(this.LOAD_EVENT_NAME, function () { return _this.loadCompleteHandler(); }, this.LOAD_EVENT_ID);
        this.sound.on(this.LOAD_ERROR_EVENT_NAME, function () { return _this.loadErrorHandler("sound " + _this.idList[0]); }, this.LOAD_ERROR_EVENT_ID);
    };
    SoundLoader.prototype.loadCompleteHandler = function (event) {
        for (var _i = 0, _a = this.idList; _i < _a.length; _i++) {
            var id = _a[_i];
            this.soundManager.setSound(id, new Sound_1.Sound(this.sound));
        }
        _super.prototype.loadCompleteHandler.call(this);
    };
    SoundLoader.prototype.resetLoader = function () {
        this.sound.off(this.LOAD_EVENT_NAME, null, this.LOAD_EVENT_ID);
        this.sound.on(this.LOAD_ERROR_EVENT_NAME, null, this.LOAD_ERROR_EVENT_ID); //TODO: Howler doesn't remove event by function
    };
    SoundLoader.prototype.getSoundUrl = function (src, extension) {
        return src.replace("{type}", extension);
    };
    return SoundLoader;
}(FileLoader_1.FileLoader));
exports.SoundLoader = SoundLoader;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var List_1 = __webpack_require__(8);
var SoundManager = /** @class */ (function () {
    function SoundManager() {
        this.sounds = new List_1.List();
        //TODO: integration
        /*this.dispatcher.addListener(DOMEventType.VISIBILITY_CHANGED, hidden => this.setSoundsMuted(hidden));
        this.dispatcher.addListener(SoundManagerEvent.MUTE, isMuted => this.setSoundsMuted(isMuted));
        */
    }
    SoundManager.prototype.setSound = function (soundId, sound) {
        this.sounds[soundId] = sound;
        // this.dispatcher.dispatch(SoundManagerEvent.SOUND_LOADED, soundId); // integration
    };
    SoundManager.prototype.getSound = function (soundId) {
        return this.sounds[soundId];
    };
    SoundManager.prototype.isSoundAvailable = function (soundId) {
        var sound = this.getSound(soundId);
        return !!sound;
    };
    SoundManager.prototype.isSoundPlaying = function (soundId) {
        var result = false;
        if (this.isSoundAvailable(soundId)) {
            result = this.getSound(soundId).isPlaying();
        }
        return result;
    };
    //waitForLoadAndPlay - if you need to wait for the sound to be loaded and then play
    SoundManager.prototype.playSound = function (soundId, loop, waitForLoadAndPlay, useNativeLoop) {
        if (loop === void 0) { loop = 0; }
        if (waitForLoadAndPlay === void 0) { waitForLoadAndPlay = false; }
        if (useNativeLoop === void 0) { useNativeLoop = false; }
        var sound = this.getSound(soundId);
        if (sound) {
            sound.play(loop);
        }
        else {
            console.log("There is no such sound or it is not loaded yet. " + soundId);
        }
    };
    //numLoops == 0 - infinitive loop
    /* public playSoundInstance(soundId: string, numLoops: number = 1, onCompleted: () => void = null): SoundInstance {
         const sound = this.getSound(soundId);

         if (sound) {
             if (sound.loaded) {
                 return sound.playInstance(numLoops, onCompleted);
             } else {
                 console.log(`This sound is not loaded yet: ${sound.id}`);
             }
         } else {
             console.log(`There is no such sound registered. constantId: ${soundId}`);
         }
         return null;
     }*/
    SoundManager.prototype.stopSound = function (soundId) {
        var sound = this.getSound(soundId);
        if (sound) {
            sound.stop();
        }
        else {
            console.log("There is no such sound registered. constantId: " + soundId);
        }
    };
    SoundManager.prototype.setSoundsVolume = function (volume) {
        Howler.volume(volume);
    };
    SoundManager.prototype.setSoundsMuted = function (isMuted) {
        Howler.mute(isMuted);
    };
    SoundManager.prototype.setSoundVolume = function (soundId, volume) {
        var sound = this.getSound(soundId);
        if (sound) {
            sound.volume = volume;
        }
    };
    SoundManager.prototype.muteSound = function (soundId) {
        var sound = this.getSound(soundId);
        if (sound) {
            sound.mute();
        }
    };
    SoundManager.prototype.unMuteSound = function (soundId) {
        var sound = this.getSound(soundId);
        if (sound) {
            sound.unMute();
        }
    };
    return SoundManager;
}());
exports.SoundManager = SoundManager;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Sound = /** @class */ (function () {
    function Sound(instance) {
        this.instance = instance;
    }
    Sound.prototype.play = function (loop) {
        if (loop === void 0) { loop = 0; }
        if (loop !== 0) {
            if (loop > 0) {
                this.instance.loop(true, loop);
            }
            else {
                this.instance.loop(true);
            }
        }
        this.instance.play();
    };
    /*public playInstance(numLoops: number = 1, onCompleted: () => void): SoundInstance {
        return new SoundInstance(this.id, this.getSoundConfig(), numLoops, onCompleted);
    }*/
    Sound.prototype.stop = function () {
        this.instance.stop();
    };
    Sound.prototype.isPlaying = function () {
        return this.instance.playing();
    };
    Object.defineProperty(Sound.prototype, "loaded", {
        get: function () {
            return this.instance.state() === "loaded";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sound.prototype, "volume", {
        get: function () {
            return this.instance.volume();
        },
        set: function (value) {
            this.instance.volume(value);
        },
        enumerable: true,
        configurable: true
    });
    Sound.prototype.mute = function () {
        this.instance.mute(true);
    };
    Sound.prototype.unMute = function () {
        this.instance.mute(false);
    };
    Sound.prototype.pause = function () {
        this.instance.pause();
    };
    Sound.prototype.resume = function () {
        this.instance.play();
    };
    return Sound;
}());
exports.Sound = Sound;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var FileLoader_1 = __webpack_require__(15);
var LoaderCache_1 = __webpack_require__(6);
var locator_1 = __webpack_require__(0);
var ImageLoader = /** @class */ (function (_super) {
    __extends(ImageLoader, _super);
    function ImageLoader(id, url) {
        var _this = _super.call(this, url) || this;
        _this.id = id;
        _this.loaderCache = locator_1.get(LoaderCache_1.LoaderCache);
        return _this;
    }
    ImageLoader.prototype.load = function () {
        if (this.inProgress || this.isLoaded) {
            return;
        }
        this._isLoaded = false;
        // this._loadError = undefined;
        // this._loadProgress = undefined;
        this.loader = new PIXI.loaders.Loader();
        this.loader.once("complete", this.imageLoaded, this);
        this.loader.once("error", this.loadErrorHandler, this);
        this.loader.on("progress", this.loadProgressHandler, this);
        this.loader.add(this.id, this._url);
        this.loader.load();
    };
    ImageLoader.prototype.imageLoaded = function (loader, resources) {
        var texture = resources[this.id].texture;
        var textures = resources[this.id].textures;
        if (texture) {
            this.addTextureToCache(this.id, texture);
        }
        if (textures) {
            for (var t in textures) {
                if (textures.hasOwnProperty(t)) {
                    var textureId = textures[t].textureCacheIds[0].replace(".png", "");
                    this.addTextureToCache(textureId, textures[t]);
                }
            }
        }
        _super.prototype.loadCompleteHandler.call(this);
    };
    ImageLoader.prototype.addTextureToCache = function (id, texture) {
        this.loaderCache.addTexture(id, texture);
        PIXI.Texture.removeFromCache(this._url);
    };
    ImageLoader.prototype.resetLoader = function () {
        this.loader.removeAllListeners("complete");
        this.loader.removeAllListeners("error");
        this.loader.removeAllListeners("progress");
        this.loader.reset();
    };
    ImageLoader.prototype.loadProgressHandler = function (event) {
        _super.prototype.loadProgressHandler.call(this, { loaded: event.progress / 100 });
    };
    return ImageLoader;
}(FileLoader_1.FileLoader));
exports.ImageLoader = ImageLoader;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventDispatcher_1 = __webpack_require__(1);
var locator_1 = __webpack_require__(0);
var SlotEvent_1 = __webpack_require__(2);
var KeyboardManager = /** @class */ (function () {
    function KeyboardManager() {
        var _this = this;
        this.dispatcher = locator_1.get(EventDispatcher_1.EventDispatcher);
        addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    }
    KeyboardManager.prototype.onKeyDown = function (e) {
        if (e.keyCode === 32) {
            this.dispatcher.dispatch(SlotEvent_1.KeyBoardEvent.SPACE_DOWN);
        }
    };
    KeyboardManager.prototype.onKeyUp = function (e) {
        if (e.keyCode === 32) {
            this.dispatcher.dispatch(SlotEvent_1.KeyBoardEvent.SPACE_UP);
        }
    };
    return KeyboardManager;
}());
exports.KeyboardManager = KeyboardManager;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map