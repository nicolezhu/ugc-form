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
	for (i=0; i < submissions.length; i++) {
		$(".submit").append( "<div class='item col-md-3'><h3>" + submissions[i].name + "</h3><img src='" + submissions[i].imagelink + "' /><p>" + submissions[i].tellusastory + "</p></div>");
	}
}

$(document).ready(function(){
	init();
})