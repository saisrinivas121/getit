document.addEventListener('DOMContentLoaded', function () {
  const generateBtn = document.querySelector('.generate-btn');
  const copyIcon = document.querySelector('#copyIcon');
  const lengthSlider = document.querySelector("#lengthSlider");
  const options = document.querySelectorAll('input[type="checkbox"]');
  const passwordInput = document.querySelector("#passwordInput");
  const passIndicator = document.querySelector(".pass-indicator");

  const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "^!$%&|[](){}:;.,*+-#@<>~"
  };

  const generatePassword = () => {
    let checkedOptions = 0;
    let staticPassword = "";
    let randomPassword = "";
    let excludeDuplicate = false;
    const passLength = lengthSlider.value;

    options.forEach(option => {
      if (option.checked) {
        checkedOptions++;
        if (option.id !== "exc-duplicate" && option.id !== "spaces") {
          staticPassword += characters[option.id];
        } else if (option.id === "spaces") {
          staticPassword += `  ${staticPassword}  `;
        } else {
          excludeDuplicate = true;
        }
      }
    });

    for (let i = 0; i < passLength; i++) {
      const randomChar = staticPassword[Math.floor(Math.random() * staticPassword.length)];
      if (excludeDuplicate) {
        !randomPassword.includes(randomChar) || randomChar === " " ? randomPassword += randomChar : i--;
      } else {
        randomPassword += randomChar;
      }
    }
    passwordInput.value = randomPassword;
  };

  const updatePassIndicator = () => {
    passIndicator.id = lengthSlider.value <= 8 ? "weak" : lengthSlider.value <= 16 ? "medium" : "strong";
  };

  const updateSlider = () => {
    document.querySelector("#lengthValue").innerText = lengthSlider.value;
    generatePassword();
    updatePassIndicator();
  };

  const copyPassword = () => {
    const passwordToCopy = passwordInput.value;

    // Send the password to the server to store in the database
    fetch('http://localhost:3000/save-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: passwordToCopy }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Password stored successfully:', data);
      })
      .catch(error => {
        console.error('Error storing password:', error);
      });

    navigator.clipboard.writeText(passwordToCopy);
    copyIcon.innerText = "check";
    copyIcon.style.color = "#4285F4";
    setTimeout(() => {
      copyIcon.innerText = "copy_all";
      copyIcon.style.color = "#707070";
    }, 1500);

    alert('Password copied to clipboard!');
  };

  copyIcon.addEventListener("click", copyPassword);
  lengthSlider.addEventListener("input", updateSlider);
  generateBtn.addEventListener("click", generatePassword);

  // Initial setup
  updateSlider();
});
