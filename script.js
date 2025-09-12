// full script.js — complete and integrated
document.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Data (tenants + payments)
  // Use tenant IDs to avoid duplication when names change
  // -----------------------
  let nextTenantId = 21; // start after 20 seeded tenants

const tenants = [
  { id: 1, name: "Mary Atieno", house: "Kisumu Heights A1", rent: 12000, lastPayment: "2025-08-01", paid: true },
  { id: 2, name: "James Otieno", house: "Lakeview B2", rent: 9500, lastPayment: "2025-08-05", paid: false },
  { id: 3, name: "Grace Achieng", house: "Milimani C3", rent: 15000, lastPayment: "2025-07-28", paid: true },
  { id: 4, name: "Daniel Onyango", house: "Tom Mboya D4", rent: 8000, lastPayment: "2025-08-02", paid: false },
  { id: 5, name: "Cynthia Adhiambo", house: "Lolwe E5", rent: 10000, lastPayment: "2025-07-30", paid: true },
  { id: 6, name: "Peter Ouma", house: "Kondele F6", rent: 7000, lastPayment: "2025-08-03", paid: false },
  { id: 7, name: "Janet Awuor", house: "Nyalenda G7", rent: 6000, lastPayment: "2025-07-25", paid: true },
  { id: 8, name: "Collins Omondi", house: "Oginga H8", rent: 11000, lastPayment: "2025-08-04", paid: false },
  { id: 9, name: "Beatrice Akoth", house: "Kisumu Central I9", rent: 12500, lastPayment: "2025-07-27", paid: true },
  { id: 10, name: "Michael Odhiambo", house: "Manyatta J10", rent: 5000, lastPayment: "2025-08-06", paid: false },
  { id: 11, name: "Sharon Awino", house: "Nyalenda East K11", rent: 7000, lastPayment: "2025-08-01", paid: true },
  { id: 12, name: "Samuel Okoth", house: "Milimani L12", rent: 16000, lastPayment: "2025-07-29", paid: false },
  { id: 13, name: "Lucy Atieno", house: "Tom Mboya M13", rent: 8500, lastPayment: "2025-07-31", paid: true },
  { id: 14, name: "Victor Ochieng", house: "Kondele N14", rent: 7200, lastPayment: "2025-08-05", paid: false },
  { id: 15, name: "Ann Akinyi", house: "Lolwe O15", rent: 9500, lastPayment: "2025-08-02", paid: true },
  { id: 16, name: "George Were", house: "Lakeview P16", rent: 11200, lastPayment: "2025-08-03", paid: false },
  { id: 17, name: "Dorothy Achieng", house: "Milimani Q17", rent: 15500, lastPayment: "2025-07-26", paid: true },
  { id: 18, name: "Kennedy Odongo", house: "Kisumu Heights R18", rent: 11800, lastPayment: "2025-08-06", paid: false },
  { id: 19, name: "Hellen Atieno", house: "Manyatta S19", rent: 5600, lastPayment: "2025-08-01", paid: true },
  { id: 20, name: "Felix Onyango", house: "Nyalenda West T20", rent: 6800, lastPayment: "2025-08-04", paid: false }
];

