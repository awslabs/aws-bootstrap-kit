// standard-version-updater.js
const stringifyPackage = require('stringify-package')
const detectIndent = require('detect-indent')
const detectNewline = require('detect-newline')
module.exports.readVersion = function (contents) {
  return JSON.parse(contents).dependencies['aws-bootstrap-kit'].split('@')[1].split('.').slice(0, -2).join('.');
}

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents)
  let indent = detectIndent(contents).indent
  let newline = detectNewline(contents)
  json.dependencies['aws-bootstrap-kit'] = `file:../../source/aws-bootstrap-kit/dist/js/aws-bootstrap-kit@${version}.jsii.tgz`
  return stringifyPackage(json, indent, newline)
}