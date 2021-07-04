module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['static-cdn.jtvnw.net']
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    BASE_URL: process.env.BASE_URL,
  }
}
