'use strict';

let memos = (loadStoredMemos() ?? sampleMemos).map((memo) => ({ ...memo }));
let searchQuery = '';
let selectedTag = 'all';
let lastOpenedMemoId = null;

const tagLabels = {
  daily: 'Daily',
  work: 'Work',
  others: 'Others',
};

const memoElements = {
  pinnedSection: document.querySelector('#pinned-section'),
  regularSection: document.querySelector('#regular-section'),
  pinnedList: document.querySelector('#pinned-list'),
  memoList: document.querySelector('#memo-list'),
  emptyState: document.querySelector('#empty-state'),
  noResults: document.querySelector('#no-results'),
  searchForm: document.querySelector('#search-form'),
  searchInput: document.querySelector('#search-input'),
  tagSelect: document.querySelector('#tag-select'),
  dialog: document.querySelector('#memo-dialog'),
  detailHeading: document.querySelector('#memo-detail-heading'),
  detailTag: document.querySelector('#memo-detail-tag'),
  detailDate: document.querySelector('#memo-detail-date'),
  detailBody: document.querySelector('#memo-detail-body'),
  detailView: document.querySelector('#memo-detail-view'),
  titleInput: document.querySelector('#memo-title-input'),
  editMeta: document.querySelector('#memo-edit-meta'),
  tagInput: document.querySelector('#memo-tag-input'),
  dateInput: document.querySelector('#memo-date-input'),
  contentInput: document.querySelector('#memo-content-input'),
  editButton: document.querySelector('#edit-button'),
  deleteButton: document.querySelector('#delete-button'),
};

function persistMemos() {
  saveMemosToStorage(memos);
}

function createMemoCard(memo) {
  const { id, title, content, tag, date, isPinned } = memo;

  const item = document.createElement('li');
  item.className = `memo-card memo-card--${tag}`;
  item.dataset.id = id;

  const article = document.createElement('article');
  article.className = 'memo-card-content';

  const header = document.createElement('header');
  header.className = 'memo-card-header';

  const heading = document.createElement('h4');
  heading.className = 'memo-card-title';
  const detailButton = document.createElement('button');
  detailButton.type = 'button';
  detailButton.className = 'memo-open-button';
  detailButton.textContent = title;
  detailButton.setAttribute('aria-haspopup', 'dialog');
  heading.appendChild(detailButton);

  const pinButton = document.createElement('button');
  pinButton.type = 'button';
  pinButton.className = 'pin-button';

  if (isPinned) {
    pinButton.setAttribute('aria-label', `${title} 고정 해제`);
  } else {
    pinButton.setAttribute('aria-label', `${title} 고정`);
  }
  pinButton.setAttribute('aria-pressed', String(isPinned));
  pinButton.classList.toggle('is-pinned', isPinned);

  const preview = document.createElement('p');
  preview.className = 'memo-card-preview';
  preview.textContent = content;

  const footer = document.createElement('footer');
  footer.className = 'memo-card-footer';

  const tagLabel = document.createElement('span');
  tagLabel.textContent = tagLabels[tag];

  const dateLabel = document.createElement('time');
  dateLabel.dateTime = date;
  dateLabel.textContent = date.replaceAll('-', '.');

  header.appendChild(heading);
  header.appendChild(pinButton);
  footer.appendChild(tagLabel);
  footer.appendChild(dateLabel);
  article.appendChild(header);
  article.appendChild(preview);
  article.appendChild(footer);
  item.appendChild(article);

  pinButton.addEventListener('click', (event) => {
    event.stopPropagation();
    togglePin(id);
    const updatedCard = document.querySelector(`[data-id="${id}"]`);
    if (updatedCard) {
      const updatedPinButton = updatedCard.querySelector('.pin-button');
      updatedPinButton.focus();
    }
  });
  item.addEventListener('click', () => {
    openMemo(id);
  });

  return item;
}

function renderMemos() {
  const visibleMemos = getVisibleMemos();
  const pinnedMemos = visibleMemos.filter((memo) => memo.isPinned);
  const regularMemos = visibleMemos.filter((memo) => !memo.isPinned);

  memoElements.pinnedList.textContent = '';
  memoElements.memoList.textContent = '';

  pinnedMemos.forEach((memo) => {
    memoElements.pinnedList.appendChild(createMemoCard(memo));
  });
  regularMemos.forEach((memo) => {
    memoElements.memoList.appendChild(createMemoCard(memo));
  });

  memoElements.pinnedSection.hidden = pinnedMemos.length === 0;
  memoElements.regularSection.hidden = regularMemos.length === 0;
  memoElements.emptyState.hidden = memos.length > 0;
  memoElements.noResults.hidden = memos.length === 0 || visibleMemos.length > 0;
  document.body.classList.toggle('has-memos', memos.length > 0);
  memoElements.tagSelect.dataset.tag = selectedTag;
  memoElements.tagSelect.parentElement.dataset.tag = selectedTag;
}

function getVisibleMemos() {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return memos.filter((memo) => {
    const matchesTag = selectedTag === 'all' || memo.tag === selectedTag;
    const memoText = `${memo.title} ${memo.content}`.toLowerCase();
    const matchesQuery = memoText.includes(normalizedQuery);
    return matchesTag && matchesQuery;
  });
}

function togglePin(memoId) {
  memos = memos.map((memo) => {
    if (memo.id === memoId) {
      return { ...memo, isPinned: !memo.isPinned };
    }
    return memo;
  });
  persistMemos();
  renderMemos();
}

