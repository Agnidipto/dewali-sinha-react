import moment from "moment";

function TimeAgo(datetime) {
  var d = Date.parse(datetime);
  var d1 = new Date();
  var nowDate = new Date(
    d1.getUTCFullYear(),
    d1.getUTCMonth(),
    d1.getUTCDate(),
    d1.getUTCHours(),
    d1.getUTCMinutes(),
    d1.getUTCSeconds()
  );

  const difftime = Math.abs(d - nowDate);
  const seconds = Math.floor(difftime / 1000);
  const minutes = Math.floor(difftime / (1000 * 60));
  const hours = Math.floor(difftime / (1000 * 60 * 60));
  const days = Math.floor(difftime / (1000 * 60 * 60 * 24));

  if (days > 0) return days + "d ago";
  if (hours > 0) return hours + "h ago";
  if (minutes > 0) return minutes + "m ago";
  else return seconds + "s ago";
}

export default TimeAgo;
