document.getElementById("resetcode").addEventListener("input", (event) => {
    if (event.target.value.length > 8) {
        event.target.value = event.target.value.slice(0, 8);
    }
});

document.getElementById("newpasswordform").addEventListener("submit", (event) => {
    event.preventDefault();
    let code = document.getElementById("resetcode").value;
    let Password = document.getElementById("password").value;


    fetch('http://localhost:3000/resetPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password: Password, resetCode: code, userID: sessionStorage.getItem('UserID')})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (!data.error) {
                setTimeout(function () {
                    window.location.href = "../index.html";
                }, 1000)
            }

            if (data.error === "You cannot use the same password as the old one" || data.error === "New Password Doesn't fit the requirements" || data.error === "New Password is required") {
                document.getElementById("passworderror").style.display = "block";
                document.getElementById("passwordform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("passworderror").textContent = data.error;
                document.getElementById("codeerror").style.display = "none";
                document.getElementById("codeform").style.border = "1.5px solid #ecedec";
            }

            if (data.error === "Invalid Reset Code" || data.error === "Reset Code Doesn't fit the requirements" || data.error === "Reset Code is required") {
                document.getElementById("codeerror").style.display = "block";
                document.getElementById("codeform").style.border = "1.5px solid #FF0000FF";
                document.getElementById("codeerror").textContent = data.error;
                document.getElementById("passworderror").style.display = "none";
                document.getElementById("passwordform").style.border = "1.5px solid #ecedec";
            }

        })
        .catch(error => {
            console.error('Error creating account:', error);
        });

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
