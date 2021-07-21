let video = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let recDiv = recordBtn.querySelector("div");
// let stopBtn = document.querySelector("#stop");
let capBtn = document.querySelector("#capture");
let capDiv = capBtn.querySelector("div");

let body = document.querySelector("body");

// global variables
let mediaRecorder;
let isRecording = false;
let appliedFilter; // global bana dia taki jab image save kara tab bhi yaa filter image pai laga saka
let chunks = [];

// range of zoom (1 to 3)
let minZoom = 1;
let maxZoom = 3;
let currZoom = 1; // no zoom right now

let filters = document.querySelectorAll(".filter"); // return list of filters


let zoomInBtn = document.querySelector(".zoom-in");
let zoomOutBtn = document.querySelector(".zoom-out");



let galleryBtn = document.querySelector("#gallery");

galleryBtn.addEventListener("click", function(){
    // localhost: 5500/index.html => localhost:5500/gallery.html
    location.assign("gallery.html");
});

// www.google.com/homehtml => www.google.com/gallery.html

zoomInBtn.addEventListener("click", function(e){
    if(currZoom < maxZoom){
        currZoom = currZoom + 0.1;
    }

    console.log(video.style.transform); // print scale(); of the video

    // increasing scale of video tag
    video.style.transform = `scale(${currZoom})`;
});

zoomOutBtn.addEventListener("click", function(e){
    if(currZoom > minZoom){
        currZoom = currZoom - 0.1;
    }

    console.log(video.style.transform); // print scale(); of the video

    // decreasing scale of video tag
    video.style.transform = `scale(${currZoom})`;
});


// filter applying on body
for( let i = 0 ; i < filters.length ; i++ ){
    filters[i].addEventListener("click", function(e){
        removeFilter(); // removing pahala vala filter, then we can apply new filter
        // e => color hai jispa click kia hai filter kaa filter-container mai
        // console.log( e.currentTarget.style.backgroundColor); // color of filter ko print kar lia
        appliedFilter = e.currentTarget.style.backgroundColor;
        console.log(appliedFilter); // print filter color
        
        // creating div for appling it on video recording ka time huma koi filter nahi chahia-container
        let  div = document.createElement("div");
        div.style.backgroundColor = appliedFilter;
        div.classList.add("filter-div");
        body.append(div); // we can append in video container also
    });
}



// startBtn.addEventListener("click", function () {
//     // code likha jise recording start ho
//     mediaRecorder.start();
// });

// stopBtn.addEventListener("click", function () {
//     // code likha jise recording band ho
//     mediaRecorder.stop();
// });


// recoding button pai click pai record kar raha hai
recordBtn.addEventListener("click", function(){
    if(isRecording){
        mediaRecorder.stop();
        isRecording = false;
        // e.currentTarget.inneerText = "Stop"; 
        recDiv.classList.remove("record-animation");
    }else{
        mediaRecorder.start();
        isRecording = true;

        // ------removing filter when recording video------------
        appliedFilter = ""; // (REMOVE COLOR) color remove kar dia kio ki video recording karna kaa badd agar dubara pic click kara tho usma purana filter naa aya
        removeFilter(); // (REMOVE FROM UI) removing filter because huma video recording ka time koi filter nahi chahia
        // e.currentTarget.innerText = "Recording"; // recording hoo rahi hai tho 'record' ki jaga 'recording' likha aya gaa
        // e.currentTarget.innerText = "Recording"; // recording hoo rahi hai tho 'record' ki jaga 'recording' likha aya gaa

        // -------------------------------
        // we dont want zoom while recording video
        currentZoom = 1;
        video.style.transform = `scale(${currentZoom})`; // zoom UI se remove kar dia 


        recDiv.classList.add("record-animation"); // class mai add kar dii taki woo animation iss record btn pai lag jai, jab record btn pai click hoo
    }
});

