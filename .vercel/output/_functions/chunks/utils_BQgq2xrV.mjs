function formatDate(date, locale = "nl-BE") {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

export { formatDate as f };
