/* ── Stress level toggle ── */
const stressButtons = document.querySelectorAll(".stress-btn");
const stressInput   = document.querySelector("#f-stress");

// Set initial active state
function setStress(btn) {
  stressButtons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  stressInput.value = btn.dataset.value;
}
// Default: Medium
const defaultStress = [...stressButtons].find(b => b.dataset.value === "Medium");
if (defaultStress) setStress(defaultStress);

stressButtons.forEach(btn => {
  btn.addEventListener("click", () => setStress(btn));
});

/* ── Gauge helpers ── */
const GAUGE_ARC_LEN = 251.2; // half-circle perimeter ≈ π × r = π × 80
const gaugeArc    = document.querySelector("#gauge-arc");
const gaugeNeedle = document.querySelector("#gauge-needle");

function setGauge(score) {
  // score: 0–10
  const pct    = Math.min(Math.max(score / 10, 0), 1);
  const offset = GAUGE_ARC_LEN * (1 - pct);
  gaugeArc.style.strokeDashoffset = offset;
  // needle: -90deg (left) → 90deg (right)
  const deg = -90 + pct * 180;
  gaugeNeedle.style.transform = `rotate(${deg}deg)`;
}

function resetGauge() {
  gaugeArc.style.strokeDashoffset = GAUGE_ARC_LEN;
  gaugeNeedle.style.transform = "rotate(-90deg)";
}
resetGauge();

/* ── Score panel states ── */
const scorePlaceholder = document.querySelector("#score-placeholder");
const scoreLoading     = document.querySelector("#score-loading");
const scoreResult      = document.querySelector("#score-result");
const scoreError       = document.querySelector("#score-error");
const scoreNumber      = document.querySelector("#score-number");
const scoreBar         = document.querySelector("#score-bar");
const scoreLabel       = document.querySelector("#score-label");
const errorMsgText     = document.querySelector("#error-msg-text");

function showPanel(name) {
  scorePlaceholder.hidden = name !== "placeholder";
  scoreLoading.hidden     = name !== "loading";
  scoreResult.hidden      = name !== "result";
  scoreError.hidden       = name !== "error";
}
showPanel("placeholder");

function getScoreLabel(score) {
  if (score <= 2.5)  return "Critical — seek support";
  if (score <= 4.5)  return "Below Average";
  if (score <= 6.5)  return "Moderate";
  if (score <= 8.0)  return "Good";
  return "Excellent";
}

function displayScore(score) {
  showPanel("result");
  scoreNumber.textContent = score.toFixed(1);
  scoreBar.style.width    = `${(score / 10) * 100}%`;
  scoreLabel.textContent  = getScoreLabel(score);
  setGauge(score);
}

/* ── Form logic ── */
const form       = document.querySelector("#prediction-form");
const submitBtn  = document.querySelector("#submit-btn");
const predictUrl = `${window.location.origin}/predict`;

function formPayload(fd) {
  return {
    Age:                    Number(fd.get("Age")),
    Gender:                 fd.get("Gender"),
    Academic_Level:         fd.get("Academic_Level"),
    Country:                fd.get("Country").trim(),
    Most_Used_Platform:     fd.get("Most_Used_Platform"),
    Purpose_Of_Use:         fd.get("Purpose_Of_Use"),
    Avg_Daily_Usage_Hours:  Number(fd.get("Avg_Daily_Usage_Hours")),
    Daily_Unlocks:          Number(fd.get("Daily_Unlocks")),
    Study_Hours:            Number(fd.get("Study_Hours")),
    Physical_Activity_Hours:Number(fd.get("Physical_Activity_Hours")),
    Sleep_Hours_Per_Night:  Number(fd.get("Sleep_Hours_Per_Night")),
    Stress_Level:           fd.get("Stress_Level"),
  };
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.reportValidity()) return;

  submitBtn.disabled    = true;
  submitBtn.textContent = "Analysing…";
  resetGauge();
  showPanel("loading");

  try {
    const res  = await fetch(predictUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(formPayload(new FormData(form))),
    });

    const text = await res.text();
    let body   = null;
    if (text) {
      try { body = JSON.parse(text); } catch { /* not JSON */ }
    }

    if (!res.ok) {
      const detail = Array.isArray(body?.detail)
        ? body.detail.map(i => i.msg).join(", ")
        : body?.detail;
      throw new Error(detail || `Server returned ${res.status}`);
    }

    if (typeof body?.predicted_mental_health_score !== "number") {
      throw new Error("Incomplete response from prediction service.");
    }

    displayScore(body.predicted_mental_health_score);
  } catch (err) {
    resetGauge();
    errorMsgText.textContent = err instanceof TypeError
      ? "Cannot reach the prediction service. Make sure the server is running."
      : err.message;
    showPanel("error");
  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Read my signal";
  }
});
