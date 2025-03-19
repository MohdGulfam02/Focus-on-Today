const errorLabel = document.querySelector('.error-label');
const progressLabel = document.querySelector('.progress-label');
const progressBar = document.querySelector('.progress-bar');
const progressValue = document.querySelector('.progress-value');
const addNewGoal = document.querySelector('.add-goal-btn');

const allQuotes = [
    'Raise the bar by completing your goals!',
    'Well begun is half done!',
    'keep going!',
    'Just a step away!',
    'Whoa! You just completed all the goals, time for chill :D',
];

// Load goals from localStorage or initialize 3 default goals
let allGoals = JSON.parse(localStorage.getItem('allGoals')) || {};

function initializeGoals() {
    document.querySelectorAll('.goal-container').forEach(goal => goal.remove());

    if (Object.keys(allGoals).length === 0) {
        for (let i = 1; i <= 3; i++) {
            allGoals[`goal-${i}`] = { name: '', completed: false };
        }
        localStorage.setItem('allGoals', JSON.stringify(allGoals));
    }

    Object.keys(allGoals).forEach(goalId => {
        createGoalElement(goalId, allGoals[goalId]);
    });

    updateProgress();
}

// Create a goal input dynamically
function createGoalElement(goalId, goalData) {
    const newGoalInput = document.createElement('div');
    newGoalInput.classList.add('goal-container');

    newGoalInput.innerHTML = `
        <div class="custom-checkbox">
            <img class="check-icon" src="./images/checkbox-icon.svg" alt="check-icon" />
        </div>
        <input id="${goalId}" class="goal-input" type="text" placeholder="Add new goal... " value="${goalData.name || ''}" />
    `;

    addNewGoal.parentNode.insertBefore(newGoalInput, addNewGoal);

    const newInput = newGoalInput.querySelector('.goal-input');
    const newCheckbox = newGoalInput.querySelector('.custom-checkbox');

    if (goalData.completed) {
        newGoalInput.classList.add('completed');
    }

    // Attach event listeners
    newInput.addEventListener('focus', () => progressBar.classList.remove('show-error'));
    newInput.addEventListener('input', (e) => updateGoalName(e.target));
    newCheckbox.addEventListener('click', () => toggleGoalCompletion(newCheckbox));
}

// Update progress bar
function updateProgress() {
    const totalGoals = Object.keys(allGoals).length;
    let completedGoalsCount = Object.values(allGoals).filter(goal => goal.completed).length;

    progressValue.style.width = `${(completedGoalsCount / totalGoals) * 100}%`;
    progressValue.firstElementChild.innerText = `${completedGoalsCount}/${totalGoals} completed`;
    progressLabel.innerText = allQuotes[Math.min(completedGoalsCount, allQuotes.length - 1)];
}

// Toggle goal completion (only if all 3 goals are filled)
function toggleGoalCompletion(checkbox) {
    const allInputs = document.querySelectorAll('.goal-input');
    const allInputsFilled = [...allInputs].every(input => input.value.trim() !== '');

    if (!allInputsFilled) {
        alert("Please fill in all goals before completing any.");
        return;
    }

    const input = checkbox.nextElementSibling;
    checkbox.parentElement.classList.toggle('completed');
    allGoals[input.id].completed = !allGoals[input.id].completed;

    localStorage.setItem('allGoals', JSON.stringify(allGoals));
    updateProgress();
}

// Update goal name
function updateGoalName(input) {
    if (allGoals[input.id] && allGoals[input.id].completed) {
        input.value = allGoals[input.id].name;
        return;
    }

    allGoals[input.id] = { name: input.value, completed: false };
    localStorage.setItem('allGoals', JSON.stringify(allGoals));
}

// Add new goal dynamically (Limit to 4 goals)
addNewGoal.addEventListener('click', () => {
    const currentGoalCount = Object.keys(allGoals).length;

    if (currentGoalCount >= 4) {
        alert("You can only add up to 4 goals!");
        return;
    }

    const newGoalId = `goal-${currentGoalCount + 1}`;
    allGoals[newGoalId] = { name: '', completed: false };
    localStorage.setItem('allGoals', JSON.stringify(allGoals));

    createGoalElement(newGoalId, allGoals[newGoalId]);

    updateProgress();
});

// Load goals on page load
initializeGoals();