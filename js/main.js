'use strict';

memoElements.searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  searchQuery = memoElements.searchInput.value;
  renderMemos();
});

memoElements.searchInput.addEventListener('input', (event) => {
  searchQuery = event.target.value;
  renderMemos();
});

memoElements.tagSelect.addEventListener('change', (event) => {
  selectedTag = event.target.value;
  renderMemos();
});

memoElements.editButton.addEventListener('click', () => {
  toggleEditMemo();
});

memoElements.deleteButton.addEventListener('click', () => {
  deleteMemo();
});

memoElements.dialog.addEventListener('close', () => {
  exitEditMode();
  const card = document.querySelector(`[data-id="${lastOpenedMemoId}"]`);
  if (card) {
    const detailButton = card.querySelector('.memo-open-button');
    detailButton.focus();
  }
});

renderMemos();
