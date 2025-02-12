// utils.js
export default function convertDateFormat(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
  
    const formattedDate = `${day}/${month}/${year}`;
  
    if (isNaN(day)) {
      return "No Date Found";
    }
  
    return formattedDate;
  }
  