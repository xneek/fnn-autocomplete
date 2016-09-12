class fnnAutocomplete {
	_open (){
		
	}
	_close(){
		this.results.innerHTML = null;
	}
	clear (){
		this.selected = true;
		this.input.value = "";
		this.input.focus();
		if(this.closeBtn){
			this.closeBtn.classList.remove('active');
		}
		
		if(this.opts.source && typeof this.opts.source === 'function'){
			this.opts.data = [];
		}
		
	}
	
	select (data){
		
		this._close();
		this.selected = true;
		this.input.blur()
		if(this.closeBtn){
			this.closeBtn.classList.add('active');
		}
		if(typeof this.opts.onSelect == 'function'){
			this.opts.onSelect(data);
		}
		
	}
	
	render (data){
		let th = this;
		let name = data;
		
	
		if(this.opts.key && this.opts.key.length){
			name = data[this.opts.key];
		}
		let el =  crEl('li', name)
		if(this.opts.render){
			el = this.opts.render(data);
		}
		
		el.addEventListener('click', function(){
			th.input.value = name;
			th.select(data);
		})
		
		el.addEventListener('mousemove', function(){
			this.parentNode.querySelectorAll('.active').forEach((k)=>{
				k.classList.remove('active')
			})
			this.classList.add('active')
		}, false)

		


		return el;
	}
	
	_search (term){
		let th = this;
		th.selected = false;
		this.results.innerHTML = null;
		let s = 0;
		if(this.opts.data && this.opts.data.length){
			this.opts.data.forEach(function(k){
				let res = k;
				if(th.opts.key && th.opts.key.length){
					res = k[th.opts.key];
				}
				if( (th.opts.limit && th.opts.limit>0 && th.opts.limit>s) && (term=='%' || res.toLowerCase().indexOf(term.toLowerCase().trim())!=-1)){
					let li = th.render(k)
					if(th.opts.autoSelect && s==0){li.classList.add('active')}
					th.results.appendChild(li);
					s++;
				}
			})
			
			if(s==0){
				if(typeof this.opts.noFound === 'function'){
					this.results.appendChild(this.opts.noFound(term))
				} else {
					this.results.appendChild(this.opts.noFound)
				}
			}
		} else {
				if(typeof this.opts.noFound === 'function'){
					this.results.appendChild(this.opts.noFound(term))
				} else {
					this.results.appendChild(this.opts.noFound)
				}
		}
	}
	
	search (str){
	let th = this;
		if(!(this.opts.chache && this.opts.data.length>0 ) && this.opts.source && typeof this.opts.source === 'function'){
			if(this.opts.loader){this.loader.classList.add('active')}
			this.opts.source(str, function(res){
				if(th.opts.loader){th.loader.classList.remove('active')}
				th.opts.data = res;
				th._search(str);
			})
		} else {
			th._search(str);
		}
	}
	constructor(input, opts={}){
		let th = this;
		this.opts = Object.assign({
			key: '',
			timeout:50,
			data:[],
			chache: true,
			autoSelect: true,
			autoOpen:true,
			menuClass:'',
			minLength:0,
			loader: false,
			closeBtn: true,
			limit:3,
			noFound: crEl('li','Не найдено')
		},opts);
		
	
		
		let container = crEl('div',{c:'fnn-autocomplete-container'});
		input.parentNode.insertBefore(container, input);
		input = input.parentElement.removeChild(input);
		if(!input.classList.contains('fnn-autocomplete')){input.classList.add('fnn-autocomplete');}
		container.appendChild(input);
		if(this.opts.closeBtn != false){
			this.closeBtn = crEl('button',{c:'fnn-autocomplete-close', e: {click:function(){
				th.clear();
			}}}, '×');
			container.appendChild(this.closeBtn);
		}
		if(this.opts.loader!= false){
			this.loader = crEl('div',{c:'fnn-autocomplete-loader'}, crEl('div',{c:'fnn-autocomplete-loader-pct'}));
			container.appendChild(this.loader);
		}
		this.results = crEl('ul',{c:'fnn-autocomplete-results'});
		container.appendChild(this.results);
		
		let _t = null;
		
		input.addEventListener('input',function(){

			let str = this.value.trim();
			if(str.length<=th.opts.minLength && th.opts.source && typeof th.opts.source === 'function'){
				th.opts.data = [];
			}
			
			if(str.length>th.opts.minLength){
				if(_t){ clearTimeout(_t) }
				_t = setTimeout(function(){
					th.search(str);
				}, th.opts.timeout)
			}
		}, false)
		  
		  
		input.addEventListener('focus',function(){
			if(th.selected){
				this.select();
				this.focus()
			}
			
			if(th.opts.autoOpen){
				th.search('%')
			}
			
		}, false)		  
		  
		input.addEventListener('blur',function(){
			setTimeout(function(){ th._close();},500)
		}, false)			  
		  
		input.addEventListener('keydown', function(event){
			if(event.keyCode===13){
			  if(th.results.querySelector('.active')){
				th.results.querySelector('.active').click();
			  } else {
				el = th.results.childNodes[0];
				if(el){ el.click()}
			  }
			} else if(event.keyCode===38){ //up
			   event.preventDefault();
				let active = th.results.querySelector('.active');
				if(active){
				  if(active.previousSibling){
					active.classList.remove('active')
					active.previousSibling.classList.add('active')
				  } else {
					active.classList.remove('active')
					th.results.childNodes[th.results.childNodes.length-1].classList.add('active')
				  }
				} else {
				  th.results.childNodes[th.results.childNodes.length-1].classList.add('active')
				}
			  return;
			} else if(event.keyCode===40){//down
			  event.preventDefault();
			  if(th.results.childNodes.length>0){
				let active = th.results.querySelector('.active');
				if(active){
				  if(active.nextSibling){
					active.classList.remove('active')
					active.nextSibling.classList.add('active')
				  } else {
					active.classList.remove('active')
					th.results.childNodes[0].classList.add('active')
				  }
				}else {
				
				 th.results.childNodes[0].classList.add('active')
				}
			  }
			  return;
			}
		  })
		
		
		th.input = input;
		return th;
	};
}