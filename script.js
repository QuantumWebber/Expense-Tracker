// prevent default
document.getElementById("expense").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevents form submission and page reload

    // Get form values
    const expenseName = document.getElementById("expense-name").value.trim();
    const expenseAmount = document.getElementById("expense-amount").value.trim();
    const expenseCategory = document.getElementById("expense-category").value;
    const expenseDate = document.getElementById("expense-date").value;

    // Ensure all fields are filled
    if (!expenseName || !expenseAmount || !expenseCategory || !expenseDate) {
        alert("Please fill all the fields.");
        return;
    }

    // Reference the table's tbody
    const tableBody = document.querySelector("table tbody");

    // Create a new row
    const newRow = document.createElement("tr");

    // Add cells to the new row
    newRow.innerHTML = `
        <td>${expenseName}</td>
        <td>${expenseAmount}</td>
        <td>${expenseCategory}</td>
        <td>${expenseDate}</td>
        <td>
            <button onclick="editRow(this)">Edit</button>
            <button onclick="deleteRow(this)">Delete</button>
        </td>
    `;

    // Append the new row to the table body
    tableBody.appendChild(newRow);

    // Clear the form fields after submission
    document.getElementById("expense-name").value = "";
    document.getElementById("expense-amount").value = "";
    document.getElementById("expense-category").selectedIndex = 0; // Default category
    document.getElementById("expense-date").value = "";

    // Optionally, update the total expenses
    saveData();
    updateTotal();
});

function editRow(button) {
    // Get the current row
    const row = button.closest("tr");

    // Get all cells in the row
    const cells = row.querySelectorAll("td");

    // Convert each cell (except the "Action" cell) into an editable input
    for (let i = 0; i < cells.length - 1; i++) {
        const currentText = cells[i].textContent; // Get current text
        cells[i].innerHTML = `<input type="text" value="${currentText}" style="width: 100%;">`; // Replace with input
    }

    // Replace "Edit" button with "Save" button
    button.textContent = "Save";
    button.onclick = function () {
        saveRow(button); // Call saveRow function when "Save" is clicked
    };
}

function saveRow(button) {
    // Get the current row
    const row = button.closest("tr");

    // Get all cells in the row
    const cells = row.querySelectorAll("td");

    // Loop through each cell (except the last one)
    for (let i = 0; i < cells.length - 1; i++) {
        const input = cells[i].querySelector("input"); // Find the input
        if (input && !input.value.trim()) {
            alert("All fields must have values.");
            return;
        }
        cells[i].textContent = input.value.trim(); // Replace input with its value
    }

    // Replace "Save" button back to "Edit"
    button.textContent = "Edit";
    button.onclick = function () {
        editRow(button); // Bind back to editRow function
    };

    saveData(); // Save after editing
}

// delete functionality
function deleteRow(button) {
    // Find the closest <tr> (row) element containing the button and remove it
    const row = button.closest("tr");
    row.remove();

    // Optionally update the total expenses after deleting a row
    saveData();
    updateTotal();
}

function updateTotal() {
    let total = 0;
    const rows = document.querySelectorAll("table tbody tr");

    for (let row of rows) {
        // Accessing the second <td> element, assuming amount is in the second column
        const expenseAmount = row.cells[1].textContent;
        total += parseFloat(expenseAmount) || 0; // Converting text to number and handling invalid input
    }

    // Update the total in the element with the class "total"
    document.querySelector(".total").textContent = `Total=₹${total}`;
}

// filter by category
function filterByCategory() {
    const selectedCategory = document.getElementById("categoryFilter").value.trim().toLowerCase();
    const rows = document.querySelectorAll("table tbody tr");

    rows.forEach(row => {
        const category = row.cells[2].textContent.trim().toLowerCase();
        row.style.display = (selectedCategory === "all" || category === selectedCategory) ? "" : "none";
    });
}

function saveData() {
    const rows = document.querySelectorAll("table tbody tr");
    const tableData = [];

    rows.forEach(row => {
        const expenseName = row.cells[0].textContent;
        const expenseAmount = row.cells[1].textContent;
        const expenseCategory = row.cells[2].textContent;
        const expenseDate = row.cells[3].textContent;

        tableData.push({ expenseName, expenseAmount, expenseCategory, expenseDate });
    });

    localStorage.setItem("tableData", JSON.stringify(tableData));
}

// Load Table Data from LocalStorage
function loadData() {
    const storedData = localStorage.getItem("tableData");
    if (storedData) {
        const tableData = JSON.parse(storedData);
        const tableBody = document.querySelector("table tbody");

        tableData.forEach(data => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${data.expenseName}</td>
                <td>${data.expenseAmount}</td>
                <td>${data.expenseCategory}</td>
                <td>${data.expenseDate}</td>
                <td>
                    <button onclick="editRow(this)">Edit</button>
                    <button onclick="deleteRow(this)">Delete</button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });

        updateTotal(); // Update the total on page load
    }
}

// Call loadData on page load
window.onload = loadData;
