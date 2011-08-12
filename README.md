# minitest.js #

* http://github.com/deanh/minitest.js

## Description ##

A small and simple unit test framework for JavaScript based on the lovely
MiniTest::Unit by Ryan Davis. 

## Synopsis ##

Forthcoming. For now you'll have to look at the source. Here's a start:

    // in node land, you have test files that look something like this:
    // runner.js
    #!/usr/bin/env node

    var sys = require('sys'),
        fs = require('fs'),
        zombie = require('zombie'), // if you want to get headless
        MiniTest = require('minitest').MiniTest;

    var files = process.argv.slice(2,process.argv.length);
    var i = 0;

    for(i = 0; i < files.length; i++) {
        MiniTest.Unit.new_test_case(
            require(process.cwd() + "/" + files[i]).test(zombie));
    }

    MiniTest.Unit.run();

    // elsewhere...
    // test_foo.js
    exports.test = (function (zombie) {
        var setupCount = 0;
        var teardownCount = 0;

        return {
            setup: function () {setupCount++},
            test1: function () {this.assert(1 === 1, "equality of 1")},
            testSetupTeardown: function () {
                this.assert_equal(setupCount, 1);
                this.assert_equal(teardownCount, 0);
            },
            testNoMeansNo: function () {this.assert((0 + 2) == 1, "0 + 2 = 1?")},
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

    MiniTest.Unit.new_test_case(tests);
    MiniTest.Unit.run();

    /***** Output *****
    // from the browser

    Starting tests...
    ..

    Failures:
    testNoMeansNo: 0 + 2 = 1?

    2 tests, 2 assertions, 1 failures, 0 errors.
    Run time: 2ms
    ***** Fin *****/

MiniTest::Assertions provides a rich palette of assertions and refutations for crafting unit
tests. See source for details.

## LICENSE ##

Copyright © 2010 Harry Dean Hudson Jr., <dean@ero.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the ‘Software’), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED ‘AS IS’, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.