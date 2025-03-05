document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const getStartedButton = document.querySelector("#getStartedBtn");
    const habitInput = document.querySelector("#habitInput");
    const addHabitButton = document.querySelector("#addHabitBtn");
    const habitList = document.querySelector("#habitList");

    // Show alert when "Get Started" is clicked
    if (getStartedButton) {
        getStartedButton.addEventListener("click", function () {
            alert("Welcome to SelfSync! Let's start tracking your habits.");
        });
    }

    // Function to add a habit to the list
    function addHabit() {
        const habitText = habitInput.value.trim();

        if (habitText !== "") {
            // Create a new list item
            const habitItem = document.createElement("li");
            habitItem.textContent = habitText;
            habitList.appendChild(habitItem);

            // Clear input field after adding
            habitInput.value = "";
        } else {
            alert("Please enter a habit to track.");
        }
    }

    // Add habit when "Track Habit" button is clicked
    if (addHabitButton) {
        addHabitButton.addEventListener("click", addHabit);
    }

    // Allow pressing Enter to add a habit
    habitInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addHabit();
        }
    });
});
