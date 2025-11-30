
 // Current words stored in a list
 let wordslist = [];
 let i = 0;
 // On page 'unload', store every word in localStorage
 $(window).on("beforeunload", function(e) {
    $.ajax(
        "/words",
        {   type: "POST",
            dataType: "json",
            data: { 
                words: JSON.stringify(wordslist),
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
    });
 });

 $(window).on("unload", function(e) {
    $.ajax(
        "/words",
        {   type: "POST",
            dataType: "json",
            data: { 
                words: JSON.stringify(wordslist),
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
    });
 });

 //On page load, retrieve words from localStorage if there is any
 //Add onclick event to add words button for creating words
 $(function() {
    let wordsrestore = [];
    $.ajax(
        "/words",
        {   type: "GET",
            processData: false,
            dataType: "json",
            success: function(json) {
                wordsrestore = json;
                //let wordsrestore = JSON.parse(localStorage.getItem("words"));
                // Checks if wordsrestore is empty/null
                if(wordsrestore === null || wordsrestore === [] || wordsrestore.length === 0 || wordsrestore[wordsrestore.length-1] === null){
                    wordslist = [];
                }else{
                    //Put every word back into wordslist in the right spot
                    for(let p = 0; p <= wordsrestore[wordsrestore.length-1].id; p++){
                        if(wordsrestore[p] === null || p != wordsrestore[p].id) {wordslist[p] == null;}
                        else {wordslist[p] = wordsrestore[p];}
                    }
                    displayWords(wordslist);
                }
            $("#addwordsbtn").click(function (e) { 
                addWords();
            });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown + " !!!!");
            }
        });
});

//Displays the words retrieved from localstorage at the right location
function displayWords(list){
    i = list.length;
    for(let k = 0;k < list.length; k++){
        if(list[k] != null){
            $("#poetryBoard").append(`<button id='words${k}' class='words'>` + list[k].word + `</button><br>`);
            $(`#words${k}`).css("left", wordslist[k].xcor);
            $(`#words${k}`).css("top", wordslist[k].ycor);
            $(`#words${k}`).hover(function () {
                wordslist[k] = list[k];
                moveWord(list[k].id);
            });
        }
    }
}

/**
 * Method trash checks to see if a word is on top of the trash can
 * Delete the word if so
 * @param index to locate the word within the list
 */
function trash(index){
    let postop = wordslist[index].ycor;
    let posleft = wordslist[index].xcor;
    // Calculate and checks if a word is within the area of the trash bin
    if(postop >= parseInt($("#trash").css("top"))-10 && postop <= (parseInt($("#trash").css("top")) + parseInt($("#trash").css("width"))) 
    && posleft >= parseInt($("#trash").css("left"))-20 && posleft <= 20+(parseInt($("#trash").css("left")) + parseInt($("#trash").css("width")))){
        wordslist[index] = null;
        $(`#words${index}`).remove();
    }
}

/**
 * Method addWords creates and displays the words on screen
 */
function addWords(){
    let word = $("#addwordsInput").val();
    if(word === "") alert("Please enter a word");
    else{
        //Display it on screen
        $("#poetryBoard").append(`<button id='words${i}' class='words'>` + word + `</button><br>`);
        wordslist[i] = new Words(i, word, $(`#words${i}`).innerWidth(), $(`#words${i}`).innerHeight(), $(`#words${i}`).position().left, $(`#words${i}`).position().top);
        let index = i;
        //On hover event to check if mouse is over words
        $(`#words${i}`).hover(function () {
            moveWord(wordslist[index].id);
        });   
        i++;
        //clear input field
        $("#addwordsInput").val("");

    }
}

//To see if a word is draggable
let draggable = null;
/**
 * Method moveWord allows the word to be moved
 * Mostly calculations within this method
 * @param index the index of the word within wordsList to move
 */
function moveWord(index){
    //Stop dragging
    $(`#words${index}`).mouseup(function () { 
        draggable = false;
        trash(index);
    });

    //Start dragging
    $(`#words${index}`).mousedown(function (e) {
        draggable = true;
        pos3 = e.clientX;
        pos4 = e.clientY;
        $(`#words${index}`).mousemove(function (event) {
            if (draggable){
                pos1 = pos3 - event.clientX;
                pos2 = pos4 - event.clientY;
                pos3 = event.clientX;
                pos4 = event.clientY;
                let offset = $(`#words${index}`).offset();
                //Changing css styles to move word
                $(`#words${index}`).css("top", offset.top - pos2);
                $(`#words${index}`).css("left", offset.left - pos1);
                //Store current position 
                wordslist[index].xcor = offset.left - pos1;
                wordslist[index].ycor = offset.top - pos2;
            }
        });
    });
}


// Constructor class for words
class Words{
    constructor(id, word, width, height, xcor, ycor){
        this.id = id;
        this.word = word;
        this.width = width;
        this.height = height;
        this.xcor = xcor;
        this.ycor = ycor;
    }
}

