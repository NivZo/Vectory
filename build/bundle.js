
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier} [start]
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let started = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (started) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            started = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
                // We need to set this to false because callbacks can still happen despite having unsubscribed:
                // Callbacks might already be placed in the queue which doesn't know it should no longer
                // invoke this derived store.
                started = false;
            };
        });
    }

    const emptyGameSession = {
        sourceCoordinate: { x: 0, y: 0 },
        targetCoordinate: { x: 0, y: 0 },
        operations: [],
        boardSideSize: 0,
        maxMoves: 0,
        state: {
            currentPath: [],
            currentHover: null,
        },
        loaded: false,
    };
    const isBetweenSym = (value, symRangeSize) => symRangeSize >= 0 && value >= -symRangeSize && value <= symRangeSize;
    const createGameSession = () => {
        const { subscribe, set, update } = writable(emptyGameSession);
        return {
            subscribe,
            set,
            setGameConfiguration: (gameConfig) => set(Object.assign(Object.assign({}, gameConfig), { state: {
                    currentPath: [],
                    currentHover: null,
                }, loaded: true })),
            addCoordinate: (newCrd) => update(gs => {
                if (isBetweenSym(newCrd.x, gs.boardSideSize / 2) && isBetweenSym(newCrd.y, gs.boardSideSize / 2))
                    gs.state.currentPath.push(newCrd);
                else
                    console.log("a");
                gs.state.currentHover = null;
                return gs;
            }),
            addHoverCoordinate: (hoverCrd) => update(gs => {
                if (isBetweenSym(hoverCrd.x, gs.boardSideSize / 2) && isBetweenSym(hoverCrd.y, gs.boardSideSize / 2))
                    gs.state.currentHover = hoverCrd;
                return gs;
            }),
            removeHoverCoordinate: () => update(gs => {
                gs.state.currentHover = null;
                return gs;
            }),
            removeLastCoordinate: () => update(gs => {
                if (gs.state.currentPath.length > 1)
                    gs.state.currentPath = gs.state.currentPath.slice(0, -1);
                gs.state.currentHover = null;
                return gs;
            }),
            reset: () => set(emptyGameSession),
            resetGameState: () => update(gs => {
                gs.state = {
                    currentPath: [],
                    currentHover: null,
                };
                return gs;
            })
        };
    };
    const gameSession = createGameSession();
    const canvasSize = derived(gameSession, $gameSession => $gameSession.boardSideSize);
    const currentPath = derived(gameSession, $gameSession => $gameSession.state.currentPath);
    const currentHover = derived(gameSession, $gameSession => $gameSession.state.currentHover);
    const currentCoordinate = derived(gameSession, $gameSession => {
        let cp = $gameSession.state.currentPath;
        return cp.length > 0 ? cp[cp.length - 1] : $gameSession.sourceCoordinate;
    });
    const isVictory = derived([gameSession, currentCoordinate], ([gs, crd]) => gs.targetCoordinate.x === crd.x && gs.targetCoordinate.y === crd.y);
    const remainingMoves = derived(gameSession, $gameSession => $gameSession.maxMoves - $gameSession.state.currentPath.length + 1);
    const isPlayable = derived([isVictory, remainingMoves], ([iv, rm]) => !iv && rm > 0);

    const onHoverOrMouseDown = (node, callback) => {
        node.addEventListener('mouseover', callback);
        node.addEventListener('mousedown', callback);
        node.addEventListener('touchstart', callback);
        return {
            destroy() {
                node.removeEventListener('mouseover', callback);
                node.removeEventListener('mousedown', callback);
                node.removeEventListener('touchstart', callback);
            }
        };
    };

    /* src\components\OperationButton.svelte generated by Svelte v3.59.1 */
    const file$5 = "src\\components\\OperationButton.svelte";

    function create_fragment$5(ctx) {
    	let button;
    	let t_value = /*operation*/ ctx[0].name + "";
    	let t;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(t_value);
    			button.disabled = button_disabled_value = !/*$isPlayable*/ ctx[1];
    			add_location(button, file$5, 19, 0, 664);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(onHoverOrMouseDown.call(null, button, /*hoverOperation*/ ctx[3])),
    					listen_dev(button, "click", /*applyOperation*/ ctx[2], false, false, false, false),
    					listen_dev(button, "mouseleave", gameSession.removeHoverCoordinate, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*operation*/ 1 && t_value !== (t_value = /*operation*/ ctx[0].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*$isPlayable*/ 2 && button_disabled_value !== (button_disabled_value = !/*$isPlayable*/ ctx[1])) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $currentCoordinate;
    	let $isPlayable;
    	validate_store(currentCoordinate, 'currentCoordinate');
    	component_subscribe($$self, currentCoordinate, $$value => $$invalidate(4, $currentCoordinate = $$value));
    	validate_store(isPlayable, 'isPlayable');
    	component_subscribe($$self, isPlayable, $$value => $$invalidate(1, $isPlayable = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('OperationButton', slots, []);
    	let { operation } = $$props;

    	const applyOperation = () => {
    		const newCoordinate = {
    			x: operation.xOperation($currentCoordinate),
    			y: operation.yOperation($currentCoordinate)
    		};

    		gameSession.addCoordinate(newCoordinate);
    	};

    	const hoverOperation = () => {
    		const newCoordinate = {
    			x: operation.xOperation($currentCoordinate),
    			y: operation.yOperation($currentCoordinate)
    		};

    		gameSession.addHoverCoordinate(newCoordinate);
    	};

    	$$self.$$.on_mount.push(function () {
    		if (operation === undefined && !('operation' in $$props || $$self.$$.bound[$$self.$$.props['operation']])) {
    			console.warn("<OperationButton> was created without expected prop 'operation'");
    		}
    	});

    	const writable_props = ['operation'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<OperationButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('operation' in $$props) $$invalidate(0, operation = $$props.operation);
    	};

    	$$self.$capture_state = () => ({
    		currentCoordinate,
    		gameSession,
    		isPlayable,
    		onHoverOrMouseDown,
    		operation,
    		applyOperation,
    		hoverOperation,
    		$currentCoordinate,
    		$isPlayable
    	});

    	$$self.$inject_state = $$props => {
    		if ('operation' in $$props) $$invalidate(0, operation = $$props.operation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [operation, $isPlayable, applyOperation, hoverOperation];
    }

    class OperationButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { operation: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OperationButton",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get operation() {
    		throw new Error("<OperationButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set operation(value) {
    		throw new Error("<OperationButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const initDrawEngine = (canvas, axisLength) => {
        const width = canvas.width;
        const height = canvas.height;
        const step = width / axisLength;
        const halfAxisLength = axisLength / 2;
        const ctx = canvas.getContext('2d');
        return {
            drawGrid: () => {
                ctx.clearRect(0, 0, width, height);
                ctx.strokeStyle = '#ccc';
                ctx.beginPath();
                for (let x = -halfAxisLength; x <= halfAxisLength; x++) {
                    const xPos = (x + halfAxisLength) * step;
                    ctx.moveTo(xPos, 0);
                    ctx.lineTo(xPos, height);
                }
                for (let y = -halfAxisLength; y <= halfAxisLength; y++) {
                    const yPos = (y + halfAxisLength) * step;
                    ctx.moveTo(0, yPos);
                    ctx.lineTo(width, yPos);
                }
                ctx.stroke();
            },
            drawAxes: () => {
                ctx.strokeStyle = 'black';
                ctx.beginPath();
                // Draw x-axis
                const xAxisY = height / 2;
                ctx.moveTo(0, xAxisY);
                ctx.lineTo(width, xAxisY);
                // Draw y-axis
                const yAxisX = width / 2;
                ctx.moveTo(yAxisX, 0);
                ctx.lineTo(yAxisX, height);
                ctx.stroke();
            },
            drawPoint: (crd, color) => {
                const xPos = (crd.x + halfAxisLength) * step;
                const yPos = height - (crd.y + halfAxisLength) * step;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(xPos, yPos, 5, 0, 2 * Math.PI);
                ctx.fill();
            },
            drawVector: (source, target, color) => {
                const sourceX = (source.x + halfAxisLength) * step;
                const sourceY = height - (source.y + halfAxisLength) * step;
                const targetX = (target.x + halfAxisLength) * step;
                const targetY = height - (target.y + halfAxisLength) * step;
                const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
                const arrowSize = 10;
                ctx.strokeStyle = color;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.moveTo(sourceX, sourceY);
                ctx.lineTo(targetX, targetY);
                // Draw arrowhead
                ctx.lineTo(targetX - arrowSize * Math.cos(angle - Math.PI / 6), targetY - arrowSize * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(targetX, targetY);
                ctx.lineTo(targetX - arrowSize * Math.cos(angle + Math.PI / 6), targetY - arrowSize * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
                // Draw slim line
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(sourceX, sourceY);
                ctx.lineTo(targetX, targetY);
                ctx.stroke();
                // Draw slim arrowhead
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(targetX - arrowSize * Math.cos(angle - Math.PI / 6), targetY - arrowSize * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(targetX, targetY);
                ctx.lineTo(targetX - arrowSize * Math.cos(angle + Math.PI / 6), targetY - arrowSize * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            },
        };
    };

    /* src\components\Grid.svelte generated by Svelte v3.59.1 */

    const file$4 = "src\\components\\Grid.svelte";

    function create_fragment$4(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", "800");
    			attr_dev(canvas_1, "height", "800");
    			add_location(canvas_1, file$4, 48, 0, 1653);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[1](canvas_1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[1](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $currentCoordinate;
    	let $gameSession;
    	validate_store(currentCoordinate, 'currentCoordinate');
    	component_subscribe($$self, currentCoordinate, $$value => $$invalidate(4, $currentCoordinate = $$value));
    	validate_store(gameSession, 'gameSession');
    	component_subscribe($$self, gameSession, $$value => $$invalidate(5, $gameSession = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Grid', slots, []);
    	let canvas;
    	let ctx;
    	let drawEngine;

    	let COLORS = {
    		Source: "green",
    		Target: "red",
    		Path: "blue",
    		CurrentCoordinate: "yellow",
    		Hover: "lightblue"
    	};

    	const initCanvas = () => {
    		drawEngine = initDrawEngine(canvas, $gameSession.boardSideSize);
    		ctx = canvas.getContext("2d");
    		gameSession.resetGameState();
    		gameSession.addCoordinate($gameSession.sourceCoordinate);
    	};

    	onMount(() => {
    		// init
    		initCanvas();

    		// draw path
    		currentPath.subscribe(p => {
    			ctx.clearRect(0, 0, canvas.width, canvas.height);
    			drawEngine.drawGrid();
    			drawEngine.drawAxes();
    			drawEngine.drawPoint($gameSession.sourceCoordinate, COLORS.Source);
    			drawEngine.drawPoint($gameSession.targetCoordinate, COLORS.Target);

    			for (let i = 1; i < p.length; i++) {
    				drawEngine.drawVector(p[i - 1], p[i], COLORS.Path);
    				drawEngine.drawPoint(p[i], COLORS.Path);
    			}

    			if (p.length > 1) drawEngine.drawPoint(p[p.length - 1], COLORS.CurrentCoordinate);
    		});

    		// draw hover
    		currentHover.subscribe(hoverCrd => {
    			if (hoverCrd != null) {
    				drawEngine.drawPoint(hoverCrd, COLORS.Hover);
    				drawEngine.drawVector($currentCoordinate, hoverCrd, COLORS.Hover);
    			}
    		});

    		// subscribe for updates
    		canvasSize.subscribe(initCanvas);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Grid> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		initDrawEngine,
    		canvasSize,
    		currentCoordinate,
    		currentHover,
    		currentPath,
    		gameSession,
    		canvas,
    		ctx,
    		drawEngine,
    		COLORS,
    		initCanvas,
    		$currentCoordinate,
    		$gameSession
    	});

    	$$self.$inject_state = $$props => {
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('ctx' in $$props) ctx = $$props.ctx;
    		if ('drawEngine' in $$props) drawEngine = $$props.drawEngine;
    		if ('COLORS' in $$props) COLORS = $$props.COLORS;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [canvas, canvas_1_binding];
    }

    class Grid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Grid",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\components\UndoButton.svelte generated by Svelte v3.59.1 */
    const file$3 = "src\\components\\UndoButton.svelte";

    function create_fragment$3(ctx) {
    	let button;
    	let t;
    	let button_disabled_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text("Undo");
    			button.disabled = button_disabled_value = /*$currentPath*/ ctx[0].length <= 1;
    			add_location(button, file$3, 3, 0, 103);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", gameSession.removeLastCoordinate, false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$currentPath*/ 1 && button_disabled_value !== (button_disabled_value = /*$currentPath*/ ctx[0].length <= 1)) {
    				prop_dev(button, "disabled", button_disabled_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $currentPath;
    	validate_store(currentPath, 'currentPath');
    	component_subscribe($$self, currentPath, $$value => $$invalidate(0, $currentPath = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('UndoButton', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<UndoButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ currentPath, gameSession, $currentPath });
    	return [$currentPath];
    }

    class UndoButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "UndoButton",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    // OperationAction factories
    let operationFromConfiguration = (operationConfig) => {
        let operationActionFromConfiguration = (candidate, operationActionConfig) => {
            switch (operationActionConfig.operator) {
                case "+":
                    return crd => crd[candidate] + operationActionConfig.operatorValue;
                case "-":
                    return crd => crd[candidate] - operationActionConfig.operatorValue;
                case "*":
                    return crd => crd[candidate] * operationActionConfig.operatorValue;
                case "/":
                    return crd => crd[candidate] / operationActionConfig.operatorValue;
            }
        };
        return {
            name: operationConfig.name,
            xOperation: operationActionFromConfiguration("x", operationConfig.x),
            yOperation: operationActionFromConfiguration("y", operationConfig.y),
        };
    };

    const puzzles = [
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 6,
                "y": -3
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 14,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 1,
                "y": -4
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 10,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 8,
                "y": -1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 18,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 1,
                "y": -3
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 8,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -4,
                "y": -4
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 10,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 3,
                "y": -1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 8,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 3,
                "y": 0
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 14,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 10,
                "y": 1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 22,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 1,
                "y": -2
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 8,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -4,
                "y": -2
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 10,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -4,
                "y": -1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 14,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -9,
                "y": 0
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 20,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -2,
                "y": 1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 14,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -2,
                "y": 2
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 8,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 5,
                "y": 2
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 12,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 3,
                "y": 1
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 10,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": -2,
                "y": 4
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 10,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 5,
                "y": 3
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 12,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 5,
                "y": 4
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 18,
            "maxMoves": 6
        },
        {
            "sourceCoordinate": {
                "x": 0,
                "y": 0
            },
            "targetCoordinate": {
                "x": 12,
                "y": 3
            },
            "operations": [
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 2
                    },
                    "y": {
                        "operator": "-",
                        "operatorValue": 1
                    },
                    "name": "xPlus2_yMinus1"
                },
                {
                    "x": {
                        "operator": "-",
                        "operatorValue": 3
                    },
                    "y": {
                        "operator": "*",
                        "operatorValue": 2
                    },
                    "name": "xMinus3_yTimes2"
                },
                {
                    "x": {
                        "operator": "+",
                        "operatorValue": 4
                    },
                    "y": {
                        "operator": "+",
                        "operatorValue": 1
                    },
                    "name": "xPlus4_yPlus1"
                }
            ],
            "boardSideSize": 26,
            "maxMoves": 6
        }
    ];

    const getRandomGameConfiguration = () => {
        const randomIndex = Math.floor(Math.random() * puzzles.length);
        const rawGameConf = puzzles[randomIndex];
        console.log(rawGameConf);
        const gameConf = Object.assign(Object.assign({}, rawGameConf), { operations: [] });
        rawGameConf.operations.forEach(operationConf => {
            gameConf.operations.push(operationFromConfiguration(operationConf));
        });
        console.log(gameConf);
        return gameConf;
    };

    /* src\components\NewGameButton.svelte generated by Svelte v3.59.1 */
    const file$2 = "src\\components\\NewGameButton.svelte";

    function create_fragment$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "New";
    			add_location(button, file$2, 8, 0, 312);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*initGameSession*/ ctx[0], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NewGameButton', slots, []);

    	const initGameSession = () => {
    		const gameConfiguration = getRandomGameConfiguration();
    		gameSession.setGameConfiguration(gameConfiguration);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NewGameButton> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		gameSession,
    		getRandomGameConfiguration,
    		initGameSession
    	});

    	return [initGameSession];
    }

    class NewGameButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NewGameButton",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\GameBoard.svelte generated by Svelte v3.59.1 */
    const file$1 = "src\\components\\GameBoard.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (9:4) {#if $gameSession.loaded}
    function create_if_block(ctx) {
    	let grid;
    	let t0;
    	let div0;
    	let t1;
    	let t2_value = /*$currentCoordinate*/ ctx[1].x + "";
    	let t2;
    	let t3;
    	let t4_value = /*$currentCoordinate*/ ctx[1].y + "";
    	let t4;
    	let t5;
    	let div1;
    	let t6;
    	let t7_value = /*$gameSession*/ ctx[0].targetCoordinate.x + "";
    	let t7;
    	let t8;
    	let t9_value = /*$gameSession*/ ctx[0].targetCoordinate.y + "";
    	let t9;
    	let t10;
    	let div2;
    	let t11;
    	let t12;
    	let div3;
    	let t13;
    	let t14;
    	let t15;
    	let t16;
    	let undobutton;
    	let t17;
    	let newgamebutton;
    	let current;
    	grid = new Grid({ $$inline: true });
    	let each_value_1 = /*$currentPath*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*$gameSession*/ ctx[0].operations;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	undobutton = new UndoButton({ $$inline: true });
    	newgamebutton = new NewGameButton({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(grid.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = text("Current: ");
    			t2 = text(t2_value);
    			t3 = text(", ");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Goal: ");
    			t7 = text(t7_value);
    			t8 = text(", ");
    			t9 = text(t9_value);
    			t10 = space();
    			div2 = element("div");
    			t11 = text("Path:\r\n        ");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t12 = space();
    			div3 = element("div");
    			t13 = text("Remaining Moves: ");
    			t14 = text(/*$remainingMoves*/ ctx[3]);
    			t15 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t16 = space();
    			create_component(undobutton.$$.fragment);
    			t17 = space();
    			create_component(newgamebutton.$$.fragment);
    			add_location(div0, file$1, 10, 4, 387);
    			add_location(div1, file$1, 11, 4, 459);
    			add_location(div2, file$1, 12, 4, 550);
    			add_location(div3, file$1, 23, 4, 821);
    		},
    		m: function mount(target, anchor) {
    			mount_component(grid, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, t11);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(div2, null);
    				}
    			}

    			insert_dev(target, t12, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			insert_dev(target, t15, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t16, anchor);
    			mount_component(undobutton, target, anchor);
    			insert_dev(target, t17, anchor);
    			mount_component(newgamebutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*$currentCoordinate*/ 2) && t2_value !== (t2_value = /*$currentCoordinate*/ ctx[1].x + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$currentCoordinate*/ 2) && t4_value !== (t4_value = /*$currentCoordinate*/ ctx[1].y + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*$gameSession*/ 1) && t7_value !== (t7_value = /*$gameSession*/ ctx[0].targetCoordinate.x + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*$gameSession*/ 1) && t9_value !== (t9_value = /*$gameSession*/ ctx[0].targetCoordinate.y + "")) set_data_dev(t9, t9_value);

    			if (dirty & /*$currentPath*/ 4) {
    				each_value_1 = /*$currentPath*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(div2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty & /*$remainingMoves*/ 8) set_data_dev(t14, /*$remainingMoves*/ ctx[3]);

    			if (dirty & /*$gameSession*/ 1) {
    				each_value = /*$gameSession*/ ctx[0].operations;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(t16.parentNode, t16);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(grid.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(undobutton.$$.fragment, local);
    			transition_in(newgamebutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(grid.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(undobutton.$$.fragment, local);
    			transition_out(newgamebutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(grid, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t12);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t15);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t16);
    			destroy_component(undobutton, detaching);
    			if (detaching) detach_dev(t17);
    			destroy_component(newgamebutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(9:4) {#if $gameSession.loaded}",
    		ctx
    	});

    	return block;
    }

    // (18:16) {#if i != $currentPath.length - 1}
    function create_if_block_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("->");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(18:16) {#if i != $currentPath.length - 1}",
    		ctx
    	});

    	return block;
    }

    // (15:8) {#each $currentPath as crd, i}
    function create_each_block_1(ctx) {
    	let span;
    	let t0;
    	let t1_value = /*crd*/ ctx[7].x + "";
    	let t1;
    	let t2;
    	let t3_value = /*crd*/ ctx[7].y + "";
    	let t3;
    	let t4;
    	let t5;
    	let if_block = /*i*/ ctx[9] != /*$currentPath*/ ctx[2].length - 1 && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text("(");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")\r\n                ");
    			if (if_block) if_block.c();
    			t5 = space();
    			add_location(span, file$1, 15, 12, 624);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    			append_dev(span, t2);
    			append_dev(span, t3);
    			append_dev(span, t4);
    			if (if_block) if_block.m(span, null);
    			append_dev(span, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$currentPath*/ 4 && t1_value !== (t1_value = /*crd*/ ctx[7].x + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*$currentPath*/ 4 && t3_value !== (t3_value = /*crd*/ ctx[7].y + "")) set_data_dev(t3, t3_value);

    			if (/*i*/ ctx[9] != /*$currentPath*/ ctx[2].length - 1) {
    				if (if_block) ; else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(span, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(15:8) {#each $currentPath as crd, i}",
    		ctx
    	});

    	return block;
    }

    // (27:4) {#each $gameSession.operations as operation}
    function create_each_block(ctx) {
    	let operationbutton;
    	let current;

    	operationbutton = new OperationButton({
    			props: { operation: /*operation*/ ctx[4] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(operationbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(operationbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const operationbutton_changes = {};
    			if (dirty & /*$gameSession*/ 1) operationbutton_changes.operation = /*operation*/ ctx[4];
    			operationbutton.$set(operationbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(operationbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(operationbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(operationbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(27:4) {#each $gameSession.operations as operation}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let if_block = /*$gameSession*/ ctx[0].loaded && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			add_location(div, file$1, 7, 0, 331);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$gameSession*/ ctx[0].loaded) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$gameSession*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $gameSession;
    	let $currentCoordinate;
    	let $currentPath;
    	let $remainingMoves;
    	validate_store(gameSession, 'gameSession');
    	component_subscribe($$self, gameSession, $$value => $$invalidate(0, $gameSession = $$value));
    	validate_store(currentCoordinate, 'currentCoordinate');
    	component_subscribe($$self, currentCoordinate, $$value => $$invalidate(1, $currentCoordinate = $$value));
    	validate_store(currentPath, 'currentPath');
    	component_subscribe($$self, currentPath, $$value => $$invalidate(2, $currentPath = $$value));
    	validate_store(remainingMoves, 'remainingMoves');
    	component_subscribe($$self, remainingMoves, $$value => $$invalidate(3, $remainingMoves = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GameBoard', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<GameBoard> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		OperationButton,
    		Grid,
    		currentCoordinate,
    		currentPath,
    		gameSession,
    		remainingMoves,
    		UndoButton,
    		NewGameButton,
    		$gameSession,
    		$currentCoordinate,
    		$currentPath,
    		$remainingMoves
    	});

    	return [$gameSession, $currentCoordinate, $currentPath, $remainingMoves];
    }

    class GameBoard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GameBoard",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.59.1 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let gameboard;
    	let current;

    	gameboard = new GameBoard({
    			props: {
    				gameConfiguration: /*gameConfiguration*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(gameboard.$$.fragment);
    			add_location(main, file, 13, 0, 386);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(gameboard, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const gameboard_changes = {};
    			if (dirty & /*gameConfiguration*/ 1) gameboard_changes.gameConfiguration = /*gameConfiguration*/ ctx[0];
    			gameboard.$set(gameboard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gameboard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gameboard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(gameboard);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let gameConfiguration;

    	onMount(() => {
    		$$invalidate(0, gameConfiguration = getRandomGameConfiguration());
    		gameSession.setGameConfiguration(gameConfiguration);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		onMount,
    		GameBoard,
    		getRandomGameConfiguration,
    		gameSession,
    		gameConfiguration
    	});

    	$$self.$inject_state = $$props => {
    		if ('gameConfiguration' in $$props) $$invalidate(0, gameConfiguration = $$props.gameConfiguration);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [gameConfiguration];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
