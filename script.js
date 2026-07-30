const form = document.querySelector("#prediction-form");
const submitButton = document.querySelector("#submit-button");
const loadingState = document.querySelector("#loading-state");
const errorState = document.querySelector("#error-state");
const resultState = document.querySelector("#result-state");
const predictionUrl = "http://127.0.0.1:8000/predict";

document.querySelectorAll("input[type='range']").forEach((input) => {
  const output = document.querySelector(`output[for="${input.id}"]`);
  const updateValue = () => {
    output.textContent = `${input.value}${input.dataset.suffix || ""}`;
    input.style.setProperty("--range-progress", `${((input.value - input.min) / (input.max - input.min)) * 100}%`);
  };
  input.addEventListener("input", updateValue);
  updateValue();
});

function setLoading(isLoading) {
  loadingState.hidden = !isLoading;
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Predicting…" : "Predict my score";
}

function showError(message) {
  errorState.textContent = message;
  errorState.hidden = false;
}

function hideMessages() {
  errorState.hidden = true;
  resultState.hidden = true;
}

function formPayload(formData) {
  return {
    Age: Number(formData.get("Age")),
    Gender: formData.get("Gender"),
    Academic_Level: formData.get("Academic_Level"),
    Country: formData.get("Country").trim(),
    Most_Used_Platform: formData.get("Most_Used_Platform"),
    Purpose_Of_Use: formData.get("Purpose_Of_Use"),
    Avg_Daily_Usage_Hours: Number(formData.get("Avg_Daily_Usage_Hours")),
    Daily_Unlocks: Number(formData.get("Daily_Unlocks")),
    Study_Hours: Number(formData.get("Study_Hours")),
    Physical_Activity_Hours: Number(formData.get("Physical_Activity_Hours")),
    Sleep_Hours_Per_Night: Number(formData.get("Sleep_Hours_Per_Night")),
    Stress_Level: formData.get("Stress_Level"),
  };
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  hideMessages();

  if (!form.reportValidity()) return;

  setLoading(true);
  try {
    const response = await fetch(predictionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formPayload(new FormData(form))),
    });

    // Error responses from a restarting server or reverse proxy may be empty
    // or HTML. Read the body once and parse JSON only when it is actually JSON.
    const responseText = await response.text();
    let body = null;
    if (responseText) {
      try {
        body = JSON.parse(responseText);
      } catch {
        if (response.ok) {
          throw new Error("The prediction service returned an invalid response. Please try again.");
        }
      }
    }

    if (!response.ok) {
      const detail = Array.isArray(body?.detail) ? body.detail.map((item) => item.msg).join(", ") : body?.detail;
      throw new Error(detail || `The prediction service returned ${response.status}. Please try again.`);
    }
    if (!body || typeof body.predicted_mental_health_score !== "number") {
      throw new Error("The prediction service returned an incomplete response. Please try again.");
    }

    const score = body.predicted_mental_health_score.toFixed(2);
    document.querySelector("#prediction-value").textContent = score;
    resultState.hidden = false;
    resultState.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (error) {
    const message = error instanceof TypeError
      ? "Unable to reach the prediction service. Check that FastAPI is running and try again."
      : error.message;
    showError(message);
  } finally {
    setLoading(false);
  }
});
