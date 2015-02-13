/**
* This is a little script for manaing all
* -> events on the entire site.
* We're gonna basically usee "onclick" @event
* -> of javascript on HTML part of the website
* and pass two @params id or class of the element
* -> and @description of the intercom event
*
* @Example:
* <tagElement value="" id="" class="" onclick="track('eventName', 'EventDescription', 'ID of the event', 'Category', 'Label')";></tagElement>
*
* @Usage
* <a href="#" onclick="track('logoClick', 'Logo click Counter');"><img src="toCmpLogo"></img></a>
*/


/**
 * Tracker function for segment io events and clicks
 * @param  {[string]} events [The event name, will increment the value of the clicked element by 1]
 * @param  {[string]} desc   [Detailed Description of the event.]
* @param  {[int]} id     [Unique ID of an event, those that needs to be queued and not]
 * @param  {[string]} category [Type of category, such as authentication]
 * @param  {[string]} label    [Label might be, such as type of user: free or premium]
 * @param  {[bool]} boolean [Boolean that creates category per current page, if we set true it will categorize events for the current page.]
 * @return {[API call]}        [Call back, mostly just a status code, followed by an empty object]
 */
var track = function(events, desc, id, category, label, catPerPage) {

    var page = window.location.pathname.replace("/", "");
    this.eventID = id;
    this.category = category;
    this.event_label = label;
    this.catPerPage = catPerPage;

    if(internal_Globals._enviroment == 'app2'
    || internal_Globals._enviroment == 'app'
    || internal_Globals._enviroment == 'local') {

        if(typeof events == 'undefined' || typeof desc == 'undefined') {events = 'Init'; desc = 'Init';}
        var events = "number_of_" + events;
        if(typeof analytics.track != 'undefined') {
            if(typeof this.eventID != 'undefined' && this.eventID <= 0.9999) {
                setTimeout(function(){
                        analytics.track(desc, {
                            category : (this.catPerPage) ? page.capitalize() : (typeof this.category != 'undefined') ? this.category : 'All',
                            label : (typeof this.event_label != 'undefined') ? this.event_label : 'All',
                            "increments": {
                                events : 1
                            }
                         });
                }, 6000);
            } else {
                analytics.track(desc, {
                    category : (typeof this.category != 'undefined') ? this.category : 'All',
                    label : (typeof this.event_label != 'undefined') ? this.event_label : 'All',
                    "increments": {
                        events : 1
                    }
                });
            }
        }

     } else {

        if(this.catPerPage) {
            console.log("%c Event:" + "%c " + "\"" + events + "\"" + " %c Description:" + "%c " + "\"" + desc +"\"" ,'background: #222; color: #bada55', 'color:blue' , 'background: #222; color: #bada55', 'color:blue');
            console.log("%c This one has an Category also: " + "%c " + page.capitalize(), 'color:black;', 'color:blue;');
        return;
        }

        console.log("%c We are on Local or Development Enviroment", 'font-style:italic;');
        console.log("%c Event:" + "%c " + "\"" + events + "\"" + " %c Description:" + "%c " + "\"" + desc +"\"" ,'background: #222; color: #bada55', 'color:blue' , 'background: #222; color: #bada55', 'color:blue');

        if(typeof this.eventID != 'undefined') {
            if (this.eventID <= 0.9999) console.log("%c This will be queued, and procceed later", 'color:orange');
            console.log("%c This one has an Event_ID also: " + "%c " + this.eventID, 'color:black;', 'color:blue;');
        }
        if(typeof this.category != 'undefined') {
            console.log("%c This one has an Category also: " + "%c " + this.category, 'color:black;', 'color:blue;');
        }
        if(typeof this.event_label != 'undefined') {
            console.log("%c This one has an label also: " + "%c " + this.event_label, 'color:black;', 'color:blue;');
        }

     }

}

// Little helper function
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var Queue = function(){

    function Queue() {};

    Queue.prototype.running = false;

    Queue.prototype.queue = [];

    Queue.prototype.add_function = function(callback) {
        var _this = this;
        //add callback to the queue
        this.queue.push(function(){
            var finished = callback();
            if(typeof finished === "undefined" || finished) {
               //  if callback returns `false`, then you have to
               //  call `next` somewhere in the callback
               _this.next();
            }
        });

        if(!this.running) {
            // if nothing is running, then start the engines!
            this.next();
        }

        return this; // for chaining fun!
    }

    Queue.prototype.next = function(){
        this.running = false;
        //get the first element off the queue
        var shift = this.queue.shift();
        if(shift) {
            this.running = true;
            shift();
        }
    }

    return Queue;

};

var queue = new Queue;
// queue.add_function(function(){ track(); });
