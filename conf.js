exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['scom.spec.js'],
    capabilities: {
        browserName: 'chrome'
    },
    onPrepare: function () {
        protractor.helpers = require('./helper.js');
    },
    resultJsonOutputFile: './result.json'
    // multiCapabilities: [{
    //     browserName: 'firefox'
    //   }, {
    //     browserName: 'chrome'
    //   }]
}