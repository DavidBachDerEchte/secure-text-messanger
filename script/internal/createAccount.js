function calculatePasswordStrength(password) {
    let passwordStrength = 0;
    let lowercase = false;
    let uppercase = false;
    let number = false;
    let special = false;
    let passwordlength = false;

    // Add points for each condition met
    if (/(?=.*[a-z])/.test(password)) {
        passwordStrength += 1;
        lowercase = true;
    }
    if (/(?=.*[A-Z])/.test(password)) {
        passwordStrength += 1;
        uppercase = true;
    }
    if (/(?=.*\d)/.test(password)) {
        passwordStrength += 1;
        number = true;
    }
    if (/(?=.*[!@#$%^&*()_+{}|:"<>?~`\-=[\]\\;',./])/.test(password)) {
        passwordStrength += 1;
        special = true;
    }

    // Add extra points for length
    passwordStrength += Math.min(2, Math.floor(password.length / 10));

    if (password.length >= 10) {
        passwordlength = true;
    }

    // Display password slider
    let slider = document.getElementById("slider");
    const fraction = passwordStrength / parseFloat(slider.max);
    const color = `linear-gradient(90deg, #59EA00 ${fraction * 100}%, #D3D3D3FF ${fraction * 100}%)`;
    slider.style.background = color;

    if (passwordlength === true) {
        document.getElementById("charlength").firstElementChild.src = "../icon/create&login/haken.svg";
    } else {
        document.getElementById("charlength").firstElementChild.src = "../icon/create&login/X.svg";
    }

    if (lowercase === true) {
        document.getElementById("charlower").firstElementChild.src = "../icon/create&login/haken.svg";
    } else {
        document.getElementById("charlower").firstElementChild.src = "../icon/create&login/X.svg";
    }

    if (uppercase === true) {
        document.getElementById("charupper").firstElementChild.src = "../icon/create&login/haken.svg";
    } else {
        document.getElementById("charupper").firstElementChild.src = "../icon/create&login/X.svg";
    }

    if (number === true) {
        document.getElementById("charnum").firstElementChild.src = "../icon/create&login/haken.svg";
    } else {
        document.getElementById("charnum").firstElementChild.src = "../icon/create&login/X.svg";
    }

    if (special === true) {
        document.getElementById("charspecial").firstElementChild.src = "../icon/create&login/haken.svg";
    } else {
        document.getElementById("charspecial").firstElementChild.src = "../icon/create&login/X.svg";
    }

    return passwordStrength;
}

document.addEventListener("input", (event) => {
    let password = document.getElementById("password").value;
    document.getElementById('slider').value = calculatePasswordStrength(password);
})

document.getElementById("password").addEventListener("focus", (event) => {
    document.getElementsByClassName("passwordsecuritydiv")[0].style.transition = "250ms ease-in-out";
    document.getElementsByClassName("passwordsecuritydiv")[0].style.display = "flex";
})

function showPassword() {
    let x = document.getElementById("password");
    let passwordimg = document.getElementsByClassName("showpasswordimg")[0];
    if (x.type === "password") {
        x.type = "text";
        passwordimg.src = "../icon/create&login/eyeclose.svg";
    } else {
        x.type = "password";
        passwordimg.src = "../icon/create&login/eyeopen.svg";
    }
}


document.getElementById('createform').addEventListener("submit", (event) => {
    event.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;


    fetch('http://localhost:3000/createLogin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: username, password: password, email: email})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById("emailform").style.border = "1.5px solid #FF0000FF";
            document.getElementById("emailerror").style.display = "block";
            document.getElementById("emailerror").textContent = data.error;
            // sessionStorage.setItem("UserID", data.UserID);
            // window.location.href = "./chatselection.html";
        })
        .catch(error => {
            console.error('Error creating account:', error);
        });
});