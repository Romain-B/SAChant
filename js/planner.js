document.addEventListener("DOMContentLoaded", function () {
    let calendarEl = document.getElementById("calendar");

    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: "timeGridWeek",
        allDaySlot: false,
		slotMinTime: "09:00:00",
		slotMaxTime: "22:30:00",
        slotDuration: "00:15:00",
        headerToolbar: {
            left: "",
            center: "",
            right: ""
        },
        events: []
    });

    calendar.render();

    let selectedActivities = [];
    let mealsSelected = false;
    const mealPrice = 50;

    const activities = {
        "Yoga": { days: ["Monday"], start: "10:00", duration: 60, price: 15 },
        "Coding Bootcamp": { days: ["Monday"], start: "11:30", duration: 120, price: 50 },
        "Swimming": { days: ["Tuesday"], start: "14:00", duration: 60, price: 20 },
        "Boxing": { days: ["Wednesday"], start: "16:00", duration: 60, price: 25 },
        "Morning Stretch": { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], start: "08:00", duration: 60, price: 40, recurring: true }
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
            listItem.innerText = `${activityName}: $${price}`;
            priceList.appendChild(listItem);
            totalPrice += price;
        });

        totalPriceElement.innerText = `Total Price: $${totalPrice}`;
    }

    function addMinutes(time, mins) {
        let [hours, minutes] = time.split(":").map(Number);
        minutes += mins;
        hours += Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
    }
});
