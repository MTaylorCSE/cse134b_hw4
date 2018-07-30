var issue_contents_1 = {
  issue_name:"Terrible Logo",
  issue_type:"Visual",
  issue_description:"This logo looks like someone attacked a box of crayons\nwith a curling iron. Whoever drew this needs a stern\ntalking to.",
  issue_image_src:"logo.gif",
  issue_image_alt:"A terribly drawn version of the Google Chrome logo"
}

var issue_contents_2 = {
  issue_name:"Terrible Logo Broken Image",
  issue_type:"Visual",
  issue_description:"Now the terrible logo that idiot drew won't even show up\non the issue page. I bet he wrote the code for this website\ntoo, judging by the looks of it.",
  issue_image_src:"issue2_1.png",
  issue_image_alt:"A screenshot of issue 1, Terrible Logo, with the image missing and the alt text showing."
}

var issue_contents_3 = {
  issue_name:"WebP Image in Firefox",
  issue_type:"Visual",
  issue_description:"Look at this picture of a cat. It's beautiful. It\nisn't as beautiful in Firefox. There, it's just my\nalt text.",
  issue_image_src:"nocat.jpeg",
  issue_image_alt:"A screenshot of this webpage in Firefox, where the alt text is showing for the cat image."
}
var issue_contents;

var issues = [issue_contents_1,issue_contents_2,issue_contents_3];
var current_issue_index;
function loadIssueContents(issueContents) {
  issue_contents = JSON.parse(issueContents);
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
  defaultOptionIssueType.innerText = issue_contents.issue_type;
  issueImage.src = issue_contents.issue_image_src;
  issueImage.alt = issue_contents.issue_image_alt
}

function getIssueContentFromDB(issue_number){
  current_issue_index = issue_number;
  var xhr = new XMLHttpRequest();
  xhr.open("GET","http://localhost:3000/issueContents/" + issue_number,true);
  
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      loadIssueContents(xhr.responseText);
    }
  }
  xhr.send(null);
}

var issueDescription = document.getElementById('issueDescription');
var saveButton = document.getElementById('saveButton');
var cancelButton = document.getElementById('cancelButton');
var editButton = document.getElementById('editButton');
var issueName_title = document.getElementById('issueName_title');
var issueName_heading = document.getElementById('issueName_heading');
var issueType = document.getElementById('issueType');
var selectIssueType = document.getElementById('selectIssueType');
var defaultOptionIssueType = document.getElementById('defaultOptionIssueType');
var preEditIssueType;
var preEditContent;
var preEditIssueName;

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

function saveEdit(){
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
  saveEditDB();
}

// Saves edited content to the DB, which is really just an object in memory on this page right now
function saveEditDB(){
  issue_contents.issue_type = issueType.innerText;
  issue_contents.issue_name = issueName_heading.innerText;
  issue_contents.issue_description = issueDescription.innerText;

  // Updating issue list item
  var xhr_issue_list_item = new XMLHttpRequest();
  xhr_issue_list_item.open("PATCH","http://localhost:3000/issueList/" + current_issue_index,true);
  xhr_issue_list_item.setRequestHeader("Content-Type","application/json");
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
  xhr_issue_contents.open("PUT","http://localhost:3000/issueContents/" + current_issue_index,true);
  xhr_issue_contents.setRequestHeader("Content-Type","application/json");
  xhr_issue_contents.onreadystatechange = function(){
    if(xhr_issue_contents.readyState == 4 && xhr_issue_contents.status == 200){
      
    }
  }
  xhr_issue_contents.send(JSON.stringify(issue_contents));

  
  
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