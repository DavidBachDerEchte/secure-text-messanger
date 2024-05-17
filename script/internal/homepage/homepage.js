document.addEventListener("DOMContentLoaded", function () {
    if (sessionStorage.getItem("UserID")) {
        fetch('http://localhost:3000/getUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userID: sessionStorage.getItem("UserID")})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                document.getElementById("AccountName").textContent = data.username;
            })
            .catch(error => {
                console.error('Error getting user data:', error);
            });

    }

    getFriends();
})

function openSettings() {
    let containerParent = document.getElementById("container").parentElement;
    containerParent.firstElementChild.style.filter = "blur(10px)";
    let active = false;

    let settingsOverlay = document.createElement("div");
    settingsOverlay.setAttribute("id", "settingsOverlay");

    let settingsContainer = document.createElement("div");
    settingsContainer.setAttribute("id", "settingsContainer");

    let settingsExit = document.createElement("button");
    settingsExit.setAttribute("id", "settingsExit");

    let settingsExitImg = document.createElement("img");
    settingsExitImg.setAttribute("id", "settingsExitImg");
    settingsExitImg.src = "../icon/create&login/X.svg";

    let settingsleftsidebar = document.createElement("div");
    settingsleftsidebar.setAttribute("id", "settingsleftsidebar");

    let settingsrest = document.createElement("div");
    settingsrest.setAttribute("id", "settingsrest");

    settingsExit.addEventListener("click", function () {
        containerParent.firstElementChild.style.filter = "blur(0px)";
        settingsOverlay.remove();
        active = false;
    })


    // leftsidebar content
    let generalSettings = document.createElement("button");
    generalSettings.setAttribute("id", "generalSettings");
    generalSettings.textContent = "General Settings";

    let generalSettingsImg = document.createElement("img");
    generalSettingsImg.setAttribute("id", "generalSettingsImg");


    let profileSettings = document.createElement("button");
    profileSettings.setAttribute("id", "profileSettings");
    profileSettings.textContent = "Profile Settings";

    let profileSettingsImg = document.createElement("img");
    profileSettingsImg.setAttribute("id", "profileSettingsImg");


    generalSettings.appendChild(generalSettingsImg);
    profileSettings.appendChild(profileSettingsImg);

    settingsleftsidebar.appendChild(generalSettings);
    settingsleftsidebar.appendChild(profileSettings);


    settingsExit.appendChild(settingsExitImg);
    settingsContainer.appendChild(settingsleftsidebar);
    settingsrest.appendChild(settingsExit);
    settingsContainer.appendChild(settingsrest);
    settingsOverlay.appendChild(settingsContainer);
    containerParent.appendChild(settingsOverlay);

    document.getElementById("profileSettings").addEventListener("click", function () {
        if (!active) {
            createProfileSettings();
            active = true;
        }
    })

}

function createProfileSettings() {
    let settingsrest = document.getElementById("settingsrest");

    let title = document.createElement("p");
    title.setAttribute("id", "title");
    title.textContent = "Profile Settings";

    let useridp = document.createElement("p");
    useridp.textContent = "UserID: " + sessionStorage.getItem("UserID");

    settingsrest.appendChild(title);
    settingsrest.appendChild(useridp);
}


function addFriend() {
    let containerParent = document.getElementById("container").parentElement;
    containerParent.firstElementChild.style.filter = "blur(10px)";
    let active = false;

    let friendOverlay = document.createElement("div");
    friendOverlay.setAttribute("id", "friendOverlay");

    let friendContainer = document.createElement("div");
    friendContainer.setAttribute("id", "friendContainer");

    let friendExit = document.createElement("button");
    friendExit.setAttribute("id", "friendExit");

    let friendExitimg = document.createElement("img");
    friendExitimg.setAttribute("id", "friendExitimg");
    friendExitimg.src = "../icon/create&login/X.svg";

    let friendrest = document.createElement("div");
    friendrest.setAttribute("id", "friendrest");

    friendExit.addEventListener("click", function () {
        containerParent.firstElementChild.style.filter = "blur(0px)";
        friendOverlay.remove();
        active = false;
    })


    friendExit.appendChild(friendExitimg);
    friendrest.appendChild(friendExit);
    friendContainer.appendChild(friendrest);
    friendOverlay.appendChild(friendContainer);
    containerParent.appendChild(friendOverlay);

    if (!active) {
        addFriendsPage();
        active = true;
    }
}

