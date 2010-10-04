// MiniTest.js
//
// A small unit testing framework based on Ryan Davis' MiniTest::Unit
//
// Copyright (c) 2010 Harry Dean Hudson, <dean@ero.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// *****
// * Main module
var MiniTest = (function (opts) {
    opts = opts || {pollute: false};
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

    function Failure (msg) {};
    Failure.prototype = Error;

    // *****
    // * Unit assertions and supporting code 
    var assertions = (function () {
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
            failure: Failure,

            // *****
            // * Fails unless +test+ is a true value
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
                    throw new Failure(msg);
                }
                return true;
            },
            
            // *****
            // * Fails if +obj+ has no properties of its own. This includes
            // * empty Arrays (most common case)
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

            // *****
            // * Fails unless +exp+ and +act+ satisfy looser == equality test
            assert_equal: function (exp, act, msg) {
                msg = message(msg, function() {
                    return "Expected " + exp + " not " + act;
                });
                return this.assert(exp == act, msg);
            },

            // *****
            // * For comparing floats. Fails untils +act+ is within +delta+
            // * of +exp+
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

            // *****
            // * Epsilon test for floats. For use in proving the mean value
            // * theorem
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
            // still not sure. inherits_from() walks the prototype chain
            // to see if cls is anywhere up the chain.
            assert_inherits_from: function (cls, obj, msg) {
                var proto = obj;
                var thing;
                msg = message(msg, function () {
                    return "Expected " + obj + " to be an inherit from " + cls;
                });
                while (proto = proto.__proto__) {
                    if (proto === cls.prototype) thing = proto;
                }
                console.log(thing);
                return this.assert(thing, msg);
            },

            assert_instance_of: function (cls, obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be an instance of " + cls;
                });
                return assert(cls.prototype === obj.__proto__, msg);
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
                return this.assert(obj[meth] && (typeof obj[meth] === 'function'), msg);
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
                msg = message(msg, function () {
                    return "Expected " + obj + " to not be empty"
                });
                // this could alternately be (not sure which is better):
                // assert(obj.hasOwnProperty('length'));
                this.assert_respond_to(obj, 'pop');
                return this.refute(! (obj.pop()), msg);
            },

            refute_equal: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + act + " to not be equal to " + exp;
                });
                return this.refute(exp == act, msg);
            },

            refute_in_delta: function (exp, act, delta, msg) {
                delta = delta || 0.001;
                msg = message(msg, function () {
                    return "Expected " + exp + " - " + act + " to not be < " + delta;
                });
                return this.refute(delta > n, msg);
            },

            refute_in_epsilon: function (a, b, epsilon, msg) {
                epsilon = epsilon || 0.001;
                return this.refute_in_delta(a, b, (a * epsilon), msg);
            },

            refute_includes: function (collection, obj, msg) {
                var thing, elm;
                msg = message(msg, function () {
                    return "Expected " + collection + " to not contain " + obj;
                });
                this.assert_respond_to(collection, 'pop');                
                while (elm = collection.pop()) {
                    if (elm === obj) {
                        thing = elm;
                        break;
                    }
                }
                return this.refute(thing, msg);
            },

            refute_match: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " to not match " + act;
                });
                this.assert_respond_to(act, "match");
                if (typeof exp === 'string') {
                    exp = new RegExp(exp);
                }
                return this.refute(sct.match(exp), msg);
            },

            refute_null: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to not be null";
                });
                return this.refute(obj === null, msg);
            },

            refute_respond_to: function (obj, meth, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to not respond to " + meth;
                });
                return this.refute(obj[meth] && (typeof obj[meth] === 'function'), msg);   
            },

            refute_same: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " and " + act + " to not be the same";
                });
                return this.refute(exp === act, msg);
            },
        };
    })();

    var unit = (function () {
        var report, failures, errors, skips;
        var test_count, assertion_count;
        var start_time;
        var test_cases = [];
        var test_space = {};
        var output = console || {
            log: function (msg) {
                throw {name: "Ouch", message: "unsupported output for: " + msg}
            }
        };

        // build a non-global sandbox where we can treat assertions as
        // local
        extend(test_space, assertions);
        
        var run_case = function (tc, randomize) {
            var tests = [];
            var prop, i, fail, error;
            var failures = [], errors = [];
            randomize = randomize || true;

            // gather up tests from tc. note: we're pulling all of the tests
            // from tc's prototype chain as well. this seems good.
            for (prop in tc) {
                if (prop.match(/^test/) && typeof tc[prop] === 'function') {
                    tests.push(tc[prop]);
                }
            }

            // randomize the order of the tests
            if (randomize) {
                tests.sort(function () {return 0.5 - Math.random()});
            }

            // run the tests in the context of our sandbox
            for (i = 0; i < tests.length; i++) {
                if (tc['setup'] && typeof tc['setup'] === 'function') {
                    tc.setup();
                }
                output.log('.');
                try {
                    tests[i].apply(test_space);
                } catch (e) {
                    if (e instanceof Failure) {
                        failures.push(e);
                    } else {
                        errors.push(e);
                    }
                }
                if (tc['teardown'] && typeof tc['teardown'] === 'function') {
                    tc.teardown();
                }
            }

            if (failures.length > 0) {
                output.log("Failures:");
                for (fail in failures) {
                    output.log(fail.name + ": " + fail.message);
                }
            }

            if (errors.length > 0) {
                output.log("Errors:");
                for (error in errors) {
                    output.log(error.name + ": " + error.message);
                }
            }

            output.log(tests.length + " tests, " + 
                       assertion_cnt +  " assertions, " + 
                       failures.length + " failures, " + 
                       errors.length + " errors.");
        };

        return {
            test_cases: function () {return test_cases.slice()},
            new_test_case: function (tc) {test_cases.push(tc)},
            run: function () {
                var i;

                output.log("Starting tests...");
                output.time("Run time");
                for (i = 0; i < test_cases.length; i++) {
                    run_case(test_cases[i]);
                }
                output.timeEnd("Run time");
            }
        };
    })();
  
    if (opts['pollute']) {
        extend(global, assertions);
    }

    return {
        Assertions: assertions,
        Unit: unit,
        pollute: function () {
            extend(global, assertions)
        }
    };
})();


