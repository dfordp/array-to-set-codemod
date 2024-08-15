// Initialize an array with some elements
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Element to check
const elementToCheck = 5;

// Convert the array into a set
const set = new Set(array);

// Check if the element exists in the set
const isElementInSet = set.has(elementToCheck);