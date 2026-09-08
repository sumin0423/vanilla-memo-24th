'use strict';

function openMemo(memoId) {
  const memo = memos.find((item) => item.id === memoId);
  if (!memo) {
    return;
  }

  lastOpenedMemoId = memoId;
  memoElements.detailHeading.textContent = memo.title;
  memoElements.detailTag.textContent = tagLabels[memo.tag];
  memoElements.detailDate.dateTime = memo.date;
  memoElements.detailDate.textContent = memo.date.replaceAll('-', '.');
  memoElements.detailBody.textContent = memo.content;
  memoElements.dialog.className = `memo-card--${memo.tag}`;
  memoElements.dialog.showModal();
}

