// Данные приоритетов (можно изменить)
const priorities = [
  { id: 6, text: "понимать что происходит", value: 0 },
  { id: 7, text: "новых гениальных идей", value: 0 },
  { id: 8, text: "спасти этот мир, и чтобы никто не ушел обиженным", value: 0 },
  { id: 5, text: "свободы и самостоятельности", value: 0 },
  { id: 1, text: "удовольствия и комфорта", value: 0 },
  { id: 2, text: "быть среди своих", value: 0 },
  { id: 3, text: "победить, быть первым", value: 0 },
  { id: 4, text: "справедливости и порядка", value: 0 }
];

const REQUIRED_SUM = 100; // Требуемая сумма в процентах

let draggedElement = null;
let draggedIndex = null;

document.addEventListener('DOMContentLoaded', function() {
  const prioritiesList = document.getElementById('priorities-list');
  const saveButton = document.getElementById('save-button');
  const errorMessage = document.getElementById('error-message');
  
  // Инициализация списка приоритетов
  function renderPriorities() {
    prioritiesList.innerHTML = '';
    priorities.forEach((priority, index) => {
      const item = createPriorityItem(priority, index);
      prioritiesList.appendChild(item);
    });
    validateSum();
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
      <div class="priority-input-wrapper">
        <input type="number" 
               class="priority-input" 
               min="0" 
               max="100" 
               value="${priority.value || ''}" 
               data-id="${priority.id}"
               placeholder="0">
        <span class="percent-sign">%</span>
      </div>
      <div class="drag-handle">⋮⋮</div>
    `;
    
    // Обработчик ввода числа
    const input = item.querySelector('.priority-input');
    input.addEventListener('input', function() {
      const value = parseFloat(this.value) || 0;
      // Ограничиваем значение максимумом 100
      const clampedValue = Math.min(100, Math.max(0, value));
      if (clampedValue !== value) {
        this.value = clampedValue;
      }
      
      const priorityId = parseInt(this.dataset.id);
      const priority = priorities.find(p => p.id === priorityId);
      if (priority) {
        priority.value = clampedValue;
      }
      
      // Только обновляем валидацию суммы, без сортировки
      validateSum();
    });
    
    // Обработчики событий drag and drop
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('drop', handleDrop);
    
    return item;
  }
  
  // Сортировка по убыванию процентов
  function sortByValueDescending() {
    priorities.sort((a, b) => {
      const valueA = a.value || 0;
      const valueB = b.value || 0;
      // Сначала по убыванию значения, если значения равны - сохраняем порядок по id
      if (valueB !== valueA) {
        return valueB - valueA;
      }
      return a.id - b.id;
    });
  }
  
  // Проверка, отсортирован ли список по убыванию
  function isSortedByDescending() {
    for (let i = 0; i < priorities.length - 1; i++) {
      const current = priorities[i].value || 0;
      const next = priorities[i + 1].value || 0;
      if (current < next) {
        return false;
      }
    }
    return true;
  }
  
  // Подсчет суммы всех значений
  function calculateSum() {
    return priorities.reduce((sum, priority) => sum + (priority.value || 0), 0);
  }
  
  // Валидация суммы
  function validateSum() {
    const sum = calculateSum();
    const isValid = sum === REQUIRED_SUM;
    
    if (errorMessage) {
      if (isValid) {
        errorMessage.style.display = 'none';
      } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = `Сумма должна быть равна ${REQUIRED_SUM}%. Текущая сумма: ${sum}%`;
      }
    }
    
    if (saveButton) {
      saveButton.disabled = !isValid;
    }
    
    return isValid;
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
      
      // Перерисовываем список без сортировки
      renderPriorities();
    }
    
    this.classList.remove('drag-over');
    return false;
  }
  
  // Обработчик сохранения порядка
  saveButton.addEventListener('click', function() {
    // Проверяем сумму - кнопка активна только если сумма равна 100%
    if (!validateSum()) {
      return;
    }
    
    // Принудительно сортируем по убыванию перед сохранением
    sortByValueDescending();
    renderPriorities();
    
    const order = priorities.map((p, index) => ({
      position: index + 1,
      id: p.id,
      text: p.text,
      value: p.value || 0
    }));
    
    console.log('Порядок приоритетов:', order);
    console.log('Сумма:', calculateSum());
    
    alert('Порядок приоритетов сохранен!\n\n' + 
          order.map((item, index) => `${index + 1}. ${item.text} - ${item.value}%`).join('\n') +
          `\n\nОбщая сумма: ${calculateSum()}%`);
    
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
