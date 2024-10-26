$(document).ready(function () {
  var currentStep = 0;
  var totalSteps = $(".step").length;

  // Function to show the current step
  function showStep(step) {
    $(".step").hide(); // Hide all steps
    $(".step").eq(step).show(); // Show the current step
  }

  // Initially show the first step
  showStep(currentStep);

  // Move to the next step when clicking "Next"
  $(".next").click(function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep); // Show the next step
        updateProgressBar();
      }
    }
  });

  // Move to the previous step when clicking "Previous"
  $(".prev").click(function () {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep); // Show the previous step
      updateProgressBar();
    }
  });

  // Update the progress bar based on the current step
  function updateProgressBar() {
    $("#progress-bar li").removeClass("active");
    $("#progress-bar li")
      .slice(0, currentStep + 1)
      .addClass("active");
  }

  // Form submission
  $("#multiStepForm").on("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    if (validateStep(currentStep)) {
      // Gather form data
      var formData = $(this).serialize();

      // Send the form data to the PHP script using AJAX
      $.ajax({
        url: "http://localhost/multistep-form-project/php/submit.php",
        type: "POST",
        data: formData,
        success: function (response) {
          // Show success message using SweetAlert
          Swal.fire({
            title: "Success!",
            text: "Your form has been submitted successfully.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              // Reset the form fields
              $("#multiStepForm")[0].reset();

              // Reset back to the first step
              currentStep = 0;
              showStep(currentStep); // Show the first step and reset progress indicator
              updateProgressBar(); // Reset progress bar
            }
          });
        },
        error: function (xhr, status, error) {
          // Show SweetAlert error message in case of failure
          Swal.fire({
            title: "Error!",
            text: "Something went wrong. Please try again.",
            icon: "error",
          });
        },
      });
    }
  });

  // Real-time validation for the current step
  $(".step input, .step select").on("input change", function () {
    validateField($(this)); // Validate only the currently focused field
  });

  // Validate the entire current step when moving to the next step
  function validateStep(step) {
    var isValid = true;
    $(".step")
      .eq(step)
      .find("input, select")
      .each(function () {
        if (!validateField($(this))) {
          isValid = false;
        }
      });
    return isValid; // Return whether the current step is valid
  }

  // Validate a single field
  function validateField(field) {
    var isValid = true;
    var errorElement = $("#" + field.attr("id") + "Error");
    errorElement.text(""); // Clear existing error message

    if (field.is("select")) {
      if (field.val() === "") {
        errorElement.text("This field is required.");
        isValid = false;
      }
    } else if (field.is("input")) {
      if (field.val() === "") {
        errorElement.text("This field is required.");
        isValid = false;
      } else if (field.attr("type") === "number" && field.val() <= 0) {
        errorElement.text("Please enter a positive number.");
        isValid = false;
      } else if (field.attr("type") === "tel") {
        var phonePattern = /^\d{10}$/; // 10-digit phone number
        if (!phonePattern.test(field.val())) {
          errorElement.text("Please enter a valid 10-digit phone number.");
          isValid = false;
        }
      } else if (field.attr("type") === "email") {
        var emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
        if (!emailPattern.test(field.val())) {
          errorElement.text("Please enter a valid email address.");
          isValid = false;
        }
      }
    }

    return isValid; // Return whether the field is valid
  }
});
