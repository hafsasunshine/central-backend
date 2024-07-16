const excelDateToJSDate = (excelDate) => {
  const jsDate = new Date((excelDate - (25567 + 1)) * 86400 * 1000);
  // Return only the date part in 'YYYY-MM-DD' format
  return jsDate.toISOString().split('T')[0];
};

module.exports = { excelDateToJSDate };
