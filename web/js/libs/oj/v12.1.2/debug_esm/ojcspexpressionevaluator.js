/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExpParser } from 'ojs/ojexpparser';
import 'ojs/ojkoshared';

/**
 * @license
 * Copyright (c) 2019 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 *
 * @license
 * Based on the Expression Evaluator 2.0.0
 * https://github.com/donmccurdy/expression-eval
 * under MIT License
 * @ignore
 */

/**
 * @class oj.CspExpressionEvaluator
 * @since 7.1.0
 * @ojshortdesc Object representing CSP-compliant evaluator.
 * @ojtsmodule
 *
 * @classdesc A class for creating CSP-compliant evaluators of JavaScript expressions
 * <p> The default JET expression evaluator cannot be used when Content Security Policy
 * prohibits unsafe evaluations. In order to replace the default evaluator with the JET CSP-compliant evaluator,
 * create and pass an instance of CspExpressionEvaluator class to the
 * <a href="oj.Config.html#setExpressionEvaluator">Config.setExpressionEvaluator()</a> method.
 * This method must be called before applying knockout bindings in the application for the first time.
 * </p>
 *
 * <p>Any extra context required for evaluating expressions can be passed to the object constructor using <code>globalScope</code> property.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * Config.setExpressionEvaluator(new CspExpressionEvaluator());
 * </code>
 * </pre>
 *
 * <h2 id="validExpressions">Expressions supported by the JET CspExpressionEvaluator
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#validExpressions"></a>
 * </h2>
 * <p>
 * <ul>
 *  <li>Identifiers, e.g. <code>[[value]]</code>.</li>
 *  <li>Members, e.g. <code>[[router.stateId]]</code>.</li>
 *  <li>Literals, e.g. <code>[['abc']]</code>.</li>
 *  <li>Function callbacks, e.g. <code>[[getColor('customer', id)]]</code>.</li>
 *  <li>Unary operators are limited to '-', '+', '~', '!' and '...', e.g. <code>[[-100]]</code>.</li>
 *  <li>Binary operators, e.g. <code>[[value + '.png']]</code>.</li>
 *  <li>Logical operators, e.g. <code>[[a && b]]</code> or <code>[[a || b]]</code>.</li>
 *  <li>Conditional or ternary operators, e.g. <code>[[test ? consequent : alternate]]</code>.</li>
 *  <li>Optional chaining operators, e.g. <code>[[a?.b]]</code>.</li>
 *  <li>Array literals, e.g. <code>[a, b, c]</code>.</li>
 *  <li>Object literals, e.g. <code>[[{'selection_state': selected}]]</code>.</li>
 *  <li>Functions are limited to a single statement, e.g. <code>[[function(){return 'abc'}]]</code>.</li>
 *  <li>'new' operator such as <code>'new Object()'</code></li>
 *  <li>Regular expressions in the form of explicit RegExp objects such as <code>[[testString.match(new RegExp('abc', 'i'))]]</code></li>
 *</ul>
 * <h2 id="invalidExpressions">Expression limitations:
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#invalidExpressions"></a>
 * </h2>
 * <p> The following code is not supported in expressions:
 * <ul>
 *  <li>Arrow functions such as <code>'[1, 2, 3].map(item => item + 1)'</code></li>
 *  <li>Assignment operators of any types such as <code>'='</code> or <code>'+='</code> or <code>'|='</code></li>
 *  <li>Blocks of code such as <code>'if (...){}'</code></li>
 *  <li>Comma operator (,) such as <code>'(expr1, expr2)'</code></li>
 *  <li>Exponentiation (**) such as <code>' 3 ** 4'</code></li>
 *  <li>in operator such as <code>'prop in testObject'</code></li>
 *  <li>Increment/decrement operators such as <code>'x++'</code> or <code>'x--'</code></li>
 *  <li>Inline regular expressions such as <code>'testString.match(/abc/i)'</code></li>
 *  <li>Instanceof or typeof operators such as <code>'date instanceof Date'</code></li>
 *  <li>Nullish coalescing operator (??) such as <code>'value ?? "default value"'</code></li>
 *  <li>Spread operator (...) such as <code>'sum(...arrayValue)'</code></li>
 * <ul>
 * </h2>
 *
 * @param {Object} options
 * @param {any=} options.globalScope optional additional scope required for evaluating expressions.
 * The additional scope will be used to resolve the variables if they are not defined in the $data or $context.
 * <pre class="prettyprint"><code>Config.setExpressionEvaluator(new CspExpressionEvaluator({globalScope:extraScope}));</code></pre>
 * @constructor
 * @final
 * @export
 */
