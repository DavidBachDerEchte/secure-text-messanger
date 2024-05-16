document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("rememberEmail") && localStorage.getItem("rememberPassword")) {
        let rememberEmail = localStorage.getItem("rememberEmail");
        let rememberPassword = localStorage.getItem("rememberPassword");

        fetch('http://localhost:3000/rememberLogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({rememberEmail: rememberEmail, rememberPassword: rememberPassword})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                sessionStorage.setItem("UserID", data.UserID);
                window.location.href = "./html/homepage.html";
            })
            .catch(error => {
                console.error('Error logging in:', error);
            });
    }
})


function showPassword() {
    let x = document.getElementById("passwordlogin");
    let passwordimg = document.getElementsByClassName("showpasswordimg")[0];
    if (x.type === "password") {
        x.type = "text";
        passwordimg.src = "./icon/create&login/eyeclose.svg";
    } else {
        x.type = "password";
        passwordimg.src = "./icon/create&login/eyeopen.svg";
    }
}

document.getElementById('loginform').addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("emaillogin").value;
    let password = document.getElementById("passwordlogin").value;
    let remember = document.getElementById("rememberMe").checked;

    fetch('http://localhost:3000/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email, password: password, remember: remember})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if(!data.error) {
                document.getElementById("emailerror").style.display = "none";
                document.getElementById("passworderror").style.display = "none";
                document.getElementById("emailform").style.border = "1.5px solid #ecedec";
                document.getElementById("passwordform").style.border = "1.5px solid #ecedec";
                sessionStorage.setItem("UserID", data.UserID);
                window.location.href = "./html/homepage.html";
            }

            if (data.rememberEmail) {
                localStorage.setItem("rememberEmail", data.rememberEmail);
                localStorage.setItem("rememberPassword", data.rememberPassword);
            }

            if (data.error === "Invalid password") {
                document.getElementById("passwordform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("passworderror").style.display = "block";
                document.getElementById("passworderror").textContent = data.error;
                document.getElementById("emailerror").style.display = "none";
                document.getElementById("emailform").style.border = "1.5px solid #ecedec";
            }
            if (data.error === "Invalid email address") {
                document.getElementById("emailform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("emailerror").style.display = "block";
                document.getElementById("emailerror").textContent = data.error;
                document.getElementById("passworderror").style.display = "none";
                document.getElementById("passwordform").style.border = "1.5px solid #ecedec";
            }
            if (data.error === "Email Doesn't fit the requirements") {
                document.getElementById("emailform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("emailerror").style.display = "block";
                document.getElementById("emailerror").textContent = data.error;
                document.getElementById("passworderror").style.display = "none";
                document.getElementById("passwordform").style.border = "1.5px solid #ecedec";
            }
            if (data.error === "Password Doesn't fit the requirements") {
                document.getElementById("passwordform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("passworderror").style.display = "block";
                document.getElementById("passworderror").textContent = data.error;
                document.getElementById("emailerror").style.display = "none";
                document.getElementById("emailform").style.border = "1.5px solid #ecedec";
            }


        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
})