chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: false})
        chrome.storage.local.set({startStop: true});
    })
});

chrome.tabs.onUpdated.addListener(function(a, b, c){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: false})
        chrome.storage.local.set({startStop: true});
    })
})