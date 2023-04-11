/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 498:
/***/ (function(__unused_webpack_module, exports) {

/*! Tweakpane 3.1.7 (c) 2016 cocopon, licensed under the MIT license. */
(function (global, factory) {
     true ? factory(exports) :
    0;
})(this, (function (exports) { 'use strict';

    /***
     * A simple semantic versioning perser.
     */
    class Semver {
        /**
         * @hidden
         */
        constructor(text) {
            const [core, prerelease] = text.split('-');
            const coreComps = core.split('.');
            this.major = parseInt(coreComps[0], 10);
            this.minor = parseInt(coreComps[1], 10);
            this.patch = parseInt(coreComps[2], 10);
            this.prerelease = prerelease !== null && prerelease !== void 0 ? prerelease : null;
        }
        toString() {
            const core = [this.major, this.minor, this.patch].join('.');
            return this.prerelease !== null ? [core, this.prerelease].join('-') : core;
        }
    }

    class BladeApi {
        constructor(controller) {
            this.controller_ = controller;
        }
        get element() {
            return this.controller_.view.element;
        }
        get disabled() {
            return this.controller_.viewProps.get('disabled');
        }
        set disabled(disabled) {
            this.controller_.viewProps.set('disabled', disabled);
        }
        get hidden() {
            return this.controller_.viewProps.get('hidden');
        }
        set hidden(hidden) {
            this.controller_.viewProps.set('hidden', hidden);
        }
        dispose() {
            this.controller_.viewProps.set('disposed', true);
        }
    }

    class TpEvent {
        constructor(target) {
            this.target = target;
        }
    }
    class TpChangeEvent extends TpEvent {
        constructor(target, value, presetKey, last) {
            super(target);
            this.value = value;
            this.presetKey = presetKey;
            this.last = last !== null && last !== void 0 ? last : true;
        }
    }
    class TpUpdateEvent extends TpEvent {
        constructor(target, value, presetKey) {
            super(target);
            this.value = value;
            this.presetKey = presetKey;
        }
    }
    class TpFoldEvent extends TpEvent {
        constructor(target, expanded) {
            super(target);
            this.expanded = expanded;
        }
    }
    class TpTabSelectEvent extends TpEvent {
        constructor(target, index) {
            super(target);
            this.index = index;
        }
    }

    function forceCast(v) {
        return v;
    }
    function isEmpty(value) {
        return value === null || value === undefined;
    }
    function deepEqualsArray(a1, a2) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (let i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }
    function isPropertyWritable(obj, key) {
        let target = obj;
        do {
            const d = Object.getOwnPropertyDescriptor(target, key);
            if (d && (d.set !== undefined || d.writable === true)) {
                return true;
            }
            target = Object.getPrototypeOf(target);
        } while (target !== null);
        return false;
    }

    const CREATE_MESSAGE_MAP = {
        alreadydisposed: () => 'View has been already disposed',
        invalidparams: (context) => `Invalid parameters for '${context.name}'`,
        nomatchingcontroller: (context) => `No matching controller for '${context.key}'`,
        nomatchingview: (context) => `No matching view for '${JSON.stringify(context.params)}'`,
        notbindable: () => `Value is not bindable`,
        propertynotfound: (context) => `Property '${context.name}' not found`,
        shouldneverhappen: () => 'This error should never happen',
    };
    class TpError {
        static alreadyDisposed() {
            return new TpError({ type: 'alreadydisposed' });
        }
        static notBindable() {
            return new TpError({
                type: 'notbindable',
            });
        }
        static propertyNotFound(name) {
            return new TpError({
                type: 'propertynotfound',
                context: {
                    name: name,
                },
            });
        }
        static shouldNeverHappen() {
            return new TpError({ type: 'shouldneverhappen' });
        }
        constructor(config) {
            var _a;
            this.message =
                (_a = CREATE_MESSAGE_MAP[config.type](forceCast(config.context))) !== null && _a !== void 0 ? _a : 'Unexpected error';
            this.name = this.constructor.name;
            this.stack = new Error(this.message).stack;
            this.type = config.type;
        }
    }

    class BindingTarget {
        constructor(obj, key, opt_id) {
            this.obj_ = obj;
            this.key_ = key;
            this.presetKey_ = opt_id !== null && opt_id !== void 0 ? opt_id : key;
        }
        static isBindable(obj) {
            if (obj === null) {
                return false;
            }
            if (typeof obj !== 'object') {
                return false;
            }
            return true;
        }
        get key() {
            return this.key_;
        }
        get presetKey() {
            return this.presetKey_;
        }
        read() {
            return this.obj_[this.key_];
        }
        write(value) {
            this.obj_[this.key_] = value;
        }
        writeProperty(name, value) {
            const valueObj = this.read();
            if (!BindingTarget.isBindable(valueObj)) {
                throw TpError.notBindable();
            }
            if (!(name in valueObj)) {
                throw TpError.propertyNotFound(name);
            }
            valueObj[name] = value;
        }
    }

    class ButtonApi extends BladeApi {
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get title() {
            var _a;
            return (_a = this.controller_.valueController.props.get('title')) !== null && _a !== void 0 ? _a : '';
        }
        set title(title) {
            this.controller_.valueController.props.set('title', title);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            const emitter = this.controller_.valueController.emitter;
            emitter.on(eventName, () => {
                bh(new TpEvent(this));
            });
            return this;
        }
    }

    class Emitter {
        constructor() {
            this.observers_ = {};
        }
        on(eventName, handler) {
            let observers = this.observers_[eventName];
            if (!observers) {
                observers = this.observers_[eventName] = [];
            }
            observers.push({
                handler: handler,
            });
            return this;
        }
        off(eventName, handler) {
            const observers = this.observers_[eventName];
            if (observers) {
                this.observers_[eventName] = observers.filter((observer) => {
                    return observer.handler !== handler;
                });
            }
            return this;
        }
        emit(eventName, event) {
            const observers = this.observers_[eventName];
            if (!observers) {
                return;
            }
            observers.forEach((observer) => {
                observer.handler(event);
            });
        }
    }

    const PREFIX = 'tp';
    function ClassName(viewName) {
        const fn = (opt_elementName, opt_modifier) => {
            return [
                PREFIX,
                '-',
                viewName,
                'v',
                opt_elementName ? `_${opt_elementName}` : '',
                opt_modifier ? `-${opt_modifier}` : '',
            ].join('');
        };
        return fn;
    }

    function compose(h1, h2) {
        return (input) => h2(h1(input));
    }
    function extractValue(ev) {
        return ev.rawValue;
    }
    function bindValue(value, applyValue) {
        value.emitter.on('change', compose(extractValue, applyValue));
        applyValue(value.rawValue);
    }
    function bindValueMap(valueMap, key, applyValue) {
        bindValue(valueMap.value(key), applyValue);
    }

    function applyClass(elem, className, active) {
        if (active) {
            elem.classList.add(className);
        }
        else {
            elem.classList.remove(className);
        }
    }
    function valueToClassName(elem, className) {
        return (value) => {
            applyClass(elem, className, value);
        };
    }
    function bindValueToTextContent(value, elem) {
        bindValue(value, (text) => {
            elem.textContent = text !== null && text !== void 0 ? text : '';
        });
    }

    const className$q = ClassName('btn');
    class ButtonView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$q());
            config.viewProps.bindClassModifiers(this.element);
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$q('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$q('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
        }
    }

    class ButtonController {
        constructor(doc, config) {
            this.emitter = new Emitter();
            this.onClick_ = this.onClick_.bind(this);
            this.props = config.props;
            this.viewProps = config.viewProps;
            this.view = new ButtonView(doc, {
                props: this.props,
                viewProps: this.viewProps,
            });
            this.view.buttonElement.addEventListener('click', this.onClick_);
        }
        onClick_() {
            this.emitter.emit('click', {
                sender: this,
            });
        }
    }

    class BoundValue {
        constructor(initialValue, config) {
            var _a;
            this.constraint_ = config === null || config === void 0 ? void 0 : config.constraint;
            this.equals_ = (_a = config === null || config === void 0 ? void 0 : config.equals) !== null && _a !== void 0 ? _a : ((v1, v2) => v1 === v2);
            this.emitter = new Emitter();
            this.rawValue_ = initialValue;
        }
        get constraint() {
            return this.constraint_;
        }
        get rawValue() {
            return this.rawValue_;
        }
        set rawValue(rawValue) {
            this.setRawValue(rawValue, {
                forceEmit: false,
                last: true,
            });
        }
        setRawValue(rawValue, options) {
            const opts = options !== null && options !== void 0 ? options : {
                forceEmit: false,
                last: true,
            };
            const constrainedValue = this.constraint_
                ? this.constraint_.constrain(rawValue)
                : rawValue;
            const prevValue = this.rawValue_;
            const changed = !this.equals_(prevValue, constrainedValue);
            if (!changed && !opts.forceEmit) {
                return;
            }
            this.emitter.emit('beforechange', {
                sender: this,
            });
            this.rawValue_ = constrainedValue;
            this.emitter.emit('change', {
                options: opts,
                previousRawValue: prevValue,
                rawValue: constrainedValue,
                sender: this,
            });
        }
    }

    class PrimitiveValue {
        constructor(initialValue) {
            this.emitter = new Emitter();
            this.value_ = initialValue;
        }
        get rawValue() {
            return this.value_;
        }
        set rawValue(value) {
            this.setRawValue(value, {
                forceEmit: false,
                last: true,
            });
        }
        setRawValue(value, options) {
            const opts = options !== null && options !== void 0 ? options : {
                forceEmit: false,
                last: true,
            };
            const prevValue = this.value_;
            if (prevValue === value && !opts.forceEmit) {
                return;
            }
            this.emitter.emit('beforechange', {
                sender: this,
            });
            this.value_ = value;
            this.emitter.emit('change', {
                options: opts,
                previousRawValue: prevValue,
                rawValue: this.value_,
                sender: this,
            });
        }
    }

    function createValue(initialValue, config) {
        const constraint = config === null || config === void 0 ? void 0 : config.constraint;
        const equals = config === null || config === void 0 ? void 0 : config.equals;
        if (!constraint && !equals) {
            return new PrimitiveValue(initialValue);
        }
        return new BoundValue(initialValue, config);
    }

    class ValueMap {
        constructor(valueMap) {
            this.emitter = new Emitter();
            this.valMap_ = valueMap;
            for (const key in this.valMap_) {
                const v = this.valMap_[key];
                v.emitter.on('change', () => {
                    this.emitter.emit('change', {
                        key: key,
                        sender: this,
                    });
                });
            }
        }
        static createCore(initialValue) {
            const keys = Object.keys(initialValue);
            return keys.reduce((o, key) => {
                return Object.assign(o, {
                    [key]: createValue(initialValue[key]),
                });
            }, {});
        }
        static fromObject(initialValue) {
            const core = this.createCore(initialValue);
            return new ValueMap(core);
        }
        get(key) {
            return this.valMap_[key].rawValue;
        }
        set(key, value) {
            this.valMap_[key].rawValue = value;
        }
        value(key) {
            return this.valMap_[key];
        }
    }

    function parseObject(value, keyToParserMap) {
        const keys = Object.keys(keyToParserMap);
        const result = keys.reduce((tmp, key) => {
            if (tmp === undefined) {
                return undefined;
            }
            const parser = keyToParserMap[key];
            const result = parser(value[key]);
            return result.succeeded
                ? Object.assign(Object.assign({}, tmp), { [key]: result.value }) : undefined;
        }, {});
        return forceCast(result);
    }
    function parseArray(value, parseItem) {
        return value.reduce((tmp, item) => {
            if (tmp === undefined) {
                return undefined;
            }
            const result = parseItem(item);
            if (!result.succeeded || result.value === undefined) {
                return undefined;
            }
            return [...tmp, result.value];
        }, []);
    }
    function isObject(value) {
        if (value === null) {
            return false;
        }
        return typeof value === 'object';
    }
    function createParamsParserBuilder(parse) {
        return (optional) => (v) => {
            if (!optional && v === undefined) {
                return {
                    succeeded: false,
                    value: undefined,
                };
            }
            if (optional && v === undefined) {
                return {
                    succeeded: true,
                    value: undefined,
                };
            }
            const result = parse(v);
            return result !== undefined
                ? {
                    succeeded: true,
                    value: result,
                }
                : {
                    succeeded: false,
                    value: undefined,
                };
        };
    }
    function createParamsParserBuilders(optional) {
        return {
            custom: (parse) => createParamsParserBuilder(parse)(optional),
            boolean: createParamsParserBuilder((v) => typeof v === 'boolean' ? v : undefined)(optional),
            number: createParamsParserBuilder((v) => typeof v === 'number' ? v : undefined)(optional),
            string: createParamsParserBuilder((v) => typeof v === 'string' ? v : undefined)(optional),
            function: createParamsParserBuilder((v) =>
            typeof v === 'function' ? v : undefined)(optional),
            constant: (value) => createParamsParserBuilder((v) => (v === value ? value : undefined))(optional),
            raw: createParamsParserBuilder((v) => v)(optional),
            object: (keyToParserMap) => createParamsParserBuilder((v) => {
                if (!isObject(v)) {
                    return undefined;
                }
                return parseObject(v, keyToParserMap);
            })(optional),
            array: (itemParser) => createParamsParserBuilder((v) => {
                if (!Array.isArray(v)) {
                    return undefined;
                }
                return parseArray(v, itemParser);
            })(optional),
        };
    }
    const ParamsParsers = {
        optional: createParamsParserBuilders(true),
        required: createParamsParserBuilders(false),
    };
    function parseParams(value, keyToParserMap) {
        const result = ParamsParsers.required.object(keyToParserMap)(value);
        return result.succeeded ? result.value : undefined;
    }

    function warnMissing(info) {
        console.warn([
            `Missing '${info.key}' of ${info.target} in ${info.place}.`,
            'Please rebuild plugins with the latest core package.',
        ].join(' '));
    }

    function disposeElement(elem) {
        if (elem && elem.parentElement) {
            elem.parentElement.removeChild(elem);
        }
        return null;
    }

    class ReadonlyValue {
        constructor(value) {
            this.value_ = value;
        }
        static create(value) {
            return [
                new ReadonlyValue(value),
                (rawValue, options) => {
                    value.setRawValue(rawValue, options);
                },
            ];
        }
        get emitter() {
            return this.value_.emitter;
        }
        get rawValue() {
            return this.value_.rawValue;
        }
    }

    const className$p = ClassName('');
    function valueToModifier(elem, modifier) {
        return valueToClassName(elem, className$p(undefined, modifier));
    }
    class ViewProps extends ValueMap {
        constructor(valueMap) {
            var _a;
            super(valueMap);
            this.onDisabledChange_ = this.onDisabledChange_.bind(this);
            this.onParentChange_ = this.onParentChange_.bind(this);
            this.onParentGlobalDisabledChange_ =
                this.onParentGlobalDisabledChange_.bind(this);
            [this.globalDisabled_, this.setGlobalDisabled_] = ReadonlyValue.create(createValue(this.getGlobalDisabled_()));
            this.value('disabled').emitter.on('change', this.onDisabledChange_);
            this.value('parent').emitter.on('change', this.onParentChange_);
            (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
        }
        static create(opt_initialValue) {
            var _a, _b, _c;
            const initialValue = opt_initialValue !== null && opt_initialValue !== void 0 ? opt_initialValue : {};
            return new ViewProps(ValueMap.createCore({
                disabled: (_a = initialValue.disabled) !== null && _a !== void 0 ? _a : false,
                disposed: false,
                hidden: (_b = initialValue.hidden) !== null && _b !== void 0 ? _b : false,
                parent: (_c = initialValue.parent) !== null && _c !== void 0 ? _c : null,
            }));
        }
        get globalDisabled() {
            return this.globalDisabled_;
        }
        bindClassModifiers(elem) {
            bindValue(this.globalDisabled_, valueToModifier(elem, 'disabled'));
            bindValueMap(this, 'hidden', valueToModifier(elem, 'hidden'));
        }
        bindDisabled(target) {
            bindValue(this.globalDisabled_, (disabled) => {
                target.disabled = disabled;
            });
        }
        bindTabIndex(elem) {
            bindValue(this.globalDisabled_, (disabled) => {
                elem.tabIndex = disabled ? -1 : 0;
            });
        }
        handleDispose(callback) {
            this.value('disposed').emitter.on('change', (disposed) => {
                if (disposed) {
                    callback();
                }
            });
        }
        getGlobalDisabled_() {
            const parent = this.get('parent');
            const parentDisabled = parent ? parent.globalDisabled.rawValue : false;
            return parentDisabled || this.get('disabled');
        }
        updateGlobalDisabled_() {
            this.setGlobalDisabled_(this.getGlobalDisabled_());
        }
        onDisabledChange_() {
            this.updateGlobalDisabled_();
        }
        onParentGlobalDisabledChange_() {
            this.updateGlobalDisabled_();
        }
        onParentChange_(ev) {
            var _a;
            const prevParent = ev.previousRawValue;
            prevParent === null || prevParent === void 0 ? void 0 : prevParent.globalDisabled.emitter.off('change', this.onParentGlobalDisabledChange_);
            (_a = this.get('parent')) === null || _a === void 0 ? void 0 : _a.globalDisabled.emitter.on('change', this.onParentGlobalDisabledChange_);
            this.updateGlobalDisabled_();
        }
    }

    function getAllBladePositions() {
        return ['veryfirst', 'first', 'last', 'verylast'];
    }

    const className$o = ClassName('');
    const POS_TO_CLASS_NAME_MAP = {
        veryfirst: 'vfst',
        first: 'fst',
        last: 'lst',
        verylast: 'vlst',
    };
    class BladeController {
        constructor(config) {
            this.parent_ = null;
            this.blade = config.blade;
            this.view = config.view;
            this.viewProps = config.viewProps;
            const elem = this.view.element;
            this.blade.value('positions').emitter.on('change', () => {
                getAllBladePositions().forEach((pos) => {
                    elem.classList.remove(className$o(undefined, POS_TO_CLASS_NAME_MAP[pos]));
                });
                this.blade.get('positions').forEach((pos) => {
                    elem.classList.add(className$o(undefined, POS_TO_CLASS_NAME_MAP[pos]));
                });
            });
            this.viewProps.handleDispose(() => {
                disposeElement(elem);
            });
        }
        get parent() {
            return this.parent_;
        }
        set parent(parent) {
            this.parent_ = parent;
            if (!('parent' in this.viewProps.valMap_)) {
                warnMissing({
                    key: 'parent',
                    target: ViewProps.name,
                    place: 'BladeController.parent',
                });
                return;
            }
            this.viewProps.set('parent', this.parent_ ? this.parent_.viewProps : null);
        }
    }

    const SVG_NS = 'http://www.w3.org/2000/svg';
    function forceReflow(element) {
        element.offsetHeight;
    }
    function disableTransitionTemporarily(element, callback) {
        const t = element.style.transition;
        element.style.transition = 'none';
        callback();
        element.style.transition = t;
    }
    function supportsTouch(doc) {
        return doc.ontouchstart !== undefined;
    }
    function getGlobalObject() {
        return globalThis;
    }
    function getWindowDocument() {
        const globalObj = forceCast(getGlobalObject());
        return globalObj.document;
    }
    function getCanvasContext(canvasElement) {
        const win = canvasElement.ownerDocument.defaultView;
        if (!win) {
            return null;
        }
        const isBrowser = 'document' in win;
        return isBrowser
            ? canvasElement.getContext('2d', {
                willReadFrequently: true,
            })
            : null;
    }
    const ICON_ID_TO_INNER_HTML_MAP = {
        check: '<path d="M2 8l4 4l8 -8"/>',
        dropdown: '<path d="M5 7h6l-3 3 z"/>',
        p2dpad: '<path d="M8 4v8"/><path d="M4 8h8"/><circle cx="12" cy="12" r="1.2"/>',
    };
    function createSvgIconElement(document, iconId) {
        const elem = document.createElementNS(SVG_NS, 'svg');
        elem.innerHTML = ICON_ID_TO_INNER_HTML_MAP[iconId];
        return elem;
    }
    function insertElementAt(parentElement, element, index) {
        parentElement.insertBefore(element, parentElement.children[index]);
    }
    function removeElement(element) {
        if (element.parentElement) {
            element.parentElement.removeChild(element);
        }
    }
    function removeChildElements(element) {
        while (element.children.length > 0) {
            element.removeChild(element.children[0]);
        }
    }
    function removeChildNodes(element) {
        while (element.childNodes.length > 0) {
            element.removeChild(element.childNodes[0]);
        }
    }
    function findNextTarget(ev) {
        if (ev.relatedTarget) {
            return forceCast(ev.relatedTarget);
        }
        if ('explicitOriginalTarget' in ev) {
            return ev.explicitOriginalTarget;
        }
        return null;
    }

    const className$n = ClassName('lbl');
    function createLabelNode(doc, label) {
        const frag = doc.createDocumentFragment();
        const lineNodes = label.split('\n').map((line) => {
            return doc.createTextNode(line);
        });
        lineNodes.forEach((lineNode, index) => {
            if (index > 0) {
                frag.appendChild(doc.createElement('br'));
            }
            frag.appendChild(lineNode);
        });
        return frag;
    }
    class LabelView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$n());
            config.viewProps.bindClassModifiers(this.element);
            const labelElem = doc.createElement('div');
            labelElem.classList.add(className$n('l'));
            bindValueMap(config.props, 'label', (value) => {
                if (isEmpty(value)) {
                    this.element.classList.add(className$n(undefined, 'nol'));
                }
                else {
                    this.element.classList.remove(className$n(undefined, 'nol'));
                    removeChildNodes(labelElem);
                    labelElem.appendChild(createLabelNode(doc, value));
                }
            });
            this.element.appendChild(labelElem);
            this.labelElement = labelElem;
            const valueElem = doc.createElement('div');
            valueElem.classList.add(className$n('v'));
            this.element.appendChild(valueElem);
            this.valueElement = valueElem;
        }
    }

    class LabelController extends BladeController {
        constructor(doc, config) {
            const viewProps = config.valueController.viewProps;
            super(Object.assign(Object.assign({}, config), { view: new LabelView(doc, {
                    props: config.props,
                    viewProps: viewProps,
                }), viewProps: viewProps }));
            this.props = config.props;
            this.valueController = config.valueController;
            this.view.valueElement.appendChild(this.valueController.view.element);
        }
    }

    const ButtonBladePlugin = {
        id: 'button',
        type: 'blade',
        accept(params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                title: p.required.string,
                view: p.required.constant('button'),
                label: p.optional.string,
            });
            return result ? { params: result } : null;
        },
        controller(args) {
            return new LabelController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label,
                }),
                valueController: new ButtonController(args.document, {
                    props: ValueMap.fromObject({
                        title: args.params.title,
                    }),
                    viewProps: args.viewProps,
                }),
            });
        },
        api(args) {
            if (!(args.controller instanceof LabelController)) {
                return null;
            }
            if (!(args.controller.valueController instanceof ButtonController)) {
                return null;
            }
            return new ButtonApi(args.controller);
        },
    };

    class ValueBladeController extends BladeController {
        constructor(config) {
            super(config);
            this.value = config.value;
        }
    }

    function createBlade() {
        return new ValueMap({
            positions: createValue([], {
                equals: deepEqualsArray,
            }),
        });
    }

    class Foldable extends ValueMap {
        constructor(valueMap) {
            super(valueMap);
        }
        static create(expanded) {
            const coreObj = {
                completed: true,
                expanded: expanded,
                expandedHeight: null,
                shouldFixHeight: false,
                temporaryExpanded: null,
            };
            const core = ValueMap.createCore(coreObj);
            return new Foldable(core);
        }
        get styleExpanded() {
            var _a;
            return (_a = this.get('temporaryExpanded')) !== null && _a !== void 0 ? _a : this.get('expanded');
        }
        get styleHeight() {
            if (!this.styleExpanded) {
                return '0';
            }
            const exHeight = this.get('expandedHeight');
            if (this.get('shouldFixHeight') && !isEmpty(exHeight)) {
                return `${exHeight}px`;
            }
            return 'auto';
        }
        bindExpandedClass(elem, expandedClassName) {
            const onExpand = () => {
                const expanded = this.styleExpanded;
                if (expanded) {
                    elem.classList.add(expandedClassName);
                }
                else {
                    elem.classList.remove(expandedClassName);
                }
            };
            bindValueMap(this, 'expanded', onExpand);
            bindValueMap(this, 'temporaryExpanded', onExpand);
        }
        cleanUpTransition() {
            this.set('shouldFixHeight', false);
            this.set('expandedHeight', null);
            this.set('completed', true);
        }
    }
    function computeExpandedFolderHeight(folder, containerElement) {
        let height = 0;
        disableTransitionTemporarily(containerElement, () => {
            folder.set('expandedHeight', null);
            folder.set('temporaryExpanded', true);
            forceReflow(containerElement);
            height = containerElement.clientHeight;
            folder.set('temporaryExpanded', null);
            forceReflow(containerElement);
        });
        return height;
    }
    function applyHeight(foldable, elem) {
        elem.style.height = foldable.styleHeight;
    }
    function bindFoldable(foldable, elem) {
        foldable.value('expanded').emitter.on('beforechange', () => {
            foldable.set('completed', false);
            if (isEmpty(foldable.get('expandedHeight'))) {
                const h = computeExpandedFolderHeight(foldable, elem);
                if (h > 0) {
                    foldable.set('expandedHeight', h);
                }
            }
            foldable.set('shouldFixHeight', true);
            forceReflow(elem);
        });
        foldable.emitter.on('change', () => {
            applyHeight(foldable, elem);
        });
        applyHeight(foldable, elem);
        elem.addEventListener('transitionend', (ev) => {
            if (ev.propertyName !== 'height') {
                return;
            }
            foldable.cleanUpTransition();
        });
    }

    class RackLikeApi extends BladeApi {
        constructor(controller, rackApi) {
            super(controller);
            this.rackApi_ = rackApi;
        }
    }

    function addButtonAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({}, params), { view: 'button' }));
    }
    function addFolderAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({}, params), { view: 'folder' }));
    }
    function addSeparatorAsBlade(api, opt_params) {
        const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
        return api.addBlade(Object.assign(Object.assign({}, params), { view: 'separator' }));
    }
    function addTabAsBlade(api, params) {
        return api.addBlade(Object.assign(Object.assign({}, params), { view: 'tab' }));
    }

    class NestedOrderedSet {
        constructor(extract) {
            this.emitter = new Emitter();
            this.items_ = [];
            this.cache_ = new Set();
            this.onSubListAdd_ = this.onSubListAdd_.bind(this);
            this.onSubListRemove_ = this.onSubListRemove_.bind(this);
            this.extract_ = extract;
        }
        get items() {
            return this.items_;
        }
        allItems() {
            return Array.from(this.cache_);
        }
        find(callback) {
            for (const item of this.allItems()) {
                if (callback(item)) {
                    return item;
                }
            }
            return null;
        }
        includes(item) {
            return this.cache_.has(item);
        }
        add(item, opt_index) {
            if (this.includes(item)) {
                throw TpError.shouldNeverHappen();
            }
            const index = opt_index !== undefined ? opt_index : this.items_.length;
            this.items_.splice(index, 0, item);
            this.cache_.add(item);
            const subList = this.extract_(item);
            if (subList) {
                subList.emitter.on('add', this.onSubListAdd_);
                subList.emitter.on('remove', this.onSubListRemove_);
                subList.allItems().forEach((item) => {
                    this.cache_.add(item);
                });
            }
            this.emitter.emit('add', {
                index: index,
                item: item,
                root: this,
                target: this,
            });
        }
        remove(item) {
            const index = this.items_.indexOf(item);
            if (index < 0) {
                return;
            }
            this.items_.splice(index, 1);
            this.cache_.delete(item);
            const subList = this.extract_(item);
            if (subList) {
                subList.emitter.off('add', this.onSubListAdd_);
                subList.emitter.off('remove', this.onSubListRemove_);
            }
            this.emitter.emit('remove', {
                index: index,
                item: item,
                root: this,
                target: this,
            });
        }
        onSubListAdd_(ev) {
            this.cache_.add(ev.item);
            this.emitter.emit('add', {
                index: ev.index,
                item: ev.item,
                root: this,
                target: ev.target,
            });
        }
        onSubListRemove_(ev) {
            this.cache_.delete(ev.item);
            this.emitter.emit('remove', {
                index: ev.index,
                item: ev.item,
                root: this,
                target: ev.target,
            });
        }
    }

    class InputBindingApi extends BladeApi {
        constructor(controller) {
            super(controller);
            this.onBindingChange_ = this.onBindingChange_.bind(this);
            this.emitter_ = new Emitter();
            this.controller_.binding.emitter.on('change', this.onBindingChange_);
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
        refresh() {
            this.controller_.binding.read();
        }
        onBindingChange_(ev) {
            const value = ev.sender.target.read();
            this.emitter_.emit('change', {
                event: new TpChangeEvent(this, forceCast(value), this.controller_.binding.target.presetKey, ev.options.last),
            });
        }
    }

    class InputBindingController extends LabelController {
        constructor(doc, config) {
            super(doc, config);
            this.binding = config.binding;
        }
    }

    class MonitorBindingApi extends BladeApi {
        constructor(controller) {
            super(controller);
            this.onBindingUpdate_ = this.onBindingUpdate_.bind(this);
            this.emitter_ = new Emitter();
            this.controller_.binding.emitter.on('update', this.onBindingUpdate_);
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
        refresh() {
            this.controller_.binding.read();
        }
        onBindingUpdate_(ev) {
            const value = ev.sender.target.read();
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(this, forceCast(value), this.controller_.binding.target.presetKey),
            });
        }
    }

    class MonitorBindingController extends LabelController {
        constructor(doc, config) {
            super(doc, config);
            this.binding = config.binding;
            this.viewProps.bindDisabled(this.binding.ticker);
            this.viewProps.handleDispose(() => {
                this.binding.dispose();
            });
        }
    }

    function findSubBladeApiSet(api) {
        if (api instanceof RackApi) {
            return api['apiSet_'];
        }
        if (api instanceof RackLikeApi) {
            return api['rackApi_']['apiSet_'];
        }
        return null;
    }
    function getApiByController(apiSet, controller) {
        const api = apiSet.find((api) => api.controller_ === controller);
        if (!api) {
            throw TpError.shouldNeverHappen();
        }
        return api;
    }
    function createBindingTarget(obj, key, opt_id) {
        if (!BindingTarget.isBindable(obj)) {
            throw TpError.notBindable();
        }
        return new BindingTarget(obj, key, opt_id);
    }
    class RackApi extends BladeApi {
        constructor(controller, pool) {
            super(controller);
            this.onRackAdd_ = this.onRackAdd_.bind(this);
            this.onRackRemove_ = this.onRackRemove_.bind(this);
            this.onRackInputChange_ = this.onRackInputChange_.bind(this);
            this.onRackMonitorUpdate_ = this.onRackMonitorUpdate_.bind(this);
            this.emitter_ = new Emitter();
            this.apiSet_ = new NestedOrderedSet(findSubBladeApiSet);
            this.pool_ = pool;
            const rack = this.controller_.rack;
            rack.emitter.on('add', this.onRackAdd_);
            rack.emitter.on('remove', this.onRackRemove_);
            rack.emitter.on('inputchange', this.onRackInputChange_);
            rack.emitter.on('monitorupdate', this.onRackMonitorUpdate_);
            rack.children.forEach((bc) => {
                this.setUpApi_(bc);
            });
        }
        get children() {
            return this.controller_.rack.children.map((bc) => getApiByController(this.apiSet_, bc));
        }
        addInput(object, key, opt_params) {
            const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createInput(doc, createBindingTarget(object, key, params.presetKey), params);
            const api = new InputBindingApi(bc);
            return this.add(api, params.index);
        }
        addMonitor(object, key, opt_params) {
            const params = opt_params !== null && opt_params !== void 0 ? opt_params : {};
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createMonitor(doc, createBindingTarget(object, key), params);
            const api = new MonitorBindingApi(bc);
            return forceCast(this.add(api, params.index));
        }
        addFolder(params) {
            return addFolderAsBlade(this, params);
        }
        addButton(params) {
            return addButtonAsBlade(this, params);
        }
        addSeparator(opt_params) {
            return addSeparatorAsBlade(this, opt_params);
        }
        addTab(params) {
            return addTabAsBlade(this, params);
        }
        add(api, opt_index) {
            this.controller_.rack.add(api.controller_, opt_index);
            const gapi = this.apiSet_.find((a) => a.controller_ === api.controller_);
            if (gapi) {
                this.apiSet_.remove(gapi);
            }
            this.apiSet_.add(api);
            return api;
        }
        remove(api) {
            this.controller_.rack.remove(api.controller_);
        }
        addBlade(params) {
            const doc = this.controller_.view.element.ownerDocument;
            const bc = this.pool_.createBlade(doc, params);
            const api = this.pool_.createBladeApi(bc);
            return this.add(api, params.index);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
        setUpApi_(bc) {
            const api = this.apiSet_.find((api) => api.controller_ === bc);
            if (!api) {
                this.apiSet_.add(this.pool_.createBladeApi(bc));
            }
        }
        onRackAdd_(ev) {
            this.setUpApi_(ev.bladeController);
        }
        onRackRemove_(ev) {
            if (ev.isRoot) {
                const api = getApiByController(this.apiSet_, ev.bladeController);
                this.apiSet_.remove(api);
            }
        }
        onRackInputChange_(ev) {
            const bc = ev.bladeController;
            if (bc instanceof InputBindingController) {
                const api = getApiByController(this.apiSet_, bc);
                const binding = bc.binding;
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(api, forceCast(binding.target.read()), binding.target.presetKey, ev.options.last),
                });
            }
            else if (bc instanceof ValueBladeController) {
                const api = getApiByController(this.apiSet_, bc);
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(api, bc.value.rawValue, undefined, ev.options.last),
                });
            }
        }
        onRackMonitorUpdate_(ev) {
            if (!(ev.bladeController instanceof MonitorBindingController)) {
                throw TpError.shouldNeverHappen();
            }
            const api = getApiByController(this.apiSet_, ev.bladeController);
            const binding = ev.bladeController.binding;
            this.emitter_.emit('update', {
                event: new TpUpdateEvent(api, forceCast(binding.target.read()), binding.target.presetKey),
            });
        }
    }

    class FolderApi extends RackLikeApi {
        constructor(controller, pool) {
            super(controller, new RackApi(controller.rackController, pool));
            this.emitter_ = new Emitter();
            this.controller_.foldable
                .value('expanded')
                .emitter.on('change', (ev) => {
                this.emitter_.emit('fold', {
                    event: new TpFoldEvent(this, ev.sender.rawValue),
                });
            });
            this.rackApi_.on('change', (ev) => {
                this.emitter_.emit('change', {
                    event: ev,
                });
            });
            this.rackApi_.on('update', (ev) => {
                this.emitter_.emit('update', {
                    event: ev,
                });
            });
        }
        get expanded() {
            return this.controller_.foldable.get('expanded');
        }
        set expanded(expanded) {
            this.controller_.foldable.set('expanded', expanded);
        }
        get title() {
            return this.controller_.props.get('title');
        }
        set title(title) {
            this.controller_.props.set('title', title);
        }
        get children() {
            return this.rackApi_.children;
        }
        addInput(object, key, opt_params) {
            return this.rackApi_.addInput(object, key, opt_params);
        }
        addMonitor(object, key, opt_params) {
            return this.rackApi_.addMonitor(object, key, opt_params);
        }
        addFolder(params) {
            return this.rackApi_.addFolder(params);
        }
        addButton(params) {
            return this.rackApi_.addButton(params);
        }
        addSeparator(opt_params) {
            return this.rackApi_.addSeparator(opt_params);
        }
        addTab(params) {
            return this.rackApi_.addTab(params);
        }
        add(api, opt_index) {
            return this.rackApi_.add(api, opt_index);
        }
        remove(api) {
            this.rackApi_.remove(api);
        }
        addBlade(params) {
            return this.rackApi_.addBlade(params);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
    }

    class RackLikeController extends BladeController {
        constructor(config) {
            super({
                blade: config.blade,
                view: config.view,
                viewProps: config.rackController.viewProps,
            });
            this.rackController = config.rackController;
        }
    }

    class PlainView {
        constructor(doc, config) {
            const className = ClassName(config.viewName);
            this.element = doc.createElement('div');
            this.element.classList.add(className());
            config.viewProps.bindClassModifiers(this.element);
        }
    }

    function findInputBindingController(bcs, b) {
        for (let i = 0; i < bcs.length; i++) {
            const bc = bcs[i];
            if (bc instanceof InputBindingController && bc.binding === b) {
                return bc;
            }
        }
        return null;
    }
    function findMonitorBindingController(bcs, b) {
        for (let i = 0; i < bcs.length; i++) {
            const bc = bcs[i];
            if (bc instanceof MonitorBindingController && bc.binding === b) {
                return bc;
            }
        }
        return null;
    }
    function findValueBladeController(bcs, v) {
        for (let i = 0; i < bcs.length; i++) {
            const bc = bcs[i];
            if (bc instanceof ValueBladeController && bc.value === v) {
                return bc;
            }
        }
        return null;
    }
    function findSubRack(bc) {
        if (bc instanceof RackController) {
            return bc.rack;
        }
        if (bc instanceof RackLikeController) {
            return bc.rackController.rack;
        }
        return null;
    }
    function findSubBladeControllerSet(bc) {
        const rack = findSubRack(bc);
        return rack ? rack['bcSet_'] : null;
    }
    class BladeRack {
        constructor(config) {
            var _a, _b;
            this.onBladePositionsChange_ = this.onBladePositionsChange_.bind(this);
            this.onSetAdd_ = this.onSetAdd_.bind(this);
            this.onSetRemove_ = this.onSetRemove_.bind(this);
            this.onChildDispose_ = this.onChildDispose_.bind(this);
            this.onChildPositionsChange_ = this.onChildPositionsChange_.bind(this);
            this.onChildInputChange_ = this.onChildInputChange_.bind(this);
            this.onChildMonitorUpdate_ = this.onChildMonitorUpdate_.bind(this);
            this.onChildValueChange_ = this.onChildValueChange_.bind(this);
            this.onChildViewPropsChange_ = this.onChildViewPropsChange_.bind(this);
            this.onDescendantLayout_ = this.onDescendantLayout_.bind(this);
            this.onDescendantInputChange_ = this.onDescendantInputChange_.bind(this);
            this.onDescendantMonitorUpdate_ =
                this.onDescendantMonitorUpdate_.bind(this);
            this.emitter = new Emitter();
            this.blade_ = (_a = config.blade) !== null && _a !== void 0 ? _a : null;
            (_b = this.blade_) === null || _b === void 0 ? void 0 : _b.value('positions').emitter.on('change', this.onBladePositionsChange_);
            this.viewProps = config.viewProps;
            this.bcSet_ = new NestedOrderedSet(findSubBladeControllerSet);
            this.bcSet_.emitter.on('add', this.onSetAdd_);
            this.bcSet_.emitter.on('remove', this.onSetRemove_);
        }
        get children() {
            return this.bcSet_.items;
        }
        add(bc, opt_index) {
            var _a;
            (_a = bc.parent) === null || _a === void 0 ? void 0 : _a.remove(bc);
            if (isPropertyWritable(bc, 'parent')) {
                bc.parent = this;
            }
            else {
                bc['parent_'] = this;
                warnMissing({
                    key: 'parent',
                    target: 'BladeController',
                    place: 'BladeRack.add',
                });
            }
            this.bcSet_.add(bc, opt_index);
        }
        remove(bc) {
            if (isPropertyWritable(bc, 'parent')) {
                bc.parent = null;
            }
            else {
                bc['parent_'] = null;
                warnMissing({
                    key: 'parent',
                    target: 'BladeController',
                    place: 'BladeRack.remove',
                });
            }
            this.bcSet_.remove(bc);
        }
        find(controllerClass) {
            return forceCast(this.bcSet_.allItems().filter((bc) => {
                return bc instanceof controllerClass;
            }));
        }
        onSetAdd_(ev) {
            this.updatePositions_();
            const isRoot = ev.target === ev.root;
            this.emitter.emit('add', {
                bladeController: ev.item,
                index: ev.index,
                isRoot: isRoot,
                sender: this,
            });
            if (!isRoot) {
                return;
            }
            const bc = ev.item;
            bc.viewProps.emitter.on('change', this.onChildViewPropsChange_);
            bc.blade
                .value('positions')
                .emitter.on('change', this.onChildPositionsChange_);
            bc.viewProps.handleDispose(this.onChildDispose_);
            if (bc instanceof InputBindingController) {
                bc.binding.emitter.on('change', this.onChildInputChange_);
            }
            else if (bc instanceof MonitorBindingController) {
                bc.binding.emitter.on('update', this.onChildMonitorUpdate_);
            }
            else if (bc instanceof ValueBladeController) {
                bc.value.emitter.on('change', this.onChildValueChange_);
            }
            else {
                const rack = findSubRack(bc);
                if (rack) {
                    const emitter = rack.emitter;
                    emitter.on('layout', this.onDescendantLayout_);
                    emitter.on('inputchange', this.onDescendantInputChange_);
                    emitter.on('monitorupdate', this.onDescendantMonitorUpdate_);
                }
            }
        }
        onSetRemove_(ev) {
            this.updatePositions_();
            const isRoot = ev.target === ev.root;
            this.emitter.emit('remove', {
                bladeController: ev.item,
                isRoot: isRoot,
                sender: this,
            });
            if (!isRoot) {
                return;
            }
            const bc = ev.item;
            if (bc instanceof InputBindingController) {
                bc.binding.emitter.off('change', this.onChildInputChange_);
            }
            else if (bc instanceof MonitorBindingController) {
                bc.binding.emitter.off('update', this.onChildMonitorUpdate_);
            }
            else if (bc instanceof ValueBladeController) {
                bc.value.emitter.off('change', this.onChildValueChange_);
            }
            else {
                const rack = findSubRack(bc);
                if (rack) {
                    const emitter = rack.emitter;
                    emitter.off('layout', this.onDescendantLayout_);
                    emitter.off('inputchange', this.onDescendantInputChange_);
                    emitter.off('monitorupdate', this.onDescendantMonitorUpdate_);
                }
            }
        }
        updatePositions_() {
            const visibleItems = this.bcSet_.items.filter((bc) => !bc.viewProps.get('hidden'));
            const firstVisibleItem = visibleItems[0];
            const lastVisibleItem = visibleItems[visibleItems.length - 1];
            this.bcSet_.items.forEach((bc) => {
                const ps = [];
                if (bc === firstVisibleItem) {
                    ps.push('first');
                    if (!this.blade_ ||
                        this.blade_.get('positions').includes('veryfirst')) {
                        ps.push('veryfirst');
                    }
                }
                if (bc === lastVisibleItem) {
                    ps.push('last');
                    if (!this.blade_ || this.blade_.get('positions').includes('verylast')) {
                        ps.push('verylast');
                    }
                }
                bc.blade.set('positions', ps);
            });
        }
        onChildPositionsChange_() {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this,
            });
        }
        onChildViewPropsChange_(_ev) {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this,
            });
        }
        onChildDispose_() {
            const disposedUcs = this.bcSet_.items.filter((bc) => {
                return bc.viewProps.get('disposed');
            });
            disposedUcs.forEach((bc) => {
                this.bcSet_.remove(bc);
            });
        }
        onChildInputChange_(ev) {
            const bc = findInputBindingController(this.find(InputBindingController), ev.sender);
            if (!bc) {
                throw TpError.alreadyDisposed();
            }
            this.emitter.emit('inputchange', {
                bladeController: bc,
                options: ev.options,
                sender: this,
            });
        }
        onChildMonitorUpdate_(ev) {
            const bc = findMonitorBindingController(this.find(MonitorBindingController), ev.sender);
            if (!bc) {
                throw TpError.alreadyDisposed();
            }
            this.emitter.emit('monitorupdate', {
                bladeController: bc,
                sender: this,
            });
        }
        onChildValueChange_(ev) {
            const bc = findValueBladeController(this.find(ValueBladeController), ev.sender);
            if (!bc) {
                throw TpError.alreadyDisposed();
            }
            this.emitter.emit('inputchange', {
                bladeController: bc,
                options: ev.options,
                sender: this,
            });
        }
        onDescendantLayout_(_) {
            this.updatePositions_();
            this.emitter.emit('layout', {
                sender: this,
            });
        }
        onDescendantInputChange_(ev) {
            this.emitter.emit('inputchange', {
                bladeController: ev.bladeController,
                options: ev.options,
                sender: this,
            });
        }
        onDescendantMonitorUpdate_(ev) {
            this.emitter.emit('monitorupdate', {
                bladeController: ev.bladeController,
                sender: this,
            });
        }
        onBladePositionsChange_() {
            this.updatePositions_();
        }
    }

    class RackController extends BladeController {
        constructor(doc, config) {
            super(Object.assign(Object.assign({}, config), { view: new PlainView(doc, {
                    viewName: 'brk',
                    viewProps: config.viewProps,
                }) }));
            this.onRackAdd_ = this.onRackAdd_.bind(this);
            this.onRackRemove_ = this.onRackRemove_.bind(this);
            const rack = new BladeRack({
                blade: config.root ? undefined : config.blade,
                viewProps: config.viewProps,
            });
            rack.emitter.on('add', this.onRackAdd_);
            rack.emitter.on('remove', this.onRackRemove_);
            this.rack = rack;
            this.viewProps.handleDispose(() => {
                for (let i = this.rack.children.length - 1; i >= 0; i--) {
                    const bc = this.rack.children[i];
                    bc.viewProps.set('disposed', true);
                }
            });
        }
        onRackAdd_(ev) {
            if (!ev.isRoot) {
                return;
            }
            insertElementAt(this.view.element, ev.bladeController.view.element, ev.index);
        }
        onRackRemove_(ev) {
            if (!ev.isRoot) {
                return;
            }
            removeElement(ev.bladeController.view.element);
        }
    }

    const bladeContainerClassName = ClassName('cnt');

    class FolderView {
        constructor(doc, config) {
            var _a;
            this.className_ = ClassName((_a = config.viewName) !== null && _a !== void 0 ? _a : 'fld');
            this.element = doc.createElement('div');
            this.element.classList.add(this.className_(), bladeContainerClassName());
            config.viewProps.bindClassModifiers(this.element);
            this.foldable_ = config.foldable;
            this.foldable_.bindExpandedClass(this.element, this.className_(undefined, 'expanded'));
            bindValueMap(this.foldable_, 'completed', valueToClassName(this.element, this.className_(undefined, 'cpl')));
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(this.className_('b'));
            bindValueMap(config.props, 'title', (title) => {
                if (isEmpty(title)) {
                    this.element.classList.add(this.className_(undefined, 'not'));
                }
                else {
                    this.element.classList.remove(this.className_(undefined, 'not'));
                }
            });
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const indentElem = doc.createElement('div');
            indentElem.classList.add(this.className_('i'));
            this.element.appendChild(indentElem);
            const titleElem = doc.createElement('div');
            titleElem.classList.add(this.className_('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
            this.titleElement = titleElem;
            const markElem = doc.createElement('div');
            markElem.classList.add(this.className_('m'));
            this.buttonElement.appendChild(markElem);
            const containerElem = config.containerElement;
            containerElem.classList.add(this.className_('c'));
            this.element.appendChild(containerElem);
            this.containerElement = containerElem;
        }
    }

    class FolderController extends RackLikeController {
        constructor(doc, config) {
            var _a;
            const foldable = Foldable.create((_a = config.expanded) !== null && _a !== void 0 ? _a : true);
            const rc = new RackController(doc, {
                blade: config.blade,
                root: config.root,
                viewProps: config.viewProps,
            });
            super(Object.assign(Object.assign({}, config), { rackController: rc, view: new FolderView(doc, {
                    containerElement: rc.view.element,
                    foldable: foldable,
                    props: config.props,
                    viewName: config.root ? 'rot' : undefined,
                    viewProps: config.viewProps,
                }) }));
            this.onTitleClick_ = this.onTitleClick_.bind(this);
            this.props = config.props;
            this.foldable = foldable;
            bindFoldable(this.foldable, this.view.containerElement);
            this.rackController.rack.emitter.on('add', () => {
                this.foldable.cleanUpTransition();
            });
            this.rackController.rack.emitter.on('remove', () => {
                this.foldable.cleanUpTransition();
            });
            this.view.buttonElement.addEventListener('click', this.onTitleClick_);
        }
        get document() {
            return this.view.element.ownerDocument;
        }
        onTitleClick_() {
            this.foldable.set('expanded', !this.foldable.get('expanded'));
        }
    }

    const FolderBladePlugin = {
        id: 'folder',
        type: 'blade',
        accept(params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                title: p.required.string,
                view: p.required.constant('folder'),
                expanded: p.optional.boolean,
            });
            return result ? { params: result } : null;
        },
        controller(args) {
            return new FolderController(args.document, {
                blade: args.blade,
                expanded: args.params.expanded,
                props: ValueMap.fromObject({
                    title: args.params.title,
                }),
                viewProps: args.viewProps,
            });
        },
        api(args) {
            if (!(args.controller instanceof FolderController)) {
                return null;
            }
            return new FolderApi(args.controller, args.pool);
        },
    };

    class LabeledValueController extends ValueBladeController {
        constructor(doc, config) {
            const viewProps = config.valueController.viewProps;
            super(Object.assign(Object.assign({}, config), { value: config.valueController.value, view: new LabelView(doc, {
                    props: config.props,
                    viewProps: viewProps,
                }), viewProps: viewProps }));
            this.props = config.props;
            this.valueController = config.valueController;
            this.view.valueElement.appendChild(this.valueController.view.element);
        }
    }

    class SeparatorApi extends BladeApi {
    }

    const className$m = ClassName('spr');
    class SeparatorView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$m());
            config.viewProps.bindClassModifiers(this.element);
            const hrElem = doc.createElement('hr');
            hrElem.classList.add(className$m('r'));
            this.element.appendChild(hrElem);
        }
    }

    class SeparatorController extends BladeController {
        constructor(doc, config) {
            super(Object.assign(Object.assign({}, config), { view: new SeparatorView(doc, {
                    viewProps: config.viewProps,
                }) }));
        }
    }

    const SeparatorBladePlugin = {
        id: 'separator',
        type: 'blade',
        accept(params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                view: p.required.constant('separator'),
            });
            return result ? { params: result } : null;
        },
        controller(args) {
            return new SeparatorController(args.document, {
                blade: args.blade,
                viewProps: args.viewProps,
            });
        },
        api(args) {
            if (!(args.controller instanceof SeparatorController)) {
                return null;
            }
            return new SeparatorApi(args.controller);
        },
    };

    const className$l = ClassName('tbi');
    class TabItemView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$l());
            config.viewProps.bindClassModifiers(this.element);
            bindValueMap(config.props, 'selected', (selected) => {
                if (selected) {
                    this.element.classList.add(className$l(undefined, 'sel'));
                }
                else {
                    this.element.classList.remove(className$l(undefined, 'sel'));
                }
            });
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$l('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$l('t'));
            bindValueToTextContent(config.props.value('title'), titleElem);
            this.buttonElement.appendChild(titleElem);
            this.titleElement = titleElem;
        }
    }

    class TabItemController {
        constructor(doc, config) {
            this.emitter = new Emitter();
            this.onClick_ = this.onClick_.bind(this);
            this.props = config.props;
            this.viewProps = config.viewProps;
            this.view = new TabItemView(doc, {
                props: config.props,
                viewProps: config.viewProps,
            });
            this.view.buttonElement.addEventListener('click', this.onClick_);
        }
        onClick_() {
            this.emitter.emit('click', {
                sender: this,
            });
        }
    }

    class TabPageController {
        constructor(doc, config) {
            this.onItemClick_ = this.onItemClick_.bind(this);
            this.ic_ = new TabItemController(doc, {
                props: config.itemProps,
                viewProps: ViewProps.create(),
            });
            this.ic_.emitter.on('click', this.onItemClick_);
            this.cc_ = new RackController(doc, {
                blade: createBlade(),
                viewProps: ViewProps.create(),
            });
            this.props = config.props;
            bindValueMap(this.props, 'selected', (selected) => {
                this.itemController.props.set('selected', selected);
                this.contentController.viewProps.set('hidden', !selected);
            });
        }
        get itemController() {
            return this.ic_;
        }
        get contentController() {
            return this.cc_;
        }
        onItemClick_() {
            this.props.set('selected', true);
        }
    }

    class TabPageApi {
        constructor(controller, contentRackApi) {
            this.controller_ = controller;
            this.rackApi_ = contentRackApi;
        }
        get title() {
            var _a;
            return (_a = this.controller_.itemController.props.get('title')) !== null && _a !== void 0 ? _a : '';
        }
        set title(title) {
            this.controller_.itemController.props.set('title', title);
        }
        get selected() {
            return this.controller_.props.get('selected');
        }
        set selected(selected) {
            this.controller_.props.set('selected', selected);
        }
        get children() {
            return this.rackApi_.children;
        }
        addButton(params) {
            return this.rackApi_.addButton(params);
        }
        addFolder(params) {
            return this.rackApi_.addFolder(params);
        }
        addSeparator(opt_params) {
            return this.rackApi_.addSeparator(opt_params);
        }
        addTab(params) {
            return this.rackApi_.addTab(params);
        }
        add(api, opt_index) {
            this.rackApi_.add(api, opt_index);
        }
        remove(api) {
            this.rackApi_.remove(api);
        }
        addInput(object, key, opt_params) {
            return this.rackApi_.addInput(object, key, opt_params);
        }
        addMonitor(object, key, opt_params) {
            return this.rackApi_.addMonitor(object, key, opt_params);
        }
        addBlade(params) {
            return this.rackApi_.addBlade(params);
        }
    }

    class TabApi extends RackLikeApi {
        constructor(controller, pool) {
            super(controller, new RackApi(controller.rackController, pool));
            this.onPageAdd_ = this.onPageAdd_.bind(this);
            this.onPageRemove_ = this.onPageRemove_.bind(this);
            this.onSelect_ = this.onSelect_.bind(this);
            this.emitter_ = new Emitter();
            this.pageApiMap_ = new Map();
            this.rackApi_.on('change', (ev) => {
                this.emitter_.emit('change', {
                    event: ev,
                });
            });
            this.rackApi_.on('update', (ev) => {
                this.emitter_.emit('update', {
                    event: ev,
                });
            });
            this.controller_.tab.selectedIndex.emitter.on('change', this.onSelect_);
            this.controller_.pageSet.emitter.on('add', this.onPageAdd_);
            this.controller_.pageSet.emitter.on('remove', this.onPageRemove_);
            this.controller_.pageSet.items.forEach((pc) => {
                this.setUpPageApi_(pc);
            });
        }
        get pages() {
            return this.controller_.pageSet.items.map((pc) => {
                const api = this.pageApiMap_.get(pc);
                if (!api) {
                    throw TpError.shouldNeverHappen();
                }
                return api;
            });
        }
        addPage(params) {
            const doc = this.controller_.view.element.ownerDocument;
            const pc = new TabPageController(doc, {
                itemProps: ValueMap.fromObject({
                    selected: false,
                    title: params.title,
                }),
                props: ValueMap.fromObject({
                    selected: false,
                }),
            });
            this.controller_.add(pc, params.index);
            const api = this.pageApiMap_.get(pc);
            if (!api) {
                throw TpError.shouldNeverHappen();
            }
            return api;
        }
        removePage(index) {
            this.controller_.remove(index);
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
        setUpPageApi_(pc) {
            const rackApi = this.rackApi_['apiSet_'].find((api) => api.controller_ === pc.contentController);
            if (!rackApi) {
                throw TpError.shouldNeverHappen();
            }
            const api = new TabPageApi(pc, rackApi);
            this.pageApiMap_.set(pc, api);
        }
        onPageAdd_(ev) {
            this.setUpPageApi_(ev.item);
        }
        onPageRemove_(ev) {
            const api = this.pageApiMap_.get(ev.item);
            if (!api) {
                throw TpError.shouldNeverHappen();
            }
            this.pageApiMap_.delete(ev.item);
        }
        onSelect_(ev) {
            this.emitter_.emit('select', {
                event: new TpTabSelectEvent(this, ev.rawValue),
            });
        }
    }

    const INDEX_NOT_SELECTED = -1;
    class Tab {
        constructor() {
            this.onItemSelectedChange_ = this.onItemSelectedChange_.bind(this);
            this.empty = createValue(true);
            this.selectedIndex = createValue(INDEX_NOT_SELECTED);
            this.items_ = [];
        }
        add(item, opt_index) {
            const index = opt_index !== null && opt_index !== void 0 ? opt_index : this.items_.length;
            this.items_.splice(index, 0, item);
            item.emitter.on('change', this.onItemSelectedChange_);
            this.keepSelection_();
        }
        remove(item) {
            const index = this.items_.indexOf(item);
            if (index < 0) {
                return;
            }
            this.items_.splice(index, 1);
            item.emitter.off('change', this.onItemSelectedChange_);
            this.keepSelection_();
        }
        keepSelection_() {
            if (this.items_.length === 0) {
                this.selectedIndex.rawValue = INDEX_NOT_SELECTED;
                this.empty.rawValue = true;
                return;
            }
            const firstSelIndex = this.items_.findIndex((s) => s.rawValue);
            if (firstSelIndex < 0) {
                this.items_.forEach((s, i) => {
                    s.rawValue = i === 0;
                });
                this.selectedIndex.rawValue = 0;
            }
            else {
                this.items_.forEach((s, i) => {
                    s.rawValue = i === firstSelIndex;
                });
                this.selectedIndex.rawValue = firstSelIndex;
            }
            this.empty.rawValue = false;
        }
        onItemSelectedChange_(ev) {
            if (ev.rawValue) {
                const index = this.items_.findIndex((s) => s === ev.sender);
                this.items_.forEach((s, i) => {
                    s.rawValue = i === index;
                });
                this.selectedIndex.rawValue = index;
            }
            else {
                this.keepSelection_();
            }
        }
    }

    const className$k = ClassName('tab');
    class TabView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$k(), bladeContainerClassName());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.empty, valueToClassName(this.element, className$k(undefined, 'nop')));
            const titleElem = doc.createElement('div');
            titleElem.classList.add(className$k('t'));
            this.element.appendChild(titleElem);
            this.itemsElement = titleElem;
            const indentElem = doc.createElement('div');
            indentElem.classList.add(className$k('i'));
            this.element.appendChild(indentElem);
            const contentsElem = config.contentsElement;
            contentsElem.classList.add(className$k('c'));
            this.element.appendChild(contentsElem);
            this.contentsElement = contentsElem;
        }
    }

    class TabController extends RackLikeController {
        constructor(doc, config) {
            const cr = new RackController(doc, {
                blade: config.blade,
                viewProps: config.viewProps,
            });
            const tab = new Tab();
            super({
                blade: config.blade,
                rackController: cr,
                view: new TabView(doc, {
                    contentsElement: cr.view.element,
                    empty: tab.empty,
                    viewProps: config.viewProps,
                }),
            });
            this.onPageAdd_ = this.onPageAdd_.bind(this);
            this.onPageRemove_ = this.onPageRemove_.bind(this);
            this.pageSet_ = new NestedOrderedSet(() => null);
            this.pageSet_.emitter.on('add', this.onPageAdd_);
            this.pageSet_.emitter.on('remove', this.onPageRemove_);
            this.tab = tab;
        }
        get pageSet() {
            return this.pageSet_;
        }
        add(pc, opt_index) {
            this.pageSet_.add(pc, opt_index);
        }
        remove(index) {
            this.pageSet_.remove(this.pageSet_.items[index]);
        }
        onPageAdd_(ev) {
            const pc = ev.item;
            insertElementAt(this.view.itemsElement, pc.itemController.view.element, ev.index);
            pc.itemController.viewProps.set('parent', this.viewProps);
            this.rackController.rack.add(pc.contentController, ev.index);
            this.tab.add(pc.props.value('selected'));
        }
        onPageRemove_(ev) {
            const pc = ev.item;
            removeElement(pc.itemController.view.element);
            pc.itemController.viewProps.set('parent', null);
            this.rackController.rack.remove(pc.contentController);
            this.tab.remove(pc.props.value('selected'));
        }
    }

    const TabBladePlugin = {
        id: 'tab',
        type: 'blade',
        accept(params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                pages: p.required.array(p.required.object({ title: p.required.string })),
                view: p.required.constant('tab'),
            });
            if (!result || result.pages.length === 0) {
                return null;
            }
            return { params: result };
        },
        controller(args) {
            const c = new TabController(args.document, {
                blade: args.blade,
                viewProps: args.viewProps,
            });
            args.params.pages.forEach((p) => {
                const pc = new TabPageController(args.document, {
                    itemProps: ValueMap.fromObject({
                        selected: false,
                        title: p.title,
                    }),
                    props: ValueMap.fromObject({
                        selected: false,
                    }),
                });
                c.add(pc);
            });
            return c;
        },
        api(args) {
            if (!(args.controller instanceof TabController)) {
                return null;
            }
            return new TabApi(args.controller, args.pool);
        },
    };

    function createBladeController(plugin, args) {
        const ac = plugin.accept(args.params);
        if (!ac) {
            return null;
        }
        const disabled = ParamsParsers.optional.boolean(args.params['disabled']).value;
        const hidden = ParamsParsers.optional.boolean(args.params['hidden']).value;
        return plugin.controller({
            blade: createBlade(),
            document: args.document,
            params: forceCast(Object.assign(Object.assign({}, ac.params), { disabled: disabled, hidden: hidden })),
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden,
            }),
        });
    }

    class ManualTicker {
        constructor() {
            this.disabled = false;
            this.emitter = new Emitter();
        }
        dispose() { }
        tick() {
            if (this.disabled) {
                return;
            }
            this.emitter.emit('tick', {
                sender: this,
            });
        }
    }

    class IntervalTicker {
        constructor(doc, interval) {
            this.disabled_ = false;
            this.timerId_ = null;
            this.onTick_ = this.onTick_.bind(this);
            this.doc_ = doc;
            this.emitter = new Emitter();
            this.interval_ = interval;
            this.setTimer_();
        }
        get disabled() {
            return this.disabled_;
        }
        set disabled(inactive) {
            this.disabled_ = inactive;
            if (this.disabled_) {
                this.clearTimer_();
            }
            else {
                this.setTimer_();
            }
        }
        dispose() {
            this.clearTimer_();
        }
        clearTimer_() {
            if (this.timerId_ === null) {
                return;
            }
            const win = this.doc_.defaultView;
            if (win) {
                win.clearInterval(this.timerId_);
            }
            this.timerId_ = null;
        }
        setTimer_() {
            this.clearTimer_();
            if (this.interval_ <= 0) {
                return;
            }
            const win = this.doc_.defaultView;
            if (win) {
                this.timerId_ = win.setInterval(this.onTick_, this.interval_);
            }
        }
        onTick_() {
            if (this.disabled_) {
                return;
            }
            this.emitter.emit('tick', {
                sender: this,
            });
        }
    }

    class InputBinding {
        constructor(config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.reader = config.reader;
            this.writer = config.writer;
            this.emitter = new Emitter();
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.target = config.target;
            this.read();
        }
        read() {
            const targetValue = this.target.read();
            if (targetValue !== undefined) {
                this.value.rawValue = this.reader(targetValue);
            }
        }
        write_(rawValue) {
            this.writer(this.target, rawValue);
        }
        onValueChange_(ev) {
            this.write_(ev.rawValue);
            this.emitter.emit('change', {
                options: ev.options,
                rawValue: ev.rawValue,
                sender: this,
            });
        }
    }

    function fillBuffer(buffer, bufferSize) {
        while (buffer.length < bufferSize) {
            buffer.push(undefined);
        }
    }
    function initializeBuffer(bufferSize) {
        const buffer = [];
        fillBuffer(buffer, bufferSize);
        return createValue(buffer);
    }
    function createTrimmedBuffer(buffer) {
        const index = buffer.indexOf(undefined);
        return forceCast(index < 0 ? buffer : buffer.slice(0, index));
    }
    function createPushedBuffer(buffer, newValue) {
        const newBuffer = [...createTrimmedBuffer(buffer), newValue];
        if (newBuffer.length > buffer.length) {
            newBuffer.splice(0, newBuffer.length - buffer.length);
        }
        else {
            fillBuffer(newBuffer, buffer.length);
        }
        return newBuffer;
    }

    class MonitorBinding {
        constructor(config) {
            this.onTick_ = this.onTick_.bind(this);
            this.reader_ = config.reader;
            this.target = config.target;
            this.emitter = new Emitter();
            this.value = config.value;
            this.ticker = config.ticker;
            this.ticker.emitter.on('tick', this.onTick_);
            this.read();
        }
        dispose() {
            this.ticker.dispose();
        }
        read() {
            const targetValue = this.target.read();
            if (targetValue === undefined) {
                return;
            }
            const buffer = this.value.rawValue;
            const newValue = this.reader_(targetValue);
            this.value.rawValue = createPushedBuffer(buffer, newValue);
            this.emitter.emit('update', {
                rawValue: newValue,
                sender: this,
            });
        }
        onTick_(_) {
            this.read();
        }
    }

    class CompositeConstraint {
        constructor(constraints) {
            this.constraints = constraints;
        }
        constrain(value) {
            return this.constraints.reduce((result, c) => {
                return c.constrain(result);
            }, value);
        }
    }
    function findConstraint(c, constraintClass) {
        if (c instanceof constraintClass) {
            return c;
        }
        if (c instanceof CompositeConstraint) {
            const result = c.constraints.reduce((tmpResult, sc) => {
                if (tmpResult) {
                    return tmpResult;
                }
                return sc instanceof constraintClass ? sc : null;
            }, null);
            if (result) {
                return result;
            }
        }
        return null;
    }

    class DefiniteRangeConstraint {
        constructor(config) {
            this.values = ValueMap.fromObject({
                max: config.max,
                min: config.min,
            });
        }
        constrain(value) {
            const max = this.values.get('max');
            const min = this.values.get('min');
            return Math.min(Math.max(value, min), max);
        }
    }

    class ListConstraint {
        constructor(options) {
            this.values = ValueMap.fromObject({
                options: options,
            });
        }
        get options() {
            return this.values.get('options');
        }
        constrain(value) {
            const opts = this.values.get('options');
            if (opts.length === 0) {
                return value;
            }
            const matched = opts.filter((item) => {
                return item.value === value;
            }).length > 0;
            return matched ? value : opts[0].value;
        }
    }

    class RangeConstraint {
        constructor(config) {
            this.values = ValueMap.fromObject({
                max: config.max,
                min: config.min,
            });
        }
        get maxValue() {
            return this.values.get('max');
        }
        get minValue() {
            return this.values.get('min');
        }
        constrain(value) {
            const max = this.values.get('max');
            const min = this.values.get('min');
            let result = value;
            if (!isEmpty(min)) {
                result = Math.max(result, min);
            }
            if (!isEmpty(max)) {
                result = Math.min(result, max);
            }
            return result;
        }
    }

    class StepConstraint {
        constructor(step, origin = 0) {
            this.step = step;
            this.origin = origin;
        }
        constrain(value) {
            const o = this.origin % this.step;
            const r = Math.round((value - o) / this.step);
            return o + r * this.step;
        }
    }

    const className$j = ClassName('lst');
    class ListView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.props_ = config.props;
            this.element = doc.createElement('div');
            this.element.classList.add(className$j());
            config.viewProps.bindClassModifiers(this.element);
            const selectElem = doc.createElement('select');
            selectElem.classList.add(className$j('s'));
            bindValueMap(this.props_, 'options', (opts) => {
                removeChildElements(selectElem);
                opts.forEach((item, index) => {
                    const optionElem = doc.createElement('option');
                    optionElem.dataset.index = String(index);
                    optionElem.textContent = item.text;
                    optionElem.value = String(item.value);
                    selectElem.appendChild(optionElem);
                });
            });
            config.viewProps.bindDisabled(selectElem);
            this.element.appendChild(selectElem);
            this.selectElement = selectElem;
            const markElem = doc.createElement('div');
            markElem.classList.add(className$j('m'));
            markElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            this.element.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value_ = config.value;
            this.update_();
        }
        update_() {
            this.selectElement.value = String(this.value_.rawValue);
        }
        onValueChange_() {
            this.update_();
        }
    }

    class ListController {
        constructor(doc, config) {
            this.onSelectChange_ = this.onSelectChange_.bind(this);
            this.props = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new ListView(doc, {
                props: this.props,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view.selectElement.addEventListener('change', this.onSelectChange_);
        }
        onSelectChange_(e) {
            const selectElem = forceCast(e.currentTarget);
            const optElem = selectElem.selectedOptions.item(0);
            if (!optElem) {
                return;
            }
            const itemIndex = Number(optElem.dataset.index);
            this.value.rawValue = this.props.get('options')[itemIndex].value;
        }
    }

    const className$i = ClassName('pop');
    class PopupView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$i());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.shows, valueToClassName(this.element, className$i(undefined, 'v')));
        }
    }

    class PopupController {
        constructor(doc, config) {
            this.shows = createValue(false);
            this.viewProps = config.viewProps;
            this.view = new PopupView(doc, {
                shows: this.shows,
                viewProps: this.viewProps,
            });
        }
    }

    const className$h = ClassName('txt');
    class TextView {
        constructor(doc, config) {
            this.onChange_ = this.onChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$h());
            config.viewProps.bindClassModifiers(this.element);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$h('i'));
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            config.value.emitter.on('change', this.onChange_);
            this.value_ = config.value;
            this.refresh();
        }
        refresh() {
            const formatter = this.props_.get('formatter');
            this.inputElement.value = formatter(this.value_.rawValue);
        }
        onChange_() {
            this.refresh();
        }
    }

    class TextController {
        constructor(doc, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.parser_ = config.parser;
            this.props = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new TextView(doc, {
                props: config.props,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            const value = inputElem.value;
            const parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) {
                this.value.rawValue = parsedValue;
            }
            this.view.refresh();
        }
    }

    function boolToString(value) {
        return String(value);
    }
    function boolFromUnknown(value) {
        if (value === 'false') {
            return false;
        }
        return !!value;
    }
    function BooleanFormatter(value) {
        return boolToString(value);
    }

    class NumberLiteralNode {
        constructor(text) {
            this.text = text;
        }
        evaluate() {
            return Number(this.text);
        }
        toString() {
            return this.text;
        }
    }
    const BINARY_OPERATION_MAP = {
        '**': (v1, v2) => Math.pow(v1, v2),
        '*': (v1, v2) => v1 * v2,
        '/': (v1, v2) => v1 / v2,
        '%': (v1, v2) => v1 % v2,
        '+': (v1, v2) => v1 + v2,
        '-': (v1, v2) => v1 - v2,
        '<<': (v1, v2) => v1 << v2,
        '>>': (v1, v2) => v1 >> v2,
        '>>>': (v1, v2) => v1 >>> v2,
        '&': (v1, v2) => v1 & v2,
        '^': (v1, v2) => v1 ^ v2,
        '|': (v1, v2) => v1 | v2,
    };
    class BinaryOperationNode {
        constructor(operator, left, right) {
            this.left = left;
            this.operator = operator;
            this.right = right;
        }
        evaluate() {
            const op = BINARY_OPERATION_MAP[this.operator];
            if (!op) {
                throw new Error(`unexpected binary operator: '${this.operator}`);
            }
            return op(this.left.evaluate(), this.right.evaluate());
        }
        toString() {
            return [
                'b(',
                this.left.toString(),
                this.operator,
                this.right.toString(),
                ')',
            ].join(' ');
        }
    }
    const UNARY_OPERATION_MAP = {
        '+': (v) => v,
        '-': (v) => -v,
        '~': (v) => ~v,
    };
    class UnaryOperationNode {
        constructor(operator, expr) {
            this.operator = operator;
            this.expression = expr;
        }
        evaluate() {
            const op = UNARY_OPERATION_MAP[this.operator];
            if (!op) {
                throw new Error(`unexpected unary operator: '${this.operator}`);
            }
            return op(this.expression.evaluate());
        }
        toString() {
            return ['u(', this.operator, this.expression.toString(), ')'].join(' ');
        }
    }

    function combineReader(parsers) {
        return (text, cursor) => {
            for (let i = 0; i < parsers.length; i++) {
                const result = parsers[i](text, cursor);
                if (result !== '') {
                    return result;
                }
            }
            return '';
        };
    }
    function readWhitespace(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^\s+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readNonZeroDigit(text, cursor) {
        const ch = text.substr(cursor, 1);
        return ch.match(/^[1-9]$/) ? ch : '';
    }
    function readDecimalDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-9]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readSignedInteger(text, cursor) {
        const ds = readDecimalDigits(text, cursor);
        if (ds !== '') {
            return ds;
        }
        const sign = text.substr(cursor, 1);
        cursor += 1;
        if (sign !== '-' && sign !== '+') {
            return '';
        }
        const sds = readDecimalDigits(text, cursor);
        if (sds === '') {
            return '';
        }
        return sign + sds;
    }
    function readExponentPart(text, cursor) {
        const e = text.substr(cursor, 1);
        cursor += 1;
        if (e.toLowerCase() !== 'e') {
            return '';
        }
        const si = readSignedInteger(text, cursor);
        if (si === '') {
            return '';
        }
        return e + si;
    }
    function readDecimalIntegerLiteral(text, cursor) {
        const ch = text.substr(cursor, 1);
        if (ch === '0') {
            return ch;
        }
        const nzd = readNonZeroDigit(text, cursor);
        cursor += nzd.length;
        if (nzd === '') {
            return '';
        }
        return nzd + readDecimalDigits(text, cursor);
    }
    function readDecimalLiteral1(text, cursor) {
        const dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') {
            return '';
        }
        const dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') {
            return '';
        }
        const dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        return dil + dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral2(text, cursor) {
        const dot = text.substr(cursor, 1);
        cursor += dot.length;
        if (dot !== '.') {
            return '';
        }
        const dds = readDecimalDigits(text, cursor);
        cursor += dds.length;
        if (dds === '') {
            return '';
        }
        return dot + dds + readExponentPart(text, cursor);
    }
    function readDecimalLiteral3(text, cursor) {
        const dil = readDecimalIntegerLiteral(text, cursor);
        cursor += dil.length;
        if (dil === '') {
            return '';
        }
        return dil + readExponentPart(text, cursor);
    }
    const readDecimalLiteral = combineReader([
        readDecimalLiteral1,
        readDecimalLiteral2,
        readDecimalLiteral3,
    ]);
    function parseBinaryDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[01]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readBinaryIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0b') {
            return '';
        }
        const bds = parseBinaryDigits(text, cursor);
        if (bds === '') {
            return '';
        }
        return prefix + bds;
    }
    function readOctalDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-7]+/);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readOctalIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0o') {
            return '';
        }
        const ods = readOctalDigits(text, cursor);
        if (ods === '') {
            return '';
        }
        return prefix + ods;
    }
    function readHexDigits(text, cursor) {
        var _a;
        const m = text.substr(cursor).match(/^[0-9a-f]+/i);
        return (_a = (m && m[0])) !== null && _a !== void 0 ? _a : '';
    }
    function readHexIntegerLiteral(text, cursor) {
        const prefix = text.substr(cursor, 2);
        cursor += prefix.length;
        if (prefix.toLowerCase() !== '0x') {
            return '';
        }
        const hds = readHexDigits(text, cursor);
        if (hds === '') {
            return '';
        }
        return prefix + hds;
    }
    const readNonDecimalIntegerLiteral = combineReader([
        readBinaryIntegerLiteral,
        readOctalIntegerLiteral,
        readHexIntegerLiteral,
    ]);
    const readNumericLiteral = combineReader([
        readNonDecimalIntegerLiteral,
        readDecimalLiteral,
    ]);

    function parseLiteral(text, cursor) {
        const num = readNumericLiteral(text, cursor);
        cursor += num.length;
        if (num === '') {
            return null;
        }
        return {
            evaluable: new NumberLiteralNode(num),
            cursor: cursor,
        };
    }
    function parseParenthesizedExpression(text, cursor) {
        const op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '(') {
            return null;
        }
        const expr = parseExpression(text, cursor);
        if (!expr) {
            return null;
        }
        cursor = expr.cursor;
        cursor += readWhitespace(text, cursor).length;
        const cl = text.substr(cursor, 1);
        cursor += cl.length;
        if (cl !== ')') {
            return null;
        }
        return {
            evaluable: expr.evaluable,
            cursor: cursor,
        };
    }
    function parsePrimaryExpression(text, cursor) {
        var _a;
        return ((_a = parseLiteral(text, cursor)) !== null && _a !== void 0 ? _a : parseParenthesizedExpression(text, cursor));
    }
    function parseUnaryExpression(text, cursor) {
        const expr = parsePrimaryExpression(text, cursor);
        if (expr) {
            return expr;
        }
        const op = text.substr(cursor, 1);
        cursor += op.length;
        if (op !== '+' && op !== '-' && op !== '~') {
            return null;
        }
        const num = parseUnaryExpression(text, cursor);
        if (!num) {
            return null;
        }
        cursor = num.cursor;
        return {
            cursor: cursor,
            evaluable: new UnaryOperationNode(op, num.evaluable),
        };
    }
    function readBinaryOperator(ops, text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        const op = ops.filter((op) => text.startsWith(op, cursor))[0];
        if (!op) {
            return null;
        }
        cursor += op.length;
        cursor += readWhitespace(text, cursor).length;
        return {
            cursor: cursor,
            operator: op,
        };
    }
    function createBinaryOperationExpressionParser(exprParser, ops) {
        return (text, cursor) => {
            const firstExpr = exprParser(text, cursor);
            if (!firstExpr) {
                return null;
            }
            cursor = firstExpr.cursor;
            let expr = firstExpr.evaluable;
            for (;;) {
                const op = readBinaryOperator(ops, text, cursor);
                if (!op) {
                    break;
                }
                cursor = op.cursor;
                const nextExpr = exprParser(text, cursor);
                if (!nextExpr) {
                    return null;
                }
                cursor = nextExpr.cursor;
                expr = new BinaryOperationNode(op.operator, expr, nextExpr.evaluable);
            }
            return expr
                ? {
                    cursor: cursor,
                    evaluable: expr,
                }
                : null;
        };
    }
    const parseBinaryOperationExpression = [
        ['**'],
        ['*', '/', '%'],
        ['+', '-'],
        ['<<', '>>>', '>>'],
        ['&'],
        ['^'],
        ['|'],
    ].reduce((parser, ops) => {
        return createBinaryOperationExpressionParser(parser, ops);
    }, parseUnaryExpression);
    function parseExpression(text, cursor) {
        cursor += readWhitespace(text, cursor).length;
        return parseBinaryOperationExpression(text, cursor);
    }
    function parseEcmaNumberExpression(text) {
        const expr = parseExpression(text, 0);
        if (!expr) {
            return null;
        }
        const cursor = expr.cursor + readWhitespace(text, expr.cursor).length;
        if (cursor !== text.length) {
            return null;
        }
        return expr.evaluable;
    }

    function parseNumber(text) {
        var _a;
        const r = parseEcmaNumberExpression(text);
        return (_a = r === null || r === void 0 ? void 0 : r.evaluate()) !== null && _a !== void 0 ? _a : null;
    }
    function numberFromUnknown(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            const pv = parseNumber(value);
            if (!isEmpty(pv)) {
                return pv;
            }
        }
        return 0;
    }
    function numberToString(value) {
        return String(value);
    }
    function createNumberFormatter(digits) {
        return (value) => {
            return value.toFixed(Math.max(Math.min(digits, 20), 0));
        };
    }

    const innerFormatter = createNumberFormatter(0);
    function formatPercentage(value) {
        return innerFormatter(value) + '%';
    }

    function stringFromUnknown(value) {
        return String(value);
    }
    function formatString(value) {
        return value;
    }

    function connectValues({ primary, secondary, forward, backward, }) {
        let changing = false;
        function preventFeedback(callback) {
            if (changing) {
                return;
            }
            changing = true;
            callback();
            changing = false;
        }
        primary.emitter.on('change', (ev) => {
            preventFeedback(() => {
                secondary.setRawValue(forward(primary, secondary), ev.options);
            });
        });
        secondary.emitter.on('change', (ev) => {
            preventFeedback(() => {
                primary.setRawValue(backward(primary, secondary), ev.options);
            });
            preventFeedback(() => {
                secondary.setRawValue(forward(primary, secondary), ev.options);
            });
        });
        preventFeedback(() => {
            secondary.setRawValue(forward(primary, secondary), {
                forceEmit: false,
                last: true,
            });
        });
    }

    function getStepForKey(baseStep, keys) {
        const step = baseStep * (keys.altKey ? 0.1 : 1) * (keys.shiftKey ? 10 : 1);
        if (keys.upKey) {
            return +step;
        }
        else if (keys.downKey) {
            return -step;
        }
        return 0;
    }
    function getVerticalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.key === 'ArrowDown',
            shiftKey: ev.shiftKey,
            upKey: ev.key === 'ArrowUp',
        };
    }
    function getHorizontalStepKeys(ev) {
        return {
            altKey: ev.altKey,
            downKey: ev.key === 'ArrowLeft',
            shiftKey: ev.shiftKey,
            upKey: ev.key === 'ArrowRight',
        };
    }
    function isVerticalArrowKey(key) {
        return key === 'ArrowUp' || key === 'ArrowDown';
    }
    function isArrowKey(key) {
        return isVerticalArrowKey(key) || key === 'ArrowLeft' || key === 'ArrowRight';
    }

    function computeOffset$1(ev, elem) {
        var _a, _b;
        const win = elem.ownerDocument.defaultView;
        const rect = elem.getBoundingClientRect();
        return {
            x: ev.pageX - (((_a = (win && win.scrollX)) !== null && _a !== void 0 ? _a : 0) + rect.left),
            y: ev.pageY - (((_b = (win && win.scrollY)) !== null && _b !== void 0 ? _b : 0) + rect.top),
        };
    }
    class PointerHandler {
        constructor(element) {
            this.lastTouch_ = null;
            this.onDocumentMouseMove_ = this.onDocumentMouseMove_.bind(this);
            this.onDocumentMouseUp_ = this.onDocumentMouseUp_.bind(this);
            this.onMouseDown_ = this.onMouseDown_.bind(this);
            this.onTouchEnd_ = this.onTouchEnd_.bind(this);
            this.onTouchMove_ = this.onTouchMove_.bind(this);
            this.onTouchStart_ = this.onTouchStart_.bind(this);
            this.elem_ = element;
            this.emitter = new Emitter();
            element.addEventListener('touchstart', this.onTouchStart_, {
                passive: false,
            });
            element.addEventListener('touchmove', this.onTouchMove_, {
                passive: true,
            });
            element.addEventListener('touchend', this.onTouchEnd_);
            element.addEventListener('mousedown', this.onMouseDown_);
        }
        computePosition_(offset) {
            const rect = this.elem_.getBoundingClientRect();
            return {
                bounds: {
                    width: rect.width,
                    height: rect.height,
                },
                point: offset
                    ? {
                        x: offset.x,
                        y: offset.y,
                    }
                    : null,
            };
        }
        onMouseDown_(ev) {
            var _a;
            ev.preventDefault();
            (_a = ev.currentTarget) === null || _a === void 0 ? void 0 : _a.focus();
            const doc = this.elem_.ownerDocument;
            doc.addEventListener('mousemove', this.onDocumentMouseMove_);
            doc.addEventListener('mouseup', this.onDocumentMouseUp_);
            this.emitter.emit('down', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey,
            });
        }
        onDocumentMouseMove_(ev) {
            this.emitter.emit('move', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey,
            });
        }
        onDocumentMouseUp_(ev) {
            const doc = this.elem_.ownerDocument;
            doc.removeEventListener('mousemove', this.onDocumentMouseMove_);
            doc.removeEventListener('mouseup', this.onDocumentMouseUp_);
            this.emitter.emit('up', {
                altKey: ev.altKey,
                data: this.computePosition_(computeOffset$1(ev, this.elem_)),
                sender: this,
                shiftKey: ev.shiftKey,
            });
        }
        onTouchStart_(ev) {
            ev.preventDefault();
            const touch = ev.targetTouches.item(0);
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('down', {
                altKey: ev.altKey,
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
                shiftKey: ev.shiftKey,
            });
            this.lastTouch_ = touch;
        }
        onTouchMove_(ev) {
            const touch = ev.targetTouches.item(0);
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('move', {
                altKey: ev.altKey,
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
                shiftKey: ev.shiftKey,
            });
            this.lastTouch_ = touch;
        }
        onTouchEnd_(ev) {
            var _a;
            const touch = (_a = ev.targetTouches.item(0)) !== null && _a !== void 0 ? _a : this.lastTouch_;
            const rect = this.elem_.getBoundingClientRect();
            this.emitter.emit('up', {
                altKey: ev.altKey,
                data: this.computePosition_(touch
                    ? {
                        x: touch.clientX - rect.left,
                        y: touch.clientY - rect.top,
                    }
                    : undefined),
                sender: this,
                shiftKey: ev.shiftKey,
            });
        }
    }

    function mapRange(value, start1, end1, start2, end2) {
        const p = (value - start1) / (end1 - start1);
        return start2 + p * (end2 - start2);
    }
    function getDecimalDigits(value) {
        const text = String(value.toFixed(10));
        const frac = text.split('.')[1];
        return frac.replace(/0+$/, '').length;
    }
    function constrainRange(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    function loopRange(value, max) {
        return ((value % max) + max) % max;
    }

    const className$g = ClassName('txt');
    class NumberTextView {
        constructor(doc, config) {
            this.onChange_ = this.onChange_.bind(this);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$g(), className$g(undefined, 'num'));
            if (config.arrayPosition) {
                this.element.classList.add(className$g(undefined, config.arrayPosition));
            }
            config.viewProps.bindClassModifiers(this.element);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$g('i'));
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            this.onDraggingChange_ = this.onDraggingChange_.bind(this);
            this.dragging_ = config.dragging;
            this.dragging_.emitter.on('change', this.onDraggingChange_);
            this.element.classList.add(className$g());
            this.inputElement.classList.add(className$g('i'));
            const knobElem = doc.createElement('div');
            knobElem.classList.add(className$g('k'));
            this.element.appendChild(knobElem);
            this.knobElement = knobElem;
            const guideElem = doc.createElementNS(SVG_NS, 'svg');
            guideElem.classList.add(className$g('g'));
            this.knobElement.appendChild(guideElem);
            const bodyElem = doc.createElementNS(SVG_NS, 'path');
            bodyElem.classList.add(className$g('gb'));
            guideElem.appendChild(bodyElem);
            this.guideBodyElem_ = bodyElem;
            const headElem = doc.createElementNS(SVG_NS, 'path');
            headElem.classList.add(className$g('gh'));
            guideElem.appendChild(headElem);
            this.guideHeadElem_ = headElem;
            const tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(ClassName('tt')());
            this.knobElement.appendChild(tooltipElem);
            this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('change', this.onChange_);
            this.value = config.value;
            this.refresh();
        }
        onDraggingChange_(ev) {
            if (ev.rawValue === null) {
                this.element.classList.remove(className$g(undefined, 'drg'));
                return;
            }
            this.element.classList.add(className$g(undefined, 'drg'));
            const x = ev.rawValue / this.props_.get('draggingScale');
            const aox = x + (x > 0 ? -1 : x < 0 ? +1 : 0);
            const adx = constrainRange(-aox, -4, +4);
            this.guideHeadElem_.setAttributeNS(null, 'd', [`M ${aox + adx},0 L${aox},4 L${aox + adx},8`, `M ${x},-1 L${x},9`].join(' '));
            this.guideBodyElem_.setAttributeNS(null, 'd', `M 0,4 L${x},4`);
            const formatter = this.props_.get('formatter');
            this.tooltipElem_.textContent = formatter(this.value.rawValue);
            this.tooltipElem_.style.left = `${x}px`;
        }
        refresh() {
            const formatter = this.props_.get('formatter');
            this.inputElement.value = formatter(this.value.rawValue);
        }
        onChange_() {
            this.refresh();
        }
    }

    class NumberTextController {
        constructor(doc, config) {
            var _a;
            this.originRawValue_ = 0;
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.onInputKeyDown_ = this.onInputKeyDown_.bind(this);
            this.onInputKeyUp_ = this.onInputKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.baseStep_ = config.baseStep;
            this.parser_ = config.parser;
            this.props = config.props;
            this.sliderProps_ = (_a = config.sliderProps) !== null && _a !== void 0 ? _a : null;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.dragging_ = createValue(null);
            this.view = new NumberTextView(doc, {
                arrayPosition: config.arrayPosition,
                dragging: this.dragging_,
                props: this.props,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
            this.view.inputElement.addEventListener('keydown', this.onInputKeyDown_);
            this.view.inputElement.addEventListener('keyup', this.onInputKeyUp_);
            const ph = new PointerHandler(this.view.knobElement);
            ph.emitter.on('down', this.onPointerDown_);
            ph.emitter.on('move', this.onPointerMove_);
            ph.emitter.on('up', this.onPointerUp_);
        }
        constrainValue_(value) {
            var _a, _b;
            const min = (_a = this.sliderProps_) === null || _a === void 0 ? void 0 : _a.get('minValue');
            const max = (_b = this.sliderProps_) === null || _b === void 0 ? void 0 : _b.get('maxValue');
            let v = value;
            if (min !== undefined) {
                v = Math.max(v, min);
            }
            if (max !== undefined) {
                v = Math.min(v, max);
            }
            return v;
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            const value = inputElem.value;
            const parsedValue = this.parser_(value);
            if (!isEmpty(parsedValue)) {
                this.value.rawValue = this.constrainValue_(parsedValue);
            }
            this.view.refresh();
        }
        onInputKeyDown_(ev) {
            const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.constrainValue_(this.value.rawValue + step), {
                forceEmit: false,
                last: false,
            });
        }
        onInputKeyUp_(ev) {
            const step = getStepForKey(this.baseStep_, getVerticalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
        onPointerDown_() {
            this.originRawValue_ = this.value.rawValue;
            this.dragging_.rawValue = 0;
        }
        computeDraggingValue_(data) {
            if (!data.point) {
                return null;
            }
            const dx = data.point.x - data.bounds.width / 2;
            return this.constrainValue_(this.originRawValue_ + dx * this.props.get('draggingScale'));
        }
        onPointerMove_(ev) {
            const v = this.computeDraggingValue_(ev.data);
            if (v === null) {
                return;
            }
            this.value.setRawValue(v, {
                forceEmit: false,
                last: false,
            });
            this.dragging_.rawValue = this.value.rawValue - this.originRawValue_;
        }
        onPointerUp_(ev) {
            const v = this.computeDraggingValue_(ev.data);
            if (v === null) {
                return;
            }
            this.value.setRawValue(v, {
                forceEmit: true,
                last: true,
            });
            this.dragging_.rawValue = null;
        }
    }

    const className$f = ClassName('sld');
    class SliderView {
        constructor(doc, config) {
            this.onChange_ = this.onChange_.bind(this);
            this.props_ = config.props;
            this.props_.emitter.on('change', this.onChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$f());
            config.viewProps.bindClassModifiers(this.element);
            const trackElem = doc.createElement('div');
            trackElem.classList.add(className$f('t'));
            config.viewProps.bindTabIndex(trackElem);
            this.element.appendChild(trackElem);
            this.trackElement = trackElem;
            const knobElem = doc.createElement('div');
            knobElem.classList.add(className$f('k'));
            this.trackElement.appendChild(knobElem);
            this.knobElement = knobElem;
            config.value.emitter.on('change', this.onChange_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const p = constrainRange(mapRange(this.value.rawValue, this.props_.get('minValue'), this.props_.get('maxValue'), 0, 100), 0, 100);
            this.knobElement.style.width = `${p}%`;
        }
        onChange_() {
            this.update_();
        }
    }

    class SliderController {
        constructor(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDownOrMove_ = this.onPointerDownOrMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.baseStep_ = config.baseStep;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.props = config.props;
            this.view = new SliderView(doc, {
                props: this.props,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.ptHandler_ = new PointerHandler(this.view.trackElement);
            this.ptHandler_.emitter.on('down', this.onPointerDownOrMove_);
            this.ptHandler_.emitter.on('move', this.onPointerDownOrMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.trackElement.addEventListener('keydown', this.onKeyDown_);
            this.view.trackElement.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) {
                return;
            }
            this.value.setRawValue(mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, this.props.get('minValue'), this.props.get('maxValue')), opts);
        }
        onPointerDownOrMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true,
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue + step, {
                forceEmit: false,
                last: false,
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(this.baseStep_, getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
    }

    const className$e = ClassName('sldtxt');
    class SliderTextView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$e());
            const sliderElem = doc.createElement('div');
            sliderElem.classList.add(className$e('s'));
            this.sliderView_ = config.sliderView;
            sliderElem.appendChild(this.sliderView_.element);
            this.element.appendChild(sliderElem);
            const textElem = doc.createElement('div');
            textElem.classList.add(className$e('t'));
            this.textView_ = config.textView;
            textElem.appendChild(this.textView_.element);
            this.element.appendChild(textElem);
        }
    }

    class SliderTextController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.sliderC_ = new SliderController(doc, {
                baseStep: config.baseStep,
                props: config.sliderProps,
                value: config.value,
                viewProps: this.viewProps,
            });
            this.textC_ = new NumberTextController(doc, {
                baseStep: config.baseStep,
                parser: config.parser,
                props: config.textProps,
                sliderProps: config.sliderProps,
                value: config.value,
                viewProps: config.viewProps,
            });
            this.view = new SliderTextView(doc, {
                sliderView: this.sliderC_.view,
                textView: this.textC_.view,
            });
        }
        get sliderController() {
            return this.sliderC_;
        }
        get textController() {
            return this.textC_;
        }
    }

    function writePrimitive(target, value) {
        target.write(value);
    }

    function parseListOptions(value) {
        const p = ParamsParsers;
        if (Array.isArray(value)) {
            return p.required.array(p.required.object({
                text: p.required.string,
                value: p.required.raw,
            }))(value).value;
        }
        if (typeof value === 'object') {
            return p.required.raw(value)
                .value;
        }
        return undefined;
    }
    function parsePickerLayout(value) {
        if (value === 'inline' || value === 'popup') {
            return value;
        }
        return undefined;
    }
    function parsePointDimensionParams(value) {
        const p = ParamsParsers;
        return p.required.object({
            max: p.optional.number,
            min: p.optional.number,
            step: p.optional.number,
        })(value).value;
    }
    function normalizeListOptions(options) {
        if (Array.isArray(options)) {
            return options;
        }
        const items = [];
        Object.keys(options).forEach((text) => {
            items.push({ text: text, value: options[text] });
        });
        return items;
    }
    function createListConstraint(options) {
        return !isEmpty(options)
            ? new ListConstraint(normalizeListOptions(forceCast(options)))
            : null;
    }
    function findStep(constraint) {
        const c = constraint ? findConstraint(constraint, StepConstraint) : null;
        if (!c) {
            return null;
        }
        return c.step;
    }
    function getSuitableDecimalDigits(constraint, rawValue) {
        const sc = constraint && findConstraint(constraint, StepConstraint);
        if (sc) {
            return getDecimalDigits(sc.step);
        }
        return Math.max(getDecimalDigits(rawValue), 2);
    }
    function getBaseStep(constraint) {
        const step = findStep(constraint);
        return step !== null && step !== void 0 ? step : 1;
    }
    function getSuitableDraggingScale(constraint, rawValue) {
        var _a;
        const sc = constraint && findConstraint(constraint, StepConstraint);
        const base = Math.abs((_a = sc === null || sc === void 0 ? void 0 : sc.step) !== null && _a !== void 0 ? _a : rawValue);
        return base === 0 ? 0.1 : Math.pow(10, Math.floor(Math.log10(base)) - 1);
    }

    const className$d = ClassName('ckb');
    class CheckboxView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className$d());
            config.viewProps.bindClassModifiers(this.element);
            const labelElem = doc.createElement('label');
            labelElem.classList.add(className$d('l'));
            this.element.appendChild(labelElem);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$d('i'));
            inputElem.type = 'checkbox';
            labelElem.appendChild(inputElem);
            this.inputElement = inputElem;
            config.viewProps.bindDisabled(this.inputElement);
            const wrapperElem = doc.createElement('div');
            wrapperElem.classList.add(className$d('w'));
            labelElem.appendChild(wrapperElem);
            const markElem = createSvgIconElement(doc, 'check');
            wrapperElem.appendChild(markElem);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            this.inputElement.checked = this.value.rawValue;
        }
        onValueChange_() {
            this.update_();
        }
    }

    class CheckboxController {
        constructor(doc, config) {
            this.onInputChange_ = this.onInputChange_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new CheckboxView(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view.inputElement.addEventListener('change', this.onInputChange_);
        }
        onInputChange_(e) {
            const inputElem = forceCast(e.currentTarget);
            this.value.rawValue = inputElem.checked;
        }
    }

    function createConstraint$6(params) {
        const constraints = [];
        const lc = createListConstraint(params.options);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    const BooleanInputPlugin = {
        id: 'input-bool',
        type: 'input',
        accept: (value, params) => {
            if (typeof value !== 'boolean') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                options: p.optional.custom(parseListOptions),
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => boolFromUnknown,
            constraint: (args) => createConstraint$6(args.params),
            writer: (_args) => writePrimitive,
        },
        controller: (args) => {
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) {
                return new ListController(doc, {
                    props: new ValueMap({
                        options: lc.values.value('options'),
                    }),
                    value: value,
                    viewProps: args.viewProps,
                });
            }
            return new CheckboxController(doc, {
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    const className$c = ClassName('col');
    class ColorView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$c());
            config.foldable.bindExpandedClass(this.element, className$c(undefined, 'expanded'));
            bindValueMap(config.foldable, 'completed', valueToClassName(this.element, className$c(undefined, 'cpl')));
            const headElem = doc.createElement('div');
            headElem.classList.add(className$c('h'));
            this.element.appendChild(headElem);
            const swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$c('s'));
            headElem.appendChild(swatchElem);
            this.swatchElement = swatchElem;
            const textElem = doc.createElement('div');
            textElem.classList.add(className$c('t'));
            headElem.appendChild(textElem);
            this.textElement = textElem;
            if (config.pickerLayout === 'inline') {
                const pickerElem = doc.createElement('div');
                pickerElem.classList.add(className$c('p'));
                this.element.appendChild(pickerElem);
                this.pickerElement = pickerElem;
            }
            else {
                this.pickerElement = null;
            }
        }
    }

    function rgbToHslInt(r, g, b) {
        const rp = constrainRange(r / 255, 0, 1);
        const gp = constrainRange(g / 255, 0, 1);
        const bp = constrainRange(b / 255, 0, 1);
        const cmax = Math.max(rp, gp, bp);
        const cmin = Math.min(rp, gp, bp);
        const c = cmax - cmin;
        let h = 0;
        let s = 0;
        const l = (cmin + cmax) / 2;
        if (c !== 0) {
            s = c / (1 - Math.abs(cmax + cmin - 1));
            if (rp === cmax) {
                h = (gp - bp) / c;
            }
            else if (gp === cmax) {
                h = 2 + (bp - rp) / c;
            }
            else {
                h = 4 + (rp - gp) / c;
            }
            h = h / 6 + (h < 0 ? 1 : 0);
        }
        return [h * 360, s * 100, l * 100];
    }
    function hslToRgbInt(h, s, l) {
        const hp = ((h % 360) + 360) % 360;
        const sp = constrainRange(s / 100, 0, 1);
        const lp = constrainRange(l / 100, 0, 1);
        const c = (1 - Math.abs(2 * lp - 1)) * sp;
        const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
        const m = lp - c / 2;
        let rp, gp, bp;
        if (hp >= 0 && hp < 60) {
            [rp, gp, bp] = [c, x, 0];
        }
        else if (hp >= 60 && hp < 120) {
            [rp, gp, bp] = [x, c, 0];
        }
        else if (hp >= 120 && hp < 180) {
            [rp, gp, bp] = [0, c, x];
        }
        else if (hp >= 180 && hp < 240) {
            [rp, gp, bp] = [0, x, c];
        }
        else if (hp >= 240 && hp < 300) {
            [rp, gp, bp] = [x, 0, c];
        }
        else {
            [rp, gp, bp] = [c, 0, x];
        }
        return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    function rgbToHsvInt(r, g, b) {
        const rp = constrainRange(r / 255, 0, 1);
        const gp = constrainRange(g / 255, 0, 1);
        const bp = constrainRange(b / 255, 0, 1);
        const cmax = Math.max(rp, gp, bp);
        const cmin = Math.min(rp, gp, bp);
        const d = cmax - cmin;
        let h;
        if (d === 0) {
            h = 0;
        }
        else if (cmax === rp) {
            h = 60 * (((((gp - bp) / d) % 6) + 6) % 6);
        }
        else if (cmax === gp) {
            h = 60 * ((bp - rp) / d + 2);
        }
        else {
            h = 60 * ((rp - gp) / d + 4);
        }
        const s = cmax === 0 ? 0 : d / cmax;
        const v = cmax;
        return [h, s * 100, v * 100];
    }
    function hsvToRgbInt(h, s, v) {
        const hp = loopRange(h, 360);
        const sp = constrainRange(s / 100, 0, 1);
        const vp = constrainRange(v / 100, 0, 1);
        const c = vp * sp;
        const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
        const m = vp - c;
        let rp, gp, bp;
        if (hp >= 0 && hp < 60) {
            [rp, gp, bp] = [c, x, 0];
        }
        else if (hp >= 60 && hp < 120) {
            [rp, gp, bp] = [x, c, 0];
        }
        else if (hp >= 120 && hp < 180) {
            [rp, gp, bp] = [0, c, x];
        }
        else if (hp >= 180 && hp < 240) {
            [rp, gp, bp] = [0, x, c];
        }
        else if (hp >= 240 && hp < 300) {
            [rp, gp, bp] = [x, 0, c];
        }
        else {
            [rp, gp, bp] = [c, 0, x];
        }
        return [(rp + m) * 255, (gp + m) * 255, (bp + m) * 255];
    }
    function hslToHsvInt(h, s, l) {
        const sd = l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100);
        return [
            h,
            sd !== 0 ? (s * (100 - Math.abs(2 * l - 100))) / sd : 0,
            l + (s * (100 - Math.abs(2 * l - 100))) / (2 * 100),
        ];
    }
    function hsvToHslInt(h, s, v) {
        const sd = 100 - Math.abs((v * (200 - s)) / 100 - 100);
        return [h, sd !== 0 ? (s * v) / sd : 0, (v * (200 - s)) / (2 * 100)];
    }
    function removeAlphaComponent(comps) {
        return [comps[0], comps[1], comps[2]];
    }
    function appendAlphaComponent(comps, alpha) {
        return [comps[0], comps[1], comps[2], alpha];
    }
    const MODE_CONVERTER_MAP = {
        hsl: {
            hsl: (h, s, l) => [h, s, l],
            hsv: hslToHsvInt,
            rgb: hslToRgbInt,
        },
        hsv: {
            hsl: hsvToHslInt,
            hsv: (h, s, v) => [h, s, v],
            rgb: hsvToRgbInt,
        },
        rgb: {
            hsl: rgbToHslInt,
            hsv: rgbToHsvInt,
            rgb: (r, g, b) => [r, g, b],
        },
    };
    function getColorMaxComponents(mode, type) {
        return [
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 360,
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
            type === 'float' ? 1 : mode === 'rgb' ? 255 : 100,
        ];
    }
    function loopHueRange(hue, max) {
        return hue === max ? max : loopRange(hue, max);
    }
    function constrainColorComponents(components, mode, type) {
        var _a;
        const ms = getColorMaxComponents(mode, type);
        return [
            mode === 'rgb'
                ? constrainRange(components[0], 0, ms[0])
                : loopHueRange(components[0], ms[0]),
            constrainRange(components[1], 0, ms[1]),
            constrainRange(components[2], 0, ms[2]),
            constrainRange((_a = components[3]) !== null && _a !== void 0 ? _a : 1, 0, 1),
        ];
    }
    function convertColorType(comps, mode, from, to) {
        const fms = getColorMaxComponents(mode, from);
        const tms = getColorMaxComponents(mode, to);
        return comps.map((c, index) => (c / fms[index]) * tms[index]);
    }
    function convertColor(components, from, to) {
        const intComps = convertColorType(components, from.mode, from.type, 'int');
        const result = MODE_CONVERTER_MAP[from.mode][to.mode](...intComps);
        return convertColorType(result, to.mode, 'int', to.type);
    }

    function isRgbColorComponent(obj, key) {
        if (typeof obj !== 'object' || isEmpty(obj)) {
            return false;
        }
        return key in obj && typeof obj[key] === 'number';
    }
    class Color {
        static black(type = 'int') {
            return new Color([0, 0, 0], 'rgb', type);
        }
        static fromObject(obj, type = 'int') {
            const comps = 'a' in obj ? [obj.r, obj.g, obj.b, obj.a] : [obj.r, obj.g, obj.b];
            return new Color(comps, 'rgb', type);
        }
        static toRgbaObject(color, type = 'int') {
            return color.toRgbaObject(type);
        }
        static isRgbColorObject(obj) {
            return (isRgbColorComponent(obj, 'r') &&
                isRgbColorComponent(obj, 'g') &&
                isRgbColorComponent(obj, 'b'));
        }
        static isRgbaColorObject(obj) {
            return this.isRgbColorObject(obj) && isRgbColorComponent(obj, 'a');
        }
        static isColorObject(obj) {
            return this.isRgbColorObject(obj);
        }
        static equals(v1, v2) {
            if (v1.mode !== v2.mode) {
                return false;
            }
            const comps1 = v1.comps_;
            const comps2 = v2.comps_;
            for (let i = 0; i < comps1.length; i++) {
                if (comps1[i] !== comps2[i]) {
                    return false;
                }
            }
            return true;
        }
        constructor(comps, mode, type = 'int') {
            this.mode = mode;
            this.type = type;
            this.comps_ = constrainColorComponents(comps, mode, type);
        }
        getComponents(opt_mode, type = 'int') {
            return appendAlphaComponent(convertColor(removeAlphaComponent(this.comps_), { mode: this.mode, type: this.type }, { mode: opt_mode !== null && opt_mode !== void 0 ? opt_mode : this.mode, type }), this.comps_[3]);
        }
        toRgbaObject(type = 'int') {
            const rgbComps = this.getComponents('rgb', type);
            return {
                r: rgbComps[0],
                g: rgbComps[1],
                b: rgbComps[2],
                a: rgbComps[3],
            };
        }
    }

    const className$b = ClassName('colp');
    class ColorPickerView {
        constructor(doc, config) {
            this.alphaViews_ = null;
            this.element = doc.createElement('div');
            this.element.classList.add(className$b());
            config.viewProps.bindClassModifiers(this.element);
            const hsvElem = doc.createElement('div');
            hsvElem.classList.add(className$b('hsv'));
            const svElem = doc.createElement('div');
            svElem.classList.add(className$b('sv'));
            this.svPaletteView_ = config.svPaletteView;
            svElem.appendChild(this.svPaletteView_.element);
            hsvElem.appendChild(svElem);
            const hElem = doc.createElement('div');
            hElem.classList.add(className$b('h'));
            this.hPaletteView_ = config.hPaletteView;
            hElem.appendChild(this.hPaletteView_.element);
            hsvElem.appendChild(hElem);
            this.element.appendChild(hsvElem);
            const rgbElem = doc.createElement('div');
            rgbElem.classList.add(className$b('rgb'));
            this.textView_ = config.textView;
            rgbElem.appendChild(this.textView_.element);
            this.element.appendChild(rgbElem);
            if (config.alphaViews) {
                this.alphaViews_ = {
                    palette: config.alphaViews.palette,
                    text: config.alphaViews.text,
                };
                const aElem = doc.createElement('div');
                aElem.classList.add(className$b('a'));
                const apElem = doc.createElement('div');
                apElem.classList.add(className$b('ap'));
                apElem.appendChild(this.alphaViews_.palette.element);
                aElem.appendChild(apElem);
                const atElem = doc.createElement('div');
                atElem.classList.add(className$b('at'));
                atElem.appendChild(this.alphaViews_.text.element);
                aElem.appendChild(atElem);
                this.element.appendChild(aElem);
            }
        }
        get allFocusableElements() {
            const elems = [
                this.svPaletteView_.element,
                this.hPaletteView_.element,
                this.textView_.modeSelectElement,
                ...this.textView_.textViews.map((v) => v.inputElement),
            ];
            if (this.alphaViews_) {
                elems.push(this.alphaViews_.palette.element, this.alphaViews_.text.inputElement);
            }
            return elems;
        }
    }

    function parseColorType(value) {
        return value === 'int' ? 'int' : value === 'float' ? 'float' : undefined;
    }
    function parseColorInputParams(params) {
        const p = ParamsParsers;
        return parseParams(params, {
            alpha: p.optional.boolean,
            color: p.optional.object({
                alpha: p.optional.boolean,
                type: p.optional.custom(parseColorType),
            }),
            expanded: p.optional.boolean,
            picker: p.optional.custom(parsePickerLayout),
        });
    }
    function getBaseStepForColor(forAlpha) {
        return forAlpha ? 0.1 : 1;
    }
    function extractColorType(params) {
        var _a;
        return (_a = params.color) === null || _a === void 0 ? void 0 : _a.type;
    }

    function equalsStringColorFormat(f1, f2) {
        return (f1.alpha === f2.alpha &&
            f1.mode === f2.mode &&
            f1.notation === f2.notation &&
            f1.type === f2.type);
    }
    function parseCssNumberOrPercentage(text, maxValue) {
        const m = text.match(/^(.+)%$/);
        if (!m) {
            return Math.min(parseFloat(text), maxValue);
        }
        return Math.min(parseFloat(m[1]) * 0.01 * maxValue, maxValue);
    }
    const ANGLE_TO_DEG_MAP = {
        deg: (angle) => angle,
        grad: (angle) => (angle * 360) / 400,
        rad: (angle) => (angle * 360) / (2 * Math.PI),
        turn: (angle) => angle * 360,
    };
    function parseCssNumberOrAngle(text) {
        const m = text.match(/^([0-9.]+?)(deg|grad|rad|turn)$/);
        if (!m) {
            return parseFloat(text);
        }
        const angle = parseFloat(m[1]);
        const unit = m[2];
        return ANGLE_TO_DEG_MAP[unit](angle);
    }
    function parseFunctionalRgbColorComponents(text) {
        const m = text.match(/^rgb\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseCssNumberOrPercentage(m[1], 255),
            parseCssNumberOrPercentage(m[2], 255),
            parseCssNumberOrPercentage(m[3], 255),
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
            return null;
        }
        return comps;
    }
    function createFunctionalRgbColorParser(type) {
        return (text) => {
            const comps = parseFunctionalRgbColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseFunctionalRgbaColorComponents(text) {
        const m = text.match(/^rgba\(\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseCssNumberOrPercentage(m[1], 255),
            parseCssNumberOrPercentage(m[2], 255),
            parseCssNumberOrPercentage(m[3], 255),
            parseCssNumberOrPercentage(m[4], 1),
        ];
        if (isNaN(comps[0]) ||
            isNaN(comps[1]) ||
            isNaN(comps[2]) ||
            isNaN(comps[3])) {
            return null;
        }
        return comps;
    }
    function createFunctionalRgbaColorParser(type) {
        return (text) => {
            const comps = parseFunctionalRgbaColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseHslColorComponents(text) {
        const m = text.match(/^hsl\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseCssNumberOrAngle(m[1]),
            parseCssNumberOrPercentage(m[2], 100),
            parseCssNumberOrPercentage(m[3], 100),
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
            return null;
        }
        return comps;
    }
    function createHslColorParser(type) {
        return (text) => {
            const comps = parseHslColorComponents(text);
            return comps ? new Color(comps, 'hsl', type) : null;
        };
    }
    function parseHslaColorComponents(text) {
        const m = text.match(/^hsla\(\s*([0-9A-Fa-f.]+(?:deg|grad|rad|turn)?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*,\s*([0-9A-Fa-f.]+%?)\s*\)$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseCssNumberOrAngle(m[1]),
            parseCssNumberOrPercentage(m[2], 100),
            parseCssNumberOrPercentage(m[3], 100),
            parseCssNumberOrPercentage(m[4], 1),
        ];
        if (isNaN(comps[0]) ||
            isNaN(comps[1]) ||
            isNaN(comps[2]) ||
            isNaN(comps[3])) {
            return null;
        }
        return comps;
    }
    function createHslaColorParser(type) {
        return (text) => {
            const comps = parseHslaColorComponents(text);
            return comps ? new Color(comps, 'hsl', type) : null;
        };
    }
    function parseHexRgbColorComponents(text) {
        const mRgb = text.match(/^#([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
        if (mRgb) {
            return [
                parseInt(mRgb[1] + mRgb[1], 16),
                parseInt(mRgb[2] + mRgb[2], 16),
                parseInt(mRgb[3] + mRgb[3], 16),
            ];
        }
        const mRrggbb = text.match(/^(?:#|0x)([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
        if (mRrggbb) {
            return [
                parseInt(mRrggbb[1], 16),
                parseInt(mRrggbb[2], 16),
                parseInt(mRrggbb[3], 16),
            ];
        }
        return null;
    }
    function parseHexRgbColor(text) {
        const comps = parseHexRgbColorComponents(text);
        return comps ? new Color(comps, 'rgb', 'int') : null;
    }
    function parseHexRgbaColorComponents(text) {
        const mRgb = text.match(/^#?([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])([0-9A-Fa-f])$/);
        if (mRgb) {
            return [
                parseInt(mRgb[1] + mRgb[1], 16),
                parseInt(mRgb[2] + mRgb[2], 16),
                parseInt(mRgb[3] + mRgb[3], 16),
                mapRange(parseInt(mRgb[4] + mRgb[4], 16), 0, 255, 0, 1),
            ];
        }
        const mRrggbb = text.match(/^(?:#|0x)?([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})$/);
        if (mRrggbb) {
            return [
                parseInt(mRrggbb[1], 16),
                parseInt(mRrggbb[2], 16),
                parseInt(mRrggbb[3], 16),
                mapRange(parseInt(mRrggbb[4], 16), 0, 255, 0, 1),
            ];
        }
        return null;
    }
    function parseHexRgbaColor(text) {
        const comps = parseHexRgbaColorComponents(text);
        return comps ? new Color(comps, 'rgb', 'int') : null;
    }
    function parseObjectRgbColorComponents(text) {
        const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseFloat(m[1]),
            parseFloat(m[2]),
            parseFloat(m[3]),
        ];
        if (isNaN(comps[0]) || isNaN(comps[1]) || isNaN(comps[2])) {
            return null;
        }
        return comps;
    }
    function createObjectRgbColorParser(type) {
        return (text) => {
            const comps = parseObjectRgbColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    function parseObjectRgbaColorComponents(text) {
        const m = text.match(/^\{\s*r\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*g\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*b\s*:\s*([0-9A-Fa-f.]+%?)\s*,\s*a\s*:\s*([0-9A-Fa-f.]+%?)\s*\}$/);
        if (!m) {
            return null;
        }
        const comps = [
            parseFloat(m[1]),
            parseFloat(m[2]),
            parseFloat(m[3]),
            parseFloat(m[4]),
        ];
        if (isNaN(comps[0]) ||
            isNaN(comps[1]) ||
            isNaN(comps[2]) ||
            isNaN(comps[3])) {
            return null;
        }
        return comps;
    }
    function createObjectRgbaColorParser(type) {
        return (text) => {
            const comps = parseObjectRgbaColorComponents(text);
            return comps ? new Color(comps, 'rgb', type) : null;
        };
    }
    const PARSER_AND_RESULT = [
        {
            parser: parseHexRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'hex',
            },
        },
        {
            parser: parseHexRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'hex',
            },
        },
        {
            parser: parseFunctionalRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'func',
            },
        },
        {
            parser: parseFunctionalRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'func',
            },
        },
        {
            parser: parseHslColorComponents,
            result: {
                alpha: false,
                mode: 'hsl',
                notation: 'func',
            },
        },
        {
            parser: parseHslaColorComponents,
            result: {
                alpha: true,
                mode: 'hsl',
                notation: 'func',
            },
        },
        {
            parser: parseObjectRgbColorComponents,
            result: {
                alpha: false,
                mode: 'rgb',
                notation: 'object',
            },
        },
        {
            parser: parseObjectRgbaColorComponents,
            result: {
                alpha: true,
                mode: 'rgb',
                notation: 'object',
            },
        },
    ];
    function detectStringColor(text) {
        return PARSER_AND_RESULT.reduce((prev, { parser, result: detection }) => {
            if (prev) {
                return prev;
            }
            return parser(text) ? detection : null;
        }, null);
    }
    function detectStringColorFormat(text, type = 'int') {
        const r = detectStringColor(text);
        if (!r) {
            return null;
        }
        if (r.notation === 'hex' && type !== 'float') {
            return Object.assign(Object.assign({}, r), { type: 'int' });
        }
        if (r.notation === 'func') {
            return Object.assign(Object.assign({}, r), { type: type });
        }
        return null;
    }
    const TYPE_TO_PARSERS = {
        int: [
            parseHexRgbColor,
            parseHexRgbaColor,
            createFunctionalRgbColorParser('int'),
            createFunctionalRgbaColorParser('int'),
            createHslColorParser('int'),
            createHslaColorParser('int'),
            createObjectRgbColorParser('int'),
            createObjectRgbaColorParser('int'),
        ],
        float: [
            createFunctionalRgbColorParser('float'),
            createFunctionalRgbaColorParser('float'),
            createHslColorParser('float'),
            createHslaColorParser('float'),
            createObjectRgbColorParser('float'),
            createObjectRgbaColorParser('float'),
        ],
    };
    function createColorStringBindingReader(type) {
        const parsers = TYPE_TO_PARSERS[type];
        return (value) => {
            if (typeof value !== 'string') {
                return Color.black(type);
            }
            const result = parsers.reduce((prev, parser) => {
                if (prev) {
                    return prev;
                }
                return parser(value);
            }, null);
            return result !== null && result !== void 0 ? result : Color.black(type);
        };
    }
    function createColorStringParser(type) {
        const parsers = TYPE_TO_PARSERS[type];
        return (value) => {
            return parsers.reduce((prev, parser) => {
                if (prev) {
                    return prev;
                }
                return parser(value);
            }, null);
        };
    }
    function zerofill(comp) {
        const hex = constrainRange(Math.floor(comp), 0, 255).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
    }
    function colorToHexRgbString(value, prefix = '#') {
        const hexes = removeAlphaComponent(value.getComponents('rgb'))
            .map(zerofill)
            .join('');
        return `${prefix}${hexes}`;
    }
    function colorToHexRgbaString(value, prefix = '#') {
        const rgbaComps = value.getComponents('rgb');
        const hexes = [rgbaComps[0], rgbaComps[1], rgbaComps[2], rgbaComps[3] * 255]
            .map(zerofill)
            .join('');
        return `${prefix}${hexes}`;
    }
    function colorToFunctionalRgbString(value, opt_type) {
        const formatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
        const comps = removeAlphaComponent(value.getComponents('rgb', opt_type)).map((comp) => formatter(comp));
        return `rgb(${comps.join(', ')})`;
    }
    function createFunctionalRgbColorFormatter(type) {
        return (value) => {
            return colorToFunctionalRgbString(value, type);
        };
    }
    function colorToFunctionalRgbaString(value, opt_type) {
        const aFormatter = createNumberFormatter(2);
        const rgbFormatter = createNumberFormatter(opt_type === 'float' ? 2 : 0);
        const comps = value.getComponents('rgb', opt_type).map((comp, index) => {
            const formatter = index === 3 ? aFormatter : rgbFormatter;
            return formatter(comp);
        });
        return `rgba(${comps.join(', ')})`;
    }
    function createFunctionalRgbaColorFormatter(type) {
        return (value) => {
            return colorToFunctionalRgbaString(value, type);
        };
    }
    function colorToFunctionalHslString(value) {
        const formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage,
        ];
        const comps = removeAlphaComponent(value.getComponents('hsl')).map((comp, index) => formatters[index](comp));
        return `hsl(${comps.join(', ')})`;
    }
    function colorToFunctionalHslaString(value) {
        const formatters = [
            createNumberFormatter(0),
            formatPercentage,
            formatPercentage,
            createNumberFormatter(2),
        ];
        const comps = value
            .getComponents('hsl')
            .map((comp, index) => formatters[index](comp));
        return `hsla(${comps.join(', ')})`;
    }
    function colorToObjectRgbString(value, type) {
        const formatter = createNumberFormatter(type === 'float' ? 2 : 0);
        const names = ['r', 'g', 'b'];
        const comps = removeAlphaComponent(value.getComponents('rgb', type)).map((comp, index) => `${names[index]}: ${formatter(comp)}`);
        return `{${comps.join(', ')}}`;
    }
    function createObjectRgbColorFormatter(type) {
        return (value) => colorToObjectRgbString(value, type);
    }
    function colorToObjectRgbaString(value, type) {
        const aFormatter = createNumberFormatter(2);
        const rgbFormatter = createNumberFormatter(type === 'float' ? 2 : 0);
        const names = ['r', 'g', 'b', 'a'];
        const comps = value.getComponents('rgb', type).map((comp, index) => {
            const formatter = index === 3 ? aFormatter : rgbFormatter;
            return `${names[index]}: ${formatter(comp)}`;
        });
        return `{${comps.join(', ')}}`;
    }
    function createObjectRgbaColorFormatter(type) {
        return (value) => colorToObjectRgbaString(value, type);
    }
    const FORMAT_AND_STRINGIFIERS = [
        {
            format: {
                alpha: false,
                mode: 'rgb',
                notation: 'hex',
                type: 'int',
            },
            stringifier: colorToHexRgbString,
        },
        {
            format: {
                alpha: true,
                mode: 'rgb',
                notation: 'hex',
                type: 'int',
            },
            stringifier: colorToHexRgbaString,
        },
        {
            format: {
                alpha: false,
                mode: 'hsl',
                notation: 'func',
                type: 'int',
            },
            stringifier: colorToFunctionalHslString,
        },
        {
            format: {
                alpha: true,
                mode: 'hsl',
                notation: 'func',
                type: 'int',
            },
            stringifier: colorToFunctionalHslaString,
        },
        ...['int', 'float'].reduce((prev, type) => {
            return [
                ...prev,
                {
                    format: {
                        alpha: false,
                        mode: 'rgb',
                        notation: 'func',
                        type: type,
                    },
                    stringifier: createFunctionalRgbColorFormatter(type),
                },
                {
                    format: {
                        alpha: true,
                        mode: 'rgb',
                        notation: 'func',
                        type: type,
                    },
                    stringifier: createFunctionalRgbaColorFormatter(type),
                },
                {
                    format: {
                        alpha: false,
                        mode: 'rgb',
                        notation: 'object',
                        type: type,
                    },
                    stringifier: createObjectRgbColorFormatter(type),
                },
                {
                    format: {
                        alpha: true,
                        mode: 'rgb',
                        notation: 'object',
                        type: type,
                    },
                    stringifier: createObjectRgbaColorFormatter(type),
                },
            ];
        }, []),
    ];
    function findColorStringifier(format) {
        return FORMAT_AND_STRINGIFIERS.reduce((prev, fas) => {
            if (prev) {
                return prev;
            }
            return equalsStringColorFormat(fas.format, format)
                ? fas.stringifier
                : null;
        }, null);
    }

    const className$a = ClassName('apl');
    class APaletteView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$a());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const barElem = doc.createElement('div');
            barElem.classList.add(className$a('b'));
            this.element.appendChild(barElem);
            const colorElem = doc.createElement('div');
            colorElem.classList.add(className$a('c'));
            barElem.appendChild(colorElem);
            this.colorElem_ = colorElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$a('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            const previewElem = doc.createElement('div');
            previewElem.classList.add(className$a('p'));
            this.markerElem_.appendChild(previewElem);
            this.previewElem_ = previewElem;
            this.update_();
        }
        update_() {
            const c = this.value.rawValue;
            const rgbaComps = c.getComponents('rgb');
            const leftColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 0], 'rgb');
            const rightColor = new Color([rgbaComps[0], rgbaComps[1], rgbaComps[2], 255], 'rgb');
            const gradientComps = [
                'to right',
                colorToFunctionalRgbaString(leftColor),
                colorToFunctionalRgbaString(rightColor),
            ];
            this.colorElem_.style.background = `linear-gradient(${gradientComps.join(',')})`;
            this.previewElem_.style.backgroundColor = colorToFunctionalRgbaString(c);
            const left = mapRange(rgbaComps[3], 0, 1, 0, 100);
            this.markerElem_.style.left = `${left}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }

    class APaletteController {
        constructor(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new APaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) {
                return;
            }
            const alpha = d.point.x / d.bounds.width;
            const c = this.value.rawValue;
            const [h, s, v] = c.getComponents('hsv');
            this.value.setRawValue(new Color([h, s, v, alpha], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true,
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            const c = this.value.rawValue;
            const [h, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([h, s, v, a + step], 'hsv'), {
                forceEmit: false,
                last: false,
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(getBaseStepForColor(true), getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
    }

    const className$9 = ClassName('coltxt');
    function createModeSelectElement(doc) {
        const selectElem = doc.createElement('select');
        const items = [
            { text: 'RGB', value: 'rgb' },
            { text: 'HSL', value: 'hsl' },
            { text: 'HSV', value: 'hsv' },
        ];
        selectElem.appendChild(items.reduce((frag, item) => {
            const optElem = doc.createElement('option');
            optElem.textContent = item.text;
            optElem.value = item.value;
            frag.appendChild(optElem);
            return frag;
        }, doc.createDocumentFragment()));
        return selectElem;
    }
    class ColorTextView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$9());
            config.viewProps.bindClassModifiers(this.element);
            const modeElem = doc.createElement('div');
            modeElem.classList.add(className$9('m'));
            this.modeElem_ = createModeSelectElement(doc);
            this.modeElem_.classList.add(className$9('ms'));
            modeElem.appendChild(this.modeSelectElement);
            config.viewProps.bindDisabled(this.modeElem_);
            const modeMarkerElem = doc.createElement('div');
            modeMarkerElem.classList.add(className$9('mm'));
            modeMarkerElem.appendChild(createSvgIconElement(doc, 'dropdown'));
            modeElem.appendChild(modeMarkerElem);
            this.element.appendChild(modeElem);
            const textsElem = doc.createElement('div');
            textsElem.classList.add(className$9('w'));
            this.element.appendChild(textsElem);
            this.textsElem_ = textsElem;
            this.textViews_ = config.textViews;
            this.applyTextViews_();
            bindValue(config.colorMode, (mode) => {
                this.modeElem_.value = mode;
            });
        }
        get modeSelectElement() {
            return this.modeElem_;
        }
        get textViews() {
            return this.textViews_;
        }
        set textViews(textViews) {
            this.textViews_ = textViews;
            this.applyTextViews_();
        }
        applyTextViews_() {
            removeChildElements(this.textsElem_);
            const doc = this.element.ownerDocument;
            this.textViews_.forEach((v) => {
                const compElem = doc.createElement('div');
                compElem.classList.add(className$9('c'));
                compElem.appendChild(v.element);
                this.textsElem_.appendChild(compElem);
            });
        }
    }

    function createFormatter$2(type) {
        return createNumberFormatter(type === 'float' ? 2 : 0);
    }
    function createConstraint$5(mode, type, index) {
        const max = getColorMaxComponents(mode, type)[index];
        return new DefiniteRangeConstraint({
            min: 0,
            max: max,
        });
    }
    function createComponentController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === 3 - 1 ? 'lst' : 'mid',
            baseStep: getBaseStepForColor(false),
            parser: config.parser,
            props: ValueMap.fromObject({
                draggingScale: config.colorType === 'float' ? 0.01 : 1,
                formatter: createFormatter$2(config.colorType),
            }),
            value: createValue(0, {
                constraint: createConstraint$5(config.colorMode, config.colorType, index),
            }),
            viewProps: config.viewProps,
        });
    }
    class ColorTextController {
        constructor(doc, config) {
            this.onModeSelectChange_ = this.onModeSelectChange_.bind(this);
            this.colorType_ = config.colorType;
            this.parser_ = config.parser;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.colorMode = createValue(this.value.rawValue.mode);
            this.ccs_ = this.createComponentControllers_(doc);
            this.view = new ColorTextView(doc, {
                colorMode: this.colorMode,
                textViews: [this.ccs_[0].view, this.ccs_[1].view, this.ccs_[2].view],
                viewProps: this.viewProps,
            });
            this.view.modeSelectElement.addEventListener('change', this.onModeSelectChange_);
        }
        createComponentControllers_(doc) {
            const cc = {
                colorMode: this.colorMode.rawValue,
                colorType: this.colorType_,
                parser: this.parser_,
                viewProps: this.viewProps,
            };
            const ccs = [
                createComponentController(doc, cc, 0),
                createComponentController(doc, cc, 1),
                createComponentController(doc, cc, 2),
            ];
            ccs.forEach((cs, index) => {
                connectValues({
                    primary: this.value,
                    secondary: cs.value,
                    forward: (p) => {
                        return p.rawValue.getComponents(this.colorMode.rawValue, this.colorType_)[index];
                    },
                    backward: (p, s) => {
                        const pickedMode = this.colorMode.rawValue;
                        const comps = p.rawValue.getComponents(pickedMode, this.colorType_);
                        comps[index] = s.rawValue;
                        return new Color(appendAlphaComponent(removeAlphaComponent(comps), comps[3]), pickedMode, this.colorType_);
                    },
                });
            });
            return ccs;
        }
        onModeSelectChange_(ev) {
            const selectElem = ev.currentTarget;
            this.colorMode.rawValue = selectElem.value;
            this.ccs_ = this.createComponentControllers_(this.view.element.ownerDocument);
            this.view.textViews = [
                this.ccs_[0].view,
                this.ccs_[1].view,
                this.ccs_[2].view,
            ];
        }
    }

    const className$8 = ClassName('hpl');
    class HPaletteView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$8());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const colorElem = doc.createElement('div');
            colorElem.classList.add(className$8('c'));
            this.element.appendChild(colorElem);
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$8('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update_();
        }
        update_() {
            const c = this.value.rawValue;
            const [h] = c.getComponents('hsv');
            this.markerElem_.style.backgroundColor = colorToFunctionalRgbString(new Color([h, 100, 100], 'hsv'));
            const left = mapRange(h, 0, 360, 0, 100);
            this.markerElem_.style.left = `${left}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }

    class HPaletteController {
        constructor(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new HPaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) {
                return;
            }
            const hue = mapRange(constrainRange(d.point.x, 0, d.bounds.width), 0, d.bounds.width, 0, 360);
            const c = this.value.rawValue;
            const [, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([hue, s, v, a], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true,
            });
        }
        onKeyDown_(ev) {
            const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            const c = this.value.rawValue;
            const [h, s, v, a] = c.getComponents('hsv');
            this.value.setRawValue(new Color([h + step, s, v, a], 'hsv'), {
                forceEmit: false,
                last: false,
            });
        }
        onKeyUp_(ev) {
            const step = getStepForKey(getBaseStepForColor(false), getHorizontalStepKeys(ev));
            if (step === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
    }

    const className$7 = ClassName('svp');
    const CANVAS_RESOL = 64;
    class SvPaletteView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.value = config.value;
            this.value.emitter.on('change', this.onValueChange_);
            this.element = doc.createElement('div');
            this.element.classList.add(className$7());
            config.viewProps.bindClassModifiers(this.element);
            config.viewProps.bindTabIndex(this.element);
            const canvasElem = doc.createElement('canvas');
            canvasElem.height = CANVAS_RESOL;
            canvasElem.width = CANVAS_RESOL;
            canvasElem.classList.add(className$7('c'));
            this.element.appendChild(canvasElem);
            this.canvasElement = canvasElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$7('m'));
            this.element.appendChild(markerElem);
            this.markerElem_ = markerElem;
            this.update_();
        }
        update_() {
            const ctx = getCanvasContext(this.canvasElement);
            if (!ctx) {
                return;
            }
            const c = this.value.rawValue;
            const hsvComps = c.getComponents('hsv');
            const width = this.canvasElement.width;
            const height = this.canvasElement.height;
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            for (let iy = 0; iy < height; iy++) {
                for (let ix = 0; ix < width; ix++) {
                    const s = mapRange(ix, 0, width, 0, 100);
                    const v = mapRange(iy, 0, height, 100, 0);
                    const rgbComps = hsvToRgbInt(hsvComps[0], s, v);
                    const i = (iy * width + ix) * 4;
                    data[i] = rgbComps[0];
                    data[i + 1] = rgbComps[1];
                    data[i + 2] = rgbComps[2];
                    data[i + 3] = 255;
                }
            }
            ctx.putImageData(imgData, 0, 0);
            const left = mapRange(hsvComps[1], 0, 100, 0, 100);
            this.markerElem_.style.left = `${left}%`;
            const top = mapRange(hsvComps[2], 0, 100, 100, 0);
            this.markerElem_.style.top = `${top}%`;
        }
        onValueChange_() {
            this.update_();
        }
    }

    class SvPaletteController {
        constructor(doc, config) {
            this.onKeyDown_ = this.onKeyDown_.bind(this);
            this.onKeyUp_ = this.onKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new SvPaletteView(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.ptHandler_ = new PointerHandler(this.view.element);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.element.addEventListener('keydown', this.onKeyDown_);
            this.view.element.addEventListener('keyup', this.onKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) {
                return;
            }
            const saturation = mapRange(d.point.x, 0, d.bounds.width, 0, 100);
            const value = mapRange(d.point.y, 0, d.bounds.height, 100, 0);
            const [h, , , a] = this.value.rawValue.getComponents('hsv');
            this.value.setRawValue(new Color([h, saturation, value, a], 'hsv'), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true,
            });
        }
        onKeyDown_(ev) {
            if (isArrowKey(ev.key)) {
                ev.preventDefault();
            }
            const [h, s, v, a] = this.value.rawValue.getComponents('hsv');
            const baseStep = getBaseStepForColor(false);
            const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
            const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
            if (ds === 0 && dv === 0) {
                return;
            }
            this.value.setRawValue(new Color([h, s + ds, v + dv, a], 'hsv'), {
                forceEmit: false,
                last: false,
            });
        }
        onKeyUp_(ev) {
            const baseStep = getBaseStepForColor(false);
            const ds = getStepForKey(baseStep, getHorizontalStepKeys(ev));
            const dv = getStepForKey(baseStep, getVerticalStepKeys(ev));
            if (ds === 0 && dv === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
    }

    class ColorPickerController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.hPaletteC_ = new HPaletteController(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.svPaletteC_ = new SvPaletteController(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            this.alphaIcs_ = config.supportsAlpha
                ? {
                    palette: new APaletteController(doc, {
                        value: this.value,
                        viewProps: this.viewProps,
                    }),
                    text: new NumberTextController(doc, {
                        parser: parseNumber,
                        baseStep: 0.1,
                        props: ValueMap.fromObject({
                            draggingScale: 0.01,
                            formatter: createNumberFormatter(2),
                        }),
                        value: createValue(0, {
                            constraint: new DefiniteRangeConstraint({ min: 0, max: 1 }),
                        }),
                        viewProps: this.viewProps,
                    }),
                }
                : null;
            if (this.alphaIcs_) {
                connectValues({
                    primary: this.value,
                    secondary: this.alphaIcs_.text.value,
                    forward: (p) => {
                        return p.rawValue.getComponents()[3];
                    },
                    backward: (p, s) => {
                        const comps = p.rawValue.getComponents();
                        comps[3] = s.rawValue;
                        return new Color(comps, p.rawValue.mode);
                    },
                });
            }
            this.textC_ = new ColorTextController(doc, {
                colorType: config.colorType,
                parser: parseNumber,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view = new ColorPickerView(doc, {
                alphaViews: this.alphaIcs_
                    ? {
                        palette: this.alphaIcs_.palette.view,
                        text: this.alphaIcs_.text.view,
                    }
                    : null,
                hPaletteView: this.hPaletteC_.view,
                supportsAlpha: config.supportsAlpha,
                svPaletteView: this.svPaletteC_.view,
                textView: this.textC_.view,
                viewProps: this.viewProps,
            });
        }
        get textController() {
            return this.textC_;
        }
    }

    const className$6 = ClassName('colsw');
    class ColorSwatchView {
        constructor(doc, config) {
            this.onValueChange_ = this.onValueChange_.bind(this);
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.element = doc.createElement('div');
            this.element.classList.add(className$6());
            config.viewProps.bindClassModifiers(this.element);
            const swatchElem = doc.createElement('div');
            swatchElem.classList.add(className$6('sw'));
            this.element.appendChild(swatchElem);
            this.swatchElem_ = swatchElem;
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$6('b'));
            config.viewProps.bindDisabled(buttonElem);
            this.element.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            this.update_();
        }
        update_() {
            const value = this.value.rawValue;
            this.swatchElem_.style.backgroundColor = colorToHexRgbaString(value);
        }
        onValueChange_() {
            this.update_();
        }
    }

    class ColorSwatchController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new ColorSwatchView(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
        }
    }

    class ColorController {
        constructor(doc, config) {
            this.onButtonBlur_ = this.onButtonBlur_.bind(this);
            this.onButtonClick_ = this.onButtonClick_.bind(this);
            this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
            this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.foldable_ = Foldable.create(config.expanded);
            this.swatchC_ = new ColorSwatchController(doc, {
                value: this.value,
                viewProps: this.viewProps,
            });
            const buttonElem = this.swatchC_.view.buttonElement;
            buttonElem.addEventListener('blur', this.onButtonBlur_);
            buttonElem.addEventListener('click', this.onButtonClick_);
            this.textC_ = new TextController(doc, {
                parser: config.parser,
                props: ValueMap.fromObject({
                    formatter: config.formatter,
                }),
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view = new ColorView(doc, {
                foldable: this.foldable_,
                pickerLayout: config.pickerLayout,
            });
            this.view.swatchElement.appendChild(this.swatchC_.view.element);
            this.view.textElement.appendChild(this.textC_.view.element);
            this.popC_ =
                config.pickerLayout === 'popup'
                    ? new PopupController(doc, {
                        viewProps: this.viewProps,
                    })
                    : null;
            const pickerC = new ColorPickerController(doc, {
                colorType: config.colorType,
                supportsAlpha: config.supportsAlpha,
                value: this.value,
                viewProps: this.viewProps,
            });
            pickerC.view.allFocusableElements.forEach((elem) => {
                elem.addEventListener('blur', this.onPopupChildBlur_);
                elem.addEventListener('keydown', this.onPopupChildKeydown_);
            });
            this.pickerC_ = pickerC;
            if (this.popC_) {
                this.view.element.appendChild(this.popC_.view.element);
                this.popC_.view.element.appendChild(pickerC.view.element);
                connectValues({
                    primary: this.foldable_.value('expanded'),
                    secondary: this.popC_.shows,
                    forward: (p) => p.rawValue,
                    backward: (_, s) => s.rawValue,
                });
            }
            else if (this.view.pickerElement) {
                this.view.pickerElement.appendChild(this.pickerC_.view.element);
                bindFoldable(this.foldable_, this.view.pickerElement);
            }
        }
        get textController() {
            return this.textC_;
        }
        onButtonBlur_(e) {
            if (!this.popC_) {
                return;
            }
            const elem = this.view.element;
            const nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) {
                this.popC_.shows.rawValue = false;
            }
        }
        onButtonClick_() {
            this.foldable_.set('expanded', !this.foldable_.get('expanded'));
            if (this.foldable_.get('expanded')) {
                this.pickerC_.view.allFocusableElements[0].focus();
            }
        }
        onPopupChildBlur_(ev) {
            if (!this.popC_) {
                return;
            }
            const elem = this.popC_.view.element;
            const nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) {
                return;
            }
            if (nextTarget &&
                nextTarget === this.swatchC_.view.buttonElement &&
                !supportsTouch(elem.ownerDocument)) {
                return;
            }
            this.popC_.shows.rawValue = false;
        }
        onPopupChildKeydown_(ev) {
            if (this.popC_) {
                if (ev.key === 'Escape') {
                    this.popC_.shows.rawValue = false;
                }
            }
            else if (this.view.pickerElement) {
                if (ev.key === 'Escape') {
                    this.swatchC_.view.buttonElement.focus();
                }
            }
        }
    }

    function colorFromObject(value, opt_type) {
        if (Color.isColorObject(value)) {
            return Color.fromObject(value, opt_type);
        }
        return Color.black(opt_type);
    }
    function colorToRgbNumber(value) {
        return removeAlphaComponent(value.getComponents('rgb')).reduce((result, comp) => {
            return (result << 8) | (Math.floor(comp) & 0xff);
        }, 0);
    }
    function colorToRgbaNumber(value) {
        return (value.getComponents('rgb').reduce((result, comp, index) => {
            const hex = Math.floor(index === 3 ? comp * 255 : comp) & 0xff;
            return (result << 8) | hex;
        }, 0) >>> 0);
    }
    function numberToRgbColor(num) {
        return new Color([(num >> 16) & 0xff, (num >> 8) & 0xff, num & 0xff], 'rgb');
    }
    function numberToRgbaColor(num) {
        return new Color([
            (num >> 24) & 0xff,
            (num >> 16) & 0xff,
            (num >> 8) & 0xff,
            mapRange(num & 0xff, 0, 255, 0, 1),
        ], 'rgb');
    }
    function colorFromRgbNumber(value) {
        if (typeof value !== 'number') {
            return Color.black();
        }
        return numberToRgbColor(value);
    }
    function colorFromRgbaNumber(value) {
        if (typeof value !== 'number') {
            return Color.black();
        }
        return numberToRgbaColor(value);
    }

    function createColorStringWriter(format) {
        const stringify = findColorStringifier(format);
        return stringify
            ? (target, value) => {
                writePrimitive(target, stringify(value));
            }
            : null;
    }
    function createColorNumberWriter(supportsAlpha) {
        const colorToNumber = supportsAlpha ? colorToRgbaNumber : colorToRgbNumber;
        return (target, value) => {
            writePrimitive(target, colorToNumber(value));
        };
    }
    function writeRgbaColorObject(target, value, opt_type) {
        const obj = value.toRgbaObject(opt_type);
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
        target.writeProperty('a', obj.a);
    }
    function writeRgbColorObject(target, value, opt_type) {
        const obj = value.toRgbaObject(opt_type);
        target.writeProperty('r', obj.r);
        target.writeProperty('g', obj.g);
        target.writeProperty('b', obj.b);
    }
    function createColorObjectWriter(supportsAlpha, opt_type) {
        return (target, inValue) => {
            if (supportsAlpha) {
                writeRgbaColorObject(target, inValue, opt_type);
            }
            else {
                writeRgbColorObject(target, inValue, opt_type);
            }
        };
    }

    function shouldSupportAlpha$1(inputParams) {
        var _a;
        if ((inputParams === null || inputParams === void 0 ? void 0 : inputParams.alpha) || ((_a = inputParams === null || inputParams === void 0 ? void 0 : inputParams.color) === null || _a === void 0 ? void 0 : _a.alpha)) {
            return true;
        }
        return false;
    }
    function createFormatter$1(supportsAlpha) {
        return supportsAlpha
            ? (v) => colorToHexRgbaString(v, '0x')
            : (v) => colorToHexRgbString(v, '0x');
    }
    function isForColor(params) {
        if ('color' in params) {
            return true;
        }
        if ('view' in params && params.view === 'color') {
            return true;
        }
        return false;
    }
    const NumberColorInputPlugin = {
        id: 'input-color-number',
        type: 'input',
        accept: (value, params) => {
            if (typeof value !== 'number') {
                return null;
            }
            if (!isForColor(params)) {
                return null;
            }
            const result = parseColorInputParams(params);
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (args) => {
                return shouldSupportAlpha$1(args.params)
                    ? colorFromRgbaNumber
                    : colorFromRgbNumber;
            },
            equals: Color.equals,
            writer: (args) => {
                return createColorNumberWriter(shouldSupportAlpha$1(args.params));
            },
        },
        controller: (args) => {
            const supportsAlpha = shouldSupportAlpha$1(args.params);
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new ColorController(args.document, {
                colorType: 'int',
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: createFormatter$1(supportsAlpha),
                parser: createColorStringParser('int'),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: supportsAlpha,
                value: args.value,
                viewProps: args.viewProps,
            });
        },
    };

    function shouldSupportAlpha(initialValue) {
        return Color.isRgbaColorObject(initialValue);
    }
    function createColorObjectReader(opt_type) {
        return (value) => {
            return colorFromObject(value, opt_type);
        };
    }
    function createColorObjectFormatter(supportsAlpha, type) {
        return (value) => {
            if (supportsAlpha) {
                return colorToObjectRgbaString(value, type);
            }
            return colorToObjectRgbString(value, type);
        };
    }
    const ObjectColorInputPlugin = {
        id: 'input-color-object',
        type: 'input',
        accept: (value, params) => {
            if (!Color.isColorObject(value)) {
                return null;
            }
            const result = parseColorInputParams(params);
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (args) => createColorObjectReader(extractColorType(args.params)),
            equals: Color.equals,
            writer: (args) => createColorObjectWriter(shouldSupportAlpha(args.initialValue), extractColorType(args.params)),
        },
        controller: (args) => {
            var _a;
            const supportsAlpha = Color.isRgbaColorObject(args.initialValue);
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            const type = (_a = extractColorType(args.params)) !== null && _a !== void 0 ? _a : 'int';
            return new ColorController(args.document, {
                colorType: type,
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: createColorObjectFormatter(supportsAlpha, type),
                parser: createColorStringParser(type),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: supportsAlpha,
                value: args.value,
                viewProps: args.viewProps,
            });
        },
    };

    const StringColorInputPlugin = {
        id: 'input-color-string',
        type: 'input',
        accept: (value, params) => {
            if (typeof value !== 'string') {
                return null;
            }
            if ('view' in params && params.view === 'text') {
                return null;
            }
            const format = detectStringColorFormat(value, extractColorType(params));
            if (!format) {
                return null;
            }
            const stringifier = findColorStringifier(format);
            if (!stringifier) {
                return null;
            }
            const result = parseColorInputParams(params);
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (args) => { var _a; return createColorStringBindingReader((_a = extractColorType(args.params)) !== null && _a !== void 0 ? _a : 'int'); },
            equals: Color.equals,
            writer: (args) => {
                const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
                if (!format) {
                    throw TpError.shouldNeverHappen();
                }
                const writer = createColorStringWriter(format);
                if (!writer) {
                    throw TpError.notBindable();
                }
                return writer;
            },
        },
        controller: (args) => {
            const format = detectStringColorFormat(args.initialValue, extractColorType(args.params));
            if (!format) {
                throw TpError.shouldNeverHappen();
            }
            const stringifier = findColorStringifier(format);
            if (!stringifier) {
                throw TpError.shouldNeverHappen();
            }
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new ColorController(args.document, {
                colorType: format.type,
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                formatter: stringifier,
                parser: createColorStringParser(format.type),
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                supportsAlpha: format.alpha,
                value: args.value,
                viewProps: args.viewProps,
            });
        },
    };

    class PointNdConstraint {
        constructor(config) {
            this.components = config.components;
            this.asm_ = config.assembly;
        }
        constrain(value) {
            const comps = this.asm_
                .toComponents(value)
                .map((comp, index) => { var _a, _b; return (_b = (_a = this.components[index]) === null || _a === void 0 ? void 0 : _a.constrain(comp)) !== null && _b !== void 0 ? _b : comp; });
            return this.asm_.fromComponents(comps);
        }
    }

    const className$5 = ClassName('pndtxt');
    class PointNdTextView {
        constructor(doc, config) {
            this.textViews = config.textViews;
            this.element = doc.createElement('div');
            this.element.classList.add(className$5());
            this.textViews.forEach((v) => {
                const axisElem = doc.createElement('div');
                axisElem.classList.add(className$5('a'));
                axisElem.appendChild(v.element);
                this.element.appendChild(axisElem);
            });
        }
    }

    function createAxisController(doc, config, index) {
        return new NumberTextController(doc, {
            arrayPosition: index === 0 ? 'fst' : index === config.axes.length - 1 ? 'lst' : 'mid',
            baseStep: config.axes[index].baseStep,
            parser: config.parser,
            props: config.axes[index].textProps,
            value: createValue(0, {
                constraint: config.axes[index].constraint,
            }),
            viewProps: config.viewProps,
        });
    }
    class PointNdTextController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.acs_ = config.axes.map((_, index) => createAxisController(doc, config, index));
            this.acs_.forEach((c, index) => {
                connectValues({
                    primary: this.value,
                    secondary: c.value,
                    forward: (p) => {
                        return config.assembly.toComponents(p.rawValue)[index];
                    },
                    backward: (p, s) => {
                        const comps = config.assembly.toComponents(p.rawValue);
                        comps[index] = s.rawValue;
                        return config.assembly.fromComponents(comps);
                    },
                });
            });
            this.view = new PointNdTextView(doc, {
                textViews: this.acs_.map((ac) => ac.view),
            });
        }
    }

    function createStepConstraint(params, initialValue) {
        if ('step' in params && !isEmpty(params.step)) {
            return new StepConstraint(params.step, initialValue);
        }
        return null;
    }
    function createRangeConstraint(params) {
        if (!isEmpty(params.max) && !isEmpty(params.min)) {
            return new DefiniteRangeConstraint({
                max: params.max,
                min: params.min,
            });
        }
        if (!isEmpty(params.max) || !isEmpty(params.min)) {
            return new RangeConstraint({
                max: params.max,
                min: params.min,
            });
        }
        return null;
    }
    function findNumberRange(c) {
        const drc = findConstraint(c, DefiniteRangeConstraint);
        if (drc) {
            return [drc.values.get('min'), drc.values.get('max')];
        }
        const rc = findConstraint(c, RangeConstraint);
        if (rc) {
            return [rc.minValue, rc.maxValue];
        }
        return [undefined, undefined];
    }
    function createConstraint$4(params,
    initialValue) {
        const constraints = [];
        const sc = createStepConstraint(params, initialValue);
        if (sc) {
            constraints.push(sc);
        }
        const rc = createRangeConstraint(params);
        if (rc) {
            constraints.push(rc);
        }
        const lc = createListConstraint(params.options);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    const NumberInputPlugin = {
        id: 'input-number',
        type: 'input',
        accept: (value, params) => {
            if (typeof value !== 'number') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                format: p.optional.function,
                max: p.optional.number,
                min: p.optional.number,
                options: p.optional.custom(parseListOptions),
                step: p.optional.number,
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => numberFromUnknown,
            constraint: (args) => createConstraint$4(args.params, args.initialValue),
            writer: (_args) => writePrimitive,
        },
        controller: (args) => {
            var _a;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) {
                return new ListController(args.document, {
                    props: new ValueMap({
                        options: lc.values.value('options'),
                    }),
                    value: value,
                    viewProps: args.viewProps,
                });
            }
            const formatter = (_a = ('format' in args.params ? args.params.format : undefined)) !== null && _a !== void 0 ? _a : createNumberFormatter(getSuitableDecimalDigits(c, value.rawValue));
            const drc = c && findConstraint(c, DefiniteRangeConstraint);
            if (drc) {
                return new SliderTextController(args.document, {
                    baseStep: getBaseStep(c),
                    parser: parseNumber,
                    sliderProps: new ValueMap({
                        maxValue: drc.values.value('max'),
                        minValue: drc.values.value('min'),
                    }),
                    textProps: ValueMap.fromObject({
                        draggingScale: getSuitableDraggingScale(c, value.rawValue),
                        formatter: formatter,
                    }),
                    value: value,
                    viewProps: args.viewProps,
                });
            }
            return new NumberTextController(args.document, {
                baseStep: getBaseStep(c),
                parser: parseNumber,
                props: ValueMap.fromObject({
                    draggingScale: getSuitableDraggingScale(c, value.rawValue),
                    formatter: formatter,
                }),
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    class Point2d {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
        getComponents() {
            return [this.x, this.y];
        }
        static isObject(obj) {
            if (isEmpty(obj)) {
                return false;
            }
            const x = obj.x;
            const y = obj.y;
            if (typeof x !== 'number' || typeof y !== 'number') {
                return false;
            }
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y,
            };
        }
    }
    const Point2dAssembly = {
        toComponents: (p) => p.getComponents(),
        fromComponents: (comps) => new Point2d(...comps),
    };

    const className$4 = ClassName('p2d');
    class Point2dView {
        constructor(doc, config) {
            this.element = doc.createElement('div');
            this.element.classList.add(className$4());
            config.viewProps.bindClassModifiers(this.element);
            bindValue(config.expanded, valueToClassName(this.element, className$4(undefined, 'expanded')));
            const headElem = doc.createElement('div');
            headElem.classList.add(className$4('h'));
            this.element.appendChild(headElem);
            const buttonElem = doc.createElement('button');
            buttonElem.classList.add(className$4('b'));
            buttonElem.appendChild(createSvgIconElement(doc, 'p2dpad'));
            config.viewProps.bindDisabled(buttonElem);
            headElem.appendChild(buttonElem);
            this.buttonElement = buttonElem;
            const textElem = doc.createElement('div');
            textElem.classList.add(className$4('t'));
            headElem.appendChild(textElem);
            this.textElement = textElem;
            if (config.pickerLayout === 'inline') {
                const pickerElem = doc.createElement('div');
                pickerElem.classList.add(className$4('p'));
                this.element.appendChild(pickerElem);
                this.pickerElement = pickerElem;
            }
            else {
                this.pickerElement = null;
            }
        }
    }

    const className$3 = ClassName('p2dp');
    class Point2dPickerView {
        constructor(doc, config) {
            this.onFoldableChange_ = this.onFoldableChange_.bind(this);
            this.onValueChange_ = this.onValueChange_.bind(this);
            this.invertsY_ = config.invertsY;
            this.maxValue_ = config.maxValue;
            this.element = doc.createElement('div');
            this.element.classList.add(className$3());
            if (config.layout === 'popup') {
                this.element.classList.add(className$3(undefined, 'p'));
            }
            config.viewProps.bindClassModifiers(this.element);
            const padElem = doc.createElement('div');
            padElem.classList.add(className$3('p'));
            config.viewProps.bindTabIndex(padElem);
            this.element.appendChild(padElem);
            this.padElement = padElem;
            const svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className$3('g'));
            this.padElement.appendChild(svgElem);
            this.svgElem_ = svgElem;
            const xAxisElem = doc.createElementNS(SVG_NS, 'line');
            xAxisElem.classList.add(className$3('ax'));
            xAxisElem.setAttributeNS(null, 'x1', '0');
            xAxisElem.setAttributeNS(null, 'y1', '50%');
            xAxisElem.setAttributeNS(null, 'x2', '100%');
            xAxisElem.setAttributeNS(null, 'y2', '50%');
            this.svgElem_.appendChild(xAxisElem);
            const yAxisElem = doc.createElementNS(SVG_NS, 'line');
            yAxisElem.classList.add(className$3('ax'));
            yAxisElem.setAttributeNS(null, 'x1', '50%');
            yAxisElem.setAttributeNS(null, 'y1', '0');
            yAxisElem.setAttributeNS(null, 'x2', '50%');
            yAxisElem.setAttributeNS(null, 'y2', '100%');
            this.svgElem_.appendChild(yAxisElem);
            const lineElem = doc.createElementNS(SVG_NS, 'line');
            lineElem.classList.add(className$3('l'));
            lineElem.setAttributeNS(null, 'x1', '50%');
            lineElem.setAttributeNS(null, 'y1', '50%');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            const markerElem = doc.createElement('div');
            markerElem.classList.add(className$3('m'));
            this.padElement.appendChild(markerElem);
            this.markerElem_ = markerElem;
            config.value.emitter.on('change', this.onValueChange_);
            this.value = config.value;
            this.update_();
        }
        get allFocusableElements() {
            return [this.padElement];
        }
        update_() {
            const [x, y] = this.value.rawValue.getComponents();
            const max = this.maxValue_;
            const px = mapRange(x, -max, +max, 0, 100);
            const py = mapRange(y, -max, +max, 0, 100);
            const ipy = this.invertsY_ ? 100 - py : py;
            this.lineElem_.setAttributeNS(null, 'x2', `${px}%`);
            this.lineElem_.setAttributeNS(null, 'y2', `${ipy}%`);
            this.markerElem_.style.left = `${px}%`;
            this.markerElem_.style.top = `${ipy}%`;
        }
        onValueChange_() {
            this.update_();
        }
        onFoldableChange_() {
            this.update_();
        }
    }

    function computeOffset(ev, baseSteps, invertsY) {
        return [
            getStepForKey(baseSteps[0], getHorizontalStepKeys(ev)),
            getStepForKey(baseSteps[1], getVerticalStepKeys(ev)) * (invertsY ? 1 : -1),
        ];
    }
    class Point2dPickerController {
        constructor(doc, config) {
            this.onPadKeyDown_ = this.onPadKeyDown_.bind(this);
            this.onPadKeyUp_ = this.onPadKeyUp_.bind(this);
            this.onPointerDown_ = this.onPointerDown_.bind(this);
            this.onPointerMove_ = this.onPointerMove_.bind(this);
            this.onPointerUp_ = this.onPointerUp_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.baseSteps_ = config.baseSteps;
            this.maxValue_ = config.maxValue;
            this.invertsY_ = config.invertsY;
            this.view = new Point2dPickerView(doc, {
                invertsY: this.invertsY_,
                layout: config.layout,
                maxValue: this.maxValue_,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.ptHandler_ = new PointerHandler(this.view.padElement);
            this.ptHandler_.emitter.on('down', this.onPointerDown_);
            this.ptHandler_.emitter.on('move', this.onPointerMove_);
            this.ptHandler_.emitter.on('up', this.onPointerUp_);
            this.view.padElement.addEventListener('keydown', this.onPadKeyDown_);
            this.view.padElement.addEventListener('keyup', this.onPadKeyUp_);
        }
        handlePointerEvent_(d, opts) {
            if (!d.point) {
                return;
            }
            const max = this.maxValue_;
            const px = mapRange(d.point.x, 0, d.bounds.width, -max, +max);
            const py = mapRange(this.invertsY_ ? d.bounds.height - d.point.y : d.point.y, 0, d.bounds.height, -max, +max);
            this.value.setRawValue(new Point2d(px, py), opts);
        }
        onPointerDown_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerMove_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: false,
                last: false,
            });
        }
        onPointerUp_(ev) {
            this.handlePointerEvent_(ev.data, {
                forceEmit: true,
                last: true,
            });
        }
        onPadKeyDown_(ev) {
            if (isArrowKey(ev.key)) {
                ev.preventDefault();
            }
            const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
            if (dx === 0 && dy === 0) {
                return;
            }
            this.value.setRawValue(new Point2d(this.value.rawValue.x + dx, this.value.rawValue.y + dy), {
                forceEmit: false,
                last: false,
            });
        }
        onPadKeyUp_(ev) {
            const [dx, dy] = computeOffset(ev, this.baseSteps_, this.invertsY_);
            if (dx === 0 && dy === 0) {
                return;
            }
            this.value.setRawValue(this.value.rawValue, {
                forceEmit: true,
                last: true,
            });
        }
    }

    class Point2dController {
        constructor(doc, config) {
            var _a, _b;
            this.onPopupChildBlur_ = this.onPopupChildBlur_.bind(this);
            this.onPopupChildKeydown_ = this.onPopupChildKeydown_.bind(this);
            this.onPadButtonBlur_ = this.onPadButtonBlur_.bind(this);
            this.onPadButtonClick_ = this.onPadButtonClick_.bind(this);
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.foldable_ = Foldable.create(config.expanded);
            this.popC_ =
                config.pickerLayout === 'popup'
                    ? new PopupController(doc, {
                        viewProps: this.viewProps,
                    })
                    : null;
            const padC = new Point2dPickerController(doc, {
                baseSteps: [config.axes[0].baseStep, config.axes[1].baseStep],
                invertsY: config.invertsY,
                layout: config.pickerLayout,
                maxValue: config.maxValue,
                value: this.value,
                viewProps: this.viewProps,
            });
            padC.view.allFocusableElements.forEach((elem) => {
                elem.addEventListener('blur', this.onPopupChildBlur_);
                elem.addEventListener('keydown', this.onPopupChildKeydown_);
            });
            this.pickerC_ = padC;
            this.textC_ = new PointNdTextController(doc, {
                assembly: Point2dAssembly,
                axes: config.axes,
                parser: config.parser,
                value: this.value,
                viewProps: this.viewProps,
            });
            this.view = new Point2dView(doc, {
                expanded: this.foldable_.value('expanded'),
                pickerLayout: config.pickerLayout,
                viewProps: this.viewProps,
            });
            this.view.textElement.appendChild(this.textC_.view.element);
            (_a = this.view.buttonElement) === null || _a === void 0 ? void 0 : _a.addEventListener('blur', this.onPadButtonBlur_);
            (_b = this.view.buttonElement) === null || _b === void 0 ? void 0 : _b.addEventListener('click', this.onPadButtonClick_);
            if (this.popC_) {
                this.view.element.appendChild(this.popC_.view.element);
                this.popC_.view.element.appendChild(this.pickerC_.view.element);
                connectValues({
                    primary: this.foldable_.value('expanded'),
                    secondary: this.popC_.shows,
                    forward: (p) => p.rawValue,
                    backward: (_, s) => s.rawValue,
                });
            }
            else if (this.view.pickerElement) {
                this.view.pickerElement.appendChild(this.pickerC_.view.element);
                bindFoldable(this.foldable_, this.view.pickerElement);
            }
        }
        onPadButtonBlur_(e) {
            if (!this.popC_) {
                return;
            }
            const elem = this.view.element;
            const nextTarget = forceCast(e.relatedTarget);
            if (!nextTarget || !elem.contains(nextTarget)) {
                this.popC_.shows.rawValue = false;
            }
        }
        onPadButtonClick_() {
            this.foldable_.set('expanded', !this.foldable_.get('expanded'));
            if (this.foldable_.get('expanded')) {
                this.pickerC_.view.allFocusableElements[0].focus();
            }
        }
        onPopupChildBlur_(ev) {
            if (!this.popC_) {
                return;
            }
            const elem = this.popC_.view.element;
            const nextTarget = findNextTarget(ev);
            if (nextTarget && elem.contains(nextTarget)) {
                return;
            }
            if (nextTarget &&
                nextTarget === this.view.buttonElement &&
                !supportsTouch(elem.ownerDocument)) {
                return;
            }
            this.popC_.shows.rawValue = false;
        }
        onPopupChildKeydown_(ev) {
            if (this.popC_) {
                if (ev.key === 'Escape') {
                    this.popC_.shows.rawValue = false;
                }
            }
            else if (this.view.pickerElement) {
                if (ev.key === 'Escape') {
                    this.view.buttonElement.focus();
                }
            }
        }
    }

    class Point3d {
        constructor(x = 0, y = 0, z = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        getComponents() {
            return [this.x, this.y, this.z];
        }
        static isObject(obj) {
            if (isEmpty(obj)) {
                return false;
            }
            const x = obj.x;
            const y = obj.y;
            const z = obj.z;
            if (typeof x !== 'number' ||
                typeof y !== 'number' ||
                typeof z !== 'number') {
                return false;
            }
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
            };
        }
    }
    const Point3dAssembly = {
        toComponents: (p) => p.getComponents(),
        fromComponents: (comps) => new Point3d(...comps),
    };

    function point3dFromUnknown(value) {
        return Point3d.isObject(value)
            ? new Point3d(value.x, value.y, value.z)
            : new Point3d();
    }
    function writePoint3d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
    }

    function createConstraint$3(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point3dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y),
                createDimensionConstraint('z' in params ? params.z : undefined, initialValue.z),
            ],
        });
    }
    function createAxis$2(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
            }),
        };
    }
    const Point3dInputPlugin = {
        id: 'input-point3d',
        type: 'input',
        accept: (value, params) => {
            if (!Point3d.isObject(value)) {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.custom(parsePointDimensionParams),
                z: p.optional.custom(parsePointDimensionParams),
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => point3dFromUnknown,
            constraint: (args) => createConstraint$3(args.params, args.initialValue),
            equals: Point3d.equals,
            writer: (_args) => writePoint3d,
        },
        controller: (args) => {
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) {
                throw TpError.shouldNeverHappen();
            }
            return new PointNdTextController(args.document, {
                assembly: Point3dAssembly,
                axes: [
                    createAxis$2(value.rawValue.x, c.components[0]),
                    createAxis$2(value.rawValue.y, c.components[1]),
                    createAxis$2(value.rawValue.z, c.components[2]),
                ],
                parser: parseNumber,
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    class Point4d {
        constructor(x = 0, y = 0, z = 0, w = 0) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        getComponents() {
            return [this.x, this.y, this.z, this.w];
        }
        static isObject(obj) {
            if (isEmpty(obj)) {
                return false;
            }
            const x = obj.x;
            const y = obj.y;
            const z = obj.z;
            const w = obj.w;
            if (typeof x !== 'number' ||
                typeof y !== 'number' ||
                typeof z !== 'number' ||
                typeof w !== 'number') {
                return false;
            }
            return true;
        }
        static equals(v1, v2) {
            return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z && v1.w === v2.w;
        }
        toObject() {
            return {
                x: this.x,
                y: this.y,
                z: this.z,
                w: this.w,
            };
        }
    }
    const Point4dAssembly = {
        toComponents: (p) => p.getComponents(),
        fromComponents: (comps) => new Point4d(...comps),
    };

    function point4dFromUnknown(value) {
        return Point4d.isObject(value)
            ? new Point4d(value.x, value.y, value.z, value.w)
            : new Point4d();
    }
    function writePoint4d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
        target.writeProperty('z', value.z);
        target.writeProperty('w', value.w);
    }

    function createConstraint$2(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point4dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y),
                createDimensionConstraint('z' in params ? params.z : undefined, initialValue.z),
                createDimensionConstraint('w' in params ? params.w : undefined, initialValue.w),
            ],
        });
    }
    function createAxis$1(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
            }),
        };
    }
    const Point4dInputPlugin = {
        id: 'input-point4d',
        type: 'input',
        accept: (value, params) => {
            if (!Point4d.isObject(value)) {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.custom(parsePointDimensionParams),
                z: p.optional.custom(parsePointDimensionParams),
                w: p.optional.custom(parsePointDimensionParams),
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => point4dFromUnknown,
            constraint: (args) => createConstraint$2(args.params, args.initialValue),
            equals: Point4d.equals,
            writer: (_args) => writePoint4d,
        },
        controller: (args) => {
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) {
                throw TpError.shouldNeverHappen();
            }
            return new PointNdTextController(args.document, {
                assembly: Point4dAssembly,
                axes: value.rawValue
                    .getComponents()
                    .map((comp, index) => createAxis$1(comp, c.components[index])),
                parser: parseNumber,
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    function createConstraint$1(params) {
        const constraints = [];
        const lc = createListConstraint(params.options);
        if (lc) {
            constraints.push(lc);
        }
        return new CompositeConstraint(constraints);
    }
    const StringInputPlugin = {
        id: 'input-string',
        type: 'input',
        accept: (value, params) => {
            if (typeof value !== 'string') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                options: p.optional.custom(parseListOptions),
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => stringFromUnknown,
            constraint: (args) => createConstraint$1(args.params),
            writer: (_args) => writePrimitive,
        },
        controller: (args) => {
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            const lc = c && findConstraint(c, ListConstraint);
            if (lc) {
                return new ListController(doc, {
                    props: new ValueMap({
                        options: lc.values.value('options'),
                    }),
                    value: value,
                    viewProps: args.viewProps,
                });
            }
            return new TextController(doc, {
                parser: (v) => v,
                props: ValueMap.fromObject({
                    formatter: formatString,
                }),
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    const Constants = {
        monitor: {
            defaultInterval: 200,
            defaultLineCount: 3,
        },
    };

    const className$2 = ClassName('mll');
    class MultiLogView {
        constructor(doc, config) {
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$2());
            config.viewProps.bindClassModifiers(this.element);
            const textareaElem = doc.createElement('textarea');
            textareaElem.classList.add(className$2('i'));
            textareaElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
            textareaElem.readOnly = true;
            config.viewProps.bindDisabled(textareaElem);
            this.element.appendChild(textareaElem);
            this.textareaElem_ = textareaElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const elem = this.textareaElem_;
            const shouldScroll = elem.scrollTop === elem.scrollHeight - elem.clientHeight;
            const lines = [];
            this.value.rawValue.forEach((value) => {
                if (value !== undefined) {
                    lines.push(this.formatter_(value));
                }
            });
            elem.textContent = lines.join('\n');
            if (shouldScroll) {
                elem.scrollTop = elem.scrollHeight;
            }
        }
        onValueUpdate_() {
            this.update_();
        }
    }

    class MultiLogController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new MultiLogView(doc, {
                formatter: config.formatter,
                lineCount: config.lineCount,
                value: this.value,
                viewProps: this.viewProps,
            });
        }
    }

    const className$1 = ClassName('sgl');
    class SingleLogView {
        constructor(doc, config) {
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.formatter_ = config.formatter;
            this.element = doc.createElement('div');
            this.element.classList.add(className$1());
            config.viewProps.bindClassModifiers(this.element);
            const inputElem = doc.createElement('input');
            inputElem.classList.add(className$1('i'));
            inputElem.readOnly = true;
            inputElem.type = 'text';
            config.viewProps.bindDisabled(inputElem);
            this.element.appendChild(inputElem);
            this.inputElement = inputElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        update_() {
            const values = this.value.rawValue;
            const lastValue = values[values.length - 1];
            this.inputElement.value =
                lastValue !== undefined ? this.formatter_(lastValue) : '';
        }
        onValueUpdate_() {
            this.update_();
        }
    }

    class SingleLogController {
        constructor(doc, config) {
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.view = new SingleLogView(doc, {
                formatter: config.formatter,
                value: this.value,
                viewProps: this.viewProps,
            });
        }
    }

    const BooleanMonitorPlugin = {
        id: 'monitor-bool',
        type: 'monitor',
        accept: (value, params) => {
            if (typeof value !== 'boolean') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                lineCount: p.optional.number,
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => boolFromUnknown,
        },
        controller: (args) => {
            var _a;
            if (args.value.rawValue.length === 1) {
                return new SingleLogController(args.document, {
                    formatter: BooleanFormatter,
                    value: args.value,
                    viewProps: args.viewProps,
                });
            }
            return new MultiLogController(args.document, {
                formatter: BooleanFormatter,
                lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                value: args.value,
                viewProps: args.viewProps,
            });
        },
    };

    const className = ClassName('grl');
    class GraphLogView {
        constructor(doc, config) {
            this.onCursorChange_ = this.onCursorChange_.bind(this);
            this.onValueUpdate_ = this.onValueUpdate_.bind(this);
            this.element = doc.createElement('div');
            this.element.classList.add(className());
            config.viewProps.bindClassModifiers(this.element);
            this.formatter_ = config.formatter;
            this.props_ = config.props;
            this.cursor_ = config.cursor;
            this.cursor_.emitter.on('change', this.onCursorChange_);
            const svgElem = doc.createElementNS(SVG_NS, 'svg');
            svgElem.classList.add(className('g'));
            svgElem.style.height = `calc(var(--bld-us) * ${config.lineCount})`;
            this.element.appendChild(svgElem);
            this.svgElem_ = svgElem;
            const lineElem = doc.createElementNS(SVG_NS, 'polyline');
            this.svgElem_.appendChild(lineElem);
            this.lineElem_ = lineElem;
            const tooltipElem = doc.createElement('div');
            tooltipElem.classList.add(className('t'), ClassName('tt')());
            this.element.appendChild(tooltipElem);
            this.tooltipElem_ = tooltipElem;
            config.value.emitter.on('change', this.onValueUpdate_);
            this.value = config.value;
            this.update_();
        }
        get graphElement() {
            return this.svgElem_;
        }
        update_() {
            const bounds = this.svgElem_.getBoundingClientRect();
            const maxIndex = this.value.rawValue.length - 1;
            const min = this.props_.get('minValue');
            const max = this.props_.get('maxValue');
            const points = [];
            this.value.rawValue.forEach((v, index) => {
                if (v === undefined) {
                    return;
                }
                const x = mapRange(index, 0, maxIndex, 0, bounds.width);
                const y = mapRange(v, min, max, bounds.height, 0);
                points.push([x, y].join(','));
            });
            this.lineElem_.setAttributeNS(null, 'points', points.join(' '));
            const tooltipElem = this.tooltipElem_;
            const value = this.value.rawValue[this.cursor_.rawValue];
            if (value === undefined) {
                tooltipElem.classList.remove(className('t', 'a'));
                return;
            }
            const tx = mapRange(this.cursor_.rawValue, 0, maxIndex, 0, bounds.width);
            const ty = mapRange(value, min, max, bounds.height, 0);
            tooltipElem.style.left = `${tx}px`;
            tooltipElem.style.top = `${ty}px`;
            tooltipElem.textContent = `${this.formatter_(value)}`;
            if (!tooltipElem.classList.contains(className('t', 'a'))) {
                tooltipElem.classList.add(className('t', 'a'), className('t', 'in'));
                forceReflow(tooltipElem);
                tooltipElem.classList.remove(className('t', 'in'));
            }
        }
        onValueUpdate_() {
            this.update_();
        }
        onCursorChange_() {
            this.update_();
        }
    }

    class GraphLogController {
        constructor(doc, config) {
            this.onGraphMouseMove_ = this.onGraphMouseMove_.bind(this);
            this.onGraphMouseLeave_ = this.onGraphMouseLeave_.bind(this);
            this.onGraphPointerDown_ = this.onGraphPointerDown_.bind(this);
            this.onGraphPointerMove_ = this.onGraphPointerMove_.bind(this);
            this.onGraphPointerUp_ = this.onGraphPointerUp_.bind(this);
            this.props_ = config.props;
            this.value = config.value;
            this.viewProps = config.viewProps;
            this.cursor_ = createValue(-1);
            this.view = new GraphLogView(doc, {
                cursor: this.cursor_,
                formatter: config.formatter,
                lineCount: config.lineCount,
                props: this.props_,
                value: this.value,
                viewProps: this.viewProps,
            });
            if (!supportsTouch(doc)) {
                this.view.element.addEventListener('mousemove', this.onGraphMouseMove_);
                this.view.element.addEventListener('mouseleave', this.onGraphMouseLeave_);
            }
            else {
                const ph = new PointerHandler(this.view.element);
                ph.emitter.on('down', this.onGraphPointerDown_);
                ph.emitter.on('move', this.onGraphPointerMove_);
                ph.emitter.on('up', this.onGraphPointerUp_);
            }
        }
        onGraphMouseLeave_() {
            this.cursor_.rawValue = -1;
        }
        onGraphMouseMove_(ev) {
            const bounds = this.view.element.getBoundingClientRect();
            this.cursor_.rawValue = Math.floor(mapRange(ev.offsetX, 0, bounds.width, 0, this.value.rawValue.length));
        }
        onGraphPointerDown_(ev) {
            this.onGraphPointerMove_(ev);
        }
        onGraphPointerMove_(ev) {
            if (!ev.data.point) {
                this.cursor_.rawValue = -1;
                return;
            }
            this.cursor_.rawValue = Math.floor(mapRange(ev.data.point.x, 0, ev.data.bounds.width, 0, this.value.rawValue.length));
        }
        onGraphPointerUp_() {
            this.cursor_.rawValue = -1;
        }
    }

    function createFormatter(params) {
        return 'format' in params && !isEmpty(params.format)
            ? params.format
            : createNumberFormatter(2);
    }
    function createTextMonitor(args) {
        var _a;
        if (args.value.rawValue.length === 1) {
            return new SingleLogController(args.document, {
                formatter: createFormatter(args.params),
                value: args.value,
                viewProps: args.viewProps,
            });
        }
        return new MultiLogController(args.document, {
            formatter: createFormatter(args.params),
            lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
            value: args.value,
            viewProps: args.viewProps,
        });
    }
    function createGraphMonitor(args) {
        var _a, _b, _c;
        return new GraphLogController(args.document, {
            formatter: createFormatter(args.params),
            lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
            props: ValueMap.fromObject({
                maxValue: (_b = ('max' in args.params ? args.params.max : null)) !== null && _b !== void 0 ? _b : 100,
                minValue: (_c = ('min' in args.params ? args.params.min : null)) !== null && _c !== void 0 ? _c : 0,
            }),
            value: args.value,
            viewProps: args.viewProps,
        });
    }
    function shouldShowGraph(params) {
        return 'view' in params && params.view === 'graph';
    }
    const NumberMonitorPlugin = {
        id: 'monitor-number',
        type: 'monitor',
        accept: (value, params) => {
            if (typeof value !== 'number') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                format: p.optional.function,
                lineCount: p.optional.number,
                max: p.optional.number,
                min: p.optional.number,
                view: p.optional.string,
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            defaultBufferSize: (params) => (shouldShowGraph(params) ? 64 : 1),
            reader: (_args) => numberFromUnknown,
        },
        controller: (args) => {
            if (shouldShowGraph(args.params)) {
                return createGraphMonitor(args);
            }
            return createTextMonitor(args);
        },
    };

    const StringMonitorPlugin = {
        id: 'monitor-string',
        type: 'monitor',
        accept: (value, params) => {
            if (typeof value !== 'string') {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                lineCount: p.optional.number,
                multiline: p.optional.boolean,
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => stringFromUnknown,
        },
        controller: (args) => {
            var _a;
            const value = args.value;
            const multiline = value.rawValue.length > 1 ||
                ('multiline' in args.params && args.params.multiline);
            if (multiline) {
                return new MultiLogController(args.document, {
                    formatter: formatString,
                    lineCount: (_a = args.params.lineCount) !== null && _a !== void 0 ? _a : Constants.monitor.defaultLineCount,
                    value: value,
                    viewProps: args.viewProps,
                });
            }
            return new SingleLogController(args.document, {
                formatter: formatString,
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    function createInputBindingController(plugin, args) {
        var _a;
        const result = plugin.accept(args.target.read(), args.params);
        if (isEmpty(result)) {
            return null;
        }
        const p = ParamsParsers;
        const valueArgs = {
            target: args.target,
            initialValue: result.initialValue,
            params: result.params,
        };
        const reader = plugin.binding.reader(valueArgs);
        const constraint = plugin.binding.constraint
            ? plugin.binding.constraint(valueArgs)
            : undefined;
        const value = createValue(reader(result.initialValue), {
            constraint: constraint,
            equals: plugin.binding.equals,
        });
        const binding = new InputBinding({
            reader: reader,
            target: args.target,
            value: value,
            writer: plugin.binding.writer(valueArgs),
        });
        const disabled = p.optional.boolean(args.params.disabled).value;
        const hidden = p.optional.boolean(args.params.hidden).value;
        const controller = plugin.controller({
            constraint: constraint,
            document: args.document,
            initialValue: result.initialValue,
            params: result.params,
            value: binding.value,
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden,
            }),
        });
        return new InputBindingController(args.document, {
            binding: binding,
            blade: createBlade(),
            props: ValueMap.fromObject({
                label: 'label' in args.params
                    ? (_a = p.optional.string(args.params.label).value) !== null && _a !== void 0 ? _a : null
                    : args.target.key,
            }),
            valueController: controller,
        });
    }

    function createTicker(document, interval) {
        return interval === 0
            ? new ManualTicker()
            : new IntervalTicker(document, interval !== null && interval !== void 0 ? interval : Constants.monitor.defaultInterval);
    }
    function createMonitorBindingController(plugin, args) {
        var _a, _b, _c;
        const p = ParamsParsers;
        const result = plugin.accept(args.target.read(), args.params);
        if (isEmpty(result)) {
            return null;
        }
        const bindingArgs = {
            target: args.target,
            initialValue: result.initialValue,
            params: result.params,
        };
        const reader = plugin.binding.reader(bindingArgs);
        const bufferSize = (_b = (_a = p.optional.number(args.params.bufferSize).value) !== null && _a !== void 0 ? _a : (plugin.binding.defaultBufferSize &&
            plugin.binding.defaultBufferSize(result.params))) !== null && _b !== void 0 ? _b : 1;
        const interval = p.optional.number(args.params.interval).value;
        const binding = new MonitorBinding({
            reader: reader,
            target: args.target,
            ticker: createTicker(args.document, interval),
            value: initializeBuffer(bufferSize),
        });
        const disabled = p.optional.boolean(args.params.disabled).value;
        const hidden = p.optional.boolean(args.params.hidden).value;
        const controller = plugin.controller({
            document: args.document,
            params: result.params,
            value: binding.value,
            viewProps: ViewProps.create({
                disabled: disabled,
                hidden: hidden,
            }),
        });
        return new MonitorBindingController(args.document, {
            binding: binding,
            blade: createBlade(),
            props: ValueMap.fromObject({
                label: 'label' in args.params
                    ? (_c = p.optional.string(args.params.label).value) !== null && _c !== void 0 ? _c : null
                    : args.target.key,
            }),
            valueController: controller,
        });
    }

    class PluginPool {
        constructor() {
            this.pluginsMap_ = {
                blades: [],
                inputs: [],
                monitors: [],
            };
        }
        getAll() {
            return [
                ...this.pluginsMap_.blades,
                ...this.pluginsMap_.inputs,
                ...this.pluginsMap_.monitors,
            ];
        }
        register(r) {
            if (r.type === 'blade') {
                this.pluginsMap_.blades.unshift(r);
            }
            else if (r.type === 'input') {
                this.pluginsMap_.inputs.unshift(r);
            }
            else if (r.type === 'monitor') {
                this.pluginsMap_.monitors.unshift(r);
            }
        }
        createInput(document, target, params) {
            const initialValue = target.read();
            if (isEmpty(initialValue)) {
                throw new TpError({
                    context: {
                        key: target.key,
                    },
                    type: 'nomatchingcontroller',
                });
            }
            const bc = this.pluginsMap_.inputs.reduce((result, plugin) => result !== null && result !== void 0 ? result : createInputBindingController(plugin, {
                document: document,
                target: target,
                params: params,
            }), null);
            if (bc) {
                return bc;
            }
            throw new TpError({
                context: {
                    key: target.key,
                },
                type: 'nomatchingcontroller',
            });
        }
        createMonitor(document, target, params) {
            const bc = this.pluginsMap_.monitors.reduce((result, plugin) => result !== null && result !== void 0 ? result : createMonitorBindingController(plugin, {
                document: document,
                params: params,
                target: target,
            }), null);
            if (bc) {
                return bc;
            }
            throw new TpError({
                context: {
                    key: target.key,
                },
                type: 'nomatchingcontroller',
            });
        }
        createBlade(document, params) {
            const bc = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : createBladeController(plugin, {
                document: document,
                params: params,
            }), null);
            if (!bc) {
                throw new TpError({
                    type: 'nomatchingview',
                    context: {
                        params: params,
                    },
                });
            }
            return bc;
        }
        createBladeApi(bc) {
            if (bc instanceof InputBindingController) {
                return new InputBindingApi(bc);
            }
            if (bc instanceof MonitorBindingController) {
                return new MonitorBindingApi(bc);
            }
            if (bc instanceof RackController) {
                return new RackApi(bc, this);
            }
            const api = this.pluginsMap_.blades.reduce((result, plugin) => result !== null && result !== void 0 ? result : plugin.api({
                controller: bc,
                pool: this,
            }), null);
            if (!api) {
                throw TpError.shouldNeverHappen();
            }
            return api;
        }
    }

    function createDefaultPluginPool() {
        const pool = new PluginPool();
        [
            Point2dInputPlugin,
            Point3dInputPlugin,
            Point4dInputPlugin,
            StringInputPlugin,
            NumberInputPlugin,
            StringColorInputPlugin,
            ObjectColorInputPlugin,
            NumberColorInputPlugin,
            BooleanInputPlugin,
            BooleanMonitorPlugin,
            StringMonitorPlugin,
            NumberMonitorPlugin,
            ButtonBladePlugin,
            FolderBladePlugin,
            SeparatorBladePlugin,
            TabBladePlugin,
        ].forEach((p) => {
            pool.register(p);
        });
        return pool;
    }

    function point2dFromUnknown(value) {
        return Point2d.isObject(value)
            ? new Point2d(value.x, value.y)
            : new Point2d();
    }
    function writePoint2d(target, value) {
        target.writeProperty('x', value.x);
        target.writeProperty('y', value.y);
    }

    function createDimensionConstraint(params, initialValue) {
        if (!params) {
            return undefined;
        }
        const constraints = [];
        const cs = createStepConstraint(params, initialValue);
        if (cs) {
            constraints.push(cs);
        }
        const rs = createRangeConstraint(params);
        if (rs) {
            constraints.push(rs);
        }
        return new CompositeConstraint(constraints);
    }
    function createConstraint(params, initialValue) {
        return new PointNdConstraint({
            assembly: Point2dAssembly,
            components: [
                createDimensionConstraint('x' in params ? params.x : undefined, initialValue.x),
                createDimensionConstraint('y' in params ? params.y : undefined, initialValue.y),
            ],
        });
    }
    function getSuitableMaxDimensionValue(constraint, rawValue) {
        const [min, max] = constraint ? findNumberRange(constraint) : [];
        if (!isEmpty(min) || !isEmpty(max)) {
            return Math.max(Math.abs(min !== null && min !== void 0 ? min : 0), Math.abs(max !== null && max !== void 0 ? max : 0));
        }
        const step = getBaseStep(constraint);
        return Math.max(Math.abs(step) * 10, Math.abs(rawValue) * 10);
    }
    function getSuitableMaxValue(initialValue, constraint) {
        const xc = constraint instanceof PointNdConstraint
            ? constraint.components[0]
            : undefined;
        const yc = constraint instanceof PointNdConstraint
            ? constraint.components[1]
            : undefined;
        const xr = getSuitableMaxDimensionValue(xc, initialValue.x);
        const yr = getSuitableMaxDimensionValue(yc, initialValue.y);
        return Math.max(xr, yr);
    }
    function createAxis(initialValue, constraint) {
        return {
            baseStep: getBaseStep(constraint),
            constraint: constraint,
            textProps: ValueMap.fromObject({
                draggingScale: getSuitableDraggingScale(constraint, initialValue),
                formatter: createNumberFormatter(getSuitableDecimalDigits(constraint, initialValue)),
            }),
        };
    }
    function shouldInvertY(params) {
        if (!('y' in params)) {
            return false;
        }
        const yParams = params.y;
        if (!yParams) {
            return false;
        }
        return 'inverted' in yParams ? !!yParams.inverted : false;
    }
    const Point2dInputPlugin = {
        id: 'input-point2d',
        type: 'input',
        accept: (value, params) => {
            if (!Point2d.isObject(value)) {
                return null;
            }
            const p = ParamsParsers;
            const result = parseParams(params, {
                expanded: p.optional.boolean,
                picker: p.optional.custom(parsePickerLayout),
                x: p.optional.custom(parsePointDimensionParams),
                y: p.optional.object({
                    inverted: p.optional.boolean,
                    max: p.optional.number,
                    min: p.optional.number,
                    step: p.optional.number,
                }),
            });
            return result
                ? {
                    initialValue: value,
                    params: result,
                }
                : null;
        },
        binding: {
            reader: (_args) => point2dFromUnknown,
            constraint: (args) => createConstraint(args.params, args.initialValue),
            equals: Point2d.equals,
            writer: (_args) => writePoint2d,
        },
        controller: (args) => {
            const doc = args.document;
            const value = args.value;
            const c = args.constraint;
            if (!(c instanceof PointNdConstraint)) {
                throw TpError.shouldNeverHappen();
            }
            const expanded = 'expanded' in args.params ? args.params.expanded : undefined;
            const picker = 'picker' in args.params ? args.params.picker : undefined;
            return new Point2dController(doc, {
                axes: [
                    createAxis(value.rawValue.x, c.components[0]),
                    createAxis(value.rawValue.y, c.components[1]),
                ],
                expanded: expanded !== null && expanded !== void 0 ? expanded : false,
                invertsY: shouldInvertY(args.params),
                maxValue: getSuitableMaxValue(value.rawValue, c),
                parser: parseNumber,
                pickerLayout: picker !== null && picker !== void 0 ? picker : 'popup',
                value: value,
                viewProps: args.viewProps,
            });
        },
    };

    class ListApi extends BladeApi {
        constructor(controller) {
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev) => {
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue),
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get options() {
            return this.controller_.valueController.props.get('options');
        }
        set options(options) {
            this.controller_.valueController.props.set('options', options);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
    }

    class SliderApi extends BladeApi {
        constructor(controller) {
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev) => {
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue),
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get maxValue() {
            return this.controller_.valueController.sliderController.props.get('maxValue');
        }
        set maxValue(maxValue) {
            this.controller_.valueController.sliderController.props.set('maxValue', maxValue);
        }
        get minValue() {
            return this.controller_.valueController.sliderController.props.get('minValue');
        }
        set minValue(minValue) {
            this.controller_.valueController.sliderController.props.set('minValue', minValue);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
    }

    class TextApi extends BladeApi {
        constructor(controller) {
            super(controller);
            this.emitter_ = new Emitter();
            this.controller_.valueController.value.emitter.on('change', (ev) => {
                this.emitter_.emit('change', {
                    event: new TpChangeEvent(this, ev.rawValue),
                });
            });
        }
        get label() {
            return this.controller_.props.get('label');
        }
        set label(label) {
            this.controller_.props.set('label', label);
        }
        get formatter() {
            return this.controller_.valueController.props.get('formatter');
        }
        set formatter(formatter) {
            this.controller_.valueController.props.set('formatter', formatter);
        }
        get value() {
            return this.controller_.valueController.value.rawValue;
        }
        set value(value) {
            this.controller_.valueController.value.rawValue = value;
        }
        on(eventName, handler) {
            const bh = handler.bind(this);
            this.emitter_.on(eventName, (ev) => {
                bh(ev.event);
            });
            return this;
        }
    }

    const ListBladePlugin = (function () {
        return {
            id: 'list',
            type: 'blade',
            accept(params) {
                const p = ParamsParsers;
                const result = parseParams(params, {
                    options: p.required.custom(parseListOptions),
                    value: p.required.raw,
                    view: p.required.constant('list'),
                    label: p.optional.string,
                });
                return result ? { params: result } : null;
            },
            controller(args) {
                const lc = new ListConstraint(normalizeListOptions(args.params.options));
                const value = createValue(args.params.value, {
                    constraint: lc,
                });
                const ic = new ListController(args.document, {
                    props: new ValueMap({
                        options: lc.values.value('options'),
                    }),
                    value: value,
                    viewProps: args.viewProps,
                });
                return new LabeledValueController(args.document, {
                    blade: args.blade,
                    props: ValueMap.fromObject({
                        label: args.params.label,
                    }),
                    valueController: ic,
                });
            },
            api(args) {
                if (!(args.controller instanceof LabeledValueController)) {
                    return null;
                }
                if (!(args.controller.valueController instanceof ListController)) {
                    return null;
                }
                return new ListApi(args.controller);
            },
        };
    })();

    /**
     * @hidden
     */
    function exportPresetJson(targets) {
        return targets.reduce((result, target) => {
            return Object.assign(result, {
                [target.presetKey]: target.read(),
            });
        }, {});
    }
    /**
     * @hidden
     */
    function importPresetJson(bindings, preset) {
        bindings.forEach((binding) => {
            const value = preset[binding.target.presetKey];
            if (value !== undefined) {
                binding.writer(binding.target, binding.reader(value));
            }
        });
    }

    class RootApi extends FolderApi {
        /**
         * @hidden
         */
        constructor(controller, pool) {
            super(controller, pool);
        }
        get element() {
            return this.controller_.view.element;
        }
        /**
         * Imports a preset of all inputs.
         * @param preset The preset object to import.
         */
        importPreset(preset) {
            const bindings = this.controller_.rackController.rack
                .find(InputBindingController)
                .map((ibc) => {
                return ibc.binding;
            });
            importPresetJson(bindings, preset);
            this.refresh();
        }
        /**
         * Exports a preset of all inputs.
         * @return An exported preset object.
         */
        exportPreset() {
            const targets = this.controller_.rackController.rack
                .find(InputBindingController)
                .map((ibc) => {
                return ibc.binding.target;
            });
            return exportPresetJson(targets);
        }
        /**
         * Refreshes all bindings of the pane.
         */
        refresh() {
            // Force-read all input bindings
            this.controller_.rackController.rack
                .find(InputBindingController)
                .forEach((ibc) => {
                ibc.binding.read();
            });
            // Force-read all monitor bindings
            this.controller_.rackController.rack
                .find(MonitorBindingController)
                .forEach((mbc) => {
                mbc.binding.read();
            });
        }
    }

    class RootController extends FolderController {
        constructor(doc, config) {
            super(doc, {
                expanded: config.expanded,
                blade: config.blade,
                props: config.props,
                root: true,
                viewProps: config.viewProps,
            });
        }
    }

    const SliderBladePlugin = {
        id: 'slider',
        type: 'blade',
        accept(params) {
            const p = ParamsParsers;
            const result = parseParams(params, {
                max: p.required.number,
                min: p.required.number,
                view: p.required.constant('slider'),
                format: p.optional.function,
                label: p.optional.string,
                value: p.optional.number,
            });
            return result ? { params: result } : null;
        },
        controller(args) {
            var _a, _b;
            const initialValue = (_a = args.params.value) !== null && _a !== void 0 ? _a : 0;
            const drc = new DefiniteRangeConstraint({
                max: args.params.max,
                min: args.params.min,
            });
            const vc = new SliderTextController(args.document, {
                baseStep: 1,
                parser: parseNumber,
                sliderProps: new ValueMap({
                    maxValue: drc.values.value('max'),
                    minValue: drc.values.value('min'),
                }),
                textProps: ValueMap.fromObject({
                    draggingScale: getSuitableDraggingScale(undefined, initialValue),
                    formatter: (_b = args.params.format) !== null && _b !== void 0 ? _b : numberToString,
                }),
                value: createValue(initialValue, {
                    constraint: drc,
                }),
                viewProps: args.viewProps,
            });
            return new LabeledValueController(args.document, {
                blade: args.blade,
                props: ValueMap.fromObject({
                    label: args.params.label,
                }),
                valueController: vc,
            });
        },
        api(args) {
            if (!(args.controller instanceof LabeledValueController)) {
                return null;
            }
            if (!(args.controller.valueController instanceof SliderTextController)) {
                return null;
            }
            return new SliderApi(args.controller);
        },
    };

    const TextBladePlugin = (function () {
        return {
            id: 'text',
            type: 'blade',
            accept(params) {
                const p = ParamsParsers;
                const result = parseParams(params, {
                    parse: p.required.function,
                    value: p.required.raw,
                    view: p.required.constant('text'),
                    format: p.optional.function,
                    label: p.optional.string,
                });
                return result ? { params: result } : null;
            },
            controller(args) {
                var _a;
                const ic = new TextController(args.document, {
                    parser: args.params.parse,
                    props: ValueMap.fromObject({
                        formatter: (_a = args.params.format) !== null && _a !== void 0 ? _a : ((v) => String(v)),
                    }),
                    value: createValue(args.params.value),
                    viewProps: args.viewProps,
                });
                return new LabeledValueController(args.document, {
                    blade: args.blade,
                    props: ValueMap.fromObject({
                        label: args.params.label,
                    }),
                    valueController: ic,
                });
            },
            api(args) {
                if (!(args.controller instanceof LabeledValueController)) {
                    return null;
                }
                if (!(args.controller.valueController instanceof TextController)) {
                    return null;
                }
                return new TextApi(args.controller);
            },
        };
    })();

    function createDefaultWrapperElement(doc) {
        const elem = doc.createElement('div');
        elem.classList.add(ClassName('dfw')());
        if (doc.body) {
            doc.body.appendChild(elem);
        }
        return elem;
    }
    function embedStyle(doc, id, css) {
        if (doc.querySelector(`style[data-tp-style=${id}]`)) {
            return;
        }
        const styleElem = doc.createElement('style');
        styleElem.dataset.tpStyle = id;
        styleElem.textContent = css;
        doc.head.appendChild(styleElem);
    }
    /**
     * The root pane of Tweakpane.
     */
    class Pane extends RootApi {
        constructor(opt_config) {
            var _a, _b;
            const config = opt_config !== null && opt_config !== void 0 ? opt_config : {};
            const doc = (_a = config.document) !== null && _a !== void 0 ? _a : getWindowDocument();
            const pool = createDefaultPluginPool();
            const rootController = new RootController(doc, {
                expanded: config.expanded,
                blade: createBlade(),
                props: ValueMap.fromObject({
                    title: config.title,
                }),
                viewProps: ViewProps.create(),
            });
            super(rootController, pool);
            this.pool_ = pool;
            this.containerElem_ = (_b = config.container) !== null && _b !== void 0 ? _b : createDefaultWrapperElement(doc);
            this.containerElem_.appendChild(this.element);
            this.doc_ = doc;
            this.usesDefaultWrapper_ = !config.container;
            this.setUpDefaultPlugins_();
        }
        get document() {
            if (!this.doc_) {
                throw TpError.alreadyDisposed();
            }
            return this.doc_;
        }
        dispose() {
            const containerElem = this.containerElem_;
            if (!containerElem) {
                throw TpError.alreadyDisposed();
            }
            if (this.usesDefaultWrapper_) {
                const parentElem = containerElem.parentElement;
                if (parentElem) {
                    parentElem.removeChild(containerElem);
                }
            }
            this.containerElem_ = null;
            this.doc_ = null;
            super.dispose();
        }
        registerPlugin(bundle) {
            const plugins = 'plugin' in bundle
                ? [bundle.plugin]
                : 'plugins' in bundle
                    ? bundle.plugins
                    : [];
            plugins.forEach((p) => {
                this.pool_.register(p);
                this.embedPluginStyle_(p);
            });
        }
        embedPluginStyle_(plugin) {
            if (plugin.css) {
                embedStyle(this.document, `plugin-${plugin.id}`, plugin.css);
            }
        }
        setUpDefaultPlugins_() {
            // NOTE: This string literal will be replaced with the default CSS by Rollup at the compilation time
            embedStyle(this.document, 'default', '.tp-tbiv_b,.tp-coltxtv_ms,.tp-ckbv_i,.tp-rotv_b,.tp-fldv_b,.tp-mllv_i,.tp-sglv_i,.tp-grlv_g,.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw,.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;font-family:inherit;font-size:inherit;font-weight:inherit;margin:0;outline:none;padding:0}.tp-p2dv_b,.tp-btnv_b,.tp-lstv_s{background-color:var(--btn-bg);border-radius:var(--elm-br);color:var(--btn-fg);cursor:pointer;display:block;font-weight:bold;height:var(--bld-us);line-height:var(--bld-us);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tp-p2dv_b:hover,.tp-btnv_b:hover,.tp-lstv_s:hover{background-color:var(--btn-bg-h)}.tp-p2dv_b:focus,.tp-btnv_b:focus,.tp-lstv_s:focus{background-color:var(--btn-bg-f)}.tp-p2dv_b:active,.tp-btnv_b:active,.tp-lstv_s:active{background-color:var(--btn-bg-a)}.tp-p2dv_b:disabled,.tp-btnv_b:disabled,.tp-lstv_s:disabled{opacity:.5}.tp-txtv_i,.tp-p2dpv_p,.tp-colswv_sw{background-color:var(--in-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--in-fg);font-family:inherit;height:var(--bld-us);line-height:var(--bld-us);min-width:0;width:100%}.tp-txtv_i:hover,.tp-p2dpv_p:hover,.tp-colswv_sw:hover{background-color:var(--in-bg-h)}.tp-txtv_i:focus,.tp-p2dpv_p:focus,.tp-colswv_sw:focus{background-color:var(--in-bg-f)}.tp-txtv_i:active,.tp-p2dpv_p:active,.tp-colswv_sw:active{background-color:var(--in-bg-a)}.tp-txtv_i:disabled,.tp-p2dpv_p:disabled,.tp-colswv_sw:disabled{opacity:.5}.tp-mllv_i,.tp-sglv_i,.tp-grlv_g{background-color:var(--mo-bg);border-radius:var(--elm-br);box-sizing:border-box;color:var(--mo-fg);height:var(--bld-us);scrollbar-color:currentColor rgba(0,0,0,0);scrollbar-width:thin;width:100%}.tp-mllv_i::-webkit-scrollbar,.tp-sglv_i::-webkit-scrollbar,.tp-grlv_g::-webkit-scrollbar{height:8px;width:8px}.tp-mllv_i::-webkit-scrollbar-corner,.tp-sglv_i::-webkit-scrollbar-corner,.tp-grlv_g::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}.tp-mllv_i::-webkit-scrollbar-thumb,.tp-sglv_i::-webkit-scrollbar-thumb,.tp-grlv_g::-webkit-scrollbar-thumb{background-clip:padding-box;background-color:currentColor;border:rgba(0,0,0,0) solid 2px;border-radius:4px}.tp-rotv{--font-family: var(--tp-font-family, Roboto Mono, Source Code Pro, Menlo, Courier, monospace);--bs-br: var(--tp-base-border-radius, 6px);--cnt-h-p: var(--tp-container-horizontal-padding, 4px);--cnt-v-p: var(--tp-container-vertical-padding, 4px);--elm-br: var(--tp-element-border-radius, 2px);--bld-s: var(--tp-blade-spacing, 4px);--bld-us: var(--tp-blade-unit-size, 20px);--bs-bg: var(--tp-base-background-color, hsl(230, 7%, 17%));--bs-sh: var(--tp-base-shadow-color, rgba(0, 0, 0, 0.2));--btn-bg: var(--tp-button-background-color, hsl(230, 7%, 70%));--btn-bg-a: var(--tp-button-background-color-active, #d6d7db);--btn-bg-f: var(--tp-button-background-color-focus, #c8cad0);--btn-bg-h: var(--tp-button-background-color-hover, #bbbcc4);--btn-fg: var(--tp-button-foreground-color, hsl(230, 7%, 17%));--cnt-bg: var(--tp-container-background-color, rgba(187, 188, 196, 0.1));--cnt-bg-a: var(--tp-container-background-color-active, rgba(187, 188, 196, 0.25));--cnt-bg-f: var(--tp-container-background-color-focus, rgba(187, 188, 196, 0.2));--cnt-bg-h: var(--tp-container-background-color-hover, rgba(187, 188, 196, 0.15));--cnt-fg: var(--tp-container-foreground-color, hsl(230, 7%, 75%));--in-bg: var(--tp-input-background-color, rgba(187, 188, 196, 0.1));--in-bg-a: var(--tp-input-background-color-active, rgba(187, 188, 196, 0.25));--in-bg-f: var(--tp-input-background-color-focus, rgba(187, 188, 196, 0.2));--in-bg-h: var(--tp-input-background-color-hover, rgba(187, 188, 196, 0.15));--in-fg: var(--tp-input-foreground-color, hsl(230, 7%, 75%));--lbl-fg: var(--tp-label-foreground-color, rgba(187, 188, 196, 0.7));--mo-bg: var(--tp-monitor-background-color, rgba(0, 0, 0, 0.2));--mo-fg: var(--tp-monitor-foreground-color, rgba(187, 188, 196, 0.7));--grv-fg: var(--tp-groove-foreground-color, rgba(187, 188, 196, 0.1))}.tp-rotv_c>.tp-cntv.tp-v-lst,.tp-tabv_c .tp-brkv>.tp-cntv.tp-v-lst,.tp-fldv_c>.tp-cntv.tp-v-lst{margin-bottom:calc(-1*var(--cnt-v-p))}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_c,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_c{border-bottom-left-radius:0}.tp-rotv_c>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-tabv_c .tp-brkv>.tp-fldv.tp-v-lst .tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-v-lst .tp-fldv_b{border-bottom-left-radius:0}.tp-rotv_c>*:not(.tp-v-fst),.tp-tabv_c .tp-brkv>*:not(.tp-v-fst),.tp-fldv_c>*:not(.tp-v-fst){margin-top:var(--bld-s)}.tp-rotv_c>.tp-sprv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-fst),.tp-fldv_c>.tp-sprv:not(.tp-v-fst),.tp-rotv_c>.tp-cntv:not(.tp-v-fst),.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-fst),.tp-fldv_c>.tp-cntv:not(.tp-v-fst){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-sprv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-sprv+*:not(.tp-v-hidden),.tp-rotv_c>.tp-cntv+*:not(.tp-v-hidden),.tp-tabv_c .tp-brkv>.tp-cntv+*:not(.tp-v-hidden),.tp-fldv_c>.tp-cntv+*:not(.tp-v-hidden){margin-top:var(--cnt-v-p)}.tp-rotv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-tabv_c .tp-brkv>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-fldv_c>.tp-sprv:not(.tp-v-hidden)+.tp-sprv,.tp-rotv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-tabv_c .tp-brkv>.tp-cntv:not(.tp-v-hidden)+.tp-cntv,.tp-fldv_c>.tp-cntv:not(.tp-v-hidden)+.tp-cntv{margin-top:0}.tp-tabv_c .tp-brkv>.tp-cntv,.tp-fldv_c>.tp-cntv{margin-left:4px}.tp-tabv_c .tp-brkv>.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-fldv>.tp-fldv_b{border-top-left-radius:var(--elm-br);border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-fldv.tp-fldv-expanded>.tp-fldv_b,.tp-fldv_c>.tp-fldv.tp-fldv-expanded>.tp-fldv_b{border-bottom-left-radius:0}.tp-tabv_c .tp-brkv .tp-fldv>.tp-fldv_c,.tp-fldv_c .tp-fldv>.tp-fldv_c{border-bottom-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-fldv>.tp-fldv_b,.tp-fldv_c>.tp-cntv+.tp-fldv>.tp-fldv_b{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-cntv+.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-cntv+.tp-tabv>.tp-tabv_t{border-top-left-radius:0}.tp-tabv_c .tp-brkv>.tp-tabv>.tp-tabv_t,.tp-fldv_c>.tp-tabv>.tp-tabv_t{border-top-left-radius:var(--elm-br)}.tp-tabv_c .tp-brkv .tp-tabv>.tp-tabv_c,.tp-fldv_c .tp-tabv>.tp-tabv_c{border-bottom-left-radius:var(--elm-br)}.tp-rotv_b,.tp-fldv_b{background-color:var(--cnt-bg);color:var(--cnt-fg);cursor:pointer;display:block;height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);overflow:hidden;padding-left:var(--cnt-h-p);padding-right:calc(4px + var(--bld-us) + var(--cnt-h-p));position:relative;text-align:left;text-overflow:ellipsis;white-space:nowrap;width:100%;transition:border-radius .2s ease-in-out .2s}.tp-rotv_b:hover,.tp-fldv_b:hover{background-color:var(--cnt-bg-h)}.tp-rotv_b:focus,.tp-fldv_b:focus{background-color:var(--cnt-bg-f)}.tp-rotv_b:active,.tp-fldv_b:active{background-color:var(--cnt-bg-a)}.tp-rotv_b:disabled,.tp-fldv_b:disabled{opacity:.5}.tp-rotv_m,.tp-fldv_m{background:linear-gradient(to left, var(--cnt-fg), var(--cnt-fg) 2px, transparent 2px, transparent 4px, var(--cnt-fg) 4px);border-radius:2px;bottom:0;content:"";display:block;height:6px;right:calc(var(--cnt-h-p) + (var(--bld-us) + 4px - 6px)/2 - 2px);margin:auto;opacity:.5;position:absolute;top:0;transform:rotate(90deg);transition:transform .2s ease-in-out;width:6px}.tp-rotv.tp-rotv-expanded .tp-rotv_m,.tp-fldv.tp-fldv-expanded>.tp-fldv_b>.tp-fldv_m{transform:none}.tp-rotv_c,.tp-fldv_c{box-sizing:border-box;height:0;opacity:0;overflow:hidden;padding-bottom:0;padding-top:0;position:relative;transition:height .2s ease-in-out,opacity .2s linear,padding .2s ease-in-out}.tp-rotv.tp-rotv-cpl:not(.tp-rotv-expanded) .tp-rotv_c,.tp-fldv.tp-fldv-cpl:not(.tp-fldv-expanded)>.tp-fldv_c{display:none}.tp-rotv.tp-rotv-expanded .tp-rotv_c,.tp-fldv.tp-fldv-expanded>.tp-fldv_c{opacity:1;padding-bottom:var(--cnt-v-p);padding-top:var(--cnt-v-p);transform:none;overflow:visible;transition:height .2s ease-in-out,opacity .2s linear .2s,padding .2s ease-in-out}.tp-lstv,.tp-coltxtv_m{position:relative}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m,.tp-coltxtv_mm{bottom:0;margin:auto;pointer-events:none;position:absolute;right:2px;top:0}.tp-lstv_m svg,.tp-coltxtv_mm svg{bottom:0;height:16px;margin:auto;position:absolute;right:0;top:0;width:16px}.tp-lstv_m svg path,.tp-coltxtv_mm svg path{fill:currentColor}.tp-pndtxtv,.tp-coltxtv_w{display:flex}.tp-pndtxtv_a,.tp-coltxtv_c{width:100%}.tp-pndtxtv_a+.tp-pndtxtv_a,.tp-coltxtv_c+.tp-pndtxtv_a,.tp-pndtxtv_a+.tp-coltxtv_c,.tp-coltxtv_c+.tp-coltxtv_c{margin-left:2px}.tp-btnv_b{width:100%}.tp-btnv_t{text-align:center}.tp-ckbv_l{display:block;position:relative}.tp-ckbv_i{left:0;opacity:0;position:absolute;top:0}.tp-ckbv_w{background-color:var(--in-bg);border-radius:var(--elm-br);cursor:pointer;display:block;height:var(--bld-us);position:relative;width:var(--bld-us)}.tp-ckbv_w svg{bottom:0;display:block;height:16px;left:0;margin:auto;opacity:0;position:absolute;right:0;top:0;width:16px}.tp-ckbv_w svg path{fill:none;stroke:var(--in-fg);stroke-width:2}.tp-ckbv_i:hover+.tp-ckbv_w{background-color:var(--in-bg-h)}.tp-ckbv_i:focus+.tp-ckbv_w{background-color:var(--in-bg-f)}.tp-ckbv_i:active+.tp-ckbv_w{background-color:var(--in-bg-a)}.tp-ckbv_i:checked+.tp-ckbv_w svg{opacity:1}.tp-ckbv.tp-v-disabled .tp-ckbv_w{opacity:.5}.tp-colv{position:relative}.tp-colv_h{display:flex}.tp-colv_s{flex-grow:0;flex-shrink:0;width:var(--bld-us)}.tp-colv_t{flex:1;margin-left:4px}.tp-colv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-colv.tp-colv-cpl .tp-colv_p{overflow:visible}.tp-colv.tp-colv-expanded .tp-colv_p{margin-top:var(--bld-s);opacity:1}.tp-colv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-colpv_h,.tp-colpv_ap{margin-left:6px;margin-right:6px}.tp-colpv_h{margin-top:var(--bld-s)}.tp-colpv_rgb{display:flex;margin-top:var(--bld-s);width:100%}.tp-colpv_a{display:flex;margin-top:var(--cnt-v-p);padding-top:calc(var(--cnt-v-p) + 2px);position:relative}.tp-colpv_a::before{background-color:var(--grv-fg);content:"";height:2px;left:calc(-1*var(--cnt-h-p));position:absolute;right:calc(-1*var(--cnt-h-p));top:0}.tp-colpv.tp-v-disabled .tp-colpv_a::before{opacity:.5}.tp-colpv_ap{align-items:center;display:flex;flex:3}.tp-colpv_at{flex:1;margin-left:4px}.tp-svpv{border-radius:var(--elm-br);outline:none;overflow:hidden;position:relative}.tp-svpv.tp-v-disabled{opacity:.5}.tp-svpv_c{cursor:crosshair;display:block;height:calc(var(--bld-us)*4);width:100%}.tp-svpv_m{border-radius:100%;border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;filter:drop-shadow(0 0 1px rgba(0, 0, 0, 0.3));height:12px;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;width:12px}.tp-svpv:focus .tp-svpv_m{border-color:#fff}.tp-hplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative}.tp-hplv.tp-v-disabled{opacity:.5}.tp-hplv_c{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAAABCAYAAABubagXAAAAQ0lEQVQoU2P8z8Dwn0GCgQEDi2OK/RBgYHjBgIpfovFh8j8YBIgzFGQxuqEgPhaDOT5gOhPkdCxOZeBg+IDFZZiGAgCaSSMYtcRHLgAAAABJRU5ErkJggg==);background-position:left top;background-repeat:no-repeat;background-size:100% 100%;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;position:absolute;top:50%;width:100%}.tp-hplv_m{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-shadow:0 0 2px rgba(0,0,0,.1);box-sizing:border-box;height:12px;left:50%;margin-left:-6px;margin-top:-6px;pointer-events:none;position:absolute;top:50%;width:12px}.tp-hplv:focus .tp-hplv_m{border-color:#fff}.tp-aplv{cursor:pointer;height:var(--bld-us);outline:none;position:relative;width:100%}.tp-aplv.tp-v-disabled{opacity:.5}.tp-aplv_b{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:4px 4px;background-position:0 0,2px 2px;border-radius:2px;display:block;height:4px;left:0;margin-top:-2px;overflow:hidden;position:absolute;top:50%;width:100%}.tp-aplv_c{bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv_m{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:12px 12px;background-position:0 0,6px 6px;border-radius:var(--elm-br);box-shadow:0 0 2px rgba(0,0,0,.1);height:12px;left:50%;margin-left:-6px;margin-top:-6px;overflow:hidden;pointer-events:none;position:absolute;top:50%;width:12px}.tp-aplv_p{border-radius:var(--elm-br);border:rgba(255,255,255,.75) solid 2px;box-sizing:border-box;bottom:0;left:0;position:absolute;right:0;top:0}.tp-aplv:focus .tp-aplv_p{border-color:#fff}.tp-colswv{background-color:#fff;background-image:linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%),linear-gradient(to top right, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%);background-size:10px 10px;background-position:0 0,5px 5px;border-radius:var(--elm-br);overflow:hidden}.tp-colswv.tp-v-disabled{opacity:.5}.tp-colswv_sw{border-radius:0}.tp-colswv_b{-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:rgba(0,0,0,0);border-width:0;cursor:pointer;display:block;height:var(--bld-us);left:0;margin:0;outline:none;padding:0;position:absolute;top:0;width:var(--bld-us)}.tp-colswv_b:focus::after{border:rgba(255,255,255,.75) solid 2px;border-radius:var(--elm-br);bottom:0;content:"";display:block;left:0;position:absolute;right:0;top:0}.tp-coltxtv{display:flex;width:100%}.tp-coltxtv_m{margin-right:4px}.tp-coltxtv_ms{border-radius:var(--elm-br);color:var(--lbl-fg);cursor:pointer;height:var(--bld-us);line-height:var(--bld-us);padding:0 18px 0 4px}.tp-coltxtv_ms:hover{background-color:var(--in-bg-h)}.tp-coltxtv_ms:focus{background-color:var(--in-bg-f)}.tp-coltxtv_ms:active{background-color:var(--in-bg-a)}.tp-coltxtv_mm{color:var(--lbl-fg)}.tp-coltxtv.tp-v-disabled .tp-coltxtv_mm{opacity:.5}.tp-coltxtv_w{flex:1}.tp-dfwv{position:absolute;top:8px;right:8px;width:256px}.tp-fldv{position:relative}.tp-fldv.tp-fldv-not .tp-fldv_b{display:none}.tp-fldv_t{padding-left:4px}.tp-fldv_b:disabled .tp-fldv_m{display:none}.tp-fldv_c{padding-left:4px}.tp-fldv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-fldv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-fldv_b:hover+.tp-fldv_i{color:var(--cnt-bg-h)}.tp-fldv_b:focus+.tp-fldv_i{color:var(--cnt-bg-f)}.tp-fldv_b:active+.tp-fldv_i{color:var(--cnt-bg-a)}.tp-fldv.tp-v-disabled>.tp-fldv_i{opacity:.5}.tp-grlv{position:relative}.tp-grlv_g{display:block;height:calc(var(--bld-us)*3)}.tp-grlv_g polyline{fill:none;stroke:var(--mo-fg);stroke-linejoin:round}.tp-grlv_t{margin-top:-4px;transition:left .05s,top .05s;visibility:hidden}.tp-grlv_t.tp-grlv_t-a{visibility:visible}.tp-grlv_t.tp-grlv_t-in{transition:none}.tp-grlv.tp-v-disabled .tp-grlv_g{opacity:.5}.tp-grlv .tp-ttv{background-color:var(--mo-fg)}.tp-grlv .tp-ttv::before{border-top-color:var(--mo-fg)}.tp-lblv{align-items:center;display:flex;line-height:1.3;padding-left:var(--cnt-h-p);padding-right:var(--cnt-h-p)}.tp-lblv.tp-lblv-nol{display:block}.tp-lblv_l{color:var(--lbl-fg);flex:1;-webkit-hyphens:auto;hyphens:auto;overflow:hidden;padding-left:4px;padding-right:16px}.tp-lblv.tp-v-disabled .tp-lblv_l{opacity:.5}.tp-lblv.tp-lblv-nol .tp-lblv_l{display:none}.tp-lblv_v{align-self:flex-start;flex-grow:0;flex-shrink:0;width:160px}.tp-lblv.tp-lblv-nol .tp-lblv_v{width:100%}.tp-lstv_s{padding:0 20px 0 4px;width:100%}.tp-lstv_m{color:var(--btn-fg)}.tp-sglv_i{padding:0 4px}.tp-sglv.tp-v-disabled .tp-sglv_i{opacity:.5}.tp-mllv_i{display:block;height:calc(var(--bld-us)*3);line-height:var(--bld-us);padding:0 4px;resize:none;white-space:pre}.tp-mllv.tp-v-disabled .tp-mllv_i{opacity:.5}.tp-p2dv{position:relative}.tp-p2dv_h{display:flex}.tp-p2dv_b{height:var(--bld-us);margin-right:4px;position:relative;width:var(--bld-us)}.tp-p2dv_b svg{display:block;height:16px;left:50%;margin-left:-8px;margin-top:-8px;position:absolute;top:50%;width:16px}.tp-p2dv_b svg path{stroke:currentColor;stroke-width:2}.tp-p2dv_b svg circle{fill:currentColor}.tp-p2dv_t{flex:1}.tp-p2dv_p{height:0;margin-top:0;opacity:0;overflow:hidden;transition:height .2s ease-in-out,opacity .2s linear,margin .2s ease-in-out}.tp-p2dv.tp-p2dv-expanded .tp-p2dv_p{margin-top:var(--bld-s);opacity:1}.tp-p2dv .tp-popv{left:calc(-1*var(--cnt-h-p));right:calc(-1*var(--cnt-h-p));top:var(--bld-us)}.tp-p2dpv{padding-left:calc(var(--bld-us) + 4px)}.tp-p2dpv_p{cursor:crosshair;height:0;overflow:hidden;padding-bottom:100%;position:relative}.tp-p2dpv.tp-v-disabled .tp-p2dpv_p{opacity:.5}.tp-p2dpv_g{display:block;height:100%;left:0;pointer-events:none;position:absolute;top:0;width:100%}.tp-p2dpv_ax{opacity:.1;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_l{opacity:.5;stroke:var(--in-fg);stroke-dasharray:1}.tp-p2dpv_m{border:var(--in-fg) solid 1px;border-radius:50%;box-sizing:border-box;height:4px;margin-left:-2px;margin-top:-2px;position:absolute;width:4px}.tp-p2dpv_p:focus .tp-p2dpv_m{background-color:var(--in-fg);border-width:0}.tp-popv{background-color:var(--bs-bg);border-radius:6px;box-shadow:0 2px 4px var(--bs-sh);display:none;max-width:168px;padding:var(--cnt-v-p) var(--cnt-h-p);position:absolute;visibility:hidden;z-index:1000}.tp-popv.tp-popv-v{display:block;visibility:visible}.tp-sprv_r{background-color:var(--grv-fg);border-width:0;display:block;height:2px;margin:0;width:100%}.tp-sprv.tp-v-disabled .tp-sprv_r{opacity:.5}.tp-sldv.tp-v-disabled{opacity:.5}.tp-sldv_t{box-sizing:border-box;cursor:pointer;height:var(--bld-us);margin:0 6px;outline:none;position:relative}.tp-sldv_t::before{background-color:var(--in-bg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin:auto;position:absolute;right:0;top:0}.tp-sldv_k{height:100%;left:0;position:absolute;top:0}.tp-sldv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";display:block;height:2px;left:0;margin-bottom:auto;margin-top:auto;position:absolute;right:0;top:0}.tp-sldv_k::after{background-color:var(--btn-bg);border-radius:var(--elm-br);bottom:0;content:"";display:block;height:12px;margin-bottom:auto;margin-top:auto;position:absolute;right:-6px;top:0;width:12px}.tp-sldv_t:hover .tp-sldv_k::after{background-color:var(--btn-bg-h)}.tp-sldv_t:focus .tp-sldv_k::after{background-color:var(--btn-bg-f)}.tp-sldv_t:active .tp-sldv_k::after{background-color:var(--btn-bg-a)}.tp-sldtxtv{display:flex}.tp-sldtxtv_s{flex:2}.tp-sldtxtv_t{flex:1;margin-left:4px}.tp-tabv{position:relative}.tp-tabv_t{align-items:flex-end;color:var(--cnt-bg);display:flex;overflow:hidden;position:relative}.tp-tabv_t:hover{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus){color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active){color:var(--cnt-bg-a)}.tp-tabv_t::before{background-color:currentColor;bottom:0;content:"";height:2px;left:0;pointer-events:none;position:absolute;right:0}.tp-tabv.tp-v-disabled .tp-tabv_t::before{opacity:.5}.tp-tabv.tp-tabv-nop .tp-tabv_t{height:calc(var(--bld-us) + 4px);position:relative}.tp-tabv.tp-tabv-nop .tp-tabv_t::before{background-color:var(--cnt-bg);bottom:0;content:"";height:2px;left:0;position:absolute;right:0}.tp-tabv_c{padding-bottom:var(--cnt-v-p);padding-left:4px;padding-top:var(--cnt-v-p)}.tp-tabv_i{bottom:0;color:var(--cnt-bg);left:0;overflow:hidden;position:absolute;top:calc(var(--bld-us) + 4px);width:var(--bs-br)}.tp-tabv_i::before{background-color:currentColor;bottom:0;content:"";left:0;position:absolute;top:0;width:4px}.tp-tabv_t:hover+.tp-tabv_i{color:var(--cnt-bg-h)}.tp-tabv_t:has(*:focus)+.tp-tabv_i{color:var(--cnt-bg-f)}.tp-tabv_t:has(*:active)+.tp-tabv_i{color:var(--cnt-bg-a)}.tp-tabv.tp-v-disabled>.tp-tabv_i{opacity:.5}.tp-tbiv{flex:1;min-width:0;position:relative}.tp-tbiv+.tp-tbiv{margin-left:2px}.tp-tbiv+.tp-tbiv.tp-v-disabled::before{opacity:.5}.tp-tbiv_b{display:block;padding-left:calc(var(--cnt-h-p) + 4px);padding-right:calc(var(--cnt-h-p) + 4px);position:relative;width:100%}.tp-tbiv_b:disabled{opacity:.5}.tp-tbiv_b::before{background-color:var(--cnt-bg);bottom:2px;content:"";left:0;pointer-events:none;position:absolute;right:0;top:0}.tp-tbiv_b:hover::before{background-color:var(--cnt-bg-h)}.tp-tbiv_b:focus::before{background-color:var(--cnt-bg-f)}.tp-tbiv_b:active::before{background-color:var(--cnt-bg-a)}.tp-tbiv_t{color:var(--cnt-fg);height:calc(var(--bld-us) + 4px);line-height:calc(var(--bld-us) + 4px);opacity:.5;overflow:hidden;text-overflow:ellipsis}.tp-tbiv.tp-tbiv-sel .tp-tbiv_t{opacity:1}.tp-txtv{position:relative}.tp-txtv_i{padding:0 4px}.tp-txtv.tp-txtv-fst .tp-txtv_i{border-bottom-right-radius:0;border-top-right-radius:0}.tp-txtv.tp-txtv-mid .tp-txtv_i{border-radius:0}.tp-txtv.tp-txtv-lst .tp-txtv_i{border-bottom-left-radius:0;border-top-left-radius:0}.tp-txtv.tp-txtv-num .tp-txtv_i{text-align:right}.tp-txtv.tp-txtv-drg .tp-txtv_i{opacity:.3}.tp-txtv_k{cursor:pointer;height:100%;left:-3px;position:absolute;top:0;width:12px}.tp-txtv_k::before{background-color:var(--in-fg);border-radius:1px;bottom:0;content:"";height:calc(var(--bld-us) - 4px);left:50%;margin-bottom:auto;margin-left:-1px;margin-top:auto;opacity:.1;position:absolute;top:0;transition:border-radius .1s,height .1s,transform .1s,width .1s;width:2px}.tp-txtv_k:hover::before,.tp-txtv.tp-txtv-drg .tp-txtv_k::before{opacity:1}.tp-txtv.tp-txtv-drg .tp-txtv_k::before{border-radius:50%;height:4px;transform:translateX(-1px);width:4px}.tp-txtv_g{bottom:0;display:block;height:8px;left:50%;margin:auto;overflow:visible;pointer-events:none;position:absolute;top:0;visibility:hidden;width:100%}.tp-txtv.tp-txtv-drg .tp-txtv_g{visibility:visible}.tp-txtv_gb{fill:none;stroke:var(--in-fg);stroke-dasharray:1}.tp-txtv_gh{fill:none;stroke:var(--in-fg)}.tp-txtv .tp-ttv{margin-left:6px;visibility:hidden}.tp-txtv.tp-txtv-drg .tp-ttv{visibility:visible}.tp-ttv{background-color:var(--in-fg);border-radius:var(--elm-br);color:var(--bs-bg);padding:2px 4px;pointer-events:none;position:absolute;transform:translate(-50%, -100%)}.tp-ttv::before{border-color:var(--in-fg) rgba(0,0,0,0) rgba(0,0,0,0) rgba(0,0,0,0);border-style:solid;border-width:2px;box-sizing:border-box;content:"";font-size:.9em;height:4px;left:50%;margin-left:-2px;position:absolute;top:100%;width:4px}.tp-rotv{background-color:var(--bs-bg);border-radius:var(--bs-br);box-shadow:0 2px 4px var(--bs-sh);font-family:var(--font-family);font-size:11px;font-weight:500;line-height:1;text-align:left}.tp-rotv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br);border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br);padding-left:calc(4px + var(--bld-us) + var(--cnt-h-p));text-align:center}.tp-rotv.tp-rotv-expanded .tp-rotv_b{border-bottom-left-radius:0;border-bottom-right-radius:0}.tp-rotv.tp-rotv-not .tp-rotv_b{display:none}.tp-rotv_b:disabled .tp-rotv_m{display:none}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst>.tp-fldv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv_c>.tp-fldv.tp-v-lst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c .tp-fldv.tp-v-vlst:not(.tp-fldv-expanded)>.tp-fldv_b{border-bottom-right-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-fldv.tp-v-fst>.tp-fldv_b{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_c{border-bottom-left-radius:var(--bs-br);border-bottom-right-radius:var(--bs-br)}.tp-rotv_c>.tp-tabv.tp-v-lst>.tp-tabv_i{border-bottom-left-radius:var(--bs-br)}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst{margin-top:calc(-1*var(--cnt-v-p))}.tp-rotv.tp-rotv-not .tp-rotv_c>.tp-tabv.tp-v-fst>.tp-tabv_t{border-top-left-radius:var(--bs-br);border-top-right-radius:var(--bs-br)}.tp-rotv.tp-v-disabled,.tp-rotv .tp-v-disabled{pointer-events:none}.tp-rotv.tp-v-hidden,.tp-rotv .tp-v-hidden{display:none}');
            this.pool_.getAll().forEach((plugin) => {
                this.embedPluginStyle_(plugin);
            });
            this.registerPlugin({
                plugins: [
                    SliderBladePlugin,
                    ListBladePlugin,
                    TabBladePlugin,
                    TextBladePlugin,
                ],
            });
        }
    }

    const VERSION = new Semver('3.1.7');

    exports.BladeApi = BladeApi;
    exports.ButtonApi = ButtonApi;
    exports.FolderApi = FolderApi;
    exports.InputBindingApi = InputBindingApi;
    exports.ListApi = ListApi;
    exports.MonitorBindingApi = MonitorBindingApi;
    exports.Pane = Pane;
    exports.SeparatorApi = SeparatorApi;
    exports.SliderApi = SliderApi;
    exports.TabApi = TabApi;
    exports.TabPageApi = TabPageApi;
    exports.TextApi = TextApi;
    exports.TpChangeEvent = TpChangeEvent;
    exports.VERSION = VERSION;

    Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),

/***/ 61:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var _typeof = (__webpack_require__(698)["default"]);
function _regeneratorRuntime() {
  "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */
  module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
    return exports;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  var exports = {},
    Op = Object.prototype,
    hasOwn = Op.hasOwnProperty,
    defineProperty = Object.defineProperty || function (obj, key, desc) {
      obj[key] = desc.value;
    },
    $Symbol = "function" == typeof Symbol ? Symbol : {},
    iteratorSymbol = $Symbol.iterator || "@@iterator",
    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }
  try {
    define({}, "");
  } catch (err) {
    define = function define(obj, key, value) {
      return obj[key] = value;
    };
  }
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
      generator = Object.create(protoGenerator.prototype),
      context = new Context(tryLocsList || []);
    return defineProperty(generator, "_invoke", {
      value: makeInvokeMethod(innerFn, self, context)
    }), generator;
  }
  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }
  exports.wrap = wrap;
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if ("throw" !== record.type) {
        var result = record.arg,
          value = result.value;
        return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }
      reject(record.arg);
    }
    var previousPromise;
    defineProperty(this, "_invoke", {
      value: function value(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new PromiseImpl(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }
        return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(innerFn, self, context) {
    var state = "suspendedStart";
    return function (method, arg) {
      if ("executing" === state) throw new Error("Generator is already running");
      if ("completed" === state) {
        if ("throw" === method) throw arg;
        return doneResult();
      }
      for (context.method = method, context.arg = arg;;) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
          if ("suspendedStart" === state) throw state = "completed", context.arg;
          context.dispatchException(context.arg);
        } else "return" === context.method && context.abrupt("return", context.arg);
        state = "executing";
        var record = tryCatch(innerFn, self, context);
        if ("normal" === record.type) {
          if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
          return {
            value: record.arg,
            done: context.done
          };
        }
        "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method,
      method = delegate.iterator[methodName];
    if (undefined === method) return context.delegate = null, "throw" === methodName && delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method) || "return" !== methodName && (context.method = "throw", context.arg = new TypeError("The iterator does not provide a '" + methodName + "' method")), ContinueSentinel;
    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }
  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;
      if (!isNaN(iterable.length)) {
        var i = -1,
          next = function next() {
            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
            return next.value = undefined, next.done = !0, next;
          };
        return next.next = next;
      }
    }
    return {
      next: doneResult
    };
  }
  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, defineProperty(Gp, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), defineProperty(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (val) {
    var object = Object(val),
      keys = [];
    for (var key in object) keys.push(key);
    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function reset(skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function stop() {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function dispatchException(exception) {
      if (this.done) throw exception;
      var context = this;
      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
          record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
            hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function abrupt(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function complete(record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function finish(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    "catch": function _catch(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function delegateYield(iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 698:
/***/ ((module) => {

function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ }),

/***/ 687:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(61)();
module.exports = runtime;

// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPrimitive.js

function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/toPropertyKey.js


function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/createClass.js

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__(687);
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };
  return _setPrototypeOf(o, p);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/inherits.js

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js


function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return _assertThisInitialized(self);
}
;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/common.js
/**
 * Common utilities
 * @module glMatrix
 */
// Configuration Constants
var EPSILON = 0.000001;
var ARRAY_TYPE = typeof Float32Array !== 'undefined' ? Float32Array : Array;
var RANDOM = Math.random;
/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Float32ArrayConstructor | ArrayConstructor} type Array type, such as Float32Array or Array
 */

function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}
var degree = Math.PI / 180;
/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */

function toRadian(a) {
  return a * degree;
}
/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */

function equals(a, b) {
  return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
}
if (!Math.hypot) Math.hypot = function () {
  var y = 0,
      i = arguments.length;

  while (i--) {
    y += arguments[i] * arguments[i];
  }

  return Math.sqrt(y);
};
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/vec3.js

/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */

function create() {
  var out = new ARRAY_TYPE(3);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
  }

  return out;
}
/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {ReadonlyVec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */

function clone(a) {
  var out = new glMatrix.ARRAY_TYPE(3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */

function vec3_length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return Math.hypot(x, y, z);
}
/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */

function fromValues(x, y, z) {
  var out = new ARRAY_TYPE(3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */

function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */

function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to ceil
 * @returns {vec3} out
 */

function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}
/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to floor
 * @returns {vec3} out
 */

function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}
/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}
/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}
/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to round
 * @returns {vec3} out
 */

function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}
/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */

function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */

function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} distance between a and b
 */

function distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return Math.hypot(x, y, z);
}
/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} squared distance between a and b
 */

function squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  return x * x + y * y + z * z;
}
/**
 * Calculates the squared length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  return x * x + y * y + z * z;
}
/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */

function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to invert
 * @returns {vec3} out
 */

function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}
/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */

function normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var len = x * x + y * y + z * z;

  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */

function cross(out, a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2];
  var bx = b[0],
      by = b[1],
      bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function hermite(out, a, b, c, d, t) {
  var factorTimes2 = t * t;
  var factor1 = factorTimes2 * (2 * t - 3) + 1;
  var factor2 = factorTimes2 * (t - 2) + t;
  var factor3 = factorTimes2 * (t - 1);
  var factor4 = factorTimes2 * (3 - 2 * t);
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @param {ReadonlyVec3} c the third operand
 * @param {ReadonlyVec3} d the fourth operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec3} out
 */

function bezier(out, a, b, c, d, t) {
  var inverseFactor = 1 - t;
  var inverseFactorTimesTwo = inverseFactor * inverseFactor;
  var factorTimes2 = t * t;
  var factor1 = inverseFactorTimesTwo * inverseFactor;
  var factor2 = 3 * t * inverseFactorTimesTwo;
  var factor3 = 3 * factorTimes2 * inverseFactor;
  var factor4 = factorTimes2 * t;
  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */

function random(out, scale) {
  scale = scale || 1.0;
  var r = glMatrix.RANDOM() * 2.0 * Math.PI;
  var z = glMatrix.RANDOM() * 2.0 - 1.0;
  var zScale = Math.sqrt(1.0 - z * z) * scale;
  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}
/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec3} out
 */

function transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyMat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */

function transformMat3(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
/**
 * Transforms the vec3 with a quat
 * Can also be used for dual quaternions. (Multiply it with the real part)
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec3} out
 */

function transformQuat(out, a, q) {
  // benchmarks: https://jsperf.com/quaternion-transform-vec3-implementations-fixed
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3];
  var x = a[0],
      y = a[1],
      z = a[2]; // var qvec = [qx, qy, qz];
  // var uv = vec3.cross([], qvec, a);

  var uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x; // var uuv = vec3.cross([], qvec, uv);

  var uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx; // vec3.scale(uv, uv, 2 * w);

  var w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2; // vec3.scale(uuv, uuv, 2);

  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2; // return vec3.add(out, a, vec3.add(out, uv, uuv));

  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateX(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0];
  r[1] = p[1] * Math.cos(rad) - p[2] * Math.sin(rad);
  r[2] = p[1] * Math.sin(rad) + p[2] * Math.cos(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateY(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[2] * Math.sin(rad) + p[0] * Math.cos(rad);
  r[1] = p[1];
  r[2] = p[2] * Math.cos(rad) - p[0] * Math.sin(rad); //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {ReadonlyVec3} a The vec3 point to rotate
 * @param {ReadonlyVec3} b The origin of the rotation
 * @param {Number} rad The angle of rotation in radians
 * @returns {vec3} out
 */

function rotateZ(out, a, b, rad) {
  var p = [],
      r = []; //Translate point to the origin

  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2]; //perform rotation

  r[0] = p[0] * Math.cos(rad) - p[1] * Math.sin(rad);
  r[1] = p[0] * Math.sin(rad) + p[1] * Math.cos(rad);
  r[2] = p[2]; //translate to correct position

  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];
  return out;
}
/**
 * Get the angle between two 3D vectors
 * @param {ReadonlyVec3} a The first operand
 * @param {ReadonlyVec3} b The second operand
 * @returns {Number} The angle in radians
 */

function angle(a, b) {
  var ax = a[0],
      ay = a[1],
      az = a[2],
      bx = b[0],
      by = b[1],
      bz = b[2],
      mag1 = Math.sqrt(ax * ax + ay * ay + az * az),
      mag2 = Math.sqrt(bx * bx + by * by + bz * bz),
      mag = mag1 * mag2,
      cosine = mag && dot(a, b) / mag;
  return Math.acos(Math.min(Math.max(cosine, -1), 1));
}
/**
 * Set the components of a vec3 to zero
 *
 * @param {vec3} out the receiving vector
 * @returns {vec3} out
 */

function zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function str(a) {
  return "vec3(" + a[0] + ", " + a[1] + ", " + a[2] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec3} a The first vector.
 * @param {ReadonlyVec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function vec3_equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2));
}
/**
 * Alias for {@link vec3.subtract}
 * @function
 */

var sub = subtract;
/**
 * Alias for {@link vec3.multiply}
 * @function
 */

var mul = multiply;
/**
 * Alias for {@link vec3.divide}
 * @function
 */

var div = (/* unused pure expression or super */ null && (divide));
/**
 * Alias for {@link vec3.distance}
 * @function
 */

var dist = (/* unused pure expression or super */ null && (distance));
/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */

var sqrDist = (/* unused pure expression or super */ null && (squaredDistance));
/**
 * Alias for {@link vec3.length}
 * @function
 */

var len = (/* unused pure expression or super */ null && (vec3_length));
/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */

var sqrLen = (/* unused pure expression or super */ null && (squaredLength));
/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var forEach = function () {
  var vec = create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 3;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
    }

    return a;
  };
}();
;// CONCATENATED MODULE: ./node_modules/gl-matrix/esm/vec4.js

/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */

function vec4_create() {
  var out = new ARRAY_TYPE(4);

  if (ARRAY_TYPE != Float32Array) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
  }

  return out;
}
/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {ReadonlyVec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */

function vec4_clone(a) {
  var out = new glMatrix.ARRAY_TYPE(4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */

function vec4_fromValues(x, y, z, w) {
  var out = new ARRAY_TYPE(4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the source vector
 * @returns {vec4} out
 */

function vec4_copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */

function vec4_set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}
/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}
/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}
/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}
/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to ceil
 * @returns {vec4} out
 */

function vec4_ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}
/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to floor
 * @returns {vec4} out
 */

function vec4_floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}
/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}
/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {vec4} out
 */

