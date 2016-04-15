var chromedriver = `bin/${process.platform}/chromedriver${process.platform == 'win32' ? '.exe' : ''}`

console.log("Using chromedriver: ", chromedriver)

if (process.platform !== 'win32') {
  require('child_process').execSync(`chmod a+x ${chromedriver}`)
}

const TRAVIS_JOB_NUMBER = process.env.TRAVIS_JOB_NUMBER;

// boolean if we are in travis-ci environment
var travis_ci = !!process.env.TRAVIS_NODE_VERSION

module.exports = {
  "src_folders" : ["tests"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "globals_path" : "",

  "selenium" : {
    "start_process" : true,
    "server_path" : "bin/selenium-server-standalone-2.44.0.jar",
    "log_path" : "",
    "host" : "127.0.0.1",
    "port" : "4444",
    "cli_args" : {
      "webdriver.chrome.driver": chromedriver,
      "webdriver.chrome.bin": (travis_ci ? "/usr/bin/google-chrome" : ""),
      "trustAllSSLCertificates" : true
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : 'http://localhost:4444',
      "selenium_port"  : "4444",
      "selenium_host"  : "localhost",
      "silent": !process.env.SELENIUM_LOG,
      "screenshots" : {
        "enabled" : !travis_ci,
        "path" : "./reports"
      },
      globals: {
        waitForConditionTimeout: 10000,
      },/*
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      },*/
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "tunnel-identifier": `${TRAVIS_JOB_NUMBER}`,
        "chromeOptions": {
          "args": [ "--no-sandbox" ]
        }
      }
    },

    "chrome" : {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true,
        "tunnel-identifier": "${TRAVIS_JOB_NUMBER}",
        "chromeOptions": {
          "args": [ "--no-sandbox" ]
        }
      }
    }
  }
}