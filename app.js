// Gym Stats Tracker Application
class GymStatsTracker {
    constructor() {
        this.workouts = [];
        this.exercises = [];
        this.currentView = 'dashboard';
        this.exerciseCounter = 0;
        this.chart = null;
        this.db = null;
        
        this.init();
    }

    async init() {
        await this.initDatabase();
        this.setDefaultDate();
        this.setupEventListeners();
        await this.loadData();
        this.updateDashboard();
        this.renderExerciseList();
        this.updatePersonalRecords();
    }

    async initDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GymStatsDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create workouts store
                if (!db.objectStoreNames.contains('workouts')) {
                    const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
                    workoutStore.createIndex('date', 'date', { unique: false });
                }
                
                // Create exercises store
                if (!db.objectStoreNames.contains('exercises')) {
                    const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
                    exerciseStore.createIndex('name', 'name', { unique: false });
                    exerciseStore.createIndex('category', 'category', { unique: false });
                }
            };
        });
    }

    async loadData() {
        try {
            // Load exercises
            const exercises = await this.getAllFromStore('exercises');
            if (exercises.length === 0) {
                this.exercises = this.getDefaultExercises();
                await this.saveExercises();
            } else {
                this.exercises = exercises;
            }
            
            // Load workouts
            this.workouts = await this.getAllFromStore('workouts');
        } catch (error) {
            console.error('Error loading data:', error);
            // Fallback to default exercises if database fails
            this.exercises = this.getDefaultExercises();
            this.workouts = [];
        }
    }

    async getAllFromStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async addToStore(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.add(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async updateInStore(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFromStore(storeName, id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async clearStore(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async saveWorkouts() {
        try {
            await this.clearStore('workouts');
            for (const workout of this.workouts) {
                await this.addToStore('workouts', workout);
            }
        } catch (error) {
            console.error('Error saving workouts:', error);
        }
    }

    async saveExercises() {
        try {
            await this.clearStore('exercises');
            for (const exercise of this.exercises) {
                await this.addToStore('exercises', exercise);
            }
        } catch (error) {
            console.error('Error saving exercises:', error);
        }
    }

    async saveData() {
        await Promise.all([
            this.saveWorkouts(),
            this.saveExercises()
        ]);
    }

    getDefaultExercises() {
        return [
            { id: 1, name: 'Bench Press', category: 'chest' },
            { id: 2, name: 'Squat', category: 'legs' },
            { id: 3, name: 'Deadlift', category: 'back' },
            { id: 4, name: 'Overhead Press', category: 'shoulders' },
            { id: 5, name: 'Bicep Curls', category: 'arms' },
            { id: 6, name: 'Tricep Dips', category: 'arms' },
            { id: 7, name: 'Pull-ups', category: 'back' },
            { id: 8, name: 'Lunges', category: 'legs' },
            { id: 9, name: 'Plank', category: 'core' },
            { id: 10, name: 'Running', category: 'cardio' }
        ];
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('workout-date').value = today;
    }

    setupEventListeners() {
        document.getElementById('workout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveWorkout();
        });

        document.getElementById('add-exercise-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewExercise();
        });
    }

    showView(viewName) {
        // Hide all views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('hidden');
        });

        // Show selected view
        document.getElementById(`${viewName}-view`).classList.remove('hidden');

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('text-purple-600');
            btn.classList.add('text-gray-700');
        });
        event.target.closest('.nav-btn').classList.remove('text-gray-700');
        event.target.closest('.nav-btn').classList.add('text-purple-600');

        this.currentView = viewName;

        // Update view-specific content
        if (viewName === 'dashboard') {
            this.updateDashboard();
        } else if (viewName === 'history') {
            this.renderHistory();
        }
    }

    addExercise() {
        const container = document.getElementById('exercises-container');
        const exerciseId = `exercise-${this.exerciseCounter++}`;
        
        const exerciseDiv = document.createElement('div');
        exerciseDiv.id = exerciseId;
        exerciseDiv.className = 'border border-gray-200 rounded-lg p-4 bg-gray-50';
        exerciseDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                        <select class="exercise-select w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                            <option value="">Select exercise...</option>
                            ${this.exercises.map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                        <input type="number" min="1" value="1" class="sets-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                        <input type="number" min="1" value="1" class="reps-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500" required>
                    </div>
                </div>
                <button type="button" onclick="removeExercise('${exerciseId}')" class="ml-4 text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Weight (kgs)</label>
                    <input type="number" min="0" step="2.5" value="0" class="weight-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                    <input type="number" min="0" value="0" class="duration-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>
            </div>
        `;
        
        container.appendChild(exerciseDiv);
    }

    async saveWorkout() {
        const workout = {
            id: Date.now(),
            date: document.getElementById('workout-date').value,
            type: document.getElementById('workout-type').value,
            notes: document.getElementById('workout-notes').value,
            exercises: [],
            createdAt: new Date().toISOString()
        };

        // Collect exercise data
        const exerciseElements = document.querySelectorAll('#exercises-container > div');
        exerciseElements.forEach(element => {
            const exerciseSelect = element.querySelector('.exercise-select');
            if (exerciseSelect.value) {
                const exercise = {
                    exerciseId: parseInt(exerciseSelect.value),
                    exerciseName: exerciseSelect.options[exerciseSelect.selectedIndex].text,
                    sets: parseInt(element.querySelector('.sets-input').value),
                    reps: parseInt(element.querySelector('.reps-input').value),
                    weight: parseFloat(element.querySelector('.weight-input').value) || 0,
                    duration: parseInt(element.querySelector('.duration-input').value) || 0
                };
                workout.exercises.push(exercise);
            }
        });

        if (workout.exercises.length === 0) {
            alert('Please add at least one exercise to your workout.');
            return;
        }

        this.workouts.push(workout);
        await this.saveData();
        
        // Clear form and show success message
        this.clearForm();
        alert('Workout saved successfully!');
        this.showView('dashboard');
    }

    clearForm() {
        document.getElementById('workout-form').reset();
        document.getElementById('exercises-container').innerHTML = '';
        this.setDefaultDate();
    }

    updateDashboard() {
        // Calculate stats
        const totalWorkouts = this.workouts.length;
        const weekWorkouts = this.getWorkoutsThisWeek();
        const totalVolume = this.calculateTotalVolume();
        const personalRecords = this.getPersonalRecordsCount();

        // Update stat cards
        document.getElementById('total-workouts').textContent = totalWorkouts;
        document.getElementById('week-workouts').textContent = weekWorkouts;
        document.getElementById('total-volume').textContent = totalVolume.toLocaleString();
        document.getElementById('personal-records').textContent = personalRecords;

        // Update recent workouts
        this.renderRecentWorkouts();
    }

    getWorkoutsThisWeek() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        
        return this.workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= weekStart;
        }).length;
    }

    calculateTotalVolume() {
        return this.workouts.reduce((total, workout) => {
            return total + workout.exercises.reduce((workoutTotal, exercise) => {
                return workoutTotal + (exercise.sets * exercise.reps * exercise.weight);
            }, 0);
        }, 0);
    }

    getPersonalRecordsCount() {
        const records = new Map();
        
        this.workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                const key = exercise.exerciseName;
                const currentRecord = records.get(key) || 0;
                const newRecord = exercise.weight * exercise.reps;
                
                if (newRecord > currentRecord) {
                    records.set(key, newRecord);
                }
            });
        });
        
        return records.size;
    }

    renderRecentWorkouts() {
        const container = document.getElementById('recent-workouts');
        const recentWorkouts = this.workouts
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);

        if (recentWorkouts.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No workouts logged yet. Start by logging your first workout!</p>';
            return;
        }

        container.innerHTML = recentWorkouts.map(workout => `
            <div class="workout-card border border-gray-200 rounded-lg p-4 hover:shadow-md">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-900">${this.formatDate(workout.date)}</h4>
                        <p class="text-sm text-gray-600 capitalize">${workout.type} • ${workout.exercises.length} exercises</p>
                        <div class="mt-2 flex flex-wrap gap-2">
                            ${workout.exercises.slice(0, 3).map(ex => 
                                `<span class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">${ex.exerciseName}</span>`
                            ).join('')}
                            ${workout.exercises.length > 3 ? `<span class="text-xs text-gray-500">+${workout.exercises.length - 3} more</span>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-medium text-gray-900">${this.calculateWorkoutVolume(workout)} kgs</p>
                        <p class="text-xs text-gray-500">total volume</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    calculateWorkoutVolume(workout) {
        return workout.exercises.reduce((total, exercise) => {
            return total + (exercise.sets * exercise.reps * exercise.weight);
        }, 0);
    }

    renderHistory() {
        const container = document.getElementById('workout-history');
        const sortedWorkouts = this.workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedWorkouts.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No workouts found.</p>';
            return;
        }

        container.innerHTML = sortedWorkouts.map(workout => `
            <div class="border border-gray-200 rounded-lg p-6">
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h4 class="text-lg font-semibold text-gray-900">${this.formatDate(workout.date)}</h4>
                        <p class="text-sm text-gray-600 capitalize">${workout.type}</p>
                        ${workout.notes ? `<p class="text-sm text-gray-500 mt-2">${workout.notes}</p>` : ''}
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-medium text-gray-900">${this.calculateWorkoutVolume(workout).toLocaleString()} kgs</p>
                        <p class="text-sm text-gray-500">total volume</p>
                    </div>
                </div>
                <div class="space-y-2">
                    ${workout.exercises.map(exercise => `
                        <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div>
                                <span class="font-medium text-gray-900">${exercise.exerciseName}</span>
                                <span class="text-sm text-gray-600 ml-2">${exercise.sets} sets × ${exercise.reps} reps</span>
                                ${exercise.weight > 0 ? `<span class="text-sm text-gray-600 ml-2">@ ${exercise.weight} kgs</span>` : ''}
                                ${exercise.duration > 0 ? `<span class="text-sm text-gray-600 ml-2">${exercise.duration} min</span>` : ''}
                            </div>
                            <span class="text-sm font-medium text-purple-600">
                                ${(exercise.sets * exercise.reps * exercise.weight).toLocaleString()} kgs
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    renderExerciseList() {
        const container = document.getElementById('exercise-list');
        const searchTerm = document.getElementById('exercise-search')?.value.toLowerCase() || '';
        
        const filteredExercises = this.exercises.filter(exercise => 
            exercise.name.toLowerCase().includes(searchTerm)
        );

        container.innerHTML = filteredExercises.map(exercise => `
            <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                    <span class="font-medium text-gray-900">${exercise.name}</span>
                    <span class="text-sm text-gray-500 ml-2 capitalize">${exercise.category}</span>
                </div>
                <button onclick="deleteExercise(${exercise.id})" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    searchExercises() {
        this.renderExerciseList();
    }

    showAddExerciseModal() {
        document.getElementById('add-exercise-modal').classList.remove('hidden');
    }

    hideAddExerciseModal() {
        document.getElementById('add-exercise-modal').classList.add('hidden');
        document.getElementById('add-exercise-form').reset();
    }

    async addNewExercise() {
        const name = document.getElementById('exercise-name').value.trim();
        const category = document.getElementById('exercise-category').value;

        if (!name) return;

        const newExercise = {
            id: Date.now(),
            name: name,
            category: category
        };

        this.exercises.push(newExercise);
        await this.saveData();
        this.renderExerciseList();
        this.hideAddExerciseModal();
    }

    async deleteExercise(exerciseId) {
        if (confirm('Are you sure you want to delete this exercise?')) {
            this.exercises = this.exercises.filter(ex => ex.id !== exerciseId);
            await this.saveData();
            this.renderExerciseList();
        }
    }

    updatePersonalRecords() {
        const container = document.getElementById('personal-records-list');
        const records = this.calculatePersonalRecords();

        if (records.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-4">No personal records yet.</p>';
            return;
        }

        container.innerHTML = records.slice(0, 5).map(record => `
            <div class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div>
                    <span class="font-medium text-gray-900">${record.exercise}</span>
                    <p class="text-xs text-gray-600">${record.date}</p>
                </div>
                <span class="font-bold text-purple-600">${record.weight} kgs</span>
            </div>
        `).join('');
    }

    calculatePersonalRecords() {
        const records = new Map();
        
        this.workouts.forEach(workout => {
            workout.exercises.forEach(exercise => {
                const key = exercise.exerciseName;
                const currentRecord = records.get(key);
                
                if (!currentRecord || exercise.weight > currentRecord.weight) {
                    records.set(key, {
                        exercise: exercise.exerciseName,
                        weight: exercise.weight,
                        reps: exercise.reps,
                        date: this.formatDate(workout.date)
                    });
                }
            });
        });
        
        return Array.from(records.values()).sort((a, b) => b.weight - a.weight);
    }

    filterHistory() {
        const startDate = document.getElementById('history-start-date').value;
        const endDate = document.getElementById('history-end-date').value;
        
        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }
        
        const filteredWorkouts = this.workouts.filter(workout => 
            workout.date >= startDate && workout.date <= endDate
        );
        
        const container = document.getElementById('workout-history');
        if (filteredWorkouts.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No workouts found in the selected date range.</p>';
            return;
        }
        
        // Temporarily replace workouts array for rendering
        const originalWorkouts = this.workouts;
        this.workouts = filteredWorkouts;
        this.renderHistory();
        this.workouts = originalWorkouts;
    }

    exportData() {
        const dataStr = JSON.stringify({
            workouts: this.workouts,
            exercises: this.exercises,
            exportDate: new Date().toISOString()
        }, null, 2);
        
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `gym-stats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    saveData() {
        // Removed - now using async saveData() method
    }
}

// Global functions for event handlers
let app;

function showView(viewName) {
    app.showView(viewName);
}

function addExercise() {
    app.addExercise();
}

function removeExercise(exerciseId) {
    document.getElementById(exerciseId).remove();
}

function clearForm() {
    app.clearForm();
}

function filterHistory() {
    app.filterHistory();
}

function exportData() {
    app.exportData();
}

function searchExercises() {
    app.searchExercises();
}

function showAddExerciseModal() {
    app.showAddExerciseModal();
}

function hideAddExerciseModal() {
    app.hideAddExerciseModal();
}

async function deleteExercise(exerciseId) {
    await app.deleteExercise(exerciseId);
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    app = new GymStatsTracker();
});
