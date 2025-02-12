document.addEventListener("DOMContentLoaded", function () {
    const activitySelect = document.getElementById("activity-select");
    const scheduleBody = document.getElementById("schedule-body");
    const selectedActivitiesList = document.getElementById("selected-activities");
    const priceDetailsList = document.getElementById("price-details");
    const totalPriceElement = document.getElementById("total-price");
    const warningMessage = document.getElementById("warning-message");

    let selectedActivities = [];
    let dailyActivityTime = {}; // Track hours spent per day

    const activities = {
        "Yoga": { days: ["Monday"], time: "10:00 - 11:00", price: 20, duration: 1, type: "Sports" },
        "Coding Bootcamp": { days: ["Monday"], time: "11:30 - 13:30", price: 50, duration: 2, type: "Education" },
        "Swimming": { days: ["Tuesday"], time: "14:00 - 15:00", price: 30, duration: 1, type: "Sports" },
        "Boxing": { days: ["Wednesday"], time: "16:00 - 17:00", price: 25, duration: 1, type: "Sports" },
        "Running": { days: ["Monday"], time: "09:00 - 10:30", price: 15, duration: 1.5, type: "Sports" },
        "Painting Class": { days: ["Tuesday"], time: "15:00 - 16:00", price: 40, duration: 1, type: "Art" },
        "Weightlifting": { days: ["Wednesday"], time: "15:30 - 16:30", price: 35, duration: 1, type: "Sports" },
        "Machine Learning Workshop": { days: ["Monday"], time: "14:00 - 16:00", price: 60, duration: 2, type: "Education" },
        "Dance Class": { days: ["Tuesday"], time: "16:00 - 17:30", price: 30, duration: 1.5, type: "Sports" },
        "Photography Class": { days: ["Wednesday"], time: "17:00 - 18:00", price: 45, duration: 1, type: "Art" },
        "Morning Stretch": { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], time: "08:00 - 09:00", price: 50, duration: 1, type: "Sports", recurring: true },
    };

    function updateSchedule() {
        scheduleBody.querySelectorAll("td[colspan]").forEach(cell => cell.innerHTML = ""); 
        selectedActivitiesList.innerHTML = "";
        priceDetailsList.innerHTML = "";
        let total = 0;
        dailyActivityTime = {}; 

        selectedActivities.forEach(activity => {
            let act = activities[activity];
            let price = act.recurring ? act.price : act.price;
            total += price;

            act.days.forEach(day => {
                let row = [...scheduleBody.children].find(r => r.children[0].textContent === day);
                let cell = row.children[Math.floor(Math.random() * 5) + 1]; 
                cell.innerHTML = activity;
                
                if (!dailyActivityTime[day]) dailyActivityTime[day] = 0;
                dailyActivityTime[day] += act.duration;
            });

            let listItem = document.createElement("li");
            listItem.innerHTML = `${activity} <button onclick="removeActivity('${activity}')">Remove</button>`;
            selectedActivitiesList.appendChild(listItem);

            let priceItem = document.createElement("li");
            priceItem.innerText = `${activity}: $${price}`;
            priceDetailsList.appendChild(priceItem);
        });

        totalPriceElement.innerText = `Total Price: $${total}`;
    }

    window.removeActivity = function(activity) {
        selectedActivities = selectedActivities.filter(a => a !== activity);
        updateSchedule();
    };

    activitySelect.addEventListener("change", function () {
        let selected = activitySelect.value;
        if (!selected || selectedActivities.includes(selected)) return;

        selectedActivities.push(selected);
        updateSchedule();
    });
});
