const WEEK_IN_MILLIS = 6.048e8,
  DAY_IN_MILLIS = 8.64e7,
  HOUR_IN_MILLIS = 3.6e6,
  MIN_IN_MILLIS = 6e4,
  SEC_IN_MILLIS = 1e3;

export default {
  changeToTitle: function (str) {
    return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  },
  timeFromNow: function (date) {
    const formatter = new Intl.RelativeTimeFormat("en", { style: "long" });

    const millis = new Date(date).getTime();
    const diff = millis - new Date().getTime();
    if (Math.abs(diff) > WEEK_IN_MILLIS)
      return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), "week");
    else if (Math.abs(diff) > DAY_IN_MILLIS)
      return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), "day");
    else if (Math.abs(diff) > HOUR_IN_MILLIS)
      return formatter.format(
        Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS),
        "hour"
      );
    else if (Math.abs(diff) > MIN_IN_MILLIS)
      return formatter.format(
        Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS),
        "minute"
      );
    else
      return formatter.format(
        Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS),
        "second"
      );
  },
};
