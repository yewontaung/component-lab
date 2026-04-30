const tailwindjs = "https://cdn.tailwindcss.com"
const bootstrapcss = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
const bootstrapjs = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"

export const tailwindLink = `
    <script src="${tailwindjs}"></script>
`

export const bootstrapLink = `
    <link href="${bootstrapcss}" rel="stylesheet">
    <script src="${bootstrapjs}"></script>
`