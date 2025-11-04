const firebaseConfig = {
  apiKey: "AIzaSyD8YoCf1Fakme9odzNvrZt-vgp3Zh_5AUM",
  authDomain: "todo-application-a001.firebaseapp.com",
  databaseURL: "https://todo-application-a001-default-rtdb.firebaseio.com",
  projectId: "todo-application-a001",
  storageBucket: "todo-application-a001.firebasestorage.app",
  messagingSenderId: "176767202366",
  appId: "1:176767202366:web:996dab3aa5a1389ab30d6f"
};

const frb = firebase.initializeApp(firebaseConfig);
console.log(frb.database);

var input = document.getElementById("todo");

function addTodo() {
  if (input.value.trim() !== "") {
    var key = firebase.database().ref("todos").push().key;

    var obj = {
      UserValue: input.value,
      Key: key,
    };

    firebase.database().ref("todos").child(key).set(obj);

    var liELement = document.createElement("li");
    var liText = document.createTextNode(input.value);
    liELement.appendChild(liText);
    liELement.setAttribute("data-key", key);
    liELement.style.fontSize = "2rem";

    var delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.setAttribute("onclick", "deleteSingleItem(this)");
    delBtn.setAttribute("data-key", key);

    var editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.setAttribute("onclick", "editSingleItem(this)");

    liELement.appendChild(delBtn);
    liELement.appendChild(editBtn);
    document.getElementById("todoList").appendChild(liELement);

    input.value = "";
  } else {
    alert("Please enter a task!");
  }
}

// Delete All
function deleteAll() {
  var confirmDelete = confirm("Are you sure you want to delete all todos?");
  if (confirmDelete) {
    // Firebase se delete
    firebase.database().ref("todos").remove()
    .then(() => {
      console.log("All todos deleted from Firebase");
      // UI se bhi delete
      document.getElementById("todoList").innerHTML = "";
    })
    .catch((error) => {
      console.error("Error deleting all todos:", error);
    });
  }
}


// Delete 1 Item
function deleteSingleItem(e) {
  var li = e.parentNode;
  var key = e.getAttribute("data-key"); 
  firebase.database().ref("todos").child(key).remove(); 
  li.remove(); 
}


// Edit Item
function editSingleItem(e) {
  var li = e.parentNode;
  var key = li.getAttribute("data-key");
  var updatedValue = prompt("Enter your updated task", li.firstChild.nodeValue);

  if (updatedValue !== null && updatedValue.trim() !== "") {
    // Firebase update
    firebase.database().ref("todos").child(key).update({
      UserValue: updatedValue
    })
    .then(() => {
      console.log("Firebase Updated");
      li.firstChild.nodeValue = updatedValue; // UI update
    })
    .catch((error) => {
      console.error("Error updating Firebase:", error);
    });
  }
}
