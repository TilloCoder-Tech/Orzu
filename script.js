const plannerForm = document.querySelector(".planner-form");
const planResult = document.querySelector("#plan-result");

const examInput = document.querySelector("#exam");
const satCurrentGroup = document.querySelector(".sat-current-group");
const satTargetGroup = document.querySelector(".sat-target-group");
const ieltsCurrentGroup = document.querySelector(".ielts-current-group");
const ieltsTargetGroup = document.querySelector(".ielts-target-group");

const satCurrentInput = document.querySelector("#sat-current");
const satTargetInput = document.querySelector("#sat-target");
const ieltsCurrentInput = document.querySelector("#ielts-current");
const ieltsTargetInput = document.querySelector("#ielts-target");

const streakValue = document.getElementById("streak");

const tasksCompletedStat =
document.getElementById("tasks-completed-stat");

const completionRateStat =
document.getElementById("completion-rate-stat");

const currentStreakStat =
document.getElementById("current-streak-stat");

const bestStreakStat =
document.getElementById("best-streak-stat");

const goalDisplay =
document.getElementById("goal-display");

const streakCard = document.getElementById("streak-card");


const daysLeftDisplay =
document.getElementById("days-left-display");

function updateTargetFields() {
  const exam = examInput.value;

  satCurrentGroup.style.display = "none";
  satTargetGroup.style.display = "none";
  ieltsCurrentGroup.style.display = "none";
  ieltsTargetGroup.style.display = "none";

  satCurrentInput.value = "";
  satTargetInput.value = "";
  ieltsCurrentInput.value = "";
  ieltsTargetInput.value = "";

  if (exam === "sat") {
    satCurrentGroup.style.display = "block";
    satTargetGroup.style.display = "block";
  } else if (exam === "ielts") {
    ieltsCurrentGroup.style.display = "block";
    ieltsTargetGroup.style.display = "block";
  } else if (exam === "both") {
    satCurrentGroup.style.display = "block";
    satTargetGroup.style.display = "block";
    ieltsCurrentGroup.style.display = "block";
    ieltsTargetGroup.style.display = "block";
  }
}

function getStudyLevel(hours) {
  if (hours <= 2) {
    return "Light Plan";
  } else if (hours <= 4) {
    return "Balanced Plan";
  } else {
    return "Intensive Plan";
  }
}

function getDaysLeft(examDate) {
  const today = new Date();
  const examDay = new Date(examDate);

  today.setHours(0, 0, 0, 0);
  examDay.setHours(0, 0, 0, 0);

  const difference = examDay - today;
  const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return daysLeft;
}

function getUrgencyStatus(daysLeft) {
  if (daysLeft >= 90) {
    return "Comfortable timeline";
  } else if (daysLeft >= 30) {
    return "Focused preparation";
  } else {
    return "Intensive preparation needed";
  }
}

function getSatGapStatus(gap) {
  if (gap <= 0) {
    return "Target already reached or exceeded";
  } else if (gap <= 100) {
    return "Small improvement needed";
  } else if (gap <= 250) {
    return "Moderate improvement needed";
  } else {
    return "High improvement needed";
  }
}

function getIeltsGapStatus(gap) {
  if (gap <= 0) {
    return "Target already reached or exceeded";
  } else if (gap <= 0.5) {
    return "Small improvement needed";
  } else if (gap <= 1.5) {
    return "Moderate improvement needed";
  } else {
    return "High improvement needed";
  }
}

function savePlannerForm() {
  const formData = {
    exam: examInput.value,
    satCurrent: satCurrentInput.value,
    satTarget: satTargetInput.value,
    ieltsCurrent: ieltsCurrentInput.value,
    ieltsTarget: ieltsTargetInput.value,
    hours: document.querySelector("#hours").value,
    date: document.querySelector("#date").value
  };

  localStorage.setItem("plannerFormData", JSON.stringify(formData));
}

