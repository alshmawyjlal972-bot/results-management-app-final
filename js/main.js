class Student {
  #grades;
  #attendance;

  constructor(name, grades, attendance) {
    if (!name || name.trim() === "") {
      throw new Error("اسم الطالب لا يمكن أن يكون فارغاً!");
    }
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }

  set grades(value) {
    if (!value || value.length === 0) {
      throw new Error("يجب إدخال جميع الدرجات!");
    }
    for (let g of value) {
      if (g === "" || g === null || isNaN(g)) {
        throw new Error("لا تترك أي درجة فارغة!");
      }
      if (g < 0 || g > 100) {
        throw new Error("الدرجة يجب أن تكون بين 0 و 100!");
      }
    }
    this.#grades = value.map(Number);
  }

  get grades() { return this.#grades; }

  set attendance(value) {
    if (value === "" || value === null || isNaN(value)) {
      throw new Error("نسبة الحضور لا يمكن أن تكون فارغة!");
    }
    if (value < 0 || value > 100) {
      throw new Error("نسبة الحضور يجب أن تكون بين 0 و 100!");
    }
    this.#attendance = Number(value);
  }

  get attendance() { return this.#attendance; }

  getAverage() {
    let sum = this.#grades.reduce((acc, g) => acc + g, 0);
    return sum / this.#grades.length;
  }
}

let studentsList = [];

const nameInput = document.getElementById("studentName");
const g1Input = document.getElementById("grade1");
const g2Input = document.getElementById("grade2");
const g3Input = document.getElementById("grade3");
const attendanceInput = document.getElementById("attendance");
const addBtn = document.getElementById("addBtn");
const mercyBtn = document.getElementById("mercyBtn");
const errorBox = document.getElementById("errorBox");
const studentsListDiv = document.getElementById("studentsListDiv");
const reportDiv = document.getElementById("reportDiv");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.remove("d-none");
}

function hideError() {
  errorBox.classList.add("d-none");
  errorBox.textContent = "";
}

addBtn.onclick = function () {
  try {
    hideError();
    const newStudent = new Student(
      nameInput.value,
      [g1Input.value, g2Input.value, g3Input.value],
      attendanceInput.value
    );
    studentsList.push(newStudent);
    if (studentsList.length === 1) studentsListDiv.innerHTML = "";
    studentsListDiv.innerHTML += `
      <div class="alert alert-success">
        ✅ ${newStudent.name} - المتوسط: ${newStudent.getAverage().toFixed(2)} - الحضور: ${newStudent.attendance}%
      </div>
    `;
    nameInput.value = "";
    g1Input.value = "";
    g2Input.value = "";
    g3Input.value = "";
    attendanceInput.value = "";
  } catch (error) {
    showError("⚠️ " + error.message);
  }
};

mercyBtn.onclick = function () {
  const struggling = studentsList.filter(s => {
    let avg = s.getAverage();
    return avg >= 40 && avg <= 49;
  });

  const afterMercy = struggling.map(s => ({
    name: s.name,
    oldAvg: s.getAverage(),
    newAvg: s.getAverage() + 5
  }));

  let generalAvg = 0;
  if (afterMercy.length > 0) {
    let total = afterMercy.reduce((acc, s) => acc + s.newAvg, 0);
    generalAvg = total / afterMercy.length;
  }

  if (afterMercy.length === 0) {
    reportDiv.innerHTML = `<div class="alert alert-info">لا يوجد طلاب متعثرين يحتاجون رأفة.</div>`;
    return;
  }

  let namesList = afterMercy.map(s => `<li>${s.name} - من ${s.oldAvg.toFixed(2)} إلى ${s.newAvg.toFixed(2)}</li>`).join("");

  reportDiv.innerHTML = `
    <div class="alert alert-warning">
      <h5>📋 تقرير لجنة الرأفة</h5>
      <p><b>عدد الطلاب المتعثرين:</b> ${afterMercy.length}</p>
      <p><b>أسمائهم:</b></p>
      <ul>${namesList}</ul>
      <hr>
      <h6>المتوسط العام بعد الرأفة: ${generalAvg.toFixed(2)}</h6>
    </div>
  `;
};
