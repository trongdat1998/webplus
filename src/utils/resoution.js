export function getIntervalFromResolution(resolution) {
  let interval = resolution;
  if (interval == "1") {
    interval = "1m";
  } else if (interval == "5") {
    interval = "5m";
  } else if (interval == "15") {
    interval = "15m";
  } else if (interval == "30") {
    interval = "30m";
  } else if (interval == "60") {
    interval = "1h";
  } else if (interval == "120") {
    interval = "2h";
  } else if (interval == "240") {
    interval = "4h";
  } else if (interval == "360") {
    interval = "6h";
  } else if (interval == "720") {
    interval = "12h";
  } else if (interval == "1440") {
    interval = "1d";
  } else if (interval == "10080") {
    interval = "1w";
  } else if (interval == "44640") {
    interval = "1M";
  }
  if (/^\d{1,}$/g.test(interval)) {
    interval += "m";
  }
  return interval || "1m";
}
