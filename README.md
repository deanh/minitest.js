# minitest.js #

* http://github.com/deanh/minitest.js

## Description ##

A small and simple unit test framework for JavaScript based on the lovely
MiniTest::Unit by Ryan Davis. It's meant to be simple and fast. It provides
lots of assertions and randomizes test sequence.

## CHANGELOG ##

0.2.0:
* Proper stack traces for errors
* Fs and Es for failures and errors as the tests run
* Optional stack traces for failures (via a constant flag)
* CamelCase everything. This breaks the API, but it was weird, needed to be done sooner,
  and should be easy to fix

0.1.4:
* Fixed basic messaging bugs

## Synopsis ##

Forthcoming. For now you'll have to look at the source. Here's a start:

    // in node land, you have need a runner that looks something like this:
    // runner.js
    #!/usr/bin/env node

    var sys = require('sys'),
        fs = require('fs'),
        zombie = require('zombie'), // if you want to get headless
        MiniTest = require('minitest').MiniTest;

    var files = process.argv.slice(2,process.argv.length);
    var i = 0;

    for(i = 0; i < files.length; i++) {
        MiniTest.Unit.newTestCase(
            require(process.cwd() + "/" + files[i]).test(zombie));
    }

    MiniTest.Unit.run();

    // elsewhere, test files...
    // test_foo.js
    exports.test = (function (zombie) {
        var setupCount = 0;
        var teardownCount = 0;

        return {
            setup: function () {setupCount++},
            test1: function () {this.assert(1 === 1, "equality of 1")},
            testNoMeansNo: function () {this.assert((0 + 2) == 1, "0 + 2 = 1?")},
            testCollection: function () {this.assertEmpty([])},
            testCollection2: function () {this.assertEmpty([1,2,3])},
            testCollection3: function () {this.refuteEmpty([1,2,3])},
            testError: function () {2 = 3;},
            testSlow: function () {for(i=1000000; i>0;i--) this.assert(Math.pow(i,2)) },
            testSlow1: function () {for(i=1000000; i>0;i--) this.assert(Math.pow(i,2)) },
            testSlow2: function () {for(i=1000000; i>0;i--) this.assert(Math.pow(i,2)) },
            testSlow3: function () {for(i=1000000; i>0;i--) this.assert(Math.pow(i,2)) },
            testSlow4: function () {for(i=1000000; i>0;i--) this.assert(Math.pow(i,2)) },
            teardown: function () {teardownCount++}
        }
    })

    // in a browser, it's more like such:

    var setupCount = 0;
    var teardownCount = 0;

    tests = {
         setup: function () {setupCount++},
         test1: function () {this.assert(1 === 1, "equality of 1")},
         testNoMeansNo: function () {this.assert((0 + 2) == 1, "0 + 2 = 1?")},
         teardown: function () {teardownCount++}
    };

    MiniTest.Unit.newTestCase(tests);
    MiniTest.Unit.run();

    /****** Command-line output *****/
    dean@dean:~/Devel/example$ rake test:js
    Running JavaScript tests in /Users/dean/Devel/example/tests/js/
    Starting tests...

    E.F......F.

    Failures:
    testCollection2: Expected 1,2,3 to be empty.
    testNoMeansNo: 0 + 2 = 1?

    Errors:
    invalid_lhs_in_assignment: Invalid left-hand side in assignment
    ReferenceError: Invalid left-hand side in assignment
        at Object.<anonymous> (/Users/dean/Devel/sprouting-3/test/js/test_foo.js:12:33)
        at /Users/dean/node_modules/minitest/minitest.js:434:30
        at Object.run (/Users/dean/node_modules/minitest/minitest.js:490:21)
        at Object.<anonymous> (/Users/dean/Devel/sprouting-3/test/js/runner.js:18:15)
        at Module._compile (module.js:407:26)
        at Object..js (module.js:413:10)
        at Module.load (module.js:339:31)
        at Function._load (module.js:298:12)
        at Array.0 (module.js:426:10)
        at EventEmitter._tickCallback (node.js:126:26)

    11 tests, 5000006 assertions, 2 failures, 1 errors.
    Run time: 585ms

MiniTest::Assertions provides a rich palette of assertions and refutations for crafting unit
tests. See source for details.

## LICENSE ##

Copyright © 2010 Harry Dean Hudson Jr., <dean@ero.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.