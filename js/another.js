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
		$('form').attr('action', 'https://docs.google.com/a/sbnation.com/forms/d/1mk5e8uEQCEWtJg1-WjZJ4hGxoEZXwt3GhRawzrYDNkM/formResponse');
		submitted=true;
		$('#error-message').hide();
	} else {
		$('#error-message').show();
		event.preventDefault();
	}
}

function nonEmpty(name, imageSource) {
	if (name.length != 0 && imageSource.length != 0) {
		return true;
	}
}

// show success message when form is submitted
function submitSuccess() {
	$('.form-container').hide();
	$('body').append('<div id="success-message"><h2 class="subhead">Thanks for your submission!</h2><br><button class="form-buttons" id="submit-again" onclick="submitMore()">Submit another</button><button class="form-buttons" id="scrollto-submissions" onclick="scrollToSubmissions()">See submissions</button></div>');
}

function submitMore() {
	$('#success-message').hide();
	resetForm();
	$('.form-container').show();
}

function scrollToSubmissions() {
	$('html,body').animate({scrollTop: $('#submissions-header').offset().top}, 800);
}

// clear form fields
function resetForm() {
	$('form').find('input:text, input:password, input:file, select, textarea').val('');
    $('form').find('input:radio, input:checkbox').removeAttr('checked').removeAttr('selected');
    $('#error-message').hide();
}


// document ready
$(document).ready(function(){
	var submitted = false;
	var $container = $('.container');

    var gutter = 30;
    var min_width = 300;
    $container.imagesLoaded( function(){
        $container.masonry({
            itemSelector : '.element-item',
            gutterWidth: gutter,
            isAnimated: true,
              columnWidth: function( containerWidth ) {
                var box_width = (((containerWidth - 2*gutter)/3) | 0) ;

                if (box_width < min_width) {
                    box_width = (((containerWidth - gutter)/2) | 0);
                }

                if (box_width < min_width) {
                    box_width = containerWidth;
                }

                $('.element-item').width(box_width);

                return box_width;
              }
        });
    });
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