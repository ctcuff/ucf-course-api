const BASE_URL =
  'https://centralflorida-prod.modolabs.net/student/course_search_prod'

/**
 * Takes a path and build a URL from that path appending
 * any optional query params if passed (note that all query
 * params will be encoded)
 *
 * @param {string} path
 * @param {Object<string, string | number>?} query
 */
const buildUrl = (path, query = {}) => {
  const params = new URLSearchParams()

  Object.keys(params).forEach(key => {
    params.set(key, encodeURIComponent(query[key]))
  })

  const search = params.toString()

  if (search) {
    return `${BASE_URL}${path}?${search}`
  }

  return `${BASE_URL}${path}`
}

const URLUtil = { buildUrl }

// ;(async function () {
//   try {
//     const url = buildUrl('/catalog', { area: 'COP' })
//     console.log(url)
//     // const data = await fetch(url)
//     // const html = await data.text()
//     // const $ = cheerio.load(html, null, false)

//     // const classList = $('ul#kgoui_Rcontent_I0_Rcontent_I0_Ritems')

//     // console.log(classList[0])
//   } catch (err) {
//     console.log(err)
//   }
// })()

export default URLUtil
