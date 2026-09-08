'use strict';

const MEMO_STORAGE_KEY = 'vanilla-memo:memos';

function loadStoredMemos() {
  try {
    const raw = localStorage.getItem(MEMO_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.warn('저장된 메모를 불러오지 못했습니다.', error);
    return null;
  }
}

function saveMemosToStorage(memoList) {
  try {
    localStorage.setItem(MEMO_STORAGE_KEY, JSON.stringify(memoList));
  } catch (error) {
    console.warn('메모를 저장하지 못했습니다.', error);
  }
}
