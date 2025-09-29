/********************************************************************************
*  WEB700 – Assignment 1
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Dev Mihir Patel    Student ID: 143122240    Date: 2025-09-14
*
********************************************************************************/

// Step 3: Creating the "Server" Arrays
const serverMethods = ["GET", "GET", "GET", "POST", "GET", "POST"];
const serverRoutes  = ["/", "/store", "/store-admin", "/register", "/developer", "/login"];
const serverResponses = [
  "Home",
  "Main Storefront",
  "Manage Products",
  "Registered New User",
  "Developed by: Dev Patel: dmpatel88@myseneca.ca",
  "User Logged In"
];

// Step 4: Creating the "web server simulator" Function - "processRequest" 
function processRequest(method, route) {
  for (let i = 0; i < serverRoutes.length; i++) {
    if (serverMethods[i] === method && serverRoutes[i] === route) {
      return `200: ${serverResponses[i]}`;
    }
  }
  return `404: Unable to process ${method} request for ${route}`;
}

// Step 5: Manually Testing the "processRequest" Function
console.log(processRequest("GET", "/"));                 // expected: 200: Home
console.log(processRequest("GET", "/developer"));        // expected: 200: Developed by: Dev Patel: dmpatel88@myseneca.ca
console.log(processRequest("POST", "/"));                // expected: 404: Unable to process POST request for /

// Utility function from MDN: returns integer 0 .. max-1
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Step 6: Automating the Tests by creating a "testRequests" Function
function testRequests() {
  const testMethods = ["GET", "POST"];
  const testRoutes  = [
    "/", "/store", "/store-admin", "/register", "/developer", "/login", "/notFound1", "/notFound2"
  ];

  function randomRequest() {
    const randMethod = testMethods[getRandomInt(testMethods.length)];
    const randRoute  = testRoutes [getRandomInt(testRoutes.length)];
    console.log(processRequest(randMethod, randRoute));
  }

  // repeat every 1000ms (1 second)
  setInterval(randomRequest, 1000);
}

// Step 7: Invoke the "testRequests" function   
testRequests();
