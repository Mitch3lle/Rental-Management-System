// script.js - corrected & defensive (replace your existing file with this)

document.addEventListener("DOMContentLoaded", () => {
  // -----------------------
  // Data (tenants + payments)
  // -----------------------
  const tenants = [
    { name: "Alice", house: "A1", rent: 10000, lastPayment: "2025-04-01", paid: true },
    { name: "Brian", house: "B2", rent: 9500, lastPayment: "2025-03-15", paid: false }
  ];

  // payments history used by Payments tab and Reports
  let payments = [
    { tenant: "Alice", amount: 10000, date: "2025-04-01", method: "M-Pesa" },
    { tenant: "Brian", amount: 9500, date: "2025-03-15", method: "Bank" }
  ];

  // -----------------------
  // Helpers
  // -----------------------
  const $ = id => document.getElementById(id);
  const formatKsh = n => `KSh ${n.toLocaleString()}`;

  // Add a payment entry and keep tenant state in sync
  function addPayment(tenantName, amount, date = null, method = "Manual") {
    const d = date || new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    payments.push({ tenant: tenantName, amount: Number(amount), date: d, method });
    // mark tenant as paid and update lastPayment
    const t = tenants.find(x => x.name === tenantName);
    if (t) {
      t.paid = true;
      t.lastPayment = d;
    }
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
      }, 1500);
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

        // Show dashboard
        if ($("login-section")) $("login-section").style.display = "none";
        if ($("dashboard-section")) $("dashboard-section").style.display = "block";
        showSection("dashboard-content");
        updateDashboard();
        renderCharts();
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
  // Toggle password icons (works for all .toggle-password icons)
  // -----------------------
  document.querySelectorAll(".toggle-password").forEach(icon => {
    icon.addEventListener("click", function () {
      // find the sibling input inside .password-wrapper
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
  // Dummy Google login (simulated)
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
  // Forgot password (single page "route" inside index.html)
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
  // Email Signup (inline section)
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
  // Section switching (sidebar)
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
  if (navDashboard) navDashboard.onclick = () => showSection("dashboard-content");

  const navTenants = $("nav-tenants");
  if (navTenants) navTenants.onclick = () => {
    showSection("tenant-section");
    // repopulate to ensure latest
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
      showSection("report-section");
      updateReports(); // default load without filters
    };
  }

  // -----------------------
  // Payments table population
  // -----------------------
  function populatePaymentsTable() {
    const tbody = $("payments-body");
    if (!tbody) return;
    tbody.innerHTML = "";
    payments.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${p.tenant}</td><td>KSh ${p.amount}</td><td>${p.date}</td><td>${p.method}</td>`;
      tbody.appendChild(row);
    });
  }

  // -----------------------
  // Reports (uses payments[] + tenants[])
  // -----------------------
  const filterReportBtn = $("filter-report-btn");
  if (filterReportBtn) filterReportBtn.addEventListener("click", updateReports);

  function updateReports() {
    const startDate = $("report-start") ? $("report-start").value : "";
    const endDate = $("report-end") ? $("report-end").value : "";

    let filteredPayments = payments.slice(); // copy

    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      filteredPayments = payments.filter(p => {
        const payDate = new Date(p.date);
        if (start && payDate < start) return false;
        if (end && payDate > end) return false;
        return true;
      });
    }

    // Total tenants (always from tenants array)
    if ($("report-tenant-count")) $("report-tenant-count").textContent = tenants.length;

    // Total collected from filtered payments
    const collected = filteredPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    if ($("report-rent")) $("report-rent").textContent = formatKsh(collected);

    // Outstanding: expected total rent - collected
    const expected = tenants.reduce((sum, t) => sum + Number(t.rent), 0);
    const due = expected - collected;
    if ($("report-due")) $("report-due").textContent = formatKsh(Math.max(0, due));
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
      .forEach((t, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${t.name}</td>
          <td>${t.house}</td>
          <td>KSh ${t.rent}</td>
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

        // edit (placeholder)
        const editBtn = row.querySelector(".edit-btn");
        if (editBtn) {
          editBtn.addEventListener("click", () => {
            alert(`Edit ${t.name} clicked (modal hookup later).`);
          });
        }

        // delete
        const delBtn = row.querySelector(".delete-btn");
        if (delBtn) {
          delBtn.addEventListener("click", () => {
            if (confirm(`Delete ${t.name}?`)) {
              tenants.splice(index, 1);
              // Also remove payments for that tenant (optional)
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
    // total collected from payments
    const collected = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    // outstanding = expected - collected
    const expected = tenants.reduce((sum, t) => sum + Number(t.rent), 0);
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

  function renderCharts() {
    // destroy if exist
    if (paymentsChart) {
      try { paymentsChart.destroy(); } catch (e) {}
      paymentsChart = null;
    }
    if (balanceChart) {
      try { balanceChart.destroy(); } catch (e) {}
      balanceChart = null;
    }

    const paymentsCtx = $("paymentsChart");
    const balanceCtx = $("balanceChart");

    // Example static charts - you can later replace data with payments[] based data
    if (paymentsCtx) {
      paymentsChart = new Chart(paymentsCtx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          datasets: [{
            label: 'Payments',
            data: [8000, 12000, 7500, 10000, 6000],
            backgroundColor: '#10b981'
          }]
        },
        options: { responsive: true }
      });
    }

    if (balanceCtx) {
      balanceChart = new Chart(balanceCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr'],
          datasets: [{
            label: 'Balance',
            data: [30000, 27000, 24000, 21000],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true
          }]
        },
        options: { responsive: true }
      });
    }
  }

  // -----------------------
  // Messages
  // -----------------------
  const messageForm = $("messageForm");
  if (messageForm) {
    const messageDisplay = $("messageDisplay");
    messageForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = $("messageInput");
      if (!input) return;
      const message = input.value.trim();
      if (message && messageDisplay) {
        const p = document.createElement("p");
        p.textContent = `Landlord: ${message}`;
        messageDisplay.appendChild(p);
        input.value = "";
        messageDisplay.scrollTop = messageDisplay.scrollHeight;
      }
    });
  }

  // -----------------------
  // Initialize UI state
  // -----------------------
  populateTenants();
  populatePaymentsTable();
  updateDashboard();
  // Do not render charts until dashboard is shown (but it's safe to render now)
  renderCharts();

  // Expose a couple helpers to window for debugging if needed (optional)
  window.__grpms = { tenants, payments, updateReports, populateTenants, updateDashboard, renderCharts };
}); // DOMContentLoaded end