function vec4_max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}
/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to round
 * @returns {vec4} out
 */

function vec4_round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}
/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */

function vec4_scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}
/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */

function vec4_scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + b[0] * scale;
  out[1] = a[1] + b[1] * scale;
  out[2] = a[2] + b[2] * scale;
  out[3] = a[3] + b[3] * scale;
  return out;
}
/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} distance between a and b
 */

function vec4_distance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} squared distance between a and b
 */

function vec4_squaredDistance(a, b) {
  var x = b[0] - a[0];
  var y = b[1] - a[1];
  var z = b[2] - a[2];
  var w = b[3] - a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Calculates the length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate length of
 * @returns {Number} length of a
 */

function vec4_length(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return Math.hypot(x, y, z, w);
}
/**
 * Calculates the squared length of a vec4
 *
 * @param {ReadonlyVec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */

function vec4_squaredLength(a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  return x * x + y * y + z * z + w * w;
}
/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to negate
 * @returns {vec4} out
 */

function vec4_negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}
/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to invert
 * @returns {vec4} out
 */

function vec4_inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}
/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a vector to normalize
 * @returns {vec4} out
 */

function vec4_normalize(out, a) {
  var x = a[0];
  var y = a[1];
  var z = a[2];
  var w = a[3];
  var len = x * x + y * y + z * z + w * w;

  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }

  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
