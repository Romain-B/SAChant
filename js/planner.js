// Setup variables and functions
const wk = [0,1,2,3,4,5,6].map(num => "2025-07-2"+num); // dates of the week

/* Function to make a recurring event object from basic info:
	id: event ID for handling ("g_"+id to catch all recurring events)
	title: display text on the calendar
	sTime, eTime: start/end times
	sDate, eDate: start/end dates (defaults to start/end of week)
	dow: days of the week on which the event occurs, within above dates (sun=0, mon=1, ...)
	col: display color of the event in the calendar
	price: price for the activity
*/			
function mk_event_r(id, title, sTime, eTime, 
					price,
					col="royalblue",
					sDate=wk[0], eDate=wk[6], 
					dow=[0,1,2,3,4,5]){
	return {
			id: id, title: title, 	  
			groupId: "g_".concat(id), 
			startTime: sTime, endTime: eTime,
			startRecur: sDate, endRecur: eDate,
			daysOfWeek: dow,
			color: col,
			extendedProps:{
				price: price
			},
			editable: false, // we don't want users moving stuff around
	};             
}
/* Function to make a simple event object from basic info:
	id: event ID for handling 
	title: display text on the calendar
	sTime, eTime: start/end times
	date: date of the event
	col: display color of the event in the calendar		
*/	
function mk_event(id, title, sTime, eTime, date, price,
				  col="royalblue"){
	return {
			id: id, title: title,
			start: date.concat('T', sTime), 
			end: date.concat('T', eTime),
			color: col,
			extendedProps:{
				price: price
			},
			editable: false,
	};               
}
	
// Make the list of all event/activities
const activity_list = {
	"diapason": mk_event_r("diapason", "Choeur Diapa'Son", "14:00", "16:00", price=50, col='royalblue'),
	"generason": mk_event_r("generason", "Choeur Généra'Son", "11:30", "13:00", price=45, col='firebrick'),
	"enchantillages": mk_event_r("enchantillages", "Choeur Enchantillages", "14:00", "16:00", price=40, col="darkturquoise"),
	"prog_solo": mk_event("prog_solo", "Progres'Son Individuel (Créneau 45min)", "10:00", "11:30", date=wk[1], price=20, col='turquoise'),
	"prog_coll": mk_event("prog_coll", "Progres'Son Collectif", "11:40", "12:30", date=wk[1], price=10, col='green')
};







// Reactive elements
document.addEventListener("DOMContentLoaded", function () {
	let expandedOccurrences = {}; // External storage for event instances
	
	// get the calendar area of the webpage
    let calendarEl = document.getElementById("edt-display"); 
	// create a FullCalendar element
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek", // week format
		initialDate: wk[0],			 // start on the first day of SAC
		locale: "fr",			     // we are Français, oui oui
        allDaySlot: false,			 // schedule by hour (not list per day).
		slotMinTime: "08:30:00",	 // schedule start time
		slotMaxTime: "22:30:00",	 // " "		 end time
        slotDuration: "00:30:00",	 // grid (display) unit
        headerToolbar: false,		 // we don't want users moving around in the calendar, everything is on the same week.
        events: [],					 // will be defined dynamically.
        eventsSet: function(events) { // To store all of the defined event's start/end dates, including recurring.
            expandedOccurrences = {}; // reset occurrences storage
            events.forEach(event => {
                let eid = event.id;

                // Ensure an array exists for this event's occurrences
                if (!expandedOccurrences[eid]){ expandedOccurrences[eid] = []; }

                // Store each occurrence externally 
                expandedOccurrences[eid].push(
				{
					start: event.start.toISOString(),
					end: event.end.toISOString()
				 });
            });

            //console.log("All expanded occurrences:", expandedOccurrences);
        }
    });

    calendar.render();	// show the calendar

    let selectedActivities = [];
	
    let mealsSelected = false;
    const mealPrice = 50;

    const activities = {
        "diapason": { days: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], start: "14:00", duration: 120, price: 50},
        "generason": { days: ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], start: "11:00", duration: 90, price: 50},
        "technique_solo": { days: ["Tuesday"], start: "16:00", duration: 60, price: 20 },
        "technique_groupe": { days: ["Wednesday"], start: "15:00", duration: 60, price: 10 },
    };

    document.querySelectorAll(".activity-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const activityName = this.value;
            if (this.checked) {
                if (addActivity(activityName)) {
                    updateUI();
                } else {
                    this.checked = false;
                }
            } else {
                removeActivity(activityName);
                updateUI();
            }
        });
    });

    document.getElementById("meal-checkbox").addEventListener("change", function () {
        mealsSelected = this.checked;
        updateUI();
    });
	
    function hasOverlap(newEvent) {
    // Get all existing events from the calendar
    for(var k in expandedOccurrences){
    	for(var i=0; i< expandedOccurrences[k].length; i++){
      	if(newEvent.start < expandedOccurrences[k][i].end && 
        		newEvent.end > expandedOccurrences[k][i].start){
        	return true;
        }
      }
    }
    return false;
}

    function addActivity(activityName) {
        const activity = activity_list[activityName];
        if (!activity) return false;

        if(!activity.extendedProps.recur){ // if it's not recurring
          if (hasOverlap(activity_list[activityName])) {
                  alert("❌ Activity conflict detected!");
                  return false;

          }
        }
        calendar.addEvent(activity);
        selectedActivities.push(activityName);
        return true;
    }

    function removeActivity(activityName) {
        calendar.getEvents().forEach(event => {
            if (event.id === activityName) {
                event.remove();
            }
        });
        
		delete expandedOccurrences[activityName]; // clear from the event time slot list.
        selectedActivities = selectedActivities.filter(a => a !== activityName);
    }

    function updateUI() {
        updatePriceDetails();
    }

    function updatePriceDetails() {
        let priceList = document.getElementById("price-details");
        let totalPriceElement = document.getElementById("total-price");
        priceList.innerHTML = "";
        let totalPrice = mealsSelected ? mealPrice : 0;

        selectedActivities.forEach(activityName => {
            let price = activity_list[activityName].extendedProps.price;
            let listItem = document.createElement("li");
            listItem.innerText = `${activityName}: €${price}`;
            priceList.appendChild(listItem);
            totalPrice += price;
        });

        totalPriceElement.innerText = `Prix Total: €${(totalPrice).toFixed(2)}`;
    }

    function addMinutes(time, mins) {
        let [hours, minutes] = time.split(":").map(Number);
        minutes += mins;
        hours += Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }
});