// payments store tenantId (so renaming a tenant doesn't duplicate)
let payments = [
  { id: 1, tenantId: 1, amount: 12000, date: "2025-08-01", method: "M-Pesa", reference: "TXN-1001" },
  { id: 2, tenantId: 3, amount: 15000, date: "2025-07-28", method: "Bank", reference: "TXN-1002" },
  { id: 3, tenantId: 5, amount: 10000, date: "2025-07-30", method: "Cash", reference: "TXN-1003" },
  { id: 4, tenantId: 7, amount: 6000, date: "2025-07-25", method: "M-Pesa", reference: "TXN-1004" },
  { id: 5, tenantId: 9, amount: 12500, date: "2025-07-27", method: "Bank", reference: "TXN-1005" },
  { id: 6, tenantId: 11, amount: 7000, date: "2025-08-01", method: "Cash", reference: "TXN-1006" },
  { id: 7, tenantId: 13, amount: 8500, date: "2025-07-31", method: "M-Pesa", reference: "TXN-1007" },
  { id: 8, tenantId: 15, amount: 9500, date: "2025-08-02", method: "Bank", reference: "TXN-1008" },
  { id: 9, tenantId: 17, amount: 15500, date: "2025-07-26", method: "Cash", reference: "TXN-1009" },
  { id: 10, tenantId: 19, amount: 5600, date: "2025-08-01", method: "M-Pesa", reference: "TXN-1010" }
];

  // -----------------------
  // Helpers
  // -----------------------
  const $ = id => document.getElementById(id);
  const formatKsh = n => `KSh ${Number(n || 0).toLocaleString()}`;

  function tenantNameById(id) {
    const t = tenants.find(x => x.id === Number(id));
    return t ? t.name : "(Unknown)";
  }

  // group payments by month (short month + year) and return ordered object
  function groupPaymentsByMonth(paymentList) {
    const map = {};
    paymentList.forEach(p => {
      try {
        const date = new Date(p.date);
        const month = date.toLocaleString("default", { month: "short", year: "numeric" });
        map[month] = (map[month] || 0) + Number(p.amount || 0);
      } catch (e) {
        // ignore bad dates
      }
    });
    // sort keys by date order
    const entries = Object.keys(map)
      .map(k => ({ k, d: new Date(k) })) // parsing "Mon YYYY" is OK for labels here
      .sort((a, b) => a.d - b.d)
      .map(x => [x.k, map[x.k]]);
    return Object.fromEntries(entries);
  }

  // Add a payment entry and keep tenant state in sync (use tenantId)
  function addPayment(tenantId, amount, date = null, method = "Manual", reference = "", notes = "", rentPeriod = "") {
    const d = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const payment = {
      id: Date.now(),
      tenantId: Number(tenantId),
      amount: Number(amount),
      date: d,
      method,
      reference,
      notes,
      rentPeriod
    };
    payments.push(payment);

    // mark tenant as paid / update lastPayment
    const t = tenants.find(x => x.id === Number(tenantId));
    if (t) {
      t.paid = true;
      t.lastPayment = d;
    }

    // refresh UI
    populatePaymentsTable();
    populateTenants();
    updateDashboard();
    updateReports();
    renderDashboardCharts();
    updateBalancesTable();
    updatePaymentTenantDropdown();
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
      }, 600);
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
      // OTP matches previous behaviour — fixed test code "123456"
      if (otp === "123456") {
        if ($("otp-error")) $("otp-error").style.display = "none";
        if ($("otp-section")) $("otp-section").style.display = "none";

        // Show dashboard (outer section visible + inner content)
        if ($("login-section")) $("login-section").style.display = "none";
        if ($("dashboard-section")) $("dashboard-section").style.display = "block";
        showSection("dashboard-content");
        updateDashboard();
        renderDashboardCharts(); // draw dashboard charts
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

  // Attach nav items safely
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
      updatePaymentTenantDropdown();
      updateBalancesTable();
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
  // Payments table population (reads tenant names via tenantId)
  // -----------------------
  function populatePaymentsTable() {
    const tbody = $("payments-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    payments.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${tenantNameById(p.tenantId)}</td><td>${formatKsh(p.amount)}</td><td>${p.date}</td><td>${p.method}</td><td>${p.reference || ""}</td><td>${p.rentPeriod || ""}</td><td><button class="delete-payment" data-id="${p.id}">Delete</button></td>`;
      tbody.appendChild(row);
    });

    // attach delete handlers
    tbody.querySelectorAll(".delete-payment").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-id"));
        const idx = payments.findIndex(x => x.id === id);
        if (idx === -1) return;
        if (confirm("Delete this payment?")) {
          payments.splice(idx, 1);
          populatePaymentsTable();
          updateBalancesTable();
          updateDashboard();
          updateReports();
          renderDashboardCharts();
        }
      });
    });
  }

  // Populate tenant dropdown in Payment section
  function updatePaymentTenantDropdown() {
    const dropdown = $("tenant-select");
    if (!dropdown) return;

    dropdown.innerHTML = '<option value="">-- Select Tenant --</option>'; // reset

    tenants.forEach(t => {
      const option = document.createElement("option");
      option.value = t.id; // ✅ use tenant ID, not name
      option.textContent = `${t.name} (${t.house})`;
      dropdown.appendChild(option);
    });
  }

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
    const totalTenants = tenants.length;
    const totalCollected = filtered.reduce((sum, p) => sum + Number(p.amount || 0), 0);

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

  // Reset filters button
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

  // Export reports to CSV (keeps as you had)
  function exportReportsToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";

    csvContent += "Metric,Value\n";
    csvContent += `Total Tenants,${document.getElementById("report-tenant-count").textContent}\n`;
    csvContent += `Total Rent Collected,${document.getElementById("report-rent").textContent}\n`;
    csvContent += `Outstanding Balances,${document.getElementById("report-due").textContent}\n\n`;

    csvContent += "Payment Method,Amount\n";
    csvContent += `M-Pesa,${document.getElementById("mpesa-total").textContent}\n`;
    csvContent += `Bank,${document.getElementById("bank-total").textContent}\n`;
    csvContent += `Cash,${document.getElementById("cash-total").textContent}\n\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "grms_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const exportCsvBtn = $("export-csv-btn");
  if (exportCsvBtn) exportCsvBtn.addEventListener("click", exportReportsToCSV);

  const exportPdfBtn = $("export-pdf-btn");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", function () {
      const reportSection = document.getElementById("report-section");
      const opt = {
        margin: 0.5,
        filename: 'GRMS_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(reportSection).save();
    });
  }

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
      .forEach((t) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${t.name}</td>
          <td>${t.house}</td>
          <td>${formatKsh(t.rent)}</td>
          <td>${t.lastPayment || ""}</td>
          <td>
            <span class="${t.paid ? 'status-paid' : 'status-unpaid'}">
              ${t.paid ? 'Paid' : 'Unpaid'}
            </span>
            ${t.paid ? '' : `<button class="mark-paid-btn" data-id="${t.id}">Mark as Paid</button>`}
            <button class="edit-btn" data-id="${t.id}">Edit</button>
            <button class="delete-btn" data-id="${t.id}">Delete</button>
          </td>
        `;
        tbody.appendChild(row);
      });

    // attach "Mark as Paid"
    document.querySelectorAll(".mark-paid-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-id"));
        const tenant = tenants.find(t => t.id === id);
        if (tenant) {
          addPayment(tenant.id, tenant.rent, null, "Manual", `AUTO-${Date.now()}`);
        }
      });
    });

    // attach Edit
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = Number(btn.getAttribute("data-id"));
        const tenant = tenants.find(t => t.id === id);
        if (!tenant) return;

        // find the row to replace with inputs
        const row = btn.closest("tr");
        row.innerHTML = `
          <td><input type="text" value="${tenant.name}" id="edit-name-${id}"></td>
          <td><input type="text" value="${tenant.house}" id="edit-house-${id}"></td>
          <td><input type="number" value="${tenant.rent}" id="edit-rent-${id}"></td>
          <td><input type="date" value="${tenant.lastPayment || ''}" id="edit-date-${id}"></td>
          <td>
            <button class="save-btn" data-id="${id}">Save</button>
            <button class="cancel-btn" data-id="${id}">Cancel</button>
          </td>
        `;

        // Save handler
        row.querySelector(".save-btn").addEventListener("click", () => {
          tenant.name = document.getElementById(`edit-name-${id}`).value.trim() || tenant.name;
          tenant.house = document.getElementById(`edit-house-${id}`).value.trim() || tenant.house;
          tenant.rent = parseInt(document.getElementById(`edit-rent-${id}`).value, 10) || tenant.rent;
          tenant.lastPayment = document.getElementById(`edit-date-${id}`).value || tenant.lastPayment;

          populateTenants();
          populatePaymentsTable();
          updateDashboard();
          updateReports();
          updatePaymentTenantDropdown();
        });

        // Cancel handler
        row.querySelector(".cancel-btn").addEventListener("click", () => {
          populateTenants();
        });
      });
    });

    // attach Delete
    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = Number(btn.getAttribute("data-id"));
        const tIndex = tenants.findIndex(x => x.id === id);
        if (tIndex === -1) return;
        if (confirm(`Delete ${tenants[tIndex].name}?`)) {
          // remove tenant and their payments
          tenants.splice(tIndex, 1);
          payments = payments.filter(p => p.tenantId !== id);
          populateTenants();
          populatePaymentsTable();
          updateDashboard();
          updateReports();
          updatePaymentTenantDropdown();
          updateBalancesTable();
        }
      });
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
      const newTenant = {
        id: nextTenantId++,
        name,
        house,
        rent,
        lastPayment: lastPayment || "",
        paid: !!lastPayment,
      };
      tenants.push(newTenant);
      populateTenants();
      updateDashboard();
      updatePaymentTenantDropdown();
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
    try { if (paymentsChart) paymentsChart.destroy(); } catch (e) {}
    try { if (balanceChart) balanceChart.destroy(); } catch (e) {}
    paymentsChart = null;
    balanceChart = null;

    const paymentsEl = $("paymentsChart");
    const balanceEl = $("balanceChart");

    const monthly = groupPaymentsByMonth(payments);
    const labels = Object.keys(monthly);
    const values = Object.values(monthly);

    // balance trend: cumulative outstanding
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
  // Messages (kept minimal as before)
  // -----------------------
  const inbox = $("inbox");
  const outbox = $("outbox");
  const messageForm = $("messageForm");
  const messageInput = $("messageInput");
  const searchMessages = $("searchMessages");
  const newMessageCount = $("newMessageCount"); // sidebar badge
  const senderRole = $("senderRole"); // if present in your HTML

  let inboxMessages = [];
  let outboxMessages = [];
  let unreadCount = 0;

  function showMessages(tab) {
    if (!inbox || !outbox) return;
    if (tab === "inbox") {
      inbox.style.display = "block";
      outbox.style.display = "none";
      if ($("inboxBtn")) $("inboxBtn").classList.add("active");
      if ($("outboxBtn")) $("outboxBtn").classList.remove("active");
    } else {
      inbox.style.display = "none";
      outbox.style.display = "block";
      if ($("outboxBtn")) $("outboxBtn").classList.add("active");
      if ($("inboxBtn")) $("inboxBtn").classList.remove("active");
    }
  }

  function renderMessages(listElement, messages, isInbox = false) {
    if (!listElement) return;
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
        <button class="delete-btn" data-idx="${index}" data-inbox="${isInbox}">🗑</button>
      `;
      item.addEventListener("click", () => {
        if (isInbox && msg.unread) {
          msg.unread = false;
          unreadCount = Math.max(0, unreadCount - 1);
          updateBadge();
          renderMessages(listElement, messages, isInbox);
        }
      });
      listElement.appendChild(item);
    });

    // delete handlers
    listElement.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const idx = Number(btn.getAttribute("data-idx"));
        const isInboxFlag = btn.getAttribute("data-inbox") === "true";
        if (isInboxFlag) {
          inboxMessages.splice(idx, 1);
          renderMessages(inbox, inboxMessages, true);
        } else {
          outboxMessages.splice(idx, 1);
          renderMessages(outbox, outboxMessages, false);
        }
      });
    });
  }

  function deleteMessage(index, isInbox) {
    if (isInbox) {
      inboxMessages.splice(index, 1);
      renderMessages(inbox, inboxMessages, true);
    } else {
      outboxMessages.splice(index, 1);
      renderMessages(outbox, outboxMessages, false);
    }
  }

  function updateBadge() {
    if (!newMessageCount) return;
    newMessageCount.textContent = unreadCount > 0 ? unreadCount : "";
  }

  if ($("inboxBtn")) $("inboxBtn").addEventListener("click", () => showMessages("inbox"));
  if ($("outboxBtn")) $("outboxBtn").addEventListener("click", () => showMessages("outbox"));

  if (messageForm && messageInput && senderRole) {
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const message = messageInput.value.trim();
      const sender = senderRole.value || "Landlord";
      if (!message) return;
      const receiver = sender === "Landlord" ? "Tenant" : "Landlord";
      const newMsg = {
        sender,
        receiver,
        content: message,
        date: new Date().toLocaleString(),
        unread: true
      };
      outboxMessages.push({ ...newMsg, unread: false });
      inboxMessages.push({ ...newMsg });
      if (receiver === "Landlord") {
        unreadCount++;
      }
      renderMessages(outbox, outboxMessages, false);
      renderMessages(inbox, inboxMessages, true);
      updateBadge();
      messageInput.value = "";
      showMessages("outbox");
    });
  }

  if (searchMessages) {
    searchMessages.addEventListener("input", () => {
      const query = searchMessages.value.toLowerCase();
      const filteredInbox = inboxMessages.filter(m => m.content.toLowerCase().includes(query));
      const filteredOutbox = outboxMessages.filter(m => m.content.toLowerCase().includes(query));
      renderMessages(inbox, filteredInbox, true);
      renderMessages(outbox, filteredOutbox, false);
    });
  }

  showMessages("inbox");
  renderMessages(inbox, inboxMessages, true);
  renderMessages(outbox, outboxMessages, false);
  updateBadge();

  // -----------------------
  // Balances table (per-tenant summary)
  // -----------------------
  function updateBalancesTable() {
    const balancesBody = $("balances-body");
    if (!balancesBody) return;
    balancesBody.innerHTML = "";

    tenants.forEach(tenant => {
      const totalPaid = payments
        .filter(p => p.tenantId === tenant.id)
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      const rentDue = Number(tenant.rent) || 0;
      const balance = rentDue - totalPaid;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${tenant.name}</td>
        <td>${rentDue.toFixed(2)}</td>
        <td>${totalPaid.toFixed(2)}</td>
        <td style="color:${balance <= 0 ? 'green' : 'red'};">
          ${balance.toFixed(2)}
        </td>
      `;
      balancesBody.appendChild(row);
    });
  }

  // -----------------------
  // Payment form handling (new Payment section)
  // Expects these fields in HTML:
  // - form#payment-form
  // - select#tenant-select
  // - input#payment-amount
  // - input#payment-date
  // - select#payment-method
  // - input#payment-ref
  // - textarea#payment-notes
  // - input#rent-period
  // -----------------------
  const paymentForm = $("payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const tenantId = $("tenant-select") ? $("tenant-select").value : "";
      const amountEl = $("payment-amount");
      const amount = amountEl ? Number(amountEl.value) : 0;
      const date = $("payment-date") ? $("payment-date").value : "";
      const method = $("payment-method") ? $("payment-method").value : "Manual";
      const reference = $("payment-ref") ? $("payment-ref").value : "";
      const notes = $("payment-notes") ? $("payment-notes").value : "";
      const rentPeriod = $("rent-period") ? $("rent-period").value : "";

      if (!tenantId) return alert("Please select a tenant.");
      if (!amount || Number(amount) <= 0) return alert("Enter a valid amount.");
      addPayment(Number(tenantId), amount, date || null, method, reference, notes, rentPeriod);

      paymentForm.reset();
      updatePaymentTenantDropdown(); // keep dropdown fresh
      populatePaymentsTable();
      updateBalancesTable();
      updateDashboard();
      updateReports();
    });
  }

  // Also attach small helper button (if you used one) - keep optional
  const addPaymentBtn = $("add-payment-btn");
  if (addPaymentBtn) {
    addPaymentBtn.addEventListener("click", () => {
      if (paymentForm) paymentForm.requestSubmit();
    });
  }

  // -----------------------
  // Initialize UI state (first paint)
  // -----------------------
  populateTenants();
  populatePaymentsTable();
  updatePaymentTenantDropdown();
  updateBalancesTable();
  updateDashboard();
  renderDashboardCharts();
  updateReports();

  // Expose a couple helpers for debugging (optional)
  window.__grpms = {
    tenants,
    payments,
    addPayment,
    populateTenants,
    populatePaymentsTable,
    updateReports,
    renderDashboardCharts,
    updateBalancesTable
  };
}); // DOMContentLoaded end
