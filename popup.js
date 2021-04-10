
document.addEventListener('DOMContentLoaded',async function() {
  document.querySelector("#copy").addEventListener("click", copy);


  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    let url = tabs[0].url;
    // use `url` here inside the callback because it's asynchronous!

    fetch("http://localhost:5000/credibility?url="+url).then(r => r.text()).then(result => {
      result=JSON.parse(result)
      var score = result["total"]
      score*=10
      score=Math.round(score)
      var scoreHeader= document.getElementsByClassName('h2 font-weight-bold')[0]
      scoreHeader.innerHTML=score+'<sup class="small">%</sup>'
  var left = document.getElementsByClassName('progress-bar-circle')[0];
  var right = document.getElementsByClassName('progress-bar-circle')[1];
  if (score > 0) {
    if (score <= 50) {
      right.style["border-color"]="red"
      left.style["border-color"]="red"
      right.style.transform='rotate(' + percentageToDegrees(score) + 'deg)'
    } else {
      right.style["border-color"]="green"
      left.style["border-color"]="green"
      right.style.transform='rotate(180deg)'
      left.style.transform='rotate(' + percentageToDegrees(score - 50) + 'deg)'
    }

  }
  var arr = ["url_score","mistakes_score","relevance_score","author_score","bias_score"]
  for(var i = 0;i<arr.length;i++){
    var elem = document.getElementById(arr[i])
    var score = result[arr[i]]
      score*=10
      score=Math.round(score)
      elem.style.width=`${score}%`
    elem.innerHTML=`<div class="progress-value">${score}%</div>`
  }
  
})
fetch("http://localhost:5000/cite?url="+url).then(r => r.text()).then(result => {
  document.getElementById("input").value = result;
})


});

})
function percentageToDegrees(percentage) {

    return percentage / 100 * 360
  
  }
  function copy() {
    var copyText = document.querySelector("#input");
    copyText.select();
    document.execCommand("copy");
  }
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

document.getElementById("text").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {tool: "text"});
    })
})

document.getElementById("erase").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {tool: "erase"});
    })
})

document.getElementById("clear").addEventListener("click", function(){
    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {clear: true})
        chrome.storage.local.set({startStop: true});
        state = true
        document.getElementById("start").innerHTML = "Start";
    })
})
