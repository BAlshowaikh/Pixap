document.addEventListener("DOMContentLoaded", () => {
  const url = new URLSearchParams(window.location.search)
  const levelId = url.get("level")
  let currentStepIndex = 0
  const dots = document.querySelectorAll(".q-dot")
  const messageOverlay = document.querySelector("#message-overlay")
  const messageText = document.querySelector("#message-text")
  const runCodeBtn = document.getElementById("run-code-btn")
  const scoreHTML = document.getElementById("score")
  const codeInput = document.getElementById("code-input")
  let score = 0

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
        document.getElementById("question-title").textContent = step.title
        document.getElementById("instruction-text").textContent =
          step.instruction
        document.getElementById("code-input").value = step.initial_code
        dots.forEach((dot) => {
          dot.title = `Click to jump to ${step.index + 1}.`
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

      // Define a function to handle the automatic flow of questions once "Run code" is clicked
      const advanceStep = () => {
        if (currentStepIndex < levelData.length - 1) {
          currentStepIndex++
          loadStepContent(currentStepIndex)
          updateNavigationDots(currentStepIndex)
        } else {
          displayMessage("Level completed!", true)
          window.location.href = "../map.html"
        }
      }

      // Define a function to show the feedback
      const displayMessage = (message, isSuccess) => {
        console.log("inside display message ")
        messageOverlay.classList.remove("d-none")
        messageText.textContent = message

        if (isSuccess) {
          score += 10
          scoreHTML.textContent = ` ${score} PX`
          // Store it so we can access the score from all pages
          localStorage.setItem("userScore", score)
          // Show for 5 seconds
          setTimeout(() => {
            messageOverlay.classList.add("d-none")
            advanceStep()
          }, 5000)
        } else {
          // In case of wrong answer, hide the overlay div
          setTimeout(() => {
            messageOverlay.classList.add("d-none")
          }, 2000)
        }
      }

      // Define a function to handle the code checker
      const checkUserCode = () => {
        const step = levelData[currentStepIndex]

        // If it's not a question, just continue
        if (step.type !== "question") return

        // Retrive the user code and level expect code and pass them to be normalized before comaprison
        const userCode = normalizeCode(codeInput.value)
        const expectedCode = normalizeCode(step.expected_code)
        // Check if the user code is equal to the correct question code
        if (userCode == expectedCode) {
          displayMessage(step.run_output_message || "Success! Well done.", true)

          // Append the local storage object (to be used in other pages)
          const storedCompletions = localStorage.getItem("completedSteps")

          // Parse json string into JS object
          // Ternary statemnet: If the storedCompletions is not null just parse it to a js object otherwise, initilize an empty object
          let completedSteps = storedCompletions
            ? JSON.parse(storedCompletions)
            : {}

          // Define a key for each step to be stored in local storage
          const stepKey = `level_${levelId}_step_${currentStepIndex}`
          completedSteps[stepKey] = true

          // Convert the updated object back to a JSON string and save it
          localStorage.setItem("completedSteps", JSON.stringify(completedSteps))
        } else {
          displayMessage("Try again :(", false)
        }
      }

      // Function to normalize the codes (user code or json code)
      const normalizeCode = (code) => {
        let newCode = code.toLowerCase()
        // The 'g' flag ensures ALL instances are replaced, not just the first one. and the \n targets a newline character. and \r means that the cursor will be in the start of the current line.
        newCode = newCode.replace(/(\r\n|\n|\r)/g, " ")

        // Collapse multiple whitespace characters (spaces, tabs) into a single space
        // The \s+ regex matches one or more whitespace characters.
        newCode = newCode.replace(/\s+/g, " ")
        newCode = newCode.replace(/\s*([<>])\s*/g, "$1")
        newCode = newCode.trim()
        // console.log(newCode)
        return newCode
      }

      // Call the functions to load the very first step (index 0)
      loadStepContent(currentStepIndex)
      updateNavigationDots(currentStepIndex)

      // Loop through the dots and update the content based on the clicked dot
      dots.forEach((dot) => {
        dot.addEventListener("click", (event) => {
          // This is used to access a custom data attribute named data-index on the HTML element that triggered an event
          currentStepIndex = event.target.dataset.index
          loadStepContent(currentStepIndex)
          updateNavigationDots(currentStepIndex)
        })
      })

      // Add eventlistener to the run code button
      runCodeBtn.addEventListener("click", () => {
        checkUserCode()
      })
    })
})
