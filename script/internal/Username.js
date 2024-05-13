let username = false;
let chatcodeglobal = false;


function joinChat() {
    let usernameinput = document.getElementById("inputText").value;
    let Chatcode = document.getElementById("JoinChat").value;


    if (Chatcode === "") {
        chatcodeglobal = false;
    }

    if (usernameinput === "") {
        username = false;
    }

    // Fetch request options
    const requestOptionsInsert = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: usernameinput, chatcode: Chatcode})
    };

    fetch(`https://stm-node-server.vercel.app/getUsernames`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            username = true;
            console.log(data.message);
            goon();
        })
        .catch(error => {
            console.error('Error to read user:', error);
        });

    // Sent username to server
    fetch('https://stm-node-server.vercel.app/insert', requestOptionsInsert)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            chatcodeglobal = true;
            console.log(data.message);
            goon();
        })
        .catch(error => {
            console.error('Error creating user:', error);
        });

}

function goon() {
    let usernameinput = document.getElementById("inputText").value;
    let Chatcode = document.getElementById("JoinChat").value;

    if (username === true && chatcodeglobal === true) {
        sessionStorage.setItem("username", usernameinput);
        sessionStorage.setItem("chatcode", Chatcode);
        window.location.href = "./html/chat.html";
    } else {
        let warning = document.getElementById("Warning");
        warning.textContent = "Please Enter Username and Chat Code.";
        warning.style.color = "red";
        warning.style.fontSize = "20px";
    }
}


function createChatfunction() {
    let usernameinput = document.getElementById("inputText").value;

    if (usernameinput === "") {
        return;
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: usernameinput})
    };

    fetch('https://stm-node-server.vercel.app/createChat', requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            sessionStorage.setItem("username", usernameinput);
            sessionStorage.setItem("chatcode", data.code);
            window.location.href = "./html/chat.html";
        })
        .catch(error => {
            console.error('Error creating Chat:', error);
        });
}
