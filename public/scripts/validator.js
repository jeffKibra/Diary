


function validateFirstname(field) {
	if (field == "") return "No name was entered.\n";
	return "";
}

function validateTitle(field){
	if(field=="") return "please add a title";
	return "";
}

function validateSurname(field) {
	if (field == "") return "No Subject was entered.\n";
	return "";
}

function validateEmail(field) {
	if (field == "") return "No Email was entered.\n";
	else if (!((field.indexOf(".") > 0) && (field.indexOf("@") > 0)) || /[^a-zA-Z0-9.@_-]/.test(field)) 
		return "The Email address is invalid.\n";
	return "";
}

function validateMessage(field) {
	if (field == "") return "No Message was entered.\n";
	
	return "";
}