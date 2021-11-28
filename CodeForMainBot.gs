var token = "<your bot's Telegram token!>";
var url = "https://api.telegram.org/bot" + token;
var webAppUrl = "<URL of the deployed WebApp of any Google Sheets file. The Apps Script should contain the main code of the bot itself (i.e. CodeForMainBot.gs)!>";
var ssId = "<URL ID of the Google Sheets which contains the main code in the Apps Script. A Google Sheet was used so it can log all of the chats to the bot!>";
var wimId = "<Your Telegram Chat ID, so the bot will text you an error message if it encounters an error during running of the bot!>";
var GDUploadFolderId = "<URL ID of the Google Drive link in which you want all of the photos which were sent to the bot to be uploaded; this enables automatic saving of meme submission to the bot into my Google Drive!>";
var QuotesAPI = "<URL of the deployed WebApp of the Google Sheets Quotes API which contains a database of all the inspirational quotes and jokes. The Google Sheets must already be deployed as a WebApp (see the other QUOTES-Code.gs to find out the code to turn a Google Sheets into a Quotes & Jokes API!>";

var GDMemesFolderId1 = "<URL ID of the 1st Google Drive folder where you want to upload a database of at most 2000 images (memes)!>"; '''Photo uploads of memes are split into 2 folders so that uploading can be done separately, enabling us to load >2000 memes into the Bot from Google Drive'''
var GDMemesFolderId2 = "<URL ID of the 2nd Google Drive folder where you want to upload a database of at most 2000 images (memes)!>";
var GSMemeFolderSheetId = "<URL ID of the Google Sheets Quotes API. One of the tabs in the Quotes API will be used to record the outputs of functions listFilesInFolderStep1 & listFilesInFolderStep2 in the setting up a meme database AFTER the 2000+ memes have been uploaded into any two Google Drive folders.!>"

function listFilesInFolderStep1 (){
      var folder = DriveApp.getFolderById(GDMemesFolderId1);
      var contents = folder.getFiles();
      var ss = SpreadsheetApp.openById(GSMemeFolderSheetId);
      var sheet = ss.getSheetByName("MemeFolder1");
      var lastRowWithContent = sheet.getLastRow();
      var totalRowsToBeDeleted = lastRowWithContent + 1;
      sheet.deleteRows(1,totalRowsToBeDeleted);

          var cnt = 0;
          var file;
          while (contents.hasNext()) {
              var file = contents.next();
              cnt++;

                data = [
                      file.getName(),
                      file.getId(),
                      cnt,
                  ];
            sheet.appendRow(data);
          };
}

function listFilesInFolderStep2 (){
      var folder = DriveApp.getFolderById(GDMemesFolderId2);
      var contents = folder.getFiles();
      var ss = SpreadsheetApp.openById(GSMemeFolderSheetId);
      var sheet = ss.getSheetByName("MemeFolder2");
      var lastRowWithContent = sheet.getLastRow();
      var totalRowsToBeDeleted = lastRowWithContent + 1;
      sheet.deleteRows(1,totalRowsToBeDeleted);

          var cnt = 0;
          var file;
          while (contents.hasNext()) {
              var file = contents.next();
              cnt++;

                data = [
                      file.getName(),
                      file.getId(),
                      cnt,
                  ];
            sheet.appendRow(data);
          };
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url +"/getUpdates");
  Logger.log(response.getContentText());
}

function getMe() {
  var response = UrlFetchApp.fetch(url +"/getMe");
  Logger.log(response.getContentText());
}

//changing type numbers changes types of quote you get
function QuotesAPIType(type) {
  var response = UrlFetchApp.fetch(QuotesAPI + "?type=" + type);
  var content = JSON.parse(response);
  return content
  Logger.log(content.getContentText());
}

// receive images
function getFile(fileId) {
  var response = UrlFetchApp.fetch(url + '/getFile?file_id=' + fileId);
   Logger.log(response.getContentText());
}


function setWebhook() {
  var response = UrlFetchApp.fetch(url +"/setWebhook?url=" + webAppUrl);
  Logger.log(response.getContentText());
}
function deleteWebhook() {
  var response = UrlFetchApp.fetch(url +"/deleteWebhook");
  Logger.log(response.getContentText());
}


