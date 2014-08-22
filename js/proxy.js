// initialize tabletop library
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1IJCnSm0NoJuNDC6z4ZSKy8p5NAfHa-HwFAgjTz1dqew/pubhtml';
function init() {
		Tabletop.init( { key: public_spreadsheet_url,
                   callback: readData,
                   proxy: 'http://apps.voxmedia.com.s3.amazonaws.com',
                   debug: true,
                   simpleSheet: true } )
	}

// read data
var submissions;
function readData(data, tabletop) { 
	submissions = data;
	printSubmissions();
}

// go through submissions, print only the ones verified for upload
function printSubmissions() {
	for (i=0; i < submissions.length; i++) {
		if (submissions[i].upload == "") {
			// if user only submits name and image
			if (submissions[i].twitterhandle == '' && submissions[i].describethecontentsofyourbag == '') {
				jQuery(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a></div>");
			}
			// if user submits name, twitter, and image
			else if (submissions[i].describethecontentsofyourbag == '') {
				jQuery(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><p class='twitter-handle'><a href='http://twitter.com/" + submissions[i].twitterhandle + "'>@" + submissions[i].twitterhandle + "</p><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a></div>");
			}
			// if user submits name, description, and image
			else if (submissions[i].twitterhandle == '') {
				jQuery(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a><p>" + submissions[i].describethecontentsofyourbag + "</p></div>");
			} else {
			// if user submits all fields
			jQuery(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><p class='twitter-handle'><a href='http://twitter.com/" + submissions[i].twitterhandle + "'>@" + submissions[i].twitterhandle + "</p><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a><p>" + submissions[i].describethecontentsofyourbag + "</p></div>");
			}
		}
	}
}

// create isotope grid and filters
function isotopeGrid() {
//printSubmissions();
	var jQuerycontainer = jQuery('.submit').isotope({
		itemSelector: '.element-item',
		layoutMode: 'masonry',
		resizable: true
	});
}

// form validation
function validateForm(event) {
	// validate required form fields
	// check description text is > 140 characters? 100 words??
	// validate required fields are nonempty, valid image url, description is under 140 characters, don't accept responses with < >
	var name = jQuery('#entry_1201683887').val();
	var twitter = jQuery('#entry_1736603796').val();
	var imageSource = jQuery('#entry_396161777').val();
	var description = jQuery('#entry_167335345').val();
	
	// submits response if name and image source are validated
	// else shows an error message with form fields to be corrected
	if (nonEmpty(name, imageSource) && description.length <= 140 && validURL(imageSource) && noScript(name, twitter, imageSource, description)) {
		jQuery('form').attr('action', 'https://docs.google.com/a/sbnation.com/forms/d/1mk5e8uEQCEWtJg1-WjZJ4hGxoEZXwt3GhRawzrYDNkM/formResponse');
		submitted=true;
		jQuery('#error-message').hide();
	} else {
		jQuery('#error-message ul').empty();
		if ((description.length > 140)) {
			jQuery('#error-message ul').append('<li>Please limit your description to 140 characters.</li>');
		}
		if (!(validURL(imageSource))) {
			jQuery('#error-message ul').append('<li>Invalid image url.</li>');
		}
		if (!(noScript(name, twitter, imageSource, description))) {
			jQuery('#error-message ul').append('<li>Your submission includes invalid characters.</li>');
		}
		jQuery('#error-message').show();
		event.preventDefault();
	}
}

function validURL(imageSource) {
	var url = imageSource;
	if (url.split('.').pop().match(/^(jpe?g|png)$/) === null) {
		return false;
	} else {
		return true;
	}
}

// checks for scripts
function noScript(name, twitter, imageSource, description) {
	var to_check = [name, twitter, imageSource, description];
	for (var i = 0; i < to_check.length; i++) {
		if (to_check[i].match(/[<>]/) !== null) {
			return false;
		}
	}
	return true;
}

function nonEmpty(name, imageSource) {
	if (name.length != 0 && imageSource.length != 0) {
		return true;
	}
}

// show success message when form is submitted
function submitSuccess() {
	jQuery('.form-container').hide();
	jQuery('#form-divider').after('<div id="success-message"><h2 class="subhead">Thanks for your submission!</h2><br><button class="form-buttons" id="submit-again" onclick="submitMore()">Submit another</button><button class="form-buttons" id="scrollto-submissions" onclick="scrollToSubmissions()">See submissions</button></div>');
}

function submitMore() {
	jQuery('#success-message').hide();
	resetForm();
	jQuery('.form-container').show();
}

function scrollToSubmissions() {
	jQuery('html,body').animate({scrollTop: jQuery('#submissions-header').offset().top}, 800);
}

// clear form fields
function resetForm() {
	jQuery('form').find('input:text, input:password, input:file, select, textarea').val('');
    jQuery('form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    jQuery('#error-message').hide();
}

window.onload = function() {
	isotopeGrid();
};

// document ready
jQuery(document).ready(function(){
	var submitted = false;
	jQuery.get('/account/auth_status', function(data){
		var vergeUser;
		if (data.logged_in){
			vergeUser = data.username;
			console.log('logged in as: ', vergeUser);
			jQuery('#entry_1749494286').val(vergeUser).hide();
			jQuery('form').show();
		} else {
			console.log('not logged in');
		}
	});
	init();

	jQuery('#reset').on('click', resetForm);
});