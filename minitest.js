var MiniTest = (function (opts) {
    opts = opts || {pollute: true};
    var global = this;
    var assertion_cnt = 0;

    var extend = function (into, obj) {
        var attr;
        for (attr in obj) {
            if (obj.hasOwnProperty(attr) && typeof into[attr] !== 'function') {
                into[attr] = obj[attr];
            }
        }
    }

    // *****
    // Unit assertions and supporting code 
    // 
    var unit = (function () {
        var message = function (msg, default_msg) {
            return function () {
                if (msg !== undefined) {
                    if (msg === '') msg = msg + '.';
                    msg = msg + '\n' + default_msg();
                    // yes, i see the backtracking: patches welcome!
                    return msg.replace( /^\s+(.+)\s+$/, $1);
                } else {
                    return default_msg() + '.';
                }
            }
        };

        return {
            assert: function (test, msg) {
                msg = msg || "Failed assertion, no message given";
                assertion_cnt += 1;

                if (typeof test !== 'function') {
                    var old_test_val = test;
                    test = function () { return old_test_val };
                }

                if (!test()) {
                    if (typeof msg === 'function') {
                        msg = msg();
                    }
                    throw new Error(msg);
                }
                return true;
            },
            
            assert_empty: function (obj, msg) {
                var my_props = []
                var prop;
                msg = message(msg, function() { 
                    return "Expected " + obj + " to be empty"
                });

                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) my_props.push(prop);
                }
                return this.assert(my_props.length === 0, msg);
            },

            assert_equal: function (exp, act, msg) {
                msg = message(msg, function() {
                    return "Expected " + exp + " not " + act;
                });
                return this.assert(exp == act, msg);
            },

            assert_in_delta: function (exp, act, delta, msg) {
                delta = delta || 0.001;
                console.log(delta);
                msg = message(msg, function() {
                    return "Expected " + exp + " - " + act + 
                           " (" + n + ") " + "to be < " + delta;
                });
                var n  = Math.abs(exp - act);
                console.log(n);
                return this.assert(delta >= n, msg);
            },

            assert_in_epsilon: function (a, b, epsilon, msg) {
                epsilon = epsilon || 0.001;
                return this.assert_in_delta(a, b, Math.min(a, b) * epsilon, msg);
            },

            assert_includes: function (collection, obj, msg) {
                var thing, elm;
                msg = message(msg, function () {
                    return "Expected " + collection + " to include " + obj;
                });
                this.assert_respond_to(collection, 'pop');                
                while (elm = collection.pop()) {
                    if (elm === obj) {
                        thing = elm;
                        break;
                    }
                }
                return this.assert(thing, msg);
            },

            // This could be an evil/wrong way to implement this, I'm
            // still not sure.
            assert_instance_of: function (cls, obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be an instance of " + cls;
                });
                return this.assert(cls.prototype === obj.__proto__, msg);
            },

            assert_match: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " to match " + act;
                });
                this.assert_respond_to(act, "match");
                if (typeof exp === 'string') {
                    exp = new RegExp(exp);
                }
                return this.assert(act.match(exp), msg);
            },

            assert_null: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be null";
                });
                return this.assert(obj === null, msg);
            },

            assert_raises: function (exp, code, msg) {
                msg = message(msg, function () {
                    return "Expected exception of type " + exp.name;
                });

                try {
                    code();
                } catch(e) {
                    return assert(exp.name === e.name, msg);
                }
                return this.assert(false, msg);
            },

            assert_respond_to: function (obj, meth, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to respond to " + meth;
                });
                try {
                    obj[meth]();
                } catch (e) {
                    return this.assert(false, msg);
                }
                return this.assert(true, msg);
            },

            assert_same: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " and " + act + " to be the same";
                });
                return this.assert(exp === act, msg);
            },

            assert_throws: function (exp, code, msg) {
                return this.assert_raises(exp, code, msg);
            },

            assert_undefined: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be undefined";
                });
                return this.assert(obj === undefined, msg);
            },

            flunk: function (msg) {
                msg = msg || "Epic Fail!";
                return this.assert(false, msg);
            },

            pass: function () {
                return this.assert(true);
            },

            // refutations
            refute: function (test, msg) {
                msg = msg || "Failed refutation, no message given"
                return ! this.assert(!test, msg); 
            },
            refute_empty: function (obj, msg) {
                msg = msg || undefined;            
            },
            refute_equal: function (exp, act, msg) {
                msg = msg || undefined;            
            },
            refute_in_delta: function (exp, act, delta, msg) {
                msg = msg || undefined;
                delta = delta || 0.001;
            },
            refute_in_epsilon: function (a, b, epsilon, msg) {
                msg = msg || undefined;
                epsilon = epsilon || 0.001;
            },
            refute_includes: function (collection, obj, msg) {
                msg = msg || undefined;            
            },
            refute_match: function (exp, act, msg) {
                msg = msg || undefined;            
            },
            refute_nil: function (obj, msg) {
                msg = msg || undefined;            
            },
            refute_operator: function (o1, op, o2, msg) {
                msg = msg || undefined;            
            },
            refute_respond_to: function (obj, meth, msg) {
                msg = msg || undefined;            
            },
            refute_same: function (exp, act, msg) {
                msg = msg || undefined;            
            },
        };
    })();
  
    if (opts['pollute']) {
        extend(global, unit);
    }

    return unit;
})();


