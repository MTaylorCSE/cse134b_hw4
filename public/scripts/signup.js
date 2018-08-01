
function firebaseSignup(){
  var elEmail = document.getElementById("signupEmail");
  var elPassword = document.getElementById("signupPassword");
  firebase.auth().createUserWithEmailAndPassword(elEmail.value, elPassword.value).catch(function(error) {
    
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
  
}