function loadPlannerForm() {
  const savedFormData = JSON.parse(localStorage.getItem("plannerFormData"));

  if (!savedFormData) {
    return;
  }

  examInput.value = savedFormData.exam || "";

  updateTargetFields();
  

  satCurrentInput.value = savedFormData.satCurrent || "";
  satTargetInput.value = savedFormData.satTarget || "";
  ieltsCurrentInput.value = savedFormData.ieltsCurrent || "";
  ieltsTargetInput.value = savedFormData.ieltsTarget || "";

  document.querySelector("#hours").value = savedFormData.hours || "";
  document.querySelector("#date").value = savedFormData.date || "";
}

function getTasks(exam, hours) {
  if (exam === "sat") {
    if (hours <= 2) {
      return [
        "Practice SAT Math for 30 minutes.",
        "Practice Reading and Writing for 30 minutes.",
        "Review 5–10 mistakes from previous practice."
      ];
    } else if (hours <= 4) {
      return [
        "Practice SAT Math for 60 minutes.",
        "Practice Reading and Writing for 60 minutes.",
        "Review grammar rules and vocabulary.",
        "Analyze mistakes and update your mistake log."
      ];
    } else {
      return [
        "Complete one full SAT Math module.",
        "Complete one full Reading and Writing module.",
        "Review all mistakes deeply.",
        "Practice weak topics separately.",
        "Take one timed section or mini-test."
      ];
    }
  }

  if (exam === "ielts") {
    if (hours <= 2) {
      return [
        "Practice IELTS Listening for 30 minutes.",
        "Read one short passage and collect new vocabulary.",
        "Practice Speaking Part 2 with a timer."
      ];
    } else if (hours <= 4) {
      return [
        "Practice one IELTS Listening section.",
        "Read one IELTS passage and review mistakes.",
        "Write one Task 1 or Task 2 response.",
        "Practice Speaking Part 2 or Part 3."
      ];
    } else {
      return [
        "Complete one full IELTS Listening test.",
        "Complete one full IELTS Reading passage or test.",
        "Write one Task 1 and one Task 2 response.",
        "Practice Speaking Parts 1, 2, and 3.",
        "Review mistakes and improve weak skills."
      ];
    }
  }

  if (exam === "both") {
    if (hours <= 2) {
      return [
        "Spend 1 hour on SAT practice.",
        "Spend 1 hour on one IELTS skill.",
        "Review the most important mistakes only."
      ];
    } else if (hours <= 4) {
      return [
        "Spend 2 hours on SAT Math or Reading/Writing.",
        "Spend 1–2 hours on IELTS Listening, Reading, Writing, or Speaking.",
        "Review mistakes from both exams.",
        "Choose tomorrow’s weak topic before finishing."
      ];
    } else {
      return [
        "Complete one SAT timed practice section.",
        "Study SAT weak topics separately.",
        "Complete one IELTS skill practice session.",
        "Write or speak using a timer.",
        "Review mistakes from both exams and update your progress."
      ];
    }
  }
}

function createTaskChecklist(tasks) {
  return tasks
    .map((task, index) => {
      return `
        <li class="checklist-task">
          <label>
            <input type="checkbox" class="task-check" data-index="${index}" />
            <span>${task}</span>
          </label>
        </li>
      `;
    })
    .join("");
}

