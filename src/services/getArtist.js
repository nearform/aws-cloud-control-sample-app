import axios from 'axios'

async function lookupArtist(artist) {
  const query = `https://musicbrainz.org/ws/2/artist/?fmt=json&query=${artist}`
  const response = await axios.get(query)
  if (response?.data?.artists?.length) {
    return response.data.artists[0].id
  } else {
    throw 'No artists'
  }
}

async function fetchArtist(id) {
  const query = `https://musicbrainz.org/ws/2/artist/${id}?inc=url-rels`
  const response = await axios.get(query)
  if (response?.data?.relations) {
    return response.data
  } else {
    throw 'none'
  }
}

async function getArtist(artist) {
  try {
    const artistId = await lookupArtist(artist)
    const artistData = await fetchArtist(artistId)
    const { name, type, country, disambiguation, relations = [] } = artistData
    let urls = relations
      .filter((relation) => relation.url)
      .map((relation) => ({ type: relation.type, url: relation.url.resource }))
    return { name, type, country, disambiguation, urls }
  } catch (e) {
    console.error(e)
    return 'none'
  }
  return JSON.stringify(artistList)
}
export default getArtist
