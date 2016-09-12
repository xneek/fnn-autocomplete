'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fnnAutocomplete = function () {
	_createClass(fnnAutocomplete, [{
		key: '_open',
		value: function _open() {}
	}, {
		key: '_close',
		value: function _close() {
			this.results.innerHTML = null;
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.selected = true;
			this.input.value = "";
			this.input.focus();
			if (this.closeBtn) {
				this.closeBtn.classList.remove('active');
			}

			if (this.opts.source && typeof this.opts.source === 'function') {
				this.opts.data = [];
			}
		}
	}, {
		key: 'select',
		value: function select(data) {

			this._close();
			this.selected = true;
			this.input.blur();
			if (this.closeBtn) {
				this.closeBtn.classList.add('active');
			}
			if (typeof this.opts.onSelect == 'function') {
				this.opts.onSelect(data);
			}
		}
	}, {
		key: 'render',
		value: function render(data) {
			var th = this;
			var name = data;

			if (this.opts.key && this.opts.key.length) {
				name = data[this.opts.key];
			}
			var el = crEl('li', name);
			if (this.opts.render) {
				el = this.opts.render(data);
			}

			el.addEventListener('click', function () {
				th.input.value = name;
				th.select(data);
			});

			return el;
		}
	}, {
		key: '_search',
		value: function _search(term) {
			var th = this;
			th.selected = false;
			this.results.innerHTML = null;
			var s = 0;
			if (this.opts.data && this.opts.data.length) {
				this.opts.data.forEach(function (k) {
					var res = k;
					if (th.opts.key && th.opts.key.length) {
						res = k[th.opts.key];
					}
					if (th.opts.limit && th.opts.limit > 0 && th.opts.limit > s && (term == '%' || res.toLowerCase().indexOf(term.toLowerCase().trim()) != -1)) {
						var li = th.render(k);
						if (th.opts.autoSelect && s == 0) {
							li.classList.add('active');
						}
						th.results.appendChild(li);
						s++;
					}
				});

				if (s == 0) {
					this.results.appendChild(crEl('li', this.opts.noFound));
				}
			} else {
				this.results.appendChild(crEl('li', this.opts.noFound));
			}
		}
	}, {
		key: 'search',
		value: function search(str) {
			var th = this;
			if (!(this.opts.chache && this.opts.data.length > 0) && this.opts.source && typeof this.opts.source === 'function') {
				if (this.opts.loader) {
					this.loader.classList.add('active');
				}
				this.opts.source(str, function (res) {
					if (th.opts.loader) {
						th.loader.classList.remove('active');
					}
					th.opts.data = res;
					th._search(str);
				});
			} else {
				th._search(str);
			}
		}
	}]);

	function fnnAutocomplete(input) {
		var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

		_classCallCheck(this, fnnAutocomplete);

		var th = this;
		this.opts = Object.assign({
			key: '',
			timeout: 50,
			data: [],
			chache: true,
			autoSelect: true,
			autoOpen: true,
			menuClass: '',
			minLength: 0,
			loader: false,
			closeBtn: true,
			limit: 3,
			noFound: 'Не найдено'
		}, opts);

		var container = crEl('div', { c: 'fnn-autocomplete-container' });
		input.parentNode.insertBefore(container, input);
		input = input.parentElement.removeChild(input);
		if (!input.classList.contains('fnn-autocomplete')) {
			input.classList.add('fnn-autocomplete');
		}
		container.appendChild(input);
		if (this.opts.closeBtn != false) {
			this.closeBtn = crEl('button', { c: 'fnn-autocomplete-close', e: { click: function click() {
						th.clear();
					} } }, '×');
			container.appendChild(this.closeBtn);
		}
		if (this.opts.loader != false) {
			this.loader = crEl('div', { c: 'fnn-autocomplete-loader' }, crEl('div', { c: 'fnn-autocomplete-loader-pct' }));
			container.appendChild(this.loader);
		}
		this.results = crEl('ul', { c: 'fnn-autocomplete-results' });
		container.appendChild(this.results);

		var _t = null;

		input.addEventListener('input', function () {

			var str = this.value.trim();
			if (str.length <= th.opts.minLength && th.opts.source && typeof th.opts.source === 'function') {
				this.opts.data = [];
			}

			if (str.length > th.opts.minLength) {
				if (_t) {
					clearTimeout(_t);
				}
				_t = setTimeout(function () {
					th.search(str);
				}, th.opts.timeout);
			}
		}, false);

		input.addEventListener('focus', function () {
			if (th.selected) {
				this.select();
				this.focus();
			}

			if (th.opts.autoOpen) {
				th.search('%');
			}
		}, false);

		input.addEventListener('keydown', function (event) {
			if (event.keyCode === 13) {
				if (th.results.querySelector('.active')) {
					th.results.querySelector('.active').click();
				} else {
					el = th.results.childNodes[0];
					if (el) {
						el.click();
					}
				}
			} else if (event.keyCode === 38) {
				//up
				event.preventDefault();
				var active = th.results.querySelector('.active');
				if (active) {
					if (active.previousSibling) {
						active.classList.remove('active');
						active.previousSibling.classList.add('active');
					} else {
						active.classList.remove('active');
						th.results.childNodes[th.results.childNodes.length - 1].classList.add('active');
					}
				} else {
					th.results.childNodes[th.results.childNodes.length - 1].classList.add('active');
				}
				return;
			} else if (event.keyCode === 40) {
				//down
				event.preventDefault();
				if (th.results.childNodes.length > 0) {
					var _active = th.results.querySelector('.active');
					if (_active) {
						if (_active.nextSibling) {
							_active.classList.remove('active');
							_active.nextSibling.classList.add('active');
						} else {
							_active.classList.remove('active');
							th.results.childNodes[0].classList.add('active');
						}
					} else {

						th.results.childNodes[0].classList.add('active');
					}
				}
				return;
			}
		});

		th.input = input;
		return th;
	}

	return fnnAutocomplete;
}();