

export const MinutesFromDates=(fromDate,toDate)=>{
    const diffInMilisec = (fromDate-toDate); // milliseconds between now & expiration date
    const totalMinutes = parseInt(diffInMilisec/60000);

    return totalMinutes;
  }