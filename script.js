// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCuWTdQuHs_l6rvfzaxvY4y-Uzn0EARRwM",
    authDomain: "athentication-3c73e.firebaseapp.com",
    databaseURL: "https://athentication-3c73e-default-rtdb.firebaseio.com",
    projectId: "athentication-3c73e",
    storageBucket: "athentication-3c73e.appspot.com",
    messagingSenderId: "218346867452",
    appId: "1:218346867452:web:58a57b37f6b6a42ec72579",
    measurementId: "G-3GBM5TSMLS"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  // Wait for the DOM to load
  document.addEventListener("DOMContentLoaded", () => {
    // DOM Elements
    const personSelect = document.getElementById("personSelect");
    const questionsList = document.getElementById("questionsList");
  
    // Fetch data from Firebase
    function fetchPersons() {
      const progressRef = database.ref("progress");
      progressRef.on("value", (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          populatePersonSelect(data);
        } else {
          console.log("No data available");
        }
      });
    }
  
    // Populate person dropdown
    function populatePersonSelect(data) {
      personSelect.innerHTML = '<option value="">-- Select a person --</option>';
      Object.keys(data).forEach((personId) => {
        const personName = Object.keys(data[personId])[0];
        const option = document.createElement("option");
        option.value = `${personId}/${personName}`;
        option.textContent = personName;
        personSelect.appendChild(option);
      });
    }
  
    function fetchStruggledQuestions(path) {
        questionsList.innerHTML = ""; // Clear existing list
        const struggledRef = database.ref(`progress/${path}`);
        
        struggledRef.on("value", (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
      
            // Traverse to 'summary -> struggledQuestions'
            const firstLevel = Object.values(data)[0]; // Navigate to the 'name'
            const secondLevel = Object.values(firstLevel)[0]; // Navigate to the 'uniqueId'
            const session = Object.values(secondLevel)[0]; // Navigate to the 'sessionId'
            const summary = session?.summary?.struggledQuestions || [];
      
            // Pass struggled questions to the display function
            displayQuestions(summary);
          } else {
            console.log("No struggled questions available");
          }
        });
      }
      
  
      function displayQuestions(questions) {
        questions.forEach((questionData, index) => {
          const li = document.createElement("li");
      
          // Extract details from the question object
          const { question, timeSpent, attempts, domain } = questionData;
      
          // Format the display text
          li.innerHTML = `
            <strong>${index + 1}. Question:</strong> ${question}<br>
            <strong>Time Spent:</strong> ${timeSpent} seconds<br>
            <strong>Attempts:</strong> ${attempts}<br>
            <strong>Domain:</strong> ${domain}
          `;
      
          // Append to the list
          questionsList.appendChild(li);
        });
      }
      
  
    // Event listener for person selection
    personSelect.addEventListener("change", (event) => {
      const selectedPath = event.target.value;
      if (selectedPath) {
        fetchStruggledQuestions(selectedPath);
      } else {
        questionsList.innerHTML = ""; // Clear the list if no person selected
      }
    });
  
    // Initialize the application
    fetchPersons();
  });
  