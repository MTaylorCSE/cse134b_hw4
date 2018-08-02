var newIssueType;
var newIssueName;
var newIssueDescription;
var newIssueListItem = {};
var newIssueContents = {};

function addNewIssueToRestDB(uid){
  var xhr_get_last_ID = new XMLHttpRequest();
  xhr_get_last_ID.open("GET","http://localhost:3000/issueList", true);
  xhr_get_last_ID.onreadystatechange = function(){
    if(xhr_get_last_ID.readyState == 4 && xhr_get_last_ID.status == 200){
      var issueList = JSON.parse(xhr_get_last_ID.responseText);
      var nextID = issueList[0].highestID + 1;
      newIssueName = document.getElementById("addTitle").value;
      newIssueType = document.getElementById("addType").value;
      newIssueDescription = document.getElementById("addDescription").value;
      newIssueListItem = {
        id:nextID,
        status:"open",
        issueID:nextID,
        issueName:newIssueName,
        issueType:newIssueType,
        issueDescription:newIssueDescription
      }
      newIssueContents = {
        id:nextID,
        issue_name:newIssueName,
        issue_type:newIssueType,
        issue_description:"Click the edit button below to change this default text.",
        issue_image_src:"stockimage.png",
        issue_image_alt:"A placeholder image."
      }

      var xhr_add_list_issue = new XMLHttpRequest();
      
      xhr_add_list_issue.open("POST","http://localhost:3000/issueList/",true);
      xhr_add_list_issue.setRequestHeader("Content-Type","application/json");
      xhr_add_list_issue.send(JSON.stringify(newIssueListItem));

      var xhr_add_issue_contents = new XMLHttpRequest();

      xhr_add_issue_contents.open("POST","http://localhost:3000/issueContents/",true);
      xhr_add_issue_contents.setRequestHeader("Content-Type","application/json");
      xhr_add_issue_contents.send(JSON.stringify(newIssueContents));

      var xhr_update_highest_ID = new XMLHttpRequest();
      xhr_update_highest_ID.open("PATCH","http://localhost:3000/issueList/0",true);
      xhr_update_highest_ID.setRequestHeader("Content-Type","application/json");
      xhr_update_highest_ID.send(JSON.stringify({highestID:nextID}));
      window.location.replace("issueslist.html");
    }
  }
  xhr_get_last_ID.send();
  
}

function addNewIssueToFirebase(uid){
  
  firebase.database().ref("users/"+uid+"/issueList/highestID").once("value").then(function(snapshot){
    var newIssueID = snapshot.val() + 1;
    newIssueName = document.getElementById("addTitle").value;
      newIssueType = document.getElementById("addType").value;
      newIssueDescription = document.getElementById("addDescription").value;
    firebase.database().ref("users/"+uid+"/issueList/"+newIssueID).set({
      id:newIssueID,
      status:"open",
      issueID:newIssueID,
      issueName:newIssueName,
      issueType:newIssueType,
      issueDescription:newIssueDescription
    });
    firebase.database().ref("users/"+uid+"/issueContents/"+newIssueID).set({
      id:newIssueID,
      issue_name:newIssueName,
      issue_type:newIssueType,
      issue_description:"Click the edit button below to change this default text.",
      issue_image_src:"stockimage.png",
      issue_image_alt:"A placeholder image."
    });
    firebase.database().ref("users/"+uid+"/issueList/").update({highestID:newIssueID});
    window.location.replace("issueslist.html")
  });
  
}

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