import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js"

const appConfig = {
    databaseURL: "https://we-are-the-champions-a130a-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appConfig)
const database = getDatabase(app)
const endorsementsDB = ref(database, "endorsements")

const endorsementInputEl = document.getElementById("endorsement-input")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")
const endorsementsEl = document.getElementById("endorsements")
const publishBtnEl = document.getElementById("publish-btn")

publishBtnEl.addEventListener("click", function () {

    console.log("Clicked...")

})

onValue(endorsementsDB, function (snapshot) {
    clearEndorsements()
    if (!snapshot.val()) {
        return
    }
    
    const dbEntries = Object.entries(snapshot.val())
    console.log(dbEntries)
    for (let i = 0; i < dbEntries.length; i++) {
        const entryId = dbEntries[i][0]
        const entryData = JSON.parse(dbEntries[i][1])
        const newEndorsementEl = createEndorsementEl(entryData, function () {
            console.log("Entry clicked")
        })
        endorsementsEl.appendChild(newEndorsementEl)
    }
})

function clearEndorsements() {
    endorsementsEl.innerHTML = ""
}

function createEndorsementEl(data, onClick) {
    let endorsmentEl = document.createElement("div")
    endorsementsEl.className = "endorsement"
    endorsementsEl.innerHTML = `
        <h3>To ${data.to}</h3>
        <p>${data.text}</p>
        <div class="endorsement-footer">
            <h3>From ${data.from}</h3>
            <h3 class="like-entry">🖤 ${data.likes}</h3>
        </div>
    `
    endorsmentEl.addEventListener("click", onClick)
    return endorsementsEl
}

// let endorsement = {
//     to: "Abdellah",
//     from: "Sindre",
//     text: "That transcription feature you completed for Scrimba 3.0 is amazing. I know you’ve been working hard on it for several months now. 👏👏👏 Really good work 🙌",
//     likes: 7,
// }

// push(endorsementsDB, JSON.stringify(endorsement))