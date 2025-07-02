// 다크모드 토글 기능
document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const toggleIcon = document.querySelector(".toggle-icon");
  const body = document.body;

  // 로컬 스토리지에서 다크모드 상태 확인
  const isDarkMode = localStorage.getItem("darkMode") === "true";

  // 페이지 로드 시 저장된 상태 적용
  if (isDarkMode) {
    body.classList.add("dark-mode");
    toggleIcon.textContent = "☀️";
  }

  // 다크모드 토글 버튼 클릭 이벤트
  darkModeToggle.addEventListener("click", function () {
    // 다크모드 상태 토글
    body.classList.toggle("dark-mode");

    // 아이콘 변경
    if (body.classList.contains("dark-mode")) {
      toggleIcon.textContent = "☀️";
      localStorage.setItem("darkMode", "true");
    } else {
      toggleIcon.textContent = "🌙";
      localStorage.setItem("darkMode", "false");
    }

    // 부드러운 전환 효과
    body.style.transition = "all 0.3s ease";
  });

  // 시스템 다크모드 감지 (선택사항)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // 시스템 설정이 변경될 때 자동으로 적용 (선택사항)
    mediaQuery.addEventListener("change", function (e) {
      if (!localStorage.getItem("darkMode")) {
        // 사용자가 수동으로 설정하지 않은 경우에만
        if (e.matches) {
          body.classList.add("dark-mode");
          toggleIcon.textContent = "☀️";
        } else {
          body.classList.remove("dark-mode");
          toggleIcon.textContent = "🌙";
        }
      }
    });
  }
});

// 일기 저장 및 목록/상세 보기 기능
function getDiaries() {
  return JSON.parse(localStorage.getItem("diaries") || "[]");
}

function saveDiaries(diaries) {
  localStorage.setItem("diaries", JSON.stringify(diaries));
}

function renderDiaryList() {
  const diaryList = document.getElementById("diary-list");
  const diaries = getDiaries();
  diaryList.innerHTML = "";
  if (diaries.length === 0) {
    diaryList.innerHTML = "<li>저장된 일기가 없습니다.</li>";
    document.getElementById("diary-detail").style.display = "none";
    return;
  }
  diaries.forEach((diary, idx) => {
    const li = document.createElement("li");
    li.textContent = `${diary.date} - ${diary.title}`;
    li.style.cursor = "pointer";
    li.addEventListener("click", () => showDiaryDetail(idx));
    diaryList.appendChild(li);
  });
}

function showDiaryDetail(idx) {
  const diaries = getDiaries();
  const diary = diaries[idx];
  const detail = document.getElementById("diary-detail");
  detail.innerHTML = `
        <h4>${diary.title} <span style="font-size:0.9em;color:#888;">(${
    diary.date
  })</span></h4>
        <div style="margin-bottom:0.5em;">기분: ${getMoodEmoji(
          diary.mood
        )}</div>
        <pre style="white-space:pre-wrap;font-family:inherit;">${
          diary.content
        }</pre>
        <button id="close-detail" style="margin-top:1em;">닫기</button>
    `;
  detail.style.display = "block";
  document.getElementById("close-detail").onclick = () => {
    detail.style.display = "none";
  };
}

function getMoodEmoji(mood) {
  switch (mood) {
    case "happy":
      return "😊 행복";
    case "excited":
      return "🤩 신남";
    case "normal":
      return "😐 보통";
    case "tired":
      return "😴 피곤";
    case "frustrated":
      return "😤 답답";
    default:
      return "";
  }
}

// 폼 제출 이벤트 (저장 후 목록 페이지로 이동)
const diaryForm = document.querySelector(".diary-form");
diaryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const date = document.getElementById("date").value;
  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();
  const mood = document.getElementById("mood").value;
  if (!date || !title || !content) return;
  const diaries = getDiaries();
  diaries.unshift({ date, title, content, mood }); // 최신순
  saveDiaries(diaries);
  diaryForm.reset();
  showSection("list"); // 저장 후 목록으로 이동
});

// 페이지 전환 기능
const navLinks = document.querySelectorAll("nav a");
const sections = {
  home: document.getElementById("home-section"),
  write: document.getElementById("write-section"),
  list: document.getElementById("list-section"),
};

function showSection(section) {
  Object.values(sections).forEach((sec) => (sec.style.display = "none"));
  sections[section].style.display = "block";
  // 네비게이션 active 표시
  navLinks.forEach((link) => link.classList.remove("active"));
  const navMap = { home: 0, write: 1, list: 2 };
  navLinks[navMap[section]].classList.add("active");
  // 목록 진입 시 목록 렌더링
  if (section === "list") renderDiaryList();
}

navLinks[0].addEventListener("click", (e) => {
  e.preventDefault();
  showSection("home");
});
navLinks[1].addEventListener("click", (e) => {
  e.preventDefault();
  showSection("write");
});
navLinks[2].addEventListener("click", (e) => {
  e.preventDefault();
  showSection("list");
});

// 폰트 크기 조절 기능
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 28;
const DEFAULT_FONT_SIZE = 16;

function setFontSize(size) {
  document.body.style.fontSize = size + "px";
  localStorage.setItem("fontSize", size);
}

function getFontSize() {
  return parseInt(localStorage.getItem("fontSize")) || DEFAULT_FONT_SIZE;
}

function applyFontSize() {
  setFontSize(getFontSize());
}

document.getElementById("increaseFont").addEventListener("click", function () {
  let size = getFontSize();
  if (size < MAX_FONT_SIZE) {
    setFontSize(size + 2);
  }
});

document.getElementById("decreaseFont").addEventListener("click", function () {
  let size = getFontSize();
  if (size > MIN_FONT_SIZE) {
    setFontSize(size - 2);
  }
});

window.addEventListener("DOMContentLoaded", function () {
  showSection("home");
  applyFontSize();
});