function getWeeklyPlan(exam) {
  if (exam === "sat") {
    return `
      <li><strong>Monday:</strong> SAT Math weak topic practice</li>
      <li><strong>Tuesday:</strong> Reading and Writing grammar practice</li>
      <li><strong>Wednesday:</strong> Timed SAT Math questions</li>
      <li><strong>Thursday:</strong> Reading and Writing passage practice</li>
      <li><strong>Friday:</strong> Mistake review and vocabulary</li>
      <li><strong>Saturday:</strong> Full SAT section or mini-test</li>
      <li><strong>Sunday:</strong> Review, rest, and plan next week</li>
    `;
  }

  if (exam === "ielts") {
    return `
      <li><strong>Monday:</strong> Listening practice</li>
      <li><strong>Tuesday:</strong> Reading passage practice</li>
      <li><strong>Wednesday:</strong> Writing Task 1 practice</li>
      <li><strong>Thursday:</strong> Writing Task 2 practice</li>
      <li><strong>Friday:</strong> Speaking Part 2 and Part 3 practice</li>
      <li><strong>Saturday:</strong> Full IELTS practice test or skill test</li>
      <li><strong>Sunday:</strong> Review mistakes and improve weak skills</li>
    `;
  }

  if (exam === "both") {
    return `
      <li><strong>Monday:</strong> SAT Math + IELTS Listening</li>
      <li><strong>Tuesday:</strong> SAT Reading/Writing + IELTS Reading</li>
      <li><strong>Wednesday:</strong> SAT Math practice + IELTS Writing Task 1</li>
      <li><strong>Thursday:</strong> SAT grammar + IELTS Writing Task 2</li>
      <li><strong>Friday:</strong> SAT mistake review + IELTS Speaking</li>
      <li><strong>Saturday:</strong> SAT or IELTS timed practice test</li>
      <li><strong>Sunday:</strong> Review, rest, and plan the next week</li>
    `;
  }
}

updateTargetFields();

function loadDashboardCards(){
  const savedGoal = localStorage.getItem("goal")
  const savedExamDate = localStorage.getItem("examDate")

  if(savedGoal){
    goalDisplay.textContent = savedGoal
  }

  if(savedExamDate){
    const examDate = new Date(savedExamDate);
    const today = new Date();

    const difference = examDate - today;

    const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24));

    if(daysLeft > 1){
      daysLeftDisplay.textContent = `${daysLeft} day(s) left`
    } else if(daysLeft === 1){
      daysLeftDisplay.textContent = `1 day left`
    } else if(daysLeft === 0){
      daysLeftDisplay.textContent = `Exam is today!`
    }
  }
}

examInput.addEventListener("change", updateTargetFields);

plannerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const exam = examInput.value;
  const satCurrent = Number(satCurrentInput.value);
const satTarget = Number(satTargetInput.value);
const ieltsCurrent = Number(ieltsCurrentInput.value);
const ieltsTarget = Number(ieltsTargetInput.value);
  const hours = Number(document.querySelector("#hours").value);
  const date = document.querySelector("#date").value;

  const daysLeft = getDaysLeft(date);

if (daysLeft < 0) {
  planResult.innerHTML = `
    <div class="error-message">
      Exam date cannot be in the past.
    </div>
  `;
  return;
}

  if (exam === "" || hours === 0 || date === "") {
    planResult.innerHTML = `
      <div class="error-message">
        Please fill in all required fields before generating your plan.
      </div>
    `;
    return;
  }

  if (hours < 1 || hours > 12) {
    planResult.innerHTML = `
      <div class="error-message">
        Study hours must be between 1 and 12 hours per day.
      </div>
    `;
    return;
  }

  if (exam === "sat") {
    if (
      satCurrent < 400 ||
      satCurrent > 1600 ||
      satTarget < 400 ||
      satTarget > 1600
    ) {
      planResult.innerHTML = `
        <div class="error-message">
          Current and target SAT scores must be between 400 and 1600.
        </div>
      `;
      return;
    }
  }
  
  if (exam === "ielts") {
    if (
      ieltsCurrent < 1 ||
      ieltsCurrent > 9 ||
      ieltsTarget < 1 ||
      ieltsTarget > 9
    ) {
      planResult.innerHTML = `
        <div class="error-message">
          Current and target IELTS bands must be between 1 and 9.
        </div>
      `;
      return;
    }
  }
  
  if (exam === "both") {
    if (
      satCurrent < 400 ||
      satCurrent > 1600 ||
      satTarget < 400 ||
      satTarget > 1600 ||
      ieltsCurrent < 1 ||
      ieltsCurrent > 9 ||
      ieltsTarget < 1 ||
      ieltsTarget > 9
    ) {
      planResult.innerHTML = `
        <div class="error-message">
          For SAT + IELTS, enter valid current and target scores for both exams.
        </div>
      `;
      return;
    }
  }

  let examName = "";
