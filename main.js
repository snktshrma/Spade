var page = {
    "link": location.href,
    "strokes": []
}

var tool = "writing";

var endSketch = false;

chrome.storage.local.set({startStop: true});

chrome.runtime.onMessage.addListener(function(req, send, res){
    if(req.greeting != undefined){
        if(req.greeting){
            endSketch = false;
            startSketch();
        } else {
            endSketch = true;
        }
    } else {
        tool = req.tool;
    }
})

function startSketch(){
    const s = (sketch) =>{
        sketch.setup = ()=>{
            var c = sketch.createCanvas(document.body.offsetWidth, document.body.offsetHeight);
            c.position(0, 0);
            sketch.clear();
            sketch.stroke(0);
            sketch.strokeWeight(4);
            chrome.storage.local.get(['data'], function(result){
                let index = checkArray(result.data);
                if(!(index == -1)){
                    for(let strokes of result.data[index].strokes){
                        page.strokes.push(strokes);
                        sketch.line(strokes.mouseX, strokes.mouseY, strokes.pmouseX, strokes.pmouseY);
                    }
                }
            })
        }

        sketch.draw = ()=>{
            if(endSketch){
                sketch.remove();
            }
            if(tool == "writing"){
                sketch.stroke(0);
                sketch.strokeWeight(4);
            } else if(tool == "highlight"){
                sketch.stroke(204, 255, 0, 75);
                sketch.strokeWeight(15);
            }
            if(sketch.mouseIsPressed){
                sketch.line(sketch.mouseX,sketch.mouseY,sketch.pmouseX,sketch.pmouseY);
                page["strokes"].push({
                    "tool": tool,
                    "mouseX": sketch.mouseX,
                    "mouseY": sketch.mouseY,
                    "pmouseX": sketch.pmouseX,
                    "pmouseY": sketch.pmouseY
                });
                saveData()
            }
        }
    }
    let myp5 = new p5(s);
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