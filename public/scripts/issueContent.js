var issue_contents;
var current_issue_index;
var issueDescription, saveButton, cancelButton, editButton, issueName_title,
issueName_heading, issueType, selectIssueType, defaultOptionIssueType,
preEditIssueType, preEditContent, preEditIssueName;
var cur_uid;

/**
 * Adds an event listener for the page load to get these DOM elements
 */
window.addEventListener("load",function(){
  issueDescription = document.getElementById('issueDescription');
  saveButton = document.getElementById('saveButton');
  cancelButton = document.getElementById('cancelButton');
  editButton = document.getElementById('editButton');
  issueName_title = document.getElementById('issueName_title');
  issueName_heading = document.getElementById('issueName_heading');
  issueType = document.getElementById('issueType');
  selectIssueType = document.getElementById('selectIssueType');
  defaultOptionIssueType = document.getElementById('defaultOptionIssueType');
  preEditIssueType;
  preEditContent;
  preEditIssueName;
  
});

/**
 * Takes JSON with a specific schema representing the contents of an issue page
 * and loads it into the appropriate DOM elements
 * @param {JSON} issueContents 
 */
function loadIssueContents(issueContents) {
  issue_contents = issueContents;
  console.log(issue_contents);
  var issueDescription = document.getElementById('issueDescription');
  var issueName_title = document.getElementById('issueName_title');
  var issueName_heading = document.getElementById('issueName_heading');
  var issueType = document.getElementById('issueType');
  var defaultOptionIssueType = document.getElementById('defaultOptionIssueType');
  var issueImage = document.getElementById('issueImage');
  var issueImageLink = document.getElementById('imageLink');

  issueImageLink.setAttribute("href",issue_contents.issue_image_src);
  issueType.innerText = issue_contents.issue_type;
  issueName_title.innerText = issue_contents.issue_name;
  issueName_heading.innerText = issue_contents.issue_name;
  issueDescription.innerText = issue_contents.issue_description;
  defaultOptionIssueType.label = issue_contents.issue_type;
  issueImage.src = issue_contents.issue_image_src;
  issueImage.alt = issue_contents.issue_image_alt
}

/**
 * Makes contents of several DOM elements editable.
 */
function editMode(){
  editButton.hidden = true;
  saveButton.hidden = false;
  cancelButton.hidden = false;
  issueType.hidden = true;
  selectIssueType.hidden = false;
  issueDescription.contentEditable = true;
  issueName_heading.contentEditable = true;
  preEditIssueType = issueType.innerText;
  preEditContent = issueDescription.innerText;
  preEditIssueName = issueName_heading.innerText;
}

function saveEditVisual(){
  // Visual display stuff
  editButton.hidden = false;
  saveButton.hidden = true;
  cancelButton.hidden = true;
  var newIssueType = selectIssueType.selectedOptions.item(0).innerText;
  issueType.innerText = newIssueType;
  defaultOptionIssueType.innerText = newIssueType;
  issueType.hidden = false;
  selectIssueType.hidden = true;
  issueDescription.contentEditable = false;
  issueName_heading.contentEditable = false;
  preEditContent = issueDescription.innerText;
  preEditIssueName = issueName_heading.innerText;
  issueName_title.innerText = issueName_heading.innerText;
  
}

function saveEditREST(rest){
  if(rest){
    saveEditVisual();
    saveEditRestDB();
  }else{
    saveEditVisual();
    saveEditFirebase();
  }
}

function cancelEdit(){
  editButton.hidden = false;
  saveButton.hidden = true;
  cancelButton.hidden = true;
  selectIssueType.hidden = true;
  issueType.hidden = false;
  defaultOptionIssueType.selected = true;
  issueDescription.contentEditable = false;
  issueDescription.innerText = preEditContent;
  issueName_heading.contentEditable = false;
  issueName_heading.innerText = preEditIssueName;
}


function saveEditFirebase(){
  issue_contents.issue_type = issueType.innerText;
  issue_contents.issue_name = issueName_heading.innerText;
  issue_contents.issue_description = issueDescription.innerText;

  var updates = {};
  updates['users/'+cur_uid+'/issueContents/'+current_issue_index+'/issue_name'] = issue_contents.issue_name;
  updates['users/'+cur_uid+'/issueContents/'+current_issue_index+'/issue_type'] = issue_contents.issue_type;
  updates['users/'+cur_uid+'/issueContents/'+current_issue_index+'/issue_description'] = issue_contents.issue_description;
  firebase.database().ref().update(updates);
}

// Saves edited content to some DB using RESTful style
function saveEditRestDB(){
  issue_contents.issue_type = issueType.innerText;
  issue_contents.issue_name = issueName_heading.innerText;
  issue_contents.issue_description = issueDescription.innerText;

  // Updating issue list item
  var xhr_issue_list_item = new XMLHttpRequest();
  xhr_issue_list_item.open("PATCH","http://localhost:3000/issueList/"+current_issue_index,true);
  xhr_issue_list_item.setRequestHeader("Content-Type","application/JSON");
  xhr_issue_list_item.onreadystatechange = function(){
    if(xhr_issue_list_item.status == 200 && xhr_issue_list_item.readyState == 4){
      console.log("Ready for inspection, sire.");
    }
  }

  // Seeing if multiple deltas can be made on a patch request
  var list_item_updates = {
    issueType:issue_contents.issue_type,
    issueName:issue_contents.issue_name
  };
  xhr_issue_list_item.send(JSON.stringify(list_item_updates));

  // Updating issue contents
  var xhr_issue_contents = new XMLHttpRequest();
  xhr_issue_contents.open("PUT","http://localhost:3000/issueContents/"+current_issue_index,true);
  xhr_issue_contents.setRequestHeader("Content-Type","application/JSON");
  xhr_issue_contents.onreadystatechange = function(){
    if(xhr_issue_contents.readyState == 4 && xhr_issue_contents.status == 200){
      console.log("Issue contents sent, sire.");
    }
  }
  xhr_issue_contents.send(JSON.stringify(issue_contents));

}

function getIssueContentFromLocalDB(issue_number){
  current_issue_index = issue_number;
  var xhr = new XMLHttpRequest();
  xhr.open("GET","http://localhost:3000/issueContents/" + issue_number,true);
  
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      loadIssueContents(JSON.parse(xhr.responseText));
    }
  }
  xhr.send(null);
}

function getIssueContentFromFirebaseDB(issue_number,uid){
  cur_uid = uid;
  current_issue_index = issue_number;
  var ref = firebase.database().ref("users/"+uid+"/issueContents/"+issue_number);
  ref.once("value").then(function(snapshot){
    loadIssueContents(snapshot.val());
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