// Initialize JSEncrypt with default key size
let crypt = new JSEncrypt({default_key_size: 2048});

// Generate key pair for the current user
let publicKey = crypt.getPublicKey();
let privateKey = crypt.getPrivateKey();

// Set public key for the current user
let cryptUser = new JSEncrypt();
cryptUser.setPublicKey(publicKey);

// Set private key for decryption
let decryptUser = new JSEncrypt();
decryptUser.setPrivateKey(privateKey);

// Set Username
let username = localStorage.getItem("username");
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


    // Encrypt the message
    let encryptedText = cryptUser.encrypt(input);

    fetch('http://localhost:3000/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: encryptedText, sender: name, chatcode: localStorage.getItem("chatcode")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error creating Chat:', error);
        });
}

function getChatHistory() {
    let receivedMessages = document.getElementById("receivedMessages");
    let decryptedMessages = "";
    let combinedsender = "";
    let combinedMessages = "";

    fetch('http://localhost:3000/getChatHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ chatcode: localStorage.getItem("chatcode") })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let a = 1; a < data.results.length; a++) {
                combinedsender = "";
                decryptedMessages = "";
                for (let q = 1; q < data.results[a].messagesender.length - 1; q++) {
                    combinedsender += `${data.results[a].messagesender[q]}`;
                }
                console.log(combinedsender);
            }

            for (let i = 1; i < data.results.length; i++) {
                combinedMessages = "";
                for (let j = 1; j < data.results[i].message.length - 1; j++) {
                    combinedMessages += `${data.results[i].message[j]}`;
                }

                console.log(combinedMessages);
                let decryptedMessage = decryptUser.decrypt(combinedMessages);
                decryptedMessages += `${combinedsender}: ${decryptedMessage}\n`;

                receivedMessages.value = decryptedMessages;
            }
        })
        .catch(error => {
            console.error('Error reading Chat:', error);
        });
}



// setInterval(getChatHistory, 2000);
getChatHistory()