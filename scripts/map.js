document.addEventListener("DOMContentLoaded", () => {
  // Global variables
  const score = document.getElementById("score")
  const levels = document.querySelectorAll(".main-node")

  // Retrieve the score from the local storage
  let userScore = parseInt(localStorage.getItem("userScore")) || 0

  // Set the score in the HTML
  score.textContent = userScore

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

  checkLevelAccess()
})
