const {google} = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const uniqueId = uuidv4();


const now = new Date();
const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000); // One hour later

const currentTime = now.getTime();

// Add one minute in milliseconds (60,000 milliseconds)
const oneMinuteLater = currentTime + 60000;

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(), // Start time is the current date and time
    timeMax: endOfDay.toISOString(), // End time is the end of the current day
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  
  const events = res.data.items ;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  return events;
}


async function createEvent(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: 'Docker Appointment',
    description: 'Event Description',
    start: {
      dateTime: now.toISOString(), // Replace with the desired start time
      timeZone: 'UTC', // Replace with the desired time zone
    },
    end: {
      dateTime: oneHourLater.toISOString(), // Replace with the desired end time
      timeZone: 'UTC', // Replace with the desired time zone
    },
    transparency:"transparent",
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 30 }, 
        { method: 'popup', minutes: 1 }// Set notification 30 minutes before the event
        // Add more overrides as needed
      ],
    },
    colorId: '5',
   recurrence : ['RRULE:FREQ=DAILY;COUNT=7']
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      sendNotifications: true,
      supportsAttachments: true,
    });

    console.log('Event created:', res.data);
    return res.data;
  } catch (err) {
    console.error('Error creating event:', err.message);
    throw err;
  }
}


async function updateEvent(auth, eventId, updatedSummary) {
  const calendar = google.calendar({ version: 'v3', auth });
  
  const res = await calendar.events.patch({
    calendarId: 'primary',
    eventId: eventId,
    resource: {
      summary: updatedSummary,
    },
  });

  return res.data;
}

async function deleteEvent(auth, eventId) {
  const calendar = google.calendar({ version: 'v3', auth });

  await calendar.events.delete({
    calendarId: 'primary',
    eventId: eventId,
  });

  return { message: 'Event deleted successfully.' };
}

async function watchNotifications(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const endpoint = 'https://2a06-2405-201-e016-a129-30bc-e79c-82d2-f8a0.ngrok-free.app'; 
  const response = await calendar.events.watch({
    calendarId: 'primary',
    showDeleted:true,
    showHiddenInvitations:true,
    requestBody: {
        id: uniqueId, 
        type: "web_hook",
        address: endpoint + '/webhook', 
        payload:true,
        expiration:oneMinuteLater
    },
  });

  console.log('Watch response:',response.data);
}



module.exports = {
    listEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    watchNotifications
}