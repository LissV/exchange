export default values => {
  let errors = {};

  var reg = new RegExp('^[0-9]$');

  if(!reg.test(values.changeValue)) errors.changeValue = 'Можно вводить только цифры';

  return errors;
};
