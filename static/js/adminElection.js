// Global error handling
window.addEventListener("error", function (event) {
  console.log("error");
  const errorData = {
    message: event.message,
    filename: event.filename,
    lineNumber: event.lineno,
    columnNumber: event.colno,
    error: event.error ? event.error.stack : null,
  };
  console.log(errorData);

  // Send the error data to your server (via an API endpoint)
  fetch("/log/error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorData),
  })
    .then((response) => {
      // Handle response if needed
    })
    .catch((error) => {
      console.error("Error sending error data:", error);
    });
});

// Bootstrap validation
(() => {
  "use strict";

  // Fetch all forms to apply custom Bootstrap validation styles
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission if invalid
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// Open popup
document
  .querySelector("#btnAddNewElection")
  .addEventListener("click", function () {
    resetForm(); // Reset form fields before showing the popup
    document.querySelector(".popup").classList.add("active");
  });

// Reset form fields
function resetForm() {
  const form = document.querySelector(".popup form");
  if (form) {
    form.reset(); // Use the built-in reset method of the form element
  }
}

// Close popup and reload the page
document
  .querySelector(".popup .close-btn")
  .addEventListener("click", function () {
    document.querySelector(".popup").classList.remove("active");
    window.location.reload(); // Reloads the current page
  });

// Delete an election
function deleteElection(id) {
  const confirmation = confirm(
    "Are you sure you want to delete this election?"
  );
  if (confirmation) {
    try {
      // Make a DELETE request to the API endpoint
      fetch(`/election/delete/${id}`, { method: "DELETE" })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete the election");
          } else {
            // Remove the corresponding row from the table
            const rowToRemove = document.getElementById(`electionRow_${id}`);
            if (rowToRemove) {
              rowToRemove.remove();
            }
          }
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      // Trigger global error handling
      throw new Error(error);
    }
  }
}

// Edit an election
function editElection(
  id,
  name,
  electionType,
  province,
  city,
  region,
  description,
  startDate,
  endDate
) {
  // Set the form fields with the provided data
  document.getElementById("validationCustom01").value = name || "";
  document.getElementById("validationCustom02").value =
    formatDate(startDate) || "";
  document.getElementById("validationCustom03").value =
    formatDate(endDate) || "";
  document.getElementById("validationCustom07").value = electionType || "";
  document.getElementById("validationCustom08").value = description || "";

  // Set select elements for province, city, and region
  document.getElementById("validationCustom04").value = province || "";
  document.getElementById("validationCustom05").value = city || "";
  document.getElementById("validationCustom06").value = region || "";

  // Set the popup to edit mode
  const popup = document.querySelector(".popup");
  popup.setAttribute("data-mode", "edit");
  popup.classList.add("active");

  // Handle form submission
  const form = document.querySelector(".popup form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    console.log("data", data);

    // Make a PUT request to the edit API endpoint
    fetch(`/election/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Election updated successfully");
        } else {
          console.error("Failed to update the election");
          throw new Error("Failed to update the election");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        throw new Error(error);
      });
  });
}

// Format date to YYYY-MM-DD
function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}
