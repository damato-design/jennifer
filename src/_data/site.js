const url = process.env.ELEVENTY_ENV === 'dev'
  ? 'http://localhost:8080'
  : 'https://jennifer.damato.design';

module.exports = {
  url,
  title: "Jennifer Ip D'Amato",
  navigation: {
    work: '/',
    about: '/about',
    resume: '/jipdamato_resume.pdf',
    contact: 'https://cal.com/jennifer-damato',
  },
}
