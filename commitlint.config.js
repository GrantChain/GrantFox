module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'remove',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'change',
        'chore',
      ],
    ],
  },
}; 