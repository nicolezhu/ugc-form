// hide sign-in button if user is logged in
function onSignInCallback(resp) {
	if (resp['status']['signed_in']) {
		console.log(resp);
    	document.getElementById('gConnect').setAttribute('style', 'display: none');
  	} else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + resp['error']);
  }
	gapi.client.load('plus', 'v1', apiClientLoaded);
	
}

// sign user out
function signOut() {
	console.log('signed out');
	$('#gConnect').show();
	gapi.auth.signOut();
}

// loads form for logged-in users
function apiClientLoaded() {
	//gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
	$('#form-title p').remove();
	 var request = gapi.client.plus.people.get({
	   'userId': 'me'
	 });
	 request.execute(handleEmailResponse);
	 request.execute(function(resp) {
	 	$('#form-title').append("<p>Signed in as: " + resp.emails[0].value + "<span id='signout' onclick='signOut()'>Sign Out</span></p>");
	 	console.log(resp.emails[0].value);
	   console.log('Retrieved profile for: ' + resp.displayName);
	 });
}

// sets email field for current user
function handleEmailResponse(resp) {
	var primaryEmail;
	for (var i=0; i < resp.emails.length; i++) {
		if (resp.emails[i].type === 'account') primaryEmail = resp.emails[i].value;
	}
	console.log('Primary email: ' + primaryEmail);
	$('#entry_1494918024').val(primaryEmail).hide();
	$('form').show();
}

// initialize tabletop library
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1UcNULjZ7yjREquYCYpnDXOT8jmzbvG7kM_NcLuDGrfw/pubhtml';
function init() {
		Tabletop.init( { key: public_spreadsheet_url,
                   callback: readData,
                   simpleSheet: true } )
	}

// read data
var submissions;
function readData(data, tabletop) { 
	console.log(data)
	submissions = data;
	printSubmissions();
}

// go through submissions, print only the ones verified for upload
function printSubmissions() {
	for (i=0; i < submissions.length; i++) {
		if (submissions[i].upload == "yes") {
			$(".submit").append( "<div class='element-item " + submissions[i].mood.toLowerCase() + "'><h3>" + submissions[i].name + "</h3><img src='" + submissions[i].imagelink + "' /><p>" + submissions[i].tellusastory + "</p></div>");
		} else {
			console.log("not shown");
		}
	}
	isotopeGrid();
}

// create isotope grid and filters
function isotopeGrid() {
	var $container = $('.submit').isotope({
		itemSelector: '.element-item',
		layoutMode: 'masonry'
	});

	$("#filters").on('click', 'button', function() {
		var filterValue = $(this).attr('data-filter');
		$container.isotope({ filter: filterValue });
	});

	$('.button-group').each(function(i, buttonGroup) {
		var $buttonGroup = $(buttonGroup);
		$buttonGroup.on('click', 'button', function() {
			$buttonGroup.find('.is-checked').removeClass('is-checked');
			$(this).addClass('is-checked');
		});
		// $buttonGroup.find('.is-checked').removeClass('is-checked');
	});
}

// show success message when form is submitted
function submitSuccess() {
	$('#success-message').show();
}

// clear form fields
function resetForm() {
	$('form').find('input:text, input:password, input:file, select, textarea').val('');
    $('form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    $('#success-message').hide();
    $('#error-message').hide();
}

// form validation
function validateForm(event) {
	var phoneNumber = $('#entry_659252300').val();
	var emailAddress = $('#entry_1232261407').val();
	console.log(phoneNumber);
	console.log(emailAddress);

	// submits response if phone number and email are validated
	// else shows an error message with form fields to be corrected
	if (validatePhoneNumber(phoneNumber) && validateEmailAddress(emailAddress)) {
		console.log('correct');
		$('form').attr('action', 'https://docs.google.com/a/sbnation.com/forms/d/1gLLcEIwk9tyOmazW5pG7sDYH901i_k0uDxVsUymIU3g/formResponse');
		submitted=true;
		$('#error-message').hide();
	} else {
		$('#error-message ul').empty();
		if (!(validatePhoneNumber(phoneNumber))) {
			$('#error-message ul').append('<li>Invalid phone number</li>');
		}
		if (!(validateEmailAddress(emailAddress))) {
			$('#error-message ul').append('<li>Invalid email address</li>');
		}
		$('#error-message').show();
		event.preventDefault();
		console.log("incorrect");
	}
}

// validate phone number (US only)
function validatePhoneNumber(number) {
	number = number.replace(/\D/g, '');
    isValid = (/^(?:(1\-?)|(\+1 ?))?\(?(\d{3})[\)\-\.]?(\d{3})[\-\.]?(\d{4})$/).test(number) && (number.length === 10);
    console.log(isValid);
    return isValid;
}

// validate email address
function validateEmailAddress(email) {
	var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	console.log(emailRegExp.test(email));
    return emailRegExp.test(email);
}


// document ready
$(document).ready(function(){
	$('form').hide();
	init();
	$('#reset').on('click', resetForm);
	$('#signout').on('click', signOut);
});