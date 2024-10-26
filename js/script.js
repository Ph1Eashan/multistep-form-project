$(document).ready(function () {
  var currentStep = 0;
  var totalSteps = $(".step").length;

  function showStep(step) {
    $(".step").hide();
    $(".step").eq(step).show();
  }

  showStep(currentStep);

  $(".next").click(function () {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps - 1) {
        currentStep++;
        showStep(currentStep);
        updateProgressBar();
      }
    }
  });

  $(".prev").click(function () {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
      updateProgressBar();
    }
  });

  function updateProgressBar() {
    $("#progress-bar li").removeClass("active");
    $("#progress-bar li")
      .slice(0, currentStep + 1)
      .addClass("active");
  }

  $("#multiStepForm").on("submit", function (event) {
    event.preventDefault();

    if (validateStep(currentStep)) {
      var formData = $(this).serialize();

      $.ajax({
        url: "http://localhost/multistep-form-project/php/submit.php",
        type: "POST",
        data: formData,
        success: function (response) {
          Swal.fire({
            title: "Success!",
            text: "Your form has been submitted successfully.",
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed) {
              $("#multiStepForm")[0].reset();

              currentStep = 0;
              showStep(currentStep);
              updateProgressBar();
            }
          });
        },
        error: function (xhr, status, error) {
          Swal.fire({
            title: "Error!",
            text: "Something went wrong. Please try again.",
            icon: "error",
          });
        },
      });
    }
  });

  $(".step input, .step select").on("input change", function () {
    validateField($(this));
  });

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
    return isValid;
  }

  function validateField(field) {
    var isValid = true;
    var errorElement = $("#" + field.attr("id") + "Error");
    errorElement.text("");

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
        var phonePattern = /^\d{10}$/;
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

    return isValid;
  }
});