// eslint-disable-next-line no-unused-vars
const CspExpressionEvaluator = function (options) {
  var _parser = new ExpParser();
  var _options = Object.assign({}, options);
  if (!(_options.globalScope && _options.globalScope.Object)) {
    _options.globalScope = Object.assign({ Object: Object }, _options.globalScope);
  }

  /**
   * Creates expression evaluator
   * @param {string} expressionText expression associated  with the returned evaluator
   * @return {Object} an object with the 'evaluate' key referencing a function that
   * will return the result of evaluation. The function will take an array of scoping contexts ordered from the
   * most specific to the least specific
   * @ignore
   */
  this.createEvaluator = function (expressionText) {
    var parsed;
    try {
      parsed = _parser.parse(expressionText);
    } catch (e) {
      _throwErrorWithExpression(e, expressionText);
    }
    var extraScope = _options.globalScope;
    return { evaluate: function (contexts) {
      var ret;
      var scopes = contexts;
      if (extraScope) {
        scopes = contexts.concat([extraScope]);
      }
      try {
        ret = _evaluate(parsed, scopes);
      } catch (e) {
        _throwErrorWithExpression(e, expressionText);
      }
      return ret;
    } };
  };

  /**
   * @param {object} ast an AST node
   * @param {object} context a context object to apply on expressions
   * @ignore
   */
  this.evaluate = function (ast, context) {
    return _evaluate(ast, [context]);
  };

  // Note, for logical && and || operators the right hand expression
  // is always a callback. It is done to ensure that the right hand
  // expression is evaluated only if it is needed and only after
  // left hand expression is evaluated.
  var _binops = {
    '||': function (a, b) { return a || b(); },
    '&&': function (a, b) { return a && b(); },
    '|': function (a, b) { return a | b; },
    '^': function (a, b) { return a ^ b; },
    '&': function (a, b) { return a & b; },
    '==': function (a, b) { return a == b; },
    '!=': function (a, b) { return a != b; },
    '===': function (a, b) { return a === b; },
    '!==': function (a, b) { return a !== b; },
    '<': function (a, b) { return a < b; },
    '>': function (a, b) { return a > b; },
    '<=': function (a, b) { return a <= b; },
    '>=': function (a, b) { return a >= b; },
    '<<': function (a, b) { return a << b; },
    '>>': function (a, b) { return a >> b; },
    '>>>': function (a, b) { return a >>> b; },
    '+': function (a, b) { return a + b; },
    '-': function (a, b) { return a - b; },
    '*': function (a, b) { return a * b; },
    '/': function (a, b) { return a / b; },
    '%': function (a, b) { return a % b; }
  };

  var _unops = {
    '-': function (a) { return -a; },
    '+': function (a) { return a; },
    '~': function (a) { return ~a; },
    '!': function (a) { return !a; },
    '...': function (a) { return new _Spread(a); },
  };

  function _Spread(list) {
    this.items = function () {
      return list;
    };
  }

  // eslint-disable-next-line consistent-return
  function _evaluate(node, contexts) {
    switch (node.type) {
      case 1: // Identifier
        return _getValue(contexts, node.name);

      case 2: // 'MemberExpression'
        return _evaluateMember(node, contexts)[1];

      case 3: // 'Literal'
        return node.value;

      case 4: // 'CallExpression'
        var caller;
        var fn;
        var assign;
        switch (node.callee.type) {
          case 1: // Identifier
            assign = _getValueWithContext(contexts, node.callee.name);
            break;
          case 2: // 'MemberExpression'
            assign = _evaluateMember(node.callee, contexts);
            break;
          default:
            fn = _evaluate(node.callee, contexts);
        }
        if (!fn && Array.isArray(assign)) {
          caller = assign[0];
          fn = assign[1];
        }
        if (typeof fn !== 'function') {
          _throwError('Expression is not a function');
        }
        return fn.apply(caller, _evaluateArray(node.arguments, contexts));

      case 5: // 'UnaryExpression'
        return _unops[node.operator](_evaluate(node.argument, contexts));

      case 6: // 'BinaryExpression'
        if (node.operator === '=') {
          return _evaluateAssignment(node.left, contexts,
            _evaluate(node.right, contexts));
        }
        return _binops[node.operator](_evaluate(node.left, contexts),
          _evaluate(node.right, contexts));

      case 7: // 'LogicalExpression':
        return _binops[node.operator](_evaluate(node.left, contexts),
            function () { return _evaluate(node.right, contexts); });

      case 8: // 'ConditionalExpression'
        return _evaluate(node.test, contexts)
          ? _evaluate(node.consequent, contexts)
          : _evaluate(node.alternate, contexts);

      case 9: // 'ArrayExpression'
        return _evaluateArray(node.elements, contexts);

      case 10: // 'ObjectExpression'
        return _evaluateObjectExpression(node, contexts);

      case 11: // 'FunctionExpression'
        return _evaluateFunctionExpression(node, contexts);

      case 12: // 'ConstructorExpression'
        return _evaluateConstructorExpression(node, contexts);

      default:
        throw new Error('Unsupported expression type: ' + node.type);
    }
  }

  function _evaluateArray(list, contexts) {
    return list.reduce(
      (acc, v) => {
        const elem = _evaluate(v, contexts);
        if (elem instanceof _Spread) {
          acc.push(...elem.items());
        } else {
          acc.push(elem);
        }
        return acc;
      }, []);
  }

  function _evaluateMember(node, contexts) {
    var object = _evaluate(node.object, contexts);
    if (!object && node.conditional) {
      // handle conditional chaining operator: test?.prop
      return [];
    } else if (node.computed) {
      return [object, object[_evaluate(node.property, contexts)]];
    }
    return [object, object[node.property.name]];
  }

  function _evaluateObjectExpression(node, contexts) {
    return node.properties.reduce(
      function (acc, curr) {
        acc[curr.key] = _evaluate(curr.value, contexts);
        return acc;
      },
      {}
    );
  }

  // eslint-disable-next-line consistent-return
  function _getValue(contexts, name) {
    var target = _getContextForIdentifier(contexts, name);
    if (target) {
      return target[name];
    }
    throw new Error('Variable ' + name + ' is undefined');
  }

  // eslint-disable-next-line consistent-return
  function _getValueWithContext(contexts, name) {
    var target = _getContextForIdentifier(contexts, name);
    if (target) {
      return [target, target[name]];
    }
    throw new Error('Variable ' + name + ' is undefined');
  }

  function _evaluateAssignment(node, contexts, val) {
    switch (node.type) {
      case 1: // 'Identifier'
        var name = node.name;
        var target = _getContextForIdentifier(contexts, name);
        if (!target) {
          _throwError('Cannot assign value to undefined variable ' + name);
        }
        target[name] = val;
        break;
      case 2: // 'MemberExpression'
        var key = node.computed ?
          _evaluate(node.property, contexts) : node.property.name;
        _evaluateMember(node, contexts)[0][key] = val;
        break;
      default:
        _throwError('Expression of type: ' + node.type +
          ' not supported for assignment');
    }
    return val;
  }

  function _evaluateFunctionExpression(node, contexts) {
    // eslint-disable-next-line consistent-return
    return function () {
      var _args = arguments;

      var argScope = node.arguments.reduce(
        function (acc, arg, i) {
          acc[arg.name] = _args[i];
          return acc;
        }, {}
      );

      // eslint-disable-next-line dot-notation
      argScope['this'] = this;

      try {
        var val = _evaluate(node.body, [argScope].concat(contexts));

        if (node.return) {
          return val;
        }
      } catch (e) {
        _throwErrorWithExpression(e, node.expr);
      }
    };
  }

  function _evaluateConstructorExpression(node, contexts) {
    var constrObj = _evaluate(node.callee, contexts);
    if (!(constrObj instanceof Function)) {
      _throwError('Node of type ' + node.callee.type + ' is not evaluated into a constructor');
    }

    // eslint-disable-next-line new-parens
    return new (Function.prototype.bind.apply(constrObj,
      [null].concat(_evaluateArray(node.arguments, contexts))));
  }

  function _getContextForIdentifier(contexts, name) {
    for (var i = 0; i < contexts.length; i++) {
      var context = contexts[i];
      if (context instanceof Object && name in context) {
        return context;
      }
    }
    return null;
  }

  function _throwError(message) {
    throw new Error(message);
  }
  function _throwErrorWithExpression(e, expression) {
    throw new Error(e.message + ' in expression "' + expression + '"');
  }
};

export default CspExpressionEvaluator;
