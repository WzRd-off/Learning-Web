document.addEventListener("DOMContentLoaded", function() {

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("header nav a");

    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });


    const testLinks = document.querySelectorAll(".test-link");
    const testDisplayArea = document.getElementById("test-display-area");
    const testPlaceholder = document.querySelector(".test-placeholder");
    
    if (testLinks.length > 0 && testDisplayArea) {
        
        testLinks.forEach(link => {
            link.addEventListener("click", function(event) {
                event.preventDefault(); 
                document.querySelectorAll('.test-block').forEach(block => block.hidden = true);
                if (testPlaceholder) {
                    testPlaceholder.hidden = true;
                }
                
              
                const testId = this.dataset.testId;
                const testToShow = document.getElementById(testId);

                if (testToShow) {
                    testToShow.hidden = false;
                }
            });
        });

        testDisplayArea.addEventListener("click", function(event) {
         
            if (event.target.classList.contains("check-test-btn")) {
                const currentTestBlock = event.target.closest('.test-block');
                const questions = currentTestBlock.querySelectorAll(".question");

                questions.forEach(question => {
                   
                    question.querySelectorAll("label").forEach(label => {
                        label.classList.remove("correct", "incorrect");
                    });

                    const selectedAnswer = question.querySelector("input[type='radio']:checked");
                    const correctAnswerLabel = question.querySelector("label[data-correct='true']");
                    
                    if (selectedAnswer) {
                        const selectedLabel = selectedAnswer.parentElement;
                      
                        if (selectedLabel.dataset.correct === "true") {
                            selectedLabel.classList.add("correct");
                        } else {
                           
                            selectedLabel.classList.add("incorrect");
                            correctAnswerLabel.classList.add("correct");
                        }
                    } else {
                       
                        correctAnswerLabel.classList.add("correct");
                    }
                });
            }
        });
    }

});