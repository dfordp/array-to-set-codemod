A codemod which makes the array search operation more optimal and efficient, by converting the array into a set and executing the set's has method to find the desired element.



### Before

```ts
//intialize a set using the elements of that array
//check in the set instead of the array and use the has method instead of the includes method
const isElmement = array.includes(elementToCheck);
```

### After

```ts
const set = new Set(array);
const isElmement = set.has(elementToCheck);
```

