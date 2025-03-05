document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const getStartedButton = document.querySelector("#getStartedBtn");
    const habitInput = document.querySelector("#habitInput");
    const addHabitButton = document.querySelector("#addHabitBtn");
    const habitList = document.querySelector("#habitList");

    // Load habits from localStorage when the page loads
    function loadHabits() {
        const storedHabits = localStorage.getItem("habits");
        if (storedHabits) {
            const habitsArray = JSON.parse(storedHabits);
            habitsArray.forEach(habit => {
                addHabitToDOM(habit);
            });
        }
    }

    // Save habits to localStorage
    function saveHabit(habitText) {
        let habits = localStorage.getItem("habits");
        habits = habits ? JSON.parse(habits) : [];
        habits.push(habitText);
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    // Remove habit from localStorage
    function removeHabit(habitText) {
        let habits = JSON.parse(localStorage.getItem("habits")) || [];
        habits = habits.filter(habit => habit !== habitText);
        localStorage.setItem("habits", JSON.stringify(habits));
    }

    // Function to add a habit to the list & DOM
    function addHabitToDOM(habitText) {
        const habitItem = document.createElement("li");
        habitItem.textContent = habitText;

        // Add delete button to each habit
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.onclick = function () {
            habitItem.remove();
            removeHabit(habitText);
        };

        habitItem.appendChild(deleteBtn);
        habitList.appendChild(habitItem);
    }

    // Function to add a habit
    function addHabit() {
        const habitText = habitInput.value.trim();
        if (habitText !== "") {
            addHabitToDOM(habitText);  // Add to UI
            saveHabit(habitText);  // Save to storage
            habitInput.value = ""; // Clear input
        } else {
            alert("Please enter a habit to track.");
        }
    }

    // Event listeners
    if (getStartedButton) {
        getStartedButton.addEventListener("click", function () {
            alert("Welcome to SelfSync! Let's start tracking your habits.");
        });
    }

    if (addHabitButton) {
        addHabitButton.addEventListener("click", addHabit);
    }

    habitInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addHabit();
        }
    });

    // Load stored habits on page load
    loadHabits();
});
