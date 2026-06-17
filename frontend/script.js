const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const chatContainer = document.getElementById("chatContainer");

const uploadBtn = document.getElementById("uploadBtn");
const uploadMenu = document.getElementById("uploadMenu");
const selectImageBtn = document.getElementById("selectImageBtn");

const fileInput = document.getElementById("referenceImage");
const dropZone = document.getElementById("dropZone");
const imagePreview = document.getElementById("imagePreview");

const historyList = document.getElementById("historyList");
const newChatBtn = document.getElementById("newChatBtn");

const sidebar = document.querySelector(".sidebar");
const toggleSidebar = document.getElementById("toggleSidebar");

const imageModal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const closeModal = document.getElementById("closeModal");

let history =
JSON.parse(
    localStorage.getItem("sketchai_history")
) || [];

loadHistory();


// =========================
// SIDEBAR TOGGLE
// =========================

toggleSidebar.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "collapsed"
        );

        const inputBar =
        document.querySelector(
            ".input-container"
        );

        if(
            sidebar.classList.contains(
                "collapsed"
            )
        ){
            inputBar.style.left =
            "100px";
        }
        else{
            inputBar.style.left =
            "300px";
        }

    }
);


// =========================
// NEW CHAT
// =========================

newChatBtn.addEventListener(
    "click",
    () => {

        chatContainer.innerHTML = `
            <div class="welcome-screen">

                <img
                    src="assets/logo.png"
                    class="welcome-logo"
                    alt="SketchAI"
                >
                <p>
                    What would you like to create today?
                </p>

                <div class="suggestions">

                    <button class="suggestion-btn">
                        Cyberpunk City
                    </button>

                    <button class="suggestion-btn">
                        Anime Character
                    </button>

                    <button class="suggestion-btn">
                        Fantasy Castle
                    </button>

                    <button class="suggestion-btn">
                        Logo Design
                    </button>

                </div>

            </div>
        `;

        bindSuggestions();
    }
);


// =========================
// SUGGESTIONS
// =========================

function bindSuggestions(){

    document
    .querySelectorAll(".suggestion-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                promptInput.value =
                button.textContent.trim();

                promptInput.focus();

            }
        );

    });
}

bindSuggestions();


// =========================
// ENTER TO SEND
// =========================

promptInput.addEventListener(
    "keydown",
    (e) => {

        if(
            e.key === "Enter" &&
            !e.shiftKey
        ){

            e.preventDefault();

            generateImage();
        }
    }
);


// =========================
// AUTO HEIGHT
// =========================

promptInput.addEventListener(
    "input",
    () => {

        promptInput.style.height =
        "auto";

        promptInput.style.height =
        promptInput.scrollHeight +
        "px";
    }
);


// =========================
// UPLOAD MENU
// =========================

uploadBtn.addEventListener(
    "click",
    () => {

        uploadMenu.classList.toggle(
            "active"
        );

    }
);

document.addEventListener(
    "click",
    (e) => {

        if(
            !uploadBtn.contains(e.target) &&
            !uploadMenu.contains(e.target)
        ){

            uploadMenu.classList.remove(
                "active"
            );

        }

    }
);

selectImageBtn.addEventListener(
    "click",
    () => {

        fileInput.click();

    }
);


// =========================
// IMAGE PREVIEW
// =========================

fileInput.addEventListener(
    "change",
    showPreview
);

function showPreview(){

    const file =
    fileInput.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload = function(e){

        imagePreview.innerHTML = `

            <div class="preview-wrapper">

                <img
                    src="${e.target.result}"
                    class="preview-image"
                >

                <button
                    id="removeImageBtn"
                    class="remove-image-btn"
                >
                    ×
                </button>

            </div>

        `;

        document
        .getElementById(
            "removeImageBtn"
        )
        .addEventListener(
            "click",
            removeImage
        );
    };

    reader.readAsDataURL(file);
}



// =========================
// DRAG & DROP
// =========================

dropZone.addEventListener(
    "dragover",
    (e) => {

        e.preventDefault();

        dropZone.classList.add(
            "dragover"
        );

    }
);

dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "dragover"
        );

    }
);

dropZone.addEventListener(
    "drop",
    (e) => {

        e.preventDefault();

        dropZone.classList.remove(
            "dragover"
        );

        fileInput.files =
        e.dataTransfer.files;

        showPreview();

        dropZone.innerHTML =
        "✅ Image Ready";

    }
);


// =========================
// DOWNLOAD IMAGE
// =========================
function downloadImage(url){

    const a =
    document.createElement("a");

    a.href =
    `http://127.0.0.1:8000/download-image?url=${encodeURIComponent(url)}`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

}



