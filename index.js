class Route {
	constructor(strings, matchers) {
		this.strings = strings;
		this.matchers = matchers;
	}

	match(target) {
		return this.exec(target);
	}

	exec(target) {
		const values = [];
		const matchers = this.matchers;
		const strings = this.strings;

		for(let ix = 0; ix < matchers.length; ix ++) {
			const string = strings[ix];
			if(target.indexOf(string) !== 0) {
					return null;
			}

			target = target.slice(string.length);

			const matcher = matchers[ix];
			const match = matcher.exec ? matcher.exec(target) : matcher(target);
			if(!match) {
					return null;
			}

			target = target.slice(match[0].length);
			values.push(1 in match ? match[1] : match[0]);
		}

		if(target !== strings[matchers.length]) {
				return null;
		}

		return values;
	}

	compile(values){
		// Todo: type check on values?
		// call matchers.compile(values[ix-1]) or return values[ix-1] if it doesn't exist
		return this.strings.reduce((a, s, ix) => `${a}${values[ix-1]}${s}`);
	}

	static tag(strings, ...matchers) {
		return new this(strings, matchers);
	}
}

const route = tag.bind(Route);

var a = route`test/${/a+/}/`;
console.log(a.match('test/aaa'));
console.log(a.compile(['bbb']))

// Todo: add typed matchers
const m = new Map([
	[route`/`, 'Index'],
	[route`/hello`, 'Hello!'],
	[route`/hello/${/paul/}`, 'Hello!'],
	[route`/bye${/\/paul|/}`, 'Bye!'],
	[route`/test/${num}`],
	[route`/test/${str}`]
]);

// Todo: named groups:

route`/test/${num('id')}` // r.match(url).id;
route`/test/${/(?<username>@[a-z]+)/}` // r.match(url).username;
// r.compile({ username: 'xyz' });

m.find(key => key.exec('/hello/paul'));


const multiRoot = {
	match(target) {
		routes.find(r => r.match(target));
	},
	compile(values) {
		// If matcher has a .compile method, call it
		routes.find(r => r.compile(values));
	}
}
