document.getElementById('createform').addEventListener("submit", (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    fetch('http://localhost:3000/sendResetCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: email})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem('UserID', data.userID);
            setTimeout(function () {
                window.location.href = "./newpassword.html";
            },1000)
        })
        .catch(error => {
            console.error('Error creating account:', error);
        });

})