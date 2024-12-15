

console.clear();

// Update badge counter if the cookie exists
if (document.cookie.indexOf(',counter=') >= 0) {
    let counter = document.cookie.split(',')[1].split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

let cartContainer = document.getElementById('cartContainer');
let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';
let cartItems = []; // Array to store cart items with their details

// Function to dynamically create cart section
function dynamicCartSection(ob, itemCounter) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';
    boxContainerDiv.appendChild(boxDiv);

    // Item image
    let boxImg = document.createElement('img');
    boxImg.src = ob.preview;
    boxDiv.appendChild(boxImg);

    // Item name and quantity
    let boxh3 = document.createElement('h3');
    let h3Text = document.createTextNode(`${ob.name} × ${itemCounter}`);
    boxh3.appendChild(h3Text);
    boxDiv.appendChild(boxh3);

    // Item price
    let boxh4 = document.createElement('h4');
    let h4Text = document.createTextNode(`Amount: Rs ${ob.price}`);
    boxh4.appendChild(h4Text);
    boxDiv.appendChild(boxh4);

    cartContainer.appendChild(boxContainerDiv);
    cartContainer.appendChild(totalContainerDiv);

    return cartContainer;
}

// Create the total section
let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
let h2Text = document.createTextNode('Total Amount');
totalh2.appendChild(h2Text);
totalDiv.appendChild(totalh2);




// Function to update total amount including GST and delivery charge
function amountUpdate(amount) {
    
    // Calculate GST
    let gstAmount = (amount * 0.18).toFixed(2);
    localStorage.setItem('gstAmount', gstAmount);

    // Calculate Delivery Charge
    let deliveryCharge = amount > 499 ? 0 : 60;
    localStorage.setItem('deliveryCharge', deliveryCharge);

    // Update Subtotal
    let subtotal = (parseFloat(amount) + parseFloat(gstAmount) + parseFloat(deliveryCharge)).toFixed(2);

    // Total amount section
    let totalh4 = document.getElementById('toth4');
    if (!totalh4) {
        totalh4 = document.createElement('h4');
        totalh4.id = 'toth4';
        totalDiv.appendChild(totalh4);
    }
    totalh4.textContent = `Amount: Rs ${amount}`;
    localStorage.setItem('amount', amount);

    // GST section
    let gsth4 = document.getElementById('gsth4');
    if (!gsth4) {
        gsth4 = document.createElement('h4');
        gsth4.id = 'gsth4';
        totalDiv.appendChild(gsth4);
    }
    gsth4.textContent = `GST (18%): Rs${gstAmount}`;

    
    // Delivery charge section with tooltip
    let deliveryh4 = document.getElementById('deliveryh4');
    if (!deliveryh4) {
        deliveryh4 = document.createElement('h4');
        deliveryh4.id = 'deliveryh4';
        let deliveryTooltip = document.createElement('span');
        deliveryTooltip.id = 'deliveryTooltip';
        deliveryTooltip.textContent = 'ℹ';
        deliveryTooltip.title = 'Basic delivery charge for orders below Rs 499. Free delivery for orders above Rs 499.';
        deliveryh4.appendChild(deliveryTooltip);

        
        totalDiv.appendChild(deliveryh4);
    }
    deliveryh4.textContent = `Delivery Charge: Rs ${deliveryCharge}`;

    

    // Subtotal section
    let subtotalh4 = document.getElementById('subtotalh4');
    if (!subtotalh4) {
        subtotalh4 = document.createElement('h4');
        subtotalh4.id = 'subtotalh4';
        totalDiv.appendChild(subtotalh4);
    }
    subtotalh4.textContent = `To Pay: Rs ${subtotal}`;
    localStorage.setItem('subtotal', subtotal); // Store subtotal in localStorage


    // Append Place Order button
    totalDiv.appendChild(buttonDiv);

    console.log("Total Amount:", totalh4, "GST:", gsth4, "Delivery Charge:", deliveryh4, "Subtotal:", subtotalh4);
}


// Create the Place Order button
let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';
totalDiv.appendChild(buttonDiv);

let buttonTag = document.createElement('button');
buttonDiv.appendChild(buttonTag);

let buttonLink = document.createElement('a');
buttonLink.href = '/information.html';
buttonTag.appendChild(buttonLink);

let buttonText = document.createTextNode('Place Order');
buttonLink.appendChild(buttonText);

buttonTag.onclick = function () {
    console.log("Place Order button clicked");
};

let clearCartButton = document.createElement('button');
clearCartButton.id = 'clearCartButton';

let clearCartLink = document.createElement('a');
clearCartLink.href = '#';
clearCartButton.appendChild(clearCartLink);

let clearCartText = document.createTextNode('Clear Cart');
clearCartLink.appendChild(clearCartText);

clearCartButton.onclick = function () {
    console.log("Clear Cart button clicked");

    // Reset cart details
    cartItems = [];
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('totalAmount', '0');
    document.cookie = "orderId=0; counter=0";

    // Update the badge in localStorage
    localStorage.setItem('badgeCount', '0');

    // Update the DOM on the current page
    document.getElementById("badge").innerHTML = '0';
    document.getElementById("totalItem").innerHTML = 'Total Items: 0';

    // Clear cart container
    cartContainer.innerHTML = '';
    // cartContainer.appendChild(totalContainerDiv);

    // Reset total amount
    amountUpdate(0);

    // Broadcast an event to update badges across open tabs
    window.dispatchEvent(new Event('storage'));
};

// Listen for badge updates on all pages
window.addEventListener('storage', function () {
    const badgeCount = localStorage.getItem('badgeCount') || '0';
    const badgeElement = document.getElementById("badge");
    if (badgeElement) {
        badgeElement.innerHTML = badgeCount;
    }
});


// Append Clear Cart button below Place Order button
buttonDiv.appendChild(clearCartButton);


// Fetch data from the local JSON file
fetch('./products.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load local data');
        }
        return response.json();
    })
    .then(contentTitle => {
        let counter = Number(document.cookie.split(',')[1].split('=')[1]);
        document.getElementById("totalItem").innerHTML = `Total Items: ${counter}`;

        let items = document.cookie.split(',')[0].split('=')[1].split(" ");
        console.log("Counter:", counter);
        console.log("Items:", items);

        let totalAmount = 0;

        for (let i = 0; i < counter; i++) {
            let itemCounter = 1;

            for (let j = i + 1; j < counter; j++) {
                if (Number(items[j]) === Number(items[i])) {
                    itemCounter += 1;
                }
            }

            let product = contentTitle[items[i] - 1]; // Access the product details
            totalAmount += Number(product.price) * itemCounter;

            dynamicCartSection(product, itemCounter);

            // Store item details in cartItems array
            cartItems.push({ 
                name: product.name, 
                quantity: itemCounter 
            });

            i += (itemCounter - 1); // Skip processed items
        }

        amountUpdate(totalAmount.toFixed(2));

        // Store the cart items in localStorage as a string
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
