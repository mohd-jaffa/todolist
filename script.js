let todoItems = [];

function renderTodo(todo) {

  localStorage.setItem('todoItems', JSON.stringify(todoItems));

  const list = document.querySelector('.js-todo-list');
  const item = document.querySelector(`[data-key='${todo.id}']`);


  if (todo.deleted) {
    if (item) {
      item.remove();
    }
    if (todoItems.length === 0) list.innerHTML = '';
    return;
  }


  const isChecked = todo.checked ? 'done' : '';
  const node = document.createElement('li');
  node.setAttribute('class', `todo-item list-group-item ${isChecked}`);
  node.setAttribute('data-key', todo.id);


  node.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div class="form-check">
        <input id="${todo.id}" type="checkbox" class="form-check-input js-tick" ${todo.checked ? 'checked' : ''}>
        <label for="${todo.id}" class="form-check-label">${todo.text}</label>
      </div>
      <button class="btn btn-sm delete-todo js-delete-todo">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M21 5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5zm-4.793 9.793-1.414 1.414L12 13.414l-2.793 2.793-1.414-1.414L10.586 12 7.793 9.207l1.414-1.414L12 10.586l2.793-2.793 1.414 1.414L13.414 12l2.793 2.793z"></path></svg>
      </button>
    </div>
  `;


  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}


function addTodo(text) {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };
  todoItems.push(todo);
  renderTodo(todo);
}


function toggleDone(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  todoItems[index].checked = !todoItems[index].checked;
  renderTodo(todoItems[index]);
}


function deleteTodo(key) {
  const index = todoItems.findIndex(item => item.id === Number(key));
  const todo = {
    deleted: true,
    ...todoItems[index]
  };
  todoItems = todoItems.filter(item => item.id !== Number(key));
  renderTodo(todo);
}


const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('.js-todo-input');
  const text = input.value.trim();
  if (text !== '') {
    addTodo(text);
    input.value = '';
    input.focus();
  }
});


const list = document.querySelector('.js-todo-list');
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.closest('.todo-item').dataset.key;
    toggleDone(itemKey);
  }

  if (event.target.closest('.js-delete-todo')) {
    const itemKey = event.target.closest('.todo-item').dataset.key;
    deleteTodo(itemKey);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItems');
  if (ref) {
    todoItems = JSON.parse(ref);
    todoItems.forEach(t => {
      renderTodo(t);
    });
  }
});
