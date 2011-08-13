// MiniTest.js
//
// A small unit testing framework based on Ryan Davis' MiniTest::Unit
//
// Copyright (c) 2010 Harry Dean Hudson Jr., <dean@ero.com>
//
// Much thanks to the original work of Ryan Davis and Seattle.rb
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
    var VERSION = '0.2.0';
    var TRACE_FAIL = false;
    opts = opts || {pollute: false};
    var global = this;
    var assertionCnt = 0;

    var extend = function (into, obj) {
        var attr;
        for (attr in obj) {
            if (obj.hasOwnProperty(attr) && typeof into[attr] !== 'function') {
                into[attr] = obj[attr];
            }
        }
    }

    // *****
    // * Unit assertions and supporting code 
    var assertions = (function () {
        var message = function (msg, defaultMsg) {
            var str;
            return function () {
                if (msg !== undefined) {
                    if (msg !== '')
                        msg = msg + '.';
                    msg = msg + "\n" + defaultMsg();
                    str = msg.replace(/^\s*/, '');
                    return str.replace(/\s*$/, '');
                } else {
                    return defaultMsg() + '.';
                }
            }
        };

        
        return {
            // *****
            // * Assertions
            // *****
            // * Fails unless +test+ is a true value
            assert: function (test, msg) {
                msg = msg || "Failed assertion, no message given";
                assertionCnt += 1;

                if (typeof test !== 'function') {
                    var oldTestVal = test;
                    test = function () { return oldTestVal };
                }

                if (!test()) {
                    if (typeof msg === 'function') {
                        msg = msg();
                    }
                    
                    var f = new Error(msg);
                    f.type = 'failure';
                    f.name = 'FailedAssertion';
                    throw f;
                }
                return true;
            },
            
            // *****
            // * Fails if +obj+ has no properties of its own. This includes
            // * empty Arrays (most common case)
            assertEmpty: function (obj, msg) {
                var myProps = []
                var prop;
                msg = message(msg, function() { 
                    return "Expected " + obj + " to be empty"
                });

                for (prop in obj) {
                    if (obj.hasOwnProperty(prop)) myProps.push(prop);
                }
                return this.assert(myProps.length === 0, msg);
            },

            // *****
            // * Fails unless +exp+ and +act+ satisfy looser == equality test
            assertEqual: function (exp, act, msg) {
                msg = message(msg, function() {
                    return "Expected " + exp + " not " + act;
                });
                return this.assert(exp == act, msg);
            },

            // *****
            // * For comparing floats. Fails untils +act+ is within +delta+
            // * of +exp+
            assertInDelta: function (exp, act, delta, msg) {
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
            assertInEpsilon: function (a, b, epsilon, msg) {
                epsilon = epsilon || 0.001;
                return this.assertInDelta(a, b, Math.min(a, b) * epsilon, msg);
            },

            // *****
            // * Fails if +collection+ does not include +obj+
            assertIncludes: function (collection, obj, msg) {
                var thing, elm;
                msg = message(msg, function () {
                    return "Expected " + collection + " to include " + obj;
                });
                this.assertRspondTo(collection, 'pop');                
                while (elm = collection.pop()) {
                    if (elm === obj) {
                        thing = elm;
                        break;
                    }
                }
                return this.assert(thing, msg);
            },

            // *****
            // * Fails if +obj+ does not have +cls+ in its prototype chain
            assertInheritsFrom: function (cls, obj, msg) {
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

            // *****
            //* Fails if +obj+ does not have +cls+ as its direct prototype
            assertInstanceOf: function (cls, obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be an instance of " + cls;
                });
                return assert(cls.prototype === obj.__proto__, msg);
            },

            // *****
            // * Fails if +str+ does not match +regexp+
            assertMatch: function (regexp, str, msg) {
                msg = message(msg, function () {
                    return "Expected " + regexp + " to match " + str;
                });
                this.assertRespondTo(str, "match");
                if (typeof regexp === 'string') {
                    regexp = new RegExp(regexp);
                }
                return this.assert(str.match(regexp), msg);
            },

            // *****
            // * Fails if +obj+ is not null
            assertNull: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be null";
                });
                return this.assert(obj === null, msg);
            },

            // *****
            // * Fails unless +code+ raises an +exp+
            assertRaises: function (exp, code, msg) {
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

            // *****
            // * Fails unless +obj+ responds to +meth+
            assertRespondTo: function (obj, meth, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to respond to " + meth;
                });
                return this.assert(obj[meth] && 
                        (typeof obj[meth] === 'function'), msg);
            },

            // *****
            // * Fails unless +exp+ and +act+ refer to the same object
            assertSame: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " and " + act + " to be the same";
                });
                return this.assert(exp === act, msg);
            },

            // *****
            // * Fails unless +code+ throws an +exp+ syn for #assertRaises
            assertThrows: function (exp, code, msg) {
                return this.assertRaises(exp, code, msg);
            },

            // *****
            // * Fails unless +obj+ is undefined
            assertUndefined: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to be undefined";
                });
                return this.assert(obj === undefined, msg);
            },

            // *****
            // * Fails with extreme prejudice 
            flunk: function (msg) {
                msg = msg || "Epic Fail!";
                return this.assert(false, msg);
            },

            // *****
            // * Today is your lucky day
            pass: function () {
                return this.assert(true);
            },

            // *****
            // * Refutations (refutations return false when they pass)
            // *****
            // * Fails if +test+ is truthy
            refute: function (test, msg) {
                msg = msg || "Failed refutation, no message given"
                return ! this.assert(!test, msg); 
            },

            // *****
            // * Fails if +obj+ is empty
            refuteEmpty: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to not be empty"
                });
                // this could alternately be (not sure which is better):
                // assert(obj.hasOwnProperty('length'));
                this.assertRespondTo(obj, 'pop');
                return this.refute(! (obj.pop()), msg);
            },

            // *****
            // * Fails if +exp+ == +act+
            refuteEqual: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + act + " to not be equal to " + exp;
                });
                return this.refute(exp == act, msg);
            },

            // *****
            // * Fails if +exp+ is within +delta+ of +act+. For comparing
            // * floats.
            refuteInDelta: function (exp, act, delta, msg) {
                delta = delta || 0.001;
                msg = message(msg, function () {
                    return "Expected " + exp + " - " + act + " to not be < " + delta;
                });
                return this.refute(delta > n, msg);
            },

            // *****
            // * I need to look into this. It strikes me as a narrow case of 
            // * how delta and epsilon relate, but I know math and not CS
            refuteInEpsilon: function (a, b, epsilon, msg) {
                epsilon = epsilon || 0.001;
                return this.refuteInDelta(a, b, (a * epsilon), msg);
            },

            // *****
            // * Fails if +collection+ includes +obj+
            refuteIncludes: function (collection, obj, msg) {
                var thing, elm;
                msg = message(msg, function () {
                    return "Expected " + collection + " to not contain " + obj;
                });
                this.assertRespondTo(collection, 'pop');                
                while (elm = collection.pop()) {
                    if (elm === obj) {
                        thing = elm;
                        break;
                    }
                }
                return this.refute(thing, msg);
            },

            // *****
            // * Fails if +str+ matches +regexp+
            refuteMatch: function (regexp, str, msg) {
                msg = message(msg, function () {
                    return "Expected " + regexp + " to not match " + act;
                });
                this.assertRespondTo(str, "match");
                if (typeof regexp === 'string') {
                    regexp = new RegExp(regexp);
                }
                return this.refute(str.match(regexp), msg);
            },

            // *****
            // * Fails if +obj+ is null
            refuteNull: function (obj, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to not be null";
                });
                return this.refute(obj === null, msg);
            },

            // *****
            // * Fails if +obj+ responds to +meth+
            refuteRespondTo: function (obj, meth, msg) {
                msg = message(msg, function () {
                    return "Expected " + obj + " to not respond to " + meth;
                });
                return this.refute(obj[meth] && (typeof obj[meth] === 'function'), msg);   
            },

            // *****
            // * Fails if +exp+ === +act+
            refuteSame: function (exp, act, msg) {
                msg = message(msg, function () {
                    return "Expected " + exp + " and " + act + " to not be the same";
                });
                return this.refute(exp === act, msg);
            },
        };
    })();

    // *****
    // * MiniTest.Unit
    var unit = (function () {
        var report, failures, errors, skips;
        var testCount, assertionCount;
        var startTime;
        var testCases = [];
        var testSpace = {};
        var output = console || {
            log: function (msg) {
                throw {name: "Ouch", message: "unsupported output for: " + msg}
            }
        };

        // build a non-global sandbox where we can treat assertions as
        // local
        extend(testSpace, assertions);
        
        // *****
        // * Run a test case
        var runCase = function (tc, randomize) {
            var tests = [];
            var prop, i, fail, error;
            var failures = [], errors = [];
            var writer;
            var resultChar = '.';

            // i haven't figured out a good way to do this in the browser
            if (process !== undefined) {
                writer = function (c) {process.stdout.write(c)};
                writer.flush = function () {process.stdout.write("\n");}
            } else {
                var outStr = "";
                writer = function(c) {outStr = outStr + c;}
                writer.flush = function () {console.log(outStr);}
            }

            randomize = randomize || true;

            // gather up tests from tc. note: we're pulling all of the tests
            // from tc's prototype chain as well. this seems good.
            for (prop in tc) {
                //console.log(prop);
                if (prop.match(/^test/) && typeof tc[prop] === 'function') {
                    tc[prop].__name__ = prop;
                    tests.push(tc[prop]);
                }
            }

            // randomize the order of the tests
            if (randomize) {
                tests.sort(function () {return 0.5 - Math.random()});
            }

            // run the tests in the context of our sandbox
            for (i = 0; i < tests.length; i++) {
                resultChar = '.';
                if (tc['setup'] && typeof tc['setup'] === 'function') {
                    tc.setup();
                }
                try {
                    tests[i].apply(testSpace);
                } catch (e) {
                    e.test = tests[i];
                    if (e.type === 'failure') {
                        failures.push(e);
                        resultChar = 'F';
                    } else {
                        errors.push(e);
                        resultChar = 'E';
                    }
                }
                if (tc['teardown'] && typeof tc['teardown'] === 'function') {
                    tc.teardown();
                }
                writer(resultChar);
            }

            writer.flush();
            output.log();

            if (failures.length > 0) {
                output.log("Failures:");
                for (var i = 0; i < failures.length; i++) {
                    output.log(failures[i].test.__name__ + ": " + failures[i].message);
                    if (TRACE_FAIL)
                        output.log(failures[i].stack);
                }
                output.log();
            }

            if (errors.length > 0) {
                output.log("Errors:");
                for (var i = 0; i < errors.length; i++) {
                    output.log(errors[i].type + ": " + errors[i].message);
                    output.log(errors[i].stack);
                }
                output.log();
            }

            output.log(tests.length + " tests, " + 
                       assertionCnt +  " assertions, " + 
                       failures.length + " failures, " + 
                       errors.length + " errors.");
        };

        // the Unit object, fresh and world ready
        return {
            testCases: function () {return testCases.slice()},
            newTestCase: function (tc) {testCases.push(tc)},
            run: function () {
                var i;
                assertionCnt = 0;

                output.log("Starting tests...\n");
                output.time("Run time");
                for (i = 0; i < testCases.length; i++) {
                    runCase(testCases[i]);
                }
                output.timeEnd("Run time");
            }
        };
    })();
  
    if (opts['pollute']) {
        extend(global, assertions);
    }

    // MiniTest module built out of most of the above and stuffed into the
    // global namespace.
    return {
        Assertions: assertions,
        Unit: unit,
        pollute: function () {
            extend(global, assertions)
        }
    };
})();

// for node
if (typeof exports === 'object') {
  exports.MiniTest = MiniTest;
}
