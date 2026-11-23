// Busca por digitação nos dropdowns do respondente.
// O campo aparece quando a lista tem mais de SEARCH_MIN_OPTIONS opções visíveis.

export const SEARCH_MIN_OPTIONS = 10

// Texto puro, sem tags, sem acentos e em minúsculas: "São Jorge" -> "sao jorge".
export function normalizeText(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// O termo pode estar em qualquer parte do nome ("petr" acha "Jardim Petrópolis").
export function matchesSearch(optionName, term) {
  const t = normalizeText(term)
  return t === '' || normalizeText(optionName).includes(t)
}

const TEXTS = {
  pt: { placeholder: 'Digite para buscar…', empty: 'Nenhuma opção encontrada' },
  es: { placeholder: 'Escriba para buscar…', empty: 'Ninguna opción encontrada' },
  en: { placeholder: 'Type to search…', empty: 'No options found' },
}

// Idioma da pesquisa (?langc= ou <html lang>), senão o do aparelho.
export function searchTexts() {
  let lang = ''
  try {
    lang = new URLSearchParams(window.location.search).get('langc') || document.documentElement.lang || navigator.language || ''
  } catch (e) { /* sem window: usa inglês */ }
  const code = lang.trim().slice(0, 2).toLowerCase()
  return TEXTS[code] || TEXTS.en
}
