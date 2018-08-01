// window.addEventListener("load",loadFromLocalDB);

function loadIssues(issueList,method){
  var issueListBody = document.getElementById("issueListBody");
  for(var issue in issueList){
    if(issueList[issue].id){
      var issueID = issueList[issue].issueID;
      var newRow = document.createElement("tr");
      newRow.setAttribute("class","listItem_" + issueList[issue].status);
      newRow.setAttribute("id","listItem"+issueID);

      var idCell = document.createElement("td");
      idCell.appendChild(document.createTextNode(issueID));
      newRow.appendChild(idCell);

      var issueLink = document.createElement("a");
      issueLink.setAttribute("href","issue.html?issue="+issueID);
      issueLink.appendChild(document.createTextNode(issueList[issue].issueName));
      
      var issueLinkCell = document.createElement("td");
      issueLinkCell.appendChild(issueLink);
      newRow.appendChild(issueLinkCell);

      var issueTypeCell = document.createElement("td");
      issueTypeCell.appendChild(document.createTextNode(issueList[issue].issueType));
      newRow.appendChild(issueTypeCell);

      var issueDescriptionCell = document.createElement("td");
      issueDescriptionCell.appendChild(document.createTextNode(issueList[issue].issueDescription));
      newRow.appendChild(issueDescriptionCell);
      
      var closeOrOpenButton = document.createElement("button");
      closeOrOpenButton.setAttribute("id","resolve"+issueID);
      if(issueList[issue].status == "open"){
        if(method === "firebase"){
          closeOrOpenButton.setAttribute("onclick","closeIssueFirebase("+issueID+")");
        } else {
          closeOrOpenButton.setAttribute("onclick","closeIssue("+issueID+")");
        }
        closeOrOpenButton.appendChild(document.createTextNode("Close Issue"));
      } else {
        if(method === "firebase"){
          closeOrOpenButton.setAttribute("onclick","openIssueFirebase("+issueID+")");
        } else {
          closeOrOpenButton.setAttribute("onclick","openIssue("+issueID+")");
        }
        closeOrOpenButton.appendChild(document.createTextNode("Open Issue"));
      }
      
      closeOrOpenButtonCell = document.createElement("td");
      closeOrOpenButtonCell.appendChild(closeOrOpenButton);
      newRow.appendChild(closeOrOpenButtonCell);

      var deleteButton = document.createElement("button");
      deleteButton.setAttribute("onclick","openDeletionConfirmation("+issueID+")");
      deleteButton.appendChild(document.createTextNode("Delete"));

      var deleteButtonCell = document.createElement("td");
      deleteButtonCell.appendChild(deleteButton);
      newRow.appendChild(deleteButtonCell);

      issueListBody.appendChild(newRow);
    }
  }
  if(method === "rest"){
    document.getElementById("deliveryMethodHeading").innerText = "REST";
  } else {
    document.getElementById("deliveryMethodHeading").innerText = "Firebase SDK";
  }
  
}

function closeIssue(item){
  var itemToClose = document.getElementById("listItem" + item);
  itemToClose.style = "font-style: italic";
  itemToClose.className = "listItem_closed";
  var resolveButton = document.getElementById("resolve"+item);
  resolveButton.innerText = "Open Issue";
  resolveButton.onclick = function(){openIssue(item)};
  var xhr_set_closed = new XMLHttpRequest();
  xhr_set_closed.open("PATCH","http://localhost:3000/issueList/"+item,true);
  xhr_set_closed.setRequestHeader("Content-Type","application/json");
  xhr_set_closed.send(JSON.stringify({status:"closed"}));
}
function openIssue(item){
  var itemToOpen = document.getElementById("listItem" + item);
  itemToOpen.style = "font-style: normal";
  itemToOpen.className = "listItem_open";
  var resolveButton = document.getElementById("resolve"+item);
  resolveButton.innerText = "Close Issue";
  resolveButton.onclick = function(){closeIssue(item)};
  var xhr_set_open = new XMLHttpRequest();
  xhr_set_open.open("PATCH","http://localhost:3000/issueList/"+item,true);
  xhr_set_open.setRequestHeader("Content-Type","application/json");
  xhr_set_open.send(JSON.stringify({status:"open"}));
}

