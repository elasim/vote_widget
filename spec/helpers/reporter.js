/* globals jasmine */
var JasmineConsoleReporter = require('jasmine-console-reporter');
var reporter = new JasmineConsoleReporter({
  colors: true,
  cleanStack: true,
  verbosity: 4,
  listStyle: 'indent',
  activity: true
});

jasmine.getEnv().addReporter(reporter);
