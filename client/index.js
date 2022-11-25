// INITIAL DATABASE RETRIEVAL AND SETUP

document.addEventListener("DOMContentLoaded", () => {
    connectAPI();
});

async function connectAPI() {
    const url = "http://localhost:6000/getAll";
    await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to retrieve data properly.");
            } else {
                return response.json();
            }
        })
        .then((data) => {
            loadHTMLTable(data["data"]);
        })
        .catch((err) => {
            console.log(err.message);
        });
}

const tableBody = document.getElementById("people-table-body");

// INITIAL RETRIEVAL OF DATA AND LOADING OF ITEMS (IF ANY) IN TABLE

function loadHTMLTable(data) {
    //console.log("REAL TEST");
    if (data.length === 0) {
        tableBody.innerHTML =
            '<tr id="no-data"><td colspan="5">No Data</td></tr>';
    } else {
        tableBody.innerHTML = "";
        for (i = 0; i < data.length; i++) {
            //console.log(data);
            const currentObj = data[i];
            tableBody.innerHTML += `<tr class="user-data" id="user_${currentObj.user_id}">
                    <td>${currentObj.user_id}</td>
                    <td class="user-name">${currentObj.name}</td>
                    <td>${currentObj.date_added}</td>
                    <td><button class="delete" data-id=${currentObj.user_id}>Delete</button></td>
                    <td><button class="edit" data-popup-target=".popup" data-id=${currentObj.user_id}>Edit</button></td>
                </tr>`;
        }
    }
}

// INSERT A NEW USER BY CLICKING THE ADD BUTTON

const addUserForm = document.getElementById("add-user-form");
const addBtn = document.getElementById("add-name-button");

addUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("name-input");
    if (nameInput.value.toLowerCase() === "") {
        throw new Error("Cannot add a blank name value");
    }
    const nameVal = nameInput.value;
    nameInput.value = "";
    console.log("Inserting ", nameVal, " in the table now...");

    const url = "http://localhost:6000/insert";
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ name: nameVal }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to post data properly");
            } else {
                return response.json();
            }
        })
        .then((data) => {
            insertRowIntoTable(data["data"]);
        })
        .catch((err) => console.log(err.message));
});

function insertRowIntoTable(data) {
    console.log("Insert Row Data: " + data);
    const id = data.id;
    const name = data.name;
    const dateAdded = data.dateAdded;
    console.log("id: ", id, ", name: ", name, ", dateAdded: ", dateAdded);
    if (document.getElementById("no-data")) {
        document.getElementById("no-data").remove();
    }
    tableBody.innerHTML += `<tr class="user-data" id="user_${id}">
                    <td>${id}</td>
                    <td class="user-name">${name}</td>
                    <td>${dateAdded}</td>
                    <td><button class="delete" data-id=${id}>Delete</button></td>
                    <td><button class="edit" data-popup-target=".popup" data-id=${id}>Edit</button></td>
                </tr>`;
}

// DELETE A USER BY CLICKING THE DELETE BUTTON

tableBody.addEventListener("click", (e) => {
    if (e.target.className === "delete") {
        deleteRowByID(e.target.dataset.id);
    }
});

async function deleteRowByID(id) {
    const url = "http://localhost:6000/delete/" + id;
    await fetch(url, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err.message));

    document.getElementById("user_" + id).remove();

    if (tableBody.innerHTML === "") {
        tableBody.innerHTML =
            '<tr id="no-data"><td colspan="5">No Data</td></tr>';
    }
}

// FINDS A USER BY NAME WHEN SEARCH BUTTON IS CLICKED

searchForm = document.getElementById("search-form");
searchBtn = document.getElementById("search-button");
searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Searching for user: " + searchInput.value.toLowerCase());
    if (searchInput.value === "") {
        connectAPI();
    } else {
        searchByName(searchInput.value.toLowerCase());
        searchInput.value = "";
    }
});

async function searchByName(name) {
    const url = "http://localhost:6000/get/" + name;
    await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to retrieve user by name properly.");
            } else {
                return response.json();
            }
        })
        .then((data) => {
            loadHTMLTable(data["data"]);
        })
        .catch((err) => console.log(err.message));
}

// OPENS A POPUP FORM WHEN THE USER WANTS TO EDIT AN EXISTING FIELD

const closePopupButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");

tableBody.addEventListener("click", (e) => {
    if (e.target.className === "edit") {
        const popup = document.querySelector(e.target.dataset.popupTarget);
        //console.log(popup)'
        userID = e.target.dataset.id;
        const newUserForm = document.getElementById("new-user-form");
        newUserForm.dataset.currentId = userID;
        openPopup(popup);
    }
});

closePopupButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
        const popup = button.closest(".popup");
        // console.log(button.id);
        if (button.id === "edit-button") {
            const editVal = document.getElementById("edit-input").value;
            if (editVal !== "") {
                closePopup(popup);
            }
        } else {
            closePopup(popup);
        }
    });
});

function openPopup(popup) {
    if (popup == null) {
        return;
    } else {
        popup.classList.add("active");
        overlay.classList.add("active");
    }
}

function closePopup(popup) {
    if (popup == null) {
        return;
    } else {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    }
}

// EDITS A USER'S NAME WHEN VALID VALUE IS ENTERED IN POPUP

const newUserForm = document.getElementById("new-user-form");
const editInput = document.getElementById("edit-input");

newUserForm.addEventListener("submit", (e) => {
    e.preventDefault();
    editVal = editInput.value;
    editInput.value = "";
    const currentUserID = newUserForm.dataset.currentId;
    console.log("Changing user " + currentUserID + "'s name to: " + editVal);
    const currentUserRow = document.getElementById("user_" + currentUserID);
    const currentUserName = currentUserRow.querySelector(".user-name");
    editExistingUser(currentUserName, editVal, currentUserID);
});

async function editExistingUser(currentUserName, name, id) {
    url = "http://localhost:6000/update/" + id;
    await fetch(url, {
        method: "PUT",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ name: name, id: id }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error when trying to update this user.");
            } else {
                return response.json();
            }
        })
        .then((data) => {
            console.log(data);
            console.log("Server-side rendering...");
            currentUserName.innerText = data.name;
        })
        .catch((err) => console.log(err.message));
}
