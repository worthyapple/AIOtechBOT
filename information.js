
const scriptUrl = 'https://script.google.com/macros/s/AKfycbxw1SQd2v0EvOFdysJs4DrfTJDbI8YR2oMFvhp-DkfyR3IQDExmLFeOh_j9NEGV1kZY/exec';
const form = document.forms['customer-details'];
const paySaveButton = document.getElementById('pay-save-button');

paySaveButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form before initiating payment
    if (!form.checkValidity()) {
        alert("Please fill out all required fields.");
        return;
    }

    // Retrieve totalAmount from localStorage
    const subtotal = localStorage.getItem('subtotal');
    if (!subtotal) {
        alert("Total amount not found. Please check your cart.");
        return;
    }

    // Convert totalAmount to paise (1 INR = 100 paise)
    const amountInPaise = parseInt(Math.round(subtotal)) * 100;

    // Razorpay payment options
    const options = {
        "key": "rzp_test_GfQiuQuFzEd15l", // Replace with your Razorpay key
        "amount": amountInPaise.toString(), // Amount in paise
        "currency": "INR",
        "description": "Aiotechbot",
        "image": "img/logo.png",
        "prefill": {
            "email": document.getElementById('email').value,
            "contact": document.getElementById('contact').value,
        },
        "handler": function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id} , PLEASE WAIT FOR THE DETAILS TO BE SAVED`);
            saveDetails(); // Save form details after successful payment
        },
        "modal": {
            "ondismiss": function () {
                if (confirm("Are you sure, you want to close the form?")) {
                    window.location.href = "cart.html";
                    console.log("Checkout form closed by the user");
                } else {
                    console.log("Complete the Payment");
                }
            }
        }
    };

    // Open Razorpay checkout
    const rzp1 = new Razorpay(options);
    rzp1.open();
});


function saveDetails() {
    const formData = new FormData(form);

    const gstAmount = localStorage.getItem('gstAmount');
    const deliveryCharge = localStorage.getItem('deliveryCharge');
    const amount = localStorage.getItem('amount');
    
    formData.append('itemTotal', amount);
    formData.append('gstAmount', gstAmount);
    formData.append('deliveryCharge', deliveryCharge);

    // Get the current date and time in IST
    const now = new Date();
    const options = {
        timeZone: 'Asia/Kolkata', // Indian time zone
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // Use 24-hour format
    };
    const formatter = new Intl.DateTimeFormat('en-IN', options);
    const formattedDateTime = formatter.format(now).replace(',', ''); // Remove the comma for clean output

    formData.append('DateTime', formattedDateTime); // Append it to the form data
    

    fetch(scriptUrl, { method: 'POST', body: formData })
        .then(response => alert("Thank you! Details Saved Successfully."))
        .then(() => window.location.href = "orderPlaced.html")
        .catch(error => console.error('Error!', error.message));
}


