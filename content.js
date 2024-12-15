// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  let mainContainer = document.getElementById("mainContainer");
  let containerBest = document.getElementById("containerBest");
  let containerItems = document.getElementById("containerItems");

  // Check if the containers exist
  if (!mainContainer || !containerBest || !containerItems) {
    console.error("One or more container elements are missing in the HTML!");
    return;
  }

  // Function to dynamically generate a section
  function dynamicBestSection(ob) {
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    boxLink.href = "/contentDetails.html?" + ob.id;

    let imgTag = document.createElement("img");
    imgTag.src = ob.preview;

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3 = document.createElement("h3");
    let h3Text = document.createTextNode(ob.name);
    h3.appendChild(h3Text);

    let h4 = document.createElement("h4");
    let h4Text = document.createTextNode(ob.brand);
    h4.appendChild(h4Text);

    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode("Rs " + ob.price.toFixed(2)); // Display price with two decimal places
    h2.appendChild(h2Text);

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(h4);
    detailsDiv.appendChild(h2);

    return boxDiv;
  }

  // Backend API call to fetch products data
  let httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          // Parse the JSON response
          let contentTitle = JSON.parse(this.responseText);

          // Update badge counter if available in cookies
          if (document.cookie.indexOf(",counter=") >= 0) {
            let counter = document.cookie.split(",")[1].split("=")[1];
            document.getElementById("badge").innerHTML = counter;
          }

          // Dynamically render products into Best or Items
          for (let i = 0; i < contentTitle.length; i++) {
            if (contentTitle[i].isAccessory) {
              containerItems.appendChild(dynamicBestSection(contentTitle[i]));
            } else {
              containerBest.appendChild(dynamicBestSection(contentTitle[i]));
            }
          }
        } catch (error) {
          console.error("Error parsing JSON response:", error);
        }
      } else {
        console.error("API call failed with status:", this.status);
      }
    }
  };

  // Replace the API URL with your correct JSON file path
  httpRequest.open("GET", "./products.json", true);
  httpRequest.send();
});
