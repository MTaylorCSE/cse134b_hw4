var issue_contents_1 = {
  issue_name:"Terrible Logo",
  issue_type:"Visual",
  issue_description:"This logo looks like someone attacked a box of crayons\nwith a curling iron. Whoever drew this needs a stern\ntalking to.",
  issue_image_src:"logo.gif"
}

var issue_contents_2 = {
  issue_name:"Terrible Logo Broken Image",
  issue_type:"Visual",
  issue_description:"Now the terrible logo that idiot drew won't even show up\non the issue page. I bet he wrote the code for this website\ntoo, judging by the looks of it.",
  issue_image_src:"issue2_1.png"
}

var issue_contents_3 = {
  issue_name:"WebP Image in Firefox",
  issue_type:"Visual",
  issue_description:"Look at this picture of a cat. It's beautiful. It\nisn't as beautiful in Firefox. There, it's just my\nalt text.",
  issue_image_src:"nocat.jpeg"
}


var issues = [issue_contents_1,issue_contents_2,issue_contents_3];
function loadContents(issue_number) {

  issue_contents = issues[issue_number - 1];
  var issueDescription = document.getElementById('issueDescription');
  var issueName_title = document.getElementById('issueName_title');
  var issueName_heading = document.getElementById('issueName_heading');
  var issueType = document.getElementById('issueType');
  var defaultOptionIssueType = document.getElementById('defaultOptionIssueType');
  var issueImage = document.getElementById('issueImage');

  issueType.innerText = issue_contents.issue_type;
  issueName_title.innerText = issue_contents.issue_name;
  issueName_heading.innerText = issue_contents.issue_name;
  issueDescription.innerText = issue_contents.issue_description;
  defaultOptionIssueType.innerText = issue_contents.issue_type;
  issueImage.src = issue_contents.issue_image_src;
}