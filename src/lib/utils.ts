export const capitalizeFirstLetter = (str: string) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
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

export const extractTextContentFromSelector = (
  selector: string,
  element: Element | Document,
  attribute?: string
): string => {
  const selectedElement = element.querySelector(selector);
  if (!selectedElement) return "N/A";

  if (attribute) {
    return selectedElement.getAttribute(attribute) || "N/A";
  }

  return selectedElement.textContent?.trim() || "N/A";
};
