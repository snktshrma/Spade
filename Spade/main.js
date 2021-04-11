var page = {
    "link": location.href,
    "strokes": []
}

var c = null;

var tool = "writing";

chrome.storage.local.set({startStop: true});

chrome.runtime.onMessage.addListener(function(req, send, res){
    if(req.greeting != undefined){
        if(req.greeting){
            loop();
            c.style("pointer-events", "initial");
        } else {
            noLoop();
            c.style("pointer-events", "none");
        }
    } else if (req.tool != undefined){
        tool = req.tool;
    } else if (req.clear != undefined){
        page.strokes = [];
        saveData();
        clear();
        noLoop();
    } else if (req.answer != undefined){
        find(req.answer);
    }
})

function setup(){
    c = createCanvas(window.innerWidth, window.innerHeight);
    c.position(0, 0);
    c.style("pointer-events", "none");
    clear();
    chrome.storage.local.get(['data'], async function(result){
        let index = checkArray(result.data);
        if(!(index == -1)){
            for(let strokes of result.data[index].strokes){
                if(strokes.tool == "writing"){
                    noErase();
                    stroke(0);
                    strokeWeight(4);
                    line(strokes.mouseX, strokes.mouseY, strokes.pmouseX, strokes.pmouseY);
                } else if (strokes.tool == "highlight"){
                    noErase();
                    stroke(204, 255, 0, 30);
                    strokeWeight(15);
                    line(strokes.mouseX, strokes.mouseY, strokes.pmouseX, strokes.pmouseY);
                } else if (strokes.tool == "erase"){
                    erase(255);
                    strokeWeight(40);
                    line(strokes.mouseX, strokes.mouseY, strokes.pmouseX, strokes.pmouseY);
                } else if (strokes.tool == "text"){
                    noErase();
                    strokeWeight(0);
                    textSize(15);
                    text(strokes.text, strokes.mouseX, strokes.mouseY)
                }
                page.strokes.push(strokes);
            }
        }
    })
    noLoop();
}

function draw(){
    if(tool == "writing"){
        noErase();
        stroke(0);
        strokeWeight(4);
    } else if(tool == "highlight"){
        noErase();
        stroke(204, 255, 0, 30);
        strokeWeight(15);
    } else if(tool == "erase"){
        stroke(0);
        strokeWeight(40);
        erase(255, 255);
    }
    if(mouseIsPressed){
        if(tool != "text"){
            line(mouseX,mouseY,pmouseX,pmouseY);
        }
        page["strokes"].push({
            "tool": tool,
            "mouseX": mouseX,
            "mouseY": mouseY,   
            "pmouseX": pmouseX,
            "pmouseY": pmouseY
        });
        saveData()
    }
}

function mousePressed(){
    if(isLooping()){
        let info = ""
        if (tool == "text"){
            noErase();
            strokeWeight(0);
            textStyle(NORMAL);
            textSize(15);
            info = prompt("Please enter text here!");
            text(info, mouseX, mouseY)
        }
        page["strokes"].push({
            "tool": tool,
            "mouseX": mouseX,
            "mouseY": mouseY,
            "text": info
        });
    }
}


function checkArray(array){
    if(array != undefined){
        for(var i = 0; i < array.length; i++){
            if(page.link == array[i].link){
                return i;
            }
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