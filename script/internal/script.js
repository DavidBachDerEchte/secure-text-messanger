let privateKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEA1tbd9qBIeoylI4mP9dkRX5vqcHvtUmEGLvQO6ZMipiRT13DO\n' +
    'K3aKk7+dH/3pYS5RW8kb5WX2Pe9Pbd+mRGkeVH9K9F9R8+/9mxlIHag1tFNmLt3T\n' +
    '5zNT8egot6Hnxvt7+sKn4hAFp77na1WS0gGbOIq1cgeFGbdeYsF9KGQZj+IoDqs1\n' +
    'eazreI4nANUZPDmSC0H49OZSBTCbi7gJ07PQviCGzv1dFNqugx2hDMYV8zco45Nb\n' +
    'bOUDV1PN8yPC5yeCYINE+Vf08h0RHgMfnkmDxGoD40TjDGSLoZr1OQrqNudZxNRp\n' +
    'OjjhqTUpAMeCEBwty68uBOrRxmv8vBNlPQQEiQIDAQABAoIBAFuRd0ev51R8b8Jm\n' +
    '1noly9bhYJoS6AMNoZIPqe96K/F+WFHiHa2+t6/jorfJBFjMYhbp777lp3+caVFe\n' +
    'WsKbvzaqjqr7mbWMG56otukVEdbLGSlumOvZH7Vii0BBfMV92Mj3gJDE3XQy1PYV\n' +
    'oh9qWdtOm6l/dQaR9mPHLm4xxAdjx/sxQAQPuNuLwzF03gChAXHSH2uxzNgEt1c1\n' +
    'ANUMS9ydOgX9M2LvvrS1xXh4urpRh8sMFR9Fb+yAM7tqhan5xSUonVmXnCVovrBY\n' +
    'gWri+mDP1h3petEwwRZBRYIfsRI3tYaPKPcjHPzf4xYYkUn4dT+jnX3enl4ySoj2\n' +
    'mrFCT4ECgYEA+Z5hAF+kciFWqYOe5+Nr6j758DezF6SJvoD20YrhvBEn2hNwyBQn\n' +
    'W2+X/xbopOQ+A+8AX5uLTZ39xo3AGGtNXdWj1v8eimsU44AgI/cQjfLYToPnoEfH\n' +
    'nUexw6xW63/M54/SOI98bOuD341ZO6ZpR6HUQSUjaHc72R9zilybodECgYEA3FTg\n' +
    'OVLk0t55YyzMno8h0v5CzIAmxKX6cWlVDCopyeH2HKapGXNzmuMqCcIxLbANGFbe\n' +
    'HXMFdMhpNWp7jHSUmWdAXrwIS5ZDy1LVnR++t8Zi29blKKRpcNSIUJP1tGhxpsPA\n' +
    'xF0qKEnXcw8nIBJXpwbBWrWsxryjFhm//8HHbTkCgYBKAWC04aY5iBTPcQxdp5lI\n' +
    '+57ST1Ezgz6rUkTa3xgJz/RGvVjEmOUKQM2JfVs/98NDG0q7DbyBKIQip8f59WYc\n' +
    'mchXZ4/AbfrlcAkXYJpx2zuyG31CkcVmpejYIHIso9k2Ffe3eSLkj/arApcgDjhM\n' +
    'Wng5UC9tO1xtBNwWe1pQ4QKBgQDb+aVvtfIdEd8RhA26lF6JwC7C64NJPAkhp68w\n' +
    'mPvlwkKscjxL27dkwT4cRhRBcA5y6W+S6V5eLSTVHr3BCje+PJbIvmRtytVerxH0\n' +
    'cFhCNMBIinF6NUPMUXTTNhXOi6REghX4Nqe7V5XSGyPN4mI+sQDkZpPcS0Nr8kN9\n' +
    'vmM0CQKBgQCxM3vD5zp5ASb50Q7zn+8gFxyWT3iugyOQ0+eJI4eUz7Re5q/UmFJ2\n' +
    'o3sW4Clt5grlgW0oHbpJzlmh95d01q7fd+knBEaQUKwgKWmKVBPKM4K8cs5UqLwu\n' +
    'xzuv8qKy7D1Sx669fKN5JR7h5bl7W3dZL2OJ+pQXBn8MDwY+yIsffQ==\n' +
    '-----END RSA PRIVATE KEY-----';

