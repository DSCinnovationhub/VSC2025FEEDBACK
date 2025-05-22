// Google Apps Script for Summer Hobby Camp Feedback System

// Replace with your Google Sheet ID
const SPREADSHEET_ID = 'https://script.google.com/macros/s/AKfycbwSyLeBrT8GE6y-k5ZpkLFTNzbTPOI419Ibzcz-xl4EHPhpU_2hviDzQeGaySo2sghcQw/exec';

// Sheet names
const FEEDBACK_SHEET = 'Feedback';
const LOG_SHEET = 'SubmissionLog';

// Handle POST requests from feedback.html
function doPost(e) {
  try {
    const formData = JSON.parse(e.postData.contents);
    const result = processFeedback(formData);
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    Logger.log('Error: ' + e.message);
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Error: ' + e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Process feedback submission
function processFeedback(formData) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const feedbackSheet = ss.getSheetByName(FEEDBACK_SHEET);
    const logSheet = ss.getSheetByName(LOG_SHEET);

    // Validate form data
    if (!formData.receiptNo || !formData.campName || !formData.responses) {
      return { success: false, message: 'Missing required fields' };
    }

    // Check for duplicate submission
    const submissionKey = `${formData.receiptNo}_${formData.campName}`;
    if (isDuplicateSubmission(logSheet, submissionKey)) {
      return { success: false, message: 'Feedback already submitted for this receipt and camp' };
    }

    const timestamp = new Date();
    const responses = formData.responses;

    // Prepare data for Feedback sheet
    const row = [
      timestamp,
      formData.receiptNo,
      formData.campName,
      responses.q1 || '',
      responses.q2 || '',
      responses.q3 || '',
      responses.q4 || '',
      responses.q5 || '',
      responses.q6 || '',
      responses.q7 || '',
      responses.q8 || '',
      responses.q9 || '',
      responses.q10 || ''
    ];

    // Append to Feedback sheet
    feedbackSheet.appendRow(row);

    // Log submission
    logSheet.appendRow([timestamp, submissionKey, 'Submitted']);

    return { success: true, message: 'Feedback submitted successfully!' };
  } catch (e) {
    Logger.log('Error: ' + e.message);
    return { success: false, message: 'Error submitting feedback: ' + e.message };
  }
}

// Check for duplicate submission
function isDuplicateSubmission(logSheet, submissionKey) {
  const data = logSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === submissionKey) {
      return true;
    }
  }
  return false;
}

// Initialize sheets
function setupSheets() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let feedbackSheet = ss.getSheetByName(FEEDBACK_SHEET);
  let logSheet = ss.getSheetByName(LOG_SHEET);

  if (!feedbackSheet) {
    feedbackSheet = ss.insertSheet(FEEDBACK_SHEET);
    feedbackSheet.appendRow([
      'Timestamp',
      'Receipt Number',
      'Camp Name',
      'Q1: Overall Experience',
      'Q2: Instructor Knowledge',
      'Q3: Session Engagement',
      'Q4: Concept Explanation',
      'Q5: Practical Activities',
      'Q6: Recommend Camp',
      'Q7: Most Enjoyed',
      'Q8: Suggestions',
      'Q9: Future Participation',
      'Q10: Additional Comments'
    ]);
  }

  if (!logSheet) {
    logSheet = ss.insertSheet(LOG_SHEET);
    logSheet.appendRow(['Timestamp', 'Submission Key', 'Status']);
  }
}