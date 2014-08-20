// initialize tabletop library
var public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1IJCnSm0NoJuNDC6z4ZSKy8p5NAfHa-HwFAgjTz1dqew/pubhtml';
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
			// if user only submits name and image
			if (submissions[i].twitterhandle == '' && submissions[i].describethecontentsofyourbag == '') {

				$(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a></div>");
			}

			// if user submits name, twitter, and image
			else if (submissions[i].describethecontentsofyourbag == '') {
				$(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><p class='twitter-handle'><a href='http://twitter.com/" + submissions[i].twitterhandle + "'>@" + submissions[i].twitterhandle + "</p><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a></div>");
			}
			// if user submits name, description, and image
			else if (submissions[i].twitterhandle == '') {
				$(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a><p>" + submissions[i].describethecontentsofyourbag + "</p></div>");
			} else {
			// if user submits all fields
			$(".submit").append( "<div class='element-item'><h3>" + submissions[i].name + "</h3><p class='twitter-handle'><a href='http://twitter.com/" + submissions[i].twitterhandle + "'>@" + submissions[i].twitterhandle + "</p><a href='" + submissions[i].imageurl + "' target='_blank'><img src='" + submissions[i].imageurl + "' /></a><p>" + submissions[i].describethecontentsofyourbag + "</p></div>");
			}
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
}

// form validation
function validateForm(event) {
	// validate required form fields
	// check description text is > 140 characters? 100 words??
	var name = $('#entry_1201683887').val();
	var imageSource = $('#entry_396161777').val();
	var description = $('#entry_167335345').val();
	
	// submits response if name and image source are validated
	// else shows an error message with form fields to be corrected
	if (nonEmpty(name, imageSource) && description.length <= 140) {
		console.log('correct');
		$('form').attr('action', 'https://docs.google.com/a/sbnation.com/forms/d/1mk5e8uEQCEWtJg1-WjZJ4hGxoEZXwt3GhRawzrYDNkM/formResponse');
		submitted=true;
		$('#error-message').hide();
	} else {
		$('#success-message').hide();
		$('#error-message ul').empty().append('<li>Please limit your description to 140 characters or less.</li>');
		$('#error-message').show();
		event.preventDefault();
		console.log("not submitted");
	}
}

function nonEmpty(name, imageSource) {
	if (name.length != 0 && imageSource.length != 0) {
		return true
	}
}

// show success message when form is submitted
function submitSuccess() {
	console.log('show');
	$('#success-message').show();
}

// clear form fields
function resetForm() {
	$('form').find('input:text, input:password, input:file, select, textarea').val('');
    $('form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    $('#success-message').hide();
    $('#error-message').hide();
}


// document ready
$(document).ready(function(){
	jQuery.get('/account/auth_status', function(data){
		var vergeUser;
		if (data.logged_in){
			vergeUser = data.username;
			console.log('logged in as: ', vergeUser);
			$('#entry_1749494286').val(vergeUser).hide();
			$('form').show();
		} else {
			console.log('not logged in');
		}
	});
	init();

	$('#reset').on('click', resetForm);
});