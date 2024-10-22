export default function transform(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  let dirtyFlag = false;

  // Find all variable declarations
  root.find(j.VariableDeclaration).forEach(path => {
    path.node.declarations.forEach(declaration => {
      if (j.Identifier.check(declaration.id) && j.CallExpression.check(declaration.init)) {
        const { callee, arguments: args } = declaration.init;

        // Check if the call expression is using `includes` method
        if (j.MemberExpression.check(callee) && callee.property.name === 'includes') {
          const arrayIdentifier = callee.object;
          const elementToCheck = args[0];

          // Create a new Set from the array
          const setIdentifier = j.identifier('set');
          const setDeclaration = j.variableDeclaration('const', [
            j.variableDeclarator(
              setIdentifier,
              j.newExpression(j.identifier('Set'), [arrayIdentifier])
            )
          ]);

          // Replace the `includes` method with `has` method on the Set
          declaration.init = j.callExpression(
            j.memberExpression(setIdentifier, j.identifier('has')),
            [elementToCheck]
          );

          // Insert the Set declaration before the current variable declaration
          j(path).insertBefore(setDeclaration);
          dirtyFlag = true;
        }
      }
    });
  });

  return dirtyFlag ? root.toSource() : undefined;
}


export const parser = "tsx";