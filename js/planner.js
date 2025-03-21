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
	song: if the event is singing (to compute max song/day)
*/			
function mk_event_r(id, title, sTime, eTime, 
					price,
					col="royalblue",
					sDate=wk[0], eDate=wk[6], 
					dow=[0,1,2,3,4,5],
					song=true){
	// compute duration in minutes
	var durMinutes = {}; 
	for(var d of dow){
		durMinutes[wk[d]] = ( (new Date(wk[d]+' '+sTime)) - (new Date(wk[d]+' '+eTime)) )/1000/60 ;
	}
	
	
	return {
			id: id, title: title, 	  
			groupId: "g_".concat(id), 
			startTime: sTime, endTime: eTime,
			startRecur: sDate, endRecur: eDate,
			daysOfWeek: dow,
			color: col,
			extendedProps:{
				recur: true,
				price: price,
				duration: durMinutes,
				song: song
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
	song: if the event is singing (to compute max song/day)	
*/	
function mk_event(id, title, sTime, eTime, date, price,
				  col="royalblue", song=true){
	
	// compute duration in minutes
	var durMinutes = {}; 
	durMinutes[date] = ( (new Date(date+' '+sTime)) - (new Date(date+' '+eTime)) )/1000/60 ;
	
	return {
			id: id, title: title,
			start: date.concat('T', sTime), 
			end: date.concat('T', eTime),
			color: col,
			extendedProps:{
				price: price,
				duration: durMinutes,
				song: song
			},
			editable: false,
	};               
}
	
// Make the list of all event/activities
const activity_list = {
	// stages
	"diapason": mk_event_r("diapason", "Choeur Diapa'Son", "14:00", "16:00", price=180, col='royalblue'),
	"generason": mk_event_r("generason", "Choeur Généra'Son", "11:30", "13:00", price=60, col='firebrick'),
	"enchantillages": mk_event_r("enchantillages", "Choeur Enchantillages", "14:00", "16:00", price=80, col="darkturquoise"),
	
	// progressons indiv après-midi
	"prog_solo_dipm": mk_event("prog_solo_dipm", "Progres'Son Individuel (Créneau 45min)", "14:00", "16:15", date=wk[0], price=50, col='turquoise'),
	"prog_solo_lupm": mk_event("prog_solo_lupm", "Progres'Son Individuel (Créneau 45min)", "14:00", "16:15", date=wk[1], price=50, col='turquoise'),
	"prog_solo_mapm": mk_event("prog_solo_mapm", "Progres'Son Individuel (Créneau 45min)", "14:00", "16:15", date=wk[2], price=50, col='turquoise'),
	"prog_solo_jepm": mk_event("prog_solo_jepm", "Progres'Son Individuel (Créneau 45min)", "14:00", "16:15", date=wk[4], price=50, col='turquoise'),
	// progressons indiv matin
	"prog_solo_luam": mk_event("prog_solo_luam", "Progres'Son Individuel (Créneau 45min)", "10:00", "11:30", date=wk[1], price=50, col='turquoise'),
	"prog_solo_maam": mk_event("prog_solo_maam", "Progres'Son Individuel (Créneau 45min)", "10:00", "11:30", date=wk[2], price=50, col='turquoise'),
	"prog_solo_jeam": mk_event("prog_solo_jeam", "Progres'Son Individuel (Créneau 45min)", "10:00", "11:30", date=wk[4], price=50, col='turquoise'),
	"prog_solo_veam": mk_event("prog_solo_veam", "Progres'Son Individuel (Créneau 45min)", "10:00", "11:30", date=wk[5], price=50, col='turquoise'),
	
	// progressons collectif après-midi
	"prog_coll_dipm": mk_event("prog_coll_dipm", "Progres'Son Collectif", "16:30", "17:15", date=wk[0], price=25, col='green'),
	"prog_coll_lupm": mk_event("prog_coll_lupm", "Progres'Son Collectif", "16:30", "17:15", date=wk[1], price=25, col='green'),
	"prog_coll_mapm": mk_event("prog_coll_mapm", "Progres'Son Collectif", "16:30", "17:15", date=wk[2], price=25, col='green'),
	"prog_coll_jepm": mk_event("prog_coll_jepm", "Progres'Son Collectif", "16:30", "17:15", date=wk[4], price=25, col='green'),
	// progressons collectif matin
	"prog_coll_luam": mk_event("prog_coll_luam", "Progres'Son Collectif", "11:40", "12:25", date=wk[1], price=25, col='green'),
	"prog_coll_maam": mk_event("prog_coll_maam", "Progres'Son Collectif", "11:40", "12:25", date=wk[2], price=25, col='green'),
	"prog_coll_jeam": mk_event("prog_coll_jeam", "Progres'Son Collectif", "11:40", "12:25", date=wk[4], price=25, col='green'),
	"prog_coll_veam": mk_event("prog_coll_veam", "Progres'Son Collectif", "11:40", "12:25", date=wk[5], price=25, col='green'),

	// Activités communes/obligatoires	
	"bilan": mk_event("bilan", "Bilans et rangement", "09:30", "12:30", date=wk[6], price=0, col='lightgrey', song=false),
	"concert": mk_event("concert", "Concert", "18:00", "19:00", date=wk[6], price=0, col='lightgrey', song=false),
	"reunion": mk_event("reunion", "Réunion d'informations", "09:45", "10:15", date=wk[0], price=0, col='lightgrey', song=false),
	
	// Autres activités
	"bal_folk": mk_event("bal_folk", "Bal folk et scène ouverte", "20:00", "22:00", date=wk[2], price=0, col='gold', song=false),
	"soiree_talents": mk_event("soiree_talents", "Soirée talents", "20:00", "22:00", date=wk[3], price=0, col='gold', song=false)
};

const other_costs = {
	repas_midi: {title:"Forfait repas à la semaine (midi)", price:49},
	repas_total: {title:"Forfait repas à la semaine (complet)", price:107},
	logement_camping: {title:"Logement camping à la semaine ", price:30},
	logement_habitant: {title:"Logement chez l'habitant à la semaine ", price:30},
	logement_chalet: {title:"Logement location de chalet", price:120}
};






// Reactive elements
document.addEventListener("DOMContentLoaded", function () {
	let selectedSlots = {}; // Storage array for selected activity start/end times (expanding recurring events)
	let selectedActivities = [];  // Storage array for selected activity names
	let selectedOtherCosts = {    // Storage object for selected extra costs
		logement: 'none', 
		repas: 'none'
	};  	
	let timePerDay = {}; // create array keeping track of time sung per day
	for (var k of wk){
		timePerDay[k] = 0; // set all days to 0
	}
	
	
	// get the calendar area of the webpage
    let calendarEl = document.getElementById("edt-display"); 
	// create a FullCalendar element
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek", // week format
		initialDate: wk[0],			 // start on the first day of SAC
		locale: "fr",			     // we are Français, oui oui
        allDaySlot: false,			 // schedule layout (not a list per day).
		slotMinTime: "09:00:00",	 // start time in layout
		slotMaxTime: "22:00:00",	 // end time "  "  "
        slotDuration: "00:30:00",	 // grid (display) unit
		contentHeight: "auto",		 // forces the full caldendar height to display
        headerToolbar: false,		 // we don't want users moving around in the calendar, everything is on the same week.
        events: [
			activity_list["bilan"],
			activity_list["concert"],
			activity_list["reunion"],
			activity_list["bal_folk"],
			activity_list["soiree_talents"]
			],					 // will be defined dynamically.
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

		//Other costs ... (meals, lodging)
	  document.querySelectorAll('.other-radio').forEach(radio =>{
			radio.addEventListener("change", function() {
			selectedOtherCosts[this.name] = this.value;
			updateUI();
		  });
	  });
  
  
	// Creates an event handler for checkboxes on the webpage with the tag ".activity-checkbox"
    document.querySelectorAll(".activity-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
			// Upon change, then call functions to handle adding or removing the event to calendar.
            const activityName = this.value;
            if (this.checked) {
                if (addActivity(activityName)) {
					updateTimePerDay(activityName);
                    updateUI();
                } else { // if adding the activity fails (e.g. event overlap), then don't check.
                    this.checked = false; 
                }
            } else {
                removeActivity(activityName);
				updateTimePerDay(activityName);
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
        let totalPrice = 0;
		
		// activities
        selectedActivities.forEach(activityName => {
            let price = activity_list[activityName].extendedProps.price;
            let listItem = document.createElement("li");
            listItem.innerText = `${activity_list[activityName].title}: €${price}`;
            priceList.appendChild(listItem);
            totalPrice += price;
        });
		
		// other costs
		for(var costName of Object.values(selectedOtherCosts)) {
    		if(costName != "none"){
				let price = other_costs[costName].price;
				let listItem = document.createElement("li");
				listItem.innerText = `${other_costs[costName].title}: €${price}`;
				priceList.appendChild(listItem);
				totalPrice += price;
            }
        }
		
        totalPriceElement.innerText = `Prix Total: €${(totalPrice).toFixed(2)}`;
    }
	
	function updateTimePerDay(activityName) {
			let activityDuration = activity_list[activityName].extendedProps.duration;
      
      // if activity is already in the array, then the function is called to remove the time
      if(selectedActivities.includes(activityName)){
      	for (var d of Object.keys(activityDuration)){
						timePerDay[d] -= activityDuration[d];
          }
			} else { // else add the time
      	  for (var d of Object.keys(activityDuration)){
						timePerDay[d] += activityDuration[d];
          }
      }
	}
	
	// Function to update the warning text when going above max singing time per day
	function updateWarning(){
		let warningElement = document.getElementById("warning-message");
		let wString = ""; // to build the warning string
		let dString = ""; // for days pretty print
		
		// get the weekday indices where total time is > threshold
		let overTime = Object.values(timePerDay).map(
				(x, i) => x > maxTimeSung ? i:-1
			).filter(i => i !== -1);
      
		if(overTime.length > 0){
			wString = "Il est recommendé de chanter moins de " +
					  (maxTimeSung/60) + " heures par jour. Le temps chanté ";
			if(overTime.length == 1){
				wString += dayNames[overTime[0]];
			} else {
				for(let i = (overTime.length-1) ; i >=0 ; i-=1){
					if(i == (overTime.length -2)){
						dString = " et " + dString;
					} else if(i < (overTime.length -2)){
						dString = ", " + dString;
					}
					dString = dayNames[overTime[i]] + dString;
				}
		   }
		   wString += dString+" égale ou dépasse ce seuil.";
		}
		warningElement.innerText = wString;
		//console.log(timePerDay);
    }


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