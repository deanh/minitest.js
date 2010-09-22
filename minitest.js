

var MiniTest = (function () {
    // we're going to need this to pollute the namespace
    var global = this;
    var assertions = 0;

    var unitAssersions = (function () {
        var message = function (msg, default) {
            return function () {
                if (msg !== undefined) {
                    if (msg === '') msg = msg + '.';
                    msg = msg + '\n' + default();
                    // yes, i see the backtracking: patches welcome!
                    return msg.replace( /^\s+(.+)\s+$/, $1);
                } else {
                    return default() + '.';
                }
            }
        };

        return {
            assert: function (test, msg) {
                msg = msg || "Failed assertion, no message given";
                assertions += 1;
                if (!test()) {
                    if (typeof msg === 'function') {
                        msg = msg();
                    }
                    throw new Error(msg);
                }
                return true;
            },
            
            assert_empty: function (obj, msg) {
                msg = msg || undefined;
                msg = message(msg, function() { 
                    return "Expected " + obj + " to be empty"
                });
                assert(obj.length === 0, msg);
            },

            assert_equal: function (exp, act, msg) {
                msg = msg || undefined;
            },
            assert_in_delta: function (exp, act, delta, msg) {
                msg = msg || undefined;
                delta = delta || 0.001;
            },
            assert_in_epsilon: function (a, b, epsilon, msg) {
                msg = msg || undefined;
                epsilon = epsilon || 0.001;
            },
            assert_includes: function (collection, obj, msg) {
                msg = msg || undefined;            
            },
            assert_instance_of: function (cls, obj, msg) {
                msg = msg || undefined;            
            },
            assert_match: function (exp, act, msg) {
                msg = msg || undefined;            
            },
            assert_nil: function (obj, msg) {
                msg = msg || undefined;
            },
            assert_operator: function (o1, op, o2, msg) {
                msg = msg || undefined;            
            },
            assert_output: function (stdout, stderr) {},
            assert_raises: function (*exp) {},
            assert_respond_to: function (obj, meth, msg) {
                msg = msg || undefined;            
            },
            assert_same: function (exp, act, msg) {
                msg = msg || undefined;            
            },
            assert_send: function (send_ary, m) {},
            assert_silent: function () {},
            assert_throws: function (sym, msg) {
                msg = msg || undefined;            
            },
            
            // refutations
            refute: function (test, msg) {
                msg = msg || undefined;            
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
  
    return unitAssertions;
//    return {
//        newUnit: function () {
//        }
//    };
})();


