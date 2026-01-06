# George's Rental Management System (GRMS)

## Overview

George's Rental Management System (GRMS) is a web-based application designed to support the management of rental properties. The system assists landlords and property managers in handling tenants, tracking rent payments, generating reports, and managing user access in a structured and efficient manner.

GRMS was developed as an academic project and follows formal software engineering documentation standards, including a Proposal, Software Requirements Specification (SRS), Software Design Specification (SDS), Test Plan, and User Manual.

---

## System Objectives

- To digitize and simplify rental property management processes
- To provide accurate tracking of tenants and rent payments
- To generate structured reports for decision-making
- To ensure secure access through user authentication
- To demonstrate practical application of system analysis and design concepts

---

## Key Features

- User authentication and role-based access
- Tenant management (add, view, update tenant records)
- Rent tracking and payment status monitoring
- Report generation (rent summaries and tenant-related reports)
- Dashboard with summarized system information

> Note: Only features defined in the Proposal, SRS, and SDS are implemented. No additional functionality is assumed.

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Node.js (Express)

### Database

- MySQL (or mock JSON data for demonstration purposes)

### Tools and Environment

- Visual Studio Code
- Node Package Manager (npm)

---

## Project Structure

```
GRMS/
├── public/
│   ├── css/
│   ├── js/
│   └── assets/
├── views/
│   ├── login.html
│   ├── dashboard.html
│   ├── tenants.html
│   ├── rent.html
│   └── reports.html
├── data/
│   └── data.json
├── server.js
├── package.json
└── README.md
```

---

## Installation and Setup

1. Clone or download the project files
2. Open the project folder in Visual Studio Code
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

5. Access the system through the browser at:

   ```
   http://localhost:3000
   ```

---

## Database Notes

- The system can operate using a MySQL database or mock JSON data
- Mock data is used for demonstration and academic evaluation purposes
- All calculations and records are visible through the system interface

---

## Documentation

The following documents are available as part of the project:

- Project Proposal
- Software Requirements Specification (SRS)
- Software Design Specification (SDS)
- Test Plan and Test Procedures
- User Manual

These documents describe the system scope, design, implementation, and testing in detail.

---

## Limitations

- The system is designed for academic and demonstration purposes
- Payment processing is simulated
- No third-party integrations are included

---

## Future Enhancements

- Integration with real payment gateways
- Notification and alert system
- Advanced analytics and reporting
- Mobile application support

---

## Author

**Mitchelle Wakwaya**

---

## License

This project is developed strictly for academic purposes and is not intended for commercial use.
