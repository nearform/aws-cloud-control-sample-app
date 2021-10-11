import styles from '../css/Artist.module.css'

function ArtistInfo({ artistMeta }) {
  return artistMeta === 'none' ? (
    <div>Couldn't get info for this artist. Sorry!</div>
  ) : (
    <div>
      <h2>{artistMeta.name}</h2>
      <p className={styles.item}>
        <span className={styles.field}>Type</span>
        <br />
        {artistMeta.type}
      </p>
      <p className={styles.item}>
        <span className={styles.field}>From</span>
        <br />
        {artistMeta.country}
      </p>
      <p className={styles.item}>
        <span className={styles.field}>Genre</span>
        <br />
        {artistMeta.disambiguation}
      </p>
      <h3>Links</h3>
      <div className={styles.links}>
        {artistMeta.urls.map((link) => (
          <div key={link.url} className={styles.link}>
            <a href={link.url} target="_new">
              {link.type}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistInfo
