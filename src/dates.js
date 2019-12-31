export function dateToMdy (date) {
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();

  var v = [
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd,
          date.getFullYear()
         ].join('/');
  return v;  
}

export function dateToYYYY (date) {
  return date.getFullYear(); 
}