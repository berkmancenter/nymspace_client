export default {
  changeToTitle: function (str) {
    return str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str
  }
}
