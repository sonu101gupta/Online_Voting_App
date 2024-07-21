// Global error handling for unhandled errors
window.addEventListener("error", function (event) {
  console.log("Error:", event.message);
  const errorData = {
    message: event.message,
    filename: event.filename,
    lineNumber: event.lineno,
    columnNumber: event.colno,
    error: event.error ? event.error.stack : null,
  };
  console.log("Error Data:", errorData);

  // Send the error data to your server
  fetch("/log/error", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(errorData),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Failed to send error data");
      }
    })
    .catch((error) => {
      console.error("Error sending error data:", error);
    });
});

// Bootstrap form validation
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

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

// Function to handle account edits
function editAccount(id) {
  const form = document.querySelector(".formContainer form");

  // Check if form is valid before submitting
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return; // Stop if the form is not valid
  }

  // Get form data
  const formData = new FormData(form);
  const data = {};
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }

  // Perform update requests
  Promise.all([
    fetch(`/users/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
    fetch(`/userDetails/edit/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }),
  ])
    .then((responses) => {
      return Promise.all(
        responses.map((response) => {
          if (!response.ok) {
            throw new Error(`Failed to update ${response.url}`);
          }
          return response.json();
        })
      );
    })
    .then((results) => {
      console.log("Update successful:", results);
      // Additional handling for successful updates if needed
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// Function to format dates
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
