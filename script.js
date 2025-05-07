document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    if (username === "Admin" && password === "admin123") {
      document.getElementById("login-section").style.display = "none";
      document.getElementById("dashboard-section").style.display = "flex";
      document.querySelector(".main").style.display = "block";
  
     
      const data = {
        tenants: 12,
        rentCollected: 120000,
        balance: 18000
      };
      document.getElementById('tenant-count').innerText = data.tenants;
      document.getElementById('total-rent').innerText = `KSh ${data.rentCollected}`;
      document.getElementById('balance-due').innerText = `KSh ${data.balance}`;
    } else {
      alert("Invalid username or password.");
    }
  });
  
  
  function hideAllSections() {
    document.querySelector(".main").style.display = "none";
    document.getElementById("tenant-section").style.display = "none";
    document.getElementById("payment-section").style.display = "none";
    document.getElementById("report-section").style.display = "none";
  }
  
  
  document.querySelector(".sidebar ul li:first-child").addEventListener("click", () => {
    hideAllSections();
    document.querySelector(".main").style.display = "block";
  });
  
  
  document.getElementById("nav-tenants").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("tenant-section").style.display = "block";
  });
  
  
  document.getElementById("nav-payments").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("payment-section").style.display = "block";
  
    const payments = [
      { name: "Alice Wanjiku", amount: 10000, date: "2025-04-01", method: "M-Pesa" },
      { name: "Brian Otieno", amount: 9500, date: "2025-03-15", method: "Bank Transfer" },
      { name: "Catherine Mwangi", amount: 11000, date: "2025-03-15", method: "Bank Transfer" }
    ];
  
    const tbody = document.getElementById("payments-body");
    tbody.innerHTML = "";
    payments.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.name}</td>
        <td>KSh ${p.amount}</td>
        <td>${p.date}</td>
        <td>${p.method}</td>
      `;
      tbody.appendChild(row);
    });
  });
  
  
  document.getElementById("nav-reports").addEventListener("click", () => {
    hideAllSections();
    document.getElementById("report-section").style.display = "block";
    document.getElementById("report-tenant-count").innerText = tenants.length;
    document.getElementById("report-rent").innerText = "KSh 30500";
    document.getElementById("report-due").innerText = "KSh 9500";
  });
  
  
  const tenants = [
    { name: "Alice Wanjiku", house: "A1", rent: 10000, lastPayment: "2025-04-01", paid: false },
    { name: "Brian Otieno", house: "B3", rent: 9500, lastPayment: "2025-03-15", paid: false },
    { name: "Catherine Mwangi", house: "C2", rent: 11000, lastPayment: "2025-04-03", paid: true }
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
        </td>
      `;
      tbody.appendChild(row);
  
      if (!t.paid) {
        const markPaidBtn = row.querySelector(".mark-paid-btn");
        const statusSpan = row.querySelector("span");
        markPaidBtn.addEventListener("click", () => {
          statusSpan.textContent = "Paid";
          statusSpan.className = "status-paid";
          markPaidBtn.remove();
        });
      }
    });
  }
  
  populateTenants();
  
  
  const modal = document.getElementById("addTenantModal");
  const openBtn = document.getElementById("addTenantBtn");
  const closeBtn = document.getElementById("closeModal");
  const form = document.getElementById("addTenantForm");
  
  openBtn.onclick = () => {
    modal.style.display = "block";
  };
  
  closeBtn.onclick = () => {
    modal.style.display = "none";
  };
  
  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };
  
  form.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const name = document.getElementById("tenantName").value;
    const house = document.getElementById("houseNumber").value;
    const rent = document.getElementById("rentAmount").value;
    const lastPayment = document.getElementById("lastPayment").value;
  
    tenants.push({
      name, house, rent, lastPayment, paid: false
    });
  
    populateTenants();
    modal.style.display = "none";
    form.reset();
  });