/**
 * Calculates the dot product of two vec4's
 *
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @returns {Number} dot product of a and b
 */

function vec4_dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
/**
 * Returns the cross-product of three vectors in a 4-dimensional space
 *
 * @param {ReadonlyVec4} result the receiving vector
 * @param {ReadonlyVec4} U the first vector
 * @param {ReadonlyVec4} V the second vector
 * @param {ReadonlyVec4} W the third vector
 * @returns {vec4} result
 */

function vec4_cross(out, u, v, w) {
  var A = v[0] * w[1] - v[1] * w[0],
      B = v[0] * w[2] - v[2] * w[0],
      C = v[0] * w[3] - v[3] * w[0],
      D = v[1] * w[2] - v[2] * w[1],
      E = v[1] * w[3] - v[3] * w[1],
      F = v[2] * w[3] - v[3] * w[2];
  var G = u[0];
  var H = u[1];
  var I = u[2];
  var J = u[3];
  out[0] = H * F - I * E + J * D;
  out[1] = -(G * F) + I * C - J * B;
  out[2] = G * E - H * C + J * A;
  out[3] = -(G * D) + H * B - I * A;
  return out;
}
/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the first operand
 * @param {ReadonlyVec4} b the second operand
 * @param {Number} t interpolation amount, in the range [0-1], between the two inputs
 * @returns {vec4} out
 */

