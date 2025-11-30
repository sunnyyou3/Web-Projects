
/**
 * Class TaskObject for dealing with creation of object tasks
 */
class TaskObject{
    /**
     * Constructor method to create a task with the following:
     * @param id : an id for the task
     * @param description : a description for what the task is
     * @param type : type of task
     * @param date : date to do the task
     */
    constructor(id, description, type, date){
        this.id = id;
        this.description = description;
        this.type = type;
        this.date = date;
    }
}

// export for node.js
module.exports = TaskObject;