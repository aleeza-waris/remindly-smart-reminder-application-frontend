type DateTimeParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (timeZone: string) => {
  let formatter = dateTimeFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    dateTimeFormatterCache.set(timeZone, formatter);
  }
  return formatter;
};

const getDateTimeParts = (date: Date, timeZone: string): DateTimeParts => {
  const parts = getFormatter(timeZone).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
    second: getPart('second'),
  };
};

const matchesDateTime = (left: DateTimeParts, right: DateTimeParts) =>
  left.year === right.year &&
  left.month === right.month &&
  left.day === right.day &&
  left.hour === right.hour &&
  left.minute === right.minute &&
  left.second === right.second;

export const isValidTimeZone = (timeZone: string) => {
  try {
    getFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
};

export const getBrowserTimeZone = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return isValidTimeZone(timeZone) ? timeZone : 'UTC';
  } catch {
    return 'UTC';
  }
};

export const toTimeZoneDateTimeInput = (value: string | undefined, timeZone: string) => {
  const date = value
    ? new Date(value)
    : new Date(Date.now() + 60 * 60 * 1000);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('The reminder due date is invalid.');
  }

  const { year, month, day, hour, minute } = getDateTimeParts(date, timeZone);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const timeZoneDateTimeInputToISOString = (value: string, timeZone: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    throw new RangeError('Choose a valid reminder date and time.');
  }

  const [, yearText, monthText, dayText, hourText, minuteText] = match;
  const desired: DateTimeParts = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
    hour: Number(hourText),
    minute: Number(minuteText),
    second: 0,
  };
  const wallTime = Date.UTC(
    desired.year,
    desired.month - 1,
    desired.day,
    desired.hour,
    desired.minute
  );
  const wallDate = new Date(wallTime);
  if (
    wallDate.getUTCFullYear() !== desired.year ||
    wallDate.getUTCMonth() + 1 !== desired.month ||
    wallDate.getUTCDate() !== desired.day ||
    desired.hour > 23 ||
    desired.minute > 59
  ) {
    throw new RangeError('Choose a valid reminder date and time.');
  }

  const offsets = new Set<number>();
  for (let hours = -36; hours <= 36; hours += 6) {
    const instant = new Date(wallTime + hours * 60 * 60 * 1000);
    const local = getDateTimeParts(instant, timeZone);
    offsets.add(
      Date.UTC(
        local.year,
        local.month - 1,
        local.day,
        local.hour,
        local.minute,
        local.second
      ) - instant.getTime()
    );
  }

  const matchingInstants = [...offsets]
    .map((offset) => new Date(wallTime - offset))
    .filter((instant) => matchesDateTime(getDateTimeParts(instant, timeZone), desired))
    .sort((left, right) => left.getTime() - right.getTime());

  if (matchingInstants.length === 0) {
    throw new RangeError(
      'That local time does not exist because the clocks change for daylight saving time.'
    );
  }

  return matchingInstants[0].toISOString();
};
