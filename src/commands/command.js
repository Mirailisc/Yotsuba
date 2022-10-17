export const commands = [
  {
    name: 'setup',
    description: 'setup bot for the server (for server owner only)',
    options: [
      {
        name: 'welcome-channel',
        description: 'a channel that you want to greet someone',
        type: 7,
        required: true,
      },
      {
        name: 'introduce-channel',
        description: 'a channel that you want someone to introduce themselves',
        type: 7,
        required: true,
      },
      {
        name: 'join-role',
        description: 'a role that you want to give',
        type: 8,
        required: true,
      },
      {
        name: 'member-role',
        description: 'a role after introduced',
        type: 8,
        required: true,
      },
    ],
  },
  {
    name: 'call',
    description: 'call someone...',
    options: [
      {
        name: 'user',
        description: 'user that you wanted to call',
        type: 6,
        required: true,
      },
    ],
  },
  {
    name: 'introduction',
    description: 'introduce yourself',
  },
]
