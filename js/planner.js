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
				price: price,
				recur: true
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
	"prog_coll": mk_event("prog_coll", "Progres'Son Collectif", "11:40", "12:30", date=wk[1], price=10, col='green'),
	"bilan": mk_event("bilan", "Bilans et rangement", "09:30", "12:30", date=wk[6], price=0, col='lightgrey')
};







// Reactive elements
document.addEventListener("DOMContentLoaded", function () {
	let selectedSlots = {}; // Storage array for selected activity start/end times (expanding recurring events)
	let selectedActivities = [];  // Storage array for selected activity names

	
	// get the calendar area of the webpage
    let calendarEl = document.getElementById("edt-display"); 
	// create a FullCalendar element
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek", // week format
		initialDate: wk[0],			 // start on the first day of SAC
		locale: "fr",			     // we are Français, oui oui
        allDaySlot: false,			 // schedule layout (not a list per day).
		slotMinTime: "09:00:00",	 // start time in layout
		slotMaxTime: "20:00:00",	 // end time "  "  "
        slotDuration: "00:30:00",	 // grid (display) unit
		contentHeight: "auto",		 // forces the full caldendar height to display
        headerToolbar: false,		 // we don't want users moving around in the calendar, everything is on the same week.
        events: [],					 // will be defined dynamically.
		eventsSet: function(events) { // To store all of the defined event's start/end dates, 
									  // including recurring (which is not done, for some reason).
            selectedSlots = {}; // reset occurrences storage
            events.forEach(event => {
                let eid = event.id;
                let [es, ee] = [event.start, event.end]
                
                if(event.extendedProps.recur){ // if it's a recursive event, times are not defined
					// fetch time values from the activities list defined above
                	[h, m] = activity_list[eid].startTime.split(":").map(Number);
					es.setHours(h, m, 0); // update start date with the time
					
					[h, m] = activity_list[eid].endTime.split(":").map(Number);
					ee.setHours(h, m, 0); // update end date with the time
				}

                // Ensure an array exists for this event's occurrences
                if (!selectedSlots[eid]){ selectedSlots[eid] = []; }

                // Store each occurrence externally 
                selectedSlots[eid].push(
				{
					start: new Date(es), // define as new date to enforce format
					end: new Date(ee)
				 });
            });
        }
    });

    calendar.render();	// show the calendar
	
	//Meal stuff to rework ... (also add lodging stuff, in a similar way.)
    let mealsSelected = false;
    const mealPrice = 50;
	document.getElementById("meal-checkbox").addEventListener("change", function () {
        mealsSelected = this.checked;
        updateUI();
    });
	//.....//

	// Creates an event handler for checkboxes on the webpage with the tag ".activity-checkbox"
    document.querySelectorAll(".activity-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
			// Upon change, then call functions to handle adding or removing the event to calendar.
            const activityName = this.value;
            if (this.checked) {
                if (addActivity(activityName)) {
                    updateUI();
                } else { // if adding the activity fails (e.g. event overlap), then don't check.
                    this.checked = false; 
                }
            } else {
                removeActivity(activityName);
                updateUI();
            }
        });
    });


    function hasOverlap(newEvent) {
		// Check overlap of new event with loaded events in the calendar
		
		s2 = new Date(newEvent.start);
		e2 = new Date(newEvent.end);
		for(var k in selectedSlots){
			for(var i=0; i< selectedSlots[k].length; i++){
				e1 = selectedSlots[k][i].end;
				s1 = selectedSlots[k][i].start;
				//console.log(s2+"\n"+e2);
				//console.log(s2 < e1 && s1 < e2);
				if(s2 < e1 && s1 < e2){
					return true; // there is overlap
				}
			}
		}
		return false;
	}


    function addActivity(activityName) {
		// Adds an activity (e.g. upon selection)
		
        const activity = activity_list[activityName];
        if (!activity) return false;

        if(!activity.extendedProps.recur){ // if it's not recurring
          if (hasOverlap(activity_list[activityName])) {
                  alert("❌ Vous ne pouvez pas vous dédoubler et assister à deux ateliers en même temps !");
                  return false;
          }
        }
        calendar.addEvent(activity);
		if(activity.extendedProps.recur){
			calendar.addEvent(activity_list["bilan"]);
		}
        selectedActivities.push(activityName);
        return true;
    }
	
    function removeActivity(activityName) {
		// Removes an activity (e.g. upon deselection)
        calendar.getEvents().forEach(event => {
            if (event.id === activityName) {
                event.remove();
            }
        });
        
		// clear from the event time slot list, and the list of selected activities.
		delete selectedSlots[activityName]; 
        selectedActivities = selectedActivities.filter(a => a !== activityName);
    }

    function updateUI() {
		// Updates the page when an action is performed
        updatePriceDetails();
    }

    function updatePriceDetails() {
		// Keeps the price list up to date
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
		// Computes total of minutes
        let [hours, minutes] = time.split(":").map(Number);
        minutes += mins;
        hours += Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }	
});



// For PDF saving
const savePdfBtn = document.getElementById("save-pdf"); // get the save button
savePdfBtn.addEventListener("click", function () {		// attach an event listener to it
	const { jsPDF } = window.jspdf;
	
	// Fetch the calendar & price detail sections to render in the pdf
	const edtEl = document.getElementById("edt-display"); 
	const priceEl = document.getElementById("price-section");
	let pdf = new jsPDF('p', 'mm', 'a4');


	// Page dimensions
	let pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Leave margins
	let pdfHeight = pdf.internal.pageSize.getHeight() - 20; // Leave margins

	pdf.setFontSize(16);
	pdf.text("Résumé de la simulation", 10, 15);

	// Render the schedule
	pdf.html(edtEl, {
		x: 20,
		y: 20,
		width: pdfWidth * 0.6, // Fit width to PDF
		windowWidth: edtEl.scrollWidth, // Scale content
		autoPaging: true, // Ensures multiple pages if needed
		callback: function (pdf) {
			let newY = pdf.internal.pageSize.height - 150; // Position for price section

			// Check if content exceeded a page and move accordingly
			if (pdf.internal.getNumberOfPages() > 1) {
				pdf.addPage();
				newY = 20; // Reset for new page
			}

			// Render price breakdown
			pdf.html(priceEl, {
				x: 20,
				y: newY,
				width: pdfWidth,
				windowWidth: priceEl.scrollWidth,
				callback: function (pdf) {
					pdf.save("simulation_allezchant.pdf");
				}
			});
		}
	});
});