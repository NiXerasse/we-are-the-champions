import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js"
import { getDatabase, ref, onValue, push, update } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-database.js"

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
    if (!isValidInput()) {
        return
    }
    const newEndorsement = {
        to: toInputEl.value,
        from: fromInputEl.value,
        text: endorsementInputEl.value,
        likes: 0,
    }
    push(endorsementsDB, JSON.stringify(newEndorsement))
})

function isValidInput() {
    if (!endorsementInputEl.value) {
        endorsementInputEl.focus()
        return
    }
    if (!fromInputEl.value) {
        fromInputEl.focus()
        return false
    }
    if (!toInputEl.value) {
        toInputEl.focus()
        return false
    }
    return true
}

onValue(endorsementsDB, function (snapshot) {
    clearEndorsements()
    if (!snapshot.val()) {
        return
    }
    
    const dbEntries = Object.entries(snapshot.val())
    for (let i = dbEntries.length - 1; i >= 0; i--) {
        addEndorsementFromDatabaseToDOM(dbEntries[i])
    }
})

function clearEndorsements() {
    endorsementsEl.innerHTML = ""
}

function addEndorsementFromDatabaseToDOM(dbEntry) {
    const entryId = dbEntry[0]
    const entryData = JSON.parse(dbEntry[1])
    const newEndorsementEl = createEndorsementEl(entryData, function () {
        processLikeCount(dbEntry)
    })
    endorsementsEl.append(newEndorsementEl)    
}

function processLikeCount(dbEntry) {
    const entryId = dbEntry[0]
    const entryData = JSON.parse(dbEntry[1])

    if (localStorage.getItem(entryId)) {
        localStorage.removeItem(entryId)
        entryData.likes -= 1
    } else {
        localStorage.setItem(entryId, "liked")
        entryData.likes += 1
    }

    const updates = {}
    updates[`endorsements/${entryId}`] = JSON.stringify(entryData)
    update(ref(database), updates)
}

function createEndorsementEl(data, onClick) {
    let endorsementEl = document.createElement("div")
    endorsementEl.className = "endorsement"
    endorsementEl.innerHTML = `
        <h3>To ${data.to}</h3>
        <p>${data.text}</p>
        <div class="endorsement-footer">
            <h3>From ${data.from}</h3>
            <h3 class="like-entry">🖤 ${data.likes}</h3>
        </div>
    `
    endorsementEl.addEventListener("click", onClick)
    return endorsementEl
}