module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['static-cdn.jtvnw.net']
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    BASE_URL: process.env.BASE_URL,
  }
}
