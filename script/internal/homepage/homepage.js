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
                console.log(data);
                document.getElementById("AccountName").textContent = data.username;
            })
            .catch(error => {
                console.error('Error getting user data:', error);
            });
    }
})

function openSettings() {
    let containerParent = document.getElementById("container").parentElement;
    containerParent.firstElementChild.style.filter = "blur(10px)";
    document.body.style.backgroundColor = "rgba(0, 0, 0, .45)";
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
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0)";
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


    settingsrest.appendChild(title);
}



