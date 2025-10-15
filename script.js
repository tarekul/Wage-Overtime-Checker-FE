document.getElementById("payForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");
  const statusMessage = document.getElementById("status-message");

  // Show loading state and announce to screen readers
  loadingDiv.style.display = "block";
  resultDiv.style.display = "none";

  // Announce the loading state to screen readers by updating the text content of the live region
  statusMessage.textContent = "Checking your pay, please wait...";

  const data = {
    hoursWorked: parseFloat(document.getElementById("hoursWorked").value),
    hourlyRate: parseFloat(document.getElementById("hourlyRate").value),
    totalPayReceived: parseFloat(
      document.getElementById("totalPayReceived").value
    ),
    state: document.getElementById("state").value,
  };

  try {
    const res = await fetch(
      "https://wage-overtime-checker.onrender.com/check-pay",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    // Hide loading state and show result
    loadingDiv.style.display = "none";
    resultDiv.style.display = "block";

    // Announce the result to screen readers by updating the text content of the live region
    statusMessage.textContent = "Your pay report is ready.";

    if (result.message) {
      document.getElementById("expected").innerText = "";
      document.getElementById("overtime").innerText = "";
      document.getElementById("underpayment").innerText = "";
      document.getElementById(
        "message"
      ).innerHTML = `<span class="violation">${result.message}</span>`;
      return;
    }

    document.getElementById(
      "expected"
    ).innerText = `Expected Pay: $${result.expectedPay.toFixed(2)}`;
    document.getElementById(
      "overtime"
    ).innerText = `Overtime Owed: $${result.overtimeOwed.toFixed(2)}`;
    document.getElementById(
      "underpayment"
    ).innerText = `Potential Underpayment: $${result.underpayment.toFixed(2)}`;

    if (result.underpayment > 0) {
      document.getElementById(
        "message"
      ).innerHTML = `<span class="violation">⚠️ You may be owed $${result.underpayment.toFixed(
        2
      )}. Consider contacting your employer or labor board.</span>`;
    } else {
      document.getElementById(
        "message"
      ).innerHTML = `<span class="ok">✅ No underpayment detected. Your pay appears correct.</span>`;
    }
  } catch (error) {
    // Hide loading and show error
    loadingDiv.style.display = "none";
    resultDiv.style.display = "block";
    statusMessage.textContent = `Error: ${error.message}. Please try again later.`;
    document.getElementById(
      "message"
    ).innerHTML = `<span class="violation">❌ Error: ${
      error.message || error
    }. Please try again later.</span>`;
  } finally {
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 5000);
  }
});
