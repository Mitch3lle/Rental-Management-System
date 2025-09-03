// ---------- LOGIN WITH USERNAME/PASSWORD ----------
document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "Admin" && password === "admin123") {
    document.getElementById("login-section").style.display = "none";
    document.getElementById("dashboard-section").style.display = "block";
  
  showSection("dashboard-content");
  updateDashboard();
  renderCharts();
  } else {
    alert("Invalid credentials.");
  }
});


// ---------- TOGGLE PASSWORD ----------
document.getElementById("toggle-password").addEventListener("click", function(){
  const passwordInput = document.getElementById("password");
  if(passwordInput.type === "password"){
    passwordInput.type = "text";
    this.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    passwordInput.type = "password";
    this.classList.replace("fa-eye-slash", "fa-eye");
  }
});

// ---------- DUMMY GOOGLE LOGIN ----------
document.getElementById("google-login-btn").addEventListener("click", function(){
  const proceed = confirm("Simulated Google Login\n\nClick OK to login with a dummy Google account.");
  if(proceed){
    const fakeUser = {
      name: "Jennifer Wakwaya",
      email: "jeniferwakwaya@gmail.com",
      picture: "https://via.placeholder.com/100"
    };

    // Show user info
    document.getElementById("user-info").style.display = "block";
    document.getElementById("user-name").textContent = fakeUser.name;
    document.getElementById("user-email").textContent = fakeUser.email;
    document.getElementById("user-pic").src = fakeUser.picture;

    // Hide the Google login button
    this.style.display = "none";
  }
});

// ---------- FORGOT PASSWORD ----------
document.getElementById("forgot-password-link").addEventListener("click", function(e){
  e.preventDefault();
  document.getElementById("forgot-password-form").style.display = "block";
});

document.getElementById("reset-btn").addEventListener("click", function(){
  const email = document.getElementById("reset-email").value.trim();
  if(!email){
    alert("Please enter your email address.");
    return;
  }
  document.getElementById("reset-message").textContent = 
    "If this email is connected to an account, you will receive a password reset link.";
});
// ========== SECTION VISIBILITY ==========
function showSection(id) {
  const sections = [
    "dashboard-content",
    "tenant-section",
    "payment-section",
    "report-section",
    "messages-section"
  ];
  sections.forEach(sec => {
    const el = document.getElementById(sec);
    if (el) el.style.display = "none";
  });
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}

// ========== NAVIGATION ==========
document.getElementById("nav-dashboard").onclick = () => showSection("dashboard-content");

document.getElementById("nav-tenants").onclick = () => showSection("tenant-section");

document.getElementById("nav-messages").onclick = () => showSection("messages-section");

document.getElementById("nav-payments").onclick = () => {
  showSection("payment-section");

  const payments = [
    { name: "Alice", amount: 10000, date: "2025-04-01", method: "M-Pesa" },
    { name: "Brian", amount: 9500, date: "2025-03-15", method: "Bank" }
  ];

  const tbody = document.getElementById("payments-body");
  tbody.innerHTML = "";
  payments.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.name}</td><td>KSh ${p.amount}</td><td>${p.date}</td><td>${p.method}</td>`;
    tbody.appendChild(row);
  });
};

document.getElementById("nav-reports").onclick = () => {
  showSection("report-section");
  document.getElementById("report-tenant-count").textContent = tenants.length;

  const collected = tenants.filter(t => t.paid).reduce((sum, t) => sum + t.rent, 0);
  const due = tenants.filter(t => !t.paid).reduce((sum, t) => sum + t.rent, 0);

  document.getElementById("report-rent").textContent = `KSh ${collected}`;
  document.getElementById("report-due").textContent = `KSh ${due}`;
};



// ========== TENANT DATA ==========
const tenants = [
  { name: "Alice", house: "A1", rent: 10000, lastPayment: "2025-04-01", paid: true },
  { name: "Brian", house: "B2", rent: 9500, lastPayment: "2025-03-15", paid: false }
];

function populateTenants() {
  const tbody = document.getElementById("tenants-body");
  tbody.innerHTML = "";
  tenants.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.name}</td>
      <td>${t.house}</td>
      <td>KSh ${t.rent}</td>
      <td>${t.lastPayment}</td>
      <td>
        <span class="${t.paid ? 'status-paid' : 'status-unpaid'}">${t.paid ? 'Paid' : 'Unpaid'}</span>
        ${t.paid ? '' : '<button class="mark-paid-btn">Mark as Paid</button>'}
      </td>`;
    tbody.appendChild(row);

    if (!t.paid) {
      row.querySelector(".mark-paid-btn").onclick = () => {
        t.paid = true;
        populateTenants();
        updateDashboard();
      };
    }
  });
}
populateTenants();

// ========== DASHBOARD DATA ==========
function updateDashboard() {
  const collected = tenants.filter(t => t.paid).reduce((sum, t) => sum + t.rent, 0);
  const due = tenants.filter(t => !t.paid).reduce((sum, t) => sum + t.rent, 0);

  document.getElementById("tenant-count").textContent = tenants.length;
  document.getElementById("total-rent").textContent = `KSh ${collected}`;
  document.getElementById("balance-due").textContent = `KSh ${due}`;
}

// ========== ADD TENANT MODAL ==========
const modal = document.getElementById("addTenantModal");
document.getElementById("addTenantBtn").onclick = () => modal.style.display = "block";
document.getElementById("closeModal").onclick = () => modal.style.display = "none";
window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

document.getElementById("addTenantForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("tenantName").value;
  const house = document.getElementById("houseNumber").value;
  const rent = parseInt(document.getElementById("rentAmount").value);
  const lastPayment = document.getElementById("lastPayment").value;

  tenants.push({ name, house, rent, lastPayment, paid: false });
  populateTenants();
  updateDashboard();
  modal.style.display = "none";
  this.reset();
});

// ========== CHARTS ==========
function renderCharts() {
  new Chart(document.getElementById('paymentsChart'), {
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

  new Chart(document.getElementById('balanceChart'), {
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

// ========== MESSAGES ==========
document.addEventListener("DOMContentLoaded", function () {
const messageDisplay = document.getElementById("messageDisplay"); 
const messageForm = document.getElementById("messageForm");

messageForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (message) {
    const p = document.createElement("p");
    p.textContent = `Landlord: ${message}`;
    messageDisplay.appendChild(p);
    input.value = "";
    messageDisplay.scrollTop = messageDisplay.scrollHeight;
  }
});
});

