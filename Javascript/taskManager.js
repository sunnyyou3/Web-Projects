
// Task array to keep track of current tastks as returned by server
 let task = [];

/**
 * Onload function to display current tasks
 * Add onclick functions to add and delete
 */
 $(function() {
    // Display current task
    taskManager();
    // OnClick event for add : post task, get tasks and display again
    $('#add').click(function (e) { 
        postInput();
        getTasks();
    });

    // OnClick event for delete : ask for confirmation 
    // Delete each task that was checkmarked, then get tasks and display again
    $('#delete').click(function (e) { 
        if (confirm('Really delete?')) {
            $('input:checkbox:checked').each(function(){
                    deleteTasks($(this).val());
                    getTasks();
            })
        }
    });
});
    
/**
 * Displays initial set of tasks stored in server
 */
function taskManager(){
    // Get tasks
    getTasks();
    // Display tasks
    appendData();
    // Hide inputs for person and waiting until the necessary drop down menu is selected
    $('#personInput').hide();
    $('#waitingInput').hide();
    $('#options').change(function () { 
        if($('#options').val() === "Talk"){
            $('#personInput').show();
            $('#waitingInput').hide();
            $('#waitingInput').val('');
        }else if($('#options').val() === "Waiting"){
            $('#waitingInput').show();
            $('#personInput').hide();
            $('#personInput').val('');
        }else{
            $('#personInput').hide();
            $('#personInput').val('');
            $('#waitingInput').hide();
            $('#waitingInput').val('');
        }
    });


}

/**
 * Takes the task array and display it on screen
 */
function appendData(){
    for(let i = 0; i < task.length; i++){
        if(task[i] != null){
            let $dataRow = $(`<tr id="asd"></tr>`);
            $dataRow.append(`<td><input type="checkbox" value="${task[i].id}"></input></td><td>${task[i].description}</td><td>${task[i].type}</td><td>${task[i].date}</td>`);
            $('table').append($dataRow);
        }
    }
}

/**
 * Method to remove all current tasks displayed
 * Gets table ready for redisplaying
 */
function remove(){
    $('[id=asd]').remove();
}

/**
 * One of the onClick event call for add button
 * Recevies information from user input and clears it
 * Take the received information and perform an ajax POST request
 */
function postInput(){
    let data = $('#description').val();
    $('#description').val('');
    let type = $('#options').val() === "Waiting" ? $('#options').val() + ":" : $('#options').val() === "Talk" ?  $('#options').val() + ":" : $('#options').val();
    let addon = $('#person').val() === "" ? $('#waiting').val() === "" ? "" : $('#waiting').val() : $('#person').val();
    type += " " + addon;
    $('#type').val('');
    let date = $('#date').val();
    $('#date').val("");
    $('#personInput').hide();
    $('#personInput').val('');
    $('#waitingInput').hide();
    $('#waitingInput').val('');
    $('#options').val('Next Action')
    $.ajax(
        "/task",
        {   type: "POST",
            dataType: "json",
            data: { 
                description: data,
                type: type,
                date: date,
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });
}

/**
 * One of the onClick event call for add and delete button
 * Performs an ajax GET request
 * Calls function remove, stores obtained task in array task
 * Prints the updated task onto the table
 */
function getTasks(){
    $.ajax(
        "/task",
        {   type: "GET",
            processData: false,
            dataType: "json",
            success: function(json) {
                remove();
                task = json;
                appendData();
            },
            error: function(jqXHR, textStatus, errorThrown) {
                alert("Error: " + jqXHR.responseText);
                alert("Error: " + textStatus);
                alert("Error: " + errorThrown);
            }
        });
}

/**
 * One of the onClick event call for delete button
 * @param id : The id of the task to delete
 * Performs an ajax DELETE request to remove a task from the database --> an array in server.js
 */
function deleteTasks(id){
    $.ajax(
        "/task/" + id,
        {   type: "DELETE",
            dataType: "json",
        });
}