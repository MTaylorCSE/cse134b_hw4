var newIssueType;
var newIssueName;
var newIssueDescription;
var newIssueListItem = {};
var newIssueContents = {};

function addNewIssueToDB(){
  // Really dumb way to get the ID number this new issue should have. Getting the entire contents of the issue list to find what the last entry has for an ID
  var xhr_get_last_ID = new XMLHttpRequest();
  xhr_get_last_ID.open("GET","http://localhost:3000/issueList", true);
  xhr_get_last_ID.onreadystatechange = function(){
    if(xhr_get_last_ID.readyState == 4 && xhr_get_last_ID.status == 200){
      var issueList = JSON.parse(xhr_get_last_ID.responseText);
      var nextID = issueList[issueList.length-1].id + 1;
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
        issue_image_src:"stockimage.jpeg",
        issue_image_alt:"A placeholder image."
      }

      var xhr_add_list_issue = new XMLHttpRequest();
      
      xhr_add_list_issue.open("POST","http://localhost:3000/issueList/",true);
      xhr_add_list_issue.setRequestHeader("Content-type","application/json");
      xhr_add_list_issue.send(JSON.stringify(newIssueListItem));

      var xhr_add_issue_contents = new XMLHttpRequest();

      xhr_add_issue_contents.open("POST","http://localhost:3000/issueContents/",true);
      xhr_add_issue_contents.setRequestHeader("Content-type","application/json");
      xhr_add_issue_contents.send(JSON.stringify(newIssueContents));
    }
  }
  xhr_get_last_ID.send();
}