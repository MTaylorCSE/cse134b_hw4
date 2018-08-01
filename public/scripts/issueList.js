// window.addEventListener("load",loadFromLocalDB);

function loadIssues(issueList){
  var issueListBody = document.getElementById("issueListBody");
  var issue;

  for(var issue in issueList){
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
      closeOrOpenButton.setAttribute("onclick","closeIssue("+issueID+")");
      closeOrOpenButton.appendChild(document.createTextNode("Close Issue"));
    } else {
      closeOrOpenButton.setAttribute("onclick","openIssue("+issueID+")");
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
function showAllIssues(){
  var showIssuesCheckbox = document.getElementById("showIssuesCheckbox");
  var closedIssues = document.getElementsByClassName("listItem_closed");
  var i = 0;
  for(i; i < closedIssues.length; i++){
      closedIssues.item(i).hidden = false;
  }
  showIssuesCheckbox.onclick = function(){showOnlyOpenIssues()};
}
function showOnlyOpenIssues(){
  var showIssuesCheckbox = document.getElementById("showIssuesCheckbox");
  var closedIssues = document.getElementsByClassName("listItem_closed");
  var i = 0;
  for(i; i < closedIssues.length; i++){
      closedIssues.item(i).hidden = true;
  }
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
function confirmDeletion(){
  var elIssueToDelete = document.getElementById("listItem" + numIssueToDelete);
  elIssueToDelete.parentNode.removeChild(elIssueToDelete);
  deleteFromDB();
  deletionModal.hidden = true;
}

// Helper function to search through issue array
function checkID(issue){
  return issue.issueID == numIssueToDelete;
}

function deleteFromDB(){
  var xhr_delete_issue_list_item = new XMLHttpRequest();
  xhr_delete_issue_list_item.open("DELETE","http://localhost:3000/issueList/"+numIssueToDelete,true);
  xhr_delete_issue_list_item.send();

  var xhr_delete_issue_contents = new XMLHttpRequest();
  xhr_delete_issue_contents.open("DELETE","http://localhost:3000/issueContents/"+numIssueToDelete,true);
  xhr_delete_issue_contents.send();

}

function loadFromLocalDB(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET","http://localhost:3000/issueList",true);
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      loadIssues(JSON.parse(xhr.responseText));
    }
  }
  xhr.send();
}

function loadFromFirebaseDB(uid){
  firebase.database().ref("/users/"+uid+"/issueList")
    .once("value")
      .then(function(snapshot){
        loadIssues(snapshot.val());
      });
}