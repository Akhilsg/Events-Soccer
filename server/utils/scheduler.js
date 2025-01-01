const Event = require("../models/Event");
const User = require("../models/User");

/**
 * Main function to schedule events for a user.
 * @param {String} userId - The ID of the user.
 * @returns {Array} - The scheduled events with assigned time slots.
 */
const scheduleEvents = async (userId) => {
  let events = await Event.find({ userId }).lean();
  const user = await User.findById(userId).lean();

  if (!user) throw new Error("User not found");
  if (!events.length) return [];

  // Parse user availability and preferred work times
  const availability = parseAvailability(user.availability);
  const preferredTimes = parsePreferredTimes(
    user.preferences.preferredWorkTimes
  );

  // Sort events based on priority and due date
  events = processEvents(events);

  let schedule = [];
  let occupiedSlots = {};

  for (let event of events) {
    // Try to find a time slot in preferred times first
    let timeSlot = findPreferredTimeSlot(event, preferredTimes, occupiedSlots);

    if (!timeSlot) {
      // Fallback to general availability if no preferred slot is found
      timeSlot = findTimeSlot(event, availability, occupiedSlots);
    }

    if (timeSlot) {
      schedule.push({
        eventId: event._id,
        title: event.title,
        scheduledStart: timeSlot.start,
        scheduledEnd: timeSlot.end,
      });
      markOccupiedSlots(occupiedSlots, timeSlot);
    } else {
      console.log(`No available time slot for event "${event.title}"`);
    }
  }

  return schedule;
};

/**
 * Parses user availability into a structured format.
 * @param {Array} availability - The user's availability.
 * @returns {Object} - Structured availability by date.
 */
const parseAvailability = (availability) => {
  const availabilityMap = {};

  const dates = getNextNDates(30);

  dates.forEach((date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const dayAvailability = availability.find((a) => a.day === dayOfWeek);

    if (dayAvailability) {
      availabilityMap[date.toISOString().split("T")[0]] = {
        start: dayAvailability.startTime,
        end: dayAvailability.endTime,
      };
    }
  });

  return availabilityMap;
};

/**
 * Parses user preferred work times into a structured format.
 * @param {Array} preferredWorkTimes - The user's preferred work times.
 * @returns {Object} - Structured preferred times by date.
 */
const parsePreferredTimes = (preferredWorkTimes) => {
  const preferredMap = {};

  const dates = getNextNDates(30);

  dates.forEach((date) => {
    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
    const dayPreference = preferredWorkTimes.find((p) => p.day === dayOfWeek);

    if (dayPreference) {
      preferredMap[date.toISOString().split("T")[0]] = {
        start: dayPreference.startTime,
        end: dayPreference.endTime,
      };
    }
  });

  return preferredMap;
};

/**
 * Processes events by sorting them based on priority and due date.
 * @param {Array} events - The list of events.
 * @returns {Array} - The sorted list of events.
 */
const processEvents = (events) => {
  return events.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });
};

/**
 * Finds an available time slot for an event within preferred times.
 * @param {Object} event - The event to schedule.
 * @param {Object} preferredTimes - The user's preferred times.
 * @param {Object} occupiedSlots - The occupied time slots.
 * @returns {Object|null} - The time slot or null if none found.
 */
const findPreferredTimeSlot = (event, preferredTimes, occupiedSlots) => {
  const eventDuration = event.duration;
  const dueDate = new Date(event.dueDate);

  const dates = getDatesUntil(dueDate);

  for (let date of dates) {
    const dateStr = date.toISOString().split("T")[0];

    if (preferredTimes[dateStr]) {
      const { start, end } = preferredTimes[dateStr];
      const availableSlots = getAvailableTimeSlots(
        dateStr,
        start,
        end,
        occupiedSlots,
        eventDuration
      );

      if (availableSlots.length > 0) {
        return availableSlots[0];
      }
    }
  }

  // If no preferred time slots are available, return null
  return null;
};

/**
 * Finds an available time slot for an event.
 * @param {Object} event - The event to schedule.
 * @param {Object} availability - The user's availability.
 * @param {Object} occupiedSlots - The occupied time slots.
 * @returns {Object|null} - The time slot or null if none found.
 */
