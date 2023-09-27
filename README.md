# defer47
defer in javascript (first in last out)


```ruby
[PhantomAssasin] INIT
[PhantomAssasin] EXIT
Phantom Defer 3
Phantom Defer 2
Phantom Defer 1
[Invoker] INIT
[Invoker] EXIT
Invoker Defer 2
Invoker Defer 1
```

```javascript

		function PhantomAssasin() {
			console.log("[PhantomAssasin] INIT");

			defer47.fn(function () {
				console.log("Phantom Defer 1");
			});


			defer47.fn(function () {
				console.log("Phantom Defer 2");
			});


			defer47.fn(function () {
				console.log("Phantom Defer 3");
			});

			console.log("[PhantomAssasin] EXIT");
			return
		}

		function Invoker() {
			console.log("[Invoker] INIT");

			defer47.fn(function () {
				console.log("Invoker Defer 1");
			});


			defer47.fn(function () {
				console.log("Invoker Defer 2");
			});

			console.log("[Invoker] EXIT");
			return
		}

		PhantomAssasin();
		Invoker();
```


