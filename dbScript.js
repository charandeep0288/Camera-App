
let body = document.querySelector("body");

let req = indexedDB.open("Camera", 1); // request 
let db;


req.addEventListener("success", function () {
    db = req.result;

});


req.addEventListener("upgradeneeded", function () {
    let accessToNotesDB = req.result;

    accessToNotesDB.createObjectStore("Gallery", { keyPath: "mId" }); // media ID
});


req.addEventListener("error", function () {
    // alert("Error in creation/opening"); // it not good practice to show error to user
    console.log("error");
});

// script.js
// Date.now() not use in industry
function addMedia(media, type) {
    if (!db)
        return;
    let obj = { mId: Date.now(), media, type };


    let tx = db.transaction("Gallery", "readwrite");
    let gallery = tx.objectStore("Gallery");
    gallery.add(obj);
}

//gallery.html
function viewMedia(media, type) {
    let tx = db.transaction("Gallery", "readonly");
    let gallery = tx.objectStore("Gallery");
    let cReq = gallery.openCurser(); // cursor required 


    cReq.addEventListener("success", function () {
        let cursor = cReq.result;
        if (cursor) {
            console.log(curser.value);
            let mo = cursor.value; // media object

            let linkForDownloadBtn;
            let div = document.createElement("div");
            div.classList.add("media-container");

            // dom ke through media container banao
            if (mo.type == "video") {
                // I have to render a video tag

                window.URL.createObjectURL();
                div.innerText = `<div class="media">
                <video scr="${cursor.value}" autoplay loop controls muted></video>
            </div>
    
            <button class="download">Download</button>
            <button class="delete">Delete</button>`;

            } else {
                // I have to render a image tag
                let div = document.createElement("div");
                div.classList.add("media-container");

                div.innerText = `<div class="media">
                <img scr="${cursor.value.media}"></img>
            </div>
    
            <button class="download">Download</button>
            <button class="delete">Delete</button>`;

            }

            let downloadBtn = div.querySelector(".download");
            downloadBtn.addEventListener("click", function () {
                let a = document.createElement("a");
                a.href = link;
                a.download = "img.png";
                a.click();
                a.remove();
            });

            cursor.continue();
        }

    });
}