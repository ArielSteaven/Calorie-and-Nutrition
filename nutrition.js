const API_KEY = 'QNhFThcrK2QUVWZ8PBNzww==lDFsB1XXEsN2bgoc'; // Replace with your CalorieNinjas API key

let chartInstance; // Global variable to store the chart instance

async function getNutritionInfo() {
    const foodName = document.getElementById('foodInput').value;
    const resultDiv = document.getElementById('result');
    const ctx = document.getElementById('nutritionChart').getContext('2d');

    if (!foodName) {
        alert('Please enter a food name.');
        return;
    }

    try {
        const response = await fetch(`https://api.calorieninjas.com/v1/nutrition?query=${foodName}`, {
            headers: { 'X-Api-Key': API_KEY }
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        if (data.items.length === 0) {
            resultDiv.innerHTML = '<p>No data found for the entered food.</p>';
            return;
        }

        const item = data.items[0];

        // Update result
        resultDiv.innerHTML = `
            <h2>Nutrition for ${item.name}</h2>
            <p>Calories: ${item.calories} kcal</p>
            <p>Protein: ${item.protein_g} g</p>
            <p>Fat: ${item.fat_total_g} g</p>
            <p>Carbohydrates: ${item.carbohydrates_total_g} g</p>
            <p>Sugar: ${item.sugar_g} g</p>
            <p>Fiber: ${item.fiber_g} g</p>
            <p>Sodium: ${item.sodium_mg} mg</p>
            <p>Potassium: ${item.potassium_mg} mg</p>
            <p>Cholesterol: ${item.cholesterol_mg} mg</p>
        `;

        // Destroy existing chart if it exists
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create new Chart.js chart
        chartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Calories', 'Protein (g)', 'Fat (g)', 'Carbohydrates (g)', 'Sugar (g)', 'Fiber (g)', 'Sodium (mg)', 'Potassium (mg)', 'Cholesterol (mg)'],
                datasets: [{
                    label: 'Nutritional Values',
                    data: [
                        item.calories,
                        item.protein_g,
                        item.fat_total_g,
                        item.carbohydrates_total_g,
                        item.sugar_g,
                        item.fiber_g,
                        item.sodium_mg,
                        item.potassium_mg,
                        item.cholesterol_mg
                    ],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(102, 255, 255, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(96, 96, 96, 0.5)',
                        'rgba(255, 153, 204, 0.5)',
                        'rgba(100, 149, 237, 0.5)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(102, 255, 255, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(96, 96, 96, 1)',
                        'rgba(255, 153, 204, 1)',
                        'rgba(100, 149, 237, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        resultDiv.innerHTML = '<p>Error fetching data. Please try again.</p>';
        console.error(error);
    }
}