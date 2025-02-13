document.addEventListener("DOMContentLoaded", function () {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const timeSlots = Array.from({ length: 40 }, (_, i) => i * 15); // Time slots in 15-minute intervals (10:00 - 20:00)

    let scheduleGrid = {}; // 2D array for schedule [day][timeSlot]
    let selectedActivities = [];
    let dailyHours = {};
    let mealsSelected = false;
    const mealPrice = 50; // Fixed weekly price for meals

    // Initialize schedule grid
    daysOfWeek.forEach(day => {
        scheduleGrid[day] = new Array(40).fill(null);
    });

    const activities = {
        "Yoga": { day: "Monday", start: 600, duration: 60, price: 15, category: "Wellness" },
        "Coding Bootcamp": { day: "Monday", start: 690, duration: 120, price: 50, category: "Education" },
        "Swimming": { day: "Tuesday", start: 840, duration: 60, price: 20, category: "Sports" },
        "Boxing": { day: "Wednesday", start: 960, duration: 60, price: 25, category: "Sports" },
        "Running": { day: "Monday", start: 540, duration: 90, price: 10, category: "Sports" },
        "Painting Class": { day: "Tuesday", start: 900, duration: 60, price: 18, category: "Arts" },
        "Weightlifting": { day: "Wednesday", start: 930, duration: 60, price: 22, category: "Sports" },
        "Machine Learning Workshop": { day: "Monday", start: 840, duration: 120, price: 60, category: "Education" },
        "Dance Class": { day: "Tuesday", start: 960, duration: 90, price: 30, category: "Wellness" },
        "Photography Class": { day: "Wednesday", start: 1020, duration: 60, price: 20, category: "Arts" },
        "Morning Stretch": { day: "Daily", start: 480, duration: 60, price: 40, category: "Wellness", recurring: true }
    };

    // Handle activity selection
    document.querySelectorAll(".activity-checkbox").forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            const activityName = this.value;
            if (this.checked) {
                if (addActivity(activityName)) {
                    updateUI();
                } else {
                    this.checked = false; // Uncheck if adding failed
                }
            } else {
                removeActivity(activityName);
                updateUI();
            }
        });
    });

    // Handle meal selection
    document.getElementById("meal-checkbox").addEventListener("change", function () {
        mealsSelected = this.checked;
        updateUI();
    });

    function addActivity(activityName) {
        const activity = activities[activityName];
        if (!activity) return false;

        const days = activity.recurring ? daysOfWeek : [activity.day];

        for (let day of days) {
            let startSlot = (activity.start - 480) / 15;
            let endSlot = startSlot + activity.duration / 15;

            for (let i = startSlot; i < endSlot; i++) {
                if (scheduleGrid[day][i]) {
                    alert("❌ Activity conflict! Choose a different activity.");
                    return false;
                }
            }

            for (let i = startSlot; i < endSlot; i++) {
                scheduleGrid[day][i] = activityName;
            }
            updateDailyHours(day, activity.category, activity.duration);
        }

        selectedActivities.push(activityName);
        return true;
    }

    function removeActivity(activityName) {
        const activity = activities[activityName];
        if (!activity) return;

        const days = activity.recurring ? daysOfWeek : [activity.day];

        for (let day of days) {
            let startSlot = (activity.start - 480) / 15;
            let endSlot = startSlot + activity.duration / 15;

            for (let i = startSlot; i < endSlot; i++) {
                scheduleGrid[day][i] = null;
            }
            dailyHours[day][activity.category] -= activity.duration;
        }

        selectedActivities = selectedActivities.filter(a => a !== activityName);
    }

    function updateDailyHours(day, category, duration) {
        if (!dailyHours[day]) dailyHours[day] = {};
        if (!dailyHours[day][category]) dailyHours[day][category] = 0;

        dailyHours[day][category] += duration;
        if (dailyHours[day][category] > 180) {
            document.getElementById("warning-message").innerText = `⚠ Warning: More than 3 hours of ${category} on ${day}!`;
        } else {
            document.getElementById("warning-message").innerText = "";
        }
    }

    function updateUI() {
        updateScheduleDisplay();
        updatePriceDetails();
        updateActivityAvailability();
    }

    function updateScheduleDisplay() {
        let scheduleTable = document.getElementById("schedule-body");
        scheduleTable.innerHTML = "";

        for (let day of daysOfWeek) {
            let row = `<tr><td>${day}</td>`;
            for (let i = 0; i < 40; i++) {
                row += `<td>${scheduleGrid[day][i] ? scheduleGrid[day][i] : ""}</td>`;
            }
            row += "</tr>";
            scheduleTable.innerHTML += row;
        }
    }

    function updatePriceDetails() {
        const priceList = document.getElementById("price-details");
        priceList.innerHTML = "";
        let totalPrice = mealsSelected ? mealPrice : 0;

        selectedActivities.forEach(activity => {
            const price = activities[activity].price;
            totalPrice += price;
            priceList.innerHTML += `<li>${activity}: $${price}</li>`;
        });

        if (mealsSelected) {
            priceList.innerHTML += `<li>Meals (All Week): $${mealPrice}</li>`;
        }

        document.getElementById("total-price").innerText = `Total Price: $${totalPrice}`;
    }

    function updateActivityAvailability() {
        document.querySelectorAll(".activity-checkbox").forEach(checkbox => {
            const activityName = checkbox.value;
            const activity = activities[activityName];

            if (!activity) return;

            const days = activity.recurring ? daysOfWeek : [activity.day];
            let isAvailable = true;

            for (let day of days) {
                let startSlot = (activity.start - 480) / 15;
                let endSlot = startSlot + activity.duration / 15;

                for (let i = startSlot; i < endSlot; i++) {
                    if (scheduleGrid[day][i]) {
                        isAvailable = false;
                        break;
                    }
                }
            }

            checkbox.disabled = !isAvailable;
        });
    }

    updateUI();
});