let targetText = "";
let currentText = "";
let gapText = "";
let gapStatus = "";

if (exam === "sat") {
  const satGap = satTarget - satCurrent;

  examName = "SAT";
  currentText = satCurrent;
  targetText = satTarget;
  gapText = `${satGap} point(s)`;
  gapStatus = getSatGapStatus(satGap);
} else if (exam === "ielts") {
  const ieltsGap = ieltsTarget - ieltsCurrent;

  examName = "IELTS";
  currentText = ieltsCurrent;
  targetText = ieltsTarget;
  gapText = `${ieltsGap.toFixed(1)} band(s)`;
  gapStatus = getIeltsGapStatus(ieltsGap);
} else if (exam === "both") {
  const satGap = satTarget - satCurrent;
  const ieltsGap = ieltsTarget - ieltsCurrent;

  examName = "SAT + IELTS";
  currentText = `SAT ${satCurrent} and IELTS ${ieltsCurrent}`;
  targetText = `SAT ${satTarget} and IELTS ${ieltsTarget}`;
  gapText = `SAT ${satGap} point(s), IELTS ${ieltsGap.toFixed(1)} band(s)`;
  gapStatus = `SAT: ${getSatGapStatus(satGap)} | IELTS: ${getIeltsGapStatus(ieltsGap)}`;
}

  const studyLevel = getStudyLevel(hours);
  const totalStudyTime = daysLeft * hours;
  const urgencyStatus = getUrgencyStatus(daysLeft);
  const tasks = getTasks(exam, hours);
  const taskChecklist = createTaskChecklist(tasks);
  const weeklyPlan = getWeeklyPlan(exam);

  const generatedPlan = `
  <div class="plan-card">
    <div class="plan-header">
      <h3>Your Study Plan</h3>
      <button class="clear-plan-btn">Clear Plan</button>
    </div>

    <div class="info-section">
      <h4>Overview</h4>

      <div class="info-grid">
        <div class="info-box">
          <strong>Exam</strong>
          <span>${examName}</span>
        </div>

        <div class="info-box">
          <strong>Current Level</strong>
          <span>${currentText}</span>
        </div>

        <div class="info-box">
          <strong>Target Score</strong>
          <span>${targetText}</span>
        </div>

        <div class="info-box">
          <strong>Improvement Gap</strong>
          <span>${gapText}</span>
        </div>

        <div class="info-box">
          <strong>Days Left</strong>
          <span>${daysLeft} day(s)</span>
        </div>

        <div class="info-box">
          <strong>Preparation Status</strong>
          <span>${urgencyStatus}</span>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>Plan Details</h4>

      <div class="info-grid">
        <div class="info-box">
          <strong>Study Time</strong>
          <span>${hours} hour(s)/day</span>
        </div>

        <div class="info-box">
          <strong>Plan Type</strong>
          <span>${studyLevel}</span>
        </div>

        <div class="info-box">
          <strong>Exam Date</strong>
          <span>${date}</span>
        </div>

        <div class="info-box">
          <strong>Total Study Time</strong>
          <span>${totalStudyTime} hour(s)</span>
        </div>

        <div class="info-box wide-box">
          <strong>Gap Status</strong>
          <span>${gapStatus}</span>
        </div>
      </div>
    </div>

    <div class="info-section">
      <h4>Today's Tasks</h4>

      <p class="progress-text">
        Progress: <span id="completed-count">0</span>/<span id="total-count">${tasks.length}</span> completed —
        <span id="progress-percent">0%</span>
      </p>

      <div class="progress-bar">
        <div id="progress-fill"></div>
      </div>

      <p id="completion-message" class="completion-message"></p>

      <ul class="task-checklist">
        ${taskChecklist}
      </ul>
    </div>

    <div class="info-section">
      <h4>Weekly Study Structure</h4>

      <ul class="weekly-list">
        ${weeklyPlan}
      </ul>
    </div>
  </div>
`;

