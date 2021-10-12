import React from 'react'
import styles from '../css/Footer.module.css'

const Footer = () => (
  <div className={styles.main}>
    Artist Info is a sample app, written to demonstrate deployment using AWS App
    Runner. It uses <a href="https://vitejs.dev/">vite</a> and{' '}
    <a href="https://reactjs.org/">React</a>. Functionally, it uses Musicbrainz API to find info and links for any
    musical artist known in its databases.
  </div>
)

export default Footer
