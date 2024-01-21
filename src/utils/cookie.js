/*
 * Cookie
 */
export default {
  read: function(name) {
    var value = document.cookie.match("(?:^|;)\\s*" + name + "=([^;]*)");
    return value ? decodeURIComponent(value[1]) : null;
  },
  write: function(value) {
    var str = value.name + "=" + encodeURIComponent(value.value);
    if (value.domain) {
      str += "; domain=" + value.domain;
    }
    str += "; path=" + (value.path || "/");
    if (value.day) {
      var time = new Date();
      time.setTime(time.getTime() + value.day * 24 * 60 * 60 * 1000);
      str += "; expires=" + time.toUTCString();
    }
    if (value.expires) {
      str += "; expires=" + value.expires.toUTCString();
    }
    document.cookie = str;
    return;
  },
  del: function(name, options) {
    var opt = options || {};
    opt.name = name;
    opt.day = -1;
    opt.value = "a";
    this.write(opt);
    return;
  }
};
