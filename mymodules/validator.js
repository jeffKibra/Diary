function validateUsername(field) {
	if (field == "") return "No username was entered.\n";
	return "";
}

function validatePassword(field) {
	if (field == "") return "No password was entered.\n";
	return "";
}

function validatePassword2(field1, field2) {
	if (field1 == "" || field2 == "") return "No password was entered.\n";
    if(field1 !== field2) return "passwords do not match";
    
	return "";
}

function validateFirstname(field) {
	if (field == "") return "No name was entered.\n";
	return "";
}

function validateSubject(field){
	if(field=="") return "please add a subject.\n";
	return "";
}

function validateSurname(field) {
	if (field == "") return "No Surname was entered.\n";
	return "";
}

function validateEmail(field) {
	if (field == "") return "No Email was entered.\n";
	else if (!((field.indexOf(".") > 0) && (field.indexOf("@") > 0)) || /[^a-zA-Z0-9.@_-]/.test(field)) 
		return "The Email address is invalid.\n";
	return "";
}

function validateMessage(field) {
	if (field == "") return "No entrie was writen.\n";
	
	return "";
}

function validateSignup(signup){
	var fail="";
	fail += validateFirstname(signup.firstname);
	fail += validateSurname(signup.surname);
	fail += validateUsername(signup.username);
	fail += validateEmail(signup.email);
	fail += validatePassword2(signup.password, signup.cpassword);

	return fail;
}

function validateLogin(login){
	var fail="";
	fail += validateUsername(login.username);
	fail += validatePassword(login.password);

	return fail;
}

module.exports={
    validateSignup,
    validateLogin
}