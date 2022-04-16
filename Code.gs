///////////////////////////////////////////////////////////////////////////
// gmail-hold
// license: https://github.com/sethleonard/gmail-hold/blob/main/LICENSE
// homepage: https://github.com/sethleonard/gmail-hold
//
// version 1.0
// last updated 2022-04-16
///////////////////////////////////////////////////////////////////////////

function homepage(e) {

  // make sure lable exists; if not, create it.
  alert = checkConfig();

  // pull user properties
  var userProperties = PropertiesService.getUserProperties();

  //// get all user settings, set defaults if empty

  // inbox zero settings -- off by default
  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  if(inboxZero == null || isNaN(inboxZero)) {
    inboxZero = 0;
    userProperties.setProperty('inboxZero', inboxZero);
  }
  
  // allowed releases -- 4 by default
  var allowedReleases = parseInt(userProperties.getProperty('allowedReleases'));
  if(allowedReleases == null || isNaN(allowedReleases)) {
    allowedReleases = 4;
    userProperties.setProperty('allowedReleases', allowedReleases);
  }

  // impulse control -- off by default
  var impulseControls = parseInt(userProperties.getProperty('impulseControls'));
  if(impulseControls == null || isNaN(impulseControls)) {
    impulseControls = 0;
    userProperties.setProperty('impulseControls', impulseControls);
  }

  // get user timezone and make pretty
  var timeZone = e.userTimezone.id;
  var displayDate = Utilities.formatDate(new Date(), timeZone, "MMMM dd, yyyy");

  // get number of messages in inbox and releases used today
  var inboxCount = getInboxCount();
  var releases = getReleaseCount(userProperties,timeZone);

  // grammar
  var timesText = 'times';

  if(releases == 1) {
    timesText = 'times'
  }

  var messageCountText = 'messages';
  var messageItThemText = 'them';

  if(inboxCount == 1) {
    messageCountText = 'message';
    messageItThemText = 'it';
  }

  // main message
  var textParagraph = CardService.newTextParagraph()
    .setText(
      "You have released email\n<b>" + releases + " out of " + allowedReleases + " " + timesText + "</b>\ntoday, " + displayDate + "\n"
    );

  // message if inbox zero is required and inbox is not empty
  var inboxZeroText = CardService.newTextParagraph()
    .setText(
      "You have " + inboxCount + " " + messageCountText + " in your inbox. " +
      "You will not be able to release email until you clear " + messageItThemText + " out.\n" +
      "(Hint: use the 'Add to tasks' function)"
    );

  //// build buttons
  // email release button
  var releaseAction = CardService.newAction()
      .setFunctionName('processHidden');
  var releaseButton = CardService.newTextButton()
      .setText('Release Email')
      .setOnClickAction(releaseAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  // refresh button
  var refreshAction = CardService.newAction()
      .setFunctionName('refreshHomepage');
  var refreshButton = CardService.newTextButton()
      .setText('Refresh')
      .setOnClickAction(refreshAction)
      .setTextButtonStyle(CardService.TextButtonStyle.FILLED);

  // create section and add main message
  var section = CardService.newCardSection()
      .addWidget(textParagraph);

  // add release button if allowed;
  // alternatively, add inbox zero text and refresh button if needed
  if (releases < allowedReleases && (inboxCount == 0 || inboxZero == 0)) {
    section.addWidget(releaseButton);
  } else if (inboxZero == 1 && inboxCount > 0) {
    section.addWidget(inboxZeroText);
    section.addWidget(refreshButton);
  }

  // add footer
  var fixedFooter = footer();

  // build card/page
  var card = CardService.newCardBuilder();
  card.addSection(section);
  card.setFixedFooter(fixedFooter);

  return card.build();
}

// get inbox count (for determining inbox zero)
function getInboxCount() {
  var inboxThreads = GmailApp.getInboxThreads();
  return inboxThreads.length;
}

// get release count for the day
function getReleaseCount(userProperties,timeZone) {
  var date = Utilities.formatDate(new Date(), timeZone, "yyyy-MM-dd");

  // get existing release count, set to 0 if missing
  var releases = parseInt(userProperties.getProperty('releases'));
  if(releases == null || isNaN(releases)) {
    releases = 0;
  }

  // if date is different than last stored, or is missing, start over
  var lastDate = userProperties.getProperty('currentDate');
  if (lastDate == null) {
    releases = 0;
  } else if (lastDate != date) {
    releases = 0;
  }

  // update release count and date
  userProperties.setProperty('releases', releases);
  userProperties.setProperty('currentDate', date);

  return releases;
}

// not currently used, but may be helpful later
function deleteLabel() {
  var ghLabel = GmailApp.getUserLabelByName("emailHold");
  ghLabel.deleteLabel();
}

// footer page -- settings button
function footer() {
  var fixedFooter = CardService.newFixedFooter()
    .setPrimaryButton(
        CardService.newTextButton()
            .setText("Settings")
            .setOnClickAction(
                CardService.newAction()
                    .setFunctionName("pageSettings")
            )
    );
  return fixedFooter;
}

// release emails function
function processHidden(e) {
  
  // get current releases count, increase by one, and re-save
  var userProperties = PropertiesService.getUserProperties();
  var releases = parseInt(userProperties.getProperty('releases')) + 1;
  userProperties.setProperty('releases', releases);

  // go through hidden label and move to inbox
  var label = GmailApp.getUserLabelByName('emailHold');

  if (label) {
    var threads = label.getThreads();

    for (var i = 0; i < threads.length; i++) {
      var thread = threads[i];
      thread.moveToInbox();
      thread.removeLabel(label);
    }
  }

  // send back to homepage
  return refreshHomepage(e);
}

// settings page
function pageSettings() {

  // get inbox zero value and prep control selection
  var userProperties = PropertiesService.getUserProperties();
  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  var inboxSelected = false;
  if(inboxZero == 1) {
    inboxSelected = true;
  }

  // get allowed releases value
  var allowedReleases = parseInt(userProperties.getProperty('allowedReleases'));

  // get impulse control value and prep control selection
  var impulseControls = parseInt(userProperties.getProperty('impulseControls'));
  var inboxZero = parseInt(userProperties.getProperty('inboxZero'));
  var impulseSelected = false;
  if(impulseControls == 1) {
    impulseSelected = true;
  }

  // set up page
  var header = CardService.newCardHeader()
      .setTitle('Settings');

  // get count of messages in inbox and number of releases today
  // for use in disabling (if impulse control selected)
  var inboxCount = getInboxCount();
  var releases = getReleaseCount(userProperties);

  // text if impulse control cannot be changed (releases max met or messages in inbox)
  var impulseControlDisabled = CardService.newDecoratedText()
  .setTopLabel("Impulse Control")
  .setText("Impulse Control cannot be disabled if Inbox Zero is required and your inbox is not empty, " +
  "nor if you have already reached your allowed number of email releases for the day.")
  .setWrapText(true);

  // field and instructions for impulse control
  var impulseControlSetting = CardService.newDecoratedText()
  .setTopLabel("Impulse Control")
  .setText("If enabled, Require Inbox Zero cannot be disabled when inbox is not empty, and number of releases cannot be changed if daily limit has already been reached")
  .setWrapText(true)
  .setSwitchControl(CardService.newSwitch()
      .setFieldName("impulseControls")
      .setValue('1')
      .setSelected(impulseSelected)
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("enableimpulseControls")));

  // text if inbox zero cannot be changed (inbox has messages)
  var inboxZeroDisabled  = CardService.newDecoratedText()
  .setTopLabel("Require Inbox Zero")
  .setText("Require Inbox Zero cannot be disabled when Impulse Control is enabled and inbox is not empty")
  .setWrapText(true);

  // field and instructions for inbox zero
  var inboxZeroSetting  = CardService.newDecoratedText()
  .setTopLabel("Require Inbox Zero")
  .setText("Will not release email unless inbox is empty, regardless of other settings")
  .setWrapText(true)
  .setSwitchControl(CardService.newSwitch()
      .setFieldName("inboxZero")
      .setValue("1")
      .setSelected(inboxSelected)
      .setOnChangeAction(CardService.newAction()
          .setFunctionName("enableInboxZero")));

  // set all allowed releases selection values to no
  var selected = [false, false, false, false, false, false, false, false, false];

  // set value for current setting of allowed releases
  selected[allowedReleases] = true;

  // text if allowed releases cannot be changed (releases max met)
  var releasesDisabled  = CardService.newDecoratedText()
  .setTopLabel("Number of email releases allowed per day")
  .setText("The number of email releases cannot be changed when Impulse Control is enabled and the number allowed releases have already been used for the day")
  .setWrapText(true);

  // field and instructions for releases
  var releasesSetting = CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.DROPDOWN)
    .setTitle("Number of email releases allowed per day")
    .setOnChangeAction(CardService.newAction()
          .setFunctionName("updateAllowedReleases"))
    .setFieldName("allowedReleases")
    .addItem("1", "1", selected[1])
    .addItem("2", "2", selected[2])
    .addItem("3", "3", selected[3])
    .addItem("4", "4", selected[4])
    .addItem("5", "5", selected[5])
    .addItem("6", "6", selected[6])
    .addItem("7", "7", selected[7])
    .addItem("8", "8", selected[8]);  

  // determine proper display for impulse control
  var impulseControlSection;
  if(impulseControls == 1 && 
    (
      (inboxZero == 1 && inboxCount > 0) || 
      releases >= allowedReleases
    )) {
      impulseControlSection = impulseControlDisabled;
    } else {
      impulseControlSection = impulseControlSetting;
    }

  // determine proper display for inbox zero
  var inboxZeroSection;
  if(impulseControls == 1 && inboxZero == 1 && inboxCount > 0) {
      inboxZeroSection = inboxZeroDisabled;
    } else {
      inboxZeroSection = inboxZeroSetting;
    }

  // determine proper display for releases
  var releasesSection;
  if(impulseControls == 1 && releases >= allowedReleases) {
      releasesSection = releasesDisabled;
    } else {
      releasesSection = releasesSetting;
    }

  // build section
  var section = CardService.newCardSection()
      .addWidget(releasesSection)
      .addWidget(inboxZeroSection)
      .addWidget(impulseControlSection);    

  // build page
  var card = CardService.newCardBuilder()
      .setHeader(header)
      .addSection(section);

  return card.build();

}

