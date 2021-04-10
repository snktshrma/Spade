var page = {
    "link": location.href,
    "strokes": []
}

chrome.runtime.onMessage.addListener(function(req, send, res){   
    
})

function setup(){
    var c = createCanvas(document.body.offsetWidth, document.body.offsetHeight);
    c.position(0, 0);
    clear();
    stroke(0);
    strokeWeight(4);
    chrome.storage.local.get(['data'], function(result){
        let index = checkArray(result.data);
        if(!(index == -1)){
            for(let strokes of result.data[index].strokes){
                page.strokes.push(strokes);
                line(strokes.mouseX, strokes.mouseY, strokes.pmouseX, strokes.pmouseY);
            }
        }
    })
}

function draw(){
    stroke(0);
    strokeWeight(4);
    if(mouseIsPressed){
        line(mouseX,mouseY,pmouseX,pmouseY);
        page["strokes"].push({
            "mouseX": mouseX,
            "mouseY": mouseY,
            "pmouseX": pmouseX,
            "pmouseY": pmouseY
        });
        saveData()
    }
}

function keyPressed(){
    if(keyCode == 87){
        remove();
    }
}

function checkArray(array){
    for(var i = 0; i < array.length; i++){
        if(page.link == array[i].link){
            return i;
        }
    }
    return -1;
}

function saveData(){
    chrome.storage.local.get(['data'], function(result){
        if(result.data == undefined){
            chrome.storage.local.set({data: [page]});
        } else {
            var arr = result.data
            if(checkArray(arr) == -1){
                arr.push(page);
            } else {
                arr[checkArray(arr)] = page
            }
            chrome.storage.local.set({data: arr});
        }
    })
}