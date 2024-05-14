let username = false;
let chatcodeglobal = false;


function joinChat() {
    let UserID = sessionStorage.getItem("UserID");
    let Chatcode = document.getElementById("JoinChat").value;


    if (Chatcode === "") {
        chatcodeglobal = false;
    }

    if (UserID === "") {
        username = false;
    }

    // Fetch request options
    const requestOptionsInsert = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({UserID: UserID, chatcode: Chatcode})
    };

    // Sent username to server
    fetch('http://localhost:3000/joinChat', requestOptionsInsert)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            chatcodeglobal = true;
            console.log(data.message);
            sessionStorage.setItem("username", data.username);
            goon();
        })
        .catch(error => {
            console.error('Error creating user:', error);
        });

}

function goon() {
    let Chatcode = document.getElementById("JoinChat").value;

    if (chatcodeglobal === true) {
        sessionStorage.setItem("chatcode", Chatcode);
        window.location.href = "./chat.html";
    }
}


function createChatfunction() {
    let UserID = sessionStorage.getItem("UserID");

    if (UserID === "") {
        return;
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({UserID: UserID})
    };

    fetch('http://localhost:3000/createChat', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem("chatcode", data.code);
            sessionStorage.setItem("username", data.usernames);
            window.location.href = "./chat.html";
        })
        .catch(error => {
            console.error('Error creating Chat:', error);
        });
}
