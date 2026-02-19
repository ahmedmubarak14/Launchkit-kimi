export function getRelativeTime(date: string | Date, language: "en" | "ar" = "en"): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  const labels = {
    en: {
      justNow: "just now",
      seconds: "s",
      minute: "1m",
      minutes: "m",
      hour: "1h",
      hours: "h",
      day: "1d",
      days: "d",
      week: "1w",
      weeks: "w",
      month: "1mo",
      months: "mo",
      year: "1y",
      years: "y",
    },
    ar: {
      justNow: "الآن",
      seconds: "ث",
      minute: "دقيقة",
      minutes: "د",
      hour: "ساعة",
      hours: "س",
      day: "يوم",
      days: "ي",
      week: "أسبوع",
      weeks: "أ",
      month: "شهر",
      months: "ش",
      year: "سنة",
      years: "س",
    },
  };

  const t = labels[language];

  if (seconds < 10) return t.justNow;
  if (seconds < 60) return `${seconds}${t.seconds}`;

  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) return t.minute;
  if (minutes < 60) return `${minutes}${t.minutes}`;

  const hours = Math.floor(minutes / 60);
  if (hours === 1) return t.hour;
  if (hours < 24) return `${hours}${t.hours}`;

  const days = Math.floor(hours / 24);
  if (days === 1) return t.day;
  if (days < 7) return `${days}${t.days}`;

  const weeks = Math.floor(days / 7);
  if (weeks === 1) return t.week;
  if (weeks < 4) return `${weeks}${t.weeks}`;

  const months = Math.floor(days / 30);
  if (months === 1) return t.month;
  if (months < 12) return `${months}${t.months}`;

  const years = Math.floor(days / 365);
  if (years === 1) return t.year;
  return `${years}${t.years}`;
}
