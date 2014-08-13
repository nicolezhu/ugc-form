function submitSuccess() {
	$('.success').append('<h3>You done it</h3>');
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

function printSubmissions() {
	// go through submissions, print only the ones verified for upload
	for (i=0; i < submissions.length; i++) {
		if (submissions[i].upload == "yes") {
			$(".container").append( "<div class='element-item " + submissions[i].mood + "'><h3>" + submissions[i].name + "</h3><img src='" + submissions[i].imagelink + "' /><p>" + submissions[i].tellusastory + "</p></div>");
		} else {
			console.log("not shown");
		}
	}
	isotopeGrid();
}

function isotopeGrid() {
	var $container = $('.container').isotope({
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
			$buttonGroup.find('.is-checked');
			$(this).addClass('is-checked');
		});
	});
}

$(document).ready(function(){
	init();
	// initialize Masonry after all images have loaded  
	/* $container.imagesLoaded( function() {
	  $container.masonry();
	}); */
});