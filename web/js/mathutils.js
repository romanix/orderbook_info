function meround(value, precision, mode) {
    
  var m, f, isHalf, sgn; 
  precision |= 0; 
  m = Math.pow(10, precision);
  value *= m;
  sgn = (value > 0) | -(value < 0); 
  isHalf = value % 1 === 0.5 * sgn;
  f = Math.floor(value);

  if (isHalf) 
    switch (mode) {
      case 'PHP_ROUND_HALF_DOWN':
        value = f + (sgn < 0); 
        break;
      case 'PHP_ROUND_HALF_EVEN':
        value = f + (f % 2 * sgn); 
        break;
      case 'PHP_ROUND_HALF_ODD':
        value = f + !(f % 2); 
        break;
      default:
        value = f + (sgn > 0); 
    }
  return (isHalf ? value : Math.round(value)) / m;
}