function vec4_lerp(out, a, b, t) {
  var ax = a[0];
  var ay = a[1];
  var az = a[2];
  var aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}
/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */

function vec4_random(out, scale) {
  scale = scale || 1.0; // Marsaglia, George. Choosing a Point from the Surface of a
  // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
  // http://projecteuclid.org/euclid.aoms/1177692644;

  var v1, v2, v3, v4;
  var s1, s2;

  do {
    v1 = glMatrix.RANDOM() * 2 - 1;
    v2 = glMatrix.RANDOM() * 2 - 1;
    s1 = v1 * v1 + v2 * v2;
  } while (s1 >= 1);

  do {
    v3 = glMatrix.RANDOM() * 2 - 1;
    v4 = glMatrix.RANDOM() * 2 - 1;
    s2 = v3 * v3 + v4 * v4;
  } while (s2 >= 1);

  var d = Math.sqrt((1 - s1) / s2);
  out[0] = scale * v1;
  out[1] = scale * v2;
  out[2] = scale * v3 * d;
  out[3] = scale * v4 * d;
  return out;
}
/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */

function vec4_transformMat4(out, a, m) {
  var x = a[0],
      y = a[1],
      z = a[2],
      w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}
/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyQuat} q quaternion to transform with
 * @returns {vec4} out
 */

