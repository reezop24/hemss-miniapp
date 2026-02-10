<script>
/* =========================
   GLOBAL NAME SET
   ========================= */

const NAME_SET = [
  "Ahmad Zaki",
  "Siti Aisyah",
  "Norhafizah",
  "Muhammad Aiman",
  "Nur Syuhada",
  "Faizal Hakim",
  "Nurul Iman",
  "Hafiz Rahman",
  "Aina Sofia",
  "Daniel Akmal"
];

// init search box
function initNameSearch(input) {
  const listId = "nameset-list";

  if (!document.getElementById(listId)) {
    const datalist = document.createElement("datalist");
    datalist.id = listId;
    NAMESET.forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      datalist.appendChild(opt);
    });
    document.body.appendChild(datalist);
  }

  input.setAttribute("list", listId);
}
</script>
