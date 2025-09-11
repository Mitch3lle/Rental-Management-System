document.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Helpers
  // -----------------------
  const $ = id => document.getElementById(id);
  const formatKsh = n => `KSh ${Number(n || 0).toLocaleString()}`;

  // -----------------------
  // Data (tenants + payments)
  // -----------------------
  const tenants = [
    {
      name: "Alice",
      house: "A1",
      rent: 10000,
      lastPayment: "2025-04-01",
      paid: true,
      payments: [{ amount: 10000, date: "2025-04-01", method: "M-Pesa" }]
    },
    {
      name: "Brian",
      house: "B2",
      rent: 9500,
      lastPayment: "2025-03-15",
      paid: false,
      payments: [{ amount: 9500, date: "2025-03-15", method: "Bank" }]
    }
  ];

  // global payments list (for reports & payment table)
  let payments = tenants.flatMap(t =>
    t.payments.map(p => ({ tenant: t.name, ...p }))
  );

  // -----------------------
  // Group payments by month
  // -----------------------
  function groupPaymentsByMonth(paymentList) {
    const map = {};
    paymentList.forEach(p => {
      try {
        const date = new Date(p.date);
        const month = date.toLocaleString("default", { month: "short", year: "numeric" });
        map[month] = (map[month] || 0) + Number(p.amount || 0);
      } catch (e) {}
    });
    const entries = Object.keys(map)
      .map(k => ({ k, d: new Date(k) }))
      .sort((a, b) => a.d - b.d)
      .map(x => [x.k, map[x.k]]);
    return Object.fromEntries(entries);
  }

  // -----------------------
  // Add a payment
  // -----------------------
  function addPayment(tenantName, amount, date = null, method = "Manual") {
    const d = date || new Date().toISOString().slice(0, 10);
    const tenant = tenants.find(t => t.name === tenantName);
    if (tenant) {
      tenant.paid = true;
      tenant.lastPayment = d;
      tenant.payments.push({ amount: Number(amount), date: d, method });
    }
    payments.push({ tenant: tenantName, amount: Number(amount), date: d, method });
    populatePaymentsTable();
    updateReports();
    updateDashboard();
  }

  // -----------------------
  // LOGIN / OTP / UI flows
  // -----------------------
  const loginForm = $("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = $("username") ? $("username").value.trim() : "";
      const password = $("password") ? $("password").value.trim() : "";

      const loader = $("login-loading");
      if (loader) loader.style.display = "block";

      const errEl = $("login-error");
      if (errEl) errEl.style.display = "none";

      setTimeout(() => {
        if (loader) loader.style.display = "none";
        if (username === "Admin" && password === "admin123") {
          showOtpStep();
        } else {
          showError("Invalid username or password.");
        }
      }, 800);
    });
  }

  function showError(message) {
    const errorEl = $("login-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = "block";
    } else {
      alert(message);
    }
  }

  function showOtpStep() {
    if ($("login-form")) $("login-form").style.display = "none";
    if ($("otp-section")) $("otp-section").style.display = "block";
  }

  const otpSubmitBtn = $("otp-submit-btn");
  if (otpSubmitBtn) {
    otpSubmitBtn.addEventListener("click", () => {
      const otp = $("otp-code") ? $("otp-code").value.trim() : "";
      if (otp === "123456") {
        if ($("otp-error")) $("otp-error").style.display = "none";
        if ($("otp-section")) $("otp-section").style.display = "none";
        if ($("login-section")) $("login-section").style.display = "none";
        if ($("dashboard-section")) $("dashboard-section").style.display = "block";
        showSection("dashboard-content");
        updateDashboard();
        renderDashboardCharts();
      } else {
        const otpError = $("otp-error");
        if (otpError) {
          otpError.textContent = "Invalid OTP code.";
          otpError.style.display = "block";
        }
      }
    });
  }

  // -----------------------
  // Toggle password icons
  // -----------------------
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", function () {
      const wrapper = this.closest(".password-wrapper");
      if (!wrapper) return;
      const input = wrapper.querySelector("input[type='password'], input[type='text']");
      if (!input) return;
      if (input.type === "password") {
        input.type = "text";
        this.classList.replace("fa-eye", "fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.replace("fa-eye-slash", "fa-eye");
      }
    });
  });

  // -----------------------
  // Dummy Google login
  // -----------------------
  const googleLoginBtn = $("google-login-btn");
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", function () {
      const proceed = confirm("Simulated Google Login\n\nClick OK to login with a dummy Google account.");
      if (proceed) {
        const fakeUser = {
          name: "Jennifer Wakwaya",
          email: "jeniferwakwaya@gmail.com",
          picture: "https://via.placeholder.com/100"
        };
        if ($("user-info")) $("user-info").style.display = "block";
        if ($("user-name")) $("user-name").textContent = fakeUser.name;
        if ($("user-email")) $("user-email").textContent = fakeUser.email;
        if ($("user-pic")) $("user-pic").src = fakeUser.picture;
        this.style.display = "none";
      }
    });
  }

  // -----------------------
  // Forgot password
  // -----------------------
  const forgotLink = $("forgot-password-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", function (e) {
      e.preventDefault();
      if ($("login-section")) $("login-section").style.display = "none";
      if ($("forgot-password-section")) $("forgot-password-section").style.display = "block";
    });
  }

  const backToLogin = $("back-to-login");
  if (backToLogin) {
    backToLogin.addEventListener("click", function (e) {
      e.preventDefault();
      if ($("forgot-password-section")) $("forgot-password-section").style.display = "none";
      if ($("login-section")) $("login-section").style.display = "block";
    });
  }

  const resetBtn = $("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      const emailEl = $("reset-email");
      const email = emailEl ? emailEl.value.trim() : "";
      if (!email) {
        alert("Please enter your email address.");
        return;
      }
      const msgEl = $("reset-message");
      if (msgEl) msgEl.textContent = "If this email is connected to an account, you will receive a password reset link.";
    });
  }

  // -----------------------
  // Email Signup
  // -----------------------
  const emailSignupBtn = $("email-signup-btn");
  if (emailSignupBtn) {
    emailSignupBtn.addEventListener("click", function () {
      if ($("login-section")) $("login-section").style.display = "none";
      if ($("email-signup-section")) $("email-signup-section").style.display = "block";
    });
  }

  const backToLoginEmail = $("back-to-login-email");
  if (backToLoginEmail) {
    backToLoginEmail.addEventListener("click", function (e) {
      e.preventDefault();
      if ($("email-signup-section")) $("email-signup-section").style.display = "none";
      if ($("login-section")) $("login-section").style.display = "block";
    });
  }

  // -----------------------
  // Section switching
  // -----------------------
  function showSection(id) {
    const sections = [
      "dashboard-content",
      "tenant-section",
      "payment-section",
      "report-section",
      "messages-section"
    ];
    sections.forEach(sec => {
      const el = $(sec);
      if (el) el.style.display = "none";
    });
    const target = $(id);
    if (target) target.style.display = "block";
  }

  const navDashboard = $("nav-dashboard");
  if (navDashboard) navDashboard.onclick = () => {
    if ($("dashboard-section")) $("dashboard-section").style.display = "block";
    showSection("dashboard-content");
    updateDashboard();
    renderDashboardCharts();
  };

  const navTenants = $("nav-tenants");
  if (navTenants) navTenants.onclick = () => {
    showSection("tenant-section");
    populateTenants();
  };

  const navMessages = $("nav-messages");
  if (navMessages) navMessages.onclick = () => showSection("messages-section");

  const navPayments = $("nav-payments");
  if (navPayments) {
    navPayments.onclick = () => {
      showSection("payment-section");
      populatePaymentsTable();
    };
  }

  const navReports = $("nav-reports");
  if (navReports) {
    navReports.onclick = () => {
      if ($("dashboard-section")) $("dashboard-section").style.display = "block";
      showSection("report-section");
      updateReports();
    };
  }

  // -----------------------
  // Payments table
  // -----------------------
  function populatePaymentsTable() {
    const tbody = $("payments-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    payments.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${p.tenant}</td><td>${formatKsh(p.amount)}</td><td>${p.date}</td><td>${p.method}</td>`;
      tbody.appendChild(row);
    });
  }

  // Add payment form
  const paymentForm = $("add-payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", e => {
      e.preventDefault();
      const tenantName = $("payment-tenant").value;
      const amount = $("payment-amount").value;
      const method = $("payment-method").value;
      addPayment(tenantName, amount, null, method);
      paymentForm.reset();
    });
  }

  // -----------------------
  // Reports
  // -----------------------
  function updateReports() {
    const ctx = $("paymentsChart");
    if (!ctx) return;
    const grouped = groupPaymentsByMonth(payments);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Payments per Month",
          data,
          backgroundColor: "rgba(0, 128, 0, 0.6)"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // -----------------------
  // Dashboard (stub functions)
  // -----------------------
  function updateDashboard() {
    // TODO: implement tenant count, total rent, etc.
  }

  function renderDashboardCharts() {
    // TODO: implement dashboard charts if needed
  }

  function populateTenants() {
    // TODO: implement tenant table
  }

});


  // -----------------------
  // REPORTS (uses payments[] + tenants[])
  // -----------------------
  let pieChartInstance = null;
  let barChartInstance = null;

  function updateReports() {
    const startDate = $("report-start-date") ? $("report-start-date").value : "";
    const endDate = $("report-end-date") ? $("report-end-date").value : "";
    const method = $("report-method") ? $("report-method").value : "";

    let filtered = payments.slice(); // copy

    if (startDate) {
      filtered = filtered.filter(p => new Date(p.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(p => new Date(p.date) <= new Date(endDate));
    }
    if (method) {
      filtered = filtered.filter(p => p.method === method);
    }

    // Totals
    // Total tenants (from tenants list — but count tenants who appear in filtered payments OR all tenants depending on desired behaviour)
    // We'll show number of tenants in the system (since that's what your UI labeled), and also use payments to calculate collected.
    const totalTenants = tenants.length;
    const totalCollected = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0);

    // Outstanding: compute expected (sum of rents for all tenants) minus collected in the filtered window
    const expected = tenants.reduce((sum, t) => sum + Number(t.rent || 0), 0);
    const due = Math.max(0, expected - totalCollected);

    if ($("report-tenant-count")) $("report-tenant-count").textContent = totalTenants;
    if ($("report-rent")) $("report-rent").textContent = formatKsh(totalCollected);
    if ($("report-due")) $("report-due").textContent = formatKsh(due);

    // Breakdown by method
    const mpesaTotal = filtered.filter(p => p.method === "M-Pesa").reduce((s, p) => s + p.amount, 0);
    const bankTotal = filtered.filter(p => p.method === "Bank").reduce((s, p) => s + p.amount, 0);
    const cashTotal = filtered.filter(p => p.method === "Cash").reduce((s, p) => s + p.amount, 0);

    if ($("mpesa-total")) $("mpesa-total").textContent = formatKsh(mpesaTotal);
    if ($("bank-total")) $("bank-total").textContent = formatKsh(bankTotal);
    if ($("cash-total")) $("cash-total").textContent = formatKsh(cashTotal);

    // Prepare data for charts
    const methodTotals = { mpesa: mpesaTotal, bank: bankTotal, cash: cashTotal };
    const monthlyTotals = groupPaymentsByMonth(filtered);

    // draw charts (defensive)
    if ($("reportPieChart") && $("reportBarChart")) {
      updateReportCharts(methodTotals, monthlyTotals);
    }
  }

  // safe hookup for Apply button
  const applyReportsBtn = $("apply-report-filters");
  if (applyReportsBtn) applyReportsBtn.addEventListener("click", updateReports);

  // Reset filters button (if you later add it)
  const resetReportsBtn = $("reset-report-filters");
  if (resetReportsBtn) {
    resetReportsBtn.addEventListener("click", () => {
      if ($("report-start-date")) $("report-start-date").value = "";
      if ($("report-end-date")) $("report-end-date").value = "";
      if ($("report-method")) $("report-method").value = "";
      updateReports();
    });
  }

  // Reports chart creation / destroy
  function updateReportCharts(methodTotals, monthlyTotals) {
    const pieEl = $("reportPieChart");
    const barEl = $("reportBarChart");
    if (!pieEl || !barEl) return;

    const pieCtx = pieEl.getContext("2d");
    const barCtx = barEl.getContext("2d");

    try { if (pieChartInstance) pieChartInstance.destroy(); } catch (e) {}
    try { if (barChartInstance) barChartInstance.destroy(); } catch (e) {}

    pieChartInstance = new Chart(pieCtx, {
      type: "pie",
      data: {
        labels: ["M-Pesa", "Bank", "Cash"],
        datasets: [{
          data: [methodTotals.mpesa, methodTotals.bank, methodTotals.cash],
          backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });

    const labels = Object.keys(monthlyTotals);
    const values = Object.values(monthlyTotals);

    barChartInstance = new Chart(barCtx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Rent Collected (KSh)",
          data: values,
          backgroundColor: "#2196F3"
        }]
      },
      options: { responsive: true, maintainAspectRatio: false }
    });
  }
  // Export reports to CSV
function exportReportsToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Report totals
  csvContent += "Metric,Value\n";
  csvContent += `Total Tenants,${document.getElementById("report-tenant-count").textContent}\n`;
  csvContent += `Total Rent Collected,${document.getElementById("report-rent").textContent}\n`;
  csvContent += `Outstanding Balances,${document.getElementById("report-due").textContent}\n\n`;

  // Breakdown by method
  csvContent += "Payment Method,Amount\n";
  csvContent += `M-Pesa,${document.getElementById("mpesa-total").textContent}\n`;
  csvContent += `Bank,${document.getElementById("bank-total").textContent}\n`;
  csvContent += `Cash,${document.getElementById("cash-total").textContent}\n\n`;

  // Create downloadable file
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "grms_report.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Attach to pdf button
document.getElementById("export-csv-btn").addEventListener("click", exportReportsToCSV);

document.getElementById("export-pdf-btn").addEventListener("click", function () {
  const reportSection = document.getElementById("report-section");

  const opt = {
    margin:       0.5,
    filename:     'GRMS_Report.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(reportSection).save();
 

});

  // -----------------------
  // Tenants table
  // -----------------------
  function populateTenants() {
    const tbody = $("tenants-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    const searchEl = $("tenantSearch");
    const filterEl = $("tenantFilter");
    const searchValue = searchEl ? searchEl.value.toLowerCase() : "";
    const filterValue = filterEl ? filterEl.value : "all";

    tenants
      .filter(t => {
        const matchesSearch = !searchValue || t.name.toLowerCase().includes(searchValue);
        const matchesFilter =
          filterValue === "all" ||
          (filterValue === "paid" && t.paid) ||
          (filterValue === "unpaid" && !t.paid);
        return matchesSearch && matchesFilter;
      })
      .forEach((t, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${t.name}</td>
          <td>${t.house}</td>
          <td>KSh ${Number(t.rent).toLocaleString()}</td>
          <td>${t.lastPayment || ""}</td>
          <td>
            <span class="${t.paid ? 'status-paid' : 'status-unpaid'}">
              ${t.paid ? 'Paid' : 'Unpaid'}
            </span>
            ${t.paid ? '' : '<button class="mark-paid-btn">Mark as Paid</button>'}
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </td>
        `;
        tbody.appendChild(row);

        // mark as paid -> create a payment entry for tenant
        const markBtn = row.querySelector(".mark-paid-btn");
        if (markBtn) {
          markBtn.addEventListener("click", () => {
            addPayment(t.name, t.rent, null, "Manual");
            populateTenants();
            updateDashboard();
            populatePaymentsTable();
            updateReports();
          });
        }

        // edit (in-place)
        const editBtn = row.querySelector(".edit-btn");
        if (editBtn) {
          editBtn.addEventListener("click", () => {
            row.innerHTML = `
              <td><input type="text" value="${t.name}" id="edit-name-${index}"></td>
              <td><input type="text" value="${t.house}" id="edit-house-${index}"></td>
              <td><input type="number" value="${t.rent}" id="edit-rent-${index}"></td>
              <td><input type="date" value="${t.lastPayment}" id="edit-date-${index}"></td>
              <td>
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
              </td>
            `;

            row.querySelector(".save-btn").onclick = () => {
              t.name = document.getElementById(`edit-name-${index}`).value;
              t.house = document.getElementById(`edit-house-${index}`).value;
              t.rent = parseInt(document.getElementById(`edit-rent-${index}`).value, 10) || t.rent;
              t.lastPayment = document.getElementById(`edit-date-${index}`).value;
              populateTenants();
              updateDashboard();
            };

            row.querySelector(".cancel-btn").onclick = () => {
              populateTenants();
            };
          });
        }

        // delete
        const delBtn = row.querySelector(".delete-btn");
        if (delBtn) {
          delBtn.addEventListener("click", () => {
            if (confirm(`Delete ${t.name}?`)) {
              tenants.splice(index, 1);
              payments = payments.filter(p => p.tenant !== t.name);
              populateTenants();
              updateDashboard();
              populatePaymentsTable();
              updateReports();
            }
          });
        }
      });
  }

  // live search/filter hookup
  const tenantSearchEl = $("tenantSearch");
  if (tenantSearchEl) tenantSearchEl.addEventListener("input", populateTenants);
  const tenantFilterEl = $("tenantFilter");
  if (tenantFilterEl) tenantFilterEl.addEventListener("change", populateTenants);

  // -----------------------
  // Dashboard
  // -----------------------
  function updateDashboard() {
    const collected = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const expected = tenants.reduce((sum, t) => sum + Number(t.rent || 0), 0);
    const due = Math.max(0, expected - collected);

    if ($("tenant-count")) $("tenant-count").textContent = tenants.length;
    if ($("total-rent")) $("total-rent").textContent = formatKsh(collected);
    if ($("balance-due")) $("balance-due").textContent = formatKsh(due);
  }

  // -----------------------
  // Add tenant modal
  // -----------------------
  const modal = $("addTenantModal");
  const addTenantBtn = $("addTenantBtn");
  const closeModal = $("closeModal");

  if (addTenantBtn && modal) {
    addTenantBtn.addEventListener("click", () => modal.style.display = "block");
  }
  if (closeModal && modal) {
    closeModal.addEventListener("click", () => modal.style.display = "none");
  }
  window.addEventListener("click", (e) => {
    if (modal && e.target === modal) modal.style.display = "none";
  });

  const addTenantForm = $("addTenantForm");
  if (addTenantForm) {
    addTenantForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = $("tenantName") ? $("tenantName").value.trim() : "";
      const house = $("houseNumber") ? $("houseNumber").value.trim() : "";
      const rent = $("rentAmount") ? parseInt($("rentAmount").value, 10) : 0;
      const lastPayment = $("lastPayment") ? $("lastPayment").value : "";

      if (!name) return alert("Tenant name required.");
      tenants.push({ name, house, rent, lastPayment, paid: false });
      populateTenants();
      updateDashboard();
      if (modal) modal.style.display = "none";
      this.reset();
    });
  }

  // -----------------------
  // Charts (Chart.js) - safe creation / destroy
  // -----------------------
  let paymentsChart = null;
  let balanceChart = null;

  function renderDashboardCharts() {
    // destruction if exist
    try { if (paymentsChart) paymentsChart.destroy(); } catch (e) {}
    try { if (balanceChart) balanceChart.destroy(); } catch (e) {}
    paymentsChart = null;
    balanceChart = null;

    const paymentsEl = $("paymentsChart");
    const balanceEl = $("balanceChart");

    // build monthly series from payments (dashboard)
    const monthly = groupPaymentsByMonth(payments);
    const labels = Object.keys(monthly);
    const values = Object.values(monthly);

    // balance trend: simple cumulative outstanding over the months
    // compute expected monthly = sum of rents (assuming one period) — for visualization we produce a decreasing outstanding as payments accumulate
    const runningOutstanding = [];
    let cumulativeCollected = 0;
    for (let i = 0; i < values.length; i++) {
      cumulativeCollected += values[i];
      const expectedTotal = tenants.reduce((s, t) => s + t.rent, 0);
      runningOutstanding.push(Math.max(0, expectedTotal - cumulativeCollected));
    }

    if (paymentsEl) {
      paymentsChart = new Chart(paymentsEl, {
        type: 'bar',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [{
            label: 'Payments',
            data: values.length ? values : [0],
            backgroundColor: '#10b981'
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }

    if (balanceEl) {
      balanceChart = new Chart(balanceEl, {
        type: 'line',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [{
            label: 'Outstanding Balance',
            data: runningOutstanding.length ? runningOutstanding : [tenants.reduce((s,t)=>s+t.rent,0)],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  }

  // -----------------------
  // Messages
  // -----------------------
 // ================== MESSAGES SECTION ==================


// DOM references
const inbox = document.getElementById("inbox");
const outbox = document.getElementById("outbox");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const searchMessages = document.getElementById("searchMessages");
const newMessageCount = document.getElementById("newMessageCount"); // sidebar badge

// Mock data store
let inboxMessages = [];
let outboxMessages = [];
let unreadCount = 0;

// =======================
// Functions
// =======================

// Switch tabs (Inbox / Outbox)
function showMessages(tab) {
  if (tab === "inbox") {
    inbox.style.display = "block";
    outbox.style.display = "none";
    document.getElementById("inboxBtn").classList.add("active");
    document.getElementById("outboxBtn").classList.remove("active");
  } else {
    inbox.style.display = "none";
    outbox.style.display = "block";
    document.getElementById("outboxBtn").classList.add("active");
    document.getElementById("inboxBtn").classList.remove("active");
  }
}

// Render messages into container
function renderMessages(listElement, messages, isInbox = false) {
  listElement.innerHTML = "";

  if (messages.length === 0) {
    const emptyMsg = document.createElement("p");
    emptyMsg.className = "empty-placeholder";
    emptyMsg.textContent = "No messages yet.";
    listElement.appendChild(emptyMsg);
    return;
  }

  messages.forEach((msg, index) => {
    const item = document.createElement("div");
    item.className = "message-item" + (msg.unread ? " unread" : "");

    item.innerHTML = `
      <strong>${isInbox ? "From: " + msg.sender : "To: " + msg.receiver}</strong>
      <p>${msg.content}</p>
      <span class="date">${msg.date}</span>
      <button class="delete-btn" onclick="deleteMessage(${index}, ${isInbox})">🗑</button>
    `;

    // Mark as read when clicked
    item.addEventListener("click", () => {
      if (isInbox && msg.unread) {
        msg.unread = false;
        unreadCount--;
        updateBadge();
        renderMessages(listElement, messages, isInbox);
      }
    });

    listElement.appendChild(item);
  });
}

// Delete message
function deleteMessage(index, isInbox) {
  if (isInbox) {
    inboxMessages.splice(index, 1);
    renderMessages(inbox, inboxMessages, true);
  } else {
    outboxMessages.splice(index, 1);
    renderMessages(outbox, outboxMessages, false);
  }
}

// Update sidebar badge
function updateBadge() {
  if (newMessageCount) {
    newMessageCount.textContent = unreadCount > 0 ? unreadCount : "";
  }
}

// =======================
// Event Listeners
// =======================

// Tabs
document.getElementById("inboxBtn").addEventListener("click", () => showMessages("inbox"));
document.getElementById("outboxBtn").addEventListener("click", () => showMessages("outbox"));

// Handle sending messages
messageForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const message = messageInput.value.trim();
  const sender = senderRole.value; // Get selected role
  if (!message) return;

  // Determine receiver
  const receiver = sender === "Landlord" ? "Tenant" : "Landlord";

  // Create new message object
  const newMsg = {
    sender: sender,
    receiver: receiver,
    content: message,
    date: new Date().toLocaleString(),
    unread: true
  };

  // Push to outbox (for sender) and inbox (for receiver)
  outboxMessages.push({ ...newMsg, unread: false });
  inboxMessages.push({ ...newMsg });

  // Update unread count only if the receiver is "me"
  if (receiver === "Landlord") {
    unreadCount++;
    updateBadge();
  }

  // Re-render
  renderMessages(outbox, outboxMessages, false);
  renderMessages(inbox, inboxMessages, true);

  // Reset form
  messageInput.value = "";

  // Switch to Outbox tab automatically
  showMessages("outbox");
});


// Search filter
searchMessages.addEventListener("input", () => {
  const query = searchMessages.value.toLowerCase();
  const filteredInbox = inboxMessages.filter(m => m.content.toLowerCase().includes(query));
  const filteredOutbox = outboxMessages.filter(m => m.content.toLowerCase().includes(query));

  renderMessages(inbox, filteredInbox, true);
  renderMessages(outbox, filteredOutbox, false);
});

// =======================
// Init
// =======================
showMessages("inbox");
renderMessages(inbox, inboxMessages, true);
renderMessages(outbox, outboxMessages, false);
updateBadge();


  // -----------------------
  // Initialize UI state
  // -----------------------
  populateTenants();
  populatePaymentsTable();
  updateDashboard();
  // Render dashboard charts initially if dashboard is visible (safe)
  renderDashboardCharts();

  // Expose a couple helpers to window for debugging if needed (optional)
  window.__grpms = {
    tenants,
    payments,
    updateReports,
    populateTenants,
    updateDashboard,
    renderDashboardCharts
  };
}); // DOMContentLoaded end


