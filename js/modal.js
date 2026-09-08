'use strict';

function openMemo(memoId) {
  const memo = memos.find((item) => item.id === memoId);
  if (!memo) {
    return;
  }

  lastOpenedMemoId = memoId;
  exitEditMode();
  memoElements.detailHeading.textContent = memo.title;
  memoElements.detailTag.textContent = tagLabels[memo.tag];
  memoElements.detailDate.dateTime = memo.date;
  memoElements.detailDate.textContent = memo.date.replaceAll('-', '.');
  memoElements.detailBody.textContent = memo.content;
  memoElements.dialog.className = `memo-card--${memo.tag}`;
  memoElements.dialog.showModal();
}

function isEditingMemo() {
  return !memoElements.titleInput.hidden;
}

function enterEditMode(memo) {
  memoElements.detailHeading.hidden = true;
  memoElements.detailView.hidden = true;
  memoElements.detailBody.hidden = true;

  memoElements.titleInput.value = memo.title;
  memoElements.titleInput.hidden = false;

  memoElements.tagInput.value = memo.tag;
  memoElements.dateInput.value = memo.date;
  memoElements.editMeta.hidden = false;

  memoElements.contentInput.value = memo.content;
  memoElements.contentInput.hidden = false;

  memoElements.editButton.setAttribute('aria-label', '메모 저장');
}

function exitEditMode() {
  memoElements.detailHeading.hidden = false;
  memoElements.detailView.hidden = false;
  memoElements.detailBody.hidden = false;

  memoElements.titleInput.hidden = true;
  memoElements.editMeta.hidden = true;
  memoElements.contentInput.hidden = true;

  memoElements.editButton.setAttribute('aria-label', '메모 수정');
}

function toggleEditMemo() {
  const memo = memos.find((item) => item.id === lastOpenedMemoId);
  if (!memo) {
    return;
  }

  if (isEditingMemo()) {
    saveEditedMemo(memo);
  } else {
    enterEditMode(memo);
  }
}

function saveEditedMemo(memo) {
  const title = memoElements.titleInput.value.trim();
  if (!title) {
    memoElements.titleInput.focus();
    return;
  }

  const updatedMemo = {
    ...memo,
    title,
    tag: memoElements.tagInput.value,
    date: memoElements.dateInput.value,
    content: memoElements.contentInput.value.trim(),
  };

  memos = memos.map((item) => (item.id === memo.id ? updatedMemo : item));
  persistMemos();
  renderMemos();
  openMemo(memo.id);
}

function deleteMemo() {
  const memo = memos.find((item) => item.id === lastOpenedMemoId);
  if (!memo) {
    return;
  }

  const confirmed = confirm(`'${memo.title}' 메모를 삭제할까요?`);
  if (!confirmed) {
    return;
  }

  memos = memos.filter((item) => item.id !== memo.id);
  persistMemos();
  memoElements.dialog.close();
  renderMemos();
}