localStorage.setItem("goal", targetText)
localStorage.setItem("examDate", date)

goalDisplay.textContent = targetText
daysLeftDisplay.textContent = `${daysLeft} day(s) left`
planResult.innerHTML = generatedPlan;
localStorage.setItem("savedPlan", generatedPlan);
savePlannerForm();
// Reset checklist progress for the new plan
localStorage.setItem("taskProgress", JSON.stringify([]));
updateProgress();
});

const themeToggle = document.querySelector("#theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeToggle.textContent = "🌙";
} else {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", function () {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
    themeToggle.textContent = "🌙";
  } else {
    localStorage.setItem("theme", "dark");
    themeToggle.textContent = "☀️";
  }
});
loadPlannerForm();
const savedPlan = localStorage.getItem("savedPlan");

checkStreakReset();

loadDashboardCards()

if (savedPlan) {
  planResult.innerHTML = savedPlan;
  loadTaskProgress();
}



function renderWeeklyChart() {
  const weeklyChart =
  document.getElementById("weekly-chart");
  if(!weeklyChart) return;


  const chartData =
    getLast7DaysProgress();


    
  weeklyChart.innerHTML = chartData.map((item) => {
    const dayLabel =
    new Date(item.date)
      .toLocaleDateString("en-US", {
        weekday: "short"
      });

      return `
        <div class="chart-bar">
          <div class="bar-value">${item.tasks > 0 ? item.tasks : ""}</div>
          <div
            class="bar-fill"
            style="height: ${Math.max(item.tasks * 40, 10)}px"
          ></div>

          <span>${dayLabel}</span>

        </div>
      `;
    }).join("");
}

renderWeeklyChart();

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("clear-plan-btn")) {
    localStorage.removeItem("savedPlan");
    localStorage.removeItem("taskProgress");
    localStorage.removeItem(
  "weeklyProgress"
);
localStorage.removeItem("goal")
localStorage.removeItem("examDate")
renderWeeklyChart();
    localStorage.removeItem("plannerFormData");

    localStorage.removeItem("streak");
localStorage.removeItem("bestStreak");
localStorage.removeItem("lastCompletedDate");

    plannerForm.reset();
    updateTargetFields();


    streakValue.textContent = "Start your streak today";


    planResult.innerHTML = `
      <div class="empty-plan">
        <h3>Your Study Plan</h3>
        <p>Your personalized plan will appear here after you fill out the form.</p>
      </div>
    `;
  }
});

document.addEventListener("change", function (event) {
  if (event.target.classList.contains("task-check")) {
    saveTaskProgress();
    updateProgress();
  }
});

function saveTaskProgress() {
  const checkboxes = document.querySelectorAll(".task-check");
  const progress = [];

  checkboxes.forEach((checkbox) => {
    progress.push(checkbox.checked);
    
  });

  localStorage.setItem("taskProgress", JSON.stringify(progress));
}

function loadTaskProgress() {
  const savedProgress = JSON.parse(localStorage.getItem("taskProgress")) || [];
  const checkboxes = document.querySelectorAll(".task-check");

  checkboxes.forEach((checkbox, index) => {
    checkbox.checked = savedProgress[index] || false;
  });

  updateProgress();
}

  





