document.getElementById("payForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    hoursWorked: parseFloat(document.getElementById("hoursWorked").value),
    hourlyRate: parseFloat(document.getElementById("hourlyRate").value),
    totalPayReceived: parseFloat(
      document.getElementById("totalPayReceived").value
    ),
  };

  const res = await fetch(
    "https://wage-overtime-checker.onrender.com/check-pay",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  const result = await res.json();
  document.getElementById("result").style.display = "block";

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
});
