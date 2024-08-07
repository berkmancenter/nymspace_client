const WEEK_IN_MILLIS = 6.048e8,
  DAY_IN_MILLIS = 8.64e7,
  HOUR_IN_MILLIS = 3.6e6,
  MIN_IN_MILLIS = 6e4,
  SEC_IN_MILLIS = 1e3;

export default {
  changeToTitle: function (str) {
    return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str;
  },
};