function vec4_transformQuat(out, a, q) {
  var x = a[0],
      y = a[1],
      z = a[2];
  var qx = q[0],
      qy = q[1],
      qz = q[2],
      qw = q[3]; // calculate quat * vec

  var ix = qw * x + qy * z - qz * y;
  var iy = qw * y + qz * x - qx * z;
  var iz = qw * z + qx * y - qy * x;
  var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}
/**
 * Set the components of a vec4 to zero
 *
 * @param {vec4} out the receiving vector
 * @returns {vec4} out
 */

function vec4_zero(out) {
  out[0] = 0.0;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  return out;
}
/**
 * Returns a string representation of a vector
 *
 * @param {ReadonlyVec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */

function vec4_str(a) {
  return "vec4(" + a[0] + ", " + a[1] + ", " + a[2] + ", " + a[3] + ")";
}
/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function vec4_exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}
/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {ReadonlyVec4} a The first vector.
 * @param {ReadonlyVec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */

function vec4_equals(a, b) {
  var a0 = a[0],
      a1 = a[1],
      a2 = a[2],
      a3 = a[3];
  var b0 = b[0],
      b1 = b[1],
      b2 = b[2],
      b3 = b[3];
  return Math.abs(a0 - b0) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a0), Math.abs(b0)) && Math.abs(a1 - b1) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a1), Math.abs(b1)) && Math.abs(a2 - b2) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a2), Math.abs(b2)) && Math.abs(a3 - b3) <= glMatrix.EPSILON * Math.max(1.0, Math.abs(a3), Math.abs(b3));
}
/**
 * Alias for {@link vec4.subtract}
 * @function
 */

