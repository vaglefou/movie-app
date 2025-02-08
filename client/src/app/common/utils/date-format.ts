import moment from "moment";

export const formatTimestamp = (timestamp: string): string => {
  try {
    const date = moment.utc(timestamp);
    // Handle invalid date
    if (!date.isValid()) {
      console.error(`Invalid timestamp: ${timestamp}`);
      return "Invalid Date";
    }
    return date.format("YYYY/MM/DD");
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Error";
  }
};

export const formatTimestampHtmlDateInput = (timestamp: string): string => {
  try {
    const date = moment.utc(timestamp);
    // Handle invalid date
    if (!date.isValid()) {
      console.error(`Invalid timestamp: ${timestamp}`);
      return "Invalid Date";
    }
    return date.format("YYYY-MM-DD");
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Error";
  }
};
