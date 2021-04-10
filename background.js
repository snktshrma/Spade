var state = true;

chrome.browserAction.onClicked.addListener(function(tab) {
    if(confirm("Delete Data?")){
        chrome.storage.local.clear();
    }
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "HELLO"})
    })
});