var vec4_sub = (/* unused pure expression or super */ null && (vec4_subtract));
/**
 * Alias for {@link vec4.multiply}
 * @function
 */

var vec4_mul = (/* unused pure expression or super */ null && (vec4_multiply));
/**
 * Alias for {@link vec4.divide}
 * @function
 */

var vec4_div = (/* unused pure expression or super */ null && (vec4_divide));
/**
 * Alias for {@link vec4.distance}
 * @function
 */

var vec4_dist = (/* unused pure expression or super */ null && (vec4_distance));
/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */

var vec4_sqrDist = (/* unused pure expression or super */ null && (vec4_squaredDistance));
/**
 * Alias for {@link vec4.length}
 * @function
 */

var vec4_len = (/* unused pure expression or super */ null && (vec4_length));
/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */

var vec4_sqrLen = (/* unused pure expression or super */ null && (vec4_squaredLength));
/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */

var vec4_forEach = function () {
  var vec = vec4_create();
  return function (a, stride, offset, count, fn, arg) {
    var i, l;

    if (!stride) {
      stride = 4;
    }

    if (!offset) {
      offset = 0;
    }

    if (count) {
      l = Math.min(count * stride + offset, a.length);
    } else {
      l = a.length;
    }

    for (i = offset; i < l; i += stride) {
      vec[0] = a[i];
      vec[1] = a[i + 1];
      vec[2] = a[i + 2];
      vec[3] = a[i + 3];
      fn(vec, vec, arg);
      a[i] = vec[0];
      a[i + 1] = vec[1];
      a[i + 2] = vec[2];
      a[i + 3] = vec[3];
    }

    return a;
  };
}();
// EXTERNAL MODULE: ./node_modules/tweakpane/dist/tweakpane.js
var tweakpane = __webpack_require__(498);
;// CONCATENATED MODULE: ./src/renderer.ts









