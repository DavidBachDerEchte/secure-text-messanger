// Set Username
let username = sessionStorage.getItem("username");
let usernameElement = document.getElementById("usernameid");
if (usernameElement) {
    usernameElement.textContent = username;
} else {
    console.error("Element with id 'usernameid' not found.");
}



function sendMessage() {
    let input, name;

    input = document.getElementById("inputText1").value;
    name = username;


    fetch('https://stm-node-server.vercel.app/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: input, sender: name, chatcode: sessionStorage.getItem("chatcode")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);
            getChatHistory();
        })
        .catch(error => {
            console.error('Error creating Chat:', error);
        });

    document.getElementById("inputText1").value = "";
}

function getChatHistory() {
    let receavedMEsseage = document.getElementById("receivedMessages");
    fetch('https://stm-node-server.vercel.app/getChatHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatcode: sessionStorage.getItem("chatcode") })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data.messages);
            receavedMEsseage.value = "";
            for (let i = 0; i < data.messages.length; i++) {
                receavedMEsseage.value += `${data.messages[i].sender}: ${data.messages[i].message}\n`;
            }


        })
        .catch(error => {
            console.error('Error reading Chat: ', error);
        });
}


let chatcode = sessionStorage.getItem("chatcode");
let chatcodeElement = document.getElementById("chatcodedisplay");
if (chatcodeElement) {
    chatcodeElement.textContent = chatcode;
}

let backButton = document.getElementById("backbutton");
backButton.addEventListener("click", function () {
    sessionStorage.removeItem("chatcode");
    sessionStorage.removeItem("username");
});