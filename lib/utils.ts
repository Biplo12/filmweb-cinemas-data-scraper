export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Helper function to extract text content from a query selector
export const extractMultipleTextContentFromSelectors = (
  selector: string,
  document: Document,
  attribute?: string
): string | string[] => {
  const texts = Array.from(document.querySelectorAll(selector)).map((el) => {
    if (attribute) {
      return (el as HTMLElement).getAttribute(attribute)?.trim() || "";
    }
    return el.textContent?.trim() || "";
  });

  const filteredTexts = texts.filter((text) => text !== "");

  if (filteredTexts.length === 1) {
    return filteredTexts[0];
  }
  return filteredTexts;
};

export const durationStringToNumber = (duration: string): number => {
  const parts = duration.split(" ");
  let totalMinutes = 0;

  parts.forEach((part) => {
    if (part.endsWith("h")) {
      totalMinutes += parseInt(part) * 60;
    } else if (part.endsWith("m")) {
      totalMinutes += parseInt(part);
    }
  });

  return totalMinutes;
};