function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
/// <reference types="@webgpu/types" />



function Buf2Hex(buffer) {
  return _toConsumableArray(new Uint8Array(buffer)).map(function (x, i) {
    return (i % 4 == 0 ? '\n' : '') + x.toString(16).padStart(2, '0');
  }).join(' ');
}
;
function Merge() {
  for (var _len = arguments.length, buffers = new Array(_len), _key = 0; _key < _len; _key++) {
    buffers[_key] = arguments[_key];
  }
  var size = buffers.reduce(function (p, b) {
    return p + b.byteLength;
  }, 0);
  var merged = new Uint8Array(size);
  var offset = 0;
  buffers.forEach(function (b, i) {
    merged.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  });
  return merged;
}
function Copy(src, dst, offset) {
  new Uint8Array(dst, offset).set(new Uint8Array(src));
}
var BufferWriter = /*#__PURE__*/function () {
  function BufferWriter(buffer) {
    _classCallCheck(this, BufferWriter);
    this.buffer = buffer;
  }
  _createClass(BufferWriter, [{
    key: "setU32",
    value: function setU32(offset, v) {
      new Uint32Array(this.buffer, offset).set([v]);
    }
  }, {
    key: "setI32",
    value: function setI32(offset, v) {
      new Int32Array(this.buffer, offset).set([v]);
    }
  }, {
    key: "setF32",
    value: function setF32(offset, v) {
      new Float32Array(this.buffer, offset).set([v]);
    }
  }, {
    key: "setVec3f",
    value: function setVec3f(offset, v) {
      new Float32Array(this.buffer, offset).set([v[0], v[1], v[2]]);
    }
  }, {
    key: "setVec4f",
    value: function setVec4f(offset, v) {
      new Float32Array(this.buffer, offset).set([v[0], v[1], v[2], v[3]]);
    }
  }]);
  return BufferWriter;
}();
var DynamicBuffer = /*#__PURE__*/function () {
  function DynamicBuffer() {
    _classCallCheck(this, DynamicBuffer);
    _defineProperty(this, "count", 0);
  }
  _createClass(DynamicBuffer, [{
    key: "add",
    value: function add(in_buffer) {
      if (this.buffer === undefined) {
        this.buffer = in_buffer;
      } else {
        this.buffer = Merge(this.buffer, in_buffer);
      }
      this.count += 1;
    }
  }]);
  return DynamicBuffer;
}();
var Materials = /*#__PURE__*/function (_DynamicBuffer) {
  _inherits(Materials, _DynamicBuffer);
  var _super = _createSuper(Materials);
  function Materials() {
    _classCallCheck(this, Materials);
    return _super.apply(this, arguments);
  }
  _createClass(Materials, [{
    key: "addLambertian",
    value:
    // /*            align(16) size(16) */ struct lambertian_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 1) size( 4) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*            align(16) size(16) */ struct metal_material {
    // /* offset( 0) align(16) size(12) */   albedo : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   fuzz : f32;
    // /*                               */ };

    // /*           align(4) size(4) */ struct dielectric_material {
    // /* offset(0) align(4) size(4) */   ir : f32;
    // /*                            */ };

    // /*            align(16) size(64) */ struct material {
    // /* offset( 0) align( 4) size( 4) */   ty : u32;
    // /* offset( 4) align( 1) size(12) */   // -- implicit field alignment padding --;
    // /* offset(16) align(16) size(16) */   lambertian : lambertian_material;
    // /* offset(32) align(16) size(16) */   metal : metal_material;
    // /* offset(48) align( 4) size( 4) */   dielectric : dielectric_material;
    // /* offset(52) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };
    function addLambertian(albedo) {
      var b = new ArrayBuffer(64);
      var w = new BufferWriter(b);
      // ty
      w.setU32(0, 0); // ty
      w.setVec3f(16 + 0, albedo);
      this.add(b);
      return this.count - 1;
    }
  }, {
    key: "addMetal",
    value: function addMetal(albedo, fuzz) {
      var b = new ArrayBuffer(64);
      var w = new BufferWriter(b);
      w.setU32(0, 1); // ty
      w.setVec3f(32 + 0, albedo);
      w.setF32(32 + 12, fuzz);
      this.add(b);
      return this.count - 1;
    }
  }, {
    key: "addDieletric",
    value: function addDieletric(ir) {
      var b = new ArrayBuffer(64);
      var w = new BufferWriter(b);
      w.setU32(0, 2); // ty
      w.setF32(48 + 0, ir);
      this.add(b);
      return this.count - 1;
    }
  }]);
  return Materials;
}(DynamicBuffer);
var HittableList = /*#__PURE__*/function (_DynamicBuffer2) {
  _inherits(HittableList, _DynamicBuffer2);
  var _super2 = _createSuper(HittableList);
  function HittableList() {
    _classCallCheck(this, HittableList);
    return _super2.apply(this, arguments);
  }
  _createClass(HittableList, [{
    key: "addSphere",
    value:
    // /*            align(16) size(32) */ struct sphere {
    // /* offset( 0) align(16) size(12) */   center : vec3<f32>;
    // /* offset(12) align( 4) size( 4) */   radius : f32;
    // /* offset(16) align( 4) size( 4) */   mat : u32;
    // /* offset(20) align( 1) size(12) */   // -- implicit struct size padding --;
    // /*                               */ };

    // /*             align(16) size(???) */ struct hittable_list {
    // /* offset(  0) align(16) size(???) */   spheres : array<sphere, ?>;
    // /*                                 */ };
    function addSphere(center, radius, mat) {
      var b = new ArrayBuffer(32);
      var w = new BufferWriter(b);
      w.setVec3f(0, center);
      w.setF32(12, radius);
      w.setU32(16, mat);
      this.add(b);
    }
  }]);
  return HittableList;
}(DynamicBuffer);
var CameraCreateParams = /*#__PURE__*/function () {
  // /*            align(16) size(64) */ struct camera_create_params {
  // /* offset( 0) align(16) size(12) */   lookfrom : vec3<f32>;
  // /* offset(12) align( 1) size( 4) */   // -- implicit field alignment padding --;
  // /* offset(16) align(16) size(12) */   lookat : vec3<f32>;
  // /* offset(28) align( 1) size( 4) */   // -- implicit field alignment padding --;
  // /* offset(32) align(16) size(12) */   vup : vec3<f32>;
  // /* offset(44) align( 4) size( 4) */   vfov : f32;
  // /* offset(48) align( 4) size( 4) */   aspect_ratio : f32;
  // /* offset(52) align( 4) size( 4) */   aperture : f32;
  // /* offset(56) align( 4) size( 4) */   focus_dist : f32;
  // /* offset(60) align( 1) size( 4) */   // -- implicit struct size padding --;
  // /*                               */ };

  function CameraCreateParams() {
    _classCallCheck(this, CameraCreateParams);
    this.buffer = new ArrayBuffer(112);
    this.writer = new BufferWriter(this.buffer);
    // Set some useful defaults
    this.lookfrom(fromValues(0, 0, 0));
    this.lookat(fromValues(0, 0, -1));
    this.vup(fromValues(0, 1, 0));
    this.vfov(20.0);
    this.aspect_ratio(16.0 / 9.0);
    this.aperture(0.02);
    this.focus_dist(1.0);
  }
  _createClass(CameraCreateParams, [{
    key: "lookfrom",
    value: function lookfrom(v) {
      this.writer.setVec3f(0, v);
      return this;
    }
  }, {
    key: "lookat",
    value: function lookat(v) {
      this.writer.setVec3f(16, v);
      return this;
    }
  }, {
    key: "vup",
    value: function vup(v) {
      this.writer.setVec3f(32, v);
      return this;
    }
  }, {
    key: "vfov",
    value: function vfov(v) {
      this.writer.setF32(44, v);
      return this;
    }
  }, {
    key: "aspect_ratio",
    value: function aspect_ratio(v) {
      this.writer.setF32(48, v);
      return this;
    }
  }, {
    key: "aperture",
    value: function aperture(v) {
      this.writer.setF32(52, v);
      return this;
    }
  }, {
    key: "focus_dist",
    value: function focus_dist(v) {
      this.writer.setF32(56, v);
      return this;
    }
  }]);
  return CameraCreateParams;
}();
var RaytracerConfig = /*#__PURE__*/function () {
  // /*            align(16) size(48) */ struct raytracer_config {
  // /* offset( 0) align( 4) size( 4) */   samples_per_pixel : u32;
  // /* offset( 4) align( 4) size( 4) */   max_depth : u32;
  // /* offset( 8) align( 1) size( 8) */   // -- implicit field alignment padding --;
  // /* offset(16) align(16) size(16) */   rand_seed : vec4<f32>;
  // /* offset(32) align( 4) size( 4) */   weight : f32;
  // /* offset(36) align( 1) size(12) */   // -- implicit struct size padding --;
  // /*                               */ };

  function RaytracerConfig() {
    _classCallCheck(this, RaytracerConfig);
    this.buffer = new ArrayBuffer(112);
    this.writer = new BufferWriter(this.buffer);
    // Set some useful defaults
    this.samples_per_pixel(25);
    this.max_depth(10);
  }
  _createClass(RaytracerConfig, [{
    key: "samples_per_pixel",
    value: function samples_per_pixel(v) {
      this.writer.setU32(0, v);
      return this;
    }
  }, {
    key: "max_depth",
    value: function max_depth(v) {
      this.writer.setU32(4, v);
      return this;
    }
  }, {
    key: "rand_seed",
    value: function rand_seed(v) {
      this.writer.setVec4f(16, v);
      return this;
    }
  }, {
    key: "weight",
    value: function weight(v) {
      this.writer.setF32(32, v);
      return this;
    }
  }]);
  return RaytracerConfig;
}();
var Dims = /*#__PURE__*/_createClass(function Dims() {
  var width = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  _classCallCheck(this, Dims);
  this.width = width;
  this.height = height;
});
var Renderer = /*#__PURE__*/function () {
  // API Data Structures

  // Frame Backings

  // Compute vars
  // Size of each workgroup
  // Number of workgroups to dispatch

  // Config vars

  function Renderer(canvas) {
    _classCallCheck(this, Renderer);
    _defineProperty(this, "bindings", {
      output: 0,
      materials: 1,
      hittable_list: 2,
      camera_create_params: 3,
      raytracer_config: 4
    });
    _defineProperty(this, "config", {
      resolutionIndex: 0,
      // Set to list of [width, height]
      scene: 1,
      samplesPerPixel: 25,
      infiniteSamples: false,
      maxDepth: 10
    });
    _defineProperty(this, "dirty", true);
    _defineProperty(this, "frameSamplesPerPixel", {
      max: 1,
      // Max per frame (constant)
      left: 0,
      // How many are left to process this frame
      done: 0 // How many processed so far
    });
    this.canvas = canvas;
    this.renderDims = new Dims(canvas.width, canvas.height);
  }
  _createClass(Renderer, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.initializeAPI();
            case 2:
              if (!_context.sent) {
                _context.next = 5;
                break;
              }
              _context.next = 5;
              return this.onResize();
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "updateScene",
    value: function updateScene() {
      this.materials = new Materials();
      this.hittableList = new HittableList();
      this.cameraCreateParams = new CameraCreateParams();
      var scene = this.config.scene;
      if (scene === 11 || scene === 12) {
        this.materials.addLambertian(fromValues(0.8, 0.8, 0.0));
        this.materials.addLambertian(fromValues(0.7, 0.3, 0.3));
        if (scene == 11) {
          this.materials.addMetal(fromValues(0.8, 0.8, 0.8), 0.0);
          this.materials.addMetal(fromValues(0.8, 0.6, 0.2), 0.0);
        } else {
          this.materials.addMetal(fromValues(0.8, 0.8, 0.8), 0.3);
          this.materials.addMetal(fromValues(0.8, 0.6, 0.2), 1.0);
        }
        this.hittableList.addSphere(fromValues(0.0, -100.5, -1.0), 100.0, 0);
        this.hittableList.addSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
        this.hittableList.addSphere(fromValues(-1.0, 0.0, -1.0), 0.5, 2);
        this.hittableList.addSphere(fromValues(1.0, 0.0, -1.0), 0.5, 3);
        var _lookfrom = fromValues(0, 0, 0);
        var _lookat = fromValues(0, 0, -1);
        var delta = create();
        sub(delta, _lookat, _lookfrom);
        var focus_dist = vec3_length(delta);
        this.cameraCreateParams.lookfrom(_lookfrom).lookat(_lookat).vup(fromValues(0, 1, 0)).focus_dist(focus_dist).aperture(0.0).vfov(90.0).aspect_ratio(this.renderDims.width / this.renderDims.height);
      } else if (scene === 16 || scene === 18 || scene === 19) {
        this.materials.addLambertian(fromValues(0.8, 0.8, 0.0));
        this.materials.addLambertian(fromValues(0.1, 0.2, 0.5));
        this.materials.addDieletric(1.5);
        this.materials.addMetal(fromValues(0.8, 0.6, 0.2), 0.0);
        this.hittableList.addSphere(fromValues(0.0, -100.5, -1.0), 100.0, 0);
        this.hittableList.addSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
        this.hittableList.addSphere(fromValues(-1.0, 0.0, -1.0), 0.5, 2);
        this.hittableList.addSphere(fromValues(-1.0, 0.0, -1.0), -0.4, 2);
        this.hittableList.addSphere(fromValues(1.0, 0.0, -1.0), 0.5, 3);
        var lookfrom;
        var lookat;
        var vfov;
        if (scene === 16) {
          lookfrom = fromValues(0, 0, 0);
          lookat = fromValues(0, 0, -1);
          vfov = 90;
        } else if (scene === 18) {
          lookfrom = fromValues(-2, 2, 1);
          lookat = fromValues(0, 0, -1);
          vfov = 90;
        } else if (scene === 19) {
          lookfrom = fromValues(-2, 2, 1);
          lookat = fromValues(0, 0, -1);
          vfov = 20;
        }
        var _delta = create();
        sub(_delta, lookat, lookfrom);
        var _focus_dist = vec3_length(_delta);
        this.cameraCreateParams.lookfrom(lookfrom).lookat(lookat).vup(fromValues(0, 1, 0)).focus_dist(_focus_dist).aperture(0.0).vfov(vfov).aspect_ratio(this.renderDims.width / this.renderDims.height);
      } else if (scene === 20) {
        this.materials.addLambertian(fromValues(0.8, 0.8, 0.0));
        this.materials.addLambertian(fromValues(0.1, 0.2, 0.5));
        this.materials.addDieletric(1.5);
        this.materials.addMetal(fromValues(0.8, 0.6, 0.2), 0.0);
        this.hittableList.addSphere(fromValues(0.0, -100.5, -1.0), 100.0, 0);
        this.hittableList.addSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
        this.hittableList.addSphere(fromValues(0.0, 0.0, -1.0), 0.5, 1);
        this.hittableList.addSphere(fromValues(-1.0, 0.0, -1.0), 0.5, 2);
        this.hittableList.addSphere(fromValues(-1.0, 0.0, -1.0), -0.4, 2);
        this.hittableList.addSphere(fromValues(1.0, 0.0, -1.0), 0.5, 3);
        var _lookfrom2 = fromValues(3, 3, 2);
        var _lookat2 = fromValues(0, 0, -1);
        var _delta2 = create();
        sub(_delta2, _lookat2, _lookfrom2);
        var _focus_dist2 = vec3_length(_delta2);
        this.cameraCreateParams.lookfrom(_lookfrom2).lookat(_lookat2).vup(fromValues(0, 1, 0)).focus_dist(_focus_dist2).aperture(2.0).vfov(20.0).aspect_ratio(this.renderDims.width / this.renderDims.height);
      } else if (scene === 21) {
        var ground_material = this.materials.addLambertian(fromValues(0.5, 0.5, 0.5));
        this.hittableList.addSphere(fromValues(0, -1000, 0), 1000, ground_material);
        var rand = function rand() {
          var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          return Math.random() * (max - min) + min;
        };
        var randomColor = function randomColor() {
          var min = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var max = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
          return fromValues(rand(min, max), rand(min, max), rand(min, max));
        };
        for (var a = -11; a < 11; a++) {
          for (var b = -11; b < 11; b++) {
            var choose_mat = Math.random();
            var center = fromValues(a + 0.9 * rand(), 0.2, b + 0.9 * rand());
            var _delta3 = create();
            sub(_delta3, center, fromValues(4, 0.2, 0));
            if (_delta3.length > 0.9) {
              if (choose_mat < 0.8) {
                // diffuse
                var albedo = create();
                mul(albedo, randomColor(), randomColor());
                var sphere_material = this.materials.addLambertian(albedo);
                this.hittableList.addSphere(center, 0.2, sphere_material);
              } else if (choose_mat < 0.95) {
                // metal
                var _albedo = randomColor(0.5, 1);
                var fuzz = rand(0, 0.5);
                var _sphere_material = this.materials.addMetal(_albedo, fuzz);
                this.hittableList.addSphere(center, 0.2, _sphere_material);
              } else {
                // glass
                var _sphere_material2 = this.materials.addDieletric(1.5);
                this.hittableList.addSphere(center, 0.2, _sphere_material2);
              }
            }
          }
        }
        var material1 = this.materials.addDieletric(1.5);
        this.hittableList.addSphere(fromValues(0, 1, 0), 1.0, material1);
        var material2 = this.materials.addLambertian(fromValues(0.4, 0.2, 0.1));
        this.hittableList.addSphere(fromValues(-4, 1, 0), 1.0, material2);
        var material3 = this.materials.addMetal(fromValues(0.7, 0.6, 0.5), 0.0);
        this.hittableList.addSphere(fromValues(4, 1, 0), 1.0, material3);
        var _lookfrom3 = fromValues(13, 2, 3);
        var _lookat3 = fromValues(0, 0, 0);
        var _focus_dist3 = 10.0;
        this.cameraCreateParams.lookfrom(_lookfrom3).lookat(_lookat3).vup(fromValues(0, 1, 0)).focus_dist(_focus_dist3).aperture(0.1).vfov(20.0).aspect_ratio(this.renderDims.width / this.renderDims.height);
      }
    }
  }, {
    key: "updatePipeline",
    value: function updatePipeline() {
      this.materialsBuffer = this.device.createBuffer({
        size: this.materials.buffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
      });
      Copy(this.materials.buffer, this.materialsBuffer.getMappedRange());
      this.materialsBuffer.unmap();
      this.hittableListBuffer = this.device.createBuffer({
        size: this.hittableList.buffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
      });
      Copy(this.hittableList.buffer, this.hittableListBuffer.getMappedRange());
      this.hittableListBuffer.unmap();
      this.cameraCreateParamsBuffer = this.device.createBuffer({
        size: this.cameraCreateParams.buffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true
      });
      Copy(this.cameraCreateParams.buffer, this.cameraCreateParamsBuffer.getMappedRange());
      this.cameraCreateParamsBuffer.unmap();
      this.raytracerConfigBuffer = this.device.createBuffer({
        size: new RaytracerConfig().buffer.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
      });
      var code = this.computeShader(this.wgSize, this.materials.count, this.hittableList.count);
      // console.log(code);
      this.pipeline = this.device.createComputePipeline({
        layout: 'auto',
        compute: {
          module: this.device.createShaderModule({
            code: code
          }),
          entryPoint: 'main'
        }
      });
      this.bindGroup = this.device.createBindGroup({
        layout: this.pipeline.getBindGroupLayout(0),
        entries: [{
          binding: this.bindings.output,
          resource: {
            buffer: this.outputBuffer
          }
        }, {
          binding: this.bindings.materials,
          resource: {
            buffer: this.materialsBuffer
          }
        }, {
          binding: this.bindings.hittable_list,
          resource: {
            buffer: this.hittableListBuffer
          }
        }, {
          binding: this.bindings.camera_create_params,
          resource: {
            buffer: this.cameraCreateParamsBuffer
          }
        }, {
          binding: this.bindings.raytracer_config,
          resource: {
            buffer: this.raytracerConfigBuffer
          }
        }]
      });
      this.dirty = true;
    }
  }, {
    key: "initTweakPane",
    value: function initTweakPane() {
      var _this = this;
      this.pane = new tweakpane.Pane();

      // Resolution
      var resolutions = [];
      var resolutionsNames = {};
      var aspectRatio = this.canvas.width / this.canvas.height;
      for (var i = 1; i < 18; ++i) {
        var w = 64 * (i + 2);
        var h = w / aspectRatio;
        resolutionsNames["".concat(w, "x").concat(h)] = i - 1;
        resolutions.push([w, h]);
      }
      var updateResolution = function updateResolution() {
        var index = _this.config.resolutionIndex;
        _this.renderDims.width = resolutions[index][0];
        _this.renderDims.height = resolutions[index][1];
      };

      // Set default resolution index
      this.config.resolutionIndex = 7;
      updateResolution();
      var input = this.pane.addInput(this.config, 'resolutionIndex', {
        label: 'Resolution',
        options: resolutionsNames
      });
      input.on('change', function (ev) {
        if (ev.last) {
          updateResolution();
          _this.updateScene();
          _this.updatePipeline(); // TODO: queue.copy
        }
      });

      // Scene
      input = this.pane.addInput(this.config, 'scene', {
        label: 'Scene',
        options: {
          'Image 11: Shiny metal': 11,
          'Image 12: Fuzzed metal': 12,
          'Image 16: A hollow glass sphere': 16,
          'Image 18: A distant view': 18,
          'Image 19: Image 19: Zooming in': 19,
          'Image 20: Spheres with depth-of-field': 20,
          'Image 21: Final scene': 21
        }
      });
      input.on('change', function (ev) {
        if (ev.last) {
          _this.updateScene();
          _this.updatePipeline(); // TODO: queue.copy
        }
      });

      input = this.pane.addInput(this.config, 'samplesPerPixel', {
        label: 'Samples Per Pixel',
        min: 1,
        max: 50,
        step: 1
      });
      input.on('change', function (ev) {
        if (ev.last) {
          _this.updatePipeline(); // TODO: queue.copy
        }
      });

      var samplesPerPixelInput = input;
      input = this.pane.addInput(this.config, 'maxDepth', {
        label: 'Max Ray Depth',
        min: 2,
        max: 20,
        step: 1
      });
      input.on('change', function (ev) {
        if (ev.last) {
          _this.updatePipeline(); // TODO: queue.copy
        }
      });

      input = this.pane.addInput(this.config, 'infiniteSamples', {
        label: 'Infinite Samples'
      });
      input.on('change', function (ev) {
        if (ev.last) {
          samplesPerPixelInput.disabled = ev.value != 0;
          _this.updatePipeline(); // TODO: queue.copy
        }
      });

      this.config.scene = 11;
    }
  }, {
    key: "initializeAPI",
    value: function () {
      var _initializeAPI = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee2() {
        var entry, wgSize, width, height, bufferNumElements;
        return regenerator_default().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              entry = navigator.gpu;
              if (entry) {
                _context2.next = 5;
                break;
              }
              console.log("WebGPU may not be supported in your browser");
              return _context2.abrupt("return", false);
            case 5:
              _context2.next = 7;
              return entry.requestAdapter();
            case 7:
              this.adapter = _context2.sent;
              _context2.next = 10;
              return this.adapter.requestDevice();
            case 10:
              this.device = _context2.sent;
              this.queue = this.device.queue;
              wgSize = 64;
              width = this.renderDims.width;
              height = this.renderDims.height;
              this.wgSize = wgSize;
              this.numGroups = width * height / wgSize;
              // console.log(`Dispatching ${this.numGroups} workgroups of size ${wgSize}`);

              // Output buffer
              bufferNumElements = width * height;
              this.outputBuffer = this.device.createBuffer({
                size: bufferNumElements * Uint32Array.BYTES_PER_ELEMENT,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST
                // mappedAtCreation: true,
              });
              // const data = new Uint32Array(this.outputBuffer.getMappedRange());
              // for (let i = 0; i < bufferNumElements; ++i) {
              //     data[i] = 0xFF0000FF;
              // }
              // this.outputBuffer.unmap();

              this.initTweakPane();
              this.updateScene();
              this.updatePipeline();
              _context2.next = 28;
              break;
            case 24:
              _context2.prev = 24;
              _context2.t0 = _context2["catch"](0);
              console.error(_context2.t0);
              return _context2.abrupt("return", false);
            case 28:
              return _context2.abrupt("return", true);
            case 29:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 24]]);
      }));
      function initializeAPI() {
        return _initializeAPI.apply(this, arguments);
      }
      return initializeAPI;
    }()
  }, {
    key: "onResize",
    value: function () {
      var _onResize = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee3() {
        var canvasConfig;
        return regenerator_default().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!this.context) {
                this.context = this.canvas.getContext('webgpu');
                canvasConfig = {
                  device: this.device,
                  format: 'bgra8unorm',
                  // format: 'rgba8unorm',
                  usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST
                };
                this.context.configure(canvasConfig);
              }
            case 1:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this);
      }));
      function onResize() {
        return _onResize.apply(this, arguments);
      }
      return onResize;
    }()
  }, {
    key: "render",
    value:
    // Called once per frame
    function render(dt) {
      if (dt > 1) {
        console.log("Long frame detected: ".concat(dt, " seconds"));
      }
      if (this.pipeline === undefined) {
        return;
      }
      var commandBuffers = Array();
      var encoder = this.device.createCommandEncoder();
      if (this.dirty) {
        if (this.config.infiniteSamples) {
          this.frameSamplesPerPixel.left = Number.MAX_VALUE;
        } else {
          this.frameSamplesPerPixel.left = this.config.samplesPerPixel;
        }
        this.frameSamplesPerPixel.done = 0;
        // Clear output buffer to start accumulating into it
        encoder.clearBuffer(this.outputBuffer);
        this.dirty = false;
      }
      if (this.frameSamplesPerPixel.left > 0) {
        var currSamplesPerPixel = Math.min(this.frameSamplesPerPixel.left, this.frameSamplesPerPixel.max);
        // Compute the amount this frame will contribute to the final pixel as a ratio of how many samples have
        // been processed so far.
        var weight = currSamplesPerPixel / (this.frameSamplesPerPixel.done + currSamplesPerPixel);
        // console.log(`currSamplesPerPixel: ${currSamplesPerPixel}, weight: ${weight}`)

        var config = new RaytracerConfig();
        config.max_depth(this.config.maxDepth);
        config.samples_per_pixel(currSamplesPerPixel);
        config.rand_seed(vec4_fromValues(Math.random(), Math.random(), Math.random(), Math.random()));
        config.weight(weight);

        // TODO: cache set of staging buffers
        var stagingBuffer = this.device.createBuffer({
          size: config.buffer.byteLength,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_SRC,
          mappedAtCreation: true
        });
        Copy(config.buffer, stagingBuffer.getMappedRange());
        encoder.copyBufferToBuffer(stagingBuffer, 0, this.raytracerConfigBuffer, 0, config.buffer.byteLength);
        stagingBuffer.unmap();
        var pass = encoder.beginComputePass();
        pass.setPipeline(this.pipeline);
        pass.setBindGroup(0, this.bindGroup);
        pass.dispatchWorkgroups(this.numGroups);
        pass.end();
        this.frameSamplesPerPixel.left -= currSamplesPerPixel;
        this.frameSamplesPerPixel.done += currSamplesPerPixel;
      }

      // Copy output from compute shader to canvas
      var colorTexture = this.context.getCurrentTexture();
      var imageCopyBuffer = {
        buffer: this.outputBuffer,
        rowsPerImage: this.renderDims.height,
        bytesPerRow: this.renderDims.width * 4
      };
      var imageCopyTexture = {
        texture: colorTexture
      };
      var extent = {
        width: this.renderDims.width,
        height: this.renderDims.height
      };
      encoder.copyBufferToTexture(imageCopyBuffer, imageCopyTexture, extent);
      commandBuffers.push(encoder.finish());
      this.queue.submit(commandBuffers);
    }
  }, {
    key: "computeShader",
    value: function computeShader(wgSize, numMaterials, numSpheres) {
      var width = this.renderDims.width;
      var height = this.renderDims.height;
      var wgsl = "\n///////////////////////////////////////////////////////////////////////////////\n// Common\nalias material_index = u32;\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Ray\n\nstruct ray {\n    orig : vec3f,\n    dir : vec3f,\n}\n\nfn ray_at(r: ray, t: f32) -> vec3f {\n    return r.orig + t * r.dir;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Color\n\nalias color = vec3f;\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Utils\nfn length_squared(v: vec3f) -> f32 {\n    let l = length(v);\n    return l * l;\n}\n\nfn near_zero(v: vec3f) -> bool {\n    const s = 1e-8;\n    return length(v) < s;\n}\n\nfn random_in_unit_sphere() -> vec3f {\n    for (var i = 0; i < 1000; i += 1) {\n        let p = random_range_vec3f(-1, 1);\n        if (length_squared(p) >= 1) {\n            continue;\n        }\n        return p;\n    }\n    return vec3f(0,0,0.3);\n}\n\nfn random_unit_vector() -> vec3f {\n    return normalize(random_in_unit_sphere());\n}\n\nfn random_in_hemisphere(normal: vec3f) -> vec3f {\n    let in_unit_sphere = random_in_unit_sphere();\n    if (dot(in_unit_sphere, normal) > 0.0) { // In the same hemisphere as the normal\n        return in_unit_sphere;\n    }\n    else {\n        return -in_unit_sphere;\n    }\n}\n\nfn random_in_unit_disk() -> vec3f {\n    for (var i = 0; i < 1000; i += 1) {\n        let p = vec3f(random_range_f32(-1,1), random_range_f32(-1,1), 0);\n        if (length_squared(p) >= 1) {\n            continue;\n        }\n        return p;\n    }\n    return vec3f(0.3,0,0);\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable\nstruct hit_record {\n    p: vec3f,\n    normal: vec3f,\n    t: f32,\n    front_face: bool,\n    mat: material_index,\n}\n\nfn hit_record_set_face_normal(rec: ptr<function, hit_record>, r: ray, outward_normal: vec3f) {\n    (*rec).front_face = dot(r.dir, outward_normal) < 0.0;\n    if ((*rec).front_face) {\n        (*rec).normal = outward_normal;\n    } else {\n        (*rec).normal = -outward_normal;\n    }\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Material\n\nalias material_type = u32;\nconst MATERIAL_LAMBERTIAN:  material_type = 0;\nconst MATERIAL_METAL:       material_type = 1;\nconst MATERIAL_DIELECTRIC:  material_type = 2;\n\nstruct lambertian_material {\n    albedo: color,\n}\n\nstruct metal_material {\n    albedo: color,\n    fuzz: f32,\n}\n\nstruct dielectric_material {\n    ir: f32 // index of refraction\n}\n\nstruct material {\n    // NOTE: ideally we'd use a discriminated union\n    ty: material_type,\n    lambertian: lambertian_material,\n    metal: metal_material,\n    dielectric: dielectric_material\n}\n\nconst NUM_MATERIALS = ".concat(numMaterials, ";\n\n@group(0) @binding(").concat(this.bindings.materials, ")\nvar<uniform> materials: array<material, NUM_MATERIALS>;\n\n\n// For the input ray and hit on the input material, returns true if the ray bounces, and if so,\n// stores the color contribution (attenuation) from this material and the new bounce (scatter) ray.\nfn material_scatter(mat: material_index, r_in: ray, rec: hit_record, attenuation: ptr<function, color>, scattered: ptr<function, ray>) -> bool {\n    let m = materials[mat];\n    if (m.ty == MATERIAL_LAMBERTIAN) {\n        var scatter_direction = rec.normal + random_unit_vector();\n\n        // Catch degenerate scatter direction\n        if (near_zero(scatter_direction)) {\n            scatter_direction = rec.normal;\n        }\n\n        *scattered = ray(rec.p, scatter_direction);\n        *attenuation = m.lambertian.albedo;\n        return true;\n\n    } else if (m.ty == MATERIAL_METAL) {\n        let reflected = reflect(normalize(r_in.dir), rec.normal);\n        *scattered = ray(rec.p, reflected + m.metal.fuzz * random_in_unit_sphere());\n        *attenuation = m.metal.albedo;\n        // Only bounce rays that reflect in the same direction as the incident normal\n        return dot((*scattered).dir, rec.normal) > 0;\n    \n    } else if (m.ty == MATERIAL_DIELECTRIC) {\n        *attenuation = color(1, 1, 1);\n        let refraction_ratio = select(m.dielectric.ir, 1.0 / m.dielectric.ir, rec.front_face);\n\n        let unit_direction = normalize(r_in.dir);\n        let cos_theta = min(dot(-unit_direction, rec.normal), 1.0);\n        let sin_theta = sqrt(1.0 - cos_theta * cos_theta);\n\n        let cannot_refract = (refraction_ratio * sin_theta) > 1.0;\n        var direction: vec3f;\n\n        if (cannot_refract || reflectance(cos_theta, refraction_ratio) > random_f32()) {\n            direction = reflect(unit_direction, rec.normal);\n        } else {\n            direction = refract(unit_direction, rec.normal, refraction_ratio);\n        }\n\n        *scattered = ray(rec.p, direction);\n        return true;\n    }\n\n    return false;\n}\n\nfn reflectance(cosine: f32, ref_idx: f32) -> f32 {\n    // Use Schlick's approximation for reflectance.\n    var r0 = (1-ref_idx) / (1+ref_idx);\n    r0 = r0*r0;\n    return r0 + (1-r0)*pow((1 - cosine),5);\n}\n\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Sphere\nstruct sphere {\n    center: vec3f,\n    radius: f32,\n    mat: material_index,\n}\n\nfn sphere_hit(sphere_index: u32, r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    let s = &world.spheres[sphere_index];\n    let oc = r.orig - (*s).center;\n    let a = length_squared(r.dir);\n    let half_b = dot(oc, r.dir);\n    let c = length_squared(oc) - (*s).radius*(*s).radius;\n    let discriminant = half_b*half_b - a*c;\n\n    if (discriminant < 0) {\n        return false;\n    }\n\n    let sqrtd = sqrt(discriminant);\n\n    // Find the nearest root that lies in the acceptable range.\n    var root = (-half_b - sqrtd) / a;\n    if (root < t_min || t_max < root) {\n        root = (-half_b + sqrtd) / a;\n        if (root < t_min || t_max < root) {\n            return false;\n        }\n    }\n\n    (*rec).t = root;\n    (*rec).p = ray_at(r, (*rec).t);\n    let outward_normal = ((*rec).p - (*s).center) / (*s).radius;\n    hit_record_set_face_normal(rec, r, outward_normal);\n    (*rec).mat = (*s).mat;\n\n    return true;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Hittable List\nconst NUM_SPHERES = ").concat(numSpheres, ";\nstruct hittable_list {\n    spheres: array<sphere, NUM_SPHERES>,\n}\n\n@group(0) @binding(").concat(this.bindings.hittable_list, ")\nvar<uniform> world: hittable_list;\n\nfn hittable_list_hit(r: ray, t_min: f32, t_max: f32, rec: ptr<function, hit_record>) -> bool {\n    var temp_rec: hit_record;\n    var hit_anything = false;\n    var closest_so_far = t_max;\n\n    for (var i = 0u; i < NUM_SPHERES; i += 1u) {\n        let s = &world.spheres[i];\n        if (sphere_hit(i, r, t_min, closest_so_far, &temp_rec)) {\n            hit_anything = true;\n            closest_so_far = temp_rec.t;\n            *rec = temp_rec;\n        }\n    }\n    return hit_anything;\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Camera\n\nstruct camera_create_params {\n    lookfrom: vec3f,\n    lookat: vec3f,\n    vup : vec3f,\n    vfov: f32, // vertical field-of-view in degrees\n    aspect_ratio: f32,\n    aperture : f32,\n    focus_dist: f32\n}\n\nstruct camera {\n    origin: vec3f,\n    lower_left_corner: vec3f,\n    horizontal: vec3f,\n    vertical: vec3f,\n    u : vec3f,\n    v : vec3f,\n    w : vec3f,\n    lens_radius : f32,\n}\n\nfn camera_create(p: camera_create_params) -> camera {\n    let theta = radians(p.vfov);\n    let h = tan(theta/2);\n    let viewport_height = 2.0 * h;\n    let viewport_width = p.aspect_ratio * viewport_height;\n\n    // Note: vup, v, and w are all in the same plane\n    let w = normalize(p.lookfrom - p.lookat);\n    let u = normalize(cross(p.vup, w));\n    let v = cross(w, u);\n\n    let origin = p.lookfrom;\n    let horizontal = p.focus_dist * viewport_width * u;\n    let vertical = p.focus_dist * viewport_height * v;\n    let lower_left_corner = origin - horizontal/2 - vertical/2 - p.focus_dist * w;\n    let lens_radius = p.aperture / 2;\n\n    return camera(origin, lower_left_corner, horizontal, vertical, u, v, w, lens_radius);\n}\n\nfn camera_get_ray(cam: ptr<function, camera>, s: f32, t: f32) -> ray {\n    let rd = (*cam).lens_radius * random_in_unit_disk();\n    let offset = (*cam).u * rd.x + (*cam).v * rd.y;\n    return ray(\n        (*cam).origin + offset,\n        (*cam).lower_left_corner + s * (*cam).horizontal + t * (*cam).vertical - (*cam).origin - offset\n    );\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////////////////////////////\n// Random\n\n// Implementation copied from https://webgpu.github.io/webgpu-samples/samples/particles#./particle.wgsl\nvar<private> rand_seed : vec2<f32>;\n\nfn init_rand(invocation_id : u32, seed : vec4f) {\n  rand_seed = seed.xz;\n  rand_seed = fract(rand_seed * cos(35.456+f32(invocation_id) * seed.yw));\n  rand_seed = fract(rand_seed * cos(41.235+f32(invocation_id) * seed.xw));\n}\n\n// Returns random value in [0.0, 1.0)\nfn random_f32() -> f32 {\n    // return 0.0f;\n    rand_seed.x = fract(cos(dot(rand_seed, vec2<f32>(23.14077926, 232.61690225))) * 136.8168);\n    rand_seed.y = fract(cos(dot(rand_seed, vec2<f32>(54.47856553, 345.84153136))) * 534.7645);\n    return rand_seed.y;\n}\n\nfn random_range_f32(min: f32, max: f32) -> f32 {\n    return mix(min, max, random_f32());\n}\n\nfn random_vec3f() -> vec3f {\n    return vec3(random_f32(), random_f32(), random_f32());\n}\n\nfn random_range_vec3f(min: f32, max: f32) -> vec3f {\n    return vec3(random_range_f32(min, max), random_range_f32(min, max), random_range_f32(min, max));\n}\n///////////////////////////////////////////////////////////////////////////////\n\n///////////////////////////////////////////////////////y////////////////////////\n// Main\n\n@group(0) @binding(").concat(this.bindings.output, ")\nvar<storage, read_write> output : array<u32>;\n\n@group(0) @binding(").concat(this.bindings.camera_create_params, ")\nvar<uniform> cp: camera_create_params;\n\nstruct raytracer_config {\n    samples_per_pixel: u32,\n    max_depth: u32,\n    rand_seed: vec4f,\n    weight: f32,\n}\n@group(0) @binding(").concat(this.bindings.raytracer_config, ")\nvar<uniform> config: raytracer_config;\n\nconst infinity = 3.402823466e+38; // NOTE: largest f32 instead of inf\nconst pi = 3.1415926535897932385;\n\nfn ray_color(in_r: ray, in_max_depth: u32) -> color {\n    // Book uses recursion for bouncing rays. We can't recurse in WGSL, so convert algorithm to procedural.\n    var r = in_r;\n    var c : color = color(1,1,1);\n    var rec: hit_record;\n    var max_depth = in_max_depth;\n\n    while (true) {\n        if (hittable_list_hit(r, 0.001, infinity, &rec)) {\n           var attenuation: color;\n           var scattered: ray;\n            if (material_scatter(rec.mat, r, rec, &attenuation, &scattered)) {\n                c *= attenuation;\n                r = scattered;\n            } else {\n                // Material does not contribute, final color is black\n                c *= color(0,0,0);\n                break;\n            }\n\n        } else {\n            // If we hit nothing, return a blue sky color (linear blend of ray direction with white and blue)\n            let unit_direction = normalize(r.dir);\n            let t = 0.5 * (unit_direction.y + 1.0);\n            c *= (1.0 - t) * color(1.0, 1.0, 1.0) + t * color(0.5, 0.7, 1.0);\n            break;\n        }\n\n        // If we've exceeded the ray bounce limit, no more light is gathered.\n        max_depth -= 1;\n        if (max_depth <= 0) {\n            c *= color(0,0,0);\n            break;\n        }\n    }\n\n    return c;\n}\n\nfn color_to_u32(c: color) -> u32 {\n    let r = u32(c.r * 255.0);\n    let g = u32(c.g * 255.0);\n    let b = u32(c.b * 255.0);\n    let a = 255u;\n\n    // bgra8unorm\n    return (a << 24) | (r << 16) | (g << 8) | b;\n\n    // rgba8unorm\n    // return (a << 24) | (b << 16) | (g << 8) | r;\n}\n\nfn u32_to_color(c: u32) -> color {\n    let r = f32((c >> 16) & 0xff) / 255.0;\n    let g = f32((c >> 8) & 0xff) / 255.0;\n    let b = f32((c >> 0) & 0xff) / 255.0;\n    return color(r, g, b);\n}\n\nfn write_color(offset: u32, pixel_color: color, samples_per_pixel: u32) {\n    var c = pixel_color;\n    // Divide the color by the number of samples.\n    c /= f32(samples_per_pixel);\n\n    // And gamma-correct for gamma=2.0.\n    c = sqrt(c);\n\n    var last = u32_to_color(output[offset]);\n    var w = config.weight;\n    output[offset] = color_to_u32(last * (1-w) + c * w);\n}\n\n@compute @workgroup_size(").concat(wgSize, ")\nfn main(\n    @builtin(global_invocation_id) global_invocation_id : vec3<u32>,\n    ) {\n        init_rand(global_invocation_id.x, config.rand_seed);\n\n        // Camera\n        var cam = camera_create(cp);\n\n        // Render\n\n        // Compute current x,y\n        let offset = global_invocation_id.x;\n        \n        // Skip if out of bounds (TODO: only invoke required number of workgroups)\n        if (offset >= u32(").concat(width * height, ")) {\n            return;\n        }\n\n        let x = f32(offset % ").concat(width, ");\n        let y = ").concat(height, " - f32(offset / ").concat(width, "); // Flip Y so Y+ is up\n        const image_height = ").concat(height, ";\n        const image_width = ").concat(width, ";\n        \n        let samples_per_pixel = config.samples_per_pixel;\n        let max_depth = config.max_depth;\n\n        var pixel_color = color(0.0, 0.0, 0.0);\n        for (var i = 0u; i < samples_per_pixel; i += 1u) {\n            let u = (x + random_f32()) / (image_width - 1);\n            let v = (y + random_f32()) / (image_height - 1);\n            let r = camera_get_ray(&cam, u, v);\n            pixel_color += ray_color(r, max_depth);\n        }\n\n        // Store color for current pixel\n        write_color(offset, pixel_color, samples_per_pixel);\n}\n///////////////////////////////////////////////////////////////////////////////\n        ");
      return wgsl;
    }
  }]);
  return Renderer;
}();