function closeIssueFirebase(item){
  var itemToClose = document.getElementById("listItem" + item);
  itemToClose.style = "font-style: italic";
  itemToClose.className = "listItem_closed";
  var resolveButton = document.getElementById("resolve"+item);
  resolveButton.innerText = "Open Issue";
  resolveButton.onclick = function(){openIssue(item)};
  firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/issueList/"+item).update({status:"closed"});
}

function openIssueFirebase(item){
  var itemToOpen = document.getElementById("listItem" + item);
  itemToOpen.style = "font-style: normal";
  itemToOpen.className = "listItem_open";
  var resolveButton = document.getElementById("resolve"+item);
  resolveButton.innerText = "Close Issue";
  resolveButton.onclick = function(){closeIssue(item)};
  firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/issueList/"+item).update({status:"open"});
}
function showAllIssues(){
  var showIssuesCheckbox = document.getElementById("showIssuesCheckbox");
  var table = document.getElementById("issueTable");
  table.className="showAll";
  showIssuesCheckbox.onclick = function(){showOnlyOpenIssues()};
}
function showOnlyOpenIssues(){
  var showIssuesCheckbox = document.getElementById("showIssuesCheckbox");
  var table = document.getElementById("issueTable");
  table.className="showOnlyOpen";
  showIssuesCheckbox.onclick = function(){showAllIssues()};
}
var numIssueToDelete;
function openDeletionConfirmation(item){
  var deletionModal = document.getElementById("deletionModal");
  numIssueToDelete = item;
  deletionModal.hidden = false;
}
function cancelDeletion(){
  var deletionModal = document.getElementById("deletionModal");
  deletionModal.hidden = true;
}
function confirmDeletion(method){
  var elIssueToDelete = document.getElementById("listItem" + numIssueToDelete);
  elIssueToDelete.parentNode.removeChild(elIssueToDelete);
  if(method === "firebase"){
    deleteFromFirebase();
  } else {
    deleteFromRestDB();
  }
  deletionModal.hidden = true;
}

// Helper function to search through issue array
function checkID(issue){
  return issue.issueID == numIssueToDelete;
}

function deleteFromRestDB(){
  var xhr_delete_issue_list_item = new XMLHttpRequest();
  xhr_delete_issue_list_item.open("DELETE","http://localhost:3000/issueList/"+numIssueToDelete,true);
  xhr_delete_issue_list_item.setRequestHeader("Content-Type","application/json");
  xhr_delete_issue_list_item.send();

  var xhr_delete_issue_contents = new XMLHttpRequest();
  xhr_delete_issue_contents.open("DELETE","http://localhost:3000/issueContents/"+numIssueToDelete,true);
  xhr_delete_issue_contents.setRequestHeader("Content-Type","application/json");
  xhr_delete_issue_contents.send();

}

function deleteFromFirebase(){
  firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/issueList/"+numIssueToDelete).remove();
  firebase.database().ref("users/"+firebase.auth().currentUser.uid+"/issueContents/"+numIssueToDelete).remove();
}

function loadFromRestDB(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET","http://localhost:3000/issueList",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      loadIssues(JSON.parse(xhr.responseText),"rest");
    }
  }
  xhr.send();
}

function loadFromFirebaseDB(uid){
  firebase.database().ref("/users/"+uid+"/issueList")
    .once("value")
      .then(function(snapshot){
        loadIssues(snapshot.val(),"firebase");
      });
}
// Places the button used for swapping between Firebase and REST
function placeDeliveryButton(method){
  var signOutButton = document.getElementById("signOutButton");
  var deliveryButton = document.createElement("button");
  if(method === "rest"){
    deliveryButton.innerText = "Reload the page w/ Firebase SDK delivery";
    deliveryButton.onclick=function(){
      firebase.database().ref("users/"+firebase.auth().currentUser.uid).update({method:"firebase"});
      window.location.reload();
    };
  }else{
    deliveryButton.innerText = "Reload the page w/ REST delivery";
    deliveryButton.onclick=function(){
      firebase.database().ref("users/"+firebase.auth().currentUser.uid).update({method:"rest"});
      window.location.reload();
    };
  }
    signOutButton.parentNode.insertBefore(deliveryButton,signOutButton.nextSibling);
}