// Данные приоритетов (можно изменить)
const priorities = [
  { id: 6, text: "понимать что происходит" },
  { id: 7, text: "новых гениальных идей" },
  { id: 8, text: "спасти этот мир, и чтобы никто не ушел обиженным" },
  { id: 5, text: "свободы и самостоятельности" },
  { id: 1, text: "удовольствия и комфорта" },
  { id: 2, text: "быть среди своих" },
  { id: 3, text: "победить, быть первым" },
  { id: 4, text: "справедливости и порядка" }
];

let draggedElement = null;
let draggedIndex = null;

document.addEventListener('DOMContentLoaded', function() {
  const prioritiesList = document.getElementById('priorities-list');
  const saveButton = document.getElementById('save-button');
  
  // Инициализация списка приоритетов
  function renderPriorities() {
    prioritiesList.innerHTML = '';
    priorities.forEach((priority, index) => {
      const item = createPriorityItem(priority, index);
      prioritiesList.appendChild(item);
    });
  }
  
  // Создание элемента приоритета
  function createPriorityItem(priority, index) {
    const item = document.createElement('div');
    item.className = 'priority-item';
    item.draggable = true;
    item.dataset.index = index;
    item.dataset.id = priority.id;
    
    item.innerHTML = `
      <div class="priority-number">${index + 1}</div>
      <div class="priority-text">${priority.text}</div>
      <div class="drag-handle">⋮⋮</div>
    `;
    
    // Обработчики событий drag and drop
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
    
    return item;
  }
  
  // Обработчик начала перетаскивания
  function handleDragStart(e) {
    draggedElement = this;
    draggedIndex = parseInt(this.dataset.index);
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
  }
  
  // Обработчик окончания перетаскивания
  function handleDragEnd(e) {
    this.classList.remove('dragging');
    
    // Убираем класс drag-over со всех элементов
    document.querySelectorAll('.priority-item').forEach(item => {
      item.classList.remove('drag-over');
    });
  }
  
  // Обработчик наведения при перетаскивании
  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
  }
  
  // Обработчик входа в зону перетаскивания
  function handleDragEnter(e) {
    if (this !== draggedElement) {
      this.classList.add('drag-over');
    }
  }
  
  // Обработчик выхода из зоны перетаскивания
  function handleDragLeave(e) {
    this.classList.remove('drag-over');
  }
  
  // Обработчик отпускания элемента
  function handleDrop(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    
    if (draggedElement !== this) {
      const dropIndex = parseInt(this.dataset.index);
      
      // Перемещаем элемент в массиве
      const draggedPriority = priorities[draggedIndex];
      priorities.splice(draggedIndex, 1);
      priorities.splice(dropIndex, 0, draggedPriority);
      
      // Перерисовываем список
      renderPriorities();
    }
    
    this.classList.remove('drag-over');
    return false;
  }
  
  // Обработчик сохранения порядка
  saveButton.addEventListener('click', function() {
    const order = priorities.map((p, index) => ({
      position: index + 1,
      id: p.id,
      text: p.text
    }));
    
    console.log('Порядок приоритетов:', order);
    alert('Порядок приоритетов сохранен!\n\n' + 
          order.map((item, index) => `${index + 1}. ${item.text}`).join('\n'));
    
    // Здесь можно отправить данные на сервер
    // fetch('/api/save-priorities', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(order)
    // });
  });
  
  // Инициализация
  renderPriorities();
});
