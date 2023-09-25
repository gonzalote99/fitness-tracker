const restInput = document.getElementById('rest');
const intervalInput = document.getElementById('interval');
const setsInput = document.getElementById('sets');
const exerciseNameInput = document.getElementById('exercise-name');
const repsInput = document.getElementById('reps');
const addWorkoutBtn = document.getElementById('add-workout');
const workoutList = document.getElementById('workout-list');
const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const clearWorkoutsBtn = document.getElementById('clear-workouts');
const currentExerciseDisplay = document.getElementById('current-exercise');
const currentSetDisplay = document.getElementById('current-set');
const completionMessage = document.getElementById('completion-message');
const noWorkoutsWarning = document.getElementById('no-workouts-warning');
const workoutStateDisplay = document.getElementById('workout-state');

const workoutState = {workout: 'Workout', rest: 'Rest', allWorkoutsCompleted: 'All workouts completed'};

let workoutListData = [];
let timer = null;


addWorkoutBtn.addEventListener('click', addWorkout);
clearWorkoutsBtn.addEventListener('click', clearWorkouts);
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);


function addWorkout() {
  const exerciseName = exerciseNameInput.value.trim();
  const reps = parseInt(repsInput.value);
  const sets = parseInt(setsInput.value);
  const interval = parseInt(intervalInput.value);
  const rest = parseInt(restInput.value);


  if(exerciseName && reps && sets && interval, rest) {
     const workout = {
       exerciseName,
       reps,
       sets,
       interval,
       rest
     };

     workoutListData.push(workout);
     displayWorkout(workout);
     exerciseNameInput.value = '';
  }
}


function displayWorkout(workout) {
const li = document.createElement('li');
li.textContent = `${workout.exerciseName} (${workout.reps} reps) x ${workout.sets} sets - ${workout.interval}s interval - ${workout.rest}s rest `;
li.dataset.completed = false;
workoutList.appendChild(li);
}




function resetDisplay() {
  clearInterval(timer);
  timerDisplay.textContent = '00:00';
  completionMessage.classList.add('d-none');
  currentSetDisplay.textContent = '';
  currentExerciseDisplay.textContent = '';
  workoutStateDisplay.textContent = '';
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}



function clearWorkouts() {
  workoutList.innerHTML = '';
  workoutListData = [];
  currentWorkoutIndex = 0;
  currentSet = 1;
  resetDisplay();
}


function startTimer() {
  if(workoutListData.length > 0) {
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    completionMessage.classList.add('d-none');
    noWorkoutsWarning.classList.add('d-none');
    startWorkoutTimer();
  } else {
    noWorkoutsWarning.classList.remove('d-none');
  }
}

function pauseTimer() {
  startBtn.disabled = false;
  pauseBtn.disabled = true
  clearInterval(timer)
}


function startWorkoutTimer() {
  let currentWorkoutIndex = 0;
  let currentSet = 1;
  let currentTime = workoutListData[currentWorkoutIndex].interval;
  let isRestPeriod = false;

  const currentExercise = workoutList.children[currentWorkoutIndex];

  currentExerciseDisplay.textContent = `current exercise: ${workoutListData[currentWorkoutIndex].exerciseName}`;
  speak(workoutState.workout)
  workoutStateDisplay.textContent = workoutState.workout;

  timer = setInterval(() => {
    currentTime--;
    if(currentTime < 0) {
      nextStep();

    } else {
      timerDisplay.textContent = formatTime(currentTime);
      currentSetDisplay.textContent = `current set: ${currentSet}`;
      currentExerciseDisplay.textContent = `current exercise: ${workoutListData[currentWorkoutIndex].exerciseName}`;

    }
  }, 1000);

  function nextStep() {
    isRestPeriod = !isRestPeriod;
    if(isRestPeriod) {
      speak(workoutState.rest);
      workoutStateDisplay.textContent = workoutState.rest;

      if(currentSet < workoutListData[currentWorkoutIndex].sets) {
        currentSet++;

      } else {
        currentSet = 1;
        currentExercise.classList.add('completed');
        currentExercise.dataset.completed = true;
        currentWorkoutIndex++;

        if(currentWorkoutIndex >= workoutListData.length) {
          resetDisplay();
          completionMessage.classList.remove('d-none');
          speak(workoutState.allWorkoutsCompleted);
          return;
        }
      }
      currentTime = workoutListData[currentWorkoutIndex].rest;
    } else {
      speak(workoutState.workout);
      workoutStateDisplay.textContent = workoutState.workout;
      currentTime = workoutListData[currentWorkoutIndex].interval;
    }

    timerDisplay.textContent = formatTime(currentTime);
    currentSetDisplay.textContent = `current set: ${currentSet}`;
    currentExerciseDisplay.textContent = `current exercise ${workoutListData[currentWorkoutIndex].exerciseName}`;


  }
}

function formatTime(seconds) {
const minutes = Math.floor(seconds/ 60);
const remainingSeconds = seconds % 60;
return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

}


function speak(text) {
  const synth = window.speechSynthesis;
  const utterance = new  SpeechSynthesisUtterance(text);
  synth.speak(utterance);
}