let publicKey = '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEpAIBAAKCAQEA1tbd9qBIeoylI4mP9dkRX5vqcHvtUmEGLvQO6ZMipiRT13DO\n' +
    'K3aKk7+dH/3pYS5RW8kb5WX2Pe9Pbd+mRGkeVH9K9F9R8+/9mxlIHag1tFNmLt3T\n' +
    '5zNT8egot6Hnxvt7+sKn4hAFp77na1WS0gGbOIq1cgeFGbdeYsF9KGQZj+IoDqs1\n' +
    'eazreI4nANUZPDmSC0H49OZSBTCbi7gJ07PQviCGzv1dFNqugx2hDMYV8zco45Nb\n' +
    'bOUDV1PN8yPC5yeCYINE+Vf08h0RHgMfnkmDxGoD40TjDGSLoZr1OQrqNudZxNRp\n' +
    'OjjhqTUpAMeCEBwty68uBOrRxmv8vBNlPQQEiQIDAQABAoIBAFuRd0ev51R8b8Jm\n' +
    '1noly9bhYJoS6AMNoZIPqe96K/F+WFHiHa2+t6/jorfJBFjMYhbp777lp3+caVFe\n' +
    'WsKbvzaqjqr7mbWMG56otukVEdbLGSlumOvZH7Vii0BBfMV92Mj3gJDE3XQy1PYV\n' +
    'oh9qWdtOm6l/dQaR9mPHLm4xxAdjx/sxQAQPuNuLwzF03gChAXHSH2uxzNgEt1c1\n' +
    'ANUMS9ydOgX9M2LvvrS1xXh4urpRh8sMFR9Fb+yAM7tqhan5xSUonVmXnCVovrBY\n' +
    'gWri+mDP1h3petEwwRZBRYIfsRI3tYaPKPcjHPzf4xYYkUn4dT+jnX3enl4ySoj2\n' +
    'mrFCT4ECgYEA+Z5hAF+kciFWqYOe5+Nr6j758DezF6SJvoD20YrhvBEn2hNwyBQn\n' +
    'W2+X/xbopOQ+A+8AX5uLTZ39xo3AGGtNXdWj1v8eimsU44AgI/cQjfLYToPnoEfH\n' +
    'nUexw6xW63/M54/SOI98bOuD341ZO6ZpR6HUQSUjaHc72R9zilybodECgYEA3FTg\n' +
    'OVLk0t55YyzMno8h0v5CzIAmxKX6cWlVDCopyeH2HKapGXNzmuMqCcIxLbANGFbe\n' +
    'HXMFdMhpNWp7jHSUmWdAXrwIS5ZDy1LVnR++t8Zi29blKKRpcNSIUJP1tGhxpsPA\n' +
    'xF0qKEnXcw8nIBJXpwbBWrWsxryjFhm//8HHbTkCgYBKAWC04aY5iBTPcQxdp5lI\n' +
    '+57ST1Ezgz6rUkTa3xgJz/RGvVjEmOUKQM2JfVs/98NDG0q7DbyBKIQip8f59WYc\n' +
    'mchXZ4/AbfrlcAkXYJpx2zuyG31CkcVmpejYIHIso9k2Ffe3eSLkj/arApcgDjhM\n' +
    'Wng5UC9tO1xtBNwWe1pQ4QKBgQDb+aVvtfIdEd8RhA26lF6JwC7C64NJPAkhp68w\n' +
    'mPvlwkKscjxL27dkwT4cRhRBcA5y6W+S6V5eLSTVHr3BCje+PJbIvmRtytVerxH0\n' +
    'cFhCNMBIinF6NUPMUXTTNhXOi6REghX4Nqe7V5XSGyPN4mI+sQDkZpPcS0Nr8kN9\n' +
    'vmM0CQKBgQCxM3vD5zp5ASb50Q7zn+8gFxyWT3iugyOQ0+eJI4eUz7Re5q/UmFJ2\n' +
    'o3sW4Clt5grlgW0oHbpJzlmh95d01q7fd+knBEaQUKwgKWmKVBPKM4K8cs5UqLwu\n' +
    'xzuv8qKy7D1Sx669fKN5JR7h5bl7W3dZL2OJ+pQXBn8MDwY+yIsffQ==\n' +
    '-----END RSA PRIVATE KEY-----';

let cryptUser = new JSEncrypt();
cryptUser.setPrivateKey(privateKey);
cryptUser.setPublicKey(publicKey);

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


    // Encrypt the message
    let encryptedText = cryptUser.encrypt(input);


    fetch('https://stm-node-server-davids-projects-a234c8fb.vercel.app/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({message: encryptedText, sender: name, chatcode: sessionStorage.getItem("chatcode")})
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

    document.getElementById("inputText1").value = "";
}

function getChatHistory() {
    let receivedMessages = document.getElementById("receivedMessages");
    let decryptedMessages = "";
    let combinedsender = "";
    let combinedMessages = "";

    fetch('https://stm-node-server-davids-projects-a234c8fb.vercel.app/getChatHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({chatcode: sessionStorage.getItem("chatcode")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let decryptedMessages = "";
            for (let i = 1; i < data.results.length; i++) {
                let combinedsender = ""; // Hier initialisieren, um sicherzustellen, dass es für jede Nachricht neu gesetzt wird
                for (let q = 1; q < data.results[i].messagesender.length - 1; q++) {
                    combinedsender += `${data.results[i].messagesender[q]}`;
                }

                let combinedMessages = "";
                for (let j = 1; j < data.results[i].message.length - 1; j++) {
                    combinedMessages += `${data.results[i].message[j]}`;
                }

                let decryptedMessage = cryptUser.decrypt(combinedMessages);
                decryptedMessages += `${combinedsender}: ${decryptedMessage}\n`;
            }
            receivedMessages.value = decryptedMessages;


        })
        .catch(error => {
            console.error('Error reading Chat:', error);
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

setInterval(getChatHistory, 1000);