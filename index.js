import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://shopping-cart-database-1a427-default-rtdb.asia-southeast1.firebasedatabase.app/" //db url
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")


const inputTxt = document.getElementById("input-txt")
const cartBtn = document.getElementById("cart-btn")
const itemsUl = document.getElementById("items-el")

//getting items from db
onValue(shoppingListInDB, function (snapshot) {
    clearUl()
    if (snapshot.exists()) {
        let items = snapshot.val()
        let itemsArray = Object.entries(items)

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            appendItemsToList(currentItem)
        }
    }
    else {
        let pEl = document.createElement("span")
        pEl.textContent = "no items yet......"
        itemsUl.append(pEl)
    }

})


cartBtn.addEventListener("click", function () {
    let inputValue = inputTxt.value
    if (inputValue != "") {
        push(shoppingListInDB, inputValue)
        addMp3.play()
        clearInputField()
    }
    else{
        errorMp3.play()
    }
})

function clearInputField() {
    inputTxt.value = ""
}

function appendItemsToList(item) {
    let itemID = item[0]
    let itemValue = item[1]
    let newListItem = document.createElement("li")
    newListItem.textContent = itemValue
    itemsUl.append(newListItem)

    newListItem.addEventListener("click", function () {
        let locationOfItem = ref(database, `shoppingList/${itemID}`)
        remove(locationOfItem)
        removeMp3.play()
    })
}

function clearUl() {
    itemsUl.innerHTML = ""
}


//adding sound effects
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}
const addMp3 = new sound("add.mp3")
const removeMp3 = new sound("tictok.mp3")
const errorMp3 = new sound("error.mp3")