const findTimeSlot = (event, availability, occupiedSlots) => {
  const eventDuration = event.duration;
  const dueDate = new Date(event.dueDate);

  const dates = getDatesUntil(dueDate);

  for (let date of dates) {
    const dateStr = date.toISOString().split("T")[0];

    if (availability[dateStr]) {
      const { start, end } = availability[dateStr];
      const availableSlots = getAvailableTimeSlots(
        dateStr,
        start,
        end,
        occupiedSlots,
        eventDuration
      );

      if (availableSlots.length > 0) {
        return availableSlots[0];
      }
    }
  }

  return null;
};

/**
 * Gets available time slots on a given day.
 * @param {String} dateStr - The date string (YYYY-MM-DD).
 * @param {String} dayStart - The day's start time (HH:mm).
 * @param {String} dayEnd - The day's end time (HH:mm).
 * @param {Object} occupiedSlots - The occupied time slots.
 * @param {Number} duration - The event duration in hours.
 * @returns {Array} - The list of available time slots.
 */
const getAvailableTimeSlots = (
  dateStr,
  dayStart,
  dayEnd,
  occupiedSlots,
  duration
) => {
  const dayStartTime = new Date(`${dateStr}T${dayStart}:00`);
  const dayEndTime = new Date(`${dateStr}T${dayEnd}:00`);

  let slots = [];
  let slotStart = new Date(dayStartTime);

  while (
    slotStart.getTime() + duration * 60 * 60 * 1000 <=
    dayEndTime.getTime()
  ) {
    const slotEnd = new Date(slotStart.getTime() + duration * 60 * 60 * 1000);

    const conflicts = checkForConflicts(
      dateStr,
      slotStart,
      slotEnd,
      occupiedSlots
    );

    if (!conflicts) {
      slots.push({
        start: slotStart.toISOString(),
        end: slotEnd.toISOString(),
      });
    }

    // Increment slotStart by a defined interval, e.g., 30 minutes
    slotStart = new Date(slotStart.getTime() + 30 * 60 * 1000);
  }

  return slots;
};

/**
 * Checks for time slot conflicts.
 * @param {String} dateStr - The date string.
 * @param {Date} slotStart - The start time of the slot.
 * @param {Date} slotEnd - The end time of the slot.
 * @param {Object} occupiedSlots - The occupied time slots.
 * @returns {Boolean} - True if conflicts exist, false otherwise.
 */
const checkForConflicts = (dateStr, slotStart, slotEnd, occupiedSlots) => {
  if (!occupiedSlots[dateStr]) return false;

  return occupiedSlots[dateStr].some(
    (occupied) =>
      (slotStart >= occupied.start && slotStart < occupied.end) ||
      (slotEnd > occupied.start && slotEnd <= occupied.end) ||
      (slotStart <= occupied.start && slotEnd >= occupied.end)
  );
};

/**
 * Marks a time slot as occupied.
 * @param {Object} occupiedSlots - The occupied time slots.
 * @param {Object} timeSlot - The time slot to mark.
 */
const markOccupiedSlots = (occupiedSlots, timeSlot) => {
  const dateStr = timeSlot.start.split("T")[0];
  if (!occupiedSlots[dateStr]) occupiedSlots[dateStr] = [];

  occupiedSlots[dateStr].push({
    start: new Date(timeSlot.start),
    end: new Date(timeSlot.end),
  });
};

/**
 * Gets an array of dates from today up to a specified date.
 * @param {Date} endDate - The end date.
 * @returns {Array} - The list of dates.
 */
const getDatesUntil = (endDate) => {
  const dates = [];
  const today = new Date();
  let currentDate = new Date(today);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Gets the next N dates starting from today.
 * @param {Number} n - The number of days.
 * @returns {Array} - The list of dates.
 */
const getNextNDates = (n) => {
  const dates = [];
  const today = new Date();
  let currentDate = new Date(today);

  for (let i = 0; i < n; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

module.exports = { scheduleEvents };
