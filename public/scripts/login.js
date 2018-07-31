function firebaseLogin(){
  var elEmail = document.getElementById("loginEmail");
  var elPassword = document.getElementById("loginPassword");
  firebase.auth().signInWithEmailAndPassword(elEmail.value, elPassword.value).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
  });
}