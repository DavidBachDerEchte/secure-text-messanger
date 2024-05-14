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
    let password = document.getElementById("newpassword").value;
    document.getElementById('slider').value = calculatePasswordStrength(password);
})

document.getElementById("newpassword").addEventListener("focus", (event) => {
    document.getElementsByClassName("passwordsecuritydiv")[0].style.transition = "250ms ease-in-out";
    document.getElementsByClassName("passwordsecuritydiv")[0].style.display = "flex";
})

function showoldPassword() {
    let x = document.getElementById("oldpassword");
    let passwordimg = document.getElementsByClassName("showpasswordimg")[0];
    if (x.type === "password") {
        x.type = "text";
        passwordimg.src = "../icon/create&login/eyeclose.svg";
    } else {
        x.type = "password";
        passwordimg.src = "../icon/create&login/eyeopen.svg";
    }
}

function shownewPassword() {
    let x = document.getElementById("newpassword");
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
    let email = document.getElementById("email").value;
    let oldPassword = document.getElementById("oldpassword").value;
    let newPassword = document.getElementById("newpassword").value;


    fetch('http://localhost:3000/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPassword: oldPassword, oldPassword: newPassword, email: email})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.error) {
                document.getElementById("newpassworderror").style.display = "none";
                document.getElementById("newpasswordform").style.border = "1.5px solid #ecedec";
                sessionStorage.setItem("UserID", data.UserID);
                window.location.href = "../index.html";
            }
            console.log(data);


            if (data.error === "Invalid Email" || data.error === "Invalid Email" || data.error === "Email Doesn't fit the requirements") {
                document.getElementById("emailform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("emailerror").style.display = "block";
                document.getElementById("emailerror").textContent = data.error;
                document.getElementById("oldpassworderror").style.display = "none";
                document.getElementById("oldpasswordform").style.border = "1.5px solid #ecedec";
                document.getElementById("newpassworderror").style.display = "none";
                document.getElementById("newpasswordform").style.border = "1.5px solid #ecedec";
            }
            if (data.error === "Invalid Old Password" || data.error === "Invalid old Password" || data.error === "Old Password Doesn't fit the requirements") {
                document.getElementById("oldpasswordform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("oldpassworderror").style.display = "block";
                document.getElementById("oldpassworderror").textContent = data.error;
                document.getElementById("emailerror").style.display = "none";
                document.getElementById("emailform").style.border = "1.5px solid #ecedec";
                document.getElementById("newpassworderror").style.display = "none";
                document.getElementById("newpasswordform").style.border = "1.5px solid #ecedec";
            }
            if (data.error === "Invalid new Password" || data.error === "New Password Doesn't fit the requirements") {
                document.getElementById("newpasswordform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("newpassworderror").style.display = "block";
                document.getElementById("newpassworderror").textContent = data.error;
                document.getElementById("emailerror").style.display = "none";
                document.getElementById("emailform").style.border = "1.5px solid #ecedec";
                document.getElementById("oldpassworderror").style.display = "none";
                document.getElementById("oldpasswordform").style.border = "1.5px solid #ecedec";
            }

        })
        .catch(error => {
            console.error('Error creating account:', error);
        });
});