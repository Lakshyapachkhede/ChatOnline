const audio = new Audio("ting.mp3");

var name = "";

const container = document.getElementById("container");
function getCurrentTime() {
    return new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true
    });
}

function addInfo(message) {
    const info = document.createElement('div');
    info.innerHTML = message;
    info.classList.add("info");
    container.appendChild(info);

}

function addMessage(name, message, direction) {
    if (direction == "left") {
        audio.play()
    }
    const maxLength = 200; // Max characters before "Read More" appears

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", direction);

    const nameDiv = document.createElement("div");
    const nameP = document.createElement("p");
    nameP.innerText = name;

    const timeP = document.createElement("p");
    timeP.innerText = getCurrentTime();
    timeP.classList.add("time");

    nameDiv.appendChild(nameP);
    nameDiv.appendChild(timeP);
    nameDiv.classList.add("name", "blue");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    const fullMessage = message;
    let shortMessage = fullMessage.slice(0, maxLength);
    if (fullMessage.length > maxLength) {
        shortMessage += "..."; // Show "..." if truncated
    }

    const messageText = document.createElement("span");
    messageText.textContent = shortMessage;

    const readMoreBtn = document.createElement("button");
    readMoreBtn.innerText = "Read More";
    readMoreBtn.classList.add("read-more");

    let expanded = false; // Track state (expanded/collapsed)

    readMoreBtn.addEventListener("click", function () {
        expanded = !expanded; // Toggle state
        messageText.textContent = expanded ? fullMessage : shortMessage;
        readMoreBtn.innerText = expanded ? "Read Less" : "Read More";
    });

    contentDiv.appendChild(messageText);
    if (fullMessage.length > maxLength) {
        contentDiv.appendChild(readMoreBtn);
    }

    messageDiv.appendChild(nameDiv);
    messageDiv.appendChild(contentDiv);
    container.appendChild(messageDiv);

    // Auto-scroll to the latest message
    container.scrollTop = container.scrollHeight;
}




const socket = io();

document.getElementById("name-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (name === "") {
        name = document.getElementById("user-name").value;
        if (name.trim() !== "") {
            socket.emit("new-user-join", name);
            document.getElementById("user-name").value = "";
            document.querySelector(".input-name button").disabled = true; // Disable join button
            document.getElementById("user-name").disabled = true;


        }
    }
});



document.getElementById('message-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (name === "" || name === undefined) {
        alert("Join first!");

    } else {
        let message = document.getElementById("message").value;

        if (message.trim() !== "") {

            socket.emit("message", message);
            addMessage("you", message, "right");
            document.getElementById("message").value = "";
        }
    }
});



socket.on("message", (data) => {
    addMessage(data.name, data.message, "left");
})

socket.on("new-user-join", (name) => {
    addInfo(`<b>${name}</b> joined the chat`)
})

socket.on("user-left", (name) => {
    addInfo(`<b>${name}</b> left the chat`);
});

socket.on("user-count", (count) => {
    document.getElementById("count").innerText = count;
});



