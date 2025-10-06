document.addEventListener("DOMContentLoaded", () => {
  // Global variables
  const score = document.getElementById("score")
  const levels = document.querySelectorAll(".main-node")
  const sideNodes = document.querySelectorAll(".side-node")
  const characterArea = document.querySelector(".character-area")
  const characterButtons = document.querySelectorAll(".char-option")

  // Retrieve the score from the local storage
  let userScore = parseInt(localStorage.getItem("userScore")) || 0

  // Set the score in the HTML
  score.textContent = `${userScore} PX`

  // Create a dictionary that must each level and its threshold
  const levelThresholds = {
    "level-1": 0,
    "level-2": 20,
    "level-3": 40,
    "level-4": 60,
  }

  // Function to check the level access
  const checkLevelAccess = () => {
    // I should handle the levels once load
    levels.forEach((level) => {
      // console.log(level)
      const levelId = level.id
      const levelThreshold = levelThresholds[levelId]

      if (userScore < levelThreshold) {
        level.classList.add("locked")
        level.classList.add("disabled-link")
      }
    })
  }

  // Function to handle the style change for the map steps
  const questionNodeStyle = () => {
    // Retreieve the local storage data
    const storedCompletedSteps = localStorage.getItem("completedSteps")

    let completedSteps = storedCompletedSteps
      ? JSON.parse(storedCompletedSteps)
      : {}

    sideNodes.forEach((node) => {
      const level = parseInt(node.dataset.level)
      const question = parseInt(node.dataset.qIndex)

      const key = `level_${level}_step_${question}`

      const checkStep = completedSteps[key]
      if (checkStep) {
        node.classList.add("fill")
      }
    })
  }

  // Function to control the character choices and display
  const controlCharacter = () => {
    // Check if there's a stored character or not
    const storedChar = localStorage.getItem("userCharacter")

    // if there is no stored ode, show the div and store the char
    if (storedChar !== null) {
      characterArea.classList.add("d-none")
    }
  }

  // Function to handle the chosen character
  const clickedChar = (event) => {
    const charName = event.currentTarget.dataset.char

    localStorage.setItem("userCharacter", charName)

    alert(`You have chosen the ${charName}!`)

    characterArea.classList.add("d-none")
  }

  characterButtons.forEach((button) => {
    button.addEventListener("click", clickedChar)
  })
  controlCharacter()
  checkLevelAccess()
  questionNodeStyle()
})
