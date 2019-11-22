//时间戳转化为2019-1-21格式
function timestampConver(timestamp) {
  var date = new Date(timestamp); // 获取一个时间对象
  var y = date.getFullYear();
  var m = date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
  var d = date.getDate(); // 获取日(1-31)
  // var month = m < 10 ? '0' + m : m;
  // var day = d < 10 ? '0' + d : d;
  var time = y + "-" + m + "-" + d;
  return time;
}

//时间戳转化为2019-01-21格式
function timestampConver2(timestamp) {
  var date = new Date(timestamp); // 获取一个时间对象
  var y = date.getFullYear();
  var m = date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
  var d = date.getDate(); // 获取日(1-31)
  var month = m < 10 ? "0" + m : m;
  var day = d < 10 ? "0" + d : d;
  var time = y + "-" + month + "-" + day;
  return time;
}

//时间戳转化为1-21格式
function timestampConverMD(timestamp) {
  var nowDate = new Date();
  var nowYear = nowDate.getFullYear();
  var date = new Date(timestamp); // 获取一个时间对象
  var y = date.getFullYear();
  var m = date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
  var d = date.getDate(); // 获取日(1-31)
  var time = nowYear == y ? m + "-" + d : y + "-" + m + "-" + d;
  return time;
}

//时间转化为时间戳毫秒级
function toTimestamp(strtime) {
  var date = new Date(strtime.replace(/-/g, "/"));
  return date.getTime();
}

//时间戳转化为2019年1月21日格式
function timestampConver3(timestamp) {
  let date = new Date(timestamp); // 获取一个时间对象
  let y = date.getFullYear();
  let m = date.getMonth() + 1; // 获取月份(0-11,0代表1月,用的时候记得加上1)
  let d = date.getDate(); // 获取日(1-31)
  let time = y + "年" + m + "月" + d + "日";
  return time;
}

export {
  timestampConver,
  timestampConverMD,
  timestampConver2,
  timestampConver3,
  toTimestamp
};
