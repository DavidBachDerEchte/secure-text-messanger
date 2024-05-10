// Initialize JSEncrypt with default key size
let crypt = new JSEncrypt({default_key_size: 2048});

// Generate key pair for the current user
let publicKey = crypt.getPublicKey();
let privateKey = crypt.getPrivateKey();

// Set public key for the current user
let cryptUser = new JSEncrypt();
cryptUser.setPublicKey(publicKey);
cryptUser.setPrivateKey(privateKey);

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

// Function to get public keys from the server
function getPublicKeysFromServer() {
    fetch('http://localhost:3000/getPublicKeys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify({ username: username, chatcode: localStorage.getItem("chatcode") })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.results.length; i++) {
                if (data.results[i].username === username) {
                    let combinedPublicKey = '';
                    // Store received public keys in localStorage or process them as needed
                    for (let j = 1; j < data.results[i].publicKey.length - 1; j++) {
                        combinedPublicKey += data.results[i].publicKey[j];
                    }
                    localStorage.setItem("publicKeys", combinedPublicKey);
                    localStorage.setItem("publicKeyHolder", data.results[i].username);
                }
            }
        })
        .catch(error => {
            console.error('Error getting public keys:', error);
        });
}

// Function to send public keys to the server
function sendPublicKeysToServer(publicKeys) {
    let username = localStorage.getItem("username");
    let existingPublicKeysholder = localStorage.getItem("publicKeyHolder");
    if (username === existingPublicKeysholder) {
        console.log("Public keys already exist in localStorage.");

    } else {
        fetch('http://localhost:3000/sendPublicKeys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                publicKeys: publicKeys,
                username: username,
                chatcode: localStorage.getItem("chatcode")
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log('Public keys sent successfully.');
            })
            .catch(error => {
                console.error('Error sending public keys:', error);
            });
    }
}

// Function to decrypt a message using user's private key
function decryptMessage(encryptedMessage) {
    return decryptUser.decrypt(encryptedMessage);
}

// Function to send a message
function sendMessage(input) {

    // Get public keys from localStorage
    let publicKeys = localStorage.getItem("publicKeys");
    let publicKEysArray = publicKeys.split(", ");

    if (!publicKEysArray || !Array.isArray(publicKEysArray)) {
        console.error("No public keys found in local storage.");
        return;
    }


    let cryptRecipient = new JSEncrypt();
    cryptRecipient.setPublicKey(publicKey);
    let encryptedMessage = cryptRecipient.encrypt(input)

    // Send each encrypted message to the server
        fetch('http://localhost:3000/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message: encryptedMessage, sender: username, chatcode: localStorage.getItem("chatcode")})
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
                console.error('Error sending message:', error);
            });
}


// Function to fetch chat history and decrypt messages
function getChatHistory() {
    // Fetch chat history from server
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
            // Decrypt and display each message
            let receivedMessages = document.getElementById("receivedMessages");
            let decryptedMessages = "";

            data.results.forEach(result => {
                let decryptedMessage = decryptMessage(result.message);
                decryptedMessages += `${result.sender}: ${decryptedMessage}\n`;
            });

            receivedMessages.value = decryptedMessages;
        })
        .catch(error => {
            console.error('Error fetching chat history:', error);
        });
}

// Call getChatHistory every 2 seconds
setInterval(getChatHistory, 2000);

// Send public keys to server when the page loads
document.addEventListener("DOMContentLoaded", function(event) {
    let publicKeys = [publicKey]; // Include current user's public key
    getPublicKeysFromServer();
    sendPublicKeysToServer(publicKeys);
});