export const thousandsFormat = (value) => {
    // Check if the input is a valid number
    if (isNaN(value)) {
        console.error('Invalid input. Please provide a valid number.');
        return;
    }
    // Convert the number to a string
    const stringValue = value.toString();

    // Split the string into integer and decimal parts (if any)
    const [integerPart, decimalPart] = stringValue.split('.');

    // Add commas to the integer part
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the integer and decimal parts (if any)
    const formattedValue = decimalPart
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;

    return formattedValue;
};
