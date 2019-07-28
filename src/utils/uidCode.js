
export const uidCode = uid => {
  const alphabetMap = ['68ABCDEFGHJKLMnpQrsTUWXYZi234579', '68aBcdEfghjkLmNpqRstUwxYzi234579', '68ABCdefGhjkLMnPqRStuWxyZi234579', '68aBcDeFgHJKLmNPQrSTuwXyZi234579']
  const list = [7, 5, 2, 18, 8, 11, 24, 25, 9, 12, 10, 13, 29, 31, 21, 1, 15, 20, 30, 28, 27, 17, 22, 26, 19, 4, 14, 3, 0, 23, 6, 16]
  let alphabet = ''

  alphabetMap.map((elm, index) => {
    const temp = []
    list.forEach((val, num) => temp[num] = elm[val])
    alphabetMap[index] = temp.join('')
  })

  alphabet = alphabetMap[uid % 4]
  let buf = [0]
  let index = 5

  while (uid > 0 && index >= 0) {
    let b1 = uid & 0x1f
    uid = uid >> 5
    buf[index] = b1
    index--
  }

  if (buf.length < 2) return 'null'

  buf.map((val, index) => buf[index] = alphabet[val])

  return buf.join('')

}


export const string10to62 = number => {
  number = parseInt(number, 10)
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    radix = chars.length,
    qutient = +number,
    arr = [];
  do {
    var mod = qutient % radix;
    qutient = (qutient - mod) / radix;
    arr.unshift(chars[mod]);
  } while (qutient);
  return arr.join('');
}

export const string62to10 = number_code => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    radix = chars.length,
    number_code = String(number_code),
    len = number_code.length,
    i = 0,
    origin_number = 0;
  while (i < len) {
    origin_number += Math.pow(radix, i++) * chars.indexOf(number_code.charAt(len - i) || 0);
  }
  return origin_number;
}