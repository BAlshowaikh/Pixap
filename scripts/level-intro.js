document.addEventListener("DOMContentLoaded", () => {
  // Code for the levels navigation

  // Get the level ID from the url
  // Note to me:
  // * URLSearchParams interface is a JavaScript tool that lets you easily read, write, and manipulate the parameters
  // * window.location.search is a property that returns the query string portion of the current URL
  const url = new URLSearchParams(window.location.search)
  const levelId = url.get("level")
  const deployedURL = "https://pixap.surge.sh/"

  // Check if the level param is empty
  if (!levelId) {
    console.error("Level ID not found in URL.")
    window.location.href = "map.html"
    return
  }

  // Fetch the data from json file
  fetch("./data/level-intro.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error. Status: ${response.status}`)
      }
      // Start the process of reading the data body as JSON and parse to JavaScript object
      return response.json()
    })
    .then((data) => {
      const levelData = data[levelId]

      if (!levelData) {
        console.error(`Data for Level ID ${levelId} not found.`)
        return
      }
      // Determine the base URL dynamically:
      // "http://127.0.0.1:5500" OR "https://pixap.surge.sh"

      const baseURL = window.location.origin
      // If no errors found, update html
      // document.getElementById("level-title").textContent = levelData.title
      document.getElementById("level-paragraph").textContent =
        levelData.paragraph
      document.getElementById("level-icon").classList.add(levelData.iconClass)
      document.getElementById(
        "level-num-label"
      ).textContent = `Level ${levelId}`
      document.getElementById(
        "start-quiz-button"
      ).href = `${baseURL}/question.html?level=${levelId}`
    })
})

//`http://127.0.0.1:5500/question.html?level=${levelId}`
