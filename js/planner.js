document.addEventListener("DOMContentLoaded", function () {
	
	// Setup variables and functions
	const wk = [0,1,2,3,4,5,6].map(num => "2025-07-2"+num); // dates of the week
	
	/* Function to make a recurring event object from basic info:
		id: event ID for handling ("g_"+id to catch all recurring events)
		title: display text on the calendar
		sTime, eTime: start/end times
		sDate, eDate: start/end dates (defaults to start/end of week)
		dow: days of the week on which the event occurs, within above dates (sun=0, mon=1, ...)
		col: display color of the event in the calendar
	*/			
	function mk_event_r(id, title, sTime, eTime, 
						sDate=wk[0], eDate=wk[6], 
						dow=[0,1,2,3,4,5], col="royalblue"){
      return {
				id: id, title: title, 	  // id is for handling, title is for display
				groupId: "g_".concat(id), // to handle all the sub-events
				startTime: sTime, endTime: eTime,
				startRecur: sDate, endRecur: eDate,
				daysOfWeek: dow,
				color: col,
				editable: false,
      }                
	}
	/* Function to make a simple event object from basic info:
		id: event ID for handling 
		title: display text on the calendar
		sTime, eTime: start/end times
		date: date of the event
		col: display color of the event in the calendar		
	*/	
  function mk_event(id, title, sTime, eTime, date, 
					col="royalblue"){
      return {
      			id: id, title: title,
				start: date.concat('T', sTime), 
				end: date.concat('T', eTime),
				color: col,
				editable: false,
      }                
	}
	
	const activity_list = {
    	"diapason":{
			id: "diapason",
			groupId: "g_diapason",
			title: "Choeur Diapa'Son",
					daysOfWeek: [0,1,2,3,4,5],
			startRecur: wk[0],
			endRecur: wk[6],
			startTime: "14:00",
			endTime: "16:00",
			editable: false,
			color: 'royalblue'
		},
		"generason":{
			id: "generason",
			groupId: "g_generason",
			title: "Choeur Généra'Son",
					daysOfWeek: [0,1,2,3,4,5],
			startRecur: wk[0],
			endRecur: wk[6],
			startTime: "11:30",
			endTime: "13:00",
			editable: false,
			color: 'deeppink'
		},
		"enchantillages":{
			id: "enchantillages",
			groupId: "g_enchantillages",
			title: "Choeur Enchantillages",
					daysOfWeek: [0,1,2,3,4,5],
			startRecur: wk[0],
			endRecur: wk[6],
			startTime: "14:00",
			endTime: "16:00",
			editable: false,
			color: 'deeppink'
		},
		"technique_solo":{
			id: "technique_solo",
			title: "Progres'Son Individuel (Créneau 45min)",
			details:"",
			start: wk[2].concat('T', "14:00"),
			end: wk[2].concat('T', "16:00"),
			editable: false, 
			color: "chartreuse4"
		},
		"technique_groupe":{
			id: "technique_solo",
			title: "Progres'Son Collectif (45min)",
			details:"",
			start: wk[2].concat('T', "14:00"),
			end: wk[2].concat('T', "16:00"),
			editable: false, 
			color: "chartreuse3"
		}
      
    };
	
	
	
	
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
        events: []					 // will be defined dynamically.
    });

    calendar.render();	// renders the calendar

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

    function addActivity(activityName) {
        const activity = activities[activityName];
        if (!activity) return false;

        for (let day of activity.days) {
            let startTime = activity.start;
            let duration = activity.duration;
            let endTime = addMinutes(startTime, duration);

            if (calendar.getEvents().some(event => event.startStr.includes(day) && event.startStr.includes(startTime))) {
                alert("❌ Activity conflict detected!");
                return false;
            }

            calendar.addEvent({
                title: activityName,
                start: `${day}T${startTime}`,
                end: `${day}T${endTime}`,
                color: "blue"
            });
        }

        selectedActivities.push(activityName);
        return true;
    }

    function removeActivity(activityName) {
        calendar.getEvents().forEach(event => {
            if (event.title === activityName) {
                event.remove();
            }
        });

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
            let price = activities[activityName].price;
            let listItem = document.createElement("li");
            listItem.innerText = `${activityName}: €${price}`;
            priceList.appendChild(listItem);
            totalPrice += price;
        });

        totalPriceElement.innerText = `Prix Total: €${totalPrice}`;
    }

    function addMinutes(time, mins) {
        let [hours, minutes] = time.split(":").map(Number);
        minutes += mins;
        hours += Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }
});
