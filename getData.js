// Gets data from API
const apiEndpoint = "./OpenDay.json"
// Selects the div in the HTML file to display the data
const display = document.querySelector("#display-data")

// Use JS fetch api to get the open day data
const getData = async () => {
    const response = await fetch(apiEndpoint);
    const data = await response.json();
    return data
}



const displayInfo = async () => {
    // Calls get data to get the payload
    const payload = await getData();
    // Store all the topics from the JSON file to display
    const topics = payload.topics;
    // Get base description and timings to display at the start of the page
    const description = payload.description;
    const start_time = payload.start_time;
    const end_time = payload.end_time;
    // Variable to store HTML to be displayed 
    let dataDisplay = '';

    // Displays general information
    dataDisplay += `
        <div class="description">
            <h1>${description}</h1>
            <p>${start_time} - ${end_time}</p>
            <div class="search-container">
                <input type="text" id="search-input" placeholder="Search for a topic...">
            </div>
        </div>
    `;

    // Map creates a new array of all the topic objects
    dataDisplay += topics.map((object) => {
        // Get basic information to display in cards
        const { name, description, cover_image } = object;
        // Uses map again to make an array of all the programs for each topic
        const programsList = object.programs.map(program => `<li>${program.title} - ${program.room} (${program.start_time} - ${program.end_time})</li>`).join('');
        // Returns HTML to display the data in bootstrap cards to format topics
        return `
            <div class="topic" data-name="${name.toLowerCase()}">
                <div class="card">
                    <img class="card-img-top" src="${cover_image}" alt="${name}">
                    <div class="card-body">
                        <h5 class="card-title">${name}</h5>
                        <p class="card-text">${description}</p>
                        <button class="btn btn-primary programs-btn">Programs</button>
                        <div class="program-list" style="display: none;"> 
                            <ul>${programsList}</ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // data display is added to the div selected from the HTML file
    display.innerHTML = dataDisplay;

    // Event listener to listen for click events
    display.addEventListener('click', (event) => {
        // If a program button is clicked
        if (event.target.classList.contains('programs-btn')) {
            const programList = event.target.nextElementSibling;
            // Sets CSS value to block so programs become visible
            programList.style.display = programList.style.display === 'none' ? 'block' : 'none'; 
        }
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        // Listens to the search input for any changes in input
        // Gets rid of trailing whitespace and converts to lowercase
        const searchValue = searchInput.value.trim().toLowerCase();
        // Selects elements with the class topic (Cards created for topics)
        const topicCards = document.querySelectorAll('.topic');
        // For each elements checks if the name includes the seach value 
        topicCards.forEach(card => {
            const cardName = card.getAttribute('data-name');
            if (cardName.includes(searchValue)) {
                // If True set display to block to show card
                card.style.display = 'block';
            } else {
                // If false set to none to hide card
                card.style.display = 'none';
            }
        });
    });
};


    

displayInfo();