;// CONCATENATED MODULE: ./src/main.ts






var App = /*#__PURE__*/function () {
  function App(canvas) {
    _classCallCheck(this, App);
    _defineProperty(this, "elapsedTime", 0);
    _defineProperty(this, "keysPressed", {});
    // Set canvas size to largets possible resolution (see Renderer.initTweakPane)
    var aspectRatio = 16 / 9;
    canvas.width = 64 * 20;
    canvas.height = canvas.width / aspectRatio;
    this.canvas = canvas;
    this.renderer = new Renderer(canvas);
  }
  _createClass(App, [{
    key: "run",
    value: function () {
      var _run = _asyncToGenerator( /*#__PURE__*/regenerator_default().mark(function _callee() {
        var _this = this;
        var updateLoop;
        return regenerator_default().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              this.init();
              _context.next = 3;
              return this.renderer.init();
            case 3:
              updateLoop = function updateLoop(timeStampMs) {
                // Compute delta time in seconds
                var dt = (timeStampMs - _this.lastTimeStampMs) / 1000;
                _this.lastTimeStampMs = timeStampMs;
                _this.render(dt);
                requestAnimationFrame(updateLoop);
              }; // Start the update loop
              this.lastTimeStampMs = performance.now();
              updateLoop(this.lastTimeStampMs);
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function run() {
        return _run.apply(this, arguments);
      }
      return run;
    }()
  }, {
    key: "init",
    value: function init() {}
  }, {
    key: "render",
    value: function render(dt) {
      this.renderer.render(dt);
    }
  }, {
    key: "onKeyDown",
    value: function onKeyDown(event) {
      this.keysPressed[event.code] = true;
    }
  }, {
    key: "onKeyUp",
    value: function onKeyUp(event) {
      delete this.keysPressed[event.code];
    }
  }]);
  return App;
}();
var canvas = document.getElementById('gfx');
var app = new App(canvas);
window.addEventListener("keydown", function (event) {
  app.onKeyDown(event);
}, true);
window.addEventListener("keyup", function (event) {
  app.onKeyUp(event);
}, true);
window.onload = function () {};
app.run();
})();

/******/ })()
;