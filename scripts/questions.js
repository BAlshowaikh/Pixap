document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search)
  const levelId = url.get("level")
  let currentStepIndex = 0
  const dots = document.querySelectorAll(".q-dot")

  // This will hold the level info once it has been fetched
  let levelData = null

  // Check if the fetched level id exist or not
  if (!levelId) {
    console.error("Level ID not found in URL.")
    window.location.href = "map.html"
    return
  }

  // start fetching the data
  fetch("../data/questions.json")
    .then((response) => {
      if (!response.ok) {
        throw Error(`HTTP error. Status: ${response.status}`)
      }
      // This converts the returned json body into a JS object
      return response.json()
    })
    .then((data) => {
      // Extract the level's array
      levelData = data["level_" + levelId]
      if (!levelData) {
        console.error(`Data for Level ID ${levelId} not found.`)
        return
      }
      // If no errors found, update html
      const loadStepContent = (clickedDotIndex) => {
        const step = levelData[clickedDotIndex]
        console.log("This is from loadStepContent function")
        console.log(`Level data for ${clickedDotIndex}`)
        console.log(`Data ${step} `)
        document.getElementById("question-title").textContent = step.title
        document.getElementById("instruction-text").textContent =
          step.instruction
        document.getElementById("code-input").value = step.initial_code
        dots.forEach((dot) => {
          dot.title = `Click to jump to ${step.index+1}.`
        })

      }

      // Function to manage the dots
      const updateNavigationDots = (clickedDotIndex) => {
        // const dots = document.querySelectorAll(".q-dot")
        dots.forEach((dot) => {
          dot.classList.remove("active")
        })
        dots[clickedDotIndex].classList.add("active")
      }

      // Call the functions to load the very first step (index 0)
      loadStepContent(currentStepIndex)
      updateNavigationDots(currentStepIndex)

      // Loop through the dots and update the content based on the clicked dot
      dots.forEach((dot) => {
        dot.addEventListener("click", (event) => {
          currentStepIndex = event.target.dataset.index
          loadStepContent(currentStepIndex)
          updateNavigationDots(currentStepIndex)
        })
      })
    })
})
