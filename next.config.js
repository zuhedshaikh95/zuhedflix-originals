// const withWTM = require('next-transpile-modules')([
//   '@stripe/firestore-stripe-payments'
// ])

const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  transpilePackages: ['@stripe/firestore-stripe-payments']
}

module.exports = nextConfig
