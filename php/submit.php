<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // You can validate and process form data here
    $name = $_POST['name'];  // Example: Get the 'name' input from the form
    $email = $_POST['email'];

    // Do any processing (e.g., store data in the database)
    
    // For this example, we just send a success response
    echo json_encode(array("status" => "success", "message" => "Form submitted successfully."));
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request."));
}
?>
