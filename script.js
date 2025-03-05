document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const habitInput = document.querySelector("#habitInput");
    const addHabitButton = document.querySelector("#addHabitBtn");
    const habitList = document.querySelector("#habitList");
    const habitCount = document.querySelector("#habitCount");
    const calendar = document.querySelector("#calendar");

    // Load habits from localStorage when the page loads
    function loadHabits() {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        let streaks = JSON.parse(localStorage.getItem("streaks")) || {};

        habitList.innerHTML = ""; // Clear UI before loading

        habits.forEach((habit, index) => {
            addHabitToDOM(habit, index, streaks[habit] || 0, false);
        });

        updateHabitCount();
        renderCalendar();
    }

    // Save habits to localStorage
    function saveHabit(habitText) {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        let streaks = JSON.parse(localStorage.getItem("streaks")) || {};

        habits.push(habitText);
        streaks[habitText] = 0; // Initialize streak at 0
        localStorage.setItem("habits", JSON.stringify(habits));
        localStorage.setItem("streaks", JSON.stringify(streaks));
        updateHabitCount();
    }

    // Function to update the streak calendar
    function renderCalendar() {
        calendar.innerHTML = "";
        let today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        let daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            let emptyDay = document.createElement("div");
            emptyDay.classList.add("calendar-day");
            calendar.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            let dayElement = document.createElement("div");
            dayElement.classList.add("calendar-day");
            dayElement.textContent = day;

            let dayKey = `${currentYear}-${currentMonth + 1}-${day}`;
            let habits = JSON.parse(localStorage.getItem("habits")) || [];

            // Check if any habit was completed on this day
            let habitCompletedOnDay = habits.some(habit =>
                localStorage.getItem(`habitCompleted_${habit}_${dayKey}`)
            );

            if (habitCompletedOnDay) {
                dayElement.classList.add("completed");
            }

            calendar.appendChild(dayElement);
        }
    }

    // Function to mark a habit as completed for today
    function markHabitComplete(habitText, streakElement, doneBtn) {
        let streaks = JSON.parse(localStorage.getItem("streaks")) || {};
        let today = new Date();
        let todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        let habitCompletedKey = `habitCompleted_${habitText}_${todayKey}`;

        if (!localStorage.getItem(habitCompletedKey)) {
            localStorage.setItem(habitCompletedKey, "true");
            streaks[habitText] = (streaks[habitText] || 0) + 1;
            localStorage.setItem("streaks", JSON.stringify(streaks));
            streakElement.textContent = `🔥 Streak: ${streaks[habitText]}`;
            doneBtn.disabled = true;
            doneBtn.textContent = "✅ Done Today";
            renderCalendar();
        } else {
            alert("You've already marked this habit as done for today!");
        }
    }

    // Function to add a habit to the UI
    function addHabitToDOM(habitText, index, streak, save = true) {
        const habitItem = document.createElement("li");

        // Streak counter
        const streakElement = document.createElement("span");
        streakElement.classList.add("streak");
        streakElement.textContent = `🔥 Streak: ${streak}`;

        // Done button
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✅ Done";
        doneBtn.classList.add("done-btn");
        doneBtn.onclick = function () {
            markHabitComplete(habitText, streakElement, doneBtn);
        };

        // Disable the done button if the habit was already completed today
        let today = new Date();
        let todayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        let habitCompletedKey = `habitCompleted_${habitText}_${todayKey}`;

        if (localStorage.getItem(habitCompletedKey)) {
            doneBtn.disabled = true;
            doneBtn.textContent = "✅ Done Today";
        }

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = function () {
            removeHabit(index);
        };

        habitItem.textContent = habitText;
        habitItem.appendChild(streakElement);
        habitItem.appendChild(doneBtn);
        habitItem.appendChild(deleteBtn);
        habitList.appendChild(habitItem);

        if (save) {
            saveHabit(habitText);
        }
    }

    // Function to add a habit
    function addHabit() {
        const habitText = habitInput.value.trim();
        if (habitText !== "") {
            addHabitToDOM(habitText, Date.now(), 0);
            habitInput.value = "";
        } else {
            alert("Please enter a habit to track.");
        }
    }

    // Remove habit from localStorage
    function removeHabit(index) {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        let streaks = JSON.parse(localStorage.getItem("streaks")) || {};

        const habitToRemove = habits[index];
        delete streaks[habitToRemove]; // Remove streak as well

        habits.splice(index, 1);
        localStorage.setItem("habits", JSON.stringify(habits));
        localStorage.setItem("streaks", JSON.stringify(streaks));

        updateHabitCount();
        loadHabits();
    }

    // Function to update habit count
    function updateHabitCount() {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        habitCount.textContent = habits.length;
    }

    // Event Listeners
    if (addHabitButton) addHabitButton.addEventListener("click", addHabit);
    habitInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") addHabit();
    });

    loadHabits();
});