// click photos
capBtn.addEventListener("click", function () {
    // joobhi image screen pr dikhara usse save karawna

    // agar recording hoo rahi hai tho return kar doo, photo click nahi hongi video recording ka time
    if(isRecording)  return;

    capDiv.classList.add("capture-animation");
    setTimeout(() => {
        capDiv.classList.remove("capture-animation");
    }, 1000); // removing animation after 1 second, because we want to add animation afterwards also( if we donot remove class then we will have problem because animation class allready exist there) 

    //------------------------------------------
    // creating new canvas in html 
    let canvas = document.createElement("canvas");
    // canvas ki height & width video joo capture hoo rahi hai uska resolution jitni lani hai, tho hum video joo capture hoo rahi hai uski height & width daa dai gaa

    canvas.width = video.videoWidth;  // video.videoWidth => gives video width  
    canvas.height = video.videoHeight; // video.video recording ka time huma koi filter nahi chahiaHeight => gives video Height 

    // canvas pai image draw karni hai joo capture kari hai, uska lia ik tool laa lia
    let tool = canvas.getContext("2d");

    // -----------------------------
    // ZOOM IMAGE ON CANVAS AND THEN DOWNLOAD
    // Origin shift
    tool.translate(canvas.width / 2, canvas.height / 2 );
    tool.scale(currZoom, currZoom); // .scale(x, y); increase the size of image on canvas by specified scale

    tool.translate(-canvas.width / 2, -canvas.height / 2 ); // origin kaa wapis top left corner pai shift kar dia
     
    tool.drawImage(video, 0, 0); // video se image draw kar raha hai canvas pai


    //-------------------------------------
    // appling filter on image we are saving
    if(appliedFilter){
        // drawning rectangle on canvas with filter color
        tool.fillStyle = appliedFilter; // canvas pai filter color apply kar dia
        tool.fillRect(0, 0, canvas.width, canvas.height); // rectangle draw kar raha hai canvas ki size kaa
    }



    // for image we will save this data url 
    // uss drawn image on canvas ka link generate hoo raha hai
    let link = canvas.toDataURL(); // canvas.toDataURL() => uss canvas pai joo bhi draw kia hai usku ik URL generate kar doo & yaa url 'data' URL hai & cantains all info of drawing in canvas
    // console.log(link);


    addMedia(link, "image");


    // let a = document.createElement("a");
    // a.href = link;
    // a.download = "img.png";
    // a.click();
    // a.remove(); // removing from html because we donot need on this html 
    // canvas.remove(); // removing canvas from html, canvas nahi chahia huma
});


// to get user audio and video
// return promise which is (mediaStream)
navigator.mediaDevices
    .getUserMedia({ video: true, audio: true }) // ask the browser permission => allow, return promise which is => (mediaStream)
    .then(function (mediaStream) { // mediaStream => object, return track( which contains audio and video file)

        // let options = {mimeType: "video/webm"};
        // mediaRecorder = new MediaRecorder(mediaStream, options);

        // global bana dia hia kio ki iss fn ka bahar bhi use karna hai
        // mediaRecorder type ka ikk object bano jiska mediaStream(that have camera & mic input as audio & video recording ka time huma koi filter nahi chahia) name ka object dalo  
        mediaRecorder = new  MediaRecorder(mediaStream);  // mediaRecorder gives some events dataavailable, stop to record.

        // video ka thukra or chunks mil raha hai usa phala store kar lia ikk array mai
        mediaRecorder.addEventListener("dataavailable", function (e) {
            chunks.push(e.data);
        });

        // 'stop' event taab chalta hai jab mediaRecorder.stop(); chalta hai
        mediaRecorder.addEventListener("stop", function (e) {
            // video recording ka time huma koi filter nahi chahia joo record hoo rahi hai usa chunks  name kaa array mai dal dia hai & huma abb usa abb combine karna hai
            // blob is an object
            //yaa join or combine karta hai (chuncks of video) in chunks array koo, aur voo mp4 & video type kaa chunks hai
            // 
            let blob = new Blob(chunks, { type: "video/mp4" }); // blob is like large binary file, 
            chunks = []; // chunks vala array koo empty kar dia, taki agli bar recording karna pai pichli recording naa aya


            addMedia(blob, "video");


            // chunks are being created in RAM
            // agar kisi anker 'a' tag pai agar koi file attach hoti hai & uspa click karta hai tho woo file download hoo jai gii 
            // let a = document.createElement("a");

            // let url = window.URL.createObjectURL(blob); // blob kaa ik link create kia hai
            // a.href = url;
            // a.download = "video.mp4"; // joo file download kar raha hai uska name likhta hai
            // a.click(); // click to download the file
            // a.remove();
        });

        video.srcObject = mediaStream; // srcObject => preDefined
    }).catch(function (err) {
        console.log(err);
    });

// navigator.mediaDevices
//     .getUserMedia({ video: true}) // ask the browser permission => allow, promise 
//     .then(function(mediaStream){ // mediaStream => object, return track( which contains audio and video file)
//         video.srcObject = mediaStream; // srcObject => preDefined
// }).catch(function(err){
//     console.log()
// }); 

// navigator.mediaDevices
//     .getUserMedia({audio: true}) // ask the browser permission => allow, promise 
//     .then(function(mediaStream){ // mediaStream => object, return track( which contains audio and video file)
//         video.srcObject = mediaStream; // srcObject => preDefined
// }).catch(function(err){
//     console.log()
// }); 




// if filter is applied, then removing the current filter and then we can apply new filter.
function removeFilter(){
    let Filter = document.querySelector(".filter-div");
    if(Filter) 
        Filter.remove();
}




