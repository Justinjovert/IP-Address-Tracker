


const queryDefault = '63.116.61.253'
const url = `http://ip-api.com/json/${queryDefault}`;



// Change HTML values
const outputDetails = (htmlID, dataString) => {
    const element = document.querySelector(`#${htmlID}`).querySelector(`[data-value]`)
    element.textContent = dataString
}



// Asynchronous 
const fetchFunction = async (urlArgs) => {
    try {
        const response = await fetch(urlArgs)
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        console.log(data)
        if (data.status === 'success') {

            // Checks if div popup exists, delete if it does
            if (document.querySelector('.tooltip')) {
                document.querySelector('.tooltip').remove()
            }

            const {
                query,
                //ip,
                country,
                city,
                timezone,
                /* location: { country, region, timezone }, */
                /* as: { name: isp } */
                isp,
                lat,
                lon
            } = data

            outputDetails('ip-address', query)
            outputDetails('location', city + " " + country)
            outputDetails('timezone', `UTC ${timezone}`)
            outputDetails('isp', isp)
            createMap(lat, lon)
        }
        else {
            createInvalidInput()
        }
    }
    catch (error) {
        console.error("Error fetching data:", error);
    }
}


fetchFunction(url) // Run in default query (My current ip)



// User input keydown "Enter"
const userInput = document.querySelector('.input-container input')

const handleEvent = (input) => {
    if (input) {
        let query = input
        const url = `http://ip-api.com/json/${query}`
        fetchFunction(url)

    }
    else if (!input) {
        // Emptry
    }
}

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        console.log(userInput.value.trim())
        handleEvent(userInput.value.trim())
    }
})

// User input arrow key click
const submitInput = document.querySelector('#submit')
submitInput.addEventListener('click', (e) => {
    handleEvent(userInput.value.trim())
})

// Create map
let map

// Create map Function
const createMap = (latitude, longtitude) => {
    if (map) {
        map.remove() // Remove map
    }
    map = L.map('map').setView([latitude, longtitude], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    L.marker([latitude, longtitude]).addTo(map)
        .openPopup();

}


const inputContainer = document.querySelector('.input-container')

// Create invalid input element
const createInvalidInput = () => {

    if (document.querySelector('.tooltip')) {
        return
    }

    const rect = inputContainer.getBoundingClientRect()
    const errorTooltip = document.createElement('div')
    errorTooltip.style.left = `${rect.left + 10}px`
    errorTooltip.style.top = `${rect.top + 65}px`
    errorTooltip.className = 'tooltip'
    errorTooltip.style.display = 'block'
    errorTooltip.textContent = '⚠️ Please input a valid IP Address'

    inputContainer.parentNode.appendChild(errorTooltip)
}

