document.addEventListener("DOMContentLoaded", function () {
    let parent = document.getElementById("friendform");
    let label = document.createElement("label");
    label.textContent = "User: " + sessionStorage.getItem("senderusername") + "#" + sessionStorage.getItem("SenderUserID") + " would like to be your friend.";

    let formTwo = document.createElement("div");
    formTwo.classList.add("form-two");

    let button = document.createElement("button");
    button.classList.add("button-submit-two");
    button.textContent = "Accept";
    button.onclick = function (e) {
        e.preventDefault();
        acceptFriend();
    }

    let buttonTwo = document.createElement("button");
    buttonTwo.classList.add("button-submit-two");
    buttonTwo.textContent = "Decline";
    buttonTwo.onclick = function (e) {
        e.preventDefault();
        declineFriend();
    }


    formTwo.appendChild(button);
    formTwo.appendChild(buttonTwo);
    parent.appendChild(label);
    parent.appendChild(formTwo);
})


function acceptFriend() {
    fetch('http://localhost:3000/acceptFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({myuserID: sessionStorage.getItem("UserID"), senderUserID: sessionStorage.getItem("SenderUserID"), senderusername: sessionStorage.getItem("senderusername")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success === true) {
                sessionStorage.clear();
                window.location.href = "../index.html";
            }
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
}

function declineFriend() {
    fetch('http://localhost:3000/declineFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({myuserID: sessionStorage.getItem("UserID"), senderUserID: sessionStorage.getItem("SenderUserID"), senderusername: sessionStorage.getItem("senderusername")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success === true) {
                sessionStorage.clear();
                window.location.href = "../index.html";
            }
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
}