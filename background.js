var state = null;

chrome.storage.local.get(["startStop"], function(result){
    if(result.startStop == undefined){
        state = true;
    } else {
        state = result.startStop;
    }
    if(state){
        document.getElementById("start").innerHTML = "Start";
    } else {
        document.getElementById("start").innerHTML = "Stop";
    }
})

document.getElementById("start").addEventListener("click", function(){ 
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: state})
        chrome.storage.local.set({startStop: !state});
        state = !state;
        if(state){
            document.getElementById("start").innerHTML = "Start";
        } else {
            document.getElementById("start").innerHTML = "Stop";
        }
    })
})

document.getElementById("writing").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {tool: "writing"});
    })
})

document.getElementById("highlight").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {tool: "highlight"});
    })
})

document.getElementById("clear").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {greeting: false})
        chrome.storage.local.set({startStop: true});
        state = true
        document.getElementById("start").innerHTML = "Start";
    })
    chrome.storage.local.remove(['data']);
})