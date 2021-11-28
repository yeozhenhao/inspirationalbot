function doPost() {
}


function doGet(e) { // get parameter to understand what to return
    var type = e.parameter.type;
    var quoterange = 'B2'; // default quote cell for type = 1
    var authorrange = 'C2'; // default quote cell for type = 1
    var counterrange = 'D2';
    var var1range = 'E2'
    if (type === '2') {    quoterange = 'B3'; authorrange = 'C3'; counterrange = 'D3'; var1range = 'E3' };
        if (type === '3') {    quoterange = 'B4'; authorrange = 'C4'; counterrange = 'D4'; var1range = 'E4' };
    var sheet = SpreadsheetApp.getActiveSheet(); // update the counter
    var counterCell = sheet.getRange(counterrange);
    var counterVal = counterCell.getValue();
    counterCell.setValue(counterVal + 1); // get the data
    var quote = sheet.getRange(quoterange).getValue();    // return the quote
    var author = sheet.getRange(authorrange).getValue();// return the author
    var var1 = sheet.getRange(var1range).getValue();// return the var1
    var quoteReturner = {
        'quote': quote,
        'author': author,
        'counter': counterVal,
        'var1': var1,
    };
    var myJSON = JSON.stringify(quoteReturner);
    return ContentService.createTextOutput(myJSON).setMimeType(ContentService.MimeType.JSON);


}

function doPost(e) {
    return true;
}