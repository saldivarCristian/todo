const channel = new BroadcastChannel("notification");

window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	toogleFullScreen.addEventListener('click', (target) =>{
		createTodo.style.display =   (createTodo.style.display == 'none') ?  'block' :  'none'
	})

	category4.addEventListener('click', (target) =>{
		const display =  (category4.checked) ?  'flex' :  'none'
		paragraph = document.querySelectorAll(".item-personal");
		// console.log( paragraph )
		if(paragraph){
			paragraph.forEach((ele)=>{
				ele.style.display = display;
			})
		}
		// var elements = document.getElementsByClassName('item-personal');
		// elements.hide();
		// console.log(elements)
		// document.getElementById('todo-list').classList.add('is-visible');

	})

	category3.addEventListener('click', (target) =>{
		const display =  (category3.checked) ?  'flex' :  'none'
		
		paragraph = document.querySelectorAll(".item-business");
		// console.log( paragraph )
		if(paragraph){
			paragraph.forEach((ele)=>{
				ele.style.display = display;
			})
		}
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();
		if( e.target.elements.content.value == "" || e.target.elements.date.value == "" || e.target.elements.category.value == ""  ){
			alert('Complete todos los campos')
			return
		}
		const todo = {
			content: e.target.elements.content.value,
			date: e.target.elements.date.value,
			category: e.target.elements.category.value,
			done: false,
			notification:false,
			createdAt: new Date().getTime()
		}
		console.log(todo)
		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));
		// del(1);
		add(todo);


		// Reset the form
		e.target.reset();

		DisplayTodos()
	})

	DisplayTodos()
	
})

function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		span.classList.add('bubble');
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
			todoItem.classList.add('item-personal');
		} else {
			span.classList.add('business');
			todoItem.classList.add('item-business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		edit.style.display='none'
		deleteButton.classList.add('delete');
		deleteButton.dataset.id =todo.createdAt;

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>  <b> Fecha: ${todo.date}</b>`;
		edit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
		// deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
		deleteButton.innerHTML = "Eliminar";

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			console.log(e.target)
			todos = todos.filter(t => t != todo);
			deleteItem(e.target.dataset.id)
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}




// Notification.requestPermission().then(function(result) {
// 	console.log(result);
//   });

// var headers = new Headers();
// headers.append('Service-Worker-Allowed', '/colegioLaAurora/');

/* Notification service worker check */
const check = () => {
	if (!("serviceWorker" in navigator)) {
	  throw new Error("No Service Worker support!");
	}
	if (!("PushManager" in window)) {
	  throw new Error("No Push API Support!");
	}
  };
  
  const registerServiceWorker = async () => {
	const swUrl = `sw.js`;
	console.log("swUrl", swUrl);
  
	const swRegistration = await navigator.serviceWorker.register(swUrl, {
	  scope: "/"
	});
	return swRegistration;
  };
  


  const requestNotificationPermission = async () => {
	//const permission = await window.Notification.requestPermission();
  
	Notification.requestPermission(status => {
	  console.log("Notification permission status:", status);
	});
  
	// value of permission can be 'granted', 'default', 'denied'
	// granted: user has accepted the request
	// default: user has dismissed the notification permission popup by clicking on x
	// denied: user has denied the request.
  
	// if (permission !== "granted") {
	//   throw new Error("Permission not granted for Notification");
	// }
  };
  

  const main = async () => {
	check();
	const swRegistration = await registerServiceWorker();
	const permission = await requestNotificationPermission();
  
	console.log("swReg", swRegistration);
  
	if (Notification.permission == "granted") {
	  navigator.serviceWorker.getRegistration("/").then(reg => {
		console.log("About to show notification", reg);
	//	reg.showNotification("Hello world!");
	  });
  
	  // navigator.serviceWorker.ready.then(function(reg) {
	  //   new Notification("Helo");
	  // });
	}
  };
  
  main();
  
  (()=>{

// console.log('inicio canal')
	channel.addEventListener("message", (event) => {
		// console.log(event)
		todos = JSON.parse(localStorage.getItem('todos')) || [];
		console.log(todos)
		if( todos.length ){
			 // Grab the current time and date
			//  const now = new Date();

			 let now = new Date().getTime();

			for (const key in todos) {
				const element = todos[key];
				const notification = element.notification
				const content = element.content
				let dateOld = new Date(element.date).getTime();
				console.log(dateOld+' < '+ now+' && '+ !notification)
				if (dateOld < now && !notification) {
					todos[key].notification = true
					localStorage.setItem('todos', JSON.stringify(todos));
					channel.postMessage( {status:'true',message:'Tiene una tarea vencida: '+content } );
					Swal.fire({
						position: 'top-end',
						icon: 'warning',
						title: 'Tiene una tarea vencida: '+content,
						showConfirmButton: false,
						timer: 3500
					  })

				}

			}
		}

		console.log("Received", event.data);

		// const audio = new Audio('hello.mp3');
		// audio.play();
	});
})()	
  
	

  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
//   serviceWorker.unregister();