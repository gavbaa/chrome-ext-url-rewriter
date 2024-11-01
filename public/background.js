// chrome.action.onClicked.addListener(function(tab) {
//     console.log("EXTENSION CLICKED")
//     chrome.tabs.create({ url: chrome.runtime.getURL('index.html'), active: true });
// });

chrome.action.onClicked.addListener(function(tab) {
    console.log('extension clicked');
    chrome.tabs.create({
      url: chrome.runtime.getURL("index.html")
    });
  });