function updateProgress() {
  const checkboxes = document.querySelectorAll(".task-check");
  const completedCount = document.querySelector("#completed-count");
  const totalCount = document.querySelector("#total-count");
  const progressPercent = document.querySelector("#progress-percent");
  const progressFill = document.querySelector("#progress-fill");
  const completionMessage = document.querySelector("#completion-message");

  if (!completedCount || !totalCount || !progressPercent || !progressFill || !completionMessage) {
    return;
  }

  let completed = 0;
  

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      completed++;
    }
  });

  const total = checkboxes.length;

 

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);


const today = new Date().toDateString();

const lastCompletedDate = localStorage.getItem("lastCompletedDate");
let currentStreak = Number(localStorage.getItem("streak") || 0);

let bestStreak = Number(localStorage.getItem("bestStreak") || 0);

progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;

if(percent === 100){
  if(lastCompletedDate !== today){
    currentStreak++;

    localStorage.setItem("streak", currentStreak);

    localStorage.setItem("lastCompletedDate", today);

    if(currentStreak > bestStreak){
      localStorage.setItem("bestStreak", currentStreak);
  }
}

}

completedCount.textContent = completed;
const lastPopupDate = localStorage.getItem("lastPopupDate");
  totalCount.textContent = total;


  if (percent === 100) {
    completionMessage.textContent =
      "Great job! You completed today’s study plan.";
      const celebrationPopup = document.getElementById("celebration-popup");
    if (lastPopupDate !== today) {
      celebrationPopup.classList.add("active");
      localStorage.setItem("lastPopupDate", today);
    }
  } else {
    completionMessage.textContent = "";
  }

  const updatedStreak =
Number(localStorage.getItem("streak") || 0);

const updatedBest =
Number(localStorage.getItem("bestStreak") || 0);

streakValue.textContent =
updatedStreak > 0
? `🔥 ${updatedStreak} day(s) | 🏆 Best: ${updatedBest}`
: "Start your streak today";


tasksCompletedStat.textContent =
completed;

completionRateStat.textContent =
`${percent}%`;

currentStreakStat.textContent =
updatedStreak;

streakCard.textContent = updatedStreak > 0 ? `🔥 ${updatedStreak} day(s)` : "Start your streak today";

bestStreakStat.textContent =
updatedBest;

saveDailyProgress(completed);
renderWeeklyChart();
}
  

const closeBtn = document.getElementById("close-popup");
closeBtn.addEventListener("click", function () {
  const celebrationPopup = document.getElementById("celebration-popup");
  celebrationPopup.classList.remove("active");
});
 
function checkStreakReset() {
  const savedDate = localStorage.getItem("lastCompletedDate");

  if (!savedDate) {
    return;
  }

  const today = new Date();
  const lastCompletedDate = new Date(savedDate);

  today.setHours(0, 0, 0, 0);
  lastCompletedDate.setHours(0, 0, 0, 0);

  const difference = today - lastCompletedDate;

  const daysDifference = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysDifference > 1) {
    localStorage.setItem("streak", 0);
    streakValue.textContent = "Start your streak today";
  }
}



function saveDailyProgress(completed) {
  const today =
    new Date().toISOString().split("T")[0];

  const weeklyProgress =
    JSON.parse(
      localStorage.getItem("weeklyProgress")
    ) || {};

  weeklyProgress[today] = completed;

  localStorage.setItem(
    "weeklyProgress",
    JSON.stringify(weeklyProgress)
  );
}
//`Current Streak: ${localStorage.getItem("streak") || 0} day(s)`;
function getLast7DaysProgress() {

  const weeklyProgress =
    JSON.parse(
      localStorage.getItem("weeklyProgress")
    ) || {};

  const chartData = [];

  for (let i = 0; i < 7; i++) {

    const date = new Date();

    date.setDate(
      date.getDate() - i
    );

    const dateKey =
      date.toISOString().split("T")[0];

    const tasks =
      weeklyProgress[dateKey] || 0;

    chartData.push({
      date: dateKey,
      tasks: tasks
    });

  }

  return chartData.reverse();

}