function addFriendsPage() {
    let friendrest = document.getElementById("friendrest");

    let title = document.createElement("p");
    title.setAttribute("id", "title");
    title.textContent = "Add Friends";

    let friendIDinput = document.createElement("input");
    friendIDinput.id = "friendIDinput";
    friendIDinput.placeholder = "Enter the <name>#<UserID>  of the person you want to add as a friend";
    friendIDinput.setAttribute("text", "text");

    let button = document.createElement("button");
    button.id = "addfriendbutton";
    button.textContent = "Add Friend";
    button.onclick = function () {
        addfriendtoaccount();
    }

    friendrest.appendChild(title);
    friendrest.appendChild(friendIDinput);
    friendrest.appendChild(button);
}

function addfriendtoaccount() {
    let friendIDinput = document.getElementById("friendIDinput").value;

    if (friendIDinput) {
        fetch('http://localhost:3000/addFriend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({myuserID: sessionStorage.getItem("UserID"), friendIDinput: friendIDinput})
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                if (data.error !== 'Friend already added' && data.error !== 'You cannot add yourself as a friend') {
                    setTimeout(function () {
                        getFriends();
                    }, 1000);
                }
            })
            .catch(error => {
                console.error('Error getting user data:', error);
            });
    }
}

function getFriends() {
    fetch('http://localhost:3000/getFriends', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userID: sessionStorage.getItem("UserID")})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            for (let i = 0; i < data.friends.length; i++) {
                if (data.friends[i].friendsID) {
                    let parent = document.getElementsByClassName("friendslist")[0];
                    parent.firstElementChild.remove()


                    let friend = document.createElement("button");
                    friend.setAttribute("class", "friend");
                    friend.onclick = function () {
                        // TODO: Open PTP Chat
                    }


                    let friendName = document.createElement("p");
                    friendName.textContent = data.friends[i].friendsUsername;
                    friend.appendChild(friendName);

                    if (data.friends[i].friendsStatus !== "Accepted") {
                        let friendstatus = document.createElement("span");
                        friendstatus.textContent = data.friends[i].friendsStatus;
                        friend.appendChild(friendstatus);
                    }

                    parent.appendChild(friend);

                    if (data.friends[i].friendsStatus !== "Pending") {
                        let deletebtn = document.createElement("button");
                        deletebtn.setAttribute("class", "deletebtn");
                        deletebtn.appendChild(document.createElement("span"));
                        deletebtn.firstElementChild.textContent = "Delete?";
                        deletebtn.firstElementChild.classList.add("hidden");

                        deletebtn.addEventListener("click", function () {
                            deletebtn.firstElementChild.classList.remove("hidden");
                            deletebtn.classList.add("active");
                        })

                        deletebtn.onclick = function () {
                            this.firstElementChild.classList.remove("hidden");
                            this.classList.add("active");

                            deletebtn.firstElementChild.onclick = function () {
                                if (deletebtn.classList.contains("active")) {
                                    deleteFriend(data.friends[i].friendsID, data.friends[i].friendsUsername);
                                }
                            }
                        }
                        friend.appendChild(deletebtn);

                        friend.addEventListener("mouseleave", function () {
                            deletebtn.firstElementChild.classList.add("hidden");
                            deletebtn.classList.remove("active");
                        })
                    }
                } else {

                    let parent = document.getElementsByClassName("friendslist")[0];
                    let friend = document.createElement("div");
                    friend.setAttribute("class", "friend");

                    let friendName = document.createElement("p");
                    friendName.textContent = 'No Friends available';
                    friend.appendChild(friendName);
                    parent.appendChild(friend);
                }
            }

            //jalevink@web.de
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
}

function deleteFriend(friendID, friendUsername) {
    fetch('http://localhost:3000/deleteFriend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            myuserID: sessionStorage.getItem("UserID"),
            friendID: friendID,
            friendUsername: friendUsername
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
            console.error('Error getting user data:', error);
        });
}

function logout() {
    sessionStorage.clear();
    window.location = "../login.html";
}







