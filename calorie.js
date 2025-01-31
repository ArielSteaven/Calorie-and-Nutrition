const workoutForm = document.getElementById('workout-form');
const workoutsList = document.getElementById('workouts');
const totalCaloriesDisplay = document.getElementById('total-calories');
let workouts = [];
let totalCalories = 0;

const profileForm = document.getElementById('profile-form');
const fitnessForm = document.getElementById('fitness-form');

const profilePicInput = document.getElementById('profile-picture');
const profilePicDisplay = document.getElementById('profile-pic');
const profileNameDisplay = document.getElementById('profile-name');
const profileAgeDisplay = document.getElementById('profile-age');
const profileWeightDisplay = document.getElementById('profile-weight');

// Initialize Chart.js for workout calories
const ctxCalories = document.getElementById('caloriesChart').getContext('2d');
let caloriesChart = new Chart(ctxCalories, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Calories Burned',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fitness Stats Line Chart (Steps & Calories)
const ctxLine = document.getElementById('fitness-line-chart').getContext('2d');
let fitnessLineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Calories Burned',
            data: [],
            borderColor: '#ff9800',
            borderWidth: 2,
            fill: false
        }, {
            label: 'Steps Taken',
            data: [],
            borderColor: '#4caf50',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Fitness Stats Pie Chart
const ctxPie = document.getElementById('fitness-pie-chart').getContext('2d');
let fitnessPieChart = new Chart(ctxPie, {
    type: 'pie',
    data: {
        labels: ['Active Time', 'Sleep Time'],
        datasets: [{
            label: 'Fitness Time Distribution',
            data: [50, 50], // Placeholder data
            backgroundColor: ['#ff9800', '#4caf50'],
            borderWidth: 1
        }]
    }
});

// Handle Workout Form Submission
workoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const workoutName = document.getElementById('workout-name').value;
    const caloriesBurned = parseInt(document.getElementById('calories-burned').value);

    workouts.push({ name: workoutName, calories: caloriesBurned });
    totalCalories += caloriesBurned;

    // Update Total Calories Display
    totalCaloriesDisplay.textContent = totalCalories;

    // Update Workout List
    const li = document.createElement('li');
    li.textContent = `${workoutName}: ${caloriesBurned} Calories`; // Fixed template string issue
    workoutsList.appendChild(li);

    // Update Calories Chart
    caloriesChart.data.labels.push(workoutName);
    caloriesChart.data.datasets[0].data.push(caloriesBurned);
    caloriesChart.update();

    workoutForm.reset();
});

// Handle Profile Form Submission
profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const weight = document.getElementById('weight').value;

    // Display Profile Info
    profileNameDisplay.textContent = `Name: ${name}`; // Fixed template string issue
    profileAgeDisplay.textContent = `Age: ${age}`;   // Fixed template string issue
    profileWeightDisplay.textContent = `Weight: ${weight} kg`; // Fixed template string issue

    // Display Profile Picture
    if (profilePicInput.files && profilePicInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            profilePicDisplay.src = e.target.result;
            profilePicDisplay.style.display = 'block';
        };
        reader.readAsDataURL(profilePicInput.files[0]);
    }

    profileForm.reset();
});

// Handle Fitness Stats Form Submission
fitnessForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const steps = parseInt(document.getElementById('steps').value);
    const activeTime = parseInt(document.getElementById('active-time').value);
    const caloriesBurnedStats = parseInt(document.getElementById('calories-burned-stats').value);

    // Update Line Chart
    fitnessLineChart.data.labels.push('Today');
    fitnessLineChart.data.datasets[0].data.push(caloriesBurnedStats);
    fitnessLineChart.data.datasets[1].data.push(steps);
    fitnessLineChart.update();

    // Update Pie Chart (Active vs Sleep Time)
    fitnessPieChart.data.datasets[0].data = [activeTime, 24 - activeTime];
    fitnessPieChart.update();

    fitnessForm.reset();
});


const apiKey = "7bUx4WT0Sf7rrdKs7pdU7A==LVmRfiKs6Mc51ejv";
const apiUrl = "https://api.api-ninjas.com/v1/caloriesburned";

document.getElementById("calculate-btn").addEventListener("click", async () => {
  const activity = document.getElementById("activity").value.trim();
  const duration = document.getElementById("duration").value.trim();

  if (!activity || !duration) {
    alert("Please enter both activity and duration.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}?activity=${activity}&duration=${duration}`, {
      headers: {
        "X-Api-Key": apiKey
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data. Please try again.");
    }

    const data = await response.json();

    if (data.length === 0) {
      document.getElementById("result").textContent = "No data found for the entered activity.";
    } else {
      const { name, total_calories } = data[0];
      document.getElementById("result").textContent = 
        `You burned approximately ${total_calories} calories doing ${name} for ${duration} minutes.`;
    }
  } catch (error) {
    document.getElementById("result").textContent = `Error: ${error.message}`;
  }
});
