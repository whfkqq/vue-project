

/* 整数 */
export function isValidNumber(val)
{
  const reg = /^\d+$/;
  return reg.test(val);
}

/* 合法uri*/
export function isURL(textval)
{
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function isLowerCase(str)
{
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function isUpperCase(str)
{
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function isAlphabets(str)
{
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 验证手机 */
export function isMobilePhone(val){
  const reg=/^1[3456789]\d{9}$/;
  return reg.test(val);
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function isEmail(email)
{
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

