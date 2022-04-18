// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const scanner = require('sonarqube-scanner')

// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
require('dotenv').config()

// eslint-disable-next-line no-undef
if (process.env.SONAR_TOKEN === undefined) {
  throw new Error('specify the sonar token')
}

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    // eslint-disable-next-line no-undef
    token: process.env.SONAR_TOKEN,
    debug: true,
    options: {
      'sonar.organization': 'appstud',
      'sonar.projectKey': 'appstud-swag-backend-node',
      'sonar.projectName': 'appstud-swag-backend-node',
      'sonar.branch.name': 'master',
      'sonar.host.url': 'https://sonarcloud.io',
      'sonar.sources': './src/main',
      'sonar.exclusions': '',
      'sonar.language': 'js',
      'sonar.tests': './src/test',
      'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
      'sonar.testExecutionReportPaths': './coverage/test-report.xml',
      'sonar.sourceEncoding': 'UTF-8'
    }
  },
  () => {
    // callback is required
  }
)
