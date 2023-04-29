const withWTM = require('next-transpile-modules')([
  '@stripe/firestore-stripe-payments'
])

const nextConfig = withWTM({
    images: {
      domains: ['image.tmdb.org']
    }
  }
)

module.exports = nextConfig
