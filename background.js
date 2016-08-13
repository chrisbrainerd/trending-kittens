// chrome.webNavigation.onHistoryStateUpdated.addListener(function(details) {
chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
  console.log(details.frameId);
    chrome.tabs.executeScript(null, {file: 'stupidfacebook.js'});
});



