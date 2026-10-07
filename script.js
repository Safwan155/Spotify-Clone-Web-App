console.log('lets write js');


let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;

    let a = await fetch(`/${folder}/`)
    let response = await a.text()
    console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // show all the songs in the playlist
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ").replaceAll("%26", " ").replaceAll("%C2%A0", " ")}</div>
                                <div>harry</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`

    }

    //attach an eventlistener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            /* The `console.log` function is used to output a message or an object to the console. In
            this JavaScript code snippet, `console.log` is being used to log various messages and
            data for debugging and informational purposes. For example, it is used to log messages
            like "lets write js", responses from fetch requests, current song details, time updates
            during music playback, and various other log messages to help track the flow of the
            program and debug any issues that may arise. */
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs

}

const PlayMusic = (track, pause = false) => {
    // let audio = new Audio(`/${folder}/` + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbums() {
    try {
        // 🔹 1. Fetch folder list from manifest.json
        let res = await fetch(`/songs/manifest.json`);
        let data = await res.json();

        // 🔹 2. Clear card container
        let cardContainer = document.querySelector(".cardcontainer");
        cardContainer.innerHTML = "";

        // 🔹 3. Loop through each folder listed in manifest.json
        for (let folder of data.folders) {
            // Fetch info.json for each album
            let infoRes = await fetch(`/songs/${folder}/info.json`);
            let info = await infoRes.json();

            // Create the album card
            cardContainer.innerHTML += `
        <div data-folder="${folder}" class="card">
          <div class="play">
            <svg fill="#000000" height="18px" width="18px" style="transform: translate(1px, -2px);"
                version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.114 460.114"
                xml:space="preserve">
                <g><path d="M393.538,203.629L102.557,5.543c-9.793-6.666-22.468-7.372-32.94-1.832
                c-10.472,5.538-17.022,16.413-17.022,28.26v396.173
                c0,11.846,6.55,22.721,17.022,28.26c10.471,5.539,23.147,4.834,32.94-1.832
                l290.981-198.087c8.746-5.954,13.98-15.848,13.98-26.428
                C407.519,219.477,402.285,209.582,393.538,203.629z"></path></g>
            </svg>
          </div>

          <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${info.title}</h2>
          <p>${info.description}</p>
        </div>`;
        }

        // 🔹 4. Add click listeners to all album cards
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log(`Fetching songs for ${item.currentTarget.dataset.folder}`);
                songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
                PlayMusic(songs[0])
            });
        });

    } catch (error) {
        console.error("Error loading albums:", error);
    }
}


// async function displayAlbums() {
//     let a = await fetch(`/songs/`)
//     let response = await a.text()
//     console.log(response);

//     let div = document.createElement("div")
//     div.innerHTML = response;
//     console.log(div);

//     let anchors = div.getElementsByTagName("a")
//     console.log(anchors);

//     let cardContainer = document.querySelector(".cardcontainer")
//     let array = Array.from(anchors)
//     for (let index = 0; index < array.length; index++) {
//         const e = array[index];

//         if (e.href.includes("/songs")) {
//             let folder = e.href.split("/").slice(-1)[0];
//             console.log(folder);


//             console.log("fetching:", `/songs/${folder}/info.json`);
//             //get the meta data of the folder
//             let a = await fetch(`http://127.0.0.1:550/songs/${folder}/info.json`)
//             let response = await a.json()
//             console.log(response);
//             cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${fplder}" class="card">
//                         <div class="play">
//                             <svg fill="#000000" height="18px" width="18px" style="transform: translate(1px, -2px);"
//                                 version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
//                                 xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 460.114 460.114"
//                                 xml:space="preserve">
//                                 <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
//                                 <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
//                                 <g id="SVGRepo_iconCarrier">
//                                     <g>
//                                         <g>
//                                             <path
//                                                 d="M393.538,203.629L102.557,5.543c-9.793-6.666-22.468-7.372-32.94-1.832c-10.472,5.538-17.022,16.413-17.022,28.26v396.173 c0,11.846,6.55,22.721,17.022,28.26c10.471,5.539,23.147,4.834,32.94-1.832l290.981-198.087 c8.746-5.954,13.98-15.848,13.98-26.428C407.519,219.477,402.285,209.582,393.538,203.629z">
//                                             </path>
//                                         </g>
//                                     </g>
//                                 </g>
//                             </svg>

//                         </div>


//                         <img src="/songs/${folder}/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`

//         }
//     }

//     //load the playlist when the card is clicked
//     Array.from(document.getElementsByClassName("card")).forEach(e => {
//         e.addEventListener("click", async item => {
//             console.log("fetching songs");
//             songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

//         })
//     })

// }
async function main() {


    // get the list of all songs
    await getsongs("songs/ncs")
    PlayMusic(songs[0], true)

    //display all the albums on the page
    displayAlbums()

    //attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })


    // play the first song
    // var audio = new Audio(songs[0])
    // audio.play()

    // audio.addEventListener("loadeddata",() => {
    //     let duration = audio.duration
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);
    // the duration variable now holds the duration (in seconds) of the audio clip



    //listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"

    })

    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = currentSong.duration * percent / 100

    })
    // add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    // add an event listener for close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add an event listener for previous and next
    previous.addEventListener("click", () => {
        console.log('previous clicked');
        console.log(currentSong);

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(songs, index);
        if ((index - 1) >= 0) {
            PlayMusic(songs[index - 1])

        }
    })

    next.addEventListener("click", () => {
        currentSong.pause
        console.log('next clicked');
        console.log(currentSong.src);


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        console.log(songs, index);
        if ((index + 1) < songs.length) {
            PlayMusic(songs[index + 1])
        }




    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100
        if(currentSong.volume>0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }

    })

    //add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        }
        else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }

    })




}
main()


