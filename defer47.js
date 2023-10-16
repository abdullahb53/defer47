		const defer47 = {
			"deferred": function (a) {
				let callerName = CatchFunctionName(a);
				if (callerName == "") {
					return;
				}
				// Golang "defer" style "LIFO".
				for (let i = 0; i < defer47.storage.length; i++) {
					if (defer47.storage[i].funcName == callerName) {
						for (let j = defer47.storage[i].functions.length - 1; j >= 0; j--) {
							if (defer47.storage[i].functions[j] != null) {
								defer47.storage[i].functions[j]();
								defer47.storage[i].functions[j] = null;
							}
						}
						break;
					}
				}
			},
			"storage": [],
			"fn": function (incomingFn) {
				let callerName = CatchFunctionName(incomingFn);
				if (callerName == "") {
					return;
				}
				let existFlag = false;
				let existIdx = -1;
				// Is this a new function or not?
				for (let i = 0; i < defer47.storage.length; i++) {
					if (defer47.storage[i].funcName == callerName) {
						existFlag = true;
						existIdx = i;
						break;
					}
				}
				if (existFlag == true) {
					defer47.storage[existIdx].functions.push(incomingFn);

				} else {
					defer47.storage.push({
						functions: [incomingFn],
						funcName: callerName,
					});
				}
			}
		}


		var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
		var ARGUMENT_NAMES = /([^\s,]+)/g;
		function getParamNames(func) {
			var fnStr = func.toString().replace(STRIP_COMMENTS, '');
			var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
			if (result === null)
				result = [];
			return result;
		}

		function getBody(fn) {
			let entire = fn.toString();
			let body = entire.slice(entire.indexOf("{") + 1, entire.lastIndexOf("}"));
			return body;
		}


		function AdjustParamsStr(paramArr) {
			let res = "";
			for (let i = 0; i < paramArr.length; i++) {
				res = res + paramArr[i].toString() + ",";
			}
			return res.slice(0, -1);
		}


		// Catch corresponding function names.
		function CatchFunctionName(pprop) {
			let funcName = "";

			// Regular expression to match the funcName pattern
			const regex = /\/\*\s*funcName:\s*([^*]+)\s*\*\//;

			// Use the regular expression to find the funcName
			const match = pprop.toString().match(regex);
			if (match) {
				funcName = match[1].trim();
			} else {
				return;
			}
			return funcName;
		}

		// Inject new code parts to existed functions.
		function InjectionFn(injectDeferred, funcName, fn) {
			let functionString = fn.toString();
			let AllParamaters = getParamNames(fn);
			let paramsToSet = AdjustParamsStr(AllParamaters);

			let positionToInject = functionString.lastIndexOf("}");
			// If the function doesn't have return statement.
			functionString = functionString.slice(0, positionToInject) + injectDeferred + functionString.slice(positionToInject);
			let trimmedFuncString = functionString.replace(/(function\s+\w+\s*\([\s\S]*?\)\s*\{([\s\S]*)\})|(const\s+\w+\s*=\s*(\([\s\S]*?\)\s*=>|function\s*\([\s\S]*?\))\s*\{([\s\S]*)\};)/g, '$2$4');

			// Regular expression to capture defer47.fn( and });
			const combinedRegex = /defer47\.fn\([\s\S]*?\}\);/g;
			const modifiedCode = trimmedFuncString.replace(combinedRegex, (match) => {
				return match.replace('});', funcName + '\n    });');
			});

			// Regular expression to match return statements
			const returnRegex = /return\s+[^;]*;/g;
			var modifiedCode2 = modifiedCode.replace(returnRegex, (match) => {
				return injectDeferred + ';\n' + match;
			});

			modifiedCode2 = modifiedCode2.replace("async", "");
			var modifiedFunction = new Function(paramsToSet, modifiedCode2);
			return modifiedFunction;
		}

		// Regulate the whole possible functions with funcName hint.
		var allProps = [];
		for (var prop in window) {
			if (typeof window[prop] === 'function') {
				if (window[prop].toString().includes("[native code]", 0)
					|| prop == "InjectionFn"
					|| prop == "removeDuplicates"
					|| prop == "CatchFunctionName"
					|| prop == "getCallerName") { continue };
				allProps.push(window[prop]);
				let strProp1 = `defer47.deferred(${prop});`;
				let strProp2 = `/* funcName: ${prop} */`;
				var newFn = InjectionFn(strProp1, strProp2, window[prop]);
				window[prop] = newFn;
			}
		}
		
		export default defer47;


