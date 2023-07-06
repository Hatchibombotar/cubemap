"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cubemap = exports.defaultCubemapOptions = void 0;
require("./index.css");
exports.defaultCubemapOptions = {
    width: 500,
    height: 500,
    perspective: 300,
    background_color: "black",
    min_pitch: -90,
    max_pitch: 90,
    rotate_type: "drag",
    drag_speed: 0.25,
    rotate_speed: 3
};
var Directions;
(function (Directions) {
    Directions[Directions["FRONT"] = 0] = "FRONT";
    Directions[Directions["RIGHT"] = 1] = "RIGHT";
    Directions[Directions["BACK"] = 2] = "BACK";
    Directions[Directions["LEFT"] = 3] = "LEFT";
    Directions[Directions["TOP"] = 4] = "TOP";
    Directions[Directions["BOTTOM"] = 5] = "BOTTOM";
})(Directions || (Directions = {}));
var Cubemap = /** @class */ (function () {
    function Cubemap(container, images, providedOptions) {
        if (providedOptions === void 0) { providedOptions = {}; }
        var _this = this;
        var options = __assign(__assign({}, exports.defaultCubemapOptions), providedOptions);
        this.options = options;
        this.pitch = 0;
        this.yaw = 0;
        this.perspective = options.perspective;
        this.box_size = 1024;
        this.border_margin = 1;
        this.images = images;
        var parent = container;
        var root = document.createElement("div");
        this.root = root;
        root.className = "cubemap";
        parent.appendChild(root);
        if (typeof options.width == "number") {
            root.style.width = options.width + "px";
        }
        else {
            root.style.width = options.width;
        }
        if (typeof options.height == "number") {
            root.style.height = options.height + "px";
        }
        else {
            root.style.height = options.height;
        }
        root.style.backgroundColor = options.background_color;
        root.style.position = "relative";
        root.style.overflow = "hidden";
        var last_pos = [0, 0];
        var ondown = function (e) {
            if (e.type == "touchstart") {
                document.addEventListener("touchmove", onmove);
                document.addEventListener("touchend", onup);
            }
            else {
                document.body.addEventListener("mousemove", onmove);
                document.body.addEventListener("mouseup", onup);
            }
            var rect = root.getClientRects()[0];
            // @ts-ignore
            last_pos = [e.pageX - rect.left, e.pageY - rect.top];
            e.stopPropagation();
            e.preventDefault();
            return false;
        };
        var onmove = function (e) {
            var rect = _this.root.getClientRects()[0];
            // @ts-ignore
            var x = e.pageX - rect.left;
            // @ts-ignore
            var y = e.pageY - rect.top;
            var deltax = x - last_pos[0];
            var deltay = y - last_pos[1];
            _this.yaw -= deltax * options.drag_speed;
            _this.pitch += deltay * options.drag_speed;
            if (options.min_pitch && _this.pitch < options.min_pitch)
                _this.pitch = options.min_pitch;
            if (options.max_pitch && _this.pitch > options.max_pitch)
                _this.pitch = options.max_pitch;
            _this.update();
            last_pos = [x, y];
            e.stopPropagation();
            e.preventDefault();
            return false;
        };
        var onup = function (e) {
            document.body.removeEventListener("mousemove", onmove);
            document.body.removeEventListener("mouseup", onup);
            document.body.removeEventListener("touchmove", onmove);
            document.body.removeEventListener("touchend", onup);
            e.stopPropagation();
            e.preventDefault();
            return false;
        };
        if (options.rotate_type == "drag") {
            root.addEventListener("mousedown", ondown);
            root.addEventListener("touchstart", ondown);
        }
        var center = document.createElement("div");
        center.className = "cubemapcenter";
        root.appendChild(center);
        center.style.transformStyle = "preserve-3d";
        center.style.width = "100%";
        center.style.height = "100%";
        this.center = center;
        if (options.rotate_type == "drag") {
            root.style.cursor = "grab";
        }
        else if (options.rotate_type == "auto") {
            center.classList.add("spin-3d-y");
            this.center.style.setProperty('--spin-time', 360 / options.rotate_speed + "s");
        }
        this.load();
        this.update();
    }
    Cubemap.prototype.load = function () {
        var _a;
        var _this = this;
        var halfsize = (this.box_size * 0.5 - this.border_margin).toFixed(1);
        var transformations = (_a = {},
            _a[Directions.FRONT] = "translateZ(-".concat(halfsize, "px) rotateY(0deg)"),
            _a[Directions.LEFT] = "translateX(-".concat(halfsize, "px) rotateY(90deg)"),
            _a[Directions.RIGHT] = "translateX(".concat(halfsize, "px) rotateY(-90deg)"),
            _a[Directions.TOP] = "translateY(-".concat(halfsize, "px) rotateX(-90deg)"),
            _a[Directions.BOTTOM] = "translateY(".concat(halfsize, "px) rotateX(90deg)"),
            _a[Directions.BACK] = "translateZ(".concat(halfsize, "px) rotateY(-180deg)"),
            _a);
        var _loop_1 = function (face) {
            var url = this_1.images[face];
            var element = document.createElement("div");
            element.className = "cubemapface " + face + "face";
            this_1.center.appendChild(element);
            var transform = transformations[face];
            element.style.position = "absolute";
            element.style.left = "0";
            element.style.top = "0";
            element.style.width = this_1.box_size + "px";
            element.style.height = this_1.box_size + "px";
            element.style.transform = transform;
            // create image
            var img = new Image();
            img.src = url;
            img.onload = function () {
                img.width = _this.box_size;
                img.height = _this.box_size;
            };
            element.appendChild(img);
        };
        var this_1 = this;
        for (var _i = 0, _b = [
            Directions.FRONT, Directions.LEFT, Directions.RIGHT, Directions.TOP, Directions.BOTTOM, Directions.BACK
        ]; _i < _b.length; _i++) {
            var face = _b[_i];
            _loop_1(face);
        }
    };
    Cubemap.prototype.update = function () {
        var perspective = this.perspective;
        var distance = perspective;
        if (typeof perspective == "number") {
            this.root.style.perspective = perspective.toFixed(0) + "px";
        }
        else {
            this.root.style.perspective = perspective;
        }
        var rect = this.root.getClientRects()[0];
        var offsetX = (rect.width - this.box_size) * 0.5;
        var offsetY = (rect.height - this.box_size) * 0.5;
        if (this.options.rotate_type == "drag") {
            this.center.style.transform = "translateZ(" + distance + "px) rotateX(" + this.pitch.toFixed(1) + "deg) rotateY(" + this.yaw.toFixed(1) + "deg) translateX(" + offsetX + "px) translateY(" + offsetY + "px)";
        }
        else if (this.options.rotate_type == "auto") {
            this.center.style.setProperty('--offset-z', distance + "px");
            this.center.style.setProperty('--offset-x', offsetX + "px");
            this.center.style.setProperty('--offset-y', offsetY.toFixed(1) + "px");
            // this.center.style.transform = "translateZ(" + distance + "px) translateX(" + offsetX + "px) translateY(" + offsetY + "px)"
        }
    };
    return Cubemap;
}());
exports.Cubemap = Cubemap;
