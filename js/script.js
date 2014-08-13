// show success message when form is submitted
function submitSuccess() {
	$('.success').show();
}

// clear form fields
function resetForm() {
	$('form').find('input:text, input:password, input:file, select, textarea').val('');
    $('form').find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
    $('.success').hide();
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

$(document).ready(function(){
	init();
	$('#reset').on('click', resetForm);
});