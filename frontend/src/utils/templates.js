const TEMPLATE_KEY = "field_templates";

export function saveTemplate(name, fields) {
  const all = getAllTemplates();
  all[name] = fields;
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(all));
}

export function getAllTemplates() {
  return JSON.parse(localStorage.getItem(TEMPLATE_KEY)) || {};
}

export function deleteTemplate(name) {
  const all = getAllTemplates();
  delete all[name];
  localStorage.setItem(TEMPLATE_KEY, JSON.stringify(all));
}
