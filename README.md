A codemod which makes the array search operation more optimal and efficient, by converting the array into a set and executing the set's has method to find the desired element.

## Example

### Before

```ts
// Initialize an array with some elements
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Element to check
const elementToCheck = 5;

// Check if the element exists in the array
const isElementInArray = array.includes(elementToCheck);
```

### After

```ts
// Initialize an array with some elements
const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Element to check
const elementToCheck = 5;

// Convert the array into a set
const set = new Set(array);

// Check if the element exists in the set
const isElementInSet = set.has(elementToCheck);
```

