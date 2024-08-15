export default function transform(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Find the array variable declaration
  const arrayDeclaration = root.find(j.VariableDeclaration).filter((path) => {
    return path.node.declarations.some((decl) =>
      j.ArrayExpression.check(decl.init),
    );
  });

  // If array declaration is found, create a Set from the array
  arrayDeclaration.forEach((path) => {
    const arrayVar = path.node.declarations[0].id.name;
    const setVar = 'set';
    const setDeclaration = j.variableDeclaration('const', [
      j.variableDeclarator(
        j.identifier(setVar),
        j.newExpression(j.identifier('Set'), [j.identifier(arrayVar)]),
      ),
    ]);
    j(path).insertAfter(setDeclaration);
    dirtyFlag = true;
  });

  // Replace array.includes with set.has
  root.find(j.CallExpression, {
    callee: {
      object: {
        type: 'Identifier',
      },
      property: {
        name: 'includes',
      },
    },
  }).forEach((path) => {
    const elementToCheck = path.node.arguments[0];
    path.replace(
      j.callExpression(
        j.memberExpression(j.identifier('set'), j.identifier('has')),
        [elementToCheck],
      ),
    );
    dirtyFlag = true;
  });

  // Update the variable name from isElementInArray to isElementInSet
  root.find(j.VariableDeclarator, {
    id: {
      type: 'Identifier',
      name: 'isElementInArray',
    },
  }).forEach((path) => {
    path.node.id.name = 'isElementInSet';
    dirtyFlag = true;
  });

  // Update the console log message and the variable name in the log
  root.find(j.CallExpression, {
    callee: {
      object: {
        type: 'Identifier',
      },
      property: {
        name: 'log',
      },
    },
  }).forEach((path) => {
    const templateLiteral = path.node.arguments[0];
    const logVariable = path.node.arguments[1];
    if (j.TemplateLiteral.check(templateLiteral)) {
      templateLiteral.quasis.forEach((quasi) => {
        quasi.value.raw = quasi.value.raw.replace('array', 'set');
        quasi.value.cooked = quasi.value.cooked.replace('array', 'set');
      });
      dirtyFlag = true;
    }
    if (
      j.Identifier.check(logVariable) &&
      logVariable.name === 'isElementInArray'
    ) {
      logVariable.name = 'isElementInSet';
      dirtyFlag = true;
    }
  });

  return dirtyFlag ? root.toSource() : undefined;
}