// STEP 1: Define your components here
const components = {
  "CWM_Button": ["button_copy", "button_link"],
  "CWM_Image": ["image_src_1", "image_alt_1", "image_link_1"],
  "CWM_BodyText": ["bodytext_copy"]
};

const componentSelect = document.getElementById("componentSelect");
const requiredFields = document.getElementById("requiredFields");
const optionalFields = document.getElementById("optionalFields");
const addOptionalBtn = document.getElementById("addOptional");
const generateBtn = document.getElementById("generate");
const output = document.getElementById("output");
const copyBtn = document.getElementById("copy");

let currentComponent = "";
let requiredInputs = {};
let optionalInputs = [];

// Populate dropdown
Object.keys(components).forEach(key => {
  const opt = document.createElement("option");
  opt.value = key;
  opt.textContent = key;
  componentSelect.appendChild(opt);
});

// Component selection change
componentSelect.addEventListener("change", () => {
  currentComponent = componentSelect.value;
  requiredInputs = {};
  requiredFields.innerHTML = "";
  generateBtn.disabled = true;

  if (currentComponent && components[currentComponent]) {
    components[currentComponent].forEach(variable => {
      const label = document.createElement("label");
      label.textContent = variable;
      const input = document.createElement("input");
      input.setAttribute("data-var", variable);
      input.addEventListener("input", updateRequiredInputs);
      requiredFields.appendChild(label);
      requiredFields.appendChild(input);
    });
  }
});

function updateRequiredInputs() {
  const inputs = requiredFields.querySelectorAll("input");
  let allFilled = true;
  requiredInputs = {};
  inputs.forEach(input => {
    const val = input.value.trim();
    const name = input.getAttribute("data-var");
    if (!val) {
      allFilled = false;
    } else {
      requiredInputs[name] = val;
    }
  });
  generateBtn.disabled = !allFilled;
}

// Add optional variable row
addOptionalBtn.addEventListener("click", () => {
  const wrapper = document.createElement("div");

  const nameInput = document.createElement("input");
  nameInput.placeholder = "Variable name";

  const valueInput = document.createElement("input");
  valueInput.placeholder = "Value";

  wrapper.appendChild(nameInput);
  wrapper.appendChild(valueInput);
  optionalFields.appendChild(wrapper);

  optionalInputs.push({ nameInput, valueInput });
});

// Generate Liquid
generateBtn.addEventListener("click", () => {
  let result = "";

  for (const [key, val] of Object.entries(requiredInputs)) {
    result += `{% assign ${key} = "${val}" %}\n`;
  }

  optionalInputs.forEach(({ nameInput, valueInput }) => {
    const name = nameInput.value.trim();
    const val = valueInput.value.trim();
    if (name && val && !(name in requiredInputs)) {
      result += `{% assign ${name} = "${val}" %}\n`;
    }
  });

  result += `{{content_blocks.\${${currentComponent}}}}`;
  output.value = result;
});

// Copy to clipboard
copyBtn.addEventListener("click", () => {
  output.select();
  document.execCommand("copy");
  copyBtn.textContent = "Copied!";
  setTimeout(() => copyBtn.textContent = "Copy to Clipboard", 1000);
});