// set impulse control value from form
function enableimpulseControls(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs['impulseControls'];
    var alert;
    var impulseControls;

    // determine value and alert text
    if(setting == null) {
      impulseControls = 0;
      alert = "Impulse Control disabled";
    } else {
      impulseControls = 1;
      alert = "Impulse Control enabled";
    }

    // update setting value
    userProperties.setProperty('impulseControls', impulseControls);

    // return alert message
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

// set inbox zero value from form
function enableInboxZero(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs['inboxZero'];
    var alert;
    var inboxZero;

    // determine value and alert text
    if(setting == null) {
      inboxZero = 0;
      alert = "Inbox Zero requirement disabled";
    } else {
      inboxZero = 1;
      alert = "Inbox Zero requirement enabled";
    }

    // update setting value
    userProperties.setProperty('inboxZero', inboxZero);

    // return alert message
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

// set releases value from form
function updateAllowedReleases(event) {
    var userProperties = PropertiesService.getUserProperties();
    var setting = event.commonEventObject.formInputs.allowedReleases[""].stringInputs.value[0];

    // set alert text
    var alert = "Allowed releases set to " + setting;

    // update setting value
    userProperties.setProperty('allowedReleases', setting);

    // return alert message
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
          .setText(alert))
      .build();
}

// refresh homepage (can be called from elsewhere)
function refreshHomepage(e) {
    var nav = CardService.newNavigation()
    .popToRoot()
    .updateCard(homepage(e));
    
  return CardService.newActionResponseBuilder()
    .setNavigation(nav)
    .build();
}

// ensure label exists
// originally built to include filter check, but that proved cumbersome
// decided to leave responsibility for that to the user
function checkConfig() {
  var userProperties = PropertiesService.getUserProperties();
  var ghLabel = GmailApp.getUserLabelByName("emailHold");

  var noLabel;
  var alert;

  // get label name, catch error if missing, create label if error
  try {
    ghLabel.getName();
  } catch(err) {
    noLabel = err;
  } finally {
    if(noLabel != null) {
      ghLabel = Gmail.Users.Labels.create({
        'name':'emailHold',
        'labelListVisibility':'labelHide',
        'messageListVisibility':'hide'},
        'me');
      alert = 'emailHold label created for storing email outside of inbox.';
    }
  }
  return alert;
}