// =========================
// GENERATE IMAGE
// =========================

async function generateImage(){

    const prompt =
    promptInput.value.trim();

    if(!prompt) return;

    const welcome =
    document.querySelector(
        ".welcome-screen"
    );

    if(welcome){
        welcome.remove();
    }

    let imageHTML = "";
    if(fileInput.files[0]){
        imageHTML = imagePreview.innerHTML;
    }
    chatContainer.innerHTML += `
        <div class="message user-message">
            ${imageHTML}
            <div class="user-prompt">
                ${prompt}
            </div>
        </div>
    `;

    const loadingId =
    "loading-" + Date.now();

    chatContainer.innerHTML += `

        <div
            id="${loadingId}"
            class="message ai-message"
        >

            <div class="loading-container">

                <img
                    src="assets/loading.gif"
                    class="loading-gif"
                >

                <p>
                    Generating image...
                </p>

            </div>

        </div>

    `;

    promptInput.value = "";
    generateBtn.disabled = true;

    console.log(fileInput.files);
    console.log(fileInput.files.length);
    console.log(fileInput.files[0])

    const formData =
    new FormData();
    formData.append(
        "prompt",
        prompt
    );
    
    if(fileInput.files[0]){
        formData.append(
            "reference_image",
            fileInput.files[0]
        );
        console.log(
            "Uploading:",
            fileInput.files[0].name
        );
    }
    else{

        console.log(
            "No image selected"
        );
    }

    try{

        const response =
        await fetch(
            "http://127.0.0.1:8000/generate-image",
            {
                method: "POST",
                body: formData
            }
        );

        const data =
        await response.json();

        const loadingMessage =
        document.getElementById(
            loadingId
        );

        if(data.success){

            loadingMessage.outerHTML = `

                <div class="message ai-message">

                    <img
                        src="${data.image_url}"
                        class="generated-image"
                    >

                    <div class="image-actions">

                        <button
                            class="download-btn"
                            onclick="downloadImage('${data.image_url}')"
                        >
                            Download
                        </button>

                    </div>

                </div>

            `;

            saveHistory(
                prompt,
                data.image_url
            );

        }else{

            loadingMessage.outerHTML = `

                <div class="message ai-message">
                    ${data.error}
                </div>

            `;
        }

    }
    catch(error){

        const loadingMessage =
        document.getElementById(
            loadingId
        );

        if(loadingMessage){

            loadingMessage.outerHTML = `

                <div class="message ai-message">
                    ${error.message}
                </div>

            `;
        }

    }
    finally{

        generateBtn.disabled = false;

        window.scrollTo({

            top:
            document.body.scrollHeight,

            behavior:
            "smooth"

        });

    }
}


// =========================
// HISTORY
// =========================

function saveHistory(
    prompt,
    image
){

    history.unshift({

        prompt,
        image

    });

    localStorage.setItem(

        "sketchai_history",

        JSON.stringify(history)

    );

    loadHistory();
}

function loadHistory(){

    historyList.innerHTML = "";

    history.forEach(item => {

        const historyItem =
        document.createElement("div");

        historyItem.className =
        "history-item";

        historyItem.textContent =
        item.prompt;

        historyItem.addEventListener(
            "click",
            () => {

                chatContainer.innerHTML = `

                    <div class="message user-message">
                        ${item.prompt}
                    </div>

                    <div class="message ai-message">

                        <img
                            src="${item.image}"
                            class="generated-image"
                        >

                        <div class="image-actions">

                            <button
                                class="download-btn"
                                onclick="downloadImage('${item.image}')"
                            >
                                Download
                            </button>

                        </div>

                    </div>

                `;
            }
        );

        historyList.appendChild(
            historyItem
        );

    });
}


// =========================
// IMAGE MODAL
// =========================

document.addEventListener(
    "click",
    (e) => {

        if(
            e.target.classList.contains(
                "generated-image"
            )
        ){

            modalImage.src =
            e.target.src;

            imageModal.style.display =
            "flex";
        }

    }
);

closeModal.addEventListener(
    "click",
    () => {

        imageModal.style.display =
        "none";

    }
);

imageModal.addEventListener(
    "click",
    (e) => {

        if(
            e.target === imageModal
        ){

            imageModal.style.display =
            "none";
        }

    }
);
function removeImage(){

    fileInput.value = "";

    imagePreview.innerHTML = "";

    dropZone.innerHTML =
    "Drag & Drop Image Here";
}
generateBtn.addEventListener(
    "click",
    generateImage
);