function sendText (id, text) {
  var response = UrlFetchApp.fetch(url +"/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text));
  Logger.log(response.getContentText());
}
function sendMessage (id, text, parse_mode) {
  var response = UrlFetchApp.fetch(url +"/sendMessage?chat_id=" + id + "&text=" + encodeURIComponent(text) + "&parse_mode=" + parse_mode);
  Logger.log(response.getContentText());
}

// function deleteAllBelow(startFrom)
// {
//     // get last row index
//     var lastRowWithContent = sheet.getLastRow();

//     if(lastRowWithContent < startFrom)
//     {
//         // rows below startFrom are already blank!
//         return;
//     }

//     // count total number of rows to be deleted
//     // +1 is to include the last row
//     var totalRowsToBeDeleted = lastRowWithContent - startFrom + 1;

//     sheet.deleteRows(startFrom, totalRowsToBeDeleted);
// }

function listFilesInFolder (){
var folder = DriveApp.getFolderById(folderName1);
var contents = folder.getFiles();
var ss = SpreadsheetApp.openById(sheetName1);
var sheet = ss.getSheetByName("MemeFolder2");
var lastRowWithContent = sheet.getLastRow();
var totalRowsToBeDeleted = lastRowWithContent + 1;
sheet.deleteRows(1,totalRowsToBeDeleted);
    var cnt = 0;
    var file;

    while (contents.hasNext()) {
        var file = contents.next();
        cnt++;

           data = [
                file.getName(),
                file.getId(),
                cnt,
            ];
      sheet.appendRow(data);
    };
}

function sendPhoto(id, text, file_url, parse_mode) {
  //  var payload = {
  //         'method': 'sendPhoto',
  //         'chat_id': String(id),
  //         'photo': "https://drive.google.com/uc?id=" + file_url,
  //       }
        UrlFetchApp.fetch(url +"/sendPhoto?chat_id=" + id + "&caption=" + encodeURIComponent(text) + "&photo=" + file_url + "&parse_mode=" + parse_mode);
        }


function doGet(e) {
  return HtmlService.createHtmlOutput("Hello" + JSON.stringify(e));
}

function doPost(e){
  try {
    var contents1 =  JSON.parse(e.postData.contents);
    //GmailApp.sendEmail("marketing.medicalclub@gmail.com","Telegram Bot Update", JSON.stringify(contents1,null,4));
    var text = contents1.message.text;
    var id = contents1.message.from.id;
    var firstname = contents1.message.from.first_name;
    var msg = contents1.message
    var ss = SpreadsheetApp.openById(ssId);
    if (msg.from.hasOwnProperty('last_name')){
      var lastname = " " + contents1.message.from.last_name
      } else {var lastname = "";
    }
if (msg.hasOwnProperty('entities') &&
      msg.entities[0].type == 'bot_command'){
        // If the user sends the /quote command
              if (text == '/credits') {
                sendMessage(id, 'Most-liked memes were taken from the following Instagram accounts:<i> \n@funnymedicalmemes\n@codebluememes\n@dankmedicalmemes\n@nursememesonly\n@medical.memes\n@officialdoctormemes\n@manvsmed\n@medical__memes\n</i>' + '\n MedNurseBot is created by <i>Elgene Yeo</i>', parse_mode = 'HTML');
                var sheet = ss.getSheetByName("Sheet1");
                sheet.appendRow([new Date(),id,firstname,text]);
                } else if (text == '/quote') {
                var content = QuotesAPIType("1");
                var author = content.author;
                var var1 = content.var1;
                //var cleanContent = content.quote.replace(/<(?:.|\n)\*?>/gm, '').replace(/\n/gm, ''); //if you need to remove lots of symbols
                var formattedText1 = content.quote.split("#").join('\n');
                var cleanQuote = '"' + formattedText1 + '"\n — <strong>' + author + '</strong>';
                sendMessage(id, cleanQuote + "\n\nHere's your quote for today " + firstname + lastname + "!", parse_mode='HTML'); //parse_mode of 'MarkdownV2' or 'HTML'
                var sheet = ss.getSheetByName("Sheet1");
                sheet.appendRow([new Date(),id,firstname,var1, text]);
                } else if (text == '/joke') {
                var content = QuotesAPIType("2");
                var author = content.author;
                var var1 = content.var1;
                var formattedText1 = content.quote.split("#").join('\n');
                sendMessage(id, formattedText1 + "\n\n\nThere are <b>" + author + "</b> jokes in my joke bank today", parse_mode='HTML');
                var sheet = ss.getSheetByName("Sheet1");
                sheet.appendRow([new Date(),id,firstname,var1, text]);
                } else if (text == '/meme') {
                var content = QuotesAPIType("3");
                var author = content.author;
                var var1 = content.var1;
                var fileLink = "https://drive.google.com/uc?id=" + content.quote;
                sendPhoto(id, "Here's your meme " + firstname + lastname + "! I have <b>" + author + "</b> medical memes in my meme bank today" , fileLink, parse_mode='HTML');
                var sheet = ss.getSheetByName("Sheet1");
                sheet.appendRow([new Date(),id,firstname,var1,text]);
                } else {sendMessage(id,'Hello ' + firstname + lastname + '! I am the friendly MedNurse Bot!\nIn support of mental health for students, you may do the following:' + '\n<b>1.</b> Upload a photo to share your meme on MedNurse IG story.' + '\n<b>2.</b> Send a message starting with "@clinicals " to share your struggles, or to share a learning experience from your clinicals with your batchmates on MedNurse IG!' + '\nIt will be anonymous by default, unless you specify otherwise in your submission.' + '\n\n<u>Also, the following commands may be useful to you:</u>' + '\n/quote - get your quote of the day'+'\n/joke - tell you a joke' + '\n/meme - show you a meme' + '\n/credits - attributions of MedNurseBot', parse_mode = 'HTML');
      var sheet = ss.getSheetByName("Sheet1");
      sheet.appendRow([new Date(),id,firstname,text]); //add contents1 if you wanna see the raw json message contents
                }
      } else if (/^@/.test(text)) {
              if (text.slice(1).split(" ")[0] == 'clinicals') {
                var sheetName = text.slice(1).split(" ")[0]; // slices out the "@"
                var newText = text.split(" ").slice(1).join(" "); // slices out the 1st word in the array
                var sheet = ss.getSheetByName(sheetName) ? ss.getSheetByName(sheetName) : ss.insertSheet(sheetName); // After ? (if false), then (after ":")
                sheet.appendRow([new Date(),id,firstname,newText]);
                //REMOVE FOR COMPETITIONS sendText(id,"Your competition submission in the link " + newText + " is now submitted. Thank you for participating " + firstname + lastname + "!");
                sendText(id,"Your clinical story is submitted. Thank you " + firstname + lastname + " for your submission! Your submission may be posted on MedNurse IG next week as a post/story." + '\n\nYou may continue to submit stories by beginning your message with "@clinicals ", or you may upload an image to submit a meme!');
                } else {sendText(id,"Did you type wrongly?");
                   }
        } else if (msg.hasOwnProperty('photo')){
      var fileid = contents1.message.photo[contents1.message.photo.length - 1]["file_id"];
      var response = UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/getFile?file_id=" + fileid);
      var urlphoto = "https://api.telegram.org/file/bot"+ token + "/" + JSON.parse(response.getContentText()).result["file_path"];
      var resa = UrlFetchApp.fetch(urlphoto);
      var fileblob = resa.getBlob();
      DriveApp.getFolderById(GDUploadFolderId).createFile(fileblob).setName("Meme by " + firstname + " " + new Date().toLocaleString());
      var caption = contents1.message.caption;
      ss.getSheetByName("MemeSubmission").appendRow([new Date(),id,firstname,caption,urlphoto,fileid]);
      sendText(id,"Your meme is submitted. Thank you " + firstname + lastname + " for your submission! We will process it on our side and may post it in a week if it is deemed appropriate. (By default, we will credit you with your first name. If you don't want us to credit you, please type here and let us know!)" + '\n\nYou may continue to upload images for memes, or send a story from your clinicals by beginning your message with "@clinicals "! :)');
          } else if (contents1.hasOwnProperty('message')) {
      sendMessage(id,'Hello ' + firstname + lastname + '! I am the friendly MedNurse Bot!\nIn support of mental health for students, you may do the following:' + '\n<b>1.</b> Upload a photo to share your meme on MedNurse IG story.' + '\n<b>2.</b> Send a message starting with "@clinicals " to share your struggles, or to share a learning experience from your clinicals with your batchmates on MedNurse IG!' + '\nIt will be anonymous by default, unless you specify otherwise in your submission.' + '\n\n<u>Also, the following commands may be useful to you:</u>' + '\n/quote - get your quote of the day'+'\n/joke - tell you a joke' + '\n/meme - show you a meme' + '\n/credits - attributions of MedNurseBot', parse_mode = 'HTML');
      var sheet = ss.getSheetByName("Sheet1");
      sheet.appendRow([new Date(),id,firstname,text]);
      }
  }
  catch(e){
    sendText(wimId,JSON.stringify(e,null,4));
    }
}


// {
//     "parameters": {},
//     "contextPath": "",
//     "queryString": "",
//     "contentLength": 276,
//     "parameter": {},
//     "postData": {
//         "contents": "{\"update_id\":5471003,\n\"message\":{\"message_id\":196,\"from\":{\"id\":526263827,\"is_bot\":false,\"first_name\":\"Elgene\",\"username\":\"yeozhenhao\",\"language_code\":\"en\"},\"chat\":{\"id\":526263827,\"first_name\":\"Elgene\",\"username\":\"yeozhenhao\",\"type\":\"private\"},\"date\":1632029470,\"text\":\"test\"}}",
//         "length": 276,
//         "name": "postData",
//         "type": "application/json"
//     }
// }