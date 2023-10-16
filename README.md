# defer47
defer in javascript (first in last out)


```ruby
[Invoker] INIT
    [Fugazi] 1230 Helloworld -normal scope-
    [Fugazi] 1230 [DEFER] World. -2-
    [Fugazi] 1230 [DEFER] Hello, -1-
 [Invoker] Dragon or knight make up your mind! -normal scope-
    [Fugazi] 9876 Helloworld -normal scope-
    [Fugazi] 9876 [DEFER] World. -2-
    [Fugazi] 9876 [DEFER] Hello, -1-
[Invoker] EXIT
[Invoker] Defer #1
```

```javascript

function Fugazi(a) {

	defer47.fn(function () {
		console.log("   [Fugazi][DEFER] Hello, -1-");
	});

	defer47.fn(function () {
		console.log("   [Fugazi][DEFER] World. -2-");
	});

	console.log("   [Fugazi] Helloworld -normal scope-");
}


function Invoker() {
	console.log("[Invoker] INIT")

	Fugazi(1230);

	defer47.fn(function () {
		console.log("[Invoker] Defer #1");
	});

	console.log("[Invoker] Dragon or knight make up your mind! -normal scope-");

	Fugazi(1230);

	console.log("[Invoker] EXIT");
	return
}

Invoker();
```


